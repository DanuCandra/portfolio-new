"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface MirrorMaskLettersProps {
  text: string;
  direction?: "up" | "down";
  baseDelayMs?: number;
  staggerMs?: number;
  className?: string;
}

/**
 * After Effects Mirror Mask Reveal + Character Tilt Landing.
 * - `direction="up"`: huruf meluncur naik dari balik baseline 1px (`115% -> 0%`, tilt `5deg -> 0deg`)
 * - `direction="down"`: huruf meluncur turun dari balik baseline 1px (`-115% -> 0%`, tilt `-5deg -> 0deg`)
 * Memakai kurva `--ease-expo-out` agar mendarat presisi & berbobot.
 */
export function MirrorMaskLetters({
  text,
  direction = "up",
  baseDelayMs = 120,
  staggerMs = 42,
  className,
}: MirrorMaskLettersProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const chars = Array.from(text);

  return (
    <span
      className={cn(
        "inline-flex overflow-y-clip overflow-x-visible px-[0.08em] py-[0.06em] -mx-[0.08em]",
        className
      )}
    >
      {chars.map((char, idx) => {
        const hiddenTransform =
          direction === "up"
            ? "translate3d(0, 118%, 0) rotate(5deg)"
            : "translate3d(0, -118%, 0) rotate(-5deg)";

        return (
          <span
            key={`${char}-${idx}`}
            aria-hidden="true"
            style={{
              transform: revealed
                ? "translate3d(0, 0%, 0) rotate(0deg)"
                : hiddenTransform,
              opacity: revealed ? 1 : 0.001,
              transitionDelay: `${baseDelayMs + idx * staggerMs}ms`,
            }}
            className="inline-block transition-[transform,opacity] duration-[950ms] ease-expo-out will-change-transform"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}
