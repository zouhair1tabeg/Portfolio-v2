"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TERMINAL_LOGS = [
    "INITIALIZING_KERNEL...",
    "LOADING_REACT_ENGINE_V19...",
    "CONNECTING_DATABASE_NODES...",
    "OPTIMIZING_GRAPHICS_PIPELINE...",
    "LOADING_SKILLS_MODULE: [FLUTTER, NEXT.JS, THREE.JS]...",
    "ESTABLISHING_SECURE_CONNECTION...",
    "LOCATION_DETECTED: MOROCCO (32.5N, 6.5W)...",
    "SYSTEM_READY."
];

const CODE_SYMBOLS = ["< / >", "{ }", "[ ]", "&&", "||", "=>"];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const circleRef = useRef<SVGCircleElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const logsRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    // Circle Props
    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    // Cleanup
                    gsap.set(containerRef.current, { display: "none" });
                    onComplete();
                }
            });

            // 1. Initial Set
            gsap.set(circleRef.current, { strokeDasharray: circumference, strokeDashoffset: circumference });
            gsap.set(logsRef.current, { opacity: 0 });

            // 2. Loading Animation
            tl.to(logsRef.current, { opacity: 1, duration: 0.5 })
                .to(circleRef.current, {
                    strokeDashoffset: 0,
                    duration: 3,
                    ease: "power2.inOut",
                    onUpdate: function () {
                        // Update Text Counter
                        const progress = Math.round(this.progress() * 100);
                        if (counterRef.current) {
                            counterRef.current.innerText = progress.toString();
                        }
                    }
                }, "<");

            // Terminal Logs Stagger Logic (Run independently alongside main loading)
            // We can't strictly sync valid logs to percentage easily without complex logic, 
            // so we'll just cycle them fast.
            const logLines = logsRef.current?.children;
            if (logLines) {
                gsap.fromTo(logLines,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.2, stagger: 0.3, ease: "power1.out" }
                );
            }

            // Orbiting Symbols Animation (Continuous)
            gsap.to(".orbit-symbol", {
                rotation: 360,
                duration: 10,
                repeat: -1,
                ease: "none",
                transformOrigin: "center center" // Relative to orbit center
            });

            // ZT Logo Pulse
            gsap.to(logoRef.current, {
                scale: 1.1,
                opacity: 0.8,
                duration: 0.8,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });


            // 3. Exit Animation (The Explosion)
            // Force completion logs
            tl.to(counterRef.current, {
                scale: 1.5,
                opacity: 0,
                filter: "blur(10px)",
                duration: 0.3
            }, "-=0.2");

            tl.to(logsRef.current, { opacity: 0, y: 20, duration: 0.3 }, "<");
            tl.to(logoRef.current, { opacity: 0, scale: 0, duration: 0.3 }, "<");

            // SVG Circle Explosion
            // We scale the circle stroke or fill? Request says "agrandir brutalement pour remplir tout l'écran"
            // Filling stroke width until it covers screen is one cool way, OR just scaling the whole SVG/Circle.
            // Stroke width expansion feels more "filling".
            tl.to(circleRef.current, {
                strokeWidth: 2000, // Massive expansion
                stroke: "#0066FF",
                duration: 0.8,
                ease: "power4.in",
            }, "-=0.1");

            // Final Fade Out of the whole blue screen to reveal site
            // Actually, if we fill screen with blue, we need to fade THAT out.
            // Or we just dissolve the container.
            tl.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out"
            });

        }, containerRef);

        return () => ctx.revert();
    }, [circumference]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden">

            {/* 2. Identity: ZT Logo (Pulsing, Top Center or Behind?) 
                Request: "Ajoute ton logo "ZT" qui pulse... Utilise des symboles... qui gravitent"
            */}
            <div ref={logoRef} className="absolute top-12 left-1/2 -translate-x-1/2 text-[#0066FF] font-black text-2xl tracking-tighter mix-blend-screen opacity-50">
                ZT.SYSTEMS
            </div>

            {/* Main Center Stage */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">

                {/* Orbiting Symbols Container */}
                <div className="absolute inset-0 animate-[spin_12s_linear_infinite_reverse]">
                    {CODE_SYMBOLS.map((sym, i) => {
                        const angle = (i / CODE_SYMBOLS.length) * 360;
                        return (
                            <div
                                key={i}
                                className="orbit-symbol absolute text-gray-700 font-mono text-sm font-bold"
                                style={{
                                    top: "50%",
                                    left: "50%",
                                    transform: `rotate(${angle}deg) translate(140px) rotate(-${angle}deg)` // Position on circle
                                }}
                            >
                                {sym}
                            </div>
                        );
                    })}
                </div>

                {/* SVG Progress Circle */}
                <svg ref={svgRef} className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                    {/* Track */}
                    <circle cx="100" cy="100" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="2" />
                    {/* Progress Indicator */}
                    <circle
                        ref={circleRef}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#0066FF"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Counter */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span ref={counterRef} className="text-6xl font-black text-white tabular-nums tracking-tighter font-sans">
                        0
                    </span>
                    <span className="text-xl font-bold text-[#0066FF] mb-8 ml-1">%</span>
                </div>
            </div>

            {/* Terminal Logs - Bottom Right or Side */}
            <div ref={logsRef} className="absolute bottom-12 left-6 md:left-12 font-mono text-xs md:text-sm text-[#0066FF]/70 space-y-1">
                {TERMINAL_LOGS.map((log, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-gray-600">{`>`}</span>
                        <span>{log}</span>
                    </div>
                ))}
            </div>

        </div>
    );
}
