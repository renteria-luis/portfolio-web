import { Brain, Database, Box, Layers } from 'lucide-react';
import { skillCategories } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';

// ─── react-icons imports ──────────────────────────────────────────
import { SiPython, SiPytorch, SiScikitlearn, SiPandas, SiNumpy,
         SiSpacy, SiPostgresql, SiMongodb, SiDocker, SiFastapi,
         SiGit, SiGithub, SiLinux, SiGnubash, SiStreamlit,
         SiHuggingface, SiLangchain, SiPytest,
         SiGithubactions, SiMlflow,
         SiApacheairflow, SiKubernetes,
         SiHtml5, SiCss3, SiJavascript } from 'react-icons/si';
import { FaSitemap, FaDatabase, FaSpider, FaProjectDiagram, FaPlayCircle,
         FaRobot, FaTerminal } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { BsGraphUpArrow } from 'react-icons/bs';
import { TbBrandAzure } from 'react-icons/tb';

const ICON_MAP = {
  SiPython, SiPytorch, SiScikitlearn, SiPandas, SiNumpy, SiSpacy,
  SiPostgresql, SiMongodb, SiDocker, SiFastapi, SiGit, SiGithub,
  SiLinux, SiGnubash, SiStreamlit, SiHuggingface, SiLangchain,
  SiPytest, SiGithubactions, SiMlflow,
  SiApacheairflow, SiKubernetes,
  FaSitemap, FaDatabase, FaSpider, FaProjectDiagram, FaPlayCircle,
  BiLineChart, BsGraphUpArrow,
  TbBrandAzure,
  SiHtml5, SiCss3, SiJavascript, FaRobot, FaTerminal,
};

// ─── Level color system: colorblind-safe ────────────────────────
const LEVEL_STYLES = {
  core: {
    dark:  'bg-[rgba(63,185,80,0.09)]  text-[#5fd87a] border-[rgba(63,185,80,0.22)]',
    light: 'bg-[rgba(26,127,55,0.07)]  text-[#16783a] border-[rgba(26,127,55,0.22)]',
    dot: { dark: '#3fb950', light: '#1a7f37' },
    label: 'core',
    legend: { dark: '#3fb950', light: '#1a7f37' },
  },
  learning: {
    dark:  'bg-[rgba(79,162,255,0.09)]  text-[#79c0ff] border-[rgba(79,162,255,0.22)]',
    light: 'bg-[rgba(9,105,218,0.07)]   text-[#0969da] border-[rgba(9,105,218,0.2)]',
    dot: { dark: '#79c0ff', light: '#0969da' },
    label: 'learning',
    legend: { dark: '#79c0ff', light: '#0969da' },
  },
  roadmap: {
    dark:  'bg-[rgba(255,50,50,0.09)]  text-[#ff6060] border-[rgba(255,50,50,0.22)]',
    light: 'bg-[rgba(220,38,38,0.07)]  text-[#dc2626] border-[rgba(220,38,38,0.2)]',
    dot: { dark: '#ff4040', light: '#dc2626' },
    label: 'roadmap',
    legend: { dark: '#ff4040', light: '#dc2626' },
  },
};

const CATEGORY_ICONS = { brain: Brain, database: Database, box: Box, layers: Layers };

