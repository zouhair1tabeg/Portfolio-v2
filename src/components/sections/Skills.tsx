"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SKILL_CATEGORIES } from "@/data/skills";
import SkillCard from "@/components/skills/SkillCard";

const DOMAIN_COUNT = SKILL_CATEGORIES.length;
const TECHNOLOGY_COUNT = SKILL_CATEGORIES.reduce(
    (total, category) =>
        total +
        category.items.reduce(
            (count, item) => count + 1 + (item.children?.length ?? 0),
            0,
        ),
    0,
);

export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced) return;

        const ctx = gsap.context(() => {
            gsap.from(".skills-head", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    once: true,
                },
            });

            gsap.utils
                .toArray<HTMLElement>(".skill-card")
                .forEach((card) => {
                    const trigger = {
                        trigger: card,
                        start: "top 88%",
                        once: true,
                    } as const;
                    const items = card.querySelectorAll<HTMLElement>(
                        ".skill-chip, .skill-item",
                    );

                    gsap.from(card, {
                        y: 24,
                        opacity: 0,
                        duration: 0.7,
                        ease: "power2.out",
                        scrollTrigger: trigger,
                    });

                    if (items.length > 0) {
                        gsap.from(items, {
                            y: 8,
                            opacity: 0,
                            duration: 0.4,
                            delay: 0.15,
                            stagger: 0.015,
                            ease: "power2.out",
                            scrollTrigger: trigger,
                        });
                    }
                });
        }, sectionRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <section
            ref={sectionRef}
            id="skills"
            aria-labelledby="skills-title"
            className="relative overflow-hidden bg-ink py-28 text-white md:py-36"
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

            {/* Kinetic background marquee */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 -rotate-6 z-0 pointer-events-none opacity-[0.05] select-none">
                <div className="whitespace-nowrap flex gap-10 animate-marquee">
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="text-[20vw] font-black uppercase leading-none"
                            style={{
                                WebkitTextStroke: "2px var(--accent)",
                                color: "transparent",
                            }}
                        >
                            FULLSTACK CREATIVE DEVELOPER
                        </span>
                    ))}
                </div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
                <header className="skills-head mb-14 md:mb-20">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                        <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse"
                        />
                        Capabilities
                    </span>

                    <h2
                        id="skills-title"
                        className="mt-4 font-hero text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white text-balance sm:text-6xl md:text-7xl"
                    >
                        Digital Toolbox
                    </h2>

                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                        {DOMAIN_COUNT} domains · {TECHNOLOGY_COUNT} technologies
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
                    {SKILL_CATEGORIES.map((category) => (
                        <SkillCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
}
