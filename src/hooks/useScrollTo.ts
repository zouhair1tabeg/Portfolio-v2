"use client";

import { useCallback } from "react";
import { useLenis } from "@studio-freight/react-lenis";

/** Scrolls to an anchor through Lenis, with a native fallback. */
export function useScrollTo(): (target: string) => void {
    const lenis = useLenis();

    return useCallback(
        (target: string) => {
            if (lenis) {
                lenis.scrollTo(target, { duration: 1.4, offset: 0 });
                return;
            }

            document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
        },
        [lenis],
    );
}
