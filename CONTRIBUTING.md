# Contributing

Thank you for considering a contribution. This is a personal portfolio project, but improvements, bug fixes, and ideas are welcome.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/portfolio-website.git
   cd portfolio-website
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Set up** environment variables:
   ```bash
   cp .env.example .env.local
   # Fill in GMAIL_USER, GMAIL_APP_PASSWORD, SITE_URL
   ```
5. **Start** the dev server:
   ```bash
   npm run dev
   ```

---

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-description>` | `feat/dark-mode-toggle` |
| Bug fix | `fix/<short-description>` | `fix/contact-form-validation` |
| Documentation | `docs/<short-description>` | `docs/readme-update` |
| Refactor | `refactor/<short-description>` | `refactor/hero-canvas` |
| Chore | `chore/<short-description>` | `chore/update-deps` |

Always branch from `main`.

---

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(hero): add konami code easter egg
fix(contact): handle rate limit error response correctly
docs(readme): add deployment section
chore: bump framer-motion to 12.34.0
```

---

## Pull Request Process

1. Open a PR against `main` with a clear title following commit conventions
2. Fill out the PR template — describe what changed and how to test it
3. Make sure `npm run lint` and `npx tsc --noEmit` both pass
4. Make sure `npm run build` succeeds
5. PRs that modify visual components should include a before/after screenshot or screen recording

---

## Code Style

- **TypeScript** — all new files must be `.ts` or `.tsx`, no `any`
- **Tailwind CSS v4** — prefer utility classes; avoid inline styles except for dynamic values that Tailwind can't handle
- **Framer Motion** — use `willChange: 'transform'` on animated elements; avoid layout-triggering animations
- **Data** — add new content to `src/data/` files; keep components free of hardcoded strings
- **API routes** — use `api-utils.ts` helpers for any new route (sanitization, rate limiting, env guards)

---

## What to Contribute

Well-suited contributions:
- Bug fixes for broken interactions
- Accessibility improvements (ARIA labels, keyboard navigation)
- Performance improvements
- Typo / copy fixes
- New easter eggs that fit the terminal-hacker aesthetic

Less suitable (better opened as issues first):
- Major layout redesigns
- New sections not related to Tejpreet's profile
- Replacing core libraries (Framer Motion, Lenis, Tailwind)

---

## Reporting Issues

Use the [GitHub issue templates](.github/ISSUE_TEMPLATE/) — one for bugs, one for feature requests. Include steps to reproduce for bugs and context for feature requests.

---

## Code of Conduct

Be respectful. Contributions of all experience levels are welcome as long as they meet the quality bar above.
