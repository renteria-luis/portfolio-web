import { Link } from 'react-router-dom';
import { Github, ExternalLink, Terminal, ArrowUpRight, Lock, BookOpen } from 'lucide-react';
import { SiHuggingface } from 'react-icons/si';
import { projects, companion } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';
import { ui } from '../i18n/ui';
import { useT } from '../i18n';
import { postForProject } from '../blog/posts';

const STATUS_STYLES = {
  live: {
    dark: 'bg-[rgba(63,185,80,0.1)] text-terminal-green border-[rgba(63,185,80,0.25)]',
    light: 'bg-[rgba(26,127,55,0.08)] text-[#197934] border-[rgba(26,127,55,0.25)]',
    dot: '#3fb950',
  },
  building: {
    dark: 'bg-[rgba(227,179,65,0.1)] text-terminal-yellow border-[rgba(227,179,65,0.25)]',
    light: 'bg-[rgba(180,83,9,0.08)] text-[#b45309] border-[rgba(180,83,9,0.2)]',
    dot: '#e3b341',
  },
  complete: {
    dark: 'bg-[rgba(121,192,255,0.1)] text-terminal-blue border-[rgba(121,192,255,0.25)]',
    light: 'bg-[rgba(9,105,218,0.08)] text-[#0969da] border-[rgba(9,105,218,0.2)]',
    dot: '#79c0ff',
  },
};

const ACCENT_MAP = {
  'terminal-green': { dark: 'rgba(63,185,80,0.2)', light: 'rgba(26,127,55,0.25)', text: '#3fb950', textLight: '#197934' },
  'terminal-blue': { dark: 'rgba(121,192,255,0.2)', light: 'rgba(9,105,218,0.25)', text: '#79c0ff', textLight: '#0969da' },
  'terminal-purple': { dark: 'rgba(210,168,255,0.2)', light: 'rgba(124,58,237,0.25)', text: '#d2a8ff', textLight: '#7c3aed' },
  'terminal-orange': { dark: 'rgba(255,166,87,0.2)', light: 'rgba(180,83,9,0.25)', text: '#ffa657', textLight: '#b45309' },
};

