"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { HERO_LOCATION } from "@/components/hero/hero-data";

type HeroIntroProps = {
    onFinish: () => void;
};

/** How long the gate stays up before it opens by itself. */
const AUTO_START_MS = 1600;

/**
 * Full-screen entry gate. It only renders on the first visit of a session
 * (the parent decides) and opens on its own after a short beat. A click,
 * `Esc`, `Enter` or `Space` skips it immediately.
 */
export default function HeroIntro({ onFinish }: HeroIntroProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const doneRef = useRef(false);

    const finish = useCallback(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        onFinish();
    }, [onFinish]);

    const play = useCallback(
        (skipped: boolean) => {
            if (timelineRef.current || doneRef.current) return;

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                finish();
                return;
            }

            const fast = skipped ? 0.55 : 1;
            const timeline = gsap.timeline({ onComplete: finish });
            timelineRef.current = timeline;

            timeline
                .to(contentRef.current, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3 * fast,
                    ease: "power2.in",
                })
                .to(
                    topRef.current,
                    { yPercent: -100, duration: 0.8 * fast, ease: "power4.inOut" },
                    "-=0.05",
                )
                .to(
                    bottomRef.current,
                    { yPercent: 100, duration: 0.8 * fast, ease: "power4.inOut" },
                    "<",
                );
        },
        [finish],
    );

    // Auto-launch: no button to press.
    useEffect(() => {
        const timer = window.setTimeout(() => play(false), AUTO_START_MS);

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
                play(true);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [play]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from("[data-intro-rise]", {
                y: 24,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: "power3.out",
                delay: 0.1,
            });
        }, rootRef);

        return () => {
            ctx.revert();
            timelineRef.current?.kill();
        };
    }, []);

    return (
        <div
            ref={rootRef}
            data-hero-intro
            aria-hidden="true"
            onClick={() => play(true)}
            className="fixed inset-0 z-[100] cursor-pointer overflow-hidden motion-reduce:hidden"
        >
            {/* Two panels split apart on launch — transform only. */}
            <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 bg-ink will-change-transform">
                <div className="absolute inset-0 bg-noise opacity-[0.035]" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
            </div>
            <div ref={bottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-ink will-change-transform">
                <div className="absolute inset-0 bg-noise opacity-[0.035]" />
                <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
            </div>

            <div
                ref={contentRef}
                className="absolute inset-0 z-10 flex flex-col justify-between px-6 py-6 md:px-12 md:py-8"
            >
                <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                    <span data-intro-rise>
                        ZT<span className="text-accent">.</span>SYSTEMS
                    </span>
                    <span data-intro-rise className="text-right">
                        Portfolio / v2.0
                        <span className="mt-1 block text-white/25">Session 01</span>
                    </span>
                </div>

                <div className="flex flex-col items-center gap-6 text-center">
                    <p
                        data-intro-rise
                        className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/45"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
                        System ready
                    </p>

                    <p
                        data-intro-rise
                        className="font-hero text-[clamp(2.6rem,11vw,8rem)] leading-none font-black tracking-[-0.06em] uppercase"
                    >
                        Zouhair<span className="text-accent">.</span>Tabeg
                    </p>

                    <p
                        data-intro-rise
                        className="max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-white/40 md:text-xs"
                    >
                        Web &amp; mobile developer — Morocco
                    </p>

                    {/* Fills while the gate waits, then the panels split. */}
                    <span
                        data-intro-rise
                        aria-hidden="true"
                        className="mt-2 block h-px w-44 overflow-hidden bg-white/15"
                    >
                        <span className="block h-full w-full origin-left bg-accent motion-safe:animate-[intro-progress_1.6s_ease-in-out_forwards]" />
                    </span>
                </div>

                <div className="flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                    <span data-intro-rise className="block">
                        {HERO_LOCATION}
                    </span>
                    <span data-intro-rise className="hidden text-white/20 md:block">
                        Click to skip
                    </span>
                </div>
            </div>
        </div>
    );
}
