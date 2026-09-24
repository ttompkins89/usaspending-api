import type { Metadata } from 'next';
import { Markdown } from '@/components/Markdown';
import { content } from '@/lib/content';

export const metadata: Metadata = { title: 'Start here' };

export default function Start() {
  return (
    <div className="page-narrow">
      <header className="page-head">
        <p className="eyebrow">Start here</p>
        <h1>How the USAspending API works</h1>
      </header>
      <Markdown>{content('start')}</Markdown>
    </div>
  );
}
