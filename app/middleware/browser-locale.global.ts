import { CHINESE_LOCALE, LOCALE_COOKIE, detectChineseLanguage } from '~~/utils/site-locale'

export default defineNuxtRouteMiddleware((to) => {
    const localeCookie = useCookie<string | undefined>(LOCALE_COOKIE)

    if (to.path === '/zh' || to.path.startsWith('/zh/')) {
        localeCookie.value = CHINESE_LOCALE
        return
    }

    if (to.path !== '/') {
        localeCookie.value = 'en'
        return
    }

    if (localeCookie.value === CHINESE_LOCALE) {
        return navigateTo('/zh', { redirectCode: 302, replace: true })
    }

    if (process.server) {
        const headers = useRequestHeaders(['accept-language'])
        if (detectChineseLanguage(headers['accept-language'])) {
            return navigateTo('/zh', { redirectCode: 302, replace: true })
        }
        return
    }

    if (detectChineseLanguage(navigator.language)) {
        localeCookie.value = CHINESE_LOCALE
        return navigateTo('/zh', { replace: true })
    }
})
