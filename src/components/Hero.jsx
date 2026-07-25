import { Github, Linkedin, ArrowDown, FileDown, Mail } from 'lucide-react';
import { personal, companion } from '../config/data';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { say } from '../lib/say';

const Prompt = ({ children }) => (
  <div className="mb-1 text-t2">
    <span className="text-terminal-green">❯</span> <span className="text-t1">{children}</span>
  </div>
);

export default function Hero() {
  const typed = useTypingEffect(personal.typingLines, { typeSpeed: 75, deleteSpeed: 40, pauseMs: 1800 });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden scanlines">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--line) / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line) / 0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-green) / 0.045) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">

          <div className="lg:col-span-3">
            <div className="font-mono text-xs mb-6 flex items-center gap-2 text-t2">
              <span className="inline-block w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              available for ML/data co-op (Fall 2026)
            </div>

            {/* Terminal window */}
            <div className="rounded-lg border border-line/10 bg-surface overflow-hidden shadow-2xl">
              <div className="terminal-header">
                <div className="terminal-dot bg-terminal-red" />
                <div className="terminal-dot bg-terminal-yellow" />
                <div className="terminal-dot bg-terminal-green" />
                <span className="ml-2 font-mono text-xs text-t2">luis@ml-portfolio:~</span>
              </div>

              <div className="p-5 font-mono text-sm leading-relaxed">
                <Prompt>whoami</Prompt>
                {/* The page's only <h1>. Search engines and screen readers use it
                    as the document title — it has to be the name. */}
                <h1 className="mb-4 text-base font-semibold pl-4 text-tb">
                  {personal.name}
                  <span className="sr-only"> — AI/ML Engineer &amp; Data Scientist, London, Ontario</span>
                </h1>

                <Prompt>cat title.txt</Prompt>
                <div className="mb-4 pl-4 text-xs text-t2 leading-5">{personal.title}</div>

                <Prompt>ls /core-focus</Prompt>
                <div className="pl-4 flex items-center gap-0.5 h-6">
                  <span className="text-terminal-blue text-sm">{typed}</span>
                  <span className="text-terminal-green cursor-blink text-base leading-none">▊</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-t2 max-w-md">{personal.tagline}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="font-mono text-xs px-4 py-2 rounded border bg-terminal-green/10 border-terminal-green/30 text-terminal-green hover:bg-terminal-green/[0.16] hover:border-terminal-green/60 transition-all duration-200"
              >
                ./view-projects
              </a>
              <a
                href={personal.cvUrl}
                download
                className="flex items-center gap-1.5 font-mono text-xs px-4 py-2 rounded border border-line/15 text-t2 hover:border-line/30 hover:text-t1 transition-all duration-200"
              >
                <FileDown size={12} />
                download resume
              </a>
            </div>

            <div className="mt-6 flex items-center gap-4 text-t2">
              <a href={personal.socials.github} target="_blank" rel="noopener noreferrer me"
                 className="flex items-center gap-1.5 font-mono text-xs hover:text-terminal-green transition-colors">
                <Github size={14} /> github
              </a>
              <span className="text-line/30">·</span>
              <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer me"
                 className="flex items-center gap-1.5 font-mono text-xs hover:text-terminal-blue transition-colors">
                <Linkedin size={14} /> linkedin
              </a>
              <span className="text-line/30">·</span>
              <a href={`mailto:${personal.email}`}
                 className="flex items-center gap-1.5 font-mono text-xs hover:text-terminal-purple transition-colors">
                <Mail size={14} /> email
              </a>
            </div>
          </div>

          {/* Photo */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end">
            <div className="relative" onMouseEnter={() => say(companion.hoverLines.photo)}>
              {personal.photoUrl ? (
                <div className="w-52 h-52 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border border-line/10 shadow-[0_0_40px_rgb(var(--c-green)/0.08)]">
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
                <div className="w-52 h-52 lg:w-64 lg:h-64 rounded-2xl border border-line/10 photo-shimmer flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-line/15 text-t3 flex items-center justify-center font-mono font-bold text-xl">
                    {personal.initials}
                  </div>
                  <p className="font-mono text-[10px] text-center px-4 leading-relaxed text-t2">
                    place <span className="text-terminal-green">/public/photo.webp</span>
                    <br />&amp; set <span className="text-terminal-blue">photoUrl</span> in data.js
                  </p>
                </div>
              )}

              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] px-3 py-1.5 rounded-full border border-line/[0.12] bg-surface text-t2 whitespace-nowrap">
                📍 {personal.location}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-center text-t2">
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
