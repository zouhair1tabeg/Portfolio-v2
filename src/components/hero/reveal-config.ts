/**
 * Single source of truth for the cursor-reveal feel.
 * All distances are fractions of the portrait height unless stated otherwise.
 */
export type RevealConfig = {
    /** Base blob radius. 0.18 ≈ 18% of the canvas height. */
    radius: number;
    /** Elongation along the movement vector (higher = more liquid). */
    stretch: number;
    /** Cursor follow factor per 60 fps frame (0 – 1). Lower = more inertia. */
    damping: number;
    /** Follow factors for the five trail points, head → tail. */
    trailDamping: readonly [number, number, number, number, number];
    /** Extra radius gained from movement speed. */
    radiusBoost: number;
    /** Amount of organic wobble on the blob contour. */
    noiseAmount: number;
    /** Frequency of the contour noise. */
    noiseScale: number;
    /** Edge feathering. 0 = hard cut, 1 = very soft. */
    edgeSoftness: number;
    /** Seconds of stillness before the blob fades out. */
    idleDelay: number;
    /** How quickly the blob fades in/out. */
    revealSpeed: number;
};

export const REVEAL_CONFIG: RevealConfig = {
    radius: 0.2,
    stretch: 1.6,
    damping: 0.16,
    trailDamping: [0.2, 0.13, 0.095, 0.07, 0.05],
    radiusBoost: 0.85,
    noiseAmount: 0.075,
    noiseScale: 4.6,
    edgeSoftness: 0.24,
    idleDelay: 0.7,
    revealSpeed: 8,
};
