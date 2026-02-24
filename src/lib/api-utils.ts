/**
 * Shared server-side API utilities.
 * Used by /api/contact and /api/hire — never imported on the client.
 */

// ── HTML sanitisation ──────────────────────────────────────────────────────────
// Escapes user-supplied strings before they are interpolated into HTML email
// templates.  Prevents HTML-injection attacks where an attacker could embed
// scripts or arbitrary markup inside the outgoing email.
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ── Input length caps ──────────────────────────────────────────────────────────
export const MAX_LENGTHS = {
  name:    100,
  email:   254,   // RFC 5321 maximum
  subject: 200,
  message: 4000,
  company: 200,
  phone:   30,
} as const;

export function truncate(str: string, max: number): string {
  return str.slice(0, max);
}

// ── Email format validation ────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── In-memory rate limiter ─────────────────────────────────────────────────────
// 5 requests per IP per 15-minute window.
// Per-process — resets on cold starts (acceptable for a personal portfolio).
// Upgrade to Vercel KV / Upstash Redis for distributed rate limiting if needed.
const _store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_REQ   = 5;

export function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = _store.get(ip);
  if (!entry || now > entry.resetAt) {
    _store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQ) return true;
  entry.count++;
  return false;
}

// ── Environment variable guard ─────────────────────────────────────────────────
// Throws with a clear message if any required env var is missing, so the error
// surfaces immediately rather than producing a cryptic SMTP failure later.
export function requireEnv(...keys: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  const missing: string[] = [];
  for (const key of keys) {
    const val = process.env[key];
    if (!val) missing.push(key);
    else result[key] = val;
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return result;
}
