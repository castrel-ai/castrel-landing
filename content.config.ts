import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createDocsSchema = () =>
    z.object({
        links: z
            .array(
                z.object({
                    label: z.string(),
                    icon: z.string(),
                    to: z.string(),
                    target: z.string().optional(),
                }),
            )
            .optional(),
    })

export default defineContentConfig({
    collections: {
        landing_en: defineCollection({
            type: 'page',
            source: {
                cwd: 'content/en',
                include: 'index.md',
            },
        }),
        landing_zh: defineCollection({
            type: 'page',
            source: {
                cwd: 'content/zh',
                include: 'index.md',
                prefix: '/zh',
            },
        }),
        docs_en: defineCollection({
            type: 'page',
            source: {
                cwd: 'content/en',
                include: 'docs/**/*',
                exclude: ['docs/index.md'],
                prefix: '/docs',
            },
            schema: createDocsSchema(),
        }),
        docs_zh: defineCollection({
            type: 'page',
            source: {
                cwd: 'content/zh',
                include: 'docs/**/*',
                exclude: ['docs/index.md'],
                prefix: '/zh/docs',
            },
            schema: createDocsSchema(),
        }),
        blogs_en: defineCollection({
            type: 'page',
            source: {
                cwd: 'content/en',
                include: 'blogs/**/*',
                prefix: '/blogs',
            },
        }),
        blogs_zh: defineCollection({
            type: 'page',
            source: {
                cwd: 'content/zh',
                include: 'blogs/**/*',
                prefix: '/zh/blogs',
            },
        }),
    },
})
