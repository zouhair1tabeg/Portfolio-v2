export type ProjectCategory = "Mobile" | "Web" | "IoT";

export type Project = {
    slug: string;
    index: string; // "01" to "07"
    title: string;
    category: readonly ProjectCategory[];
    year?: number;
    summary: string;
    highlights: readonly string[];
    stack: readonly string[];
    cover?: string;
    links?: { repo?: string; live?: string };
};

export const PROJECTS: readonly Project[] = [
    {
        slug: "labcollect",
        index: "01",
        title: "LabCollect",
        category: ["Mobile"],
        summary: "Flutter field app that digitizes ONSSA food-safety sampling with GPS and biometric double validation.",
        highlights: [
            "GPS + biometric double validation",
            "Barcode scan, photos, voice dictation and e-signature",
            "Local data persistence",
        ],
        stack: ["Flutter", "Spring Boot", "PostgreSQL", "Redis", "Keycloak", "OIDC / OAuth2"],
        links: { repo: "https://github.com/zouhair1tabeg/LabCollect" },
    },
    {
        slug: "smartbell",
        index: "02",
        title: "SmartBell",
        category: ["IoT", "Web"],
        summary: "IoT school bell system with remote scheduling, instant triggering and an ESP32 hardware clock fallback.",
        highlights: [
            "Weekly scheduling and instant remote trigger",
            "NTP sync with DS3231 RTC fallback",
            "Full history and event logs",
        ],
        stack: ["React", "FastAPI", "MQTT", "ESP32", "Docker", "PostgreSQL"],
        links: { repo: "https://github.com/zouhair1tabeg/Smart-Bell" },
    },
    {
        slug: "focusflow",
        index: "03",
        title: "FocusFlow",
        category: ["Mobile"],
        year: 2025,
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
        slug: "rummy-score",
        index: "04",
        title: "Rummy Score",
        category: ["Mobile"],
        summary: "Flutter scoring companion that applies official Rummy rules, elimination thresholds and game history.",
        highlights: [
            "Official Rummy rules engine",
            "Automatic points and elimination thresholds",
            "Saved game history",
        ],
        stack: ["Flutter", "Dart", "Clean Architecture", "ChangeNotifier", "SharedPreferences", "Unit Testing"],
        links: { repo: "https://github.com/zouhair1tabeg/Rummy-Score" },
    },
    {
        slug: "fitness-tracker",
        index: "05",
        title: "Fitness Tracker",
        category: ["Mobile"],
        year: 2023,
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
        slug: "bazzar",
        index: "06",
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
        index: "07",
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
] as const;
