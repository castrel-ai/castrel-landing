<script setup lang="ts">
    import type { Collections } from '@nuxt/content'
    import type { SiteLocale } from '~~/utils/site-locale'
    import { getBlogsCollection } from '~~/utils/site-locale'

    const props = defineProps<{
        locale: SiteLocale
    }>()

    const siteCopy = computed(() => getSiteCopy(props.locale))
    const collectionName = computed(() => getBlogsCollection(props.locale))

    useSeoMeta({
        title: siteCopy.value.blogTitle,
        description: siteCopy.value.blogDescription,
    })

    const { data: posts } = await useAsyncData(
        () => `blogs_${props.locale}`,
        async () => {
            const blogPosts = await queryCollection(collectionName.value as keyof Collections).all()

            return (blogPosts || []).sort((a: any, b: any) => {
                const orderA = a.order || a.meta?.order || 0
                const orderB = b.order || b.meta?.order || 0
                return orderB - orderA
            })
        },
    )
</script>

<template>
    <div class="container mx-auto max-w-6xl px-4 py-24">
        <div class="mb-12 text-center">
            <h1 class="text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl">
                {{ siteCopy.blogTitle }}
            </h1>
            <p class="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                {{ siteCopy.blogDescription }}
            </p>
        </div>

        <div v-if="posts?.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <BlogPostCard v-for="post in posts" :key="post.path" :post="post" />
        </div>

        <div v-else class="flex flex-col items-center justify-center py-16">
            <UIcon
                name="i-lucide-file-text"
                class="size-16 text-neutral-400 dark:text-neutral-600 mb-4"
            />
            <p class="text-neutral-600 dark:text-neutral-400">
                {{ siteCopy.blogEmpty }}
            </p>
        </div>
    </div>
</template>
