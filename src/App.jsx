import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import NeuralBackground from './components/NeuralBackground';
import Companion from './components/Companion';
import { ui } from './i18n/ui';
import { useT } from './i18n';

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

      {/* Page wrapper: transparent so body bg + canvas show through */}
      <div className="min-h-screen">
        <Nav dark={dark} toggleDark={() => setDark(p => !p)} />
        <main id="main">
          <Hero dark={dark} />

          <About dark={dark} />

          <Timeline dark={dark} />

          <Projects dark={dark} />

          <Skills dark={dark} />

          <Contact dark={dark} />
        </main>
        <Footer dark={dark} />
      </div>

      <Analytics />
    </>
  );
}
