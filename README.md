# landing-page

Static Framer export for Botanika. The current design snapshot was imported from `botanika (10)`, retaining the existing footer markup, styles and behavior; the maintained build repairs localized SVG references and the static loading overlay target.

## Pages

Home, `/contact`, `/bonsai`, `/hoasen`, `/nimbus`, `/nura`, `/research`, `/offices`, `/imprint`, `/cookie-policy`, `/terms-and-conditions`, Vietnamese equivalents under `/vi`, and a 404 page. The full export replaces the former `/page-4` route.

## Local preview

Run `npm run build`, then `python3 -m http.server 8000 --directory public` and open `http://localhost:8000/`. Use `/contact/` for the directory-based contact page with this server. Build rewrites exported HTML in place; the deployment pipeline uses a disposable copy.

## Importing a new Framer export

Replace the exported pages/assets, but preserve the maintained `scripts/`, `package.json`, `.github/`, `deploy/` and `docs/`. In particular, keep our build scripts rather than overwriting them with the exporter's generated versions.

The `botanika (10)` import preserves the footer's Global Offices link in the source component and the shipped shared runtime bundle, including its language override and CSS. Build restores the matching static footer link after an import, without duplicating it on subsequent builds. Keep these runtime footer changes when importing again. Check both flat and directory route variants after future exports.

`npm run build` automatically restores same-document SVG references such as `url(./index.html#id)` and `<use href="./index.html#id">` to fragment-only references when the target ID exists in the HTML. It runs without `SITE_URL` too, and preserves navigation links and external assets. Missing IDs are left unchanged; references inside CSS blocks are not normalized.

Build also ensures every HTML output has the exporter's existing badge/editor-bar suppression CSS, without duplicating it. This keeps flat routes (`/contact`, served as `contact.html` by NGINX) consistent with directory routes (`/contact/`). For Python's local server, compare `/contact.html` and `/contact/`.

Run `npm test` for the SVG, footer import and navigation regression checks. After each import, preview the loading flow and technology cards on desktop/mobile before merging and manually deploying.

The exported Smooth Scroll module and home runtime bundle are patched locally: only unmodified same-document anchor clicks with an existing target are intercepted. Cross-page office links, new tabs and downloads retain browser navigation. `node --test scripts/smooth-scroll-navigation.test.mjs` exercises both shipped handlers. This patch is not yet in Framer; reapply it after a fresh export (or fix the upstream component) before deploying. The regression checks reject the original broken handlers.

## Known limitations of this snapshot

- Build restores the boot overlay's explicit element ID after each import. Still check both static and React loading overlays in a browser.
- Contact submits to `https://api-staging.botanika.ai/graphql` using `createContact`; home contact links target the staging site.
- Export certification reports failure (89 errors); its mirror manifest also reports 484 unresolved dependencies and 22 incomplete files. These are exporter diagnostics, not a post-import audit; the snapshot is not fully self-contained.
- `botanika (10)` verification: 10 regression checks passed; staging-origin build succeeded; all 1,331 local HTML resource/navigation references resolved across 43 HTML pages. Every content page retains the Global Offices footer link. Desktop browser preview cleared the loading dialog and rendered the home hero with no reported JavaScript errors. No contact data was submitted; API delivery and the complete 3D/animation sequence were not checked.
- Importing or merging a snapshot does not deploy it. Use the manual [Deploy staging workflow](https://github.com/damien277/landing-page/actions/workflows/deploy-staging.yml) on `main`; see [deployment and rollback instructions](docs/deployment-staging.md).

Deployment configuration in `deploy/` and documentation in `docs/` are maintained separately from generated website files.
