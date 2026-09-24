The USAspending API is the same API that runs usaspending.gov. Every chart, table, and profile on the site is a call you can make yourself.

- **Base URL:** `https://api.usaspending.gov`. Every endpoint lives under `/api/v2/`.
- **No key, no sign-up.** Send a request and you get data back.
- **JSON in, JSON out.** `GET` for lookups by ID or code. `POST` for anything that takes a filter object, with `Content-Type: application/json`.

## Two kinds of data

The site splits federal spending into two families, and most confusion about the API comes from mixing them up. Pick the family first, then the endpoint.

### Award data

Money the government has committed to a specific recipient: contracts, grants, loans, direct payments, and other assistance. Awards have prime recipients, a history of transactions, and sometimes subawards the prime recipient passed on.

On the site, this is **Search Award Data** and the award, recipient, and state profiles. In the API, start with [Advanced Search](/reference/advanced-search) and [Award summaries](/reference/award-summary).

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

### Account data

What agencies had available to spend and how they used it, reported from their Treasury accounts. This covers budgetary resources, obligations, and outlays by agency, federal account, program activity, and object class, including spending that never becomes an award, like salaries.

On the site, this is **Spending Explorer** and the agency and federal account profiles. In the API, start with [Agency profiles](/reference/agency-profiles), [Federal account profiles](/reference/federal-accounts), and [Spending Explorer](/reference/spending-explorer).

## Fiscal years

Federal fiscal years run October 1 to September 30 and are named for the year they end in. Fiscal year 2026 is October 1, 2025 through September 30, 2026. Endpoints that take `fiscal_year` mean this, not the calendar year.

Award search reaches back to October 1, 2007 (fiscal year 2008). For older award data, back to fiscal year 2001, use the [download endpoints](/reference/custom-downloads).

## Filters

Search endpoints take a `filters` object: time period, award type, agencies, recipients, locations, industry and product codes, and more. Filters combine with AND. Values inside one filter combine with OR. The [filter object page](/start/filters) has every filter with examples.

## Paging through results

Most list endpoints take `page` (starting at 1) and `limit`, and return a `page_metadata` object:

```json
{
  "page_metadata": {
    "page": 1,
    "limit": 10,
    "total": 2451,
    "next": 2,
    "previous": null,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

Keep requesting the next page while `hasNext` is `true`. Some search endpoints return a shorter version with only `page` and `hasNext`. Each endpoint's response fields show which one it uses.

## Big pulls

Paging works for thousands of rows, not millions. For large pulls, request a file instead: the [download endpoints](/reference/custom-downloads) queue a job and return a `status_url` to poll and a `file_url` for the finished file. That's the same path the site's Download Center uses.

## Limits and errors

The API doesn't publish rate limits. Cache what you can, avoid tight loops, and switch to downloads for bulk data. A request the API can't run comes back with a 4xx status and a JSON body describing the problem. The live console on each endpoint page shows you the exact response.
