import type { Metadata } from 'next';
import Link from 'next/link';
import { docs, sectionFeatures, featureEndpoints, endpointHref, methodCounts } from '@/lib/docs';
import { DocPage } from '@/components/DocPage';
import { MethodBadge } from '@/components/MethodBadge';

export const metadata: Metadata = { title: 'API reference', description: 'Every USAspending API endpoint, grouped by the usaspending.gov feature that calls it.' };

export default function Reference() {
  const counts = methodCounts(docs.endpoints);
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'API reference' }]}
      title="API reference"
      lede={<>All {docs.endpoints.length} endpoints, grouped under usaspending.gov&apos;s four menus and the feature that calls each one.</>}
      head={<div className="feature-links"><span className="method-counts">{Object.entries(counts).map(([m, n]) => <span key={m} className="pills"><MethodBadge method={m} size="sm" /><span className="muted">{n}</span></span>)}</span></div>}
      toc={docs.sections.map((s) => ({ id: s.id, text: s.title, level: 2 as const }))}
    >
      {docs.sections.map((s) => (
        <section key={s.id} className="ref-section" aria-labelledby={s.id}>
          <h2 id={s.id}>{s.title}</h2>
          <p className="muted">{s.blurb}</p>
          {sectionFeatures(s.id).map((f) => (
            <div key={f.id} className="ref-feature">
              <div className="ref-feature-head">
                <h3 id={`f-${f.id}`}><Link href={`/reference/${f.id}`}>{f.title}</Link></h3>
                <span className="count">{f.endpointIds.length}</span>
              </div>
              <ul className="ref-rows">
                {featureEndpoints(f).map((e) => (
                  <li key={e.id}><Link href={endpointHref(e)}><MethodBadge method={e.method} size="sm" /><span>{e.title}</span><code>{e.path}</code></Link></li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </DocPage>
  );
}
