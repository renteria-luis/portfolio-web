import { useEffect, useRef, useState } from 'react';
import { Mail, Github, Linkedin, FileDown, Copy, Check, Play, MapPin, Clock } from 'lucide-react';
import { personal } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

// Intent router: each choice changes which optional fields appear and what
// subject line the email arrives with.
const INTENTS = [
  { id: 'co-op',    label: 'Co-op / Full-time', hint: 'Rol, stack y fecha de inicio.' },
  { id: 'collab',   label: 'Collaboration',     hint: 'What are you building?' },
  { id: 'question', label: 'Technical question', hint: 'Ask away.' },
];

const PLACEHOLDER = {
  'co-op':    'Role, stack, and start date if you have one.',
  'collab':   'What you are building and where I would fit.',
  'question': 'Ask about anything in the projects above.',
};

const pad = (n) => String(n).padStart(2, '0');
const stamp = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/** Loads the Turnstile script once, on demand. */
function useTurnstile(containerRef, active, onToken) {
  useEffect(() => {
    if (!active || !SITE_KEY || !containerRef.current) return;
    let widgetId;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || !containerRef.current) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: 'auto',
        callback: onToken,
        'error-callback': () => onToken(''),
        'expired-callback': () => onToken(''),
      });
    };

    if (window.turnstile) { render(); }
    else {
      const existing = document.querySelector('script[data-turnstile]');
      if (existing) existing.addEventListener('load', render);
      else {
        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true; s.defer = true;
        s.dataset.turnstile = '1';
        s.addEventListener('load', render);
        document.head.appendChild(s);
      }
    }
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [active, containerRef, onToken]);
}

function CopyButton({ value, dark, label = 'copy' }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); } catch { return; }
        setDone(true); setTimeout(() => setDone(false), 1800);
      }}
      aria-label={done ? 'Copied to clipboard' : `Copy ${label}`}
      className={`flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded border transition-colors ${
        dark
          ? 'border-[rgba(125,167,217,0.15)] text-[#7b8fa6] hover:text-[#ecf0f8] hover:border-[rgba(125,167,217,0.3)]'
          : 'border-[rgba(30,50,80,0.12)] text-[#8b9eb0] hover:text-[#1c2128] hover:border-[rgba(30,50,80,0.3)]'
      }`}
    >
      {done ? <Check size={11} className={dark ? 'text-terminal-green' : 'text-[#1a7f37]'} /> : <Copy size={11} />}
      {done ? 'copied' : label}
    </button>
  );
}

