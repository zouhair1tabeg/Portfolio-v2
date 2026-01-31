"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Database, Layout, Smartphone, Terminal, Cpu } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const TOOLBOX_CATEGORIES = [
    {
        id: "frontend",
        label: "Frontend",
        icon: Layout, // Blue
        color: "#0066FF",
        level: 95,
        skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "GSAP"]
    },
    {
        id: "core",
        label: "Core",
        icon: Code2, // Purple
        color: "#8B5CF6",
        level: 90,
        skills: ["JavaScript", "HTML5", "CSS3", "Python"]
    },
    {
        id: "backend",
        label: "Backend",
        icon: Database, // Cyan
        color: "#06B6D4",
        level: 85,
        skills: ["Node.js", "PostgreSQL", "Firebase", "Docker"]
    },
    {
        id: "mobile",
        label: "Mobile",
        icon: Smartphone, // Pink
        color: "#EC4899",
        level: 80,
        skills: ["Flutter", "React Native", "Swift", "Dart"]
    },
    {
        id: "creative",
        label: "Creative",
        icon: Cpu, // Orange
        color: "#F97316",
        level: 75,
        skills: ["Three.js", "WebGL", "Blender", "Generative Art"]
    },
    {
        id: "tools",
        label: "Tools",
        icon: Terminal, // Green
        color: "#10B981",
        level: 92,
        skills: ["Git", "VS Code", "Figma", "Postman"]
    }
];

export default function Skills() {
    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ScrollTrigger for Title Letters
            const titleLetters = titleRef.current?.querySelectorAll(".char");
            if (titleLetters) {
                gsap.from(titleLetters, {
                    y: 100,
                    rotateX: 90,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.05,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                    }
                });
            }

            // Stagger Cards
            gsap.from(".tilt-card", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                }
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Split text for Kinetic Title
    const titleText = "Digital Toolbox";

    return (
        <section ref={containerRef} id="skills" className="min-h-screen relative flex flex-col justify-center py-32 bg-[#030303] text-white overflow-hidden perspective-900">

            {/* 1. Kinetic Background Marquee */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 -rotate-6 z-0 pointer-events-none opacity-[0.03] select-none">
                <div className="whitespace-nowrap flex gap-10 animate-marquee">
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-[20vw] font-black uppercase leading-none" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
                            FULLSTACK CREATIVE DEVELOPER
                        </span>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 z-10 relative">

                {/* 2. Kinetic Typography Title */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 bg-[#0066FF] rounded-full animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-[0.4em] text-gray-400">Capabilities</span>
                    </div>
                    <h2 ref={titleRef} className="text-6xl md:text-8xl font-black tracking-tighter uppercase overflow-hidden" aria-label={titleText} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {titleText.split("").map((char, i) => (
                            <span key={i} className="char inline-block">{char}</span>
                        ))}
                    </h2>
                </div>

                {/* 3. 3D Parallax Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {TOOLBOX_CATEGORIES.map((category) => (
                        <TiltCard key={category.id} category={category} />
                    ))}
                </div>

            </div>
        </section>
    );
}

// ---- Sub Components ----

// 3D Tilt Card with GSAP Parallax
function TiltCard({ category }: { category: any }) {
    // We use Framer Motion for simple springs, but stick to the "gsap.quickTo" feel manually or via ref
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        // Center-based coordinates
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        x.set(offsetX);
        y.set(offsetY);
    };

    const handleMouseLeave = () => {
        setHover(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className="tilt-card relative group touch-none"
            style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* Card Container */}
            <div className="relative h-full bg-[#0A0A0A]/90 border border-white/10 rounded-3xl p-8 overflow-hidden backdrop-blur-sm transition-colors duration-500 group-hover:border-white/20">

                {/* 4. Connectivity Lines Background (SVG) */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <pattern id={`grid-${category.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                        </pattern>
                        <rect width="100%" height="100%" fill={`url(#grid-${category.id})`} />
                        {/* Lit path on hover */}
                        <motion.path
                            d="M 0 40 Q 150 40 300 200"
                            stroke={category.color}
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                    </svg>
                </div>

                {/* 5. Enhanced Spotlight (Dual Color) */}
                <div
                    className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                    style={{
                        background: `radial-gradient(400px circle at top right, ${category.color}20, transparent 40%), radial-gradient(400px circle at bottom left, #222, transparent 40%)`
                    }}
                />

                {/* Content */}
                <div ref={contentRef} className="relative z-10 flex flex-col gap-6" style={{ transform: "translateZ(30px)" }}>

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white" style={{ backgroundColor: `${category.color}10`, borderColor: `${category.color}30` }}>
                            <category.icon size={28} style={{ color: category.color }} />
                        </div>
                        <div className="text-right">
                            <h3 className="text-2xl font-bold uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {category.label}
                            </h3>
                            <motion.div
                                className="h-1 bg-white/10 rounded-full mt-2 w-24 ml-auto overflow-hidden"
                            >
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: category.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: hover ? `${category.level}%` : 0 }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* 6. Magnetic Chips */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        {category.skills.map((skill: string, idx: number) => (
                            <MagneticChip key={idx} text={skill} color={category.color} />
                        ))}
                    </div>

                </div>
            </div>
        </motion.div>
    );
}

// Magnetic Chip Component
function MagneticChip({ text, color }: { text: string, color: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    const { x, y } = position;
    return (
        <motion.div
            style={{ x, y }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="group/chip relative overflow-hidden px-4 py-2 bg-[#1a1a1a] rounded-lg border border-white/5 cursor-pointer"
        >
            <span className="relative z-10 text-sm font-medium text-gray-300 group-hover/chip:text-white transition-colors">
                {text}
            </span>
            {/* Progress Bar Effect on Chip Hover */}
            <div
                className="absolute left-0 bottom-0 top-0 bg-white/5 w-full origin-left scale-x-0 group-hover/chip:scale-x-100 transition-transform duration-500 ease-out"
                style={{ backgroundColor: `${color}20` }}
            />
        </motion.div>
    );
}
