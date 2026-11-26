"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { getDictionary, localePath, pickText } from "@/i18n";
import { motionState } from "@/lib/motion-store";
import { cn } from "@/lib/cn";
import { KineticArrow } from "@/components/motion/KineticArrow";
import {
  TransitionLink,
  usePageTransition,
} from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import { EditorialProjectFrame } from "@/components/projects/EditorialProjectFrame";
import type { Locale, ProjectItem } from "@/types/portfolio";

const emptySubscribe = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

interface SelectedWorkIndexViewProps {
  projects: ProjectItem[];
  locale: Locale;
}

/**
 * SCENE 4A — Giant Kinetic Editorial Index + Spring-Physics Clip-Path Floating Preview.
 * - Desktop: 5 baris judul raksasa bergaris 1px; hover meredupkan baris lain (25%), menggulir judul
 *   dengan Same-Font Slot Roll, dan memunculkan jendela preview melayang dengan:
 *   1) Directional Clip-Path Curtain Wipe saat berpindah antar proyek (01 -> 05)
 *   2) Velocity-Driven 3D Elastic Tilt (miring tipis mengikuti momentum gerak kursor)
 *   3) Shared-Element FLIP Hero Morph saat diklik menuju Detail Proyek!
 * - Mobile/Touch: Setiap item menampilkan frame editorial ringkas yang juga memicu FLIP Morph saat diklik.
 */
