/** Tech chip for a service stack, styled like the Toolbox chips. */
export default function ServiceChip({ label }: { label: string }) {
    return (
        <li className="inline-flex max-w-full items-center rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs leading-snug text-white/75 transition-colors duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-white">
            {label}
        </li>
    );
}
