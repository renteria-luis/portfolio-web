import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, ArrowDown, FileDown, Mail, ArrowUpRight } from 'lucide-react';
import { personal, companion, projects } from '../config/data';
import { posts } from '../blog/posts';
import { useTypingEffect } from '../hooks/useTypingEffect';
import PhotoLightbox from './PhotoLightbox';
import { ui } from '../i18n/ui';
import { useT } from '../i18n';

const say = (t) => t && window.dispatchEvent(new CustomEvent('companionSay', { detail: t }));

// Explicit, not "the first one that happens to be live": see heroFeature in
// data.js. Falls back to status so the hero still shows proof if the flag is
// ever dropped.
const liveProject =
  projects.find((p) => p.heroFeature) || projects.find((p) => p.status === 'live');
const liveUrl = liveProject?.links?.demo || liveProject?.links?.github || null;
const liveName = liveUrl ? liveUrl.replace(/\/+$/, '').split('/').pop() : liveProject?.title;

// Counted from data, never typed by hand, so the strip cannot drift from the
// page it summarises.
const STATS = {
  projects: projects.length,
  live: projects.filter((p) => p.links.demo).length,
  writeups: posts.length,
};

export default function Hero({ dark }) {
  const typed = useTypingEffect(personal.typingLines, { typeSpeed: 75, deleteSpeed: 40, pauseMs: 1800 });
  const [photoOpen, setPhotoOpen] = useState(false);
  const t = useT();

  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#576c80]';
  const borderColor = dark ? 'border-[rgba(125,167,217,0.08)]' : 'border-[rgba(30,50,80,0.1)]';
  const cardBg = dark ? 'bg-[#181f2e]' : 'bg-white';
  const accent = dark ? 'text-terminal-green' : 'text-[#197934]';
  const photoAlt = `${personal.name}, ${t(personal.title)}`;

  const Prompt = ({ children }) => (
    <div className={`mb-1.5 ${textSecondary}`}>
      <span className={accent}>❯</span> <span className={textPrimary}>{children}</span>
    </div>
  );

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden scanlines"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: dark
            ? 'linear-gradient(rgba(125,167,217,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(125,167,217,0.04) 1px, transparent 1px)'
            : 'linear-gradient(rgba(30,50,80,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,50,80,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: dark
            ? 'radial-gradient(circle, rgba(63,185,80,0.04) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(25,121,52,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 py-20 w-full">

        <div className={`font-mono text-xs mb-5 flex items-center gap-2 ${textSecondary}`}>
          <span className="inline-block w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
          {t(ui.hero.available)}
        </div>

        {/* One block. A second card beside this one competed with it for the
            eye exactly the way the old headshot did, and left a gap under
            itself; the live proof is a command in here instead. */}
        <div
          className={`rounded-lg border ${borderColor} ${cardBg} shadow-xl overflow-hidden`}
          style={{ boxShadow: dark ? '0 0 0 1px rgba(125,167,217,0.06), 0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.1)' }}
        >
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#f78166' }} />
            <div className="terminal-dot" style={{ background: '#e3b341' }} />
            <div className="terminal-dot" style={{ background: '#3fb950' }} />
            <span className={`ml-2 font-mono text-xs ${textSecondary}`}>luis@ml-portfolio:~</span>
          </div>

          <div className="p-5 sm:p-6 font-mono text-sm leading-relaxed">
            <Prompt>whoami</Prompt>
            <div className="mb-6 pl-4 flex items-center gap-3">
              {personal.photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoOpen(true)}
                  aria-label={t(ui.hero.photoOpen)}
                  className="shrink-0 rounded-full transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src={personal.photoUrl}
                    alt={photoAlt}
                    width="512"
                    height="512"
                    fetchPriority="high"
                    className={`w-12 h-12 rounded-full object-cover border ${borderColor}`}
                  />
                </button>
              )}
              <div className="min-w-0">
                <h1 className={`text-base font-semibold ${dark ? 'text-[#f5f8ff]' : 'text-[#1c2128]'}`}>
                  {personal.name}
                  <span className="sr-only">{t(ui.hero.srTitle)}</span>
                </h1>
                <p className={`text-[11px] mt-0.5 ${textSecondary}`}>
                  {t(personal.title)} · {t(personal.location)}
                </p>
              </div>
            </div>

            <Prompt>cat background.txt</Prompt>
            <p className={`mb-6 pl-4 pr-2 text-xs leading-6 ${textSecondary}`}>
              {t(ui.hero.pivot)}
            </p>

            <Prompt>ls /core-focus</Prompt>
            {/* Last line in the card now that curl is gone: no trailing margin */}
            <div className="pl-4 flex items-center gap-0.5 h-6">
              <span className={`text-sm ${dark ? 'text-terminal-blue' : 'text-[#0969da]'}`}>{typed}</span>
              <span className={`cursor-blink text-base leading-none ${accent}`}>▊</span>
            </div>

          </div>
        </div>

        {/* Three counts, each a way into the evidence. This stands in for the
            tagline: same vertical space, but every item is a link instead of
            another sentence to read. */}
        <div className={`mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] ${textMuted}`}>
          <a href="#projects" className={`transition-colors ${dark ? 'hover:text-[#ecf0f8]' : 'hover:text-[#1c2128]'}`}>
            <span className={`${textPrimary} font-semibold`}>{STATS.projects}</span> {t(ui.hero.statProjects)}
          </a>
          {liveUrl && (
            <>
              <span className="opacity-30">·</span>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => say(companion.projectLines?.[liveProject.id])}
                className={`flex items-center gap-1.5 transition-colors ${dark ? 'hover:text-[#ecf0f8]' : 'hover:text-[#1c2128]'}`}
              >
                <span className="relative flex w-1.5 h-1.5 shrink-0">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-terminal-green opacity-70 animate-ping" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-terminal-green" />
                </span>
                <span><span className={`${textPrimary} font-semibold`}>{STATS.live}</span> {t(ui.hero.statLive)}</span>
              </a>
            </>
          )}
          <span className="opacity-30">·</span>
          <Link to="/blog" className={`transition-colors ${dark ? 'hover:text-[#ecf0f8]' : 'hover:text-[#1c2128]'}`}>
            <span className={`${textPrimary} font-semibold`}>{STATS.writeups}</span> {t(ui.hero.statWriteups)}
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {/* The primary action is the deployed model, not an anchor. Scrolling
              already reaches the projects section, so a button that only
              scrolls is not earning its place. */}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => say(companion.projectLines?.[liveProject.id])}
              className={`group flex items-center gap-2 font-mono text-xs px-4 py-2 rounded border transition-all duration-200 ${
                dark
                  ? 'bg-terminal-green/10 border-terminal-green/30 text-terminal-green hover:bg-terminal-green/15 hover:border-terminal-green/60'
                  : 'bg-[rgba(25,121,52,0.08)] border-[rgba(25,121,52,0.3)] text-[#197934] hover:bg-[rgba(25,121,52,0.14)]'
              }`}
            >
              {t(ui.hero.tryLive)}: {liveName}
              <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
          <a
            href={personal.cvUrl}
            download
            className={`flex items-center gap-1.5 font-mono text-xs px-4 py-2 rounded border transition-all duration-200 ${
              dark
                ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:border-[rgba(125,167,217,0.3)] hover:text-[#ecf0f8]'
                : 'border-[rgba(30,50,80,0.15)] text-[#57606a] hover:border-[rgba(30,50,80,0.3)] hover:text-[#1c2128]'
            }`}
          >
            <FileDown size={12} />
            {t(ui.hero.downloadCv)}
          </a>
        </div>

        <div className={`mt-6 flex items-center gap-4 ${textSecondary}`}>
          <a href={personal.socials.github} target="_blank" rel="noopener noreferrer me"
             className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${dark ? 'hover:text-terminal-green' : 'hover:text-[#197934]'}`}>
            <Github size={14} /> github
          </a>
          <span className={dark ? 'text-[rgba(125,167,217,0.2)]' : 'text-[rgba(30,50,80,0.2)]'}>·</span>
          <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer me"
             className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${dark ? 'hover:text-terminal-blue' : 'hover:text-[#0969da]'}`}>
            <Linkedin size={14} /> linkedin
          </a>
          <span className={dark ? 'text-[rgba(125,167,217,0.2)]' : 'text-[rgba(30,50,80,0.2)]'}>·</span>
          <a href={`mailto:${personal.email}`}
             className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${dark ? 'hover:text-terminal-purple' : 'hover:text-[#7c3aed]'}`}>
            <Mail size={14} /> {t(ui.hero.email)}
          </a>
        </div>

        <div className={`mt-16 flex justify-center ${textSecondary}`}>
          <a href="#about" className="flex flex-col items-center gap-2 group">
            <span className="font-mono text-[10px] tracking-widest uppercase opacity-50 group-hover:opacity-80 transition-opacity">
              {t(ui.hero.scroll)}
            </span>
            <ArrowDown size={14} className="animate-bounce opacity-50 group-hover:opacity-80 transition-opacity" />
          </a>
        </div>
      </div>

      <PhotoLightbox
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        src={personal.photoUrl}
        alt={photoAlt}
        dark={dark}
      />
    </section>
  );
}
