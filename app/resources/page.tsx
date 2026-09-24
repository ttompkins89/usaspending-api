import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/docs';
import { RELEASE_LOG, CONTRACT_HISTORY } from '@/lib/resources';
import { DocPage } from '@/components/DocPage';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'More from USAspending', description: 'Official USAspending resources for understanding the data behind the API.' };

const GROUPS: { id: string; title: string; intro: string; links: { href: string; title: string; body: string; internal?: boolean }[] }[] = [
  {
    id: 'understand-the-data', title: 'Understand the data', intro: 'Background from usaspending.gov on where the numbers come from and what they mean.',
    links: [
      { href: `${SITE}/federal-spending-guide`, title: 'Federal Spending Guide', body: 'How federal money moves from budget to award, in plain language.' },
      { href: `${SITE}/data-sources`, title: 'Data sources and methodology', body: 'Which government systems feed each part of the site, and how often.' },
      { href: `${SITE}/submission-statistics`, title: 'Agency submission statistics', body: 'How complete and timely each agency’s reporting is. The API has these as endpoints too.' },
      { href: `${SITE}/about`, title: 'About usaspending.gov', body: 'The DATA Act, the site’s mission, and who runs it.' },
    ],
  },
  {
    id: 'learn-by-watching', title: 'Learn by watching', intro: 'Short walkthroughs of the site. Watching the site work is the fastest way to see which calls a page needs.',
    links: [
      { href: `${SITE}/training-videos`, title: 'Training videos', body: 'Walkthroughs of Advanced Search, profiles, Spending Explorer, and downloads.' },
      { href: `${SITE}/featured-content`, title: 'Featured content', body: 'Articles and data stories built on the same data.' },
    ],
  },
  {
    id: 'reference-files', title: 'Reference files', intro: 'The definitions and crosswalks behind every download.',
    links: [
      { href: '/data-dictionary', title: 'Data dictionary', body: 'Every element and the download column it maps to, searchable here.', internal: true },
      { href: '/glossary', title: 'Glossary', body: 'Federal spending terms in plain language.', internal: true },
      { href: 'https://fiscal.treasury.gov/data-transparency/GSDM-current.html', title: 'Governmentwide Spending Data Model (GSDM)', body: 'Treasury\u2019s data standard for what agencies submit, formerly called DAIMS.' },
    ],
  },
  {
    id: 'source-and-history', title: 'Source and history', intro: 'Both the API and the site are open source. These docs are built from them.',
    links: [
      { href: 'https://github.com/fedspendingtransparency/usaspending-api', title: 'usaspending-api on GitHub', body: 'The API’s source and its API Blueprint contracts.' },
      { href: 'https://github.com/fedspendingtransparency/usaspending-website', title: 'usaspending-website on GitHub', body: 'The site’s source, which the guides trace.' },
      { href: RELEASE_LOG, title: 'Release Log', body: 'The site’s release notes wiki. Shown here as release notes.' },
      { href: CONTRACT_HISTORY, title: 'Contract history', body: 'Every commit to the API contracts. Shown here as the API changelog.' },
      { href: 'https://api.usaspending.gov', title: 'Official API site', body: 'The API’s own landing page and endpoint list.' },
    ],
  },
];

export default function Resources() {
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'More from USAspending' }]}
      title="More from USAspending"
      lede="Official material that explains the data behind the API. Worth a read before you build anything that reports numbers."
    >
      {GROUPS.map((g) => (
        <section key={g.id} aria-labelledby={g.id}>
          <h2 id={g.id}>{g.title}</h2>
          <p>{g.intro}</p>
          <div className="cards">
            {g.links.map((l) => {
              const inner = (<><span className="card-title">{l.title}{l.internal ? null : <Icon name="external" className="icon" />}</span><p className="card-body">{l.body}</p></>);
              return l.internal ? <Link key={l.href} href={l.href} className="card">{inner}</Link> : <a key={l.href} href={l.href} className="card">{inner}</a>;
            })}
          </div>
        </section>
      ))}
    </DocPage>
  );
}
