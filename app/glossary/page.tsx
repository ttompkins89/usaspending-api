import type { Metadata } from 'next';
import { glossary, formatDate } from '@/lib/resources';
import { SITE } from '@/lib/docs';
import { DocPage } from '@/components/DocPage';
import { Markdown } from '@/components/Markdown';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'Glossary', description: 'Federal spending terms in plain language, from the USAspending glossary API.' };

export default function Glossary() {
  const terms = glossary.terms;
  const letters = [...new Set(terms.map((t) => t.term[0].toUpperCase()))];
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'Glossary' }]}
      title="Glossary"
      lede="Federal spending terms, first in plain language, then in the official definition. These come straight from the API, so they match what usaspending.gov shows."
      head={
        <div className="feature-links">
          <span className="pill pill-mono">GET /api/v2/references/glossary/</span>
          {terms.length ? <span className="pill">{terms.length} terms</span> : null}
          {glossary.fetchedAt ? <span className="muted">Fetched {formatDate(glossary.fetchedAt.slice(0, 10))}</span> : null}
        </div>
      }
      toc={letters.map((l) => ({ id: `letter-${l}`, text: l, level: 2 as const }))}
    >
      {!terms.length ? (
        <p className="unavailable">The glossary couldn&apos;t be loaded in this build. It&apos;s also on <a href={`${SITE}/?glossary`}>usaspending.gov</a>.</p>
      ) : (
        <>
          <nav className="letters" aria-label="Jump to letter">{letters.map((l) => <a key={l} href={`#letter-${l}`}>{l}</a>)}</nav>
          {letters.map((l) => (
            <section key={l} aria-labelledby={`letter-${l}`}>
              <h2 id={`letter-${l}`}>{l}</h2>
              <dl className="terms">
                {terms.filter((t) => t.term[0].toUpperCase() === l).map((t) => (
                  <div key={t.slug} id={t.slug} className="term">
                    <dt>{t.term}</dt>
                    <dd>
                      {t.plain ? <Markdown>{t.plain}</Markdown> : null}
                      {t.official ? (
                        <details className="term-official">
                          <summary>Official definition{t.data_act_term ? ` (DATA Act: ${t.data_act_term})` : ''}</summary>
                          <Markdown>{t.official}</Markdown>
                        </details>
                      ) : null}
                      {t.resources ? <div className="term-official"><Markdown>{t.resources}</Markdown></div> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </>
      )}
      <div className="callout"><Icon name="code" /><p>Use the same data in your app: <code className="inline-code">GET https://api.usaspending.gov/api/v2/references/glossary/?limit=100</code> pages through every term.</p></div>
    </DocPage>
  );
}
