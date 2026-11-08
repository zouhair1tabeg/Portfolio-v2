import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

export default function CaseStudyFooter({
    previous,
    next,
}: {
    previous: Project | null;
    next: Project | null;
}) {
    return (
        <>
            {previous ?? next ? (
                <nav
                    aria-label="Project navigation"
                    className="case-reveal mt-16 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2 md:mt-24"
                >
                    {[previous, next].map((item, index) => {
                        if (!item) return null;
                        const isNext = index === 1;

                        return (
                            <Link
                                key={item.slug}
                                href={`/projects/${item.slug}`}
                                className={`group flex min-h-11 flex-col gap-2 rounded-2xl border border-white/10 p-5 transition-colors duration-300 hover:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                                    isNext ? "sm:items-end sm:text-right" : ""
                                }`}
                            >
                                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/35">
                                    {isNext ? "Next project" : "Previous project"}
                                </span>
                                <span className="inline-flex items-center gap-2 font-hero text-xl font-bold text-white transition-colors group-hover:text-accent">
                                    {item.title}
                                    <ArrowUpRight
                                        aria-hidden="true"
                                        size={16}
                                        className={
                                            isNext
                                                ? "rotate-90 transition-transform group-hover:translate-x-1"
                                                : "-rotate-90 transition-transform group-hover:-translate-x-1"
                                        }
                                    />
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            ) : null}

            <div className="case-reveal mt-16 flex flex-col gap-6 border-t border-white/10 pt-10 md:mt-24 md:flex-row md:items-center md:justify-between">
                <p className="font-hero text-2xl font-bold text-white md:text-3xl">
                    Have a project in mind?
                </p>
                <Link
                    href="/#contact"
                    className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none md:self-auto"
                >
                    Let&apos;s talk
                    <ArrowUpRight aria-hidden="true" size={16} />
                </Link>
            </div>
        </>
    );
}
