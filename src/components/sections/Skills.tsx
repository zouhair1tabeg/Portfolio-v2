"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Database, Layout, Smartphone, Terminal, Cpu } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TOOLBOX_CATEGORIES = [
    {
        id: "frontend",
        label: "Frontend Engineering",
        icon: Layout,
        skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"]
    },
    {
        id: "core",
        label: "Core Languages",
        icon: Code2,
        skills: ["JavaScript (ES6+)", "HTML5", "CSS3 / SCSS", "Python", "PHP"]
    },
    {
        id: "backend",
        label: "Backend & Cloud",
        icon: Database,
        skills: ["Node.js", "PostgreSQL", "Firebase", "Supabase", "Docker", "Vercel"]
    },
    {
        id: "mobile",
        label: "Mobile Development",
        icon: Smartphone,
        skills: ["Flutter", "React Native", "Swift", "Dart"]
    },
    {
        id: "tools",
        label: "Dev Tools",
        icon: Terminal,
        skills: ["Git / GitHub", "VS Code", "Figma", "Postman", "Webpack"]
    },
    {
        id: "creative",
        label: "Creative / 3D",
        icon: Cpu,
        skills: ["Three.js / R3F", "WebGL", "Blender", "Generative Art"]
    }
];

export default function Skills() {
    const containerRef = useRef<HTMLElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(boxRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Spotlight Effect State
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - left,
            y: e.clientY - top,
        });
    };

    return (
        <section ref={containerRef} id="skills" className="min-h-screen flex items-center justify-center py-24 bg-[#050505] text-white">
            <div className="container mx-auto px-4 lg:px-20">

                {/* Section Title */}
                <div className="text-center mb-16">
                    <span className="text-[#0066FF] font-mono tracking-[0.3em] text-xs uppercase">The Stack</span>
                    <h2 className="mt-4 text-5xl md:text-6xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Digital <span className="text-transparent" style={{ WebkitTextStroke: "1px white" }}>Toolbox</span>
                    </h2>
                </div>

                {/* The Luxury Box */}
                <div
                    ref={boxRef}
                    onMouseMove={handleMouseMove}
                    className="relative w-full max-w-6xl mx-auto rounded-[2rem] bg-neutral-950/80 border border-white/5 overflow-hidden group"
                    style={{ backdropFilter: "blur(20px)" }}
                >
                    {/* Spotlight Gradient overlay */}
                    <div
                        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 102, 255, 0.1), transparent 40%)`
                        }}
                    />

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
                        {TOOLBOX_CATEGORIES.map((category) => (
                            <div
                                key={category.id}
                                className="relative p-8 md:p-10 bg-[#080808] hover:bg-[#0c0c0c] transition-colors duration-500"
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-xl bg-white/5 text-[#0066FF] border border-white/5">
                                        <category.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-white/90">
                                        {category.label}
                                    </h3>
                                </div>

                                {/* Skills Chips */}
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill, idx) => (
                                        <div
                                            key={idx}
                                            className="px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-sm text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,102,255,0.3)] transition-all duration-300 cursor-default"
                                        >
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Box Footer (Decorative) */}
                    <div className="bg-[#080808] p-4 text-center border-t border-white/5">
                        <div className="inline-flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-mono">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            System Status: Optimized
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
