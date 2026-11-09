"use client";

import { useEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { ScrollTrigger } from "@/lib/gsap";

const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown"] as const;
const RECALIBRATION_DELAY = 300;
const DRIFT_THRESHOLD = 2;
const MAX_IMAGE_WAIT = 1200;

/** Absolute vertical position of an element in the document. */
function documentTop(element: HTMLElement): number {
    return element.getBoundingClientRect().top + window.scrollY;
}

/** Offset shared with native hash scrolling (see #projects scroll-margin-top). */
function scrollMargin(element: HTMLElement): number {
    return Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
}

/**
 * Lands on the section named by the URL hash after a client-side navigation.
 * Next.js scrolls before the destination page exists, and the browser's own
 * restoration fights Lenis, so we take over once the layout is stable.
 */
export function useScrollToHash() {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const hash = window.location.hash;
        if (hash.length < 2) return;

        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!target) return;

        let cancelled = false;
        let recalibration: number | undefined;
        let imageWait: number | undefined;
        let frame = 0;
        let frameFallback: number | undefined;

        const clearPending = () => {
            if (recalibration !== undefined) window.clearTimeout(recalibration);
            if (imageWait !== undefined) window.clearTimeout(imageWait);
            if (frameFallback !== undefined) window.clearTimeout(frameFallback);
            if (frame) window.cancelAnimationFrame(frame);
            recalibration = undefined;
            imageWait = undefined;
            frameFallback = undefined;
            frame = 0;
        };

        // Deliberate user input always wins over the automatic positioning.
        const stop = () => {
            if (cancelled) return;
            cancelled = true;
            clearPending();
        };

        USER_SCROLL_EVENTS.forEach((event) =>
            window.addEventListener(event, stop, { passive: true }),
        );

        const nextFrame = () =>
            new Promise<void>((resolve) => {
                let settled = false;
                const finish = () => {
                    if (settled) return;
                    settled = true;
                    if (frameFallback !== undefined) {
                        window.clearTimeout(frameFallback);
                        frameFallback = undefined;
                    }
                    resolve();
                };

                frame = window.requestAnimationFrame(() => {
                    frame = window.requestAnimationFrame(finish);
                });

                // Browsers pause rAF for occluded windows; never stall the landing.
                frameFallback = window.setTimeout(finish, 120);
            });

        const waitForImages = () => {
            const targetTop = documentTop(target);
            const pending = Array.from(document.images).filter(
                (image) => !image.complete && documentTop(image) < targetTop,
            );

            if (!pending.length) return Promise.resolve();

            return Promise.race([
                Promise.allSettled(pending.map((image) => image.decode())),
                new Promise<void>((resolve) => {
                    imageWait = window.setTimeout(resolve, MAX_IMAGE_WAIT);
                }),
            ]);
        };

        const jump = () => {
            if (cancelled) return;
            // Lenis keeps the previous page's height until it resizes, which
            // would clamp the target to a shorter limit on client navigation.
            lenis.resize();
            lenis.scrollTo(documentTop(target) - scrollMargin(target), {
                immediate: true,
                force: true,
            });
        };

        // The destination may have been moved by the router or a late scroll.
        const ensurePosition = () => {
            if (cancelled) return;
            const offset =
                target.getBoundingClientRect().top - scrollMargin(target);
            if (Math.abs(offset) > DRIFT_THRESHOLD) jump();
        };

        const settle = async () => {
            // Land immediately so nothing flashes at the top; refine afterwards.
            jump();

            try {
                await document.fonts.ready;
            } catch {
                // A font failure must not block positioning.
            }
            if (cancelled) return;

            await waitForImages();
            if (cancelled) return;

            ScrollTrigger.refresh();

            await nextFrame();
            if (cancelled) return;

            jump();

            // One late correction only, if something moved the page afterwards.
            recalibration = window.setTimeout(ensurePosition, RECALIBRATION_DELAY);
        };

        void settle();

        return () => {
            USER_SCROLL_EVENTS.forEach((event) =>
                window.removeEventListener(event, stop),
            );
            stop();
        };
    }, [lenis]);
}
