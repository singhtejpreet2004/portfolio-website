# Status Report — Portfolio Website (as of 2026-02-24)

---

## Branch State

| Branch | Status |
|---|---|
| `main` | Latest committed code + stash polish applied. **This is the source of truth.** |
| `education-section` | 2 commits behind main. Had the stash (now applied to main). Can be archived. |
| `hero-section-changes`, `hero_section_colour`, `about_section`, `skills-section-revamp` | Feature branches, all merged into main. Can be deleted. |

The stash `wip-pre-main-merge` (on `education-section`) has been applied to `main` and committed. It included:
- `src/app/globals.css` — terminal color polish (darker, bluer tones)
- `src/components/sections/About.tsx` — spring physics on scroll slide-in
- `src/components/sections/Achievements.tsx` — sizing/padding reduction, narrowed max-width
- `src/components/sections/Contact.tsx` — wired real `/api/contact` fetch, added error state, removed stale Download icon
- `src/components/sections/Skills.tsx` — spring physics on entrance/exit, improved opacity values
- `src/components/ui/GlobalContextMenu.tsx` — wired real `/api/hire` fetch (fire-and-forget)
- `package.json` / `package-lock.json` — added `nodemailer` + `@types/nodemailer`
- `.gitignore` — allow `.env.example` to be committed
- `README.md` — full rewrite with badges, feature table, section guide, install instructions

---

## What's Built (Complete)

### Sections (8 total)
- **Hero** — canvas dot-grid (gravitational lens), floating metric badges, stacked data dashboard cards (pipeline ↔ video)
- **About** — animated stat counters, bio, social links, spring parallax
- **Skills** — interactive terminal with `ls`, `cat`, `tree`, `htop`, `sudo hire`, `neofetch` commands
- **Experience** — git-branch timeline with tech stack chips and achievement callouts
- **Projects** — horizontal scroll carousel, featured project view, metrics display
- **Education** — horizontal scroll carousel with institution cards
- **Achievements** — bento grid (certifications, awards, accomplishments)
- **Contact** — rate-limited form wired to `/api/contact` Gmail delivery

### UI & Infrastructure
- Custom magnetic cursor
- Session-once loading screen (typewriter terminal animation)
- Global right-click context menu (10 actions)
- Hire popup (3-step: form → resume → thanks)
- Theme toggle (dark/light, circular clip-path reveal)
- Pipeline Spine (scroll-fill git-branch visualization, left sidebar)
- Lenis smooth scroll synced with Framer Motion
- `POST /api/contact` — rate-limited, sanitized, Gmail SMTP
- `POST /api/hire` — same security stack
- CI workflow: lint → typecheck → build on every push/PR
- Deploy workflow: Vercel preview on PRs, production on `main` merge
- 9 easter eggs in the hero section

---

## Not Done / Blockers

### Deployment (nothing is live yet)
- Repo not pushed to GitHub — run `git push origin main` (may need `gh auth refresh -h github.com -s workflow` first)
- Vercel not connected — see `todo/FUTURE_STEPS.md` Step 2
- Env vars not set: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `SITE_URL`
- GitHub CI/CD secrets not set: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `singhtejpreet.com` custom domain not wired to Vercel

### Data / Content Placeholders
See `todo/placeholders.md` for the full breakdown. Summary:

| Issue | File | Severity |
|---|---|---|
| Wrong GitHub username in project URLs | `src/data/projects.ts` | Low (broken links) |
| Wrong GitHub username in profile link | `src/data/profile.ts` | Low (broken link) |
| `singhtejpreet.com` not deployed yet | `src/data/profile.ts` | Low (404 until live) |
| Missing `public/images/preview.png` | — | Low (README only) |
| Env vars not configured | `.env.local` / Vercel | **High — contact + hire forms non-functional** |

---

## Recommended Next Steps (in order)

1. Fix GitHub username in `src/data/profile.ts` and `src/data/projects.ts` (or remove broken project URLs)
2. Push main to GitHub: `git push origin main`
3. Connect repo to Vercel, add env vars, deploy
4. Set GitHub secrets for CI/CD
5. Take hero screenshot → `public/images/preview.png`
6. Wire custom domain `singhtejpreet.com` to Vercel (optional)
