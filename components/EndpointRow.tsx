import Link from 'next/link';
import type { Endpoint } from '@/lib/docs';
import { endpointHref, firstSentence } from '@/lib/docs';
import { samples } from '@/lib/samples';
import { MethodBadge } from './MethodBadge';
import { CodeTabs } from './Code';
import { Icon } from './Icon';

// One endpoint as an accordion row: the summary line always shows; details, parameters,
// and request samples open in place. The row id makes /reference/<feature>#<endpoint> links work.
export function EndpointRow({ e }: { e: Endpoint }) {
  const params = e.params || [];
  const bodyFields = e.request?.fields?.map((f) => f.name).filter(Boolean) as string[] | undefined;
  const text = e.description || e.summary || '';
  return (
    <details className="ep" id={e.id}>
      <summary>
        <MethodBadge method={e.method} size="sm" />
        <span className="ep-title"><strong>{e.title}</strong><code>{e.path}</code></span>
        <span className="ep-side">
          {e.status === 'in-development' ? <span className="pill pill-accent">In development</span> : null}
          {e.status === 'deprecated' ? <span className="pill pill-accent">Deprecated</span> : null}
          <Icon name="chevron" className="chev" />
        </span>
      </summary>
      <div className="ep-body">
        {text ? <p>{firstSentence(text)}</p> : null}
        {params.length || bodyFields?.length ? (
          <div className="ep-facts">
            {params.map((p) => <span key={p.name} className="pill pill-mono" title={`${p.in} parameter`}>{p.in === 'path' ? `{${p.name}}` : `?${p.name}`}{p.required ? ' *' : ''}</span>)}
            {bodyFields?.slice(0, 10).map((n) => <span key={n} className="pill pill-mono" title="Request body field">{n}</span>)}
            {bodyFields && bodyFields.length > 10 ? <span className="pill">+{bodyFields.length - 10} more</span> : null}
          </div>
        ) : null}
        <CodeTabs tabs={samples(e)} />
        <div className="ep-actions">
          <Link href={endpointHref(e)} className="button">Full reference and live console <Icon name="arrow" /></Link>
          <a href={e.source.url} className="button button-ghost"><Icon name="github" />Contract</a>
        </div>
      </div>
    </details>
  );
}
