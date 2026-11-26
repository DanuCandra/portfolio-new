import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0D0D0D",
          color: "#F5F4F0",
          borderRadius: "6px",
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        d.
      </div>
    ),
    { ...size }
  );
}
