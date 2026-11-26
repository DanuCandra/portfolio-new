"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type InkFillTone = "dark-on-paper" | "light-on-ink";
type InkFillVariant = "outline" | "solid";

interface BaseInkFillProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Surface palette pairing */
  tone?: InkFillTone;
  /** Outline fills with solid ink on hover; solid inverts cleanly to paper/ink contrast on hover */
  variant?: InkFillVariant;
  /** Keep fill locked active (e.g. "Copied!" confirmed state) */
  lockedFill?: boolean;
  /** Weighted magnetic pull strength (0 disables magnetic pull) */
  magneticStrength?: number;
  ariaLabel?: string;
  cursorMode?: "pointer" | "pill";
  cursorLabel?: string;
}

interface InkFillAsButtonProps extends BaseInkFillProps {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

interface InkFillAsAnchorProps extends BaseInkFillProps {
  href: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  onClick?: () => void;
}

export type InkFillButtonProps = InkFillAsButtonProps | InkFillAsAnchorProps;

/**
 * Magnetic Directional Ink Fill CTA (0 React re-renders during pointer movement).
 * - Tinta melingkar mengalir mengisi tombol tepat dari titik koordinat masuk kursor `(x, y)`
 *   dan surut kembali ke titik keluar kursor saat hover selesai.
 * - Disertai tarikan magnetis lembut + inner-label depth parallax & inversi warna kontras tinggi.
 */
export function InkFillButton(props: InkFillButtonProps) {
  const {
    children,
    className,
    contentClassName,
    tone = "dark-on-paper",
    variant = "outline",
    lockedFill = false,
    magneticStrength = 0.2,
    ariaLabel,
    cursorMode = "pointer",
    cursorLabel,
  } = props;

  const rootRef = useRef<HTMLElement | null>(null);
  const orbRef = useRef<HTMLSpanElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const hoveredRef = useRef(false);

  // Gracefully retract the locked ink fill once `lockedFill` turns off and pointer is away
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    if (lockedFill) {
      orb.style.width = "240%";
      orb.style.height = "240%";
      orb.style.left = "50%";
      orb.style.top = "50%";
      orb.style.transition = "transform 520ms cubic-bezier(0.16, 1, 0.3, 1)";
      orb.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
    } else if (!hoveredRef.current) {
      orb.style.transition = "transform 540ms cubic-bezier(0.22, 1, 0.36, 1)";
      orb.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
    }
  }, [lockedFill]);

  const positionOrb = (e: MouseEvent<HTMLElement>) => {
    const root = rootRef.current;
    const orb = orbRef.current;
    if (!root || !orb) return;

    const rect = root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxX = Math.max(x, rect.width - x);
    const maxY = Math.max(y, rect.height - y);
    const diameter = Math.ceil(Math.hypot(maxX, maxY) * 2.15);

    orb.style.width = `${diameter}px`;
    orb.style.height = `${diameter}px`;
    orb.style.left = `${x.toFixed(1)}px`;
    orb.style.top = `${y.toFixed(1)}px`;
  };

  const handleEnter = (e: MouseEvent<HTMLElement>) => {
    hoveredRef.current = true;
    const orb = orbRef.current;
    positionOrb(e);
    if (orb && !lockedFill) {
      // Snap origin to entry point before expanding
      orb.style.transition = "none";
      orb.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
      void orb.offsetWidth;
      orb.style.transition =
        "transform 620ms cubic-bezier(0.16, 1, 0.3, 1)";
      orb.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
    }
  };

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || magneticStrength <= 0) return;

    const rect = root.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width * 0.5)) * magneticStrength;
    const dy = (e.clientY - (rect.top + rect.height * 0.5)) * magneticStrength;
    root.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;

    if (inner) {
      inner.style.transform = `translate3d(${(dx * 0.35).toFixed(2)}px, ${(dy * 0.35).toFixed(2)}px, 0)`;
    }
  };

  const handleLeave = (e: MouseEvent<HTMLElement>) => {
    hoveredRef.current = false;
    const root = rootRef.current;
    const orb = orbRef.current;
    const inner = innerRef.current;

    if (root) {
      root.style.transform = "translate3d(0px, 0px, 0px)";
    }
    if (inner) {
      inner.style.transform = "translate3d(0px, 0px, 0px)";
    }

    if (orb && !lockedFill) {
      positionOrb(e);
      orb.style.transition =
        "transform 540ms cubic-bezier(0.22, 1, 0.36, 1)";
      orb.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
    }
  };

  // Strict monochrome palette rules (Paper #F5F4F0 × Ink #0D0D0D)
  const paletteClass =
    tone === "light-on-ink"
      ? variant === "solid"
        ? lockedFill
          ? "border-[#F5F4F0] bg-[#F5F4F0] text-[#0D0D0D]"
          : "border-[#F5F4F0] bg-[#F5F4F0] text-[#0D0D0D] hover:text-[#F5F4F0]"
        : lockedFill
          ? "border-[#F5F4F0] bg-[#F5F4F0] text-[#0D0D0D]"
          : "border-[#F5F4F0]/26 bg-transparent text-[#F5F4F0] hover:border-[#F5F4F0] hover:text-[#0D0D0D]"
      : variant === "solid"
        ? lockedFill
          ? "border-[#0D0D0D] bg-[#FAF9F6] text-[#0D0D0D]"
          : "border-[#0D0D0D] bg-[#0D0D0D] text-[#F5F4F0] hover:text-[#0D0D0D]"
        : lockedFill
          ? "border-[#0D0D0D] bg-[#0D0D0D] text-[#F5F4F0]"
          : "border-[#0D0D0D]/26 bg-transparent text-[#0D0D0D] hover:border-[#0D0D0D] hover:text-[#F5F4F0]";

  const orbColorClass =
    tone === "light-on-ink"
      ? variant === "solid"
        ? "bg-[#0D0D0D]"
        : "bg-[#F5F4F0]"
      : variant === "solid"
        ? "bg-[#FAF9F6]"
        : "bg-[#0D0D0D]";

  const sharedClass = cn(
    "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border transition-[color,border-color,background-color,transform] duration-500 ease-expo-out will-change-transform active:scale-[0.97]",
    paletteClass,
    className
  );

  const content = (
    <>
      {/* Directional Expanding Liquid Ink Orb */}
      <span
        ref={orbRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 z-0 rounded-full will-change-transform",
          orbColorClass
        )}
        style={{
          transform: "translate3d(-50%, -50%, 0) scale(0)",
        }}
      />

      {/* Foreground Content Layer with Subtle Inner Parallax */}
      <span
        ref={innerRef}
        className={cn(
          "relative z-10 inline-flex items-center justify-center gap-2 transition-transform duration-500 ease-expo-out will-change-transform",
          contentClassName
        )}
      >
        {children}
      </span>
    </>
  );

  if (typeof props.href === "string") {
    return (
      <a
        ref={(node) => {
          rootRef.current = node;
        }}
        href={props.href}
        target={props.target}
        rel={props.rel}
        download={props.download}
        onClick={props.onClick}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        aria-label={ariaLabel}
        data-cursor={cursorMode}
        data-cursor-label={cursorLabel}
        className={sharedClass}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        rootRef.current = node;
      }}
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={ariaLabel}
      data-cursor={cursorMode}
      data-cursor-label={cursorLabel}
      className={sharedClass}
    >
      {content}
    </button>
  );
}
