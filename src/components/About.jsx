import { personal, companion } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';
import { ui } from '../i18n/ui';
import { useT } from '../i18n';

const say = (t) => t && window.dispatchEvent(new CustomEvent('companionSay', { detail: t }));

function MetricCard({ item, dark, t }) {
  return (
    <div
      onMouseEnter={() => say(companion.hoverLines[item.key])}
      className={`p-4 rounded-lg border text-center transition-all duration-300 ${
        dark
          ? 'bg-[#181f2e] border-[rgba(125,167,217,0.08)] hover:border-[rgba(63,185,80,0.2)]'
          : 'bg-white border-[rgba(30,50,80,0.1)] hover:border-[rgba(26,127,55,0.25)]'
      }`}
    >
      <div className={`font-mono text-xl font-semibold mb-0.5 ${dark ? 'text-terminal-green' : 'text-[#197934]'}`}>
        {item.value}
      </div>
      <div className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]'}`}>
        {t(item.label)}
      </div>
      {item.note && (
        <div className={`text-[10px] ${dark ? 'text-[#7b8fa6]' : 'text-[#576c80]'}`}>{t(item.note)}</div>
      )}
    </div>
  );
}

export default function About({ dark }) {
  const ref = useReveal(0.1);
  const t = useT();
  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';

  return (
    <section id="about" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        {/* Section header */}
        <div className="mb-12">
          <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#197934]'}`}>
            {t(ui.about.label)}
          </p>
          <h2 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
            {t(ui.about.title)}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Bio */}
          <div className="lg:col-span-3 space-y-4">
            {t(personal.bio).map((paragraph, i) => (
              <p key={i} className={`text-sm leading-7 ${textSecondary}`}>
                {paragraph}
              </p>
            ))}

            {/* Philosophy block */}
            <div
              className={`mt-6 pl-4 border-l-2 py-1 ${
                dark ? 'border-terminal-green/30' : 'border-[#197934]/30'
              }`}
            >
              <p className={`text-sm italic leading-6 ${dark ? 'text-[#a2afc2]' : 'text-[#57606a]'}`}>
                {t(ui.about.quote)}
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {personal.highlights.map((h) => (
                <MetricCard key={h.key} item={h} dark={dark} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
