import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDES, guide as getGuide } from '@/lib/guides';
import { endpoint, endpointHref, siteUrl } from '@/lib/docs';
import { content } from '@/lib/content';
import { DocPage } from '@/components/DocPage';
import { Markdown } from '@/components/Markdown';
import { MethodBadge } from '@/components/MethodBadge';
import { Icon } from '@/components/Icon';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return { title: g?.title || 'Guide', description: g?.summary };
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const site = siteUrl(g.siteRoute);
  const idx = GUIDES.indexOf(g);
  const next = GUIDES[idx + 1];
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { href: '/guides', label: 'Guides' }, { label: g.title }]}
      title={g.title}
      lede={g.summary}
      head={<div className="feature-links">{site ? <a href={site}>Open the page on usaspending.gov <Icon name="external" /></a> : null}<span className="pill">{g.calls.length} calls</span></div>}
      rail={g.sourceFiles.map((f) => (
        <a key={f} href={`https://github.com/fedspendingtransparency/usaspending-website/blob/master/${f}`}><Icon name="github" />{f.split('/').pop()}</a>
      ))}
    >
      <Markdown>{content(`guides/${g.slug}`)}</Markdown>

      <h2 id="calls">The calls, in order</h2>
      <ol className="steps">
        {g.calls.map((c, i) => {
          const e = endpoint(c.endpoint);
          return (
            <li key={i}>
              <p className="step-when">{c.when}</p>
              {e ? (
                <div className="step-call"><MethodBadge method={e.method} size="sm" /><Link href={endpointHref(e)}>{e.title}</Link><code>{e.path}</code></div>
              ) : <div className="step-call"><code>{c.endpoint}</code></div>}
              {c.note ? <p className="step-note">{c.note}</p> : null}
            </li>
          );
        })}
      </ol>

      {g.uncontracted?.length ? (
        <>
          <h2 id="not-documented">Calls without a contract</h2>
          {g.uncontracted.map((u) => (
            <div key={u.path} className="notice"><code>{u.path}</code><p style={{ margin: '4px 0 0' }}>{u.note}</p></div>
          ))}
        </>
      ) : null}

      <h2 id="sources">Sources</h2>
      <p>Traced from these files in the public <a href="https://github.com/fedspendingtransparency/usaspending-website">usaspending-website</a> repo:</p>
      <ul>
        {g.sourceFiles.map((f) => <li key={f}><a href={`https://github.com/fedspendingtransparency/usaspending-website/blob/master/${f}`}><code>{f}</code></a></li>)}
      </ul>
      {next ? <p style={{ marginTop: 'var(--s-4)' }}><Link href={`/guides/${next.slug}`} className="button button-ghost">Next: {next.title} <Icon name="arrow" /></Link></p> : null}
    </DocPage>
  );
}
