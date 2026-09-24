'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { NavGroup, NavItem } from '@/lib/nav';
import { Icon } from './Icon';
import { SearchDialog } from './SearchDialog';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || (href !== '/reference' && href !== '/guides' && pathname.startsWith(`${href}/`));
}

function Items({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <ul className="nav-list">
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} aria-current={isActive(pathname, it.href) ? 'page' : undefined}>
            {it.icon ? <Icon name={it.icon} /> : null}
            <span>{it.label}</span>
            {it.count !== undefined ? <span className="count" aria-label={`${it.count} endpoints`}>{it.count}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  useEffect(() => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'); }, []);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
    setTheme(next);
  }
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button type="button" className="icon-button" onClick={toggle} aria-label={label} title={label}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}

export function Shell({ groups, children }: { groups: NavGroup[]; children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="topbar">
        <button type="button" className="icon-button menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="sidebar" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
        <Link href="/" className="brand" aria-label="USAspending API Reference, independent docs, home">
          <span className="brand-name">USAspending API <span>Reference</span></span>
          <span className="tag">Independent</span>
        </Link>
        <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search the docs">
          <Icon name="search" />
          <span>Search endpoints, guides, terms</span>
          <kbd>⌘K</kbd>
        </button>
        <div className="topbar-actions">
          <Link href="/quickstart#try" className="button try-button"><Icon name="terminal" />Try the API</Link>
          <a className="icon-button gh-link" href="https://github.com/ttompkins89/usaspending-api" aria-label="Source on GitHub" title="Source on GitHub"><Icon name="github" /></a>
          <ThemeToggle />
        </div>
      </header>
      <div className="shell">
        <nav id="sidebar" className={`sidebar${open ? ' is-open' : ''}`} aria-label="Docs">
          {groups.map((g) => (
            <details key={g.title} className="nav-group" open>
              <summary>{g.title}<Icon name="chevron" className="chev" /></summary>
              <Items items={g.items} pathname={pathname} />
              {g.sub?.map((s) => {
                const hasActive = s.items.some((it) => isActive(pathname, it.href));
                return (
                  <details key={s.title} className="nav-sub" open={hasActive || undefined}>
                    <summary>{s.title}<Icon name="chevron" className="chev" /></summary>
                    <Items items={s.items} pathname={pathname} />
                  </details>
                );
              })}
            </details>
          ))}
        </nav>
        {open ? <button type="button" className="scrim is-open" aria-label="Close navigation" onClick={close} /> : null}
        <div className="main">
          {children}
          <footer className="footer">
            <p>
              An independent reference for the public USAspending API, designed and built by Tanika Tompkins. Not affiliated with,
              endorsed by, or operated by the U.S. Department of the Treasury or USAspending.gov. Endpoint pages are generated from the
              API&apos;s public contracts; the live console calls <code>api.usaspending.gov</code> directly.
            </p>
            <div className="footer-links">
              <Link href="/about">About these docs</Link>
              <a href="https://github.com/ttompkins89/usaspending-api">Source</a>
              <a href="https://api.usaspending.gov">Official API site</a>
              <a href="https://www.usaspending.gov">usaspending.gov</a>
            </div>
          </footer>
        </div>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
