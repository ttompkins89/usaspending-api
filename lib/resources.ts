import releasesRaw from './releases.json';
import changelogRaw from './changelog.json';
import glossaryRaw from './glossary.json';
import dictionaryRaw from './dictionary.json';

export type Release = { id: string; date: string; title: string; sections: { title: string; markdown: string }[]; apiItems: string[]; endpoints: string[] };
export type Change = { sha: string; date: string; ticket: string | null; summary: string; endpoints: string[]; added: string[]; removed: string[]; touchesGuide: boolean };
export type Term = { term: string; slug: string; data_act_term?: string | null; plain?: string | null; official?: string | null; resources?: string | null };

export const releases = ((releasesRaw as { releases?: Release[] }).releases || []) as Release[];
export const changes = ((changelogRaw as { entries?: Change[] }).entries || []) as Change[];
export const glossary = glossaryRaw as { terms: Term[]; source?: string; fetchedAt?: string; unavailable?: boolean };
export const dictionary = dictionaryRaw as { headers: { raw: string; display: string }[]; sections: { section: string; colspan: number }[]; rows: (string | null)[][]; metadata?: { total_rows?: number; download_location?: string } | null; source?: string; fetchedAt?: string; unavailable?: boolean };

export const RELEASE_LOG = 'https://github.com/fedspendingtransparency/usaspending-website/wiki';
export const CONTRACT_HISTORY = 'https://github.com/fedspendingtransparency/usaspending-api/commits/master/usaspending_api/api_contracts';
export const commitUrl = (sha: string) => `https://github.com/fedspendingtransparency/usaspending-api/commit/${sha}`;

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
export function recentFor(endpointId: string, limit = 5) {
  const items = [
    ...changes.filter((c) => c.endpoints.includes(endpointId)).map((c) => ({ kind: 'contract' as const, date: c.date, text: c.summary, ticket: c.ticket, href: commitUrl(c.sha) })),
    ...releases.filter((r) => r.endpoints.includes(endpointId)).map((r) => ({ kind: 'release' as const, date: r.date, text: `Mentioned in the ${r.title} release notes`, ticket: null, href: `/release-notes#${r.id}` })),
  ];
  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
