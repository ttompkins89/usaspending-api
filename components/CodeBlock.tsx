'use client';
import { useState } from 'react';

export function CodeBlock({ code, label, lang = 'json' }: { code: string; label?: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }
  return (
    <figure className="code">
      <figcaption className="code-bar">
        <span>{label || lang.toUpperCase()}</span>
        <button type="button" className="code-copy" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>
      <pre tabIndex={0}><code>{code}</code></pre>
    </figure>
  );
}
