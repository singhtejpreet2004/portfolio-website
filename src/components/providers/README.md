# src/components/providers/

React context providers mounted at the root layout level (`src/app/layout.tsx`). They wrap the entire component tree and provide global state or behavior.

---

## Contents

| File | Export | Description |
|---|---|---|
| `ThemeProvider.tsx` | `ThemeProvider`, `useTheme` | Dark/light theme toggle with circular clip-path reveal animation |
| `LenisProvider.tsx` | `LenisProvider` | Smooth scroll via Lenis, synced with Framer Motion MotionValues |

---

## Component Details

### `ThemeProvider`

Manages a `dark | light` theme state. Boots in dark mode and clears any stale `localStorage` theme preferences from `next-themes`.

**Theme toggle animation:**
When the user clicks the toggle button, a circular clip-path animation expands from the click coordinates, revealing the new theme underneath. Implemented with a CSS `clip-path: circle(...)` transition on a full-screen overlay.

**Exports:**
- `ThemeProvider` — wrap your app with this
- `useTheme()` — returns `{ theme, toggleTheme, toggleRef }` for use in the Navigation component

---

### `LenisProvider`

Wraps [`ReactLenis`](https://github.com/darkroomengineering/lenis) to enable smooth scroll across the page.

**Configuration:**
| Option | Value | Effect |
|---|---|---|
| `lerp` | `0.08` | Interpolation speed — lower = smoother, slower |
| `duration` | `1.2` | Scroll animation duration |
| `smoothWheel` | `true` | Enable smooth wheel events |
| `touchMultiplier` | `1.5` | Touch scroll speed multiplier |

**Framer Motion sync:**
The provider subscribes to Lenis scroll events and updates Framer Motion's `useScroll` MotionValues. This ensures that Framer Motion scroll-driven animations (like `PipelineSpine` progress) track the smoothed Lenis position rather than the raw browser scroll position.

---

## Dependencies

| Package | Usage |
|---|---|
| `lenis` / `lenis/react` | Smooth scroll implementation |
| `framer-motion` | MotionValue sync in LenisProvider |
| `next-themes` | Referenced in ThemeProvider for cleanup |
