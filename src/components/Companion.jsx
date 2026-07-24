import { useEffect, useRef, useState } from 'react';
import { companion } from '../config/data';

const SECTIONS = ['hero', 'about', 'experience', 'projects', 'skills'];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Companion() {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const [dialogue, setDialogue] = useState(() => rand(companion.dialogues.hero));
  const [showBubble, setShowBubble] = useState(true);
  const [blink, setBlink] = useState(false);
  const [side, setSide] = useState('left');

  const st = useRef({
    x: 40, y: 240, baseX: 40, baseY: 240, driftX: 0, driftY: 0,
    face: 1, opacity: 0, phase: 'in', t: 0, teleportAt: 14, driftAt: 4,
    mouseX: -9999, mouseY: -9999, reduced: false, section: 'hero', lockUntil: 0,
  });

  useEffect(() => {
    const s = st.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const catW = () => (window.innerWidth < 900 ? 62 : 120);
    const catH = () => catW() * (508 / 520);

    // Pick a new resting spot in a side gutter + facing (used on each teleport).
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
      // kept low enough that the speech bubble clears the nav that slides in on scroll
      s.baseY = 150 + Math.random() * Math.max(40, vh - 250 - ch);
      s.driftX = 0; s.driftY = 0;
      // left half of the screen -> face right (scaleX -1); right half -> face left (scaleX 1)
      s.face = (s.baseX + cw / 2 < vw / 2) ? -1 : 1;
      setSide(chosen);
    }
    placeAnchor(); s.x = s.baseX; s.y = s.baseY;

    let raf, last = performance.now();
    function loop(now) {
      const dt = Math.min(40, now - last); last = now; s.t += dt / 1000;
      const cw = catW(), ch = catH();

      if (s.reduced) {
        const vh = window.innerHeight;
        s.x = 12; s.y = vh - ch - 16;
        if (wrapRef.current) { wrapRef.current.style.opacity = 1; wrapRef.current.style.transform = `translate3d(${s.x}px,${s.y}px,0)`; }
        raf = requestAnimationFrame(loop); return;
      }

      if (s.phase === 'idle') {
        // gentle idle: sometimes a slow subtle local drift, mostly near-still
        if (s.t > s.driftAt) {
          s.driftAt = s.t + 6 + Math.random() * 5;
          if (Math.random() < 0.3) {
            s.driftX = (Math.random() - 0.5) * 40;
            s.driftY = (Math.random() - 0.5) * 90;
          } else { s.driftX *= 0.2; s.driftY *= 0.2; }
        }
        // flee the cursor -> teleport away
        const cx = s.x + cw / 2, cy = s.y + ch / 2;
        if (Math.hypot(cx - s.mouseX, cy - s.mouseY) < 110) s.phase = 'out';
        // scheduled teleport (infrequent)
        if (s.t > s.teleportAt) s.phase = 'out';
        // very slow ease toward the (drifted) anchor
        s.x += (s.baseX + s.driftX - s.x) * 0.015;
        s.y += (s.baseY + s.driftY - s.y) * 0.015;
      } else if (s.phase === 'out') {
        s.opacity -= dt / 1400;           // fade out ~1.4s
        if (s.opacity <= 0) {
          s.opacity = 0;
          placeAnchor(); s.x = s.baseX; s.y = s.baseY;   // reappear elsewhere, already flipped
          if (innerRef.current) innerRef.current.style.transform = `scaleX(${s.face})`;
          s.phase = 'in';
        }
      } else if (s.phase === 'in') {
        s.opacity += dt / 1400;           // fade back in ~1.4s
        if (s.opacity >= 1) { s.opacity = 1; s.phase = 'idle'; s.teleportAt = s.t + 12 + Math.random() * 6; }
      }

      const bob = Math.sin(s.t * 1.0) * 6;
      if (wrapRef.current) {
        wrapRef.current.style.opacity = s.opacity;
        wrapRef.current.style.transform = `translate3d(${s.x}px,${s.y + bob}px,0)`;
      }
      if (innerRef.current) innerRef.current.style.transform = `scaleX(${s.face})`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    const onMove = (e) => { s.mouseX = e.clientX; s.mouseY = e.clientY; };
    const onResize = () => { placeAnchor(); s.x = s.baseX; s.y = s.baseY; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);

    // blink (occasional double blink)
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

    // active section -> a random line from that section
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && companion.dialogues[en.target.id]) {
          s.section = en.target.id;
          s.lockUntil = performance.now() + 600;
          say(rand(companion.dialogues[en.target.id]));
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

    // occasional chatter: another random line from the current section
    const chatter = setInterval(() => {
      if (performance.now() < s.lockUntil) return;
      const lines = companion.dialogues[s.section];
      if (lines) say(rand(lines));
    }, 13000);

    // hovering a project card -> the cat says something about that project
    const onSay = (e) => { s.lockUntil = performance.now() + 3000; say(e.detail); };
    window.addEventListener('companionSay', onSay);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('companionSay', onSay);
      clearTimeout(blinkTimer); clearInterval(chatter); io.disconnect();
    };
  }, []);

  // auto-hide the bubble a few seconds after it (re)appears
  useEffect(() => {
    if (!showBubble) return;
    const t = setTimeout(() => setShowBubble(false), 4500);
    return () => clearTimeout(t);
  }, [dialogue, showBubble]);

  return (
    <div aria-hidden="true" className="companion-layer">
      <div ref={wrapRef} className="companion-cat" style={{ opacity: 0 }}>
        <div className={`companion-bubble ${side} ${showBubble ? 'show' : ''}`}>{dialogue}</div>
        <div ref={innerRef} className="companion-inner">
          <img src={companion.frames.open} alt="" className="companion-img base" draggable="false" />
          <img src={companion.frames.closed} alt="" className={`companion-img blinkimg ${blink ? 'on' : ''}`} draggable="false" />
        </div>
      </div>
    </div>
  );
}
