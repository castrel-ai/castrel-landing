import type { SiteLocale } from '~~/utils/site-locale'
import { computed } from 'vue'
import { useSiteLocale } from './useSiteLocale'

const copy = {
    en: {
        documentation: 'Documentation',
        blog: 'Blog',
        changelog: 'Changelog',
        pricing: 'Pricing',
        languageMenu: 'Language',
        themeMenu: 'Theme',
        themeLight: 'Light',
        themeDark: 'Dark',
        themeSystem: 'System',
        communityTitle: 'Community',
        communityHeroTitle: 'Join the community',
        blogTitle: 'Blog',
        blogDescription: 'Latest articles, insights, and updates from the Castrel team.',
        blogEmpty: 'No blog posts yet. Check back soon!',
        author: 'Author',
        terms: 'Terms',
        privacy: 'Privacy',
        supportPage: 'Support',
        supportBannerTitle: 'Need help?',
        supportBannerDescription: 'Start with the support guide, then use the channel that best fits your question or feedback.',
        supportBannerCta: 'Open support guide',
        switchLanguage: '中文',
        editPage: 'Edit this page',
        reportIssue: 'Report an issue',
        or: 'or',
        tableOfContents: 'Table of Contents',
    },
    zh: {
        documentation: '文档',
        blog: '博客',
        changelog: '更新日志',
        pricing: '定价',
        languageMenu: '语言',
        themeMenu: '主题',
        themeLight: '浅色',
        themeDark: '深色',
        themeSystem: '跟随系统',
        communityTitle: '社区',
        communityHeroTitle: '加入社区',
        blogTitle: '博客',
        blogDescription: 'Castrel 团队的最新文章、洞察与更新。',
        blogEmpty: '还没有博客文章，之后再来看看。',
        author: '作者',
        terms: '条款',
        privacy: '隐私',
        supportPage: '支持',
        supportBannerTitle: '需要帮助？',
        supportBannerDescription: '先看支持说明，再通过最适合你的社区渠道提问、反馈问题或跟进产品动态。',
        supportBannerCta: '查看支持页',
        switchLanguage: 'English',
        editPage: '编辑此页',
        reportIssue: '报告问题',
        or: '或',
        tableOfContents: '目录',
    },
} as const

export function getSiteCopy(locale: SiteLocale) {
    return copy[locale]
}

export function useSiteCopy() {
    const { locale } = useSiteLocale()
    return computed(() => getSiteCopy(locale.value))
}
