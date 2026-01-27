# Castrel Landing & Docs

Repo for [castrel.ai](https://castrel.ai). Based on [Docus](https://docus.dev/) and [Nuxt 4](https://nuxt.com/).

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

### Images

All images are stored in the `public/images/` directory. To use them in markdown files, use the absolute path `/images/your-image.png`.

### Fonts

Custom fonts are stored in `public/fonts/` and configured in `app/assets/css/fonts.css`.

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
