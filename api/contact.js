// Vercel Serverless Function: POST /api/contact
//
// A Vite SPA has no server, so every secret must live here. Never put
// RESEND_API_KEY or TURNSTILE_SECRET_KEY in anything under src/, that code is
// public once it is bundled.
//
// Required environment variables (Vercel > Settings > Environment Variables):
//   RESEND_API_KEY         re_...   from resend.com/api-keys
//   TURNSTILE_SECRET_KEY   0x...    from the Cloudflare Turnstile widget
//   CONTACT_TO             the inbox that receives the mail
//   CONTACT_FROM           e.g. "Portfolio <contacto@luisrenteria.me>"
//                          the domain here MUST be verified in Resend
// Optional:
//   CONTACT_AUTOREPLY=1    send a confirmation to the visitor (see below)

import { z } from 'zod';

const INTENTS = {
  'co-op':    { label: 'Co-op / Full-time', subject: 'Co-op / role' },
  'collab':   { label: 'Collaboration',     subject: 'Collaboration' },
  'question': { label: 'Technical question', subject: 'Technical question' },
};

const trimmed = (max) => z.string().trim().max(max);

const schema = z.object({
  intent:  z.enum(Object.keys(INTENTS)).default('co-op'),
  name:    trimmed(120).min(2, 'name must be at least 2 characters'),
  email:   trimmed(200).email("email must be a valid address"),
  message: trimmed(5000).min(10, 'message must be at least 10 characters'),
  company:  trimmed(120).optional().default(''),
  role:     trimmed(120).optional().default(''),
  timeline: trimmed(120).optional().default(''),
  link:     trimmed(300).optional().default(''),
  ref:      trimmed(120).optional().default(''),
  // anti-spam, never shown to a human
  website:  z.string().optional().default(''),   // honeypot
  elapsed:  z.coerce.number().optional().default(0),
  token:    z.string().optional().default(''),   // Turnstile
});

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Cheap heuristics. Reported in the email, never used to silently drop mail. */
function spamSignals(d) {
  const out = [];
  if (d.website) out.push('honeypot filled');
  if (d.elapsed > 0 && d.elapsed < 3000) out.push(`submitted in ${d.elapsed}ms`);
  const links = (d.message.match(/https?:\/\//g) || []).length;
  if (links >= 3) out.push(`${links} links in message`);
  if (/\b(seo|backlink|crypto|casino|guest post|rank #?1)\b/i.test(d.message)) out.push('spam keywords');
  if (d.message === d.message.toUpperCase() && d.message.length > 40) out.push('all caps');
  return out;
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };   // not configured yet
  if (!token) return { ok: false, reason: 'missing captcha token' };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    const j = await r.json();
    return j.success
      ? { ok: true }
      : { ok: false, reason: (j['error-codes'] || []).join(', ') || 'captcha failed' };
  } catch {
    return { ok: false, reason: 'captcha verification unreachable' };
  }
}

async function sendEmail(payload) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.message || `resend responded ${r.status}`);
  return j;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'MethodNotAllowed: use POST' });
  }

  for (const key of ['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM']) {
    if (!process.env[key]) {
      console.error(`contact: missing env var ${key}`);
      return res.status(500).json({ error: 'ConfigError: the form is not configured yet' });
    }
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    // Compiler-style message: the first problem, named after the field.
    const issue = parsed.error.issues[0];
    const field = issue.path[0] ?? null;
    const message = /received undefined/.test(issue.message)
      ? `${field ?? 'field'} is required`
      : issue.message;
    return res.status(400).json({ error: `ValueError: ${message}`, field });
  }
  const d = parsed.data;

  // Honeypot: a real person never sees this field, so anything in it is a bot.
  // Answer 200 so the bot believes it succeeded and does not retry.
  if (d.website) {
    console.warn('contact: honeypot triggered');
    return res.status(200).json({ id: 'msg_ok', queuedAt: new Date().toISOString(), sla: '< 24h' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const captcha = await verifyTurnstile(d.token, ip);
  if (!captcha.ok) {
    return res.status(400).json({ error: `CaptchaError: ${captcha.reason}` });
  }

  const intent = INTENTS[d.intent] ?? INTENTS['co-op'];
  const signals = spamSignals(d);

  const rows = [
    ['Intent', intent.label],
    ['From', `${d.name} <${d.email}>`],
    d.company  && ['Company', d.company],
    d.role     && ['Role', d.role],
    d.timeline && ['Timeline', d.timeline],
    d.link     && ['Link', d.link],
    d.ref      && ['Came from', d.ref],
    captcha.skipped && ['Captcha', 'NOT CONFIGURED'],
    signals.length && ['Spam signals', signals.join(' · ')],
  ].filter(Boolean);

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    d.message,
  ].join('\n');

  const html = `
<div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;line-height:1.6;color:#1c2128">
  <table style="border-collapse:collapse;margin-bottom:16px">
    ${rows.map(([k, v]) => `
    <tr>
      <td style="padding:2px 14px 2px 0;color:#57606a;white-space:nowrap">${esc(k)}</td>
      <td style="padding:2px 0"><strong>${esc(v)}</strong></td>
    </tr>`).join('')}
  </table>
  <div style="border-left:3px solid #3fb950;padding:4px 0 4px 14px;white-space:pre-wrap;font-family:system-ui,sans-serif">${esc(d.message)}</div>
</div>`.trim();

  try {
    const sent = await sendEmail({
      from: process.env.CONTACT_FROM,
      to: [process.env.CONTACT_TO],
      // From must stay on the verified domain or DMARC rejects it. Reply-To is
      // what makes "Reply" in Gmail go to the visitor.
      reply_to: `${d.name} <${d.email}>`,
      subject: `[${intent.subject}] ${d.name}${d.company ? ` · ${d.company}` : ''}`,
      text,
      html,
    });

    // Optional confirmation to the visitor. Off unless CONTACT_AUTOREPLY=1:
    // it means this endpoint will email an address supplied by whoever calls
    // it, which is a spam-relay vector if the captcha is ever bypassed.
    if (process.env.CONTACT_AUTOREPLY === '1') {
      try {
        await sendEmail({
          from: process.env.CONTACT_FROM,
          to: [d.email],
          reply_to: process.env.CONTACT_TO,
          subject: 'Thanks for reaching out',
          text: `Hi ${d.name},\n\nThanks for writing. I read everything that comes through and I usually reply within 24 hours.\n\nFor reference, this is what you sent:\n\n${d.message}\n\nLuis Renteria Lezano\nhttps://luisrenteria.me`,
        });
      } catch (e) {
        console.error('contact: auto-reply failed (main message was delivered)', e);
      }
    }

    const id = String(sent?.id || '').replace(/-/g, '').slice(0, 10) || 'unknown';
    return res.status(200).json({
      id: `msg_${id}`,
      queuedAt: new Date().toISOString(),
      sla: '< 24h',
    });
  } catch (err) {
    console.error('contact: send failed', err);
    return res.status(502).json({ error: 'DeliveryError: could not send right now' });
  }
}
