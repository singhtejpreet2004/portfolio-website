# src/app/api/

Next.js [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers). Two POST endpoints that receive form submissions and deliver them via Gmail SMTP.

---

## Routes

| Route | File | Description |
|---|---|---|
| `POST /api/contact` | `contact/route.ts` | General contact form — name, email, subject, message |
| `POST /api/hire` | `hire/route.ts` | Hire inquiry — name, email, company (optional), phone (optional) |

---

## Security Pipeline

Every route applies the same stack of protections from [`src/lib/api-utils.ts`](../lib/README.md):

1. **Rate limiting** — 5 requests per IP per 15 minutes (in-memory, resets on server restart)
2. **Input validation** — required fields check, email regex
3. **Input sanitization** — `escapeHtml()` prevents HTML injection in email output
4. **Input truncation** — `MAX_LENGTHS` caps each field before processing
5. **Env var guard** — `requireEnv()` throws on startup if `GMAIL_USER` or `GMAIL_APP_PASSWORD` are missing

---

## Request / Response

### POST /api/contact

**Request body (JSON):**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Collaboration idea",
  "message": "Hi Tejpreet, ..."
}
```

**Success:** `200 { "ok": true }`

**Error responses:**

| Status | Meaning |
|---|---|
| `400` | Missing required field or invalid email |
| `429` | Rate limit exceeded |
| `500` | SMTP error or missing env vars |

---

### POST /api/hire

**Request body (JSON):**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "company": "Acme Corp",
  "phone": "+1 555 000 0000"
}
```

`company` and `phone` are optional. Same status codes as `/api/contact`.

---

## Environment Variables Required

| Variable | Description |
|---|---|
| `GMAIL_USER` | Gmail address to send from |
| `GMAIL_APP_PASSWORD` | Gmail [App Password](https://support.google.com/accounts/answer/185833) |
| `SITE_URL` | Used in email footers (no trailing slash) |

See `.env.example` at the project root.
