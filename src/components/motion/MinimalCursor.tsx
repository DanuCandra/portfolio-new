"use client";

import { useEffect, useRef, useState } from "react";
import { motionState } from "@/lib/motion-store";
import { cn } from "@/lib/cn";

type CursorKind = "default" | "pointer" | "pill" | "hidden";

/**
 * Minimalist Monochrome Morphing Dot Cursor (Desktop Fine Pointer Only).
 * - Default: titik tinta 8px bersih yang mengikuti kursor dengan spring inertia.
 * - Hover link/tombol: membesar halus menjadi cincin tipis 28px.
 * - Hover kartu/baris proyek (`data-cursor="pill"`): berubah menjadi lingkaran solid
 *   berisi label editorial singkat ("View", "Open", "Copy").
 * - Otomatis membalik warna di atas Paper (#F5F4F0) vs Ink (#0D0D0D).
 */
export function MinimalCursor() {
  const [enabled, setEnabled] = useState(false);
  const [kind, setKind] = useState<CursorKind>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [onInk, setOnInk] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);
  const onInkRef = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    document.documentElement.classList.add("has-minimal-cursor");

    const evaluateUnderPointer = (x: number, y: number) => {
      const target = document.elementFromPoint(x, y) as HTMLElement | null;
      if (!target) {
        setKind("default");
        setLabel("");
        return;
      }

      if (target.closest("input, textarea, select")) {
        setKind("hidden");
        return;
      }

      const pillHost = target.closest<HTMLElement>("[data-cursor='pill']");
      if (pillHost) {
        setKind("pill");
        setLabel(pillHost.dataset.cursorLabel ?? "View");
        return;
      }

      if (target.closest("a, button, [role='button'], [data-cursor='pointer']")) {
        setKind("pointer");
        setLabel("");
        return;
      }

      setKind("default");
      setLabel("");
    };

    const onMove = (e: PointerEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!visibleRef.current) {
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
        visibleRef.current = true;
        setEnabled(true);
        setVisible(true);
      }

      evaluateUnderPointer(e.clientX, e.clientY);
    };

    // Re-evaluate hovered element on scroll so pills ("Salin" / "Lihat") never stay stranded mid-screen!
    const onScroll = () => {
      if (!visibleRef.current) return;
      evaluateUnderPointer(targetRef.current.x, targetRef.current.y);
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let rafId = 0;
    const tick = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.22;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x.toFixed(1)}px, ${posRef.current.y.toFixed(1)}px, 0)`;
      }

      const nextInk = motionState.surfaceMode === "ink";
      if (nextInk !== onInkRef.current) {
        onInkRef.current = nextInk;
        setOnInk(nextInk);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-minimal-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-200",
        visible && kind !== "hidden" ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,color] duration-300 ease-expo-out",
          kind === "default" &&
            (onInk ? "h-2 w-2 bg-[#F5F4F0]" : "h-2 w-2 bg-[#0D0D0D]"),
          kind === "pointer" &&
            (onInk
              ? "h-7 w-7 border border-[#F5F4F0]/80 bg-[#F5F4F0]/10"
              : "h-7 w-7 border border-[#0D0D0D]/75 bg-[#0D0D0D]/6"),
          kind === "pill" &&
            (onInk
              ? "h-[68px] w-[68px] bg-[#F5F4F0] text-[#0D0D0D]"
              : "h-[68px] w-[68px] bg-[#0D0D0D] text-[#F5F4F0]")
        )}
      >
        {kind === "pill" ? (
          <span className="font-editorial-serif text-sm italic tracking-wide">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
