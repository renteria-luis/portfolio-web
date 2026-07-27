import { useEffect } from 'react';

export const SITE_URL = 'https://luisrenteria.me';

/**
 * Keeps the document head in sync during client-side navigation.
 *
 * This is a fallback, not the SEO mechanism: every route is also prerendered
 * to a real HTML file by scripts/prerender.mjs, so a crawler sees the correct
 * tags in the served markup without executing any JavaScript. This hook only
 * fixes the head for a visitor who arrived on one route and clicked to
 * another.
 */
export function useDocumentMeta({ title, description, path, type = 'website' }) {
  useEffect(() => {
    if (title) document.title = title;

    const set = (selector, attr, value) => {
      if (!value) return;
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    set('meta[name="description"]', 'content', description);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', description);
    set('meta[property="og:type"]', 'content', type === 'article' ? 'article' : 'website');
    set('meta[name="twitter:title"]', 'content', title);
    set('meta[name="twitter:description"]', 'content', description);

    if (path) {
      const url = `${SITE_URL}${path === '/' ? '/' : path}`;
      set('link[rel="canonical"]', 'href', url);
      set('meta[property="og:url"]', 'content', url);
    }
  }, [title, description, path, type]);
}
