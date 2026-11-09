"use client";

import type { MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/navigation";
import { useScrollTo } from "@/hooks/useScrollTo";
import {
    HERO_LOCATION,
    LATEST_BUILD,
    MARQUEE_ITEMS,
} from "@/components/hero/hero-data";

export default function HeroMeta() {
    const scrollTo = useScrollTo();

    const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
        event.preventDefault();
        scrollTo(href);
    };

    return (
        <div className="pointer-events-none absolute inset-0 z-40">
            <div className="absolute inset-x-0 top-0 flex items-start justify-between px-5 py-5 md:px-10 md:py-7">
                <a
                    href="#hero"
                    onClick={(event) => handleAnchor(event, "#hero")}
                    className="pointer-events-auto flex min-h-11 items-center font-hero text-sm font-black tracking-tight text-white transition-colors hover:text-accent"
                >
                    ZT<span className="text-accent">.</span>SYSTEMS
                </a>

                <nav
                    aria-label="Primary"
                    className="pointer-events-auto mr-24 hidden items-center gap-5 pt-3 lg:flex"
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(event) => handleAnchor(event, link.href)}
                            className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors duration-300 hover:text-accent"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="absolute inset-x-0 bottom-12 flex items-end justify-between gap-4 px-5 md:bottom-14 md:px-10">
                <div className="flex flex-col gap-1.5 font-mono text-[9px] uppercase tracking-[0.24em] md:text-[10px]">
                    <span className="flex items-center gap-2 text-white/75">
                        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        Available for freelance
                    </span>
                    <span className="text-white/35">{HERO_LOCATION}</span>
                </div>

                <div className="hidden flex-col items-center gap-2 md:flex" aria-hidden="true">
                    <span className="relative block h-8 w-px overflow-hidden bg-white/15">
                        <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[scroll-cue_1.8s_ease-in-out_infinite]" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/35">
                        Scroll
                    </span>
                </div>

                <a
                    href={LATEST_BUILD.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Latest build: ${LATEST_BUILD.label} (opens in a new tab)`}
                    className="pointer-events-auto hidden flex-col items-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.24em] sm:flex md:text-[10px]"
                >
                    <span className="text-white/35">Latest build</span>
                    <span className="flex items-center gap-1.5 text-white/80 transition-colors duration-300 hover:text-accent">
                        {LATEST_BUILD.label}
                        <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                    </span>
                </a>
            </div>

            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-8 overflow-hidden border-t border-white/10 bg-ink/70"
            >
                <div className="flex h-full w-max items-center animate-marquee-half motion-reduce:animate-none">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center">
                            {MARQUEE_ITEMS.map((item) => (
                                <span
                                    key={`${copy}-${item}`}
                                    className="flex items-center gap-3 px-4 font-mono text-[9px] uppercase tracking-[0.3em] text-white/35"
                                >
                                    {item}
                                    <span className="text-accent/60">·</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
