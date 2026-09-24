import { docs, endpointHref, firstSentence } from '@/lib/docs';
import { GUIDES } from '@/lib/guides';
import { glossary, releases } from '@/lib/resources';
import { navGroups } from '@/lib/nav';

// A prebuilt index for the ⌘K search dialog, generated at build time.
export const dynamic = 'force-static';

export function GET() {
  const pages = navGroups().flatMap((g) => g.items).filter((i) => !i.href.startsWith('/reference/') && !i.href.startsWith('/guides/'));
  const index = [
    ...pages.map((p) => ({ t: p.label, s: 'Docs page', h: p.href, k: 'Page' })),
    ...GUIDES.map((g) => ({ t: g.title, s: g.summary, h: `/guides/${g.slug}`, k: 'Guide' })),
    ...docs.features.map((f) => ({ t: f.title, s: firstSentence(f.summary), h: `/reference/${f.id}`, k: 'Feature' })),
    ...docs.endpoints.map((e) => ({ t: e.title, s: e.path, h: endpointHref(e), k: 'Endpoint', m: e.method, x: firstSentence(e.description || e.summary || '') })),
    ...glossary.terms.map((t) => ({ t: t.term, s: firstSentence(t.plain || t.official || ''), h: `/glossary#${t.slug}`, k: 'Term' })),
    ...releases.slice(0, 40).map((r) => ({ t: `Release notes: ${r.title}`, s: r.sections.map((s) => s.title).join(', '), h: `/release-notes#${r.id}`, k: 'Release' })),
  ];
  return Response.json(index);
}
