"use client";

import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";

type TopoBackgroundProps = {
    /** Pointer parallax. Disabled for touch devices and reduced motion. */
    active: boolean;
};

type BlobSpec = {
    id: string;
    className: string;
    x: number;
    y: number;
    opacity: number;
};

const BLOBS: readonly BlobSpec[] = [
    {
        id: "top-left",
        className: "-left-[18%] -top-[24%] h-[72vw] w-[72vw] max-h-[860px] max-w-[860px]",
        x: 52,
        y: 36,
        opacity: 0.5,
    },
    {
        id: "bottom-right",
        className: "-right-[16%] bottom-[-26%] h-[66vw] w-[66vw] max-h-[780px] max-w-[780px]",
        x: -42,
        y: -30,
        opacity: 0.38,
    },
    {
        id: "center",
        className: "left-[26%] top-[24%] h-[58vw] w-[58vw] max-h-[700px] max-w-[700px]",
        x: 24,
        y: -18,
        opacity: 0.24,
    },
];

const VIEW = { width: 1440, height: 900 };

/** Catmull-Rom through a closed point list; smooth contour without a lib. */
function smoothClosedPath(points: ReadonlyArray<readonly [number, number]>): string {
    const count = points.length;
    const at = (index: number) => points[(index + count) % count];
    const first = points[0];
    let path = `M${first[0].toFixed(1)},${first[1].toFixed(1)}`;

    for (let index = 0; index < count; index += 1) {
        const previous = at(index - 1);
        const current = at(index);
        const next = at(index + 1);
        const after = at(index + 2);

        const c1x = current[0] + (next[0] - previous[0]) / 6;
        const c1y = current[1] + (next[1] - previous[1]) / 6;
        const c2x = next[0] - (after[0] - current[0]) / 6;
        const c2y = next[1] - (after[1] - current[1]) / 6;

        path += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${next[0].toFixed(1)},${next[1].toFixed(1)}`;
    }

    return `${path}Z`;
}

/** Organic, determined-by-seed ring. Same output on server and client. */
function ringPath(cx: number, cy: number, radius: number, seed: number, squash: number): string {
    const steps = 48;
    const points: Array<readonly [number, number]> = [];

    for (let step = 0; step < steps; step += 1) {
        const angle = (step / steps) * Math.PI * 2;
        const wobble =
            1 +
            0.15 * Math.sin(angle * 3 + seed * 1.7) +
            0.08 * Math.sin(angle * 5 - seed * 0.9) +
            0.05 * Math.sin(angle * 2 + seed * 2.3);

        const r = radius * wobble;
        points.push([
            cx + Math.cos(angle) * r,
            cy + Math.sin(angle) * r * squash,
        ]);
    }

    return smoothClosedPath(points);
}

const CONTOURS = [
    { cx: 1230, cy: 130, squash: 0.82, seed: 1.2, rings: 7, gap: 52, base: 70 },
    { cx: 150, cy: 790, squash: 0.9, seed: 3.7, rings: 6, gap: 58, base: 60 },
    { cx: 780, cy: 1010, squash: 0.72, seed: 6.1, rings: 5, gap: 64, base: 90 },
].flatMap((cluster) =>
    Array.from({ length: cluster.rings }, (_, index) => {
        const radius = cluster.base + index * cluster.gap;
        return {
            key: `${cluster.cx}-${cluster.cy}-${index}`,
            d: ringPath(cluster.cx, cluster.cy, radius, cluster.seed + index * 0.63, cluster.squash),
            opacity: 0.9 - index * 0.1,
        };
    }),
);

/**
 * Very faint topographic field plus three large colour washes. The washes use
 * layered radial gradients rather than `filter: blur()`, which keeps the GPU
 * cost of the parallax close to zero.
 */
export default function TopoBackground({ active }: TopoBackgroundProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<HTMLDivElement>(null);
    const blobRefs = useRef<Array<HTMLDivElement | null>>([]);

    const groups = useMemo(
        () =>
            BLOBS.map((blob) => ({
                ...blob,
                style: {
                    background:
                        "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 26%, transparent) 0%, color-mix(in srgb, var(--accent) 10%, transparent) 42%, transparent 72%)",
                    opacity: blob.opacity,
                } satisfies CSSProperties,
            })),
        [],
    );

    useEffect(() => {
        if (!active) return;

        const root = rootRef.current;
        const section = root?.closest("section");
        if (!root || !section) return;

        const target = { x: 0, y: 0 };
        const state = { x: 0, y: 0 };
        let frame = 0;
        let last = performance.now();
        let inView = true;

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;

            const rect = section.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            target.x = (event.clientX - rect.left) / rect.width - 0.5;
            target.y = (event.clientY - rect.top) / rect.height - 0.5;
        };

        const onPointerLeave = () => {
            target.x = 0;
            target.y = 0;
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting;
            },
            { rootMargin: "120px 0px" },
        );
        observer.observe(root);

        const tick = (now: number) => {
            frame = requestAnimationFrame(tick);

            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            if (!inView) return;

            // Heavier damping than the portrait reveal: the field lags behind.
            const follow = 1 - Math.pow(1 - 0.045, dt * 60);
            state.x += (target.x - state.x) * follow;
            state.y += (target.y - state.y) * follow;

            if (svgRef.current) {
                svgRef.current.style.transform = `translate3d(${(state.x * 14).toFixed(2)}px, ${(state.y * 10).toFixed(2)}px, 0)`;
            }

            for (let index = 0; index < groups.length; index += 1) {
                const element = blobRefs.current[index];
                if (!element) continue;

                const blob = groups[index];
                element.style.transform = `translate3d(${(state.x * blob.x).toFixed(2)}px, ${(state.y * blob.y).toFixed(2)}px, 0)`;
            }
        };

        section.addEventListener("pointermove", onPointerMove, { passive: true });
        section.addEventListener("pointerleave", onPointerLeave, { passive: true });
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            section.removeEventListener("pointermove", onPointerMove);
            section.removeEventListener("pointerleave", onPointerLeave);
        };
    }, [active, groups]);

    return (
        <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div ref={svgRef} className="absolute inset-0 will-change-transform">
                <svg
                    viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
                    preserveAspectRatio="xMidYMid slice"
                    className="h-full w-full"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1"
                >
                    {CONTOURS.map((contour) => (
                        <path key={contour.key} d={contour.d} strokeOpacity={contour.opacity * 0.075} />
                    ))}
                </svg>
            </div>

            {groups.map((blob, index) => (
                <div
                    key={blob.id}
                    ref={(element) => {
                        blobRefs.current[index] = element;
                    }}
                    className={`absolute rounded-full will-change-transform ${blob.className}`}
                    style={blob.style}
                />
            ))}
        </div>
    );
}
