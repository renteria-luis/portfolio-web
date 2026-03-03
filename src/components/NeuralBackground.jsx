import { useEffect, useRef } from 'react';

/**
 * NeuralBackground — canvas-based animated neural network / data-flow graph.
 *
 * Design goals:
 *  - ~40 nodes, sparse graph (each node connects to 2-3 nearest neighbours)
 *  - Edges: very thin, low-opacity lines (the "web")
 *  - Pulses: small bright dots that travel along edges, fade in/out
 *  - Everything is extremely subtle — opacity capped at ~12% for lines,
 *    ~55% for pulse peaks, so it never competes with content
 *  - Responsive: rebuilds on resize (debounced)
 *  - Works in both dark and light mode — different color palettes
 */
export default function NeuralBackground({ dark }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null); // holds { nodes, edges, pulses, raf }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── Palette ──────────────────────────────────────────────────────
    const palette = dark
      ? {
          node:       'rgba(63,185,80,',       // green nodes
          edge:       'rgba(63,185,80,',        // green edges
          pulse:      'rgba(63,185,80,',        // green pulses
          nodeBright: 'rgba(121,192,255,',      // occasional blue node
          edgeOpMax:  0.09,                     // max edge opacity
          nodeOpMax:  0.18,
          pulseOpMax: 0.55,
        }
      : {
          node:       'rgba(9,105,218,',        // blue nodes
          edge:       'rgba(9,105,218,',
          pulse:      'rgba(9,105,218,',
          nodeBright: 'rgba(26,127,55,',        // occasional green node
          edgeOpMax:  0.07,
          nodeOpMax:  0.14,
          pulseOpMax: 0.4,
        };

    // ── Helpers ───────────────────────────────────────────────────────
    const rand  = (a, b) => a + Math.random() * (b - a);
    const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

    // ── Build graph ───────────────────────────────────────────────────
    function buildGraph(W, H) {
      const NODE_COUNT   = Math.min(52, Math.floor((W * H) / 18000));
      const CONNECT_DIST = Math.min(W, H) * 0.26;   // connect if closer than 26% of shorter side
      const MAX_EDGES    = 3;                         // max connections per node

      // Distribute nodes in a grid-ish pattern with jitter for organic feel
      const cols  = Math.ceil(Math.sqrt(NODE_COUNT * (W / H)));
      const rows  = Math.ceil(NODE_COUNT / cols);
      const nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (nodes.length >= NODE_COUNT) break;
          nodes.push({
            x:   (c + 0.5 + rand(-0.38, 0.38)) * (W / cols),
            y:   (r + 0.5 + rand(-0.38, 0.38)) * (H / rows),
            r:   rand(1.2, 2.8),       // radius
            op:  rand(0.4, 1.0),       // opacity multiplier
            bright: Math.random() < 0.12,  // ~12% are accent-colour nodes
          });
        }
      }

      // Build edges: for each node, connect to N nearest within CONNECT_DIST
      const edges = [];
      const edgeSet = new Set();
      for (let i = 0; i < nodes.length; i++) {
        const sorted = nodes
          .map((n, j) => ({ j, d: dist2(nodes[i], n) }))
          .filter(({ j, d }) => j !== i && d < CONNECT_DIST ** 2)
          .sort((a, b) => a.d - b.d)
          .slice(0, MAX_EDGES);

        for (const { j } of sorted) {
          const key = [Math.min(i, j), Math.max(i, j)].join('-');
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push({ a: nodes[i], b: nodes[j], op: rand(0.4, 1.0) });
          }
        }
      }
      return { nodes, edges };
    }

    // ── Pulse factory ─────────────────────────────────────────────────
    function spawnPulse(edges) {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const rev  = Math.random() < 0.5;
      return {
        edge,
        t:       rev ? 1 : 0,        // parametric position along edge (0→1)
        speed:   rand(0.0008, 0.0022),
        dir:     rev ? -1 : 1,
        opacity: 0,
        phase:   'in',                // 'in' | 'travel' | 'out'
        maxOp:   rand(0.55, 1.0),
        r:       rand(1.8, 3.2),
      };
    }

    // ── Main init ─────────────────────────────────────────────────────
    function init() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const { nodes, edges } = buildGraph(canvas.width, canvas.height);

      // Seed ~8 pulses immediately so canvas isn't empty on first frame
      const pulses = Array.from({ length: 8 }, () => {
        const p = spawnPulse(edges);
        p.t = rand(0, 1);              // random starting position
        p.opacity = rand(0.1, 0.4);
        p.phase = 'travel';
        return p;
      });

      stateRef.current = { nodes, edges, pulses, raf: null };
    }

    // ── Draw frame ────────────────────────────────────────────────────
    function frame() {
      const { nodes, edges, pulses } = stateRef.current;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // 1. Draw edges
      for (const e of edges) {
        const op = e.op * palette.edgeOpMax;
        ctx.strokeStyle = palette.edge + op + ')';
        ctx.lineWidth   = 0.7;
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.stroke();
      }

      // 2. Draw nodes
      for (const n of nodes) {
        const col = n.bright ? palette.nodeBright : palette.node;
        const op  = n.op * palette.nodeOpMax;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = col + op + ')';
        ctx.fill();
      }

      // 3. Update + draw pulses
      const FADE_SPEED = 0.018;
      const toRemove = [];
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];

        // Advance position
        p.t += p.speed * p.dir;

        // Fade logic
        if (p.phase === 'in') {
          p.opacity += FADE_SPEED;
          if (p.opacity >= p.maxOp) { p.opacity = p.maxOp; p.phase = 'travel'; }
        } else if (p.phase === 'travel') {
          // Start fading out near the end of the edge
          if (p.dir > 0 && p.t > 0.82) p.phase = 'out';
          if (p.dir < 0 && p.t < 0.18) p.phase = 'out';
        } else if (p.phase === 'out') {
          p.opacity -= FADE_SPEED;
          if (p.opacity <= 0) { toRemove.push(i); continue; }
        }

        // Interpolate position
        const x = p.edge.a.x + (p.edge.b.x - p.edge.a.x) * p.t;
        const y = p.edge.a.y + (p.edge.b.y - p.edge.a.y) * p.t;
        const op = p.opacity * palette.pulseOpMax;

        // Glow: outer soft halo + inner bright dot
        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.r * 4);
        grad.addColorStop(0,   palette.pulse + op       + ')');
        grad.addColorStop(0.4, palette.pulse + (op * 0.5) + ')');
        grad.addColorStop(1,   palette.pulse + '0)');
        ctx.beginPath();
        ctx.arc(x, y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Crisp centre
        ctx.beginPath();
        ctx.arc(x, y, p.r * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = palette.pulse + Math.min(op * 1.4, 1) + ')';
        ctx.fill();
      }

      // Remove finished pulses (reverse to keep indices valid)
      for (let i = toRemove.length - 1; i >= 0; i--) {
        pulses.splice(toRemove[i], 1);
      }

      // Spawn new pulses — target ~10 concurrent
      if (pulses.length < 10 && Math.random() < 0.025) {
        pulses.push(spawnPulse(edges));
      }

      stateRef.current.raf = requestAnimationFrame(frame);
    }

    // ── Resize handler (debounced) ────────────────────────────────────
    let resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (stateRef.current?.raf) cancelAnimationFrame(stateRef.current.raf);
        init();
        stateRef.current.raf = requestAnimationFrame(frame);
      }, 200);
    }
    window.addEventListener('resize', onResize);

    // ── Start ─────────────────────────────────────────────────────────
    init();
    stateRef.current.raf = requestAnimationFrame(frame);

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      if (stateRef.current?.raf) cancelAnimationFrame(stateRef.current.raf);
    };
  }, [dark]); // re-init when dark/light switches so palette updates

  return (
    <canvas
      id="neural-canvas"
      ref={canvasRef}
      aria-hidden="true"
    />
  );
}
