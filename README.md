# Castrel Landing & Docs


Repo for [www.castrel.ai](https://www.castrel.ai). Based on [Docus](https://docus.dev/) and [Nuxt 4](https://nuxt.com/).



## Local Development

Pre-requisites: Node.js 22, pnpm 10+

1. Run `pnpm install` to install the dependencies.
2. Run `pnpm dev` to start the development server on localhost:3000

## Project Structure

```
castrel-landing/
├── app/
│   ├── app.config.ts        # App configuration (header, toc, etc.)
│   ├── components/          # Vue components
│   └── pages/               # Custom pages (blogs, etc.)
├── content/
│   ├── index.md             # Homepage
│   ├── docs/                # Documentation pages
│   │   ├── 1.getting-started/
│   │   ├── 2.features/
│   │   ├── 3.integrations/
│   │   ├── 4.more/
│   │   └── 5.security/
│   └── blogs/               # Blog posts
├── public/
│   ├── images/              # Static images
│   └── fonts/               # Custom fonts
├── nuxt.config.ts           # Nuxt configuration
└── package.json
```

## Content

All documentation content is written in Markdown with [MDC (Markdown Components)](https://content.nuxt.com/usage/markdown) syntax. Files are organized with numeric prefixes for ordering (e.g., `1.introduction.md`).

### Navigation

Each section can have a `.navigation.yml` file to customize the sidebar navigation title and icon.

### Custom Components

Custom Vue components in `app/components/` can be used directly in markdown files using MDC syntax:

```md
::component-name
---
prop: value
---
Content here
::
```

## Media

Blob-backed asset loading is documented in [`docs/blob-asset-loading.md`](docs/blob-asset-loading.md). Read it before changing image, font, or Castrel Proxy package loading behavior.

### Images

Image source files are stored in `blob-assets/images/`.
Use the absolute path `/images/your-image.png` in markdown and components.

To generate or refresh `.webp` variants for all raster images (`.png/.jpg/.jpeg/.gif`):

```bash
pnpm images:compress-webp
```

Note: `.gif` is converted to a single-frame `.webp` for predictable build-time processing.

### Fonts

Font source files are stored in `blob-assets/fonts/`. Font-face declarations live in `public/font-faces.css`; global font-family rules live in `app/assets/css/fonts.css`.

### Castrel Proxy packages

Castrel Proxy binaries and checksum files are stored in `blob-assets/castrel-proxy/packages/`.
The install script stays in `public/castrel-proxy/install.sh` and is served at `/castrel-proxy/install.sh`.

To sync Blob-managed assets and regenerate runtime mapping:

```bash
BLOB_READ_WRITE_TOKEN=xxxx pnpm blob:upload-assets
```

Or if token is already in your shell env:

```bash
pnpm blob:upload-assets
```

Dry run:

```bash
pnpm blob:upload-assets:dry-run
```

Runtime behavior:
- Markdown images and selected Vue components resolve `/images/**` to Blob URLs with `utils/blob-assets.ts`.
- `server/routes/images/[...path].ts` and `server/routes/fonts/[...path].ts` keep old stable paths working.
- `server/routes/castrel-proxy/packages/[...path].ts` does the same for old Castrel Proxy binary and checksum URLs.
- Image and Castrel Proxy package routes fall back to local files in `blob-assets/` if Blob is unavailable.
- Font routes do not fall back to local files, so missing Blob mappings are visible during validation.
- You can also set `BLOB_ASSET_BASE_URL` or `NUXT_PUBLIC_BLOB_ASSET_BASE_URL` to use a fixed Blob prefix.

## Stack

- [Nuxt 4](https://nuxt.com/) - The web framework
- [Docus](https://docus.dev/) - Documentation theme layer
- [Nuxt Content](https://content.nuxt.com/) - File-based CMS with MDC support
- [Nuxt UI](https://ui.nuxt.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Mermaid](https://mermaid.js.org/) - Diagrams and charts

## Deployment

Build for production:

```bash
pnpm build
```

The built files will be in the `.output` directory.

### SEO configuration

- The canonical website origin defaults to `https://www.castrel.ai`. Override it with `NUXT_PUBLIC_SITE_URL` only when deploying another public canonical domain.
- Set `NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the verification token supplied by Google Search Console to emit the verification meta tag.
- The app serves `/sitemap.xml` from the current Nuxt Content collections. `/robots.txt` advertises that sitemap through the existing robots module.
