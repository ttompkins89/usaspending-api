import type { Metadata } from 'next';
import Link from 'next/link';
import { docs, endpointHref, contractNotes } from '@/lib/docs';
import { releases, changes } from '@/lib/resources';
import { DocPage } from '@/components/DocPage';

export const metadata: Metadata = { title: 'About these docs' };

export default function About() {
  const noted = docs.endpoints.filter((e) => contractNotes(e).length);
  const sha = docs.source.sha;
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'About these docs' }]}
      title="About these docs"
      lede="An independent reference for the USAspending API, organized around usaspending.gov itself and styled with the site's own design tokens."
    >
      <div className="prose">
        <h2 id="how-its-built">How it&apos;s built</h2>
        <p>
          USAspending documents its API as {docs.source.contracts} contract files in API Blueprint format, in its public repo. Every build pulls the latest contracts,
          parses them, and generates a page for each of the {docs.endpoints.length} endpoints. Nothing on an endpoint page is written by hand, so the reference
          can&apos;t drift from the contracts.
        </p>
        <p>
          The structure comes from usaspending.gov. Each endpoint is filed under the site feature that calls it, traced through the site&apos;s public source, and
          grouped under the site&apos;s four menus. The guides follow the same source to list each page&apos;s calls in order.
        </p>
        <p>
          The same build also pulls the site&apos;s Release Log ({releases.length} releases), the contract history ({changes.length} changes since October 2024),
          and the glossary and data dictionary from the API itself.
        </p>
        <p>
          This build uses contracts from {sha ? <a href={`${docs.source.repo}/commit/${sha}`}>commit <code>{sha.slice(0, 7)}</code></a> : 'a saved snapshot'}, generated {new Date(docs.generatedAt).toUTCString()}.
        </p>

        <h2 id="design">Design</h2>
        <p>
          Colors and type sizes are generated from usaspending.gov&apos;s own Sass tokens (<code>_variables.scss</code>, built on the U.S. Web Design System), mapped to
          light and dark roles. Every text and background pair meets WCAG AA contrast in both themes. Body type is Source Sans 3, the family the site uses, paired with Source Code Pro for code.
        </p>

        <h2 id="contract-notes">Contract notes</h2>
        <p>
          A few contracts have small upstream slips, like a type name that doesn&apos;t match its definition or a missing URL parameter. The generator tolerates them
          so no endpoint drops out, and flags each one on its page.
        </p>
        {noted.length ? (
          <ul>
            {noted.map((e) => (
              <li key={e.id}><Link href={endpointHref(e)}>{e.method} {e.path}</Link>: {contractNotes(e).length} {contractNotes(e).length === 1 ? 'note' : 'notes'}</li>
            ))}
          </ul>
        ) : <p>None in this build.</p>}

        <h2 id="credits">Credits and license</h2>
        <p>
          Designed and built by Tanika Tompkins. These docs are not affiliated with, endorsed by, or operated by the U.S. Department of the Treasury or
          USAspending.gov. The API contracts and the usaspending.gov source are public domain (CC0), which is what makes a project like this possible.
          The docs&apos; own code is MIT licensed on <a href="https://github.com/ttompkins89/usaspending-api">GitHub</a>.
        </p>
      </div>
    </DocPage>
  );
}
