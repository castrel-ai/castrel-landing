import { CHINESE_LOCALE, DEFAULT_LOCALE, LOCALE_COOKIE, detectChineseLanguage } from '~~/utils/site-locale'

export default defineNuxtRouteMiddleware((to) => {
    const redirectToChinese = () => {
        if (process.client) {
            // Force full document navigation to avoid intermittent client-side 404
            // when auto-locale switching from `/` to `/zh` in preview builds.
            return navigateTo('/zh', { external: true, replace: true })
        }

        return navigateTo('/zh', { redirectCode: 302, replace: true })
    }

    const localeCookie = useCookie<string | undefined>(LOCALE_COOKIE)
    const hasLocalePreference = localeCookie.value === CHINESE_LOCALE || localeCookie.value === DEFAULT_LOCALE

    if (to.path === '/zh' || to.path.startsWith('/zh/')) {
        localeCookie.value = CHINESE_LOCALE
        return
    }

    if (to.path !== '/') {
        localeCookie.value = DEFAULT_LOCALE
        return
    }

    if (hasLocalePreference) {
        if (localeCookie.value === CHINESE_LOCALE) {
            return redirectToChinese()
        }
        return
    }

    if (process.server) {
        const headers = useRequestHeaders(['accept-language'])
        if (detectChineseLanguage(headers['accept-language'])) {
            localeCookie.value = CHINESE_LOCALE
            return redirectToChinese()
        }
        return
    }

    if (detectChineseLanguage(navigator.language)) {
        localeCookie.value = CHINESE_LOCALE
        return redirectToChinese()
    }
})
