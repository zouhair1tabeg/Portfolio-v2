export type Service = {
  id: string;
  index: string; // "01" to "04"
  title: string;
  summary: string;
  deliverables: readonly string[];
  stack: readonly string[];
  icon: "Globe" | "Smartphone" | "ShoppingCart" | "Server";
};

export const SERVICES: readonly Service[] = [
  {
    id: "web", index: "01", title: "Web Development", icon: "Globe",
    summary: "Fast, responsive websites and web applications built with clean, maintainable code.",
    deliverables: [
      "Responsive websites and landing pages",
      "Custom web applications and dashboards",
      "Pixel-accurate UI implementation",
      "Performance and SEO best practices",
    ],
    stack: ["HTML5", "CSS3", "JavaScript", "React.js", "PHP", "Laravel"],
  },
  {
    id: "mobile", index: "02", title: "Mobile App Development", icon: "Smartphone",
    summary: "Native and cross-platform apps for Android and iOS, from the first idea to a release-ready product.",
    deliverables: [
      "Cross-platform apps with Flutter",
      "Native Android (Kotlin) and iOS (Swift, SwiftUI) apps",
      "Home screen widgets and cloud sync (WidgetKit, CloudKit)",
      "Backend integration with Firebase or Supabase",
    ],
    stack: ["Flutter", "Dart", "Kotlin", "Swift", "SwiftUI", "Firebase"],
  },
  {
    id: "wordpress", index: "03", title: "WordPress & E-commerce", icon: "ShoppingCart",
    summary: "Business websites and online stores that look great and that you can manage on your own.",
    deliverables: [
      "Custom WordPress websites with Elementor",
      "WooCommerce store setup and product management",
      "Theme customization and design adjustments",
      "Hosting setup and site launch",
    ],
    stack: ["WordPress", "Elementor", "WooCommerce", "Theme Customization", "Hostinger"],
  },
  {
    id: "backend", index: "04", title: "Backend & API Development", icon: "Server",
    summary: "Secure, reliable backends and APIs that power your web and mobile products.",
    deliverables: [
      "REST APIs with Python (FastAPI)",
      "Authentication and user management",
      "Database design and optimization",
      "Third-party API integration, real-time features and cloud functions",
    ],
    stack: ["Python", "FastAPI", "Firebase", "Supabase", "PostgreSQL", "MySQL"],
  },
] as const;
