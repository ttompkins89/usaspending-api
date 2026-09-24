The Download Center turns filters into files. Every download, whether from Custom Award Data, Custom Account Data, or an Advanced Search results table, follows the same three steps: ask for a file, wait for it, fetch it.

## Why it works this way

Files can hold millions of rows, so they're built by a background job instead of inside the request. The request returns right away with a `status_url` to poll and the `file_url` the finished zip will live at. The [Paging and downloads](/paging-and-downloads) page shows the loop in code.

## Before you ask

The site checks size before it queues a search download: `download/count` says how many rows a filter would produce and whether that's over the limit. It also fills its agency and budget function pickers from the list endpoints below, which you can use to build valid requests.
