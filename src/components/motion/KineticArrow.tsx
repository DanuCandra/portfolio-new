"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

type ArrowDirection = "up-right" | "right" | "left" | "up" | "down";
type GroupScope = "default" | "btn" | "demo";

interface KineticArrowProps {
  direction?: ArrowDirection;
  className?: string;
  iconClassName?: string;
  /** Matches ancestor Tailwind group modifier (`group`, `group/btn`, or `group/demo`) */
  groupScope?: GroupScope;
}

const ICONS = {
  "up-right": ArrowUpRight,
  right: ArrowRight,
  left: ArrowLeft,
  up: ArrowUp,
  down: ArrowDown,
} as const;

const EXIT_CLASS: Record<GroupScope, Record<ArrowDirection, string>> = {
  default: {
    "up-right": "group-hover:translate-x-[125%] group-hover:-translate-y-[125%]",
    right: "group-hover:translate-x-[130%]",
    left: "group-hover:-translate-x-[130%]",
    up: "group-hover:-translate-y-[130%]",
    down: "group-hover:translate-y-[130%]",
  },
  btn: {
    "up-right":
      "group-hover/btn:translate-x-[125%] group-hover/btn:-translate-y-[125%]",
    right: "group-hover/btn:translate-x-[130%]",
    left: "group-hover/btn:-translate-x-[130%]",
    up: "group-hover/btn:-translate-y-[130%]",
    down: "group-hover/btn:translate-y-[130%]",
  },
  demo: {
    "up-right":
      "group-hover/demo:translate-x-[125%] group-hover/demo:-translate-y-[125%]",
    right: "group-hover/demo:translate-x-[130%]",
    left: "group-hover/demo:-translate-x-[130%]",
    up: "group-hover/demo:-translate-y-[130%]",
    down: "group-hover/demo:translate-y-[130%]",
  },
};

const ENTER_FROM: Record<ArrowDirection, string> = {
  "up-right": "-translate-x-[125%] translate-y-[125%]",
  right: "-translate-x-[130%]",
  left: "translate-x-[130%]",
  up: "translate-y-[130%]",
  down: "-translate-y-[130%]",
};

const ENTER_TO: Record<GroupScope, string> = {
  default: "group-hover:translate-x-0 group-hover:translate-y-0",
  btn: "group-hover/btn:translate-x-0 group-hover/btn:translate-y-0",
  demo: "group-hover/demo:translate-x-0 group-hover/demo:translate-y-0",
};

/**
 * Dual-Slot Directional Arrow Micro-Interaction (0 JS overhead, 120 FPS CSS transform).
 * Saat di-hover, panah aktif meluncur keluar sesuai arahnya sementara panah baru
 * meluncur masuk mulus dari sisi berlawanan.
 */
export function KineticArrow({
  direction = "up-right",
  className,
  iconClassName = "h-3.5 w-3.5",
  groupScope = "default",
}: KineticArrowProps) {
  const Icon = ICONS[direction];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Resting Arrow (exits along vector on hover) */}
      <Icon
        className={cn(
          "transition-transform duration-[460ms] ease-spring-out will-change-transform",
          iconClassName,
          EXIT_CLASS[groupScope][direction]
        )}
      />

      {/* Fresh Arrow (glides in from opposite edge on hover) */}
      <Icon
        className={cn(
          "absolute inset-0 m-auto transition-transform duration-[460ms] ease-spring-out will-change-transform",
          iconClassName,
          ENTER_FROM[direction],
          ENTER_TO[groupScope]
        )}
      />
    </span>
  );
}
