import { z } from 'zod'

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

    // All content (docs and blogs) is in the 'docs' collection
    const collectionName = 'docs'

    try {
      const page = await queryCollection(event, collectionName as any)
        .path(path)
        .first()

      if (!page) {
        return errorResult(`Page not found: ${path}`)
      }

      // Determine content type based on path
      const contentType = path.startsWith('/blogs') ? 'blogs' : 'docs'

      // Convert body to string if it's an object (AST format)
      const bodyContent = typeof (page as any).body === 'string'
        ? (page as any).body
        : JSON.stringify((page as any).body)

      return jsonResult({
        title: (page as any).title || 'Untitled',
        path: (page as any).path,
        description: (page as any).description || '',
        content: bodyContent || (page as any).content || 'Content not available',
        type: contentType,
        url: `${siteUrl}${(page as any).path}`,
      })
    }
    catch (error) {
      console.error('MCP get-page error:', error)
      return errorResult(`Failed to get page: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
})
