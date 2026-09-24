import 'server-only';
import { createHighlighter, type Highlighter } from 'shiki';

// One highlighter for the whole build. Code panels sit on a dark surface in both themes,
// so a single dark theme reads well in light and dark mode.
const THEME = 'github-dark-default';
const LANGS = ['json', 'bash', 'python', 'javascript'] as const;
const MAX = 60_000; // Very large response examples stay plain text to keep builds fast.

let hl: Promise<Highlighter> | null = null;
function highlighter() {
  if (!hl) hl = createHighlighter({ themes: [THEME], langs: [...LANGS] });
  return hl;
}
function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export async function highlight(code: string, lang = 'json') {
  const l = (LANGS as readonly string[]).includes(lang) ? lang : null;
  if (!l || code.length > MAX) return `<pre tabindex="0"><code>${escape(code)}</code></pre>`;
  const h = await highlighter();
  return h.codeToHtml(code, { lang: l, theme: THEME }).replace('<pre ', '<pre tabindex="0" ');
}
