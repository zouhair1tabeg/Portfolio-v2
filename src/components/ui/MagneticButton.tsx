"use client";

import { useRef, ReactNode, MouseEvent } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number; // How strong the magnetic pull is (higher = stronger pull)
    onClick?: () => void;
}

export default function MagneticButton({
    children,
    className = "",
    strength = 0.5,
    onClick
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!buttonRef.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        // Move the button container
        gsap.to(buttonRef.current, {
            x: x * strength,
            y: y * strength,
            duration: 1,
            ease: "power4.out"
        });

        // Optional: Move text/content slightly more for depth effect if structured
        if (textRef.current) {
            gsap.to(textRef.current, {
                x: x * (strength * 1.2),
                y: y * (strength * 1.2),
                duration: 1,
                ease: "power4.out"
            });
        }
    };

    const handleMouseLeave = () => {
        if (!buttonRef.current) return;

        gsap.to(buttonRef.current, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });

        if (textRef.current) {
            gsap.to(textRef.current, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)"
            });
        }
    };

    return (
        <div
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={`cursor-pointer ${className}`}
        >
            <span ref={textRef} className="block pointer-events-none">
                {children}
            </span>
        </div>
    );
}
