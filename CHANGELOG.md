# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.0.0] — 2026-02-23

Initial public release.

### Added

**Sections**
- Hero section with canvas dot-grid (gravitational lens effect), floating metric badges, and stacked data dashboard cards
- About section with animated stat counters and social links
- Skills section organized by category with proficiency indicators
- Experience timeline with tech stack chips and key achievement callouts
- Projects showcase with featured project and metrics
- Education horizontal-scroll carousel
- Achievements bento grid (certifications, awards, accomplishments)
- Contact form section with rate limiting and Gmail delivery

**UI Components**
- Custom magnetic cursor
- Session-once loading screen with typewriter terminal animation
- Global right-click context menu with 10 terminal-style actions
- Hire popup — 3-step flow: application → resume download → confirmation
- Section heading component with consistent styling
- Animated number counter component

**Layout**
- Sticky navigation header
- Pipeline Spine — scroll-fill git-branch visualization in left sidebar (xl breakpoints)
- Footer

**Providers**
- ThemeProvider — dark/light toggle with circular clip-path reveal animation
- LenisProvider — smooth scroll synced with Framer Motion MotionValues

**API Routes**
- `POST /api/contact` — rate-limited, sanitized, Gmail SMTP delivery
- `POST /api/hire` — same security stack as contact

**Easter Eggs (9 total)**
- Konami Code
- Mouse shake → Matrix Rain
- Triple click
- Long press
- Scroll bomb
- Cursor trail
- Name click
- Dashboard double-click
- Badge hover sequence

**Infrastructure**
- Next.js 16 App Router with Turbopack
- TypeScript throughout
- Tailwind CSS v4 design system with CSS custom properties
- Framer Motion 12 spring physics
- GSAP 3 timeline animations
- Lenis smooth scroll
- In-memory API rate limiter
- HTML sanitization and input truncation for all API routes
- `.env.example` for environment variable documentation
- MIT license

---

## [Unreleased]

No unreleased changes.
