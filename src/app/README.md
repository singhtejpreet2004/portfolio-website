# src/app/

Next.js [App Router](https://nextjs.org/docs/app) directory. Contains the root layout, the home page, global styles, and all API route handlers.

---

## Contents

| File / Folder | Description |
|---|---|
| `layout.tsx` | Root layout — mounts fonts, `ThemeProvider`, `LenisProvider`, `LoadingScreen`, `CustomCursor`, `GlobalContextMenu`, `Navigation`, `PipelineSpine`, and `Footer` |
| `page.tsx` | Home page — composes all section components in order |
| `globals.css` | Design system — all CSS custom properties, base resets, and global utility classes |
| `favicon.ico` | Browser tab icon |
| [`api/`](api/README.md) | Next.js API route handlers |

---

## Key Concepts

### Root Layout (`layout.tsx`)

The layout is the single mount point for global UI chrome and providers. The component tree is:

```
RootLayout
├── ThemeProvider          ← dark/light theme state
│   └── LenisProvider      ← smooth scroll
│       ├── LoadingScreen  ← session-once intro animation
│       ├── CustomCursor   ← magnetic cursor
│       ├── GlobalContextMenu ← right-click overlay
│       ├── Navigation     ← sticky header
│       ├── PipelineSpine  ← left sidebar
│       ├── {children}     ← page content
│       └── Footer
```

### Design System (`globals.css`)

Defines all design tokens as CSS custom properties under `:root`. Key variables:

| Variable | Value | Usage |
|---|---|---|
| `--color-cyan` | `#58a6ff` | Primary accent, links, highlights |
| `--color-yellow` | `#FFD300` | Secondary accent, warnings |
| `--color-green` | `#5BCC7E` | Success states, data labels |
| `--color-purple` | `#3A10E5` | Tertiary accent |
| `--bg-primary` | `#10162F` | Page background |
| `--bg-secondary` | `#1A2142` | Card backgrounds |
| `--border-color` | `rgba(255,255,255,0.08)` | Subtle borders |

All components use these variables rather than raw hex values so that the visual language stays consistent.

### Home Page (`page.tsx`)

Renders sections in this order:
1. `Hero`
2. `About`
3. `Skills`
4. `Experience`
5. `Projects`
6. `Education`
7. `Achievements`
8. `Contact`
