"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-12 px-6 md:px-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Tabeg Zouhair. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm uppercase tracking-widest">
                    <Link href="#about" className="hover:text-blue-500 transition-colors">About</Link>
                    <Link href="#projects" className="hover:text-blue-500 transition-colors">Projects</Link>
                    <Link href="#contact" className="hover:text-blue-500 transition-colors">Contact</Link>
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
