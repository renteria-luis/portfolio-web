import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const LANGS = ['en', 'es'];

const LangContext = createContext({ lang: 'en', setLang: () => {}, toggle: () => {} });

/**
 * Resolves a { en, es } bundle to the active language. Anything that is not a
 * bundle passes straight through, so content that should never be translated
 * (technology names, project names, terminal commands) is simply left as a
 * plain string in data.js.
 */
export const pick = (value, lang) =>
  value && typeof value === 'object' && !Array.isArray(value) && ('en' in value || 'es' in value)
    ? value[lang] ?? value.en
    : value;

function initialLang() {
  try {
    const stored = localStorage.getItem('lang');
    if (LANGS.includes(stored)) return stored;
    // No geolocation lookup: navigator.language is the visitor's own stated
    // preference, which is both more accurate than an IP guess and does not
    // need a third-party service. Default stays English.
    return String(navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    try { localStorage.setItem('lang', lang); } catch { /* private mode */ }
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    toggle: () => setLang((l) => (l === 'en' ? 'es' : 'en')),
  }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** `const t = useT()` then `t(project.description)`. */
export function useT() {
  const { lang } = useLang();
  return useMemo(() => (value) => pick(value, lang), [lang]);
}
