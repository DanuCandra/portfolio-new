import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data/projects";
import { siteConfig } from "@/lib/site-config";

const LAST_MODIFIED = new Date("2026-04-01T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const projects = await getPublishedProjects();

  const staticEntries: MetadataRoute.Sitemap = [
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
  ];

  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((project) => [
    {
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.85,
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
      alternates: {
        languages: {
          id: `${baseUrl}/projects/${project.slug}`,
          en: `${baseUrl}/en/projects/${project.slug}`,
        },
      },
    },
  ]);

  return [...staticEntries, ...projectEntries];
}
