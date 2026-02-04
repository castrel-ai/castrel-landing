import { z } from 'zod'

export default defineMcpTool({
  description: `Lists all available pages from Castrel website including documentation and blog posts.

WHEN TO USE: Use this tool when you need to EXPLORE or SEARCH for content but don't know the exact page path.

OUTPUT: Returns a structured list with title, path, description, type, and url for each page.`,
  
  inputSchema: {
    type: z.enum(['all', 'docs', 'blogs']).optional().describe('Filter by content type: all (default), docs, or blogs'),
  },
  
  cache: '1h',
  
  handler: async ({ type = 'all' }) => {
    const event = useEvent()
    const siteUrl = import.meta.dev ? 'http://localhost:3000' : getRequestURL(event).origin
    
    try {
      // Query all pages from docs collection
      const allPages = await queryCollection(event, 'docs' as any)
        .select('title', 'path', 'description')
        .all()
      
      // Filter and categorize pages
      const categorizedPages = allPages.map((page: any) => {
        const contentType = page.path.startsWith('/blogs') ? 'blogs' : 'docs'
        return {
          title: page.title || 'Untitled',
          path: page.path,
          description: page.description || '',
          type: contentType,
          url: `${siteUrl}${page.path}`,
        }
      })
      
      // Apply type filter
      let filteredPages = categorizedPages
      if (type === 'docs') {
        filteredPages = categorizedPages.filter((p: any) => p.type === 'docs')
      } else if (type === 'blogs') {
        filteredPages = categorizedPages.filter((p: any) => p.type === 'blogs')
      }

      return jsonResult(filteredPages)
    }
    catch (error) {
      console.error('MCP list-pages error:', error)
      return errorResult(`Failed to list pages: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
})
