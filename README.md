# Tally: USAspending API docs

Independent developer docs for the [USAspending API](https://api.usaspending.gov), organized around the usaspending.gov features each endpoint powers. Live at **https://usaspending-api.vercel.app**.

Designed and built by Tanika Tompkins. Not affiliated with, endorsed by, or operated by the U.S. Department of the Treasury or USAspending.gov.

## What makes it different

- **Organized like the site.** Every endpoint is filed under the usaspending.gov feature that calls it (Advanced Search, agency profiles, the Download Center, and so on), traced through the site's public source code, and grouped under the site's four menus.
- **Generated, never hand-edited.** Each build pulls USAspending's API Blueprint contracts and regenerates every endpoint page, so the docs can't drift from the API.
- **Live console on every page.** Requests run against the real API through a small, locked-down proxy.
- **Honest about the source.** Where a contract has a slip (a missing URL, a mistyped type name), the generator tolerates it and says so on the page.

## Run it

```bash
npm install
npm run dev          # uses the committed lib/docs.json if present
npm run docs         # regenerate lib/docs.json from the latest contracts
npm run build        # tokens, docs, then next build
```

`npm run docs -- --contracts <path-to>/usaspending_api/api_contracts` uses a local copy of the contracts.

## Map of the repo

| Path | What it is |
| --- | --- |
| `scripts/build-docs.mjs` | Contract parser and page-data generator (API Blueprint via `drafter.js`) |
| `scripts/feature-map.mjs` | Which usaspending.gov feature each endpoint powers |
| `tokens/tokens.json` | Design tokens (USWDS primitives, semantic layer) |
| `scripts/build-tokens.mjs` | Writes `app/tokens.css` from the tokens |
| `content/*.md` | The only hand-written pages |
| `app/api/proxy` | Live console proxy, limited to `api.usaspending.gov/api/v2/` |
| `CLAUDE.md`, `.claude/agents/` | Working instructions and subagents for Claude sessions |
| `docs/decisions.md` | Project decisions |

## Credits

API contracts and usaspending.gov source are public domain (CC0) from the [Bureau of the Fiscal Service](https://github.com/fedspendingtransparency). Type: Public Sans, Big Shoulders Display, Roboto Mono.
