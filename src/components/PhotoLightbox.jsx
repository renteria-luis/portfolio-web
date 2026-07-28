import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ui } from '../i18n/ui';
import { useT } from '../i18n';

/**
 * Full-size photo, in the same terminal chrome as the rest of the site.
 *
 * The headshot is a 44px avatar in the hero so it stops competing with the
 * terminal for attention. This is where it goes for anyone who actually wants
 * to look at it.
 *
 * Keyboard contract: Escape closes, focus moves to the close button on open and
 * returns to the trigger on close, and Tab is trapped inside the dialog so it
 * cannot wander into the page behind it.
 */
export default function PhotoLightbox({ open, onClose, src, alt, dark }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocusTo = useRef(null);
  const t = useT();

  useEffect(() => {
    if (!open) return;

    returnFocusTo.current = document.activeElement;
    closeRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll('button, [href]');
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      returnFocusTo.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const border = dark ? 'border-[rgba(125,167,217,0.12)]' : 'border-[rgba(30,50,80,0.12)]';
  const cardBg = dark ? 'bg-[#181f2e]' : 'bg-white';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#576c80]';

  return (
    <div className="photo-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={alt}>
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className={`photo-lightbox-card rounded-lg border ${border} ${cardBg} overflow-hidden`}
      >
        <div className="terminal-header">
          <div className="terminal-dot" style={{ background: '#f78166' }} />
          <div className="terminal-dot" style={{ background: '#e3b341' }} />
          <div className="terminal-dot" style={{ background: '#3fb950' }} />
          <span className={`ml-2 font-mono text-xs truncate ${textSecondary}`}>
            luis@ml-portfolio:~/photo.webp
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t(ui.hero.photoClose)}
            className={`ml-auto shrink-0 p-1 rounded transition-colors ${textMuted} ${
              dark ? 'hover:text-[#ecf0f8]' : 'hover:text-[#1c2128]'
            }`}
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4">
          <img src={src} alt={alt} width="512" height="512" className="w-full h-auto rounded" />
          <p className={`mt-3 font-mono text-[10px] text-center ${textMuted}`}>
            {t(ui.hero.photoHint)}
          </p>
        </div>
      </div>
    </div>
  );
}
