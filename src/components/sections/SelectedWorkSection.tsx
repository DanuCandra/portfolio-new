"use client";

import { useEffect, useRef, useState } from "react";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { SelectedWorkCardsView } from "@/components/sections/SelectedWorkCardsView";
import { SelectedWorkIndexView } from "@/components/sections/SelectedWorkIndexView";
import type { Locale, ProjectItem } from "@/types/portfolio";

interface SelectedWorkSectionProps {
  projects: ProjectItem[];
  locale: Locale;
}

type WorkViewMode = "index" | "cards";

/**
 * SCENE 4 — Selected Work Dual-Mode Editorial Gallery (#F5F4F0, Gaya C).
 * - Default Mode: `Index` (Giant Kinetic List + Spring-Physics Floating Reel Preview).
 * - Mode `Cards`: Depth-Stacking Scroll Cards + Internal Parallax + Elastic Velocity Skew.
 * - Pergantian mode memakai weighted cross-morph lembut & otomatis me-resize Lenis.
 */
export function SelectedWorkSection({
  projects,
  locale,
}: SelectedWorkSectionProps) {
  const dict = getDictionary(locale);
  const [mode, setMode] = useState<WorkViewMode>("index");
  const [switching, setSwitching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleModeSwitch = (nextMode: WorkViewMode) => {
    if (nextMode === mode) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setSwitching(true);
    timerRef.current = setTimeout(() => {
      setMode(nextMode);
      // Let DOM settle, then recalibrate Lenis scroll bounds cleanly
      requestAnimationFrame(() => {
        window.__danucsLenis?.resize();
        setSwitching(false);
      });
    }, 180);
  };

  return (
    <section
      aria-label={dict.work.heading}
      className="mx-auto w-full max-w-[1380px] px-6 pb-32 pt-28 md:px-14 md:pb-44 md:pt-36"
    >
      {/* Clean Architectural Section Header + Minimal Text Mode Switcher */}
      <div className="mb-4 flex items-baseline justify-between border-b border-[#0D0D0D]/12 pb-6">
        <h2 className="flex items-baseline gap-3 text-xl font-medium tracking-[-0.025em] text-[#0D0D0D] sm:text-2xl">
          <span>{dict.work.heading}</span>
          <span className="font-mono text-xs text-[#73726C] tabular-nums">
            (0{projects.length})
          </span>
        </h2>

        {/* Minimal Text Toggle: Index / Cards */}
        <div
          role="group"
          aria-label="Gallery view mode"
          className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] uppercase"
        >
          <button
            type="button"
            onClick={() => handleModeSwitch("index")}
            data-cursor="pointer"
            className={cn(
              "relative cursor-pointer pb-1 transition-colors duration-300 active:scale-95",
              mode === "index"
                ? "font-medium text-[#0D0D0D]"
                : "text-[#73726C] hover:text-[#0D0D0D]"
            )}
          >
            {dict.work.modeIndex}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 bottom-0 h-[1px] origin-left bg-[#0D0D0D] transition-transform duration-500 ease-expo-out",
                mode === "index" ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>

          <span className="text-[#0D0D0D]/20" aria-hidden="true">
            /
          </span>

          <button
            type="button"
            onClick={() => handleModeSwitch("cards")}
            data-cursor="pointer"
            className={cn(
              "relative cursor-pointer pb-1 transition-colors duration-300 active:scale-95",
              mode === "cards"
                ? "font-medium text-[#0D0D0D]"
                : "text-[#73726C] hover:text-[#0D0D0D]"
            )}
          >
            {dict.work.modeCards}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 bottom-0 h-[1px] origin-left bg-[#0D0D0D] transition-transform duration-500 ease-expo-out",
                mode === "cards" ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>
        </div>
      </div>

      {/* Weighted Cross-Morph Stage */}
      <div
        className={cn(
          "transition-[opacity,transform] duration-300 ease-expo-out will-change-[opacity,transform]",
          switching ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        {mode === "index" ? (
          <SelectedWorkIndexView projects={projects} locale={locale} />
        ) : (
          <SelectedWorkCardsView projects={projects} locale={locale} />
        )}
      </div>
    </section>
  );
}
