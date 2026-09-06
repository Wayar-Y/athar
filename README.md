# Athar — ready for GitHub Pages

This version runs as a static website. No Node/Express server, database hosting or API key is needed on GitHub Pages. The full rental workflow remains available with **per-browser demo records stored in IndexedDB**, including inspection photos.

## Publish with automatic builds (recommended)

1. Create a GitHub repository (for example `athar`). Use a public repository if you use GitHub Free.
2. Extract this ZIP. Upload the **contents** into the repository root, not the ZIP itself and not an extra enclosing folder. `package.json`, `src`, `public`, `bun.lock`, and `.github/workflows/deploy.yml` must be in their supplied locations. GitHub Desktop can add the complete folder, including `.github`.
3. Open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Open **Actions → Publish Athar to GitHub Pages → Run workflow**. After the first successful run, Pages shows your website URL. Subsequent pushes to the default `main` or `master` branch deploy automatically. For another branch name, update the `push.branches` list in the workflow.

No repository-name edit is needed: relative paths support `https://USERNAME.github.io/REPOSITORY/`, account sites, and custom-domain roots. All navigation is inside the app, so there is no server-side route requirement.

If the workflow is absent from Actions, check that `.github/workflows/deploy.yml` was uploaded. If a build runs before Pages has been enabled, enable it and rerun the workflow. The workflow uses the built-in GitHub token; do not add personal tokens or API keys.

## Publish without running a build yourself

The ZIP also includes a ready-built **docs** folder. Upload the extracted project, then choose **Settings → Pages → Source → Deploy from a branch → main → /docs → Save**. Use your actual default branch if it is `master`.

Choose one publishing method. If using `/docs`, remove `.github/workflows/deploy.yml` to avoid the automatic workflow deploying a second source. Future edits under `src` do not automatically update `/docs`; rebuild and copy `dist` into `docs`, or switch to the recommended Actions method.

## What saves on the published website

- Vehicles, contracts, inspections/photos, locations, notifications and work orders save in this browser on this device.
- Each visitor gets an independent demonstration dataset. Records are **not shared** across visitors, browsers or devices.
- Clearing website data, browser eviction, private browsing or changing the site path can remove or separate these records. Export important reports; use sample information for this public demo.
- Browser saving has revision checks, reports failures and guards against closing while saves are pending. IndexedDB must be enabled. Inspection images do not use the much smaller localStorage quota.
- Initial fleet readings and AI predictions remain samples. Live GPS/OBD collection, validated AI, external messages, billing and account security still require separate integrations.

A shared production fleet database cannot run inside GitHub Pages. It would require a separately hosted authenticated backend. The optional local server source is retained but is not used by the Pages build.

## Local development

Requires Node.js 22.13+ (24 recommended):

```sh
npm install --package-lock=false
npm run dev
```

To build and inspect the static output:

```sh
npm run build
npm run preview
```

Or use `bun install --frozen-lockfile` and `bun run build`. Do not open index.html with a file:// URL. Use an HTTP server or the published Pages URL.

## Optional SQLite server mode

For local SQLite storage instead of browser demo storage, add `VITE_STORAGE_MODE=server` to `.env.local`, then rebuild and start the local server as described in `LOCAL_SERVER.md`. For development, restart Vite and run `npm run server` separately. Remove that variable to return to browser mode. The GitHub workflow explicitly builds browser mode and never uploads local databases.

Existing SQLite records are not copied into IndexedDB automatically. Browser and server modes intentionally use separate record stores.

## Checks

```sh
npm run lint
node --import tsx --test tests/workflows.test.ts tests/browserRecords.test.ts tests/server.test.ts
npm run build
```

Tests cover rental workflows, file imports, reports, server persistence and browser-record persistence/concurrent writes. No GitHub repository has been changed or published by preparing this ZIP; deployment runs after you upload it and enable Pages.

See `FEATURE_AUDIT.md` for the original presentation audit and its GitHub Pages update note.

Official setup reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
