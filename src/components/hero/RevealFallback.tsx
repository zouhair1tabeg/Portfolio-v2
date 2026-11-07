"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { REVEAL_CONFIG } from "@/components/hero/reveal-config";
import { HERO_PORTRAIT } from "@/components/hero/hero-portrait-assets";

/**
 * No-WebGL fallback for the portrait reveal. Image A is rendered by
 * `HeroPortrait`; this layer clips image B with a CSS radial mask whose centre
 * is damped towards the pointer. All listeners are passive, so the page keeps
 * scrolling normally.
 */
export default function RevealFallback() {
    const hostRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const host = hostRef.current;
        const layer = layerRef.current;
        const section = host?.closest("section");
        if (!host || !layer || !section) return;

        const target = { x: 0.5, y: 0.5, inside: false };
        const state = { x: 0.5, y: 0.5, reveal: 0 };
        const pointer = { x: 0, y: 0, fresh: false };

        let frame = 0;
        let last = performance.now();
        let inView = true;

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.fresh = true;
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
        observer.observe(host);

        const sizeMask = () => {
            host.style.setProperty(
                "--blob-size",
                `${Math.round(host.clientHeight * REVEAL_CONFIG.radius)}px`,
            );
        };

        const resizeObserver = new ResizeObserver(sizeMask);
        resizeObserver.observe(host);
        sizeMask();

        const tick = (now: number) => {
            frame = requestAnimationFrame(tick);

            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            if (!inView) return;

            if (pointer.fresh) {
                const rect = host.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;

                const x = (pointer.x - rect.left) / rect.width;
                const y = 1 - (pointer.y - rect.top) / rect.height;

                target.x = Math.min(Math.max(x, 0), 1);
                target.y = Math.min(Math.max(y, 0), 1);
                target.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
                pointer.fresh = false;
            }

            const follow = 1 - Math.pow(1 - REVEAL_CONFIG.damping, dt * 60);
            state.x += (target.x - state.x) * follow;
            state.y += (target.y - state.y) * follow;
            state.reveal +=
                ((target.inside ? 1 : 0) - state.reveal) *
                (1 - Math.exp(-dt * REVEAL_CONFIG.revealSpeed));

            host.style.setProperty("--mx", `${(state.x * 100).toFixed(2)}%`);
            host.style.setProperty("--my", `${((1 - state.y) * 100).toFixed(2)}%`);
            layer.style.opacity = state.reveal.toFixed(3);
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
    }, []);

    return (
        <div
            ref={hostRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
        >
            <div
                ref={layerRef}
                className="absolute inset-0 opacity-0 [mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]"
                style={{
                    maskImage:
                        "radial-gradient(ellipse calc(var(--blob-size, 90px) * 1.15) calc(var(--blob-size, 90px) * 0.92) at var(--mx, 50%) var(--my, 50%), #000 0%, #000 52%, transparent 100%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse calc(var(--blob-size, 90px) * 1.15) calc(var(--blob-size, 90px) * 0.92) at var(--mx, 50%) var(--my, 50%), #000 0%, #000 52%, transparent 100%)",
                }}
            >
                <Image
                    src={HERO_PORTRAIT.reveal}
                    alt=""
                    fill
                    loading="eager"
                    sizes="(max-width: 1024px) 80svh, 70svh"
                    className="object-cover object-center"
                />
            </div>
        </div>
    );
}
