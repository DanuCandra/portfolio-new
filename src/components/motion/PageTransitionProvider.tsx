"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  motionState,
  queuePendingHash,
  queuePreserveScroll,
  setPendingFlip,
  type FlipTransitionPayload,
} from "@/lib/motion-store";
import { EditorialProjectFrame } from "@/components/projects/EditorialProjectFrame";
import type { ProjectItem } from "@/types/portfolio";

export type TransitionMode = "shutter" | "locale" | "flip";

interface NavigateOptions {
  hash?: string;
}

interface FlipBoxRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface PageTransitionContextValue {
  /** 5-Column Staggered Architectural Shutter for route changes (Home <-> /about, Case Study -> Home) */
  navigateWithShutter: (
    href: string,
    label?: string,
    options?: NavigateOptions
  ) => void;
  /** Backwards-compatible alias forwarding cleanly to 5-Column Architectural Shutter */
  navigateWithCurtain: (
    href: string,
    label?: string,
    options?: NavigateOptions
  ) => void;
  /** Spatial Camera Glide for same-page section scrolling (Work, Contact, Top) */
  scrollWithGlide: (target: "top" | string, label?: string) => void;
  /** Backwards-compatible alias forwarding cleanly to Spatial Camera Glide */
  scrollWithCurtain: (target: "top" | string, label?: string) => void;
  /** In-Place Kinetic Language Morph (ID <-> EN, zero black screen, preserves exact scrollY) */
  switchLocaleInPlace: (href: string) => void;
  /** Shared-Element FLIP Hero Morph for Project -> Case Study transitions */
  navigateWithFlip: (href: string, payload: FlipTransitionPayload) => void;
  isTransitioning: boolean;
  isFlipActive: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateWithShutter: () => {},
  navigateWithCurtain: () => {},
  scrollWithGlide: () => {},
  scrollWithCurtain: () => {},
  switchLocaleInPlace: () => {},
  navigateWithFlip: () => {},
  isTransitioning: false,
  isFlipActive: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

type ShutterPhase = "idle" | "entering" | "holding" | "exiting";
type GlidePhase = "idle" | "gliding" | "settling";
type LocaleMorphPhase = "idle" | "out" | "in";
type FlipPhase = "idle" | "start" | "flying" | "docking" | "dissolving";

const SHUTTER_COLUMNS = [0, 1, 2, 3, 4] as const;
const STAGGER_MS = 44;

function quinticEaseOut(t: number): number {
  return 1 - Math.pow(1 - t, 4.2);
}

function getFallbackCenterRect(): FlipBoxRect {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const width = Math.min(420, vw - 48);
  const height = Math.round((width * 10) / 16);
  return {
    top: Math.round((vh - height) * 0.5),
    left: Math.round((vw - width) * 0.5),
    width,
    height,
  };
}

function getIntermediateHeroRect(): FlipBoxRect {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const horizontalPad = vw >= 768 ? 112 : 48;
  const width = Math.min(1168, vw - horizontalPad);
  const height = Math.min(Math.round((width * 10) / 16), Math.round(vh * 0.64));
  const adjustedWidth = Math.round((height * 16) / 10);
  const finalWidth = Math.min(width, adjustedWidth);
  return {
    top: Math.max(96, Math.round((vh - height) * 0.52)),
    left: Math.round((vw - finalWidth) * 0.5),
    width: finalWidth,
    height,
  };
}

/**
 * 4-Mode Context-Aware Motion Transition Engine (100% GPU Transform, Zero Generic Black Wall).
 * 1. Spatial Camera Glide             — Same-page menu scroll (`Karya`, `Kontak`, `Atas ↑`)
 * 2. 5-Column Architectural Shutter   — Cross-route navigation (`Home ↔ /about`, `Case Study → Home`)
 * 3. In-Place Kinetic Language Morph  — `ID ↔ EN` switching without resetting scroll position
 * 4. Shared-Element FLIP Hero Morph   — Clicked project preview physically lifts & docks pixel-exact
 *                                       into the Case Study `[data-flip-hero]` showcase!
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [shutterPhase, setShutterPhase] = useState<ShutterPhase>("idle");
  const [glidePhase, setGlidePhase] = useState<GlidePhase>("idle");
  const [glideDirection, setGlideDirection] = useState<"down" | "up">("down");
  const [glideLabel, setGlideLabel] = useState("");
  const [localeMorph, setLocaleMorph] = useState<LocaleMorphPhase>("idle");

  // Shared-Element FLIP State
  const [flipPhase, setFlipPhase] = useState<FlipPhase>("idle");
  const [flipProject, setFlipProject] = useState<ProjectItem | null>(null);
  const [flipBox, setFlipBox] = useState<FlipBoxRect | null>(null);

  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const rafsRef = useRef<number[]>([]);
  const pendingPathRef = useRef<string | null>(null);
  const pendingFlipPathRef = useRef<string | null>(null);
  const flipStartedAtRef = useRef<number>(0);
  const shutterReadyRef = useRef(false);
  const shutterMinPassedRef = useRef(false);

  const clearAllScheduled = useCallback(() => {
    for (const id of timersRef.current) {
      clearTimeout(id);
    }
    timersRef.current = [];
    for (const rafId of rafsRef.current) {
      cancelAnimationFrame(rafId);
    }
    rafsRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const scheduleRaf = useCallback((fn: () => void) => {
    const id = requestAnimationFrame(fn);
    rafsRef.current.push(id);
    return id;
  }, []);

  const finishFlipCleanly = useCallback(() => {
    pendingFlipPathRef.current = null;
    setPendingFlip(null);
    setFlipPhase("dissolving");
    schedule(() => {
      setFlipPhase("idle");
      setFlipProject(null);
      setFlipBox(null);
    }, 300);
  }, [schedule]);

  const dockFlipToHero = useCallback(() => {
    const slug = flipProject?.slug;
    const heroEl = slug
      ? document.querySelector<HTMLElement>(`[data-flip-hero="${slug}"]`)
      : document.querySelector<HTMLElement>("[data-flip-hero]");

    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      if (rect.width > 40 && rect.height > 40) {
        setFlipBox({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }

    setFlipPhase("docking");
    schedule(() => {
      finishFlipCleanly();
    }, 700);
  }, [flipProject, finishFlipCleanly, schedule]);

  const triggerShutterExit = useCallback(() => {
    pendingPathRef.current = null;
    shutterReadyRef.current = false;
    shutterMinPassedRef.current = false;
    setShutterPhase("exiting");

    schedule(() => {
      setShutterPhase("idle");
    }, 520 + (SHUTTER_COLUMNS.length - 1) * STAGGER_MS);
  }, [schedule]);

  // Synchronize Locale Morph, Shutter exit, and FLIP Hero docking with actual Next.js route arrival
  useEffect(() => {
    if (localeMorph === "out") {
      const raf = requestAnimationFrame(() => {
        setLocaleMorph("in");
        schedule(() => setLocaleMorph("idle"), 260);
      });
      return () => cancelAnimationFrame(raf);
    }

    if (
      pendingFlipPathRef.current &&
      pathname === pendingFlipPathRef.current &&
      (flipPhase === "flying" || flipPhase === "start")
    ) {
      // Guarantee a poised, unhurried centerpiece flight (minimum 640ms) before velvet docking
      const elapsed = performance.now() - flipStartedAtRef.current;
      const waitMs = Math.max(0, 640 - elapsed);
      const timerId = schedule(() => {
        const raf1 = requestAnimationFrame(() => {
          const raf2 = requestAnimationFrame(() => {
            dockFlipToHero();
          });
          rafsRef.current.push(raf2);
        });
        rafsRef.current.push(raf1);
      }, waitMs);
      return () => clearTimeout(timerId);
    }

    if (
      shutterPhase === "holding" &&
      pendingPathRef.current &&
      pathname === pendingPathRef.current
    ) {
      shutterReadyRef.current = true;
      if (shutterMinPassedRef.current) {
        const raf = requestAnimationFrame(() => triggerShutterExit());
        return () => cancelAnimationFrame(raf);
      }
    }
  }, [
    pathname,
    localeMorph,
    shutterPhase,
    flipPhase,
    schedule,
    triggerShutterExit,
    dockFlipToHero,
  ]);

  useEffect(() => {
    return () => clearAllScheduled();
  }, [clearAllScheduled]);

  // 1. SPATIAL CAMERA GLIDE (Same-Page Smooth Scroll — ZERO Black Screen!)
  const scrollWithGlide = useCallback(
    (target: "top" | string, label?: string) => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const currentY = window.__danucsLenis
        ? window.__danucsLenis.scroll
        : window.scrollY;

      let targetEl: HTMLElement | null = null;
      let targetY = 0;

      if (target !== "top") {
        const found = document.querySelector(target);
        if (found instanceof HTMLElement) {
          targetEl = found;
          targetY = found.getBoundingClientRect().top + currentY;
        }
      }

      if (reduced) {
        if (target === "top") {
          window.scrollTo({ top: 0 });
        } else if (targetEl) {
          targetEl.scrollIntoView({ behavior: "auto" });
        }
        return;
      }

      clearAllScheduled();
      setGlideDirection(targetY >= currentY ? "down" : "up");
      setGlideLabel(label || "");
      setGlidePhase("gliding");

      const distance = Math.abs(targetY - currentY);
      const durationSec = Math.min(1.18, Math.max(0.72, distance / 4200 + 0.58));

      const lenis = window.__danucsLenis;
      if (lenis) {
        lenis.scrollTo(target === "top" ? 0 : (targetEl ?? 0), {
          duration: durationSec,
          easing: quinticEaseOut,
          lock: false,
        });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }

      const settleAtMs = Math.round(durationSec * 1000 * 0.8);
      const endAtMs = Math.round(durationSec * 1000) + 120;

      schedule(() => {
        setGlidePhase("settling");
        if (targetEl) {
          targetEl.setAttribute("data-glide-arrived", "true");
          schedule(() => {
            targetEl?.removeAttribute("data-glide-arrived");
          }, 560);
        }
      }, settleAtMs);

      schedule(() => {
        setGlidePhase("idle");
      }, endAtMs);
    },
    [clearAllScheduled, schedule]
  );

  // 2. 5-COLUMN STAGGERED ARCHITECTURAL SHUTTER (Cross-Route Navigation)
  const navigateWithShutter = useCallback(
    (href: string, label?: string, options?: NavigateOptions) => {
      if (!href) return;
      const [rawPath, rawHash] = href.split("#");
      const cleanPath = rawPath || "/";
      const hash = options?.hash ?? (rawHash ? `#${rawHash}` : undefined);

      if (cleanPath === pathname) {
        scrollWithGlide(hash || "top", label);
        return;
      }

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        if (hash) queuePendingHash(hash);
        router.push(cleanPath, { scroll: false });
        return;
      }

      clearAllScheduled();
      pendingPathRef.current = cleanPath;
      shutterReadyRef.current = false;
      shutterMinPassedRef.current = false;
      setShutterPhase("entering");

      const enterDuration = 390 + (SHUTTER_COLUMNS.length - 1) * STAGGER_MS;

      schedule(() => {
        setShutterPhase("holding");
        if (hash) {
          queuePendingHash(hash);
        }
        router.push(cleanPath, { scroll: false });

        schedule(() => {
          shutterMinPassedRef.current = true;
          if (shutterReadyRef.current) {
            triggerShutterExit();
          }
        }, 110);

        schedule(() => {
          if (pendingPathRef.current) {
            triggerShutterExit();
          }
        }, 680);
      }, enterDuration);
    },
    [
      pathname,
      router,
      scrollWithGlide,
      clearAllScheduled,
      schedule,
      triggerShutterExit,
    ]
  );

  // 3. IN-PLACE KINETIC LANGUAGE MORPH (ID <-> EN, preserves exact scrollY)
  const switchLocaleInPlace = useCallback(
    (href: string) => {
      if (!href || href === pathname) return;

      const currentY = window.__danucsLenis
        ? window.__danucsLenis.scroll
        : window.scrollY;
      queuePreserveScroll(currentY);

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        router.push(href, { scroll: false });
        return;
      }

      clearAllScheduled();
      setLocaleMorph("out");

      schedule(() => {
        router.push(href, { scroll: false });
        schedule(() => {
          setLocaleMorph((prev) => (prev === "out" ? "in" : prev));
          schedule(() => setLocaleMorph("idle"), 260);
        }, 420);
      }, 145);
    },
    [pathname, router, clearAllScheduled, schedule]
  );

  // 4. SHARED-ELEMENT FLIP HERO MORPH (Project Preview -> Case Study Hero Showcase)
  const navigateWithFlip = useCallback(
    (href: string, payload: FlipTransitionPayload) => {
      if (!href) return;
      const [cleanPath] = href.split("#");
      if (!cleanPath || cleanPath === pathname) {
        scrollWithGlide("top", payload.project.title);
        return;
      }

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        router.push(cleanPath, { scroll: false });
        return;
      }

      const startRect =
        payload.rect.width > 30 && payload.rect.height > 30
          ? payload.rect
          : getFallbackCenterRect();

      clearAllScheduled();
      setPendingFlip(payload);
      pendingFlipPathRef.current = cleanPath;
      flipStartedAtRef.current = performance.now();

      // Frame 0: Mount flying project visual at exact clicked coordinates
      setFlipProject(payload.project);
      setFlipBox(startRect);
      setFlipPhase("start");

      // Frame 2: Launch smoothly into cinematic center hero flight & fade paper veil in
      scheduleRaf(() => {
        scheduleRaf(() => {
          setFlipBox(getIntermediateHeroRect());
          setFlipPhase("flying");
        });
      });

      // Push route smoothly mid-flight while centerpiece breathes on stage
      schedule(() => {
        router.push(cleanPath, { scroll: false });
      }, 360);

      // Clean failsafe so overlay can never hang on unexpected navigation cancellation
      schedule(() => {
        if (pendingFlipPathRef.current) {
          finishFlipCleanly();
        }
      }, 2200);
    },
    [
      pathname,
      router,
      scrollWithGlide,
      clearAllScheduled,
      schedule,
      scheduleRaf,
      finishFlipCleanly,
    ]
  );

  const isShutterActive = shutterPhase !== "idle";
  const isGliding = glidePhase === "gliding";
  const isFlipActive = flipPhase !== "idle";
  const isTransitioning =
    isShutterActive ||
    glidePhase !== "idle" ||
    localeMorph !== "idle" ||
    isFlipActive;
  const surfaceOnInk = motionState.surfaceMode === "ink";

  const flipVeilOpacity =
    flipPhase === "flying" ? 1 : flipPhase === "start" ? 0 : 0;

  return (
    <PageTransitionContext.Provider
      value={{
        navigateWithShutter,
        navigateWithCurtain: navigateWithShutter,
        scrollWithGlide,
        scrollWithCurtain: scrollWithGlide,
        switchLocaleInPlace,
        navigateWithFlip,
        isTransitioning,
        isFlipActive,
      }}
    >
      {/* In-Place Locale Morph Wrapper (pure opacity — never breaks fixed/sticky!) */}
      <div
        data-locale-morph={localeMorph}
        className="locale-morph-shell flex min-h-screen flex-1 flex-col"
      >
        {children}
      </div>

      {/* MODE 1 OVERLAY — Spatial Camera Glide Architectural Aperture Frame */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-[92] transition-opacity duration-300 ease-expo-out",
          glidePhase === "idle" ? "invisible opacity-0" : "visible opacity-100"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-[box-shadow] duration-500 ease-expo-out",
            isGliding
              ? "shadow-[inset_0_0_0_12px_rgba(13,13,13,0.92)] md:shadow-[inset_0_0_0_18px_rgba(13,13,13,0.92)]"
              : "shadow-[inset_0_0_0_0px_rgba(13,13,13,0)]"
          )}
        />

        {glideLabel ? (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-[transform,opacity] duration-400 ease-expo-out",
                surfaceOnInk
                  ? "border-[#F5F4F0]/18 bg-[#0D0D0D]/88 text-[#F5F4F0]"
                  : "border-[#0D0D0D]/14 bg-[#FAF9F6]/92 text-[#0D0D0D]",
                isGliding
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              )}
            >
              <span aria-hidden="true" className="text-[11px]">
                {glideDirection === "down" ? "↓" : "↑"}
              </span>
              <span>{glideLabel}</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* MODE 2 OVERLAY — 5-Column Staggered Architectural Shutter */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-[95] grid grid-cols-5",
          shutterPhase === "idle" ? "invisible" : "visible"
        )}
      >
        {SHUTTER_COLUMNS.map((colIdx) => {
          const delayMs = colIdx * STAGGER_MS;
          const isEntering = shutterPhase === "entering";
          const isHolding = shutterPhase === "holding";
          const isExiting = shutterPhase === "exiting";

          return (
            <div
              key={colIdx}
              className={cn(
                "relative h-full w-full bg-[#0D0D0D] will-change-transform",
                colIdx < SHUTTER_COLUMNS.length - 1 &&
                  "border-r border-[#F5F4F0]/[0.07]"
              )}
              style={{
                transformOrigin: isExiting ? "top center" : "bottom center",
                transform:
                  isEntering || isHolding ? "scaleY(1)" : "scaleY(0)",
                transitionProperty: "transform",
                transitionDuration: isEntering
                  ? "400ms"
                  : isExiting
                    ? "500ms"
                    : "0ms",
                transitionTimingFunction: isEntering
                  ? "cubic-bezier(0.76, 0, 0.24, 1)"
                  : "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay:
                  isEntering || isExiting ? `${delayMs}ms` : "0ms",
              }}
            />
          );
        })}
      </div>

      {/* MODE 4 OVERLAY — Luxury Cinematic Shared-Element FLIP Hero Morph Portal */}
      {isFlipActive && flipProject && flipBox ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[96] overflow-hidden"
        >
          {/* Warm Alabaster Paper Veil (unhurried editorial wash, parts gently as hero docks) */}
          <div
            className="absolute inset-0 bg-[#F5F4F0] transition-opacity duration-[580ms] ease-silk"
            style={{ opacity: flipVeilOpacity }}
          />

          {/* Physically Flying Project Wrapper (Weighted S-Curve Lift -> Velvet Hero Dock) */}
          <div
            className="fixed"
            style={{
              top: `${flipBox.top}px`,
              left: `${flipBox.left}px`,
              width: `${flipBox.width}px`,
              height: `${flipBox.height}px`,
              opacity: flipPhase === "dissolving" ? 0 : 1,
              transition:
                flipPhase === "start"
                  ? "none"
                  : flipPhase === "dissolving"
                    ? "opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : flipPhase === "flying"
                      ? "top 640ms cubic-bezier(0.65, 0, 0.35, 1), left 640ms cubic-bezier(0.65, 0, 0.35, 1), width 640ms cubic-bezier(0.65, 0, 0.35, 1), height 640ms cubic-bezier(0.65, 0, 0.35, 1)"
                      : "top 680ms cubic-bezier(0.22, 1, 0.36, 1), left 680ms cubic-bezier(0.22, 1, 0.36, 1), width 680ms cubic-bezier(0.22, 1, 0.36, 1), height 680ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Welded Architectural Caption Rail above Centerpiece during Flight */}
            <div
              className="absolute inset-x-0 -top-7 flex items-baseline justify-between font-mono text-[10px] tracking-[0.16em] text-[#73726C] uppercase transition-[opacity,transform] duration-[420ms] ease-expo-out"
              style={{
                opacity: flipPhase === "flying" ? 1 : 0,
                transform:
                  flipPhase === "flying"
                    ? "translate3d(0, 0, 0)"
                    : "translate3d(0, 8px, 0)",
              }}
            >
              <span className="truncate text-[#0D0D0D]">
                0{flipProject.order} · {flipProject.title}
              </span>
              <span className="shrink-0 pl-4 tabular-nums">
                {flipProject.year}
              </span>
            </div>

            {/* Inner Clipped Visual Frame + Shadow + Flight Filament */}
            <div
              className="relative h-full w-full overflow-hidden border border-[#0D0D0D]/14 bg-[#EAE8E1] transition-shadow duration-[640ms] ease-silk"
              style={{
                boxShadow:
                  flipPhase === "flying"
                    ? "0 48px 130px -30px rgba(13, 13, 13, 0.30)"
                    : "0 0 0 0 rgba(13, 13, 13, 0)",
              }}
            >
              <EditorialProjectFrame
                project={flipProject}
                compact={flipPhase === "start"}
              />

              {flipPhase === "flying" ? (
                <div
                  className="flip-filament-draw absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-[#0D0D0D]/55"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </PageTransitionContext.Provider>
  );
}

interface TransitionLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
  curtainLabel?: string;
  cursorLabel?: string;
  mode?: TransitionMode;
  /** Optional FLIP source resolver when `mode="flip"` */
  flipProject?: ProjectItem;
  getFlipRect?: () => FlipBoxRect | null;
  onClick?: () => void;
  ariaLabel?: string;
}

export function TransitionLink({
  href,
  children,
  className,
  curtainLabel,
  cursorLabel,
  mode = "shutter",
  flipProject,
  getFlipRect,
  onClick,
  ariaLabel,
  ...rest
}: TransitionLinkProps) {
  const { navigateWithShutter, switchLocaleInPlace, navigateWithFlip } =
    usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      href.startsWith("#") ||
      href.startsWith("http") ||
      href.startsWith("mailto:")
    ) {
      onClick?.();
      return;
    }

    e.preventDefault();
    onClick?.();

    if (mode === "locale") {
      switchLocaleInPlace(href);
      return;
    }

    if (mode === "flip" && flipProject) {
      const measured = getFlipRect?.();
      const rect = measured ?? getFallbackCenterRect();
      navigateWithFlip(href, { project: flipProject, rect });
      return;
    }

    navigateWithShutter(href, curtainLabel);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-label={ariaLabel}
      data-cursor={cursorLabel ? "pill" : "pointer"}
      data-cursor-label={cursorLabel}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}
