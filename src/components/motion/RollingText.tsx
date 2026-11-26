"use client";

import { cn } from "@/lib/cn";

interface RollingTextProps {
  text: string;
  className?: string;
  /** Optional class override for the incoming same-font kinetic layer */
  hoverClassName?: string;
  /** Set true when driven by an ancestor Tailwind `.group` hover */
  groupHover?: boolean;
  /** Enable razor-thin directional 1px hairline sweep (enters left, exits right) */
  underline?: boolean;
}

/**
 * Pure Same-Font Kinetic Slot-Roll Typography (Motion Design Primitive).
 * - Tetap menggunakan font tajam yang sama persis (nol perubahan ke *italic*),
 *   sehingga terasa tegas, presisi, dan konsisten di seluruh tombol & navigasi.
 * - Opsional `underline` menambahkan sapuan garis `1px` direksional (masuk kiri → keluar kanan).
 */
export function RollingText({
  text,
  className,
  hoverClassName,
  groupHover = true,
  underline = false,
}: RollingTextProps) {
  return (
    <span
      className={cn(
        "relative inline-block align-top leading-[1.18]",
        !groupHover && "group",
        underline && "hairline-sweep",
        className
      )}
    >
      <span className="relative block overflow-hidden">
        {/* Resting Layer */}
        <span className="block transition-[transform,opacity] duration-[460ms] ease-spring-out will-change-transform group-hover:-translate-y-[115%] group-hover:opacity-45">
          {text}
        </span>

        {/* Incoming Same-Font Precision Layer */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 block translate-y-[115%] opacity-45 transition-[transform,opacity] duration-[460ms] ease-spring-out will-change-transform group-hover:translate-y-0 group-hover:opacity-100",
            hoverClassName
          )}
        >
          {text}
        </span>
      </span>
    </span>
  );
}
