"use client";

import { useEffect, useMemo, useRef } from "react";
import { profileData } from "@/data/profile";
import type { Locale } from "@/types/portfolio";

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

interface StatementWord {
  text: string;
  isItalic: boolean;
}

/**
 * SCENE 3 — Inside The Glass: Quiet Statement (#0D0D0D Matte Ink).
 * - Sticky 210vh theater sehingga pengunjung berhenti sejenak di dalam ruang gelap kaca.
 * - Setiap kata menyala halus 1:1 mengikuti scroll (0 React re-renders, 100% reversible saat scroll back).
 * - 1 baris tipis disiplin inti bergeser menyamping hanya saat scroll bergerak (*scroll-coupled drift*).
 * - Saat lembaran Galeri Putih (#F5F4F0) naik dari bawah, konten gelap ini perlahan mundur (`scale 0.94`).
 */
export function QuietStatementSection({ locale }: { locale: Locale }) {
  const statement = profileData.statement[locale];

  const words = useMemo<StatementWord[]>(() => {
    const leadWords = statement.lead
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, isItalic: false }));
    const italicWords = statement.italic
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, isItalic: true }));
    const tailWords = statement.tail
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, isItalic: false }));
    return [...leadWords, ...italicWords, ...tailWords];
  }, [statement]);

  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const driftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const scrollable = Math.max(rect.height - vh, 1);

        // 0 when sticky begins -> 1 when bottom of sticky track reaches bottom of viewport
        const p = clamp01(-rect.top / scrollable);

        // Top 1px hairline draws cleanly from left
        if (hairlineRef.current) {
          const lineScale = smoothstep(0.0, 0.28, p);
          hairlineRef.current.style.transform = `scaleX(${Math.max(0.06, lineScale).toFixed(4)})`;
        }

        // Scroll-scrubbed word illumination (0.04 -> 0.66)
        const total = Math.max(words.length, 1);
        for (let i = 0; i < total; i++) {
          const el = wordRefs.current[i];
          if (!el) continue;
          const start = 0.04 + (i / total) * 0.54;
          const end = start + 0.14;
          const lit = smoothstep(start, end, p);
          const opacity = 0.15 + lit * 0.85;
          const liftY = (1 - lit) * 5;
          el.style.opacity = opacity.toFixed(3);
          el.style.transform = `translate3d(0, ${liftY.toFixed(2)}px, 0)`;
        }

        // Scroll-coupled horizontal drift on discipline strip (still when not scrolling!)
        if (driftRef.current) {
          const shiftX = (p - 0.5) * -120;
          driftRef.current.style.transform = `translate3d(${shiftX.toFixed(2)}px, 0, 0)`;
        }

        // Gentle depth recede as Curved White Paper Sheet rises over Scene 3 (0.72 -> 1.0)
        if (stageRef.current) {
          const recede = smoothstep(0.72, 1.0, p);
          const scale = 1 - recede * 0.055;
          const y = -recede * 32;
          const op = 1 - recede * 0.62;
          stageRef.current.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
          stageRef.current.style.opacity = op.toFixed(3);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [words.length]);

  const disciplineLine = profileData.disciplines.join("   ·   ");

  return (
    <section
      ref={trackRef}
      data-surface="ink"
      aria-label="Statement"
      className="relative z-10 h-[210vh] w-full bg-[#0D0D0D] text-[#F5F4F0]"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden px-6 md:px-14">
        <div
          ref={stageRef}
          className="mx-auto w-full max-w-[1160px] will-change-[transform,opacity]"
        >
          {/* Expanding 1px Hairline */}
          <span
            ref={hairlineRef}
            aria-hidden="true"
            className="mb-12 block h-[1px] w-full origin-left bg-[#F5F4F0]/18 will-change-transform sm:mb-16"
            style={{ transform: "scaleX(0.06)" }}
          />

          {/* Editorial Quote / Statement (Scroll-Scrubbed Word Illumination with REAL DOM spaces!) */}
          <blockquote className="max-w-5xl">
            <p className="display-statement text-[#F5F4F0]">
              {words.map((word, idx) => (
                <span key={`${word.text}-${idx}`}>
                  <span
                    ref={(el) => {
                      wordRefs.current[idx] = el;
                    }}
                    style={{ opacity: 0.15 }}
                    className={
                      word.isItalic
                        ? "inline-block font-editorial-serif italic font-normal will-change-[opacity,transform]"
                        : "inline-block will-change-[opacity,transform]"
                    }
                  >
                    {word.text}
                  </span>
                  {idx < words.length - 1 ? " " : null}
                </span>
              ))}
            </p>
            {statement.author ? (
              <footer className="mt-6 font-mono text-xs tracking-[0.14em] text-[#A6A59E] uppercase">
                — {statement.author}
              </footer>
            ) : null}
          </blockquote>

          {/* Single Quiet Scroll-Coupled Drift Discipline Line with soft edge fade mask */}
          <div
            className="mt-14 overflow-hidden border-t border-[#F5F4F0]/10 pt-6 sm:mt-20"
            style={{
              maskImage:
                "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
            }}
          >
            <div
              ref={driftRef}
              className="whitespace-nowrap font-mono text-[11px] tracking-[0.22em] text-[#A6A59E] uppercase will-change-transform"
            >
              <span>{disciplineLine}</span>
              <span className="mx-12 opacity-35" aria-hidden="true">
                ·
              </span>
              <span className="opacity-55">{disciplineLine}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
