import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Footer from './components/Footer';
import NeuralBackground from './components/NeuralBackground';

export default function App() {
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
      {/* Film grain overlay — above canvas, pointer-events none */}
      <div id="grain" aria-hidden="true" />

      {/* Neural network canvas — fixed, full-viewport, z-0 */}
      <NeuralBackground dark={dark} />

      {/* Page wrapper — transparent so body bg + canvas show through */}
      <div className="min-h-screen">
        <Nav dark={dark} toggleDark={() => setDark(p => !p)} />
        <main>
          <Hero dark={dark} />

          {/* Section dividers — pure Tailwind, no inline styles */}
          <div className="max-w-5xl mx-auto px-6 h-px dark:bg-white/[0.05] bg-black/[0.06]" />
          <About dark={dark} />

          <div className="max-w-5xl mx-auto px-6 h-px dark:bg-white/[0.05] bg-black/[0.06]" />
          <Timeline dark={dark} />

          <Projects dark={dark} />

          <div className="max-w-5xl mx-auto px-6 h-px dark:bg-white/[0.05] bg-black/[0.06]" />
          <Skills dark={dark} />
        </main>
        <Footer dark={dark} />
      </div>
    </>
  );
}
