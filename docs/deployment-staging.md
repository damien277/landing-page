# Botanika staging: manual deploy and rollback

Website: https://hello.botanika.ai

## Run a deployment

1. Open [GitHub Actions → Deploy staging](https://github.com/damien277/landing-page/actions/workflows/deploy-staging.yml).
2. Select **Run workflow**, branch **main**.
3. Set **operation = deploy** and leave **release** empty.
4. Wait for the run to finish. Its summary lists the active release and the previous release.

CLI equivalent:

```sh
gh workflow run deploy-staging.yml --repo damien277/landing-page --ref main -f operation=deploy
```

This workflow is manual-only. Pushing or merging a new export does not deploy it automatically. Workflow runs on branches other than `main` are skipped. Runs are serialized; an active deployment is not canceled by the next run.

## Roll back

Run the same workflow with **operation = rollback**:

- Leave **release** empty to restore `/home/botanika/previous`.
- Supply an existing release ID to restore that exact version.
- A rollback saves the formerly active version as `previous`, so a second blank rollback switches back.

```sh
gh workflow run deploy-staging.yml --repo damien277/landing-page --ref main \
  -f operation=rollback -f release=20261019T094542Z
```

The timestamp release above is the initial home-only deployment. It has no contact routes or `release.txt`; rollback verification intentionally accommodates that legacy snapshot.

## Pipeline behavior

- Tests the actual release-switch helper using isolated temporary directories: activation, rollback, no-op, invalid/missing releases and unsafe symlinks.
- Uploads the pristine GitHub checkout to `/home/botanika/source`, excluding `.git`, `public` and `node_modules`; removes obsolete source files.
- Builds in a disposable directory because the exporter rewrites SEO in place. Sets `SITE_URL=https://hello.botanika.ai`.
- Includes all exported HTML routes, `_remote`, `_nce`, root PNG icons, robots and sitemap. Does not serve source docs, workflow/config files or export diagnostic JSON.
- Publishes a unique release `<commit-sha>-<run-id>-<attempt>` and `release.txt` identifying that release.
- Uploads the complete artifact before atomically switching the `current` symlink. Retains the former release as `previous`; no NGINX reload is required.
- Verifies HTTPS responses for home, contact, page-4 and Vietnamese equivalents plus the release marker. Rollback verifies home and the marker when one exists.
- If activation or post-switch HTTP verification fails, attempts to restore the original active release and fails the workflow. Inspect the logs if automatic restoration also fails. Upload/build failures before switching leave the active release untouched.

These are infrastructure checks, not proof that every animation or form works. The current imported snapshot still has the known loading-overlay regression and FormSpark contact integration; this pipeline does not repair them or submit contact data during deployment.

## Server paths and access

| Purpose | Path / value |
|---|---|
| Server | `13.228.44.134` |
| CI SSH user | `botanika-deploy` — no sudo or Docker access |
| Latest pipeline source checkout | `/home/botanika/source` |
| Retained static releases | `/home/botanika/releases/<release-id>` |
| NGINX document root | `/home/botanika/current` |
| Previous release | `/home/botanika/previous` |
| Virtual host | `/etc/nginx/sites-available/hello.botanika.ai` |
| ACME webroot | `/home/botanika/acme` |
| Certificate | `/etc/letsencrypt/live/hello.botanika.ai/` |

Rollback switches public files only; `/home/botanika/source` remains the latest workflow checkout, not the source of the restored historical release. GitHub keeps source history. Retained releases are not automatically deleted. Old browser tabs can request assets missing from a new snapshot; validate asset compatibility before deleting old releases or adding long-lived caches.

## Credentials and operations

Repository Actions secrets:

- `STAGING_SSH_KEY`: dedicated private key; never committed.
- `STAGING_KNOWN_HOSTS`: server ED25519 host key, obtained through the existing verified SSH connection. CI uses strict host checking, not an unverified keyscan.

The matching restricted public key is in `/home/botanika-deploy/.ssh/authorized_keys`. Rotate the private/public pair together. Host key changes require out-of-band verification before replacing the known-hosts secret.

Source/helper: `deploy/staging-release.sh`. Local regression check: `./deploy/test-staging-release.sh`.

NGINX config: `deploy/hello.botanika.ai.conf`. Changes to that file are not automatically installed by this workflow; a server administrator must review/install it, run `sudo nginx -t`, then reload NGINX. Do not modify the shared `staging-botanika` virtual host.

HTTPS renewal uses existing `certbot.timer` and the scoped hook sourced from `deploy/renew-hello-certificate.sh`. Staging responses send `X-Robots-Tag: noindex, nofollow`; this is not password protection.

```sh
ssh botanika 'sudo certbot renew --cert-name hello.botanika.ai --dry-run --run-deploy-hooks'
```
