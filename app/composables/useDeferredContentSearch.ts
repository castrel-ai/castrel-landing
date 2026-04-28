import type { PageCollections } from '@nuxt/content'
import type { MaybeRefOrGetter } from 'vue'

export function useDeferredContentSearch(collection: MaybeRefOrGetter<keyof PageCollections>) {
    const currentCollection = computed(() => toValue(collection))
    const loadedCollection = ref<keyof PageCollections | null>(null)
    const { open } = useContentSearch()

    const {
        data: files,
        status,
        execute,
        clear,
    } = useAsyncData(
        () => `search_${currentCollection.value}`,
        () => queryCollectionSearchSections(currentCollection.value),
        {
            default: () => [],
            immediate: false,
            server: false,
            watch: false,
        },
    )

    const loadSearchSections = async () => {
        if (loadedCollection.value === currentCollection.value) {
            return
        }

        await execute()
        loadedCollection.value = currentCollection.value
    }

    watch(open, (isOpen) => {
        if (isOpen) {
            void loadSearchSections()
        }
    })

    watch(currentCollection, () => {
        loadedCollection.value = null
        clear()

        if (open.value) {
            void loadSearchSections()
        }
    })

    return {
        files,
        searchLoading: computed(() => status.value === 'pending'),
    }
}
