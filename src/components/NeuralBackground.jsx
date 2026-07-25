import { useEffect, useRef } from 'react';

/**
 * NeuralBackground — animated neural-network / data-flow graph.
 *
 * Split across two stacked canvases so the per-frame cost is near zero:
 *   #neural-canvas  static graph (nodes + edges). Painted once per resize and
 *                   then never touched again — the graph doesn't move.
 *   #neural-pulses  only the travelling pulses. Each pulse is a pre-rendered
 *                   sprite blitted with globalAlpha, and only the rectangles
 *                   touched last frame get cleared.
 *
 * That replaces ~150 path ops + 10 createRadialGradient() calls per frame with
 * ~10 small clearRects and ~10 drawImage blits, which leaves the main thread
 * free for the companion's animation.
 */
const SPRITE = 64;                      // px; sprite radius maps to pulse.r * 4
const dprOf = () => Math.min(window.devicePixelRatio || 1, 2);

export default function NeuralBackground({ dark }) {
  const staticRef = useRef(null);
  const pulseRef  = useRef(null);

  useEffect(() => {
    const bgCanvas = staticRef.current;
    const fgCanvas = pulseRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bg = bgCanvas.getContext('2d');
    const fg = fgCanvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const palette = dark
      ? { node: 'rgba(63,185,80,', edge: 'rgba(63,185,80,', pulse: 'rgba(63,185,80,',
          nodeBright: 'rgba(121,192,255,', edgeOpMax: 0.09, nodeOpMax: 0.18, pulseOpMax: 0.55 }
      : { node: 'rgba(9,105,218,', edge: 'rgba(9,105,218,', pulse: 'rgba(9,105,218,',
          nodeBright: 'rgba(26,127,55,', edgeOpMax: 0.07, nodeOpMax: 0.14, pulseOpMax: 0.4 };

    const rand  = (a, b) => a + Math.random() * (b - a);
    const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

    // ── Pre-rendered pulse sprite (built once, reused every frame) ──────────
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = SPRITE;
    {
      const g = sprite.getContext('2d');
      const c = SPRITE / 2;
      const grad = g.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0,   palette.pulse + '1)');
      grad.addColorStop(0.4, palette.pulse + '0.5)');
      grad.addColorStop(1,   palette.pulse + '0)');
      g.fillStyle = grad;
      g.beginPath(); g.arc(c, c, c, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(c, c, SPRITE * 0.0875, 0, Math.PI * 2);   // crisp core
      g.fillStyle = palette.pulse + '1)'; g.fill();
    }

    function buildGraph(W, H) {
      const NODE_COUNT   = Math.min(52, Math.floor((W * H) / 18000));
      const CONNECT_DIST = Math.min(W, H) * 0.26;
      const MAX_EDGES    = 3;

      const cols  = Math.ceil(Math.sqrt(NODE_COUNT * (W / H)));
      const rows  = Math.ceil(NODE_COUNT / cols);
      const nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (nodes.length >= NODE_COUNT) break;
          nodes.push({
            x: (c + 0.5 + rand(-0.38, 0.38)) * (W / cols),
            y: (r + 0.5 + rand(-0.38, 0.38)) * (H / rows),
            r: rand(1.2, 2.8),
            op: rand(0.4, 1.0),
            bright: Math.random() < 0.12,
          });
        }
      }

      const edges = [];
      const edgeSet = new Set();
      for (let i = 0; i < nodes.length; i++) {
        const near = nodes
          .map((n, j) => ({ j, d: dist2(nodes[i], n) }))
          .filter(({ j, d }) => j !== i && d < CONNECT_DIST ** 2)
          .sort((a, b) => a.d - b.d)
          .slice(0, MAX_EDGES);
        for (const { j } of near) {
          const key = [Math.min(i, j), Math.max(i, j)].join('-');
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push({ a: nodes[i], b: nodes[j], op: rand(0.4, 1.0) });
          }
        }
      }
      return { nodes, edges };
    }

    function spawnPulse(edges) {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const rev  = Math.random() < 0.5;
      return {
        edge, t: rev ? 1 : 0, speed: rand(0.0008, 0.0022), dir: rev ? -1 : 1,
        opacity: 0, phase: 'in', maxOp: rand(0.55, 1.0), r: rand(1.8, 3.2),
      };
    }

    /** Paint the static graph once. */
    function paintGraph(nodes, edges) {
      bg.setTransform(1, 0, 0, 1, 0, 0);
      bg.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      const dpr = dprOf();
      bg.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg.lineWidth = 0.7;
      for (const e of edges) {
        bg.strokeStyle = palette.edge + (e.op * palette.edgeOpMax) + ')';
        bg.beginPath();
        bg.moveTo(e.a.x, e.a.y);
        bg.lineTo(e.b.x, e.b.y);
        bg.stroke();
      }
      for (const n of nodes) {
        bg.beginPath();
        bg.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        bg.fillStyle = (n.bright ? palette.nodeBright : palette.node) + (n.op * palette.nodeOpMax) + ')';
        bg.fill();
      }
    }

    let state = null;
    let raf = 0;
    let dirty = [];                       // rects painted last frame

    function init() {
      const W = window.innerWidth, H = window.innerHeight, dpr = dprOf();
      for (const c of [bgCanvas, fgCanvas]) {
        c.width  = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      const { nodes, edges } = buildGraph(W, H);
      paintGraph(nodes, edges);

      fg.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = [];

      const pulses = edges.length
        ? Array.from({ length: 8 }, () => {
            const p = spawnPulse(edges);
            p.t = rand(0, 1); p.opacity = rand(0.1, 0.4); p.phase = 'travel';
            return p;
          })
        : [];
      state = { edges, pulses, W, H };
    }

    // Rates are expressed per second so 60/120/144 Hz displays all match.
    const FADE_PER_SEC  = 0.018 * 60;
    const SPEED_PER_SEC = 60;
    let last = performance.now();

    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { edges, pulses } = state;

      for (let i = 0; i < dirty.length; i++) {
        const d = dirty[i];
        fg.clearRect(d[0], d[1], d[2], d[3]);
      }
      dirty.length = 0;

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed * SPEED_PER_SEC * p.dir * dt;

        if (p.phase === 'in') {
          p.opacity += FADE_PER_SEC * dt;
          if (p.opacity >= p.maxOp) { p.opacity = p.maxOp; p.phase = 'travel'; }
        } else if (p.phase === 'travel') {
          if ((p.dir > 0 && p.t > 0.82) || (p.dir < 0 && p.t < 0.18)) p.phase = 'out';
        } else {
          p.opacity -= FADE_PER_SEC * dt;
          if (p.opacity <= 0) { pulses.splice(i, 1); continue; }
        }

        const x = p.edge.a.x + (p.edge.b.x - p.edge.a.x) * p.t;
        const y = p.edge.a.y + (p.edge.b.y - p.edge.a.y) * p.t;
        const R = p.r * 4;

        fg.globalAlpha = p.opacity * palette.pulseOpMax;
        fg.drawImage(sprite, x - R, y - R, R * 2, R * 2);
        dirty.push([x - R - 1, y - R - 1, R * 2 + 2, R * 2 + 2]);
      }
      fg.globalAlpha = 1;

      if (pulses.length < 10 && edges.length && Math.random() < 1.5 * dt) {
        pulses.push(spawnPulse(edges));
      }
    }

    const start = () => {
      if (reduced || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    let resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Mobile browsers fire resize on every URL-bar show/hide; only rebuild
        // when the width actually changed.
        if (state && window.innerWidth === state.W) return;
        stop(); init(); start();
      }, 200);
    }
    const onVisibility = () => (document.hidden ? stop() : start());

    init();
    start();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(resizeTimer);
      stop();
    };
  }, [dark]);

  return (
    <>
      <canvas id="neural-canvas" className="neural-layer" ref={staticRef} aria-hidden="true" />
      <canvas id="neural-pulses" className="neural-layer" ref={pulseRef} aria-hidden="true" />
    </>
  );
}
