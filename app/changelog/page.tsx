import type { Metadata } from 'next';
import Link from 'next/link';
import { changes, commitUrl, formatDate, CONTRACT_HISTORY } from '@/lib/resources';
import { endpoint, endpointHref } from '@/lib/docs';
import { DocPage } from '@/components/DocPage';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'API changelog', description: 'Every change to the USAspending API contracts, linked to the endpoints it touched.' };

const monthName = (ym: string) => new Date(`${ym}-15T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function Changelog() {
  const months = [...new Set(changes.map((c) => c.date.slice(0, 7)))];
  const touched = new Set(changes.flatMap((c) => c.endpoints));
  const newEps = changes.flatMap((c) => c.added);
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'API changelog' }]}
      title="API changelog"
      lede="Changes to the API contracts since October 2024, newest first. Each entry links to the endpoints it touched and the commit that made it."
      head={<div className="feature-links"><a href={CONTRACT_HISTORY}>Contract history on GitHub <Icon name="external" /></a><span className="pill">{changes.length} changes</span><span className="pill">{touched.size} endpoints touched</span>{newEps.length ? <span className="pill pill-teal">{newEps.length} new contracts</span> : null}</div>}
      toc={months.map((m) => ({ id: `m${m}`, text: monthName(m), level: 2 as const }))}
    >
      {!changes.length ? <p className="unavailable">The contract history couldn&apos;t be loaded in this build. <a href={CONTRACT_HISTORY}>See it on GitHub</a>.</p> : null}
      <div className="callout"><Icon name="info" /><p>Built from the git history of the <code className="inline-code">api_contracts</code> folder in the USAspending API repo. Formatting-only and tooling commits are left out. For changes to the website, see the <Link href="/release-notes">release notes</Link>.</p></div>
      {months.map((m) => (
        <section key={m} className="change-group" aria-labelledby={`m${m}`}>
          <h2 id={`m${m}`}>{monthName(m)}</h2>
          {changes.filter((c) => c.date.startsWith(m)).map((c) => {
            const eps = c.endpoints.map(endpoint).filter(Boolean);
            return (
              <div key={c.sha} className="change">
                <time dateTime={c.date}>{formatDate(c.date)}</time>
                <div>
                  <p className="change-summary">
                    {c.added.length ? <span className="pill pill-teal" style={{ marginRight: 6 }}>New</span> : null}
                    {c.removed.length ? <span className="pill pill-accent" style={{ marginRight: 6 }}>Removed</span> : null}
                    {c.summary}
                  </p>
                  <div className="pills">
                    {eps.map((e) => <Link key={e!.id} className="pill pill-mono" href={endpointHref(e!)}>{e!.method} {e!.path}</Link>)}
                    {c.removed.map((r) => <span key={r} className="pill pill-mono">{r}</span>)}
                    {c.touchesGuide ? <Link className="pill" href="/filters">Filter guide</Link> : null}
                    <a className="pill" href={commitUrl(c.sha)}>{c.ticket || c.sha.slice(0, 7)}</a>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </DocPage>
  );
}
