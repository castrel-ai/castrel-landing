import type { Collections } from '@nuxt/content'
import { queryCollection } from '@nuxt/content/server'
import { buildSitemapXml, DEFAULT_SITE_URL } from '~~/utils/seo'

const SITEMAP_COLLECTIONS: Array<keyof Collections> = [
    'landing_en',
    'landing_zh',
    'docs_en',
    'docs_zh',
    'blogs_en',
    'blogs_zh',
    'changelog_en',
    'changelog_zh',
]

const STATIC_ROUTES = [
    '/blogs',
    '/zh/blogs',
    '/changelog',
    '/zh/changelog',
    '/zh/pricing',
]

export default defineEventHandler(async (event) => {
    const collectionPages = await Promise.all(
        SITEMAP_COLLECTIONS.map(collection =>
            queryCollection(event, collection).select('path').all(),
        ),
    )
    const paths = [
        ...STATIC_ROUTES,
        ...collectionPages.flat().map(page => page.path).filter(Boolean),
    ]
    const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL

    setResponseHeaders(event, {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    })

    return buildSitemapXml(paths, siteUrl)
})
