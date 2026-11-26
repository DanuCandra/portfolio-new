import { LocaleHtmlSync } from "@/components/i18n/LocaleHtmlSync";
import { TransitionLink } from "@/components/motion/PageTransitionProvider";
import { MinimalNavbar } from "@/components/navigation/MinimalNavbar";
import { getDictionary, localePath, pickText } from "@/i18n";
import type { Locale, ProjectItem } from "@/types/portfolio";

interface ProjectCaseStudyViewProps {
  project: ProjectItem;
  nextProject: ProjectItem | null;
  totalProjects: number;
  locale: Locale;
}

export function ProjectCaseStudyView({
  project,
  nextProject,
  locale,
}: ProjectCaseStudyViewProps) {
  const dict = getDictionary(locale);

  return (
    <main
      data-surface="paper"
      className="min-h-screen bg-[#F5F4F0] px-6 pb-24 pt-32 text-[#0D0D0D] md:px-14"
    >
      <LocaleHtmlSync locale={locale} />
      <MinimalNavbar locale={locale} />
      <div className="mx-auto max-w-4xl space-y-8">
        <TransitionLink
          href={localePath(locale, "/")}
          curtainLabel="Danu Candra"
          className="inline-block text-xs tracking-[0.14em] text-[#73726C] uppercase hover:text-[#0D0D0D]"
        >
          ← {dict.caseStudy.back}
        </TransitionLink>

        <div className="space-y-3">
          <p className="font-mono text-xs text-[#73726C]">
            {pickText(project.categoryLabel, locale)} · {project.year}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            {project.title}
          </h1>
          <p className="max-w-2xl text-base text-[#73726C]">
            {pickText(project.summary, locale)}
          </p>
        </div>

        {nextProject ? (
          <div className="border-t border-[#0D0D0D]/10 pt-8">
            <TransitionLink
              href={localePath(locale, `/projects/${nextProject.slug}`)}
              curtainLabel={nextProject.title}
              className="text-sm font-medium text-[#0D0D0D] underline-offset-4 hover:underline"
            >
              {dict.caseStudy.nextProject}: {nextProject.title} →
            </TransitionLink>
          </div>
        ) : null}
      </div>
    </main>
  );
}
