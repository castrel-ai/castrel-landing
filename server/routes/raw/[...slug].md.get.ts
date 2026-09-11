import { stringify } from 'minimark/stringify'
import { withLeadingSlash } from 'ufo'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import { getCollectionFromContentPath } from '~~/utils/site-locale'

export default eventHandler(async (event) => {
    const slug = getRouterParams(event)['slug.md']
    if (!slug?.endsWith('.md')) {
        throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }

    const path = withLeadingSlash(slug.replace('.md', ''))
    const collectionName = getCollectionFromContentPath(path)

    if (!collectionName) {
        throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }

    const page = await queryCollection(event, collectionName as keyof Collections).path(path).first()
    if (!page) {
        throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }

    if (page.body.value[0]?.[0] !== 'h1') {
        page.body.value.unshift(['blockquote', {}, page.description])
        page.body.value.unshift(['h1', {}, page.title])
    }

    setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
    setHeader(event, 'X-Robots-Tag', 'noindex, follow')
    return stringify({ ...page.body, type: 'minimark' }, { format: 'markdown/html' })
})
