"use client";

import { useEffect, useRef, useState } from "react";
import { getDictionary } from "@/i18n";
import { profileData } from "@/data/profile";
import { motionState, setSurfaceModes } from "@/lib/motion-store";
import { updatePortalState } from "@/lib/portal-store";
import { MirrorMaskLetters } from "@/components/motion/MirrorMaskLetters";
import { TrimLine } from "@/components/motion/TrimLine";
import { GlassLaptopStageClient } from "@/components/three/GlassLaptopStageClient";
import type { Locale } from "@/types/portfolio";

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * UNIFIED SCENE 1 + SCENE 2 — 1:1 Reversible Paper-to-Glass Portal Choreography.
 * - `0%` scroll: Pure Alabaster Paper `#F5F4F0` Title Sequence (`DANU` / hairline / `CANDRA` — laptop hidden!)
 * - `2% -> 28%`: Aperture Split (`DANU` glides left, `CANDRA` glides right, hairline retracts)
 * - `8% -> 56%`: 3D Optical Glass Laptop rises from low silhouette & opens `0° -> 96°`
 * - `54% -> 92%`: Camera flies straight through the transparent optical glass into Matte Ink `#0D0D0D`
 * - `>= 96%`: Auto GPU Sleep (WebGL pauses at 0% GPU!)
 * - Scroll back: 100% symmetrical, seamless reversal!
 */
