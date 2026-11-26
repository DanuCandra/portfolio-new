import { getDictionary, pickText } from "@/i18n";
import { getProfileData } from "@/lib/data/profile";
import { getPublishedProjects } from "@/lib/data/projects";
import { resolveAbsoluteMediaUrl, siteConfig } from "@/lib/site-config";
import type { Locale, ProfileData, ProjectItem } from "@/types/portfolio";

/**
 * Shared Unified Schema.org `Person` + `ImageObject` Entity Graph.
 * Dipakai konsisten di Home (`/`), About (`/about`), dan Case Study (`/projects/[slug]`)
 * agar Google Knowledge Graph menyatukan nama, foto, pendidikan, keahlian, dan profil sosial
 * Danu Candra Saputra ke satu entitas utama (`https://danucs.com/#person`).
 * 100% dinamis dari `getProfileData()` — siap Admin Panel Fase 2 (nol teks/gambar hardcode).
 */
function buildPersonEntity(
  profile: ProfileData,
  locale: Locale,
  baseUrl: string
) {
  const personId = `${baseUrl}/#person`;
  const portraitId = `${baseUrl}/#portrait`;
  const portraitUrl = resolveAbsoluteMediaUrl(
    profile.about.portraitImage,
    baseUrl
  );
  const aboutUrl = locale === "en" ? `${baseUrl}/en/about` : `${baseUrl}/about`;

  const sameAs = profile.socials
    .filter((s) => s.platform !== "email")
    .map((s) => s.url);

  const knowsAbout = Array.from(
    new Set([
      ...profile.disciplines,
      ...profile.about.capabilities.flatMap((group) => group.items),
    ])
  );

  const alumniOf = profile.about.education.map((edu) => ({
    "@type": "CollegeOrUniversity",
    name: edu.institution,
  }));

  const portraitObject = portraitUrl
    ? {
        "@type": "ImageObject",
        "@id": portraitId,
        url: portraitUrl,
        contentUrl: portraitUrl,
        caption: pickText(profile.about.portraitAlt, locale),
      }
    : undefined;

  return {
    personId,
    portraitId,
    portraitObject,
    personNode: {
      "@type": "Person",
      "@id": personId,
      name: profile.fullName,
      givenName: profile.firstName,
      alternateName: [
        profile.brandHandle,
        "Danu Candra",
        "DanuCandra",
      ],
      url: baseUrl,
      mainEntityOfPage: aboutUrl,
      email: `mailto:${profile.email}`,
      jobTitle: pickText(profile.role, locale),
      description: pickText(profile.bioShort, locale),
      ...(portraitObject ? { image: portraitObject } : {}),
      knowsAbout,
      ...(alumniOf.length > 0 ? { alumniOf } : {}),
      hasOccupation: {
        "@type": "Occupation",
        name: pickText(profile.role, locale),
        skills: knowsAbout.join(", "),
      },
      sameAs,
    },
  };
}

/**
 * Schema.org JSON-LD Graph untuk Home Page (`/` & `/en`).
 * Privasi terjaga: nol telepon, nol alamat pribadi.
 */
export async function HomeJsonLdScripts({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [profile, projects] = await Promise.all([
    getProfileData(),
    getPublishedProjects(),
  ]);

  const baseUrl = siteConfig.url;
  const pageUrl = locale === "en" ? `${baseUrl}/en` : `${baseUrl}/`;
  const websiteId = `${baseUrl}/#website`;
  const projectPrefix =
    locale === "en" ? `${baseUrl}/en/projects` : `${baseUrl}/projects`;

  const { personId, portraitId, portraitObject, personNode } =
    buildPersonEntity(profile, locale, baseUrl);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      personNode,
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: baseUrl,
        name: dict.meta.title,
        alternateName: profile.brandHandle,
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
        ...(portraitObject ? { primaryImageOfPage: { "@id": portraitId } } : {}),
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#projects`,
        name: dict.work.heading,
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => {
          const coverUrl = resolveAbsoluteMediaUrl(project.coverImage, baseUrl);
          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "SoftwareApplication",
              name: project.title,
              applicationCategory: "WebApplication",
              operatingSystem: "Web",
              description: pickText(project.summary, locale),
              url: `${projectPrefix}/${project.slug}`,
              ...(coverUrl ? { image: coverUrl } : {}),
              author: { "@id": personId },
              keywords: project.techStack.join(", "),
            },
          };
        }),
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

/**
 * Schema.org JSON-LD Graph untuk Halaman `/about` & `/en/about`.
 * Memperkuat sinyal Google Knowledge Graph & Google Images untuk pencarian nama `Danu Candra Saputra`.
 */
export async function AboutJsonLdScripts({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const profile = await getProfileData();

  const baseUrl = siteConfig.url;
  const homeUrl = locale === "en" ? `${baseUrl}/en` : `${baseUrl}/`;
  const aboutUrl = locale === "en" ? `${baseUrl}/en/about` : `${baseUrl}/about`;
  const websiteId = `${baseUrl}/#website`;

  const { personId, portraitId, portraitObject, personNode } =
    buildPersonEntity(profile, locale, baseUrl);

  const pageName =
    locale === "en"
      ? `About ${profile.fullName} — ${pickText(profile.role, locale)}`
      : `Tentang ${profile.fullName} — ${pickText(profile.role, locale)}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      personNode,
      {
        "@type": "AboutPage",
        "@id": `${aboutUrl}#aboutpage`,
        url: aboutUrl,
        name: pageName,
        description: pickText(profile.bioShort, locale),
        inLanguage: locale === "en" ? "en-US" : "id-ID",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        ...(portraitObject ? { primaryImageOfPage: { "@id": portraitId } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profile.fullName,
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: dict.nav.about,
            item: aboutUrl,
          },
        ],
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

/**
 * Schema.org JSON-LD Graph untuk Halaman Case Study (`/projects/[slug]` & `/en/projects/[slug]`).
 */
export async function ProjectJsonLdScript({
  project,
  locale,
}: {
  project: ProjectItem;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const profile = await getProfileData();

  const baseUrl = siteConfig.url;
  const homeUrl = locale === "en" ? `${baseUrl}/en` : `${baseUrl}/`;
  const projectUrl =
    locale === "en"
      ? `${baseUrl}/en/projects/${project.slug}`
      : `${baseUrl}/projects/${project.slug}`;
  const personId = `${baseUrl}/#person`;
  const imageUrl =
    resolveAbsoluteMediaUrl(project.coverImage, baseUrl) ??
    resolveAbsoluteMediaUrl(
      locale === "en" ? "/en/opengraph-image" : "/opengraph-image",
      baseUrl
    );

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profile.fullName,
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: dict.nav.work,
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
        ...(imageUrl ? { image: imageUrl } : {}),
        datePublished: project.year,
        inLanguage: locale === "en" ? "en-US" : "id-ID",
        keywords: project.techStack.join(", "),
        author: {
          "@type": "Person",
          "@id": personId,
          name: profile.fullName,
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
