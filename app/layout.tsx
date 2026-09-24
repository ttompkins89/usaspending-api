import type { Metadata, Viewport } from 'next';
import './tokens.css';
import './globals.css';
import { Shell } from '@/components/Shell';
import { navGroups } from '@/lib/nav';

const SITE_URL = 'https://usaspending-api.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'USAspending API Reference', template: '%s · USAspending API Reference' },
  description: 'Independent developer docs for the USAspending API, organized around the usaspending.gov pages each endpoint powers. Guides, a live console, release notes, and a changelog.',
  openGraph: { type: 'website', siteName: 'USAspending API Reference', url: SITE_URL },
};
export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#1b1b1b' }],
};

// Sets the theme before first paint so there is no flash. Saved choice wins, then the OS setting.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" />
      </head>
      <body>
        <Shell groups={navGroups()}>{children}</Shell>
      </body>
    </html>
  );
}
