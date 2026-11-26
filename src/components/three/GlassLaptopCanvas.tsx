"use client";

import { Suspense, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionState } from "@/lib/motion-store";
import { portalState, subscribeStageActive } from "@/lib/portal-store";
import {
  ArchitecturalGlassLaptop,
  CHASSIS_D,
  HINGE_Y,
  HINGE_Z,
  LAPTOP_REST_Y,
  SCREEN_CENTER_Y,
} from "./ArchitecturalGlassLaptop";
import { StudioEnvironment } from "./StudioEnvironment";

const getStageActiveSnapshot = () => portalState.stageActive;
const getServerStageActive = () => true;

/**
 * 1:1 Reversible Optical Glass Portal Camera Choreography:
 * - p 0.00..0.46: Clean architectural studio framing as laptop rises & opens
 * - p 0.46..0.92: Straight-through optical glass fly-through aiming directly at exact screen center
 * - Scroll back: Reverses seamlessly back out of the screen bezel onto the white paper studio!
 */
function PortalCameraRig() {
  const smoothPRef = useRef(0);
  const desiredPos = useMemo(() => new THREE.Vector3(0, 0.95, 5.55), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.15, 0), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 0.15, 0), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const cam = state.camera;

    smoothPRef.current = THREE.MathUtils.lerp(
      smoothPRef.current,
      portalState.portalProgress,
      1 - Math.exp(-dt * 10.5)
    );

    const p = smoothPRef.current;
    const s = portalState.responsiveScale;
    const mx = motionState.reducedMotion ? 0 : motionState.ndcX;
    const my = motionState.reducedMotion ? 0 : motionState.ndcY;

    // Exact world-space Y center of the open optical glass window
    const screenWorldY =
      LAPTOP_REST_Y + (HINGE_Y + CHASSIS_D * 0.5 + SCREEN_CENTER_Y) * s;
    const screenWorldZ = HINGE_Z * s;

    const alignT = THREE.MathUtils.smoothstep(p, 0.22, 0.56);
    const diveT = THREE.MathUtils.smoothstep(p, 0.54, 0.9);
    const diveEase = diveT * diveT * (3 - 2 * diveT);
    const parallaxFade = 1 - THREE.MathUtils.smoothstep(p, 0.45, 0.68);

    const startZ = s < 0.78 ? 6.95 : 5.55;
    const midZ = s < 0.78 ? 5.15 : 4.25;
    // Stops cleanly in front of the glossy #0D0D0D OLED screen where it fills 100% of any viewport (up to 21:9) without clipping behind the solid lid
    const endZ = screenWorldZ + 0.68 * s;

    const camZ = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(startZ, midZ, alignT),
      endZ,
      diveEase
    );
    const camY =
      THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.95, screenWorldY + 0.06, alignT),
        screenWorldY,
        diveEase
      ) +
      my * 0.18 * parallaxFade;
    const camX = mx * 0.26 * parallaxFade;

    desiredPos.set(camX, camY, camZ);

    const lookY = THREE.MathUtils.lerp(0.18, screenWorldY, alignT);
    const lookZ = THREE.MathUtils.lerp(0, screenWorldZ - 4.5, diveEase);
    lookTarget.set(mx * 0.1 * parallaxFade, lookY, lookZ);

    const k = 1 - Math.exp(-dt * 11.0);
    cam.position.lerp(desiredPos, k);
    currentLook.lerp(lookTarget, k);
    cam.lookAt(currentLook);

    if (cam instanceof THREE.PerspectiveCamera) {
      const targetFov = THREE.MathUtils.lerp(38, 36, alignT) + diveEase * 14;
      if (Math.abs(cam.fov - targetFov) > 0.02) {
        cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, dt * 8.0);
        cam.updateProjectionMatrix();
      }
    }
  });

  return null;
}

/**
 * Ultra-Lightweight Native-MSAA WebGL Stage with Auto GPU Sleep (`frameloop` switches to "demand"
 * automatically when scrolled past the Hero Portal into Scene 3–5 -> 0% GPU cost!).
 */
export function GlassLaptopCanvas() {
  const stageActive = useSyncExternalStore(
    subscribeStageActive,
    getStageActiveSnapshot,
    getServerStageActive
  );

  return (
    <Canvas
      frameloop={stageActive ? "always" : "demand"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.95, 5.55], fov: 38, near: 0.08, far: 60 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.06,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <PortalCameraRig />
      <Suspense fallback={null}>
        <StudioEnvironment />
        <ArchitecturalGlassLaptop />
      </Suspense>
    </Canvas>
  );
}
