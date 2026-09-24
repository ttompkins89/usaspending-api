import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { docs, endpoint as getEndpoint, feature as getFeature, siteUrl, contractNotes } from '@/lib/docs';
import { MethodBadge } from '@/components/MethodBadge';
import { Sidebar } from '@/components/Sidebar';
import { Markdown } from '@/components/Markdown';
import { CodeBlock } from '@/components/CodeBlock';
import { FieldList, Schema } from '@/components/FieldTree';
import { Console } from '@/components/Console';

export function generateStaticParams() {
  return docs.endpoints.map((e) => ({ feature: e.feature, endpoint: e.id }));
}

export function generateMetadata({ params }: { params: { endpoint: string } }): Metadata {
  const e = getEndpoint(params.endpoint);
  return { title: e ? `${e.title} (${e.method} ${e.path})` : 'Not found' };
}

export default function EndpointPage({ params }: { params: { feature: string; endpoint: string } }) {
  const e = getEndpoint(params.endpoint);
  if (!e || e.feature !== params.feature) notFound();
  const f = getFeature(e.feature)!;
  const site = siteUrl(f.siteRoute);
  const notes = contractNotes(e);
  const pathParams = (e.params || []).filter((p) => p.in === 'path');
  const queryParams = (e.params || []).filter((p) => p.in === 'query');

  return (
    <div className="with-sidebar">
      <Sidebar activeFeature={f.id} activeEndpoint={e.id} />
      <article className="content endpoint">
        <header className="page-head">
          <p className="eyebrow"><Link href={`/reference/${f.id}`}>{f.title}</Link></p>
          <h1>{e.title}</h1>
          <p className="endpoint-line">
            <MethodBadge method={e.method} />
            <code>{e.path}</code>
          </p>
          {site ? (
            <p className="powers">
              Powers <a href={site}>{f.title} on usaspending.gov <span aria-hidden="true">↗</span></a>
            </p>
          ) : (
            <p className="powers">usaspending.gov doesn&apos;t call this endpoint directly.</p>
          )}
          {e.status === 'in-development' ? <p className="notice notice-warn"><strong>In development.</strong> The contract marks this endpoint as under development and not yet available, so the live console may return an error.</p> : null}
          {e.status === 'deprecated' ? <p className="notice notice-warn"><strong>Deprecated.</strong> The contract marks this endpoint as deprecated.</p> : null}
        </header>

        {e.description ? <Markdown>{e.description}</Markdown> : null}
        {e.summary && e.summary !== e.description ? <Markdown>{e.summary}</Markdown> : null}

        {pathParams.length ? (
          <section aria-labelledby="path-params">
            <h2 id="path-params">Path parameters</h2>
            <FieldList fields={pathParams} />
          </section>
        ) : null}
        {queryParams.length ? (
          <section aria-labelledby="query-params">
            <h2 id="query-params">Query parameters</h2>
            <FieldList fields={queryParams} />
          </section>
        ) : null}

        {e.method !== 'GET' ? (
          <section aria-labelledby="req-body">
            <h2 id="req-body">Request body</h2>
            {e.request?.fields?.some((x) => x.name === 'filters') ? (
              <p className="muted">The <code>filters</code> object is shared by every search endpoint. The <Link href="/start/filters">filter object page</Link> explains each filter with examples.</p>
            ) : null}
            <Schema field={e.request} />
            {e.requestExample ? <CodeBlock code={e.requestExample} label="Example request body" /> : null}
          </section>
        ) : null}

        <Console method={e.method} path={e.path} params={e.params} requestExample={e.requestExample} />

        <section aria-labelledby="res-body">
          <h2 id="res-body">Response{e.statusCode ? <span className="muted"> · {e.statusCode}</span> : null}</h2>
          <Schema field={e.response} />
          {e.responseExample ? <CodeBlock code={e.responseExample} label="Example response" /> : null}
        </section>

        {notes.length ? (
          <section aria-labelledby="contract-notes" className="contract-notes">
            <h2 id="contract-notes">Contract notes</h2>
            <ul>{notes.map((n) => <li key={n}><Markdown>{n}</Markdown></li>)}</ul>
          </section>
        ) : null}

        <p className="source-line">
          Generated from <a href={e.source.url}><code>{e.source.file}</code></a> in the USAspending API repo.
        </p>
      </article>
    </div>
  );
}
