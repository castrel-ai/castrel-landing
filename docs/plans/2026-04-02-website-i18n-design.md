# Website Internationalization Design

**Goal:** Add full English and Chinese internationalization support to the Castrel marketing site, documentation, and blog while keeping English as the canonical default site and redirecting Chinese browsers from `/` to `/zh` on first visit.

**Status:** Approved for implementation on branch `feat/website-i18n`

## Context

The current site is a Nuxt 4 application extended from the Docus layer, with most content living under `content/` and a small set of custom pages in `app/pages/`. The current repository has:

- A single-language landing page in `content/index.md`
- Docs content in `content/docs/**`
- Blog content in `content/blogs/**`
- Custom blog routes in `app/pages/blogs/**`
- MCP tools that query the docs collection directly in `server/mcp/tools/**`

The implementation must respect several constraints:

- English stays at `/` and acts as the canonical default locale
- Chinese pages live under `/zh/**`
- Browser language detection may redirect `/` to `/zh`, but should not force-prefixed redirects for every route
- Docs and blogs must be maintained in separate per-language files
- Docs sidebar ordering must remain stable across locales

## Key Findings

### Docus findings

Local Docus source code shows that its i18n support is opinionated:

- It creates locale-specific content collections like `landing_en`, `docs_en`, `landing_zh`, `docs_zh`
- It expects locale content inside `content/<locale>/...`
- It forces the Nuxt i18n strategy to `prefix`
- Its client plugin redirects `/` to `/${cookieLocale || defaultLocale}`

Relevant files:

- `node_modules/docus/content.config.ts`
- `node_modules/docus/modules/config.ts`
- `node_modules/docus/modules/routing.ts`
- `node_modules/docus/app/plugins/i18n.ts`

This is close to what we want for content organization, but not for routing behavior. English must remain at `/`, so the project needs to take explicit control over root routing and browser-language detection instead of blindly accepting Docus defaults.

### Nuxt Content findings

The project does not currently define its own `content.config.ts`. It relies on the Docus layer defaults. That is too implicit for a multilingual content site because:

- Blogs are currently queried out of the docs collection by filtering paths
- MCP tools hard-code the `docs` collection
- There is no explicit collection model for multilingual blogs

The project should own its `content.config.ts` so the content model is visible and stable.

## Decisions

### 1. Directory structure

Content will move to language-first directories:

```text
content/
  en/
    index.md
    docs/
      1.getting-started/
      2.features/
      3.integrations/
      4.more/
      5.security/
    blogs/
      1.some-post.md
  zh/
    index.md
    docs/
      1.getting-started/
      2.features/
      3.integrations/
      4.more/
      5.security/
    blogs/
      1.some-post.md
```

### 2. Slug policy

- Slugs stay language-neutral and identical across locales
- Example:
  - English: `/docs/features/alert-triage`
  - Chinese: `/zh/docs/features/alert-triage`
- Titles, descriptions, navigation labels, and content are translated
- The URL path segments do not change per locale

This keeps language switching, analytics, internal links, and SEO mapping predictable.

### 3. Docs navigation policy

- Each locale keeps its own numbered docs directories and `.navigation.yml` files
- Directory numbers remain aligned across locales
- Navigation labels are translated inside each locale directory
- Missing pages are treated as missing translations, not silently mapped to the other locale

### 4. Routing policy

- English landing page: `/`
- Chinese landing page: `/zh`
- English docs: `/docs/**`
- Chinese docs: `/zh/docs/**`
- English blogs: `/blogs/**`
- Chinese blogs: `/zh/blogs/**`

Browser-language redirect behavior:

- Only apply browser-language detection to the root path `/`
- If browser preference is Chinese and there is no explicit locale cookie yet, redirect `/` to `/zh`
- Never redirect non-root English paths to Chinese automatically

### 5. Locale fallback policy

