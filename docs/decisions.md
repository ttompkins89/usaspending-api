# Decisions

- Subject: the USAspending API, chosen over openFDA, NWS, NPS, SAM.gov, Regulations.gov, Federal Register, OpenFEC, and Congress.gov for depth and fit with gov-contracting work.
- Name: USAspending API Reference, with an "Independent" tag in the header. No logo, flag, or government banner. Footer disclaimer on every page.
- Domain and repo: usaspending-api.vercel.app, public on GitHub, deployed by Vercel from `main`.
- Story: presented as independent creative design work.
- Design system: generated from usaspending.gov's own tokens (`src/_scss/core/_variables.scss`, USWDS-based), mapped to semantic light and dark roles. Replaces the earlier Tally identity.
- Shell: clean docs layout with left sub-navigation, on-this-page rail, dark mode, accordion endpoint rows, language tabs, and ⌘K search. The overview is the home page and sits inside the shell.
- Organization: by the usaspending.gov feature each endpoint powers, grouped under the site's four menus.
- Source of truth: the API Blueprint contracts, regenerated on every build. Both upstream repos are CC0 public domain.
- Added value beyond the reference: guides that trace site pages call by call, release notes from the site's Release Log, an API changelog from contract history, and the glossary and data dictionary from the API.
- Build modernization: Next.js 15 and React 19, Shiki highlighting at build time, a prebuilt search index, and a weekly rebuild.
