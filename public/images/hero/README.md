# Hero portrait textures

The cursor reveal samples two images that **must be pixel-aligned**: same
dimensions, same crop, same framing. Only the styling of B should differ.

| File | Role |
| --- | --- |
| `portrait-base.png` | Image A — always visible (also used as the accessible `<img>` and the mobile ghost). |
| `portrait-reveal.png` | Image B — revealed inside the blob. |

## Replacing the placeholders

1. Export both images at the **same pixel dimensions** (currently `900 × 1118`,
   portrait 4:5-ish). Any size works as long as A and B match, but keep the long
   side ≤ 1200 px: the canvas DPR is capped at 1.5 and the card is at most
   400 px wide.
2. Keep the subject in the exact same position in both files. The shader samples
   A and B with the same `object-fit: cover` mapping, so a shifted subject will
   be visible at the blob edge.
3. Write the files to `public/images/hero/portrait-base.png` and
   `public/images/hero/portrait-reveal.png`. No code change is needed.
4. A can be a cut-out (transparent PNG) if desired, but B must **not** have a
   different silhouette: the reveal is a rectangular texture mix, not a mask.

PNG is lossless but heavy (~0.85–1 MB each at this size). If you keep the same
file names, exporting with a lower resolution or running the PNGs through a
lossless optimiser is enough to cut most of the weight.

## How the current placeholders were generated

They are derived from `public/images/zh-hero.webp` (1200 × 1490, downscaled to
900 × 1118) so the effect is visible until the real pair is ready:

- **A** — grayscale → lime duotone (`#060806` / `#607058` / `#D6E8BE`),
  slight vignette so the edges fall into the ink background.
- **B** — full colour, boosted saturation/contrast, a soft lime glow from the
  top-left, and the exact same vignette so both stay aligned.

No third-party assets are used.
