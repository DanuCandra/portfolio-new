"use client";

import { useEffect, useRef } from "react";
import { getDictionary, localePath, pickText } from "@/i18n";
import { motionState } from "@/lib/motion-store";
import { KineticArrow } from "@/components/motion/KineticArrow";
import { MagneticField } from "@/components/motion/MagneticField";
import { TransitionLink } from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import { EditorialProjectFrame } from "@/components/projects/EditorialProjectFrame";
import type { Locale, ProjectItem } from "@/types/portfolio";

interface SelectedWorkCardsViewProps {
  projects: ProjectItem[];
  locale: Locale;
}

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

/**
 * SCENE 4B — Depth-Stacking Scroll Cards + Internal Parallax + Elastic Velocity Skew.
 * - Explicit ascending z-index (`idx + 1`) & 100% opaque `#FAF9F6` surfaces (ZERO bleed-through!).
 * - Covered cards recede cleanly (`scale 1 -> 0.94`) with a subtle darkening scrim overlay instead of alpha transparency.
 * - 100% reversible saat *scroll back* ke atas, nol React re-renders per frame.
 */
export function SelectedWorkCardsView({
  projects,
  locale,
}: SelectedWorkCardsViewProps) {
  const dict = getDictionary(locale);

  const slotRefs = useRef<Array<HTMLElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrimRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const flipFrameRefs = useRef<Array<HTMLDivElement | null>>([]);

  const resolveCardFlipRect = (idx: number) => {
    const el = flipFrameRefs.current[idx];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width <= 40 || r.height <= 40) return null;
    return {
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
    };
  };

  useEffect(() => {
    let rafId = 0;
    let smoothSkew = 0;

    const tick = () => {
      const vh = window.innerHeight || 1;
      const isDesktop = window.innerWidth >= 1024;

      const targetSkew = motionState.reducedMotion
        ? 0
        : Math.max(-1.6, Math.min(1.6, motionState.smoothVelocity * 0.045));
      smoothSkew += (targetSkew - smoothSkew) * 0.14;

      for (let i = 0; i < projects.length; i++) {
        const card = cardRefs.current[i];
        const scrim = scrimRefs.current[i];
        const media = mediaRefs.current[i];
        const slot = slotRefs.current[i];
        const nextSlot = slotRefs.current[i + 1];

        let stackDepth = 0;
        if (isDesktop && nextSlot) {
          const nextRect = nextSlot.getBoundingClientRect();
          stackDepth = clamp01((vh - nextRect.top) / (vh * 0.85));
        }

        if (card) {
          const scale = 1 - stackDepth * 0.058;
          const liftY = -stackDepth * 14;
          const appliedSkew = isDesktop ? smoothSkew * (1 - stackDepth * 0.7) : 0;

          // Keep card 100% opaque so lower layers NEVER ghost through foreground cards!
          card.style.transform = `translate3d(0, ${liftY.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) skewY(${appliedSkew.toFixed(3)}deg)`;
        }

        // Subtle darkening shadow scrim on covered cards to sell physical depth cleanly
        if (scrim) {
          scrim.style.opacity = (stackDepth * 0.18).toFixed(3);
        }

        if (media && slot) {
          const rect = slot.getBoundingClientRect();
          const centerOffset = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
          const shiftY = Math.max(-18, Math.min(18, centerOffset * 24));
          media.style.transform = `translate3d(0, ${shiftY.toFixed(2)}px, 0) scale(1.06)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [projects.length]);

  return (
    <div className="relative space-y-12 pt-10 sm:space-y-16 lg:space-y-24 lg:pt-14">
      {projects.map((project, idx) => {
        const caseHref = localePath(locale, `/projects/${project.slug}`);
        const stickyTopPx = 92 + idx * 18;

        return (
          <article
            key={project.id}
            ref={(el) => {
              slotRefs.current[idx] = el;
            }}
            style={{ top: `${stickyTopPx}px`, zIndex: idx + 1 }}
            className="relative lg:sticky"
          >
            <div
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="group relative overflow-hidden border border-[#0D0D0D]/12 bg-[#FAF9F6] shadow-[0_28px_80px_-34px_rgba(13,13,13,0.26)] transition-[border-color,box-shadow] duration-500 ease-expo-out hover:border-[#0D0D0D]/26 hover:shadow-[0_36px_96px_-30px_rgba(13,13,13,0.34)] will-change-transform"
            >
              {/* Depth Scrim Overlay (darkens smoothly as next card rises over it, zero ghosting) */}
              <div
                ref={(el) => {
                  scrimRefs.current[idx] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 bg-[#0D0D0D] will-change-[opacity]"
                style={{ opacity: 0 }}
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12">
                {/* Visual Editorial Mockup Frame (7 cols) — FLIP Morph Origin */}
                <div
                  ref={(el) => {
                    flipFrameRefs.current[idx] = el;
                  }}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE8E1] lg:col-span-7 lg:aspect-auto lg:min-h-[430px]"
                >
                  <TransitionLink
                    href={caseHref}
                    mode="flip"
                    flipProject={project}
                    getFlipRect={() => resolveCardFlipRect(idx)}
                    curtainLabel={project.title}
                    cursorLabel={locale === "id" ? "Lihat" : "View"}
                    className="block h-full w-full"
                  >
                    <div
                      ref={(el) => {
                        mediaRefs.current[idx] = el;
                      }}
                      className="h-full w-full will-change-transform"
                    >
                      <div className="h-full w-full transition-transform duration-[920ms] ease-spring-out group-hover:scale-[1.035]">
                        <EditorialProjectFrame project={project} />
                      </div>
                    </div>
                  </TransitionLink>
                </div>

                {/* Minimal Editorial Info Column (5 cols) */}
                <div className="flex flex-col justify-between bg-[#FAF9F6] p-7 sm:p-10 lg:col-span-5 lg:p-12">
                  <div className="flex items-center justify-between font-mono text-[11px] text-[#73726C] tabular-nums">
                    <span>
                      0{idx + 1} / 0{projects.length}
                    </span>
                    <span>
                      {pickText(project.categoryLabel, locale)} · {project.year}
                    </span>
                  </div>

                  <div className="my-8 space-y-5 lg:my-10">
                    <TransitionLink
                      href={caseHref}
                      mode="flip"
                      flipProject={project}
                      getFlipRect={() => resolveCardFlipRect(idx)}
                      curtainLabel={project.title}
                      cursorLabel={locale === "id" ? "Lihat" : "View"}
                      className="inline-block"
                    >
                      <h3 className="text-3xl font-medium tracking-[-0.035em] text-[#0D0D0D] sm:text-4xl">
                        <RollingText text={project.title} />
                      </h3>
                    </TransitionLink>

                    <p className="max-w-sm text-sm leading-relaxed text-[#73726C]">
                      {pickText(project.tagline, locale)}
                    </p>

                    <p className="font-mono text-[11px] tracking-[0.06em] text-[#73726C]">
                      {project.techStack.slice(0, 4).join(" · ")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#0D0D0D]/10 pt-6">
                    <MagneticField strength={0.18}>
                      <TransitionLink
                        href={caseHref}
                        mode="flip"
                        flipProject={project}
                        getFlipRect={() => resolveCardFlipRect(idx)}
                        curtainLabel={project.title}
                        className="group/btn inline-flex items-center gap-2 text-sm font-medium text-[#0D0D0D]"
                      >
                        <RollingText
                          text={dict.work.explore}
                          groupHover={false}
                          underline
                        />
                        <KineticArrow direction="right" groupScope="btn" />
                      </TransitionLink>
                    </MagneticField>

                    <MagneticField strength={0.18}>
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="pointer"
                        className="group/demo hairline-sweep inline-flex items-center gap-1 pb-0.5 font-mono text-[11px] tracking-[0.12em] text-[#73726C] uppercase transition-colors hover:text-[#0D0D0D]"
                      >
                        <span>{dict.work.liveDemo}</span>
                        <KineticArrow direction="up-right" groupScope="demo" />
                      </a>
                    </MagneticField>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
