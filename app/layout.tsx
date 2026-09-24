import type { Metadata } from 'next';
import Link from 'next/link';
import './tokens.css';
import './globals.css';
import { docs } from '@/lib/docs';
import { TallyMark } from '@/components/TallyMark';

export const metadata: Metadata = {
  metadataBase: new URL('https://usaspending-api.vercel.app'),
  title: { default: 'Tally: USAspending API docs', template: '%s · Tally' },
  description: 'Independent developer docs for the USAspending API, organized around the usaspending.gov features each endpoint powers.',
};

const NAV = [
  { href: '/start', label: 'Start here' },
  { href: '/start/filters', label: 'Filter object' },
  { href: '/reference', label: 'Reference' },
  { href: '/about', label: 'About' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sha = docs.source.sha;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Roboto+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="band">
          <div className="band-inner">
            <Link href="/" className="brand" aria-label="Tally, home">
              <TallyMark size={36} />
              <span className="brand-word">Tally</span>
              <span className="brand-sub">USAspending API docs</span>
            </Link>
            <nav aria-label="Main" className="main-nav">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href}>{n.label}</Link>
              ))}
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="footer-inner">
            <p>
              <strong>Tally is an independent project</strong>, designed and built by Tanika Tompkins. It is not affiliated with, endorsed by, or operated by the U.S. Department of the Treasury or USAspending.gov.
            </p>
            <p>
              Endpoint content is generated from the public-domain{' '}
              <a href={docs.source.repo}>USAspending API contracts</a>
              {sha ? <> at commit <a href={`${docs.source.repo}/commit/${sha}`}><code>{sha.slice(0, 7)}</code></a></> : null}, last built {new Date(docs.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
