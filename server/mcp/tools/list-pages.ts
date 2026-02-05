import { z } from 'zod'

export default defineMcpTool({
  description: `Lists all available pages from Castrel website including documentation and blog posts.

WHEN TO USE: Use this tool when you need to EXPLORE or SEARCH for content but don't know the exact page path.

OUTPUT: Returns a structured list with title, path, description, type, and category for each page.

NOTE: The "category" filter only applies to docs. Blogs do not have categories (flat structure under /blogs/).
Available doc categories: "getting-started", "features", "integrations", "security", "more".`,

  inputSchema: {
    type: z.enum(['all', 'docs', 'blogs']).optional().describe('Filter by content type: all (default), docs, or blogs'),
    search: z.string().optional().describe('Search keyword to filter pages by title or description (case-insensitive)'),
    title: z.string().optional().describe('Search keyword to filter pages by title only (case-insensitive)'),
    category: z.string().optional().describe('Filter by category/directory. Only applies to docs. Available: "getting-started", "features", "integrations", "security", "more"'),
    limit: z.coerce.number().optional().describe('Maximum number of results to return'),
  },

  cache: '1h',

  handler: async ({ type = 'all', search, title, category, limit }) => {
    const event = useEvent()

    try {
      // Query all pages from docs collection
      const allPages = await queryCollection(event, 'docs' as any)
        .select('title', 'path', 'description')
        .all()

      // Filter and categorize pages
      const categorizedPages = allPages.map((page: any) => {
        const contentType = page.path.startsWith('/blogs') ? 'blogs' : 'docs'
        // Extract category from path (e.g., /docs/features/alert-triage -> features)
        const pathParts = page.path.split('/')
        const pageCategory = contentType === 'docs' && pathParts.length >= 3 ? pathParts[2] : null
        return {
          title: page.title || 'Untitled',
          path: page.path,
          description: page.description || '',
          type: contentType,
          category: pageCategory,
        }
      })

      // Apply filters
      let filteredPages = categorizedPages

      // Type filter
      if (type === 'docs') {
        filteredPages = filteredPages.filter((p: any) => p.type === 'docs')
      }
      else if (type === 'blogs') {
        filteredPages = filteredPages.filter((p: any) => p.type === 'blogs')
      }

      // Category filter
      if (category) {
        const normalizedCategory = category.toLowerCase()
        filteredPages = filteredPages.filter((p: any) =>
          p.category && p.category.toLowerCase() === normalizedCategory,
        )
      }

      // Search filter (case-insensitive match on title or description)
      if (search) {
        const searchLower = search.toLowerCase()
        filteredPages = filteredPages.filter((p: any) =>
          p.title.toLowerCase().includes(searchLower)
          || p.description.toLowerCase().includes(searchLower),
        )
      }

      // Title filter (case-insensitive match on title only)
      if (title) {
        const titleLower = title.toLowerCase()
        filteredPages = filteredPages.filter((p: any) =>
          p.title.toLowerCase().includes(titleLower),
        )
      }

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
