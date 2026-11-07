"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { HERO_PORTRAIT } from "@/components/hero/hero-portrait-assets";
import RevealFallback from "@/components/hero/RevealFallback";

export type HeroRevealMode = "webgl" | "css" | "off";

type HeroPortraitProps = {
    revealed: boolean;
    animate: boolean;
    revealMode: HeroRevealMode;
    /** True when the WebGL canvas should take over the display name. */
    nameVisible: boolean;
    onNameReady: () => void;
};

// The R3F canvas only ever mounts in the browser, after hydration.
const HeroRevealCanvas = dynamic(
    () => import("@/components/hero/HeroRevealCanvas"),
    { ssr: false },
);

export default function HeroPortrait({
    revealed,
    animate,
    revealMode,
    nameVisible,
    onNameReady,
}: HeroPortraitProps) {
    const frameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!revealed) return;

        const ctx = gsap.context(() => {
            if (!frameRef.current) return;

            if (!animate) {
                gsap.set(frameRef.current, { opacity: 1 });
                return;
            }

            gsap.fromTo(
                frameRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1.2, ease: "power2.out" },
            );
        }, frameRef);

        return () => ctx.revert();
    }, [revealed, animate]);

    return (
        <div
            data-hero-portrait
            className="pointer-events-none absolute inset-0 z-20"
        >
            <div className="absolute inset-0 flex items-end justify-center">
                {/* The box aspect matches the texture, so the shader can map B
                    onto the exact rectangle occupied by the cut-out image A. */}
                <div
                    ref={frameRef}
                    data-hero-portrait-image
                    className="relative aspect-[1200/1490] h-[78svh] shrink-0 lg:h-[94svh]"
                >
                    <Image
                        src={HERO_PORTRAIT.base}
                        alt={HERO_PORTRAIT.alt}
                        fill
                        priority
                        sizes="(max-width: 1024px) 80svh, 70svh"
                        className="select-none object-cover object-center"
                    />

                    {revealMode === "css" && <RevealFallback />}
                </div>
            </div>

            {revealMode === "webgl" && (
                <HeroRevealCanvas
                    className="absolute inset-0"
                    nameVisible={nameVisible}
                    onReady={onNameReady}
                />
            )}
        </div>
    );
}
