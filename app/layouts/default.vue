<script setup lang="ts">
// 仅在生产环境加载 SpeedInsights 以减少开发时的 JS 体积
const SpeedInsights = defineAsyncComponent(() =>
    import('@vercel/speed-insights/nuxt').then(m => m.SpeedInsights)
)
const isProd = process.env.NODE_ENV === 'production'
</script>

<template>
  <div>
    <slot />
    <SpeedInsights v-if="isProd" />
  </div>
</template>
