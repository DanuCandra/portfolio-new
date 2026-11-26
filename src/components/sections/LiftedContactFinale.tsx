"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { getDictionary } from "@/i18n";
import { profileData } from "@/data/profile";
import { cn } from "@/lib/cn";
import { InkFillButton } from "@/components/motion/InkFillButton";
import { KineticArrow } from "@/components/motion/KineticArrow";
import { MagneticField } from "@/components/motion/MagneticField";
import { usePageTransition } from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import type { Locale } from "@/types/portfolio";

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

/**
 * SCENE 5 — Lifted Paper Under-Curtain Contact Finale (#0D0D0D Matte Ink).
 * - Muncul halus dari balik lembaran kertas putih yang melengkung & terangkat ke atas
 *   (100% reversible saat *scroll back*, nol form kotak besar, nol kartu sosmed ramai).
 * - Headline 2-3 kata + Magnetic 3D Flip Email Copy + 3 tautan teks (`CV`, `GitHub`, `LinkedIn`)
 *   + Footer 1 baris tipis dengan tombol `Top ↑` berbasis Arch-Curtain Motion Teleport.
 */
export function LiftedContactFinale({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { scrollWithCurtain } = usePageTransition();

  const [copied, setCopied] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const github = profileData.socials.find((s) => s.id === "github");
  const linkedin = profileData.socials.find((s) => s.id === "linkedin");

  // Reversible under-curtain depth glide as white paper sheet lifts above Scene 5
  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const host = footerRef.current;
      const inner = innerRef.current;
      if (host && inner) {
        const rect = host.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 when footer top sits at bottom of viewport -> 1 when fully revealed
        const reveal = clamp01((vh - rect.top) / (vh * 0.85));
        const shiftY = (1 - reveal) * -72;
        const scale = 0.94 + reveal * 0.06;
        const opacity = 0.35 + reveal * 0.65;

        inner.style.transform = `translate3d(0, ${shiftY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        inner.style.opacity = opacity.toFixed(3);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profileData.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profileData.email}`;
    }
  };

  return (
    <footer
      id="contact"
      ref={footerRef}
      data-surface="ink"
      aria-label={dict.nav.contact}
      className="relative z-10 -mt-[56px] w-full overflow-hidden bg-[#0D0D0D] pt-[56px] text-[#F5F4F0]"
    >
      <div
        ref={innerRef}
        className="mx-auto flex min-h-[86vh] w-full max-w-[1380px] flex-col justify-between px-6 pb-10 pt-28 will-change-[transform,opacity] md:px-14 md:pb-12 md:pt-36"
      >
        <div className="h-2" aria-hidden="true" />

        {/* Center Monumental Quiet Contact Block */}
        <div className="flex flex-col items-center text-center">
          <h2 className="display-finale text-[#F5F4F0]">
            <span>{dict.contact.headlineLead}</span>{" "}
            <span className="font-editorial-serif italic font-normal">
              {dict.contact.headlineItalic}
            </span>
          </h2>

          {/* Magnetic Directional Ink-Fill Email Copy Pill */}
          <div className="mt-12 sm:mt-14">
            <InkFillButton
              type="button"
              onClick={handleCopyEmail}
              tone="light-on-ink"
              variant="outline"
              lockedFill={copied}
              magneticStrength={0.22}
              cursorMode="pill"
              cursorLabel={copied ? "✓" : locale === "id" ? "Salin" : "Copy"}
              ariaLabel={`${dict.contact.copyPrompt}: ${profileData.email}`}
              className="px-8 py-4 text-sm font-medium tracking-[-0.01em] sm:px-10 sm:py-5 sm:text-base"
            >
              <span className="relative block h-[1.35em] overflow-hidden">
                {/* Default Email Face */}
                <span
                  className={cn(
                    "block transition-transform duration-500 ease-spring-out",
                    copied ? "-translate-y-full" : "translate-y-0"
                  )}
                >
                  {profileData.email}
                </span>

                {/* Flipped Confirmation Face (Clean Same-Font Precision) */}
                <span
                  aria-hidden={!copied}
                  className={cn(
                    "absolute inset-0 flex items-center justify-center gap-2 font-medium transition-transform duration-500 ease-spring-out",
                    copied ? "translate-y-0" : "translate-y-full"
                  )}
                >
                  <Check className="h-4 w-4" />
                  <span>{dict.contact.copied}</span>
                </span>
              </span>
            </InkFillButton>
          </div>

          {/* Strictly 3 Clean Text Links: CV (PDF) · GitHub · LinkedIn */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-[#A6A59E] sm:gap-12">
            <MagneticField strength={0.18}>
              <a
                href={profileData.cvFiles[locale]}
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
        </div>

        {/* 1-Row Editorial Footer with Back-to-Top Glide */}
        <div className="mt-20 flex items-center justify-between border-t border-[#F5F4F0]/14 pt-7 text-xs text-[#A6A59E]">
          <span>© 2026 {profileData.fullName}</span>

          <MagneticField strength={0.18}>
            <button
              type="button"
              onClick={() => scrollWithCurtain("top", profileData.fullName)}
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
