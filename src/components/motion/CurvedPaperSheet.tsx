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
}

/**
 * Reversible Shape-Layer Morphing Paper Sheet (#F5F4F0).
 * - Meluncur naik menutupi Scene 3 Hitam (#0D0D0D) dengan sudut atas melengkung `48px`
 *   yang melurus mulus menjadi `0px` tepat saat mencapai tepi atas layar.
 * - 100% reversible saat *scroll back* ke atas: sudut atas kembali melengkung lembut
 *   sambil turun menyingkap ruang Statement Hitam di belakangnya.
 */
export function CurvedPaperSheet({
  children,
  id,
  className,
}: CurvedPaperSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const el = sheetRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 when top edge enters bottom of viewport -> 1 when top edge settles at top of viewport
        const flatten = clamp01(1 - rect.top / (vh * 0.85));
        const radiusPx = (1 - flatten) * 48;

        el.style.borderTopLeftRadius = `${radiusPx.toFixed(1)}px`;
        el.style.borderTopRightRadius = `${radiusPx.toFixed(1)}px`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      id={id}
      ref={sheetRef}
      data-surface="paper"
      className={cn(
        "relative z-20 -mt-[14vh] w-full bg-[#F5F4F0] text-[#0D0D0D] shadow-[0_-24px_80px_rgba(0,0,0,0.28)]",
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
