<script setup lang="ts">
import type { NuxtError } from '#app'
import type { ContentNavigationItem, PageCollections } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'
import { extractDocsNavigation } from '~~/utils/docs-navigation'

const props = defineProps<{
    error: NuxtError
}>()

const { locale, docsCollection } = useSiteLocale()
const nuxtUiLocale = computed(() =>
    locale.value === 'zh' ? nuxtUiLocales.zh_cn : nuxtUiLocales.en,
)
const lang = computed(() => nuxtUiLocale.value.code)
const dir = computed(() => nuxtUiLocale.value.dir)

useHead({
    htmlAttrs: {
        lang,
        dir,
    },
})

const localizedError = computed(() => ({
    ...props.error,
    statusMessage: locale.value === 'zh' ? '页面不存在' : 'Page not found',
    message: locale.value === 'zh'
        ? '你访问的页面不存在，或者还没翻译完。'
        : 'The page you requested does not exist yet or has not been translated.',
}))

useSeoMeta({
    title: () => localizedError.value.statusMessage || 'Page not found',
    description: () => localizedError.value.message || '',
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

const { data: files } = useLazyAsyncData(
    () => `search_${docsCollection.value}`,
    () => queryCollectionSearchSections(docsCollection.value as keyof PageCollections),
    {
        server: false,
        watch: [locale],
    },
)

provide('navigation', navigation)
</script>

<template>
    <UApp :locale="nuxtUiLocale">
        <AppHeader />

        <UError :error="localizedError" />

        <AppFooter />

        <ClientOnly>
            <LazyUContentSearch
                :files="files"
                :navigation="navigation"
            />
        </ClientOnly>
    </UApp>
</template>
