import type { Metadata } from 'next';
import Link from 'next/link';
import { docs, endpointHref, contractNotes } from '@/lib/docs';

export const metadata: Metadata = { title: 'About' };

export default function About() {
  const noted = docs.endpoints.filter((e) => contractNotes(e).length);
  const sha = docs.source.sha;
  return (
    <div className="page-narrow">
      <header className="page-head">
        <p className="eyebrow">About</p>
        <h1>About Tally</h1>
        <p className="lede">An independent set of developer docs for the USAspending API, organized around usaspending.gov itself.</p>
      </header>
      <div className="prose">
        <h2>How it&apos;s built</h2>
        <p>
          USAspending documents its API as {docs.source.contracts} contract files in API Blueprint format, in its public repo. Every build of this site pulls the latest contracts, parses them, and generates a page for each of the {docs.endpoints.length} endpoints. Nothing on an endpoint page is written by hand, so the docs can&apos;t drift from the contracts.
        </p>
        <p>
          The site&apos;s structure comes from usaspending.gov. Each endpoint is filed under the site feature that calls it, traced through the site&apos;s own public source code, and grouped under the site&apos;s four menus.
        </p>
        <p>
          This build uses contracts from{' '}
          {sha ? <a href={`${docs.source.repo}/commit/${sha}`}>commit <code>{sha.slice(0, 7)}</code></a> : 'a saved snapshot'}, generated {new Date(docs.generatedAt).toUTCString()}.
        </p>
        <h2>Contract notes</h2>
        <p>
          A few contracts have small upstream slips, like a type name that doesn&apos;t match its definition or a missing URL. The generator tolerates them so no endpoint drops out, and flags each one on its page.
        </p>
        {noted.length ? (
          <ul>
            {noted.map((e) => (
              <li key={e.id}>
                <Link href={endpointHref(e)}>{e.method} {e.path}</Link>: {contractNotes(e).length} {contractNotes(e).length === 1 ? 'note' : 'notes'}
              </li>
            ))}
          </ul>
        ) : <p>None in this build.</p>}
        <h2>Credits and license</h2>
        <p>
          Designed and built by Tanika Tompkins. Tally is not affiliated with, endorsed by, or operated by the U.S. Department of the Treasury or USAspending.gov. The API contracts and the usaspending.gov source are public domain (CC0), which is what makes a project like this possible.
        </p>
      </div>
    </div>
  );
}
