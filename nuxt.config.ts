import RemoveDocusRoutes from './modules/remove-docus-routes'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://castrel.ai'

export default defineNuxtConfig({
    // 路由重定向
    routeRules: {
        '/privacy': { redirect: '/docs/security/privacy-policy' },
        '/terms': { redirect: '/docs/security/terms-of-service' },
    },

    // 实验性功能 - MCP 服务器需要 asyncContext
    experimental: {
        asyncContext: true,
        // Avoid runtime dependency on /_nuxt/builds/meta/<buildId>.json.
        // We have observed manifest/buildId drift on preview/prod edges causing 404
        // and app bootstrap failure for the home page.
        appManifest: false,
    },

    // MCP 服务器配置
    mcp: {
        name: 'castrel-docs',
    },

    // Nitro 配置 - 预渲染和压缩优化。
    // 不要内联 @nuxt/content：它依赖 Nuxt 在构建时解析的 #content/manifest 虚拟导入。
    nitro: {
        prerender: {
            crawlLinks: true,
            routes: ['/', '/zh'],
            ignore: ['/_vercel/image', '/_ipx'],
        },
        compressPublicAssets: true,
    },

    // Mermaid 图表支持 + 图片优化
    modules: ['@barzhsieh/nuxt-content-mermaid', '@nuxt/image', RemoveDocusRoutes],

    // 内容数据库：强制使用 Node 内置 sqlite，避免 better-sqlite3 在 Vercel 运行时崩溃
    content: {
        experimental: {
            sqliteConnector: 'native',
        },
    },

    // 图片配置
    // NOTE: Use direct image URLs to avoid intermittent `/_vercel/image` 404
    // cache poisoning on preview deployments.
    image: {
        provider: 'none',
        domains: ['castrel.ai'],
        format: ['avif', 'webp'],
        quality: 80,
    },

    // 图标配置：Docus/Nuxt UI 会在预渲染期间解析大量图标。
    // 将站内使用的集合打入本地 bundle，避免构建时等待 Iconify/API 加载超时。
    icon: {
        provider: 'server',
        fallbackToApi: false,
        collections: ['lucide', 'simple-icons'],
        serverBundle: {
            collections: ['lucide', 'simple-icons'],
        },
        clientBundle: {
            scan: true,
            sizeLimitKb: 512,
        },
    },

    // LLM 索引配置
    llms: {
        domain: siteUrl,
        full: false,
    },

    // OG 图片输出配置（Vercel 上统一使用 PNG）
    ogImage: {
        defaults: {
            extension: 'png',
        },
    },

    // Vite 配置 - 解决 mermaid ESM 兼容性问题 + 构建优化
    vite: {
        optimizeDeps: {
            include: ['mermaid'],
        },
        build: {
            cssCodeSplit: true,
            chunkSizeWarningLimit: 900,
            rollupOptions: {
                output: {
                    manualChunks: {
                        mermaid: ['mermaid'],
                    },
                },
            },
        },
    },

    // 关闭生产 sourcemap 以避免 Tailwind 插件 sourcemap 警告
    sourcemap: {
        client: false,
        server: false,
    },

    // 应用配置
    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
                { rel: 'stylesheet', href: '/font-faces.css' },
                // 字体预加载 - 提升 FCP
                { rel: 'preload', href: '/fonts/ia-writer-quattro/ia-writer-quattro-400.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
                { rel: 'preload', href: '/fonts/fira-code/fira-code-400.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
            ],
        },
    },

    // 全局 CSS
    css: [
        '~/assets/css/fonts.css',
        '~/assets/css/docs-integrations-nav-icons.css',
    ],

    // 字体解析：仅使用本地字体，并显式禁用在线 provider（避免触发 Google 请求）
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
        families: [],
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
                        prose: ['iA Writer Quattro', 'Microsoft YaHei', 'PingFang SC', 'sans-serif'],
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
