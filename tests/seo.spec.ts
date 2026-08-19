import { describe, expect, it } from 'vitest'
import {
    buildLocalizedSeoLinks,
    buildSitemapXml,
    toCanonicalUrl,
} from '../utils/seo'

describe('SEO URL helpers', () => {
    it('keeps public pages canonical on the website origin', () => {
        expect(toCanonicalUrl('/docs/features/alert-triage')).toBe(
            'https://www.castrel.ai/docs/features/alert-triage',
        )
    })

    it('adds reciprocal locale links for mirrored pages', () => {
        expect(buildLocalizedSeoLinks('/zh/docs/features/alert-triage', undefined, 'zh')).toEqual([
            {
                rel: 'canonical',
                href: 'https://www.castrel.ai/zh/docs/features/alert-triage',
            },
            {
                rel: 'alternate',
                hreflang: 'en',
                href: 'https://www.castrel.ai/docs/features/alert-triage',
            },
            {
                rel: 'alternate',
                hreflang: 'zh-CN',
                href: 'https://www.castrel.ai/zh/docs/features/alert-triage',
            },
            {
                rel: 'alternate',
                hreflang: 'x-default',
                href: 'https://www.castrel.ai/docs/features/alert-triage',
            },
        ])
    })

    it('does not claim a translated equivalent when locale routing falls back elsewhere', () => {
        expect(buildLocalizedSeoLinks('/blogs/openclaw-monitoring', undefined, 'en')).toEqual([
            {
                rel: 'canonical',
                href: 'https://www.castrel.ai/blogs/openclaw-monitoring',
            },
        ])
    })

    it('adds locale links for blog posts that exist in both languages', () => {
        expect(buildLocalizedSeoLinks('/blogs/application-health-inspection', undefined, 'en')).toEqual([
            {
                rel: 'canonical',
                href: 'https://www.castrel.ai/blogs/application-health-inspection',
            },
            {
                rel: 'alternate',
                hreflang: 'en',
                href: 'https://www.castrel.ai/blogs/application-health-inspection',
            },
            {
                rel: 'alternate',
                hreflang: 'zh-CN',
                href: 'https://www.castrel.ai/zh/blogs/application-health-inspection',
            },
            {
                rel: 'alternate',
                hreflang: 'x-default',
                href: 'https://www.castrel.ai/blogs/application-health-inspection',
            },
        ])
    })
})

describe('sitemap XML', () => {
    it('deduplicates URLs and emits alternates only for pages present in both locales', () => {
        const sitemap = buildSitemapXml([
            '/',
            '/zh',
            '/docs/features/alert-triage',
            '/zh/docs/features/alert-triage',
            '/blogs/openclaw-monitoring',
            '/blogs/openclaw-monitoring',
        ])

        expect(sitemap.match(/<loc>/g)).toHaveLength(5)
        expect(sitemap).toContain('<loc>https://www.castrel.ai/docs/features/alert-triage</loc>')
        expect(sitemap).toContain('hreflang="zh-CN" href="https://www.castrel.ai/zh/docs/features/alert-triage"')
        expect(sitemap).not.toContain('hreflang="zh-CN" href="https://www.castrel.ai/zh/blogs/openclaw-monitoring"')
        expect(sitemap).not.toContain('app.castrel.ai')
    })
})
