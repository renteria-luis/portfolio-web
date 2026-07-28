import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Linkedin, FileDown, Copy, Check, Play, MapPin, Clock, BookOpen } from 'lucide-react';
import { SiHuggingface, SiLeetcode } from 'react-icons/si';
// Font Awesome's Kaggle mark is the plain "k"; the Simple Icons one is the
// curved logo, which is unreadable at 12px.
import { FaKaggle } from 'react-icons/fa';
import { personal } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';
import { ui } from '../i18n/ui';
import { useLang, useT } from '../i18n';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
// "question" leads and is the default: it asks for the fewest fields, so the
// form looks least like work when you first see it.
const INTENT_IDS = ['question', 'co-op', 'collab'];

const pad = (n) => String(n).padStart(2, '0');
const stamp = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/** Loads the Turnstile script once, on demand. */
function useTurnstile(containerRef, active, onToken, lang) {
  useEffect(() => {
    if (!active || !SITE_KEY || !containerRef.current) return;
    let widgetId;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: 'auto',
        language: lang,
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
  }, [active, containerRef, onToken, lang]);
}

function CopyButton({ value, dark, t }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); } catch { return; }
        setDone(true); setTimeout(() => setDone(false), 1800);
      }}
      aria-label={t(ui.contact.copyAria)}
      title={t(ui.contact.copyAria)}
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] transition-colors ${
        dark ? 'text-[#7b8fa6] hover:text-[#ecf0f8]' : 'text-[#576c80] hover:text-[#1c2128]'
      }`}
    >
      {done ? <Check size={12} className={dark ? 'text-terminal-green' : 'text-[#197934]'} /> : <Copy size={12} />}
      {done && t(ui.contact.copied)}
    </button>
  );
}

export default function Contact({ dark }) {
  const ref = useReveal(0.08);
  const sectionRef = useRef(null);
  const turnstileRef = useRef(null);
  const mountedAt = useRef(Date.now());
  const t = useT();
  const { lang } = useLang();

  const [intent, setIntent] = useState('question');
  const [form, setForm] = useState({
    name: '', email: '', message: '', company: '', role: '', timeline: '', link: '',
  });
  const [refParam, setRefParam] = useState('');
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
    if (company || role) {
      setForm((f) => ({ ...f, company: company || f.company, role: role || f.role }));
      setIntent('co-op');
    }
    if (r) setRefParam(r);
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
  useTurnstile(turnstileRef, inView && status !== 'ok', setToken, lang);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (badField === k) { setBadField(null); setError(null); }
  };

  /**
   * Brings the form back after a successful send. Name and email are kept
   * because the same person is writing again; the message is cleared so the
   * previous one cannot be sent twice by accident. The captcha token is
   * dropped since Turnstile tokens are single use.
   */
  const sendAnother = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setBadField(null);
    setToken('');
    setForm((f) => ({ ...f, message: '', link: '' }));
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
          ref: refParam,
          website: e.target.website?.value || '',       // honeypot
          elapsed: Date.now() - mountedAt.current,      // time-trap
          token,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBadField(data.field || null);
        setError(data.error || `DeliveryError: ${res.status}`);
        setStatus('error');
        if (window.turnstile) window.turnstile.reset();
        setToken('');
        return;
      }
      setResult({ ...data, ms: Math.round(performance.now() - started) });
      setStatus('ok');
    } catch {
      setError(t(ui.contact.errors.network));
      setStatus('error');
    }
  }

  // ── theme tokens, same idiom as the rest of the site ───────────────────
  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#576c80]';
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
  const sent = status === 'ok';
  const btnLabel = t(ui.contact.button[status] ?? ui.contact.button.idle);

  return (
    <section id="contact" ref={sectionRef} className="py-16 md:py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        {/* Header */}
        <div className="mb-12">
          <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#197934]'}`}>
            {t(ui.contact.label)}
          </p>
          <h2 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
            {t(ui.contact.title)}
          </h2>
          <p className={`mt-3 text-sm ${textSecondary} max-w-2xl`}>
            {t(ui.contact.intro)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ── Terminal card: form, replaced by the receipt once sent ─────── */}
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

            {sent ? (
              /* The form is gone on purpose: it prevents a double send, and the
                 receipt is the only thing left to read. */
              <div className="p-5" aria-live="polite">
                <div className={`font-mono text-[11px] px-4 py-3 rounded border ${
                  dark
                    ? 'bg-[rgba(63,185,80,0.06)] border-[rgba(63,185,80,0.3)]'
                    : 'bg-[rgba(26,127,55,0.05)] border-[rgba(26,127,55,0.25)]'
                }`}>
                  <div className={`flex items-center gap-2 mb-2 ${dark ? 'text-terminal-green' : 'text-[#197934]'}`}>
                    <Check size={13} /> {t(ui.contact.delivered)}
                    <span className={textMuted}>· 200 OK · {result.ms}ms</span>
                  </div>
                  <div className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 ${textSecondary}`}>
                    <span className={textMuted}>{t(ui.contact.receipt.id)}</span>
                    <span className="flex items-center gap-2 flex-wrap">
                      {result.id}
                      <CopyButton value={result.id} dark={dark} t={t} />
                    </span>
                    <span className={textMuted}>{t(ui.contact.receipt.queued)}</span>
                    <span>{stamp(result.queuedAt)}</span>
                    <span className={textMuted}>{t(ui.contact.receipt.sla)}</span>
                    <span>{result.sla}</span>
                  </div>
                  <p className={`mt-2.5 ${textMuted}`}>{t(ui.contact.receipt.keep)}</p>
                  <button
                    type="button"
                    onClick={sendAnother}
                    className={`mt-2 font-mono text-[11px] underline underline-offset-2 decoration-dotted transition-colors ${
                      dark ? 'text-[#7b8fa6] hover:text-terminal-green' : 'text-[#576c80] hover:text-[#197934]'
                    }`}
                  >
                    {t(ui.contact.receipt.again)}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-5" noValidate>
                {/* Intent router */}
                <div className="mb-5">
                  <span className={labelCls}>{t(ui.contact.whatAbout)}</span>
                  <div className="flex flex-wrap gap-2" role="group" aria-label={t(ui.contact.whatAbout)}>
                    {INTENT_IDS.map((id) => {
                      const on = intent === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setIntent(id)}
                          aria-pressed={on}
                          className={`font-mono text-[11px] px-3 py-1.5 rounded border transition-all duration-200 ${
                            on
                              ? dark
                                ? 'bg-terminal-green/10 border-terminal-green/40 text-terminal-green'
                                : 'bg-[rgba(26,127,55,0.08)] border-[rgba(26,127,55,0.4)] text-[#197934]'
                              : dark
                                ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:border-[rgba(125,167,217,0.3)]'
                                : 'border-[rgba(30,50,80,0.15)] text-[#57606a] hover:border-[rgba(30,50,80,0.3)]'
                          }`}
                        >
                          {t(ui.contact.intents[id])}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelCls} htmlFor="c-name">{t(ui.contact.fields.name)}</label>
                    <input id="c-name" name="name" value={form.name} onChange={set('name')}
                           autoComplete="name" required maxLength={120}
                           className={field(badField === 'name')}
                           placeholder={t(ui.contact.placeholders.name)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="c-email">{t(ui.contact.fields.email)}</label>
                    <input id="c-email" name="email" type="email" inputMode="email"
                           value={form.email} onChange={set('email')}
                           autoComplete="email" required maxLength={200}
                           className={field(badField === 'email')}
                           placeholder={t(ui.contact.placeholders.email)} />
                  </div>
                </div>

                {/* Fields that only make sense for the chosen intent */}
                {intent === 'co-op' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className={labelCls} htmlFor="c-company">{t(ui.contact.fields.company)}</label>
                      <input id="c-company" value={form.company} onChange={set('company')}
                             autoComplete="organization" maxLength={120}
                             className={field(false)} placeholder={ui.contact.placeholders.company} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="c-role">{t(ui.contact.fields.role)}</label>
                      <input id="c-role" value={form.role} onChange={set('role')}
                             maxLength={120} className={field(false)}
                             placeholder={t(ui.contact.placeholders.role)} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="c-timeline">{t(ui.contact.fields.timeline)}</label>
                      <input id="c-timeline" value={form.timeline} onChange={set('timeline')}
                             maxLength={120} className={field(false)}
                             placeholder={t(ui.contact.placeholders.timeline)} />
                    </div>
                  </div>
                )}

                {intent === 'collab' && (
                  <div className="mb-4">
                    <label className={labelCls} htmlFor="c-link">{t(ui.contact.fields.link)}</label>
                    <input id="c-link" value={form.link} onChange={set('link')}
                           inputMode="url" maxLength={300}
                           className={field(false)} placeholder={ui.contact.placeholders.link} />
                  </div>
                )}

                <div className="mb-4">
                  <label className={labelCls} htmlFor="c-message">{t(ui.contact.fields.message)}</label>
                  <textarea id="c-message" name="message" rows={6} value={form.message}
                            onChange={set('message')} required maxLength={5000}
                            className={`${field(badField === 'message')} resize-y leading-6`}
                            placeholder={t(ui.contact.placeholders[intent])} />
                </div>

                {/* Honeypot: off-screen, not display:none, so bots still fill it */}
                <div aria-hidden="true" className="absolute w-px h-px -left-[9999px] overflow-hidden">
                  <label htmlFor="c-website">{t(ui.contact.fields.honeypot)}</label>
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
                        : 'bg-[rgba(26,127,55,0.08)] border-[rgba(26,127,55,0.3)] text-[#197934] hover:bg-[rgba(26,127,55,0.14)]'
                    }`}
                  >
                    {busy
                      ? <span className="w-3 h-3 rounded-full border-2 border-current border-r-transparent animate-spin" />
                      : <Play size={12} />}
                    {btnLabel}
                  </button>

                  {busy && (
                    <span className={`font-mono text-[11px] ${textMuted}`}>
                      {status === 'queued' ? t(ui.contact.queuedNote) : 'POST /api/contact'}
                    </span>
                  )}
                </div>

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
                </div>
              </form>
            )}
          </div>

          {/* ── Availability card ───────────────────────────────────────── */}
          <div className="lg:col-span-2 lg:sticky lg:top-20 flex flex-col gap-3">
            <div className={`rounded-lg border ${borderColor} ${cardBg} p-5`}>
              <div className={`flex items-center gap-2 font-mono text-xs mb-4 ${dark ? 'text-terminal-green' : 'text-[#197934]'}`}>
                <span className="inline-block w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                {t(ui.contact.availability.available)}
              </div>

              <dl className="space-y-3">
                <div>
                  <dt className={`font-mono text-[10px] uppercase tracking-wider ${textMuted}`}>
                    {t(ui.contact.availability.lookingFor)}
                  </dt>
                  <dd className={`font-mono text-xs mt-0.5 ${textPrimary}`}>
                    {t(ui.contact.availability.lookingForValue)}
                  </dd>
                </div>
                <div>
                  <dt className={`font-mono text-[10px] uppercase tracking-wider ${textMuted}`}>
                    {t(ui.contact.availability.afterThat)}
                  </dt>
                  <dd className={`font-mono text-xs mt-0.5 ${textPrimary}`}>
                    {t(ui.contact.availability.afterThatValue)}
                  </dd>
                </div>
              </dl>

              <div className={`mt-4 pt-4 border-t ${borderColor} space-y-2 font-mono text-[11px] ${textSecondary}`}>
                <p className="flex items-center gap-2">
                  <MapPin size={12} className={textMuted} /> {t(personal.location)} (EST)
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={12} className={textMuted} /> {t(ui.contact.availability.replies)}
                </p>
                <p className="flex items-center gap-2 flex-wrap">
                  <Mail size={12} className={`${textMuted} shrink-0`} />
                  <a href={`mailto:${personal.email}`}
                     className={`break-all transition-colors ${dark ? 'hover:text-terminal-blue' : 'hover:text-[#0969da]'}`}>
                    {personal.email}
                  </a>
                  {/* Some people would rather copy the address than open a
                      mail client they do not use. */}
                  <CopyButton value={personal.email} dark={dark} t={t} />
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { href: personal.cvUrl, label: 'resume.pdf', Icon: FileDown, download: true },
                { href: personal.socials.linkedin, label: 'linkedin', Icon: Linkedin },
                { href: personal.socials.github, label: 'github', Icon: Github },
                { href: personal.socials.huggingface, label: 'hf spaces', Icon: SiHuggingface },
                { href: personal.socials.kaggle, label: 'kaggle', Icon: FaKaggle },
                { href: personal.socials.leetcode, label: 'leetcode', Icon: SiLeetcode },
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
                  <Icon size={12} />
                  {label}
                </a>
              ))}

              {/* col-span-2 keeps the grid symmetrical: the six links sit in
                  three even rows and this closes the block underneath. */}
              <Link
                to="/blog"
                className={`col-span-2 flex items-center justify-center gap-2 font-mono text-[11px] px-3 py-2.5 rounded border transition-all duration-200 ${
                  dark
                    ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:border-[rgba(63,185,80,0.3)] hover:text-terminal-green'
                    : 'border-[rgba(30,50,80,0.15)] text-[#57606a] hover:border-[rgba(26,127,55,0.35)] hover:text-[#197934]'
                }`}
              >
                <BookOpen size={12} />
                {t(ui.contact.blogLink)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
