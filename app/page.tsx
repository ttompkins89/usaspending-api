import Link from 'next/link';
import { docs, sectionFeatures, endpoint, endpointHref } from '@/lib/docs';
import { GUIDES } from '@/lib/guides';
import { FEATURE_ICONS } from '@/lib/nav';
import { releases, changes, formatDate, commitUrl } from '@/lib/resources';
import { DocPage } from '@/components/DocPage';
import { Icon } from '@/components/Icon';

const START = [
  { href: '/quickstart', icon: 'play', title: 'Quickstart', body: 'Make your first request in under a minute. No key, no sign-up.' },
  { href: '/award-and-account-data', icon: 'split', title: 'Award and account data', body: 'The two families of spending data, and how to tell which one you need.' },
  { href: '/filters', icon: 'filter', title: 'The filter object', body: 'One object drives every search endpoint. Every filter, with examples.' },
  { href: '/paging-and-downloads', icon: 'download', title: 'Paging and downloads', body: 'Page through results, then switch to file downloads for big pulls.' },
];

export default function Overview() {
  const latest = releases.slice(0, 3);
  const recent = changes.slice(0, 6);
  const updated = docs.generatedAt.slice(0, 10);
  return (
    <DocPage
      eyebrow="Independent developer reference"
      title="Build with the API behind usaspending.gov"
      lede={<>Every chart, table, and profile on usaspending.gov is a call to a public API. These docs follow the site page by page, so you can find the endpoint behind anything you see and call it yourself.</>}
      head={
        <div className="hero-actions">
          <Link href="/quickstart" className="button button-lg">Start the quickstart <Icon name="arrow" /></Link>
          <Link href="/reference" className="button button-ghost button-lg">Browse {docs.endpoints.length} endpoints</Link>
        </div>
      }
    >
      <div className="facts" role="list">
        <div className="fact" role="listitem"><strong>{docs.endpoints.length}</strong><span>endpoints, each with a live console</span></div>
        <div className="fact" role="listitem"><strong>No key</strong><span>Public, free, JSON in and out</span></div>
        <div className="fact" role="listitem"><strong><code>/api/v2/</code></strong><span>on api.usaspending.gov</span></div>
        <div className="fact" role="listitem"><strong>{formatDate(updated).replace(/, \d{4}$/, '')}</strong><span>Contracts last pulled</span></div>
      </div>

      <h2 id="start-here">Start here</h2>
      <div className="cards">
        {START.map((c) => (
          <Link key={c.href} href={c.href} className="card">
            <span className="card-icon"><Icon name={c.icon} /></span>
            <span className="card-title">{c.title}</span>
            <p className="card-body">{c.body}</p>
          </Link>
        ))}
      </div>

      <h2 id="by-site-menu">Browse by site menu</h2>
      <p>The reference follows usaspending.gov&apos;s four main menus. Each feature lists the endpoints that page calls.</p>
      <div className="menus">
        {docs.sections.map((s) => (
          <section key={s.id} className="menu" aria-labelledby={`menu-${s.id}`}>
            <h3 id={`menu-${s.id}`}>{s.title}</h3>
            <p>{s.blurb}</p>
            <ul>
              {sectionFeatures(s.id).map((f) => (
                <li key={f.id}>
                  <Link href={`/reference/${f.id}`}><Icon name={FEATURE_ICONS[f.id] || 'dot'} />{f.title}<span className="count">{f.endpointIds.length}</span></Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="section-head"><h2 id="guides">How the site uses the API</h2><Link href="/guides">All guides</Link></div>
      <p>Guides trace one usaspending.gov page from load to last chart, in the order the page makes its calls.</p>
      <div className="cards">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="card">
            <span className="card-icon"><Icon name="guide" /></span>
            <span className="card-title">{g.title}</span>
            <p className="card-body">{g.summary}</p>
            <span className="pills" style={{ marginTop: 'auto' }}><span className="pill">{g.calls.length} calls</span></span>
          </Link>
        ))}
      </div>

      <h2 id="whats-new">What&apos;s new</h2>
      <div className="two-col">
        <section aria-labelledby="new-releases">
          <div className="section-head" style={{ marginTop: 0 }}><h3 id="new-releases" style={{ margin: 0 }}>Site release notes</h3><Link href="/release-notes">All releases</Link></div>
          <ul className="feed">
            {latest.map((r) => (
              <li key={r.id}>
                <div className="feed-meta"><time dateTime={r.date}>{formatDate(r.date)}</time>{r.apiItems.length ? <span className="pill pill-teal">API</span> : null}</div>
                <Link className="feed-title" href={`/release-notes#${r.id}`}>{r.sections.map((s) => s.title).join(' · ') || r.title}</Link>
                <p className="muted">{r.sections.reduce((n, s) => n + (s.markdown.match(/^\s*[*-] /gm)?.length || 0), 0)} changes</p>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="new-changes">
          <div className="section-head" style={{ marginTop: 0 }}><h3 id="new-changes" style={{ margin: 0 }}>API contract changes</h3><Link href="/changelog">Full changelog</Link></div>
          <ul className="feed">
            {recent.map((c) => {
              const eps = c.endpoints.map(endpoint).filter(Boolean);
              return (
                <li key={c.sha}>
                  <div className="feed-meta"><time dateTime={c.date}>{formatDate(c.date)}</time>{c.ticket ? <a href={commitUrl(c.sha)}>{c.ticket}</a> : null}</div>
                  {eps[0] ? <Link className="feed-title" href={endpointHref(eps[0]!)}>{eps[0]!.title}</Link> : <span className="feed-title">{c.summary}</span>}
                  <p className="muted">{c.summary}{eps.length > 1 ? `, and ${eps.length - 1} more` : ''}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </DocPage>
  );
}
