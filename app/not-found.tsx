import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-narrow">
      <header className="page-head">
        <p className="eyebrow">404</p>
        <h1>That page isn&apos;t here</h1>
        <p className="lede">The endpoint may have moved to a different feature, or been removed from the API contracts.</p>
      </header>
      <p><Link className="button" href="/reference">Browse all endpoints</Link></p>
    </div>
  );
}
