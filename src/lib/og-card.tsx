import { ImageResponse } from "next/og";
import { profileData } from "@/data/profile";
import { siteConfig } from "@/lib/site-config";
import type { Locale } from "@/types/portfolio";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export function renderPortfolioOgImage(locale: Locale) {
  const domainText = siteConfig.url.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#F5F4F0",
          color: "#0D0D0D",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "20px",
            color: "#73726C",
          }}
        >
          <span>{profileData.brandHandle}.</span>
          <span>{locale.toUpperCase()}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "84px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            {profileData.fullName}
          </div>
          <div style={{ fontSize: "28px", color: "#73726C", display: "flex" }}>
            {profileData.role[locale]}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(13,13,13,0.14)",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#73726C",
          }}
        >
          <span>{domainText}</span>
          <span>{profileData.email}</span>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
