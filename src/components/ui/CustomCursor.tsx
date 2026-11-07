"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { getAccent } from "@/lib/accent";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    const [state, setState] = useState<"default" | "pointer" | "carousel" | "view">("default");

    useEffect(() => {
        const cursor = cursorRef.current;
        const ring = ringRef.current;
        if (!cursor || !ring) return;

        // Position setters
        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");

        const moveCursor = (e: MouseEvent) => {
            xSet(e.clientX - 4); // Center dot (8px / 2)
            ySet(e.clientY - 4);

            // Slight delay for ring
            gsap.to(ring, {
                x: e.clientX - 20, // Center ring (40px / 2)
                y: e.clientY - 20,
                duration: 0.15,
                ease: "power2.out"
            });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.closest("[data-cursor='pointer']")) {
                setState("pointer");
            } else if (target.closest("[data-cursor='view']")) {
                setState("view");
            } else if (target.closest("[data-cursor='carousel']")) {
                setState("carousel");
            } else if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("a") || target.closest("button") || target.closest(".cursor-pointer")) {
                setState("pointer");
            } else {
                setState("default");
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    useEffect(() => {
        const ring = ringRef.current;
        const cursor = cursorRef.current;
        const arrow = arrowRef.current;
        const label = labelRef.current;
        if (!ring || !cursor || !arrow || !label) return;

        const accent = getAccent();

        if (state === "pointer") {
            // Hover Link: Expand ring
            gsap.to(ring, { scale: 1.5, opacity: 0.5, backgroundColor: accent, borderColor: "transparent", duration: 0.3 });
            gsap.to(cursor, { scale: 0, duration: 0.3 }); // Hide dot
            gsap.to(arrow, { scale: 0, opacity: 0 });
            gsap.to(label, { scale: 0, opacity: 0, duration: 0.15 });
        } else if (state === "view") {
            // Clickable project card: big ring with the "View" hint.
            gsap.to(ring, { scale: 2.4, backgroundColor: "#ffffff", borderColor: "transparent", opacity: 1, duration: 0.3 });
            gsap.to(cursor, { scale: 0, duration: 0.2 });
            gsap.to(arrow, { scale: 0, opacity: 0, duration: 0.15 });
            gsap.to(label, { scale: 1, opacity: 1, duration: 0.2 });
        } else if (state === "carousel") {
            // Carousel: Show Arrow
            gsap.to(ring, { scale: 2, backgroundColor: "#ffffff", borderColor: "transparent", opacity: 1, duration: 0.3 });
            gsap.to(cursor, { scale: 0 });
            gsap.to(arrow, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.to(label, { scale: 0, opacity: 0, duration: 0.15 });
        } else {
            // Default: Small Dot + Ring
            gsap.to(ring, { scale: 1, opacity: 0.5, backgroundColor: "transparent", borderColor: "#ffffff", duration: 0.3 });
            gsap.to(cursor, { scale: 1, backgroundColor: accent, duration: 0.3 });
            gsap.to(arrow, { scale: 0, opacity: 0 });
            gsap.to(label, { scale: 0, opacity: 0, duration: 0.15 });
        }
    }, [state]);

    return (
        <div className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block">
            {/* Center Dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent will-change-transform"
            />

            {/* Outer Ring */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 w-10 h-10 border border-white rounded-full flex items-center justify-center will-change-transform"
            >
                {/* Arrow Icon (Hidden by default) */}
                <div ref={arrowRef} className="opacity-0 scale-0">
                    <ArrowUpRight className="text-black w-5 h-5" />
                </div>

                {/* "View" label for clickable project cards */}
                <span
                    ref={labelRef}
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-black opacity-0 scale-0 select-none"
                >
                    View
                </span>
            </div>
        </div>
    );
}
