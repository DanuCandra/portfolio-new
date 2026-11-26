import { LocaleHtmlSync } from "@/components/i18n/LocaleHtmlSync";
import { InkFillButton } from "@/components/motion/InkFillButton";
import { KineticArrow } from "@/components/motion/KineticArrow";
import { MagneticField } from "@/components/motion/MagneticField";
import { MaskRevealText } from "@/components/motion/MaskRevealText";
import { TransitionLink } from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import { TrimLine } from "@/components/motion/TrimLine";
import { MinimalNavbar } from "@/components/navigation/MinimalNavbar";
import {
  CaseStudyVisualSpread,
  ParallaxHeroFrame,
} from "@/components/projects/CaseStudyVisualSpread";
import { NextProjectCurtain } from "@/components/projects/NextProjectCurtain";
import { getDictionary, localePath, pickText } from "@/i18n";
import type { Locale, ProjectItem } from "@/types/portfolio";

interface ProjectCaseStudyViewProps {
  project: ProjectItem;
  nextProject: ProjectItem | null;
  totalProjects: number;
  locale: Locale;
}

/**
 * 6-Act Awwwards Editorial Case Study View (Paper #F5F4F0 × Matte Ink #0D0D0D).
 * - Act I:   Cinematic Masthead + Scroll-Parallax Hero Stage (`data-flip-hero` FLIP Dock Target)
 * - Act II:  Oversized Staggered Impact Metrics Strip
 * - Act III: Sticky Split Chapter 01 — Editorial Narrative + High-Contrast Problem/Solution Spread
 * - Act IV:  Asymmetric Multi-Frame Visual Bento Spread (Opposing-Parallax Desktop + Mobile Frames)
 * - Act V:   Sticky Split Chapter 02 — Key Capabilities Ledger & Technology-to-Role Architecture Table
 * - Act VI:  Full-Bleed Matte Ink (#0D0D0D) Interactive Next-Project Curtain (FLIP Morph enabled)
 */
