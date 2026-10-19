# Botanika static staging deployment

## Active setup

- URL: https://hello.botanika.ai
- Server: `13.228.44.134`, SSH alias `botanika`, user `ubuntu`.
- Managed source snapshot: `/home/botanika/source`.
- Static releases: `/home/botanika/releases/<release-id>`.
- NGINX document root: `/home/botanika/current`, a symlink to the active release.
- Initial release: `20261019T094542Z`.
- Virtual host: `/etc/nginx/sites-available/hello.botanika.ai`, linked from `sites-enabled`.
- Local virtual-host source: `deploy/hello.botanika.ai.conf`.
- TLS: Let's Encrypt certificate `hello.botanika.ai`; renewal uses the existing `certbot.timer` and `/home/botanika/acme` webroot.
- Scoped NGINX reload hook: `/etc/letsencrypt/renewal-hooks/deploy/hello-botanika`, sourced from `deploy/renew-hello-certificate.sh`.
- Static files only: no application port, Node service, PM2 or new Docker container required on the server. Build with Node locally.
- Staging responses send `X-Robots-Tag: noindex, nofollow` and revalidate caches. This does not password-protect the site.

## Content boundary

This deployment is the existing local Framer export, not a new export of the current Framer clone. The local loading-overlay lookup fix is included. The Framer `/contact` Code Component created later is not included in this snapshot; existing Contact links continue to `https://botanika.ai/contact`.

Keep the full source and generated export reports outside the served release. Only website HTML, icons, robots/sitemap, `_nce` and `_remote` were uploaded to the document root. Research docs, deployment configs and export diagnostics are not public.

## Update from a reviewed export

Run from the local project root. Review the new export before replacing source; do not merge generated bundles by hand.

```sh
BUILD_DIR=$(mktemp -d /tmp/botanika-staging.XXXXXX)
RELEASE=$(date -u +%Y%m%dT%H%M%SZ)

# Build from a disposable copy: the exporter build rewrites SEO in place.
rsync -a --exclude public --exclude .git --exclude node_modules \
  --exclude docs --exclude deploy ./ "$BUILD_DIR/"
(cd "$BUILD_DIR" && SITE_URL=https://hello.botanika.ai npm run build)

# Archive the authored/exported source separately from public files.
rsync -az --exclude public --exclude .git --exclude node_modules \
  ./ botanika:/home/botanika/source/

ssh botanika "mkdir -p /home/botanika/releases/$RELEASE"
rsync -az "$BUILD_DIR/public/index.html" \
  "$BUILD_DIR/public/robots.txt" "$BUILD_DIR/public/sitemap.xml" \
  "$BUILD_DIR/public/favicon.png" "$BUILD_DIR/public/apple-touch-icon.png" \
  "$BUILD_DIR/public/_nce" "$BUILD_DIR/public/_remote" \
  "botanika:/home/botanika/releases/$RELEASE/"

# Inspect the uploaded release before activation. Add any new route files
# explicitly above; the current snapshot contains only the home page.
ssh botanika "test -s /home/botanika/releases/$RELEASE/index.html && \
  ln -s releases/$RELEASE /home/botanika/current.next && \
  mv -Tf /home/botanika/current.next /home/botanika/current"

curl -fI https://hello.botanika.ai/
```

Stop if any command fails. The generated build script logs some errors without a failing exit status, so exit code alone is not release certification. Verify required files and the actual browser path. Retain the disposable build until verification finishes, then remove that specific temporary directory.

NGINX reload is unnecessary for a document-root symlink switch. If changing the virtual-host configuration, install the reviewed file, run `sudo nginx -t`, then reload NGINX. Do not change the shared `staging-botanika` host file.

## Rollback

Keep the previous complete release. Replace `PREVIOUS_RELEASE` with an existing release ID:

```sh
ssh botanika 'test -s /home/botanika/releases/PREVIOUS_RELEASE/index.html && \
  ln -s releases/PREVIOUS_RELEASE /home/botanika/rollback.next && \
  mv -Tf /home/botanika/rollback.next /home/botanika/current'
```

Only the initial release exists after this first deployment; there is no older website release to restore yet. Retained old releases support rollback, but old tabs can still request assets absent from a newer release; validate asset retention when introducing automated multi-release deployment.

## Verification checklist

- HTTP redirects to HTTPS; valid certificate for `hello.botanika.ai`.
- `/` returns HTML; `.mjs` returns `application/javascript`.
- Large model supports HTTP Range requests (206).
- Missing routes return 404, not the homepage.
- Source docs/config are not served.
- Browser: loading finishes, hero/3D renders, no relevant JS errors or failed HTTP requests.
- Narrow viewport: no horizontal overflow.
- After adding a fresh contact export, verify direct `/contact` navigation and its actual API submission separately.

Certificate renewal simulation:

```sh
ssh botanika 'sudo certbot renew --cert-name hello.botanika.ai --dry-run --run-deploy-hooks'
```
