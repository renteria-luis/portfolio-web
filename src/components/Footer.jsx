import { Github, Linkedin, Mail, FileDown } from 'lucide-react';
import { personal } from '../config/data';

const LINKS = [
  { href: personal.socials.github,   label: 'GitHub',   Icon: Github,   hover: 'hover:text-terminal-green',  external: true },
  { href: personal.socials.linkedin, label: 'LinkedIn', Icon: Linkedin, hover: 'hover:text-terminal-blue',   external: true },
  { href: `mailto:${personal.email}`, label: 'Email',   Icon: Mail,     hover: 'hover:text-terminal-purple' },
  { href: personal.cvUrl,            label: 'CV',       Icon: FileDown, hover: 'hover:text-terminal-orange', download: true },
];

export default function Footer() {
  return (
    <footer className="py-10 border-t border-line/[0.08] bg-footerbg/90">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="font-mono text-xs text-t3">
            <span className="text-terminal-green/50">luis@portfolio</span>
            <span>:~$ </span>
            <span>echo "Thanks for visiting 👾"</span>
          </div>

          <div className="flex items-center gap-3">
            {LINKS.map(({ href, label, Icon, hover, external, download }, i) => (
              <span key={label} className="flex items-center gap-3">
                {i > 0 && <span className="text-t3">·</span>}
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  {...(download ? { download: true } : {})}
                  className={`flex items-center gap-1.5 font-mono text-[11px] text-t3 transition-colors ${hover}`}
                >
                  <Icon size={12} /> {label}
                </a>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-line/[0.08] text-center font-mono text-[10px] text-t3">
          © {new Date().getFullYear()} {personal.name} · {personal.location}
        </div>
      </div>
    </footer>
  );
}
