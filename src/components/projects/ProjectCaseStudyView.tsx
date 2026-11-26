import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { LocaleHtmlSync } from "@/components/i18n/LocaleHtmlSync";
import { MagneticField } from "@/components/motion/MagneticField";
import { TransitionLink } from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import { TrimLine } from "@/components/motion/TrimLine";
import { MinimalNavbar } from "@/components/navigation/MinimalNavbar";
import { EditorialProjectFrame } from "@/components/projects/EditorialProjectFrame";
import { getDictionary, localePath, pickText } from "@/i18n";
import type { Locale, ProjectItem } from "@/types/portfolio";

interface ProjectCaseStudyViewProps {
  project: ProjectItem;
  nextProject: ProjectItem | null;
  totalProjects: number;
  locale: Locale;
}

/**
 * Editorial Print-Magazine Case Study View (#F5F4F0 Paper).
 * Gaya majalah arsitektur Kinfolk × Apple Newsroom: lega, tenang, tipografi presisi,
 * lengkap dengan tombol Live Demo ↗, Source Code ↗, dan transisi ke Next Project.
 */
export function ProjectCaseStudyView({
  project,
  nextProject,
  totalProjects,
  locale,
}: ProjectCaseStudyViewProps) {
  const dict = getDictionary(locale);

  return (
    <main
      data-surface="paper"
      className="min-h-screen w-full bg-[#F5F4F0] text-[#0D0D0D]"
    >
      <LocaleHtmlSync locale={locale} />
      <MinimalNavbar locale={locale} />

      <article className="mx-auto max-w-[1280px] px-6 pb-28 pt-32 md:px-14 md:pt-40">
        {/* Top Back Navigation */}
        <div className="mb-12">
          <MagneticField strength={0.18}>
            <TransitionLink
              href={localePath(locale, "/")}
              curtainLabel={dict.work.heading}
              className="group inline-flex items-center gap-2 text-xs text-[#73726C] transition-colors hover:text-[#0D0D0D]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 ease-expo-out group-hover:-translate-x-1" />
              <RollingText text={dict.caseStudy.back} italicClassName="text-sm" />
            </TransitionLink>
          </MagneticField>
        </div>

        {/* Magazine Header */}
        <header className="space-y-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 font-mono text-[11px] text-[#73726C] tabular-nums">
            <span>
              0{project.order} / 0{totalProjects} ·{" "}
              {pickText(project.categoryLabel, locale)}
            </span>
            <span>{project.year}</span>
          </div>

          <h1 className="text-5xl font-medium leading-[0.96] tracking-[-0.045em] text-[#0D0D0D] sm:text-7xl lg:text-[5.5rem]">
            {project.title}
          </h1>

          <div className="flex flex-col justify-between gap-8 pt-2 lg:flex-row lg:items-end">
            <p className="max-w-2xl text-lg leading-relaxed text-[#73726C] sm:text-xl">
              {pickText(project.tagline, locale)}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <MagneticField strength={0.2}>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="pill"
                  data-cursor-label="Live"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#0D0D0D] px-6 py-3 text-xs font-medium text-[#F5F4F0] transition-opacity hover:opacity-85"
                >
                  <RollingText
                    text={dict.caseStudy.liveDemo}
                    italicClassName="text-sm"
                  />
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </MagneticField>

              {project.repoUrl ? (
                <MagneticField strength={0.18}>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="pointer"
                    className="group inline-flex items-center gap-1 border-b border-[#0D0D0D]/30 pb-0.5 text-xs text-[#0D0D0D] transition-colors hover:border-[#0D0D0D]"
                  >
                    <RollingText
                      text={dict.caseStudy.source}
                      italicClassName="text-sm"
                    />
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </MagneticField>
              ) : null}
            </div>
          </div>
        </header>

        <TrimLine immediate delayMs={120} className="my-12 bg-[#0D0D0D]/12" />

        {/* Large Centerpiece Editorial Frame */}
        <div className="aspect-[16/10] w-full overflow-hidden border border-[#0D0D0D]/10 bg-[#EAE8E1]">
          <EditorialProjectFrame project={project} />
        </div>

        {/* Quiet 4-Column Metadata Strip */}
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
              {dict.caseStudy.year}
            </dt>
            <dd className="mt-2 font-mono text-sm text-[#0D0D0D] tabular-nums">
              {project.year}
            </dd>
          </div>

          <div className="col-span-2">
            <dt className="font-mono text-[10px] tracking-[0.16em] text-[#73726C] uppercase">
              {dict.caseStudy.stack}
            </dt>
            <dd className="mt-2 font-mono text-xs text-[#0D0D0D]">
              {project.techStack.join(" · ")}
            </dd>
          </div>
        </dl>

        {/* Key Numbers Strip */}
        {project.metrics.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 border-b border-[#0D0D0D]/12 py-10">
            {project.metrics.map((metric, idx) => (
              <div key={idx}>
                <p className="text-2xl font-medium tracking-[-0.03em] text-[#0D0D0D] sm:text-4xl">
                  {metric.value}
                </p>
                <p className="mt-1.5 font-mono text-[10px] tracking-[0.14em] text-[#73726C] uppercase">
                  {pickText(metric.label, locale)}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {/* Editorial Magazine Story Sections */}
        <div className="mt-20 space-y-20">
          {/* Overview */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-[#73726C] uppercase lg:col-span-4">
              {dict.caseStudy.overview}
            </h2>
            <p className="text-lg leading-relaxed text-[#0D0D0D] lg:col-span-8 sm:text-xl">
              {pickText(project.overview, locale)}
            </p>
          </section>

          {/* Challenge & Solution */}
          <section className="grid grid-cols-1 gap-12 border-t border-[#0D0D0D]/10 pt-16 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-6">
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-[#73726C] uppercase">
                {dict.caseStudy.problem}
              </h2>
              <p className="text-sm leading-relaxed text-[#0D0D0D]/80 sm:text-base">
                {pickText(project.problem, locale)}
              </p>
            </div>

            <div className="space-y-3 lg:col-span-6">
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-[#73726C] uppercase">
                {dict.caseStudy.solution}
              </h2>
              <p className="text-sm leading-relaxed text-[#0D0D0D]/80 sm:text-base">
                {pickText(project.solution, locale)}
              </p>
            </div>
          </section>

          {/* Key Capabilities */}
          <section className="grid grid-cols-1 gap-6 border-t border-[#0D0D0D]/10 pt-16 lg:grid-cols-12">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-[#73726C] uppercase lg:col-span-4">
              {dict.caseStudy.features}
            </h2>
            <ul className="divide-y divide-[#0D0D0D]/10 lg:col-span-8">
              {project.features[locale].map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-baseline gap-5 py-4 text-sm text-[#0D0D0D] sm:text-base"
                >
                  <span className="font-mono text-[11px] text-[#73726C] tabular-nums">
                    0{idx + 1}
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Architecture */}
          <section className="grid grid-cols-1 gap-6 border-t border-[#0D0D0D]/10 pt-16 lg:grid-cols-12">
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-[#73726C] uppercase lg:col-span-4">
              {dict.caseStudy.architecture}
            </h2>
            <p className="text-sm leading-relaxed text-[#0D0D0D]/80 lg:col-span-8 sm:text-base">
              {pickText(project.architectureNotes, locale)}
            </p>
          </section>
        </div>

        {/* Next Project Editorial Footer */}
        {nextProject ? (
          <div className="mt-28 border-t border-[#0D0D0D]/14 pt-14">
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#73726C] uppercase">
              {dict.caseStudy.nextProject}
            </p>

            <TransitionLink
              href={localePath(locale, `/projects/${nextProject.slug}`)}
              curtainLabel={nextProject.title}
              cursorLabel={locale === "id" ? "Buka" : "Next"}
              className="group mt-4 flex items-baseline justify-between gap-6"
            >
              <span className="display-index text-[#0D0D0D]">
                <RollingText
                  text={nextProject.title}
                  italicClassName="font-normal tracking-[-0.02em]"
                />
              </span>
              <ArrowRight className="h-7 w-7 shrink-0 text-[#0D0D0D] transition-transform duration-500 ease-expo-out group-hover:translate-x-2" />
            </TransitionLink>
          </div>
        ) : null}
      </article>
    </main>
  );
}
