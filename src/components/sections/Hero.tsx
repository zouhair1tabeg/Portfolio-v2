"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ParticlesBackground from "@/components/canvas/ParticlesBackground";
import { MoveRight } from "lucide-react";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const firstNameRef = useRef<HTMLHeadingElement>(null);
    const lastNameRef = useRef<HTMLHeadingElement>(null);
    const subHeaderRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);
    const bottomElementsRef = useRef<HTMLDivElement>(null);

    // Parallax Logic
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!contentRef.current || !orbRef.current) return;
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();

        const x = (clientX / width - 0.5) * 40;
        const y = (clientY / height - 0.5) * 40;

        gsap.to(contentRef.current, {
            x: -x,
            y: -y,
            rotateX: y * 0.05,
            rotateY: -x * 0.05,
            duration: 1,
            ease: "power2.out"
        });

        // Orb loosely follows horizontal cursor position, slightly vertical
        gsap.to(orbRef.current, {
            x: (clientX - width / 2) * 0.5,
            y: (clientY - height / 2) * 0.5,
            duration: 2,
            ease: "power3.out"
        });
    };

    const handleMouseLeave = () => {
        if (!contentRef.current || !orbRef.current) return;
        gsap.to(contentRef.current, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 1,
            ease: "power2.out"
        });
        gsap.to(orbRef.current, {
            x: 0,
            y: 0,
            duration: 2,
            ease: "power3.out"
        });
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            const firstChars = firstNameRef.current?.querySelectorAll(".char");
            const lastChars = lastNameRef.current?.querySelectorAll(".char");

            // Sleek Reveal Animation
            tl.fromTo([...(firstChars || []), ...(lastChars || [])], {
                y: 120,
                opacity: 0,
                rotateX: -90,
                scale: 0.8
            }, {
                y: 0,
                opacity: 1,
                rotateX: 0,
                scale: 1,
                duration: 1.5,
                stagger: 0.03,
            })
                .fromTo([badgeRef.current, subHeaderRef.current], {
                    y: 20,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.1
                }, "-=1.0")
                .fromTo(bottomElementsRef.current, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 1
                }, "-=0.5");

            // Infinite orb pulse
            if (orbRef.current) {
                gsap.to(orbRef.current, {
                    scale: 1.2,
                    opacity: 0.4,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const SplitText = ({ text, className, style }: { text: string, className?: string, style?: any }) => (
        <span className={`inline-block whitespace-nowrap ${className}`} style={style}>
            {text.split("").map((char, i) => (
                <span key={i} className="char inline-block origin-bottom" style={{ display: "inline-block" }}>
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );

    const scrollToWorks = () => {
        const worksSection = document.getElementById("works") || document.getElementById("projects");
        if (worksSection) {
            worksSection.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }
    };

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-white [perspective:2000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background: Particles */}
            <div className="absolute inset-0 z-0">
                <ParticlesBackground />
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            {/* Glowing Orb */}
            <div
                ref={orbRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[#0066FF] blur-[100px] opacity-20 pointer-events-none z-[1] mix-blend-screen"
            />

            {/* Main Content (Parallax Target) */}
            <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none select-none [transform-style:preserve-3d] mt-12 md:mt-0">

                {/* Status Badge */}
                <div ref={badgeRef} className="mb-8 md:mb-12 pointer-events-auto">
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors duration-300">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0066FF]"></span>
                        </span>
                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-300">Available for freelance</span>
                    </div>
                </div>

                {/* Typography */}
                <div className="relative flex flex-col items-center leading-[0.8] mb-6">
                    <h1 ref={firstNameRef} className="relative z-10">
                        <SplitText
                            text="Zouhair"
                            className="font-black text-[15vw] md:text-[12vw] tracking-tighter text-white uppercase"
                            style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                        />
                    </h1>

                    <h1 ref={lastNameRef} className="relative z-10 group pointer-events-auto cursor-default -mt-2 md:-mt-6">
                        <span
                            className="font-black text-[15vw] md:text-[14vw] tracking-tighter uppercase relative block transition-all duration-500 ease-out group-hover:text-[#0066FF]"
                            style={{
                                fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                                color: "transparent",
                                WebkitTextStroke: "2px rgba(255,255,255,0.7)"
                            }}
                        >
                            <SplitText text="Tabeg" />
                        </span>
                        <div className="absolute inset-0 blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-[#0066FF] z-[-1]" />
                    </h1>
                </div>

                {/* Sub-header & CTA */}
                <div ref={subHeaderRef} className="mt-8 flex flex-col items-center gap-8 pointer-events-auto w-full px-6">
                    <p className="text-sm md:text-base tracking-[0.25em] md:tracking-[0.4em] uppercase text-gray-400 font-light text-center max-w-xl leading-relaxed">
                        Crafting digital <span className="text-white font-medium mx-1">experiences</span> through code & design
                    </p>

                    <button
                        onClick={scrollToWorks}
                        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 cursor-none"
                    >
                        <div className="absolute inset-0 bg-[#0066FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        <span className="relative z-10 font-bold uppercase tracking-widest text-xs group-hover:text-white transition-colors duration-300">Explore Work</span>
                        <MoveRight className="relative z-10 w-4 h-4 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>

            {/* Edge Meta Graphics */}
            <div ref={bottomElementsRef} className="absolute bottom-10 flex w-full justify-between items-end px-6 md:px-12 z-20 pointer-events-none mix-blend-difference text-white/50 text-[10px] md:text-xs font-mono uppercase tracking-widest">
                <div className="hidden md:flex flex-col gap-1">
                    <span>Creative Developer</span>
                    <span>Based in France</span>
                </div>

                <div className="flex flex-col items-center gap-3 flex-1 md:flex-none">
                    <span className="[writing-mode:vertical-lr] rotate-180 hidden md:block">Scroll</span>
                    <span className="md:hidden">Scroll</span>
                    <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden hidden md:block">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[scrollDrop_1.5s_infinite_ease-in-out]" />
                    </div>
                    {/* Horizontal scroll indicator for mobile */}
                    <div className="h-[1px] w-12 bg-white/20 relative overflow-hidden md:hidden">
                        <div className="absolute top-0 left-0 h-full w-1/2 bg-white animate-[scrollRight_1.5s_infinite_ease-in-out]" />
                    </div>
                </div>

                <div className="hidden md:flex flex-col gap-1 text-right">
                    <span>Portfolio</span>
                    <span>© {new Date().getFullYear()}</span>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scrollDrop {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
                @keyframes scrollRight {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </section>
    );
}
