"use client";

import { useRef, ReactNode, MouseEvent, useEffect } from "react";
import gsap from "gsap";

interface MagneticWrapperProps {
    children: ReactNode;
    className?: string;
    width?: number; // Detection zone width multiplier, default 1
    height?: number; // Detection zone height multiplier, default 1
    strength?: number; // Pull strength, default 0.5
}

export default function MagneticWrapper({
    children,
    className = "",
    width = 1,
    height = 1,
    strength = 0.5
}: MagneticWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: globalThis.MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width: w, height: h } = element.getBoundingClientRect();

            const centerX = left + w / 2;
            const centerY = top + h / 2;

            // Check if mouse is within detection zone
            const distanceX = Math.abs(clientX - centerX);
            const distanceY = Math.abs(clientY - centerY);

            if (distanceX < (w * width) / 2 && distanceY < (h * height) / 2) {
                const x = (clientX - centerX) * strength;
                const y = (clientY - centerY) * strength;
                xTo(x);
                yTo(y);
            } else {
                xTo(0);
                yTo(0);
            }
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [width, height, strength]);

    // Clone child to attach ref if it's a single element to avoid wrapper div issues if needed
    // But wrapper div is safer for layout.
    return (
        <div ref={ref} className={`inline-block ${className}`}>
            {children}
        </div>
    );
}
