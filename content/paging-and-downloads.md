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

```python
import requests

URL = "https://api.usaspending.gov/api/v2/search/spending_by_award/"
body = {
    "filters": {"award_type_codes": ["A", "B", "C", "D"],
                "time_period": [{"start_date": "2025-10-01", "end_date": "2026-09-30"}]},
    "fields": ["Award ID", "Recipient Name", "Award Amount"],
    "limit": 100,
    "page": 1,
}
rows = []
while True:
    data = requests.post(URL, json=body).json()
    rows.extend(data["results"])
    if not data["page_metadata"]["hasNext"] or len(rows) >= 1000:
        break
    body["page"] += 1
print(len(rows))
```

## Sorting

Search endpoints take `sort` (a field name from `fields`) and `order` (`asc` or `desc`). Sorting by amount, descending, is what the site does by default.

## When to switch to a download

Paging works for thousands of rows, not millions. Search results stop at a fixed depth, so a broad search can't be paged to the end. For large pulls, request a file instead. The download endpoints queue a job and hand back two URLs:

1. `POST` a request to a download endpoint, such as [`/api/v2/download/awards/`](/reference/custom-downloads). The response comes back right away with a `file_name`, a `status_url`, and a `file_url`.
2. Poll `status_url` every few seconds. `status` moves from `ready` to `running` to `finished` (or `failed`).
3. When it reads `finished`, fetch `file_url`. It's a zip of CSV files.

```bash
curl -X POST 'https://api.usaspending.gov/api/v2/download/awards/' \
  -H 'Content-Type: application/json' \
  -d '{"filters": {"agencies": [{"type": "awarding", "tier": "toptier", "name": "Department of Energy"}], "time_period": [{"start_date": "2025-10-01", "end_date": "2026-09-30"}], "award_type_codes": ["A", "B", "C", "D"]}}'
```

That's the same pattern the site's Download Center uses. The [Download Center guide](/guides/download-center) walks through it call by call. For whole fiscal years by agency, the [Award Data Archive](/reference/bulk-downloads) has prepared files you can fetch without queueing a job.

## Limits and errors

The API doesn't publish rate limits. Cache what you can, avoid tight loops, and switch to downloads for bulk data. A request the API can't run comes back with a 4xx status and a JSON body that explains the problem, usually in a `detail` field. The live console on each endpoint page shows you the exact response.
