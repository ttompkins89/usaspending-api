'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export type TocItem = { id: string; text: string; level: 2 | 3 };

// Lists the page's headings (or the items passed in) and highlights the one being read.
export function OnThisPage({ items: given, children }: { items?: TocItem[]; children?: React.ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>(given || []);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (given) { setItems(given); return; }
    const root = document.querySelector('.doc-body');
    if (!root) return;
    const hs = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]')).filter((h) => !h.closest('[data-toc-skip]'));
    setItems(hs.map((h) => ({ id: h.id, text: h.textContent || '', level: h.tagName === 'H3' ? 3 : 2 })));
  }, [given, pathname]);

  useEffect(() => {
    if (!items.length) return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-72px 0px -65% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  if (!items.length && !children) return <aside className="rail" aria-hidden="true" />;
  return (
    <aside className="rail" aria-label="On this page">
      {items.length ? (
        <>
          <p className="rail-title">On this page</p>
          <ul>
            {items.map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`} className={`lvl-${i.level}${active === i.id ? ' is-active' : ''}`} aria-current={active === i.id ? 'location' : undefined}
                  onClick={() => { const el = document.getElementById(i.id); if (el instanceof HTMLDetailsElement) el.open = true; }}>
                  {i.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {children ? <div className="rail-extra">{children}</div> : null}
    </aside>
  );
}
