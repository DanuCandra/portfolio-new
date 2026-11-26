"use client";

import { cn } from "@/lib/cn";

interface RollingTextProps {
  text: string;
  className?: string;
  italicClassName?: string;
  /** Set true when driven by an ancestor Tailwind `.group` hover */
  groupHover?: boolean;
}

/**
 * Dual-Layer Slot-Roll Typography (Motion Design Primitive).
 * Saat di-hover, teks sans meluncur naik keluar mask sementara versi
 * *Instrument Serif Italic* masuk mulus dari bawah dengan kurva `--ease-expo-out`.
 */
export function RollingText({
  text,
  className,
  italicClassName,
  groupHover = true,
}: RollingTextProps) {
  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden align-top leading-[1.15]",
        !groupHover && "group",
        className
      )}
    >
      {/* Resting Sans Layer */}
      <span className="block transition-transform duration-500 ease-expo-out will-change-transform group-hover:-translate-y-[112%]">
        {text}
      </span>

      {/* Revealed Editorial Serif Italic Layer */}
      <span
        aria-hidden="true"
        className={cn(
          "font-editorial-serif absolute inset-0 block translate-y-[112%] italic font-normal transition-transform duration-500 ease-expo-out will-change-transform group-hover:translate-y-0",
          italicClassName
        )}
      >
        {text}
      </span>
    </span>
  );
}
