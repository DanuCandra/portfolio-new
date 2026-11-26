"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { motionState } from "@/lib/motion-store";

/**
 * High-Contrast Industrial Photography Studio Environment (Dieter Rams × Apple).
 * - `<Environment resolution={256} frames={1}>` di-bake HANYA SEKALI saat mount (0ms/frame runtime).
 * - Perpaduan overhead silk softbox putih + negative-fill hitam pekat + diagonal specular strip
 *   menghasilkan pantulan kaca optik & chamfer titanium ala ray-tracing di atas kanvas putih #F5F4F0.
 */
export function StudioEnvironment() {
  const specularLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    const light = specularLightRef.current;
    if (!light) return;
    const dt = Math.min(delta, 0.05);
    const mx = motionState.reducedMotion ? 0 : motionState.ndcX;
    const my = motionState.reducedMotion ? 0 : motionState.ndcY;

    // Subtle specular reflection sweep across glass & brushed chamfer as cursor glides
    light.position.x = THREE.MathUtils.lerp(
      light.position.x,
      3.8 + mx * 2.8,
      1 - Math.exp(-dt * 4.5)
    );
    light.position.y = THREE.MathUtils.lerp(
      light.position.y,
      5.4 + my * 1.4,
      1 - Math.exp(-dt * 4.5)
    );
  });

  return (
    <>
      <Environment resolution={256} frames={1}>
        {/* Overhead wide architectural white silk softbox */}
        <Lightformer
          form="rect"
          intensity={2.9}
          color="#FFFFFF"
          scale={[14, 4.2, 1]}
          position={[0, 7.5, 2.2]}
          rotation={[Math.PI / 2.15, 0, 0]}
        />

        {/* Crisp diagonal razor highlight strip for ray-traced glass reflections */}
        <Lightformer
          form="rect"
          intensity={5.4}
          color="#FAF9F6"
          scale={[1.6, 10, 1]}
          position={[5.8, 3.2, 4.8]}
          rotation={[0.2, -0.78, -0.35]}
        />

        {/* Left secondary cool-silver rim reflection */}
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#EFECE6"
          scale={[3.2, 7.5, 1]}
          position={[-7.2, 2.4, 3.4]}
          rotation={[0, Math.PI / 2.3, 0.12]}
        />

        {/* Sculptural dark negative-fill flags to give glass & metal razor contrast */}
        <Lightformer
          form="rect"
          intensity={0.08}
          color="#0D0D0D"
          scale={[9, 6, 1]}
          position={[-3.5, 1.5, 6.5]}
          rotation={[0, 0.45, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.06}
          color="#0D0D0D"
          scale={[12, 4, 1]}
          position={[0, 3.8, -7.5]}
        />

        {/* Soft warm alabaster paper bounce from below */}
        <Lightformer
          form="rect"
          intensity={1.55}
          color="#F5F4F0"
          scale={[18, 12, 1]}
          position={[0, -4.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Environment>

      {/* Clean physical studio key & fill lighting (zero colored neon lights) */}
      <ambientLight intensity={0.42} color="#FAF9F6" />

      <directionalLight
        ref={specularLightRef}
        position={[3.8, 5.4, 5.2]}
        intensity={1.75}
        color="#FFFFFF"
      />

      <directionalLight
        position={[-4.5, 2.8, 3.5]}
        intensity={0.65}
        color="#EFECE6"
      />
    </>
  );
}
