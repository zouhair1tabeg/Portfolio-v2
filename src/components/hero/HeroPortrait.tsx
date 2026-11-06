"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import RevealFallback from "@/components/hero/RevealFallback";

export type HeroRevealMode = "webgl" | "css" | "off";

type HeroPortraitProps = {
    revealed: boolean;
    animate: boolean;
    revealMode: HeroRevealMode;
};

const BASE_PORTRAIT = "/images/hero/portrait-base.png";

// The R3F canvas only ever mounts in the browser, after hydration.
const HeroRevealCanvas = dynamic(() => import("@/components/hero/HeroRevealCanvas"), {
    ssr: false,
});

export default function HeroPortrait({ revealed, animate, revealMode }: HeroPortraitProps) {
    const frameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!revealed) return;

        const ctx = gsap.context(() => {
            if (!frameRef.current) return;

            if (!animate) {
                gsap.set(frameRef.current, { opacity: 1, scale: 1 });
                return;
            }

            gsap.fromTo(
                frameRef.current,
                { opacity: 0, scale: 0.94 },
                { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" },
            );
        }, frameRef);

        return () => ctx.revert();
    }, [revealed, animate]);

    return (
        <div data-hero-portrait className="pointer-events-none absolute inset-0 z-10">
            {/* Mobile: the portrait becomes a ghosted full-bleed backdrop so the
                stacked copy always stays legible. Image A only, no reveal. */}
            <div className="absolute inset-0 md:hidden">
                <Image
                    src={BASE_PORTRAIT}
                    alt="Portrait of Zouhair Tabeg"
                    fill
                    priority
                    sizes="100vw"
                    className="scale-110 object-cover object-[50%_16%] opacity-75 blur-[3px]"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/70 to-ink"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
            </div>

            {/* Desktop: the portrait interacts with the display name, and the
                cursor reveals image B inside an organic blob (WebGL or CSS). */}
            <div className="hidden h-full items-center justify-center pt-6 md:flex">
                <div
                    className="hero-parallax will-change-transform"
                    style={{
                        transform:
                            "translate3d(calc(var(--px, 0) * 18px), calc(var(--py, 0) * 12px), 0) rotate(calc(var(--px, 0) * 1.2deg))",
                    }}
                >
                    <div ref={frameRef} className="relative">
                        <span aria-hidden="true" className="absolute -left-3 -top-3 h-5 w-5 border-l border-t border-accent/60" />
                        <span aria-hidden="true" className="absolute -bottom-3 -right-3 h-5 w-5 border-r border-b border-accent/60" />

                        <div
                            data-hero-card
                            className="relative h-[58svh] w-[30vw] max-w-[400px] overflow-hidden rounded-t-[999px] rounded-b-2xl border border-white/10 bg-ink-soft"
                        >
                            {/* Accessible base image; the canvas above only paints the effect. */}
                            <Image
                                src={BASE_PORTRAIT}
                                alt="Portrait of Zouhair Tabeg"
                                fill
                                priority
                                sizes="(max-width: 768px) 68vw, 30vw"
                                className="object-cover object-center"
                            />

                            {revealMode === "webgl" && <HeroRevealCanvas className="absolute inset-0" />}
                            {revealMode === "css" && <RevealFallback />}

                            {/* Fade into the page + film grain */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent"
                            />
                            <div aria-hidden="true" className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay" />

                            <span
                                aria-hidden="true"
                                className="absolute right-2 top-1/2 font-mono text-[9px] uppercase tracking-[0.4em] text-white/40 [writing-mode:vertical-rl]"
                            >
                                Tabeg — 001
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
