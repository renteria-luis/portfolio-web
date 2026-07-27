import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import NeuralBackground from './components/NeuralBackground';
import Companion from './components/Companion';
import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import { ui } from './i18n/ui';
import { useT } from './i18n';

/**
 * Restores scroll on navigation. Without this react-router keeps the previous
 * scroll offset, so clicking into an article from halfway down the blog index
 * drops you halfway down the article.
 */
function ScrollBehaviour() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Let the target section exist before jumping to it.
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const t = useT();
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return true;
  });

  useEffect(() => {
    const html = document.documentElement;
    dark ? html.classList.add('dark') : html.classList.remove('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      {/* Keyboard users land here first: Tab reveals it, Enter jumps past the nav */}
      <a href="#main" className="skip-link">{t(ui.skipLink)}</a>

      {/* Film grain overlay: above canvas, pointer-events none */}
      <div id="grain" aria-hidden="true" />

      {/* Neural network canvas: fixed, full-viewport, z-0 */}
      <NeuralBackground dark={dark} />

      {/* Floating astronaut cat: above canvas (z-0), behind all content (z-1) */}
      <Companion />

      <ScrollBehaviour />

      {/* Page wrapper: transparent so body bg + canvas show through */}
      <div className="min-h-screen">
        <Nav dark={dark} toggleDark={() => setDark(p => !p)} />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home dark={dark} />} />
            <Route path="/blog" element={<BlogIndex dark={dark} />} />
            <Route path="/blog/:slug" element={<BlogPost dark={dark} />} />
            <Route path="*" element={<Home dark={dark} />} />
          </Routes>
        </main>
        <Footer dark={dark} />
      </div>

      <Analytics />
    </>
  );
}
