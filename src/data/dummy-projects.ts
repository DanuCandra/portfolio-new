import type { ProjectItem } from "@/types/portfolio";

/**
 * 5 Showcase Web Projects (Fase 1).
 * Terisolasi di balik Repository Pattern (`src/lib/data/projects.ts`) —
 * siap diganti ke proyek asli / database di Fase 2 tanpa mengubah UI.
 */
export const dummyProjects: ProjectItem[] = [
  {
    id: "proj-01",
    slug: "aether-ai-studio",
    order: 1,
    published: true,
    featured: true,
    isDummy: true,
    year: "2026",
    category: "fullstack",
    categoryLabel: {
      id: "AI Workspace",
      en: "AI Workspace",
    },
    tone: {
      surface: "#EAE8E1",
      ink: "#0D0D0D",
      muted: "#6E6D67",
    },
    mockupVariant: "aether-ai",
    title: "AetherAI Studio",
    tagline: {
      id: "Orkestrasi alur kerja AI dan analitik real-time berbasis web.",
      en: "Real-time AI workflow orchestration and analytics workspace.",
    },
    summary: {
      id: "Platform SaaS untuk menyusun pipeline otomatisasi AI, memantau penggunaan token, dan mengelola webhook tim secara terpusat.",
      en: "A SaaS web application for composing AI pipelines, monitoring live token telemetry, and managing team webhooks.",
    },
    overview: {
      id: "AetherAI Studio adalah platform web multi-tenant yang memungkinkan tim engineering merancang node alur kerja AI secara visual, menguji prompt paralel, serta memantau latensi dan biaya eksekusi dalam satu ruang kerja bersih.",
      en: "AetherAI Studio is a multi-tenant web platform enabling engineering teams to design visual AI workflow nodes, benchmark prompts in parallel, and track execution latency in one calm workspace.",
    },
    problem: {
      id: "Tim produk kesulitan memantau eksperimen prompt, integrasi API, dan biaya model AI yang tersebar di skrip internal tanpa observabilitas terpadu.",
      en: "Product teams struggled to track prompt experiments, API webhooks, and unpredictable AI model costs scattered across ad-hoc internal scripts.",
    },
    solution: {
      id: "Membangun visual pipeline builder dengan streaming eksekusi real-time, caching respons di Redis, kontrol akses berbasis peran (RBAC), dan pencatatan kuota di PostgreSQL.",
      en: "Built a visual pipeline builder backed by streaming execution logs, structured caching in Redis, role-based access control, and real-time metering in PostgreSQL.",
    },
    features: {
      id: [
        "Visual Node Pipeline Builder dengan inspeksi payload real-time",
        "Dasbor telemetri latensi, throughput, dan pemakaian token",
        "Workspace Multi-Tenant dengan RBAC dan manajemen API Key",
        "Log eksekusi streaming dengan replay payload instan",
      ],
      en: [
        "Visual Node Pipeline Builder with real-time payload inspection",
        "Telemetry dashboard for latency, throughput, and token usage",
        "Multi-Tenant workspaces with RBAC and scoped API keys",
        "Streaming execution logs with instant payload replay",
      ],
    },
    architectureNotes: {
      id: "Next.js App Router, REST & Streaming API, PostgreSQL + Prisma ORM untuk data transaksional, serta Redis untuk rate-limiting dan antrean tugas.",
      en: "Next.js App Router, REST & streaming endpoints, PostgreSQL + Prisma ORM for transactional data, and Redis for rate-limiting and async queues.",
    },
    role: {
      id: "Fullstack Architecture & UI",
      en: "Fullstack Architecture & UI",
    },
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis"],
    metrics: [
      { label: { id: "Latensi API", en: "API Latency" }, value: "< 85ms" },
      { label: { id: "Lighthouse", en: "Lighthouse" }, value: "98 / 100" },
      { label: { id: "Uptime", en: "Uptime" }, value: "99.95%" },
    ],
    demoUrl: "https://aether-demo.danucs.com",
    repoUrl: "https://github.com/DanuCandra",
  },
  {
    id: "proj-02",
    slug: "veloce-commerce",
    order: 2,
    published: true,
    featured: true,
    isDummy: true,
    year: "2026",
    category: "ecommerce",
    categoryLabel: {
      id: "E-Commerce · 3D",
      en: "E-Commerce · 3D",
    },
    tone: {
      surface: "#E6E4DD",
      ink: "#0D0D0D",
      muted: "#6B6A64",
    },
    mockupVariant: "veloce-commerce",
    title: "Veloce Atelier",
    tagline: {
      id: "Headless e-commerce dengan konfigurator produk 3D interaktif.",
      en: "Headless e-commerce storefront with interactive 3D customization.",
    },
    summary: {
      id: "Etalase e-commerce modern untuk produk custom yang memadukan katalog cepat, pratinjau 3D real-time, dan checkout Payment Gateway terintegrasi.",
      en: "A modern storefront for bespoke gear combining fast catalog filtering, real-time 3D material previews, and Payment Gateway checkout.",
    },
    overview: {
      id: "Veloce Atelier dirancang sebagai etalase digital generasi baru: pembeli memutar produk dalam 3D, memilih material secara langsung, lalu menyelesaikan pembayaran otomatis dengan sinkronisasi stok real-time.",
      en: "Veloce Atelier is crafted as a next-generation storefront: shoppers inspect objects in 3D, swap finishes in real time, and complete automated payments backed by live inventory locking.",
    },
    problem: {
      id: "Foto produk statis gagal memvisualisasikan variasi material custom, sehingga tingkat konversi rendah dan sering terjadi ketidakcocokan ekspektasi.",
      en: "Static product imagery failed to convey custom material finishes, resulting in hesitant buyers and avoidable order returns.",
    },
    solution: {
      id: "Mengintegrasikan konfigurator Three.js ringan di sisi klien sambil menjaga halaman katalog tetap SSR/SEO-friendly, dipadukan dengan Laravel REST API idempoten.",
      en: "Integrated a lightweight client-side Three.js configurator while keeping catalog routes fully SSR and SEO-indexed, backed by an idempotent Laravel checkout API.",
    },
    features: {
      id: [
        "Konfigurator produk 3D interaktif dengan pergantian material instan",
        "Integrasi Payment Gateway otomatis (VA, QRIS, Kartu)",
        "Katalog dinamis SSR dengan filter multi-atribut instan",
        "Manajemen pesanan, penguncian stok live, dan pelacakan kirim",
      ],
      en: [
        "Interactive 3D product configurator with instant finish swaps",
        "Automated Payment Gateway checkout (VA, QRIS, Cards)",
        "SSR-indexed catalog with instant multi-facet filtering",
        "Order lifecycle management, live stock locking, and tracking",
      ],
    },
    architectureNotes: {
      id: "Next.js + Three.js storefront, Laravel REST API backend, MySQL relational SKU/order schema, serta verifikasi tanda tangan kriptografis pada webhook pembayaran.",
      en: "Next.js + Three.js storefront, Laravel REST API backend, MySQL relational SKU/order schema, and cryptographic signature verification on payment webhooks.",
    },
    role: {
      id: "Fullstack Web Developer",
      en: "Fullstack Web Developer",
    },
    techStack: ["Next.js", "Three.js", "Laravel", "MySQL"],
    metrics: [
      { label: { id: "First Load", en: "First Load" }, value: "0.9s" },
      { label: { id: "Alur Checkout", en: "Checkout" }, value: "3 Steps" },
      { label: { id: "Skor SEO", en: "SEO Audit" }, value: "100 / 100" },
    ],
    demoUrl: "https://veloce-demo.danucs.com",
    repoUrl: "https://github.com/DanuCandra",
  },
  {
    id: "proj-03",
    slug: "nusantara-cloud",
    order: 3,
    published: true,
    featured: true,
    isDummy: true,
    year: "2025",
    category: "devops",
    categoryLabel: {
      id: "Cloud Infrastructure",
      en: "Cloud Infrastructure",
    },
    tone: {
      surface: "#E4E5E2",
      ink: "#0D0D0D",
      muted: "#696B68",
    },
    mockupVariant: "nusantara-cloud",
    title: "Nusantara Cloud",
    tagline: {
      id: "Observabilitas server VPS, kontainer Docker, dan kontrol CI/CD.",
      en: "Unified VPS telemetry, Docker container control, and CI/CD hub.",
    },
    summary: {
      id: "Aplikasi web untuk memantau kesehatan klaster Linux/VPS secara real-time, melihat log deployment CI/CD, dan mengatur kebijakan firewall.",
      en: "A web platform for monitoring Linux/VPS cluster health in real time, inspecting CI/CD rollout logs, and managing node firewall rules.",
    },
    overview: {
      id: "Nusantara Cloud menyatukan observabilitas server dan kendali deployment dalam satu antarmuka web modern — memudahkan tim mendeteksi anomali dan melakukan rollback rilis dalam satu klik.",
      en: "Nusantara Cloud unifies server observability and deployment controls in one clean interface — helping engineering teams spot anomalies early and execute one-click rollbacks.",
    },
    problem: {
      id: "Engineer harus berpindah antar SSH terminal, dasbor kontainer, dan log CI/CD terpisah ketika terjadi insiden produksi.",
      en: "Engineers had to juggle SSH sessions, container consoles, and disconnected CI/CD logs whenever production incidents occurred.",
    },
    solution: {
      id: "Merancang agen metrik ringan yang mengirim telemetri ke backend API dan menampilkannya dalam grafik berlatensi rendah lengkap dengan alert otomatis.",
      en: "Engineered a lightweight telemetry pipeline feeding live server metrics into a unified dashboard with instant alerts and one-click rollback triggers.",
    },
    features: {
      id: [
        "Telemetri server real-time (CPU, Memori, Disk I/O, Jaringan)",
        "Kendali kontainer Docker (Start, Restart, Live Logs)",
        "Linimasa deployment CI/CD dengan One-Click Rollback",
        "Peringatan anomali otomatis dan ringkasan firewall node",
      ],
      en: [
        "Real-time server telemetry (CPU, Memory, Disk I/O, Network)",
        "Docker container controls (Start, Restart, Live Log Stream)",
        "CI/CD deployment timeline with One-Click Rollback",
        "Automated anomaly alerting and node firewall policy overview",
      ],
    },
    architectureNotes: {
      id: "React + TypeScript dashboard, Laravel API & Queue Worker, integrasi Docker Engine API, serta penyimpanan histori metrik di PostgreSQL.",
      en: "React + TypeScript dashboard, Laravel API & Queue Workers, Docker Engine API integration, and time-indexed metric persistence in PostgreSQL.",
    },
    role: {
      id: "Fullstack & DevOps",
      en: "Fullstack & DevOps",
    },
    techStack: ["React", "Laravel", "Docker", "PostgreSQL"],
    metrics: [
      { label: { id: "Interval Tick", en: "Telemetry" }, value: "500ms" },
      { label: { id: "Klaster Node", en: "Nodes" }, value: "24 VMs" },
      { label: { id: "Rollback", en: "Rollback" }, value: "< 12s" },
    ],
    demoUrl: "https://cloud-demo.danucs.com",
    repoUrl: "https://github.com/DanuCandra",
  },
  {
    id: "proj-04",
    slug: "kinetix-studio",
    order: 4,
    published: true,
    featured: true,
    isDummy: true,
    year: "2025",
    category: "creative",
    categoryLabel: {
      id: "Creative Direction",
      en: "Creative Direction",
    },
    tone: {
      surface: "#ECEAE3",
      ink: "#0D0D0D",
      muted: "#6F6D66",
    },
    mockupVariant: "kinetix-studio",
    title: "Kinetix Digital",
    tagline: {
      id: "Pameran studio kreatif dengan tipografi kinetik & gerak sinematis.",
      en: "Editorial studio showcase crafted with kinetic motion and precision.",
    },
    summary: {
      id: "Web interaktif berstandar galeri yang menonjolkan tipografi editorial, transisi halaman mulus, dan gerak berkecepatan 60–120 FPS.",
      en: "A gallery-grade interactive showcase featuring kinetic editorial typography, fluid route transitions, and 60–120 FPS motion.",
    },
    overview: {
      id: "Kinetix Digital dibangun untuk menunjukkan bagaimana narasi visual, koreografi gerak halus, dan performa SEO dapat berjalan beriringan tanpa mengorbankan kecepatan muat di mobile.",
      en: "Kinetix Digital demonstrates how bold visual storytelling, choreographed motion, and technical SEO coexist seamlessly without compromising mobile performance.",
    },
    problem: {
      id: "Situs agensi kreatif kerap mengorbankan SEO dan kinerja perangkat ringan demi animasi berat yang membuat pengunjung cepat pergi.",
      en: "Creative studio websites often sacrifice search indexing and mid-tier device smoothness in pursuit of heavy animations.",
    },
    solution: {
      id: "Memisahkan konten SSR terindeks Google dari koreografi berbasis transform GPU murni dan degradasi adaptif untuk perangkat sentuh.",
      en: "Separated fully indexed SSR semantic markup from GPU transform-only choreography with adaptive touch optimization.",
    },
    features: {
      id: [
        "Tipografi kinetik split-mask tersinkronisasi kecepatan scroll",
        "Transisi tirai antar halaman mulus tanpa jeda",
        "Tata letak majalah editorial dengan ruang kosong presisi",
        "Arsitektur SSR ramah SEO dengan skor Core Web Vitals hijau",
      ],
      en: [
        "Split-mask kinetic typography synchronized to scroll momentum",
        "Seamless monochrome curtain transitions between case studies",
        "Editorial magazine layout with disciplined negative space",
        "SEO-first SSR architecture maintaining green Core Web Vitals",
      ],
    },
    architectureNotes: {
      id: "Next.js App Router, Lenis Smooth Scroll, Three.js, dan optimasi font bebas pergeseran tata letak (zero-CLS) melalui next/font.",
      en: "Next.js App Router, Lenis Smooth Scroll, Three.js, and zero-CLS typography through next/font.",
    },
    role: {
      id: "Creative Frontend",
      en: "Creative Frontend",
    },
    techStack: ["Next.js", "Three.js", "Lenis", "TypeScript"],
    metrics: [
      { label: { id: "Frame Rate", en: "Frame Rate" }, value: "60 FPS" },
      { label: { id: "Layout Shift", en: "CLS" }, value: "0.00" },
      { label: { id: "Performa", en: "Performance" }, value: "98 / 100" },
    ],
    demoUrl: "https://kinetix-demo.danucs.com",
    repoUrl: "https://github.com/DanuCandra",
  },
  {
    id: "proj-05",
    slug: "finpulse-treasury",
    order: 5,
    published: true,
    featured: true,
    isDummy: true,
    year: "2025",
    category: "web-app",
    categoryLabel: {
      id: "FinTech Platform",
      en: "FinTech Platform",
    },
    tone: {
      surface: "#E5E5E1",
      ink: "#0D0D0D",
      muted: "#6B6B66",
    },
    mockupVariant: "finpulse-treasury",
    title: "FinPulse Treasury",
    tagline: {
      id: "Manajemen arus kas, invoice otomatis, dan rekonsiliasi pembayaran.",
      en: "Cashflow management, automated invoicing, and payment reconciliation.",
    },
    summary: {
      id: "Platform keuangan bisnis berbasis web untuk memantau arus kas lintas rekening, membuat tautan tagihan otomatis, dan mengekspor laporan audit instan.",
      en: "A business finance web app for tracking multi-account cashflow, generating automated invoice links, and exporting audit-ready reports.",
    },
    overview: {
      id: "FinPulse Treasury membantu bisnis digital menyederhanakan pencatatan transaksi, verifikasi pembayaran otomatis, dan proyeksi arus kas bulanan dalam antarmuka bebas distraksi.",
      en: "FinPulse Treasury helps digital businesses streamline transaction ledgers, automated payment reconciliation, and monthly cashflow forecasting inside a distraction-free workspace.",
    },
    problem: {
      id: "Rekonsiliasi pembayaran manual lewat spreadsheet rawan selisih angka, lambat, dan menyulitkan pemantauan arus kas real-time.",
      en: "Manual payment reconciliation across spreadsheets was error-prone, slow, and obscured live cashflow visibility.",
    },
    solution: {
      id: "Membangun ledger double-entry berbasis transaksi ACID, webhook Payment Gateway otomatis, serta analitik periode interaktif.",
      en: "Engineered an ACID-compliant double-entry ledger paired with automated Payment Gateway webhook reconciliation and clean period analytics.",
    },
    features: {
      id: [
        "Generator invoice & tautan pembayaran otomatis dengan status live",
        "Buku besar transaksi (Audit Trail) dengan ekspor PDF/CSV",
        "Proyeksi arus kas bulanan yang jernih dan dapat difilter",
        "Kontrol akses berbasis peran untuk tim keuangan",
      ],
      en: [
        "Automated invoice & payment link generator with live status",
        "Searchable audit transaction ledger with instant PDF/CSV export",
        "Clear filterable monthly cashflow forecasting",
        "Granular role-based access control for finance teams",
      ],
    },
    architectureNotes: {
      id: "Vue.js & Next.js frontend, Laravel REST API dengan transaction locking PostgreSQL, serta background job notifikasi tagihan.",
      en: "Modern reactive frontend, Laravel REST API with PostgreSQL transactional locks, and queued invoice notification workers.",
    },
    role: {
      id: "Fullstack Web Developer",
      en: "Fullstack Web Developer",
    },
    techStack: ["Vue.js", "Laravel", "PostgreSQL", "Docker"],
    metrics: [
      { label: { id: "Rekonsiliasi", en: "Reconciliation" }, value: "Real-Time" },
      { label: { id: "Integritas", en: "Ledger" }, value: "ACID 100%" },
      { label: { id: "Ekspor", en: "Exports" }, value: "PDF / CSV" },
    ],
    demoUrl: "https://finpulse-demo.danucs.com",
    repoUrl: "https://github.com/DanuCandra",
  },
];
