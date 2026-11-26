"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDictionary, localePath, pickText } from "@/i18n";
import { motionState } from "@/lib/motion-store";
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
 * - Setiap kartu proyek menempel lembut (*sticky*), lalu mundur mengecil (`scale 1 -> 0.935`)
 *   dan meredup elegan tepat saat kartu proyek berikutnya naik menumpuk di atasnya.
 * - Scroll cepat memberi *elastic skew* halus berfisika pegas, kembali tegak saat berhenti.
 * - 100% reversible saat *scroll back* ke atas, nol React re-renders per frame.
 */
export function SelectedWorkCardsView({
  projects,
  locale,
}: SelectedWorkCardsViewProps) {
  const dict = getDictionary(locale);

  const slotRefs = useRef<Array<HTMLElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let rafId = 0;
    let smoothSkew = 0;

    const tick = () => {
      const vh = window.innerHeight || 1;
      const isDesktop = window.innerWidth >= 1024;

      // Subtle After Effects elastic velocity skew (-1.6deg .. +1.6deg)
      const targetSkew = motionState.reducedMotion
        ? 0
        : Math.max(-1.6, Math.min(1.6, motionState.smoothVelocity * 0.045));
      smoothSkew += (targetSkew - smoothSkew) * 0.14;

      for (let i = 0; i < projects.length; i++) {
        const card = cardRefs.current[i];
        const media = mediaRefs.current[i];
        const slot = slotRefs.current[i];
        const nextSlot = slotRefs.current[i + 1];

        if (card) {
          // Compute depth scale-back driven by the next rising card (100% reversible!)
          let stackDepth = 0;
          if (isDesktop && nextSlot) {
            const nextRect = nextSlot.getBoundingClientRect();
            stackDepth = clamp01((vh - nextRect.top) / (vh * 0.85));
          }

          const scale = 1 - stackDepth * 0.062;
          const liftY = -stackDepth * 14;
          const opacity = 1 - stackDepth * 0.48;
          const appliedSkew = isDesktop ? smoothSkew * (1 - stackDepth * 0.7) : 0;

          card.style.transform = `translate3d(0, ${liftY.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) skewY(${appliedSkew.toFixed(3)}deg)`;
          card.style.opacity = opacity.toFixed(3);
        }

        // Gentle internal mockup counter-parallax inside frame
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
            style={{ top: `${stickyTopPx}px` }}
            className="lg:sticky"
          >
            <div
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="group overflow-hidden border border-[#0D0D0D]/10 bg-[#FAF9F6] shadow-[0_28px_80px_-38px_rgba(13,13,13,0.24)] will-change-[transform,opacity]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual Editorial Mockup Frame (7 cols) */}
                <TransitionLink
                  href={caseHref}
                  curtainLabel={project.title}
                  cursorLabel={locale === "id" ? "Lihat" : "View"}
                  className="relative block aspect-[16/10] w-full overflow-hidden bg-[#EAE8E1] lg:col-span-7 lg:aspect-auto lg:min-h-[430px]"
                >
                  <div
                    ref={(el) => {
                      mediaRefs.current[idx] = el;
                    }}
                    className="h-full w-full will-change-transform"
                  >
                    <div className="h-full w-full transition-transform duration-700 ease-expo-out group-hover:scale-[1.03]">
                      <EditorialProjectFrame project={project} />
                    </div>
                  </div>
                </TransitionLink>

                {/* Minimal Editorial Info Column (5 cols) */}
                <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-5 lg:p-12">
                  {/* Top Metadata Strip */}
                  <div className="flex items-center justify-between font-mono text-[11px] text-[#73726C] tabular-nums">
                    <span>
                      0{idx + 1} / 0{projects.length}
                    </span>
                    <span>
                      {pickText(project.categoryLabel, locale)} · {project.year}
                    </span>
                  </div>

                  {/* Center Title + 1 Concise Line + Clean Stack */}
                  <div className="my-8 space-y-5 lg:my-10">
                    <TransitionLink
                      href={caseHref}
                      curtainLabel={project.title}
                      cursorLabel={locale === "id" ? "Lihat" : "View"}
                      className="inline-block"
                    >
                      <h3 className="text-3xl font-medium tracking-[-0.035em] text-[#0D0D0D] sm:text-4xl">
                        <RollingText
                          text={project.title}
                          italicClassName="font-normal tracking-[-0.02em]"
                        />
                      </h3>
                    </TransitionLink>

                    <p className="max-w-sm text-sm leading-relaxed text-[#73726C]">
                      {pickText(project.tagline, locale)}
                    </p>

                    <p className="font-mono text-[11px] tracking-[0.06em] text-[#73726C]">
                      {project.techStack.slice(0, 4).join(" · ")}
                    </p>
                  </div>

                  {/* Bottom Clean Hairline Actions */}
                  <div className="flex items-center justify-between border-t border-[#0D0D0D]/10 pt-6">
                    <MagneticField strength={0.18}>
                      <TransitionLink
                        href={caseHref}
                        curtainLabel={project.title}
                        className="group/btn inline-flex items-center gap-2 text-sm font-medium text-[#0D0D0D]"
                      >
                        <RollingText
                          text={dict.work.explore}
                          groupHover={false}
                          italicClassName="text-base"
                        />
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-expo-out group-hover/btn:translate-x-1" />
                      </TransitionLink>
                    </MagneticField>

                    <MagneticField strength={0.18}>
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="pointer"
                        className="group/demo inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] text-[#73726C] uppercase transition-colors hover:text-[#0D0D0D]"
                      >
                        <span>{dict.work.liveDemo}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-expo-out group-hover/demo:-translate-y-0.5 group-hover/demo:translate-x-0.5" />
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
