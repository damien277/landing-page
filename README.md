# landing-page

Static Framer export for Botanika. The current snapshot was imported from `botanika (2)` without repairing generated code.

## Pages

Home, `/contact`, `/page-4`, Vietnamese equivalents under `/vi`, and a 404 page.

## Local preview

Run `python3 -m http.server 8000` and open `http://localhost:8000/`. Use `/contact/` for the directory-based contact page with this server.

## Known limitations of this snapshot

- The loading overlay can remain at `0%`; the earlier local lookup fix is not present in this export.
- Contact uses FormSpark, not Botanika's `createContact` API. Contact links on the home page still point to the existing Botanika website.
- Export certification reports failure. Some locale warnings reference files that exist; the complete report is not an independently verified runtime verdict.
- Importing this snapshot does not deploy it. The staging deployment guide describes the initial home-only release; its upload list must include new routes before deploying this version.

Deployment configuration in `deploy/` and documentation in `docs/` are maintained separately from generated website files.
