// Small stroke icon set (24px grid, 1.75 stroke). Decorative by default.
const P: Record<string, string> = {
  home: 'M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10',
  play: 'M7 4.5v15l12-7.5z',
  split: 'M12 3v6M12 9l-6 6v6M12 9l6 6v6',
  filter: 'M3 5h18l-7 8.5V20l-4-2v-4.5z',
  download: 'M12 4v11M7 10l5 5 5-5M4 20h16',
  map: 'M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20',
  guide: 'M5 4h10a4 4 0 014 4v12H9a4 4 0 01-4-4zM5 16a4 4 0 014-4h10',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  search: 'M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM20 20l-4.8-4.8',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  text: 'M4 6h16M4 12h10M4 18h13',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  building: 'M4 21V8l8-5 8 5v13M9 21v-6h6v6M3 21h18',
  wallet: 'M4 7h14a2 2 0 012 2v9a2 2 0 01-2 2H5a1 1 0 01-1-1zM4 7l11-3v3M16 13.5h.01',
  users: 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M16 3.5a4 4 0 010 7.5M18 14a6 6 0 014 7',
  file: 'M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h7',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  archive: 'M3 4h18v4H3zM5 8v12h14V8M10 12h4',
  book: 'M4 5a2 2 0 012-2h13v15H6a2 2 0 00-2 2zM4 20a2 2 0 002 2h13v-4',
  check: 'M4 12.5l5 5L20 6.5',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  dot: 'M12 13a1 1 0 100-2 1 1 0 000 2z',
  megaphone: 'M3 10v4h3l7 4V6L6 10zM17 9a4 4 0 010 6M6 14l1.5 6',
  history: 'M3 12a9 9 0 103-6.7L3 8M3 3v5h5M12 7v5l3 2',
  table: 'M3 4h18v16H3zM3 10h18M3 15h18M9 10v10',
  link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5h.01',
  chevron: 'M9 6l6 6-6 6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  sun: 'M12 16a4 4 0 100-8 4 4 0 000 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  terminal: 'M4 5h16v14H4zM8 10l3 2-3 2M13 15h3',
  github: 'M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 00-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5',
};

export function Icon({ name, className = 'icon', label }: { name: string; className?: string; label?: string }) {
  const d = P[name] || P.dot;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      <path d={d} />
    </svg>
  );
}
