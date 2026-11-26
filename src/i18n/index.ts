import type { Locale, LocalizedText } from "@/types/portfolio";
import { dictionaries, type Dictionary } from "./dictionaries";

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.id;
}

export function pickText(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.id;
}

/**
 * Menghasilkan URL sesuai bahasa aktif:
 * - Default ID: "/", "/projects/slug"
 * - EN: "/en", "/en/projects/slug"
 */
export function localePath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "id") {
    return normalized;
  }
  return normalized === "/" ? "/en" : `/en${normalized}`;
}

export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const clean = currentPath || "/";
  const stripped = clean.replace(/^\/en(?=\/|$)/, "") || "/";
  return localePath(targetLocale, stripped);
}
