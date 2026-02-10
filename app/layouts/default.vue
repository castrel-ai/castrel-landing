<script setup lang="ts">
// 仅在生产环境加载 SpeedInsights 以减少开发时的 JS 体积
const SpeedInsights = defineAsyncComponent(() =>
    import('@vercel/speed-insights/nuxt').then(m => m.SpeedInsights)
)
const isProd = process.env.NODE_ENV === 'production'
const route = useRoute()
const appConfig = useAppConfig()
const docsOgImageUrl = new URL('/images/docs_og_image.png', appConfig.appUrl).toString()

useSeoMeta(() =>
    route.path.startsWith('/docs')
        ? {
            ogImage: docsOgImageUrl,
        }
        : {}
)
</script>

<template>
  <div>
    <slot />
    <SpeedInsights v-if="isProd" />
  </div>
</template>
