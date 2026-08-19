export const SITE_LOCALES = ['en', 'zh'] as const

export type SiteLocale = (typeof SITE_LOCALES)[number]

export const DEFAULT_LOCALE: SiteLocale = 'en'
export const CHINESE_LOCALE: SiteLocale = 'zh'
export const LOCALE_COOKIE = 'site_locale'

const AVAILABLE_ZH_BLOG_PATHS = new Set([
    '/blogs/application-health-inspection',
    '/blogs/how-castrel-builds-an-incident-troubleshooting-agent',
    '/blogs/slo-dashboard-health-checks',
])

export function normalizePath(path: string | undefined): string {
    if (!path) return '/'
    if (path === '') return '/'
    const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
    // Normalize trailing slash for route matching/querying (`/zh/` -> `/zh`).
    return withLeadingSlash.length > 1
        ? withLeadingSlash.replace(/\/+$/, '') || '/'
        : withLeadingSlash
}

export function isChineseLocale(locale: string | undefined): locale is typeof CHINESE_LOCALE {
    return locale === CHINESE_LOCALE
}

export function resolveLocaleFromPath(path: string | undefined): SiteLocale {
    const normalizedPath = normalizePath(path)
    return normalizedPath === '/zh' || normalizedPath.startsWith('/zh/')
        ? CHINESE_LOCALE
        : DEFAULT_LOCALE
}

export function stripLocalePrefix(path: string | undefined): string {
    const normalizedPath = normalizePath(path)

    if (normalizedPath === '/zh') return '/'
    if (normalizedPath.startsWith('/zh/')) {
        return normalizedPath.slice(3) || '/'
    }

    return normalizedPath
}

export function withLocalePrefix(path: string | undefined, locale: SiteLocale): string {
    const normalizedPath = stripLocalePrefix(path)

    if (locale === CHINESE_LOCALE) {
        return normalizedPath === '/' ? '/zh' : `/zh${normalizedPath}`
    }

    return normalizedPath
}

export function getLandingCollection(locale: SiteLocale): 'landing_en' | 'landing_zh' {
    return locale === CHINESE_LOCALE ? 'landing_zh' : 'landing_en'
}

export function getDocsCollection(locale: SiteLocale): 'docs_en' | 'docs_zh' {
    return locale === CHINESE_LOCALE ? 'docs_zh' : 'docs_en'
}

export function getBlogsCollection(locale: SiteLocale): 'blogs_en' | 'blogs_zh' {
    return locale === CHINESE_LOCALE ? 'blogs_zh' : 'blogs_en'
}

export function getChangelogCollection(locale: SiteLocale): 'changelog_en' | 'changelog_zh' {
    return locale === CHINESE_LOCALE ? 'changelog_zh' : 'changelog_en'
}

export function getCollectionFromContentPath(
    path: string | undefined,
): 'docs_en' | 'docs_zh' | 'blogs_en' | 'blogs_zh' | 'changelog_en' | 'changelog_zh' | null {
    const normalizedPath = normalizePath(path)

    if (normalizedPath.startsWith('/zh/docs/')) return 'docs_zh'
    if (normalizedPath.startsWith('/docs/')) return 'docs_en'
    if (normalizedPath.startsWith('/zh/blogs/')) return 'blogs_zh'
    if (normalizedPath.startsWith('/blogs/')) return 'blogs_en'
    if (normalizedPath === '/zh/changelog' || normalizedPath.startsWith('/zh/changelog/')) return 'changelog_zh'
    if (normalizedPath === '/changelog' || normalizedPath.startsWith('/changelog/')) return 'changelog_en'

    return null
}

export function pathSupportsLocale(path: string | undefined): boolean {
    const normalizedPath = normalizePath(path)

    return (
        normalizedPath === '/'
        || normalizedPath === '/zh'
        || normalizedPath === '/zh/pricing'
        || normalizedPath === '/changelog'
        || normalizedPath === '/zh/changelog'
        || normalizedPath.startsWith('/changelog/')
        || normalizedPath.startsWith('/zh/changelog/')
        || normalizedPath.startsWith('/docs/')
        || normalizedPath.startsWith('/zh/docs/')
        || normalizedPath === '/blogs'
        || normalizedPath.startsWith('/blogs/')
        || normalizedPath === '/zh/blogs'
        || normalizedPath.startsWith('/zh/blogs/')
    )
}

export function getEquivalentLocalePath(path: string | undefined, locale: SiteLocale): string {
    const normalizedPath = stripLocalePrefix(path)

    if (locale === CHINESE_LOCALE) {
        if (normalizedPath === '/') return '/zh'
        if (normalizedPath === '/pricing') return '/zh/pricing'
        if (normalizedPath === '/changelog') return '/zh/changelog'
        if (normalizedPath.startsWith('/changelog/')) return `/zh${normalizedPath}`

        if (normalizedPath.startsWith('/docs/')) {
            // Chinese docs are maintained as path-mirrored content, so we can map directly.
            return `/zh${normalizedPath}`
        }

        if (normalizedPath === '/blogs') return '/zh/blogs'
        if (normalizedPath.startsWith('/blogs/')) {
            return AVAILABLE_ZH_BLOG_PATHS.has(normalizedPath)
                ? `/zh${normalizedPath}`
                : '/zh/blogs'
        }

        return '/zh'
    }

    if (normalizedPath === '/pricing') return '/'
    if (normalizedPath === '/changelog') return '/changelog'
    if (normalizedPath.startsWith('/changelog/')) return normalizedPath

    return withLocalePrefix(normalizedPath, locale)
}

export function detectChineseLanguage(input: string | undefined): boolean {
    return typeof input === 'string' && /\bzh(?:[-_][a-z]{2})?\b/i.test(input)
}
