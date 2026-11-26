"use client";

import { useEffect, useRef } from "react";
import { EditorialProjectFrame } from "@/components/projects/EditorialProjectFrame";
import { motionState } from "@/lib/motion-store";
import { pickText } from "@/i18n";
import type { Locale, ProjectItem } from "@/types/portfolio";

interface ParallaxHeroFrameProps {
  project: ProjectItem;
}

/**
 * Scroll-Linked Inner Parallax Hero Showcase (dock target for Shared-Element FLIP Morph).
 * - Zero React re-renders per frame; strictly GPU translate3d.
 * - Preserves exact `[data-flip-hero]` bounding box for pixel-exact FLIP docking.
 */
export function ParallaxHeroFrame({ project }: ParallaxHeroFrameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const host = hostRef.current;
      const inner = innerRef.current;
      if (host && inner) {
        if (motionState.reducedMotion) {
          inner.style.transform = "translate3d(0, 0, 0) scale(1)";
        } else {
          const rect = host.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const centerOffset = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
          const shiftY = Math.max(-28, Math.min(28, centerOffset * 34));
          inner.style.transform = `translate3d(0, ${shiftY.toFixed(2)}px, 0) scale(1.06)`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={hostRef}
      data-flip-hero={project.slug}
      className="relative aspect-[16/10] w-full overflow-hidden border border-[#0D0D0D]/12 bg-[#EAE8E1]"
    >
      <div ref={innerRef} className="h-full w-full will-change-transform">
        <EditorialProjectFrame project={project} />
      </div>
    </div>
  );
}

interface CaseStudyVisualSpreadProps {
  project: ProjectItem;
  locale: Locale;
  desktopCaption: string;
  mobileCaption: string;
}

/**
 * Multi-Frame Asymmetric Bento Visual Spread (Desktop Detail + Sculptural Mobile Viewport).
 * - Opposing scroll-linked parallax velocities create tactile editorial depth.
 * - Automatically displays real `project.galleryImages` if supplied later in Phase 2 Admin Panel.
 */
export function CaseStudyVisualSpread({
  project,
  locale,
  desktopCaption,
  mobileCaption,
}: CaseStudyVisualSpreadProps) {
  const spreadRef = useRef<HTMLDivElement>(null);
  const desktopInnerRef = useRef<HTMLDivElement>(null);
  const mobilePedestalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const spread = spreadRef.current;
      const isDesktop = window.innerWidth >= 1024;
      if (spread && !motionState.reducedMotion && isDesktop) {
        const rect = spread.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const offset = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;

        if (desktopInnerRef.current) {
          const y1 = Math.max(-22, Math.min(22, offset * 28));
          desktopInnerRef.current.style.transform = `translate3d(0, ${y1.toFixed(2)}px, 0) scale(1.05)`;
        }

        if (mobilePedestalRef.current) {
          const y2 = Math.max(-24, Math.min(24, -offset * 30));
          mobilePedestalRef.current.style.transform = `translate3d(0, ${y2.toFixed(2)}px, 0)`;
        }
      } else {
        if (desktopInnerRef.current) {
          desktopInnerRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
        }
        if (mobilePedestalRef.current) {
          mobilePedestalRef.current.style.transform = "translate3d(0, 0, 0)";
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const galleryDesktop = project.galleryImages?.[0];
  const galleryMobile = project.galleryImages?.[1];

  return (
    <section
      ref={spreadRef}
      aria-label="Visual Showcase"
      className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
    >
      {/* Left: 7-Col Wide Architectural Desktop Detail Frame (auto height on mobile to prevent clipping) */}
      <figure className="flex flex-col lg:col-span-7">
        <div className="relative w-full overflow-hidden border border-[#0D0D0D]/12 bg-[#EAE8E1] sm:aspect-[16/11]">
          <div
            ref={desktopInnerRef}
            className="h-full w-full will-change-transform"
          >
            {galleryDesktop ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={galleryDesktop}
                alt={`${project.title} — ${desktopCaption}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <DesktopSystemDetailPlate project={project} locale={locale} />
            )}
          </div>
        </div>
        <figcaption className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#73726C] uppercase">
          <span>01 / {desktopCaption}</span>
          <span>{project.slug}.danucs.com</span>
        </figcaption>
      </figure>

      {/* Right: 5-Col Minimalist Mobile Device Pedestal Frame (generous mobile padding so phone bezel never crops) */}
      <figure className="flex flex-col lg:col-span-5">
        <div className="relative flex w-full items-center justify-center overflow-hidden border border-[#0D0D0D]/12 bg-[#ECEAE4] px-6 py-10 sm:py-12 lg:h-full lg:p-8">
          <div
            ref={mobilePedestalRef}
            className="w-[216px] sm:w-[235px] will-change-transform"
          >
            {/* Slim Space-Black Mobile Bezel */}
            <div className="overflow-hidden rounded-[26px] border-[5px] border-[#0D0D0D] bg-[#0D0D0D] shadow-[0_32px_70px_-24px_rgba(13,13,13,0.45)]">
              {/* Top Dynamic Pill */}
              <div className="flex items-center justify-center bg-[#0D0D0D] py-2">
                <span className="h-[5px] w-12 rounded-full bg-[#242422]" />
              </div>

              {/* Mobile Viewport Interior */}
              <div className="aspect-[9/15] w-full overflow-hidden rounded-b-[20px] bg-[#FAF9F6]">
                {galleryMobile ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={galleryMobile}
                    alt={`${project.title} — ${mobileCaption}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MobileViewportPreview project={project} locale={locale} />
                )}
              </div>
            </div>
          </div>
        </div>
        <figcaption className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#73726C] uppercase">
          <span>02 / {mobileCaption}</span>
          <span>Responsive</span>
        </figcaption>
      </figure>
    </section>
  );
}

/**
 * Editorial monochrome zoomed architecture & interface specification plate
 * (used when Phase-1 showcase projects have no uploaded gallery image yet).
 */
function DesktopSystemDetailPlate({
  project,
  locale,
}: {
  project: ProjectItem;
  locale: Locale;
}) {
  const primaryFeatures = project.features[locale].slice(0, 3);
  const darkSurface =
    project.mockupVariant === "aether-ai" ||
    project.mockupVariant === "kinetix-studio";

  return (
    <div
      className={
        darkSurface
          ? "flex h-full w-full flex-col justify-between bg-[#0D0D0D] p-7 text-[#F5F4F0] sm:p-10"
          : "flex h-full w-full flex-col justify-between bg-[#FAF9F6] p-7 text-[#0D0D0D] sm:p-10"
      }
    >
      {/* Top Plate Header */}
      <div
        className={
          darkSurface
            ? "flex items-center justify-between border-b border-[#F5F4F0]/12 pb-4 font-mono text-[10px] tracking-[0.16em] text-[#A6A59E] uppercase"
            : "flex items-center justify-between border-b border-[#0D0D0D]/10 pb-4 font-mono text-[10px] tracking-[0.16em] text-[#73726C] uppercase"
        }
      >
        <span>{project.title} · Architecture Plate</span>
        <span>0{project.order} / SPEC</span>
      </div>

      {/* Center Modular Blueprint Grid */}
      <div className="my-auto grid grid-cols-1 gap-3 py-6 sm:grid-cols-3">
        {primaryFeatures.map((feat, idx) => (
          <div
            key={idx}
            className={
              darkSurface
                ? "flex flex-col justify-between border border-[#F5F4F0]/14 bg-[#151514] p-4"
                : "flex flex-col justify-between border border-[#0D0D0D]/10 bg-[#F5F4F0] p-4"
            }
          >
            <span
              className={
                darkSurface
                  ? "font-mono text-[9px] tracking-[0.16em] text-[#A6A59E]"
                  : "font-mono text-[9px] tracking-[0.16em] text-[#73726C]"
              }
            >
              MOD-0{idx + 1}
            </span>
            <p className="mt-5 text-xs leading-relaxed font-medium">{feat}</p>
          </div>
        ))}
      </div>

      {/* Bottom Metric Rail */}
      <div
        className={
          darkSurface
            ? "grid grid-cols-3 gap-4 border-t border-[#F5F4F0]/12 pt-4"
            : "grid grid-cols-3 gap-4 border-t border-[#0D0D0D]/10 pt-4"
        }
      >
        {project.metrics.map((m, idx) => (
          <div key={idx}>
            <span className="block font-mono text-sm font-medium tabular-nums sm:text-base">
              {m.value}
            </span>
            <span
              className={
                darkSurface
                  ? "mt-0.5 block font-mono text-[8px] tracking-[0.14em] text-[#A6A59E] uppercase"
                  : "mt-0.5 block font-mono text-[8px] tracking-[0.14em] text-[#73726C] uppercase"
              }
            >
              {pickText(m.label, locale)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileViewportPreview({
  project,
  locale,
}: {
  project: ProjectItem;
  locale: Locale;
}) {
  const darkSurface =
    project.mockupVariant === "aether-ai" ||
    project.mockupVariant === "kinetix-studio";

  return (
    <div
      className={
        darkSurface
          ? "flex h-full w-full flex-col justify-between bg-[#121211] p-4 text-[#F5F4F0]"
          : "flex h-full w-full flex-col justify-between bg-[#FAF9F6] p-4 text-[#0D0D0D]"
      }
    >
      <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.14em] opacity-60 uppercase">
        <span>{project.slug.split("-")[0]}</span>
        <span>{project.year}</span>
      </div>

      <div className="my-auto space-y-3 py-3">
        <p className="text-base leading-tight font-medium tracking-[-0.03em]">
          {project.title}
        </p>
        <p className="text-[10px] leading-relaxed opacity-70">
          {pickText(project.tagline, locale)}
        </p>

        <div
          className={
            darkSurface
              ? "space-y-1.5 border-t border-[#F5F4F0]/12 pt-3"
              : "space-y-1.5 border-t border-[#0D0D0D]/10 pt-3"
          }
        >
          {project.metrics.slice(0, 2).map((m, idx) => (
            <div
              key={idx}
              className="flex items-baseline justify-between font-mono text-[9px]"
            >
              <span className="opacity-60">{pickText(m.label, locale)}</span>
              <span className="font-medium tabular-nums">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={
          darkSurface
            ? "flex items-center justify-between border-t border-[#F5F4F0]/12 pt-2.5 font-mono text-[8px] tracking-[0.12em] opacity-70 uppercase"
            : "flex items-center justify-between border-t border-[#0D0D0D]/10 pt-2.5 font-mono text-[8px] tracking-[0.12em] opacity-70 uppercase"
        }
      >
        <span>{project.techStack[0]}</span>
        <span>LIVE ↗</span>
      </div>
    </div>
  );
}
