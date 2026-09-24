# USAspending API Reference

Independent developer docs for the [USAspending API](https://api.usaspending.gov), organized around the usaspending.gov pages each endpoint powers. Live at **https://usaspending-api.vercel.app**.

Designed and built by Tanika Tompkins. Not affiliated with, endorsed by, or operated by the U.S. Department of the Treasury or USAspending.gov.

## What's in it

- **A reference organized like the site.** All 176 endpoints, filed under the usaspending.gov feature that calls each one and grouped under the site's four menus. Feature pages list endpoints as accordion rows with ready-to-run cURL, Python, and JavaScript.
- **A live console on every endpoint.** Requests run against the real API through a small, locked-down proxy.
- **Guides that trace real pages.** Advanced Search, agency and recipient profiles, award summaries, and the Download Center, call by call, from the site's public source.
- **Release notes and an API changelog.** The site's Release Log with API mentions pulled out, and every contract change since October 2024 linked to the endpoints it touched.
- **Glossary and data dictionary**, straight from the API.
- **Built from the site's own design tokens.** Colors and type sizes are generated from usaspending.gov's `_variables.scss`, with light and dark themes.

## Run it

```bash
npm install
npm run dev      # uses the committed generated data
npm run build    # tokens, docs, resources, then next build
```

Each generator can use local copies instead of cloning: `SITE_SCSS`, `CONTRACTS_DIR` and `CONTRACTS_SHA`, `CONTRACTS_GIT`.

## Map of the repo

| Path | What it is |
| --- | --- |
| `scripts/build-tokens.mjs`, `tokens/` | Site SCSS tokens to DTCG JSON and `app/tokens.css` (light and dark roles in `tokens/semantic.json`) |
| `scripts/build-docs.mjs`, `scripts/feature-map.mjs` | API Blueprint contracts to `lib/docs.json`, filed by site feature |
| `scripts/build-resources.mjs` | Release notes, changelog, glossary, and data dictionary data |
| `lib/guides.ts`, `content/` | Guide call orders and the hand-written pages |
| `app/`, `components/` | Next.js App Router pages and the docs shell |
| `app/api/proxy` | Live console proxy, limited to `api.usaspending.gov/api/v2/` |
| `.github/workflows/` | Weekly rebuild so generated content stays current |
| `CLAUDE.md`, `.claude/agents/` | Working instructions and subagents for Claude sessions |

## Stack

Next.js 15 (App Router, static generation), React 19, TypeScript, Shiki, react-markdown. Hosted on Vercel.

## Credits

API contracts and usaspending.gov source are public domain (CC0) from the [Bureau of the Fiscal Service](https://github.com/fedspendingtransparency). Type: Source Sans 3 and Source Code Pro.
