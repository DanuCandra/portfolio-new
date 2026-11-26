"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MaskElement = "div" | "span" | "p" | "h1" | "h2" | "h3";

interface MaskRevealTextProps {
  children: ReactNode;
  as?: MaskElement;
  className?: string;
  innerClassName?: string;
  /** Trigger immediately on mount rather than waiting for viewport entry */
  immediate?: boolean;
  /** Optional stagger delay in ms */
  delayMs?: number;
  /** Keep visible once revealed (default true for reading comfort) */
  once?: boolean;
}

/**
 * Architectural Clip-Path Mask Reveal Primitive (SEO-safe).
 * - Membuka teks/judul dari balik garis potong (`clip-path: inset(0 0 100% 0) -> inset(0)` + rise)
 *   bukan sekadar *fade-in* datar.
 * - Merender tag HTML semantik utuh sejak SSR sehingga 100% ramah Googlebot & screen reader.
 */
export function MaskRevealText({
  children,
  as = "div",
  className,
  innerClassName,
  immediate = false,
  delayMs = 0,
  once = true,
}: MaskRevealTextProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (immediate) {
      const raf1 = requestAnimationFrame(() => {
        setRevealed(true);
      });
      return () => cancelAnimationFrame(raf1);
    }

    const node = hostRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate, once]);

  const Tag = as;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        hostRef.current = node;
      }}
      className={cn("overflow-hidden", className)}
    >
      <span
        className={cn(
          "block transition-[transform,opacity,clip-path] duration-[860ms] ease-expo-out will-change-[transform,clip-path]",
          innerClassName
        )}
        style={{
          transitionDelay: `${delayMs}ms`,
          transform: revealed ? "translate3d(0, 0%, 0)" : "translate3d(0, 106%, 0)",
          clipPath: revealed ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
          opacity: revealed ? 1 : 0.01,
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
