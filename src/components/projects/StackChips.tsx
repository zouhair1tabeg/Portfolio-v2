import SkillChip from "@/components/skills/SkillChip";

/** Stack chips with the Toolbox styling, optionally capped with a +N chip. */
export default function StackChips({
    items,
    limit,
}: {
    items: readonly string[];
    limit?: number;
}) {
    const visible = limit ? items.slice(0, limit) : items;
    const hiddenCount = items.length - visible.length;

    return (
        <ul className="flex flex-wrap gap-2">
            {visible.map((item) => (
                <SkillChip key={item} item={{ name: item }} />
            ))}
            {hiddenCount > 0 ? (
                <li className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-xs leading-snug text-white/45">
                    +{hiddenCount}
                </li>
            ) : null}
        </ul>
    );
}
