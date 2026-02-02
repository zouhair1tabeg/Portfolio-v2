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
                            <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
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

// 3D Tilt Card with GSAP Parallax & Glare
function TiltCard({ category }: { category: any }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smoother, subtler rotation for "Heavy Premium" feel
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    // Glare position (moves opposite to mouse)
    const glareX = useTransform(x, [-100, 100], [100, 0]);
    const glareY = useTransform(y, [-100, 100], [100, 0]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

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
            className="tilt-card relative group touch-none h-full"
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
            <div className="relative h-full bg-[#0A0A0A]/90 border border-white/5 rounded-3xl p-8 overflow-hidden backdrop-blur-md transition-colors duration-500 group-hover:border-white/20 group-hover:bg-[#0A0A0A]">

                {/* 4. Connectivity Lines Background (SVG) */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <pattern id={`grid-${category.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                        </pattern>
                        <rect width="100%" height="100%" fill={`url(#grid-${category.id})`} />
                        <motion.path
                            d="M 0 40 Q 150 40 300 200"
                            stroke={category.color}
                            strokeWidth="1.5"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: hover ? 1 : 0, opacity: hover ? 0.8 : 0 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                    </svg>
                </div>

                {/* 5. Spotlight Border Effect */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-3xl z-50"
                    style={{
                        background: `radial-gradient(400px circle at ${x.get() + 300}px ${y.get() + 200}px, rgba(0, 102, 255, 0.4), transparent 40%)`,
                        // We use state/motion value for coordinates. Since 'x' and 'y' are centered offsets in TiltCard,
                        // we need to map them back to strict mouse coordinates relative to card for the border gradient.
                        // Actually, plain CSS mask or a dedicated new mouse listener using local coords is better for "border follow".
                    }}
                />
                {/* Better Spotlight Implementation: */}
                <SpotlightBorder />

                {/* Content */}
                <div className="relative z-20 flex flex-col gap-6 h-full justify-between" style={{ transform: "translateZ(30px)" }}>

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="p-3.5 rounded-2xl bg-[#0F0F0F] border border-white/5 shadow-2xl" style={{ boxShadow: `0 8px 30px -10px ${category.color}20` }}>
                            <category.icon size={26} style={{ color: category.color }} />
                        </div>
                        <div className="text-right">
                            <h3 className="text-xl font-bold uppercase tracking-tight text-white/90" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {category.label}
                            </h3>
                            {/* Animated Level Bar */}
                            <div className="h-0.5 bg-white/5 rounded-full mt-3 w-20 ml-auto overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: category.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: hover ? `${category.level}%` : "15%" }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 7. Magnetic Chips with Stagger */}
                    <motion.div
                        className="flex flex-wrap gap-2.5 mt-2"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.05 } }
                        }}
                    >
                        {category.skills.map((skill: string, idx: number) => (
                            <MagneticChip key={idx} text={skill} color={category.color} />
                        ))}
                    </motion.div>

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
        // Reduced movement range for cleaner effect
        setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
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
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
            }}
            className="group/chip relative overflow-hidden px-3 py-1.5 bg-[#141414] rounded-md border border-white/5 cursor-pointer backdrop-blur-sm"
        >
            <span className="relative z-10 text-[11px] font-semibold uppercase tracking-wider text-gray-400 group-hover/chip:text-white transition-colors">
                {text}
            </span>

            {/* Hover Fill Effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover/chip:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: color }}
            />

            {/* Bottom Highlight Line */}
            <div
                className="absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 group-hover/chip:scale-x-100 transition-transform duration-300"
                style={{ backgroundColor: color }}
            />
        </motion.div>
    );
}

// Spotlight Helper Component
function SpotlightBorder() {
    const divRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.parentElement!.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className="absolute inset-0 z-50 rounded-3xl pointer-events-auto"
        >
            <div
                className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 102, 255, 0.15), transparent 40%)`
                }}
            />
            {/* Border glow specific */}
            <div
                className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(0, 102, 255, 0.6), transparent 40%)`,
                    maskImage: "linear-gradient(black, black), linear-gradient(black, black)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                    padding: "1px", // Border width
                }}
            >
                <div className="w-full h-full bg-transparent rounded-3xl" />
            </div>
        </div>
    );
}
