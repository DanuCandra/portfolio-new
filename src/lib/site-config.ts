const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://danucs.com";

export const siteConfig = {
  url: rawSiteUrl.replace(/\/+$/, ""),
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Danu Candra Saputra",
  brandHandle: process.env.NEXT_PUBLIC_BRAND_HANDLE?.trim() || "danucs",
  role: "Full-Stack Web Developer",
  defaultLocale: "id" as const,
  locales: ["id", "en"] as const,
} as const;

export type Locale = (typeof siteConfig.locales)[number];

/**
 * Resolves local relative media paths (`/images/...`, `/uploads/...`) or external CDN URLs
 * (`https://...`) into absolute URLs for Schema.org JSON-LD, OpenGraph, and Sitemap images.
 * Ready for Phase-2 Admin Panel local storage or cloud bucket uploads.
 */
export function resolveAbsoluteMediaUrl(
  pathOrUrl?: string | null,
  baseUrl: string = siteConfig.url
): string | undefined {
  if (!pathOrUrl) return undefined;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${baseUrl.replace(/\/+$/, "")}${normalizedPath}`;
}
