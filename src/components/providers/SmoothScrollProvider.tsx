"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import {
  setReducedMotionFlag,
  setSurfaceModes,
  stepSmoothVelocity,
  triggerInkBreeze,
  updatePointerTelemetry,
  updateScrollTelemetry,
  type SurfaceMode,
} from "@/lib/motion-store";

declare global {
  interface Window {
    __danucsLenis?: Lenis;
  }
}

function detectSurfaceAtY(y: number): SurfaceMode {
  const sections = document.querySelectorAll<HTMLElement>("[data-surface]");
  let matched: SurfaceMode = "paper";

  for (let i = 0; i < sections.length; i++) {
    const el = sections[i];
    const rect = el.getBoundingClientRect();
    if (rect.top <= y && rect.bottom >= y) {
      const attr = el.dataset.surface;
      if (attr === "ink" || attr === "paper") {
        matched = attr;
      }
    }
  }

  return matched;
}

/**
 * Reversible Smooth Scroll Provider (Lenis) + Automatic Paper ↔ Ink Surface Detector.
 * Zero React re-renders per scroll frame; handles both scroll-forward & scroll-back seamlessly.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotionFlag(mediaQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotionFlag(e.matches);
    };
    mediaQuery.addEventListener("change", onMotionChange);

    const syncSurfaces = () => {
      const vh = window.innerHeight || 1;
      const bodySurface = detectSurfaceAtY(vh * 0.5);
      const navSurface = detectSurfaceAtY(44);
      setSurfaceModes(bodySurface, navSurface);
    };

    const syncScroll = (scroll: number, limit: number, velocity: number) => {
      const safeLimit = Math.max(limit, 1);
      const progress = Math.min(Math.max(scroll / safeLimit, 0), 1);
      updateScrollTelemetry(scroll, progress, velocity);
      syncSurfaces();
    };

    let lenis: Lenis | null = null;
    let rafId = 0;
    let lastTime = performance.now();
    let nativeScrollHandler: (() => void) | null = null;

    if (!mediaQuery.matches) {
      lenis = new Lenis({
        lerp: 0.088,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.35,
        infinite: false,
      });

      window.__danucsLenis = lenis;

      lenis.on("scroll", (instance: Lenis) => {
        syncScroll(instance.scroll, instance.limit, instance.velocity);
      });

      const rafLoop = (now: number) => {
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        lenis?.raf(now);
        stepSmoothVelocity(dt);
        rafId = requestAnimationFrame(rafLoop);
      };
      rafId = requestAnimationFrame(rafLoop);
    } else {
      let lastY = window.scrollY;
      nativeScrollHandler = () => {
        const y = window.scrollY;
        const limit =
          document.documentElement.scrollHeight - window.innerHeight;
        const vel = y - lastY;
        lastY = y;
        syncScroll(y, limit, vel);
      };
      window.addEventListener("scroll", nativeScrollHandler, { passive: true });
      nativeScrollHandler();
    }

    const onPointerMove = (e: PointerEvent) => {
      updatePointerTelemetry(e.clientX, e.clientY, true);
    };

    const onPointerLeave = () => {
      updatePointerTelemetry(-1000, -1000, false);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest("a, button, input, textarea, select")) {
        return;
      }
      triggerInkBreeze(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", syncSurfaces, { passive: true });

    // Initial calibration
    const initialLimit =
      document.documentElement.scrollHeight - window.innerHeight;
    syncScroll(window.scrollY, initialLimit, 0);

    return () => {
      mediaQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", syncSurfaces);
      if (nativeScrollHandler) {
        window.removeEventListener("scroll", nativeScrollHandler);
      }
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        delete window.__danucsLenis;
      }
    };
  }, []);

  // Reset scroll cleanly on route navigation
  useEffect(() => {
    const lenis = window.__danucsLenis;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    updateScrollTelemetry(0, 0, 0);
    const bodySurface = detectSurfaceAtY((window.innerHeight || 1) * 0.5);
    const navSurface = detectSurfaceAtY(44);
    setSurfaceModes(bodySurface, navSurface);
  }, [pathname]);

  return <>{children}</>;
}
