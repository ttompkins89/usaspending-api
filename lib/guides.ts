// Each guide explains how one usaspending.gov page is built from the API.
// The calls come from the site's public source (usaspending-website, src/js/apis and src/js/helpers).
export type GuideCall = { endpoint: string; when: string; note?: string };
export type Guide = { slug: string; title: string; short: string; summary: string; siteRoute: string; sourceFiles: string[]; calls: GuideCall[]; uncontracted?: { path: string; note: string }[] };

export const GUIDES: Guide[] = [
  {
    slug: 'advanced-search',
    short: 'Advanced Search',
    title: 'How Advanced Search works',
    summary: 'The filter panel, the charts, the results table, and the shareable URL, call by call.',
    siteRoute: '/search',
    sourceFiles: ['src/js/helpers/searchHelper.js', 'src/js/apis/search.js'],
    calls: [
      { endpoint: 'post-v2-references-hash', when: 'On load, if the URL has a search hash', note: 'Turns the hash back into the saved filter object.' },
      { endpoint: 'get-v2-awards-last-updated', when: 'On load', note: 'The "data as of" date above the results.' },
      { endpoint: 'post-v2-autocomplete-awarding-agency', when: 'While typing in the Agency filter' },
      { endpoint: 'post-v2-autocomplete-recipient', when: 'While typing in the Recipient filter' },
      { endpoint: 'get-v2-references-filter-tree-psc', when: 'When the Product and Service Code tree opens', note: 'Each level of the tree is its own call.' },
      { endpoint: 'post-v2-search-spending-by-award-count', when: 'After filters are applied', note: 'The counts on the Contracts, Grants, Loans, and other tabs.' },
      { endpoint: 'post-v2-search-spending-by-award', when: 'For the results table', note: 'One call per tab, one page at a time.' },
      { endpoint: 'post-v2-search-spending-over-time', when: 'For the Time chart' },
      { endpoint: 'post-v2-search-spending-by-category', when: 'For the Categories chart', note: 'The site calls a category-specific path, such as spending_by_category/awarding_agency/.' },
      { endpoint: 'post-v2-search-spending-by-geography', when: 'For the Map' },
      { endpoint: 'post-v2-references-filter', when: 'When you share or bookmark a search', note: 'Stores the filter object and returns the hash for the URL.' },
    ],
  },
  {
    slug: 'agency-profile',
    short: 'Agency profile',
    title: 'How an agency profile is built',
    summary: 'Budgetary resources, obligations by award type, recipients, and sub-agencies for one agency and fiscal year.',
    siteRoute: '/agency',
    sourceFiles: ['src/js/apis/agency.js'],
    calls: [
      { endpoint: 'get-v2-references-toptier-agencies', when: 'On the agency list and to resolve the URL slug to a toptier code' },
      { endpoint: 'get-v2-agency-toptier-code', when: 'On load', note: 'Name, mission, website, and the fiscal years available.' },
      { endpoint: 'get-v2-agency-toptier-code-budgetary-resources', when: 'For the Total Budgetary Resources section' },
      { endpoint: 'get-v2-agency-toptier-code-obligations-by-award-category', when: 'For the Award Obligations chart' },
      { endpoint: 'get-v2-agency-toptier-code-sub-agency-count', when: 'For the Award Spending section counts' },
      { endpoint: 'get-v2-agency-toptier-code-sub-agency', when: 'For the sub-agency table', note: 'Filtered by award type with award_type_codes.' },
      { endpoint: 'get-v2-agency-toptier-code-awards', when: 'For the award summary tiles' },
      { endpoint: 'get-v2-agency-toptier-code-awards-new-count', when: 'For the new awards count' },
      { endpoint: 'get-v2-agency-toptier-code-sub-components', when: 'For Status of Funds, by bureau' },
    ],
    uncontracted: [{ path: '/api/v2/agency/{toptier_code}/recipients/', note: 'The site calls this for the recipient distribution chart, but the API repo has no contract for it, so it has no reference page here.' }],
  },
  {
    slug: 'recipient-profile',
    short: 'Recipient profile',
    title: 'How a recipient profile is built',
    summary: 'One recipient: totals, parent and child relationships, and awards over time.',
    siteRoute: '/recipient',
    sourceFiles: ['src/js/helpers/recipientHelper.js', 'src/js/helpers/recipientLandingHelper.js'],
    calls: [
      { endpoint: 'post-v2-recipient', when: 'On the recipient list page', note: 'Search and sort all recipients.' },
      { endpoint: 'get-v2-recipient-recipient-id', when: 'On load', note: 'The recipient id combines the unique identifier with a level: P (parent), C (child), or R (recipient).' },
      { endpoint: 'get-v2-recipient-children-duns-or-uei', when: 'For parent recipients', note: 'The list of child recipients.' },
      { endpoint: 'post-v2-search-new-awards-over-time', when: 'For the new awards chart' },
      { endpoint: 'post-v2-search-spending-over-time', when: 'For transactions over time', note: 'The same search endpoint as Advanced Search, filtered to this recipient.' },
    ],
  },
  {
    slug: 'award-summary',
    short: 'Award summary',
    title: 'How an award summary is built',
    summary: 'One award: overview, funding, federal accounts, transactions, and subawards, plus the extra calls for IDVs.',
    siteRoute: '/award/:awardId',
    sourceFiles: ['src/js/helpers/searchHelper.js', 'src/js/helpers/awardSummaryHelper.js', 'src/js/helpers/awardHistoryHelper.js', 'src/js/helpers/idvHelper.js'],
    calls: [
      { endpoint: 'get-v2-awards-award-id', when: 'On load', note: 'Use the generated_unique_award_id from search results.' },
      { endpoint: 'post-v2-awards-funding-rollup', when: 'For the funding summary' },
      { endpoint: 'post-v2-awards-accounts', when: 'For the federal accounts section' },
      { endpoint: 'get-v2-awards-count-transaction-award-id', when: 'For the Award History tab counts' },
      { endpoint: 'post-v2-transactions', when: 'For the Transaction History table' },
      { endpoint: 'post-v2-subawards', when: 'For the Sub-Awards table' },
      { endpoint: 'post-v2-awards-funding', when: 'For Federal Account Funding' },
      { endpoint: 'post-v2-idvs-awards', when: 'IDVs only: the orders placed under the vehicle' },
      { endpoint: 'get-v2-idvs-amounts-award-id', when: 'IDVs only: rolled-up amounts across child awards' },
    ],
  },
  {
    slug: 'download-center',
    short: 'Download Center',
    title: 'How the Download Center works',
    summary: 'Request a file, poll until it is ready, then fetch it. The same pattern covers award, account, and archive files.',
    siteRoute: '/download_center',
    sourceFiles: ['src/js/helpers/bulkDownloadHelper.js', 'src/js/helpers/downloadHelper.js'],
    calls: [
      { endpoint: 'post-v2-bulk-download-list-agencies', when: 'To fill the agency picker' },
      { endpoint: 'get-v2-budget-functions-list-budget-functions', when: 'For account data: the budget function picker' },
      { endpoint: 'post-v2-download-count', when: 'Before a search download', note: 'Checks the row count against the download limit.' },
      { endpoint: 'post-v2-bulk-download-awards', when: 'Custom Award Data: submit the request', note: 'Returns a file name and a status URL right away.' },
      { endpoint: 'post-v2-download-accounts', when: 'Custom Account Data: submit the request' },
      { endpoint: 'post-v2-download-search', when: 'From Advanced Search: download awards, transactions, and subawards together' },
      { endpoint: 'get-v2-download-status', when: 'Every few seconds until status is finished', note: 'When it finishes, file_url points to the zip.' },
      { endpoint: 'post-v2-bulk-download-list-monthly-files', when: 'Award Data Archive: list the prepackaged files' },
    ],
  },
];
export const guide = (slug: string) => GUIDES.find((g) => g.slug === slug);

// Which guide explains each reference feature.
const FEATURE_GUIDE: Record<string, string> = {
  'advanced-search': 'advanced-search', 'search-filters': 'advanced-search', 'agency-profiles': 'agency-profile', recipients: 'recipient-profile',
  'award-summary': 'award-summary', 'custom-downloads': 'download-center', 'bulk-downloads': 'download-center',
};
export const guideForFeature = (featureId: string) => (FEATURE_GUIDE[featureId] ? guide(FEATURE_GUIDE[featureId]) : undefined);
