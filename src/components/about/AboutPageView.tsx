import { AboutBridgeFooter } from "@/components/about/AboutBridgeFooter";
import { AboutInterludeBand } from "@/components/about/AboutInterludeBand";
import { OpticalPortraitCanvas } from "@/components/about/OpticalPortraitCanvas";
import { QuietColophonLedger } from "@/components/about/QuietColophonLedger";
import { LocaleHtmlSync } from "@/components/i18n/LocaleHtmlSync";
import { MaskRevealText } from "@/components/motion/MaskRevealText";
import { TrimLine } from "@/components/motion/TrimLine";
import { MinimalNavbar } from "@/components/navigation/MinimalNavbar";
import { getDictionary, pickText } from "@/i18n";
import type { Locale, ProfileData } from "@/types/portfolio";

interface AboutPageViewProps {
  locale: Locale;
  profile: ProfileData;
}

/**
 * 4-Act Editorial Monograph `/about` & `/en/about` Page View.
 * Menerima `profile` secara penuh dari Repository (`getProfileData`) sehingga seluruh teks,
 * foto portrait, quote, pengalaman, dan pendidikan siap dikelola langsung lewat Admin Panel Fase 2.
 */
export function AboutPageView({ locale, profile }: AboutPageViewProps) {
  const dict = getDictionary(locale);
  const about = profile.about;
  const headline = about.headline[locale];

  return (
    <div className="min-h-screen w-full bg-[#F5F4F0] text-[#0D0D0D]">
      <LocaleHtmlSync locale={locale} />
      <MinimalNavbar locale={locale} />

      {/* ACT I — 80% Visual Spotlight: Editorial Profile & Optical Portrait */}
      <main data-surface="paper" className="w-full bg-[#F5F4F0] text-[#0D0D0D]">
        <section className="mx-auto max-w-[1380px] px-6 pb-28 pt-32 md:px-14 md:pb-36 md:pt-40">
          {/* Top Architectural Eyebrow */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 font-mono text-[11px] tracking-[0.16em] text-[#73726C] uppercase">
            <span>{dict.about.eyebrow}</span>
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#0D0D0D]"
              />
              <span>
                {pickText(about.publicLocation, locale)} ·{" "}
                {dict.about.availability}
              </span>
            </span>
          </div>

          {/* Monumental Semantic H1 Masthead */}
          <MaskRevealText
            as="h1"
            immediate
            delayMs={120}
            className="mt-8 max-w-[19ch] text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-[#0D0D0D] sm:text-6xl lg:text-[4.75rem]"
          >
            <span>{headline.lead}</span>{" "}
            <span className="font-editorial-serif italic font-normal">
              {headline.italic}
            </span>{" "}
            <span>{headline.tail}</span>
          </MaskRevealText>

          <TrimLine immediate delayMs={180} className="my-12 bg-[#0D0D0D]/14 md:my-16" />

          {/* Asymmetric 12-Column Editorial Spread */}
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Left (5 cols, Sticky on Desktop): Optical Darkroom Loupe Portrait */}
            <div className="mx-auto w-full max-w-[440px] lg:sticky lg:top-28 lg:col-span-5 lg:mx-0 lg:max-w-none">
              <OpticalPortraitCanvas
                src={about.portraitImage}
                alt={pickText(about.portraitAlt, locale)}
                locale={locale}
                immediate
                caption={`${profile.fullName} · ${pickText(about.publicLocation, locale)}`}
              />
            </div>

            {/* Right (7 cols): High-Contrast Editorial Narrative + Principles + Capabilities */}
            <div className="space-y-16 lg:col-span-7 lg:pl-4">
              {/* Main Profile Narrative */}
              <div className="space-y-7">
                <p className="text-xl font-normal leading-[1.48] tracking-[-0.02em] text-[#0D0D0D] sm:text-2xl">
                  {about.paragraphs[locale][0]}
                </p>
                <p className="text-base leading-relaxed text-[#73726C] sm:text-[17px]">
                  {about.paragraphs[locale][1]}
                </p>
              </div>

              {/* 3 Quiet Architectural Craft Principles (1px Hairline Rows, Zero Card Clutter) */}
              <div>
                <h2 className="mb-5 font-mono text-[10px] tracking-[0.2em] text-[#73726C] uppercase">
                  {dict.about.principlesHeading}
                </h2>
                <ol className="divide-y divide-[#0D0D0D]/12 border-y border-[#0D0D0D]/12">
                  {about.principles.map((principle) => (
                    <li
                      key={principle.number}
                      className="group grid grid-cols-1 gap-3 py-6 transition-colors duration-300 hover:bg-[#FAF9F6]/70 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:px-2"
                    >
                      <div className="flex items-baseline gap-4 sm:col-span-5">
                        <span className="font-mono text-[11px] text-[#73726C] tabular-nums">
                          {principle.number}
                        </span>
                        <h3 className="text-base font-medium tracking-[-0.02em] text-[#0D0D0D] transition-transform duration-500 ease-spring-out group-hover:translate-x-1">
                          {pickText(principle.title, locale)}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-[#73726C] sm:col-span-7">
                        {pickText(principle.description, locale)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Clean Swiss Typographic Capability Index (Zero Percentage Bars) */}
              <div>
                <h2 className="mb-5 font-mono text-[10px] tracking-[0.2em] text-[#73726C] uppercase">
                  {dict.about.capabilitiesHeading}
                </h2>
                <div className="divide-y divide-[#0D0D0D]/12 border-y border-[#0D0D0D]/12">
                  {about.capabilities.map((group, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                    >
                      <span className="font-mono text-[11px] tracking-[0.04em] text-[#0D0D0D] sm:col-span-5">
                        {pickText(group.label, locale)}
                      </span>
                      <span className="font-mono text-xs leading-relaxed text-[#73726C] sm:col-span-7">
                        {group.items.join(" · ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACT II — Matte Ink (#0D0D0D) Rhythm Interlude Band */}
        <AboutInterludeBand
          locale={locale}
          interlude={about.interlude}
          stripItems={about.interludeStrip}
        />

        {/* ACT III — 20% Quiet Colophon: Understated Experience & Education Ledger */}
        <QuietColophonLedger
          locale={locale}
          colophonEyebrow={dict.about.colophonEyebrow}
          experienceHeading={dict.about.experienceHeading}
          educationHeading={dict.about.educationHeading}
          expandHint={dict.about.expandHint}
          experience={about.experience}
          education={about.education}
        />
      </main>

      {/* ACT IV — Matte Ink Bridge Footer */}
      <AboutBridgeFooter locale={locale} profile={profile} />
    </div>
  );
}
