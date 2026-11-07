export type SkillItem = { name: string; children?: readonly string[] };

export type SkillCategory = {
  id: string;
  index: string; // "01" to "08"
  title: string;
  icon: "Smartphone" | "Globe" | "Server" | "ShoppingCart" | "Workflow" | "Terminal" | "Monitor" | "Layers";
  variant: "tags" | "list"; // "list" = domain expertise, not technologies
  size: "lg" | "md" | "sm"; // visual weight in the grid
  items: readonly SkillItem[];
};

export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    id: "mobile", index: "01", title: "Mobile Development", icon: "Smartphone", variant: "tags", size: "lg",
    items: [
      { name: "Flutter" }, { name: "Dart" },
      { name: "Android" },
      { name: "iOS" },
      { name: "WidgetKit" }, { name: "CloudKit" }, { name: "MVC" }, { name: "MVVM" },
    ]
  },
  {
    id: "web", index: "02", title: "Web Development", icon: "Globe", variant: "tags", size: "lg",
    items: [
      { name: "HTML5" }, { name: "CSS3" }, { name: "JavaScript" }, { name: "React.js" },
      { name: "PHP" }, { name: "Laravel" }, { name: "Bootstrap" }, { name: "jQuery" },
    ]
  },
  {
    id: "backend", index: "03", title: "Backend & Databases", icon: "Server", variant: "tags", size: "md",
    items: [
      { name: "Java" },
      { name: "Firebase" },
      { name: "Supabase" },
      { name: "MySQL" }, { name: "SQLite" }, { name: "PostgreSQL" },
      { name: "Python" },
    ]
  },
  {
    id: "cms", index: "04", title: "CMS & E-commerce", icon: "ShoppingCart", variant: "tags", size: "md",
    items: [
      { name: "WordPress" }, { name: "Elementor" }, { name: "WooCommerce" },
      { name: "Hostinger Website Builder" }, { name: "Theme Customization" },
    ]
  },
  {
    id: "erp", index: "05", title: "ERP & Business Logic", icon: "Workflow", variant: "list", size: "md",
    items: [
      { name: "Production Workflow Management" }, { name: "Purchase Requests" },
      { name: "Business Logic" }, { name: "Hospitality & Agri-food Industry Processes" },
    ]
  },
  {
    id: "devops", index: "06", title: "DevOps & Development Tools", icon: "Terminal", variant: "tags", size: "md",
    items: [
      { name: "Docker" }, { name: "Git" }, { name: "GitHub" }, { name: "Bash" },
      { name: "Zsh" }, { name: "VS Code" }, { name: "Xcode" }, { name: "Android Studio" },
    ]
  },
  {
    id: "os", index: "07", title: "Operating Systems & Environments", icon: "Monitor", variant: "tags", size: "sm",
    items: [
      { name: "macOS" },
      { name: "Linux" },
      { name: "Windows" },
    ]
  },
  {
    id: "architecture", index: "08", title: "Software Architecture", icon: "Layers", variant: "tags", size: "sm",
    items: [
      { name: "MVC" }, { name: "MVVM" }, { name: "Application Architecture" },
      { name: "API Integration" }, { name: "Database Design" },
    ]
  },
] as const;
