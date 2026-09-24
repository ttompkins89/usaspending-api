A recipient profile covers one company, organization, or person that received federal money. The key detail is the recipient ID the page is built on.

## Recipient IDs and levels

A recipient ID is a hash of the recipient's identifier plus a level suffix: `-P` for a parent, `-C` for a child, and `-R` for a recipient with no parent relationship. The same organization can have more than one profile, one for each level. Get IDs from `POST /api/v2/recipient/`, which is what the recipient list page calls, rather than building them yourself.

## Reusing search endpoints

The charts on a recipient profile don't have endpoints of their own. They call the same search endpoints as Advanced Search with a recipient filter. If you can build an Advanced Search query, you can build these charts.
