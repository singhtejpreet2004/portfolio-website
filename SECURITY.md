# Security Policy

## Supported Versions

This is a personal portfolio website. Only the latest version on the `main` branch is actively maintained.

| Version | Supported |
|---|---|
| main (latest) | Yes |
| older commits | No |

---

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public GitHub issue**.

Instead, email directly:

**singhtejpreet2004@gmail.com**

Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

I aim to respond within **72 hours** and will keep you informed as the issue is investigated and resolved.

---

## Scope

**In scope:**
- The Next.js API routes (`/api/contact`, `/api/hire`) — injection, auth bypass, rate limit circumvention
- Client-side XSS or data leakage
- Dependencies with known CVEs that affect this project

**Out of scope:**
- Attacks requiring physical access to the server
- Denial-of-service via volumetric traffic (handled at the infrastructure/CDN layer)
- Theoretical vulnerabilities with no practical exploit path
- Issues in dependencies that have been patched upstream but not yet updated here — please open a regular issue for dependency updates

---

## Security Measures Already in Place

- **Rate limiting:** 5 requests per IP per 15 minutes on all API routes
- **Input sanitization:** HTML escaping before email rendering prevents XSS in email clients
- **Input truncation:** Maximum lengths enforced on all user-supplied fields
- **Email validation:** Regex validation on email fields
- **Environment variables:** Credentials are never hardcoded; `.env.local` is gitignored
- **No client-side secret exposure:** All sensitive operations (SMTP) run server-side only

---

## Responsible Disclosure

I follow a responsible disclosure model. If a report is valid, I will:

1. Confirm receipt within 72 hours
2. Investigate and develop a fix
3. Credit the reporter (if desired) in the relevant commit or changelog

Thank you for helping keep this project secure.
