import { useState } from 'react';
import { Mail, Github, Linkedin, FileDown, Copy, Check } from 'lucide-react';
import { personal } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';

const MAILTO = `mailto:${personal.email}?subject=${encodeURIComponent('Hi Luis — opportunity')}`;

function CopyEmail({ dark }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
    } catch {
      return;   // clipboard blocked (insecure origin / denied) — the mailto still works
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      aria-label={copied ? 'Email copied to clipboard' : 'Copy email address'}
      className={`flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded border transition-colors ${
        dark
          ? 'border-[rgba(125,167,217,0.15)] text-[#7b8fa6] hover:text-[#ecf0f8] hover:border-[rgba(125,167,217,0.3)]'
          : 'border-[rgba(30,50,80,0.12)] text-[#8b9eb0] hover:text-[#1c2128] hover:border-[rgba(30,50,80,0.3)]'
      }`}
    >
      {copied ? <Check size={11} className={dark ? 'text-terminal-green' : 'text-[#1a7f37]'} /> : <Copy size={11} />}
      {copied ? 'copied' : 'copy'}
    </button>
  );
}

export default function Contact({ dark }) {
  const ref = useReveal(0.08);

  const textPrimary = dark ? 'text-[#ecf0f8]' : 'text-[#1c2128]';
  const textSecondary = dark ? 'text-[#a2afc2]' : 'text-[#57606a]';
  const borderColor = dark ? 'border-[rgba(125,167,217,0.08)]' : 'border-[rgba(30,50,80,0.1)]';
  const cardBg = dark ? 'bg-[#181f2e]' : 'bg-white';
  const dotRed = '#f78166';
  const dotYellow = '#e3b341';
  const dotGreen = '#3fb950';

  const Prompt = ({ children }) => (
    <div className={`mb-1 ${textSecondary}`}>
      <span className="text-terminal-green">❯</span>{' '}
      <span className={textPrimary}>{children}</span>
    </div>
  );

  const secondaryBtn = `flex items-center justify-center gap-2 font-mono text-xs px-4 py-3 rounded border transition-all duration-200 ${
    dark
      ? 'border-[rgba(125,167,217,0.15)] text-[#a2afc2] hover:border-[rgba(125,167,217,0.3)] hover:text-[#ecf0f8]'
      : 'border-[rgba(30,50,80,0.15)] text-[#57606a] hover:border-[rgba(30,50,80,0.3)] hover:text-[#1c2128]'
  }`;

  return (
    <section id="contact" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        {/* Section header */}
        <div className="mb-12">
          <p className={`font-mono text-xs mb-2 ${dark ? 'text-terminal-green' : 'text-[#1a7f37]'}`}>
            05 / contact
          </p>
          <h2 className={`font-mono text-2xl font-semibold section-title ${textPrimary}`}>
            let's talk
          </h2>
          <p className={`mt-3 text-sm ${textSecondary}`}>
            Actively looking for an ML/Data co-op for Fall 2026. If you're hiring — or just want to
            talk about RAG, MLOps or graph ML — my inbox is open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Terminal window */}
          <div
            className={`lg:col-span-3 rounded-lg border ${borderColor} ${cardBg} shadow-xl overflow-hidden`}
            style={{ boxShadow: dark ? '0 0 0 1px rgba(125,167,217,0.06), 0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.1)' }}
          >
            <div className="terminal-header">
              <div className="terminal-dot" style={{ background: dotRed }} />
              <div className="terminal-dot" style={{ background: dotYellow }} />
              <div className="terminal-dot" style={{ background: dotGreen }} />
              <span className={`ml-2 font-mono text-xs ${textSecondary}`}>
                luis@ml-portfolio:~/contact
              </span>
            </div>

            <div className="p-5 font-mono text-sm leading-relaxed">
              <Prompt>whereis luis</Prompt>
              <div className={`mb-4 pl-4 text-xs ${textSecondary} leading-5`}>
                {personal.location} · open to relocating within Canada
              </div>

              <Prompt>cat availability.txt</Prompt>
              <div className={`mb-4 pl-4 text-xs ${textSecondary} leading-5`}>
                <span className="inline-block w-2 h-2 rounded-full bg-terminal-green animate-pulse mr-1.5" />
                ML/Data co-op — Fall 2026 · open to full-time after graduation
              </div>

              <Prompt>echo $EMAIL</Prompt>
              <div className="pl-4 flex flex-wrap items-center gap-3">
                <a
                  href={MAILTO}
                  className={`text-sm break-all hover:underline underline-offset-4 ${
                    dark ? 'text-terminal-blue' : 'text-[#0969da]'
                  }`}
                >
                  {personal.email}
                </a>
                <CopyEmail dark={dark} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <a
              href={MAILTO}
              className={`flex items-center justify-center gap-2 font-mono text-xs px-4 py-3 rounded border transition-all duration-200 ${
                dark
                  ? 'bg-terminal-green/10 border-terminal-green/30 text-terminal-green hover:bg-terminal-green/15 hover:border-terminal-green/60'
                  : 'bg-[rgba(26,127,55,0.08)] border-[rgba(26,127,55,0.3)] text-[#1a7f37] hover:bg-[rgba(26,127,55,0.14)]'
              }`}
            >
              <Mail size={13} /> send an email
            </a>

            <a href={personal.cvUrl} download className={secondaryBtn}>
              <FileDown size={13} /> download resume
            </a>

            <div className="grid grid-cols-2 gap-3">
              <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer me"
                 className={`${secondaryBtn} ${dark ? 'hover:!text-terminal-blue' : 'hover:!text-[#0969da]'}`}>
                <Linkedin size={13} /> linkedin
              </a>
              <a href={personal.socials.github} target="_blank" rel="noopener noreferrer me"
                 className={`${secondaryBtn} ${dark ? 'hover:!text-terminal-green' : 'hover:!text-[#1a7f37]'}`}>
                <Github size={13} /> github
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
