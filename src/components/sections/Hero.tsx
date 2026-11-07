"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import HeroIntro from "@/components/hero/HeroIntro";
import HeroTitle from "@/components/hero/HeroTitle";
import HeroPortrait, {
    type HeroRevealMode,
} from "@/components/hero/HeroPortrait";
import HeroCta from "@/components/hero/HeroCta";
import HeroSignature from "@/components/hero/HeroSignature";
import HeroMeta from "@/components/hero/HeroMeta";
import TopoBackground from "@/components/hero/TopoBackground";

const HeroBackground3D = dynamic(
    () => import("@/components/hero/HeroBackground3D"),
    { ssr: false },
);

const INTRO_KEY = "zt:intro:v1";

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const [intro, setIntro] = useState<"playing" | "done">("playing");
    const [revealed, setRevealed] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [nameReady, setNameReady] = useState(false);
    const [nameSettled, setNameSettled] = useState(false);
    const lenis = useLenis();
    const reduced = usePrefersReducedMotion();
    const finePointer = useMediaQuery("(pointer: fine) and (min-width: 768px)");
    const webglSupported = useWebGLSupport(finePointer && !reduced);

    const parallaxEnabled = finePointer && !reduced;
    const webglEnabled = finePointer && !reduced && webglSupported;
    const revealMode: HeroRevealMode = reduced
        ? "off"
        : webglEnabled
          ? "webgl"
          : parallaxEnabled
            ? "css"
            : "off";
    const introDone = intro === "done" || reduced;
    const showIntro = !introDone;
    const isRevealed = revealed || reduced;

    // Returning visitors get the page instantly, before the first paint.
    useIsomorphicLayoutEffect(() => {
        let seen = false;
        try {
            seen = sessionStorage.getItem(INTRO_KEY) === "1";
        } catch {
            seen = false;
        }

        if (seen) {
            setIntro("done");
            setRevealed(true);
        }
    }, []);

    // Reduced motion skips the gate entirely; remember that for the session.
    useEffect(() => {
        if (!reduced) return;

        try {
            sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
            /* storage can be unavailable in private mode */
        }
    }, [reduced]);

    const finishIntro = useCallback(() => {
        try {
            sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
            /* storage can be unavailable in private mode */
        }

        setIntro("done");
        setRevealed(true);
        setAnimate(true);
    }, []);

    // Lock the page while the intro gate is open.
    useEffect(() => {
        if (!showIntro) return;

        const { body } = document;
        const previousOverflow = body.style.overflow;

        body.style.overflow = "hidden";
        window.scrollTo(0, 0);
        lenis?.stop();

        return () => {
            body.style.overflow = previousOverflow;
            lenis?.start();
        };
    }, [showIntro, lenis]);

    useEffect(() => {
        if (!introDone) return;

        const timeout = window.setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => window.clearTimeout(timeout);
    }, [introDone]);

    // A canvas can only replace the DOM name once its textures are live and
    // the DOM intro has finished animating, otherwise the reveal would be cut.
    useEffect(() => {
        if (revealMode !== "webgl" || !introDone) return;

        const delay = animate ? 1700 : 0;
        const timeout = window.setTimeout(() => setNameSettled(true), delay);
        return () => window.clearTimeout(timeout);
    }, [revealMode, introDone, animate]);

    const handleNameReady = useCallback(() => setNameReady(true), []);

    const nameVisible =
        revealMode === "webgl" && introDone && nameReady && nameSettled;

    // The hero steps back as About arrives.
    useEffect(() => {
        if (reduced) return;

        const ctx = gsap.context(() => {
            const trigger = {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            } as const;

            gsap.to("[data-hero-fade]", {
                yPercent: -8,
                opacity: 0.1,
                ease: "none",
                scrollTrigger: trigger,
            });
            gsap.to("[data-hero-portrait]", {
                yPercent: -16,
                ease: "none",
                scrollTrigger: trigger,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <>
            <section
                ref={sectionRef}
                id="hero"
                aria-label="Introduction"
                className="relative isolate min-h-svh w-full overflow-hidden bg-ink text-white"
            >
                {/* ── Static background layers (z-0) ───────────────────────────── */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0"
                >
                    <div
                        className="absolute inset-0 opacity-[0.12]"
                        style={{
                            background:
                                "radial-gradient(ellipse at 50% 42%, color-mix(in srgb, var(--accent) 38%, transparent) 0%, transparent 62%)",
                        }}
                    />
                    <TopoBackground active={parallaxEnabled} />
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

                {webglEnabled && (
                    <div className="absolute inset-0 z-0" aria-hidden="true">
                        <HeroBackground3D />
                    </div>
                )}

                {/* z-10 name → z-20 portrait → z-25 scrim → z-30 copy/CTAs */}
                <HeroPortrait
                    revealed={isRevealed}
                    animate={animate}
                    revealMode={revealMode}
                    nameVisible={nameVisible}
                    onNameReady={handleNameReady}
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[32%] bg-gradient-to-t from-ink via-ink/80 to-transparent"
                />

                <div className="relative flex min-h-svh flex-col items-center px-5 pt-24 pb-[9rem] lg:justify-center lg:pt-20 lg:pb-24">
                    <HeroTitle
                        revealed={isRevealed}
                        animate={animate}
                        revealMode={revealMode}
                        nameHidden={nameVisible}
                    />
                    <HeroCta className="max-lg:absolute max-lg:inset-x-0 max-lg:bottom-[5.5rem] max-lg:mt-0" />
                </div>

                <HeroSignature
                    revealed={isRevealed}
                    animate={animate}
                    className="pointer-events-none absolute bottom-[22%] right-[7%] z-30 hidden w-36 -rotate-6 text-accent/80 lg:block xl:w-44"
                />

                <HeroMeta />
            </section>

            {/* Rendered as a sibling so it escapes the hero's `isolate`
                stacking context and can cover the fixed navigation. */}
            {showIntro && <HeroIntro onFinish={finishIntro} />}
        </>
    );
}
