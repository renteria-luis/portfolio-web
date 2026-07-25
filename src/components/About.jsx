import { personal, companion } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';
import { say } from '../lib/say';

function MetricCard({ label, value, note }) {
  return (
    <div
      onMouseEnter={() => say(companion.hoverLines[label])}
      className="p-4 rounded-lg border border-line/10 bg-surface text-center transition-all duration-300 hover:border-terminal-green/25"
    >
      <div className="font-mono text-xl font-semibold mb-0.5 text-terminal-green">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-wider mb-1 text-t1">{label}</div>
      {note && <div className="text-[10px] text-t3">{note}</div>}
    </div>
  );
}

export default function About() {
  const ref = useReveal(0.1);

  return (
    <section id="about" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        <div className="mb-12">
          <p className="font-mono text-xs mb-2 text-terminal-green">01 / about</p>
          <h2 className="font-mono text-2xl font-semibold section-title text-t1">who I am</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-4">
            {personal.bio.map((paragraph, i) => (
              <p key={i} className="text-sm leading-7 text-t2">{paragraph}</p>
            ))}

            <div className="mt-6 pl-4 border-l-2 border-terminal-green/30 py-1">
              <p className="text-sm italic leading-6 text-t2">
                "I understand the criticality of industrial and operational systems — which shapes how I
                build ML models: with real business impact, not just academic theory."
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {personal.highlights.map((h) => (
                <MetricCard key={h.label} {...h} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
