"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";


const projects = [
    {
        title: "Bazzar",
        category: "Full-Stack • E-commerce",
        description: "Modern E-commerce platform built for scale.",
        tags: ["PHP", "MySQL", "JavaScript"],
        year: "2024",
        link: "https://github.com/zouhair1tabeg",
        image: "/images/projects/bazaar.png"
    },
    {
        title: "Fitness Tracker",
        category: "Mobile App • Health",
        description: "Real-time health monitoring with Google Fit integration.",
        tags: ["Flutter", "Firebase", "HealthKit"],
        year: "2023",
        link: "https://github.com/zouhair1tabeg",
        image: "/images/projects/fitness.png"
    },
    {
        title: "FocusFlow",
        category: "iOS • Productivity",
        description: "All-in-one productivity app balancing daily tasks with integrated prayer times.",
        tags: ["Swift", "SwiftUI", "CloudKit"],
        year: "2025",
        link: "https://github.com/zouhair1tabeg/Focus-Flow",
        image: "/images/projects/focusflow.png"
    },
    {
        title: "Portfolio V1",
        category: "Design • Identity",
        description: "Previous iteration focusing on minimalism.",
        tags: ["HTML", "CSS", "GSAP"],
        year: "2023",
        link: "https://github.com/zouhair1tabeg",
        image: "/images/projects/portfolio-v1.png"
    },
];

export default function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const track = trackRef.current;
            if (!track) return;

            // Total width to scroll: (track width - viewport width)
            const scrollWidth = track.scrollWidth - window.innerWidth;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${scrollWidth + 1000}`, // Scroll distance
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            tl.to(track, {
                x: -scrollWidth,
                ease: "none",
            });

            // Parallax effects on cards
            gsap.utils.toArray<HTMLElement>(".project-card-inner").forEach((card) => {
                gsap.to(card, {
                    backgroundPosition: "100% 50%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: tl,
                        start: "left right",
                        end: "right left",
                        scrub: true,
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            id="projects"
            className="relative isolate min-h-screen bg-ink overflow-hidden text-white"
        >
            {/* Atmospheric layers shared with the hero */}
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

            <div className="absolute top-12 left-6 md:left-12 z-10">
                <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-white/50 mb-2">Selected Works</h4>
                <h2 className="text-4xl md:text-5xl font-bold font-display">Featured Projects</h2>
            </div>

            <div className="flex items-center h-screen w-full">
                <div ref={trackRef} className="flex gap-12 md:gap-24 px-6 md:px-24 w-max h-[60vh] md:h-[70vh] items-center">
                    {projects.map((project, idx) => (
                        <div
                            key={idx}
                            className="group relative w-[80vw] md:w-[600px] h-full flex-shrink-0 perspective cursor-pointer"
                        >
                            <div
                                className="project-card-inner w-full h-full bg-ink-soft border border-white/10 rounded-xl overflow-hidden relative shadow-2xl transition-all duration-500 group-hover:border-accent/40"
                                data-cursor="carousel" // Trigger custom cursor arrow
                            >
                                {/* Card Content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent z-10 flex flex-col justify-end p-8 md:p-12 pointer-events-none">
                                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <div className="flex justify-between items-end mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            <span className="text-xs uppercase tracking-widest text-white/60">{project.year}</span>
                                            <a href={project.link} target="_blank" className="text-xs uppercase tracking-widest border-b border-white hover:text-accent hover:border-accent transition-colors pointer-events-auto">Details ↗</a>
                                        </div>

                                        <h3 className="text-4xl md:text-5xl font-bold mb-3 font-display relative inline-block">
                                            {project.title}
                                            {/* Glitch Overlay Text */}
                                            <span className="absolute top-0 left-0 -ml-[2px] opacity-0 group-hover:opacity-100 group-hover:animate-glitch text-accent mix-blend-screen" aria-hidden="true">{project.title}</span>
                                            <span className="absolute top-0 left-0 ml-[2px] opacity-0 group-hover:opacity-100 group-hover:animate-glitch-2 text-white/80 mix-blend-screen" aria-hidden="true">{project.title}</span>
                                        </h3>
                                        <p className="text-lg text-white/70 font-light mb-6 line-clamp-2 md:line-clamp-none opacity-80 group-hover:opacity-100 transition-opacity">{project.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag, t) => (
                                                <span key={t} className="px-3 py-1 bg-white/[0.06] backdrop-blur-sm rounded-full text-xs uppercase tracking-wider text-white/70 border border-white/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Project Featured Image - Clear on Hover */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                        />
                                    </div>

                                    {/* Stronger Gradient for Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent opacity-90 pointer-events-none" />

                                </div>

                                {/* Number Watermark */}
                                <span className="absolute top-6 right-8 text-9xl font-bold text-white/5 font-display select-none">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* "See More" Link Card */}
                    <div className="group relative w-[40vw] md:w-[300px] h-full flex-shrink-0 perspective cursor-pointer flex items-center justify-center">
                        <a
                            href="https://github.com/zouhair1tabeg"
                            target="_blank"
                            className="project-card-inner w-full h-[60%] flex flex-col items-center justify-center bg-ink-soft/60 border border-white/10 rounded-xl hover:border-accent/50 hover:bg-ink-soft transition-all duration-300"
                        >
                            <span className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">Voir plus</span>
                            <span className="text-sm text-white/50 uppercase tracking-widest group-hover:text-white transition-colors">GitHub Profile ↗</span>
                        </a>
                    </div>
                </div>
            </div>

        </section>
    );
}
