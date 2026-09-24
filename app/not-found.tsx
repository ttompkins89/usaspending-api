import Link from 'next/link';
import { DocPage } from '@/components/DocPage';

export default function NotFound() {
  return (
    <DocPage wide title="Page not found" lede="That page isn't here. It may have moved when the docs were reorganized around the site's menus.">
      <div className="hero-actions">
        <Link href="/" className="button">Go to the overview</Link>
        <Link href="/reference" className="button button-ghost">Browse the API reference</Link>
      </div>
      <p className="muted" style={{ marginTop: 'var(--s-3)' }}>Tip: press <kbd>⌘K</kbd> or <kbd>/</kbd> to search.</p>
    </DocPage>
  );
}
