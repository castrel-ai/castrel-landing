export default defineAppConfig({
    appUrl: process.env.NUXT_PUBLIC_APP_URL || 'https://app.castrel.ai',
    header: {
        logo: {
            light: '/images/castrel_logo_v3.png',
            dark: '/images/castrel_logo_v3.png',
            alt: 'Castrel',
        },
        title: 'Castrel AI',
    },
    // 禁用 GitHub 集成，隐藏 header 和 footer 中的 GitHub 链接
    github: false,
    // TOC 配置
    toc: {
        bottom: {
            title: 'Community',
            links: [
                {
                    icon: 'i-simple-icons-x',
                    label: 'X',
                    to: 'https://x.com/castrel_ai',
                    target: '_blank',
                },
                {
                    icon: 'i-simple-icons-discord',
                    label: 'Discord',
                    to: 'https://discord.gg/DynAHf3pgV',
                    target: '_blank',
                },
                {
                    icon: 'i-simple-icons-github',
                    label: 'GitHub',
                    to: 'https://github.com/castrel-ai',
                    target: '_blank',
                },
                {
                    icon: 'i-simple-icons-youtube',
                    label: 'YouTube',
                    to: 'about:blank',
                    target: '_blank',
                },
            ],
        },
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
