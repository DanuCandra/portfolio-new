"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { InkFillButton } from "@/components/motion/InkFillButton";
import { KineticArrow } from "@/components/motion/KineticArrow";
import { MagneticField } from "@/components/motion/MagneticField";
import { usePageTransition } from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import { getDictionary, localePath } from "@/i18n";
import { cn } from "@/lib/cn";
import type { Locale, ProfileData } from "@/types/portfolio";

interface AboutBridgeFooterProps {
  locale: Locale;
  profile: ProfileData;
}

/**
 * ACT IV of `/about` — Matte Ink (#0D0D0D) Bridge Footer.
 * Menerima `profile` secara dinamis dari Server Component (siap dikelola di Admin Panel Fase 2).
 */
export function AboutBridgeFooter({ locale, profile }: AboutBridgeFooterProps) {
  const dict = getDictionary(locale);
  const { navigateWithShutter, scrollWithGlide } = usePageTransition();
  const [copied, setCopied] = useState(false);

  const github = profile.socials.find((s) => s.id === "github");
  const linkedin = profile.socials.find((s) => s.id === "linkedin");

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer
      data-surface="ink"
      aria-label={dict.about.bridgeEyebrow}
      className="relative w-full overflow-hidden bg-[#0D0D0D] text-[#F5F4F0]"
    >
      <div className="mx-auto flex max-w-[1380px] flex-col justify-between px-6 pb-10 pt-24 md:px-14 md:pb-12 md:pt-32">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
          <div className="space-y-5">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#A6A59E] uppercase">
              {dict.about.bridgeEyebrow}
            </p>
            <h2 className="display-finale max-w-3xl text-[#F5F4F0]">
              <span>{dict.about.bridgeLead}</span>{" "}
              <span className="font-editorial-serif italic font-normal">
                {dict.about.bridgeItalic}
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <InkFillButton
              type="button"
              onClick={() =>
                navigateWithShutter(localePath(locale, "/"), dict.work.heading, {
                  hash: "#work",
                })
              }
              tone="light-on-ink"
              variant="solid"
              magneticStrength={0.2}
              cursorMode="pill"
              cursorLabel={locale === "id" ? "Karya" : "Work"}
              className="px-7 py-4 text-xs font-medium tracking-[0.04em] uppercase"
            >
              <span>{dict.about.exploreWork}</span>
              <KineticArrow direction="right" />
            </InkFillButton>

            <InkFillButton
              type="button"
              onClick={handleCopyEmail}
              tone="light-on-ink"
              variant="outline"
              lockedFill={copied}
              magneticStrength={0.2}
              cursorMode="pill"
              cursorLabel={copied ? "✓" : locale === "id" ? "Salin" : "Copy"}
              ariaLabel={`${dict.contact.copyPrompt}: ${profile.email}`}
              className="px-7 py-4 text-xs font-medium sm:text-sm"
            >
              <span className="relative block h-[1.35em] overflow-hidden">
                <span
                  className={cn(
                    "block transition-transform duration-500 ease-spring-out",
                    copied ? "-translate-y-full" : "translate-y-0"
                  )}
                >
                  {profile.email}
                </span>
                <span
                  aria-hidden={!copied}
                  className={cn(
                    "absolute inset-0 flex items-center justify-center gap-2 font-medium transition-transform duration-500 ease-spring-out",
                    copied ? "translate-y-0" : "translate-y-full"
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{dict.contact.copied}</span>
                </span>
              </span>
            </InkFillButton>
          </div>
        </div>

        {/* Clean 3-Link Row (CV · GitHub · LinkedIn) */}
        <div className="mt-14 flex flex-wrap items-center gap-8 text-sm text-[#A6A59E] sm:gap-12">
          <MagneticField strength={0.18}>
            <a
              href={profile.cvFiles[locale]}
              download
              data-cursor="pointer"
              className="group inline-flex items-center gap-1.5 text-[#F5F4F0]/85 transition-colors hover:text-[#F5F4F0]"
            >
              <RollingText text={dict.contact.downloadCv} underline />
              <KineticArrow
                direction="down"
                className="opacity-65 transition-opacity group-hover:opacity-100"
              />
            </a>
          </MagneticField>

          {github ? (
            <MagneticField strength={0.18}>
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="group inline-flex items-center gap-1 text-[#F5F4F0]/85 transition-colors hover:text-[#F5F4F0]"
              >
                <RollingText text={github.label} underline />
                <KineticArrow
                  direction="up-right"
                  className="opacity-65 transition-opacity group-hover:opacity-100"
                />
              </a>
            </MagneticField>
          ) : null}

          {linkedin ? (
            <MagneticField strength={0.18}>
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="group inline-flex items-center gap-1 text-[#F5F4F0]/85 transition-colors hover:text-[#F5F4F0]"
              >
                <RollingText text={linkedin.label} underline />
                <KineticArrow
                  direction="up-right"
                  className="opacity-65 transition-opacity group-hover:opacity-100"
                />
              </a>
            </MagneticField>
          ) : null}
        </div>

        {/* Minimal 1-Row Colophon Footer */}
        <div className="mt-20 flex items-center justify-between border-t border-[#F5F4F0]/14 pt-7 text-xs text-[#A6A59E]">
          <span>© 2026 {profile.fullName}</span>

          <MagneticField strength={0.18}>
            <button
              type="button"
              onClick={() => scrollWithGlide("top", dict.nav.about)}
              data-cursor="pointer"
              className="group inline-flex cursor-pointer items-center gap-1.5 text-[#A6A59E] transition-colors hover:text-[#F5F4F0] active:scale-95"
            >
              <RollingText text={dict.contact.backToTop} underline />
              <KineticArrow direction="up" />
            </button>
          </MagneticField>
        </div>
      </div>
    </footer>
  );
}
