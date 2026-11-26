"use client";

import dynamic from "next/dynamic";

const GlassLaptopCanvas = dynamic(
  () => import("./GlassLaptopCanvas").then((mod) => mod.GlassLaptopCanvas),
  { ssr: false }
);

export function GlassLaptopStageClient() {
  return <GlassLaptopCanvas />;
}
