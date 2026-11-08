"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CERTIFICATIONS } from "@/data/certifications";
import CertificationCard from "@/components/certifications/CertificationCard";

export default function Certifications() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const reduced = usePrefersReducedMotion();

    const count = CERTIFICATIONS.length;
    const countLabel = `${String(count).padStart(2, "0")} ${
        count === 1 ? "credential" : "credentials"
    }`;

    useEffect(() => {
        if (reduced) return;

        const ctx = gsap.context(() => {
            gsap.from(".certification-card", {
                y: 24,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: listRef.current,
                    start: "top 85%",
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <div
            ref={sectionRef}
            aria-labelledby="certifications-title"
            className="mx-auto mt-20 w-full max-w-5xl md:mt-28"
        >
            <div className="mb-8 flex items-center gap-4 md:mb-10">
                <h3
                    id="certifications-title"
                    className="shrink-0 font-mono text-xs uppercase tracking-widest text-accent"
                >
                    Certifications
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                    {countLabel}
                </span>
            </div>

            <ul
                ref={listRef}
                className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6"
            >
                {CERTIFICATIONS.map((certification) => (
                    <li key={certification.id} className="certification-card">
                        <CertificationCard certification={certification} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
