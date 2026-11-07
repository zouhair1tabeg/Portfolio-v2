"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HERO_ROLES, HERO_TAGLINE } from "@/components/hero/hero-data";
import { REVEAL_CONFIG } from "@/components/hero/reveal-config";
import type { HeroRevealMode } from "@/components/hero/HeroPortrait";

type HeroTitleProps = {
    revealed: boolean;
    animate: boolean;
    revealMode: HeroRevealMode;
    /** Hides the DOM name once the WebGL canvas paints it instead. */
    nameHidden: boolean;
};

function Chars({ text }: { text: string }) {
    return (
        <>
            {text.split("").map((char, index) => (
                <span
                    key={`${char}-${index}`}
                    className="hero-char inline-block will-change-transform"
                >
                    {char}
                </span>
            ))}
        </>
    );
}

export default function HeroTitle({
    revealed,
    animate,
    revealMode,
    nameHidden,
}: HeroTitleProps) {
    const nameRef = useRef<HTMLDivElement>(null);
    const nameFillRef = useRef<HTMLDivElement>(null);
    const roleRef = useRef<HTMLParagraphElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const [roleIndex, setRoleIndex] = useState(0);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced) return;

        const interval = window.setInterval(() => {
            setRoleIndex((index) => (index + 1) % HERO_ROLES.length);
        }, 3200);

        return () => window.clearInterval(interval);
    }, [reduced]);

    useEffect(() => {
        if (!revealed) return;

        const ctx = gsap.context(() => {
            const chars = nameFillRef.current?.querySelectorAll<HTMLSpanElement>(
                ".hero-char",
            );
            const fades = [roleRef.current, taglineRef.current];

            if (!chars || chars.length === 0) return;

            if (!animate) {
                gsap.set(chars, { yPercent: 0, opacity: 1 });
                gsap.set(fades, { y: 0, opacity: 1 });
                return;
            }

            gsap.set(chars, { yPercent: 110 });
            gsap.set(fades, { y: 18, opacity: 0 });

            gsap.to(chars, {
                yPercent: 0,
                duration: 1,
                ease: "power4.out",
                stagger: 0.035,
            });

            gsap.to(fades, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.5,
                stagger: 0.1,
                ease: "power3.out",
            });
        });

        return () => ctx.revert();
    }, [revealed, animate]);

    // CSS fallback for browsers without WebGL: the fill layer gets a hole and
    // the stroke layer appears inside the same damped blob. It tracks the same
    // cursor as the portrait fallback, so both reveals line up on screen.
    useEffect(() => {
        if (revealMode !== "css") return;

        const root = nameRef.current;
        const fill = nameFillRef.current;
        const section = root?.closest("section");
        const stage = fill?.parentElement ?? null;
        if (!root || !fill || !stage || !section) return;

        const portrait = section.querySelector<HTMLElement>(
            "[data-hero-portrait-image]",
        );

        const target = { x: 0, y: 0, inside: false };
        const state = { x: 0, y: 0, reveal: 0 };
        let pointer: { x: number; y: number } | null = null;
        let lastTarget = { x: 0, y: 0 };
        let idle = 0;
        let initialised = false;
        let inView = true;
        let frame = 0;
        let last = performance.now();

        // Variables live on the shared stage so both the fill and the stroke
        // layer inherit the same blob geometry and centre.
        const sizeBlob = () => {
            const height = portrait?.offsetHeight ?? section.clientHeight;
            const radius = height * REVEAL_CONFIG.radius;
            stage.style.setProperty("--blob-w", `${radius * 1.15}px`);
            stage.style.setProperty("--blob-h", `${radius * 0.92}px`);
        };

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            pointer = { x: event.clientX, y: event.clientY };
        };

        const onPointerLeave = () => {
            target.inside = false;
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting;
            },
            { rootMargin: "120px 0px" },
        );
        observer.observe(root);

        const resizeObserver = new ResizeObserver(sizeBlob);
        resizeObserver.observe(root);
        if (portrait) resizeObserver.observe(portrait);
        sizeBlob();

        const tick = (now: number) => {
            frame = requestAnimationFrame(tick);

            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            if (!inView) return;

            if (pointer) {
                const rect = stage.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    target.x = pointer.x - rect.left;
                    target.y = pointer.y - rect.top;
                    target.inside = true;
                    pointer = null;
                }
            }

            if (!initialised) {
                if (!target.inside) return;
                state.x = target.x;
                state.y = target.y;
                lastTarget = { x: target.x, y: target.y };
                initialised = true;
            }

            const follow = 1 - Math.pow(1 - REVEAL_CONFIG.damping, dt * 60);
            state.x += (target.x - state.x) * follow;
            state.y += (target.y - state.y) * follow;

            const moved = Math.hypot(
                target.x - lastTarget.x,
                target.y - lastTarget.y,
            );
            lastTarget = { x: target.x, y: target.y };

            if (target.inside && moved > 0.5) idle = 0;
            else idle += dt;

            const visible =
                target.inside && idle < REVEAL_CONFIG.idleDelay;
            state.reveal +=
                ((visible ? 1 : 0) - state.reveal) *
                (1 - Math.exp(-dt * REVEAL_CONFIG.revealSpeed));

            stage.style.setProperty("--mx", `${state.x.toFixed(1)}px`);
            stage.style.setProperty("--my", `${state.y.toFixed(1)}px`);
            stage.style.setProperty("--name-reveal", state.reveal.toFixed(3));
        };

        section.addEventListener("pointermove", onPointerMove, {
            passive: true,
        });
        section.addEventListener("pointerleave", onPointerLeave, {
            passive: true,
        });
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            resizeObserver.disconnect();
            section.removeEventListener("pointermove", onPointerMove);
            section.removeEventListener("pointerleave", onPointerLeave);
        };
    }, [revealMode]);

    return (
        <>
            <h1 className="sr-only">
                Zouhair Tabeg — Web &amp; mobile developer based in Morocco
            </h1>

            <div
                ref={nameRef}
                aria-hidden="true"
                data-hero-name
                className={cn(
                    "relative z-10 flex w-full flex-col items-center transition-opacity duration-300",
                    nameHidden && "opacity-0",
                )}
            >
                {/* The scroll fade writes an inline opacity, so it lives on an
                    inner element and never fights the WebGL hand-over. */}
                <div
                    data-hero-fade
                    className="flex w-full flex-col items-center"
                >
                    <div className="relative font-hero text-hero font-black uppercase">
                        <div
                            ref={nameFillRef}
                            className="hero-name-fill flex flex-col items-center py-[0.06em]"
                        >
                            <span className="block overflow-hidden pb-[0.04em]">
                                <span
                                    data-hero-name-line
                                    className="block whitespace-nowrap text-white"
                                >
                                    <Chars text="Zouhair" />
                                </span>
                            </span>
                            <span className="-mt-[0.1em] block overflow-hidden pb-[0.06em]">
                                <span
                                    data-hero-name-line
                                    className="block whitespace-nowrap text-accent"
                                >
                                    <Chars text="Tabeg" />
                                </span>
                            </span>
                        </div>

                        {revealMode === "css" && (
                            <div className="hero-name-stroke-layer absolute inset-0 z-10 flex flex-col items-center py-[0.06em]">
                                <span className="block overflow-hidden pb-[0.04em]">
                                    <span className="hero-name-stroke block whitespace-nowrap text-white">
                                        Zouhair
                                    </span>
                                </span>
                                <span className="-mt-[0.1em] block overflow-hidden pb-[0.06em]">
                                    <span className="hero-name-stroke block whitespace-nowrap text-accent">
                                        Tabeg
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div
                data-hero-fade
                className="relative z-30 mt-5 flex w-full flex-col items-center md:mt-7 max-lg:absolute max-lg:inset-x-0 max-lg:bottom-[6.5rem] max-lg:mt-0"
            >
                <p
                    ref={roleRef}
                    className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/75 md:text-xs"
                >
                    <span aria-hidden="true" className="text-accent">
                        [
                    </span>
                    <span
                        aria-hidden="true"
                        className="relative inline-block w-[23ch] whitespace-nowrap text-center"
                    >
                        <span key={roleIndex} className="animate-role-in inline-block">
                            {HERO_ROLES[roleIndex]}
                        </span>
                    </span>
                    <span aria-hidden="true" className="text-accent">
                        ]
                    </span>
                    <span className="sr-only" aria-live="polite">
                        {HERO_ROLES[roleIndex]}
                    </span>
                </p>

                <p
                    ref={taglineRef}
                    className="mt-4 max-w-sm text-balance text-center text-sm leading-relaxed text-white/60 md:max-w-md md:text-base"
                >
                    {HERO_TAGLINE}
                </p>
            </div>
        </>
    );
}
