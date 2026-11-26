import type { Metadata } from "next";
import { AboutPageView } from "@/components/about/AboutPageView";
import { AboutJsonLdScripts } from "@/components/seo/JsonLdScripts";
import { pickText } from "@/i18n";
import { getProfileData } from "@/lib/data/profile";
import { resolveAbsoluteMediaUrl, siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileData();
  const role = pickText(profile.role, "en");
  const description = pickText(profile.bioShort, "en");
  const title = `About ${profile.fullName} — ${role} | ${profile.brandHandle}`;
  const portraitUrl =
    resolveAbsoluteMediaUrl(profile.about.portraitImage) ??
    "/en/opengraph-image";
  const portraitAlt = pickText(profile.about.portraitAlt, "en");

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      profile.fullName,
      "Danu Candra",
      profile.brandHandle,
      role,
      ...profile.disciplines,
      ...profile.about.education.map((e) => e.institution),
    ],
    alternates: {
      canonical: "/en/about",
      languages: {
        id: "/about",
        en: "/en/about",
        "x-default": "/about",
      },
    },
    openGraph: {
      type: "profile",
      locale: "en_US",
      alternateLocale: ["id_ID"],
      url: "/en/about",
      siteName: `${siteConfig.name} (${siteConfig.brandHandle})`,
      title,
      description,
      firstName: profile.firstName,
      lastName: profile.lastName,
      username: profile.brandHandle,
      images: [
        {
          url: "/en/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
        {
          url: portraitUrl,
          alt: portraitAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/en/opengraph-image"],
    },
  };
}

export default async function AboutEnPage() {
  const profile = await getProfileData();

  return (
    <>
      <AboutJsonLdScripts locale="en" />
      <AboutPageView locale="en" profile={profile} />
    </>
  );
}
