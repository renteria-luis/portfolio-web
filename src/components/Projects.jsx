import { Github, ExternalLink, Terminal, ArrowUpRight, Lock } from 'lucide-react';
import { SiHuggingface } from 'react-icons/si';
import { projects, companion } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';
import { say } from '../lib/say';

// Full class strings only — Tailwind's JIT cannot resolve interpolated names.
const STATUS_STYLES = {
  live:     { cls: 'bg-terminal-green/10  text-terminal-green  border-terminal-green/25',  dot: 'bg-terminal-green' },
  building: { cls: 'bg-terminal-yellow/10 text-terminal-yellow border-terminal-yellow/25', dot: 'bg-terminal-yellow' },
  complete: { cls: 'bg-terminal-blue/10   text-terminal-blue   border-terminal-blue/25',   dot: 'bg-terminal-blue' },
};

const ACCENT = {
  'terminal-green':  { text: 'text-terminal-green',  hover: 'hover:border-terminal-green/30' },
  'terminal-blue':   { text: 'text-terminal-blue',   hover: 'hover:border-terminal-blue/30' },
  'terminal-purple': { text: 'text-terminal-purple', hover: 'hover:border-terminal-purple/30' },
  'terminal-orange': { text: 'text-terminal-orange', hover: 'hover:border-terminal-orange/30' },
};

const iconBtn =
  'p-1.5 rounded border border-line/15 text-t2 hover:text-t1 hover:border-line/30 transition-colors';

function ProjectCard({ project }) {
  const status = STATUS_STYLES[project.status];
  const accent = ACCENT[project.accent] ?? ACCENT['terminal-green'];
  const { github, demo } = project.links;

  return (
    <div
      className={`group card rounded-lg p-5 flex flex-col ${accent.hover}`}
      onMouseEnter={() => say(companion.projectLines?.[project.id])}
    >
      {/* Top row: status, date, quick links */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Terminal size={14} className={accent.text} />
          <span className={`tag border font-mono text-[10px] px-2 py-0.5 flex items-center gap-1.5 ${status.cls}`}>
            <span
              className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
              style={{
                boxShadow: project.status === 'live' ? '0 0 6px currentColor' : 'none',
                animation: project.status === 'building' ? 'blink 1.5s ease-in-out infinite' : 'none',
              }}
            />
            {project.statusLabel}
          </span>
          {project.period && (
            <span className="font-mono text-[10px] text-t3 whitespace-nowrap">{project.period}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label={`${project.title} source on GitHub`}>
              <Github size={13} />
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className={iconBtn}
              aria-label={`${project.title} live demo`}
              title="Live demo"
            >
              {demo.includes('huggingface.co') ? <SiHuggingface size={13} /> : <ExternalLink size={13} />}
            </a>
          )}
        </div>
      </div>

      <div className="mb-1">
        <h3 className="font-mono text-sm font-semibold text-t1 flex items-center gap-1.5 group-hover:gap-2 transition-all">
          {project.title}
          <ArrowUpRight size={12} className={`${accent.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
        </h3>
        <p className={`font-mono text-[10px] mt-0.5 opacity-70 ${accent.text}`}>{project.subtitle}</p>
      </div>

      <p className="text-xs leading-6 mt-2 flex-1 text-t2">{project.description}</p>

      {project.metrics && (
        <div className="mt-4 pt-3 border-t border-line/[0.07] flex gap-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className={`font-mono text-xs font-semibold ${accent.text}`}>{m.value}</div>
              <div className="font-mono text-[9px] uppercase tracking-wide mt-0.5 text-t3">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="tag border bg-line/[0.04] text-t2 border-line/10">{tag}</span>
        ))}
      </div>

      {/* Bottom link row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 relative">
        {(github || demo) && (
          <>
            <span className="spark" style={{ left: '8px', top: '-5px', animationDelay: '0s' }} />
            <span className="spark" style={{ left: '82px', top: '-7px', animationDelay: '0.4s' }} />
            <span className="spark" style={{ left: '150px', top: '-4px', animationDelay: '0.8s' }} />
          </>
        )}

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[11px] text-t3 group-hover:text-t2 hover:!text-terminal-green transition-colors"
          >
            <Github size={11} />
            github.com/{github.split('github.com/')[1]}
          </a>
        )}

        {/* No public repo: say so, and credit the owner rather than showing a dead link */}
        {project.repoPrivate && (
          <span className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-t3">
            <Lock size={11} />
            private repo
            {project.collaborators?.length > 0 && (
              <>
                <span className="opacity-50">·</span>
                <span>
                  with{' '}
                  {project.collaborators.map((c, i) => (
                    <span key={c.name}>
                      {i > 0 && ', '}
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terminal-orange transition-colors underline underline-offset-2 decoration-dotted"
                      >
                        @{c.name}
                      </a>
                    </span>
                  ))}
                </span>
              </>
            )}
          </span>
        )}

        {demo?.includes('huggingface.co') && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[11px] text-t3 group-hover:text-t2 hover:!text-terminal-yellow transition-colors"
          >
            <SiHuggingface size={11} />
            live on HF Spaces
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const ref = useReveal(0.05);
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div ref={ref} className="reveal">
          <div className="mb-12">
            <p className="font-mono text-xs mb-2 text-terminal-green">03 / projects</p>
            <h2 className="font-mono text-2xl font-semibold section-title text-t1">what I've built</h2>
            <p className="mt-3 text-sm text-t2">End-to-end ML systems. Real data, real deployments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {others.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>

          <div className="mt-8 text-center font-mono text-xs text-t2">
            More on{' '}
            <a
              href="https://github.com/renteria-luis"
              target="_blank"
              rel="noopener noreferrer me"
              className="text-terminal-green hover:opacity-70 transition-opacity"
            >
              github.com/renteria-luis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
