# Hero portrait textures

The cursor reveal samples two cut-out images that **must be pixel-aligned**:
same dimensions, same framing and the *same alpha channel*. Only the grade of
B differs.

| File | Role |
| --- | --- |
| `portrait-base.webp` | Image A — always visible, also the accessible `<img>`. |
| `portrait-reveal.webp` | Image B — revealed inside the cursor blob. |

Both are currently **1200 × 1490**, WebP quality 92, with an alpha cut-out
(306 KB and 291 KB). The shader samples B over the exact box of A, so any
mismatch is visible at the blob edge.

## Replacing them

1. Export both images at the **same pixel dimensions** and with the same crop.
   Keep the long side ≤ 2048 px; the shader never needs more than roughly 1.5×
   the portrait height on screen.
2. Keep the subject in the exact same position in both files.
3. Use the same alpha silhouette for A and B. A transparent background is
   expected: the whole page background shows through the cut-out.
4. Write the files to `public/images/hero/portrait-base.webp` and
   `public/images/hero/portrait-reveal.webp`. If the dimensions change, update
   `width` / `height` in `src/components/hero/hero-portrait-assets.ts` too.

The display name textures are **not** image assets: `useHeroNameTextures.ts`
draws the fill and stroke versions from the real DOM heading at runtime, so a
font or copy change needs no export.

## How the current files were generated

- A — grayscale → lime duotone (`#070907` / `#58664D` / `#E7F2D6`), a light
  unsharp mask, no vignette.
- B — full colour, saturation/contrast boost and a soft lime wash from the
  top-left, no vignette, same alpha so the two stay perfectly aligned.
- The alpha mask comes from macOS Vision person segmentation (`.accurate`)
  applied to `public/images/zh.png`, then resized and feathered by 0.6 px.

No third-party assets are used.
