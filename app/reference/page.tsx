import type { Metadata } from 'next';
import Link from 'next/link';
import { docs, sectionFeatures, featureEndpoints, endpointHref, siteUrl } from '@/lib/docs';
import { MethodBadge } from '@/components/MethodBadge';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = { title: 'Reference' };

export default function Reference() {
  return (
    <div className="with-sidebar">
      <Sidebar />
      <div className="content">
        <header className="page-head">
          <p className="eyebrow">Reference</p>
          <h1>All {docs.endpoints.length} endpoints</h1>
          <p className="lede">Grouped by the usaspending.gov feature each one powers, under the site&apos;s four menus.</p>
        </header>
        {docs.sections.map((s) => (
          <section key={s.id} className="ref-section" aria-labelledby={`sec-${s.id}`}>
            <h2 id={`sec-${s.id}`}>{s.title}</h2>
            <p className="muted">{s.blurb}</p>
            {sectionFeatures(s.id).map((f) => (
              <div key={f.id} className="ref-feature">
                <div className="ref-feature-head">
                  <h3><Link href={`/reference/${f.id}`}>{f.title}</Link></h3>
                  {siteUrl(f.siteRoute) ? <a className="site-link" href={siteUrl(f.siteRoute)!}>On usaspending.gov <span aria-hidden="true">↗</span></a> : null}
                </div>
                <ul className="endpoint-list">
                  {featureEndpoints(f).map((e) => (
                    <li key={e.id}>
                      <Link href={endpointHref(e)}>
                        <MethodBadge method={e.method} size="sm" />
                        <span className="endpoint-title">{e.title}</span>
                        <code className="endpoint-path">{e.path.replace('/api', '')}</code>
                        {e.status !== 'stable' ? <span className={`status status-${e.status}`}>{e.status === 'in-development' ? 'In development' : 'Deprecated'}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
