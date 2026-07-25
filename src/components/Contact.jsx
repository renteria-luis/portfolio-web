import { useState } from 'react';
import { Mail, Github, Linkedin, FileDown, Copy, Check } from 'lucide-react';
import { personal } from '../config/data';
import { useReveal } from '../hooks/useTypingEffect';

const Prompt = ({ children }) => (
  <div className="mb-1 text-t2">
    <span className="text-terminal-green">❯</span> <span className="text-t1">{children}</span>
  </div>
);

function CopyEmail() {
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
      className="group/copy flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded border border-line/15 text-t3 hover:text-t1 hover:border-line/30 transition-colors"
      aria-label={copied ? 'Email copied to clipboard' : 'Copy email address'}
    >
      {copied ? <Check size={11} className="text-terminal-green" /> : <Copy size={11} />}
      {copied ? 'copied' : 'copy'}
    </button>
  );
}

export default function Contact() {
  const ref = useReveal(0.08);

  return (
    <section id="contact" className="py-24 max-w-5xl mx-auto px-6">
      <div ref={ref} className="reveal">
        <div className="mb-12">
          <p className="font-mono text-xs mb-2 text-terminal-green">05 / contact</p>
          <h2 className="font-mono text-2xl font-semibold section-title text-t1">let's talk</h2>
          <p className="mt-3 text-sm text-t2">
            Actively looking for an ML/Data co-op for Fall 2026. If you're hiring — or just want to
            talk about RAG, MLOps or graph ML — my inbox is open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Terminal card */}
          <div className="lg:col-span-3 rounded-lg border border-line/10 bg-surface overflow-hidden shadow-xl">
            <div className="terminal-header">
              <div className="terminal-dot bg-terminal-red" />
              <div className="terminal-dot bg-terminal-yellow" />
              <div className="terminal-dot bg-terminal-green" />
              <span className="ml-2 font-mono text-xs text-t2">luis@ml-portfolio:~/contact</span>
            </div>

            <div className="p-5 font-mono text-sm leading-relaxed">
              <Prompt>whereis luis</Prompt>
              <div className="mb-4 pl-4 text-xs text-t2 leading-5">
                {personal.location} · open to relocating within Canada
              </div>

              <Prompt>cat availability.txt</Prompt>
              <div className="mb-4 pl-4 text-xs text-t2 leading-5">
                <span className="inline-block w-2 h-2 rounded-full bg-terminal-green animate-pulse mr-1.5" />
                ML/Data co-op — Fall 2026 · open to full-time after graduation
              </div>

              <Prompt>echo $EMAIL</Prompt>
              <div className="pl-4 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${personal.email}?subject=${encodeURIComponent('Hi Luis — opportunity')}`}
                  className="text-terminal-blue text-sm break-all hover:underline underline-offset-4"
                >
                  {personal.email}
                </a>
                <CopyEmail />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <a
              href={`mailto:${personal.email}?subject=${encodeURIComponent('Hi Luis — opportunity')}`}
              className="flex items-center justify-center gap-2 font-mono text-xs px-4 py-3 rounded border bg-terminal-green/10 border-terminal-green/30 text-terminal-green hover:bg-terminal-green/[0.18] hover:border-terminal-green/60 transition-all duration-200"
            >
              <Mail size={13} /> send an email
            </a>
            <a
              href={personal.cvUrl}
              download
              className="flex items-center justify-center gap-2 font-mono text-xs px-4 py-3 rounded border border-line/15 text-t2 hover:text-t1 hover:border-line/30 transition-all duration-200"
            >
              <FileDown size={13} /> download resume
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={personal.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                className="flex items-center justify-center gap-2 font-mono text-xs px-3 py-3 rounded border border-line/15 text-t2 hover:text-terminal-blue hover:border-terminal-blue/40 transition-all duration-200"
              >
                <Linkedin size={13} /> linkedin
              </a>
              <a
                href={personal.socials.github}
                target="_blank"
                rel="noopener noreferrer me"
                className="flex items-center justify-center gap-2 font-mono text-xs px-3 py-3 rounded border border-line/15 text-t2 hover:text-terminal-green hover:border-terminal-green/40 transition-all duration-200"
              >
                <Github size={13} /> github
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
