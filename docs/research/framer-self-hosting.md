# Framer designer sync and self-hosting

Researched: 2026-10-19. Scope: Botanika's Framer clone, existing NoCodeExport snapshot, external GraphQL contact API. Research only; no deployment, exporter installation, paid export or application changes performed.

## Recommendation

Keep Framer as the authoring source. If the only requirement is avoiding Vercel, Framer hosting already does that. If visitors must pass through company infrastructure, prefer an NGINX reverse proxy with Framer as origin. If independently hosted files and removal of the Framer hosting dependency are mandatory, use a gated snapshot/export pipeline, accepting additional maintenance. Do not introduce Next.js merely to serve the snapshot.

## Verified support and evidence

- Framer's dedicated export help explicitly says it does not offer HTML export for self-hosting. Its portability help contradictorily says published files can be downloaded, but supplies no usable export procedure. Do not assume a native supported export API exists without confirmation from Framer. [Export policy](https://www.framer.com/help/articles/can-i-export-my-website-to-html-and-self-host-it/), [portability statement](https://www.framer.com/help/articles/porting-your-data-from-framer/).
- Framer officially documents reverse proxies, explicitly including NGINX. The proxy fetches/caches Framer-origin pages, avoiding download/upload on every update. This is not independent static hosting. Use a custom origin domain or `*.framer.website`, not `*.framer.app`; configure the public canonical URL. The guide ties canonical configuration to the Advanced Hosting add-on, so verify plan/cost before committing. Do not rewrite Framer-managed head tags or content inside `#main`. [Reverse proxy guide](https://www.framer.com/help/articles/how-to-self-host-using-reverse-proxy/).
- NoCodeExport documents an asynchronous export REST API available on Pro/Agency: create job, poll status, download ZIP. Agency gets completion/failure webhooks; Pro can poll. These are exporter-job webhooks, not proof of a Framer publish webhook. API availability is documented; a successful paid Botanika export was not exercised. [API](https://www.nocodeexport.com/en/developer-api).
- NoCodeExport's own Framer documentation describes static output, not original authored React components. CMS changes require re-export; platform-backed services and forms need verification/reconnection; reachable assets are downloaded according to plan, while third-party/large assets can remain remote. Treat marketing promises about automatically rewired forms as unverified for Botanika. [Framer export](https://www.nocodeexport.com/en/framer), [docs](https://www.nocodeexport.com/en/docs), [pricing](https://www.nocodeexport.com/en/pricing).
- `osisdie/framer-exporter` has actual Playwright-based CLI/source and MIT licensing. Its CI and README do not establish reliable Botanika exports or significant production adoption. [Repository](https://github.com/osisdie/framer-exporter).
- `frexport` has an implemented Playwright pipeline, asset rewriting/packaging, tests and Docker configuration. It bundles Framer runtime locally rather than replacing it with authored source. No license file was found during research; do not adopt its code without resolving licensing. [Repository](https://github.com/batuhanisildak-malwation/frexport), [pipeline implementation](https://github.com/batuhanisildak-malwation/frexport/blob/main/src/core/pipeline.ts).

Conclusion: real implementations exist. No named, independently verified production deployment at meaningful scale was established by this research. Repositories and vendor claims prove feasibility, not production maturity.

## Lowest-maintenance workflow: supported hosting or proxy

1. Designer edits the same Framer project; custom API form remains a developer-owned component.
2. Publish a preview/staged version, review desktop/mobile, navigation, loading/3D and contact behavior.
3. Deploy the approved version in Framer. Keep development previews separate from the origin served to production.
4. If proxying, route public traffic through existing NGINX to the approved Framer origin. Do not cache HTML initially. Add HTML caching only with a known TTL/invalidation procedure; Framer-origin invalidation does not establish that an additional proxy cache has been purged.
5. Keep API traffic directed to the existing Botanika backend; verify CORS/CSP for the actual public origin. No secrets in client code.
6. Roll back by deploying a previous Framer published version, invalidating any added proxy cache as necessary.

Published deployment rollback is not the same as restoring editor Version History. Staging/version features and pricing must be checked for the actual project plan. [Framer staging](https://www.framer.com/help/articles/staging-and-versions/).

## Independent static hosting workflow

Recommended initial trigger: explicit release, not every designer keystroke or a timer. Prove a manual export first; automate only once two successive layout revisions can be released without hand-editing generated files.

1. Designer publishes an approved candidate to an exporter-accessible Framer URL. Freeze it during export or use a stable version URL where supported.
2. Trigger a release job, initially with an uploaded ZIP. Once paid API access and export fidelity are validated, use NoCodeExport API: POST job -> poll -> download. Keep API keys only in CI secrets.
3. Archive the raw ZIP with source URL, export timestamp, exporter version where available, and a locally computed SHA-256. Raw output is immutable.
4. Unpack into a clean temporary workspace. Apply only explicit, reproducible transformations such as final public canonical/sitemap URLs. Fix recurring authored bugs in Framer, not by repeatedly patching generated bundles.
5. Deploy the resulting artifact to a protected/noindex preview; do not disable intentional dependencies such as the contact API while auditing unwanted Framer runtime dependencies.
6. Verify `/` and `/contact` by direct navigation and refresh; page assets and MIME types; mobile/desktop layout; menu/CTAs; completed loading/3D; source HTML/SEO; and contact error/success behavior. Use staging/test data rather than creating production contact spam on every release. Explicitly audit external requests and decide which are intentional.
7. Designer approves the preview. Promote the exact tested artifact to a new release directory on the server, then switch the active release atomically. Keep old release assets available for existing tabs; do not delete the currently served directory before uploading its replacement.
8. Roll back by switching to a previous complete artifact, not by re-exporting the moving Framer site.

GitHub Actions supports explicit `workflow_dispatch`; Playwright documents browser checks in CI. These building blocks do not imply a pre-existing turnkey Framer-to-server integration. [Manual workflow trigger](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [Playwright CI](https://playwright.dev/docs/ci-intro).

## Current Botanika snapshot: local evidence

A read-only Node inspection of the existing JSON reports produced:

| Signal | Value |
|---|---|
| `framer-certification.json` status / passed | `failed` / `false` |
| `framer-mirror.json` complete | `false` |
| Routes in mirror manifest | `/` only; no `/contact` |
| Unresolved dependencies reported | 22 |
| `framer-runtime-closure.json` complete | `true` |
| External-library policy / references | `preserve-remote-cdn` / 31 |

These are exporter-generated reports from the existing snapshot, not a fresh independent runtime audit. A passing hero smoke run does not establish complete localization or route coverage; conversely the report does not prove every reported reference is currently causing a visible failure.

`scripts/finalize-seo-origin.mjs` currently rewrites source files before copying to `public/`. Copy/write errors are logged without forcing a nonzero exit. It copies nearly all non-excluded root entries, including a future `docs/` directory. A production release job should build from a clean disposable directory, fail on missing required output, and publish only intended website files. This research did not change that script.

The new Framer `/contact` is not part of the old local route manifest. Export it afresh before evaluating independent hosting. Its external GraphQL backend should remain unchanged during this pilot.

## Pilot acceptance

- One complete snapshot includes both home and contact.
- Form submission reaches the existing backend from the self-hosted origin; invalid/error cases do not silently lose input.
- Loading, 3D and mobile navigation work after serving the snapshot independently.
- Designer makes a second real layout change; the next export/deploy needs no manual generated-code repairs.
- A previous release can be restored without recrawling Framer.

If the second change repeatedly requires bundle surgery, stop expanding the export pipeline: choose supported Framer hosting/proxying, or reconsider the authoring platform if independent source hosting is non-negotiable.

## Limits

No paid export, exporter benchmark, server configuration, production migration, new form submission or UI change was performed. Actual Framer plan/canonical eligibility, NoCodeExport paid-account behavior and full Botanika export fidelity remain unverified. Public pricing and vendor features can change. Asset/template/component licenses must allow the intended use.

## Follow-up: the user's actual exporter, `nocodeexport.site`

The earlier NoCodeExport API/pricing research concerns `www.nocodeexport.com`. Do not transfer its plans, API endpoints, webhook support or limits to `www.nocodeexport.site`; no relationship between the operators was established.

Direct browser inspection of [the supplied site](https://www.nocodeexport.site/home) and its authenticated `/new-export` workspace found:

- Public branding: NoCodeExport, by Vibe+ Studio.
- Public workflow description: published URL -> generated HTML/CSS/JS/assets -> review/download or push to connected GitHub -> Vercel deploy.
- Actual export-mode controls: `Static HTML` / `Self-hosted HTML` and `Framer CMS Live` / `CMS Live`. Selecting the latter changes the mode label, but its behavior was not exercised. It is not evidence of live layout sync.
- The PaaS panel labels Vercel, GitHub and GA4 as Stable. Netlify, Cloudflare Pages, GitHub Pages and Umami are marked Coming soon. No direct SSH/SFTP/server deployment target was observed.
- The landing-page product illustration includes Download ZIP and Rescan. This is an illustration, not a verified completed export/rescan.
- The inspected account's project list was empty, so existing-project rescan, GitHub update semantics and deployment history could not be checked.
- No export was started, credits consumed, repository connected, Google permissions granted, or deployment triggered.

For Botanika, select Static HTML for an initial pilot. Keep all authored layout and contact code in Framer, publish the candidate, export both `/` and `/contact`, then download/archive the artifact. Deliver to a test NGINX host manually first, or use GitHub delivery once its overwrite/history behavior is verified. Server deployment replaces only the final Vercel stage. Re-export after layout changes; do not infer automatic layout updates from the CMS Live mode name.

Before automating, verify two successful successive exports, GitHub branch/commit behavior, whether removed pages disappear on the next release, and a documented API/webhook for this exact `.site` service. No such automation contract was verified in this inspection.
