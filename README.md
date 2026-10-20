# landing-page

Static Framer export for Botanika. The current design snapshot was imported from `botanika (2)`; the build repairs localized SVG references.

## Pages

Home, `/contact`, `/page-4`, Vietnamese equivalents under `/vi`, and a 404 page.

## Local preview

Run `npm run build`, then `python3 -m http.server 8000 --directory public` and open `http://localhost:8000/`. Use `/contact/` for the directory-based contact page with this server. Build rewrites exported HTML in place; the deployment pipeline uses a disposable copy.

## Importing a new Framer export

Replace the exported pages/assets, but preserve the maintained `scripts/`, `package.json`, `.github/`, `deploy/` and `docs/`. In particular, keep our build scripts rather than overwriting them with the exporter's generated versions.

`npm run build` automatically restores same-document SVG references such as `url(./index.html#id)` and `<use href="./index.html#id">` to fragment-only references when the target ID exists in the HTML. It runs without `SITE_URL` too, and preserves navigation links and external assets. Missing IDs are left unchanged; references inside CSS blocks are not normalized.

Build also ensures every HTML output has the exporter's existing badge/editor-bar suppression CSS, without duplicating it. This keeps flat routes (`/contact`, served as `contact.html` by NGINX) consistent with directory routes (`/contact/`). For Python's local server, compare `/contact.html` and `/contact/`.

Run `npm test` for the SVG regression checks. After each import, preview the loading flow and technology cards on desktop/mobile before merging and manually deploying.

## Known limitations of this snapshot

- The boot overlay targets its explicit element ID. A fresh Framer export can overwrite this fix; check loading after each import.
- Contact uses FormSpark, not Botanika's `createContact` API. Contact links on the home page still point to the existing Botanika website.
- Export certification reports failure. Some locale warnings reference files that exist; the complete report is not an independently verified runtime verdict.
- Importing or merging a snapshot does not deploy it. Use the manual [Deploy staging workflow](https://github.com/damien277/landing-page/actions/workflows/deploy-staging.yml) on `main`; see [deployment and rollback instructions](docs/deployment-staging.md).

Deployment configuration in `deploy/` and documentation in `docs/` are maintained separately from generated website files.
