import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, ref } from 'vue'
import DocsAsideLeftBody from '~/components/DocsAsideLeftBody.vue'

const UContentNavigationStub = defineComponent({
    props: {
        navigation: {
            type: Array,
            default: () => [],
        },
    },
    template: '<div data-testid="docs-navigation" :data-count="navigation.length" />',
})

const SiteSupportBannerStub = defineComponent({
    template: '<div data-testid="support-banner" />',
})

describe('DocsAsideLeftBody', () => {
    it('keeps the docs navigation and appends the support banner for chinese docs', async () => {
        const wrapper = await mountSuspended(DocsAsideLeftBody, {
            route: '/zh/docs/getting-started/introduction',
            global: {
                provide: {
                    navigation: ref([
                        {
                            title: 'Getting Started',
                            path: '/docs/getting-started/introduction',
                            children: [],
                        },
                    ]),
                },
                stubs: {
                    UContentNavigation: UContentNavigationStub,
                    SiteSupportBanner: SiteSupportBannerStub,
                },
            },
        })

        expect(wrapper.find('[data-testid="docs-navigation"]').attributes('data-count')).toBe('1')
        expect(wrapper.find('[data-testid="support-banner"]').exists()).toBe(true)
    })

    it('keeps the docs navigation without the support banner for english docs', async () => {
        const wrapper = await mountSuspended(DocsAsideLeftBody, {
            route: '/docs/getting-started/introduction',
            global: {
                provide: {
                    navigation: ref([
                        {
                            title: 'Getting Started',
                            path: '/docs/getting-started/introduction',
                            children: [],
                        },
                    ]),
                },
                stubs: {
                    UContentNavigation: UContentNavigationStub,
                    SiteSupportBanner: SiteSupportBannerStub,
                },
            },
        })

        expect(wrapper.find('[data-testid="docs-navigation"]').attributes('data-count')).toBe('1')
        expect(wrapper.find('[data-testid="support-banner"]').exists()).toBe(false)
    })
})
