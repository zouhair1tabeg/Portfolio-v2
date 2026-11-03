"use client";

import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { useScrollTo } from "@/hooks/useScrollTo";

export default function HeroCta() {
    const scrollTo = useScrollTo();

    return (
        <div className="relative z-30 mt-7 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 md:mt-8">
            <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="group flex min-h-11 items-center gap-3 rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-white"
            >
                Me contacter
                <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            </button>

            <button
                type="button"
                onClick={() => scrollTo("#projects")}
                className="group flex min-h-11 items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white/80 transition-colors duration-300 hover:border-accent hover:text-accent"
            >
                Voir mes projets
                <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
            </button>

            <a
                href="/cv.pdf"
                download
                className="group flex min-h-11 items-center gap-2 px-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45 transition-colors duration-300 hover:text-accent"
            >
                <Download
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
                />
                Télécharger le CV
            </a>
        </div>
    );
}
