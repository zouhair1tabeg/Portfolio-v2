"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Mail, Copy, ArrowUpRight, Check, Loader2 } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Form State
    const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");

    // Copy to clipboard state
    const [copied, setCopied] = useState("");

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Audio Effect
        const audio = new Audio("/sounds/click.mp3"); // Assuming file exists or fails silently
        audio.volume = 0.2;
        audio.play().catch(() => { }); // Catch error if file missing

        setFormState("loading");

        // Simulate API call
        setTimeout(() => {
            setFormState("success");
            setTimeout(() => {
                setFormState("idle");
                if (formRef.current) formRef.current.reset();
            }, 3000);
        }, 2000);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Kinetic Typography (Scroll-Fill & Skew)
            const title = titleRef.current;
            if (title) {
                // Skew based on velocity
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    onUpdate: (self) => {
                        const skew = self.getVelocity() / 300;
                        gsap.to(title, { skewX: skew, overwrite: "auto", duration: 0.1 });
                    }
                });

                // Scroll-Fill Effect
                gsap.fromTo(".text-fill",
                    { height: "0%" },
                    {
                        height: "100%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: title,
                            start: "top center",
                            end: "bottom center",
                            scrub: 1
                        }
                    }
                );
            }

            // 2. Social Stagger
            gsap.from(".social-item", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".social-footer",
                    start: "top 95%",
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="contact" className="min-h-screen bg-[#050505] text-white pt-32 pb-0 relative overflow-hidden transition-colors duration-1000">

            <div className="container mx-auto px-6 md:px-12 relative z-20">

                {/* --- Kinetic Typography --- */}
                <div className="w-full mb-24 relative mix-blend-difference">
                    <h2 ref={titleRef} className="text-[12vw] font-black leading-none text-transparent relative" style={{ fontFamily: "'Space Grotesk', sans-serif", WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}>
                        <span className="relative block">
                            LET'S TALK
                            {/* Fill Layer */}
                            <span className="text-fill absolute left-0 bottom-0 w-full overflow-hidden text-[#0066FF] h-0 transition-[height]" style={{ WebkitTextStroke: "0px" }}>
                                LET'S TALK
                            </span>
                        </span>
                    </h2>
                </div>

                {/* --- Aero-Dynamic Form --- */}
                <div className="max-w-3xl mx-auto w-full mb-32 relative group/form">

                    {/* Success Gradient Background */}
                    <div className={clsx(
                        "absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0deg,#0066FF_360deg)] opacity-0 blur-2xl transition-opacity duration-1000",
                        formState === "success" && "opacity-20 animate-spin-slow"
                    )} />

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-12 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <FloatingInput label="Name" type="text" />
                            <FloatingInput label="Email" type="email" />
                        </div>
                        <FloatingInput label="Tell me about your project..." textarea />

                        <div className="flex justify-end pt-8">
                            <MagneticButton strength={0.3} className="group">
                                <button
                                    type="submit"
                                    disabled={formState !== "idle"}
                                    className={clsx(
                                        "relative flex items-center justify-center rounded-full transition-all duration-500 overflow-hidden",
                                        formState === "idle" ? "w-24 h-24 bg-white text-black hover:bg-[#0066FF] hover:text-white" : "",
                                        formState === "loading" ? "w-24 h-24 bg-[#001133] border border-[#0066FF]" : "",
                                        formState === "success" ? "w-24 h-24 bg-green-500 text-white" : ""
                                    )}
                                >
                                    {formState === "idle" && (
                                        <ArrowUpRight size={32} className="group-hover:rotate-45 transition-transform duration-300" />
                                    )}
                                    {formState === "loading" && (
                                        <Loader2 size={32} className="animate-spin text-[#0066FF]" />
                                    )}
                                    {formState === "success" && (
                                        <Check size={32} className="animate-in zoom-in spin-in duration-300" />
                                    )}
                                </button>
                            </MagneticButton>
                        </div>
                    </form>
                </div>

                {/* --- Social Footer --- */}
                <div className="social-footer max-w-4xl mx-auto border-t border-white/10 pt-16 mb-48 grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Direct Contact (Magnetic) */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-mono uppercase text-gray-400 tracking-widest">Connect Directly</h4>

                        <MagneticContact
                            text="tabeg.zouhair@gmail.com"
                            type="email"
                            icon={Mail}
                            onClick={handleCopy}
                            copied={copied === "email"}
                        />
                        <MagneticContact
                            text="+212 696341951"
                            type="phone"
                            prefix="MA"
                            onClick={handleCopy}
                            copied={copied === "phone"}
                        />
                    </div>

                    {/* Social Icons (Glitch) */}
                    <div className="flex flex-col md:items-end justify-between">
                        <h4 className="text-sm font-mono uppercase text-gray-400 tracking-widest mb-6">Social Networks</h4>
                        <div className="flex gap-6">
                            <GlitchSocial href="https://github.com/zouhair1tabeg" icon={Github} />
                            <GlitchSocial href="https://linkedin.com/in/tabeg-zouhair-8412a0344" icon={Linkedin} />
                        </div>
                    </div>
                </div>

            </div>

            {/* --- Double Marquee --- */}
            <div className="w-full py-4 overflow-hidden absolute bottom-0 left-0 pointer-events-none mix-blend-overlay">

                {/* Layer 1: Left to Right */}
                <div className="whitespace-nowrap flex gap-8 animate-marquee opacity-30">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-sm font-bold uppercase text-white tracking-[0.2em] flex items-center gap-8">
                            AVAILABLE FOR NEW PROJECTS — BASED IN MOROCCO <span className="w-2 h-2 bg-white rounded-full" />
                        </span>
                    ))}
                </div>

                {/* Layer 2: Right to Left (Reverse) */}
                <div className="whitespace-nowrap flex gap-8 animate-marquee-reverse opacity-10 absolute top-0 left-0 w-full h-full items-center">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-4xl font-black uppercase text-transparent stroke-white tracking-[0.1em] flex items-center gap-12" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
                            ZOUHAIR TABEG — CREATIVE DEVELOPER
                        </span>
                    ))}
                </div>
            </div>

        </section>
    );
}

