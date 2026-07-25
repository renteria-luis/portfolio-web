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

const Divider = () => (
  <div className="max-w-5xl mx-auto px-6 h-px bg-line/[0.06]" />
);

export default function App() {
  // Defaults to dark; the inline script in index.html applies the stored choice
  // before first paint so there is no flash.
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      {/* Keyboard users land here first — Tab reveals it, Enter jumps past the nav */}
      <a href="#main" className="skip-link">skip to content</a>

      {/* Film grain overlay — above canvas, pointer-events none */}
      <div id="grain" aria-hidden="true" />

      {/* Neural network canvases — fixed, full-viewport, z-0 */}
      <NeuralBackground dark={dark} />

      {/* Floating astronaut cat — above canvas (z-0), behind content (z-1) */}
      <Companion />

      <div className="min-h-screen">
        <Nav dark={dark} toggleDark={() => setDark((p) => !p)} />
        <main id="main">
          <Hero />
          <Divider />
          <About />
          <Divider />
          <Timeline />
          <Projects />
          <Divider />
          <Skills />
          <Divider />
          <Contact />
        </main>
        <Footer />
      </div>

      <Analytics />
    </>
  );
}
