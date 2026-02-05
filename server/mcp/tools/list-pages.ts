import { z } from 'zod'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatter: Record<string, string> = {}
  const lines = match[1].split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
      frontmatter[key] = value
    }
  }
  return frontmatter
}

// Recursively get all markdown files
async function getMarkdownFiles(dir: string, baseDir: string): Promise<string[]> {
  const files: string[] = []
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...await getMarkdownFiles(fullPath, baseDir))
      }
      else if (entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }
  catch {
    // Directory doesn't exist or can't be read
  }
  return files
}

// Convert file path to URL path
function filePathToUrlPath(filePath: string, contentDir: string): string {
  let urlPath = relative(contentDir, filePath)
    .replace(/\.md$/, '')
    .replace(/^\d+\./, '') // Remove leading number prefix
    .split('/')
    .map(segment => segment.replace(/^\d+\./, '')) // Remove number prefixes from each segment
    .join('/')

  // Handle index files
  if (urlPath === 'index' || urlPath.endsWith('/index')) {
    urlPath = urlPath.replace(/\/?index$/, '')
  }

  return '/' + urlPath
}

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
    try {
      // Use process.cwd() which should be the project root in production
      const contentDir = join(process.cwd(), 'content')
      const docsDir = join(contentDir, 'docs')
      const blogsDir = join(contentDir, 'blogs')

      const pages: Array<{
        title: string
        path: string
        description: string
        type: 'docs' | 'blogs'
        category: string | null
      }> = []

      // Get docs
      if (type === 'all' || type === 'docs') {
        const docFiles = await getMarkdownFiles(docsDir, docsDir)
        for (const file of docFiles) {
          try {
            const content = await readFile(file, 'utf-8')
            const frontmatter = parseFrontmatter(content)
            const urlPath = '/docs' + filePathToUrlPath(file, docsDir)

            // Extract category from path
            const pathParts = urlPath.split('/')
            const pageCategory = pathParts.length >= 3 ? pathParts[2] : null

            pages.push({
              title: frontmatter.title || 'Untitled',
              path: urlPath,
              description: frontmatter.description || '',
              type: 'docs',
              category: pageCategory,
            })
          }
          catch {
            // Skip files that can't be read
          }
        }
      }

      // Get blogs
      if (type === 'all' || type === 'blogs') {
        const blogFiles = await getMarkdownFiles(blogsDir, blogsDir)
        for (const file of blogFiles) {
          try {
            const content = await readFile(file, 'utf-8')
            const frontmatter = parseFrontmatter(content)
            const urlPath = '/blogs' + filePathToUrlPath(file, blogsDir)

            pages.push({
              title: frontmatter.title || 'Untitled',
              path: urlPath,
              description: frontmatter.description || '',
              type: 'blogs',
              category: null,
            })
          }
          catch {
            // Skip files that can't be read
          }
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
