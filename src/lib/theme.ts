/**
 * Paper, Glass & Ink — Monochrome Architectural Design Tokens & Motion Curves.
 * Zero neon, zero glow clutter, maximum calm editorial contrast.
 */
export const themeColors = {
  paper: "#F5F4F0",
  paperSubtle: "#ECEAE4",
  paperPure: "#FAF9F6",

  ink: "#0D0D0D",
  inkSoft: "#1A1A19",
  stone: "#73726C",
  stoneLight: "#A6A59E",

  hairlineDark: "rgba(13, 13, 13, 0.11)",
  hairlineLight: "rgba(245, 244, 240, 0.14)",
} as const;

/**
 * Signature After Effects / Motion Design Easing Curves.
 */
export const motionCurves = {
  expoOut: [0.16, 1, 0.3, 1] as const,
  quartSnap: [0.76, 0, 0.24, 1] as const,
  cssExpoOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  cssQuartSnap: "cubic-bezier(0.76, 0, 0.24, 1)",
} as const;
