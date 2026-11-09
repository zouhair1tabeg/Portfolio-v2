"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import { useScrollToHash } from "@/hooks/useScrollToHash";

export default function Home() {
    useScrollToHash();

    return (
        <main id="main-content" className="min-h-screen bg-black">
            <Hero />
            <About />
            <Skills />
            <Services />
            <Projects />
            <Experience />
            <Contact />
        </main>
    );
}
