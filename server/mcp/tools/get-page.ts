import { z } from 'zod'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: Record<string, string>, body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: content }

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
  return { frontmatter, body: match[2] || '' }
}

// Find markdown file by URL path
async function findMarkdownFile(urlPath: string, contentDir: string): Promise<string | null> {
  // Determine base directory and relative path
  let baseDir: string
  let relativePath: string

  if (urlPath.startsWith('/blogs/')) {
    baseDir = join(contentDir, 'blogs')
    relativePath = urlPath.slice('/blogs/'.length)
  }
  else if (urlPath.startsWith('/docs/')) {
    baseDir = join(contentDir, 'docs')
    relativePath = urlPath.slice('/docs/'.length)
  }
  else if (urlPath === '/blogs' || urlPath === '/docs') {
    return null
  }
  else {
    // Try root content directory
    baseDir = contentDir
    relativePath = urlPath.slice(1)
  }

  // Search for matching file with numeric prefixes
  const pathParts = relativePath.split('/').filter(Boolean)

  async function searchDir(dir: string, parts: string[]): Promise<string | null> {
    if (parts.length === 0) {
      // Check for index.md
      try {
        const entries = await readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && entry.name.match(/^(\d+\.)?index\.md$/)) {
            return join(dir, entry.name)
          }
        }
      }
      catch {
        return null
      }
      return null
    }

    const [current, ...rest] = parts
    try {
      const entries = await readdir(dir, { withFileTypes: true })

      // Look for matching directory or file
      for (const entry of entries) {
        const nameWithoutPrefix = entry.name.replace(/^\d+\./, '').replace(/\.md$/, '')

        if (nameWithoutPrefix === current) {
          if (entry.isDirectory() && rest.length >= 0) {
            const result = await searchDir(join(dir, entry.name), rest)
            if (result) return result
          }
          else if (entry.isFile() && entry.name.endsWith('.md') && rest.length === 0) {
            return join(dir, entry.name)
          }
        }
      }

      // If no exact match and this is the last part, try .md extension
      if (rest.length === 0) {
        for (const entry of entries) {
          const nameWithoutPrefix = entry.name.replace(/^\d+\./, '').replace(/\.md$/, '')
          if (entry.isFile() && entry.name.endsWith('.md') && nameWithoutPrefix === current) {
            return join(dir, entry.name)
          }
        }
      }
    }
    catch {
      return null
    }

    return null
  }

  return searchDir(baseDir, pathParts)
}

export default defineMcpTool({
  description: `Retrieves the full content and details of a specific page from Castrel website.

WHEN TO USE: Use this tool when you know the exact page path and need to read its full content.

INPUT: Provide the exact path from list-pages result (e.g., "/docs/getting-started/introduction" or "/blogs/effective-incident-investigation").`,

  inputSchema: {
    path: z.string().describe('The exact path of the page to retrieve (e.g., "/docs/getting-started/introduction")'),
  },

  cache: '1h',

  handler: async ({ path }) => {
    try {
      const contentDir = join(process.cwd(), 'content')
      const filePath = await findMarkdownFile(path, contentDir)

      if (!filePath) {
        return errorResult(`Page not found: ${path}`)
      }

      const content = await readFile(filePath, 'utf-8')
      const { frontmatter, body } = parseFrontmatter(content)

      // Determine content type based on path
      const contentType = path.startsWith('/blogs') ? 'blogs' : 'docs'

      return jsonResult({
        title: frontmatter.title || 'Untitled',
        path,
        description: frontmatter.description || '',
        content: body,
        type: contentType,
      })
    }
    catch (error) {
      console.error('MCP get-page error:', error)
      return errorResult(`Failed to get page: ${error instanceof Error ? error.message : String(error)}`)
    }
  },
})
