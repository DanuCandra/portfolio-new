import type { ProjectItem } from "@/types/portfolio";

export type SurfaceMode = "paper" | "ink";

/**
 * Shared-Element FLIP payload captured at click time for Project -> Case Study Hero Morph.
 */
export interface FlipTransitionPayload {
  project: ProjectItem;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface MotionRuntimeState {
  scrollY: number;
  scrollProgress: number; // 0..1
  scrollVelocity: number;
  smoothVelocity: number;

  mouseX: number; // viewport px
  mouseY: number; // viewport px
  ndcX: number; // -1..1
  ndcY: number; // -1..1
  pointerActive: boolean;

  /** Surface behind the viewport focal center (drives Particles & Cursor tone) */
  surfaceMode: SurfaceMode;
  /** Surface directly behind the top navbar (drives Auto-Invert Navbar) */
  navSurfaceMode: SurfaceMode;

  /** Subtle breeze pulse when user clicks open space (0..1) */
  breezeImpulse: number;
  breezeX: number;
  breezeY: number;

  /** Preserve exact scroll position across in-place ID <-> EN locale morph */
  preserveScrollY: number | null;
  /** Target hash selector to land on cleanly behind shutter after cross-route navigation */
  pendingHash: string | null;
  /** Shared-element FLIP payload bus for Project -> Case Study hero morph */
  pendingFlip: FlipTransitionPayload | null;

  reducedMotion: boolean;
}

export const motionState: MotionRuntimeState = {
  scrollY: 0,
  scrollProgress: 0,
  scrollVelocity: 0,
  smoothVelocity: 0,

  mouseX: -1000,
  mouseY: -1000,
  ndcX: 0,
  ndcY: 0,
  pointerActive: false,

  surfaceMode: "paper",
  navSurfaceMode: "paper",

  breezeImpulse: 0,
  breezeX: 0,
  breezeY: 0,

  preserveScrollY: null,
  pendingHash: null,
  pendingFlip: null,

  reducedMotion: false,
};

type SurfaceListener = () => void;
const surfaceListeners = new Set<SurfaceListener>();

export function subscribeSurfaceMode(listener: SurfaceListener): () => void {
  surfaceListeners.add(listener);
  return () => {
    surfaceListeners.delete(listener);
  };
}

function notifySurfaceListeners() {
  surfaceListeners.forEach((fn) => fn());
}

export function updateScrollTelemetry(
  scrollY: number,
  scrollProgress: number,
  scrollVelocity: number
): void {
  motionState.scrollY = scrollY;
  motionState.scrollProgress = scrollProgress;
  motionState.scrollVelocity = scrollVelocity;
}

export function stepSmoothVelocity(dt: number): void {
  const k = 1 - Math.exp(-Math.min(dt, 0.05) * 8.5);
  motionState.smoothVelocity +=
    (motionState.scrollVelocity - motionState.smoothVelocity) * k;
  motionState.scrollVelocity *= Math.exp(-Math.min(dt, 0.05) * 6.5);
  if (Math.abs(motionState.scrollVelocity) < 0.001) {
    motionState.scrollVelocity = 0;
  }
  if (motionState.breezeImpulse > 0.002) {
    motionState.breezeImpulse *= Math.exp(-Math.min(dt, 0.05) * 4.2);
  } else {
    motionState.breezeImpulse = 0;
  }
}

export function updatePointerTelemetry(
  clientX: number,
  clientY: number,
  active: boolean
): void {
  const w = typeof window !== "undefined" ? window.innerWidth || 1 : 1;
  const h = typeof window !== "undefined" ? window.innerHeight || 1 : 1;
  motionState.mouseX = clientX;
  motionState.mouseY = clientY;
  motionState.ndcX = (clientX / w) * 2 - 1;
  motionState.ndcY = -(clientY / h) * 2 + 1;
  motionState.pointerActive = active;
}

export function triggerInkBreeze(clientX: number, clientY: number): void {
  motionState.breezeX = clientX;
  motionState.breezeY = clientY;
  motionState.breezeImpulse = 1;
}

export function setSurfaceModes(
  surface: SurfaceMode,
  navSurface: SurfaceMode
): void {
  if (
    motionState.surfaceMode === surface &&
    motionState.navSurfaceMode === navSurface
  ) {
    return;
  }
  motionState.surfaceMode = surface;
  motionState.navSurfaceMode = navSurface;
  notifySurfaceListeners();
}

export function setReducedMotionFlag(value: boolean): void {
  motionState.reducedMotion = value;
}

export function queuePreserveScroll(y: number | null): void {
  motionState.preserveScrollY = y;
}

export function queuePendingHash(hash: string | null): void {
  motionState.pendingHash = hash;
}

export function setPendingFlip(payload: FlipTransitionPayload | null): void {
  motionState.pendingFlip = payload;
}
