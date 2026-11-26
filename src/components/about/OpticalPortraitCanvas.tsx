"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/cn";
import { motionState } from "@/lib/motion-store";
import type { Locale } from "@/types/portfolio";

interface OpticalPortraitCanvasProps {
  src?: string;
  alt?: string;
  locale: Locale;
  caption?: string;
  className?: string;
  /** Trigger aperture reveal immediately on mount (for above-the-fold Hero on /about) */
  immediate?: boolean;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uHover;
  uniform float uReveal;
  uniform float uScrollShift;
  uniform vec2 uClickOrigin;
  uniform float uColorIris;
  uniform float uTime;

  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 computeCoverUv(vec2 uv, float planeAspect, float imageAspect, float zoom, float scrollShift) {
    // Anchor gently toward upper-center (focalY = 0.56 in GL bottom-up UV) so portrait head/torso balance cleanly
    vec2 pivot = vec2(0.5, 0.58);
    vec2 centered = (uv - pivot) / zoom;

    if (planeAspect > imageAspect) {
      centered.y *= imageAspect / planeAspect;
    } else {
      centered.x *= planeAspect / imageAspect;
    }

    vec2 mapped = centered + pivot;
    mapped.y += scrollShift;
    return clamp(mapped, vec2(0.002), vec2(0.998));
  }

  // Leica silver-gelatin warm monochrome grading matching #F5F4F0 Paper x #0D0D0D Ink
  vec3 gradeMonochrome(vec3 col, vec2 uv) {
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    // Sculpted darkroom S-curve with rich matte blacks and luminous alabaster highlights
    float curved = mix(lum, smoothstep(0.05, 0.96, lum), 0.52);
    vec3 warmTone = vec3(curved) * vec3(1.015, 1.002, 0.965);
    // Subtle darkroom edge vignette
    float vig = 1.0 - smoothstep(0.45, 1.15, length((uv - 0.5) * vec2(1.0, 1.15))) * 0.14;
    return warmTone * vig;
  }

  // Refined natural warm editorial color grading (calms saturation slightly so it feels art-directed)
  vec3 gradeEditorialColor(vec3 col) {
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 balanced = mix(vec3(lum), col, 0.92);
    // Gentle micro-contrast lift
    balanced = mix(balanced, smoothstep(0.02, 0.98, balanced), 0.18);
    return balanced;
  }

