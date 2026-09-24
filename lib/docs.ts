import raw from './docs.json';

export type Field = {
  name?: string; type: string; required?: boolean; nullable?: boolean; description?: string;
  default?: unknown; example?: unknown; enum?: { value: unknown; description?: string }[]; valueType?: string;
  items?: Field; fields?: Field[]; options?: { fields: Field[] }[]; ref?: string; refDescription?: string; in?: 'path' | 'query';
};
export type Endpoint = {
  id: string; method: string; path: string; title: string; status: 'stable' | 'in-development' | 'deprecated';
  summary?: string; description?: string; feature: string; params?: Field[]; request?: Field; requestExample?: string;
  response?: Field; responseExample?: string; statusCode?: string; source: { file: string; url: string };
  pathInferred?: boolean; contractNotes?: string[]; contractErrors?: string[]; partial?: boolean;
};
export type Feature = { id: string; section: string; title: string; siteRoute: string | null; summary: string; endpointIds: string[] };
export type Section = { id: string; title: string; blurb: string };
type Docs = {
  generatedAt: string; source: { repo: string; sha: string | null; contracts: number };
  sections: Section[]; features: Feature[]; endpoints: Endpoint[]; filterGuide: string | null; problems: { file: string; errors: string[] }[];
};

export const docs = raw as unknown as Docs;
const byId = new Map(docs.endpoints.map((e) => [e.id, e]));
export const SITE = 'https://www.usaspending.gov';
export const API_HOST = 'https://api.usaspending.gov';

export const endpoint = (id: string) => byId.get(id);
export const feature = (id: string) => docs.features.find((f) => f.id === id);
export const featureEndpoints = (f: Feature) => f.endpointIds.map((id) => byId.get(id)!).filter(Boolean);
export const sectionFeatures = (sectionId: string) => docs.features.filter((f) => f.section === sectionId);
export const endpointHref = (e: Endpoint) => `/reference/${e.feature}/${e.id}`;
export const endpointAnchor = (e: Endpoint) => `/reference/${e.feature}#${e.id}`;
export function siteUrl(route: string | null) {
  if (!route) return null;
  return `${SITE}${route.split('/:')[0]}`;
}
export function contractNotes(e: Endpoint) {
  const notes = [...(e.contractNotes || [])];
  if (e.pathInferred) notes.push("The contract doesn't state its URL. This path comes from the contract's location in the repo, which mirrors the URL by convention, and matches how usaspending.gov calls it.");
  if (e.partial) notes.push('Only part of this contract could be read, so some fields may be missing here. The source contract has the rest.');
  return notes;
}
export function firstSentence(t = '') {
  const plain = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[`*_#>]/g, '').replace(/\s+/g, ' ').trim();
  const m = plain.match(/^(.{20,220}?[.!?])(\s|$)/);
  return m ? m[1] : plain.slice(0, 200);
}
export function methodCounts(list: Endpoint[]) {
  const c: Record<string, number> = {};
  for (const e of list) c[e.method] = (c[e.method] || 0) + 1;
  return c;
}
