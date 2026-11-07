"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

export type HeroNameTextures = {
    /** Solid name (white + accent). */
    fill: THREE.CanvasTexture;
    /** Same name, stroke only, for the blob hover state. */
    outline: THREE.CanvasTexture;
    /** x, y, width, height in hero UV space (origin bottom-left). */
    rect: THREE.Vector4;
};

export type HeroNameLayout = {
    name: HeroNameTextures | null;
    /** Displayed box of the portrait image, in hero UV space. */
    portraitRect: THREE.Vector4 | null;
};

type LayoutRect = {
    x: number;
    y: number;
    w: number;
    h: number;
};

type LineMeasure = LayoutRect & {
    el: HTMLElement;
    text: string;
};

const MAX_TEXTURE_SIZE = 4096;
const MAX_TEXTURE_SCALE = 1.5;
const OUTLINE_WIDTH = 2;

/**
 * Position of an element inside an ancestor, from layout offsets only. Unlike
 * `getBoundingClientRect`, this ignores scroll, parallax and GSAP transforms,
 * so the canvas name stays aligned with the DOM when the hero moves.
 */
function layoutRect(el: HTMLElement, ancestor: HTMLElement): LayoutRect {
    let x = 0;
    let y = 0;
    let node: HTMLElement | null = el;

    while (node && node !== ancestor) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
    }

    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function parsePixels(value: string, fallback: number): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function drawNameLayer(
    lines: LineMeasure[],
    bounds: LayoutRect,
    scale: number,
    mode: "fill" | "outline",
): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.ceil(bounds.w * scale));
    canvas.height = Math.max(1, Math.ceil(bounds.h * scale));

    const context = canvas.getContext("2d");
    if (!context) return canvas;

    context.scale(scale, scale);
    context.textBaseline = "alphabetic";
    context.textAlign = "left";
    context.lineJoin = "round";
    context.lineCap = "round";

    for (const line of lines) {
        const style = getComputedStyle(line.el);
        const fontSize = parsePixels(style.fontSize, 16);
        const lineHeight = parsePixels(style.lineHeight, fontSize * 0.8);
        const letterSpacing = parsePixels(style.letterSpacing, 0);

        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

        const metrics = context.measureText("H");
        const ascent = metrics.fontBoundingBoxAscent || fontSize * 0.8;
        const descent = metrics.fontBoundingBoxDescent || fontSize * 0.2;
        const halfLeading = (lineHeight - (ascent + descent)) / 2;
        const baseline = line.y - bounds.y + halfLeading + ascent;
        const x = line.x - bounds.x;
        const text = line.text.toUpperCase();

        context.fillStyle = style.color;
        context.strokeStyle = style.color;
        context.lineWidth = mode === "outline" ? OUTLINE_WIDTH : 0;

        // Canvas honours CSS letter-spacing in every browser this site targets.
        // The feature check keeps older engines from drawing a wider name.
        if ("letterSpacing" in context) {
            context.letterSpacing = `${letterSpacing}px`;
        }

        if (mode === "outline") {
            context.strokeText(text, x, baseline);
        } else {
            context.fillText(text, x, baseline);
        }
    }

    return canvas;
}

function makeTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.premultiplyAlpha = false;
    texture.anisotropy = 4;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
}

/**
 * Measures the DOM name + portrait and turns them into two canvas textures the
 * full-screen reveal shader can sample. Re-runs on resize and when the web font
 * finally loads, so the canvas never drifts from the layout.
 */
