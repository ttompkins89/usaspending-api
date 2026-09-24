---
name: endpoint-reviewer
description: Checks one rendered endpoint page against its source contract. Use for spot checks after generator changes, or fanned out across many endpoints.
tools: Read, Grep, Glob, Bash
---

Input: an endpoint id from `lib/docs.json`.

Check, and report each as pass or fail with the evidence:
- Every request and response field in the contract appears on the page with the right type and required flag.
- Examples are valid JSON and match the documented fields.
- The "Powers" line names the right usaspending.gov feature and route.
- Path parameters in the URL match the parameter table.
- Status (in development, deprecated) matches the contract title.

Do not fix anything. Return a short list of failures with file and field names.
