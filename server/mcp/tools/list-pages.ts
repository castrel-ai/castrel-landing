import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import { getBlogsCollection, getDocsCollection, SITE_LOCALES } from '~~/utils/site-locale'

export default defineMcpTool({
    description: `Lists all available pages from Castrel website including documentation and blog posts.

WHEN TO USE: Use this tool when you need to EXPLORE or SEARCH for content but don't know the exact page path.

OUTPUT: Returns a structured list with title, path, description, type, and category for each page.

NOTE: The "category" filter only applies to docs. Blogs do not have categories (flat structure under /blogs/).
Available doc categories: "getting-started", "features", "integrations", "security", "more".`,

    inputSchema: {
        type: z.enum(['all', 'docs', 'blogs']).optional().describe('Filter by content type: all (default), docs, or blogs'),
        locale: z.enum(SITE_LOCALES).optional().describe('Filter by locale: en or zh'),
        search: z.string().optional().describe('Search keyword to filter pages by title or description (case-insensitive)'),
        title: z.string().optional().describe('Search keyword to filter pages by title only (case-insensitive)'),
        category: z.string().optional().describe('Filter by category/directory. Only applies to docs. Available: "getting-started", "features", "integrations", "security", "more"'),
        limit: z.coerce.number().optional().describe('Maximum number of results to return'),
    },

    cache: '1h',

    handler: async ({ type = 'all', locale, search, title, category, limit }) => {
        const event = useEvent()

        try {
            const locales = locale ? [locale] : [...SITE_LOCALES]
            const collections: Array<{
                name: keyof Collections
                type: 'docs' | 'blogs'
                locale: 'en' | 'zh'
            }> = []

            for (const currentLocale of locales) {
                if (type === 'all' || type === 'docs') {
                    collections.push({
                        name: getDocsCollection(currentLocale) as keyof Collections,
                        type: 'docs',
                        locale: currentLocale,
                    })
                }
                if (type === 'all' || type === 'blogs') {
                    collections.push({
                        name: getBlogsCollection(currentLocale) as keyof Collections,
                        type: 'blogs',
                        locale: currentLocale,
                    })
                }
            }

            const pages: Array<{
                title: string
                path: string
                description: string
                type: 'docs' | 'blogs'
                locale: 'en' | 'zh'
                category: string | null
            }> = []

            for (const collection of collections) {
                const docs = await queryCollection(event, collection.name)
                    .select('title', 'path', 'description')
                    .all()

                for (const doc of docs || []) {
                    if (!doc.path) continue

                    const isBlog = doc.path.includes('/blogs/')
                    const isDoc = doc.path.includes('/docs/')

                    let pageCategory: string | null = null
                    if (isDoc) {
                        const pathWithoutLocale = collection.locale === 'zh'
                            ? doc.path.replace(/^\/zh/, '')
                            : doc.path
                        const pathParts = pathWithoutLocale.split('/')
                        pageCategory = pathParts.length >= 3 ? pathParts[2] : null
                    }

                    pages.push({
                        title: doc.title || 'Untitled',
                        path: doc.path,
                        description: doc.description || '',
                        type: isBlog ? 'blogs' : 'docs',
                        locale: collection.locale,
                        category: pageCategory,
                    })
                }
            }

            // Apply filters
            let filteredPages = pages

            // Category filter
            if (category) {
                const normalizedCategory = category.toLowerCase()
                filteredPages = filteredPages.filter(p =>
                    p.category && p.category.toLowerCase() === normalizedCategory,
                )
            }

            // Search filter (case-insensitive match on title or description)
            if (search) {
                const searchLower = search.toLowerCase()
                filteredPages = filteredPages.filter(p =>
                    p.title.toLowerCase().includes(searchLower)
                    || p.description.toLowerCase().includes(searchLower),
                )
            }

            // Title filter (case-insensitive match on title only)
            if (title) {
                const titleLower = title.toLowerCase()
                filteredPages = filteredPages.filter(p =>
                    p.title.toLowerCase().includes(titleLower),
                )
            }

            // Sort by path for consistent ordering
            filteredPages.sort((a, b) => a.path.localeCompare(b.path))

            // Apply limit
            if (limit && limit > 0) {
                filteredPages = filteredPages.slice(0, limit)
            }

            return jsonResult(filteredPages)
        }
        catch (error) {
            console.error('MCP list-pages error:', error)
            return errorResult(`Failed to list pages: ${error instanceof Error ? error.message : String(error)}`)
        }
    },
})
