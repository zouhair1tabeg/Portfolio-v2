"use client";

import type { PointerEvent } from "react";
import {
    ArrowUpRight,
    Globe,
    Server,
    ShoppingCart,
    Smartphone,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { Service } from "@/data/services";
import ServiceChip from "@/components/services/ServiceChip";

const ICONS: Record<Service["icon"], LucideIcon> = {
    Globe,
    Smartphone,
    ShoppingCart,
    Server,
};

type ServiceRowProps = {
    service: Service;
    open: boolean;
    hoverEnabled: boolean;
    onOpen: (id: string, fromHover?: boolean) => void;
};

export default function ServiceRow({
    service,
    open,
    hoverEnabled,
    onOpen,
}: ServiceRowProps) {
    const Icon = ICONS[service.icon];
    const panelId = `service-panel-${service.id}`;
    const headingId = `service-heading-${service.id}`;

    // Hover-to-open is desktop only. `pointermove` (not `pointerenter`) avoids
    // re-opening a row when the accordion reflows under a stationary cursor.
    const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
        if (!hoverEnabled || open || event.pointerType !== "mouse") return;
        onOpen(service.id, true);
    };

    return (
        <li className="service-row border-t border-white/10 last:border-b">
            <h3 id={headingId}>
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => onOpen(service.id)}
                    onPointerMove={handlePointerMove}
                    className={cn(
                        "group grid w-full grid-cols-[2rem_1fr_auto] items-center gap-x-4 px-1 py-5 text-left transition-colors duration-300 md:grid-cols-[3.5rem_1fr_auto] md:gap-x-6 md:py-7",
                        "hover:bg-white/[0.03] focus-visible:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                        open && "bg-white/[0.03]",
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={cn(
                            "font-mono text-sm tracking-[0.2em] transition-colors duration-300 md:text-base",
                            open ? "text-accent" : "text-white/30",
                        )}
                        style={
                            open
                                ? undefined
                                : {
                                      WebkitTextStroke: "1px rgba(255,255,255,0.35)",
                                      color: "transparent",
                                  }
                        }
                    >
                        {service.index}
                    </span>

                    <span
                        className={cn(
                            "font-hero text-[clamp(1.5rem,4.6vw,4rem)] font-black uppercase leading-[0.95] tracking-tight text-white transition-[color,translate] duration-300 ease-out",
                            "group-hover:translate-x-1 group-hover:text-accent motion-reduce:group-hover:translate-x-0",
                            open && "translate-x-1 text-accent motion-reduce:translate-x-0",
                        )}
                    >
                        {service.title}
                    </span>

                    <span className="flex items-center gap-3 md:gap-4">
                        <Icon
                            aria-hidden="true"
                            size={22}
                            className={cn(
                                "hidden shrink-0 transition-colors duration-300 sm:block",
                                open ? "text-accent" : "text-white/35 group-hover:text-accent",
                            )}
                        />
                        <ArrowUpRight
                            aria-hidden="true"
                            size={22}
                            className={cn(
                                "shrink-0 transition-[rotate,color] duration-300 motion-reduce:transition-none",
                                open ? "rotate-45 text-accent" : "text-white/45 group-hover:text-accent",
                            )}
                        />
                    </span>
                </button>
            </h3>

            {/* grid-template-rows keeps the open/close animation CSS-only. */}
            <div
                id={panelId}
                aria-labelledby={headingId}
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                <div className="overflow-hidden">
                    <div
                        aria-hidden={!open}
                        className={cn(
                            "pb-8 pl-12 pr-2 transition-opacity duration-300 md:pb-10 md:pl-20 md:pr-24",
                            open ? "opacity-100" : "opacity-0",
                            "motion-reduce:transition-none",
                        )}
                    >
                        <p className="max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                            {service.summary}
                        </p>

                        <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
                            {service.deliverables.map((deliverable) => (
                                <li
                                    key={deliverable}
                                    className="flex items-start gap-2.5 text-sm leading-snug text-white/70"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                                    />
                                    {deliverable}
                                </li>
                            ))}
                        </ul>

                        <ul
                            className="mt-6 flex flex-wrap gap-2"
                            aria-label={`${service.title} stack`}
                        >
                            {service.stack.map((technology) => (
                                <ServiceChip key={technology} label={technology} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    );
}
