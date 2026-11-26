import type { ProfileData } from "@/types/portfolio";

/**
 * Profil minimalis Danu Candra Saputra untuk tampilan editorial.
 * Tanpa informasi kampus, IPK, publikasi, sertifikasi, nomor WA, atau alamat pribadi.
 */
export const profileData: ProfileData = {
  fullName: "Danu Candra Saputra",
  firstName: "Danu",
  lastName: "Candra",
  brandHandle: "danucs",
  role: {
    id: "Fullstack Web Developer",
    en: "Fullstack Web Developer",
  },
  email: "danucandra100@gmail.com",
  cvFiles: {
    id: "/cv/CV-Danu-Candra-Saputra-ID.pdf",
    en: "/cv/CV-Danu-Candra-Saputra-EN.pdf",
  },
  bioShort: {
    id: "Fullstack Web Developer yang merancang produk web tenang, cepat, dan dibangun utuh hingga produksi.",
    en: "Fullstack Web Developer crafting quiet, fast web products engineered end to end.",
  },
  statement: {
    id: {
      lead: "Merancang produk web yang",
      italic: "tenang,",
      tail: "cepat, dan dibangun utuh hingga produksi.",
    },
    en: {
      lead: "Crafting web products that feel",
      italic: "quiet,",
      tail: "fast, and engineered end to end.",
    },
  },
  disciplines: ["Next.js", "React", "Vue", "Laravel", "TypeScript", "DevOps"],
  socials: [
    {
      id: "github",
      platform: "github",
      label: "GitHub",
      handle: "@DanuCandra",
      url: "https://github.com/DanuCandra",
    },
    {
      id: "linkedin",
      platform: "linkedin",
      label: "LinkedIn",
      handle: "in/danu-candra",
      url: "https://linkedin.com/in/danu-candra",
    },
    {
      id: "email",
      platform: "email",
      label: "Email",
      handle: "danucandra100@gmail.com",
      url: "mailto:danucandra100@gmail.com",
    },
  ],
};
