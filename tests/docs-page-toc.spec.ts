import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import DocsPageToc from '~/components/site/DocsPageToc.vue'

const UContentTocStub = defineComponent({
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
    template: `
        <div data-testid="toc" :data-title="title" :data-count="links.length">
            <slot name="bottom" />
        </div>
    `,
})

const DocsAsideRightBottomStub = defineComponent({
    template: '<div data-testid="toc-bottom" />',
})

describe('DocsPageToc', () => {
    it('keeps the toc hidden on mobile while preserving the desktop aside content', async () => {
        const wrapper = await mountSuspended(DocsPageToc, {
            props: {
                title: 'Table of Contents',
                links: [
                    {
                        id: 'intro',
                        depth: 2,
                        text: 'Introduction',
                    },
                ],
            },
            global: {
                stubs: {
                    UContentToc: UContentTocStub,
                    DocsAsideRightBottom: DocsAsideRightBottomStub,
                },
            },
        })

        expect(wrapper.find('.hidden.lg\\:block').exists()).toBe(true)
        expect(wrapper.find('[data-testid="toc"]').attributes('data-title')).toBe('Table of Contents')
        expect(wrapper.find('[data-testid="toc"]').attributes('data-count')).toBe('1')
        expect(wrapper.find('[data-testid="toc-bottom"]').exists()).toBe(true)
    })
})
