"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ParticlesBackground from "@/components/canvas/ParticlesBackground";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const firstNameRef = useRef<HTMLHeadingElement>(null);
    const lastNameRef = useRef<HTMLHeadingElement>(null);
    const subHeaderRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            // Ensure elements are initially hidden/positioned
            gsap.set([firstNameRef.current, lastNameRef.current], {
                y: 100,
                opacity: 0,
                rotateX: 10
            });
            gsap.set([subHeaderRef.current, scrollRef.current], {
                opacity: 0,
                y: 20
            });

            // 1. Text Reveal Animation
            tl.to([firstNameRef.current, lastNameRef.current], {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1.8,
                stagger: 0.2, // "Zouhair" then "Tabeg"
                ease: "power3.out"
            })
                // 2. Sub-header & UI Reveal
                .to([subHeaderRef.current, scrollRef.current], {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                }, "-=1.0");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="hero" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-white">

            {/* Background: Particles */}
            <div className="absolute inset-0 z-0">
                <ParticlesBackground />
            </div>

            {/* Typography Centerpiece */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full mix-blend-difference pointer-events-none select-none [perspective:1000px]">

                {/* ZOUHAIR (Background style: Filled, bold) */}
                <h1
                    ref={firstNameRef}
                    className="font-black text-[15vw] leading-[0.8] tracking-tighter text-[#111] md:text-white uppercase perspective-text"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    Zouhair
                </h1>

                {/* TABEG (Foreground style: Outline) */}
                <h1
                    ref={lastNameRef}
                    className="font-black text-[15vw] leading-[0.8] tracking-tighter uppercase relative"
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        WebkitTextStroke: "1px rgba(255,255,255,0.8)",
                        color: "transparent"
                    }}
                >
                    Tabeg
                </h1>

                {/* Sub-header */}
                <div ref={subHeaderRef} className="mt-12 md:mt-16 flex flex-col items-center gap-2 pointer-events-auto">
                    <p className="text-sm md:text-base tracking-[0.4em] uppercase text-gray-400 font-light">
                        Developer <span className="text-[#0066FF] mx-2">|</span> Web & Mobile
                    </p>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div ref={scrollRef} className="absolute bottom-12 flex flex-col items-center gap-2 z-20 pointer-events-none mix-blend-difference text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent opacity-60" />
            </div>

        </section>
    );
}
