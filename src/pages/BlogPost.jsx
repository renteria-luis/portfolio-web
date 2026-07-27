import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Github } from 'lucide-react';
import { postBySlug, formatDate } from '../blog/posts';
import { projects } from '../config/data';
import { ui } from '../i18n/ui';
import { useLang, useT } from '../i18n';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function BlogPost({ dark }) {
  const { slug } = useParams();
  const post = postBySlug(slug);
  const t = useT();
  const { lang } = useLang();

  useDocumentMeta(
    post
      ? { title: `${post.title} · Luis Renteria`, description: post.description, path: `/blog/${post.slug}`, type: 'article' }
      : { title: t(ui.blog.notFound), description: '', path: '/blog' },
  );

  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#8b9eb0]';
  const backLink = `flex items-center gap-1.5 font-mono text-xs transition-colors ${
    dark ? 'text-[#a2afc2] hover:text-terminal-green' : 'text-[#57606a] hover:text-[#1a7f37]'
  }`;

  if (!post) {
    return (
      <section className="pt-32 pb-24 max-w-3xl mx-auto px-6 min-h-screen">
        <h1 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
          {t(ui.blog.notFound)}
        </h1>
        <Link to="/blog" className={`${backLink} mt-6`}>
          <ArrowLeft size={13} /> {t(ui.blog.allPosts)}
        </Link>
      </section>
    );
  }

  const project = projects.find((p) => p.id === post.project);
  const repo = project?.links?.github;

  return (
    <article className="pt-32 pb-24 max-w-3xl mx-auto px-6 min-h-screen">
      <Link to="/blog" className={`${backLink} mb-8`}>
        <ArrowLeft size={13} /> {t(ui.blog.allPosts)}
      </Link>

      <header className="mt-8 mb-10">
        <div className={`flex flex-wrap items-center gap-3 font-mono text-[11px] mb-3 ${textMuted}`}>
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          <span className="opacity-50">·</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {post.readingMinutes} min</span>
          {repo && (
            <>
              <span className="opacity-50">·</span>
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 transition-colors ${dark ? 'hover:text-terminal-green' : 'hover:text-[#1a7f37]'}`}
              >
                <Github size={11} /> {t(ui.blog.sourceCode)}
              </a>
            </>
          )}
        </div>

        <h1 className={`font-mono text-2xl leading-snug font-semibold section-title ${textPrimary}`}>
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
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
      </header>

      {/* Content is my own Markdown compiled at build time, so there is no
          untrusted HTML to sanitise here. */}
      <div className="prose-terminal" dangerouslySetInnerHTML={{ __html: post.html }} />

      <footer className={`mt-16 pt-6 border-t ${dark ? 'border-[rgba(139,151,168,0.1)]' : 'border-[rgba(30,50,80,0.1)]'}`}>
        <p className={`text-sm ${textSecondary}`}>{t(ui.blog.footerCta)}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/#contact"
            className={`font-mono text-xs px-4 py-2 rounded border transition-all duration-200 ${
              dark
                ? 'bg-terminal-green/10 border-terminal-green/30 text-terminal-green hover:bg-terminal-green/15 hover:border-terminal-green/60'
                : 'bg-[rgba(26,127,55,0.08)] border-[rgba(26,127,55,0.3)] text-[#1a7f37] hover:bg-[rgba(26,127,55,0.14)]'
            }`}
          >
            {t(ui.blog.getInTouch)}
          </Link>
          <Link to="/blog" className={`font-mono text-xs px-4 py-2 rounded border transition-all duration-200 ${
            dark
              ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:border-[rgba(125,167,217,0.3)] hover:text-[#ecf0f8]'
              : 'border-[rgba(30,50,80,0.15)] text-[#57606a] hover:border-[rgba(30,50,80,0.3)] hover:text-[#1c2128]'
          }`}>
            {t(ui.blog.allPosts)}
          </Link>
        </div>
      </footer>
    </article>
  );
}
