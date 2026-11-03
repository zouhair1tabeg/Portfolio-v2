"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type HeroSignatureProps = {
    revealed: boolean;
    animate: boolean;
    className?: string;
};

const SIGNATURE_PATH =
    "M28 34 H136 L28 98 H140 M20 112 C 70 124, 120 118, 160 104 M196 34 H300 M248 34 V104 M248 104 C 268 116, 296 116, 312 104";

/** Stylised hand-drawn "ZT" monogram, drawn with stroke-dashoffset. */
export default function HeroSignature({ revealed, animate, className }: HeroSignatureProps) {
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!revealed) return;

        const path = pathRef.current;
        if (!path) return;

        const length = path.getTotalLength();

        if (!animate) {
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                path,
                { strokeDasharray: length, strokeDashoffset: length },
                {
                    strokeDashoffset: 0,
                    duration: 1.6,
                    delay: 0.9,
                    ease: "power2.inOut",
                },
            );
        });

        return () => ctx.revert();
    }, [revealed, animate]);

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 320 140"
            fill="none"
            className={className}
        >
            <path
                ref={pathRef}
                d={SIGNATURE_PATH}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
