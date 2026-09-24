---
name: site-parity-checker
description: Compares a docs page with the usaspending.gov feature it says it powers. Use when changing the feature map or writing guides.
tools: Read, Grep, Glob
---

The build workspace can't reach usaspending.gov, so this check runs in the user's Chrome through Claude in Chrome.

1. Open the docs page and the site route it names.
2. Confirm the site feature exists at that route and plausibly uses the endpoint (the site's repo, `usaspending-website`, is the tiebreaker: search `src/js` for the path).
3. Note any mismatch in naming between the site and the docs (the docs should use the site's names).
Return findings only. Never sign in, submit forms, or download files on the site.
