# Tejpreet Singh — Data Engineer Portfolio

![Preview](public/images/preview.png)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-EF0082?style=flat-square&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)

A fully custom, dark-mode portfolio for a data engineer — built with Next.js 16, Framer Motion physics, and a developer-aesthetic design system. Features interactive easter eggs, a real-time contact + hire pipeline, smooth scroll, and a canvas-rendered dot grid.

---

## Live Demo

[singhtejpreet.com](https://singhtejpreet.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12, GSAP 3 |
| Smooth Scroll | Lenis 1.3 |
| Email (API) | Nodemailer + Gmail SMTP |
| Fonts | Inter, JetBrains Mono, Space Grotesk |
| Deployment | Vercel |

---

## Features

### Sections

| Section | Description |
|---|---|
| **Hero** | Canvas dot-grid with gravitational lens, floating badges, interactive data dashboard |
| **About** | Bio, animated stat counters, social links |
| **Skills** | Skills by category with proficiency indicators |
| **Experience** | Timeline of work experience with tech stack chips |
| **Projects** | Featured project showcase with metrics |
| **Education** | Horizontal-scroll carousel with institution cards |
| **Achievements** | Bento grid of certifications, awards, and accomplishments |
| **Contact** | Rate-limited contact form with email delivery |

### UI & UX

- **Custom cursor** — magnetic dot that follows pointer
- **Loading screen** — session-once animated intro with typewriter terminal lines
- **Global context menu** — right-click anywhere for custom actions including hire flow
- **Smooth scroll** — Lenis-powered with Framer Motion sync
- **Theme toggle** — dark/light with circular clip-path reveal animation
- **Pipeline Spine** — animated git-branch visualization in the left sidebar
- **Hire popup** — multi-step form: application → resume download → confirmation

### API

- `POST /api/contact` — contact form with rate limiting, sanitization, and Gmail delivery
- `POST /api/hire` — hire inquiry with the same security pipeline

---

## Easter Eggs

There are **9 hidden interactions** in the hero section:

1. **Konami Code** — `↑ ↑ ↓ ↓ ← → ← → B A`
2. **Mouse Shake** — shake the mouse rapidly (7+ direction changes in 250ms)
3. **Triple Click** — triple-click the hero
4. **Long Press** — hold click for 2+ seconds
5. **Scroll Bomb** — scroll very fast
6. **Cursor Trail** — move mouse slowly for a while
7. **Name Click** — click "Tejpreet" in the title
8. **Dashboard Double Click** — double-click the data dashboard card
9. **Badge Hover** — hover all 4 floating badges consecutively

---

## Project Structure

```
portfolio-website/
├── public/
│   ├── fonts/                     # Self-hosted Satoshi font
│   ├── images/                    # Avatar, preview screenshot
│   └── resume.pdf                 # Downloadable resume
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── contact/route.ts   # Contact form endpoint
│   │   │   └── hire/route.ts      # Hire form endpoint
│   │   ├── globals.css            # Design system (CSS variables)
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── layout/                # Navigation, Footer, PipelineSpine
│   │   ├── providers/             # LenisProvider, ThemeProvider
│   │   ├── sections/              # Hero, About, Skills, Experience, ...
│   │   └── ui/                    # CustomCursor, LoadingScreen, ...
│   ├── contexts/                  # MouseContext (spring mouse position)
│   ├── data/                      # Static data (profile, skills, projects, ...)
│   ├── hooks/                     # useMouseParallax
│   ├── lib/                       # api-utils (server), utils (client)
│   └── types/                     # TypeScript interfaces
├── .env.example                   # Environment variable template
├── next.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A **Gmail account** with an [App Password](https://support.google.com/accounts/answer/185833) for the contact form

### Installation

```bash
git clone https://github.com/tejpreetsingh/portfolio-website.git
cd portfolio-website
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `GMAIL_USER` | Yes | Gmail address that sends contact/hire emails |
| `GMAIL_APP_PASSWORD` | Yes | Gmail App Password (not your account password) |
| `SITE_URL` | Yes | Production URL, no trailing slash (e.g. `https://yoursite.com`) |

> Gmail App Passwords require 2FA enabled on your Google account. See the [Google guide](https://support.google.com/accounts/answer/185833).

### Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

### Vercel (Recommended)

1. Import the repository in the [Vercel dashboard](https://vercel.com/new)
2. Add the three environment variables under **Settings → Environment Variables**:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `SITE_URL` (set to your Vercel domain or custom domain)
3. Deploy — Vercel auto-detects Next.js and configures the build

### Other Platforms

Any platform that supports Next.js 16 (Railway, Render, AWS Amplify, self-hosted Node). Ensure the three env vars are set before running `npm run build`.

---

## Architecture Notes

### Design System

All design tokens live in `src/app/globals.css` as CSS custom properties:

```css
--color-cyan:   #58a6ff;   /* GitHub dark-theme accent blue */
--color-yellow: #FFD300;
--color-green:  #5BCC7E;
--color-purple: #3A10E5;
--bg-primary:   #10162F;
--bg-secondary: #1A2142;
--border-color: rgba(255,255,255,0.08);
```

### Animation Philosophy

- **Framer Motion** handles component entrance, hover, and spring physics
- **GSAP** handles complex timeline-based sequences (loading screen)
- **Lenis** provides smooth scroll; its scroll events sync with `useScroll` MotionValues
- **Canvas animations** (dot grid) use `requestAnimationFrame` with a visibility pause to save CPU

### Data Layer

All content is colocated in `src/data/` as typed TypeScript modules. Updating the portfolio means editing these files — no CMS or database required.

### API Security

Both API routes share security utilities from `src/lib/api-utils.ts`:

- In-memory rate limiter (5 req/IP/15 min)
- HTML escape + input truncation before email rendering
- Required env var guard — fails fast with a clear error if misconfigured

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on opening issues, branching, and submitting pull requests.

---

## Security

See [SECURITY.md](SECURITY.md) for the responsible disclosure policy.

---

## License

[MIT](LICENSE) © 2026 Tejpreet Singh
