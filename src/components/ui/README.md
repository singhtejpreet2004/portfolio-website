# src/components/ui/

Reusable UI primitives used across sections and layout components.

---

## Contents

| File | Export | Description |
|---|---|---|
| `AnimatedCounter.tsx` | `AnimatedCounter` | Animates a number from 0 to a target value on mount/in-view |
| `CustomCursor.tsx` | `CustomCursor` | Replaces the native cursor with a magnetic dot that follows the pointer |
| `GlobalContextMenu.tsx` | `GlobalContextMenu` | Right-click context menu overlay, mounted globally in the root layout |
| `LoadingScreen.tsx` | `LoadingScreen` | Session-once terminal-style loading animation |
| `SectionHeading.tsx` | `SectionHeading` | Consistent section title with optional subtitle and accent line |

---

## Component Details

### `AnimatedCounter`

Animates a numeric value using Framer Motion's `useMotionValue` and `useTransform`. Triggers when the element enters the viewport via `useInView`.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `value` | `number` | Target value to count up to |
| `duration` | `number?` | Animation duration in seconds (default: 2) |
| `className` | `string?` | Additional class names |

---

### `CustomCursor`

Renders a `div` that tracks `mousemove` events with a spring-based lag (Framer Motion `useSpring`). Hidden on touch devices (`pointer: coarse`). Mounts as a fixed overlay with `pointer-events: none`.

---

### `GlobalContextMenu`

Listens for `contextmenu` events on `document`. Renders a portal-based floating menu at the pointer position. Contains 10 terminal-style actions across 4 groups:

| Group | Actions |
|---|---|
| Inspect | `inspect pipeline`, `view source`, `run diagnostics`, `trace --path` |
| Admin | `force deploy`, `whoami tejpreet`, `ls ~/skills` |
| Links | `view resume` |
| Hire | `hire tejpreet`, `sudo hire tejpreet` |

Processing items show a 900ms "processing..." toast before delivering a randomized response message. Direct link items navigate immediately.

---

### `LoadingScreen`

Plays on page load. Uses GSAP for the progress bar timeline. Four typewriter lines at 600ms intervals. Exits with a Framer Motion `exit` animation (`opacity: 0, y: -16`). The overlay is `fixed inset-0 z-[9999]`.

---

### `SectionHeading`

**Props:**
| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Small uppercase label above the title (e.g. `"// 02"`) |
| `title` | `string` | Main heading text |
| `subtitle` | `string?` | Optional subtitle below the title |
| `className` | `string?` | Additional class names |
