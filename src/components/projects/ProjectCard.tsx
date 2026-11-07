"use client";

import type { CSSProperties, PointerEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Project } from "@/data/projects";
import CategoryBadges from "@/components/projects/CategoryBadges";
import ProjectCover from "@/components/projects/ProjectCover";
import StackChips from "@/components/projects/StackChips";

export default function ProjectCard({
    project,
    priority = false,
}: {
    project: Project;
    priority?: boolean;
}) {
    const clickable = Boolean(project.links?.repo);

    const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    return (
        <article
            onPointerMove={handlePointerMove}
            data-cursor={clickable ? "view" : undefined}
            style={{ "--mx": "50%", "--my": "50%" } as CSSProperties}
            className="project-card group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-soft/90 transition-[border-color,background-color] duration-500 hover:border-accent/40 hover:bg-ink-soft"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
                style={{
                    background:
                        "radial-gradient(380px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%)",
                }}
            />

            <div className="relative">
                <ProjectCover project={project} priority={priority} />

                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-ink/85 via-ink/30 to-transparent p-4">
                    <CategoryBadges categories={project.category} />

                    <div className="flex shrink-0 flex-col items-end gap-1 font-mono text-[10px] leading-none">
                        <span className="tracking-[0.3em] text-white/75">{project.index}</span>
                        {project.year ? (
                            <span className="tracking-[0.2em] text-white/40">{project.year}</span>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="font-hero text-xl font-bold tracking-tight text-white md:text-2xl">
                    {project.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
                    {project.summary}
                </p>

                <ul className="mt-4 space-y-1.5">
                    {project.highlights.map((highlight) => (
                        <li
                            key={highlight}
                            className="flex items-start gap-2 text-xs leading-snug text-white/70"
                        >
                            <Check
                                aria-hidden="true"
                                size={13}
                                className="mt-0.5 shrink-0 text-accent"
                            />
                            {highlight}
                        </li>
                    ))}
                </ul>

                <div className="mt-5">
                    <StackChips items={project.stack} limit={4} />
                </div>

                <div className="mt-auto flex items-center gap-3 pt-6">
                    {project.links?.repo ? (
                        <a
                            href={project.links.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/cta inline-flex min-h-11 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 transition-colors duration-300 hover:text-accent after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-accent"
                        >
                            View on GitHub
                            <ArrowUpRight
                                aria-hidden="true"
                                size={15}
                                className="transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 motion-reduce:transition-none"
                            />
                        </a>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
