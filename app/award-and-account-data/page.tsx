import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { Markdown } from '@/components/Markdown';
import { content } from '@/lib/content';

export const metadata: Metadata = { title: 'Award and account data' };

export default function Page() {
  return (
    <DocPage crumbs={[{ href: '/', label: 'Overview' }, { label: 'Award and account data' }]} title="Award and account data" lede="The two families of spending data behind usaspending.gov, and how to tell which one a question needs.">
      <Markdown>{content('award-and-account-data')}</Markdown>
    </DocPage>
  );
}
