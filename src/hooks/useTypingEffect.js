import { useState, useEffect, useRef } from 'react';

/**
 * Cycles through an array of strings with a typing + deleting effect.
 * Returns the current display string and a boolean for the active cursor.
 */
export function useTypingEffect(lines, { typeSpeed = 80, deleteSpeed = 45, pauseMs = 1600 } = {}) {
  const [displayText, setDisplayText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'pausing' | 'deleting'
  const charIndex = useRef(0);

  useEffect(() => {
    if (!lines || lines.length === 0) return;

    let timeout;

    if (phase === 'typing') {
      const target = lines[lineIndex];
      if (charIndex.current < target.length) {
        timeout = setTimeout(() => {
          setDisplayText(target.slice(0, charIndex.current + 1));
          charIndex.current += 1;
        }, typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), pauseMs);
      }
    } else if (phase === 'pausing') {
      setPhase('deleting');
    } else if (phase === 'deleting') {
      if (charIndex.current > 0) {
        timeout = setTimeout(() => {
          charIndex.current -= 1;
          setDisplayText(lines[lineIndex].slice(0, charIndex.current));
        }, deleteSpeed);
      } else {
        setLineIndex((prev) => (prev + 1) % lines.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, displayText, lineIndex, lines, typeSpeed, deleteSpeed, pauseMs]);

  return displayText;
}

/**
 * IntersectionObserver hook for scroll-triggered reveal animations.
 */
export function useReveal(threshold = 0.1) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
