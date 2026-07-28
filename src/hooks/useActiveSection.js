import { useEffect, useState } from 'react';

/**
 * Reports which section is currently under the reader.
 *
 * A plain IntersectionObserver is not enough on its own: sections here are
 * taller than the viewport, so several are "intersecting" at once and the
 * callback order decides the winner.
 *
 * We rank by visible height in pixels, not by intersectionRatio. Ratio is the
 * fraction of *that section* on screen, so a short section fully in view
 * (1.0) would outrank a tall one filling the viewport (0.3), and the nav
 * would highlight the wrong thing on every long section.
 *
 * Pass enabled=false on routes that have no sections (the blog), so the nav
 * does not highlight an anchor that is not on the page.
 */
export function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled) { setActive(null); return; }

    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRect.height : 0);
        }
        let best = null;
        let bestPx = 0;
        for (const [id, px] of visible) {
          if (px > bestPx) { bestPx = px; best = id; }
        }
        // A sliver at the edge is not "the section you are reading". Below a
        // quarter of the viewport, clear it rather than leave the nav lit on
        // something the reader has already scrolled past.
        setActive(bestPx > window.innerHeight * 0.25 ? best : null);
      },
      // Many thresholds because intersectionRect only updates when one is
      // crossed; the top offset discounts the fixed nav so a section does not
      // count as visible while it is hidden behind it.
      {
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
        rootMargin: '-56px 0px 0px 0px',
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join(','), enabled]);

  return active;
}
