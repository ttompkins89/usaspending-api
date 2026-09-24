import Link from 'next/link';
import { docs, sectionFeatures } from '@/lib/docs';
import { CodeBlock } from '@/components/CodeBlock';

const EXAMPLE = `curl -X POST 'https://api.usaspending.gov/api/v2/search/spending_by_award/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "filters": {
      "award_type_codes": ["A", "B", "C", "D"],
      "time_period": [{ "start_date": "2025-10-01", "end_date": "2026-09-30" }]
    },
    "fields": ["Award ID", "Recipient Name", "Award Amount"],
    "limit": 5
  }'`;

export default function Home() {
  const total = docs.endpoints.length;
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">USAspending API · {total} endpoints · no key needed</p>
          <h1>Every endpoint, mapped to the usaspending.gov feature it powers.</h1>
          <p className="lede">
            usaspending.gov is built on a public API. Tally documents all of it, organized the way the site is: search award data, explore the data, download the data, find resources. Every request runs live.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/start">Start here</Link>
            <Link className="button button-secondary" href="/reference">Browse the reference</Link>
          </div>
        </div>
      </section>

      <section className="page-wide split">
        <div>
          <h2 className="section-title">Two kinds of data</h2>
          <p>The site separates spending into two families, and so does the API. Knowing which one you need saves the most time.</p>
          <div className="cards two">
            <Link className="card" href="/start#award-data">
              <span className="card-kicker">Award data</span>
              <span className="card-title">Contracts, grants, loans, and other awards</span>
              <span className="card-body">Who received federal money, from which agency, for what. Prime awards, transactions, and subawards. Start with Advanced Search.</span>
            </Link>
            <Link className="card" href="/start#account-data">
              <span className="card-kicker">Account data</span>
              <span className="card-title">Budgets, accounts, and obligations</span>
              <span className="card-body">What agencies had to spend and what they spent it on, reported from their accounts. Start with agency and federal account profiles.</span>
            </Link>
          </div>
        </div>
        <div>
          <h2 className="section-title">Your first request</h2>
          <p>Contract awards for fiscal year 2026, five at a time. Paste it into a terminal, or run it from the <Link href="/reference/advanced-search/post-v2-search-spending-by-award">Spending by Award</Link> page.</p>
          <CodeBlock code={EXAMPLE} lang="bash" label="Terminal" />
        </div>
      </section>

      <section className="page-wide">
        <h2 className="section-title">Organized like the site</h2>
        <p className="muted">The site&apos;s four menus, and the features under each, with the endpoints that power them.</p>
        <div className="menus">
          {docs.sections.map((s) => (
            <div key={s.id} className="menu">
              <h3>{s.title}</h3>
              <p className="muted">{s.blurb}</p>
              <ul>
                {sectionFeatures(s.id).map((f) => (
                  <li key={f.id}>
                    <Link href={`/reference/${f.id}`}>
                      <span>{f.title}</span>
                      <span className="count">{f.endpointIds.length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="page-wide">
        <h2 className="section-title">Where to start</h2>
        <div className="cards three">
          <Link className="card" href="/reference/advanced-search/post-v2-search-spending-by-award">
            <span className="card-kicker">Researchers and journalists</span>
            <span className="card-title">Answer a spending question</span>
            <span className="card-body">Search awards with a filter object and page through the results.</span>
          </Link>
          <Link className="card" href="/reference/award-summary">
            <span className="card-kicker">GovTech and contracting developers</span>
            <span className="card-title">Track awards and recipients</span>
            <span className="card-body">Pull one award&apos;s funding, transactions, and subawards, or a recipient&apos;s totals.</span>
          </Link>
          <Link className="card" href="/reference/agency-profiles">
            <span className="card-kicker">Civic tech and dashboards</span>
            <span className="card-title">Chart spending by agency or place</span>
            <span className="card-body">Agency budgets, obligations by category, and spending by geography.</span>
          </Link>
        </div>
      </section>
    </>
  );
}