  void main() {
    float planeAspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 aspectVec = vec2(planeAspect, 1.0);

    // Subtle aperture settle zoom + inner parallax
    float zoom = mix(1.13, 1.055, uReveal);

    // Aspect-corrected vector from pixel to spring-smoothed optical loupe center
    vec2 toCursor = (vUv - uMouse) * aspectVec;
    float dist = length(toCursor);

    // Loupe breathes subtly wider with pointer momentum
    float velMag = length(uVelocity);
    float radius = mix(0.24, 0.32, clamp(velMag * 5.2, 0.0, 1.0));

    // Feathered optical color aperture mask
    float lensMask = (1.0 - smoothstep(radius * 0.36, radius, dist)) * uHover;

    // Delicate physical bevel halo right near the rim of the glass loupe
    float rimRing = exp(-pow((dist - radius * 0.84) / 0.045, 2.0)) * uHover;

    // Ultra-restrained convex glass magnification (~2.2%) + silky velocity glass refraction
    vec2 dir = dist > 0.0001 ? (toCursor / dist) : vec2(0.0);
    vec2 convexOffset = -dir * (dist * 0.058 * lensMask);
    vec2 velocityRefract = -uVelocity * (0.048 * lensMask);
    vec2 refractedUv = vUv + (convexOffset + velocityRefract) / aspectVec;

    vec2 baseUv = computeCoverUv(refractedUv, planeAspect, uImageAspect, zoom, uScrollShift);

    // Whisper-thin optical chromatic edge dispersion strictly on the glass rim
    vec2 disp = (dir * 0.0022 * rimRing) / aspectVec;
    vec3 rawColor;
    rawColor.r = texture2D(uTexture, clamp(baseUv + disp, 0.002, 0.998)).r;
    rawColor.g = texture2D(uTexture, baseUv).g;
    rawColor.b = texture2D(uTexture, clamp(baseUv - disp, 0.002, 0.998)).b;

    vec3 mono = gradeMonochrome(rawColor, vUv);
    vec3 naturalCol = gradeEditorialColor(rawColor);

    // Radial click-to-toggle full color iris expanding organically from exact click point
    float clickDist = length((vUv - uClickOrigin) * aspectVec);
    float maxIrisRadius = 1.65;
    float irisRadius = uColorIris * maxIrisRadius;
    float irisMask = 1.0 - smoothstep(max(0.0, irisRadius - 0.16), irisRadius + 0.02, clickDist);
    irisMask *= smoothstep(0.001, 0.06, uColorIris);

    float colorBlend = clamp(max(lensMask, irisMask), 0.0, 1.0);
    vec3 finalColor = mix(mono, naturalCol, colorBlend);

    // Subtle upper-left specular studio glint grazing the optical loupe bevel
    float glintAngle = clamp(dot(normalize(toCursor + vec2(0.0001)), normalize(vec2(-0.65, 0.75))), 0.0, 1.0);
    finalColor += vec3(0.045, 0.043, 0.038) * rimRing * (0.45 + 0.55 * glintAngle);

    // Fine 35mm darkroom silver grain (stronger in monochrome, cleaner inside color loupe)
    float grain = (hash12(gl_FragCoord.xy + fract(uTime) * 60.0) - 0.5) * mix(0.032, 0.014, colorBlend);
    finalColor += grain;

    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
  }
`;

/**
 * Interactive WebGL Portrait — "Optical Darkroom Loupe" (0% GPU Auto-Sleep).
 * - Resting: Calm Leica silver-gelatin monochrome seamlessly paired with #F5F4F0 Paper.
 * - Hover (Desktop): Cursor drives a feathered warm color-aperture loupe + ultra-restrained
 *   liquid-glass refraction & subtle specular bevel glint.
 * - Click / Mobile Tap: Radial iris smoothly locks/unlocks full natural warm color.
 * - SEO & LCP First: Real semantic `<img>` sits underneath for instant first paint & Google Images indexing.
 */
export function OpticalPortraitCanvas({
  src = "/images/danu-candra-saputra-fullstack-developer.webp",
  alt = "Danu Candra Saputra — Fullstack Web Developer",
  locale,
  caption,
  className,
  immediate = false,
}: OpticalPortraitCanvasProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  const [revealed, setRevealed] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [colorLocked, setColorLocked] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Mutable optical state shared between DOM events and GPU demand loop (0 React re-renders!)
  const opticalRef = useRef({
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    mouseX: 0.5,
    mouseY: 0.5,
    velX: 0,
    velY: 0,
    targetHover: 0,
    hover: 0,
    targetIris: 0,
    iris: 0,
    clickX: 0.5,
    clickY: 0.5,
    reveal: 0,
    scrollShift: 0,
    targetScrollShift: 0,
    inView: true,
    wake: () => { },
  });

  // 1. Aperture entrance reveal via IntersectionObserver (or immediate mount)
  useEffect(() => {
    if (immediate) {
      const raf = requestAnimationFrame(() => {
        setRevealed(true);
        opticalRef.current.wake();
      });
      return () => cancelAnimationFrame(raf);
    }

    const host = frameRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          opticalRef.current.inView = entry.isIntersecting;
          if (entry.isIntersecting) {
            setRevealed(true);
            opticalRef.current.wake();
          }
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [immediate]);

  // Sync click-toggle target iris cleanly into shader state
  useEffect(() => {
    opticalRef.current.targetIris = colorLocked ? 1 : 0;
    opticalRef.current.wake();
  }, [colorLocked]);

  // 2. Demand-driven WebGL Optical Loupe renderer (strictly auto-sleeps at 0% GPU!)
  useEffect(() => {
    const host = canvasHostRef.current;
    const frame = frameRef.current;
    const opticalState = opticalRef.current;
    if (!host || !frame) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // Graceful fallback to semantic <img> beneath
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: 0.75 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uReveal: { value: 0 },
      uScrollShift: { value: 0 },
      uClickOrigin: { value: new THREE.Vector2(0.5, 0.5) },
      uColorIris: { value: 0 },
      uTime: { value: 0 },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let disposed = false;
    let rafId = 0;
    let running = false;
    let textureLoaded = false;
    let lastNow = performance.now();

    const syncSize = () => {
      if (disposed) return;
      const w = Math.max(host.clientWidth, 1);
      const h = Math.max(host.clientHeight, 1);
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };

    syncSize();

    const updateScrollTarget = () => {
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const offset = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
      opticalRef.current.targetScrollShift = Math.max(
        -0.036,
        Math.min(0.036, offset * 0.048)
      );
    };

    const tick = (now: number) => {
      rafId = 0;
      if (disposed || !textureLoaded) {
        running = false;
        return;
      }

      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      const st = opticalRef.current;

      updateScrollTarget();

      // Weighted spring smoothing for cursor position & momentum velocity
      const prevX = st.mouseX;
      const prevY = st.mouseY;
      const followK = 1 - Math.exp(-dt * 11.5);
      st.mouseX += (st.targetMouseX - st.mouseX) * followK;
      st.mouseY += (st.targetMouseY - st.mouseY) * followK;

      const rawVx = (st.mouseX - prevX) / Math.max(dt, 0.008);
      const rawVy = (st.mouseY - prevY) / Math.max(dt, 0.008);
      const velK = 1 - Math.exp(-dt * 9.0);
      st.velX += (Math.max(-1.6, Math.min(1.6, rawVx * 0.14)) - st.velX) * velK;
      st.velY += (Math.max(-1.6, Math.min(1.6, rawVy * 0.14)) - st.velY) * velK;

      const hoverK = 1 - Math.exp(-dt * 6.5);
      st.hover += (st.targetHover - st.hover) * hoverK;

      const irisK = 1 - Math.exp(-dt * 4.4);
      st.iris += (st.targetIris - st.iris) * irisK;

      const revealTarget = 1;
      const revealK = 1 - Math.exp(-dt * 3.8);
      st.reveal += (revealTarget - st.reveal) * revealK;

      const scrollK = 1 - Math.exp(-dt * 8.0);
      st.scrollShift += (st.targetScrollShift - st.scrollShift) * scrollK;

      uniforms.uMouse.value.set(st.mouseX, st.mouseY);
      uniforms.uVelocity.value.set(st.velX, st.velY);
      uniforms.uHover.value = st.hover;
      uniforms.uReveal.value = st.reveal;
      uniforms.uScrollShift.value = st.scrollShift;
      uniforms.uClickOrigin.value.set(st.clickX, st.clickY);
      uniforms.uColorIris.value = st.iris;
      uniforms.uTime.value = now * 0.001;

      renderer.render(scene, camera);

      // Strict GPU Auto-Sleep Check: stop loop completely when settled!
      const isSettled =
        Math.abs(st.targetHover - st.hover) < 0.002 &&
        Math.abs(st.targetIris - st.iris) < 0.002 &&
        Math.abs(revealTarget - st.reveal) < 0.002 &&
        Math.abs(st.targetMouseX - st.mouseX) < 0.0008 &&
        Math.abs(st.targetMouseY - st.mouseY) < 0.0008 &&
        Math.abs(st.velX) < 0.001 &&
        Math.abs(st.velY) < 0.001 &&
        Math.abs(st.targetScrollShift - st.scrollShift) < 0.0005 &&
        Math.abs(motionState.smoothVelocity) < 0.05;

      if (!isSettled && st.inView) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (disposed || !textureLoaded || running) return;
      running = true;
      lastNow = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    opticalRef.current.wake = wake;

    // Load portrait texture cleanly with CORS support (ready for Phase-2 CDN/storage uploads)
    let loadedTexture: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(src, (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      loadedTexture = tex;
      uniforms.uTexture.value = tex;

      const img = tex.image as { naturalWidth?: number; naturalHeight?: number } | undefined;
      if (img?.naturalWidth && img?.naturalHeight) {
        uniforms.uImageAspect.value = img.naturalWidth / img.naturalHeight;
      }

      textureLoaded = true;
      setWebglReady(true);
      wake();
    });

    const onScroll = () => {
      if (opticalRef.current.inView) wake();
    };

    const ro = new ResizeObserver(() => {
      syncSize();
      wake();
    });
    ro.observe(host);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      opticalState.wake = () => { };
      geometry.dispose();
      material.dispose();
      if (loadedTexture) loadedTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  const toNormalizedUv = (clientX: number, clientY: number) => {
    const el = frameRef.current;
    if (!el) return { u: 0.5, v: 0.5 };
    const rect = el.getBoundingClientRect();
    const u = Math.min(Math.max((clientX - rect.left) / Math.max(rect.width, 1), 0), 1);
    const v = 1 - Math.min(Math.max((clientY - rect.top) / Math.max(rect.height, 1), 0), 1);
    return { u, v };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const { u, v } = toNormalizedUv(e.clientX, e.clientY);
    const st = opticalRef.current;
    st.targetMouseX = u;
    st.targetMouseY = v;
    st.mouseX = u;
    st.mouseY = v;
    st.targetHover = 1;
    setHovered(true);
    st.wake();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const { u, v } = toNormalizedUv(e.clientX, e.clientY);
    const st = opticalRef.current;
    st.targetMouseX = u;
    st.targetMouseY = v;
    st.targetHover = 1;
    st.wake();
  };

  const handlePointerLeave = () => {
    const st = opticalRef.current;
    st.targetHover = 0;
    setHovered(false);
    st.wake();
  };

  const handleToggleColor = (e: React.MouseEvent<HTMLElement>) => {
    const { u, v } = toNormalizedUv(e.clientX, e.clientY);
    opticalRef.current.clickX = u;
    opticalRef.current.clickY = v;
    setColorLocked((prev) => !prev);
  };

  const modeLabel =
    locale === "id"
      ? colorLocked
        ? "Warna"
        : "Monokrom"
      : colorLocked
        ? "Color"
        : "Mono";

  const cursorPrompt =
    locale === "id"
      ? colorLocked
        ? "Mono"
        : "Warna"
      : colorLocked
        ? "Mono"
        : "Color";

  return (
    <figure className={cn("w-full select-none", className)}>
      {/* Architectural Warm-Paper Matting Frame with Corner Registration Marks */}
      <div
        ref={frameRef}
        role="button"
        tabIndex={0}
        onClick={handleToggleColor}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            opticalRef.current.clickX = 0.5;
            opticalRef.current.clickY = 0.5;
            setColorLocked((prev) => !prev);
          }
        }}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        aria-pressed={colorLocked}
        aria-label={
          locale === "id"
            ? `${alt} — klik untuk beralih mode monokrom dan warna alami`
            : `${alt} — click to toggle monochrome and natural color`
        }
        data-cursor="pill"
        data-cursor-label={cursorPrompt}
        className="group relative cursor-pointer border border-[#0D0D0D]/12 bg-[#EAE8E1] p-2.5 transition-colors duration-500 hover:border-[#0D0D0D]/26 sm:p-3"
      >
        {/* 4 Precision Architectural Registration Marks (tighten subtly on hover) */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-1 top-1 z-20 h-2.5 w-2.5 border-l border-t border-[#0D0D0D]/45 transition-transform duration-500 ease-spring-out",
            hovered && "translate-x-1 translate-y-1 border-[#0D0D0D]"
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-1 top-1 z-20 h-2.5 w-2.5 border-r border-t border-[#0D0D0D]/45 transition-transform duration-500 ease-spring-out",
            hovered && "-translate-x-1 translate-y-1 border-[#0D0D0D]"
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-1 left-1 z-20 h-2.5 w-2.5 border-b border-l border-[#0D0D0D]/45 transition-transform duration-500 ease-spring-out",
            hovered && "translate-x-1 -translate-y-1 border-[#0D0D0D]"
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-1 right-1 z-20 h-2.5 w-2.5 border-b border-r border-[#0D0D0D]/45 transition-transform duration-500 ease-spring-out",
            hovered && "-translate-x-1 -translate-y-1 border-[#0D0D0D]"
          )}
        />

        {/* Aperture Clip-Path Reveal Viewport (3:4 Portrait) */}
        <div
          className="relative aspect-[3/4] w-full overflow-hidden bg-[#DDDAD2] transition-[clip-path] duration-[1050ms] ease-expo-out will-change-[clip-path]"
          style={{
            clipPath: revealed ? "inset(0 0 0% 0)" : "inset(100% 0 0% 0)",
          }}
        >
          {/* Base Semantic <img> — Instant LCP, Google Images SEO & Mobile/Reduced-Motion Fallback */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="eager"
            decoding="async"
            className={cn(
              "h-full w-full object-cover object-[50%_26%] transition-[filter,transform] duration-[850ms] ease-expo-out",
              colorLocked
                ? "grayscale-0 contrast-[1.03]"
                : "grayscale contrast-[1.08]",
              revealed ? "scale-[1.02]" : "scale-[1.12]"
            )}
          />

          {/* WebGL Optical Darkroom Loupe Layer (crossfades seamlessly over <img> once GPU texture is ready) */}
          <div
            ref={canvasHostRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-500 ease-expo-out",
              webglReady ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </div>

      {/* Quiet Editorial Caption & Interactive Mode Indicator */}
      <figcaption className="mt-3.5 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.15em] text-[#73726C] uppercase">
        <span className="truncate">
          {caption ?? "Danu Candra Saputra · 3:4"}
        </span>

        <button
          type="button"
          onClick={handleToggleColor}
          data-cursor="pointer"
          className="hairline-sweep shrink-0 cursor-pointer text-[#0D0D0D] transition-opacity hover:opacity-75"
        >
          {modeLabel}
        </button>
      </figcaption>
    </figure>
  );
}
