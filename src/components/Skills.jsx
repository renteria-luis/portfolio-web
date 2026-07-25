import { Brain, Database, Box, Layers } from 'lucide-react';
import { skillCategories } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';

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

// Colourblind-safe: green / blue / red also differ in position in the legend.
const LEVEL_STYLES = {
  core:     { badge: 'bg-terminal-green/[0.09] text-terminal-green border-terminal-green/25', dot: 'bg-terminal-green', text: 'text-terminal-green' },
  learning: { badge: 'bg-terminal-blue/[0.09]  text-terminal-blue  border-terminal-blue/25',  dot: 'bg-terminal-blue',  text: 'text-terminal-blue' },
  roadmap:  { badge: 'bg-terminal-red/[0.09]   text-terminal-red   border-terminal-red/25',   dot: 'bg-terminal-red',   text: 'text-terminal-red' },
};

const CATEGORY_ICONS = { brain: Brain, database: Database, box: Box, layers: Layers };

// One accent per category id in data.js. A missing id used to fall through to
// green, which is how web-dev and data-apps ended up identical to ml-ai.
const CATEGORY_ACCENT = {
  'ml-ai':     { icon: 'text-terminal-green',  bg: 'bg-terminal-green/[0.07]' },
  'web-dev':   { icon: 'text-terminal-purple', bg: 'bg-terminal-purple/[0.07]' },
  'data-eng':  { icon: 'text-terminal-blue',   bg: 'bg-terminal-blue/[0.07]' },
  'mlops':     { icon: 'text-terminal-orange', bg: 'bg-terminal-orange/[0.07]' },
  'data-apps': { icon: 'text-terminal-yellow', bg: 'bg-terminal-yellow/[0.07]' },
};

function SkillBadge({ skill }) {
  const level = LEVEL_STYLES[skill.level];
  const IconComp = ICON_MAP[skill.icon];

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-md border font-mono text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default select-none ${level.badge}`}>
      {IconComp
        ? <IconComp size={14} aria-hidden="true" className="flex-shrink-0" />
        : <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${level.dot}`} />}
      <span className="leading-none">{skill.name}</span>
    </div>
  );
}

function CategoryBlock({ category }) {
  const accent = CATEGORY_ACCENT[category.id] ?? CATEGORY_ACCENT['ml-ai'];
  const IconComp = CATEGORY_ICONS[category.icon] || Brain;

  return (
    <div className="rounded-lg p-5 transition-all duration-300 border border-line/10 bg-surface hover:border-terminal-green/25">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`p-1.5 rounded ${accent.bg}`}>
          <IconComp size={14} className={accent.icon} />
        </div>
        <div>
          <div className="font-mono text-xs font-semibold text-t1">{category.label}</div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-t2">~/skills/{category.id}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => <SkillBadge key={skill.name} skill={skill} />)}
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useReveal(0.05);

  return (
    <section id="skills" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        <div className="mb-12">
          <p className="font-mono text-xs mb-2 text-terminal-green">04 / skills</p>
          <h2 className="font-mono text-2xl font-semibold section-title text-t1">tech stack</h2>
          <p className="mt-3 text-sm text-t2">
            Tools I use daily, tools I'm actively learning, and what's on my roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillCategories.map((cat) => <CategoryBlock key={cat.id} category={cat} />)}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-5 pt-5 border-t border-line/[0.08]">
          <span className="font-mono text-[9px] uppercase tracking-widest text-t2">Legend:</span>
          {Object.entries(LEVEL_STYLES).map(([level, style]) => (
            <div key={level} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style.dot}`} />
              <span className={`font-mono text-[11px] font-medium ${style.text}`}>{level}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
