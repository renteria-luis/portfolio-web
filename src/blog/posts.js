import { marked } from 'marked';

/**
 * Blog posts are Markdown files with YAML-ish frontmatter in
 * src/content/blog/. Vite inlines them at build time, so there is no runtime
 * fetch and the prerender script can read the same source.
 *
 * The frontmatter parser below is deliberately tiny: this is content I write
 * myself in a format I control, so a full YAML dependency would be paying for
 * generality nobody needs.
 */
const files = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  let listKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    // Block list item: "  - text". Belongs to the key that opened above it,
    // which is how tldr bullets hold commas without being split.
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item && listKey) {
      meta[listKey].push(item[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let [, key, value] = kv;
    value = value.trim();
    if (value === '') {
      // Bare "key:" opens a block list.
      meta[key] = [];
      listKey = key;
      continue;
    }
    listKey = null;
    if (/^\[.*\]$/.test(value)) {
      meta[key] = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      meta[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  return { meta, body: raw.slice(match[0].length) };
}

marked.setOptions({ gfm: true, breaks: false });

export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '');
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug,
      title: meta.title || slug,
      description: meta.description || '',
      date: meta.date || '',
      project: meta.project || null,
      tags: meta.tags || [],
      lang: meta.lang || 'en',
      tldr: meta.tldr || [],
      tldrMetrics: (meta.tldrMetrics || []).map((s) => {
        const [label, value] = s.split('=').map((x) => x.trim());
        return { label, value };
      }),
      readingMinutes: Number(meta.readingMinutes) || Math.max(1, Math.round(body.split(/\s+/).length / 220)),
      body,
      html: marked.parse(body),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const postBySlug = (slug) => posts.find((p) => p.slug === slug) || null;

/** Slug of the post attached to a project card, if that project has one. */
export const postForProject = (projectId) => posts.find((p) => p.project === projectId) || null;

export const formatDate = (iso, lang = 'en') => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};
