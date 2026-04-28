<script setup lang="ts">
    import type { Collections } from '@nuxt/content'
    import type { SiteLocale } from '~~/utils/site-locale'
    import { resolveBlobAssetUrl } from '~~/utils/blob-assets'
    import { getLandingCollection, normalizePath } from '~~/utils/site-locale'

    const props = defineProps<{
        locale: SiteLocale
    }>()

    const route = useRoute()
    const normalizedPath = computed(() => normalizePath(route.path))
    const collectionName = computed(() => getLandingCollection(props.locale))

    const { data: page } = await useAsyncData(
        () => `landing_${props.locale}`,
        () => queryCollection(collectionName.value as keyof Collections).path(normalizedPath.value).first(),
    )

    if (!page.value) {
        throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }

    const title = page.value.seo?.title || page.value.title
    const description = page.value.seo?.description || page.value.description

    useSeoMeta({
        title,
        description,
        ogTitle: title,
        ogDescription: description,
    })

    if (page.value?.seo?.ogImage) {
        useSeoMeta({
            ogImage: resolveBlobAssetUrl(page.value.seo.ogImage),
            twitterImage: resolveBlobAssetUrl(page.value.seo.ogImage),
        })
    }
</script>

<template>
    <ContentRenderer
        v-if="page"
        :value="page"
    />
</template>
