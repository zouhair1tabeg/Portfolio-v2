"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives Lenis from the GSAP ticker (single RAF loop) and keeps
 * ScrollTrigger in sync with the smoothed scroll position.
 */
function LenisSync() {
    const lenis = useLenis();
    const pathname = usePathname();

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

    // Next.js scrolls to the hash before the destination sections exist,
    // so a client-side return to "/#projects" would stay at the top. Wait for
    // the new page to paint, then let Lenis jump to the requested section.
    useEffect(() => {
        if (!lenis) return;

        const hash = window.location.hash;
        if (!hash) return;

        const id = decodeURIComponent(hash.slice(1));
        let frame = window.requestAnimationFrame(() => {
            frame = window.requestAnimationFrame(() => {
                const target = document.getElementById(id);
                if (!target) return;
                lenis.scrollTo(target, { immediate: true });
            });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [lenis, pathname]);

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
