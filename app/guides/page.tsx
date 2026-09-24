import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '@/lib/guides';
import { SITE } from '@/lib/docs';
import { DocPage } from '@/components/DocPage';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'Guides', description: 'How usaspending.gov pages are built from the API, call by call.' };

export default function Guides() {
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'Guides' }]}
      title="How the site uses the API"
      lede="Each guide takes one usaspending.gov page and lists the calls it makes, in order, with what each one fills in. Rebuild the page, or borrow the pattern."
    >
      <div className="callout">
        <Icon name="info" />
        <p>Call orders come from the site&apos;s public source code in the <a href="https://github.com/fedspendingtransparency/usaspending-website">usaspending-website</a> repo. Each guide links the files it traces.</p>
      </div>
      <div className="cards">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="card">
            <span className="card-icon"><Icon name="guide" /></span>
            <span className="card-title">{g.title}</span>
            <p className="card-body">{g.summary}</p>
            <span className="pills" style={{ marginTop: 'auto' }}><span className="pill">{g.calls.length} calls</span><span className="pill pill-mono">{g.siteRoute}</span></span>
          </Link>
        ))}
      </div>
      <p className="muted">Want a page covered that isn&apos;t here? Every endpoint page says which site feature calls it, starting from <a href={SITE}>usaspending.gov</a>&apos;s own menus.</p>
    </DocPage>
  );
}
