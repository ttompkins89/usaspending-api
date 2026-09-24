'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';

type Entry = { t: string; s: string; h: string; k: string; m?: string; x?: string };

const KIND_ICON: Record<string, string> = { Endpoint: 'code', Feature: 'layers', Guide: 'guide', Page: 'file', Term: 'book', Release: 'megaphone' };

function score(e: Entry, words: string[]) {
  const title = e.t.toLowerCase();
  const hay = `${title} ${e.s.toLowerCase()} ${(e.x || '').toLowerCase()}`;
  let total = 0;
  for (const w of words) {
    if (!hay.includes(w)) return 0;
    if (title.startsWith(w)) total += 6;
    else if (title.includes(w)) total += 4;
    else if (e.s.toLowerCase().includes(w)) total += 2;
    else total += 1;
  }
  if (e.k === 'Feature' || e.k === 'Guide') total += 1;
  return total;
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setTimeout(() => input.current?.focus(), 0);
      if (!index) fetch('/search-index.json').then((r) => r.json()).then(setIndex).catch(() => setFailed(true));
    } else if (!open && d.open) d.close();
  }, [open, index]);

  const results = useMemo(() => {
    if (!index) return [];
    const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return index.filter((e) => e.k === 'Guide' || e.k === 'Page').slice(0, 10);
    return index.map((e) => ({ e, s: score(e, words) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 30).map((r) => r.e);
  }, [index, q]);

  useEffect(() => { setSel(0); }, [q]);

  function go(e?: Entry) {
    if (!e) return;
    onClose();
    setQ('');
    if (e.h.startsWith('http')) window.location.href = e.h;
    else router.push(e.h);
  }
  function onKey(ev: React.KeyboardEvent) {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (ev.key === 'Enter') { ev.preventDefault(); go(results[sel]); }
  }
  useEffect(() => {
    document.getElementById(`sr-${sel}`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  return (
    <dialog ref={ref} className="search-dialog" aria-label="Search the docs" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="search-box">
        <Icon name="search" />
        <input
          ref={input}
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search endpoints, paths, guides, glossary terms"
          aria-label="Search"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-results"
          aria-activedescendant={results.length ? `sr-${sel}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close search"><Icon name="close" /></button>
      </div>
      {failed ? <p className="search-empty">Search couldn&apos;t load. Try again in a moment.</p> : !index ? <p className="search-empty">Loading…</p> : results.length ? (
        <ul className="search-results" id="search-results" role="listbox">
          {results.map((e, i) => (
            <li key={`${e.h}-${i}`} role="presentation">
              <a id={`sr-${i}`} href={e.h} role="option" aria-selected={i === sel} onClick={(ev) => { ev.preventDefault(); go(e); }} onMouseMove={() => setSel(i)}>
                {e.m ? <span className={`method method-sm method-${e.m.toLowerCase()}`}>{e.m}</span> : <Icon name={KIND_ICON[e.k] || 'dot'} />}
                <span className="r-main"><span className="r-title">{e.t}</span><span className="r-sub">{e.s}</span></span>
                <span className="r-kind">{e.k}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : <p className="search-empty">No matches for “{q}”.</p>}
      <div className="search-foot" aria-hidden="true"><span><kbd>↑</kbd> <kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div>
    </dialog>
  );
}
