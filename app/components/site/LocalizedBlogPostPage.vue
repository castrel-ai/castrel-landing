<script setup lang="ts">
    import type { Collections } from '@nuxt/content'
    import type { SiteLocale } from '~~/utils/site-locale'
    import { getBlogsCollection } from '~~/utils/site-locale'

    const props = defineProps<{
        locale: SiteLocale
    }>()

    const route = useRoute()
    const siteCopy = computed(() => getSiteCopy(props.locale))
    const collectionName = computed(() => getBlogsCollection(props.locale))
    const slugParts = route.params.slug as string[]
    const slug = Array.isArray(slugParts) ? slugParts.join('/') : slugParts
    const targetPath = computed(() =>
        props.locale === 'zh' ? `/zh/blogs/${slug}` : `/blogs/${slug}`,
    )

    const { data: post } = await useAsyncData(
        () => `blog_${props.locale}_${slug}`,
        () => queryCollection(collectionName.value as keyof Collections).path(targetPath.value).first(),
    )

    if (!post.value) {
        await navigateTo(props.locale === 'zh' ? '/zh/blogs' : '/blogs')
    }

    if (post.value) {
        const appConfig = useAppConfig()
        const seoOgImagePath = typeof post.value.meta?.seo?.ogImage === 'string'
            ? post.value.meta.seo.ogImage
            : null
        const directOgImagePath = typeof post.value.meta?.ogImage === 'string'
            ? post.value.meta.ogImage
            : null
        const headerImagePath = typeof post.value.meta?.image?.src === 'string'
            ? post.value.meta.image.src
            : null
        const ogImagePath = seoOgImagePath
            || directOgImagePath
            || headerImagePath
            || '/images/blog/ai-troubleshooting/incident-investigation-header.png'
        const ogImageUrl = new URL(ogImagePath, appConfig.appUrl).toString()

        useSeoMeta({
            title: post.value.title,
            description: post.value.description,
            ogImage: ogImageUrl,
        })
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr)
        return date.toLocaleDateString(props.locale === 'zh' ? 'zh-CN' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }
</script>

<template>
    <div v-if="post" class="mx-auto max-w-4xl px-6 py-12">
        <div class="text-center mb-10">
            <div
                class="flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-4"
            >
                <span v-if="post.meta?.date">
                    {{ formatDate(post.meta.date) }}
                </span>
            </div>

            <h1
                class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-4xl lg:text-5xl leading-tight"
            >
                {{ post.title }}
            </h1>

            <div
                v-if="post.meta?.tags?.length"
                class="flex flex-wrap items-center justify-center gap-2 mt-4"
            >
                <UBadge v-for="tag in post.meta.tags" :key="tag" color="primary" variant="subtle" size="sm">
                    {{ tag }}
                </UBadge>
            </div>
        </div>

        <div
            v-if="post.meta?.image?.src"
            class="mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
        >
            <NuxtImg
                :src="post.meta.image.src"
                :alt="post.title"
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

        <div class="prose prose-lg prose-neutral dark:prose-invert mx-auto max-w-none">
            <ContentRenderer :value="post" />
        </div>

        <div
            v-if="post.meta?.authorName"
            class="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800"
        >
            <div class="flex items-center gap-3">
                <div v-if="post.meta?.authorImage" class="size-12 overflow-hidden rounded-full">
                    <NuxtImg
                        :src="post.meta.authorImage"
                        :alt="post.meta.authorName"
                        class="size-full object-cover"
                        format="webp"
                        quality="80"
                        loading="lazy"
                        decoding="async"
                        width="96"
                        height="96"
                    />
                </div>
                <div>
                    <p class="font-medium text-neutral-900 dark:text-neutral-100">
                        {{ post.meta.authorName }}
                    </p>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">
                        {{ siteCopy.author }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
