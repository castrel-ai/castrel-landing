<script setup lang="ts">
    import { kebabCase } from 'scule'
    import type { ContentNavigationItem, Collections, DocsCollectionItem } from '@nuxt/content'
    import { findPageHeadline } from '@nuxt/content/utils'
    import type { SiteLocale } from '~~/utils/site-locale'
    import { getDocsCollection, normalizePath } from '~~/utils/site-locale'

    const props = defineProps<{
        locale: SiteLocale
    }>()

    const route = useRoute()
    const normalizedPath = computed(() => normalizePath(route.path))
    const appConfig = useAppConfig()
    const siteCopy = computed(() => getSiteCopy(props.locale))
    const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
    const collectionName = computed(() => getDocsCollection(props.locale))

    const [{ data: page }, { data: surround }] = await Promise.all([
        useAsyncData(`docs_${props.locale}_${kebabCase(route.path)}`, () =>
            queryCollection(collectionName.value as keyof Collections).path(normalizedPath.value).first() as Promise<DocsCollectionItem>,
        ),
        useAsyncData(`docs_${props.locale}_${kebabCase(route.path)}_surround`, () =>
            queryCollectionItemSurroundings(collectionName.value as keyof Collections, normalizedPath.value, {
                fields: ['description'],
            }),
        ),
    ])

    if (!page.value) {
        throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }

    const title = page.value.seo?.title || page.value.title
    const description = page.value.seo?.description || page.value.description

    useSeoMeta({
        title,
        ogTitle: title,
        description,
        ogDescription: description,
    })

    const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
    watch(
        () => navigation?.value,
        () => {
            headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
        },
    )

    const github = computed(() => (appConfig.github ? appConfig.github : null))

    const editLink = computed(() => {
        if (!github.value) {
            return
        }

        return [
            github.value.url,
            'edit',
            github.value.branch,
            github.value.rootDir,
            'content',
            `${page.value?.stem}.${page.value?.extension}`,
        ]
            .filter(Boolean)
            .join('/')
    })
</script>

<template>
    <UPage v-if="page">
        <UPageHeader
            :title="page.title"
            :description="page.description"
            :headline="headline"
            :ui="{
                wrapper: 'flex-row items-center flex-wrap justify-between',
            }"
        >
            <template #links>
                <UButton
                    v-for="(link, index) in (page as DocsCollectionItem).links"
                    :key="index"
                    size="sm"
                    v-bind="link"
                />

                <DocsPageHeaderLinks />
            </template>
        </UPageHeader>

        <UPageBody>
            <ContentRenderer v-if="page" :value="page" />

            <USeparator>
                <div v-if="github" class="flex items-center gap-2 text-sm text-muted">
                    <UButton
                        variant="link"
                        color="neutral"
                        :to="editLink"
                        target="_blank"
                        icon="i-lucide-pen"
                        :ui="{ leadingIcon: 'size-4' }"
                    >
                        {{ siteCopy.editPage }}
                    </UButton>
                    <span>{{ siteCopy.or }}</span>
                    <UButton
                        variant="link"
                        color="neutral"
                        :to="`${github.url}/issues/new/choose`"
                        target="_blank"
                        icon="i-lucide-alert-circle"
                        :ui="{ leadingIcon: 'size-4' }"
                    >
                        {{ siteCopy.reportIssue }}
                    </UButton>
                </div>
            </USeparator>
            <UContentSurround :surround="surround" />
        </UPageBody>

        <template v-if="page?.body?.toc?.links?.length" #right>
            <UContentToc
                highlight
                :title="siteCopy.tableOfContents"
                :links="page.body?.toc?.links"
            >
                <template #bottom>
                    <DocsAsideRightBottom />
                </template>
            </UContentToc>
        </template>
    </UPage>
</template>
