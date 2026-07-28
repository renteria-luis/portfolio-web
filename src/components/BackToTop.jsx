import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { ui } from '../i18n/ui';
import { useT } from '../i18n';

export default function BackToTop({ dark }) {
  const [shown, setShown] = useState(false);
  const t = useT();

  useEffect(() => {
    // Below one viewport the top of the article is still on screen, so the
    // button would be offering something the reader can already see.
    const onScroll = () => setShown(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      // No explicit behavior: this defers to scroll-behavior on <html>, which
      // the reduced-motion query already flips from smooth to auto.
      onClick={() => window.scrollTo({ top: 0 })}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={`back-to-top ${shown ? 'is-shown' : ''} font-mono text-xs flex items-center gap-1.5 px-3.5 py-2 rounded border ${
        dark
          ? 'bg-[#181f2e]/90 border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:text-terminal-green hover:border-terminal-green/40'
          : 'bg-white/90 border-[rgba(30,50,80,0.15)] text-[#57606a] hover:text-[#197934] hover:border-[rgba(26,127,55,0.4)]'
      }`}
    >
      <ArrowUp size={12} />
      {t(ui.blog.backToTop)}
    </button>
  );
}
