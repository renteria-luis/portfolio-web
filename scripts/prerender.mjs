// Emits a real HTML file per route after `vite build`.
//
// Why this exists: the site is a client-rendered SPA, so every route would
// otherwise be served the same index.html, with the same <title>, description,
// canonical and structured data. Google does execute JavaScript, but tags
// injected on the client are unreliable and a crawler that reads the raw
// markup sees nothing article-specific. Writing the head into the served HTML
// is the whole point of publishing writeups.
//
// Vercel checks the filesystem before applying rewrites, so dist/blog/<slug>/
// index.html wins over the SPA fallback automatically.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CONTENT = path.join(ROOT, 'src/content/blog');
const SITE = 'https://luisrenteria.me';
const AUTHOR = 'Luis Renteria Lezano';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  let listKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item && listKey) {
      meta[listKey].push(item[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let [, k, v] = kv;
    v = v.trim();
    if (v === '') { meta[k] = []; listKey = k; continue; }
    listKey = null;
    meta[k] = /^\[.*\]$/.test(v)
      ? v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
      : v.replace(/^["']|["']$/g, '');
  }
  return { meta, body: raw.slice(m[0].length) };
}

const posts = fs.readdirSync(CONTENT)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const { meta, body } = parseFrontmatter(fs.readFileSync(path.join(CONTENT, f), 'utf8'));
    return {
      slug: f.replace(/\.md$/, ''),
      title: meta.title,
      description: meta.description,
      date: meta.date,
      tags: meta.tags || [],
      lang: meta.lang || 'en',
      words: body.split(/\s+/).length,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

/** Rewrites the head of the built index.html for one route. */
function render({ title, description, url, lang, ogType, jsonLd, ogImage }) {
  let html = template;
  const swap = (re, value) => { html = html.replace(re, value); };

  swap(/<html lang="[^"]*"/, `<html lang="${lang}"`);
  swap(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  swap(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  swap(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  swap(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  swap(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  swap(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  swap(/(<meta property="og:type" content=")[^"]*(")/, `$1${ogType}$2`);
  swap(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  swap(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  if (ogImage) {
    swap(/(<meta property="og:image" content=")[^"]*(")/, `$1${ogImage}$2`);
    swap(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${ogImage}$2`);
  }
  if (jsonLd) {
    swap(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`,
    );
  }
  return html;
}

function write(routePath, html) {
  const dir = path.join(DIST, routePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ── /blog ────────────────────────────────────────────────────────────────
write('blog', render({
  title: 'Writeups · Luis Renteria',
  description: 'Engineering writeups on machine learning decisions: threshold selection in fraud detection, confounders in churn models, and directing AI coding tools.',
  url: `${SITE}/blog`,
  lang: 'en',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Luis Renteria: writeups',
    url: `${SITE}/blog`,
    author: { '@type': 'Person', name: AUTHOR, url: `${SITE}/` },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${SITE}/blog/${p.slug}`,
    })),
  },
}));

// ── /blog/<slug> ─────────────────────────────────────────────────────────
for (const p of posts) {
  const url = `${SITE}/blog/${p.slug}`;
  const ogImage = fs.existsSync(path.join(DIST, 'og', `${p.slug}.jpg`))
    ? `${SITE}/og/${p.slug}.jpg`
    : `${SITE}/og.jpg`;

  write(`blog/${p.slug}`, render({
    title: `${p.title} · Luis Renteria`,
    description: p.description,
    url,
    lang: p.lang,
    ogType: 'article',
    ogImage,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.date,
      inLanguage: p.lang,
      wordCount: p.words,
      keywords: p.tags.join(', '),
      image: ogImage,
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: {
        '@type': 'Person',
        name: AUTHOR,
        url: `${SITE}/`,
        '@id': `${SITE}/#luis`,
      },
      publisher: { '@type': 'Person', name: AUTHOR, url: `${SITE}/` },
    },
  }));
}

// ── sitemap ──────────────────────────────────────────────────────────────
const urls = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'monthly' },
  { loc: `${SITE}/blog`, priority: '0.8', changefreq: 'weekly' },
  ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}`, priority: '0.7', changefreq: 'yearly', lastmod: p.date })),
];

fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`);

// ── machine-readable resume + llms.txt ───────────────────────────────────
// Both are generated from data.js so the site, the JSON and the agent-facing
// summary cannot drift apart. Increasingly the first reader of a portfolio is
// a scraper, and giving it structure beats making it parse the DOM.
const { personal, projects, timeline, skillCategories } = await import('../src/config/data.js');

const en = (v) => (v && typeof v === 'object' && 'en' in v ? v.en : v);

const resume = {
  $schema: 'https://jsonresume.org/schema/',
  basics: {
    name: personal.name,
    label: en(personal.title),
    email: personal.email,
    url: `${SITE}/`,
    summary: en(personal.bio).join(' '),
    location: { city: 'London', region: 'Ontario', countryCode: 'CA' },
    profiles: Object.entries(personal.socials).map(([network, url]) => ({ network, url })),
  },
  work: timeline
    .filter((e) => e.type === 'experience')
    .map((e) => ({
      name: en(e.institution), position: en(e.role), startEndDate: en(e.period),
      summary: en(e.description),
    })),
  education: timeline
    .filter((e) => e.type === 'education')
    .map((e) => ({
      institution: en(e.institution), studyType: en(e.role), startEndDate: en(e.period),
      summary: en(e.description),
    })),
  projects: projects.map((p) => ({
    name: p.title,
    description: en(p.description),
    startEndDate: en(p.period),
    keywords: p.tags,
    status: p.status,
    url: p.links.demo || p.links.github || null,
    highlights: p.metrics.map((mm) => `${en(mm.label)}: ${en(mm.value)}`),
    ...(p.myRole ? { role: en(p.myRole.value), roleDetail: en(p.myRole.detail) } : {}),
  })),
  skills: skillCategories.map((c) => ({
    name: en(c.label),
    keywords: c.skills.map((s) => en(s.name)),
  })),
  meta: { generatedAt: new Date().toISOString().slice(0, 10), source: `${SITE}/` },
};

fs.writeFileSync(path.join(DIST, 'resume.json'), JSON.stringify(resume, null, 2));

const live = projects.filter((p) => p.status === 'live');
const llms = `# ${personal.name}

> ${en(personal.title)} in ${en(personal.location)}. ${en(personal.tagline)}

Open to: Machine Learning / Data co-op placement, Fall 2026.
Contact: ${personal.email}
Machine-readable resume: ${SITE}/resume.json

## Projects
${projects.map((p) => `- **${p.title}** (${en(p.period)}, ${p.status}): ${en(p.subtitle)}. ${p.metrics.map((mm) => `${en(mm.label)} ${en(mm.value)}`).join(', ')}.${p.links.demo ? ` Demo: ${p.links.demo}` : ''}${p.links.github ? ` Repo: ${p.links.github}` : ''}`).join('\n')}

${live.length ? `Deployed and publicly reachable: ${live.map((p) => p.title).join(', ')}.` : ''}

## Writeups
${posts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}) (${p.date}): ${p.description}`).join('\n')}

## Links
${Object.entries(personal.socials).map(([k, v]) => `- ${k}: ${v}`).join('\n')}
`;

fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);

console.log(`prerendered /blog + ${posts.length} article${posts.length === 1 ? '' : 's'}, sitemap has ${urls.length} urls`);
console.log(`wrote resume.json (${resume.projects.length} projects) and llms.txt`);
