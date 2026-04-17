import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import EnHeroFreeTrialCta from '~/components/EnHeroFreeTrialCta.vue'

function createMatchMedia(matches: boolean): typeof window.matchMedia {
    return ((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia
}

const UButtonStub = defineComponent({
    props: {
        label: {
            type: String,
            default: '',
        },
    },
    emits: ['click'],
    template: '<button data-testid="trial-button" @click="$emit(\'click\')">{{ label }}</button>',
})

const SalesLeadModalStub = defineComponent({
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        localeTag: {
            type: String,
            default: '',
        },
        sourcePageFallback: {
            type: String,
            default: '',
        },
        trialUrl: {
            type: String,
            default: '',
        },
        idPrefix: {
            type: String,
            default: '',
        },
    },
    template: `
        <div
            data-testid="sales-modal"
            :data-open="String(open)"
            :data-locale-tag="localeTag"
            :data-source-page-fallback="sourcePageFallback"
            :data-trial-url="trialUrl"
            :data-id-prefix="idPrefix" />
    `,
})

async function mountComponent() {
    return mountSuspended(EnHeroFreeTrialCta, {
        global: {
            stubs: {
                UButton: UButtonStub,
                SalesLeadModal: SalesLeadModalStub,
            },
        },
    })
}

describe('EnHeroFreeTrialCta', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('opens the sales lead modal on mobile browsers', async () => {
        vi.stubGlobal('matchMedia', createMatchMedia(true))
        const openSpy = vi.fn()
        vi.stubGlobal('open', openSpy)

        const wrapper = await mountComponent()
        await wrapper.get('[data-testid="trial-button"]').trigger('click')

        expect(wrapper.get('[data-testid="sales-modal"]').attributes('data-open')).toBe('true')
        expect(wrapper.get('[data-testid="sales-modal"]').attributes('data-locale-tag')).toBe('en-US')
        expect(wrapper.get('[data-testid="sales-modal"]').attributes('data-source-page-fallback')).toBe('/')
        expect(openSpy).not.toHaveBeenCalled()
    })

    it('opens the free trial site directly on desktop browsers', async () => {
        vi.stubGlobal('matchMedia', createMatchMedia(false))
        const openSpy = vi.fn()
        vi.stubGlobal('open', openSpy)

        const wrapper = await mountComponent()
        await wrapper.get('[data-testid="trial-button"]').trigger('click')

        expect(wrapper.get('[data-testid="sales-modal"]').attributes('data-open')).toBe('false')
        expect(openSpy).toHaveBeenCalledWith(
            'https://app.castrel.ai?utm_source=castrel.ai&utm_medium=website&utm_campaign=en_home',
            '_blank',
            'noopener,noreferrer',
        )
    })
})