- UI chrome may fall back to English if a translation key is missing
- Content pages do not fall back across locales
- If a Chinese page is not migrated yet, the Chinese route should 404 or be intentionally hidden from language switches

This avoids false completeness and keeps migration state honest.

## Architecture

### Content collections

The app will define an explicit root `content.config.ts` with locale-specific collections:

- `landing_en`
- `landing_zh`
- `docs_en`
- `docs_zh`
- `blogs_en`
- `blogs_zh`

Docs collections will be prefixed by locale-aware URLs:

- `docs_en` prefixes to `/docs`
- `docs_zh` prefixes to `/zh/docs`

Blogs collections will be prefixed similarly:

- `blogs_en` prefixes to `/blogs`
- `blogs_zh` prefixes to `/zh/blogs`

Landing collections map:

- `content/en/index.md` to `/`
- `content/zh/index.md` to `/zh`

### Runtime locale resolution

The app will define a single locale-resolution helper that:

- Reads the current locale from route context
- Maps the route to the correct content collection
- Exposes helpers for locale-aware internal links and language switches

This helper will be used by:

- Landing page rendering
- Blog index and blog detail pages
- MCP tools
- Any custom locale switch UI

### Docus integration strategy

Docus will still provide:

- Docs layout
- Navigation UI
- Search UI
- Header/footer theme structure

But the app will stop relying on Docus defaults for:

- Root redirect behavior
- Implicit content collection ownership
- Blog locale handling

If Docus i18n behavior conflicts with the required English-at-root policy, the project will override that behavior in app-level middleware or plugins rather than patching `node_modules`.

## Planned Code Areas

### Content and config

- Create `content.config.ts`
- Restructure content into `content/en/**` and `content/zh/**`
- Update `nuxt.config.ts` for locale config and explicit i18n behavior

### App pages and components

- Update landing page behavior so `/` serves English content and `/zh` serves Chinese content
- Make blog index locale-aware
- Make blog detail locale-aware
- Add or update language switch UI in the header
- Ensure internal CTA links resolve to locale-aware docs/blog URLs

### Docus and docs behavior

- Ensure docs navigation queries use locale-specific collections
- Ensure docs page rendering uses the correct locale collection
- Prevent root-path routing from being hijacked into forced `/en`

### MCP tools

- Update page listing and page fetch tools to query locale-specific collections
- Support optional locale filtering and locale-aware raw content retrieval

## Error Handling

- Unsupported locale prefixes should normalize or 404 cleanly
- Missing translated content should return 404 on the locale-specific route
- Language switch UI should disable or hide links to pages that do not exist in the target locale
- Browser-language redirect logic should be idempotent and not loop

## Verification

The implementation is complete only if all of the following are true:

1. `/` serves English landing content
2. `/zh` serves Chinese landing content
3. A Chinese browser visiting `/` is redirected to `/zh`
4. Direct navigation to `/docs/...` stays English and is not auto-redirected
5. `/zh/docs/...` renders the Chinese docs page and Chinese sidebar
6. `/blogs` and `/zh/blogs` show locale-appropriate post lists
7. `/blogs/...` and `/zh/blogs/...` render the correct localized article
8. Language switching preserves the same logical page when a translation exists
9. MCP tools can list and fetch pages by locale

## Implementation Phases

### Phase 1: Foundation

- Add explicit i18n config and root-level locale behavior
- Add explicit multilingual content collections
- Create a minimal English and Chinese content skeleton

### Phase 2: Locale-aware runtime

- Update landing, blog index, and blog detail pages
- Wire locale switching and locale-aware internal links
- Fix Docus interaction points that assume prefixed default locale behavior

### Phase 3: Tooling and migration

- Update MCP tools
- Migrate current English content into `content/en/**`
- Add initial Chinese homepage and sample docs/blog translations

### Phase 4: Verification

- Run local verification flows for landing, docs, blog, and locale switching
- Confirm browser-language redirect behavior
- Confirm no regression in English default routing
