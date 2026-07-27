import Hero from '../components/Hero';
import About from '../components/About';
import Timeline from '../components/Timeline';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import { useDocumentMeta, SITE_TITLE, SITE_DESCRIPTION } from '../hooks/useDocumentMeta';

export default function Home({ dark }) {
  // Without this, arriving here from /blog leaves the article's title in the
  // tab: nothing else was resetting the head on client-side navigation.
  useDocumentMeta({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: '/',
    type: 'profile',
  });

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
