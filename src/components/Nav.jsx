import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Moon, Sun, FileDown, Menu, X } from 'lucide-react';
import { personal } from '../config/data';

const navLinks = [
  { label: 'about',      href: '#about'      },
  { label: 'experience', href: '#experience' },
  { label: 'projects',   href: '#projects'   },
  { label: 'skills',     href: '#skills'     },
  { label: 'contact',    href: '#contact'    },
];

const socials = [
  { href: personal.socials.github,    label: 'GitHub',   Icon: Github,   hover: 'hover:text-terminal-green',  me: true },
  { href: personal.socials.linkedin,  label: 'LinkedIn', Icon: Linkedin, hover: 'hover:text-terminal-blue',   me: true },
  { href: `mailto:${personal.email}`, label: 'Email',    Icon: Mail,     hover: 'hover:text-terminal-purple' },
];

export default function Nav({ dark, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 36);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 nav-blur nav-bar ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

        <a href="#hero" className="font-mono text-sm font-medium tracking-tight text-terminal-green">
          <span className="text-t2">~/</span>luis
          <span className="cursor-blink ml-[2px]">▊</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link font-mono text-xs font-medium text-t2 hover:text-t1 transition-colors"
            >
              <span className="text-terminal-green/50">./</span>{link.label}
            </a>
          ))}

          <div className="w-px h-4 bg-line/20" />

          <div className="flex items-center gap-3">
            {socials.map(({ href, label, Icon, hover, me }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: me ? 'noopener noreferrer me' : 'noopener noreferrer' })}
                aria-label={label}
                className={`text-t2 transition-colors ${hover}`}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          <a
            href={personal.cvUrl}
            download
            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded border border-terminal-green/25 text-terminal-green hover:bg-terminal-green/10 hover:border-terminal-green transition-all"
          >
            <FileDown size={12} />
            resume.pdf
          </a>

          <button
            onClick={toggleDark}
            className="p-1.5 rounded text-t2 hover:text-terminal-yellow transition-colors"
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="p-1.5 rounded text-t2"
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-1.5 rounded text-t2 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden px-6 py-4 flex flex-col gap-4 nav-blur nav-menu">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-mono text-sm text-t1"
            >
              <span className="text-terminal-green/50">~/</span>{link.label}
            </a>
          ))}
          <div className="flex items-center gap-4 pt-2">
            {socials.map(({ href, label, Icon, me }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: me ? 'noopener noreferrer me' : 'noopener noreferrer' })}
                className="text-t2"
              >
                <Icon size={16} />
              </a>
            ))}
            <a
              href={personal.cvUrl}
              download
              className="flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded border border-terminal-green/25 text-terminal-green"
            >
              <FileDown size={11} /> cv.pdf
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
