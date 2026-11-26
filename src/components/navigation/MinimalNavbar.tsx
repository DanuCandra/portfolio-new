"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getDictionary, localePath, switchLocalePath } from "@/i18n";
import { profileData } from "@/data/profile";
import {
  motionState,
  subscribeSurfaceMode,
  type SurfaceMode,
} from "@/lib/motion-store";
import { cn } from "@/lib/cn";
import { MagneticField } from "@/components/motion/MagneticField";
import {
  TransitionLink,
  usePageTransition,
} from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";
import type { Locale } from "@/types/portfolio";

const getNavSurfaceSnapshot = (): SurfaceMode => motionState.navSurfaceMode;
const getServerNavSurface = (): SurfaceMode => "paper";

/**
 * Auto-Invert Ultra-Minimalist 1-Row Editorial Navbar.
 * - Strictly 4 items: `danucs.` (kiri) · `Work` · `Contact` · `ID/EN` (kanan)
 * - Nol kotak border, nol backdrop-blur berat, nol HUD/badge.
 * - Otomatis berubah warna Hitam (#0D0D0D) ↔ Putih (#F5F4F0) mengikuti latar di bawahnya
 *   saat scroll maju maupun *scroll back*.
 */
export function MinimalNavbar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const { navigateWithCurtain, scrollWithCurtain } = usePageTransition();

  const navSurface = useSyncExternalStore(
    subscribeSurfaceMode,
    getNavSurfaceSnapshot,
    getServerNavSurface
  );

  const threadRef = useRef<HTMLDivElement>(null);
  const isHomeRoute = pathname === "/" || pathname === "/en";
  const onInk = navSurface === "ink";

  useEffect(() => {
    let rafId = 0;
    const syncThread = () => {
      if (threadRef.current) {
        threadRef.current.style.transform = `scaleX(${motionState.scrollProgress.toFixed(4)})`;
      }
      rafId = requestAnimationFrame(syncThread);
    };
    rafId = requestAnimationFrame(syncThread);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleAnchorScroll = (selector: string, label: string) => {
    if (!isHomeRoute) {
      navigateWithCurtain(`${localePath(locale, "/")}${selector}`, label);
      return;
    }

    scrollWithCurtain(selector, label);
  };

  const altLocale: Locale = locale === "id" ? "en" : "id";
  const altHref = switchLocalePath(pathname, altLocale);

  return (
    <>
      {/* Razor-Thin 1px Architectural Scroll Thread (zero text/HUD) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[1px]"
      >
        <div
          ref={threadRef}
          className={cn(
            "h-full w-full origin-left transition-colors duration-500 will-change-transform",
            onInk ? "bg-[#F5F4F0]/75" : "bg-[#0D0D0D]/70"
          )}
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Fixed Transparent 1-Row Editorial Navigation */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 px-6 py-6 transition-colors duration-500 ease-expo-out md:px-14 md:py-8",
          onInk ? "text-[#F5F4F0]" : "text-[#0D0D0D]"
        )}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          {/* Left: Minimal Brand Signature */}
          <MagneticField strength={0.18}>
            <TransitionLink
              href={localePath(locale, "/")}
              curtainLabel={profileData.fullName}
              className="group inline-flex items-baseline text-[15px] font-medium tracking-[-0.02em]"
            >
              <RollingText
                text={`${profileData.brandHandle}.`}
                italicClassName="text-[17px]"
              />
            </TransitionLink>
          </MagneticField>

          {/* Right: 3 Clean Text Controls (Work · Contact · Locale) */}
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-6 text-[13px] tracking-[-0.01em] sm:gap-9"
          >
            <MagneticField strength={0.2}>
              <button
                type="button"
                onClick={() => handleAnchorScroll("#work", dict.work.heading)}
                data-cursor="pointer"
                className="group cursor-pointer font-normal transition-transform active:scale-95"
              >
                <RollingText
                  text={dict.nav.work}
                  italicClassName="text-[15px]"
                />
              </button>
            </MagneticField>

            <MagneticField strength={0.2}>
              <button
                type="button"
                onClick={() => handleAnchorScroll("#contact", dict.nav.contact)}
                data-cursor="pointer"
                className="group cursor-pointer font-normal transition-transform active:scale-95"
              >
                <RollingText
                  text={dict.nav.contact}
                  italicClassName="text-[15px]"
                />
              </button>
            </MagneticField>

            <MagneticField strength={0.2}>
              <TransitionLink
                href={altHref}
                curtainLabel={altLocale === "en" ? "English" : "Indonesia"}
                ariaLabel={
                  altLocale === "en"
                    ? "Switch language to English"
                    : "Ganti bahasa ke Indonesia"
                }
                className={cn(
                  "group inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase transition-opacity hover:opacity-65",
                  onInk ? "text-[#A6A59E]" : "text-[#73726C]"
                )}
              >
                <span
                  className={cn(
                    "font-medium",
                    onInk ? "text-[#F5F4F0]" : "text-[#0D0D0D]"
                  )}
                >
                  {locale.toUpperCase()}
                </span>
                <span aria-hidden="true">/</span>
                <span>{altLocale.toUpperCase()}</span>
              </TransitionLink>
            </MagneticField>
          </nav>
        </div>
      </header>
    </>
  );
}
