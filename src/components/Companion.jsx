import { useEffect, useRef, useState } from 'react';
import { companion } from '../config/data';

const SECTIONS = ['hero', 'about', 'experience', 'projects', 'skills'];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const catW = () => (window.innerWidth < 900 ? 62 : 135);
const catH = () => catW() * (508 / 520);

export default function Companion() {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const bubbleRef = useRef(null);
  const [dialogue, setDialogue] = useState(() => rand(companion.dialogues.hero));
  const [showBubble, setShowBubble] = useState(true);
  const [blink, setBlink] = useState(false);
  const [side, setSide] = useState('left');
  const [hidden, setHidden] = useState(false);

  const st = useRef({
    x: 40, y: 260, baseX: 40, baseY: 260, driftX: 0, driftY: 0,
    face: 1, opacity: 0, phase: 'in', t: 0, teleportAt: 14, driftAt: 4,
    reduced: false, section: 'hero', lockUntil: 0, side: 'left',
    hidden: false, dragging: false, moved: false, offX: 0, offY: 0, lastW: 0,
  });

  // ---- drag / tap-to-hide (defined in component scope; use the shared ref) ----
  const onDragMove = (e) => {
    const s = st.current;
    const nx = e.clientX - s.offX, ny = e.clientY - s.offY;
    if (Math.hypot(nx - s.x, ny - s.y) > 3) s.moved = true;
    s.x = nx; s.y = ny; s.baseX = nx; s.baseY = ny;
  };
  const onDragUp = () => {
    const s = st.current;
    s.dragging = false;
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragUp);
    if (!s.moved) {                    // a tap/click, not a drag -> minimize to the head
      s.hidden = true; setHidden(true);
    } else {                           // dropped somewhere -> rest there
      const cw = catW();
      const chosen = (s.x + cw / 2) < window.innerWidth / 2 ? 'left' : 'right';
      s.side = chosen; setSide(chosen);
      s.face = chosen === 'left' ? -1 : 1;
      s.phase = 'idle'; s.teleportAt = s.t + 14 + Math.random() * 6;
    }
  };
  const onDown = (e) => {
    const s = st.current;
    if (s.hidden) return;
    s.dragging = true; s.moved = false; s.phase = 'drag';
    s.offX = e.clientX - s.x; s.offY = e.clientY - s.y;
    try { wrapRef.current.setPointerCapture(e.pointerId); } catch (_) {}
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragUp);
  };
  const restore = () => {
    const s = st.current;
    s.hidden = false; setHidden(false);
    s.opacity = 0; s.phase = 'in';
  };

  useEffect(() => {
    const s = st.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.lastW = window.innerWidth;

    function placeAnchor() {
      const vw = window.innerWidth, vh = window.innerHeight;
      const cw = catW(), ch = catH();
      const gutter = (vw - 1024) / 2;
      const mobile = gutter < 80;
      const chosen = Math.random() < 0.5 ? 'left' : 'right';
      if (mobile) {
        s.baseX = chosen === 'left' ? 4 : vw - cw - 4;
      } else {
        const g = Math.max(gutter, cw + 20);
        s.baseX = chosen === 'left'
          ? 6 + Math.random() * Math.max(4, g - cw - 12)
          : vw - g + 6 + Math.random() * Math.max(4, g - cw - 12);
      }
      s.baseY = 150 + Math.random() * Math.max(40, vh - 260 - ch);
      s.driftX = 0; s.driftY = 0;
      s.face = (s.baseX + cw / 2 < vw / 2) ? -1 : 1;
      s.side = chosen; setSide(chosen);
    }
    placeAnchor(); s.x = s.baseX; s.y = s.baseY;

    let raf, last = performance.now();
    function loop(now) {
      const dt = Math.min(40, now - last); last = now; s.t += dt / 1000;
      const cw = catW(), ch = catH();
      const vw = window.innerWidth, vh = window.innerHeight;

      if (s.hidden) { raf = requestAnimationFrame(loop); return; }

      if (s.reduced) {
        s.x = 12; s.y = vh - ch - 16; s.opacity = 1;
      } else if (s.phase === 'drag') {
        // position is set directly by the pointer handlers
      } else if (s.phase === 'idle') {
        if (s.t > s.driftAt) {
          s.driftAt = s.t + 6 + Math.random() * 5;
          if (Math.random() < 0.3) { s.driftX = (Math.random() - 0.5) * 40; s.driftY = (Math.random() - 0.5) * 90; }
          else { s.driftX *= 0.2; s.driftY *= 0.2; }
        }
        if (s.t > s.teleportAt) s.phase = 'out';
        s.x += (s.baseX + s.driftX - s.x) * 0.015;
        s.y += (s.baseY + s.driftY - s.y) * 0.015;
      } else if (s.phase === 'out') {
        s.opacity -= dt / 1400;
        if (s.opacity <= 0) { s.opacity = 0; placeAnchor(); s.x = s.baseX; s.y = s.baseY; s.phase = 'in'; }
      } else if (s.phase === 'in') {
        s.opacity += dt / 1400;
        if (s.opacity >= 1) { s.opacity = 1; s.phase = 'idle'; s.teleportAt = s.t + 12 + Math.random() * 6; }
      }

      const bob = (s.reduced || s.phase === 'drag') ? 0 : Math.sin(s.t * 1.0) * 6;
      const topY = s.y + bob;
      if (wrapRef.current) {
        wrapRef.current.style.opacity = s.phase === 'drag' ? 1 : s.opacity;
        wrapRef.current.style.transform = `translate3d(${s.x}px,${topY}px,0)`;
      }
      if (innerRef.current) innerRef.current.style.transform = `scaleX(${s.face})`;
      if (bubbleRef.current) {
        const b = bubbleRef.current;
        b.style.bottom = (vh - topY + 8) + 'px';
        if (s.side === 'left') { b.style.left = s.x + 'px'; b.style.right = 'auto'; }
        else { b.style.right = (vw - (s.x + cw)) + 'px'; b.style.left = 'auto'; }
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    // only re-anchor on a real WIDTH change (mobile scroll fires resize on height — ignore it)
    const onResize = () => {
      if (Math.abs(window.innerWidth - s.lastW) < 64) return;
      s.lastW = window.innerWidth;
      placeAnchor(); s.x = s.baseX; s.y = s.baseY;
    };
    window.addEventListener('resize', onResize);

    let blinkTimer;
    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        setBlink(true); setTimeout(() => setBlink(false), 130);
        if (Math.random() < 0.25) { setTimeout(() => setBlink(true), 250); setTimeout(() => setBlink(false), 380); }
        scheduleBlink();
      }, 3500 + Math.random() * 3500);
    };
    scheduleBlink();

    const say = (text) => { if (text) { setDialogue(text); setShowBubble(true); } };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && companion.dialogues[en.target.id]) {
          s.section = en.target.id; s.lockUntil = performance.now() + 600;
          say(rand(companion.dialogues[en.target.id]));
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

    const chatter = setInterval(() => {
      if (performance.now() < s.lockUntil) return;
      const lines = companion.dialogues[s.section];
      if (lines) say(rand(lines));
    }, 13000);

    const onSay = (e) => { s.lockUntil = performance.now() + 3000; say(e.detail); };
    window.addEventListener('companionSay', onSay);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('companionSay', onSay);
      window.removeEventListener('pointermove', onDragMove);
      window.removeEventListener('pointerup', onDragUp);
      clearTimeout(blinkTimer); clearInterval(chatter); io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!showBubble) return;
    const t = setTimeout(() => setShowBubble(false), 4500);
    return () => clearTimeout(t);
  }, [dialogue, showBubble]);

  return (
    <>
      {/* Cat layer — behind cards on desktop (z-0), above content on mobile (z-60) */}
      <div className={`companion-layer ${hidden ? 'gone' : ''}`}>
        <div ref={wrapRef} className="companion-cat" style={{ opacity: 0 }} onPointerDown={onDown}>
          <div ref={innerRef} className="companion-inner">
            <img src={companion.frames.open} alt="" className="companion-img base" draggable="false" />
            <img src={companion.frames.closed} alt="" className={`companion-img blinkimg ${blink ? 'on' : ''}`} draggable="false" />
          </div>
        </div>
      </div>

      {/* Bubble — always above everything, follows the cat */}
      <div ref={bubbleRef} aria-hidden="true"
           className={`companion-bubble ${side} ${showBubble && !hidden ? 'show' : ''}`}>
        {dialogue}
      </div>

      {/* Minimized kitten head — click to bring the astronaut back */}
      {hidden && (
        <button className="companion-head" onClick={restore} aria-label="Bring back the astronaut cat" title="Bring the cat back">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="25" r="17" />
            <path d="M13 12 L18 21 L9 20 Z" fill="currentColor" stroke="none" />
            <path d="M35 12 L30 21 L39 20 Z" fill="currentColor" stroke="none" />
            <circle cx="18.5" cy="25" r="1.8" fill="currentColor" stroke="none" />
            <circle cx="29.5" cy="25" r="1.8" fill="currentColor" stroke="none" />
            <path d="M22.5 28.5 h3" />
            <path d="M24 28.5 q-3 3 -6 1.4 M24 28.5 q3 3 6 1.4" />
            <path d="M9 26 h6 M9 30 h5 M39 26 h-6 M39 30 h-5" opacity="0.55" />
          </svg>
        </button>
      )}
    </>
  );
}
