import Link from 'next/link';
import { docs, sectionFeatures, featureEndpoints, endpointHref } from '@/lib/docs';
import { MethodBadge } from './MethodBadge';

export function Sidebar({ activeFeature, activeEndpoint }: { activeFeature?: string; activeEndpoint?: string }) {
  return (
    <nav className="sidebar" aria-label="Reference">
      <Link href="/reference" className="sidebar-top">All endpoints</Link>
      {docs.sections.map((s) => (
        <div key={s.id} className="sidebar-section">
          <p className="sidebar-heading">{s.title}</p>
          <ul>
            {sectionFeatures(s.id).map((f) => {
              const open = f.id === activeFeature;
              return (
                <li key={f.id}>
                  <Link href={`/reference/${f.id}`} aria-current={open && !activeEndpoint ? 'page' : undefined} className={open ? 'is-open' : undefined}>
                    {f.title} <span className="count">{f.endpointIds.length}</span>
                  </Link>
                  {open ? (
                    <ul className="sidebar-endpoints">
                      {featureEndpoints(f).map((e) => (
                        <li key={e.id}>
                          <Link href={endpointHref(e)} aria-current={e.id === activeEndpoint ? 'page' : undefined}>
                            <MethodBadge method={e.method} size="sm" />
                            <span>{e.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
