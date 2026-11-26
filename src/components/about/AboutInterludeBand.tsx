"use client";

import { useEffect, useMemo, useRef } from "react";
import { motionState } from "@/lib/motion-store";
import type { Locale, ProfileAboutData } from "@/types/portfolio";

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

interface AboutInterludeBandProps {
  locale: Locale;
  interlude: ProfileAboutData["interlude"];
  stripItems: string[];
}

/**
 * ACT II of `/about` — Matte Ink (#0D0D0D) Rhythm Interlude Band.
 * - Menerima data `interlude` & `stripItems` dari props (siap dikelola via Admin Panel Fase 2).
 * - Kata menyala 1:1 mengikuti scroll (100% reversible maju & scroll-back, 0 React re-render per frame).
 */
export function AboutInterludeBand({
  locale,
  interlude,
  stripItems,
}: AboutInterludeBandProps) {
  const copy = interlude[locale];

  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const stripRef = useRef<HTMLDivElement>(null);

  const tokens = useMemo(() => {
    const leadWords = copy.lead
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, italic: false }));
    const italicWords = copy.italic
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, italic: true }));
    const tailWords = copy.tail
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, italic: false }));
    return [...leadWords, ...italicWords, ...tailWords];
  }, [copy.italic, copy.lead, copy.tail]);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = motionState.reducedMotion
          ? 1
          : clamp01((vh * 0.88 - rect.top) / (vh * 0.72));

        const total = Math.max(tokens.length, 1);
        for (let i = 0; i < total; i++) {
          const span = wordRefs.current[i];
          if (!span) continue;
          const start = (i / total) * 0.72;
          const local = clamp01((progress - start) / 0.24);
          span.style.opacity = (0.18 + local * 0.82).toFixed(3);
        }

        if (stripRef.current && !motionState.reducedMotion) {
          const shift = (progress - 0.5) * -130;
          stripRef.current.style.transform = `translate3d(${shift.toFixed(1)}px, 0, 0)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [tokens.length]);

  const repeatedStrip = [...stripItems, ...stripItems, ...stripItems];

  return (
    <section
      ref={sectionRef}
      data-surface="ink"
      aria-label="Engineering philosophy"
      className="relative w-full overflow-hidden bg-[#0D0D0D] py-28 text-[#F5F4F0] md:py-40"
    >
      <div className="mx-auto max-w-[1380px] px-6 md:px-14">
        <blockquote className="mx-auto max-w-4xl text-center">
          <p className="display-statement text-[#F5F4F0]">
            {tokens.map((token, idx) => (
              <span key={`${token.text}-${idx}`}>
                <span
                  ref={(node) => {
                    wordRefs.current[idx] = node;
                  }}
                  className={
                    token.italic
                      ? "font-editorial-serif inline-block italic font-normal will-change-[opacity]"
                      : "inline-block will-change-[opacity]"
                  }
                  style={{ opacity: 0.18 }}
                >
                  {token.text}
                </span>
                {idx < tokens.length - 1 ? " " : null}
              </span>
            ))}
          </p>
          {copy.author ? (
            <footer className="mt-6 font-mono text-xs tracking-[0.14em] text-[#A6A59E] uppercase">
              — {copy.author}
            </footer>
          ) : null}
        </blockquote>

        {/* Soft-Masked Horizontal Craft Strip */}
        <div
          aria-hidden="true"
          className="mt-16 overflow-hidden border-t border-[#F5F4F0]/12 pt-8 md:mt-20"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div
            ref={stripRef}
            className="flex w-max items-center gap-8 font-mono text-[11px] tracking-[0.18em] text-[#A6A59E] uppercase will-change-transform"
          >
            {repeatedStrip.map((label, idx) => (
              <span key={`${label}-${idx}`} className="inline-flex items-center gap-8">
                <span>{label}</span>
                <span className="text-[#F5F4F0]/25">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
