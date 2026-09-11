import type { SiteLocale } from './site-locale'
import {
    CHINESE_LOCALE,
    DEFAULT_LOCALE,
    getEquivalentLocalePath,
    normalizePath,
    stripLocalePrefix,
    withLocalePrefix,
} from './site-locale'

export const DEFAULT_SITE_URL = 'https://www.castrel.ai'

interface SeoHeadLink {
    rel: 'canonical' | 'alternate'
    href: string
    hreflang?: string
}

function escapeXml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')
}

export function normalizeSiteUrl(siteUrl?: string): string {
    return new URL(siteUrl || DEFAULT_SITE_URL).origin
}

export function toCanonicalUrl(path: string, siteUrl?: string): string {
    return new URL(normalizePath(path), `${normalizeSiteUrl(siteUrl)}/`).toString()
}

export function buildLocalizedSeoLinks(
    path: string,
    siteUrl: string | undefined,
    locale: SiteLocale,
): SeoHeadLink[] {
    const normalizedPath = normalizePath(path)
    const links: SeoHeadLink[] = [
        {
            rel: 'canonical',
            href: toCanonicalUrl(normalizedPath, siteUrl),
        },
    ]
    const alternateLocale = locale === CHINESE_LOCALE ? DEFAULT_LOCALE : CHINESE_LOCALE
    const alternatePath = getEquivalentLocalePath(normalizedPath, alternateLocale)

    if (stripLocalePrefix(alternatePath) !== stripLocalePrefix(normalizedPath)) {
        return links
    }

    const englishPath = getEquivalentLocalePath(normalizedPath, DEFAULT_LOCALE)
    const chinesePath = getEquivalentLocalePath(normalizedPath, CHINESE_LOCALE)

    links.push(
        {
            rel: 'alternate',
            hreflang: 'en',
            href: toCanonicalUrl(englishPath, siteUrl),
        },
        {
            rel: 'alternate',
            hreflang: 'zh-CN',
            href: toCanonicalUrl(chinesePath, siteUrl),
        },
        {
            rel: 'alternate',
            hreflang: 'x-default',
            href: toCanonicalUrl(englishPath, siteUrl),
        },
    )

    return links
}

function buildAlternateSitemapLinks(path: string, allPaths: Set<string>, siteUrl?: string): string[] {
    const pathWithoutLocale = stripLocalePrefix(path)
    const englishPath = withLocalePrefix(pathWithoutLocale, DEFAULT_LOCALE)
    const chinesePath = withLocalePrefix(pathWithoutLocale, CHINESE_LOCALE)

    if (!allPaths.has(englishPath) || !allPaths.has(chinesePath)) {
        return []
    }

    return [
        `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(toCanonicalUrl(englishPath, siteUrl))}" />`,
        `<xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeXml(toCanonicalUrl(chinesePath, siteUrl))}" />`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(toCanonicalUrl(englishPath, siteUrl))}" />`,
    ]
}

export function buildSitemapXml(paths: string[], siteUrl?: string): string {
    const normalizedPaths = [...new Set(paths.map(path => normalizePath(path)))].sort()
    const allPaths = new Set(normalizedPaths)
    const urls = normalizedPaths.map((path) => {
        const links = buildAlternateSitemapLinks(path, allPaths, siteUrl)
        const lines = [
            '  <url>',
            `    <loc>${escapeXml(toCanonicalUrl(path, siteUrl))}</loc>`,
            ...links.map(link => `    ${link}`),
            '  </url>',
        ]

        return lines.join('\n')
    })

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ...urls,
        '</urlset>',
        '',
    ].join('\n')
}
