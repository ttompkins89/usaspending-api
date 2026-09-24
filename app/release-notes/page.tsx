import type { Metadata } from 'next';
import Link from 'next/link';
import { releases, formatDate, RELEASE_LOG } from '@/lib/resources';
import { endpoint, endpointHref } from '@/lib/docs';
import { DocPage } from '@/components/DocPage';
import { Markdown } from '@/components/Markdown';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'Release notes', description: 'usaspending.gov release notes, with the API-related changes called out.' };

export default function ReleaseNotes() {
  const years = [...new Set(releases.map((r) => r.date.slice(0, 4)))];
  const apiCount = releases.filter((r) => r.apiItems.length).length;
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'Release notes' }]}
      title="Release notes"
      lede={<>What changed on usaspending.gov, release by release. Items that mention the API are pulled out in a highlighted box, and endpoints named in a note link to their reference pages.</>}
      head={<div className="feature-links"><a href={RELEASE_LOG}>From the usaspending-website Release Log <Icon name="external" /></a><span className="pill">{releases.length} releases</span><span className="pill pill-teal">{apiCount} mention the API</span></div>}
      toc={years.map((y) => ({ id: `y${y}`, text: y, level: 2 as const }))}
    >
      {!releases.length ? <p className="unavailable">Release notes couldn&apos;t be loaded in this build. The <a href={RELEASE_LOG}>Release Log</a> has them all.</p> : null}
      <div className="callout"><Icon name="info" /><p>For changes to the API itself, such as new fields or endpoints, see the <Link href="/changelog">API changelog</Link>, which is built from the contract history.</p></div>
      {years.map((y) => (
        <section key={y} aria-labelledby={`y${y}`}>
          <h2 id={`y${y}`}>{y}</h2>
          {releases.filter((r) => r.date.startsWith(y)).map((r) => {
            const eps = r.endpoints.map(endpoint).filter(Boolean);
            return (
              <article key={r.id} id={r.id} className="release" data-toc-skip>
                <h3 className="release-date"><a href={`#${r.id}`}>{formatDate(r.date)}</a></h3>
                {r.apiItems.length ? (
                  <div className="release-api">
                    <p>Mentions the API</p>
                    <ul>{r.apiItems.map((a, i) => <li key={i}><Markdown className="inline">{a}</Markdown></li>)}</ul>
                    {eps.length ? <div className="pills" style={{ marginTop: 6 }}>{eps.map((e) => <Link key={e!.id} className="pill pill-mono" href={endpointHref(e!)}>{e!.method} {e!.path}</Link>)}</div> : null}
                  </div>
                ) : null}
                {r.sections.map((s, i) => (
                  <div key={i}>
                    <h4 className="release-section">{s.title}</h4>
                    <Markdown>{s.markdown}</Markdown>
                  </div>
                ))}
              </article>
            );
          })}
        </section>
      ))}
    </DocPage>
  );
}
