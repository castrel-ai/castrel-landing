export const SITE_LOCALES = ['en', 'zh'] as const

export type SiteLocale = (typeof SITE_LOCALES)[number]

export const DEFAULT_LOCALE: SiteLocale = 'en'
export const CHINESE_LOCALE: SiteLocale = 'zh'
export const LOCALE_COOKIE = 'site_locale'

const AVAILABLE_ZH_PATHS = new Set([
    '/',
    '/docs/getting-started/introduction',
    '/docs/security/privacy-policy',
    '/docs/security/terms-of-service',
    '/blogs',
    '/blogs/how-castrel-builds-an-incident-troubleshooting-agent',
])

export function normalizePath(path: string | undefined): string {
    if (!path) return '/'
    if (path === '') return '/'
    return path.startsWith('/') ? path : `/${path}`
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

export function getCollectionFromContentPath(
    path: string | undefined,
): 'docs_en' | 'docs_zh' | 'blogs_en' | 'blogs_zh' | null {
    const normalizedPath = normalizePath(path)

    if (normalizedPath.startsWith('/zh/docs/')) return 'docs_zh'
    if (normalizedPath.startsWith('/docs/')) return 'docs_en'
    if (normalizedPath.startsWith('/zh/blogs/')) return 'blogs_zh'
    if (normalizedPath.startsWith('/blogs/')) return 'blogs_en'

    return null
}

export function pathSupportsLocale(path: string | undefined): boolean {
    const normalizedPath = normalizePath(path)

    return (
        normalizedPath === '/'
        || normalizedPath === '/zh'
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

    if (locale === CHINESE_LOCALE && !AVAILABLE_ZH_PATHS.has(normalizedPath)) {
        if (normalizedPath.startsWith('/docs/')) return '/zh/docs/getting-started/introduction'
        if (normalizedPath.startsWith('/blogs')) return '/zh/blogs'
        return '/zh'
    }

    return withLocalePrefix(normalizedPath, locale)
}

export function detectChineseLanguage(input: string | undefined): boolean {
    return typeof input === 'string' && /\bzh(?:[-_][a-z]{2})?\b/i.test(input)
}
