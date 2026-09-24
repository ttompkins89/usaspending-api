import { docs, sectionFeatures } from './docs';
import { GUIDES } from './guides';

export type NavItem = { href: string; label: string; count?: number; icon?: string };
export type NavGroup = { title: string; items: NavItem[]; sub?: { title: string; items: NavItem[] }[] };

export const FEATURE_ICONS: Record<string, string> = {
  'advanced-search': 'search', 'search-filters': 'filter', 'natural-language': 'spark', 'keyword-search': 'text',
  'spending-explorer': 'layers', 'agency-profiles': 'building', 'federal-accounts': 'wallet', states: 'map', recipients: 'users',
  'award-summary': 'file', 'covid-19': 'shield', 'custom-downloads': 'download', 'bulk-downloads': 'archive',
  'reference-data': 'book', 'submission-statistics': 'check', legacy: 'clock',
};

export function navGroups(): NavGroup[] {
  return [
    { title: 'Get started', items: [
      { href: '/', label: 'Overview', icon: 'home' },
      { href: '/quickstart', label: 'Quickstart', icon: 'play' },
      { href: '/award-and-account-data', label: 'Award and account data', icon: 'split' },
      { href: '/filters', label: 'The filter object', icon: 'filter' },
      { href: '/paging-and-downloads', label: 'Paging and downloads', icon: 'download' },
    ] },
    { title: 'Guides', items: [{ href: '/guides', label: 'All guides', icon: 'map' }, ...GUIDES.map((g) => ({ href: `/guides/${g.slug}`, label: g.short, icon: 'guide' }))] },
    { title: `API reference · ${docs.endpoints.length}`, items: [{ href: '/reference', label: 'All endpoints', icon: 'list' }],
      sub: docs.sections.map((s) => ({ title: s.title, items: sectionFeatures(s.id).map((f) => ({ href: `/reference/${f.id}`, label: f.title, count: f.endpointIds.length, icon: FEATURE_ICONS[f.id] || 'dot' })) })) },
    { title: 'Resources', items: [
      { href: '/release-notes', label: 'Release notes', icon: 'megaphone' },
      { href: '/changelog', label: 'API changelog', icon: 'history' },
      { href: '/glossary', label: 'Glossary', icon: 'book' },
      { href: '/data-dictionary', label: 'Data dictionary', icon: 'table' },
      { href: '/resources', label: 'More from USAspending', icon: 'link' },
      { href: '/about', label: 'About these docs', icon: 'info' },
    ] },
  ];
}
