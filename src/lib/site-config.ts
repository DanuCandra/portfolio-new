const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://danucs.com";

export const siteConfig = {
  url: rawSiteUrl.replace(/\/+$/, ""),
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Danu Candra Saputra",
  brandHandle: process.env.NEXT_PUBLIC_BRAND_HANDLE?.trim() || "danucs",
  role: "Fullstack Web Developer",
  defaultLocale: "id" as const,
  locales: ["id", "en"] as const,
} as const;

export type Locale = (typeof siteConfig.locales)[number];
