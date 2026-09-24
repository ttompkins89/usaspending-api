import Link from 'next/link';
import { OnThisPage, type TocItem } from './OnThisPage';

export type Crumb = { href?: string; label: string };

// The standard page frame: breadcrumbs, title, lede, body, and the on-this-page rail.
export function DocPage({
  crumbs, eyebrow, title, lede, head, children, toc, rail, wide,
}: {
  crumbs?: Crumb[]; eyebrow?: string; title: React.ReactNode; lede?: React.ReactNode; head?: React.ReactNode;
  children: React.ReactNode; toc?: TocItem[]; rail?: React.ReactNode; wide?: boolean;
}) {
  return (
    <div className={`doc${wide ? ' wide' : ''}`}>
      <article className="doc-body" id="content" tabIndex={-1}>
        <header className="page-head">
          {crumbs?.length ? (
            <nav aria-label="Breadcrumb" className="crumbs">
              {crumbs.map((c, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  {i ? <span aria-hidden="true">/</span> : null}
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                </span>
              ))}
            </nav>
          ) : null}
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {lede ? <p className="lede">{lede}</p> : null}
          {head}
        </header>
        {children}
      </article>
      {wide ? null : <OnThisPage items={toc}>{rail}</OnThisPage>}
    </div>
  );
}
