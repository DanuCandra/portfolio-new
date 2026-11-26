"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const SCREEN_W = 1536;
const SCREEN_H = 960;

interface CodeToken {
  text: string;
  color: string;
}

/**
 * Refined Monochrome Editorial Dark-Mode Syntax Palette (Zed / Minimal Studio — ZERO neon):
 * - Canvas: #0D0D0D (matches Scene 3 Matte Ink 1:1 for invisible portal handoff!)
 * - Primary identifiers: #F5F4F0 (Alabaster)
 * - Keywords: #9A9B9F (Cool Titanium)
 * - Strings & types: #CFC8B8 (Warm Sand / Bone)
 * - Punctuation: #6E6D68 (Stone)
 * - Comments & line numbers: #454440
 */
const LARAVEL_CODE_LINES: CodeToken[][] = [
  [{ text: "<?php", color: "#9A9B9F" }],
  [],
  [
    { text: "namespace ", color: "#9A9B9F" },
    { text: "App\\Http\\Controllers", color: "#F5F4F0" },
    { text: ";", color: "#6E6D68" },
  ],
  [],
  [
    { text: "use ", color: "#9A9B9F" },
    { text: "App\\Models\\Project", color: "#F5F4F0" },
    { text: ";", color: "#6E6D68" },
  ],
  [
    { text: "use ", color: "#9A9B9F" },
    { text: "Illuminate\\Http\\JsonResponse", color: "#F5F4F0" },
    { text: ";", color: "#6E6D68" },
  ],
  [],
  [
    { text: "class ", color: "#9A9B9F" },
    { text: "ProjectController ", color: "#F5F4F0" },
    { text: "extends ", color: "#9A9B9F" },
    { text: "Controller", color: "#CFC8B8" },
  ],
  [{ text: "{", color: "#6E6D68" }],
  [
    { text: "    public function ", color: "#9A9B9F" },
    { text: "index", color: "#F5F4F0" },
    { text: "(): ", color: "#6E6D68" },
    { text: "JsonResponse", color: "#CFC8B8" },
  ],
  [{ text: "    {", color: "#6E6D68" }],
  [
    { text: "        $projects", color: "#F5F4F0" },
    { text: " = ", color: "#6E6D68" },
    { text: "Project", color: "#CFC8B8" },
    { text: "::", color: "#6E6D68" },
    { text: "query", color: "#F5F4F0" },
    { text: "()", color: "#6E6D68" },
  ],
  [
    { text: "            ->", color: "#6E6D68" },
    { text: "where", color: "#F5F4F0" },
    { text: "(", color: "#6E6D68" },
    { text: "'published'", color: "#CFC8B8" },
    { text: ", ", color: "#6E6D68" },
    { text: "true", color: "#9A9B9F" },
    { text: ")", color: "#6E6D68" },
  ],
  [
    { text: "            ->", color: "#6E6D68" },
    { text: "orderBy", color: "#F5F4F0" },
    { text: "(", color: "#6E6D68" },
    { text: "'sort_order'", color: "#CFC8B8" },
    { text: ")", color: "#6E6D68" },
  ],
  [
    { text: "            ->", color: "#6E6D68" },
    { text: "get", color: "#F5F4F0" },
    { text: "([", color: "#6E6D68" },
    { text: "'slug'", color: "#CFC8B8" },
    { text: ", ", color: "#6E6D68" },
    { text: "'title'", color: "#CFC8B8" },
    { text: ", ", color: "#6E6D68" },
    { text: "'demo_url'", color: "#CFC8B8" },
    { text: "]);", color: "#6E6D68" },
  ],
  [],
  [
    { text: "        return ", color: "#9A9B9F" },
    { text: "response", color: "#F5F4F0" },
    { text: "()->", color: "#6E6D68" },
    { text: "json", color: "#F5F4F0" },
    { text: "([", color: "#6E6D68" },
    { text: "'data'", color: "#CFC8B8" },
    { text: " => ", color: "#6E6D68" },
    { text: "$projects", color: "#F5F4F0" },
    { text: "]);", color: "#6E6D68" },
  ],
  [{ text: "    }", color: "#6E6D68" }],
  [],
  [
    { text: "    public function ", color: "#9A9B9F" },
    { text: "show", color: "#F5F4F0" },
    { text: "(", color: "#6E6D68" },
    { text: "Project ", color: "#CFC8B8" },
    { text: "$project", color: "#F5F4F0" },
    { text: "): ", color: "#6E6D68" },
    { text: "JsonResponse", color: "#CFC8B8" },
  ],
  [{ text: "    {", color: "#6E6D68" }],
  [
    { text: "        abort_unless", color: "#9A9B9F" },
    { text: "(", color: "#6E6D68" },
    { text: "$project->published", color: "#F5F4F0" },
    { text: ", ", color: "#6E6D68" },
    { text: "404", color: "#CFC8B8" },
    { text: ");", color: "#6E6D68" },
  ],
  [
    { text: "        return ", color: "#9A9B9F" },
    { text: "response", color: "#F5F4F0" },
    { text: "()->", color: "#6E6D68" },
    { text: "json", color: "#F5F4F0" },
    { text: "([", color: "#6E6D68" },
    { text: "'data'", color: "#CFC8B8" },
    { text: " => ", color: "#6E6D68" },
    { text: "$project", color: "#F5F4F0" },
    { text: "]);", color: "#6E6D68" },
  ],
  [{ text: "    }", color: "#6E6D68" }],
  [{ text: "}", color: "#6E6D68" }],
];

