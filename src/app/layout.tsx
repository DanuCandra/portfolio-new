import type { Metadata } from "next";
import {
  Instrument_Serif,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { FilmGrainOverlay } from "@/components/atmosphere/FilmGrainOverlay";
import { HoverInkParticles } from "@/components/atmosphere/HoverInkParticles";
import { MinimalCursor } from "@/components/motion/MinimalCursor";
import { PageTransitionProvider } from "@/components/motion/PageTransitionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { getDictionary } from "@/i18n";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const idDict = getDictionary("id");

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: idDict.meta.title,
    template: `%s | ${siteConfig.brandHandle}`,
  },
  description: idDict.meta.description,
  applicationName: `${siteConfig.name} Portfolio`,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  keywords: [
    "Danu Candra Saputra",
    "Danu Candra",
    "danucs",
    "danucs.com",
    "Full-Stack Web Developer",
    "Fullstack Web Developer",
    "Laravel Developer",
    "Next.js Developer",
    "React Developer",
    "Vue.js Developer",
    "Web Developer Indonesia",
  ],
  alternates: {
    canonical: "/",
    languages: {
      id: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: `${siteConfig.name} (${siteConfig.brandHandle})`,
    title: idDict.meta.title,
    description: idDict.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: idDict.meta.title,
    description: idDict.meta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.defaultLocale}
      className={`${plusJakartaSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-[#F5F4F0] text-[#0D0D0D]">
        <FilmGrainOverlay />
        <HoverInkParticles />
        <MinimalCursor />
        <SmoothScrollProvider>
          <PageTransitionProvider>
            <div className="relative z-10 flex min-h-screen flex-1 flex-col">
              {children}
            </div>
          </PageTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
