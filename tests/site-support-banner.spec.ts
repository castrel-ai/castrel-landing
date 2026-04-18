import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import SiteSupportBanner from '~/components/SiteSupportBanner.vue'

const UCardStub = defineComponent({
    template: '<div data-testid="support-card"><slot /></div>',
})

const UButtonStub = defineComponent({
    props: {
        to: {
            type: String,
            default: '',
        },
        target: {
            type: String,
            default: undefined,
        },
    },
    template: '<a :href="to" :target="target"><slot /></a>',
})

const UIconStub = defineComponent({
    template: '<span data-testid="icon" />',
})

describe('SiteSupportBanner', () => {
    it('stays hidden for english docs readers', async () => {
        const wrapper = await mountSuspended(SiteSupportBanner, {
            route: '/docs/getting-started/introduction',
            global: {
                stubs: {
                    UCard: UCardStub,
                    UButton: UButtonStub,
                    UIcon: UIconStub,
                },
            },
        })

        expect(wrapper.text()).toBe('')
        expect(wrapper.find('[data-testid="support-card"]').exists()).toBe(false)
    })

    it('localizes the support page and community channel labels for chinese docs readers', async () => {
        const wrapper = await mountSuspended(SiteSupportBanner, {
            route: '/zh/docs/getting-started/introduction',
            global: {
                stubs: {
                    UCard: UCardStub,
                    UButton: UButtonStub,
                    UIcon: UIconStub,
                },
            },
        })

        expect(wrapper.text()).toContain('需要帮助？')
        expect(wrapper.find('a[href="/zh/docs/more/support"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('飞书群')
    })
})
