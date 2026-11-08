"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLenis } from "@studio-freight/react-lenis";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { CaseStudyProject, Project } from "@/data/projects";
import CategoryBadges from "@/components/projects/CategoryBadges";
import CaseStudyFooter from "@/components/projects/CaseStudyFooter";
import ProjectCover from "@/components/projects/ProjectCover";
import StackChips from "@/components/projects/StackChips";

export default function CaseStudy({
    project,
    previous,
    next,
}: {
    project: CaseStudyProject;
    previous: Project | null;
    next: Project | null;
}) {
    const rootRef = useRef<HTMLElement>(null);
    const reduced = usePrefersReducedMotion();
    const lenis = useLenis();
    const study = project.caseStudy;

    // Always land at the top of a freshly opened case study.
    useEffect(() => {
        lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
    }, [lenis]);

    useEffect(() => {
        if (reduced) return;

        const ctx = gsap.context(() => {
            gsap.from(".case-reveal", {
                y: 24,
                opacity: 0,
                duration: 0.7,
                stagger: 0.05,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top 88%",
                    once: true,
                },
            });
        }, rootRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <main id="main-content" ref={rootRef} className="relative bg-ink text-white">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        background:
                            "radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 55%)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
            </div>

            <article className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-28 pb-24 md:px-8 md:pt-36 md:pb-32">
                <Link
                    href="/#projects"
                    className="case-reveal inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/50 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                    <ArrowLeft aria-hidden="true" size={14} />
                    Back to projects
                </Link>

                <header className="mt-10">
                    <div className="case-reveal">
                        <CategoryBadges categories={project.category} />
                    </div>

                    <h1 className="case-reveal mt-5 max-w-3xl font-hero text-5xl font-black uppercase leading-[0.92] tracking-tighter text-white text-balance md:text-7xl">
                        {project.title}
                        {project.nativeTitle ? (
                            <span
                                lang="ar"
                                dir="rtl"
                                className="ms-3 inline-block align-middle font-arabic text-[0.45em] font-medium normal-case tracking-normal text-white/60 md:ms-5"
                            >
                                {project.nativeTitle}
                            </span>
                        ) : null}
                    </h1>

                    {project.subtitle ? (
                        <p className="case-reveal mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                            {project.subtitle}
                        </p>
                    ) : null}

                    <div className="case-reveal mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                        {project.year ? <span>{project.year}</span> : null}
                        {project.links?.live ? (
                            <a
                                href={project.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center gap-1.5 text-accent transition-colors hover:text-white"
                            >
                                Live project
                                <ArrowUpRight aria-hidden="true" size={13} />
                            </a>
                        ) : null}
                        {project.links?.repo ? (
                            <a
                                href={project.links.repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center gap-1.5 text-accent transition-colors hover:text-white"
                            >
                                <Github aria-hidden="true" size={13} />
                                Source code
                            </a>
                        ) : null}
                    </div>
                </header>

                <div className="case-reveal mt-12 overflow-hidden rounded-3xl border border-white/10 md:mt-16">
                    <ProjectCover project={project} priority sizes="(max-width: 1024px) 100vw, 960px" />
                </div>

                <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-12">
                    <section className="case-reveal">
                        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                            Context
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-white/70">
                            {study.context}
                        </p>
                    </section>

                    <section className="case-reveal">
                        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                            Solution
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-white/70">
                            {study.solution}
                        </p>
                    </section>
                </div>

                {study.features?.length ? (
                    <section className="mt-16 md:mt-24">
                        <h2 className="case-reveal font-hero text-3xl font-bold tracking-tight text-white md:text-4xl">
                            Key features
                        </h2>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {study.features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="case-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
                                >
                                    <h3 className="font-hero text-lg font-bold text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}

                {study.architecture ? (
                    <section className="case-reveal mt-16 md:mt-24">
                        <h2 className="font-hero text-3xl font-bold tracking-tight text-white md:text-4xl">
                            Architecture
                        </h2>
                        <blockquote className="mt-6 border-l-2 border-accent bg-white/[0.03] px-6 py-5 text-base leading-relaxed text-white/70">
                            {study.architecture}
                        </blockquote>
                    </section>
                ) : null}

                {study.stackGroups?.length ? (
                    <section className="case-reveal mt-16 md:mt-24">
                        <h2 className="font-hero text-3xl font-bold tracking-tight text-white md:text-4xl">
                            Tech stack
                        </h2>
                        <div className="mt-8 space-y-6">
                            {study.stackGroups.map((group) => (
                                <div key={group.label}>
                                    <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                                        {group.label}
                                    </h3>
                                    <div className="mt-3">
                                        <StackChips items={group.items} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}

                <CaseStudyFooter previous={previous} next={next} />
            </article>
        </main>
    );
}
