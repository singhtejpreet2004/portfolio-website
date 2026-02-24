import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  escapeHtml,
  isRateLimited,
  isValidEmail,
  requireEnv,
  MAX_LENGTHS,
  truncate,
} from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests — please try again later' },
      { status: 429 },
    );
  }

  // ── Env guard ────────────────────────────────────────────────────────────────
  let env: Record<string, string>;
  try {
    env = requireEnv('GMAIL_USER', 'GMAIL_APP_PASSWORD');
  } catch (err) {
    console.error('[contact] env error:', err);
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // ── Parse body ───────────────────────────────────────────────────────────────
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, email, subject, message } = body as Record<string, unknown>;

  if (
    typeof name    !== 'string' || !name.trim()    ||
    typeof email   !== 'string' || !email.trim()   ||
    typeof subject !== 'string' || !subject.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // ── Sanitise + cap lengths ───────────────────────────────────────────────────
  const safeName    = escapeHtml(truncate(name.trim(),    MAX_LENGTHS.name));
  const safeEmail   = escapeHtml(truncate(email.trim(),   MAX_LENGTHS.email));
  const safeSubject = escapeHtml(truncate(subject.trim(), MAX_LENGTHS.subject));
  const safeMessage = escapeHtml(truncate(message.trim(), MAX_LENGTHS.message));
  const siteUrl     = process.env.SITE_URL ?? 'portfolio';

  // ── Send email ───────────────────────────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${env.GMAIL_USER}>`,
      to:      env.GMAIL_USER,
      replyTo: email.trim(),
      subject: `[Portfolio] ${safeSubject} — from ${safeName}`,
      html: `
        <div style="font-family: monospace; background: #0A1120; color: #E8F0FF; padding: 32px; border-radius: 12px; border: 1px solid rgba(88,166,255,0.25);">
          <h2 style="color: #58a6ff; margin: 0 0 24px;">New Portfolio Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #B0CCEE; padding: 6px 0; width: 100px;">Name</td><td style="color: #E8F0FF;">${safeName}</td></tr>
            <tr><td style="color: #B0CCEE; padding: 6px 0;">Email</td><td style="color: #58a6ff;"><a href="mailto:${safeEmail}" style="color: #58a6ff;">${safeEmail}</a></td></tr>
            <tr><td style="color: #B0CCEE; padding: 6px 0;">Subject</td><td style="color: #FFD300;">${safeSubject}</td></tr>
          </table>
          <hr style="border: 1px solid rgba(88,166,255,0.15); margin: 20px 0;" />
          <p style="color: #B0CCEE; margin: 0 0 8px;">Message:</p>
          <p style="color: #E8F0FF; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
          <hr style="border: 1px solid rgba(88,166,255,0.15); margin: 20px 0;" />
          <p style="color: #B0CCEE; font-size: 11px; margin: 0;">Sent from ${siteUrl}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] email error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
