import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Moon, Sun, FileDown, Menu, X, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { personal } from '../config/data';
import { ui } from '../i18n/ui';
import { useLang, useT } from '../i18n';

// Anchors are absolute so they still resolve when the visitor is on /blog.
const navLinks = [
  { key: 'about',      to: '/#about' },
  { key: 'experience', to: '/#experience' },
  { key: 'projects',   to: '/#projects' },
  { key: 'skills',     to: '/#skills' },
  { key: 'contact',    to: '/#contact' },
];

export default function Nav({ dark, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle } = useLang();
  const t = useT();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── Nav bg strategy:
  //   Dark mode:  near-black (#07090e), always darker than #0e1420 body
  //   Light mode: clean white, contrasts against #eef1f7 body
  const navStyle = dark
    ? {
        backgroundColor: scrolled ? 'rgba(7,9,14,0.95)' : 'rgba(7,9,14,0.72)',
        borderBottom: scrolled ? '1px solid rgba(63,185,80,0.1)' : '1px solid rgba(63,185,80,0.04)',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.5)' : 'none',
      }
    : {
        backgroundColor: scrolled ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.65)',
        borderBottom: scrolled ? '1px solid rgba(30,50,80,0.1)' : '1px solid rgba(30,50,80,0.04)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
      };

  const mobileMenuStyle = dark
    ? { backgroundColor: 'rgba(5,7,11,0.97)', borderTop: '1px solid rgba(63,185,80,0.08)' }
    : { backgroundColor: 'rgba(255,255,255,0.97)', borderTop: '1px solid rgba(30,50,80,0.09)' };

  const textMuted  = dark ? '#a2afc2' : '#57606a';
  const textBright = dark ? '#ecf0f8' : '#1c2128';
  const accent     = dark ? '#3fb950' : '#1a7f37';

  const themeLabel = t(dark ? ui.nav.themeToLight : ui.nav.themeToDark);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300"
      style={navStyle}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

        <Link
          to="/"
          className="font-mono text-sm font-medium tracking-tight transition-colors"
          style={{ color: accent }}
        >
          <span style={{ color: textMuted }}>~/</span>luis
          <span className="cursor-blink ml-[2px]">▊</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ key, to }) => (
            <Link
              key={key}
              to={to}
              className="nav-link font-mono text-xs font-medium transition-colors"
              style={{ color: textMuted }}
              onMouseEnter={(e) => { e.currentTarget.style.color = textBright; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = textMuted;  }}
            >
              <span style={{ color: dark ? 'rgba(63,185,80,0.5)' : 'rgba(26,127,55,0.5)' }}>./</span>
              {t(ui.nav[key])}
            </Link>
          ))}

          <div className={`w-px h-4 ${dark ? 'bg-white/[0.14]' : 'bg-black/[0.14]'}`} />

          <div className="flex items-center gap-3">
            <a href={personal.socials.github} target="_blank" rel="noopener noreferrer me"
               aria-label="GitHub" className="transition-colors" style={{ color: textMuted }}
               onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}>
              <Github size={15} />
            </a>
            <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer me"
               aria-label="LinkedIn" className="transition-colors" style={{ color: textMuted }}
               onMouseEnter={(e) => { e.currentTarget.style.color = dark ? '#79c0ff' : '#0969da'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}>
              <Linkedin size={15} />
            </a>
            <a href={`mailto:${personal.email}`} aria-label={t(ui.hero.email)}
               className="transition-colors" style={{ color: textMuted }}
               onMouseEnter={(e) => { e.currentTarget.style.color = dark ? '#d2a8ff' : '#7c3aed'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}>
              <Mail size={15} />
            </a>
          </div>

          <a
            href={personal.cvUrl}
            download
            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded border transition-all"
            style={{ color: accent, borderColor: dark ? 'rgba(63,185,80,0.25)' : 'rgba(26,127,55,0.3)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = dark ? 'rgba(63,185,80,0.1)' : 'rgba(26,127,55,0.07)';
              e.currentTarget.style.borderColor = accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = dark ? 'rgba(63,185,80,0.25)' : 'rgba(26,127,55,0.3)';
            }}
          >
            <FileDown size={12} />
            resume.pdf
          </a>

          {/* Language toggle. Shows the language you would switch TO. */}
          <button
            onClick={toggle}
            className="flex items-center gap-1 p-1.5 rounded font-mono text-[11px] transition-colors"
            style={{ color: textMuted }}
            aria-label={t(ui.nav.langSwitch)}
            title={t(ui.nav.langSwitch)}
            onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}
          >
            <Languages size={15} />
            {lang === 'en' ? 'ES' : 'EN'}
          </button>

          <button
            onClick={toggleDark}
            className="p-1.5 rounded transition-colors"
            style={{ color: textMuted }}
            aria-label={themeLabel}
            onMouseEnter={(e) => { e.currentTarget.style.color = dark ? '#e3b341' : '#b45309'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="flex items-center gap-1 p-1.5 rounded font-mono text-[11px]"
                  style={{ color: textMuted }} aria-label={t(ui.nav.langSwitch)}>
            <Languages size={15} />
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <button onClick={toggleDark} className="p-1.5 rounded" style={{ color: textMuted }}
                  aria-label={themeLabel}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded transition-colors"
            style={{ color: textMuted }}
            aria-label={t(mobileOpen ? ui.nav.closeMenu : ui.nav.openMenu)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden px-6 py-4 flex flex-col gap-4 nav-blur" style={mobileMenuStyle}>
          {navLinks.map(({ key, to }) => (
            <Link
              key={key}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="font-mono text-sm"
              style={{ color: textBright }}
            >
              <span style={{ color: 'rgba(63,185,80,0.5)' }}>~/</span>{t(ui.nav[key])}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-2">
            <a href={personal.socials.github} target="_blank" rel="noopener noreferrer me" aria-label="GitHub">
              <Github size={16} style={{ color: textMuted }} />
            </a>
            <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer me" aria-label="LinkedIn">
              <Linkedin size={16} style={{ color: textMuted }} />
            </a>
            <a href={`mailto:${personal.email}`} aria-label={t(ui.hero.email)}>
              <Mail size={16} style={{ color: textMuted }} />
            </a>
            <a
              href={personal.cvUrl}
              download
              className="flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded border"
              style={{ color: accent, borderColor: dark ? 'rgba(63,185,80,0.25)' : 'rgba(26,127,55,0.3)' }}
            >
              <FileDown size={11} /> cv.pdf
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
