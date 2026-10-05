# Releasing & publishing

`@diametral/design-system` publishes to the **public npm registry** and nowhere else.
Consumers install it with no `.npmrc` and no token. Nothing publishes automatically
without the steps below.

## One-time setup

1. **Own the scope.** The `@diametral` npm org must exist and the publishing account must
   have publish rights on it.
2. **Trust the workflow — no token.** On npmjs.com, the package's **Settings → Trusted
   Publisher → GitHub Actions**: organization `DiametralGroup`, repository
   `design-system`, workflow `publish-npm.yml`, environment `default`. The publish job
   authenticates through OIDC, so there is no secret to store or renew. A token is not an
   option: the `@diametral` scope requires 2FA to publish, and npm only lets a 2FA-bypass
   token *stage* a version (`E_STAGE_REQUIRED`).

## The dist-tag

`.github/workflows/publish-npm.yml` reads `version` from `package.json` and picks the
dist-tag from it:

| version | dist-tag |
| --- | --- |
| `1.0.0-beta.3` — anything with a `-` | `next` |
| `1.0.0` — a plain release | `latest` |

This is load-bearing during the v1 absorption. `main` stays at **0.11.0** for the whole
migration and the betas publish from the long-lived `v1` branch, so `npm i @diametral/design-system`
keeps resolving to a version the published docs actually describe. A bare `npm publish`
would move `latest` to the first beta.

## Cut a release

1. Bump `version` in `package.json` and add a `CHANGELOG.md` entry.
2. Commit, then create a **GitHub Release** with tag `vX.Y.Z`:
   ```bash
   gh release create v1.0.0-beta.1 --generate-notes --prerelease
   ```
   This triggers `publish-npm.yml`, which builds, resolves the dist-tag and runs
   `npm publish --access public --provenance --tag <tag>`. (Or run it via
   **workflow_dispatch**.)
3. Verify both the version and where the tags now point:
   ```bash
   npm view @diametral/design-system dist-tags
   ```

> Provenance is attached automatically — the workflow has `id-token: write`.

## Different name (optional)

To publish unscoped (e.g. `diametral-design-system`) or under another scope: change `name`
in `package.json`, the `scope:` in `publish-npm.yml` (and drop it for an unscoped name),
and the references in `docs/installation.md` / `README.md`. Unscoped public packages need
neither an org nor `--access public`.

## Local checks before releasing

```bash
npm run build              # generates dist/ (tokens, bundled CSS, WC bundle)
npm run check              # the release-blocking contract checks
npm publish --dry-run      # lists exactly what would ship (the package "files" allowlist)
```
