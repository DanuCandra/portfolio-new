"use client";

import { useRef } from "react";
import { KineticArrow } from "@/components/motion/KineticArrow";
import { TransitionLink } from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import { EditorialProjectFrame } from "@/components/projects/EditorialProjectFrame";
import { localePath, pickText } from "@/i18n";
import type { Locale, ProjectItem } from "@/types/portfolio";

interface NextProjectCurtainProps {
  nextProject: ProjectItem;
  totalProjects: number;
  locale: Locale;
  headingLabel: string;
  allProjectsLabel: string;
}

/**
 * Act VI — Full-Bleed Matte Ink (#0D0D0D) Interactive Next-Project Curtain Finale.
 * - Hovering smoothly expands the preview window & lifts its dark veil.
 * - Clicking captures the exact live preview rect and launches our Velvet S-Curve FLIP Hero Morph
 *   straight into the next project's Hero Showcase!
 */
export function NextProjectCurtain({
  nextProject,
  totalProjects,
  locale,
  headingLabel,
  allProjectsLabel,
}: NextProjectCurtainProps) {
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const nextHref = localePath(locale, `/projects/${nextProject.slug}`);

  const resolveNextFlipRect = () => {
    const el = previewFrameRef.current;
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

  return (
    <footer
      data-surface="ink"
      aria-label={headingLabel}
      className="relative w-full overflow-hidden bg-[#0D0D0D] text-[#F5F4F0]"
    >
      <div className="mx-auto flex min-h-[86vh] max-w-[1380px] flex-col justify-between px-6 pb-12 pt-24 md:px-14 md:pb-14 md:pt-32">
        {/* Eyebrow Meta */}
        <div className="flex items-center justify-between border-b border-[#F5F4F0]/14 pb-6 font-mono text-[11px] tracking-[0.18em] text-[#A6A59E] uppercase">
          <span>{headingLabel}</span>
          <span className="tabular-nums">
            0{nextProject.order} / 0{totalProjects}
          </span>
        </div>

        {/* Full-Width Interactive Next-Project Spread */}
        <TransitionLink
          href={nextHref}
          mode="flip"
          flipProject={nextProject}
          getFlipRect={resolveNextFlipRect}
          curtainLabel={nextProject.title}
          cursorLabel={locale === "id" ? "Buka" : "Next"}
          className="group grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-12 lg:gap-14 lg:py-20"
        >
          {/* Left: Monumental Title & Info */}
          <div className="space-y-6 lg:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.16em] text-[#A6A59E] uppercase">
              {pickText(nextProject.categoryLabel, locale)} · {nextProject.year}
            </p>

            <h2 className="display-finale text-[#F5F4F0]">
              <RollingText text={nextProject.title} />
            </h2>

            <p className="max-w-lg text-sm leading-relaxed text-[#A6A59E] sm:text-base">
              {pickText(nextProject.tagline, locale)}
            </p>

            <div className="inline-flex items-center gap-3 pt-2 text-xs font-medium tracking-[0.1em] text-[#F5F4F0] uppercase">
              <span className="hairline-sweep">
                {locale === "id" ? "Buka Studi Kasus" : "Open Case Study"}
              </span>
              <KineticArrow
                direction="right"
                iconClassName="h-4 w-4 text-[#F5F4F0]"
              />
            </div>
          </div>

          {/* Right: Interactive Preview Window (FLIP Origin) */}
          <div className="lg:col-span-5">
            <div
              ref={previewFrameRef}
              className="relative aspect-[16/10] w-full overflow-hidden border border-[#F5F4F0]/16 bg-[#181817] transition-[border-color,transform] duration-[820ms] ease-spring-out group-hover:scale-[1.025] group-hover:border-[#F5F4F0]/36"
            >
              <div className="h-full w-full transition-transform duration-[920ms] ease-spring-out group-hover:scale-[1.04]">
                <EditorialProjectFrame project={nextProject} compact />
              </div>

              {/* Quiet dark veil that lifts smoothly on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#0D0D0D]/26 transition-opacity duration-700 ease-expo-out group-hover:opacity-0"
              />
            </div>
          </div>
        </TransitionLink>

        {/* Clean 1-Row Editorial Return Strip */}
        <div className="flex items-center justify-between border-t border-[#F5F4F0]/14 pt-7 text-xs text-[#A6A59E]">
          <TransitionLink
            href={`${localePath(locale, "/")}#work`}
            mode="shutter"
            className="group inline-flex items-center gap-2 text-[#A6A59E] transition-colors hover:text-[#F5F4F0]"
          >
            <KineticArrow direction="left" />
            <RollingText text={allProjectsLabel} underline />
          </TransitionLink>

          <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
            danucs.com
          </span>
        </div>
      </div>
    </footer>
  );
}
