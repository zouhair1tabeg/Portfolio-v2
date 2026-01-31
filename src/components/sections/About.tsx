"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const bigTextRef = useRef<HTMLHeadingElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Background Big Text Parallax (Inverted)
            gsap.to(bigTextRef.current, {
                x: "-10%",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                }
            });

            // 2. Image "Stretch" Reveal
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    end: "bottom bottom",
                    toggleActions: "play none none reverse",
                }
            });

            tl.fromTo(imageWrapperRef.current,
                {
                    clipPath: "inset(0% 100% 0% 0%)",
                    scaleY: 1.5,
                    opacity: 0
                },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    scaleY: 1,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power4.inOut"
                }
            )
                // 3. Image Inner Parallax (Zoom Out)
                .fromTo(".about-img",
                    { scale: 1.3 },
                    { scale: 1, duration: 1.5, ease: "power2.out" },
                    "<"
                );

            // 4. Text Reveal (Line by Line with Rotation)
            const textLines = titleRef.current?.querySelectorAll(".word-line");
            if (textLines) {
                gsap.from(textLines, {
                    y: 100,
                    rotate: 5,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: "top 75%",
                    }
                });
            }

            // 5. Data Cards Reveal
            if (statsRef.current) {
                gsap.from(statsRef.current.children, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "back.out(1.7)",
                    delay: 0.5,
                    scrollTrigger: {
                        trigger: imageWrapperRef.current,
                        start: "top 60%",
                    }
                });
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="about" className="min-h-screen relative flex items-center py-32 bg-gradient-to-b from-[#050505] to-[#0a0a0a] text-white overflow-hidden">

            {/* Background Big Text */}
            <div className="absolute top-1/4 left-0 w-full pointer-events-none select-none z-0 mix-blend-color-dodge opacity-20">
                <h1 ref={bigTextRef} className="text-[25vw] font-black leading-none whitespace-nowrap text-transparent"
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        WebkitTextStroke: "2px #333"
                    }}>
                    MOROCCO <span className="text-[2vw] font-mono tracking-widest align-middle text-white ml-8">32.5°N, 6.5°W</span>
                </h1>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row gap-16 md:gap-32">

                    {/* Left: Image & Stats (Asymmetric Layout - Shifted Up) */}
                    <div className="w-full md:w-5/12 relative md:-mt-12 order-2 md:order-1">

                        {/* Main Image Container */}
                        <div ref={imageWrapperRef} className="relative aspect-[3/4] w-full overflow-hidden shadow-2xl bg-gray-900 origin-bottom">
                            <Image
                                src="/images/profile.jpg"
                                alt="Zouhair Tabeg"
                                fill
                                className="about-img object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                                priority
                            />
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            {/* Rotating Badge */}
                            <div className="absolute top-6 right-6 w-24 h-24 md:w-32 md:h-32 animate-[spin_10s_linear_infinite]">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                    <text className="text-[11px] font-bold uppercase tracking-widest fill-white">
                                        <textPath href="#circlePath" startOffset="0%">
                                            Available for Projects • Open for Work •
                                        </textPath>
                                    </text>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ArrowUpRight className="w-6 h-6 text-[#0066FF]" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Data Cards (Overlapping) */}
                        <div ref={statsRef} className="absolute -bottom-12 -right-6 md:-right-16 flex flex-col gap-4 z-20">
                            <DataCard label="Years Exp." value="3+" sub="Design & Dev" />
                            <DataCard label="Projects" value="20+" sub="Delivered" delay={0.2} />
                        </div>

                        {/* Decor Lines */}
                        <div className="absolute -left-8 top-12 w-px h-32 bg-white/20"></div>
                        <div className="absolute -left-8 top-12 w-8 h-px bg-white/20"></div>

                    </div>

                    {/* Right: Editorial Content */}
                    <div className="w-full md:w-6/12 flex flex-col justify-center order-1 md:order-2">

                        <div ref={titleRef} className="mb-12 relative">
                            {/* Tag */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-px w-10 bg-[#0066FF]"></span>
                                <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#0066FF]">About The Developer</span>
                            </div>

                            {/* Brutalist/Serif Mixed Headline */}
                            <h2 className="text-5xl md:text-7xl font-bold leading-[0.9] text-white mix-blend-difference">
                                <div className="overflow-hidden">
                                    <span className="word-line block font-serif italic font-light tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Configuring</span>
                                </div>
                                <div className="overflow-hidden">
                                    <span className="word-line block text-transparent" style={{ WebkitTextStroke: "1px white", fontFamily: "'Space Grotesk', sans-serif" }}>DIGITAL</span>
                                </div>
                                <div className="overflow-hidden">
                                    <span className="word-line block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>REALITY.</span>
                                </div>
                            </h2>
                        </div>

                        {/* PRESERVED USER CONTENT WITH IMPROVED STYLING */}
                        <div className="space-y-8 max-w-lg">
                            <div className="text-lg md:text-xl text-gray-400 font-light leading-relaxed border-l border-white/10 pl-6 space-y-6">
                                <p>
                                    I am <strong className="text-white font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tabeg Zouhair</strong>, a web and mobile developer based in <strong className="text-white font-normal">Morocco</strong>.
                                    I don't just write code; I <span className="italic text-white font-serif">engineer immersive experiences</span>.
                                </p>
                                <p>
                                    My passion lies in the intersection of <span className="text-white border-b border-[#0066FF]/30 pb-0.5">stunning design</span> and <span className="text-white border-b border-[#0066FF]/30 pb-0.5">robust engineering</span>.
                                    Whether it's a high-performance web application or a fluid mobile experience, I obsess over every pixel and interaction.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-mono text-gray-500 pl-6">
                                <MapPin size={16} className="text-[#0066FF]" />
                                <span>32.5574° N, 6.5186° W</span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                <span>GMT+1</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

// ... imports remain the same

// Helper for magnetic effect
function MagneticWrapper({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    return (
        <div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ transform: `translate(${position.x}px, ${position.y}px)`, transition: "transform 0.2s ease-out" }}
        >
            {children}
        </div>
    );
}

function DataCard({ label, value, sub, delay = 0 }: { label: string, value: string, sub: string, delay?: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const valueRef = useRef<HTMLHeadingElement>(null);
    // Parse number from string (e.g. "20+" -> 20)
    const numValue = parseInt(value);
    const suffix = value.replace(/[0-9]/g, '');

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Counter Animation
            gsap.from(valueRef.current, {
                textContent: 0,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                stagger: 1,
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 85%",
                },
                onUpdate: function () {
                    if (valueRef.current) {
                        valueRef.current.innerHTML = Math.ceil(this.targets()[0].textContent) + suffix;
                    }
                }
            });
        }, cardRef);
        return () => ctx.revert();
    }, [numValue, suffix]);

    return (
        <MagneticWrapper>
            <div ref={cardRef} className="bg-[#0f0f0f]/90 border border-white/10 p-6 w-48 shadow-2xl backdrop-blur-md group hover:border-[#0066FF] hover:bg-[#0f0f0f] transition-all duration-500 cursor-default relative overflow-hidden">
                {/* Hover Glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#0066FF]/10 blur-xl rounded-full translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform duration-500" />

                <h3 ref={valueRef} className="text-4xl font-black text-white mb-2 group-hover:text-[#0066FF] transition-colors relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {value}
                </h3>
                <div className="h-0.5 w-8 bg-white/20 mb-3 group-hover:w-full group-hover:bg-[#0066FF] transition-all duration-500" />
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1 relative z-10">{label}</p>
                <p className="text-[10px] text-gray-500 font-mono relative z-10 group-hover:text-gray-300 transition-colors">{sub}</p>
            </div>
        </MagneticWrapper>
    );
}
