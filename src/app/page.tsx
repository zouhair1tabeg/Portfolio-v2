"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
    return (
        <main id="main-content" className="min-h-screen bg-black">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
        </main>
    );
}
