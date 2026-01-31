"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when menu is open
            document.body.style.overflow = "hidden";

            gsap.to(menuRef.current, {
                y: "0%",
                duration: 0.8,
                ease: "power4.inOut",
            });
            gsap.fromTo(
                linksRef.current?.children || [],
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: "power2.out"
                }
            );
        } else {
            // Restore body scroll
            document.body.style.overflow = "auto";

            gsap.to(menuRef.current, {
                y: "-100%",
                duration: 0.8,
                ease: "power4.inOut",
            });
        }
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const links = [
        { name: "PROJECTS", href: "#projects" },
        { name: "SKILLS", href: "#skills" },
        { name: "EXPERIENCE", href: "#experience" },
        { name: "CONTACT", href: "#contact" },
    ];

    return (
        <>
            <div className="fixed top-8 right-8 z-50">
                <MagneticButton>
                    <button
                        onClick={toggleMenu}
                        className="text-white mix-blend-difference hover:text-[#0066FF] transition-colors p-4 block rounded-full"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </MagneticButton>
            </div>

            <div
                ref={menuRef}
                className="fixed inset-0 z-40 bg-[#050505] flex justify-center items-center transform -translate-y-full"
            >
                {/* Grid Background */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px"
                    }}
                ></div>

                <div ref={linksRef} className="flex flex-col items-center gap-8 relative z-10">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-6xl md:text-8xl font-black text-transparent hover:text-white transition-all duration-300"
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                WebkitTextStroke: "1px rgba(255, 255, 255, 0.5)"
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
