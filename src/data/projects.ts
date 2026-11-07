export type ProjectCategory = "Mobile" | "Web" | "IoT";

export type Project = {
    slug: string;
    index: string; // "01" to "07"
    title: string;
    subtitle?: string;
    category: readonly ProjectCategory[];
    year?: number;
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

export const PROJECTS: readonly Project[] = [
    {
        slug: "labcollect",
        index: "01",
        title: "LabCollect",
        subtitle: "Paperless field sampling for food-safety quality control",
        category: ["Mobile"],
        summary: "Flutter field app that digitizes ONSSA food-safety sampling with GPS and biometric double validation.",
        highlights: [
            "GPS + biometric double validation",
            "Barcode scan, photos, voice dictation and e-signature",
            "Local data persistence",
        ],
        stack: ["Flutter", "Spring Boot", "PostgreSQL", "Redis", "Keycloak", "OIDC / OAuth2"],
        links: { repo: "https://github.com/zouhair1tabeg/LabCollect" },
        caseStudy: {
            context: "LabCollect is part of the digital transformation of quality control and food-safety processes under ONSSA standards. It digitizes and secures the entire on-site sampling process, replacing traditional paper forms that are vulnerable to errors and disputes.",
            solution: "The Flutter field app guides samplers step by step and enforces a double validation: geolocation (GPS) and biometrics. It also provides barcode scanning to identify sample bottles, multimedia evidence capture (compressed photos, speech-to-text dictation and digital signature) and local data persistence.",
            features: [
                { title: "Step-by-step guidance", description: "Guides samplers through each stage of the on-site sampling process." },
                { title: "Double validation", description: "Geolocation (GPS) and biometric checks secure every sampling." },
                { title: "Barcode scanning", description: "Identifies sample bottles by scanning their barcodes." },
                { title: "Multimedia evidence", description: "Compressed photos, speech-to-text dictation and digital signature." },
                { title: "Local persistence", description: "Sampling data is persisted locally on the device." },
            ],
            architecture: "The system relies on a robust Spring Boot API, cached with Redis, stored in PostgreSQL and secured with the OIDC/OAuth2 protocol through Keycloak.",
            stackGroups: [
                { label: "Mobile", items: ["Flutter"] },
                { label: "Backend", items: ["Spring Boot", "Redis", "PostgreSQL"] },
                { label: "Security", items: ["Keycloak", "OIDC / OAuth2"] },
            ],
        },
    },
    {
        slug: "smartbell",
        index: "02",
        title: "SmartBell",
        subtitle: "Connected smart bell system",
        category: ["IoT", "Web"],
        summary: "IoT school bell system with remote scheduling, instant triggering and an ESP32 hardware clock fallback.",
        highlights: [
            "Weekly scheduling and instant remote trigger",
            "NTP sync with DS3231 RTC fallback",
            "Full history and event logs",
        ],
        stack: ["React", "FastAPI", "MQTT", "ESP32", "Docker", "PostgreSQL"],
        links: { repo: "https://github.com/zouhair1tabeg/Smart-Bell" },
        caseStudy: {
            context: "Bell management in schools often relies on rigid hardware timers that are hard to adjust and offer no central monitoring. SmartBell modernizes this process with a reliable, remotely controllable, connected IoT architecture.",
            solution: "A web interface to manage schedules, a FastAPI backend that publishes commands over MQTT, and an ESP32 firmware that rings the bell through a relay, with a hardware clock as safety net.",
            features: [
                { title: "Scheduling & automation", description: "Define timetables and weekly recurrences through a user-friendly interface." },
                { title: "Real-time triggering", description: "Instant manual remote control for alerts, emergencies and special events." },
                { title: "High availability & sync", description: "NTP time synchronization with a hardware RTC (DS3231) fallback on ESP32 when the network is lost." },
                { title: "Monitoring & traceability", description: "Complete history of bell rings and system events (logs)." },
            ],
            stackGroups: [
                { label: "Frontend", items: ["React", "Vite", "Tailwind CSS", "Axios"] },
                { label: "Backend", items: ["Python", "FastAPI", "SQLAlchemy", "MQTT (Mosquitto)"] },
                { label: "Firmware / Hardware", items: ["ESP32", "C++ / Arduino", "DS3231 RTC module", "5V relay"] },
                { label: "Data & Deployment", items: ["SQLite / PostgreSQL", "Docker"] },
            ],
        },
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
        subtitle: "Mobile companion & scoring engine",
        category: ["Mobile"],
        summary: "Flutter scoring companion that applies official Rummy rules, elimination thresholds and game history.",
        highlights: [
            "Official Rummy rules engine",
            "Automatic points and elimination thresholds",
            "Saved game history",
        ],
        stack: ["Flutter", "Dart", "Clean Architecture", "ChangeNotifier", "SharedPreferences", "Unit Testing"],
        links: { repo: "https://github.com/zouhair1tabeg/Rummy-Score" },
        caseStudy: {
            context: "Keeping scores by hand during card games is a headache. Rummy Score removes it and keeps the game flowing.",
            solution: "Built for a smooth experience among friends, the app rigorously applies the official Rummy rules, with automatic point calculation, elimination threshold management and saved game history.",
            features: [
                { title: "Official rules", description: "Applies the official Rummy rules rigorously." },
                { title: "Automatic scoring", description: "Points are calculated automatically after every round." },
                { title: "Elimination thresholds", description: "Player elimination is handled automatically." },
                { title: "Game history", description: "Past games are saved and available at any time." },
            ],
            stackGroups: [
                { label: "Framework", items: ["Flutter", "Dart"] },
                { label: "Architecture & state", items: ["Clean Architecture", "ChangeNotifier"] },
                { label: "Storage", items: ["SharedPreferences"] },
                { label: "Quality", items: ["Unit Testing"] },
            ],
        },
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

/** Projects with a full case study, in display order. */
export type CaseStudyProject = Project & {
    caseStudy: NonNullable<Project["caseStudy"]>;
};

export const CASE_STUDY_PROJECTS: readonly CaseStudyProject[] = PROJECTS.filter(
    (project): project is CaseStudyProject => Boolean(project.caseStudy),
);

export function getProject(slug: string): Project | undefined {
    return PROJECTS.find((project) => project.slug === slug);
}
