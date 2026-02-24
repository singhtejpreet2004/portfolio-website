# Placeholders — Things That Need Real Values

These are broken, incorrect, or missing values in the codebase that need to be filled before the site goes live.

---

## 1. GitHub URLs in `src/data/projects.ts` — Wrong Username

All four project GitHub links use `tejpreetsingh` but your portfolio repo lives under `singhtejpreet2004`. These URLs likely 404.

| Project | Current (broken) URL | What to do |
|---|---|---|
| Video Stream Analytics | `github.com/tejpreetsingh/video-stream-analytics` | If the repo exists under `singhtejpreet2004`, update to that URL. If it's private or doesn't exist yet, remove the `githubUrl` field. |
| ETL Airflow Spark | `github.com/tejpreetsingh/etl-airflow-spark` | Same as above |
| Delta Lakehouse | `github.com/tejpreetsingh/delta-lakehouse` | Same as above |
| System Monitor | `github.com/tejpreetsingh/system-monitor` | Same as above |

**File:** `src/data/projects.ts` lines 14, 26, 38, 50

Fix: either update all `githubUrl` values to the correct account (`singhtejpreet2004`), or remove the field if the repos aren't public.

---

## 2. GitHub Profile URL in `src/data/profile.ts` — Wrong Username

The GitHub social link points to `github.com/tejpreetsingh`, not your actual account.

**File:** `src/data/profile.ts` line 23–25

```ts
// Current (broken):
url: 'https://github.com/tejpreetsingh',

// Fix — update to your actual account:
url: 'https://github.com/singhtejpreet2004',
handle: '@singhtejpreet2004',
```

---

## 3. Website URL Not Live Yet

`singhtejpreet.com` is listed as a social link in `src/data/profile.ts` (line 41–43), but the site isn't deployed yet. Anyone who clicks it will get a 404 until Vercel + custom domain are configured (see `FUTURE_STEPS.md` Steps 2 and 5).

No code change needed — just deploy first.

---

## 4. Missing Hero Preview Screenshot

`README.md` embeds `public/images/preview.png` at the top, but the file does not exist in the repo. The README will show a broken image on GitHub until this is added.

**Fix:** Take a full-page screenshot of the hero section (or the whole site), save it as `public/images/preview.png`, and commit it.

```bash
cp /path/to/screenshot.png public/images/preview.png
git add public/images/preview.png
git commit -m "docs: add hero preview screenshot"
```

---

## 5. Environment Variables — Not Set

The contact and hire API routes require three env vars that don't exist yet on any deployment environment.

**File:** `.env.example` (already in repo as a template)

| Variable | Where it's used | How to get the value |
|---|---|---|
| `GMAIL_USER` | `src/app/api/contact/route.ts`, `src/app/api/hire/route.ts` | Your Gmail address that will send emails |
| `GMAIL_APP_PASSWORD` | Same routes | Gmail → Account → Security → 2FA → App Passwords. Generate one for "Mail" |
| `SITE_URL` | `src/app/api/contact/route.ts` (email footer) | Your deployed domain, e.g. `https://singhtejpreet.com` |

**Local dev:** copy `.env.example` → `.env.local` and fill in values.

**Production:** add these three variables in Vercel → project → Settings → Environment Variables before deploying (see `FUTURE_STEPS.md` Step 2).

Without `GMAIL_USER` and `GMAIL_APP_PASSWORD`, the contact form and hire form will fail silently — the API route will error out at the Nodemailer transport step.

---

## Summary

| # | File | Status | Blocking? |
|---|---|---|---|
| 1 | `src/data/projects.ts` — 4 broken GitHub URLs | Needs correct URLs or removal | No (just broken links) |
| 2 | `src/data/profile.ts` — wrong GitHub username | 1-line fix | No (broken link) |
| 3 | `singhtejpreet.com` not deployed | Deploy first | No (link just 404s) |
| 4 | `public/images/preview.png` missing | Take screenshot | No (only README affected) |
| 5 | Env vars not set | Set in Vercel + `.env.local` | **Yes** (contact + hire forms won't work) |
