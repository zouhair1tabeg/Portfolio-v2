"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Preloader from "@/components/ui/Preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Lock scroll during load
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0); // Reset scroll
    } else {
      document.body.style.overflow = "";
    }
  }, [isLoading]);

  return (
    <main className="bg-black min-h-screen">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
