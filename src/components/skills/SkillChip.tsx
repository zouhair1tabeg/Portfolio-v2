import type { SkillItem } from "@/data/skills";

/**
 * A single tech chip. Items with `children` keep the parent name as the main
 * label and render the sub-items as dimmed, separated text inside the same
 * chip (wrapping to a new line when space runs out).
 */
export default function SkillChip({ item }: { item: SkillItem }) {
    return (
        <li className="skill-chip inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 gap-y-0.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs leading-snug text-white/75 transition-colors duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-white">
            <span>{item.name}</span>

            {item.children?.map((child) => (
                <span key={child} className="text-white/50">
                    <span aria-hidden="true" className="pr-1 text-white/30">
                        ·
                    </span>
                    {child}
                </span>
            ))}
        </li>
    );
}
