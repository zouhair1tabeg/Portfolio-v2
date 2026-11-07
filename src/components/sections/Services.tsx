"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollTo } from "@/hooks/useScrollTo";
import { SERVICES } from "@/data/services";
import ServiceRow from "@/components/services/ServiceRow";

const SERVICE_COUNT = SERVICES.length;
const SERVICE_LABEL = `${String(SERVICE_COUNT).padStart(2, "0")} services`;

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const refreshTimer = useRef<number | null>(null);
    const hoverOpenedId = useRef<string | null>(null);
    const hoverCooldownUntil = useRef(0);
    const [selectedId, setSelectedId] = useState<string | null>(SERVICES[0].id);
    const [hasInteracted, setHasInteracted] = useState(false);

    const isMobile = useMediaQuery("(max-width: 767px)");
    const hoverEnabled = useMediaQuery("(hover: hover)");
    const reduced = usePrefersReducedMotion();
    const scrollTo = useScrollTo();

    // Desktop starts with the first row open; narrow screens start collapsed.
    // Derived rather than synced in an effect, so hydration stays predictable.
    const openId = isMobile && !hasInteracted ? null : selectedId;

    useEffect(() => {
        if (reduced) return;

        const ctx = gsap.context(() => {
            gsap.from(".service-row", {
                y: 24,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [reduced]);

    // Opening a row changes the page height above the pinned Projects section.
    useEffect(() => {
        if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
        refreshTimer.current = window.setTimeout(() => ScrollTrigger.refresh(), 420);
    }, [openId]);

    useEffect(
        () => () => {
            if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
        },
        [],
    );

    const handleOpen = (id: string, fromHover = false) => {
        if (fromHover) {
            // Ignore pointer moves that follow a click and the reflow it causes.
            if (performance.now() < hoverCooldownUntil.current) return;
            hoverOpenedId.current = id;
            setHasInteracted(true);
            setSelectedId(id);
            return;
        }

        hoverCooldownUntil.current = performance.now() + 450;
        setHasInteracted(true);

        // Read the hover flag outside the updater: React may invoke updaters
        // twice in development, and they must stay free of side effects.
        const wasHoverOpened = hoverOpenedId.current === id;
        hoverOpenedId.current = null;
        setSelectedId((current) => (current === id && !wasHoverOpened ? null : id));
    };

    const handleContactClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        scrollTo("#contact");
    };

    return (
        <section
            ref={sectionRef}
            id="services"
            aria-labelledby="services-title"
            className="relative overflow-hidden bg-ink py-28 text-white md:py-36"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-[0.09]"
                    style={{
                        background:
                            "radial-gradient(ellipse at 18% 18%, color-mix(in srgb, var(--accent) 42%, transparent) 0%, transparent 58%)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
                <header className="mb-12 md:mb-16">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                        <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse"
                        />
                        What I Do
                    </span>

                    <h2
                        id="services-title"
                        className="mt-4 font-hero text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white text-balance sm:text-6xl md:text-7xl"
                    >
                        Services
                    </h2>

                    <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
                        <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                            From idea to launch, I design, build and ship digital products.
                        </p>
                        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                            {SERVICE_LABEL}
                        </p>
                    </div>
                </header>

                <ul>
                    {SERVICES.map((service) => (
                        <ServiceRow
                            key={service.id}
                            service={service}
                            open={openId === service.id}
                            hoverEnabled={hoverEnabled}
                            onOpen={handleOpen}
                        />
                    ))}
                </ul>

                <div className="mt-16 flex flex-col gap-7 border-t border-white/10 pt-10 md:mt-20 md:flex-row md:items-center md:justify-between">
                    <p className="font-hero text-2xl font-bold leading-tight text-white md:text-3xl">
                        Have a project in mind?
                    </p>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                            </span>
                            Available for freelance
                        </span>

                        <a
                            href="#contact"
                            onClick={handleContactClick}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                            Let&apos;s talk
                            <ArrowUpRight
                                aria-hidden="true"
                                size={16}
                                className="transition-transform duration-300"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
