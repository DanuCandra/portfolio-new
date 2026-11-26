import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudyView } from "@/components/projects/ProjectCaseStudyView";
import { ProjectJsonLdScript } from "@/components/seo/JsonLdScripts";
import { pickText } from "@/i18n";
import {
  getNextProject,
  getProjectBySlug,
  getProjectSlugs,
  getPublishedProjects,
} from "@/lib/data/projects";
import { resolveAbsoluteMediaUrl, siteConfig } from "@/lib/site-config";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} — Case Study by ${siteConfig.name}`;
  const description = pickText(project.summary, "en");
  const coverUrl = resolveAbsoluteMediaUrl(project.coverImage);
  const ogImages = coverUrl
    ? [{ url: coverUrl, alt: title }]
    : [{ url: "/en/opengraph-image", width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    keywords: [
      project.title,
      siteConfig.name,
      siteConfig.brandHandle,
      ...project.techStack,
    ],
    alternates: {
      canonical: `/en/projects/${project.slug}`,
      languages: {
        id: `/projects/${project.slug}`,
        en: `/en/projects/${project.slug}`,
        "x-default": `/projects/${project.slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      alternateLocale: ["id_ID"],
      url: `/en/projects/${project.slug}`,
      title: `${title} | ${siteConfig.brandHandle}`,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.brandHandle}`,
      description,
      images: [coverUrl ?? "/en/opengraph-image"],
    },
  };
}

export default async function EnglishProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, nextProject, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getNextProject(slug),
    getPublishedProjects(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectJsonLdScript project={project} locale="en" />
      <ProjectCaseStudyView
        project={project}
        nextProject={nextProject}
        totalProjects={allProjects.length}
        locale="en"
      />
    </>
  );
}
