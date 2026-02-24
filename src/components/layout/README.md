# src/components/layout/

Persistent UI chrome that wraps the page content. Mounted in `src/app/layout.tsx` — present on every route.

---

## Contents

| File | Export | Description |
|---|---|---|
| `Navigation.tsx` | `Navigation` | Sticky top navigation bar with section links and theme toggle |
| `PipelineSpine.tsx` | `PipelineSpine` | Animated git-branch visualization in the left sidebar |
| `Footer.tsx` | `Footer` | Bottom footer with copyright and social links |

---

## Component Details

### `Navigation`

Sticky `fixed top-0` header. Contains:
- Logo / name on the left
- Section anchor links in the center
- Theme toggle button on the right

Highlights the active section based on scroll position using `IntersectionObserver`.

---

### `PipelineSpine`

Visible on `xl` breakpoints only (`hidden xl:flex`). Fixed left column that mimics a git branch graph:

- **Main branch line** — faint background stroke running the full page height
- **Progress fill** — SVG `<line>` with `stroke="url(#spineGrad)"` and `gradientUnits="userSpaceOnUse"`. Coordinates are pinned to `y1=0 y2=vh` so the cyan→purple→yellow gradient maps to the full page height. The `strokeDashoffset` is driven by `scrollProgress * vh`, creating a genuine color-fill-on-scroll effect.
- **Branch nodes** — SVG fork/merge curves at section breakpoints; the active node glows and shows a data particle animation
- **Leading particle** — bright cyan dot that tracks scroll position with a pulse animation
- **Glow filter** — `feGaussianBlur` + `feMerge` SVG filter on the progress fill

> **SVG gradient note:** A `linearGradient` with default `gradientUnits="objectBoundingBox"` on a perfectly vertical `<line>` (x1 === x2) collapses to a zero-width bounding box and does not render. This component uses `gradientUnits="userSpaceOnUse"` with absolute pixel coordinates to avoid the issue.

---

### `Footer`

Simple footer. Contains copyright notice, "built with" tech stack note, and social icon links.

---

## Dependencies

| Package | Usage |
|---|---|
| `framer-motion` | Scroll-driven animation values for PipelineSpine progress fill |
| `react-icons` | Social link icons in Footer |
