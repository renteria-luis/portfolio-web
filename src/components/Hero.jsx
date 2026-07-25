import { Github, Linkedin, ArrowDown, FileDown, Mail } from 'lucide-react';
import { personal, companion } from '../config/data';
import { useTypingEffect } from '../hooks/useTypingEffect';

const say = (t) => t && window.dispatchEvent(new CustomEvent('companionSay', { detail: t }));

export default function Hero({ dark }) {
  const typed = useTypingEffect(personal.typingLines, { typeSpeed: 75, deleteSpeed: 40, pauseMs: 1800 });

  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const borderColor = dark ? 'border-[rgba(125,167,217,0.08)]' : 'border-[rgba(30,50,80,0.1)]';
  const cardBg = dark ? 'bg-[#181f2e]' : 'bg-white';
  const dotRed = '#f78166';
  const dotYellow = '#e3b341';
  const dotGreen = '#3fb950';

  return (
    <section
      id="hero"
      className={`relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden scanlines`}
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
            : 'radial-gradient(circle, rgba(26,127,55,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">

          {/* Left: Terminal Card */}
          <div className="lg:col-span-3">

            {/* Small breadcrumb label */}
            <div className={`font-mono text-xs mb-6 flex items-center gap-2 ${textSecondary}`}>
              <span className="inline-block w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              available for ML/data co-op (Fall 2026)
            </div>

            {/* Terminal Window */}
            <div
              className={`rounded-lg border ${borderColor} ${cardBg} shadow-xl overflow-hidden`}
              style={{ boxShadow: dark ? '0 0 0 1px rgba(125,167,217,0.06), 0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.1)' }}
            >
              {/* Window chrome */}
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: dotRed }} />
                <div className="terminal-dot" style={{ background: dotYellow }} />
                <div className="terminal-dot" style={{ background: dotGreen }} />
                <span className={`ml-2 font-mono text-xs ${textSecondary}`}>
                  luis@ml-portfolio:~
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 font-mono text-sm leading-relaxed">
                {/* Command 1 */}
                <div className={`mb-1 ${textSecondary}`}>
                  <span className="text-terminal-green">❯</span>{' '}
                  <span className={textPrimary}>whoami</span>
                </div>
                {/* The page's only <h1>. Search engines and screen readers use
                    it as the document title — it has to be the name. */}
                <h1 className={`mb-4 text-base font-semibold pl-4 ${dark ? 'text-[#f5f8ff]' : 'text-[#1c2128]'}`}>
                  {personal.name}
                  <span className="sr-only"> — AI/ML Engineer &amp; Data Scientist, London, Ontario</span>
                </h1>

                {/* Command 2 */}
                <div className={`mb-1 ${textSecondary}`}>
                  <span className="text-terminal-green">❯</span>{' '}
                  <span className={textPrimary}>cat title.txt</span>
                </div>
                <div className={`mb-4 pl-4 text-xs ${textSecondary} leading-5`}>
                  {personal.title}
                </div>

                {/* Command 3 — typing effect */}
                <div className={`mb-1 ${textSecondary}`}>
                  <span className="text-terminal-green">❯</span>{' '}
                  <span className={textPrimary}>ls /core-focus</span>
                </div>
                <div className="pl-4 flex items-center gap-0.5 h-6">
                  <span className="text-terminal-blue text-sm">{typed}</span>
                  <span className="text-terminal-green cursor-blink text-base leading-none">▊</span>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p className={`mt-6 text-sm leading-relaxed ${textSecondary} max-w-md`}>
              {personal.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#projects"
                className={`font-mono text-xs px-4 py-2 rounded border transition-all duration-200 ${
                  dark
                    ? 'bg-terminal-green/10 border-terminal-green/30 text-terminal-green hover:bg-terminal-green/15 hover:border-terminal-green/60'
                    : 'bg-[rgba(26,127,55,0.08)] border-[rgba(26,127,55,0.3)] text-[#1a7f37] hover:bg-[rgba(26,127,55,0.14)]'
                }`}
              >
                ./view-projects
              </a>
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
                download resume
              </a>
            </div>

            {/* Social row */}
            <div className={`mt-6 flex items-center gap-4 ${textSecondary}`}>
              <a
                href={personal.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${
                  dark ? 'hover:text-terminal-green' : 'hover:text-[#1a7f37]'
                }`}
              >
                <Github size={14} /> github
              </a>
              <span className={`${dark ? 'text-[rgba(125,167,217,0.2)]' : 'text-[rgba(30,50,80,0.2)]'}`}>·</span>
              <a
                href={personal.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${
                  dark ? 'hover:text-terminal-blue' : 'hover:text-[#0969da]'
                }`}
              >
                <Linkedin size={14} /> linkedin
              </a>
              <span className={`${dark ? 'text-[rgba(125,167,217,0.2)]' : 'text-[rgba(30,50,80,0.2)]'}`}>·</span>
              <a
                href={`mailto:${personal.email}`}
                className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${
                  dark ? 'hover:text-terminal-purple' : 'hover:text-[#7c3aed]'
                }`}
              >
                <Mail size={14} /> email
              </a>
            </div>
          </div>

          {/* Right: Photo placeholder */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end">
            <div className="relative" onMouseEnter={() => say(companion.hoverLines.photo)}>
              {personal.photoUrl ? (
                <div
                  className={`w-52 h-52 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border ${borderColor}`}
                  style={{ boxShadow: dark ? '0 0 40px rgba(63,185,80,0.08)' : 'none' }}
                >
                  <img
                    src={personal.photoUrl}
                    alt={`${personal.name}, ${personal.title}`}
                    width="512"
                    height="512"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-52 h-52 lg:w-64 lg:h-64 rounded-2xl border ${borderColor} photo-shimmer flex flex-col items-center justify-center gap-3`}
                  style={{
                    boxShadow: dark
                      ? '0 0 0 1px rgba(125,167,217,0.06), inset 0 0 30px rgba(0,0,0,0.3)'
                      : '0 0 0 1px rgba(30,50,80,0.1)',
                  }}
                >
                  <div
                    className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xl ${
                      dark
                        ? 'border-[rgba(125,167,217,0.15)] text-[rgba(125,167,217,0.3)]'
                        : 'border-[rgba(30,50,80,0.15)] text-[rgba(30,50,80,0.3)]'
                    }`}
                  >
                    {personal.initials}
                  </div>
                  <p className={`font-mono text-[10px] text-center px-4 leading-relaxed ${textSecondary}`}>
                    place <span className={dark ? 'text-terminal-green' : 'text-[#1a7f37]'}>/public/photo.jpg</span>
                    <br />& set <span className={dark ? 'text-terminal-blue' : 'text-[#0969da]'}>photoUrl</span> in data.js
                  </p>
                </div>
              )}

              {/* Location badge */}
              <div
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] px-3 py-1.5 rounded-full border whitespace-nowrap ${
                  dark
                    ? 'bg-[#181f2e] border-[rgba(125,167,217,0.12)] text-[#a2afc2]'
                    : 'bg-white border-[rgba(30,50,80,0.12)] text-[#57606a]'
                }`}
              >
                📍 {personal.location}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`mt-20 flex justify-center ${textSecondary}`}>
          <a href="#about" className="flex flex-col items-center gap-2 group">
            <span className="font-mono text-[10px] tracking-widest uppercase opacity-50 group-hover:opacity-80 transition-opacity">
              scroll
            </span>
            <ArrowDown size={14} className="animate-bounce opacity-50 group-hover:opacity-80 transition-opacity" />
          </a>
        </div>
      </div>
    </section>
  );
}
