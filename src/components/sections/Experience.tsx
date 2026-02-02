"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCE_DATA = [
    {
        year: "2025",
        title: "Licence Professionnelle",
        institution: "FST de Béni Mellal",
        date: "En cours",
        description: "Advanced studies in Software Engineering & Digital Transformation.",
        current: true,
        type: "Education"
    },
    {
        year: "2023",
        title: "Technicien Spécialisé",
        institution: "Dev Mobile (OFPPT)",
        date: "2023 - 2025",
        description: "Specialized training in mobile development (Flutter, Kotlin) and ecosystem.",
        current: false,
        type: "Education"
    },
    {
        year: "2022",
        title: "Bac Sciences Physiques",
        institution: "High School",
        date: "2022 - 2023",
        description: "Scientific baccalaureate with focus on Physics and Chemistry.",
        current: false,
        type: "Education"
    }
];

export default function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const runnerRef = useRef<SVGCircleElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Vertical Marquee (Infinite Scroll)
            gsap.to(marqueeRef.current, {
                yPercent: -50,
                duration: 20,
                ease: "linear",
                repeat: -1
            });

            // 2. Liquid SVG Path & Runner
            if (pathRef.current && runnerRef.current) {
                const length = pathRef.current.getTotalLength();

                // Set initial dash
                gsap.set(pathRef.current, {
                    strokeDasharray: length,
                    strokeDashoffset: length
                });

                // Animate Path Drawing
                gsap.to(pathRef.current, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        end: "bottom 90%",
                        scrub: 1
                    }
                });

                // Animate Runner (Approximate travel along Y)
                // Real motion path requiring visual match
                gsap.to(runnerRef.current, {
                    motionPath: {
                        path: pathRef.current,
                        align: pathRef.current,
                        alignOrigin: [0.5, 0.5],
                    },
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        end: "bottom 90%",
                        scrub: 1
                    }
                });
            }

            // 3. Reveal Cards
            const cards = gsap.utils.toArray<HTMLElement>(".aero-card-wrapper");
            cards.forEach((card, i) => {
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        x: i % 2 === 0 ? 50 : -50, // Alternate entry
                        rotateY: i % 2 === 0 ? 15 : -15
                    },
                    {
                        opacity: 1,
                        x: 0,
                        rotateY: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                        }
                    }
                );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="experience" className="min-h-screen bg-[#050505] text-white py-32 relative overflow-hidden flex">

            {/* Left Vertical Marquee */}
            <div className="absolute left-0 top-0 bottom-0 w-24 border-r border-white/5 opacity-50 hidden md:flex items-center justify-center overflow-hidden mix-blend-difference z-0">
                <div ref={marqueeRef} className="whitespace-nowrap flex flex-col gap-12 text-xs font-mono tracking-[0.5em] text-white/40 writing-vertical-lr h-max py-12">
                    <span className="rotate-180">EDUCATION • EXPERIENCE • EVOLUTION</span>
                    <span className="rotate-180">EDUCATION • EXPERIENCE • EVOLUTION</span>
                    <span className="rotate-180">EDUCATION • EXPERIENCE • EVOLUTION</span>
                    <span className="rotate-180">EDUCATION • EXPERIENCE • EVOLUTION</span>
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-0 relative z-10 w-full pl-0 md:pl-32">

                {/* Heading */}
                <div className="mb-24 md:pl-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="h-px w-12 bg-[#0066FF]"></span>
                        <span className="text-[#0066FF] font-mono uppercase tracking-widest text-xs">Career Timeline</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Digital <span className="text-transparent" style={{ WebkitTextStroke: "1px white" }}>Evolution</span>
                    </h2>
                </div>


                <div ref={containerRef} className="relative max-w-5xl mx-auto min-h-[1000px]">

                    {/* SVG Liquid Line */}
                    <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[200px] h-full pointer-events-none z-0">
                        <svg className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#0066FF" />
                                    <stop offset="50%" stopColor="#0066FF" />
                                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            {/* Sinusoidal Path */}
                            <path
                                ref={pathRef}
                                d="M 100 0 Q 150 200 100 400 T 100 800 T 100 1200"
                                fill="none"
                                stroke="url(#line-gradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="opacity-80 drop-shadow-[0_0_10px_rgba(0,102,255,0.5)]"
                            />
                            {/* Runner Glow Point */}
                            <circle
                                ref={runnerRef}
                                cx="0" cy="0" r="6"
                                fill="white"
                                className="filter drop-shadow-[0_0_15px_#0066FF]"
                            />
                        </svg>
                    </div>


                    {/* Cards */}
                    <div className="space-y-40 py-20">
                        {EXPERIENCE_DATA.map((item, index) => (
                            <div
                                key={index}
                                className={`flex w-full relative aero-card-wrapper items-center ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                                    } justify-start pl-16 md:pl-0`}
                            >
                                {/* Magnetic Dot (Absolute Centered) */}
                                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-[#0066FF] z-20 shadow-[0_0_20px_#0066FF]" />

                                {/* The Card */}
                                <AeroCard item={item} />

                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}

// Aero-Tech Card Component
function AeroCard({ item }: { item: any }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const yearRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;

        gsap.to(cardRef.current, {
            rotateY: x,
            rotateX: -y,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`
                relative w-full md:w-[45%] bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 
                group transition-all duration-300 hover:border-[#0066FF]/50 hover:shadow-[0_0_50px_-10px_rgba(0,102,255,0.15)]
                perspective-1000
            `}
        >
            {/* Giant Background Year */}
            <div
                ref={yearRef}
                className="absolute right-0 bottom-0 text-[8rem] md:text-[10rem] font-black leading-none text-transparent opacity-5 pointer-events-none select-none z-0 translate-y-10 group-hover:translate-y-0 transition-transform duration-700"
                style={{ WebkitTextStroke: "2px white", fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {item.year}
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="flex items-center gap-2 text-[#0066FF] text-xs font-bold uppercase tracking-widest border border-[#0066FF]/20 px-3 py-1 rounded-full bg-[#0066FF]/5">
                        <Briefcase size={12} />
                        {item.type}
                    </span>
                    {item.current && (
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0066FF]"></span>
                        </span>
                    )}
                </div>

                <h3 className="text-3xl font-bold text-white mb-2 font-display group-hover:text-[#0066FF] transition-colors">
                    {item.title}
                </h3>
                <p className="text-xl text-gray-400 font-light mb-4 flex items-center gap-2">
                    {item.institution}
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span className="text-white/60 text-sm font-mono">{item.date}</span>
                </p>
                <p className="text-gray-500 leading-relaxed text-sm max-w-sm">
                    {item.description}
                </p>
            </div>

            {/* Inner Glow Effect using radial gradient */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen"
                style={{ background: "radial-gradient(circle at 50% -20%, rgba(0, 102, 255, 0.15), transparent 70%)" }}
            />
        </div>
    );
}

