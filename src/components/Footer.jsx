import { Github, Linkedin, Mail, FileDown } from 'lucide-react';
import { personal } from '../config/data';
import { ui } from '../i18n/ui';
import { useT } from '../i18n';

export default function Footer({ dark }) {
  const t = useT();
  const textSecondary = dark ? 'text-[#7b8fa6]' : 'text-[#576c80]';

  return (
    <footer
      className={`py-10 border-t ${
        dark
          ? 'bg-[rgba(7,9,14,0.9)] border-[rgba(139,151,168,0.07)]'
          : 'bg-[rgba(238,241,247,0.92)] border-[rgba(30,50,80,0.09)]'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Left: Prompt */}
          <div className={`font-mono text-xs ${textSecondary}`}>
            <span className={dark ? 'text-terminal-green/50' : 'text-[#197934]/50'}>luis@portfolio</span>
            <span className={dark ? 'text-[#7b8fa6]' : 'text-[#576c80]'}>:~$ </span>
            <span>{t(ui.footer.thanks)}</span>
          </div>

          {/* Right: Social links */}
          <div className="flex items-center gap-3">
            <a
              href={personal.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
                dark ? 'text-[#7b8fa6] hover:text-terminal-green' : 'text-[#576c80] hover:text-[#197934]'
              }`}
            >
              <Github size={12} /> GitHub
            </a>
            <span className={textSecondary}>·</span>
            <a
              href={personal.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
                dark ? 'text-[#7b8fa6] hover:text-terminal-blue' : 'text-[#576c80] hover:text-[#0969da]'
              }`}
            >
              <Linkedin size={12} /> LinkedIn
            </a>
            <span className={textSecondary}>·</span>
            <a
              href={`mailto:${personal.email}`}
              className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
                dark ? 'text-[#7b8fa6] hover:text-terminal-purple' : 'text-[#576c80] hover:text-[#7c3aed]'
              }`}
            >
              <Mail size={12} /> Email
            </a>
            <span className={textSecondary}>·</span>
            <a
              href={personal.cvUrl}
              download
              className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
                dark ? 'text-[#7b8fa6] hover:text-terminal-orange' : 'text-[#576c80] hover:text-[#b45309]'
              }`}
            >
              <FileDown size={12} /> CV
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className={`mt-6 pt-4 border-t text-center font-mono text-[10px] ${textSecondary} ${
          dark ? 'border-[rgba(139,151,168,0.07)]' : 'border-[rgba(30,50,80,0.08)]'
        }`}>
          © {new Date().getFullYear()} {personal.name} · {t(personal.location)}
        </div>
      </div>
    </footer>
  );
}
