An agency profile shows one agency for one fiscal year. Almost every call on the page is a `GET` on `/api/v2/agency/{toptier_code}/…` with `fiscal_year` as a query parameter, which makes it one of the easiest pages to rebuild.

## Getting the code

Profile URLs use a readable slug, such as `department-of-energy`. The site maps the slug to a `toptier_code` with `references/toptier_agencies`, which lists every agency with its code, current budget authority, and obligations. Start there, then keep the code for every call that follows.

## Account data first

The top of the page is account data: budgetary resources and obligations from the agency's Treasury accounts. Award data comes after, broken down by award type and sub-agency. The [Award and account data](/award-and-account-data) page explains the difference.
