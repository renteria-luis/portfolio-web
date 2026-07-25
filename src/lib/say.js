/** Ask the companion to speak a line. No-op when the line is empty. */
export const say = (text) =>
  text && window.dispatchEvent(new CustomEvent('companionSay', { detail: text }));
