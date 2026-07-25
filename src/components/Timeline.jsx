import { Briefcase, GraduationCap } from 'lucide-react';
import { timeline, companion } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';
import { say } from '../lib/say';

const TAG_COLORS = [
  'bg-terminal-green/10  text-terminal-green  border-terminal-green/20',
  'bg-terminal-blue/10   text-terminal-blue   border-terminal-blue/20',
  'bg-terminal-purple/10 text-terminal-purple border-terminal-purple/20',
  'bg-terminal-orange/10 text-terminal-orange border-terminal-orange/20',
];

// Full class strings, never interpolated — Tailwind's JIT scans source text and
// cannot see a class built at runtime.
const ACCENT = {
  experience: {
    dot:    'border-terminal-green bg-terminal-green/10',
    icon:   'text-terminal-green',
    name:   'text-terminal-green',
    hover:  'hover:border-terminal-green/25',
    pill:   'bg-terminal-green/[0.08] text-terminal-green',
  },
  education: {
    dot:    'border-terminal-blue bg-terminal-blue/10',
    icon:   'text-terminal-blue',
    name:   'text-terminal-blue',
    hover:  'hover:border-terminal-blue/25',
    pill:   'bg-terminal-blue/[0.08] text-terminal-blue',
  },
};

function TimelineItem({ item, index, isLast }) {
  const isExp = item.type === 'experience';
  const a = ACCENT[isExp ? 'experience' : 'education'];

  return (
    <div className="relative pl-10">
      <div className="absolute left-0 top-1">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${a.dot}`}>
          {isExp
            ? <Briefcase size={7} className={a.icon} />
            : <GraduationCap size={7} className={a.icon} />}
        </div>
        {!isLast && (
          <div
            className="absolute left-[7px] top-[18px] w-px"
            style={{
              height: 'calc(100% + 24px)',
              background: 'linear-gradient(to bottom, rgb(var(--c-green) / 0.25), rgb(var(--c-green) / 0.04))',
            }}
          />
        )}
      </div>

      <div
        onMouseEnter={() => say(companion.hoverLines[item.id])}
        className={`mb-8 rounded-lg p-5 transition-all duration-300 border border-line/10 bg-surface ${a.hover}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-mono text-sm font-semibold text-t1">{item.role}</h3>
            <div className={`font-mono text-xs mt-0.5 ${a.name}`}>{item.institution}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[11px] text-t2">{item.period}</div>
            <div className="font-mono text-[10px] mt-0.5 text-t3">{item.location}</div>
          </div>
        </div>

        <p className="text-xs leading-6 mb-3 text-t2">{item.description}</p>

        {item.highlight && (
          <div className={`font-mono text-[10px] px-2.5 py-1.5 rounded mb-3 inline-block ${a.pill}`}>
            ✦ {item.highlight}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className={`tag border ${TAG_COLORS[index % TAG_COLORS.length]}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const ref = useReveal(0.05);

  return (
    <section id="experience" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        <div className="mb-12">
          <p className="font-mono text-xs mb-2 text-terminal-green">02 / experience &amp; education</p>
          <h2 className="font-mono text-2xl font-semibold section-title text-t1">career timeline</h2>
        </div>

        <div>
          {timeline.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} isLast={i === timeline.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
