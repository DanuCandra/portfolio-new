"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MagneticFieldProps {
  children: ReactNode;
  className?: string;
  /** Pull strength in ratio (0.15 - 0.35 feels tactile & weighted) */
  strength?: number;
}

/**
 * Weighted Magnetic Inertia Wrapper (0 React re-renders).
 * Menarik elemen secara halus menuju kursor lalu mendarat kembali dengan `--ease-expo-out`.
 */
export function MagneticField({
  children,
  className,
  strength = 0.24,
}: MagneticFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width * 0.5)) * strength;
    const dy = (e.clientY - (rect.top + rect.height * 0.5)) * strength;
    el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0px, 0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "inline-block transition-transform duration-500 ease-expo-out will-change-transform",
        className
      )}
    >
      {children}
    </div>
  );
}
