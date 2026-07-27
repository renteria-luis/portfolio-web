import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { posts, formatDate } from '../blog/posts';
import { ui } from '../i18n/ui';
import { useLang, useT } from '../i18n';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function BlogIndex({ dark }) {
  const t = useT();
  const { lang } = useLang();

  useDocumentMeta({
    title: t(ui.blog.metaTitle),
    description: t(ui.blog.metaDescription),
    path: '/blog',
    type: 'website',
  });

  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#8b9eb0]';

  return (
    <section className="pt-32 pb-24 max-w-4xl mx-auto px-6 min-h-screen">
      <div className="mb-12">
        <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#1a7f37]'}`}>
          ~/blog
        </p>
        <h1 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
          {t(ui.blog.title)}
        </h1>
        <p className={`mt-3 text-sm ${textSecondary} max-w-2xl`}>
          {t(ui.blog.intro)}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className={`group rounded-lg p-5 block transition-all duration-300 ${dark ? 'card-dark' : 'card-light'}`}
          >
            <div className={`flex items-center gap-3 font-mono text-[10px] mb-2 ${textMuted}`}>
              <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
              <span className="opacity-50">·</span>
              <span className="flex items-center gap-1">
                <Clock size={10} /> {post.readingMinutes} min
              </span>
            </div>

            <h2 className={`font-mono text-sm font-semibold flex items-start gap-1.5 ${textPrimary}`}>
              {post.title}
              <ArrowUpRight
                size={12}
                className={`shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  dark ? 'text-terminal-green' : 'text-[#1a7f37]'
                }`}
              />
            </h2>

            <p className={`text-xs leading-6 mt-2 ${textSecondary}`}>{post.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
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
          </Link>
        ))}
      </div>
    </section>
  );
}
