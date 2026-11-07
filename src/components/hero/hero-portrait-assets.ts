/**
 * The two portrait textures must share the exact same dimensions, framing and
 * alpha channel. Only the grade of B differs. See public/images/hero/README.md.
 */
export const HERO_PORTRAIT = {
    base: "/images/hero/portrait-base.webp",
    reveal: "/images/hero/portrait-reveal.webp",
    width: 1200,
    height: 1490,
    alt: "Portrait of Zouhair Tabeg",
} as const;
