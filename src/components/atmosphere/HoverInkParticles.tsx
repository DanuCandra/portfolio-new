"use client";

import { useEffect, useRef } from "react";
import { motionState } from "@/lib/motion-store";

interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  alpha: number;
}

const DESKTOP_PARTICLE_COUNT = 108;
const COMPACT_PARTICLE_COUNT = 56;
const HOVER_RADIUS = 158;
const LINK_DISTANCE = 92;

/**
 * Interactive Minimalist Magnetic Ink-Dust Particle Field (120 FPS 2D Canvas).
 * - Di kanvas Putih Alabaster (#F5F4F0): titik grafit/tinta gelap halus.
 * - Di ruang Hitam Matte (#0D0D0D): otomatis transisi mulus ke partikel perak hangat.
 * - Saat kursor bergerak / hover: partikel sekitar tersapu lembut oleh medan magnet
 *   dan memunculkan filamen garis ultra-tipis (0.6px) sesaat di sekitar kursor.
 */
export function HoverInkParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarsePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let particles: InkParticle[] = [];

    // Smoothly interpolated RGB tone (13 on Paper -> 245 on Ink)
    let tone = motionState.surfaceMode === "ink" ? 245 : 13;

    const seedParticles = () => {
      const count =
        width >= 1024 ? DESKTOP_PARTICLE_COUNT : COMPACT_PARTICLE_COUNT;
      let seed = 948271;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };

      const next: InkParticle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = rand() * Math.PI * 2;
        const speed = 0.09 + rand() * 0.2;
        const bvx = Math.cos(angle) * speed;
        const bvy = Math.sin(angle) * speed;
        next.push({
          x: rand() * width,
          y: rand() * height,
          vx: bvx,
          vy: bvy,
          baseVx: bvx,
          baseVy: bvy,
          radius: 0.9 + rand() * 1.35,
          alpha: 0.14 + rand() * 0.24,
        });
      }
      particles = next;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) {
        seedParticles();
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let rafId = 0;
    let paused = document.hidden;

    const onVisibilityChange = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const frame = () => {
      rafId = requestAnimationFrame(frame);
      if (paused || motionState.reducedMotion) return;

      ctx.clearRect(0, 0, width, height);

      // Smoothly transition particle color between Paper (#0D0D0D) & Ink (#F5F4F0)
      const targetTone = motionState.surfaceMode === "ink" ? 245 : 13;
      tone += (targetTone - tone) * 0.08;
      const tInt = Math.round(tone);

      const mx = motionState.mouseX;
      const my = motionState.mouseY;
      const hasPointer = motionState.pointerActive;
      const scrollDriftY = -Math.max(
        -3.2,
        Math.min(3.2, motionState.smoothVelocity * 0.08)
      );
      const breeze = motionState.breezeImpulse;
      const bx = motionState.breezeX;
      const by = motionState.breezeY;

      // Track particles excited near cursor for delicate micro-filaments
      const excited: InkParticle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle magnetic hover repulsion & swirl around pointer
        let proximity = 0;
        if (hasPointer) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < HOVER_RADIUS * HOVER_RADIUS && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            proximity = 1 - dist / HOVER_RADIUS;
            const force = proximity * proximity * 0.58;
            const nx = dx / dist;
            const ny = dy / dist;
            // Subtle radial push + slight tangential silk drift
            p.vx += (nx * 0.85 - ny * 0.25) * force;
            p.vy += (ny * 0.85 + nx * 0.25) * force;
            excited.push(p);
          }
        }

        // Calm radial click breeze on open paper
        if (breeze > 0.04) {
          const dx = p.x - bx;
          const dy = p.y - by;
          const dist = Math.hypot(dx, dy);
          if (dist < 240 && dist > 1) {
            const push = (1 - dist / 240) * breeze * 1.15;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        }

        // Relax velocity back toward organic base drift
        p.vx += (p.baseVx - p.vx) * 0.045;
        p.vy += (p.baseVy - p.vy) * 0.045;

        p.x += p.vx;
        p.y += p.vy + scrollDriftY * (0.4 + p.radius * 0.25);

        // Seamless edge wrap
        if (p.x < -16) p.x = width + 16;
        else if (p.x > width + 16) p.x = -16;
        if (p.y < -16) p.y = height + 16;
        else if (p.y > height + 16) p.y = -16;

        const drawAlpha = Math.min(0.68, p.alpha + proximity * 0.36);
        const drawRadius = p.radius + proximity * 0.7;

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tInt}, ${tInt}, ${tInt}, ${drawAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // Ultra-delicate architectural filaments ONLY among hover-excited particles
      if (excited.length > 1) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < excited.length; i++) {
          const a = excited[i];
          for (let j = i + 1; j < excited.length; j++) {
            const b = excited[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d = Math.hypot(dx, dy);
            if (d < LINK_DISTANCE) {
              const lineAlpha = (1 - d / LINK_DISTANCE) * 0.19;
              ctx.strokeStyle = `rgba(${tInt}, ${tInt}, ${tInt}, ${lineAlpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[15]"
    />
  );
}
