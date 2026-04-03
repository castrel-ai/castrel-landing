import type { SiteLocale } from '~~/utils/site-locale'
import {
    CHINESE_LOCALE,
    LOCALE_COOKIE,
    getBlogsCollection,
    getDocsCollection,
    getEquivalentLocalePath,
    getLandingCollection,
    resolveLocaleFromPath,
    withLocalePrefix,
} from '~~/utils/site-locale'

export function useSiteLocale() {
    const route = useRoute()
    const localeCookie = useCookie<SiteLocale>(LOCALE_COOKIE)
    const locale = computed<SiteLocale>(() => resolveLocaleFromPath(route.path))
    const isChinese = computed(() => locale.value === CHINESE_LOCALE)

    const toLocalePath = (path: string, targetLocale: SiteLocale = locale.value) => {
        if (/^https?:\/\//.test(path)) return path
        return withLocalePrefix(path, targetLocale)
    }

    const switchLocalePath = (targetLocale: SiteLocale) => {
        return getEquivalentLocalePath(route.path, targetLocale)
    }

    const setPreferredLocale = (targetLocale: SiteLocale) => {
        localeCookie.value = targetLocale
    }

    watch(
        locale,
        (value) => {
            localeCookie.value = value
        },
        { immediate: true },
    )

    return {
        locale,
        isChinese,
        toLocalePath,
        switchLocalePath,
        setPreferredLocale,
        landingCollection: computed(() => getLandingCollection(locale.value)),
        docsCollection: computed(() => getDocsCollection(locale.value)),
        blogsCollection: computed(() => getBlogsCollection(locale.value)),
    }
}
