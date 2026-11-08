export type ProjectCategory = "Mobile" | "Web" | "IoT";

export type Project = {
    slug: string;
    index: string; // Computed from the array position, never authored.
    title: string;
    nativeTitle?: string; // Original-alphabet title, rendered next to `title`.
    subtitle?: string;
    category: readonly ProjectCategory[];
    year?: number;
    featured?: boolean; // Shown before the visitor asks for all projects.
    summary: string;
    highlights: readonly string[];
    stack: readonly string[];
    cover?: string;
    links?: { repo?: string; live?: string };
    caseStudy?: {
        context: string;
        solution: string;
        features?: readonly { title: string; description: string }[];
        architecture?: string;
        stackGroups?: readonly { label: string; items: readonly string[] }[];
    };
};

type ProjectInput = Omit<Project, "index">;

const PROJECT_INPUT: readonly ProjectInput[] = [
    {
        slug: "labcollect",
        title: "LabCollect",
        category: ["Mobile"],
        featured: true,
        summary: "Flutter field app that digitizes ONSSA food-safety sampling with GPS and biometric double validation.",
        highlights: [
            "GPS + biometric double validation",
            "Barcode scan, photos, voice dictation and e-signature",
            "Local data persistence",
        ],
        stack: ["Flutter", "Spring Boot", "PostgreSQL", "Redis", "Keycloak", "OIDC / OAuth2"],
        cover: "/images/projects/labcollect.webp",
        links: { repo: "https://github.com/zouhair1tabeg/LabCollect" },
    },
    {
        slug: "smartbell",
        title: "SmartBell",
        category: ["IoT", "Web"],
        featured: true,
        summary: "IoT school bell system with remote scheduling, instant triggering and an ESP32 hardware clock fallback.",
        highlights: [
            "Weekly scheduling and instant remote trigger",
            "NTP sync with DS3231 RTC fallback",
            "Full history and event logs",
        ],
        stack: ["React", "FastAPI", "MQTT", "ESP32", "Docker", "PostgreSQL"],
        cover: "/images/projects/smartbell.webp",
        links: { repo: "https://github.com/zouhair1tabeg/Smart-Bell" },
    },
    {
        slug: "finak",
        title: "Finak",
        nativeTitle: "فينك",
        subtitle: "Real-time location sharing",
        category: ["Mobile"],
        featured: true,
        summary: "Native iOS app to share your live location with loved ones on an interactive map, optimized for battery life.",
        highlights: [
            "Interactive MapKit map with dynamic camera",
            "Battery-friendly GPS tracking (10 m threshold)",
            "Real-time cloud sync with secure authentication",
        ],
        stack: ["Swift", "SwiftUI", "MapKit", "CoreLocation", "Supabase", "MVVM"],
        cover: "/images/projects/finak.webp",
        caseStudy: {
            context: "A native iOS app that lets close ones share their geographic position and find each other in real time on an interactive map.",
            solution: "The project emphasizes battery savings through optimized GPS tracking, instant cloud synchronization and a modern Dark Theme / Glassmorphism interface.",
            features: [
                { title: "Interactive mapping", description: "MapKit view with a dynamic camera and custom markers." },
                { title: "Battery-friendly GPS", description: "CoreLocation tracking calibrated with a 10 m movement threshold to preserve battery." },
                { title: "Real-time & cloud", description: "Asynchronous synchronization of GPS coordinates and profile management." },
                { title: "Security", description: "Complete email and password authentication with session persistence." },
            ],
            architecture: "Clean, reactive MVVM built for iOS 17+ with @Observable and Swift Concurrency (async/await), plus UIKit interop (UIViewRepresentable) for blur effects.",
            stackGroups: [
                { label: "Mobile", items: ["Swift", "SwiftUI", "iOS 17+", "@Observable", "Swift Concurrency (async/await)"] },
                { label: "Maps & sensors", items: ["MapKit", "CoreLocation"] },
                { label: "Backend & database", items: ["Supabase (PostgreSQL)", "Supabase Auth"] },
                { label: "Architecture & UI", items: ["Clean MVVM", "UIKit interop (UIViewRepresentable)"] },
            ],
        },
    },
    {
        slug: "focusflow",
        title: "FocusFlow",
        category: ["Mobile"],
        year: 2025,
        featured: true,
        summary: "All-in-one productivity app balancing daily tasks with integrated prayer times.",
        highlights: [
            "Daily task management",
            "Integrated prayer times",
            "Native iOS with SwiftUI and CloudKit",
        ],
        stack: ["Swift", "SwiftUI", "CloudKit"],
        cover: "/images/projects/focusflow.png",
        links: { repo: "https://github.com/zouhair1tabeg/Focus-Flow" },
    },
    {
        slug: "electronics-store-pos",
        title: "Electronics Store POS",
        subtitle: "Point of sale for electronics retailers",
        category: ["Mobile"],
        featured: true,
        summary: "Flutter POS app with an offline-first catalog, Firebase authentication, inventory management and sales history.",
        highlights: [
            "Offline-first product catalog (Hive)",
            "Secure authentication and route protection",
            "Checkout with detailed invoice history",
        ],
        stack: ["Flutter", "Firebase", "Bloc / Cubit", "Clean Architecture", "Hive", "GetIt"],
        cover: "/images/projects/electronics-store-pos.webp",
        caseStudy: {
            context: "A modern Point of Sale (POS) application for electronics retailers, built with Flutter, Firebase and Clean Architecture.",
            solution: "The app is delivered in four phases: core sales, security, administration and sales history.",
            features: [
                { title: "Core sales", description: "Visual product grid with images, a cart with real-time totals, offline-first product caching with Hive, and a Seed Data button to populate dummy products." },
                { title: "Security", description: "Secure login and registration with Firebase Auth, and automatic redirection of unauthenticated users." },
                { title: "Administration", description: "Merchants add new products directly from the app, with image upload by taking a photo or picking from the gallery (Firebase Storage)." },
                { title: "Sales history", description: "Checkout to process sales transactions and detailed invoices of past sales." },
            ],
            architecture: "Clean Architecture split into Presentation, Domain and Data layers, with Bloc / Cubit for state management and GetIt for dependency injection.",
            stackGroups: [
                { label: "Framework", items: ["Flutter", "Dart"] },
                { label: "Backend", items: ["Firebase Auth", "Firestore", "Firebase Storage"] },
                { label: "State management", items: ["Bloc / Cubit"] },
                { label: "Architecture", items: ["Clean Architecture", "GetIt (dependency injection)"] },
                { label: "Local storage", items: ["Hive"] },
            ],
        },
    },
    {
        slug: "fitness-tracker",
        title: "Fitness Tracker",
        category: ["Mobile"],
        year: 2023,
        featured: true,
        summary: "Real-time health monitoring with Google Fit integration.",
        highlights: [
            "Real-time health monitoring",
            "Google Fit integration",
            "Flutter, Firebase and HealthKit stack",
        ],
        stack: ["Flutter", "Firebase", "HealthKit"],
        cover: "/images/projects/fitness.png",
        links: { repo: "https://github.com/zouhair1tabeg/Fitness_Tracker" },
    },
    {
        slug: "rummy-score",
        title: "Rummy Score",
        category: ["Mobile"],
        summary: "Flutter scoring companion that applies official Rummy rules, elimination thresholds and game history.",
        highlights: [
            "Official Rummy rules engine",
            "Automatic points and elimination thresholds",
            "Saved game history",
        ],
        stack: ["Flutter", "Dart", "Clean Architecture", "ChangeNotifier", "SharedPreferences", "Unit Testing"],
        cover: "/images/projects/rummy-score.webp",
        links: { repo: "https://github.com/zouhair1tabeg/Rummy-Score" },
    },
    {
        slug: "bazzar",
        title: "Bazzar",
        category: ["Web"],
        year: 2024,
        summary: "Modern E-commerce platform built for scale.",
        highlights: [
            "Full-stack e-commerce platform",
            "PHP and MySQL backend",
            "JavaScript-driven storefront",
        ],
        stack: ["PHP", "MySQL", "JavaScript"],
        cover: "/images/projects/bazaar.png",
        links: { repo: "https://github.com/zouhair1tabeg/PHP/tree/master/Bazar" },
    },
    {
        slug: "portfolio-v1",
        title: "Portfolio V1",
        category: ["Web"],
        year: 2023,
        summary: "Previous iteration focusing on minimalism.",
        highlights: [
            "Minimalist design direction",
            "Built with HTML and CSS",
            "GSAP-powered interactions",
        ],
        stack: ["HTML", "CSS", "GSAP"],
        cover: "/images/projects/portfolio-v1.png",
        links: { repo: "https://github.com/zouhair1tabeg/Zouhair-Portfolio" },
    },
];

export const PROJECTS: readonly Project[] = PROJECT_INPUT.map((project, position) => ({
    ...project,
    index: String(position + 1).padStart(2, "0"),
}));
