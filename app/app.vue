<script setup lang="ts">
import type { ContentNavigationItem, PageCollections } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'
import { extractDocsNavigation } from '~~/utils/docs-navigation'
import { buildLocalizedSeoLinks } from '~~/utils/seo'

const { seo } = useAppConfig()
const site = useSiteConfig()
const route = useRoute()
const { locale, docsCollection } = useSiteLocale()

const nuxtUiLocale = computed(() =>
    locale.value === 'zh' ? nuxtUiLocales.zh_cn : nuxtUiLocales.en,
)
const lang = computed(() => nuxtUiLocale.value.code)
const dir = computed(() => nuxtUiLocale.value.dir)

useHead(() => ({
    meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    link: [
        { rel: 'icon', href: '/favicon.ico' },
        ...buildLocalizedSeoLinks(route.path, site.url, locale.value),
    ],
    htmlAttrs: {
        lang: lang.value,
        dir: dir.value,
    },
}))

useSeoMeta({
    titleTemplate: seo.titleTemplate,
    title: seo.title,
    description: seo.description,
    ogSiteName: site.name,
    twitterCard: 'summary_large_image',
})

const { data: navigation } = await useAsyncData(
    () => `navigation_${docsCollection.value}`,
    () => queryCollectionNavigation(docsCollection.value as keyof PageCollections),
    {
        transform: (data: ContentNavigationItem[]) =>
            extractDocsNavigation(data, locale.value),
        watch: [locale],
    },
)

const { files, searchLoading } = useDeferredContentSearch(
    computed(() => docsCollection.value as keyof PageCollections),
)

provide('navigation', navigation)
</script>

<template>
    <UApp :locale="nuxtUiLocale">
        <NuxtLoadingIndicator color="var(--ui-primary)" />

        <AppHeader v-if="$route.meta.header !== false" />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <AppFooter v-if="$route.meta.footer !== false" />

        <ClientOnly>
            <LazyUContentSearch
                :files="files"
                :navigation="navigation"
                :loading="searchLoading"
            />
        </ClientOnly>
    </UApp>
</template>
