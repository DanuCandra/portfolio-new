"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionState } from "@/lib/motion-store";
import { portalState } from "@/lib/portal-store";
import { useLaravelCodeTexture } from "./useLaravelCodeTexture";

// Modern MacBook Pro 16" (M4 Space Black) Precision Proportions
export const CHASSIS_W = 3.52;
export const CHASSIS_D = 2.38;
export const BASE_H = 0.068;
export const LID_DEPTH = 0.026;
export const CORNER_R = 0.165;

// Razor-thin Liquid Retina XDR Bezels
export const BEZEL_X = 0.048;
export const BEZEL_TOP = 0.048;
export const BEZEL_BOTTOM = 0.072;

export const HINGE_Z = -CHASSIS_D * 0.5 + 0.048;
// Exact mechanical clearance so closed slim lid sits flush above base & keycaps
export const HINGE_Y = BASE_H * 0.5 + LID_DEPTH * 0.5 + 0.024;

export const SCREEN_W = CHASSIS_W - BEZEL_X * 2;
export const SCREEN_H = CHASSIS_D - BEZEL_TOP - BEZEL_BOTTOM;
export const SCREEN_CENTER_Y = (BEZEL_BOTTOM - BEZEL_TOP) * 0.5;
export const LAPTOP_REST_Y = -0.36;

// Signature MacBook Pro Center Camera Notch
const NOTCH_W = 0.34;
const NOTCH_H = 0.078;
const NOTCH_R = 0.028;

function createRoundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const hw = width * 0.5;
  const hh = height * 0.5;
  const r = Math.min(radius, hw, hh);

  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return shape;
}

/**
 * Liquid Retina XDR Display Shape: rounded top corners (`rTop`) + crisp bottom corners (`rBot`),
 * with normalized UVs [0..1] so our Laravel CanvasTexture maps edge-to-edge cleanly.
 */
function createMacBookDisplayGeometry(
  width: number,
  height: number,
  rTop: number,
  rBot: number
): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  const hw = width * 0.5;
  const hh = height * 0.5;

  shape.moveTo(-hw + rBot, -hh);
  shape.lineTo(hw - rBot, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + rBot);
  shape.lineTo(hw, hh - rTop);
  shape.quadraticCurveTo(hw, hh, hw - rTop, hh);
  shape.lineTo(-hw + rTop, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - rTop);
  shape.lineTo(-hw, -hh + rBot);
  shape.quadraticCurveTo(-hw, -hh, -hw + rBot, -hh);

  const geo = new THREE.ShapeGeometry(shape, 18);
  const pos = geo.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uvs[i * 2] = (x + hw) / width;
    uvs[i * 2 + 1] = (y + hh) / height;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return geo;
}

/**
 * Iconic MacBook Pro Camera Notch Housing: flush with top bezel, smoothly rounded bottom corners.
 */
function createNotchShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const hw = width * 0.5;
  const r = Math.min(radius, hw, height * 0.8);

  // Origin at top-center of notch (y goes 0 down to -height)
  shape.moveTo(-hw, 0);
  shape.lineTo(hw, 0);
  shape.lineTo(hw, -height + r);
  shape.quadraticCurveTo(hw, -height, hw - r, -height);
  shape.lineTo(-hw + r, -height);
  shape.quadraticCurveTo(-hw, -height, -hw, -height + r);
  shape.closePath();
  return shape;
}

function lidDegreesToRotationX(degrees: number): number {
  return THREE.MathUtils.degToRad(90 - degrees);
}

interface KeycapPlacement {
  x: number;
  z: number;
  w: number;
  d: number;
  label: string;
  secondary?: string;
  isTouchId?: boolean;
  isModifier?: boolean;
  align?: "left" | "right" | "center";
}

const KEY_DECK_W = 2.74;
const KEY_START_Z = -0.82;
const KEY_ROW_GAP = 0.172;
const KEY_DECK_Z_MIN = KEY_START_Z - 0.132 * 0.5;
const KEY_DECK_Z_MAX = KEY_START_Z + 5 * KEY_ROW_GAP + 0.144 * 0.5;
const KEY_DECK_D = KEY_DECK_Z_MAX - KEY_DECK_Z_MIN;
const KEY_DECK_CENTER_Z = (KEY_DECK_Z_MIN + KEY_DECK_Z_MAX) * 0.5;

