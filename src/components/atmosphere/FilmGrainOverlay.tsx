"use client";

import { useEffect, useRef } from "react";

let cachedGrainDataUrl: string | null = null;

function generateArchivalGrainTile(): string {
  if (cachedGrainDataUrl) return cachedGrainDataUrl;

  const size = 144;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(size, size);
  const data = img.data;

  // Deterministic PRNG for ultra-fine organic 35mm cotton-paper grain
  let seed = 202607;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = 0; i < data.length; i += 4) {
    const n = rand();
    // Alternating subtle dark & warm highlight micro-specks so it works on BOTH Paper (#F5F4F0) & Ink (#0D0D0D)
    const isLight = n > 0.52;
    const tone = isLight ? 245 : 13;
    const strength = Math.abs(n - 0.5) * 2; // 0..1
    const alpha = Math.round(strength * strength * 26);

    data[i] = tone;
    data[i + 1] = tone;
    data[i + 2] = tone;
    data[i + 3] = alpha;
  }

  ctx.putImageData(img, 0, 0);
  cachedGrainDataUrl = canvas.toDataURL("image/png");
  return cachedGrainDataUrl;
}

/**
 * Analog 35mm Film / Archival Paper Grain Overlay.
 * Di-render sekali saja ke tile PNG kecil di memori (0% beban SVG feTurbulence, 0% lag per frame).
 */
export function FilmGrainOverlay() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    const tileUrl = generateArchivalGrainTile();
    if (tileUrl) {
      el.style.backgroundImage = `url(${tileUrl})`;
    }
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] opacity-75"
      style={{
        backgroundRepeat: "repeat",
        backgroundSize: "144px 144px",
      }}
    />
  );
}
