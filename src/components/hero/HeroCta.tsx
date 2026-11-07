"use client";

import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { useScrollTo } from "@/hooks/useScrollTo";

type HeroCtaProps = {
    className?: string;
};

export default function HeroCta({ className }: HeroCtaProps) {
    const scrollTo = useScrollTo();

    return (
        <div
            data-hero-fade
            className={cn(
                "relative z-30 mt-7 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 md:mt-8",
                className,
            )}
        >
            <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="group flex min-h-11 items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-white max-lg:gap-2 max-lg:px-4 max-lg:py-2.5 max-lg:text-[10px]"
            >
                Me contacter
                <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 max-lg:h-3.5 max-lg:w-3.5"
                />
            </button>

            <button
                type="button"
                onClick={() => scrollTo("#projects")}
                className="group flex min-h-11 items-center gap-2.5 rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white/80 transition-colors duration-300 hover:border-accent hover:text-accent max-lg:gap-2 max-lg:px-4 max-lg:py-2.5 max-lg:text-[10px]"
            >
                Voir mes projets
                <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 max-lg:h-3.5 max-lg:w-3.5"
                />
            </button>

            <a
                href="/cv.pdf"
                download
                aria-label="Télécharger le CV"
                className="group flex min-h-11 items-center gap-2 px-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45 transition-colors duration-300 hover:text-accent max-lg:px-2"
            >
                <Download
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
                />
                <span className="max-sm:hidden">Télécharger le CV</span>
            </a>
        </div>
    );
}
