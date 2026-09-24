import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { docs, feature as getFeature, featureEndpoints, siteUrl, methodCounts } from '@/lib/docs';
import { guideForFeature } from '@/lib/guides';
import { DocPage } from '@/components/DocPage';
import { EndpointRow } from '@/components/EndpointRow';
import { MethodBadge } from '@/components/MethodBadge';
import { Markdown } from '@/components/Markdown';
import { Icon } from '@/components/Icon';
import { HashOpener } from '@/components/HashOpener';

type Props = { params: Promise<{ feature: string }> };

export function generateStaticParams() {
  return docs.features.map((f) => ({ feature: f.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = getFeature((await params).feature);
  return { title: f ? `${f.title} endpoints` : 'Not found' };
}

export default async function FeaturePage({ params }: Props) {
  const f = getFeature((await params).feature);
  if (!f) notFound();
  const section = docs.sections.find((s) => s.id === f.section)!;
  const eps = featureEndpoints(f);
  const site = siteUrl(f.siteRoute);
  const g = guideForFeature(f.id);
  const counts = methodCounts(eps);
  return (
    <DocPage
      crumbs={[{ href: '/reference', label: 'API reference' }, { href: `/reference#${section.id}`, label: section.title }, { label: f.title }]}
      title={f.title}
      head={
        <>
          <Markdown className="lede">{f.summary}</Markdown>
          <div className="feature-links">
            <span className="method-counts">{Object.entries(counts).map(([m, n]) => <span key={m} className="pills"><MethodBadge method={m} size="sm" /><span className="muted">{n}</span></span>)}</span>
            {site ? <a href={site}>Open on usaspending.gov <Icon name="external" /></a> : <span className="muted">Not called by usaspending.gov</span>}
            {g ? <Link href={`/guides/${g.slug}`}><Icon name="guide" />{g.title}</Link> : null}
          </div>
        </>
      }
      toc={eps.map((e) => ({ id: e.id, text: e.title, level: 2 as const }))}
    >
      <p className="muted" style={{ fontSize: 'var(--font-size-14)' }}>Open a row for parameters and ready-to-run samples. The full reference has every field and a live console.</p>
      <div className="ep-list">
        {eps.map((e) => <EndpointRow key={e.id} e={e} />)}
      </div>
      <HashOpener />
    </DocPage>
  );
}