export function ProjectCaseStudyView({
  project,
  nextProject,
  totalProjects,
  locale,
}: ProjectCaseStudyViewProps) {
  const dict = getDictionary(locale);

  const stackRows =
    project.stackRoles && project.stackRoles.length > 0
      ? project.stackRoles.map((item) => ({
          name: item.name,
          role: pickText(item.role, locale),
        }))
      : project.techStack.map((tech) => ({
          name: tech,
          role: pickText(project.role, locale),
        }));

  return (
    <div className="min-h-screen w-full bg-[#F5F4F0] text-[#0D0D0D]">
      <LocaleHtmlSync locale={locale} />
      <MinimalNavbar locale={locale} />

      <main data-surface="paper" className="w-full bg-[#F5F4F0] text-[#0D0D0D]">
        <article className="mx-auto max-w-[1380px] px-6 pb-28 pt-32 md:px-14 md:pb-36 md:pt-40">
          {/* Top Back Navigation */}
          <div className="mb-12">
            <MagneticField strength={0.18}>
              <TransitionLink
                href={`${localePath(locale, "/")}#work`}
                mode="shutter"
                curtainLabel={dict.work.heading}
                className="group inline-flex items-center gap-2 text-xs text-[#73726C] transition-colors hover:text-[#0D0D0D]"
              >
                <KineticArrow direction="left" />
                <RollingText text={dict.caseStudy.back} underline />
              </TransitionLink>
            </MagneticField>
          </div>

          {/* ACT I — Cinematic Editorial Masthead */}
          <header className="space-y-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4 font-mono text-[11px] tracking-[0.14em] text-[#73726C] uppercase tabular-nums">
              <span>
                0{project.order} / 0{totalProjects} ·{" "}
                {pickText(project.categoryLabel, locale)}
              </span>
              <span>{project.year}</span>
            </div>

            <MaskRevealText
              as="h1"
              immediate
              delayMs={260}
              className="text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-[#0D0D0D] sm:text-7xl lg:text-[6rem]"
            >
              {project.title}
            </MaskRevealText>

            <div className="flex flex-col justify-between gap-8 pt-2 lg:flex-row lg:items-end">
              <p className="max-w-2xl text-lg leading-relaxed text-[#73726C] sm:text-xl">
                {pickText(project.tagline, locale)}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <InkFillButton
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  tone="dark-on-paper"
                  variant="solid"
                  cursorMode="pill"
                  cursorLabel="Live"
                  className="px-7 py-3.5 text-xs font-medium tracking-[0.02em]"
                >
                  <span>{dict.caseStudy.liveDemo}</span>
                  <KineticArrow direction="up-right" />
                </InkFillButton>

                {project.repoUrl ? (
                  <MagneticField strength={0.18}>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="pointer"
                      className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#0D0D0D]"
                    >
                      <RollingText text={dict.caseStudy.source} underline />
                      <KineticArrow direction="up-right" />
                    </a>
                  </MagneticField>
                ) : null}
              </div>
            </div>
          </header>

          <TrimLine immediate delayMs={160} className="my-12 bg-[#0D0D0D]/14" />

          {/* Centerpiece Scroll-Parallax Hero Stage (Pixel-Exact FLIP Morph Dock Target) */}
          <ParallaxHeroFrame project={project} />

          {/* Architectural 4-Column Metadata Strip */}
          <dl className="mt-12 grid grid-cols-2 gap-8 border-y border-[#0D0D0D]/12 py-8 lg:grid-cols-4">
            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-[#73726C] uppercase">
                {dict.caseStudy.role}
              </dt>
              <dd className="mt-2 text-sm font-medium text-[#0D0D0D]">
                {pickText(project.role, locale)}
              </dd>
            </div>

            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-[#73726C] uppercase">
                {dict.caseStudy.category}
              </dt>
              <dd className="mt-2 text-sm font-medium text-[#0D0D0D]">
                {pickText(project.categoryLabel, locale)}
              </dd>
            </div>

            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-[#73726C] uppercase">
                {dict.caseStudy.year}
              </dt>
              <dd className="mt-2 font-mono text-sm text-[#0D0D0D] tabular-nums">
                {project.year}
              </dd>
            </div>

            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-[#73726C] uppercase">
                {dict.caseStudy.stack}
              </dt>
              <dd className="mt-2 font-mono text-xs leading-relaxed text-[#0D0D0D]">
                {project.techStack.join(" · ")}
              </dd>
            </div>
          </dl>

          {/* ACT II — Oversized Animated Impact Metrics Strip */}
          {project.metrics.length > 0 ? (
            <section
              aria-label="Impact Metrics"
              className="grid grid-cols-1 divide-y divide-[#0D0D0D]/12 border-b border-[#0D0D0D]/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {project.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="py-10 sm:px-8 sm:py-14 sm:first:pl-0 sm:last:pr-0"
                >
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[#73726C] tabular-nums">
                    M-0{idx + 1}
                  </span>
                  <MaskRevealText
                    as="p"
                    delayMs={idx * 90}
                    className="mt-4 text-4xl font-medium tracking-[-0.045em] text-[#0D0D0D] tabular-nums sm:text-5xl lg:text-6xl"
                  >
                    {metric.value}
                  </MaskRevealText>
                  <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-[#73726C] uppercase">
                    {pickText(metric.label, locale)}
                  </p>
                </div>
              ))}
            </section>
          ) : null}

          {/* ACT III — Sticky Split Chapter 01: Narrative & High-Contrast Challenge/Solution */}
          <section className="mt-24 grid grid-cols-1 gap-12 lg:mt-32 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-4 lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.16em] text-[#73726C] tabular-nums">
                  01
                </span>
                <span className="h-[1px] w-10 bg-[#0D0D0D]/20" aria-hidden="true" />
                <h2 className="font-mono text-[11px] tracking-[0.18em] text-[#0D0D0D] uppercase">
                  {dict.caseStudy.overview}
                </h2>
              </div>

              <p className="max-w-xs text-xs leading-relaxed text-[#73726C]">
                {pickText(project.summary, locale)}
              </p>
            </div>

            <div className="space-y-12 lg:col-span-8">
              <MaskRevealText
                as="p"
                className="text-2xl font-normal leading-[1.32] tracking-[-0.025em] text-[#0D0D0D] sm:text-3xl lg:text-[2.15rem]"
              >
                {pickText(project.overview, locale)}
              </MaskRevealText>

              {/* High-Contrast Asymmetric Problem (Paper Pure) ↔ Solution (Matte Ink) Spread */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col justify-between border border-[#0D0D0D]/12 bg-[#FAF9F6] p-7 sm:p-9">
                  <div className="flex items-center justify-between border-b border-[#0D0D0D]/10 pb-4 font-mono text-[10px] tracking-[0.18em] text-[#73726C] uppercase">
                    <span>{dict.caseStudy.problem}</span>
                    <span>A</span>
                  </div>
                  <p className="mt-7 text-sm leading-relaxed text-[#0D0D0D]/85 sm:text-[15px]">
                    {pickText(project.problem, locale)}
                  </p>
                </div>

                <div className="flex flex-col justify-between border border-[#0D0D0D] bg-[#0D0D0D] p-7 text-[#F5F4F0] sm:p-9">
                  <div className="flex items-center justify-between border-b border-[#F5F4F0]/14 pb-4 font-mono text-[10px] tracking-[0.18em] text-[#A6A59E] uppercase">
                    <span>{dict.caseStudy.solution}</span>
                    <span>B</span>
                  </div>
                  <p className="mt-7 text-sm leading-relaxed text-[#F5F4F0]/90 sm:text-[15px]">
                    {pickText(project.solution, locale)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ACT IV — Multi-Frame Editorial Visual Bento Spread (Opposing-Parallax Desktop + Mobile) */}
          <div className="mt-24 lg:mt-32">
            <CaseStudyVisualSpread
              project={project}
              locale={locale}
              desktopCaption={dict.caseStudy.desktopCaption}
              mobileCaption={dict.caseStudy.mobileCaption}
            />
          </div>

          {/* ACT V — Sticky Split Chapter 02: Capabilities Ledger & System Stack Breakdown */}
          <section className="mt-24 grid grid-cols-1 gap-12 border-t border-[#0D0D0D]/12 pt-20 lg:mt-32 lg:grid-cols-12 lg:gap-16 lg:pt-24">
            <div className="space-y-4 lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.16em] text-[#73726C] tabular-nums">
                  02
                </span>
                <span className="h-[1px] w-10 bg-[#0D0D0D]/20" aria-hidden="true" />
                <h2 className="font-mono text-[11px] tracking-[0.18em] text-[#0D0D0D] uppercase">
                  {dict.caseStudy.architecture}
                </h2>
              </div>

              <p className="max-w-xs text-sm leading-relaxed text-[#73726C]">
                {pickText(project.architectureNotes, locale)}
              </p>
            </div>

            <div className="space-y-16 lg:col-span-8">
              {/* Interactive Capabilities Ledger */}
              <div>
                <h3 className="mb-4 font-mono text-[10px] tracking-[0.18em] text-[#73726C] uppercase">
                  {dict.caseStudy.features}
                </h3>
                <ul className="divide-y divide-[#0D0D0D]/12 border-y border-[#0D0D0D]/12">
                  {project.features[locale].map((feat, idx) => (
                    <li
                      key={idx}
                      className="group flex items-baseline gap-6 py-5 transition-colors duration-300 hover:bg-[#FAF9F6]/80 sm:px-3 sm:py-6"
                    >
                      <span className="w-7 shrink-0 font-mono text-[11px] text-[#73726C] tabular-nums">
                        0{idx + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-[#0D0D0D] transition-transform duration-500 ease-spring-out group-hover:translate-x-1.5 sm:text-base">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clean Swiss Technology -> System Responsibility Table */}
              <div>
                <h3 className="mb-4 font-mono text-[10px] tracking-[0.18em] text-[#73726C] uppercase">
                  {dict.caseStudy.stackBreakdown}
                </h3>
                <div className="divide-y divide-[#0D0D0D]/12 border-y border-[#0D0D0D]/12">
                  {stackRows.map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                    >
                      <span className="font-mono text-xs font-medium tracking-[0.04em] text-[#0D0D0D] sm:col-span-4">
                        {row.name}
                      </span>
                      <span className="text-sm leading-relaxed text-[#73726C] sm:col-span-8">
                        {row.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* ACT VI — Full-Bleed Matte Ink Interactive Next-Project Curtain Finale */}
      {nextProject ? (
        <NextProjectCurtain
          nextProject={nextProject}
          totalProjects={totalProjects}
          locale={locale}
          headingLabel={dict.caseStudy.nextProject}
          allProjectsLabel={dict.caseStudy.allProjects}
        />
      ) : null}
    </div>
  );
}
