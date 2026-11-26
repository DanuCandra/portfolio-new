"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
 * - `danucs.` (kiri) · `Tentang/About` · `Karya/Work` · `Kontak/Contact` · `ID/EN` (kanan)
 * - Context-aware transitions:
 *   - `Tentang / About` → 5-Column Staggered Architectural Shutter
 *   - `Karya / Kontak` → Spatial Camera Glide di Home (atau Shutter + hash landing dari halaman lain)
 *   - `ID / EN` → In-Place Kinetic Language Morph (tanpa layar hitam & tanpa reset scroll!)
 */
export function MinimalNavbar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const { navigateWithShutter, scrollWithGlide } = usePageTransition();

  const navSurface = useSyncExternalStore(
    subscribeSurfaceMode,
    getNavSurfaceSnapshot,
    getServerNavSurface
  );

  const threadRef = useRef<HTMLDivElement>(null);
  const [articleScrolled, setArticleScrolled] = useState(false);
  const isHomeRoute = pathname === "/" || pathname === "/en";
  const isAboutRoute = pathname === "/about" || pathname === "/en/about";
  const onInk = navSurface === "ink";

  useEffect(() => {
    let rafId = 0;
    let lastScrolled = false;
    const syncThread = () => {
      if (threadRef.current) {
        threadRef.current.style.transform = `scaleX(${motionState.scrollProgress.toFixed(4)})`;
      }
      if (!isHomeRoute) {
        const nextScrolled = motionState.scrollY > 48;
        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled;
          setArticleScrolled(nextScrolled);
        }
      }
      rafId = requestAnimationFrame(syncThread);
    };
    rafId = requestAnimationFrame(syncThread);
    return () => cancelAnimationFrame(rafId);
  }, [isHomeRoute]);

  const handleAnchorScroll = (selector: string, label: string) => {
    if (!isHomeRoute) {
      navigateWithShutter(localePath(locale, "/"), label, { hash: selector });
      return;
    }

    scrollWithGlide(selector, label);
  };

  const altLocale: Locale = locale === "id" ? "en" : "id";
  const altHref = switchLocalePath(pathname, altLocale);
  const aboutHref = localePath(locale, "/about");

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

      {/* Fixed Editorial Navigation (100% transparent on Home; subtle paper veil mid-scroll on Case Study) */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 px-6 py-6 transition-[color,background-color,border-color] duration-500 ease-expo-out md:px-14 md:py-8",
          onInk ? "text-[#F5F4F0]" : "text-[#0D0D0D]",
          !isHomeRoute &&
            articleScrolled &&
            (onInk
              ? "border-b border-[#F5F4F0]/10 bg-[#0D0D0D]/88 py-5 backdrop-blur-sm md:py-5"
              : "border-b border-[#0D0D0D]/8 bg-[#F5F4F0]/90 py-5 backdrop-blur-sm md:py-5")
        )}
      >
        <div className="mx-auto flex max-w-[1380px] items-center justify-between">
          {/* Left: Minimal Brand Signature */}
          <MagneticField strength={0.18}>
            <TransitionLink
              href={localePath(locale, "/")}
              curtainLabel={profileData.fullName}
              className="group inline-flex items-baseline text-[15px] font-medium tracking-[-0.02em]"
            >
              <RollingText text={`${profileData.brandHandle}.`} />
            </TransitionLink>
          </MagneticField>

          {/* Right: Clean Editorial Controls (About Me · Projects · Contact · Locale) */}
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-3.5 text-[12px] tracking-[-0.01em] sm:gap-8 sm:text-[13px]"
          >
            <MagneticField strength={0.2}>
              <TransitionLink
                href={aboutHref}
                mode="shutter"
                curtainLabel={dict.nav.about}
                className={cn(
                  "group relative inline-flex items-center gap-1.5 font-normal transition-transform active:scale-95",
                  isAboutRoute && "font-medium"
                )}
              >
                {isAboutRoute ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1 w-1 rounded-full",
                      onInk ? "bg-[#F5F4F0]" : "bg-[#0D0D0D]"
                    )}
                  />
                ) : null}
                <RollingText text={dict.nav.about} underline />
              </TransitionLink>
            </MagneticField>

            <MagneticField strength={0.2}>
              <button
                type="button"
                onClick={() => handleAnchorScroll("#work", dict.work.heading)}
                data-cursor="pointer"
                className="group inline-flex cursor-pointer items-center font-normal transition-transform active:scale-95"
              >
                <RollingText text={dict.nav.work} underline />
              </button>
            </MagneticField>

            <MagneticField strength={0.2}>
              <button
                type="button"
                onClick={() => handleAnchorScroll("#contact", dict.nav.contact)}
                data-cursor="pointer"
                className="group inline-flex cursor-pointer items-center font-normal transition-transform active:scale-95"
              >
                <RollingText text={dict.nav.contact} underline />
              </button>
            </MagneticField>

            <MagneticField strength={0.2}>
              <TransitionLink
                href={altHref}
                mode="locale"
                ariaLabel={
                  altLocale === "en"
                    ? "Switch language to English"
                    : "Ganti bahasa ke Indonesia"
                }
                className={cn(
                  "hairline-sweep group inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors",
                  onInk
                    ? "text-[#A6A59E] hover:text-[#F5F4F0]"
                    : "text-[#73726C] hover:text-[#0D0D0D]"
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
