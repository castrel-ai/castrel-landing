# Blob Asset Loading

This document explains how Castrel Landing serves public assets from Vercel Blob while keeping the existing site paths stable.

## Goals

- Render large public images from Blob URLs when possible.
- Keep old public paths such as `/images/**`, `/fonts/**`, and `/castrel-proxy/packages/**` working.
- Avoid runtime file-system assumptions in serverless deployments.
- Keep Markdown authors using stable site paths instead of raw Blob URLs.

## Source Of Truth

Asset files live under `blob-assets/`:

- `blob-assets/images`
- `blob-assets/fonts`
- `blob-assets/castrel-proxy/packages`

The public URL mapping lives in `blob-assets-manifest.json`. The upload script `scripts/upload-assets-to-blob.mjs` regenerates that manifest after uploading files to Vercel Blob.

Do not hand-edit the manifest for partial uploads unless you preserve existing entries. Removing old entries can break historical content.

## Browser-Side Direct Blob URLs

The helper `utils/blob-assets.ts` provides:

```ts
resolveBlobAssetUrl(src: string): string
```

It imports `blob-assets-manifest.json` at build time and resolves stable site paths to Blob URLs:

- `/images/example.png` -> `https://...public.blob.vercel-storage.com/images/example.png`
- `/fonts/example.woff2` -> `https://...public.blob.vercel-storage.com/fonts/example.woff2`
- `/castrel-proxy/packages/example` -> `https://...public.blob.vercel-storage.com/castrel-proxy/packages/example`

The helper intentionally leaves these values unchanged:

- `http://...`
- `https://...`
- `//...`
- `data:...`
- `blob:...`
- `#anchor`

It also preserves query strings and hashes. For example:

```ts
resolveBlobAssetUrl('/images/demo.png?v=1#hero')
```

returns the mapped Blob URL with `?v=1#hero` appended. If a manifest entry is missing, the original `src` is returned.

## Markdown Images

Nuxt Content image rendering is overridden by `app/components/content/ProseImg.vue`.

That component:

- receives normal Markdown image props,
- calls `resolveBlobAssetUrl(props.src)`,
- renders a plain `img`,
- sets `loading="lazy"` and `decoding="async"`.

Markdown authors should continue writing stable paths:

```md
![Alert triage](/images/alert-triage.png)
```

Do not paste Blob URLs into Markdown. The manifest is the indirection layer.

## Vue Components And Metadata

Vue components that render known asset paths should import the helper explicitly:

```ts
import { resolveBlobAssetUrl } from '~~/utils/blob-assets'
```

Use it for:

- `NuxtImg` `src` props,
- blog and changelog cards,
- article hero images,
- Open Graph and Twitter image metadata,
- other rendered image paths that start with `/images/`.

The project uses `@nuxt/image` with `provider: 'none'`, so resolved Blob URLs are emitted directly instead of going through an optimizer endpoint.

## Compatibility Server Routes

The old routes remain available for existing links and external references:

- `/images/**`
- `/fonts/**`
- `/castrel-proxy/packages/**`

They are implemented by:

- `server/routes/images/[...path].ts`
- `server/routes/fonts/[...path].ts`
- `server/routes/castrel-proxy/packages/[...path].ts`
- `server/utils/blob-assets.ts`

`server/utils/blob-assets.ts` uses a static import of `blob-assets-manifest.json` in production. This avoids brittle `process.cwd()` manifest reads in serverless runtimes.

In development, it tries to reload the manifest from disk and falls back to the statically imported manifest if reading fails.

Route behavior:

- If a manifest entry exists, the route streams the Blob response.
- If Blob fetch fails, image and Castrel Proxy package routes fall back to local files in `blob-assets/`.
- The font route sets `fallbackToLocal: false`, so missing Blob font mappings fail instead of silently serving large local fonts through the function path.
- Routes set long-lived public cache headers.

`BLOB_ASSET_BASE_URL` or `NUXT_PUBLIC_BLOB_ASSET_BASE_URL` can be used as a fixed prefix fallback when a manifest entry is missing.

## Fonts

Font-face declarations live in `public/font-faces.css`, linked from `nuxt.config.ts`.

The CSS references stable `/fonts/**` paths. Those paths are served by the compatibility font route and backed by Blob. This keeps CSS static and avoids Vite build-time warnings from trying to resolve runtime font routes as local build assets.

Do not add heavyweight global font preloads without checking actual first-page cost.

## Castrel Proxy Packages

The public install entry remains:

```bash
curl -fsSL https://castrel.ai/castrel-proxy/install.sh | bash
```

The script `public/castrel-proxy/install.sh` defaults package downloads to the Blob package directory:

```sh
CASTREL_PROXY_PACKAGE_BASE_URL
```

If unset, the script uses the public Blob package base URL. Private mirrors can override the variable before running the installer.

The old `/castrel-proxy/packages/**` route remains for compatibility, but new installer traffic should not depend on it.

## Adding Or Updating Assets

1. Put files under the correct `blob-assets/` subdirectory.
2. If adding raster images, run:

   ```bash
   pnpm images:compress-webp
   ```

3. Upload assets and regenerate the manifest:

   ```bash
   pnpm blob:upload-assets
   ```

4. Confirm the manifest still contains historical mappings:

   ```bash
   rg '"/images/' blob-assets-manifest.json
   ```

5. Use stable paths in content and code:

   - Markdown: `/images/...`
   - Vue: `resolveBlobAssetUrl('/images/...')`
   - Fonts: `/fonts/...` in `public/font-faces.css`
   - Castrel Proxy installer: `CASTREL_PROXY_PACKAGE_BASE_URL` only when overriding the default package base.

## Verification

Run:

```bash
pnpm build
```

Then preview the build and check:

```bash
curl -I http://localhost:3000/images/logo.webp
curl -I http://localhost:3000/fonts/ia-writer-quattro/ia-writer-quattro-400.woff2
curl -I http://localhost:3000/castrel-proxy/install.sh
curl -I http://localhost:3000/castrel-proxy/packages/castrel-proxy-linux-x86_64
```

For rendered pages, confirm Markdown and component images use Blob URLs in HTML while old stable routes still return a valid response.
