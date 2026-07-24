import { personal, companion } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';

const say = (t) => t && window.dispatchEvent(new CustomEvent('companionSay', { detail: t }));

function MetricCard({ label, value, note, dark }) {
  return (
    <div
      onMouseEnter={() => say(companion.hoverLines[label])}
      className={`p-4 rounded-lg border text-center transition-all duration-300 ${
        dark
          ? 'bg-[#181f2e] border-[rgba(125,167,217,0.08)] hover:border-[rgba(63,185,80,0.2)]'
          : 'bg-white border-[rgba(30,50,80,0.1)] hover:border-[rgba(26,127,55,0.25)]'
      }`}
    >
      <div className={`font-mono text-xl font-semibold mb-0.5 ${dark ? 'text-terminal-green' : 'text-[#1a7f37]'}`}>
        {value}
      </div>
      <div className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]'}`}>
        {label}
      </div>
      {note && (
        <div className={`text-[10px] ${dark ? 'text-[#7b8fa6]' : 'text-[#8b9eb0]'}`}>{note}</div>
      )}
    </div>
  );
}

export default function About({ dark }) {
  const ref = useReveal(0.1);
  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';

  return (
    <section id="about" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        {/* Section header */}
        <div className="mb-12">
          <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#1a7f37]'}`}>
            01 / about
          </p>
          <h2 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
            who I am
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Bio */}
          <div className="lg:col-span-3 space-y-4">
            {personal.bio.map((paragraph, i) => (
              <p key={i} className={`text-sm leading-7 ${textSecondary}`}>
                {paragraph}
              </p>
            ))}

            {/* Philosophy block */}
            <div
              className={`mt-6 pl-4 border-l-2 py-1 ${
                dark ? 'border-terminal-green/30' : 'border-[#1a7f37]/30'
              }`}
            >
              <p className={`text-sm italic leading-6 ${dark ? 'text-[#a2afc2]' : 'text-[#57606a]'}`}>
                "I understand the criticality of industrial and operational systems — which shapes how I
                build ML models: with real business impact, not just academic theory."
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {personal.highlights.map((h) => (
                <MetricCard key={h.label} dark={dark} {...h} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
