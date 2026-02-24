# src/components/sections/

Full-width page sections. Rendered in order by `src/app/page.tsx`. Each section reads its content from the corresponding file in `src/data/`.

---

## Contents

| File | Section | Data Source | Description |
|---|---|---|---|
| `Hero.tsx` | Hero | `profile.ts` | Canvas dot-grid, floating badges, stacked dashboard cards, context menu, easter eggs |
| `About.tsx` | About | `profile.ts` | Bio paragraphs, animated stat counters, social links, avatar |
| `Skills.tsx` | Skills | `skills.ts` | Skill categories with proficiency bars and years of experience |
| `Experience.tsx` | Experience | `experience.ts` | Timeline cards with role, tech stack chips, and key achievement callout |
| `Projects.tsx` | Projects | `projects.ts` | Featured project hero card + project grid with metrics |
| `Education.tsx` | Education | `education.ts` | Horizontal-scroll carousel with institution cards |
| `Achievements.tsx` | Achievements | `achievements.ts` | Bento grid of certifications, awards, and accomplishments |
| `Contact.tsx` | Contact | — | Contact form with client-side validation, submits to `/api/contact` |

---

## Key Concepts

### Hero (`Hero.tsx`)

The largest and most complex component (~1000 lines). Contains several sub-components defined in the same file:

- **`InteractiveDotGrid`** — HTML Canvas with `requestAnimationFrame` loop. Mouse proximity creates a gravitational lens — nearby dots glow and connect with lines. Canvas dimensions are cached in refs (no per-frame DOM reads). Loop pauses via `visibilitychange` API when the tab is hidden.
- **`FloatingSquircle`** — 4 metric badge overlays positioned asymmetrically around the dashboard. Each has a jitter animation on click.
- **`DataDashboard`** — Card-stack container. Holds `PipelineDashboardCard` (front) and `VideoPipelineDashboard` (back). Top-right 100×80px hit area swaps cards with a spring animation.
- **`PipelineDashboardCard`** — Live throughput chart, Kafka/Spark/Delta pipeline rows, terminal output.
- **`VideoPipelineDashboard`** — FPS counter, frame buffer bar chart, video pipeline terminal.
- **`ContextMenu`** — 10 terminal-style right-click actions. Processing toast → randomized message.
- **`HirePopup`** + **`HireModalShell`** — 3-step hire flow. `HireModalShell` is defined at module level to prevent remounting on each keystroke.

**Easter egg trigger summary:**

| Trigger | Effect |
|---|---|
| Konami Code | Special animation |
| Mouse shake (7+ direction changes in 250ms) | Matrix Rain overlay |
| Triple click | Easter egg |
| Long press (2s+) | Easter egg |
| Fast scroll | Easter egg |
| Slow cursor trail | Easter egg |
| Click "Tejpreet" text | Easter egg |
| Double-click dashboard | Easter egg |
| Hover all 4 badges | Easter egg |

### Education (`Education.tsx`)

Horizontal-scroll carousel. Cards scroll left-to-right using `overflow-x: scroll` with `scroll-snap-type`. Yellow accent color. Smooth scroll handled by the Lenis instance from `LenisProvider`.

### Achievements (`Achievements.tsx`)

Bento grid layout. Items are typed as `certification | award | accomplishment` (from `src/types/index.ts`). Each type gets a distinct badge color from the data.

### Contact (`Contact.tsx`)

Client-side validation before `fetch('/api/contact', ...)`. Displays inline field errors and a success/error toast on submission.
