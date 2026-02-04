export default defineNuxtConfig({
    // 路由重定向
    routeRules: {
        '/privacy': { redirect: '/docs/security/privacy-policy' },
        '/terms': { redirect: '/docs/security/terms-of-service' },
    },

    // 实验性功能 - MCP 服务器需要 asyncContext
    experimental: {
        asyncContext: true,
    },

    // MCP 服务器配置
    mcp: {
        name: 'castrel-docs',
    },

    // Nitro 配置 - 确保 @nuxt/content/server 能被正确解析
    nitro: {
        externals: {
            inline: ['@nuxt/content'],
        },
    },

    // Nuxt Content 配置 - 定义 collections
    content: {
        sources: {
            blogs: {
                prefix: '/blogs',
                driver: 'fs',
                base: './content/blogs',
            },
        },
    },

    // Mermaid 图表支持
    modules: ['@barzhsieh/nuxt-content-mermaid'],

    // Vite 配置 - 解决 mermaid ESM 兼容性问题
    vite: {
        optimizeDeps: {
            include: ['mermaid'],
        },
    },

    // 应用配置
    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
            ],
        },
    },

    // 全局 CSS
    css: ['~/assets/css/fonts.css'],

    // 字体配置
    fonts: {
        defaults: {
            weights: [400, 500, 600, 700],
            styles: ['normal', 'italic'],
            subsets: ['latin', 'latin-ext'],
        },
        families: [
            // 文章内容字体
            {
                name: 'iA Writer Quattro',
                provider: 'local',
                global: true,
            },
            // 文章回退字体（中文）
            {
                name: 'Noto Sans SC',
                provider: 'google',
                global: true,
            },
            // 代码字体
            {
                name: 'Fira Code',
                provider: 'local',
                global: true,
            },
        ],
        experimental: {
            processCSSVariables: true,
        },
    },

    // Tailwind CSS 配置
    tailwindcss: {
        config: {
            theme: {
                extend: {
                    fontFamily: {
                        // UI 字体：用于导航、按钮、标签等界面元素
                        ui: ['Microsoft YaHei', '-apple-system', 'sans-serif'],
                        // 文章字体：用于文档正文、博客内容
                        prose: ['iA Writer Quattro', 'Noto Sans SC', 'sans-serif'],
                        // 代码字体：用于代码块、行内代码
                        mono: ['Fira Code', 'Menlo', 'Monaco', 'monospace'],
                    },
                },
            },
            safelist: [
                'grid-cols-3',
                'grid-cols-4',
                'grid-cols-6',
                'sm:grid-cols-3',
                'sm:grid-cols-4',
                'sm:grid-cols-6',
                'md:grid-cols-3',
                'md:grid-cols-4',
                'md:grid-cols-6',
                'lg:grid-cols-3',
                'lg:grid-cols-4',
                'lg:grid-cols-6',
            ],
        },
    },
})
