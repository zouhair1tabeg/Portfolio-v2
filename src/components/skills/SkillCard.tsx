import type { CSSProperties, PointerEvent } from "react";
import {
    Globe,
    Layers,
    Monitor,
    Server,
    ShoppingCart,
    Smartphone,
    Terminal,
    Workflow,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { SkillCategory } from "@/data/skills";
import SkillChip from "@/components/skills/SkillChip";

const ICONS: Record<SkillCategory["icon"], LucideIcon> = {
    Smartphone,
    Globe,
    Server,
    ShoppingCart,
    Workflow,
    Terminal,
    Monitor,
    Layers,
};

/** 12-column desktop grid: 6/6, then 4/4/4 rows with no gaps. */
const SIZE_CLASS: Record<SkillCategory["size"], string> = {
    lg: "lg:col-span-6",
    md: "lg:col-span-4",
    sm: "lg:col-span-4",
};

export default function SkillCard({ category }: { category: SkillCategory }) {
    const Icon = ICONS[category.icon];

    // The halo follows the pointer through CSS variables: no React re-render.
    const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    return (
        <div className={cn("skill-card h-full", SIZE_CLASS[category.size])}>
            <article
                onPointerMove={handlePointerMove}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-soft/90 p-6 transition-[translate,border-color,background-color] duration-500 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-ink-soft motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-7"
                style={{ "--mx": "50%", "--my": "50%" } as CSSProperties}
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
                    style={{
                        background:
                            "radial-gradient(340px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 13%, transparent), transparent 65%)",
                    }}
                />

                <div className="relative z-10 flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                        <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-accent">
                            <Icon size={20} aria-hidden="true" />
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.3em] text-white/35">
                            {category.index}
                        </span>
                    </div>

                    <h3 className="font-hero text-lg font-bold uppercase leading-tight tracking-tight text-white/90 md:text-xl">
                        {category.title}
                    </h3>

                    {category.variant === "tags" ? (
                        <ul className="flex flex-wrap gap-2">
                            {category.items.map((item) => (
                                <SkillChip key={item.name} item={item} />
                            ))}
                        </ul>
                    ) : (
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/80">
                                Domain expertise
                            </p>
                            <ul className="mt-4 space-y-2.5">
                                {category.items.map((item) => (
                                    <li
                                        key={item.name}
                                        className="skill-item flex items-start gap-2.5 text-sm leading-snug text-white/70"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                                        />
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