const FILE_TREE = [
  { name: "app/", indent: 0, active: false, folder: true },
  { name: "Http/", indent: 1, active: false, folder: true },
  { name: "Controllers/", indent: 2, active: false, folder: true },
  { name: "ProjectController.php", indent: 3, active: true, folder: false },
  { name: "Models/", indent: 1, active: false, folder: true },
  { name: "Project.php", indent: 2, active: false, folder: false },
  { name: "routes/", indent: 0, active: false, folder: true },
  { name: "api.php", indent: 1, active: false, folder: false },
  { name: "web.php", indent: 1, active: false, folder: false },
  { name: "database/", indent: 0, active: false, folder: true },
  { name: "migrations/", indent: 1, active: false, folder: true },
];

/**
 * Minimalist Dark-Mode Laravel Code Editor CanvasTexture (1536×960).
 * - Latar dasar tepat `#0D0D0D` sehingga saat kamera zoom masuk ke layar, kode memudar halus
 *   dan menyatu 100% seamless ke Scene 3 (`#0D0D0D` Quiet Statement).
 * - Throttled ke ~10 FPS dan hanya digambar saat layar laptop terbuka & terlihat.
 */
export function useLaravelCodeTexture() {
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastDrawMsRef = useRef<number>(-1);
  const lastVisRef = useRef<number>(-1);
  const startMsRef = useRef<number>(0);

  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = SCREEN_W;
    canvas.height = SCREEN_H;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  useEffect(() => {
    textureRef.current = texture;
    if (!texture) return;
    const canvas = texture.image as HTMLCanvasElement;
    ctxRef.current = canvas.getContext("2d");

    return () => {
      textureRef.current = null;
      ctxRef.current = null;
      texture.dispose();
    };
  }, [texture]);

  const totalChars = useMemo(
    () =>
      LARAVEL_CODE_LINES.reduce(
        (acc, line) =>
          acc + line.reduce((s, tk) => s + tk.text.length, 0) + 1,
        0
      ),
    []
  );

  const drawFrame = useCallback(
    (visibility: number) => {
      const ctx = ctxRef.current;
      const tex = textureRef.current;
      if (!ctx || !tex) return;

      const nowMs = performance.now();
      if (startMsRef.current === 0) {
        startMsRef.current = nowMs;
      }

      const clampedVis = Math.min(Math.max(visibility, 0), 1);
      const visChanged = Math.abs(clampedVis - lastVisRef.current) > 0.025;

      // Use monotonic performance.now() (immune to R3F clock reset on frameloop sleep/wake!)
      // Redraw immediately whenever visibility changes (scroll-forward / scroll-back fade),
      // otherwise throttle typing cadence cleanly to ~10 FPS.
      if (
        !visChanged &&
        lastDrawMsRef.current >= 0 &&
        nowMs - lastDrawMsRef.current < 95
      ) {
        return;
      }

      lastDrawMsRef.current = nowMs;
      lastVisRef.current = clampedVis;

      const elapsed = (nowMs - startMsRef.current) * 0.001;

      // Pure #0D0D0D Matte Ink Canvas (exact 1:1 color match with Scene 3!)
      ctx.fillStyle = "#0D0D0D";
      ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

      if (clampedVis <= 0.01) {
        tex.needsUpdate = true;
        return;
      }

      ctx.save();
      ctx.globalAlpha = clampedVis;

      // 1. Sleek macOS Notch-Safe Menu Bar (top 40px aligns seamlessly behind physical 3D notch!)
      const menuH = 40;
      ctx.fillStyle = "#0A0A0B";
      ctx.fillRect(0, 0, SCREEN_W, menuH);
      ctx.fillStyle = "rgba(245, 244, 240, 0.06)";
      ctx.fillRect(0, menuH - 1, SCREEN_W, 1);

      ctx.font = "500 13px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#A6A59E";
      ctx.fillText("danucs   File   Edit   View   Terminal", 28, 25);

      ctx.font = "400 13px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#73726C";
      ctx.fillText("Laravel 12 · PHP 8.4", SCREEN_W - 196, 25);

      // 2. Minimalist Editor Tab Header right below macOS Menu Bar
      const topH = menuH + 44;
      ctx.fillStyle = "#111112";
      ctx.fillRect(0, menuH, SCREEN_W, 44);
      ctx.fillStyle = "rgba(245, 244, 240, 0.065)";
      ctx.fillRect(0, topH - 1, SCREEN_W, 1);

      // Subtle monochrome macOS window dots
      const dotColors = ["#3A3A38", "#3A3A38", "#3A3A38"];
      dotColors.forEach((c, idx) => {
        ctx.beginPath();
        ctx.arc(30 + idx * 20, menuH + 22, 4.8, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });

      ctx.font = "500 14px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#A6A59E";
      ctx.fillText("app / Http / Controllers / ProjectController.php", 104, menuH + 27);

      // 2. Narrow Minimalist Explorer Sidebar
      const sideW = 290;
      const footerH = 38;
      ctx.fillStyle = "#0F0F10";
      ctx.fillRect(0, topH, sideW, SCREEN_H - topH - footerH);
      ctx.fillStyle = "rgba(245, 244, 240, 0.065)";
      ctx.fillRect(sideW, topH, 1, SCREEN_H - topH - footerH);

      ctx.font = "500 12px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#575652";
      ctx.fillText("PROJECT", 26, topH + 38);

      FILE_TREE.forEach((item, idx) => {
        const y = topH + 78 + idx * 36;
        if (item.active) {
          ctx.fillStyle = "rgba(245, 244, 240, 0.06)";
          ctx.fillRect(0, y - 22, sideW, 32);
          ctx.fillStyle = "#F5F4F0";
          ctx.fillRect(0, y - 22, 2, 32);
        }
        ctx.font = item.active
          ? "500 14px 'JetBrains Mono', monospace"
          : "400 14px 'JetBrains Mono', monospace";
        ctx.fillStyle = item.active
          ? "#F5F4F0"
          : item.folder
          ? "#8E8D87"
          : "#686762";
        const x = 24 + item.indent * 16;
        ctx.fillText(item.name, x, y);
      });

      // 3. Main Dark-Mode Laravel Editor with Live Typing Caret
      const editorX = sideW + 38;
      const startY = topH + 54;
      const lineStep = 32;

      // Smooth continuous typing cycle (starts ~32% typed so screen looks alive immediately, types smoothly to 100%)
      const cycleSec = 16;
      const cyclePos = (elapsed % cycleSec) / cycleSec;
      const typingRatio = Math.min(cyclePos / 0.78, 1);
      const visibleChars = Math.floor(totalChars * (0.34 + 0.66 * typingRatio));

      let count = 0;
      let caretX = editorX + 54;
      let caretY = startY;
      let activeRow = 0;

      ctx.font = "400 19px 'JetBrains Mono', monospace";

      LARAVEL_CODE_LINES.forEach((tokens, lineIdx) => {
        const y = startY + lineIdx * lineStep;
        if (y > SCREEN_H - footerH - 22) return;

        // Subtle line number
        ctx.fillStyle = "#3E3D3A";
        ctx.fillText(String(lineIdx + 1).padStart(2, " "), editorX, y);

        let curX = editorX + 52;
        let touched = false;

        tokens.forEach((tk) => {
          if (count >= visibleChars) return;
          const remaining = visibleChars - count;
          const slice =
            remaining >= tk.text.length ? tk.text : tk.text.slice(0, remaining);

          ctx.fillStyle = tk.color;
          ctx.fillText(slice, curX, y);
          curX += ctx.measureText(slice).width;
          count += slice.length;
          touched = true;
        });

        count += 1;
        if (touched) {
          caretX = curX + 2;
          caretY = y;
          activeRow = lineIdx;
        }
      });

      // Ultra-subtle active line highlight
      ctx.fillStyle = "rgba(245, 244, 240, 0.025)";
      ctx.fillRect(sideW + 1, startY + activeRow * lineStep - 22, SCREEN_W - sideW, lineStep);

      // Clean blinking Alabaster caret
      if (Math.sin(elapsed * 6.4) > -0.15) {
        ctx.fillStyle = "#F5F4F0";
        ctx.fillRect(caretX, caretY - 18, 2.5, 22);
      }

      // 4. Minimal Bottom Status Bar
      ctx.fillStyle = "#111112";
      ctx.fillRect(0, SCREEN_H - footerH, SCREEN_W, footerH);
      ctx.fillStyle = "rgba(245, 244, 240, 0.07)";
      ctx.fillRect(0, SCREEN_H - footerH, SCREEN_W, 1);

      ctx.font = "400 13px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#6E6D68";
      ctx.fillText("main · ProjectController.php", 26, SCREEN_H - 14);
      ctx.fillText(
        `Ln ${activeRow + 1} · UTF-8 · PHP`,
        SCREEN_W - 210,
        SCREEN_H - 14
      );

      ctx.restore();
      tex.needsUpdate = true;
    },
    [totalChars]
  );

  return { texture, drawFrame };
}
