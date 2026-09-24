Advanced Search is the busiest page on usaspending.gov and the best map of the search API. Everything on it is driven by one **filter object**. The page builds that object as you pick filters, then sends the same object to several endpoints at once: one for each chart and one for each results tab.

## The pattern to copy

1. Build a single `filters` object. The [filter object page](/filters) covers every key.
2. Ask for counts first with `spending_by_award_count`. The site uses the counts to label its tabs and skip empty ones.
3. Request results one award group at a time with `spending_by_award`, since contracts, grants, and loans return different columns.
4. Send the same filters to `spending_over_time`, `spending_by_category`, and `spending_by_geography` for charts.

## Sharing a search

A search URL on the site ends in a short hash. When you share a search, the page stores the filter object with `references/filter` and gets the hash back. Opening that URL later calls `references/hash` to turn it back into filters. You can use the same pair to save searches in your own app.
