import Hero from '../components/Hero';
import About from '../components/About';
import Timeline from '../components/Timeline';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';

export default function Home({ dark }) {
  return (
    <>
      <Hero dark={dark} />
      <About dark={dark} />
      <Timeline dark={dark} />
      <Projects dark={dark} />
      <Skills dark={dark} />
      <Contact dark={dark} />
    </>
  );
}
