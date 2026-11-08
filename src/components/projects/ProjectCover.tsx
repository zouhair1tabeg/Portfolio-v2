"use client";

import { useState } from "react";
import Image from "next/image";
import { Cpu, Globe, Smartphone, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Project, ProjectCategory } from "@/data/projects";

const ICONS: Record<ProjectCategory, LucideIcon> = {
    Mobile: Smartphone,
    Web: Globe,
    IoT: Cpu,
};

const DEFAULT_SIZES = "(max-width: 767px) 100vw, (max-width: 1535px) 50vw, 33vw";

export default function ProjectCover({
    project,
    priority = false,
    sizes = DEFAULT_SIZES,
    className,
}: {
    project: Project;
    priority?: boolean;
    sizes?: string;
    className?: string;
}) {
    const Icon = ICONS[project.category[0]];
    const [imageFailed, setImageFailed] = useState(false);
    const cover = project.cover;
    const showCover = Boolean(cover) && !imageFailed;

    return (
        <div
            className={cn(
                "@container relative aspect-[16/10] w-full overflow-hidden bg-ink-soft",
                className,
            )}
        >
            {showCover && cover ? (
                <Image
                    src={cover}
                    alt={`${project.title} — project cover`}
                    fill
                    sizes={sizes}
                    priority={priority}
                    onError={() => setImageFailed(true)}
                    className="object-cover opacity-85 transition-[scale,opacity] duration-700 group-hover:scale-[1.04] group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
            ) : (
                <div aria-hidden="true" className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_20%,#1a2010_0%,#0a0b0c_55%,#050506_100%)]" />
                    <div className="bg-noise absolute inset-0 opacity-25" />

                    <span className="absolute -bottom-[0.12em] left-4 font-hero text-[clamp(6rem,24cqw,15rem)] leading-none font-black tracking-tighter text-white/[0.06]">
                        {project.index}
                    </span>

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-accent @[460px]:h-16 @[460px]:w-16 @[720px]:h-20 @[720px]:w-20">
                            <Icon className="size-6 @[720px]:size-8" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/35 @[720px]:text-[10px]">
                            {project.category[0]} project
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
