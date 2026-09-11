export default defineAppConfig({
    appUrl: process.env.NUXT_PUBLIC_APP_URL || 'https://app.castrel.ai',
    seo: {
        titleTemplate: '%s | Castrel',
        title: 'AI SRE Agent for Evidence-Backed Operations',
        description: 'Castrel connects observability data, operational knowledge, and execution tools to triage alerts, investigate incidents, and automate repeatable operations.',
    },
    header: {
        logo: {
            light: '/images/logo.svg',
            dark: '/images/logo.svg',
            alt: 'Castrel',
        },
        title: 'Castrel AI',
    },
    // Nuxt UI 组件主题配置
    ui: {
        contentToc: {
            slots: {
                root: 'sticky top-(--ui-header-height) z-10 bg-default/75 lg:bg-[initial] backdrop-blur -mx-4 px-4 sm:px-6 sm:-mx-6 overflow-y-auto max-h-[calc(100vh-var(--ui-header-height))] w-72 lg:w-84',
                link: 'group relative text-xs flex items-start focus-visible:outline-primary py-1.5 leading-snug',
                linkText: 'whitespace-normal overflow-visible break-words text-xs',
                linkLeadingIcon: 'size-3 shrink-0 mt-0.5',
            },
            // 确保 active 状态字体大小不变
            compoundVariants: [
                {
                    color: 'primary',
                    active: true,
                    class: {
                        link: 'text-primary text-xs',
                        linkText: 'text-xs',
                    },
                },
                {
                    color: 'neutral',
                    active: true,
                    class: {
                        link: 'text-highlighted text-xs',
                        linkText: 'text-xs',
                    },
                },
            ],
        },
    },
})
