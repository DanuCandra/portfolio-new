"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getDictionary, localePath, pickText } from "@/i18n";
import { motionState } from "@/lib/motion-store";
import { cn } from "@/lib/cn";
import { TransitionLink } from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import { EditorialProjectFrame } from "@/components/projects/EditorialProjectFrame";
import type { Locale, ProjectItem } from "@/types/portfolio";

interface SelectedWorkIndexViewProps {
  projects: ProjectItem[];
  locale: Locale;
}

/**
 * SCENE 4A — Giant Kinetic Editorial Index + Spring-Physics Floating Reel Preview (Gaya B / Default Gaya C).
 * - Desktop: 5 baris judul raksasa bergaris 1px; hover meredupkan baris lain (25%), menggulir judul
 *   ke *Instrument Serif Italic*, dan memunculkan jendela preview melayang yang mengikuti kursor dengan
 *   pegas fisika (*spring lag + velocity tilt*) serta slide film-reel vertikal 01 -> 05 tanpa berkedip.
 * - Mobile/Touch: Setiap item menampilkan frame editorial ringkas yang bersih & langsung dapat diklik.
 */
export function SelectedWorkIndexView({
  projects,
  locale,
}: SelectedWorkIndexViewProps) {
  const dict = getDictionary(locale);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [lastActiveIdx, setLastActiveIdx] = useState<number>(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, initialized: false });
  const prevXRef = useRef(0);
  const smoothTiltRef = useRef(0);

  const isPreviewOpen = hoveredIdx !== null;
  const displayIdx = hoveredIdx ?? lastActiveIdx;
  const activeProject = projects[displayIdx] ?? projects[0];

  // Spring-Physics Floating Preview Stage tracking cursor (0 React re-renders per frame!)
  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!finePointer) return;

    let rafId = 0;

    const tick = () => {
      const el = stageRef.current;
      if (el) {
        const targetX = motionState.mouseX;
        const targetY = motionState.mouseY;

        if (!posRef.current.initialized && motionState.pointerActive) {
          posRef.current.x = targetX;
          posRef.current.y = targetY;
          prevXRef.current = targetX;
          posRef.current.initialized = true;
        }

        // Weighted spring follow
        posRef.current.x += (targetX - posRef.current.x) * 0.13;
        posRef.current.y += (targetY - posRef.current.y) * 0.13;

        // Subtle horizontal velocity tilt (-6.5deg .. +6.5deg) for After Effects mass feel
        const vx = posRef.current.x - prevXRef.current;
        prevXRef.current = posRef.current.x;
        const targetTilt = Math.max(-6.5, Math.min(6.5, vx * 0.28));
        smoothTiltRef.current += (targetTilt - smoothTiltRef.current) * 0.16;

        // Clamp slightly inside viewport bounds so preview never gets clipped awkwardly
        const vw = window.innerWidth || 1280;
        const vh = window.innerHeight || 800;
        const drawX = Math.max(210, Math.min(vw - 210, posRef.current.x));
        const drawY = Math.max(150, Math.min(vh - 150, posRef.current.y));

        el.style.transform = `translate3d(${drawX.toFixed(1)}px, ${drawY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0) rotate(${smoothTiltRef.current.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleRowEnter = (idx: number) => {
    setHoveredIdx(idx);
    setLastActiveIdx(idx);
  };

  return (
    <div
      className="relative w-full"
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {/* Monumental 1px Hairline Editorial List */}
      <ul className="divide-y divide-[#0D0D0D]/12 border-b border-[#0D0D0D]/12">
        {projects.map((project, idx) => {
          const isHovered = hoveredIdx === idx;
          const isDimmed = hoveredIdx !== null && !isHovered;
          const caseHref = localePath(locale, `/projects/${project.slug}`);

          return (
            <li
              key={project.id}
              onMouseEnter={() => handleRowEnter(idx)}
              className={cn(
                "group relative transition-opacity duration-500 ease-expo-out",
                isDimmed ? "opacity-25" : "opacity-100"
              )}
            >
              {/* Main Desktop & Mobile Interactive Row */}
              <div className="flex flex-col gap-5 py-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:py-12">
                {/* Left: Index Number + Monumental Rolling Title */}
                <TransitionLink
                  href={caseHref}
                  curtainLabel={project.title}
                  cursorLabel={locale === "id" ? "Lihat" : "View"}
                  className="flex flex-1 items-baseline gap-5 transition-transform duration-500 ease-expo-out lg:gap-10 lg:group-hover:translate-x-3"
                >
                  <span className="w-7 shrink-0 font-mono text-[11px] text-[#73726C] tabular-nums">
                    0{idx + 1}
                  </span>

                  <div className="min-w-0">
                    <h3 className="display-index text-[#0D0D0D]">
                      <RollingText
                        text={project.title}
                        italicClassName="font-normal tracking-[-0.02em]"
                      />
                    </h3>
                    <p className="mt-2 max-w-md text-xs text-[#73726C] lg:hidden">
                      {pickText(project.tagline, locale)}
                    </p>
                  </div>
                </TransitionLink>

                {/* Right Metadata: Category · Stack (subtle) · Year · Direct Live Demo */}
                <div className="flex items-center justify-between gap-6 pl-12 lg:justify-end lg:gap-10 lg:pl-0">
                  <span className="text-xs text-[#73726C] sm:text-sm">
                    {pickText(project.categoryLabel, locale)}
                  </span>

                  <span className="hidden font-mono text-[11px] text-[#73726C] tabular-nums xl:inline">
                    {project.techStack.slice(0, 3).join(" · ")}
                  </span>

                  <span className="font-mono text-[11px] text-[#73726C] tabular-nums">
                    {project.year}
                  </span>

                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="pointer"
                    aria-label={`${dict.work.liveDemo} — ${project.title}`}
                    className="inline-flex items-center gap-1 border-b border-transparent pb-0.5 font-mono text-[10px] tracking-[0.14em] text-[#73726C] uppercase transition-all duration-300 hover:border-[#0D0D0D] hover:text-[#0D0D0D]"
                  >
                    <span className="hidden sm:inline">{dict.work.liveDemo}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              {/* Mobile / Touch Clean Editorial Preview Frame (< lg only) */}
              <div className="pb-8 pl-0 lg:hidden">
                <TransitionLink
                  href={caseHref}
                  curtainLabel={project.title}
                  className="block aspect-[16/10] w-full overflow-hidden"
                >
                  <EditorialProjectFrame project={project} compact />
                </TransitionLink>
              </div>
            </li>
          );
        })}
      </ul>

      {/* DESKTOP FLOATING SPRING-PHYSICS VERTICAL FILM-REEL STAGE */}
      <div
        ref={stageRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[45] hidden lg:block will-change-transform"
      >
        <div
          className={cn(
            "w-[390px] overflow-hidden bg-[#EAE8E1] shadow-[0_32px_90px_-24px_rgba(13,13,13,0.34)] transition-[opacity,transform] duration-500 ease-expo-out",
            isPreviewOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}
        >
          {/* Vertical Film-Reel Viewport */}
          <div className="relative h-[248px] w-full overflow-hidden">
            <div
              className="h-full w-full transition-transform duration-[620ms] ease-expo-out will-change-transform"
              style={{
                transform: `translate3d(0, -${displayIdx * 100}%, 0)`,
              }}
            >
              {projects.map((project) => (
                <div key={project.id} className="h-[248px] w-full">
                  <EditorialProjectFrame project={project} compact />
                </div>
              ))}
            </div>
          </div>

          {/* Ultra-Minimal Caption Strip Below Preview */}
          {activeProject ? (
            <div className="flex items-center justify-between bg-[#0D0D0D] px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] text-[#F5F4F0]/85 uppercase">
              <span>
                0{displayIdx + 1} / 0{projects.length}
              </span>
              <span className="truncate pl-4 text-[#A6A59E]">
                {activeProject.techStack.slice(0, 3).join(" · ")}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
