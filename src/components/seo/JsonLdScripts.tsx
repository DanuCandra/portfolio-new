import { profileData } from "@/data/profile";
import { getDictionary, pickText } from "@/i18n";
import { getPublishedProjects } from "@/lib/data/projects";
import { siteConfig } from "@/lib/site-config";
import type { Locale, ProjectItem } from "@/types/portfolio";

/**
 * Clean Schema.org JSON-LD Graph untuk Home Page (`/` & `/en`).
 * Privasi & minimalisme terjaga: nol telepon, nol alamat, nol info kampus/IPK/publikasi.
 */
export async function HomeJsonLdScripts({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const projects = await getPublishedProjects();

  const baseUrl = siteConfig.url;
  const pageUrl = locale === "en" ? `${baseUrl}/en` : `${baseUrl}/`;
  const personId = `${baseUrl}/#person`;
  const websiteId = `${baseUrl}/#website`;
  const projectPrefix =
    locale === "en" ? `${baseUrl}/en/projects` : `${baseUrl}/projects`;

  const sameAs = profileData.socials
    .filter((s) => s.platform !== "email")
    .map((s) => s.url);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profileData.fullName,
        alternateName: [profileData.brandHandle, "Danu Candra"],
        url: baseUrl,
        email: `mailto:${profileData.email}`,
        jobTitle: pickText(profileData.role, locale),
        description: pickText(profileData.bioShort, locale),
        knowsAbout: profileData.disciplines,
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: baseUrl,
        name: dict.meta.title,
        alternateName: profileData.brandHandle,
        description: dict.meta.description,
        inLanguage: ["id-ID", "en-US"],
        publisher: { "@id": personId },
        author: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: locale === "en" ? "en-US" : "id-ID",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#projects`,
        name: locale === "en" ? "Selected Work" : "Karya Pilihan",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareApplication",
            name: project.title,
            applicationCategory: "WebApplication",
            operatingSystem: "Web",
            description: pickText(project.summary, locale),
            url: `${projectPrefix}/${project.slug}`,
            author: { "@id": personId },
            keywords: project.techStack.join(", "),
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export function ProjectJsonLdScript({
  project,
  locale,
}: {
  project: ProjectItem;
  locale: Locale;
}) {
  const baseUrl = siteConfig.url;
  const homeUrl = locale === "en" ? `${baseUrl}/en` : `${baseUrl}/`;
  const projectUrl =
    locale === "en"
      ? `${baseUrl}/en/projects/${project.slug}`
      : `${baseUrl}/projects/${project.slug}`;
  const personId = `${baseUrl}/#person`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profileData.fullName,
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: locale === "en" ? "Work" : "Karya",
            item: `${homeUrl}#work`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: projectUrl,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": `${projectUrl}#work`,
        name: project.title,
        headline: `${project.title} — ${pickText(project.tagline, locale)}`,
        description: pickText(project.summary, locale),
        url: projectUrl,
        datePublished: project.year,
        inLanguage: locale === "en" ? "en-US" : "id-ID",
        keywords: project.techStack.join(", "),
        author: {
          "@type": "Person",
          "@id": personId,
          name: profileData.fullName,
          url: baseUrl,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
