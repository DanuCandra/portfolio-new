"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

interface CurvedPaperSheetProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Enable symmetric bottom arch curve as the paper lifts to reveal Scene 5 Contact underneath */
  liftBottom?: boolean;
}

/**
 * Reversible Shape-Layer Morphing Paper Sheet (#F5F4F0).
 * - Tepi atas: melengkung `48px -> 0px` saat naik menutupi Statement Hitam (Scene 3).
 * - Tepi bawah (`liftBottom`): melengkung `0px -> 48px` saat terangkat menyingkap
 *   Contact Hitam Matte (#0D0D0D) di Scene 5 — 100% simetris maju maupun *scroll back*.
 */
export function CurvedPaperSheet({
  children,
  id,
  className,
  liftBottom = false,
}: CurvedPaperSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const el = sheetRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;

        // Top arch morph: 48px -> 0px as sheet rises to top of screen
        const topFlatten = clamp01(1 - rect.top / (vh * 0.85));
        const topRadius = (1 - topFlatten) * 48;
        el.style.borderTopLeftRadius = `${topRadius.toFixed(1)}px`;
        el.style.borderTopRightRadius = `${topRadius.toFixed(1)}px`;

        // Bottom arch morph: 0px -> 48px as sheet bottom lifts off bottom of screen to reveal Contact
        if (liftBottom) {
          const bottomLift = clamp01((vh - rect.bottom) / (vh * 0.6));
          const bottomRadius = bottomLift * 48;
          el.style.borderBottomLeftRadius = `${bottomRadius.toFixed(1)}px`;
          el.style.borderBottomRightRadius = `${bottomRadius.toFixed(1)}px`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [liftBottom]);

  return (
    <div
      id={id}
      ref={sheetRef}
      data-surface="paper"
      className={cn(
        "relative z-20 -mt-[14vh] w-full bg-[#F5F4F0] text-[#0D0D0D] shadow-[0_-24px_80px_rgba(0,0,0,0.28),0_28px_80px_rgba(0,0,0,0.34)]",
        className
      )}
      style={{
        borderTopLeftRadius: "48px",
        borderTopRightRadius: "48px",
      }}
    >
      {children}
    </div>
  );
}