export function useHeroNameTextures(
    hostRef: RefObject<HTMLDivElement | null>,
): HeroNameLayout {
    const [layout, setLayout] = useState<HeroNameLayout>({
        name: null,
        portraitRect: null,
    });
    const texturesRef = useRef<HeroNameTextures | null>(null);

    useEffect(() => {
        const host = hostRef.current;
        const section = host?.closest("section");
        if (!host || !section) return;

        const sectionEl = section as HTMLElement;
        let frame = 0;
        let disposed = false;
        let lastKey = "";

        const measure = () => {
            if (disposed) return;

            const sectionWidth = sectionEl.offsetWidth;
            const sectionHeight = sectionEl.offsetHeight;
            if (sectionWidth < 2 || sectionHeight < 2) return;

            const lineEls = Array.from(
                sectionEl.querySelectorAll<HTMLElement>("[data-hero-name-line]"),
            );
            if (lineEls.length === 0) return;

            const lines: LineMeasure[] = [];
            for (const el of lineEls) {
                const rect = layoutRect(el, sectionEl);
                const text = (el.textContent ?? "").trim();
                if (rect.w > 0 && rect.h > 0 && text.length > 0) {
                    lines.push({ ...rect, el, text });
                }
            }
            if (lines.length === 0) return;

            const portraitEl = sectionEl.querySelector<HTMLElement>(
                "[data-hero-portrait-image]",
            );
            const portrait = portraitEl ? layoutRect(portraitEl, sectionEl) : null;

            const key = [
                sectionWidth,
                sectionHeight,
                ...lines.flatMap((line) => [line.x, line.y, line.w, line.h]),
                portrait?.x ?? -1,
                portrait?.y ?? -1,
                portrait?.w ?? -1,
                portrait?.h ?? -1,
            ].join(":");
            if (key === lastKey) return;
            lastKey = key;

            const fontSize = Math.max(
                ...lines.map((line) =>
                    parsePixels(getComputedStyle(line.el).fontSize, 16),
                ),
            );
            const padX = fontSize * 0.12;
            const padY = fontSize * 0.35;

            const left = Math.min(...lines.map((line) => line.x)) - padX;
            const top = Math.min(...lines.map((line) => line.y)) - padY;
            const right =
                Math.max(...lines.map((line) => line.x + line.w)) + padX;
            const bottom =
                Math.max(...lines.map((line) => line.y + line.h)) + padY;

            const bounds: LayoutRect = {
                x: left,
                y: top,
                w: Math.max(1, right - left),
                h: Math.max(1, bottom - top),
            };

            const scale = Math.min(
                MAX_TEXTURE_SCALE,
                MAX_TEXTURE_SIZE / Math.max(bounds.w, bounds.h),
            );

            const fill = makeTexture(
                drawNameLayer(lines, bounds, scale, "fill"),
            );
            const outline = makeTexture(
                drawNameLayer(lines, bounds, scale, "outline"),
            );

            const name: HeroNameTextures = {
                fill,
                outline,
                rect: new THREE.Vector4(
                    bounds.x / sectionWidth,
                    1 - (bounds.y + bounds.h) / sectionHeight,
                    bounds.w / sectionWidth,
                    bounds.h / sectionHeight,
                ),
            };

            const previous = texturesRef.current;
            texturesRef.current = name;
            previous?.fill.dispose();
            previous?.outline.dispose();

            const portraitRect = portrait
                ? new THREE.Vector4(
                      portrait.x / sectionWidth,
                      1 - (portrait.y + portrait.h) / sectionHeight,
                      portrait.w / sectionWidth,
                      portrait.h / sectionHeight,
                  )
                : null;

            setLayout({ name, portraitRect });
        };

        const schedule = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                measure();
            });
        };

        const resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(sectionEl);

        for (const el of sectionEl.querySelectorAll(
            "[data-hero-name-line], [data-hero-portrait-image]",
        )) {
            resizeObserver.observe(el);
        }

        const onFonts = () => schedule();
        document.fonts.addEventListener("loadingdone", onFonts);
        void document.fonts.ready.then(schedule);

        schedule();

        return () => {
            disposed = true;
            if (frame) window.cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            document.fonts.removeEventListener("loadingdone", onFonts);

            const current = texturesRef.current;
            texturesRef.current = null;
            current?.fill.dispose();
            current?.outline.dispose();
        };
    }, [hostRef]);

    return layout;
}
