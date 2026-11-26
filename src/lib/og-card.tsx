import { ImageResponse } from "next/og";
import { profileData } from "@/data/profile";
import { siteConfig } from "@/lib/site-config";
import type { Locale } from "@/types/portfolio";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

/**
 * Editorial Monochrome OpenGraph Poster (1200×630 PNG) mirroring Scene 1 (`DANU / 1px / CANDRA`).
 * 100% offline-safe & privacy-safe (zero phone, address, school, or GPA).
 */
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
          padding: "56px 72px",
          backgroundColor: "#F5F4F0",
          color: "#0D0D0D",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Editorial Navigation Echo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          <span style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
            {profileData.brandHandle}.
          </span>
          <span
            style={{
              fontSize: "15px",
              letterSpacing: "0.18em",
              color: "#73726C",
            }}
          >
            PORTFOLIO · {locale.toUpperCase()}
          </span>
        </div>

        {/* Center Monumental Split Composition (DANU / 1px / CANDRA) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "112px",
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 0.92,
              display: "flex",
            }}
          >
            {profileData.firstName.toUpperCase()}
          </div>

          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(13, 13, 13, 0.16)",
              marginTop: "22px",
              marginBottom: "22px",
              display: "flex",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "112px",
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 0.92,
            }}
          >
            {profileData.lastName.toUpperCase()}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "18px",
              fontSize: "28px",
              fontStyle: "italic",
              color: "#73726C",
              fontFamily: "Georgia, serif",
            }}
          >
            {profileData.role[locale]}
          </div>
        </div>

        {/* Quiet 1-Row Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(13, 13, 13, 0.12)",
            paddingTop: "20px",
            fontSize: "16px",
            color: "#73726C",
          }}
        >
          <span>{domainText}</span>
          <span>{profileData.disciplines.join(" · ")}</span>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
