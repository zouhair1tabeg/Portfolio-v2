"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Mail, Copy, ArrowUpRight, Check } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // Copy to clipboard state
    const [copied, setCopied] = useState("");

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Background Color Transition
            gsap.to(sectionRef.current, {
                backgroundColor: "#001133", // Deep Blue
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    end: "bottom bottom",
                    scrub: true
                }
            });

            // 2. Kinetic Heading "Let's Talk" parralax
            gsap.to(titleRef.current, {
                xPercent: -10,
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });

            // 3. Social Icons Stagger
            gsap.from(".social-icon", {
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

            <div className="container mx-auto px-6 md:px-12">

                {/* --- 2. Contact Section --- */}
                <div className="max-w-3xl mx-auto w-full mb-32 relative z-10">
                    <div className="overflow-hidden mb-12">
                        <h2 ref={titleRef} className="text-7xl md:text-[8rem] font-black leading-none whitespace-nowrap text-white mix-blend-difference opacity-90" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            LET'S TALK
                        </h2>
                    </div>

                    <form ref={formRef} className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="group relative">
                                <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none text-white focus:border-[#0066FF] transition-colors placeholder:text-gray-600" />
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0066FF] transition-all duration-500 group-focus-within:w-full" />
                            </div>
                            <div className="group relative">
                                <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none text-white focus:border-[#0066FF] transition-colors placeholder:text-gray-600" />
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0066FF] transition-all duration-500 group-focus-within:w-full" />
                            </div>
                        </div>
                        <div className="group relative">
                            <textarea placeholder="Tell me about your project..." rows={2} className="w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none text-white focus:border-[#0066FF] transition-colors placeholder:text-gray-600 resize-none"></textarea>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0066FF] transition-all duration-500 group-focus-within:w-full" />
                        </div>

                        <div className="flex justify-end pt-8">
                            <MagneticButton strength={0.3} className="group">
                                <button type="submit" className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white text-black hover:bg-[#0066FF] hover:text-white transition-all duration-300 group-hover:scale-110">
                                    <ArrowUpRight size={32} className="group-hover:rotate-45 transition-transform duration-300" />
                                </button>
                            </MagneticButton>
                        </div>
                    </form>
                </div>

                {/* --- 3. Social Footer --- */}
                <div className="social-footer max-w-4xl mx-auto border-t border-white/10 pt-16 mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Direct Contact */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-mono uppercase text-gray-400 tracking-widest">Connect Directly</h4>

                        <div className="group flex items-center gap-4 cursor-pointer" onClick={() => handleCopy("tabeg.zouhair@gmail.com", "email")}>
                            <Mail size={24} className="text-[#0066FF]" />
                            <span className="text-xl md:text-3xl font-bold hover:text-[#0066FF] transition-colors">tabeg.zouhair@gmail.com</span>
                            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                {copied === "email" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                        </div>

                        <div className="group flex items-center gap-4 cursor-pointer" onClick={() => handleCopy("+212 696341951", "phone")}>
                            <div className="p-1 rounded bg-[#0066FF] text-[10px] font-bold">MA</div>
                            <span className="text-xl md:text-3xl font-bold hover:text-[#0066FF] transition-colors">+212 696341951</span>
                            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                {copied === "phone" ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex flex-col md:items-end justify-between">
                        <h4 className="text-sm font-mono uppercase text-gray-400 tracking-widest mb-6">Social Networks</h4>
                        <div className="flex gap-6">
                            <SocialIcon href="https://github.com/zouhair1tabeg" icon={Github} />
                            <SocialIcon href="https://linkedin.com/in/tabeg-zouhair-8412a0344" icon={Linkedin} />
                        </div>
                    </div>
                </div>

            </div>

            {/* --- 4. Marquee Footer --- */}
            <div className="w-full bg-[#0066FF] py-3 overflow-hidden absolute bottom-0 left-0 pointer-events-none">
                <div className="whitespace-nowrap flex gap-8 animate-marquee">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-sm font-bold uppercase text-black tracking-[0.2em] flex items-center gap-8">
                            ZOUHAIR TABEG — AVAILABLE FOR NEW PROJECTS — BASED IN MOROCCO <span className="w-2 h-2 bg-black rounded-full" />
                        </span>
                    ))}
                </div>
            </div>

        </section>
    );
}

function SocialIcon({ href, icon: Icon }: { href: string, icon: any }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
        >
            <Icon size={24} />
        </a>
    );
}