function ProjectCard({ project, dark, t }) {
  const post = postForProject(project.id);
  const status = STATUS_STYLES[project.status];
  const accent = ACCENT_MAP[project.accent];
  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#576c80]';
  const accentColor = dark ? accent.text : accent.textLight;
  const borderHover = dark ? accent.dark : accent.light;

  return (
    <div
      className={`group h-full rounded-lg p-5 flex flex-col transition-all duration-300 ${dark ? 'card-dark' : 'card-light'}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = borderHover;
        const line = companion.projectLines?.[project.id];
        if (line) window.dispatchEvent(new CustomEvent('companionSay', { detail: line }));
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = dark ? 'rgba(125,167,217,0.08)' : 'rgba(30,50,80,0.1)';
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal size={14} style={{ color: accentColor }} />
          <div
            className={`tag border font-mono text-[10px] px-2 py-0.5 flex items-center gap-1.5 ${
              dark ? status.dark : status.light
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: status.dot,
                boxShadow: project.status === 'live' ? `0 0 6px ${status.dot}` : 'none',
                animation: project.status === 'building' ? 'blink 1.5s ease-in-out infinite' : 'none',
              }}
            />
            {t(project.statusLabel)}
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded border transition-colors ${
                dark
                  ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:text-[#ecf0f8] hover:border-[rgba(125,167,217,0.3)]'
                  : 'border-[rgba(30,50,80,0.12)] text-[#57606a] hover:text-[#1c2128]'
              }`}
              aria-label={`${project.title}: ${t(ui.projects.srcOn)}`}
            >
              <Github size={13} />
            </a>
          )}
          {post && (
            <Link
              to={`/blog/${post.slug}`}
              className={`p-1.5 rounded border transition-colors ${
                dark
                  ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:text-terminal-green hover:border-[rgba(63,185,80,0.3)]'
                  : 'border-[rgba(30,50,80,0.12)] text-[#57606a] hover:text-[#197934]'
              }`}
              aria-label={`${project.title}: ${t(ui.blog.readPost)}`}
              title={t(ui.blog.readPost)}
            >
              <BookOpen size={13} />
            </Link>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded border transition-colors ${
                dark
                  ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:text-[#ffd21e] hover:border-[rgba(255,210,30,0.3)]'
                  : 'border-[rgba(30,50,80,0.12)] text-[#57606a] hover:text-[#f5a623]'
              }`}
              aria-label={`${project.title}: ${t(ui.projects.liveDemo)}`}
              title={t(ui.projects.liveDemo)}
            >
              {project.links.demo.includes('huggingface.co')
                ? <SiHuggingface size={13} />
                : <ExternalLink size={13} />}
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mb-1">
        <h3 className={`font-mono text-sm font-semibold ${textPrimary} flex items-center gap-1.5 group-hover:gap-2 transition-all`}>
          {project.title}
          <ArrowUpRight size={12} style={{ color: accentColor }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p style={{ color: accentColor }} className="font-mono text-[10px] mt-0.5 opacity-70">
          {t(project.subtitle)}
        </p>
      </div>

      {/* Description */}
      <p className={`text-xs leading-6 mt-2 flex-1 ${textSecondary}`}>
        {t(project.description)}
      </p>

      {/* Date range */}
      {project.period && (
        <div className={`mt-3 font-mono text-[10px] ${textMuted}`}>
          {t(project.period)}
        </div>
      )}

      {/* Metrics row */}
      {project.metrics && (
        <div className={`mt-4 pt-3 border-t flex gap-4 ${dark ? 'border-[rgba(125,167,217,0.06)]' : 'border-[rgba(30,50,80,0.08)]'}`}>
          {project.metrics.map((m) => (
            <div key={t(m.label)} className="text-center">
              <div className="font-mono text-xs font-semibold" style={{ color: accentColor }}>
                {t(m.value)}
              </div>
              <div className={`font-mono text-[9px] uppercase tracking-wide mt-0.5 ${textMuted}`}>
                {t(m.label)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group work: name the part that is mine */}
      {project.myRole && (
        <div className={`mt-3 pt-3 border-t ${dark ? 'border-[rgba(125,167,217,0.06)]' : 'border-[rgba(30,50,80,0.08)]'}`}>
          <span className={`font-mono text-[9px] uppercase tracking-wide ${textMuted}`}>
            {t(project.myRole.label)}
          </span>
          <p className="font-mono text-[11px] mt-1" style={{ color: accentColor }}>
            {t(project.myRole.value)}
          </p>
          <p className={`text-[11px] leading-5 mt-1 ${textSecondary}`}>
            {t(project.myRole.detail)}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`tag border font-mono text-[10px] px-2 py-0.5 ${
              dark
                ? 'bg-[rgba(125,167,217,0.04)] text-[#a2afc2] border-[rgba(125,167,217,0.1)]'
                : 'bg-[rgba(30,50,80,0.04)] text-[#57606a] border-[rgba(30,50,80,0.1)]'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom link row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 relative">
        {(project.links.github || project.links.demo) && (
          <>
            <span className="spark" style={{ left: '8px', top: '-5px', animationDelay: '0s' }} />
            <span className="spark" style={{ left: '82px', top: '-7px', animationDelay: '0.4s' }} />
            <span className="spark" style={{ left: '150px', top: '-4px', animationDelay: '0.8s' }} />
          </>
        )}
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
              dark
                ? 'text-[#7b8fa6] group-hover:text-[#b8c2d0] hover:!text-terminal-green'
                : 'text-[#576c80] group-hover:text-[#4b5563] hover:!text-[#197934]'
            }`}
          >
            <Github size={11} />
            github.com/{project.links.github.split('github.com/')[1]}
          </a>
        )}

        {/* No public repo: say so and credit the owner rather than show a dead link */}
        {project.repoPrivate && (
          <span className={`flex flex-wrap items-center gap-1.5 font-mono text-[11px] ${textMuted}`}>
            <Lock size={11} />
            {t(ui.projects.privateRepo)}
            {project.collaborators?.length > 0 && (
              <>
                <span className="opacity-50">·</span>
                <span>
                  {t(ui.projects.with)}{' '}
                  {project.collaborators.map((c, i) => (
                    <span key={c.name}>
                      {i > 0 && ', '}
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline underline-offset-2 decoration-dotted transition-colors ${
                          dark ? 'hover:text-terminal-orange' : 'hover:text-[#b45309]'
                        }`}
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

        {project.links.demo && project.links.demo.includes('huggingface.co') && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
              dark
                ? 'text-[#7b8fa6] group-hover:text-[#b8c2d0] hover:!text-[#ffd21e]'
                : 'text-[#576c80] group-hover:text-[#4b5563] hover:!text-[#f5a623]'
            }`}
          >
            <SiHuggingface size={11} />
            {project.links.demo.replace(/^https?:\/\//, '')}
          </a>
        )}

        {/* basis-full drops this onto its own line, always last */}
        {post && (
          <Link
            to={`/blog/${post.slug}`}
            className={`basis-full flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
              dark
                ? 'text-[#7b8fa6] group-hover:text-[#b8c2d0] hover:!text-terminal-green'
                : 'text-[#576c80] group-hover:text-[#4b5563] hover:!text-[#197934]'
            }`}
          >
            <BookOpen size={11} />
            {t(ui.blog.readPost)}
          </Link>
        )}
      </div>
    </div>
  );
}

// A compact row for the projects that are not carrying the portfolio. Same
// information, a fraction of the vertical space, and the contrast is what
// makes the featured cards actually read as featured.
function CompactProject({ project, dark, t }) {
  const accent = ACCENT_MAP[project.accent] ?? ACCENT_MAP['terminal-green'];
  const accentColor = dark ? accent.text : accent.textLight;
  const post = postForProject(project.id);
  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#576c80]';
  const linkCls = `flex items-center gap-1.5 font-mono text-[10px] transition-colors ${
    dark ? 'text-[#7b8fa6] hover:!text-terminal-green' : 'text-[#576c80] hover:!text-[#197934]'
  }`;

  return (
    <div
      onMouseEnter={() => {
        const line = companion.projectLines?.[project.id];
        if (line) window.dispatchEvent(new CustomEvent('companionSay', { detail: line }));
      }}
      className={`group py-4 border-b ${dark ? 'border-[rgba(125,167,217,0.07)]' : 'border-[rgba(30,50,80,0.08)]'}`}
    >
      {/* ml-auto only from sm up. On a phone there is no room to push the date
          and the links to the right edge, so they wrapped into a ragged middle
          column. Left-aligned on their own line reads like a list instead. */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className={`font-mono text-xs font-semibold ${textPrimary}`}>{project.title}</h3>
        <span className="font-mono text-[10px]" style={{ color: accentColor }}>{t(project.subtitle)}</span>
        <span className={`font-mono text-[10px] basis-full sm:basis-auto sm:ml-auto whitespace-nowrap ${textMuted}`}>
          {t(project.period)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {project.tags.slice(0, 5).map((tag) => (
          <span key={tag} className={`font-mono text-[10px] ${textSecondary}`}>{tag}</span>
        ))}
        {/* sm:contents dissolves this wrapper on wider screens, so the links
            go back to being direct flex children and ml-auto still pushes them
            to the right edge. On a phone it keeps them together on one line
            under the stack instead of one link per row. */}
        <div className="basis-full flex items-center gap-x-3 sm:contents">
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer"
               className={`sm:ml-auto ${linkCls}`}>
              <Github size={10} className="shrink-0" /> github
            </a>
          )}
          {post && (
            <Link to={`/blog/${post.slug}`} className={linkCls}>
              <BookOpen size={10} className="shrink-0" /> {t(ui.projects.writeupShort)}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ dark }) {
  const ref = useReveal(0.05);
  const t = useT();
  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';

  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div ref={ref} className="reveal">
          {/* Section header */}
          <div className="mb-12">
            <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#197934]'}`}>
              {t(ui.projects.label)}
            </p>
            <h2 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
              {t(ui.projects.title)}
            </h2>
            <p className={`mt-3 text-sm ${textSecondary}`}>
              {t(ui.projects.subtitle)}
            </p>
          </div>

          {/* Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((p, i) => (
              <div key={p.id} className="stagger h-full" style={{ '--i': i }}>
                <ProjectCard project={p} dark={dark} t={t} />
              </div>
            ))}
          </div>

          {/* Everything else, as rows. The hierarchy was declared in data.js
              and never shown; this is what showing it looks like. */}
          {others.length > 0 && (
            <div className="mt-10">
              <p className={`font-mono text-[10px] uppercase tracking-[0.18em] mb-1 ${
                dark ? 'text-[#7b8fa6]' : 'text-[#576c80]'
              }`}>
                {t(ui.projects.alsoBuilt)}
              </p>
              <div className={`border-t ${dark ? 'border-[rgba(125,167,217,0.07)]' : 'border-[rgba(30,50,80,0.08)]'}`}>
                {others.map((p) => (
                  <CompactProject key={p.id} project={p} dark={dark} t={t} />
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className={`mt-8 text-center font-mono text-xs ${textSecondary}`}>
            {t(ui.projects.more)}{' '}
            <a
              href="https://github.com/renteria-luis"
              target="_blank"
              rel="noopener noreferrer me"
              className={`transition-colors ${dark ? 'text-terminal-green hover:text-terminal-green/70' : 'text-[#197934] hover:opacity-70'}`}
            >
              github.com/renteria-luis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
