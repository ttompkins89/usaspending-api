import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { docs, feature as getFeature, featureEndpoints, endpointHref, siteUrl } from '@/lib/docs';
import { MethodBadge } from '@/components/MethodBadge';
import { Sidebar } from '@/components/Sidebar';

export function generateStaticParams() {
  return docs.features.map((f) => ({ feature: f.id }));
}

export function generateMetadata({ params }: { params: { feature: string } }): Metadata {
  const f = getFeature(params.feature);
  return { title: f ? f.title : 'Not found' };
}

export default function FeaturePage({ params }: { params: { feature: string } }) {
  const f = getFeature(params.feature);
  if (!f) notFound();
  const section = docs.sections.find((s) => s.id === f.section)!;
  const site = siteUrl(f.siteRoute);
  return (
    <div className="with-sidebar">
      <Sidebar activeFeature={f.id} />
      <div className="content">
        <header className="page-head">
          <p className="eyebrow">{section.title}</p>
          <h1>{f.title}</h1>
          <p className="lede">{f.summary}</p>
          {site ? (
            <p className="powers">
              Powers <a href={site}>{f.title} on usaspending.gov <span aria-hidden="true">↗</span></a> <code>{f.siteRoute}</code>
            </p>
          ) : (
            <p className="powers">usaspending.gov doesn&apos;t call these directly.</p>
          )}
        </header>
        <ul className="endpoint-cards">
          {featureEndpoints(f).map((e) => (
            <li key={e.id}>
              <Link href={endpointHref(e)} className="endpoint-card">
                <span className="endpoint-card-top">
                  <MethodBadge method={e.method} size="sm" />
                  <code>{e.path}</code>
                </span>
                <span className="endpoint-card-title">{e.title}</span>
                {e.summary || e.description ? <span className="endpoint-card-body">{firstSentence(e.summary || e.description || '')}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function firstSentence(t: string) {
  const plain = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[`*_#>]/g, '').replace(/\s+/g, ' ').trim();
  const m = plain.match(/^(.{20,220}?[.!?])(\s|$)/);
  return m ? m[1] : plain.slice(0, 200);
}
