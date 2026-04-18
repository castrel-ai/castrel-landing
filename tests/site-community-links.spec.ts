import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import SiteCommunityLinks from '~/components/SiteCommunityLinks.vue'

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

const UTooltipStub = defineComponent({
    template: '<div><slot /></div>',
})

const USeparatorStub = defineComponent({
    template: '<div data-testid="separator" />',
})

const UPageLinksStub = defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        links: {
            type: Array,
            default: () => [],
        },
    },
    template: '<div data-testid="page-links" :data-title="title" :data-count="links.length" />',
})

describe('SiteCommunityLinks', () => {
    it('can limit hero links to the featured chinese community channel', async () => {
        const wrapper = await mountSuspended(SiteCommunityLinks, {
            route: '/zh',
            props: {
                variant: 'hero',
                featuredOnly: true,
            },
            global: {
                stubs: {
                    UButton: UButtonStub,
                    UIcon: UIconStub,
                    USeparator: USeparatorStub,
                    UTooltip: UTooltipStub,
                    UPageLinks: UPageLinksStub,
                },
            },
        })

        expect(wrapper.text()).toContain('加入社区')
        expect(wrapper.find('[data-testid="page-links"]').exists()).toBe(false)
        expect(wrapper.find('a[href="https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=fc0oec2d-2290-4708-ab3e-95b4471832ab"]').text()).toContain('飞书群')
        expect(wrapper.text()).not.toContain('Bilibili')
    })

    it('keeps the full chinese community list in non-featured variants', async () => {
        const wrapper = await mountSuspended(SiteCommunityLinks, {
            route: '/zh',
            global: {
                stubs: {
                    UButton: UButtonStub,
                    UIcon: UIconStub,
                    USeparator: USeparatorStub,
                    UTooltip: UTooltipStub,
                    UPageLinks: UPageLinksStub,
                },
            },
        })

        expect(wrapper.find('[data-testid="page-links"]').attributes('data-count')).toBe('2')
    })
})