export function HeroPortalChoreography({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  const trackRef = useRef<HTMLElement>(null);
  const upperLineRef = useRef<HTMLDivElement>(null);
  const lowerLineRef = useRef<HTMLDivElement>(null);
  const axisWrapRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const darkTakeoverRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const subTimer = setTimeout(() => setSubtitleVisible(true), 420);

    const syncScale = () => {
      const w = window.innerWidth;
      const scale =
        w >= 1280 ? 1.04 : w >= 768 ? 0.88 : w >= 640 ? 0.72 : 0.56;
      updatePortalState({ enabled: true, responsiveScale: scale });
    };

    syncScale();
    window.addEventListener("resize", syncScale, { passive: true });

    let rafId = 0;
    let smoothX = 0;
    let smoothY = 0;
    let lastInDarkPortal = false;

    const tick = () => {
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const scrollable = Math.max(rect.height - vh, 1);
        const p = clamp01(-rect.top / scrollable);

        // Wake WebGL ONLY while Hero Portal track is near/in viewport (Auto GPU Sleep!)
        const nearViewport = rect.bottom > -180 && rect.top < vh + 180;
        const activeWebGL = nearViewport && p < 0.965;

        updatePortalState({
          portalProgress: p,
          stageActive: activeWebGL,
        });

        // Smooth cursor parallax (active at resting Opening Paper, damped cleanly as split starts)
        const cursorAmp = 1 - smoothstep(0.02, 0.22, p);
        const targetX = motionState.reducedMotion ? 0 : motionState.ndcX * cursorAmp;
        const targetY = motionState.reducedMotion ? 0 : motionState.ndcY * cursorAmp;
        smoothX += (targetX - smoothX) * 0.075;
        smoothY += (targetY - smoothY) * 0.075;

        // 1. Aperture Split 1:1 (`DANU` glides left, `CANDRA` glides right)
        const splitT = smoothstep(0.02, 0.3, p);
        const titleFade = 1 - smoothstep(0.14, 0.3, p);
        const vw = window.innerWidth || 1280;
        const splitShiftX = splitT * Math.min(vw * 0.36, 460);
        const splitShiftY = splitT * 42;

        if (upperLineRef.current) {
          const ux = smoothX * 14 - splitShiftX;
          const uy = -smoothY * 6 - splitShiftY;
          upperLineRef.current.style.transform = `translate3d(${ux.toFixed(2)}px, ${uy.toFixed(2)}px, 0)`;
          upperLineRef.current.style.opacity = titleFade.toFixed(3);
        }

        if (lowerLineRef.current) {
          const lx = -smoothX * 14 + splitShiftX;
          const ly = smoothY * 6 + splitShiftY;
          lowerLineRef.current.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0)`;
          lowerLineRef.current.style.opacity = titleFade.toFixed(3);
        }

        if (axisWrapRef.current) {
          const axisScale = Math.max(0, 1 - smoothstep(0.02, 0.22, p));
          axisWrapRef.current.style.transform = `scaleX(${axisScale.toFixed(4)})`;
          axisWrapRef.current.style.opacity = axisScale.toFixed(3);
        }

        if (roleRef.current) {
          const rx = -smoothX * 8 + splitShiftX * 0.45;
          const roleFade = 1 - smoothstep(0.02, 0.16, p);
          roleRef.current.style.transform = `translate3d(${rx.toFixed(2)}px, ${(splitT * 18).toFixed(2)}px, 0)`;
          roleRef.current.style.opacity = roleFade.toFixed(3);
        }

        if (cueRef.current) {
          const cueFade = 1 - smoothstep(0.01, 0.1, p);
          cueRef.current.style.opacity = cueFade.toFixed(3);
          cueRef.current.style.transform = `translate3d(0, ${(smoothstep(0.01, 0.1, p) * 16).toFixed(2)}px, 0)`;
        }

        // 2. Seamless Matte Ink (#0D0D0D) Takeover right as dark screen fills 100% of viewport
        const takeover = smoothstep(0.82, 0.93, p);
        if (darkTakeoverRef.current) {
          darkTakeoverRef.current.style.opacity = takeover.toFixed(4);
        }

        // Fade WebGL container cleanly out once #0D0D0D completely owns the viewport
        if (canvasWrapRef.current) {
          const canvasVis = 1 - smoothstep(0.92, 0.96, p);
          canvasWrapRef.current.style.opacity = canvasVis.toFixed(3);
        }

        // 3. Synchronize data-surface + Auto-Invert Navbar / Particles / Cursor seamlessly (forward & scroll-back!)
        const inDarkPortal = p >= 0.85;
        if (inDarkPortal !== lastInDarkPortal) {
          lastInDarkPortal = inDarkPortal;
          const mode = inDarkPortal ? "ink" : "paper";
          track.dataset.surface = mode;
          // Only override global surface when this Hero track actually covers viewport center
          if (rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5) {
            setSurfaceModes(mode, mode);
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(subTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", syncScale);
      updatePortalState({ stageActive: false, portalProgress: 0 });
    };
  }, []);

  return (
    <section
      ref={trackRef}
      data-surface="paper"
      aria-label={profileData.fullName}
      className="relative h-[340vh] w-full bg-[#F5F4F0]"
    >
      {/* Sticky Full-Viewport Theater (0% -> 100% Reversible Choreography) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#F5F4F0]">
        {/* Layer 1: Single 3D Minimalist Optical Glass Laptop Canvas (0% GPU after p >= 0.96) */}
        <div
          ref={canvasWrapRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 will-change-[opacity]"
        >
          <GlassLaptopStageClient />
        </div>

        {/* Layer 2: Scene 1 Opening Paper Monument Typography (Splits open 1:1 on scroll) */}
        <div className="pointer-events-none relative z-20 flex h-full w-full flex-col justify-between px-6 pb-10 pt-28 md:px-14 md:pb-12">
          <div className="h-4" aria-hidden="true" />

          <div className="mx-auto w-full max-w-[1380px]">
            <h1
              className="display-monument text-[#0D0D0D]"
              aria-label={profileData.fullName}
            >
              <div ref={upperLineRef} className="will-change-transform">
                <MirrorMaskLetters
                  text={profileData.firstName.toUpperCase()}
                  direction="up"
                  baseDelayMs={160}
                  staggerMs={48}
                />
              </div>

              <div
                ref={axisWrapRef}
                className="origin-center will-change-transform"
              >
                <TrimLine
                  immediate
                  origin="center"
                  delayMs={40}
                  className="my-4 bg-[#0D0D0D]/14 sm:my-6"
                />
              </div>

              <div
                ref={lowerLineRef}
                className="flex justify-end will-change-transform"
              >
                <MirrorMaskLetters
                  text={profileData.lastName.toUpperCase()}
                  direction="down"
                  baseDelayMs={220}
                  staggerMs={44}
                />
              </div>
            </h1>

            <div className="mt-6 flex justify-end overflow-y-clip py-1 sm:mt-8">
              <p
                ref={roleRef}
                className="pr-1.5 font-editorial-serif text-2xl italic tracking-[-0.01em] text-[#73726C] will-change-transform sm:text-3xl md:text-[2.1rem]"
              >
                <span
                  className="inline-block transition-[transform,opacity] duration-[850ms] ease-expo-out"
                  style={{
                    transform: subtitleVisible
                      ? "translate3d(0, 0%, 0)"
                      : "translate3d(0, 110%, 0)",
                    opacity: subtitleVisible ? 1 : 0,
                  }}
                >
                  {profileData.role[locale]}
                </span>
              </p>
            </div>
          </div>

          <div
            ref={cueRef}
            className="flex flex-col items-center gap-3 pt-10 will-change-[transform,opacity]"
          >
            <span className="font-mono text-[10px] tracking-[0.22em] text-[#73726C] uppercase">
              {dict.hero.scroll}
            </span>
            <span
              aria-hidden="true"
              className="relative block h-9 w-[1px] overflow-hidden bg-[#0D0D0D]/12"
            >
              <span className="paper-scroll-thread absolute inset-x-0 top-0 h-1/2 bg-[#0D0D0D]/75" />
            </span>
          </div>
        </div>

        {/* Layer 3: Seamless Matte Ink (#0D0D0D) Interior Handoff into Scene 3 */}
        <div
          ref={darkTakeoverRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 bg-[#0D0D0D] will-change-[opacity]"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  );
}
