'use client';
import { useEffect, useId, useState } from 'react';
import { Icon } from './Icon';

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); }
  }
  return (
    <button type="button" className="code-copy" onClick={copy} aria-live="polite">
      <Icon name={copied ? 'check' : 'copy'} className="icon" />{copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function CodeFrame({ code, html, label }: { code: string; html: string; label: string }) {
  return (
    <figure className="code">
      <figcaption className="code-bar"><span className="code-label">{label}</span><CopyButton code={code} /></figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}

// Language tabs. The chosen language is remembered and shared by every tab set on the page.
const EVT = 'codetabs:change';
export function CodeTabsClient({ tabs, group }: { tabs: { label: string; lang: string; code: string; html: string }[]; group: string }) {
  const id = useId();
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const pick = (label: string | null) => { const i = tabs.findIndex((t) => t.label === label); if (i >= 0) setSel(i); };
    try { pick(localStorage.getItem(`tabs:${group}`)); } catch { /* storage unavailable */ }
    const on = (e: Event) => { const d = (e as CustomEvent).detail; if (d.group === group) pick(d.label); };
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, [tabs, group]);
  function choose(i: number) {
    setSel(i);
    try { localStorage.setItem(`tabs:${group}`, tabs[i].label); } catch { /* storage unavailable */ }
    window.dispatchEvent(new CustomEvent(EVT, { detail: { group, label: tabs[i].label } }));
  }
  function onKey(e: React.KeyboardEvent, i: number) {
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else return;
    e.preventDefault();
    choose(n);
    document.getElementById(`${id}-tab-${n}`)?.focus();
  }
  const t = tabs[sel];
  return (
    <figure className="code">
      <figcaption className="code-bar">
        <div className="code-tabs" role="tablist" aria-label="Language">
          {tabs.map((x, i) => (
            <button key={x.label} id={`${id}-tab-${i}`} type="button" role="tab" className="code-tab" aria-selected={i === sel} aria-controls={`${id}-panel`} tabIndex={i === sel ? 0 : -1} onClick={() => choose(i)} onKeyDown={(e) => onKey(e, i)}>
              {x.label}
            </button>
          ))}
        </div>
        <CopyButton code={t.code} />
      </figcaption>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${sel}`} dangerouslySetInnerHTML={{ __html: t.html }} />
    </figure>
  );
}
