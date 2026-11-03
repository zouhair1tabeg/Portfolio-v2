/**
 * The accent colour lives in `globals.css` (`@theme { --accent: ... }`).
 * Canvas/Three.js cannot resolve CSS variables, so this helper reads the token
 * once on the client and falls back to the same value during SSR.
 */
export const ACCENT_FALLBACK = "#C6FF3D";

export function getAccent(): string {
    if (typeof window === "undefined") return ACCENT_FALLBACK;

    const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();

    return value || ACCENT_FALLBACK;
}
