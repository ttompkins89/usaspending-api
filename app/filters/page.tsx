import type { Metadata } from 'next';
import { docs } from '@/lib/docs';
import { DocPage } from '@/components/DocPage';
import { Markdown } from '@/components/Markdown';

export const metadata: Metadata = { title: 'The filter object' };

export default function Filters() {
  // Upstream search_filters.md, rendered as-is apart from its own top-level title.
  const md = (docs.filterGuide || '').replace(/^#\s+.*\n/, '');
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'The filter object' }]}
      title="The filter object"
      lede="Every search endpoint takes the same filters object. Filters combine with AND; values inside one filter combine with OR."
      head={<p className="muted" style={{ marginTop: 'var(--s-1)', marginBottom: 0 }}>From <a href={`${docs.source.repo}/blob/master/usaspending_api/api_contracts/search_filters.md`}>search_filters.md</a> in the USAspending API repo, updated every build.</p>}
    >
      {md ? <Markdown>{md}</Markdown> : <p className="unavailable">The filter guide couldn&apos;t be loaded in this build.</p>}
    </DocPage>
  );
}
