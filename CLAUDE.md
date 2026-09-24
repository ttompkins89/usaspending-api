# Tally: USAspending API docs

Independent developer docs for the USAspending API, organized around the usaspending.gov features each endpoint powers. Deployed at https://usaspending-api.vercel.app. Public repo. Not affiliated with the U.S. Treasury or USAspending.gov.

## Commands

- `npm run docs`: regenerate `lib/docs.json` from the latest contracts (sparse-clones the public usaspending-api repo into `.contracts/`). `-- --contracts <dir>` uses a local copy.
- `npm run tokens`: regenerate `app/tokens.css` from `tokens/tokens.json`.
- `npm run build`: runs both, then `next build`. If the contracts can't be fetched, the committed `lib/docs.json` is used.

## Where content comes from

- Endpoint pages: generated only. Never hand-edit `lib/docs.json`; fix the generator (`scripts/build-docs.mjs`) or the feature map instead.
- Which site feature an endpoint belongs to: `scripts/feature-map.mjs`. First matching rule wins. Anything unmatched lands in "Other endpoints"; treat that as a bug to fix in the map.
- The filter object page renders upstream `search_filters.md` as-is.
- Hand-written pages: `content/*.md` only.
- Tolerated upstream slips (undefined or mis-capitalized type names, missing URLs) are handled in the generator and shown on the page as contract notes. Don't silently patch around new ones; add a note.

## Design

- Components read semantic tokens only (`var(--color-action)`, `var(--space-4)`). Never hard-code a hex value in a component.
- Identity: Tally, retuned to USWDS values. Public Sans body, Big Shoulders Display headings, Roboto Mono code.
- Every text and fill pair meets WCAG AA. Real `<button>`, `<a>`, `<label>` elements. Visible gold focus ring.

## Guardrails

- Never use the USAspending.gov logo, the U.S. flag, the "official website of the United States government" banner, or anything implying this is a government product. The footer disclaimer stays on every page.
- The live console only proxies to `https://api.usaspending.gov/api/v2/`. Never widen the proxy to other hosts.
- No secrets. The API needs no keys.

## Voice

Plain, specific, short. Lead with what the endpoint does and which site feature it powers. No em dashes. Sentence case headings. No filler words like "simply" or "just."

## Subagents

See `.claude/agents/`: `contract-steward`, `endpoint-reviewer`, `a11y-auditor`, `site-parity-checker`.
