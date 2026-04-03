import RemoveDocusRoutes from './modules/remove-docus-routes'

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

    // Nitro 配置 - 预渲染和压缩优化
    nitro: {
        externals: {
            inline: ['@nuxt/content'],
        },
        prerender: {
            crawlLinks: true,
            routes: ['/', '/zh'],
        },
        compressPublicAssets: true,
    },

    // Mermaid 图表支持 + 图片优化
    modules: ['@barzhsieh/nuxt-content-mermaid', '@nuxt/image', RemoveDocusRoutes],

    // 图片优化配置
    image: {
        provider: 'vercel',
        domains: ['castrel.ai'],
        format: ['avif', 'webp'],
        quality: 80,
    },

    // Vite 配置 - 解决 mermaid ESM 兼容性问题 + 构建优化
    vite: {
        optimizeDeps: {
            include: ['mermaid'],
        },
        build: {
            cssCodeSplit: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        mermaid: ['mermaid'],
                    },
                },
            },
        },
    },

    // 应用配置
    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
                // 字体预加载 - 提升 FCP
                { rel: 'preload', href: '/fonts/ia-writer-quattro/ia-writer-quattro-400.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
                { rel: 'preload', href: '/fonts/fira-code/fira-code-400.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
            ],
        },
    },

    // 全局 CSS
    css: ['~/assets/css/fonts.css'],

    // 字体解析：仅使用本地字体，避免开发环境外网请求阻塞
    fonts: {
        provider: 'local',
        providers: {
            adobe: false,
            bunny: false,
            fontshare: false,
            fontsource: false,
            google: false,
            googleicons: false,
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
