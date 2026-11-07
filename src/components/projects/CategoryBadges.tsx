import type { ProjectCategory } from "@/data/projects";

export default function CategoryBadges({
    categories,
}: {
    categories: readonly ProjectCategory[];
}) {
    return (
        <ul className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
                <li
                    key={category}
                    className="rounded-full border border-white/15 bg-ink/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm"
                >
                    {category}
                </li>
            ))}
        </ul>
    );
}
