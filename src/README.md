# src/

All application source code. This is a [Next.js App Router](https://nextjs.org/docs/app) project with TypeScript throughout.

---

## Structure

| Folder | Description |
|---|---|
| [`app/`](app/README.md) | Next.js App Router — routes, root layout, global CSS, API handlers |
| [`components/`](components/README.md) | All React components, organized by role |
| [`contexts/`](contexts/README.md) | React context providers for cross-component state |
| [`data/`](data/README.md) | Static typed content — profile, skills, experience, projects, education, achievements |
| [`hooks/`](hooks/README.md) | Custom React hooks |
| [`lib/`](lib/README.md) | Shared utility functions (client and server) |
| [`types/`](types/README.md) | Centralized TypeScript interface definitions |

---

## Key Concepts

**Content is data.** All portfolio content (bio, skills, projects, experience) lives in `src/data/` as plain TypeScript objects. Components read from these files — they contain no hardcoded strings. To update the portfolio, edit the data files.

**Design tokens are CSS custom properties.** The design system is defined in `src/app/globals.css`. Components reference variables like `var(--color-cyan)` rather than raw hex values, making global theme changes a single-file edit.

**Providers wrap the app.** `ThemeProvider` and `LenisProvider` are mounted in `src/app/layout.tsx` and provide their values to the entire tree via React context.
