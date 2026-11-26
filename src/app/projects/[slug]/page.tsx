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
import { siteConfig } from "@/lib/site-config";

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

  const title = `${project.title} — Studi Kasus oleh ${siteConfig.name}`;
  const description = pickText(project.summary, "id");

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
      canonical: `/projects/${project.slug}`,
      languages: {
        id: `/projects/${project.slug}`,
        en: `/en/projects/${project.slug}`,
        "x-default": `/projects/${project.slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "id_ID",
      alternateLocale: ["en_US"],
      url: `/projects/${project.slug}`,
      title: `${title} | ${siteConfig.brandHandle}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.brandHandle}`,
      description,
    },
  };
}

export default async function ProjectDetailPage({
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
      <ProjectJsonLdScript project={project} locale="id" />
      <ProjectCaseStudyView
        project={project}
        nextProject={nextProject}
        totalProjects={allProjects.length}
        locale="id"
      />
    </>
  );
}
