"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCE_DATA = [
    {
        title: "Licence Professionnelle",
        institution: "FST de Béni Mellal",
        date: "En cours",
        description: "Advanced studies in Software Engineering & Digital Transformation.",
        current: true
    },
    {
        title: "Technicien Spécialisé",
        institution: "Dev Mobile (OFPPT)",
        date: "2023 - 2025",
        description: "Specialized training in mobile development (Flutter, Kotlin) and ecosystem.",
        current: false
    },
    {
        title: "Bac Sciences Physiques",
        institution: "High School",
        date: "2022 - 2023",
        description: "Scientific baccalaureate with focus on Physics and Chemistry.",
        current: false
    }
];

export default function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. SVG Line Drawing Animation
            if (pathRef.current) {
                const length = pathRef.current.getTotalLength();
                gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

                gsap.to(pathRef.current, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: timelineRef.current,
                        start: "top 70%",
                        end: "bottom 80%",
                        scrub: 1
                    }
                });
            }

            // 2. Staggered Timeline Cards
            gsap.utils.toArray<HTMLElement>(".exp-card").forEach((card, i) => {
                gsap.from(card, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="experience" className="min-h-screen bg-[#050505] text-white pt-32 pb-32 relative overflow-hidden">

            <div className="container mx-auto px-6 md:px-12">

                {/* --- 1. Experience Timeline --- */}
                <div ref={timelineRef} className="max-w-4xl mx-auto relative">
                    <h2 className="text-3xl font-bold mb-16 pl-12 text-[#0066FF] uppercase tracking-widest font-mono">Career Path</h2>

                    {/* SVG Line Container */}
                    <div className="absolute left-[19px] top-24 bottom-10 w-0.5 h-full z-0 hidden md:block">
                        <svg className="h-full w-[4px] overflow-visible" preserveAspectRatio="none">
                            <path
                                ref={pathRef}
                                d="M 1 0 V 800" // Simple vertical line, adjustable height via viewBox/height
                                fill="none"
                                stroke="#0066FF"
                                strokeWidth="2"
                                className="drop-shadow-[0_0_8px_rgba(0,102,255,0.8)]"
                            />
                        </svg>
                    </div>

                    <div className="space-y-16 relative z-10">
                        {EXPERIENCE_DATA.map((item, i) => (
                            <div key={i} className="exp-card relative md:pl-12 group">
                                {/* Glowing Dot */}
                                <div className={`absolute left-0.5 top-2 w-10 h-10 -translate-x-1/2 flex items-center justify-center transition-all duration-300 ${item.current ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    <div className={`w-4 h-4 rounded-full ${item.current ? 'bg-[#0066FF] shadow-[0_0_20px_#0066FF]' : 'bg-zinc-800 border border-zinc-600 group-hover:bg-[#0066FF] group-hover:shadow-[0_0_15px_#0066FF]'} transition-all`} />
                                </div>

                                {/* Glass Card */}
                                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <h3 className="text-2xl font-bold font-display">{item.title}</h3>
                                        <span className={`text-xs font-mono py-1 px-3 rounded-full ${item.current ? 'bg-[#0066FF]/20 text-[#0066FF]' : 'bg-white/5 text-gray-400'}`}>
                                            {item.date}
                                        </span>
                                    </div>
                                    <p className="text-lg text-gray-300 mb-2">{item.institution}</p>
                                    <p className="text-sm text-gray-500 font-light">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
