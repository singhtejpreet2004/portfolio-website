# Tejpreet Singh — Portfolio Website

Personal portfolio for Tejpreet Singh, Data Engineer. Built to feel like a living data pipeline — interactive, terminal-flavored, and performance-focused.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Fonts | Inter · JetBrains Mono · Space Grotesk |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, ThemeProvider, LoadingScreen
│   ├── page.tsx            # Page composition
│   └── globals.css         # Design tokens (CSS custom properties)
│
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx  # Top nav bar
│   │   └── PipelineSpine.tsx  # Fixed left-side git-graph spine
│   │
│   ├── sections/
│   │   └── Hero.tsx        # Hero section (primary canvas — see below)
│   │
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   │
│   └── ui/
│       └── LoadingScreen.tsx  # Terminal boot animation on every page load
```

---

## Hero Section — Feature Reference

`src/components/sections/Hero.tsx` is the main piece. Everything below lives in that one file.

### Interactive Dot Grid (`InteractiveDotGrid`)
- HTML Canvas, `requestAnimationFrame` draw loop
- Dots respond to mouse proximity — glow and connect with lines
- Canvas dimensions cached in refs (no per-frame DOM reads)
- Draw loop pauses via `visibilitychange` API when tab is hidden
- `willChange: transform` for GPU compositing

### Matrix Rain (`MatrixRain`)
- Classic character rain using `--color-cyan` palette
- **Trigger:** vigorous horizontal mouse shake — dx > 50px within 250ms window, 7+ directional changes
- Auto-dismisses after ~4 seconds

### Right-Click Context Menu (`ContextMenu`)
10 terminal-style items across 4 groups:
- `inspect pipeline`, `{} view source`, `⚡ run diagnostics`, `~ trace --path`
- `! force deploy`, `? whoami tejpreet`, `ls ~/skills`
- `→ view resume` — opens `/resume.pdf`
- `♥ hire tejpreet` — opens hire form
- `★ sudo hire tejpreet` — same hire form (alias)

Each item (except direct links) shows a `processing...` toast for 900ms before delivering a randomized response. Messages never repeat back-to-back per category (`lastMenuMsg` ref).

### Hire Popup — 3-Step State Machine (`HirePopup` + `HireModalShell`)
Triggered from context menu. Three sequential modals:
1. **`hire.sh`** — form: Name, Company, Email (required), Phone (optional). Validated before advance.
2. **`access_granted.sh`** — resume download CTA.
3. **`thank_you.sh`** — confirmation with name interpolation.

`HireModalShell` is defined at module level (not inside `HirePopup`) to prevent React remounting on every keystroke.

### Stacked Dashboard Cards (`DataDashboard`)
Two cards in a card stack, swappable:
- **Front:** `PipelineDashboardCard` — live throughput chart, Kafka/Spark/Delta pipeline rows, terminal output, action buttons.
- **Back:** `VideoPipelineDashboard` — FPS counter, frame buffer bar chart (yellow palette), video pipeline rows, video terminal output.

Top-right corner (100×80px hit area) — hover to peek, click to spring-swap cards. Back card renders at `opacity: 0.65`, rotated -2.5°, offset 24px right / 18px up.

### Floating Squircles (`FloatingSquircle`)
4 metric badges floating around the dashboard, `z-[30]` so they always sit above both stacked cards. Click to jitter + flash red. Positions are asymmetric (not midpoints).

### Easter Egg Guide
Hidden panel accessible from the hero — lists all discoverable interactions:
- Mouse shake → Matrix Rain
- Right-click anywhere → Context menu
- Dashboard corner → Card swap
- `sudo hire tejpreet` → Hire flow
- Squircle clicks
- Keyboard shortcut (`?`)

---

## PipelineSpine — Scroll-Fill Progress

`src/components/layout/PipelineSpine.tsx`

Fixed left column visible on `xl` breakpoints. Mimics a git graph:
- **Main branch line** — faint background stroke
- **Progress fill** — `stroke="url(#spineGrad)"` with `gradientUnits="userSpaceOnUse"`, coordinates pinned to `y1=0 y2=vh` so the gradient (cyan → purple → yellow) maps to the full page height. The line clips at `scrollProgress * vh`, giving a genuine color-fill-on-scroll effect.
- **Branch nodes** — fork/merge curves per section, active node glows and animates a data particle
- **Leading particle** — bright cyan dot tracks scroll position with pulse animation
- **Glow filter** — `feGaussianBlur` + `feMerge` SVG filter on the fill line

> **Note on gradient units:** SVG `linearGradient` with default `gradientUnits="objectBoundingBox"` on a perfectly vertical `<line>` (x1 === x2) collapses to a zero-width bounding box and the gradient doesn't render. Must use `gradientUnits="userSpaceOnUse"` with absolute pixel coordinates.

---

## Loading Screen

`src/components/ui/LoadingScreen.tsx`

Plays on every page load (no sessionStorage skip):
- `fixed inset-0 z-[9999]` dark navy overlay
- Terminal window with 4 typewriter lines at 600ms intervals
- Animated progress bar filling to 100% over 2.6s
- Fades out with `exit={{ opacity: 0, y: -16 }}`
- Static CSS dot grid background (no canvas overhead)

---

## Design Tokens (`globals.css`)

Key custom properties:

```css
--color-cyan:   #58a6ff;   /* GitHub dark-theme accent blue */
--color-purple: #a371f7;
--color-yellow: #ffd700;
--color-green:  #5bcc7e;

--bg-primary:   var(--color-navy-deep);    /* #0D1117 */
--bg-secondary: var(--color-navy-medium);  /* #1A2142 */
--border-color: rgba(255,255,255,0.08);

--shadow-glow-cyan: 0 0 20px rgba(88,166,255,0.3);
```

---

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Branch Strategy

```
main                    ← stable, production-ready
└── hero-section-changes  ← merged: full hero + spine + loading screen
```
