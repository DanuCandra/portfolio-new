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
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateWithCurtain: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

type CurtainPhase = "idle" | "entering" | "exiting";

/**
 * Weighted Monochrome Curtain Page Transition.
 * Sapuan tirai hitam matte (#0D0D0D) dengan kurva After Effects `--ease-quart-snap`
 * dan teks editorial *Instrument Serif Italic* bersih di tengah layar (0 neon).
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<CurtainPhase>("idle");
  const [label, setLabel] = useState("Danu Candra");

  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateWithCurtain = useCallback(
    (href: string, nextLabel?: string) => {
      if (!href || href === pathname) return;

      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        router.push(href);
        return;
      }

      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

      setLabel(nextLabel || "Danu Candra");
      setPhase("entering");

      enterTimerRef.current = setTimeout(() => {
        router.push(href);
        exitTimerRef.current = setTimeout(() => {
          setPhase("exiting");
          enterTimerRef.current = setTimeout(() => {
            setPhase("idle");
          }, 460);
        }, 180);
      }, 340);
    },
    [pathname, router]
  );

  useEffect(() => {
    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{
        navigateWithCurtain,
        isTransitioning: phase !== "idle",
      }}
    >
      {children}

      {/* Weighted Matte Ink Curtain */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-[#0D0D0D] text-[#F5F4F0]",
          phase === "idle"
            ? "transition-none translate-y-full"
            : "transition-transform duration-[460ms] ease-quart-snap",
          phase === "entering" && "translate-y-0",
          phase === "exiting" && "-translate-y-full"
        )}
      >
        <span
          className={cn(
            "font-editorial-serif text-3xl italic tracking-tight transition-all duration-300 sm:text-4xl",
            phase === "entering"
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0"
          )}
        >
          {label}
        </span>
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
