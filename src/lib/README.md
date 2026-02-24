# src/lib/

Shared utility modules. Divided into server-side and client-side utilities.

---

## Contents

| File | Environment | Description |
|---|---|---|
| `api-utils.ts` | Server only | Security and validation helpers for API route handlers |
| `utils.ts` | Client + Server | General-purpose utilities (currently: `cn` class name helper) |

---

## `api-utils.ts` (Server-side only)

Do not import this file in client components — it uses Node.js APIs and would fail in the browser.

### Exports

#### `escapeHtml(str: string): string`

Replaces `& < > " '` with their HTML entities. Applied to all user input before embedding in email bodies to prevent HTML injection.

#### `MAX_LENGTHS`

```typescript
const MAX_LENGTHS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 4000,
  company: 200,
  phone: 30,
}
```

Hard caps on each input field. Applied via `truncate()` before processing.

#### `truncate(str: string, max: number): string`

Returns `str.slice(0, max)`.

#### `isValidEmail(email: string): boolean`

Regex-based email format validation. Does not perform DNS lookups.

#### `isRateLimited(ip: string): boolean`

In-memory rate limiter. Allows 5 requests per IP per 15 minutes. State is stored in a `Map` in module scope — it resets on server restart and does not persist across serverless function invocations. Sufficient for a personal portfolio's traffic pattern.

#### `requireEnv(...keys: string[]): void`

Throws a descriptive error on startup if any of the listed environment variables are missing. Used at the top of each API route to fail fast with a clear message rather than a cryptic SMTP error later.

**Usage:**
```typescript
requireEnv('GMAIL_USER', 'GMAIL_APP_PASSWORD', 'SITE_URL')
```

---

## `utils.ts` (Client + Server)

### `cn(...inputs: ClassValue[]): string`

Thin wrapper around `clsx`. Merges class names with conditional support.

```typescript
import { cn } from '@/lib/utils'

cn('base-class', isActive && 'active', className)
```

---

## Dependencies

| Package | File | Usage |
|---|---|---|
| `clsx` | `utils.ts` | Class name merging |
