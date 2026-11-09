"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const anchor = (hash: string) => (isHome ? hash : `/${hash}`);

    return (
        <footer className="bg-black text-white py-12 px-6 md:px-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Tabeg Zouhair. All rights reserved.
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm uppercase tracking-widest">
                    <Link href={anchor("#about")} className="hover:text-blue-500 transition-colors">About</Link>
                    <Link href={anchor("#skills")} className="hover:text-blue-500 transition-colors">Skills</Link>
                    <Link href={anchor("#services")} className="hover:text-blue-500 transition-colors">Services</Link>
                    <Link href={anchor("#projects")} className="hover:text-blue-500 transition-colors">Projects</Link>
                    <Link href={anchor("#experience")} className="hover:text-blue-500 transition-colors">Experience</Link>
                    <Link href={anchor("#contact")} className="hover:text-blue-500 transition-colors">Contact</Link>
                </div>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Back to Top ↑
                </button>
            </div>
        </footer>
    );
}
