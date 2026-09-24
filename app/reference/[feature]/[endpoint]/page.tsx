import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { docs, endpoint as getEndpoint, feature as getFeature, siteUrl, contractNotes, firstSentence } from '@/lib/docs';
import { guideForFeature, GUIDES } from '@/lib/guides';
import { recentFor, formatDate } from '@/lib/resources';
import { samples } from '@/lib/samples';
import { DocPage } from '@/components/DocPage';
import { MethodBadge } from '@/components/MethodBadge';
import { Markdown } from '@/components/Markdown';
import { Code, CodeTabs } from '@/components/Code';
import { FieldList, Schema } from '@/components/FieldTree';
import { Console } from '@/components/Console';
import { Icon } from '@/components/Icon';

type Props = { params: Promise<{ feature: string; endpoint: string }> };

export function generateStaticParams() {
  return docs.endpoints.map((e) => ({ feature: e.feature, endpoint: e.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = getEndpoint((await params).endpoint);
  return { title: e ? `${e.title} (${e.method} ${e.path})` : 'Not found', description: e ? firstSentence(e.description || e.summary || '') : undefined };
}

export default async function EndpointPage({ params }: Props) {
  const p = await params;
  const e = getEndpoint(p.endpoint);
  if (!e || e.feature !== p.feature) notFound();
  const f = getFeature(e.feature)!;
  const section = docs.sections.find((s) => s.id === f.section)!;
  const site = siteUrl(f.siteRoute);
  const notes = contractNotes(e);
  const pathParams = (e.params || []).filter((x) => x.in === 'path');
  const queryParams = (e.params || []).filter((x) => x.in === 'query');
  const recent = recentFor(e.id);
  const inGuides = GUIDES.filter((g) => g.calls.some((c) => c.endpoint === e.id));
  const g = guideForFeature(f.id);

  return (
    <DocPage
      crumbs={[{ href: '/reference', label: 'API reference' }, { href: `/reference#${section.id}`, label: section.title }, { href: `/reference/${f.id}`, label: f.title }]}
      title={e.title}
      head={
        <>
          <div className="endpoint-line"><MethodBadge method={e.method} /><code>{e.path}</code></div>
          <div className="feature-links">
            {site ? <a href={site}>Powers {f.title} on usaspending.gov <Icon name="external" /></a> : <span className="muted">usaspending.gov doesn&apos;t call this endpoint directly.</span>}
            {inGuides.map((x) => <Link key={x.slug} href={`/guides/${x.slug}`}><Icon name="guide" />{x.title}</Link>)}
            {!inGuides.length && g ? <Link href={`/guides/${g.slug}`}><Icon name="guide" />{g.title}</Link> : null}
          </div>
          {e.status === 'in-development' ? <p className="notice"><strong>In development.</strong> The contract marks this endpoint as under development, so the live console may return an error.</p> : null}
          {e.status === 'deprecated' ? <p className="notice"><strong>Deprecated.</strong> The contract marks this endpoint as deprecated.</p> : null}
        </>
      }
      rail={
        <>
          <a href={e.source.url}><Icon name="github" />View the contract</a>
          <Link href={`/reference/${f.id}#${e.id}`}><Icon name="list" />All {f.title} endpoints</Link>
          <Link href="/changelog"><Icon name="history" />API changelog</Link>
        </>
      }
    >
      {e.description ? <Markdown>{e.description}</Markdown> : null}
      {e.summary && e.summary !== e.description ? <Markdown>{e.summary}</Markdown> : null}

      <h2 id="request">Request</h2>
      <CodeTabs tabs={samples(e)} />

      {pathParams.length ? (<><h3 id="path-parameters">Path parameters</h3><FieldList fields={pathParams} /></>) : null}
      {queryParams.length ? (<><h3 id="query-parameters">Query parameters</h3><FieldList fields={queryParams} /></>) : null}
      {e.method !== 'GET' ? (
        <>
          <h3 id="request-body">Request body</h3>
          {e.request?.fields?.some((x) => x.name === 'filters') ? (
            <p className="muted">The <code className="inline-code">filters</code> object is shared by every search endpoint. <Link href="/filters">The filter object</Link> explains each filter with examples.</p>
          ) : null}
          <Schema field={e.request} />
        </>
      ) : null}

      <Console method={e.method} path={e.path} params={e.params} requestExample={e.requestExample} />

      <h2 id="response">Response{e.statusCode ? <span className="muted" style={{ fontWeight: 400 }}> · {e.statusCode}</span> : null}</h2>
      <Schema field={e.response} />
      {e.responseExample ? <Code code={e.responseExample} lang="json" label="Example response" /> : null}

      <h2 id="recent-changes">Recent changes</h2>
      {recent.length ? (
        <ul className="recent">
          {recent.map((r, i) => (
            <li key={i}>
              <time dateTime={r.date}>{formatDate(r.date)}</time>
              <span>{r.kind === 'contract' ? <a href={r.href}>{r.ticket ? `${r.ticket}: ` : ''}{r.text}</a> : <Link href={r.href}>{r.text}</Link>}</span>
            </li>
          ))}
        </ul>
      ) : <p className="muted">No contract changes to this endpoint since October 2024. The <Link href="/changelog">changelog</Link> covers every endpoint.</p>}

      {notes.length ? (
        <section aria-labelledby="contract-notes" className="contract-notes">
          <h2 id="contract-notes">Contract notes</h2>
          <ul>{notes.map((n) => <li key={n}><Markdown>{n}</Markdown></li>)}</ul>
        </section>
      ) : null}

      <p className="source-line">Generated from <a href={e.source.url}><code>{e.source.file}</code></a> in the USAspending API repo.</p>
    </DocPage>
  );
}
