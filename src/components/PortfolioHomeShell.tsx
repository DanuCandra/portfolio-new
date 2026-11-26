import { LocaleHtmlSync } from "@/components/i18n/LocaleHtmlSync";
import { CurvedPaperSheet } from "@/components/motion/CurvedPaperSheet";
import { MinimalNavbar } from "@/components/navigation/MinimalNavbar";
import { HeroPortalChoreography } from "@/components/sections/HeroPortalChoreography";
import { QuietStatementSection } from "@/components/sections/QuietStatementSection";
import { SelectedWorkSection } from "@/components/sections/SelectedWorkSection";
import { getPublishedProjects } from "@/lib/data/projects";
import type { Locale } from "@/types/portfolio";

export async function PortfolioHomeShell({ locale }: { locale: Locale }) {
  const projects = await getPublishedProjects();

  return (
    <main className="w-full bg-[#F5F4F0] text-[#0D0D0D]">
      <LocaleHtmlSync locale={locale} />
      <MinimalNavbar locale={locale} />

      {/* SCENE 1 + SCENE 2 — Reversible Aperture Split & Modern MacBook Pro Laravel Portal */}
      <HeroPortalChoreography locale={locale} />

      {/* SCENE 3 — Inside The Glass Quiet Statement (#0D0D0D) */}
      <QuietStatementSection locale={locale} />

      {/* SCENE 4 — Reversible Curved White Paper Sheet + Selected Work Dual-Mode Gallery */}
      <CurvedPaperSheet id="work">
        <SelectedWorkSection projects={projects} locale={locale} />
      </CurvedPaperSheet>

      <div id="contact" className="h-px bg-[#F5F4F0]" aria-hidden="true" />
    </main>
  );
}
