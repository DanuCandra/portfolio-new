import type { ProfileData } from "@/types/portfolio";

/**
 * Profil Danu Candra Saputra berdasarkan CV & latar belakang teknis asli.
 * Privasi terjaga: tanpa nomor telepon/WA maupun alamat rumah pribadi.
 */
export const profileData: ProfileData = {
  fullName: "Danu Candra Saputra",
  firstName: "Danu",
  lastName: "Candra",
  brandHandle: "danucs",
  role: {
    id: "Full-Stack Web Developer",
    en: "Full-Stack Web Developer",
  },
  email: "danucandra100@gmail.com",
  cvFiles: {
    id: "/cv/CV-Danu-Candra-Saputra-ID.pdf",
    en: "/cv/CV-Danu-Candra-Saputra-EN.pdf",
  },
  bioShort: {
    id: "Full-Stack Web Developer yang membangun aplikasi web dengan Laravel, Next.js, React, dan Vue.js, serta mengelola server Linux, Docker, dan jaringan.",
    en: "Full-Stack Web Developer building web applications with Laravel, Next.js, React, and Vue.js, along with Linux server, Docker, and network setup.",
  },
  statement: {
    id: {
      lead: "Halo, saya Danu, siap membangun",
      italic: "website",
      tail: "sesuai kebutuhan Anda.",
    },
    en: {
      lead: "Hi, I'm Danu, ready to build the",
      italic: "website",
      tail: "you need.",
    },
  },
  disciplines: [
    "Laravel",
    "Next.js",
    "React",
    "Vue.js",
    "PostgreSQL",
    "Docker",
    "Linux VPS",
  ],
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
  about: {
    portraitImage: "/images/danu-candra-saputra-fullstack-developer.webp",
    portraitAlt: {
      id: "Danu Candra Saputra — Full-Stack Web Developer",
      en: "Danu Candra Saputra — Full-Stack Web Developer",
    },
    publicLocation: {
      id: "Indonesia",
      en: "Indonesia",
    },
    headline: {
      id: {
        lead: "Halo, saya",
        italic: "Danu Candra.",
        tail: "Full-Stack Web Developer.",
      },
      en: {
        lead: "Hi, I'm",
        italic: "Danu Candra.",
        tail: "Full-Stack Web Developer.",
      },
    },
    paragraphs: {
      id: [
        "Saya seorang Full-Stack Web Developer yang terbiasa membangun aplikasi web menggunakan Laravel, Vue.js, React, dan Next.js, beserta database MySQL atau PostgreSQL, REST API, dan integrasi Payment Gateway.",
        "Selain melakukan coding, saya juga terbiasa mengelola server Linux/VPS, Docker, deployment CI/CD, virtualisasi Proxmox VE, serta konfigurasi jaringan MikroTik. Saya senang mengerjakan proyek dari awal sampai benar-benar live dan berjalan lancar.",
      ],
      en: [
        "I'm a Full-Stack Web Developer building web applications with Laravel, Vue.js, React, and Next.js, along with MySQL or PostgreSQL databases, REST APIs, and Payment Gateway integrations.",
        "Beyond coding, I also manage Linux VPS servers, Docker, CI/CD deployments, Proxmox VE virtualization, and MikroTik networking. I enjoy taking a project from initial build all the way to a live production setup.",
      ],
    },
    principles: [
      {
        number: "01",
        title: {
          id: "Web Development",
          en: "Web Development",
        },
        description: {
          id: "Membangun aplikasi web full-stack menggunakan Laravel, Next.js, React, atau Vue.js sesuai kebutuhan bisnis dan pengguna.",
          en: "Building full-stack web applications with Laravel, Next.js, React, or Vue.js tailored to project requirements.",
        },
      },
      {
        number: "02",
        title: {
          id: "API & Integrasi Sistem",
          en: "API & Integrations",
        },
        description: {
          id: "Merancang REST API, database MySQL atau PostgreSQL, sistem autentikasi, serta integrasi Payment Gateway untuk pembayaran online.",
          en: "Designing REST APIs, MySQL or PostgreSQL databases, authentication systems, and Payment Gateway integrations.",
        },
      },
      {
        number: "03",
        title: {
          id: "Server & Deployment",
          en: "Server & Deployment",
        },
        description: {
          id: "Setup dan pengelolaan server Linux/VPS, Docker, pipeline CI/CD, virtualisasi Proxmox VE, serta konfigurasi jaringan MikroTik.",
          en: "Setting up and maintaining Linux VPS servers, Docker, CI/CD pipelines, Proxmox VE virtualization, and MikroTik networks.",
        },
      },
    ],
    capabilities: [
      {
        label: { id: "Frontend", en: "Frontend" },
        items: ["Next.js", "React", "Vue.js", "TypeScript", "JavaScript", "Tailwind CSS"],
      },
      {
        label: { id: "Backend & Database", en: "Backend & Database" },
        items: ["PHP", "Laravel", "REST API", "Payment Gateway", "MySQL", "PostgreSQL"],
      },
      {
        label: { id: "Server, DevOps & Jaringan", en: "Server, DevOps & Network" },
        items: ["Linux VPS", "Docker", "CI/CD", "Proxmox VE", "MikroTik RouterOS", "Git"],
      },
    ],
    interlude: {
      id: {
        lead: "“Everybody should learn to make a program computer, because it",
        italic: "teaches you how to think.”",
        tail: "",
      },
      en: {
        lead: "“Everybody should learn to make a program computer, because it",
        italic: "teaches you how to think.”",
        tail: "",
      },
    },
    interludeStrip: [
      "Laravel",
      "Next.js",
      "Vue.js",
      "REST API",
      "Payment Gateway",
      "Docker",
      "Linux VPS",
      "Proxmox VE",
      "MikroTik",
    ],
    experience: [
      {
        id: "exp-lab",
        period: { id: "Des 2023 - Agu 2026", en: "Dec 2023 - Aug 2026" },
        role: { id: "Asisten Laboratorium", en: "Laboratory Assistant" },
        organization: "Universitas PGRI Semarang",
        type: { id: "Laboratorium Informatika", en: "Informatics Laboratory" },
        highlights: {
          id: [
            "Menangani troubleshooting komputer, software, dan jaringan agar perangkat laboratorium selalu siap dipakai.",
            "Mendampingi jalannya praktikum dan membantu mahasiswa menyelesaikan kendala teknis pemrograman maupun penggunaan software.",
          ],
          en: [
            "Handled workstation, software, and network troubleshooting to keep lab equipment ready for daily sessions.",
            "Assisted lab practicals and helped students work through programming and software issues.",
          ],
        },
      },
      {
        id: "exp-freelance",
        period: { id: "Des 2023 - Mar 2026", en: "Dec 2023 - Mar 2026" },
        role: {
          id: "Full-Stack Web Developer",
          en: "Full-Stack Web Developer",
        },
        organization: "Freelance",
        type: { id: "Proyek Klien", en: "Client Projects" },
        highlights: {
          id: [
            "Membangun dan men-deploy aplikasi web end-to-end menggunakan Laravel, MySQL, REST API, serta frontend sesuai kebutuhan proyek.",
            "Mengerjakan autentikasi, hak akses, relasi database, logika bisnis, hingga integrasi Payment Gateway untuk pembayaran online.",
          ],
          en: [
            "Built and deployed end-to-end web applications using Laravel, MySQL, REST APIs, and frontend stacks tailored to client needs.",
            "Implemented authentication, authorization, relational database schemas, business logic, and Payment Gateway integrations.",
          ],
        },
      },
      {
        id: "exp-intern",
        period: { id: "Jan 2025 - Apr 2025", en: "Jan 2025 - Apr 2025" },
        role: { id: "Web Developer Intern", en: "Web Developer Intern" },
        organization: "PT Mitra Aplikasi Teknologi",
        type: { id: "Magang", en: "Internship" },
        highlights: {
          id: [
            "Mengembangkan fitur aplikasi CRM menggunakan Laravel, Eloquent ORM, Blade, dan MySQL sesuai alur bisnis perusahaan.",
            "Melakukan testing, debugging, validasi fitur, serta kolaborasi pengelolaan source code menggunakan Git.",
          ],
          en: [
            "Developed CRM modules using Laravel, Eloquent ORM, Blade, and MySQL aligned with internal business processes.",
            "Performed software testing, debugging, feature validation, and team version control with Git.",
          ],
        },
      },
    ],
    education: [
      {
        id: "edu-upgris",
        period: { id: "Sarjana (S1)", en: "Bachelor's Degree" },
        degree: { id: "S1 Informatika", en: "B.Sc. in Informatics" },
        institution: "Universitas PGRI Semarang",
        focus: {
          id: "Mempelajari pengembangan web full-stack, database relasional, administrasi server, serta riset keamanan jaringan menggunakan machine learning dan MikroTik.",
          en: "Studied full-stack web engineering, relational databases, server administration, and network security research using machine learning and MikroTik.",
        },
      },
    ],
  },
};