const MACBOOK_KEY_LABELS: Array<
  Array<{
    label: string;
    secondary?: string;
    isTouchId?: boolean;
    isModifier?: boolean;
    align?: "left" | "right" | "center";
  }>
> = [
    [
      { label: "esc", isModifier: true, align: "left" },
      { label: "F1", isModifier: true },
      { label: "F2", isModifier: true },
      { label: "F3", isModifier: true },
      { label: "F4", isModifier: true },
      { label: "F5", isModifier: true },
      { label: "F6", isModifier: true },
      { label: "F7", isModifier: true },
      { label: "F8", isModifier: true },
      { label: "F9", isModifier: true },
      { label: "F10", isModifier: true },
      { label: "F11", isModifier: true },
      { label: "F12", isModifier: true },
      { label: "", isTouchId: true },
    ],
    [
      { label: "`", secondary: "~" },
      { label: "1", secondary: "!" },
      { label: "2", secondary: "@" },
      { label: "3", secondary: "#" },
      { label: "4", secondary: "$" },
      { label: "5", secondary: "%" },
      { label: "6", secondary: "^" },
      { label: "7", secondary: "&" },
      { label: "8", secondary: "*" },
      { label: "9", secondary: "(" },
      { label: "0", secondary: ")" },
      { label: "-", secondary: "_" },
      { label: "=", secondary: "+" },
      { label: "delete", isModifier: true, align: "right" },
    ],
    [
      { label: "tab", isModifier: true, align: "left" },
      { label: "Q" },
      { label: "W" },
      { label: "E" },
      { label: "R" },
      { label: "T" },
      { label: "Y" },
      { label: "U" },
      { label: "I" },
      { label: "O" },
      { label: "P" },
      { label: "[", secondary: "{" },
      { label: "]", secondary: "}" },
      { label: "\\", secondary: "|" },
    ],
    [
      { label: "caps", isModifier: true, align: "left" },
      { label: "A" },
      { label: "S" },
      { label: "D" },
      { label: "F" },
      { label: "G" },
      { label: "H" },
      { label: "J" },
      { label: "K" },
      { label: "L" },
      { label: ";", secondary: ":" },
      { label: "'", secondary: '"' },
      { label: "return", isModifier: true, align: "right" },
    ],
    [
      { label: "shift", isModifier: true, align: "left" },
      { label: "Z" },
      { label: "X" },
      { label: "C" },
      { label: "V" },
      { label: "B" },
      { label: "N" },
      { label: "M" },
      { label: ",", secondary: "<" },
      { label: ".", secondary: ">" },
      { label: "/", secondary: "?" },
      { label: "shift", isModifier: true, align: "right" },
    ],
    [
      { label: "fn", isModifier: true, align: "left" },
      { label: "⌃", isModifier: true },
      { label: "⌥", isModifier: true },
      { label: "⌘", isModifier: true },
      { label: "" },
      { label: "⌘", isModifier: true },
      { label: "⌥", isModifier: true },
      { label: "◀", isModifier: true },
      { label: "▲▼", isModifier: true },
      { label: "▶", isModifier: true },
    ],
  ];

function buildMacBookProKeyboard(): KeycapPlacement[] {
  const keys: KeycapPlacement[] = [];
  const keyGap = 0.022;

  // Modern MacBook Pro layout: full-height function row (top) + wide command/space row (bottom)
  const rows: number[][] = [
    [1.35, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.05],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.55],
    [1.45, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1],
    [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.85],
    [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.35],
    [1.05, 1.05, 1.05, 1.35, 5.2, 1.35, 1.05, 1.05, 1.05, 1.05],
  ];

  rows.forEach((row, rowIdx) => {
    const totalWeight = row.reduce((acc, w) => acc + w, 0);
    const usableW = KEY_DECK_W - keyGap * (row.length - 1);
    const unitW = usableW / totalWeight;
    const keyD = rowIdx === 0 ? 0.132 : 0.144;

    let cursorX = -KEY_DECK_W * 0.5;
    const z = KEY_START_Z + rowIdx * KEY_ROW_GAP;

    row.forEach((weight, colIdx) => {
      const kw = unitW * weight;
      const meta = MACBOOK_KEY_LABELS[rowIdx]?.[colIdx] ?? { label: "" };
      keys.push({
        x: cursorX + kw * 0.5,
        z,
        w: kw,
        d: keyD,
        label: meta.label,
        secondary: meta.secondary,
        isTouchId: meta.isTouchId,
        isModifier: meta.isModifier,
        align: meta.align,
      });
      cursorX += kw + keyGap;
    });
  });

  return keys;
}

