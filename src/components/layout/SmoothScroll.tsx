"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives Lenis from the GSAP ticker (single RAF loop) and keeps
 * ScrollTrigger in sync with the smoothed scroll position.
 */
function LenisSync() {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const onScroll = () => ScrollTrigger.update();
        const raf = (time: number) => lenis.raf(time * 1000);

        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        lenis.on("scroll", onScroll);

        return () => {
            gsap.ticker.remove(raf);
            lenis.off("scroll", onScroll);
        };
    }, [lenis]);

    return null;
}

export default function SmoothScroll({
    children,
}: {
    children: React.ReactNode;
}) {
    // The package ships its own copy of @types/react, so the two ReactNode
    // definitions do not match structurally.
    const content = children as unknown as React.ComponentProps<typeof ReactLenis>["children"];

    return (
        <ReactLenis root autoRaf={false} options={{ lerp: 0.1, smoothWheel: true }}>
            <LenisSync />
            {content}
        </ReactLenis>
    );
}
