usaspending.gov splits federal spending into two families. Most confusion about the API comes from mixing them up, so pick the family first, then the endpoint.

## Award data

Money the government has committed to a specific recipient: contracts, grants, loans, direct payments, and other assistance. Awards have prime recipients, a history of transactions, and sometimes subawards the prime recipient passed on.

On the site, this is **Search Award Data** and the award, recipient, and state profiles. In the API, start with [Advanced Search](/reference/advanced-search) and [Award summaries](/reference/award-summary).

### Award type codes

Awards are filtered by type code. These are the groups the site sends when you tick a box:

| Award type | Codes |
| --- | --- |
| Contracts | `A`, `B`, `C`, `D` |
| Contract IDVs (indefinite delivery vehicles) | `IDV_A`, `IDV_B`, `IDV_B_A`, `IDV_B_B`, `IDV_B_C`, `IDV_C`, `IDV_D`, `IDV_E` |
| Grants | `02`, `03`, `04`, `05` |
| Direct payments | `06`, `10` |
| Loans | `07`, `08` |
| Other | `09`, `11` |

The site's search results table has one tab per group and requests each group separately. Doing the same keeps result fields consistent, since contracts and grants carry different columns.

### Prime awards and subawards

A prime award goes from an agency to a recipient. A subaward goes from that recipient to someone else. Search endpoints return prime awards by default. Set `"subawards": true` on `spending_by_award` to search subawards instead, or use [`spending_by_subaward_grouped`](/reference/advanced-search) to see subawards rolled up under their prime award.

## Account data

What agencies had available to spend and how they used it, reported from their Treasury accounts. This covers budgetary resources, obligations, and outlays by agency, federal account, program activity, and object class, including spending that never becomes an award, like salaries.

On the site, this is **Spending Explorer** and the agency and federal account profiles. In the API, start with [Agency profiles](/reference/agency-profiles), [Federal account profiles](/reference/federal-accounts), and [Spending Explorer](/reference/spending-explorer).

## Where the two meet

File C of each agency's monthly submission links account data to award data: it records which awards were paid from which federal account. That link is what lets an award summary show **Federal Account Funding**, and what lets an agency profile break obligations down by award type. The [Glossary](/glossary) defines File A, File B, and File C.

## Fiscal years

Federal fiscal years run October 1 to September 30 and are named for the year they end in. Fiscal year 2026 is October 1, 2025 through September 30, 2026. Endpoints that take `fiscal_year` mean this, not the calendar year.

Award search reaches back to October 1, 2007 (fiscal year 2008). For older award data, back to fiscal year 2001, use the [download endpoints](/reference/custom-downloads).

## Agency codes

Most agency endpoints take a `toptier_code`: the three-digit CGAC code (such as `020` for the Department of the Treasury) or, for a few agencies, a four-digit FREC code. [`/api/v2/references/toptier_agencies/`](/reference/reference-data) lists every agency with its code, which is how the site turns the agency name in a URL into a code.
