import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import { getCollectionFromContentPath } from '~~/utils/site-locale'

export default defineMcpTool({
    description: `Retrieves the full content and details of a specific page from Castrel website.

WHEN TO USE: Use this tool when you know the exact page path and need to read its full content.

INPUT: Provide the exact path from list-pages result (e.g., "/docs/getting-started/introduction" or "/blogs/effective-incident-investigation").`,

    inputSchema: {
        path: z.string().describe('The exact path of the page to retrieve (e.g., "/docs/getting-started/introduction")'),
    },

    cache: '1h',

    handler: async ({ path }) => {
        const event = useEvent()
        const siteUrl = import.meta.dev ? 'http://localhost:3000' : getRequestURL(event).origin

        try {
            const collectionName = getCollectionFromContentPath(path)
            if (!collectionName) {
                return errorResult(`Unsupported path: ${path}`)
            }

            const page = await queryCollection(event, collectionName as keyof Collections)
                .where('path', '=', path)
                .select('title', 'path', 'description')
                .first()

            if (!page) {
                return errorResult(`Page not found: ${path}`)
            }

            // Determine content type based on path
            const contentType = path.includes('/blogs') ? 'blogs' : 'docs'

            // 获取原始 markdown 内容
            let content = ''
            try {
                // 尝试通过 /raw 端点获取原始内容（Docus 提供）
                content = await $fetch<string>(`/raw${path}.md`, {
                    baseURL: siteUrl,
                })
            }
            catch {
                content = '[Content available via website]'
            }

            return jsonResult({
                title: page.title || 'Untitled',
                path,
                description: page.description || '',
                content,
                type: contentType,
                url: `${siteUrl}${path}`,
            })
        }
        catch (error) {
            console.error('MCP get-page error:', error)
            return errorResult(`Failed to get page: ${error instanceof Error ? error.message : String(error)}`)
        }
    },
})
