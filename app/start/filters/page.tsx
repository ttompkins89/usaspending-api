import type { Metadata } from 'next';
import Link from 'next/link';
import { docs } from '@/lib/docs';
import { Markdown } from '@/components/Markdown';

export const metadata: Metadata = { title: 'The filter object' };

export default function Filters() {
  // Upstream's guide starts with its own H1; our page supplies the title instead.
  const guide = (docs.filterGuide || '').replace(/^#\s+.*\n/, '');
  return (
    <div className="page-narrow">
      <header className="page-head">
        <p className="eyebrow">Start here</p>
        <h1>The filter object</h1>
        <p className="lede">
          Every search and download endpoint that takes <code>filters</code> reads the same object. This page is USAspending&apos;s own filter guide, pulled from the API repo on every build, so it always matches the API.
        </p>
        <p className="muted">
          Filters combine with AND, and values inside one filter combine with OR. For the award type codes grouped the way the site groups them, see <Link href="/start#award-data">Start here</Link>.
        </p>
      </header>
      {guide ? <Markdown>{guide}</Markdown> : <p>The filter guide couldn&apos;t be loaded in this build.</p>}
    </div>
  );
}
