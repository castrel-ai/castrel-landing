import { defineNuxtModule } from '@nuxt/kit'
import type { NuxtPage } from 'nuxt/schema'

const DOCUS_ROUTE_FILES = [
    'docus/app/templates/landing.vue',
    'docus/app/pages/[[lang]]/[...slug].vue',
]

function shouldRemovePage(page: NuxtPage) {
    return DOCUS_ROUTE_FILES.some(routeFile => page.file?.includes(routeFile))
}

function prunePages(pages: NuxtPage[]) {
    return pages
        .filter(page => !shouldRemovePage(page))
        .map((page) => {
            if (page.children?.length) {
                page.children = prunePages(page.children)
            }

            return page
        })
}

export default defineNuxtModule({
    meta: {
        name: 'remove-docus-routes',
    },
    setup(_, nuxt) {
        nuxt.hook('pages:resolved', (pages) => {
            const filteredPages = prunePages(pages)
            pages.splice(0, pages.length, ...filteredPages)
        })
    },
})
