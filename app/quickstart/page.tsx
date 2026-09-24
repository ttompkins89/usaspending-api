import type { Metadata } from 'next';
import Link from 'next/link';
import { endpoint, endpointHref } from '@/lib/docs';
import { samples } from '@/lib/samples';
import { DocPage } from '@/components/DocPage';
import { CodeTabs, Code } from '@/components/Code';
import { Console } from '@/components/Console';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = { title: 'Quickstart', description: 'Make your first USAspending API request: no key, no sign-up.' };

export default function Quickstart() {
  const get = endpoint('get-v2-agency-toptier-code-awards')!;
  const post = endpoint('post-v2-search-spending-by-award')!;
  const searchBody = {
    filters: {
      award_type_codes: ['A', 'B', 'C', 'D'],
      time_period: [{ start_date: '2025-10-01', end_date: '2026-09-30' }],
      agencies: [{ type: 'awarding', tier: 'toptier', name: 'Department of Energy' }],
    },
    fields: ['Award ID', 'Recipient Name', 'Award Amount', 'Awarding Agency'],
    sort: 'Award Amount',
    order: 'desc',
    limit: 5,
    page: 1,
  };
  const bodyText = JSON.stringify(searchBody, null, 2);
  const postSamples = samples({ ...post, requestExample: bodyText });
  return (
    <DocPage
      crumbs={[{ href: '/', label: 'Overview' }, { label: 'Quickstart' }]}
      title="Quickstart"
      lede="The USAspending API is open. Send a request and you get data back. This page gets you from nothing to a real search in three steps."
    >
      <div className="callout callout-teal">
        <Icon name="info" />
        <div>
          <p><strong>Base URL</strong> <code className="inline-code">https://api.usaspending.gov</code>. Every endpoint lives under <code className="inline-code">/api/v2/</code>.</p>
          <p><strong>No key, no sign-up.</strong> JSON in, JSON out. <code className="inline-code">GET</code> for lookups by ID or code, <code className="inline-code">POST</code> for anything that takes a filter object.</p>
        </div>
      </div>

      <h2 id="first-request">1. Make a GET request</h2>
      <p>
        Ask for award totals for the Department of the Treasury (agency code <code className="inline-code">020</code>) in the current fiscal year.
        This is the call behind the award summary on its <a href="https://www.usaspending.gov/agency/department-of-the-treasury">agency profile</a>.
      </p>
      <CodeTabs tabs={samples(get).map((s) => ({ label: s.label, lang: s.lang, code: s.code }))} />
      <p>You get back one small object. This is the example from the API contract:</p>
      {get.responseExample ? <Code lang="json" label="Response" code={get.responseExample} /> : null}
      <p className="muted">Live numbers will differ. The data updates daily.</p>

      <h2 id="search">2. Search with a filter object</h2>
      <p>
        Search endpoints take a <code className="inline-code">POST</code> body with a <code className="inline-code">filters</code> object.
        This one finds the five largest Department of Energy contracts in fiscal year 2026, the same way Advanced Search does.
      </p>
      <CodeTabs tabs={postSamples.map((s) => ({ label: s.label, lang: s.lang, code: s.code }))} />
      <p>
        The <Link href="/filters">filter object</Link> page lists every filter. The <Link href="/guides/advanced-search">Advanced Search guide</Link> shows
        how the site combines this call with counts and charts.
      </p>

      <h2 id="try">3. Try it here</h2>
      <p>Change the agency code or fiscal year and send it. Requests go to the live API.</p>
      <Console method={get.method} path={get.path} params={get.params} requestExample={get.requestExample} compact />

      <h2 id="next">Where to go next</h2>
      <div className="cards">
        <Link href="/award-and-account-data" className="card"><span className="card-title">Award and account data</span><p className="card-body">Pick the right family of data before you pick an endpoint.</p></Link>
        <Link href="/guides" className="card"><span className="card-title">Guides</span><p className="card-body">Rebuild a usaspending.gov page call by call.</p></Link>
        <Link href={endpointHref(post)} className="card"><span className="card-title">Search awards reference</span><p className="card-body">Every field on <code>spending_by_award</code>.</p></Link>
      </div>
    </DocPage>
  );
}