/**
 * High-DPI 2048×768 Static CanvasTexture for Crisp Backlit Apple Magic Keyboard Legends.
 * Mapped 1:1 to every 3D instanced keycap top surface — 0 per-frame CPU overhead!
 */
function createKeyboardLegendsTexture(
  keys: KeycapPlacement[]
): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const cw = 2048;
  const ch = 768;
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, cw, ch);

  const drawRoundedStroke = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  for (const k of keys) {
    const cx = ((k.x + KEY_DECK_W * 0.5) / KEY_DECK_W) * cw;
    const cy = ((k.z - KEY_DECK_Z_MIN) / KEY_DECK_D) * ch;
    const kw = (k.w / KEY_DECK_W) * cw;
    const kh = (k.d / KEY_DECK_D) * ch;
    const left = cx - kw * 0.5;
    const top = cy - kh * 0.5;

    // Subtle crisp top-bevel outline + delicate white backlight bleed around every keycap
    ctx.save();
    drawRoundedStroke(left + 2, top + 2, kw - 4, kh - 4, 12);
    ctx.strokeStyle = "rgba(245, 244, 240, 0.19)";
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();

    if (k.isTouchId) {
      // Signature MacBook Pro Touch ID recessed circular ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(kw, kh) * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(245, 244, 240, 0.45)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
      continue;
    }

    if (!k.label) continue;

    ctx.save();
    ctx.fillStyle = "rgba(248, 247, 243, 0.94)";
    ctx.shadowColor = "rgba(255, 255, 255, 0.48)";
    ctx.shadowBlur = 7;
    ctx.textBaseline = "middle";

    if (k.secondary) {
      // Dual-legend keycap (number & symbol rows)
      ctx.textAlign = "center";
      ctx.font = "500 22px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(235, 234, 228, 0.72)";
      ctx.fillText(k.secondary, cx, cy - kh * 0.22);

      ctx.font = "600 30px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(250, 249, 245, 0.96)";
      ctx.fillText(k.label, cx, cy + kh * 0.16);
    } else if (k.isModifier) {
      const fontSize = k.label.length > 2 ? 23 : 30;
      ctx.font = `500 ${fontSize}px system-ui, -apple-system, sans-serif`;
      if (k.align === "left") {
        ctx.textAlign = "left";
        ctx.fillText(k.label, left + 18, cy + kh * 0.12);
      } else if (k.align === "right") {
        ctx.textAlign = "right";
        ctx.fillText(k.label, left + kw - 18, cy + kh * 0.12);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(k.label, cx, cy);
      }
    } else {
      // Primary QWERTY alpha letters — crisp centered Apple typography
      ctx.textAlign = "center";
      ctx.font = "600 35px system-ui, -apple-system, sans-serif";
      ctx.fillText(k.label, cx, cy + 1);
    }

    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

const APPLE_LOGO_SVG_PATH =
  "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z";

/**
 * Crisp Brushed-Silver Mirror Apple Logo RGBA Texture (512×512) for the Space Black MacBook Pro lid back.
 * Uses a single premultiplied-clean RGBA CanvasTexture with satin platinum highlight so it gleams
 * clearly against dark anodized Space Black aluminum from every studio angle.
 */
function createAppleLogoTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined" || typeof Path2D === "undefined") {
    return null;
  }

  const size = 512;
  const path = new Path2D(APPLE_LOGO_SVG_PATH);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.translate(64, 0);

  // Gleaming brushed-platinum studio mirror gradient (contrasts cleanly on Space Black lid)
  const grad = ctx.createLinearGradient(0, 24, 384, 492);
  grad.addColorStop(0, "#E4E6EC");
  grad.addColorStop(0.32, "#B8BCC6");
  grad.addColorStop(0.54, "#8E929C");
  grad.addColorStop(0.76, "#D6D9E0");
  grad.addColorStop(1, "#9CA0AA");

  ctx.fillStyle = grad;
  ctx.fill(path);

  // Razor-thin silver specular bevel edge around silhouette
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = 3.5;
  ctx.stroke(path);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function createSoftStudioShadowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);
  const grad = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    size * 0.06,
    size * 0.5,
    size * 0.5,
    size * 0.48
  );
  grad.addColorStop(0, "rgba(13, 13, 13, 0.28)");
  grad.addColorStop(0.45, "rgba(13, 13, 13, 0.13)");
  grad.addColorStop(0.78, "rgba(13, 13, 13, 0.03)");
  grad.addColorStop(1, "rgba(13, 13, 13, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createSpeakerGrilleTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const w = 64;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#242529";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#09090A";
  for (let y = 8; y < h - 8; y += 7) {
    for (let x = 8; x < w - 8; x += 7) {
      ctx.beginPath();
      ctx.arc(x + ((y / 7) % 2) * 3.5, y, 1.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const GLASS_SHEEN_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const GLASS_SHEEN_FRAG = /* glsl */ `
  precision mediump float;

  uniform vec2 uPointer;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float ndotv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 3.0);

    // Liquid Retina XDR studio softbox diagonal glass reflection
    float diag = (vUv.x * 0.78 + vUv.y * 0.62) - (0.68 + uPointer.x * 0.16 - uPointer.y * 0.08);
    float primarySheen = exp(-pow(diag * 7.8, 2.0)) * 0.21;
    float razorSheen = exp(-pow((diag - 0.13) * 28.0, 2.0)) * 0.11;

    vec2 edge = min(vUv, 1.0 - vUv);
    float innerRim = (1.0 - smoothstep(0.0, 0.012, min(edge.x, edge.y))) * 0.14;

    float alpha = (fresnel * 0.24 + primarySheen + razorSheen + innerRim) * uOpacity;
    vec3 col = vec3(0.98, 0.975, 0.96);

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.42));
  }
`;

/**
 * 1 Aset 3D Minimalis Tunggal: Modern MacBook Pro 16" (M4 Space Black).
 * - Flat slab anodized aluminum unibody ultra-tipis dengan sudut membulat modern (tanpa wireframe jadul).
 * - Bezel Liquid Retina XDR ultra-tipis + sudut layar atas membulat + Camera Notch ikonik di atas.
 * - Full-black keyboard well, speaker micro-drilled kiri-kanan, & oversized satin glass Force Touch trackpad.
 * - Layar OLED Dark Mode (#0D0D0D) live-typing Laravel PHP + pantulan kaca Fresnel studio.
 */
export function ArchitecturalGlassLaptop() {
  const sceneGroupRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);
  const lidPivotRef = useRef<THREE.Group>(null);
  const keysMeshRef = useRef<THREE.InstancedMesh>(null);
  const keyLegendMeshRef = useRef<THREE.Mesh>(null);
  const keyLegendMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMeshRef = useRef<THREE.Mesh>(null);
  const shadowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const smoothProgressRef = useRef(0);
  const smoothLidRadRef = useRef(lidDegreesToRotationX(0));

  const keyboardLayout = useMemo(() => buildMacBookProKeyboard(), []);
  const { texture: codeTexture, drawFrame } = useLaravelCodeTexture();

  const geometries = useMemo(() => {
    // 1. Modern MacBook Pro Flat-Wall Rounded Slab Base
    const baseShape = createRoundedRectShape(CHASSIS_W, CHASSIS_D, CORNER_R);
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
      depth: BASE_H,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.014,
      bevelSegments: 6,
      curveSegments: 32,
    });
    baseGeo.rotateX(Math.PI / 2);
    baseGeo.translate(0, BASE_H * 0.5, 0);

    // 2. Ultra-Slim Solid Anodized Lid Unibody
    const lidShape = createRoundedRectShape(CHASSIS_W, CHASSIS_D, CORNER_R);
    const lidGeo = new THREE.ExtrudeGeometry(lidShape, {
      depth: LID_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 5,
      curveSegments: 32,
    });
    lidGeo.translate(0, CHASSIS_D * 0.5, -LID_DEPTH * 0.5);

    // 3. Edge-to-Edge Flush Glossy Black Glass Bezel Front
    const bezelGlassGeo = new THREE.ShapeGeometry(
      createRoundedRectShape(CHASSIS_W - 0.022, CHASSIS_D - 0.022, CORNER_R - 0.012),
      28
    );

    // 4. Liquid Retina XDR Active Display (rounded top corners, crisp bottom corners, mapped UVs)
    const displayGeo = createMacBookDisplayGeometry(SCREEN_W, SCREEN_H, 0.072, 0.014);

    // 5. Iconic Top-Center MacBook Pro Camera Notch
    const notchGeo = new THREE.ShapeGeometry(
      createNotchShape(NOTCH_W, NOTCH_H, NOTCH_R),
      16
    );

    // 6. Recessed Full-Black Keyboard Well & Oversized Force Touch Trackpad
    const keyWellGeo = new THREE.ShapeGeometry(
      createRoundedRectShape(2.86, 1.09, 0.045),
      14
    );
    const trackpadGeo = new THREE.ShapeGeometry(
      createRoundedRectShape(1.42, 0.86, 0.048),
      16
    );

    return {
      baseGeo,
      lidGeo,
      bezelGlassGeo,
      displayGeo,
      notchGeo,
      keyWellGeo,
      trackpadGeo,
    };
  }, []);

  const shadowTexture = useMemo(() => createSoftStudioShadowTexture(), []);
  const speakerTexture = useMemo(() => createSpeakerGrilleTexture(), []);
  const appleLogoTexture = useMemo(() => createAppleLogoTexture(), []);
  const keyboardLegendTexture = useMemo(
    () => createKeyboardLegendsTexture(keyboardLayout),
    [keyboardLayout]
  );

  const glassSheenMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: GLASS_SHEEN_VERT,
        fragmentShader: GLASS_SHEEN_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uPointer: { value: new THREE.Vector2(0, 0) },
          uOpacity: { value: 1.0 },
        },
      }),
    []
  );

  const glassSheenMatRef = useRef(glassSheenMaterial);

  const materials = useMemo(
    () => ({
      // Authentic M4 Space Black Anodized Aluminum (satin dark titanium-graphite catching soft studio sheen)
      spaceBlack: new THREE.MeshPhysicalMaterial({
        color: "#2E3036",
        metalness: 0.78,
        roughness: 0.28,
        clearcoat: 0.34,
        clearcoatRoughness: 0.24,
        envMapIntensity: 1.55,
      }),
      bezelGlass: new THREE.MeshPhysicalMaterial({
        color: "#070708",
        metalness: 0.15,
        roughness: 0.06,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        envMapIntensity: 1.75,
      }),
      notchHousing: new THREE.MeshBasicMaterial({
        color: "#060607",
      }),
      hingeClutch: new THREE.MeshStandardMaterial({
        color: "#0F0F11",
        metalness: 0.65,
        roughness: 0.35,
      }),
      keyWell: new THREE.MeshStandardMaterial({
        color: "#08080A",
        metalness: 0.22,
        roughness: 0.78,
      }),
      keycap: new THREE.MeshStandardMaterial({
        color: "#222328",
        metalness: 0.28,
        roughness: 0.4,
      }),
      trackpad: new THREE.MeshPhysicalMaterial({
        color: "#2A2B30",
        metalness: 0.74,
        roughness: 0.14,
        clearcoat: 0.9,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.45,
      }),
      rubberFoot: new THREE.MeshStandardMaterial({
        color: "#0A0A0B",
        metalness: 0.1,
        roughness: 0.88,
      }),
      portSlot: new THREE.MeshStandardMaterial({
        color: "#070708",
        metalness: 0.4,
        roughness: 0.65,
      }),
    }),
    []
  );

  const materialsRef = useRef(materials);

  useEffect(() => {
    const inst = keysMeshRef.current;
    if (inst) {
      const dummy = new THREE.Object3D();
      keyboardLayout.forEach((k, idx) => {
        dummy.position.set(k.x, BASE_H * 0.5 + 0.015, k.z);
        dummy.scale.set(k.w, 0.013, k.d);
        dummy.updateMatrix();
        inst.setMatrixAt(idx, dummy.matrix);
      });
      inst.instanceMatrix.needsUpdate = true;
    }

    const g = geometries;
    const m = materialsRef.current;
    const sheen = glassSheenMatRef.current;
    const sTex = shadowTexture;
    const spkTex = speakerTexture;
    const kLegTex = keyboardLegendTexture;
    const logoTex = appleLogoTexture;

    return () => {
      g.baseGeo.dispose();
      g.lidGeo.dispose();
      g.bezelGlassGeo.dispose();
      g.displayGeo.dispose();
      g.notchGeo.dispose();
      g.keyWellGeo.dispose();
      g.trackpadGeo.dispose();
      m.spaceBlack.dispose();
      m.bezelGlass.dispose();
      m.notchHousing.dispose();
      m.hingeClutch.dispose();
      m.keyWell.dispose();
      m.keycap.dispose();
      m.trackpad.dispose();
      m.rubberFoot.dispose();
      m.portSlot.dispose();
      sheen.dispose();
      sTex?.dispose();
      spkTex?.dispose();
      kLegTex?.dispose();
      logoTex?.dispose();
    };
  }, [
    geometries,
    keyboardLayout,
    shadowTexture,
    speakerTexture,
    keyboardLegendTexture,
    appleLogoTexture,
  ]);

  useFrame((state, delta) => {
    const group = sceneGroupRef.current;
    const root = rootRef.current;
    if (!group || !root) return;

    const dt = Math.min(delta, 0.05);

    smoothProgressRef.current = THREE.MathUtils.lerp(
      smoothProgressRef.current,
      portalState.portalProgress,
      1 - Math.exp(-dt * 10.5)
    );

    const p = smoothProgressRef.current;

    if (!portalState.enabled || !portalState.stageActive || p < 0.025 || p > 0.965) {
      group.visible = false;
      return;
    }

    group.visible = true;

    const t = state.clock.elapsedTime;
    const mx = motionState.reducedMotion ? 0 : motionState.ndcX;
    const my = motionState.reducedMotion ? 0 : motionState.ndcY;

    glassSheenMatRef.current.uniforms.uPointer.value.set(mx, my);

    // 1. Sculptural Low-Angle Rise (p: 0.06 -> 0.42)
    const riseRaw = THREE.MathUtils.smoothstep(p, 0.06, 0.42);
    const riseEase = 1 - Math.pow(1 - riseRaw, 3);

    const diveLock = 1 - THREE.MathUtils.smoothstep(p, 0.46, 0.66);
    const floatY = motionState.reducedMotion
      ? 0
      : Math.sin(t * 1.15) * 0.034 * riseEase * diveLock;

    const y = THREE.MathUtils.lerp(-3.35, LAPTOP_REST_Y, riseEase) + floatY;
    const rotY =
      THREE.MathUtils.lerp(-0.62, 0.0, riseEase) + mx * 0.16 * diveLock;
    const rotX =
      THREE.MathUtils.lerp(0.32, 0.01, riseEase) - my * 0.07 * diveLock;

    const baseScale = portalState.responsiveScale;
    const scaleIn = THREE.MathUtils.lerp(0.84, 1.0, riseEase);
    const exitExpand = 1 + THREE.MathUtils.smoothstep(p, 0.7, 0.92) * 0.36;

    root.position.set(0, y, 0);
    root.rotation.set(rotX, rotY, 0);
    root.scale.setScalar(baseScale * scaleIn * exitExpand);

    // 2. Precision Hinge Opening (0° -> 96°, settling square to 90° for clean zoom-in)
    const openT = THREE.MathUtils.smoothstep(p, 0.2, 0.56);
    const squareT = THREE.MathUtils.smoothstep(p, 0.56, 0.74);
    const targetLidDeg = THREE.MathUtils.lerp(0, 96, openT) - squareT * 6;

    smoothLidRadRef.current = THREE.MathUtils.lerp(
      smoothLidRadRef.current,
      lidDegreesToRotationX(targetLidDeg),
      1 - Math.exp(-dt * 12.0)
    );
    if (lidPivotRef.current) {
      lidPivotRef.current.rotation.x = smoothLidRadRef.current;
    }

    // 3. Live Dark-Mode Laravel Editor Visibility (monotonic clock, 100% reversible on scroll-back!)
    const powerOn = THREE.MathUtils.smoothstep(targetLidDeg, 8, 34);
    const portalFadeOut = 1 - THREE.MathUtils.smoothstep(p, 0.75, 0.88);
    const editorVis = powerOn * portalFadeOut;

    drawFrame(editorVis);

    const glassPassClear = 1 - THREE.MathUtils.smoothstep(p, 0.74, 0.88);
    glassSheenMatRef.current.uniforms.uOpacity.value = powerOn * glassPassClear;

    // 3b. Backlit MacBook Pro Keyboard Legends (off when closed -> crisp white backlight as lid opens!)
    if (keyLegendMeshRef.current && keyLegendMatRef.current) {
      const showKeys = targetLidDeg > 3.5;
      keyLegendMeshRef.current.visible = showKeys;
      if (showKeys) {
        const backlight = THREE.MathUtils.smoothstep(targetLidDeg, 6, 36);
        keyLegendMatRef.current.opacity = (0.35 + backlight * 0.65) * glassPassClear;
      }
    }

    // 4. Soft Studio Contact Shadow
    if (shadowMeshRef.current && shadowMatRef.current) {
      const shadowVis =
        THREE.MathUtils.smoothstep(p, 0.14, 0.42) *
        (1 - THREE.MathUtils.smoothstep(p, 0.54, 0.72));
      shadowMatRef.current.opacity = shadowVis * 0.92;
      const sx = 5.0 * baseScale * (0.75 + riseEase * 0.25);
      const sz = 3.6 * baseScale * (0.75 + riseEase * 0.25);
      shadowMeshRef.current.scale.set(sx, sz, 1);
    }
  });

  const displayY = CHASSIS_D * 0.5 + SCREEN_CENTER_Y;
  const displayFrontZ = LID_DEPTH * 0.5 + 0.011;
  const notchTopY = displayY + SCREEN_H * 0.5 + 0.004;

  return (
    <group ref={sceneGroupRef} visible={false}>
      <group ref={rootRef}>
        {/* MODERN MACBOOK PRO SPACE BLACK SLAB BASE */}
        <mesh geometry={geometries.baseGeo} material={materials.spaceBlack} />

        {/* 4 Subtle Underside Rubber Feet Pads (MacBook Pro Industrial Detail) */}
        {[
          [-1.36, -0.84],
          [1.36, -0.84],
          [-1.36, 0.84],
          [1.36, 0.84],
        ].map(([fx, fz], idx) => (
          <mesh
            key={idx}
            position={[fx, -BASE_H * 0.5 - 0.015, fz]}
            material={materials.rubberFoot}
          >
            <cylinderGeometry args={[0.095, 0.095, 0.014, 20]} />
          </mesh>
        ))}

        {/* Sleek Front Lip Finger Scooped Notch */}
        <mesh position={[0, BASE_H * 0.5 + 0.006, CHASSIS_D * 0.5 - 0.014]}>
          <boxGeometry args={[0.52, 0.014, 0.048]} />
          <meshStandardMaterial color="#121215" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* Left Side Ports: MagSafe 3 + 2× Thunderbolt USB-C + 3.5mm Audio */}
        <mesh position={[-CHASSIS_W * 0.5 - 0.011, 0.0, -0.78]} material={materials.portSlot}>
          <boxGeometry args={[0.01, 0.018, 0.13]} />
        </mesh>
        <mesh position={[-CHASSIS_W * 0.5 - 0.011, 0.0, -0.58]} material={materials.portSlot}>
          <boxGeometry args={[0.01, 0.016, 0.082]} />
        </mesh>
        <mesh position={[-CHASSIS_W * 0.5 - 0.011, 0.0, -0.44]} material={materials.portSlot}>
          <boxGeometry args={[0.01, 0.016, 0.082]} />
        </mesh>

        {/* Right Side Ports: HDMI + Thunderbolt + SDXC */}
        <mesh position={[CHASSIS_W * 0.5 + 0.011, 0.0, -0.74]} material={materials.portSlot}>
          <boxGeometry args={[0.01, 0.018, 0.14]} />
        </mesh>
        <mesh position={[CHASSIS_W * 0.5 + 0.011, 0.0, -0.54]} material={materials.portSlot}>
          <boxGeometry args={[0.01, 0.016, 0.082]} />
        </mesh>
        <mesh position={[CHASSIS_W * 0.5 + 0.011, 0.0, -0.34]} material={materials.portSlot}>
          <boxGeometry args={[0.01, 0.014, 0.17]} />
        </mesh>

        {/* Full-Black Anodized Keyboard Well (Signature M-Series MacBook Pro) */}
        <mesh
          geometry={geometries.keyWellGeo}
          position={[0, BASE_H * 0.5 + 0.0145, -0.39]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.keyWell}
        />

        {/* 68 Low-Profile Matte Keycaps */}
        <instancedMesh
          ref={keysMeshRef}
          args={[undefined, undefined, keyboardLayout.length]}
          material={materials.keycap}
        >
          <boxGeometry args={[1, 1, 1]} />
        </instancedMesh>

        {/* Crisp Backlit QWERTY Apple Magic Keyboard Legends (mapped 1:1 over every 3D keycap) */}
        {keyboardLegendTexture ? (
          <mesh
            ref={keyLegendMeshRef}
            visible={false}
            position={[0, BASE_H * 0.5 + 0.0224, KEY_DECK_CENTER_Z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[KEY_DECK_W, KEY_DECK_D]} />
            <meshBasicMaterial
              ref={keyLegendMatRef}
              map={keyboardLegendTexture}
              transparent
              depthWrite={false}
              toneMapped={false}
              opacity={0}
            />
          </mesh>
        ) : null}

        {/* Micro-Drilled Left & Right Speaker Grilles */}
        {speakerTexture ? (
          <>
            <mesh
              position={[-1.59, BASE_H * 0.5 + 0.0148, -0.39]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.2, 1.04]} />
              <meshStandardMaterial
                map={speakerTexture}
                metalness={0.75}
                roughness={0.35}
              />
            </mesh>
            <mesh
              position={[1.59, BASE_H * 0.5 + 0.0148, -0.39]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.2, 1.04]} />
              <meshStandardMaterial
                map={speakerTexture}
                metalness={0.75}
                roughness={0.35}
              />
            </mesh>
          </>
        ) : null}

        {/* Oversized Flush Satin Glass Force Touch Trackpad */}
        <mesh
          geometry={geometries.trackpadGeo}
          position={[0, BASE_H * 0.5 + 0.0146, 0.65]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.trackpad}
        />

        {/* Signature Slim Black Rear Hinge Clutch */}
        <mesh
          position={[0, HINGE_Y - 0.008, HINGE_Z]}
          rotation={[0, 0, Math.PI / 2]}
          material={materials.hingeClutch}
        >
          <cylinderGeometry args={[0.028, 0.028, CHASSIS_W * 0.64, 24]} />
        </mesh>

        {/* ULTRA-SLIM SOLID LID + RAZOR BEZELS + NOTCH + LARAVEL DARK OLED */}
        <group ref={lidPivotRef} position={[0, HINGE_Y, HINGE_Z]}>
          {/* Solid Space Black Lid Shell */}
          <mesh geometry={geometries.lidGeo} material={materials.spaceBlack} />

          {/* Brushed-Platinum Mirror Apple Logo on Outer Lid Back (authentic MacBook Pro orientation: upright when lid is open!) */}
          {appleLogoTexture ? (
            <mesh
              position={[0, CHASSIS_D * 0.5, -(LID_DEPTH * 0.5 + 0.011)]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[0.56, 0.56]} />
              <meshStandardMaterial
                map={appleLogoTexture}
                transparent
                alphaTest={0.05}
                metalness={0.35}
                roughness={0.18}
                emissive="#B8BCC6"
                emissiveMap={appleLogoTexture}
                emissiveIntensity={0.42}
                polygonOffset
                polygonOffsetFactor={-2}
              />
            </mesh>
          ) : null}

          {/* Flush Edge-to-Edge Glossy Black Glass Bezel Face */}
          <mesh
            geometry={geometries.bezelGlassGeo}
            position={[0, CHASSIS_D * 0.5, LID_DEPTH * 0.5 + 0.009]}
            material={materials.bezelGlass}
          />

          {/* Liquid Retina XDR Rounded-Top Active Display (Dark Mode Laravel Editor) */}
          <mesh
            geometry={geometries.displayGeo}
            position={[0, displayY, displayFrontZ]}
          >
            <meshBasicMaterial
              map={codeTexture ?? undefined}
              color="#FFFFFF"
              toneMapped={false}
            />
          </mesh>

          {/* Iconic MacBook Pro Top-Center Camera Notch Housing */}
          <mesh
            geometry={geometries.notchGeo}
            position={[0, notchTopY, displayFrontZ + 0.0018]}
            material={materials.notchHousing}
          />

          {/* Subtle Precision 1080p FaceTime Camera Lens Inside Notch */}
          <mesh position={[0, notchTopY - NOTCH_H * 0.52, displayFrontZ + 0.0024]}>
            <circleGeometry args={[0.014, 20]} />
            <meshPhysicalMaterial
              color="#141821"
              metalness={0.4}
              roughness={0.05}
              clearcoat={1}
              envMapIntensity={2.0}
            />
          </mesh>

          {/* Glossy Liquid Retina Studio Glass Reflection Over Whole Screen */}
          <mesh
            geometry={geometries.displayGeo}
            position={[0, displayY, displayFrontZ + 0.0035]}
            material={glassSheenMaterial}
          />
        </group>
      </group>

      {/* Soft Studio Ground Contact Shadow */}
      {shadowTexture ? (
        <mesh
          ref={shadowMeshRef}
          position={[0, -0.92, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={shadowMatRef}
            map={shadowTexture}
            transparent
            depthWrite={false}
            opacity={0}
          />
        </mesh>
      ) : null}
    </group>
  );
}
