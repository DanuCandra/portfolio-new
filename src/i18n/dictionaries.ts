export interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogSubtitle: string;
  };
  nav: {
    work: string;
    contact: string;
  };
  hero: {
    scroll: string;
  };
  work: {
    heading: string;
    modeIndex: string;
    modeCards: string;
    liveDemo: string;
    explore: string;
  };
  caseStudy: {
    back: string;
    overview: string;
    problem: string;
    solution: string;
    features: string;
    architecture: string;
    stack: string;
    role: string;
    year: string;
    liveDemo: string;
    source: string;
    nextProject: string;
  };
  contact: {
    headlineLead: string;
    headlineItalic: string;
    copyPrompt: string;
    copied: string;
    downloadCv: string;
    backToTop: string;
  };
}

export const dictionaries: Record<"id" | "en", Dictionary> = {
  id: {
    meta: {
      title: "Danu Candra Saputra — Fullstack Web Developer | danucs",
      description:
        "Portfolio resmi Danu Candra Saputra, Fullstack Web Developer. Merancang produk web yang tenang, cepat, dan dibangun utuh hingga produksi.",
      ogSubtitle: "Fullstack Web Developer",
    },
    nav: {
      work: "Karya",
      contact: "Kontak",
    },
    hero: {
      scroll: "Gulir",
    },
    work: {
      heading: "Karya Pilihan",
      modeIndex: "Index",
      modeCards: "Kartu",
      liveDemo: "Live Demo",
      explore: "Lihat Detail",
    },
    caseStudy: {
      back: "Kembali ke Karya",
      overview: "Ringkasan",
      problem: "Tantangan",
      solution: "Solusi",
      features: "Fitur Utama",
      architecture: "Arsitektur",
      stack: "Teknologi",
      role: "Peran",
      year: "Tahun",
      liveDemo: "Buka Live Demo",
      source: "Kode Sumber",
      nextProject: "Karya Berikutnya",
    },
    contact: {
      headlineLead: "Mari",
      headlineItalic: "berkolaborasi.",
      copyPrompt: "Salin email",
      copied: "Email tersalin",
      downloadCv: "CV (PDF)",
      backToTop: "Atas",
    },
  },
  en: {
    meta: {
      title: "Danu Candra Saputra — Fullstack Web Developer | danucs",
      description:
        "Official portfolio of Danu Candra Saputra, Fullstack Web Developer crafting quiet, fast web products engineered end to end.",
      ogSubtitle: "Fullstack Web Developer",
    },
    nav: {
      work: "Work",
      contact: "Contact",
    },
    hero: {
      scroll: "Scroll",
    },
    work: {
      heading: "Selected Work",
      modeIndex: "Index",
      modeCards: "Cards",
      liveDemo: "Live Demo",
      explore: "Explore",
    },
    caseStudy: {
      back: "Back to Work",
      overview: "Overview",
      problem: "Challenge",
      solution: "Solution",
      features: "Key Capabilities",
      architecture: "Architecture",
      stack: "Stack",
      role: "Role",
      year: "Year",
      liveDemo: "Launch Live Demo",
      source: "Source Code",
      nextProject: "Next Project",
    },
    contact: {
      headlineLead: "Let's work",
      headlineItalic: "together.",
      copyPrompt: "Copy email",
      copied: "Copied to clipboard",
      downloadCv: "CV (PDF)",
      backToTop: "Top",
    },
  },
};