export function SelectedWorkIndexView({
  projects,
  locale,
}: SelectedWorkIndexViewProps) {
  const dict = getDictionary(locale);
  const { isFlipActive } = usePageTransition();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getClientMounted,
    getServerMounted
  );

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [lastActiveIdx, setLastActiveIdx] = useState<number>(0);
  const [prevIdx, setPrevIdx] = useState<number>(0);
  const [wipeDirection, setWipeDirection] = useState<"down" | "up">("down");
  const [wipeKey, setWipeKey] = useState<number>(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const mobileFrameRefs = useRef<Array<HTMLDivElement | null>>([]);

  const posRef = useRef({ x: 0, y: 0, initialized: false });
  const prevPosRef = useRef({ x: 0, y: 0 });
  const smoothTiltRef = useRef({ rz: 0, rx: 0, ry: 0 });

  const isPreviewOpen = hoveredIdx !== null && !isFlipActive;
  const displayIdx = hoveredIdx ?? lastActiveIdx;
  const activeProject = projects[displayIdx] ?? projects[0];
  const prevProject = projects[prevIdx] ?? activeProject;

  // Spring-Physics Floating Preview Stage with 3D Velocity-Driven Elastic Tilt (0 React re-renders!)
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
          prevPosRef.current.x = targetX;
          prevPosRef.current.y = targetY;
          posRef.current.initialized = true;
        }

        // Weighted luxury spring follow (silkier physical lag, zero twitchiness)
        posRef.current.x += (targetX - posRef.current.x) * 0.095;
        posRef.current.y += (targetY - posRef.current.y) * 0.095;

        const vx = posRef.current.x - prevPosRef.current.x;
        const vy = posRef.current.y - prevPosRef.current.y;
        prevPosRef.current.x = posRef.current.x;
        prevPosRef.current.y = posRef.current.y;

        // Subtle, poised 3D elastic inertia (leans softly into momentum, settles smoothly to 0deg)
        const targetRz = Math.max(-4.8, Math.min(4.8, vx * 0.22));
        const targetRy = Math.max(-6.5, Math.min(6.5, vx * 0.25));
        const targetRx = Math.max(-5.5, Math.min(5.5, -vy * 0.22));

        smoothTiltRef.current.rz += (targetRz - smoothTiltRef.current.rz) * 0.1;
        smoothTiltRef.current.ry += (targetRy - smoothTiltRef.current.ry) * 0.1;
        smoothTiltRef.current.rx += (targetRx - smoothTiltRef.current.rx) * 0.1;

        const vw = window.innerWidth || 1280;
        const vh = window.innerHeight || 800;
        // Keep comfortable breathing room around the 404x296 tilted preview so caption never clips
        const drawX = Math.max(225, Math.min(vw - 225, posRef.current.x));
        const drawY = Math.max(185, Math.min(vh - 190, posRef.current.y));

        el.style.transform = `translate3d(${drawX.toFixed(1)}px, ${drawY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0) perspective(950px) rotateX(${smoothTiltRef.current.rx.toFixed(2)}deg) rotateY(${smoothTiltRef.current.ry.toFixed(2)}deg) rotateZ(${smoothTiltRef.current.rz.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleRowEnter = (idx: number) => {
    if (idx !== lastActiveIdx) {
      setPrevIdx(lastActiveIdx);
      setWipeDirection(idx > lastActiveIdx ? "down" : "up");
      setWipeKey((k) => k + 1);
      setLastActiveIdx(idx);
    }
    setHoveredIdx(idx);
  };

  const resolveFlipRect = (idx: number) => {
    // Desktop: capture live floating preview box so the flying FLIP card lifts straight off cursor!
    if (window.innerWidth >= 1024 && previewViewportRef.current) {
      const r = previewViewportRef.current.getBoundingClientRect();
      if (r.width > 40 && r.height > 40) {
        return {
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
        };
      }
    }

    // Mobile / fallback: capture inline project preview card
    const mobileEl = mobileFrameRefs.current[idx];
    if (mobileEl) {
      const r = mobileEl.getBoundingClientRect();
      if (r.width > 40 && r.height > 40) {
        return {
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
        };
      }
    }

    return null;
  };

  const progressFraction = (displayIdx + 1) / Math.max(projects.length, 1);

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
                {/* Left: Index Number + Monumental Same-Font Rolling Title */}
                <TransitionLink
                  href={caseHref}
                  mode="flip"
                  flipProject={project}
                  getFlipRect={() => resolveFlipRect(idx)}
                  curtainLabel={project.title}
                  cursorLabel={locale === "id" ? "Lihat" : "View"}
                  className="flex flex-1 items-baseline gap-5 transition-transform duration-500 ease-expo-out lg:gap-10 lg:group-hover:translate-x-3"
                >
                  <span className="w-7 shrink-0 font-mono text-[11px] text-[#73726C] tabular-nums">
                    0{idx + 1}
                  </span>

                  <div className="min-w-0">
                    <h3 className="display-index text-[#0D0D0D]">
                      <RollingText text={project.title} />
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
                    className="group/demo hairline-sweep inline-flex items-center gap-1 pb-0.5 font-mono text-[10px] tracking-[0.14em] text-[#73726C] uppercase transition-colors duration-300 hover:text-[#0D0D0D]"
                  >
                    <span className="hidden sm:inline">{dict.work.liveDemo}</span>
                    <KineticArrow direction="up-right" groupScope="demo" />
                  </a>
                </div>
              </div>

              {/* Mobile / Touch Clean Editorial Preview Frame (< lg only) */}
              <div
                ref={(el) => {
                  mobileFrameRefs.current[idx] = el;
                }}
                className="pb-8 pl-0 lg:hidden"
              >
                <TransitionLink
                  href={caseHref}
                  mode="flip"
                  flipProject={project}
                  getFlipRect={() => resolveFlipRect(idx)}
                  curtainLabel={project.title}
                  className="block aspect-[16/10] w-full overflow-hidden border border-[#0D0D0D]/10"
                >
                  <EditorialProjectFrame project={project} compact />
                </TransitionLink>
              </div>
            </li>
          );
        })}
      </ul>

      {/* DESKTOP FLOATING SPRING-PHYSICS CLIP-PATH PREVIEW STAGE (Portaled to body so fixed ignores CurvedPaperSheet transform!) */}
      {isMounted
        ? createPortal(
            <div
              ref={stageRef}
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-[45] hidden lg:block will-change-transform"
            >
              <div
                className={cn(
                  "w-[404px] overflow-hidden border border-[#0D0D0D]/12 bg-[#EAE8E1] shadow-[0_34px_92px_-24px_rgba(13,13,13,0.34)] transition-[opacity,transform] duration-700 ease-spring-out",
                  isPreviewOpen ? "scale-100 opacity-100" : "scale-85 opacity-0"
                )}
              >
                {/* Directional Clip-Path Curtain Wipe Viewport */}
                <div
                  ref={previewViewportRef}
                  className="relative h-[252px] w-full overflow-hidden bg-[#EAE8E1]"
                >
                  {/* Outgoing Base Frame (subtle recede) */}
                  {prevProject ? (
                    <div className="absolute inset-0 scale-[1.02] opacity-85">
                      <EditorialProjectFrame project={prevProject} compact />
                    </div>
                  ) : null}

                  {/* Incoming Active Frame (sweeps cleanly via directional clip-path wipe) */}
                  {activeProject ? (
                    <div
                      key={wipeKey}
                      className={cn(
                        "absolute inset-0 will-change-[clip-path,transform]",
                        wipeKey > 0 &&
                          (wipeDirection === "down"
                            ? "preview-wipe-down"
                            : "preview-wipe-up")
                      )}
                    >
                      <EditorialProjectFrame project={activeProject} compact />
                    </div>
                  ) : null}
                </div>

                {/* Ultra-Minimal Caption Strip + Index Progress Hairline */}
                {activeProject ? (
                  <div className="relative bg-[#0D0D0D] px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] text-[#F5F4F0]/85 uppercase">
                    <div
                      className="absolute inset-x-0 top-0 h-[1px] origin-left bg-[#F5F4F0]/55 transition-transform duration-500 ease-expo-out"
                      style={{
                        transform: `scaleX(${progressFraction.toFixed(3)})`,
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <span>
                        0{displayIdx + 1} / 0{projects.length}
                      </span>
                      <span className="truncate pl-4 text-[#A6A59E]">
                        {activeProject.techStack.slice(0, 3).join(" · ")}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
