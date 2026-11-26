"use client";

import { useEffect } from "react";
import type { Locale } from "@/types/portfolio";

export function LocaleHtmlSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
