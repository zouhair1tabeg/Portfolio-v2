"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import RevealPlane, { type RevealInput } from "@/components/hero/HeroRevealPlane";

type HeroRevealCanvasProps = {
    /** Wrapper around the portrait card; the pointer is read from its section. */
    className?: string;
};

/**
 * Full-frame R3F canvas that sits on top of the base portrait. It is purely
 * decorative: the accessible `<Image>` stays underneath, and the canvas never
 * receives pointer events. The listener lives on the hero `<section>` so the
 * title and the CTAs stay interactive.
 */
export default function HeroRevealCanvas({ className }: HeroRevealCanvasProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const input = useRef<RevealInput>({ x: 0.5, y: 0.5, inside: false });
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const host = hostRef.current;
        const section = host?.closest("section");
        if (!host || !section) return;

        let frame = 0;
        let pending: { x: number; y: number } | null = null;

        // One read of the rect per animation frame, never per pointer event.
        const flush = () => {
            frame = 0;
            if (!pending) return;

            const rect = host.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const x = (pending.x - rect.left) / rect.width;
            const y = 1 - (pending.y - rect.top) / rect.height;

            input.current = {
                x: Math.min(Math.max(x, 0), 1),
                y: Math.min(Math.max(y, 0), 1),
                inside: x >= 0 && x <= 1 && y >= 0 && y <= 1,
            };
            pending = null;
        };

        const onPointerMove = (event: PointerEvent) => {
            // Touch scrolls the page; the CPU fallback is not used on phones.
            if (event.pointerType === "touch") return;

            pending = { x: event.clientX, y: event.clientY };
            if (!frame) frame = requestAnimationFrame(flush);
        };

        const onPointerLeave = () => {
            pending = null;
            input.current = { ...input.current, inside: false };
        };

        section.addEventListener("pointermove", onPointerMove, { passive: true });
        section.addEventListener("pointerleave", onPointerLeave, { passive: true });

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { rootMargin: "120px 0px" },
        );
        observer.observe(host);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            section.removeEventListener("pointermove", onPointerMove);
            section.removeEventListener("pointerleave", onPointerLeave);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={hostRef} aria-hidden="true" className={className}>
            <Canvas
                flat
                dpr={[1, 1.5]}
                frameloop={visible ? "always" : "never"}
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
                camera={{ position: [0, 0, 1] }}
                className="!pointer-events-none"
            >
                <Suspense fallback={null}>
                    <RevealPlane input={input} />
                </Suspense>
            </Canvas>
        </div>
    );
}