// One entry per category id in data.js. A missing id falls back to green,
// which is how web-dev and data-apps used to look identical to ml-ai.
const CATEGORY_ACCENT = {
  'ml-ai':     { dark: { border: 'rgba(63,185,80,0.2)',   icon: '#3fb950', bg: 'rgba(63,185,80,0.07)'   }, light: { border: 'rgba(26,127,55,0.2)',  icon: '#1a7f37', bg: 'rgba(26,127,55,0.06)'   } },
  'web-dev':   { dark: { border: 'rgba(210,168,255,0.2)', icon: '#d2a8ff', bg: 'rgba(210,168,255,0.07)' }, light: { border: 'rgba(124,58,237,0.2)', icon: '#7c3aed', bg: 'rgba(124,58,237,0.06)' } },
  'data-eng':  { dark: { border: 'rgba(121,192,255,0.2)', icon: '#79c0ff', bg: 'rgba(121,192,255,0.07)' }, light: { border: 'rgba(9,105,218,0.2)',  icon: '#0969da', bg: 'rgba(9,105,218,0.06)'  } },
  'mlops':     { dark: { border: 'rgba(255,166,87,0.2)',  icon: '#ffa657', bg: 'rgba(255,166,87,0.07)'  }, light: { border: 'rgba(180,83,9,0.2)',   icon: '#b45309', bg: 'rgba(180,83,9,0.06)'   } },
  'data-apps': { dark: { border: 'rgba(227,179,65,0.2)',  icon: '#e3b341', bg: 'rgba(227,179,65,0.07)'  }, light: { border: 'rgba(154,103,0,0.2)',  icon: '#9a6700', bg: 'rgba(154,103,0,0.06)'  } },
};

function SkillBadge({ skill, dark }) {
  const levelStyle = LEVEL_STYLES[skill.level];
  const modeClass  = dark ? levelStyle.dark : levelStyle.light;
  const IconComp   = ICON_MAP[skill.icon];

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md border font-mono text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default select-none ${modeClass}`}
    >
      {IconComp ? (
        <IconComp size={14} aria-hidden="true" className="flex-shrink-0" />
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: dark ? levelStyle.dot.dark : levelStyle.dot.light }}
        />
      )}
      <span className="leading-none">{skill.name}</span>
    </div>
  );
}

function CategoryBlock({ category, dark }) {
  const accent     = CATEGORY_ACCENT[category.id] || CATEGORY_ACCENT['ml-ai'];
  const modeAccent = dark ? accent.dark : accent.light;
  const IconComp   = CATEGORY_ICONS[category.icon] || Brain;

  return (
    <div
      className={`rounded-lg p-5 transition-all duration-300 border ${
        dark
          ? 'bg-[#181f2e] border-[rgba(125,167,217,0.08)] hover:border-[rgba(63,185,80,0.22)]'
          : 'bg-white border-[rgba(30,50,80,0.1)] hover:border-[rgba(26,127,55,0.28)]'
      }`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="p-1.5 rounded"
          style={{ background: modeAccent.bg }}
        >
          <IconComp size={14} style={{ color: modeAccent.icon }} />
        </div>
        <div>
          <div className={`font-mono text-xs font-semibold ${dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]'}`}>
            {category.label}
          </div>
          <div className={`font-mono text-[9px] uppercase tracking-widest ${dark ? 'text-[#a2afc2]' : 'text-[#57606a]'}`}>
            ~/skills/{category.id}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <SkillBadge key={skill.name} skill={skill} dark={dark} />
        ))}
      </div>
    </div>
  );
}

export default function Skills({ dark }) {
  const ref = useReveal(0.05);
  const textPrimary   = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]'  : 'text-[#57606a]';

  const legendItems = Object.entries(LEVEL_STYLES).map(([level, style]) => ({
    level, label: style.label,
    color: dark ? style.legend.dark : style.legend.light,
  }));

  return (
    <section id="skills" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        <div className="mb-12">
          <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#1a7f37]'}`}>
            04 / skills
          </p>
          <h2 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
            tech stack
          </h2>
          <p className={`mt-3 text-sm ${textSecondary}`}>
            Tools I use daily, tools I'm actively learning, and what's on my roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillCategories.map((cat) => (
            <CategoryBlock key={cat.id} category={cat} dark={dark} />
          ))}
        </div>

        {/* Legend */}
        <div className={`mt-6 flex flex-wrap items-center gap-5 pt-5 border-t ${
          dark ? 'border-[rgba(139,151,168,0.07)]' : 'border-[rgba(30,50,80,0.08)]'
        }`}>
          <span className={`font-mono text-[9px] uppercase tracking-widest ${textSecondary}`}>
            Legend:
          </span>
          {legendItems.map(({ level, label, color }) => (
            <div key={level} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
              />
              <span className="font-mono text-[11px] font-medium" style={{ color }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
