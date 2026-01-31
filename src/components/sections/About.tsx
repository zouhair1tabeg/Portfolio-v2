"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const containerRef = useRef<HTMLElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Image Reveal Animation (Mask)
            gsap.fromTo(
                imageWrapperRef.current,
                { clipPath: "inset(0 100% 0 0)" },
                {
                    clipPath: "inset(0 0% 0 0)",
                    duration: 1.5,
                    ease: "power3.inOut",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        end: "bottom bottom",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // 2. Image Parallax
            gsap.fromTo(
                imageRef.current,
                { scale: 1.3 },
                {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                }
            );

            // 3. Text Stagger
            const splitText = textRef.current?.children;
            if (splitText) {
                gsap.from(splitText, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top 75%",
                    },
                });
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="about" className="min-h-screen flex items-center py-24 bg-zinc-950 text-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 md:gap-24">

                {/* Image Side - Premium Reveal */}
                <div className="w-full md:w-5/12 relative">
                    <div ref={imageWrapperRef} className="relative aspect-[3/4] overflow-hidden rounded-sm">
                        <Image
                            ref={imageRef}
                            src="/images/profile.jpg"
                            alt="Tabeg Zouhair"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        {/* Overlay filter for mood */}
                        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 border-r border-b border-white/20 -z-10" />
                </div>

                {/* Text Side - Editorial Style */}
                <div ref={textRef} className="w-full md:w-7/12 space-y-10">
                    <div className="space-y-4">
                        <h4 className="text-blue-500 uppercase tracking-[0.2em] text-sm font-medium">Who I Am</h4>
                        <h2 className="text-4xl md:text-6xl font-bold font-display leading-tight">
                            Crafting digital <br />
                            <span className="text-gray-500">masterpieces.</span>
                        </h2>
                    </div>

                    <div className="space-y-6 text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl">
                        <p>
                            I am <strong className="text-white font-normal">Tabeg Zouhair</strong>, a web and mobile developer based in Morocco.
                            I don't just write code; I engineer immersive experiences.
                        </p>
                        <p>
                            My passion lies in the intersection of <span className="text-white">stunning design</span> and <span className="text-white">robust engineering</span>.
                            Whether it's a high-performance web application or a fluid mobile experience, I obsess over every pixel and interaction.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/10">
                        <div>
                            <h3 className="text-5xl font-bold text-white mb-2 font-display">3+</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Years Experience</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-bold text-white mb-2 font-display">20+</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Projects Delivered</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
