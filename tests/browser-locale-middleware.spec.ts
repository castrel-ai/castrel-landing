import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { navigateToMock, localeCookie, requestHeaders } = vi.hoisted(() => ({
    navigateToMock: vi.fn(),
    localeCookie: { value: undefined as string | undefined },
    requestHeaders: { 'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8' },
}))

mockNuxtImport('navigateTo', () => navigateToMock)
mockNuxtImport('useCookie', () => () => localeCookie)
mockNuxtImport('useRequestHeaders', () => () => requestHeaders)

import browserLocaleMiddleware from '~/middleware/browser-locale.global'

function setProcessFlags(flags: { client: boolean, server: boolean }) {
    Object.defineProperty(process, 'client', {
        value: flags.client,
        configurable: true,
        writable: true,
    })
    Object.defineProperty(process, 'server', {
        value: flags.server,
        configurable: true,
        writable: true,
    })
}

describe('browser locale middleware', () => {
    const originalNavigator = globalThis.navigator

    beforeEach(() => {
        navigateToMock.mockReset()
        localeCookie.value = undefined
    })

    afterEach(() => {
        setProcessFlags({ client: false, server: true })
        if (originalNavigator) {
            Object.defineProperty(globalThis, 'navigator', {
                value: originalNavigator,
                configurable: true,
            })
        }
    })

    it('redirects zh browsers from root to the canonical /zh path on the server', () => {
        setProcessFlags({ client: false, server: true })

        browserLocaleMiddleware({ path: '/' } as any)

        expect(localeCookie.value).toBe('zh')
        expect(navigateToMock).toHaveBeenCalledWith('/zh', {
            redirectCode: 302,
            replace: true,
        })
    })

    it('redirects zh browsers from root to the canonical /zh path on the client', () => {
        setProcessFlags({ client: true, server: false })
        Object.defineProperty(globalThis, 'navigator', {
            value: { language: 'zh-CN' },
            configurable: true,
        })

        browserLocaleMiddleware({ path: '/' } as any)

        expect(localeCookie.value).toBe('zh')
        expect(navigateToMock).toHaveBeenCalledWith('/zh', {
            external: true,
            replace: true,
        })
    })
})
