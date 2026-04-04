<script setup lang="ts">
    import type { Collections } from '@nuxt/content'
    import type { SiteLocale } from '~~/utils/site-locale'
    import { getChangelogCollection } from '~~/utils/site-locale'

    const props = defineProps<{
        locale: SiteLocale
    }>()

    const route = useRoute()
    const collectionName = computed(() => getChangelogCollection(props.locale))
    const slugParts = route.params.slug as string[]
    const slug = Array.isArray(slugParts) ? slugParts.join('/') : slugParts
    const targetPath = computed(() =>
        props.locale === 'zh' ? `/zh/changelog/${slug}` : `/changelog/${slug}`,
    )

    const { data: entry } = await useAsyncData(
        () => `changelog_${props.locale}_${slug}`,
        () => queryCollection(collectionName.value as keyof Collections).path(targetPath.value).first(),
    )

    if (!entry.value) {
        await navigateTo(props.locale === 'zh' ? '/zh/changelog' : '/changelog')
    }

    if (entry.value) {
        const entryTitle = entry.value.title || entry.value.meta?.title || ''
        const entryDescription = entry.value.description || entry.value.meta?.description || ''
        useSeoMeta({
            title: `${entryTitle} | Castrel`,
            description: entryDescription,
        })
    }

    function formatDate(): string {
        const dateStr = entry.value?.date || entry.value?.meta?.date
        if (!dateStr) return ''
        const date = new Date(dateStr)
        if (Number.isNaN(date.getTime())) return dateStr
        return date.toLocaleDateString(props.locale === 'zh' ? 'zh-CN' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    function getDisplayVersion(): string {
        return entry.value?.version || entry.value?.meta?.version || 'v0.0.0'
    }

    function getImageSrc(): string {
        return entry.value?.image?.src || entry.value?.meta?.image?.src || ''
    }
</script>

<template>
    <div v-if="entry" class="mx-auto max-w-4xl px-6 py-12">
        <div class="text-center mb-10">
            <div
                class="flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-4"
            >
                <span v-if="entry.date || entry.meta?.date">
                    {{ formatDate() }} · {{ getDisplayVersion() }}
                </span>
            </div>

            <h1
                class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-4xl lg:text-5xl leading-tight"
            >
                {{ entry.title || entry.meta?.title }}
            </h1>
        </div>

        <div
            v-if="getImageSrc()"
            class="mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
        >
            <NuxtImg
                :src="getImageSrc()"
                :alt="entry.title || entry.meta?.title"
                class="size-full object-cover"
                format="webp"
                quality="80"
                width="1280"
                height="720"
                sizes="sm:100vw md:768px lg:896px"
                preload
                fetchpriority="high"
            />
        </div>

        <ProseCallout
            v-if="entry.description || entry.meta?.description"
            icon="i-lucide-info"
            color="info"
            class="mb-10"
        >
            {{ entry.description || entry.meta?.description }}
        </ProseCallout>

        <div class="prose prose-lg prose-neutral dark:prose-invert mx-auto max-w-none">
            <ContentRenderer :value="entry" />
        </div>

    </div>
</template>
