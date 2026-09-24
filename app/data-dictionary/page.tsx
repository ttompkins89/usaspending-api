import type { Metadata } from 'next';
import { dictionary, formatDate } from '@/lib/resources';
import { SITE } from '@/lib/docs';
import { DocPage } from '@/components/DocPage';
import { DictionaryTable } from '@/components/DictionaryTable';

export const metadata: Metadata = { title: 'Data dictionary', description: 'Every data element in USAspending downloads and the database, searchable.' };

export default function DataDictionary() {
  const d = dictionary;
  return (
    <DocPage
      wide
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'Data dictionary' }]}
      title="Data dictionary"
      lede="Every data element, its definition, and the column it maps to in award, subaward, and account downloads and in the database. Search it, or open an element to see where it appears."
      head={
        <div className="feature-links">
          <span className="pill pill-mono">GET /api/v2/references/data_dictionary/</span>
          {d.fetchedAt ? <span className="muted">Fetched {formatDate(d.fetchedAt.slice(0, 10))}</span> : null}
          {d.metadata?.download_location ? <a href={d.metadata.download_location}>Download as Excel</a> : null}
        </div>
      }
    >
      {d.rows.length ? <DictionaryTable headers={d.headers} sections={d.sections} rows={d.rows} /> : (
        <p className="unavailable">The data dictionary couldn&apos;t be loaded in this build. It&apos;s also on <a href={`${SITE}/data-dictionary`}>usaspending.gov</a>.</p>
      )}
    </DocPage>
  );
}
