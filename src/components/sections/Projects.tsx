"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PROJECTS } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilters, {
    type ProjectFilter,
} from "@/components/projects/ProjectFilters";

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
    const [filter, setFilter] = useState<ProjectFilter>("All");
    const reduced = usePrefersReducedMotion();

    const visible =
        filter === "All"
            ? PROJECTS
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

    // Filter transition: fade + translateY, then recompute pinned positions.
    useEffect(() => {
        if (previousFilter.current === filter) return;
        previousFilter.current = filter;

        if (!reduced) {
            gsap.fromTo(
                ".project-card",
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
    }, [filter, reduced]);

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
            </div>
        </section>
    );
}
