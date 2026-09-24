// Maps every API contract to the usaspending.gov feature it powers.
// Order matters: the first matching rule wins. Paths are relative to /api/v2/.
export const SECTIONS = [
  { id: 'search', title: 'Search Award Data', blurb: 'The endpoints behind Advanced Search, keyword search, and natural-language search.' },
  { id: 'explore', title: 'Explore the Data', blurb: 'The endpoints behind Spending Explorer and the agency, account, state, recipient, award, and COVID-19 profiles.' },
  { id: 'download', title: 'Download the Data', blurb: 'The endpoints behind the Download Center: custom files, archives, and job status.' },
  { id: 'resources', title: 'Find Resources', blurb: 'Reference data, the glossary and data dictionary, and agency submission statistics.' },
];

export const FEATURES = [
  // Search Award Data
  { id: 'advanced-search', section: 'search', title: 'Advanced Search', siteRoute: '/search', summary: 'Filter awards, transactions, and subawards, then chart and table the results.' },
  { id: 'search-filters', section: 'search', title: 'Search filter pickers', siteRoute: '/search', summary: 'Type-ahead lookups that fill in agencies, recipients, locations, and industry codes.' },
  { id: 'natural-language', section: 'search', title: 'Natural-language search', siteRoute: '/search', summary: 'Turns a plain-English question into a filter object.' },
  { id: 'keyword-search', section: 'search', title: 'Keyword search', siteRoute: '/keyword_search', summary: 'Full-text search across transactions.' },
  // Explore the Data
  { id: 'spending-explorer', section: 'explore', title: 'Spending Explorer', siteRoute: '/explorer', summary: 'Drill down from budget function, agency, or object class to individual accounts.' },
  { id: 'agency-profiles', section: 'explore', title: 'Agency profiles', siteRoute: '/agency', summary: 'Budgetary resources, obligations, and award spending for each agency.' },
  { id: 'federal-accounts', section: 'explore', title: 'Federal account profiles', siteRoute: '/federal_account', summary: 'Spending, object classes, and program activities for each federal account.' },
  { id: 'states', section: 'explore', title: 'State and territory profiles', siteRoute: '/state', summary: 'Award amounts to each state and territory.' },
  { id: 'recipients', section: 'explore', title: 'Recipient profiles', siteRoute: '/recipient', summary: 'Award totals and details for each recipient, parent, and child.' },
  { id: 'award-summary', section: 'explore', title: 'Award summaries', siteRoute: '/award/:awardId', summary: 'One award: its funding, transactions, subawards, and, for IDVs, the orders under it.' },
  { id: 'covid-19', section: 'explore', title: 'COVID-19 spending', siteRoute: '/disaster/covid-19', summary: 'Disaster and emergency funding by agency, program, recipient, and place.' },
  // Download the Data
  { id: 'custom-downloads', section: 'download', title: 'Custom award and account data', siteRoute: '/download_center', summary: 'Request a file for any filter, then poll until it is ready.' },
  { id: 'bulk-downloads', section: 'download', title: 'Award data archive', siteRoute: '/download_center/award_data_archive', summary: 'Prepackaged monthly files and bulk award downloads.' },
  // Find Resources
  { id: 'reference-data', section: 'resources', title: 'Reference data', siteRoute: '/data-dictionary', summary: 'Agencies, codes, glossary, data dictionary, and other lookups used across the site.' },
  { id: 'submission-statistics', section: 'resources', title: 'Agency submission statistics', siteRoute: '/submission-statistics', summary: 'How and when agencies report their financial data.' },
  { id: 'legacy', section: 'resources', title: 'Other endpoints', siteRoute: null, summary: 'Endpoints the site no longer calls directly, kept for existing integrations.' },
];

const RULES = [
  [/^llm\//, 'natural-language'],
  [/^autocomplete\//, 'search-filters'],
  [/^references\/filter_tree/, 'search-filters'],
  [/^search\/spending_by_transaction/, 'keyword-search'],
  [/^search\/transaction_spending_summary/, 'keyword-search'],
  [/^search\//, 'advanced-search'],
  [/^references\/(filter|hash)\/?$/, 'advanced-search'],
  [/^spending\/?$/, 'spending-explorer'],
  [/^agency\//, 'agency-profiles'],
  [/^references\/(toptier_agencies|total_budgetary_resources|submission_periods|agency)/, 'agency-profiles'],
  [/^(federal_accounts|financial_balances|financial_spending|federal_obligations)/, 'federal-accounts'],
  [/^recipient\/state/, 'states'],
  [/^references\/states/, 'states'],
  [/^recipient/, 'recipients'],
  [/^(awards|idvs|transactions|subawards)/, 'award-summary'],
  [/^disaster\//, 'covid-19'],
  [/^references\/def_codes/, 'covid-19'],
  [/^bulk_download\//, 'bulk-downloads'],
  [/^download\//, 'custom-downloads'],
  [/^budget_functions\//, 'custom-downloads'],
  [/^reporting\//, 'submission-statistics'],
  [/^references\//, 'reference-data'],
];

export function featureFor(apiPath) {
  const p = apiPath.replace(/^\/api\/v\d\//, '');
  for (const [re, id] of RULES) if (re.test(p)) return id;
  return 'legacy';
}
