# src/components/

All React components, divided into four sub-folders by role.

---

## Sub-folders

| Folder | Description |
|---|---|
| [`layout/`](layout/README.md) | Persistent chrome — Navigation, PipelineSpine, Footer |
| [`providers/`](providers/README.md) | React context providers — ThemeProvider, LenisProvider |
| [`sections/`](sections/README.md) | Full-width page sections — Hero, About, Skills, Experience, Projects, Education, Achievements, Contact |
| [`ui/`](ui/README.md) | Reusable UI primitives — CustomCursor, LoadingScreen, GlobalContextMenu, SectionHeading, AnimatedCounter |

---

## Conventions

- Every component is a named export from its own `.tsx` file
- No index barrel files — import directly: `import { Hero } from '@/components/sections/Hero'`
- Dynamic per-component values (colors, transforms) use inline styles with CSS variables; static styles use Tailwind utility classes
- All animated elements include `willChange: 'transform'` or `willChange: 'opacity'` to hint GPU compositing
- Section components receive no props — they read from `src/data/` directly
