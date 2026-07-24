import { useEffect, useRef, useState } from 'react';
import { companion } from '../config/data';

// Section ids the cat comments on (matches the ids already in the section components)
const SECTIONS = ['hero', 'about', 'experience', 'projects', 'skills'];

export default function Companion() {
  const wrapRef = useRef(null);   // absolutely-positioned wrapper (gets translate)
  const innerRef = useRef(null);  // gets rotate + scaleX (facing) with a smooth transition
  const [dialogue, setDialogue] = useState(companion.dialogues.hero);
  const [showBubble, setShowBubble] = useState(true);
  const [blink, setBlink] = useState(false);
  const [side, setSide] = useState('left'); // which gutter the cat is in (bubble anchors away from the edge)

  const st = useRef({
    x: 40, y: 220, tx: 40, ty: 220, face: 1, rot: 0,
    mouseX: -9999, mouseY: -9999, t: 0, lastTarget: 0, reduced: false,
  });

  useEffect(() => {
    const s = st.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const catW = () => (window.innerWidth < 900 ? 78 : 150);
    const catH = () => catW() * (508 / 520);

    function pickTarget() {
      const vw = window.innerWidth, vh = window.innerHeight;
      const cw = catW(), ch = catH();
      const gutter = (vw - 1024) / 2;
      const mobile = gutter < 90;
      const chosen = Math.random() < 0.5 ? 'left' : 'right';
      if (mobile) {
        s.tx = chosen === 'left' ? 4 : vw - cw - 4;
      } else {
        const g = Math.max(gutter, cw + 24);
        s.tx = chosen === 'left'
          ? 6 + Math.random() * Math.max(4, g - cw - 12)
          : vw - g + 6 + Math.random() * Math.max(4, g - cw - 12);
      }
      s.ty = 90 + Math.random() * Math.max(40, vh - 200 - ch);
      setSide(chosen);
    }
    pickTarget();

    let raf, last = performance.now();
    function loop(now) {
      const dt = Math.min(40, now - last); last = now; s.t += dt / 1000;
      const vw = window.innerWidth, vh = window.innerHeight;
      const cw = catW(), ch = catH();

      if (s.reduced) {
        s.x = 12; s.y = vh - ch - 16;
        if (wrapRef.current) wrapRef.current.style.transform = `translate3d(${s.x}px,${s.y}px,0)`;
        raf = requestAnimationFrame(loop); return;
      }

      if (s.t - s.lastTarget > 5 + Math.random() * 3) { s.lastTarget = s.t; pickTarget(); }

      // flee from the cursor (purely visual — the layer is pointer-events:none)
      const cx = s.x + cw / 2, cy = s.y + ch / 2;
      const dx = cx - s.mouseX, dy = cy - s.mouseY, dist = Math.hypot(dx, dy);
      if (dist < 155) {
        const push = (155 - dist) * 1.4;
        s.tx = Math.max(0, Math.min(vw - cw, s.tx + (dx / (dist || 1)) * push));
        s.ty = Math.max(40, Math.min(vh - ch, s.ty + (dy / (dist || 1)) * push));
      }

      s.x += (s.tx - s.x) * 0.045;
      s.y += (s.ty - s.y) * 0.045;

      const bob = Math.sin(s.t * 1.1) * 8;
      const sway = Math.cos(s.t * 0.7) * 4;
      const wantFace = s.mouseX > cx ? -1 : 1;      // art faces left by default (scaleX 1)
      s.face += (wantFace - s.face) * 0.08;
      s.rot = Math.sin(s.t * 0.9) * 5 + (s.tx - s.x) * 0.02;

      if (wrapRef.current) wrapRef.current.style.transform = `translate3d(${s.x + sway}px,${s.y + bob}px,0)`;
      if (innerRef.current) innerRef.current.style.transform = `rotate(${s.rot}deg) scaleX(${s.face})`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    const onMove = (e) => { s.mouseX = e.clientX; s.mouseY = e.clientY; };
    const onResize = () => pickTarget();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);

    // blink (occasional double-blink for life)
    let blinkTimer;
    const scheduleBlink = () => {
      blinkTimer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        if (Math.random() < 0.25) {
          setTimeout(() => setBlink(true), 250);
          setTimeout(() => setBlink(false), 380);
        }
        scheduleBlink();
      }, 3500 + Math.random() * 3500);
    };
    scheduleBlink();

    // section-aware dialogue — the "active" section is whichever crosses the viewport middle
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && companion.dialogues[en.target.id]) {
          setDialogue(companion.dialogues[en.target.id]);
          setShowBubble(true);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      clearTimeout(blinkTimer);
      io.disconnect();
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
      <div ref={wrapRef} className="companion-cat">
        <div className={`companion-bubble ${side} ${showBubble ? 'show' : ''}`}>{dialogue}</div>
        <div ref={innerRef} className="companion-inner">
          <img src={companion.frames.open} alt="" className="companion-img base" draggable="false" />
          <img src={companion.frames.closed} alt="" className={`companion-img blinkimg ${blink ? 'on' : ''}`} draggable="false" />
        </div>
      </div>
    </div>
  );
}
