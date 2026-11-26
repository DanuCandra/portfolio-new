export interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogSubtitle: string;
  };
  nav: {
    about: string;
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
    allProjects: string;
    overview: string;
    problem: string;
    solution: string;
    features: string;
    architecture: string;
    stack: string;
    stackBreakdown: string;
    category: string;
    role: string;
    year: string;
    liveDemo: string;
    source: string;
    desktopCaption: string;
    mobileCaption: string;
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
  about: {
    eyebrow: string;
    availability: string;
    principlesHeading: string;
    capabilitiesHeading: string;
    colophonEyebrow: string;
    experienceHeading: string;
    educationHeading: string;
    expandHint: string;
    bridgeEyebrow: string;
    bridgeLead: string;
    bridgeItalic: string;
    exploreWork: string;
  };
}

export const dictionaries: Record<"id" | "en", Dictionary> = {
  id: {
    meta: {
      title: "Danu Candra Saputra — Full-Stack Web Developer | danucs",
      description:
        "Portfolio Danu Candra Saputra, Full-Stack Web Developer. Membangun aplikasi web dengan Laravel, Next.js, React, Vue.js, serta pengelolaan server Linux dan Docker.",
      ogSubtitle: "Full-Stack Web Developer",
    },
    nav: {
      about: "Tentang Saya",
      work: "Proyek",
      contact: "Kontak",
    },
    hero: {
      scroll: "Scroll",
    },
    work: {
      heading: "Proyek",
      modeIndex: "Daftar",
      modeCards: "Kartu",
      liveDemo: "Live Demo",
      explore: "Lihat Detail",
    },
    caseStudy: {
      back: "Kembali ke Proyek",
      allProjects: "Semua Proyek",
      overview: "Ringkasan",
      problem: "Masalah",
      solution: "Solusi",
      features: "Fitur Utama",
      architecture: "Arsitektur",
      stack: "Tech Stack",
      stackBreakdown: "Peran Teknologi",
      category: "Kategori",
      role: "Peran",
      year: "Tahun",
      liveDemo: "Buka Live Demo",
      source: "Source Code",
      desktopCaption: "Tampilan Desktop · 1440px",
      mobileCaption: "Tampilan Mobile · 390px",
      nextProject: "Proyek Berikutnya",
    },
    contact: {
      headlineLead: "Hubungi",
      headlineItalic: "saya.",
      copyPrompt: "Salin email",
      copied: "Email disalin",
      downloadCv: "Download CV (PDF)",
      backToTop: "Ke atas",
    },
    about: {
      eyebrow: "Tentang Saya",
      availability: "Tersedia untuk proyek",
      principlesHeading: "Yang Saya Kerjakan",
      capabilitiesHeading: "Tech Stack",
      colophonEyebrow: "Pengalaman & Pendidikan",
      experienceHeading: "Pengalaman",
      educationHeading: "Pendidikan",
      expandHint: "Klik untuk melihat detail",
      bridgeEyebrow: "Kontak",
      bridgeLead: "Tertarik bekerja sama?",
      bridgeItalic: "Hubungi saya.",
      exploreWork: "Lihat Proyek",
    },
  },
  en: {
    meta: {
      title: "Danu Candra Saputra — Full-Stack Web Developer | danucs",
      description:
        "Portfolio of Danu Candra Saputra, Full-Stack Web Developer building web applications with Laravel, Next.js, React, Vue.js, and Linux/Docker servers.",
      ogSubtitle: "Full-Stack Web Developer",
    },
    nav: {
      about: "About Me",
      work: "Projects",
      contact: "Contact",
    },
    hero: {
      scroll: "Scroll",
    },
    work: {
      heading: "Projects",
      modeIndex: "Index",
      modeCards: "Cards",
      liveDemo: "Live Demo",
      explore: "View Details",
    },
    caseStudy: {
      back: "Back to Projects",
      allProjects: "All Projects",
      overview: "Overview",
      problem: "Problem",
      solution: "Solution",
      features: "Key Features",
      architecture: "Architecture",
      stack: "Tech Stack",
      stackBreakdown: "Tech Breakdown",
      category: "Category",
      role: "Role",
      year: "Year",
      liveDemo: "Open Live Demo",
      source: "Source Code",
      desktopCaption: "Desktop View · 1440px",
      mobileCaption: "Mobile View · 390px",
      nextProject: "Next Project",
    },
    contact: {
      headlineLead: "Get in",
      headlineItalic: "touch.",
      copyPrompt: "Copy email",
      copied: "Email copied",
      downloadCv: "Download CV (PDF)",
      backToTop: "Back to top",
    },
    about: {
      eyebrow: "About Me",
      availability: "Available for projects",
      principlesHeading: "What I Do",
      capabilitiesHeading: "Tech Stack",
      colophonEyebrow: "Experience & Education",
      experienceHeading: "Experience",
      educationHeading: "Education",
      expandHint: "Click to expand",
      bridgeEyebrow: "Contact",
      bridgeLead: "Interested in working together?",
      bridgeItalic: "Get in touch.",
      exploreWork: "View Projects",
    },
  },
};
