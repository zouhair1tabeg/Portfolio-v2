"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ParticlesBackground from "@/components/canvas/ParticlesBackground";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const firstNameRef = useRef<HTMLHeadingElement>(null);
    const lastNameRef = useRef<HTMLHeadingElement>(null);
    const subHeaderRef = useRef<HTMLDivElement>(null);

    // Parallax Logic
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!contentRef.current) return;
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();

        const x = (clientX / width - 0.5) * 40; // Move range
        const y = (clientY / height - 0.5) * 40;

        gsap.to(contentRef.current, {
            x: -x, // Inverse movement for depth
            y: -y,
            rotateX: y * 0.05,
            rotateY: -x * 0.05,
            duration: 1,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        gsap.to(contentRef.current, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 1,
            ease: "power2.out"
        });
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

            // Split Text Animation logic
            // Since we don't have SplitText plugin (paid), we animate manual spans
            const firstChars = firstNameRef.current?.querySelectorAll(".char");
            const lastChars = lastNameRef.current?.querySelectorAll(".char");

            // Random Fly-in
            tl.fromTo([...(firstChars || []), ...(lastChars || [])], {
                opacity: 0,
                z: () => Math.random() * 500 - 250, // Random depth
                x: () => Math.random() * 200 - 100,
                y: () => Math.random() * 200 - 100,
                rotateX: () => Math.random() * 90 - 45,
                filter: "blur(10px)"
            }, {
                opacity: 1,
                z: 0,
                x: 0,
                y: 0,
                rotateX: 0,
                filter: "blur(0px)",
                duration: 2.5,
                stagger: {
                    amount: 0.5,
                    from: "random"
                }
            })
                .fromTo(subHeaderRef.current, {
                    y: 20,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 1.5
                }, "-=1.5");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Helper to split text
    const SplitText = ({ text, className, style }: { text: string, className?: string, style?: any }) => (
        <span className={`inline-block whitespace-nowrap ${className}`} style={style}>
            {text.split("").map((char, i) => (
                <span key={i} className="char inline-block" style={{ display: "inline-block" }}>
                    {char}
                </span>
            ))}
        </span>
    );

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-white [perspective:2000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >

            {/* Background: Particles with Warp Speed */}
            <div className="absolute inset-0 z-0">
                <ParticlesBackground />
            </div>

            {/* Grain & Glitch Overlay */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            {/* Typography Centerpiece (Parallax Target) */}
            <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center w-full h-full mix-blend-difference pointer-events-none select-none [transform-style:preserve-3d]">

                {/* ZOUHAIR */}
                <h1 ref={firstNameRef} className="relative z-10">
                    <SplitText
                        text="Zouhair"
                        className="font-black text-[15vw] leading-[0.8] tracking-tighter text-white uppercase"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    />
                </h1>

                {/* TABEG (Spotlight Effect) */}
                <h1 ref={lastNameRef} className="relative z-10 group pointer-events-auto cursor-default">
                    {/* Outline Base */}
                    <span
                        className="font-black text-[15vw] leading-[0.8] tracking-tighter uppercase relative block transition-colors duration-500 ease-out group-hover:text-[#0066FF]"
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: "transparent",
                            WebkitTextStroke: "2px rgba(255,255,255,0.5)"
                        }}
                    >
                        <SplitText text="Tabeg" />
                    </span>

                    {/* Glow Overlay (only visible on hover via CSS/Group) */}
                    <div className="absolute inset-0 blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-[#0066FF] z-[-1]" />
                </h1>

                {/* Magnetic Sub-header */}
                <div ref={subHeaderRef} className="mt-16 pointer-events-auto">
                    {/* Simple Magnetic Effect via CSS hover/transform in parent or just subtle float */}
                    <p className="text-sm md:text-base tracking-[0.4em] uppercase text-gray-400 font-light border border-white/10 px-6 py-3 rounded-full backdrop-blur-md hover:bg-white/5 hover:border-[#0066FF]/50 transition-all duration-300">
                        Developer <span className="text-[#0066FF] mx-2">|</span> Web & Mobile
                    </p>
                </div>
            </div>

            {/* Dynamic Scroll Indicator */}
            <div className="absolute bottom-12 flex flex-col items-center gap-2 z-20 pointer-events-none mix-blend-difference text-white">
                <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-[#0066FF] animate-[scrollDrop_2s_infinite]" />
                </div>
            </div>

            <style jsx global>{`
                @keyframes scrollDrop {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
            `}</style>

        </section>
    );
}
