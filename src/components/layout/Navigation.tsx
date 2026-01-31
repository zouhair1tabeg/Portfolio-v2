"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const LINKS = [
    { name: "PROJECTS", href: "#projects" },
    { name: "SKILLS", href: "#skills" },
    { name: "EXPERIENCE", href: "#experience" },
    { name: "CONTACT", href: "#contact" },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const linksContainerRef = useRef<HTMLDivElement>(null);

    // Toggle Menu State
    const toggleMenu = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const overlay = overlayRef.current;
        const links = linksContainerRef.current?.children;

        if (!overlay || !links) return;

        const tl = gsap.timeline();

        if (isOpen) {
            // Block scrolling
            document.body.style.overflow = "hidden";

            // 1. Overlay Slide Down
            tl.to(overlay, {
                y: "0%",
                duration: 1,
                ease: "power4.inOut"
            })
                // 2. Staggered Links Entry
                .fromTo(links,
                    { y: 50, opacity: 0, rotateX: 10 },
                    {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out"
                    }, "-=0.4"
                );

        } else {
            // Restore scrolling
            document.body.style.overflow = "auto";

            // Close Animation
            tl.to(overlay, {
                y: "-100%",
                duration: 0.8,
                ease: "power4.inOut"
            });
        }

    }, [isOpen]);

    return (
        <>
            {/* Magnetic Toggle Button (Fixed) */}
            <div className="fixed top-6 right-6 z-50 mix-blend-difference">
                <MagneticButton className="p-4" onClick={toggleMenu}>
                    <div className="flex items-center justify-center w-12 h-12 text-white hover:text-gray-300 transition-colors">
                        {isOpen ? <X size={32} /> : <Menu size={32} />}
                    </div>
                </MagneticButton>
            </div>

            {/* Fullscreen Overlay Menu */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-40 bg-[#050505] w-full h-screen flex flex-col justify-center items-center overflow-hidden translate-y-[-100%]"
            >
                {/* Grid Pattern Background */}
                <div
                    className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #ffffff 1px, transparent 1px),
                            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px"
                    }}
                />

                {/* Centered Navigation Links */}
                <nav ref={linksContainerRef} className="relative z-10 flex flex-col items-center gap-6 md:gap-10">
                    {LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="group relative"
                        >
                            <span
                                className="block font-black text-6xl md:text-8xl tracking-tighter text-transparent transition-all duration-300 group-hover:text-white"
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    WebkitTextStroke: "1px rgba(255,255,255,0.5)"
                                }}
                            >
                                {link.name}
                            </span>

                            {/* Optional: Solid fill overlay for perfect transition if needed, 
                                but adjusting text-color/stroke above is cleaner. 
                                We'll stick to the CSS transition on the span above. 
                            */}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}
