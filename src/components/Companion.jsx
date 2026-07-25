import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { companion } from '../config/data';
import { useLang, useT } from '../i18n';

const SECTIONS = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const CAT_RATIO = 508 / 520;

/**
 * Floating astronaut cat.
 *
 * Motion model: everything below runs on one rAF loop and only ever writes
 * `transform` / `opacity`, so no frame touches layout:
 *   target = anchor + wander(t)      continuous layered sines, never a jump
 *   position -> target               critically damped spring, integrated in
 *                                    seconds so 60/120/144 Hz all look the same
 * Viewport + sprite sizes are cached and refreshed on resize instead of being
 * read inside the loop (reading them mid-frame forces a synchronous layout).
 */
export default function Companion() {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const anchorRef = useRef(null);
  const bubbleRef = useRef(null);
  const [dialogue, setDialogue] = useState(() => rand(companion.dialogues.hero));
  // starts hidden so the first greeting fades in with the cat instead of
  // popping at 0,0 before the loop has placed it
  const [showBubble, setShowBubble] = useState(false);
  const [blink, setBlink] = useState(false);
  const [side, setSide] = useState('left');
  const [hidden, setHidden] = useState(false);
  // `dialogue` holds the { en, es } bundle, not a string, so switching language
  // re-translates a bubble that is already on screen.
  const t = useT();
  const { lang } = useLang();

  const st = useRef({
    // position / velocity (px, px per second)
    x: 40, y: 260, vx: 0, vy: 0,
    baseX: 40, baseY: 260,
    renderX: 40, renderY: 260,
    // wander phases: random per session so it never repeats the same path
    p: [0, 0, 0, 0, 0].map(() => Math.random() * Math.PI * 2),
    face: 1, opacity: 0, lastOpacity: -1, phase: 'in', t: 0, teleportAt: 14,
    reduced: false, section: 'hero', lockUntil: 0, side: 'left',
    hidden: false, dragging: false, moved: false, offX: 0, offY: 0, resumeOut: false,
    // cached viewport / sprite metrics (refreshed on resize only)
    vw: 0, vh: 0, cw: 135, ch: 135 * CAT_RATIO, lastW: 0,
    bubbleW: 0, bubbleH: 0,
    lastMX: 0, lastMY: 0, lastMT: 0,
  });

  // Measure the bubble once per text change so the loop never reads layout.
  useLayoutEffect(() => {
    const el = bubbleRef.current;
    if (!el) return;
    st.current.bubbleW = el.offsetWidth;
    st.current.bubbleH = el.offsetHeight;
  }, [dialogue, lang]);

  useEffect(() => {
    const s = st.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function measure() {
      s.vw = window.innerWidth;
      s.vh = window.innerHeight;
      s.cw = s.vw < 900 ? 62 : 135;
      s.ch = s.cw * CAT_RATIO;
    }

    function placeAnchor() {
      const { vw, vh, cw, ch } = s;
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
      s.p = s.p.map(() => Math.random() * Math.PI * 2);
      s.face = (s.baseX + cw / 2 < vw / 2) ? -1 : 1;
      s.side = chosen; setSide(chosen);
    }

    measure();
    s.lastW = s.vw;
    placeAnchor();
    s.x = s.baseX; s.y = s.baseY; s.vx = 0; s.vy = 0;

    // ── drag: started from a window-level hit-test so it still works when the
    //    cat is painted behind the cards on desktop ──────────────────────────
    const onDragMove = (e) => {
      const now = performance.now();
      const dt = Math.max(8, now - s.lastMT);
      s.vx = clamp((e.clientX - s.lastMX) / dt * 1000, -2400, 2400);
      s.vy = clamp((e.clientY - s.lastMY) / dt * 1000, -2400, 2400);
      s.lastMX = e.clientX; s.lastMY = e.clientY; s.lastMT = now;
      const nx = e.clientX - s.offX, ny = e.clientY - s.offY;
      if (Math.hypot(nx - s.x, ny - s.y) > 3) s.moved = true;
      s.x = nx; s.y = ny;
    };
    const onDragUp = () => {
      s.dragging = false;
      window.removeEventListener('pointermove', onDragMove);
      window.removeEventListener('pointerup', onDragUp);
      if (!s.moved) { s.hidden = true; s.resumeOut = false; setHidden(true); }  // tap -> minimize
      else s.phase = 'inertia';                                                 // fling -> glide
    };
    const startDrag = (e) => {
      if (s.hidden || s.dragging) return;
      // Grabbing it mid-teleport pauses the fade; releasing resumes it. Without
      // this the cat used to freeze at whatever opacity it had been caught at.
      s.resumeOut = s.phase === 'out';
      s.dragging = true; s.moved = false; s.phase = 'drag';
      s.x = s.renderX; s.y = s.renderY;   // bake in the current wander offset
      s.vx = 0; s.vy = 0;
      s.offX = e.clientX - s.x; s.offY = e.clientY - s.y;
      s.lastMX = e.clientX; s.lastMY = e.clientY; s.lastMT = performance.now();
      e.preventDefault();
      window.addEventListener('pointermove', onDragMove);
      window.addEventListener('pointerup', onDragUp);
    };
    const INTERACTIVE = 'a,button,input,textarea,select,summary,[role="button"]';
    const onWinDown = (e) => {
      if (s.hidden || s.dragging) return;
      if (e.clientX < s.renderX || e.clientX > s.renderX + s.cw ||
          e.clientY < s.renderY || e.clientY > s.renderY + s.ch) return;
      // On desktop the cat is painted *behind* the content, so a hit inside its
      // box may really be a click on a card link it happens to be drifting
      // under. Interactive targets always win.
      if (e.target?.closest?.(INTERACTIVE)) return;
      e.stopPropagation();
      startDrag(e);
    };
    window.addEventListener('pointerdown', onWinDown, true);

    // ── loop ───────────────────────────────────────────────────────────────
    let raf = 0, last = performance.now(), lastFace = 0;

    function loop(now) {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);   // clamp tab-switch spikes
      last = now;
      if (s.hidden) return;
      s.t += dt;

      const { cw, ch, vw, vh } = s;

      if (s.reduced) {
        s.x = 12; s.y = vh - ch - 16; s.opacity = 1;
      } else if (s.phase === 'drag') {
        // position driven by the pointer handlers; fade held, eased back to full
        s.opacity = Math.min(1, s.opacity + dt / 0.25);
      } else if (s.phase === 'inertia') {
        s.opacity = Math.min(1, s.opacity + dt / 0.25);
        s.x += s.vx * dt; s.y += s.vy * dt;
        const decay = Math.pow(0.12, dt);               // per-second, dt-correct
        s.vx *= decay; s.vy *= decay;
        if (s.x < 0) { s.x = 0; s.vx = 0; }
        if (s.x > vw - cw) { s.x = vw - cw; s.vx = 0; }
        if (s.y < 40) { s.y = 40; s.vy = 0; }
        if (s.y > vh - ch) { s.y = vh - ch; s.vy = 0; }
        if (Math.hypot(s.vx, s.vy) < 24) {
          s.baseX = s.x; s.baseY = s.y;
          const chosen = (s.x + cw / 2) < vw / 2 ? 'left' : 'right';
          s.side = chosen; setSide(chosen); s.face = chosen === 'left' ? -1 : 1;
          if (s.resumeOut) {                 // it was fading out when grabbed
            s.resumeOut = false; s.phase = 'out';
          } else {
            s.phase = 'idle'; s.teleportAt = s.t + 12 + Math.random() * 6;
          }
        }
      } else {
        if (s.phase === 'out') {
          s.opacity -= dt / 1.4;
          if (s.opacity <= 0) {
            s.opacity = 0; placeAnchor();
            s.x = s.baseX; s.y = s.baseY; s.vx = 0; s.vy = 0; s.phase = 'in';
          }
        } else if (s.phase === 'in') {
          s.opacity += dt / 1.4;
          if (s.opacity >= 1) { s.opacity = 1; s.phase = 'idle'; s.teleportAt = s.t + 12 + Math.random() * 6; }
        } else if (s.t > s.teleportAt) {
          s.phase = 'out';
        }

        // Continuous zero-G wander: layered sines at incommensurable rates, so
        // the path never repeats and never stops. No random jumps -> no stalls.
        const [p0, p1, p2, p3, p4] = s.p;
        const ax = cw * 0.30, ay = cw * 0.42;
        const wx = Math.sin(s.t * 0.23 + p0) * ax + Math.sin(s.t * 0.41 + p1) * ax * 0.38;
        const wy = Math.sin(s.t * 0.19 + p2) * ay + Math.sin(s.t * 0.33 + p3) * ay * 0.42
                 + Math.sin(s.t * 0.85 + p4) * 5;

        const tx = clamp(s.baseX + wx, 2, vw - cw - 2);
        const ty = clamp(s.baseY + wy, 56, vh - ch - 8);

        // Critically damped spring: smooth catch-up, no overshoot, dt-correct.
        const k = 5.5, d = 2 * Math.sqrt(k);
        s.vx += ((tx - s.x) * k - s.vx * d) * dt;
        s.vy += ((ty - s.y) * k - s.vy * d) * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
      }

      // Lazy tumble: computed unconditionally so grabbing the cat doesn't
      // snap it upright mid-drag.
      const rot = s.reduced ? 0 : Math.sin(s.t * 0.27 + s.p[0]) * 3.2;
      s.renderX = s.x; s.renderY = s.y;

      const wrap = wrapRef.current;
      if (wrap) {
        if (s.opacity !== s.lastOpacity) {
          wrap.style.opacity = s.opacity;
          // The bubble belongs to the cat: when it fades out to teleport, the
          // speech bubble fades with it instead of hanging in mid-air.
          if (anchorRef.current) anchorRef.current.style.opacity = s.opacity;
          s.lastOpacity = s.opacity;
        }
        wrap.style.transform = `translate3d(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg)`;
      }
      // Only written when it actually flips: the drop-shadow on this node would
      // otherwise be re-rasterized every frame.
      if (s.face !== lastFace && innerRef.current) {
        innerRef.current.style.transform = `scaleX(${s.face})`;
        lastFace = s.face;
      }
      if (anchorRef.current) {
        const bx = clamp(
          s.side === 'left' ? s.x : s.x + cw - s.bubbleW,
          8, Math.max(8, vw - s.bubbleW - 8),
        );
        const by = Math.max(64, s.y - s.bubbleH - 10);
        anchorRef.current.style.transform = `translate3d(${bx.toFixed(2)}px,${by.toFixed(2)}px,0)`;
      }
    }
    raf = requestAnimationFrame(loop);

    // Stop burning frames in a background tab, and don't let the clock jump on return.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => {
      const w = window.innerWidth;
      measure();
      if (Math.abs(w - s.lastW) < 64) return;   // ignore mobile URL-bar height changes
      s.lastW = w;
      placeAnchor(); s.x = s.baseX; s.y = s.baseY; s.vx = 0; s.vy = 0;
    };
    window.addEventListener('resize', onResize);

    // let the cat fade in first, then greet
    const introTimer = setTimeout(() => setShowBubble(true), 900);

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
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointerdown', onWinDown, true);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('companionSay', onSay);
      window.removeEventListener('pointermove', onDragMove);
      window.removeEventListener('pointerup', onDragUp);
      clearTimeout(blinkTimer); clearTimeout(introTimer);
      clearInterval(chatter); io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!showBubble) return;
    const t = setTimeout(() => setShowBubble(false), 4500);
    return () => clearTimeout(t);
  }, [dialogue, showBubble]);

  const restore = () => {
    const s = st.current;
    s.hidden = false; setHidden(false);
    s.opacity = 0; s.lastOpacity = -1; s.phase = 'in'; s.resumeOut = false;
  };

  return (
    <>
      <div className={`companion-layer ${hidden ? 'gone' : ''}`}>
        <div ref={wrapRef} className="companion-cat" style={{ opacity: 0 }}>
          <div ref={innerRef} className="companion-inner">
            <img src={companion.frames.open} alt="" width="520" height="508"
                 className="companion-img base" draggable="false" decoding="async" />
            <img src={companion.frames.closed} alt="" width="520" height="508"
                 className={`companion-img blinkimg ${blink ? 'on' : ''}`} draggable="false" decoding="async" />
          </div>
        </div>
      </div>

      {/* anchor is moved by transform only; the child owns the show/hide transition */}
      <div ref={anchorRef} className="companion-bubble-anchor" aria-hidden="true"
           style={{ transform: 'translate3d(-9999px,0,0)', opacity: 0 }}>
        <div ref={bubbleRef} className={`companion-bubble ${side} ${showBubble && !hidden ? 'show' : ''}`}>
          {t(dialogue)}
        </div>
      </div>

      {hidden && (
        <button className="companion-head" onClick={restore} aria-label="Bring back the astronaut cat" title="Bring the cat back">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
