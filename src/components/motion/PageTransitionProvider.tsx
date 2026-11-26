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

interface PageTransitionContextValue {
  navigateWithCurtain: (href: string, label?: string) => void;
  scrollWithCurtain: (target: "top" | string, label?: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateWithCurtain: () => {},
  scrollWithCurtain: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

type CurtainPhase = "idle" | "entering" | "holding" | "exiting";

/**
 * Unified Motion Design Arch-Curtain Transition System (100% GPU Transform, Zero Lag).
 * - Dipakai oleh SEMUA klik menu: pindah halaman (`/` <-> `/en` <-> `/projects/[slug]`)
 *   MAUPUN lompat antar bagian (`Work`, `Contact`, `Top ↑`).
 * - Menggunakan kurva After Effects `--ease-quart-snap` & `--ease-expo-out` dengan
 *   tepi melengkung (*architectural arch*) & judul *Instrument Serif Italic* masked reveal.
 * - Scroll/route berpindah instan (`immediate: true`) di balik tirai tertutup sehingga
 *   3D Laptop tidak pernah tersendat di tengah lompatan!
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<CurtainPhase>("idle");
  const [label, setLabel] = useState("Danu Candra");

  const t1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (t1Ref.current) clearTimeout(t1Ref.current);
    if (t2Ref.current) clearTimeout(t2Ref.current);
    if (t3Ref.current) clearTimeout(t3Ref.current);
  }, []);

  const runCurtainSequence = useCallback(
    (nextLabel: string, onCovered: () => void) => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        onCovered();
        return;
      }

      clearTimers();
      setLabel(nextLabel);
      setPhase("entering");

      // At 360ms curtain fully covers screen -> execute instant jump/navigation cleanly behind curtain
      t1Ref.current = setTimeout(() => {
        setPhase("holding");
        onCovered();

        // Hold briefly so new view/scroll settles cleanly before lifting curtain away
        t2Ref.current = setTimeout(() => {
          setPhase("exiting");
          t3Ref.current = setTimeout(() => {
            setPhase("idle");
          }, 480);
        }, 160);
      }, 360);
    },
    [clearTimers]
  );

  const navigateWithCurtain = useCallback(
    (href: string, nextLabel?: string) => {
      if (!href) return;
      if (href === pathname) {
        runCurtainSequence(nextLabel || "Danu Candra", () => {
          if (window.__danucsLenis) {
            window.__danucsLenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo({ top: 0 });
          }
        });
        return;
      }

      runCurtainSequence(nextLabel || "Danu Candra", () => {
        router.push(href);
      });
    },
    [pathname, router, runCurtainSequence]
  );

  const scrollWithCurtain = useCallback(
    (target: "top" | string, nextLabel?: string) => {
      runCurtainSequence(nextLabel || "Danu Candra", () => {
        if (target === "top") {
          if (window.__danucsLenis) {
            window.__danucsLenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo({ top: 0 });
          }
          return;
        }

        const el = document.querySelector(target);
        if (el instanceof HTMLElement) {
          if (window.__danucsLenis) {
            window.__danucsLenis.scrollTo(el, { immediate: true });
          } else {
            el.scrollIntoView({ behavior: "auto" });
          }
        }
      });
    },
    [runCurtainSequence]
  );

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const isCovered = phase === "entering" || phase === "holding";

  return (
    <PageTransitionContext.Provider
      value={{
        navigateWithCurtain,
        scrollWithCurtain,
        isTransitioning: phase !== "idle",
      }}
    >
      {children}

      {/* Weighted Matte Ink Arch-Curtain Overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-x-0 -bottom-[8vh] -top-[8vh] z-[95] flex items-center justify-center bg-[#0D0D0D] text-[#F5F4F0] will-change-transform",
          phase === "idle" && "transition-none translate-y-[108%] rounded-t-[64px]",
          phase === "entering" &&
            "transition-[transform,border-radius] duration-[380ms] ease-quart-snap translate-y-0 rounded-t-none",
          phase === "holding" && "transition-none translate-y-0 rounded-none",
          phase === "exiting" &&
            "transition-[transform,border-radius] duration-[480ms] ease-expo-out -translate-y-[108%] rounded-b-[64px]"
        )}
      >
        <div className="overflow-y-clip px-6 py-2">
          <span
            className={cn(
              "block font-editorial-serif text-3xl italic tracking-tight transition-[transform,opacity] duration-300 ease-expo-out sm:text-5xl",
              isCovered
                ? "translate-y-0 opacity-100 delay-100"
                : "-translate-y-full opacity-0"
            )}
          >
            {label}
          </span>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}

interface TransitionLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
  curtainLabel?: string;
  cursorLabel?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function TransitionLink({
  href,
  children,
  className,
  curtainLabel,
  cursorLabel,
  onClick,
  ariaLabel,
  ...rest
}: TransitionLinkProps) {
  const { navigateWithCurtain } = usePageTransition();

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
    navigateWithCurtain(href, curtainLabel);
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
