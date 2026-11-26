import type { MetadataRoute } from "next";
import { getProfileData } from "@/lib/data/profile";
import { getPublishedProjects } from "@/lib/data/projects";
import { resolveAbsoluteMediaUrl, siteConfig } from "@/lib/site-config";

const LAST_MODIFIED = new Date("2026-04-01T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const [profile, projects] = await Promise.all([
    getProfileData(),
    getPublishedProjects(),
  ]);

  const portraitUrl = resolveAbsoluteMediaUrl(
    profile.about.portraitImage,
    baseUrl
  );
  const portraitImages = portraitUrl ? [portraitUrl] : undefined;

  const coreEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          id: `${baseUrl}/`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.95,
      alternates: {
        languages: {
          id: `${baseUrl}/`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.95,
      ...(portraitImages ? { images: portraitImages } : {}),
      alternates: {
        languages: {
          id: `${baseUrl}/about`,
          en: `${baseUrl}/en/about`,
        },
      },
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
      ...(portraitImages ? { images: portraitImages } : {}),
      alternates: {
        languages: {
          id: `${baseUrl}/about`,
          en: `${baseUrl}/en/about`,
        },
      },
    },
  ];

  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((project) => {
    const coverUrl = resolveAbsoluteMediaUrl(project.coverImage, baseUrl);
    const projectImages = coverUrl ? [coverUrl] : undefined;

    return [
      {
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.85,
        ...(projectImages ? { images: projectImages } : {}),
        alternates: {
          languages: {
            id: `${baseUrl}/projects/${project.slug}`,
            en: `${baseUrl}/en/projects/${project.slug}`,
          },
        },
      },
      {
        url: `${baseUrl}/en/projects/${project.slug}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        ...(projectImages ? { images: projectImages } : {}),
        alternates: {
          languages: {
            id: `${baseUrl}/projects/${project.slug}`,
            en: `${baseUrl}/en/projects/${project.slug}`,
          },
        },
      },
    ];
  });

  return [...coreEntries, ...projectEntries];
}
