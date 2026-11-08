"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PROJECTS } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilters, {
    type ProjectFilter,
} from "@/components/projects/ProjectFilters";

const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);
const HIDDEN_COUNT = PROJECTS.length - FEATURED_PROJECTS.length;

const COUNTS: Record<ProjectFilter, number> = {
    All: PROJECTS.length,
    Mobile: PROJECTS.filter((project) => project.category.includes("Mobile")).length,
    Web: PROJECTS.filter((project) => project.category.includes("Web")).length,
    IoT: PROJECTS.filter((project) => project.category.includes("IoT")).length,
};

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const previousFilter = useRef<ProjectFilter>("All");
    const previousSlugs = useRef<Set<string> | null>(null);
    const [filter, setFilter] = useState<ProjectFilter>("All");
    const [showAll, setShowAll] = useState(false);
    const reduced = usePrefersReducedMotion();

    const visible =
        filter === "All"
            ? showAll
                ? PROJECTS
                : FEATURED_PROJECTS
            : PROJECTS.filter((project) => project.category.includes(filter));
    const projectLabel = `${String(visible.length).padStart(2, "0")} ${
        visible.length === 1 ? "project" : "projects"
    }`;

    // Scroll entrance, once per card, transform/opacity only.
    useEffect(() => {
        if (reduced) return;

        const ctx = gsap.context(() => {
            gsap.from(".project-card", {
                y: 32,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [reduced]);

    // Filter / "show all" transition: fade only the cards that just appeared.
    useEffect(() => {
        const nodes = Array.from(
            gridRef.current?.querySelectorAll<HTMLElement>(".project-card") ?? [],
        );
        const currentSlugs = new Set(
            nodes.map((node) => node.dataset.projectSlug ?? ""),
        );
        const previous = previousSlugs.current;

        if (previous) {
            const filterChanged = previousFilter.current !== filter;
            const targets = filterChanged
                ? nodes
                : nodes.filter(
                      (node) => !previous.has(node.dataset.projectSlug ?? ""),
                  );

            if (!reduced && targets.length) {
                gsap.fromTo(
                    targets,
                    { y: 12, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.35,
                        stagger: 0.05,
                        ease: "power2.out",
                        overwrite: true,
                    },
                );
            }

            ScrollTrigger.refresh();
        }

        previousSlugs.current = currentSlugs;
        previousFilter.current = filter;
    }, [filter, showAll, reduced]);

    return (
        <section
            ref={sectionRef}
            id="projects"
            aria-labelledby="projects-title"
            className="relative overflow-hidden bg-ink py-28 text-white md:py-36"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        background:
                            "radial-gradient(ellipse at 50% 42%, color-mix(in srgb, var(--accent) 38%, transparent) 0%, transparent 62%)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                        backgroundSize: "72px 72px",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
                <header className="mb-10 md:mb-14">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                        <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse"
                        />
                        Selected Works
                    </span>

                    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
                        <h2
                            id="projects-title"
                            className="font-hero text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white text-balance sm:text-6xl md:text-7xl"
                        >
                            Featured Projects
                        </h2>
                        <p
                            aria-live="polite"
                            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45"
                        >
                            {projectLabel}
                        </p>
                    </div>

                    <div className="mt-8">
                        <ProjectFilters
                            value={filter}
                            counts={COUNTS}
                            onChange={setFilter}
                        />
                    </div>
                </header>

                <div
                    ref={gridRef}
                    id="projects-grid"
                    className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:grid-cols-3"
                >
                    {visible.map((project, index) => (
                        <ProjectCard
                            key={project.slug}
                            project={project}
                            priority={index === 0}
                        />
                    ))}
                </div>

                {filter === "All" && HIDDEN_COUNT > 0 ? (
                    <div className="mt-10 flex justify-center md:mt-12">
                        <button
                            type="button"
                            onClick={() => setShowAll((value) => !value)}
                            aria-expanded={showAll}
                            aria-controls="projects-grid"
                            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-white/15 px-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                        >
                            {showAll
                                ? "Show fewer"
                                : `Show all projects (${PROJECTS.length})`}
                            <ChevronDown
                                aria-hidden="true"
                                size={15}
                                className={`transition-transform duration-300 motion-reduce:transition-none ${
                                    showAll ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