export default function Contact({ dark }) {
  const ref = useReveal(0.08);
  const sectionRef = useRef(null);
  const turnstileRef = useRef(null);
  const mountedAt = useRef(Date.now());

  const [intent, setIntent] = useState('co-op');
  const [form, setForm] = useState({
    name: '', email: '', message: '', company: '', role: '', timeline: '', link: '',
  });
  const [ref_, setRef] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('idle');   // idle | queued | running | ok | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [badField, setBadField] = useState(null);
  const [inView, setInView] = useState(false);

  // Deep links: /?ref=linkedin&company=RBC&role=ML%20Intern prefills the form
  // so a recruiter arriving from a specific place types less.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const get = (k) => (q.get(k) || '').slice(0, 120);
    const company = get('company'), role = get('role'), r = get('ref');
    if (company || role) setForm((f) => ({ ...f, company: company || f.company, role: role || f.role }));
    if (company || role) setIntent('co-op');
    if (r) setRef(r);
  }, []);

  // Only load the captcha script once the section is actually approached.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true),
      { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useTurnstile(turnstileRef, inView, setToken);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (badField === k) { setBadField(null); setError(null); }
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'queued' || status === 'running') return;

    setError(null); setBadField(null);
    setStatus('queued');
    const started = performance.now();
    await new Promise((r) => setTimeout(r, 180));   // the "queued" beat is visible
    setStatus('running');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
          intent,
          ref: ref_,
          website: e.target.website?.value || '',       // honeypot
          elapsed: Date.now() - mountedAt.current,      // time-trap
          token,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBadField(data.field || null);
        setError(data.error || `DeliveryError: server responded ${res.status}`);
        setStatus('error');
        if (window.turnstile) window.turnstile.reset();
        setToken('');
        return;
      }
      setResult({ ...data, ms: Math.round(performance.now() - started) });
      setStatus('ok');
    } catch {
      setError('NetworkError: could not reach the server');
      setStatus('error');
    }
  }

  // ── theme tokens, same idiom as the rest of the site ───────────────────
  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#8b9eb0]';
  const borderColor = dark ? 'border-[rgba(125,167,217,0.08)]' : 'border-[rgba(30,50,80,0.1)]';
  const cardBg = dark ? 'bg-[#181f2e]' : 'bg-white';
  const terminalShadow = dark
    ? '0 0 0 1px rgba(125,167,217,0.06), 0 20px 60px rgba(0,0,0,0.6)'
    : '0 20px 60px rgba(0,0,0,0.1)';

  const field = (bad) => `w-full font-mono text-xs px-3 py-2 rounded border bg-transparent transition-colors outline-none ${
    bad
      ? 'border-[rgba(247,129,102,0.6)]'
      : dark
        ? 'border-[rgba(125,167,217,0.15)] text-[#ecf0f8] placeholder-[#5f7085] focus:border-[rgba(63,185,80,0.5)]'
        : 'border-[rgba(30,50,80,0.15)] text-[#1c2128] placeholder-[#9aa7b4] focus:border-[rgba(26,127,55,0.5)]'
  }`;

  const labelCls = `block font-mono text-[10px] uppercase tracking-wider mb-1.5 ${textMuted}`;
  const busy = status === 'queued' || status === 'running';

  const btnLabel = { idle: 'send message', queued: 'queued', running: 'sending', error: 'retry' }[status] || 'send message';

  return (
    <section id="contact" ref={sectionRef} className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        {/* Header */}
        <div className="mb-12">
          <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#1a7f37]'}`}>
            05 / contact
          </p>
          <h2 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
            hiring for an AI/ML co-op?
          </h2>
          <p className={`mt-3 text-sm ${textSecondary} max-w-2xl`}>
            I reply within 24 hours. If it is about a role, include the stack and the timeline
            and I can tell you straight away whether I am a fit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ── Form, inside the same terminal chrome as the rest of the site ── */}
          <div
            className={`lg:col-span-3 rounded-lg border ${borderColor} ${cardBg} overflow-hidden`}
            style={{ boxShadow: terminalShadow }}
          >
            <div className="terminal-header">
              <div className="terminal-dot" style={{ background: '#f78166' }} />
              <div className="terminal-dot" style={{ background: '#e3b341' }} />
              <div className="terminal-dot" style={{ background: '#3fb950' }} />
              <span className={`ml-2 font-mono text-xs ${textSecondary}`}>
                luis@ml-portfolio:~/contact
              </span>
            </div>

            <form onSubmit={onSubmit} className="p-5" noValidate>
              {/* Intent router */}
              <div className="mb-5">
                <span className={labelCls}>what is this about?</span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Reason for contact">
                  {INTENTS.map((it) => {
                    const on = intent === it.id;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => setIntent(it.id)}
                        aria-pressed={on}
                        className={`font-mono text-[11px] px-3 py-1.5 rounded border transition-all duration-200 ${
                          on
                            ? dark
                              ? 'bg-terminal-green/10 border-terminal-green/40 text-terminal-green'
                              : 'bg-[rgba(26,127,55,0.08)] border-[rgba(26,127,55,0.4)] text-[#1a7f37]'
                            : dark
                              ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:border-[rgba(125,167,217,0.3)]'
                              : 'border-[rgba(30,50,80,0.15)] text-[#57606a] hover:border-[rgba(30,50,80,0.3)]'
                        }`}
                      >
                        {it.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls} htmlFor="c-name">name</label>
                  <input id="c-name" name="name" value={form.name} onChange={set('name')}
                         autoComplete="name" required maxLength={120}
                         className={field(badField === 'name')} placeholder="Ada Lovelace" />
                </div>
                <div>
                  <label className={labelCls} htmlFor="c-email">email</label>
                  <input id="c-email" name="email" type="email" inputMode="email"
                         value={form.email} onChange={set('email')}
                         autoComplete="email" required maxLength={200}
                         className={field(badField === 'email')} placeholder="you@company.com" />
                </div>
              </div>

              {/* Fields that only make sense for the chosen intent */}
              {intent === 'co-op' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className={labelCls} htmlFor="c-company">company (optional)</label>
                    <input id="c-company" value={form.company} onChange={set('company')}
                           autoComplete="organization" maxLength={120}
                           className={field(false)} placeholder="RBC" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="c-role">role (optional)</label>
                    <input id="c-role" value={form.role} onChange={set('role')}
                           maxLength={120} className={field(false)} placeholder="ML Intern" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="c-timeline">timeline (optional)</label>
                    <input id="c-timeline" value={form.timeline} onChange={set('timeline')}
                           maxLength={120} className={field(false)} placeholder="Sept 2026" />
                  </div>
                </div>
              )}

              {intent === 'collab' && (
                <div className="mb-4">
                  <label className={labelCls} htmlFor="c-link">repo or project link (optional)</label>
                  <input id="c-link" value={form.link} onChange={set('link')}
                         inputMode="url" maxLength={300}
                         className={field(false)} placeholder="https://github.com/..." />
                </div>
              )}

              <div className="mb-4">
                <label className={labelCls} htmlFor="c-message">message</label>
                <textarea id="c-message" name="message" rows={6} value={form.message}
                          onChange={set('message')} required maxLength={5000}
                          className={`${field(badField === 'message')} resize-y leading-6`}
                          placeholder={PLACEHOLDER[intent]} />
              </div>

              {/* Honeypot: off-screen, not display:none, so bots still fill it */}
              <div aria-hidden="true" className="absolute w-px h-px -left-[9999px] overflow-hidden">
                <label htmlFor="c-website">Leave this field empty</label>
                <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div ref={turnstileRef} className="mb-4 empty:mb-0" />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className={`flex items-center gap-2 font-mono text-xs px-4 py-2.5 rounded border transition-all duration-200 disabled:opacity-70 ${
                    dark
                      ? 'bg-terminal-green/10 border-terminal-green/30 text-terminal-green hover:bg-terminal-green/15 hover:border-terminal-green/60'
                      : 'bg-[rgba(26,127,55,0.08)] border-[rgba(26,127,55,0.3)] text-[#1a7f37] hover:bg-[rgba(26,127,55,0.14)]'
                  }`}
                >
                  {busy
                    ? <span className="w-3 h-3 rounded-full border-2 border-current border-r-transparent animate-spin" />
                    : <Play size={12} />}
                  {btnLabel}
                </button>

                {busy && (
                  <span className={`font-mono text-[11px] ${textMuted}`}>
                    {status === 'queued' ? 'queued...' : 'POST /api/contact'}
                  </span>
                )}
              </div>

              {/* Output area, mirroring a notebook cell result */}
              <div aria-live="polite" className="mt-4">
                {status === 'error' && (
                  <div className={`font-mono text-[11px] px-3 py-2.5 rounded border ${
                    dark
                      ? 'bg-[rgba(247,129,102,0.07)] border-[rgba(247,129,102,0.3)] text-[#f78166]'
                      : 'bg-[rgba(207,34,46,0.05)] border-[rgba(207,34,46,0.25)] text-[#cf222e]'
                  }`}>
                    {error}
                  </div>
                )}

                {status === 'ok' && result && (
                  <div className={`font-mono text-[11px] px-4 py-3 rounded border ${
                    dark
                      ? 'bg-[rgba(63,185,80,0.06)] border-[rgba(63,185,80,0.3)]'
                      : 'bg-[rgba(26,127,55,0.05)] border-[rgba(26,127,55,0.25)]'
                  }`}>
                    <div className={`flex items-center gap-2 mb-2 ${dark ? 'text-terminal-green' : 'text-[#1a7f37]'}`}>
                      <Check size={13} /> delivered
                      <span className={textMuted}>· 200 OK · {result.ms}ms</span>
                    </div>
                    <div className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 ${textSecondary}`}>
                      <span className={textMuted}>id</span>
                      <span className="flex items-center gap-2">
                        {result.id}
                        <CopyButton value={result.id} dark={dark} label="id" />
                      </span>
                      <span className={textMuted}>queued</span><span>{stamp(result.queuedAt)}</span>
                      <span className={textMuted}>sla</span><span>{result.sla}</span>
                    </div>
                    <p className={`mt-2.5 ${textMuted}`}>
                      Keep that id if you need to follow up.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* ── Availability card ───────────────────────────────────────── */}
          <div className="lg:col-span-2 lg:sticky lg:top-20 flex flex-col gap-3">
            <div className={`rounded-lg border ${borderColor} ${cardBg} p-5`}>
              <div className={`flex items-center gap-2 font-mono text-xs mb-4 ${dark ? 'text-terminal-green' : 'text-[#1a7f37]'}`}>
                <span className="inline-block w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                available
              </div>

              <dl className="space-y-3">
                {[
                  ['looking for', 'AI/ML co-op, Fall 2026'],
                  ['after that', 'Full-time, from Apr 2027'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className={`font-mono text-[10px] uppercase tracking-wider ${textMuted}`}>{k}</dt>
                    <dd className={`font-mono text-xs mt-0.5 ${textPrimary}`}>{v}</dd>
                  </div>
                ))}
              </dl>

              <div className={`mt-4 pt-4 border-t ${borderColor} space-y-2 font-mono text-[11px] ${textSecondary}`}>
                <p className="flex items-center gap-2">
                  <MapPin size={12} className={textMuted} /> {personal.location} (EST)
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={12} className={textMuted} /> replies in under 24h · EN / ES
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={12} className={textMuted} />
                  <a href={`mailto:${personal.email}`}
                     className={`break-all transition-colors ${dark ? 'hover:text-terminal-blue' : 'hover:text-[#0969da]'}`}>
                    {personal.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { href: personal.cvUrl, label: 'resume.pdf', Icon: FileDown, download: true },
                { href: personal.socials.linkedin, label: 'linkedin', Icon: Linkedin },
                { href: personal.socials.github, label: 'github', Icon: Github },
                { href: 'https://huggingface.co/renteria-luis', label: 'hf spaces', Icon: null },
              ].map(({ href, label, Icon, download }) => (
                <a
                  key={label}
                  href={href}
                  {...(download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer me' })}
                  className={`flex items-center justify-center gap-2 font-mono text-[11px] px-3 py-2.5 rounded border transition-all duration-200 ${
                    dark
                      ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:border-[rgba(125,167,217,0.3)] hover:text-[#ecf0f8]'
                      : 'border-[rgba(30,50,80,0.15)] text-[#57606a] hover:border-[rgba(30,50,80,0.3)] hover:text-[#1c2128]'
                  }`}
                >
                  {Icon ? <Icon size={12} /> : <span aria-hidden="true">🤗</span>}
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
