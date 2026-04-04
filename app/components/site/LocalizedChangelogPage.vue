<script setup lang="ts">
    import type { Collections } from '@nuxt/content'
    import type { SiteLocale } from '~~/utils/site-locale'
    import { getChangelogCollection } from '~~/utils/site-locale'

    interface ChangelogItem {
        path: string
        title: string
        description?: string
        date?: string
        version?: string
        image?: {
            src?: string
        }
        meta?: {
            title?: string
            description?: string
            date?: string
            version?: string
            image?: {
                src?: string
            }
        }
    }

    const props = defineProps<{
        locale: SiteLocale
    }>()

    const siteCopy = computed(() => getSiteCopy(props.locale))
    const collectionName = computed(() => getChangelogCollection(props.locale))
    const changelogBasePath = computed(() => (props.locale === 'zh' ? '/zh/changelog' : '/changelog'))

    const { data: entries } = await useAsyncData(
        () => `changelog_${props.locale}`,
        async () => {
            const changelogItems = await queryCollection(collectionName.value as keyof Collections).all()

            return (changelogItems || []).sort((a: any, b: any) => {
                const timestampA = Date.parse(a.date || a.meta?.date || '') || 0
                const timestampB = Date.parse(b.date || b.meta?.date || '') || 0
                if (timestampA !== timestampB) return timestampB - timestampA

                const orderA = a.order || a.meta?.order || 0
                const orderB = b.order || b.meta?.order || 0
                return orderB - orderA
            }) as ChangelogItem[]
        },
    )

    const latestEntry = computed(() => entries.value?.[0] || null)

    useSeoMeta({
        title: `${siteCopy.value.changelog} | Castrel`,
        description:
            getEntryDescription(latestEntry.value)
            || (props.locale === 'zh'
                ? 'Castrel 产品更新日志，包含版本变化与能力说明。'
                : 'Product changelog for Castrel, including releases and updates.'),
    })

    function formatDate(entry?: ChangelogItem): string {
        const dateStr = entry?.date || entry?.meta?.date
        if (!dateStr) return ''
        const date = new Date(dateStr)
        if (Number.isNaN(date.getTime())) return dateStr

        const formatter = new Intl.DateTimeFormat(props.locale === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })

        return formatter.format(date)
    }

    function getDisplayVersion(entry?: Partial<ChangelogItem>): string {
        return entry?.version || entry?.meta?.version || 'v0.0.0'
    }

    function getEntryTitle(entry?: ChangelogItem): string {
        return entry?.title || entry?.meta?.title || ''
    }

    function getEntryDescription(entry?: ChangelogItem): string {
        return entry?.description || entry?.meta?.description || ''
    }

    function getEntryImageSrc(entry?: ChangelogItem): string {
        return entry?.image?.src || entry?.meta?.image?.src || ''
    }

    function getEntryPath(path: string): string {
        const slug = path
            .replace(/^\/zh\/changelog\//, '')
            .replace(/^\/changelog\//, '')

        return `${changelogBasePath.value}/${slug}`
    }

</script>

<template>
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div v-if="entries?.length" class="relative">
            <div class="space-y-8">
                <article
                    v-for="(entry, index) in entries"
                    :key="entry.path"
                    class="grid items-start gap-10 lg:grid-cols-[280px_minmax(0,1fr)]"
                >
                    <div class="pe-6 text-left lg:pe-14 lg:text-right">
                        <p
                            class="text-sm text-neutral-500 dark:text-neutral-400"
                        >
                            {{ formatDate(entry) }}
                        </p>
                        <p
                            class="mt-1 text-xs font-semibold uppercase tracking-wide"
                            :class="index === 0
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-neutral-500 dark:text-neutral-400'"
                        >
                            {{ getDisplayVersion(entry) }}
                        </p>
                    </div>

                    <div class="rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900/50">
                        <NuxtLink
                            v-if="index === 0 && getEntryImageSrc(entry)"
                            :to="getEntryPath(entry.path)"
                            class="mb-4 block aspect-[16/9] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
                        >
                            <NuxtImg
                                :src="getEntryImageSrc(entry)"
                                :alt="getEntryTitle(entry)"
                                class="size-full object-cover"
                                format="webp"
                                quality="80"
                                width="1280"
                                height="720"
                                sizes="sm:100vw md:70vw lg:860px"
                                preload
                                fetchpriority="high"
                            />
                        </NuxtLink>

                        <NuxtLink :to="getEntryPath(entry.path)">
                            <h2 class="text-2xl font-bold text-neutral-900 transition-colors hover:text-primary-600 dark:text-neutral-100 dark:hover:text-primary-400 sm:text-3xl">
                                {{ getEntryTitle(entry) }}
                            </h2>
                        </NuxtLink>

                        <p v-if="getEntryDescription(entry)" class="mt-3 text-base text-neutral-600 dark:text-neutral-300">
                            {{ getEntryDescription(entry) }}
                        </p>
                    </div>
                </article>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-16">
            <UIcon
                name="i-lucide-history"
                class="mb-4 size-16 text-neutral-400 dark:text-neutral-600"
            />
            <p class="text-neutral-600 dark:text-neutral-400">
                {{ props.locale === 'zh' ? '暂无更新日志。' : 'No changelog entries yet.' }}
            </p>
        </div>
    </div>
</template>
