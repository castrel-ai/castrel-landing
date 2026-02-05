<script setup lang="ts">
    // Nuxt Content v3 puts frontmatter fields in meta object
    interface BlogPostMeta {
        date?: string
        category?: string
        image?: {
            src: string
        }
    }

    interface BlogPost {
        path?: string
        title: string
        description?: string
        category?: string
        meta?: BlogPostMeta
    }

    defineProps<{
        post: BlogPost
    }>()

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
</script>

<template>
    <NuxtLink :to="post.path"
        class="group block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 hover:shadow-lg no-underline">
        <div class="aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <NuxtImg v-if="post.meta?.image?.src" :src="post.meta.image.src"
                :alt="post.title" format="webp" quality="80" loading="lazy"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div v-else class="size-full flex items-center justify-center">
                <UIcon name="i-lucide-image"
                    class="size-12 text-neutral-400 dark:text-neutral-600" />
            </div>
        </div>

        <div class="p-5">
            <div v-if="post.category || post.meta?.category" class="mb-3">
                <span
                    class="text-xs font-medium uppercase tracking-wider text-primary-500 dark:text-primary-400">
                    {{ post.category || post.meta?.category }}
                </span>
            </div>

            <h3
                class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                {{ post.title }}
            </h3>

            <p v-if="post.description"
                class="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {{ post.description }}
            </p>

            <div v-if="post.meta?.date" class="mt-4">
                <span class="text-xs text-neutral-500 dark:text-neutral-500">
                    {{ formatDate(post.meta.date) }}
                </span>
            </div>
        </div>
    </NuxtLink>
</template>