// --- Sub Components ---

const FloatingInput = ({ label, type = "text", textarea = false }: { label: string, type?: string, textarea?: boolean }) => {
    return (
        <div className="group relative pt-6">
            {textarea ? (
                <textarea
                    placeholder=" "
                    rows={2}
                    className="peer w-full bg-transparent border-b border-white/20 py-2 text-xl outline-none text-white focus:border-[#0066FF] transition-colors resize-none"
                />
            ) : (
                <input
                    type={type}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-white/20 py-2 text-xl outline-none text-white focus:border-[#0066FF] transition-colors"
                />
            )}

            <label className="absolute left-0 top-2 text-gray-500 text-lg transition-all duration-300 pointer-events-none
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0066FF]
                peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
            >
                {label}
            </label>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0066FF] transition-all duration-500 peer-focus:w-full" />
        </div>
    )
}

const MagneticContact = ({ text, type, prefix, icon: Icon, onClick, copied }: any) => {
    return (
        <div className="social-item group relative w-fit">
            <MagneticButton strength={0.4}>
                <div
                    className="flex items-center gap-4 cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                    onClick={() => onClick(text, type)}
                >
                    {prefix && <div className="p-1 rounded bg-[#0066FF] text-[10px] font-bold">{prefix}</div>}
                    {!prefix && <Icon size={24} className="text-[#0066FF]" />}

                    <span className="text-xl md:text-3xl font-bold group-hover:text-[#0066FF] transition-colors">{text}</span>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </div>
                </div>
            </MagneticButton>
        </div>
    )
}

const GlitchSocial = ({ href, icon: Icon }: { href: string, icon: any }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-item group relative w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 overflow-hidden"
        >
            <div className="relative z-10 transition-transform duration-100 group-hover:translate-x-1 group-hover:-translate-y-1">
                <Icon size={24} className="text-white group-hover:text-[#0066FF] transition-colors" />
            </div>

            {/* Glitch Layer 1 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-50 group-hover:translate-x-[-2px] group-hover:skew-x-12 transition-all duration-75 text-red-500">
                <Icon size={24} />
            </div>
            {/* Glitch Layer 2 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-50 group-hover:translate-x-[2px] group-hover:skew-x-[-12] transition-all duration-75 text-cyan-500 delay-75">
                <Icon size={24} />
            </div>

            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        </a>
    );
}
