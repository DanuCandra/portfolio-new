import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { siteConfig } from "@/lib/site-config";

const enDict = getDictionary("en");

export const metadata: Metadata = {
  title: {
    absolute: enDict.meta.title,
  },
  description: enDict.meta.description,
  alternates: {
    canonical: "/en",
    languages: {
      id: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    url: "/en",
    siteName: `${siteConfig.name} (${siteConfig.brandHandle})`,
    title: enDict.meta.title,
    description: enDict.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: enDict.meta.title,
    description: enDict.meta.description,
  },
};

export default function EnglishLayout({ children }: LayoutProps<"/en">) {
  return children;
}
