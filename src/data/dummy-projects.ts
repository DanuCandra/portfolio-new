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
      id: "Aplikasi web untuk menyusun alur kerja AI dan memantau penggunaan API secara langsung.",
      en: "Web app for building AI workflows and tracking live API usage.",
    },
    summary: {
      id: "Aplikasi SaaS untuk mengatur pipeline otomatisasi AI, melihat catatan pemakaian token, dan mengelola webhook tim di satu dasbor.",
      en: "A SaaS web app for managing AI pipelines, monitoring token usage, and organizing team webhooks in one dashboard.",
    },
    overview: {
      id: "AetherAI Studio dibuat agar tim developer bisa merangkai langkah eksekusi AI secara visual, membandingkan hasil prompt, dan memantau latensi maupun biaya API tanpa harus bolak-balik terminal dan skrip terpisah.",
      en: "AetherAI Studio lets engineering teams wire AI steps visually, compare prompt outputs, and monitor latency and API costs without jumping across scattered scripts.",
    },
    problem: {
      id: "Pengujian prompt, integrasi webhook, dan pencatatan biaya API biasanya tercecer di banyak skrip internal sehingga susah dipantau saat mulai dipakai tim.",
      en: "Prompt tests, webhook handlers, and API usage logs often live in scattered scripts, making them hard to track once a team starts relying on them.",
    },
    solution: {
      id: "Membangun editor alur kerja berbasis node dengan log eksekusi streaming, cache respons di Redis, hak akses per peran (RBAC), serta pencatatan kuota di PostgreSQL.",
      en: "Built a node-based workflow editor with streaming execution logs, Redis response caching, role-based access control, and quota tracking in PostgreSQL.",
    },
    features: {
      id: [
        "Editor alur kerja visual dengan pratinjau payload secara langsung",
        "Dasbor pantauan latensi, jumlah request, dan pemakaian token",
        "Workspace multi-tim dengan pengaturan hak akses dan API Key",
        "Riwayat log eksekusi yang bisa dijalankan ulang kapan saja",
      ],
      en: [
        "Visual node workflow editor with live payload inspection",
        "Usage dashboard for latency, throughput, and token counts",
        "Multi-team workspaces with RBAC and scoped API keys",
        "Streaming execution history with one-click payload replay",
      ],
    },
    architectureNotes: {
      id: "Dibangun dengan Next.js App Router, endpoint REST & streaming, PostgreSQL + Prisma untuk data utama, serta Redis untuk rate-limiting dan antrean proses.",
      en: "Built on Next.js App Router, REST & streaming endpoints, PostgreSQL + Prisma for core records, and Redis for rate-limiting and async queues.",
    },
    role: {
      id: "Full-Stack Developer",
      en: "Full-Stack Developer",
    },
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis"],
    stackRoles: [
      {
        name: "Next.js",
        role: {
          id: "Routing SSR, endpoint streaming, dan halaman editor pipeline",
          en: "App Router SSR, streaming endpoints, and the pipeline editor",
        },
      },
      {
        name: "TypeScript",
        role: {
          id: "Tipe data konsisten antara editor visual dan API eksekutor",
          en: "Shared strict schemas across the visual editor and API runner",
        },
      },
      {
        name: "PostgreSQL",
        role: {
          id: "Data workspace, hak akses pengguna, dan pencatatan kuota token",
          en: "Workspace records, user permissions, and token metering logs",
        },
      },
      {
        name: "Redis",
        role: {
          id: "Pembatasan request per API key, cache respons, dan antrean webhook",
          en: "Per-key rate limiting, response caching, and webhook queues",
        },
      },
    ],
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
      id: "Toko online produk custom dengan pratinjau 3D dan checkout Payment Gateway.",
      en: "Custom product storefront with 3D preview and Payment Gateway checkout.",
    },
    summary: {
      id: "Web e-commerce untuk produk custom yang menggabungkan katalog cepat, kustomisasi material 3D, dan pembayaran online otomatis.",
      en: "An e-commerce storefront for custom goods combining fast catalog filters, 3D material previews, and automated online payments.",
    },
    overview: {
      id: "Veloce Atelier memudahkan pembeli melihat variasi bahan dan warna produk custom secara 3D sebelum memesan, lalu langsung menyelesaikan pembayaran lewat Virtual Account, QRIS, atau kartu dengan stok yang otomatis terkunci.",
      en: "Veloce Atelier lets shoppers inspect custom finishes in 3D before ordering, then check out via Virtual Account, QRIS, or card with live stock locking.",
    },
    problem: {
      id: "Foto produk biasa sering membuat pembeli ragu saat memilih varian warna atau material custom, sehingga banyak yang batal checkout atau barang tidak sesuai ekspektasi.",
      en: "Standard static photos made buyers hesitate when picking custom finishes, leading to dropped carts and mismatched orders.",
    },
    solution: {
      id: "Memasang pratinjau 3D ringan berbasis Three.js di halaman produk tanpa mengorbankan kecepatan katalog SSR, lalu menghubungkannya ke Laravel REST API dengan verifikasi webhook pembayaran.",
      en: "Added a lightweight Three.js preview on product pages while keeping catalog routes fast and SSR-indexed, backed by a Laravel checkout API with verified payment webhooks.",
    },
    features: {
      id: [
        "Pratinjau produk 3D interaktif dengan pilihan material dan warna",
        "Pembayaran otomatis via Payment Gateway (VA, QRIS, Kartu)",
        "Katalog produk SSR dengan filter multi-kategori yang cepat",
        "Pengelolaan pesanan, penguncian stok real-time, dan status kirim",
      ],
      en: [
        "Interactive 3D product preview with instant material swaps",
        "Automated Payment Gateway checkout (VA, QRIS, Cards)",
        "SSR-indexed catalog with fast multi-attribute filtering",
        "Order management, live stock locking, and shipment tracking",
      ],
    },
    architectureNotes: {
      id: "Frontend Next.js + Three.js, backend REST API Laravel, skema SKU & pesanan di MySQL, dilengkapi validasi signature pada callback Payment Gateway.",
      en: "Next.js + Three.js storefront, Laravel REST API backend, MySQL relational SKU and order tables, and signature validation on payment webhooks.",
    },
    role: {
      id: "Full-Stack Web Developer",
      en: "Full-Stack Web Developer",
    },
    techStack: ["Next.js", "Three.js", "Laravel", "MySQL"],
    stackRoles: [
      {
        name: "Next.js",
        role: {
          id: "Halaman katalog SSR ramah SEO dengan filter produk cepat",
          en: "SEO-friendly SSR catalog pages with fast product filtering",
        },
      },
      {
        name: "Three.js",
        role: {
          id: "Pratinjau material 3D ringan yang otomatis berhenti saat idle",
          en: "Lightweight 3D material preview that pauses when idle",
        },
      },
      {
        name: "Laravel",
        role: {
          id: "REST API transaksi, stok, dan verifikasi webhook Payment Gateway",
          en: "Checkout REST API, stock handling, and Payment Gateway webhooks",
        },
      },
      {
        name: "MySQL",
        role: {
          id: "Data varian SKU custom, penguncian stok, dan catatan pesanan",
          en: "Custom SKU variants, live stock locks, and order records",
        },
      },
    ],
    metrics: [
      { label: { id: "First Load", en: "First Load" }, value: "0.9s" },
      { label: { id: "Langkah Bayar", en: "Checkout" }, value: "3 Steps" },
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
      id: "Server & DevOps",
      en: "Server & DevOps",
    },
    tone: {
      surface: "#E4E5E2",
      ink: "#0D0D0D",
      muted: "#696B68",
    },
    mockupVariant: "nusantara-cloud",
    title: "Nusantara Cloud",
    tagline: {
      id: "Dasbor pemantauan server VPS, kontainer Docker, dan riwayat deployment.",
      en: "Dashboard for VPS monitoring, Docker containers, and deployment history.",
    },
    summary: {
      id: "Aplikasi web untuk memantau kondisi server Linux/VPS secara langsung, mengecek log CI/CD, dan mengatur aturan firewall per node.",
      en: "Web dashboard for tracking Linux/VPS health in real time, reading CI/CD rollout logs, and reviewing node firewall rules.",
    },
    overview: {
      id: "Nusantara Cloud mengumpulkan pantauan CPU, memori, status Docker, dan log deployment ke satu panel web supaya proses cek gangguan atau rollback versi lama bisa dilakukan cepat tanpa membuka banyak sesi SSH.",
      en: "Nusantara Cloud brings CPU, memory, Docker container states, and deployment logs into one panel so teams can diagnose issues or trigger rollbacks without juggling SSH tabs.",
    },
    problem: {
      id: "Saat layanan bermasalah di produksi, tim biasanya harus pindah-pindah antara terminal SSH, log Docker, dan riwayat CI/CD yang terpisah sehingga penanganan jadi lambat.",
      en: "During production issues, jumping between SSH terminals, Docker consoles, and CI/CD logs slowed down root-cause checks and recovery.",
    },
    solution: {
      id: "Membuat agen pengumpul metrik ringan yang mengirim data ke backend Laravel secara berkala, lalu menampilkannya di antarmuka React lengkap dengan notifikasi anomali dan tombol rollback.",
      en: "Built a lightweight metrics agent feeding live server stats into a Laravel API and React dashboard with anomaly alerts and one-click rollbacks.",
    },
    features: {
      id: [
        "Pantauan metrik server langsung (CPU, RAM, Disk I/O, dan trafik jaringan)",
        "Kontrol kontainer Docker (Start, Restart, dan baca log langsung)",
        "Riwayat deployment CI/CD dilengkapi tombol rollback cepat",
        "Notifikasi beban tinggi dan ringkasan aturan firewall tiap server",
      ],
      en: [
        "Live server telemetry (CPU, Memory, Disk I/O, Network)",
        "Docker container actions (Start, Restart, Live Log Stream)",
        "CI/CD deployment history with quick rollback triggers",
        "High-load alerting and per-node firewall rule overview",
      ],
    },
    architectureNotes: {
      id: "Antarmuka React + TypeScript, API dan Queue Worker berbasis Laravel, terhubung ke Docker Engine API dengan penyimpanan histori metrik di PostgreSQL.",
      en: "React + TypeScript frontend, Laravel API & Queue Workers, Docker Engine API integration, and time-indexed metrics stored in PostgreSQL.",
    },
    role: {
      id: "Full-Stack & DevOps",
      en: "Full-Stack & DevOps",
    },
    techStack: ["React", "Laravel", "Docker", "PostgreSQL"],
    stackRoles: [
      {
        name: "React",
        role: {
          id: "Tampilan grafik metrik langsung dan pembaca log kontainer",
          en: "Live telemetry charts and real-time container log viewer",
        },
      },
      {
        name: "Laravel",
        role: {
          id: "API gateway, worker notifikasi gangguan, dan pemicu rollback",
          en: "API gateway, alert queue workers, and rollback execution",
        },
      },
      {
        name: "Docker",
        role: {
          id: "Pengelolaan kontainer langsung melalui Docker Engine API",
          en: "Direct container lifecycle actions via Docker Engine API",
        },
      },
      {
        name: "PostgreSQL",
        role: {
          id: "Menyimpan riwayat metrik server dan catatan aturan firewall",
          en: "Time-indexed metric logs and firewall rule audit records",
        },
      },
    ],
    metrics: [
      { label: { id: "Interval Data", en: "Telemetry" }, value: "500ms" },
      { label: { id: "Jumlah Node", en: "Nodes" }, value: "24 VMs" },
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
      id: "Frontend & Motion",
      en: "Frontend & Motion",
    },
    tone: {
      surface: "#ECEAE3",
      ink: "#0D0D0D",
      muted: "#6F6D66",
    },
    mockupVariant: "kinetix-studio",
    title: "Kinetix Digital",
    tagline: {
      id: "Website profil studio dengan tipografi besar, animasi scroll halus, dan tetap ringan.",
      en: "Studio website built with large typography, smooth scroll motion, and fast load times.",
    },
    summary: {
      id: "Web profil interaktif yang menggabungkan tata letak bersih, transisi halaman halus, dan struktur SSR agar tetap cepat di perangkat mobile.",
      en: "An interactive studio site pairing clean layout and smooth page transitions with SSR structure for fast mobile loads.",
    },
    overview: {
      id: "Kinetix Digital dirancang untuk membuktikan bahwa halaman dengan animasi interaktif dan transisi halaman tidak harus mengorbankan skor performa maupun keterbacaan di Google Search.",
      en: "Kinetix Digital was built to keep rich interactive transitions and smooth scrolling fast on mobile without hurting Core Web Vitals or search indexing.",
    },
    problem: {
      id: "Banyak website portofolio dan agensi memakai animasi berat yang membuat browser terasa patah-patah di HP dan sulit diindeks mesin pencari.",
      en: "Many portfolio and agency websites rely on heavy scripts that lag on mid-range phones and hide content from search crawlers.",
    },
    solution: {
      id: "Memastikan seluruh teks dirender utuh via SSR untuk SEO, lalu membatasi animasi hanya pada properti transform GPU dan menyesuaikan efeknya di layar sentuh.",
      en: "Kept all copy rendered cleanly via SSR for crawlers, limited animations strictly to GPU transforms, and adapted interactions cleanly for touch screens.",
    },
    features: {
      id: [
        "Animasi teks yang bergerak sinkron dengan guliran halaman",
        "Transisi perpindahan halaman yang halus tanpa jeda kasar",
        "Tata letak responsif yang tetap rapi di layar besar maupun kecil",
        "Render SSR ramah SEO dengan skor performa hijau",
      ],
      en: [
        "Scroll-linked text reveals running smoothly at 60 FPS",
        "Fluid page transitions without jarring layout jumps",
        "Responsive editorial layout across desktop and mobile",
        "SEO-friendly SSR markup keeping Core Web Vitals green",
      ],
    },
    architectureNotes: {
      id: "Menggunakan Next.js App Router, Lenis Smooth Scroll, Three.js dengan pause otomatis saat tidak aktif, serta pemuatan font bebas geser (zero-CLS).",
      en: "Built with Next.js App Router, Lenis Smooth Scroll, Three.js with automatic idle pausing, and zero-CLS font loading via next/font.",
    },
    role: {
      id: "Frontend Developer",
      en: "Frontend Developer",
    },
    techStack: ["Next.js", "Three.js", "Lenis", "TypeScript"],
    stackRoles: [
      {
        name: "Next.js",
        role: {
          id: "Pre-rendering halaman SSR penuh dan optimasi font bebas CLS",
          en: "Full SSR pre-rendering and zero-CLS font optimization",
        },
      },
      {
        name: "Three.js",
        role: {
          id: "Elemen visual GPU ringan yang otomatis tidur saat keluar layar",
          en: "Lightweight GPU visuals that sleep automatically off-screen",
        },
      },
      {
        name: "Lenis",
        role: {
          id: "Scroll halus 60–120 FPS tersinkron dengan animasi halaman",
          en: "Smooth 60–120 FPS scrolling synced with page motion",
        },
      },
      {
        name: "TypeScript",
        role: {
          id: "Pengelolaan komponen UI dan state animasi yang terstruktur",
          en: "Structured UI components and typed animation state",
        },
      },
    ],
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
      id: "Aplikasi Keuangan",
      en: "Finance Web App",
    },
    tone: {
      surface: "#E5E5E1",
      ink: "#0D0D0D",
      muted: "#6B6B66",
    },
    mockupVariant: "finpulse-treasury",
    title: "FinPulse Treasury",
    tagline: {
      id: "Aplikasi pencatatan arus kas, invoice otomatis, dan rekonsiliasi pembayaran.",
      en: "Cashflow tracking, automated invoicing, and payment reconciliation app.",
    },
    summary: {
      id: "Aplikasi web keuangan bisnis untuk memantau pemasukan-pengeluaran lintas akun, membuat link tagihan otomatis, dan mengekspor laporan PDF/CSV.",
      en: "A business finance web app for tracking multi-account cashflow, generating payment links, and exporting PDF/CSV reports.",
    },
    overview: {
      id: "FinPulse Treasury dibuat untuk menggantikan pencatatan manual di spreadsheet: setiap invoice yang dibayar langsung terverifikasi otomatis lewat webhook dan tercatat rapi ke buku besar transaksi.",
      en: "FinPulse Treasury replaces manual spreadsheet tracking: paid invoices are verified automatically via webhooks and recorded directly into a clean transaction ledger.",
    },
    problem: {
      id: "Mencocokkan mutasi pembayaran satu per satu di spreadsheet memakan waktu, rawan salah hitung, dan membuat posisi kas sulit dilihat secara real-time.",
      en: "Reconciling payments manually in spreadsheets took hours, invited calculation errors, and hid live cashflow balances.",
    },
    solution: {
      id: "Membangun pencatatan double-entry berbasis transaksi ACID di PostgreSQL, webhook Payment Gateway otomatis, serta fitur filter laporan per periode.",
      en: "Implemented an ACID double-entry ledger in PostgreSQL paired with automated Payment Gateway webhook updates and period reporting.",
    },
    features: {
      id: [
        "Pembuatan invoice dan tautan pembayaran dengan status ter-update otomatis",
        "Buku besar transaksi dengan pencarian cepat dan ekspor PDF/CSV",
        "Ringkasan arus kas bulanan yang mudah difilter per akun",
        "Pengaturan hak akses pengguna untuk admin dan tim keuangan",
      ],
      en: [
        "Automated invoice and payment link generator with live status updates",
        "Searchable audit transaction ledger with PDF/CSV export",
        "Monthly cashflow summaries filterable by account and period",
        "Role-based access controls for admins and finance staff",
      ],
    },
    architectureNotes: {
      id: "Frontend Vue.js, backend Laravel REST API dengan transaction locking di PostgreSQL, dan background worker untuk pengiriman notifikasi tagihan.",
      en: "Vue.js frontend, Laravel REST API with PostgreSQL transaction locking, and queued workers for invoice reminders.",
    },
    role: {
      id: "Full-Stack Web Developer",
      en: "Full-Stack Web Developer",
    },
    techStack: ["Vue.js", "Laravel", "PostgreSQL", "Docker"],
    stackRoles: [
      {
        name: "Vue.js",
        role: {
          id: "Dasbor arus kas, filter transaksi, dan form pembuatan invoice",
          en: "Cashflow dashboard, transaction filters, and invoice builder",
        },
      },
      {
        name: "Laravel",
        role: {
          id: "API pembukuan double-entry, webhook bayar, dan antrean notifikasi",
          en: "Double-entry ledger API, payment webhooks, and queued alerts",
        },
      },
      {
        name: "PostgreSQL",
        role: {
          id: "Penguncian transaksi ACID untuk mencegah selisih pencatatan saldo",
          en: "ACID transaction locking to prevent balance discrepancies",
        },
      },
      {
        name: "Docker",
        role: {
          id: "Lingkungan produksi konsisten untuk API dan worker ekspor laporan",
          en: "Consistent production runtime for API and report export workers",
        },
      },
    ],
    metrics: [
      { label: { id: "Rekonsiliasi", en: "Reconciliation" }, value: "Real-Time" },
      { label: { id: "Integritas", en: "Ledger" }, value: "ACID 100%" },
      { label: { id: "Ekspor", en: "Exports" }, value: "PDF / CSV" },
    ],
    demoUrl: "https://finpulse-demo.danucs.com",
    repoUrl: "https://github.com/DanuCandra",
  },
];
