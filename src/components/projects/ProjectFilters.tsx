import { cn } from "@/lib/cn";

export const FILTERS = ["All", "Mobile", "Web", "IoT"] as const;
export type ProjectFilter = (typeof FILTERS)[number];

export default function ProjectFilters({
    value,
    counts,
    onChange,
}: {
    value: ProjectFilter;
    counts: Record<ProjectFilter, number>;
    onChange: (filter: ProjectFilter) => void;
}) {
    return (
        <div
            role="group"
            aria-label="Filter projects by category"
            className="flex flex-wrap items-center gap-2"
        >
            {FILTERS.map((filter) => {
                const active = filter === value;

                return (
                    <button
                        key={filter}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(filter)}
                        className={cn(
                            "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
                            active
                                ? "border-accent bg-accent text-ink"
                                : "border-white/10 text-white/55 hover:border-accent/40 hover:text-white",
                        )}
                    >
                        {filter}
                        <span className={cn("text-[9px]", active ? "text-ink/60" : "text-white/30")}>
                            {counts[filter]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
