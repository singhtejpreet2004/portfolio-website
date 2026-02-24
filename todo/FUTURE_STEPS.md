# Future Steps — Deployment & CI/CD

Picking up from where we left off. Everything is merged and committed locally. Just need to push `main` and wire up Vercel.

---

## Step 1 — Add `workflow` scope to GitHub CLI

The push to `main` failed because the token is missing the `workflow` scope (needed to push `.github/workflows/` files). Run this in your terminal — it opens a browser to approve:

```bash
gh auth refresh -h github.com -s workflow
```

After approving in the browser, push:

```bash
git push origin main
```

---

## Step 2 — Connect the repo to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `singhtejpreet2004/portfolio-website`
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `.` (project root)
5. Add the three environment variables before deploying:

| Variable | Value |
|---|---|
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not account password) |
| `SITE_URL` | Your Vercel domain, e.g. `https://portfolio-website-xxx.vercel.app` |

6. Click **Deploy**

> Gmail App Passwords require 2FA on your Google account. Guide: https://support.google.com/accounts/answer/185833

---

## Step 3 — Add GitHub Secrets for the CI/CD pipeline

The deploy workflow in `.github/workflows/deploy.yml` needs three secrets. Add them at:

**GitHub → repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Where to get the value |
|---|---|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | Run `vercel link` in the project root → check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same `.vercel/project.json` after `vercel link` |

To get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:

```bash
npx vercel link
cat .vercel/project.json
# {"orgId":"xxx","projectId":"yyy"}
```

---

## Step 4 — Add the hero screenshot

The root `README.md` embeds `public/images/preview.png` but the file doesn't exist yet. Once you have a screenshot of the hero:

```bash
cp /path/to/your/screenshot.png public/images/preview.png
git add public/images/preview.png
git commit -m "docs: add hero preview screenshot"
git push origin main
```

---

## Step 5 — (Optional) Custom domain

If you want `singhtejpreet.com` pointing to Vercel:

1. Vercel → project → Settings → Domains → Add `singhtejpreet.com`
2. Add a CNAME record at your DNS provider: `singhtejpreet.com` → `cname.vercel-dns.com`
3. Vercel provisions HTTPS automatically

---

## What's already done

- All features merged into `main` (education carousel, achievements bento, experience timeline, projects carousel, skills terminal, about/nav overhauls)
- Stash polish changes applied: About spring animations, Achievements sizing, Contact live API, Skills opacity/spring fixes, GlobalContextMenu hire API wired
- Conflict resolution: 7 merge conflicts resolved, `main` has everything
- Docs: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`, `SECURITY.md`
- GitHub templates: bug report, feature request, PR template
- Source READMEs: 13 `README.md` files across all `src/` folders
- CI workflow (`.github/workflows/ci.yml`): lint → typecheck → build on every push/PR
- Deploy workflow (`.github/workflows/deploy.yml`): Vercel preview on PRs, production on merge to `main`
