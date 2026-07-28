import { useEffect, useMemo, useState } from 'react';
import { ui } from '../i18n/ui';
import { useT } from '../i18n';

/**
 * Interactive version of the argument the article makes in prose.
 *
 * The curve is not modelled or interpolated: public/writeups/
 * fraud-threshold-curve.json holds the real precision/recall/F1 and the raw
 * confusion counts at 100 thresholds, produced by scoring the shipped pipeline
 * against the held-out PaySim test set. It is 7KB, so there is no backend and
 * no cost, and the two operating points quoted in the text reproduce exactly.
 */
const CURVE_URL = '/writeups/fraud-threshold-curve.json';

export default function ThresholdExplorer({ dark }) {
  const [data, setData] = useState(null);
  const [idx, setIdx] = useState(null);
  const t = useT();

  useEffect(() => {
    let alive = true;
    fetch(CURVE_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((d) => {
        if (!alive) return;
        setData(d);
        setIdx(d.points.findIndex((p) => p.t === d.shipped));
      })
      .catch(() => alive && setData(false));
    return () => { alive = false; };
  }, []);

  const geom = useMemo(() => {
    if (!data) return null;
    const W = 100, H = 46;
    const path = (key) =>
      data.points
        .map((p, i) => `${i ? 'L' : 'M'}${(p.t * W).toFixed(2)},${(H - p[key] * H).toFixed(2)}`)
        .join(' ');
    return { W, H, precision: path('p'), recall: path('r') };
  }, [data]);

  if (data === false) return null;

  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textMuted = dark ? 'text-[#7b8fa6]' : 'text-[#576c80]';
  const green = dark ? '#3fb950' : '#197934';
  const blue = dark ? '#79c0ff' : '#0969da';
  const orange = dark ? '#ffa657' : '#b45309';

  if (!data || idx === null) {
    return (
      <div className={`my-8 rounded-lg border p-5 font-mono text-xs ${textMuted} ${
        dark ? 'border-[rgba(125,167,217,0.12)]' : 'border-[rgba(30,50,80,0.12)]'
      }`}>
        {t(ui.blog.explorerLoading)}
      </div>
    );
  }

  const pt = data.points[idx];
  const isShipped = pt.t === data.shipped;
  const isDefault = pt.t === data.default;

  const jumpTo = (value) => {
    const i = data.points.findIndex((p) => p.t === value);
    if (i >= 0) setIdx(i);
  };

  const Stat = ({ label, value, color, sub }) => (
    <div>
      <div className="font-mono text-xl font-semibold leading-none" style={{ color }}>{value}</div>
      <div className={`font-mono text-[9px] uppercase tracking-wide mt-1 ${textMuted}`}>{label}</div>
      {sub && <div className={`font-mono text-[10px] mt-0.5 ${textMuted}`}>{sub}</div>}
    </div>
  );

  const chip = (activeState) =>
    `font-mono text-[10px] px-2.5 py-1 rounded border transition-colors ${
      activeState
        ? dark
          ? 'border-terminal-green/60 text-terminal-green bg-terminal-green/10'
          : 'border-[rgba(26,127,55,0.5)] text-[#197934] bg-[rgba(26,127,55,0.08)]'
        : dark
          ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:text-[#ecf0f8]'
          : 'border-[rgba(30,50,80,0.15)] text-[#57606a] hover:text-[#1c2128]'
    }`;

  return (
    <figure className={`my-8 rounded-lg border overflow-hidden ${
      dark ? 'bg-[#181f2e] border-[rgba(125,167,217,0.12)]' : 'bg-white border-[rgba(30,50,80,0.12)]'
    }`}>
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: '#f78166' }} />
        <div className="terminal-dot" style={{ background: '#e3b341' }} />
        <div className="terminal-dot" style={{ background: '#3fb950' }} />
        <span className={`ml-2 font-mono text-xs ${textMuted}`}>threshold --explore</span>
      </div>

      <div className="p-5">
        {/* Curves. Precision climbs, recall falls, and the gap between them at
            any x is the trade the article is arguing about. */}
        <div className="flex gap-2">
          <div className={`flex flex-col justify-between font-mono text-[9px] py-px ${textMuted}`}>
            <span>100%</span><span>50%</span><span>0%</span>
          </div>
          <svg
            viewBox="0 0 100 46"
            className="flex-1 h-28"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[0, 23, 46].map((y) => (
              <line
                key={y} x1="0" y1={y} x2="100" y2={y}
                stroke={dark ? 'rgba(125,167,217,0.12)' : 'rgba(30,50,80,0.12)'}
                strokeWidth="0.5" vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={geom.precision} fill="none" stroke={blue} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            <path d={geom.recall} fill="none" stroke={green} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            <line
              x1={pt.t * 100} y1="0" x2={pt.t * 100} y2="46"
              stroke={orange} strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeDasharray="3 3"
            />
          </svg>
        </div>

        <div className={`ml-8 mt-1.5 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[9px] ${textMuted}`}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px" style={{ background: blue }} /> precision
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px" style={{ background: green }} /> recall
          </span>
          <span className="ml-auto">0.0 → 1.0</span>
        </div>

        <label className="block">
          <span className={`font-mono text-[10px] uppercase tracking-wide ${textMuted}`}>
            {t(ui.blog.explorerThreshold)}
          </span>
          <div className="flex items-center gap-3 mt-1.5">
            <input
              type="range"
              min={0}
              max={data.points.length - 1}
              value={idx}
              onChange={(e) => setIdx(Number(e.target.value))}
              className="threshold-range flex-1"
              aria-valuetext={`${pt.t}`}
            />
            <span className={`font-mono text-sm font-semibold tabular-nums w-16 text-right ${textPrimary}`}>
              {pt.t.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}
            </span>
          </div>
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => jumpTo(data.shipped)} className={chip(isShipped)}>
            {t(ui.blog.explorerShipped)} · {data.shipped}
          </button>
          <button type="button" onClick={() => jumpTo(data.default)} className={chip(isDefault)}>
            {t(ui.blog.explorerDefault)} · {data.default}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
          <Stat label="precision" value={`${(pt.p * 100).toFixed(1)}%`} color={blue} />
          <Stat label="recall" value={`${(pt.r * 100).toFixed(1)}%`} color={green} />
          <Stat label="f1" value={pt.f1.toFixed(3)} color={dark ? '#a2afc2' : '#57606a'} />
        </div>

        {/* The counts are the point: percentages hide that a recall move is
            measured in real transactions nobody investigated. */}
        <div className={`mt-5 pt-4 border-t grid grid-cols-3 gap-4 ${
          dark ? 'border-[rgba(125,167,217,0.08)]' : 'border-[rgba(30,50,80,0.08)]'
        }`}>
          <Stat label={t(ui.blog.explorerCaught)} value={pt.tp} color={green} />
          <Stat label={t(ui.blog.explorerMissed)} value={pt.fn} color={dark ? '#f78166' : '#c4432b'} />
          <Stat label={t(ui.blog.explorerFalse)} value={pt.fp} color={orange} />
        </div>

        <figcaption className={`mt-4 font-mono text-[10px] leading-5 ${textMuted}`}>
          {t(ui.blog.explorerCaption)
            .replace('{n}', data.n_total.toLocaleString())
            .replace('{f}', data.n_fraud.toLocaleString())}
        </figcaption>
      </div>
    </figure>
  );
}
