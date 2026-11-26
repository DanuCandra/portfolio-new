"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface TrimLineProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  origin?: "left" | "center" | "right" | "top";
  delayMs?: number;
  /** Draw immediately on mount (Hero) vs when entering viewport */
  immediate?: boolean;
}

/**
 * After Effects Trim-Path 1px Architectural Hairline.
 * Menggambar garis tipis presisi menggunakan kurva `--ease-quart-snap`.
 */
export function TrimLine({
  className,
  orientation = "horizontal",
  origin = "left",
  delayMs = 0,
  immediate = false,
}: TrimLineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (immediate) {
      const id = requestAnimationFrame(() => setDrawn(true));
      return () => cancelAnimationFrame(id);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  const originClass =
    origin === "center"
      ? "origin-center"
      : origin === "right"
      ? "origin-right"
      : origin === "top"
      ? "origin-top"
      : "origin-left";

  const isHorizontal = orientation === "horizontal";

  return (
    <span
      ref={ref}
      aria-hidden="true"
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "block transition-transform duration-1000 ease-quart-snap will-change-transform",
        originClass,
        isHorizontal ? "h-[1px] w-full" : "h-full w-[1px]",
        drawn
          ? isHorizontal
            ? "scale-x-100"
            : "scale-y-100"
          : isHorizontal
          ? "scale-x-0"
          : "scale-y-0",
        className
      )}
    />
  );
}
