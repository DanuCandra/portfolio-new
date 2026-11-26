import { dummyProjects } from "@/data/dummy-projects";
import type { ProjectCategory, ProjectItem } from "@/types/portfolio";

/**
 * Data Access Layer (Repository Pattern) untuk Projects.
 * Di Fase 1 membaca dari dummyProjects lokal.
 * Di Fase 2 (Backend & Admin Panel), cukup ganti isi fungsi-fungsi ini
 * untuk query ke database/API tanpa mengubah komponen UI atau 3D.
 */

export async function getPublishedProjects(): Promise<ProjectItem[]> {
  return [...dummyProjects]
    .filter((project) => project.published)
    .sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  const published = await getPublishedProjects();
  return published.filter((project) => project.featured);
}

export async function getProjectsByCategory(
  category: ProjectCategory | "all"
): Promise<ProjectItem[]> {
  const published = await getPublishedProjects();
  if (category === "all") return published;
  return published.filter((project) => project.category === category);
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectItem | null> {
  const published = await getPublishedProjects();
  return published.find((project) => project.slug === slug) ?? null;
}

export async function getNextProject(slug: string): Promise<ProjectItem | null> {
  const published = await getPublishedProjects();
  if (published.length === 0) return null;
  const currentIndex = published.findIndex((project) => project.slug === slug);
  if (currentIndex === -1) return published[0];
  return published[(currentIndex + 1) % published.length];
}

export async function getProjectSlugs(): Promise<string[]> {
  const published = await getPublishedProjects();
  return published.map((project) => project.slug);
}
