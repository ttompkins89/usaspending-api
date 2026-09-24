import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { Markdown } from '@/components/Markdown';
import { content } from '@/lib/content';

export const metadata: Metadata = { title: 'Paging and downloads' };

export default function Page() {
  return (
    <DocPage crumbs={[{ href: '/', label: 'Overview' }, { label: 'Paging and downloads' }]} title="Paging and downloads" lede="Page through results for everyday queries. Switch to file downloads when you need everything.">
      <Markdown>{content('paging-and-downloads')}</Markdown>
    </DocPage>
  );
}
