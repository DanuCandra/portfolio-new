export type Locale = "id" | "en";

export interface LocalizedText {
  id: string;
  en: string;
}

export type SocialPlatform = "github" | "linkedin" | "email";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  handle: string;
  url: string;
}

export interface ProfileData {
  fullName: string;
  firstName: string;
  lastName: string;
  brandHandle: string;
  role: LocalizedText;
  email: string;
  cvFiles: {
    id: string;
    en: string;
  };
  bioShort: LocalizedText;
  statement: {
    id: { lead: string; italic: string; tail: string };
    en: { lead: string; italic: string; tail: string };
  };
  disciplines: string[];
  socials: SocialLink[];
}

export type ProjectCategory =
  | "fullstack"
  | "web-app"
  | "ecommerce"
  | "creative"
  | "devops";

export type ProjectMockupVariant =
  | "aether-ai"
  | "veloce-commerce"
  | "nusantara-cloud"
  | "kinetix-studio"
  | "finpulse-treasury";

export interface ProjectTone {
  surface: string;
  ink: string;
  muted: string;
}

export interface ProjectMetric {
  label: LocalizedText;
  value: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  order: number;
  published: boolean;
  featured: boolean;
  isDummy: boolean;
  year: string;
  category: ProjectCategory;
  categoryLabel: LocalizedText;
  tone: ProjectTone;
  mockupVariant: ProjectMockupVariant;
  /** Optional real screenshot path (diisi saat ganti proyek asli / Fase 2) */
  coverImage?: string;
  title: string;
  tagline: LocalizedText;
  summary: LocalizedText;
  overview: LocalizedText;
  problem: LocalizedText;
  solution: LocalizedText;
  features: {
    id: string[];
    en: string[];
  };
  architectureNotes: LocalizedText;
  role: LocalizedText;
  techStack: string[];
  metrics: ProjectMetric[];
  demoUrl: string;
  repoUrl?: string;
}
