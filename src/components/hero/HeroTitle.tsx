"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HERO_ROLES, HERO_TAGLINE } from "@/components/hero/hero-data";

type HeroTitleProps = {
    revealed: boolean;
    animate: boolean;
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

export default function HeroTitle({ revealed, animate }: HeroTitleProps) {
    const rootRef = useRef<HTMLDivElement>(null);
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
            const chars = rootRef.current?.querySelectorAll<HTMLSpanElement>(".hero-char");
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
        }, rootRef);

        return () => ctx.revert();
    }, [revealed, animate]);

    return (
        <div ref={rootRef} className="relative z-20 flex w-full flex-col items-center">
            <h1 className="sr-only">Zouhair Tabeg — Web &amp; mobile developer based in Morocco</h1>

            <div aria-hidden="true" className="flex flex-col items-center">
                <span className="block overflow-hidden pb-[0.04em]">
                    <span className="block font-hero text-hero font-black uppercase text-white">
                        <Chars text="Zouhair" />
                    </span>
                </span>
                <span className="-mt-[0.1em] block overflow-hidden pb-[0.06em]">
                    <span className="hero-outline block font-hero text-hero font-black uppercase">
                        <Chars text="Tabeg" />
                    </span>
                </span>
            </div>

            <p
                ref={roleRef}
                className="mt-5 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/75 md:mt-7 md:text-xs"
            >
                <span aria-hidden="true" className="text-accent">
                    [
                </span>
                <span aria-hidden="true" className="relative inline-block w-[23ch] whitespace-nowrap text-center">
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
    );
}
