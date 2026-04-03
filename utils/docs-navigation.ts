import type { ContentNavigationItem } from '@nuxt/content'
import type { SiteLocale } from './site-locale'

function findNavigationNode(
    items: ContentNavigationItem[] | undefined,
    targetPath: string,
): ContentNavigationItem | undefined {
    return items?.find(item => item.path === targetPath)
}

export function extractDocsNavigation(
    items: ContentNavigationItem[] | undefined,
    locale: SiteLocale,
): ContentNavigationItem[] {
    if (!items?.length) return []

    if (locale === 'en') {
        return findNavigationNode(items, '/docs')?.children || items
    }

    const directDocsRoot = findNavigationNode(items, '/zh/docs')
    if (directDocsRoot?.children?.length) {
        return directDocsRoot.children
    }

    const localeRoot = findNavigationNode(items, '/zh')
    const nestedDocsRoot = localeRoot?.children?.find(item => item.path === '/zh/docs')
    if (nestedDocsRoot?.children?.length) {
        return nestedDocsRoot.children
    }

    return items
}
