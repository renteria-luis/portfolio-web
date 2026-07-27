import { Briefcase, GraduationCap } from 'lucide-react';
import { timeline, companion } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';
import { ui } from '../i18n/ui';
import { useT } from '../i18n';

const say = (t) => t && window.dispatchEvent(new CustomEvent('companionSay', { detail: t }));

const TAG_COLORS_DARK = [
  'bg-[rgba(63,185,80,0.1)] text-terminal-green border-[rgba(63,185,80,0.15)]',
  'bg-[rgba(121,192,255,0.1)] text-terminal-blue border-[rgba(121,192,255,0.15)]',
  'bg-[rgba(210,168,255,0.1)] text-terminal-purple border-[rgba(210,168,255,0.15)]',
  'bg-[rgba(255,166,87,0.1)] text-terminal-orange border-[rgba(255,166,87,0.15)]',
];
const TAG_COLORS_LIGHT = [
  'bg-[rgba(26,127,55,0.08)] text-[#197934] border-[rgba(26,127,55,0.2)]',
  'bg-[rgba(9,105,218,0.08)] text-[#0969da] border-[rgba(9,105,218,0.2)]',
  'bg-[rgba(124,58,237,0.08)] text-[#7c3aed] border-[rgba(124,58,237,0.2)]',
  'bg-[rgba(180,83,9,0.08)] text-[#b45309] border-[rgba(180,83,9,0.2)]',
];

function TimelineItem({ item, index, dark, isLast, t }) {
  const isExp = item.type === 'experience';
  const tagColors = dark ? TAG_COLORS_DARK : TAG_COLORS_LIGHT;
  const tagColor = tagColors[index % tagColors.length];

  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';

  return (
    <div className="relative pl-10">
      {/* Timeline dot + connector */}
      <div className="absolute left-0 top-1">
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            isExp
              ? dark ? 'border-terminal-green bg-[rgba(63,185,80,0.1)]' : 'border-[#197934] bg-[rgba(26,127,55,0.08)]'
              : dark ? 'border-terminal-blue bg-[rgba(121,192,255,0.1)]' : 'border-[#0969da] bg-[rgba(9,105,218,0.08)]'
          }`}
        >
          {isExp
            ? <Briefcase size={7} className={dark ? 'text-terminal-green' : 'text-[#197934]'} />
            : <GraduationCap size={7} className={dark ? 'text-terminal-blue' : 'text-[#0969da]'} />
          }
        </div>
        {/* Gradient connector line: gradient backgrounds require inline style (no Tailwind equivalent) */}
        {!isLast && (
          <div
            className="absolute left-[7px] top-[18px] w-px"
            style={{
              height: 'calc(100% + 24px)',
              background: dark
                ? 'linear-gradient(to bottom, rgba(63,185,80,0.25), rgba(63,185,80,0.04))'
                : 'linear-gradient(to bottom, rgba(26,127,55,0.2), rgba(26,127,55,0.03))',
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        onMouseEnter={() => say(companion.hoverLines[item.id])}
        className={`mb-8 rounded-lg p-5 transition-all duration-300 border ${
          dark
            ? `bg-[#181f2e] border-[rgba(125,167,217,0.08)] ${
                isExp ? 'hover:border-[rgba(63,185,80,0.2)]' : 'hover:border-[rgba(121,192,255,0.2)]'
              }`
            : `bg-white border-[rgba(30,50,80,0.1)] ${
                isExp ? 'hover:border-[rgba(26,127,55,0.25)]' : 'hover:border-[rgba(9,105,218,0.25)]'
              }`
        }`}
      >
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className={`font-mono text-sm font-semibold ${textPrimary}`}>
              {t(item.role)}
            </h3>
            <div className={`font-mono text-xs mt-0.5 ${
              isExp
                ? dark ? 'text-terminal-green' : 'text-[#197934]'
                : dark ? 'text-terminal-blue' : 'text-[#0969da]'
            }`}>
              {t(item.institution)}
            </div>
          </div>
          <div className="text-right">
            <div className={`font-mono text-[11px] ${textSecondary}`}>{t(item.period)}</div>
            <div className={`font-mono text-[10px] mt-0.5 ${dark ? 'text-[#7b8fa6]' : 'text-[#576c80]'}`}>
              {t(item.location)}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs leading-6 mb-3 ${textSecondary}`}>{t(item.description)}</p>

        {/* Highlight */}
        {item.highlight && (
          <div className={`font-mono text-[10px] px-2.5 py-1.5 rounded mb-3 inline-block ${
            isExp
              ? dark ? 'bg-[rgba(63,185,80,0.06)] text-terminal-green/70' : 'bg-[rgba(26,127,55,0.06)] text-[#197934]'
              : dark ? 'bg-[rgba(121,192,255,0.06)] text-terminal-blue/70' : 'bg-[rgba(9,105,218,0.06)] text-[#0969da]'
          }`}>
            ✦ {t(item.highlight)}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={t(tag)} className={`tag border ${tagColor}`}>
              {t(tag)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Timeline({ dark }) {
  const ref = useReveal(0.05);
  const t = useT();
  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';

  return (
    <section id="experience" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        {/* Section header */}
        <div className="mb-12">
          <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#197934]'}`}>
            {t(ui.timeline.label)}
          </p>
          <h2 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
            {t(ui.timeline.title)}
          </h2>
        </div>

        {/* Timeline */}
        <div>
          {timeline.map((item, i) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={i}
              dark={dark}
              isLast={i === timeline.length - 1}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
