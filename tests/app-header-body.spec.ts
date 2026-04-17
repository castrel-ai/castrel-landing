import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, ref } from 'vue'
import AppHeaderBody from '~/components/AppHeaderBody.vue'

const NuxtLinkStub = defineComponent({
    props: {
        to: {
            type: String,
            default: '',
        },
    },
    template: '<a :href="to"><slot /></a>',
})

const UIconStub = defineComponent({
    template: '<span data-testid="icon" />',
})

const UContentNavigationStub = defineComponent({
    props: {
        navigation: {
            type: Array,
            default: () => [],
        },
    },
    template: '<div data-testid="docs-navigation">{{ navigation.length }}</div>',
})

async function mountHeaderBody(route: string) {
    return mountSuspended(AppHeaderBody, {
        route,
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
                NuxtLink: NuxtLinkStub,
                UIcon: UIconStub,
                UContentNavigation: UContentNavigationStub,
            },
        },
    })
}

describe('AppHeaderBody', () => {
    it('shows the site-level navigation links in the mobile menu', async () => {
        const wrapper = await mountHeaderBody('/zh')

        expect(wrapper.text()).toContain('文档')
        expect(wrapper.text()).toContain('博客')
        expect(wrapper.text()).toContain('更新日志')
        expect(wrapper.text()).toContain('定价')
    })

    it('shows the docs tree only when browsing docs pages', async () => {
        const homeWrapper = await mountHeaderBody('/zh')
        expect(homeWrapper.find('[data-testid="docs-navigation"]').exists()).toBe(false)

        const docsWrapper = await mountHeaderBody('/docs/getting-started/introduction')
        expect(docsWrapper.find('[data-testid="docs-navigation"]').exists()).toBe(true)
    })
})
