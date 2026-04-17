interface HeaderMenuItem {
    label: string
    to: string
    icon: string
}

export function useHeaderMenuItems() {
    const route = useRoute()
    const { locale, toLocalePath } = useSiteLocale()
    const siteCopy = useSiteCopy()

    const menuItems = computed<HeaderMenuItem[]>(() => {
        const items: HeaderMenuItem[] = [
            {
                label: siteCopy.value.documentation,
                to: toLocalePath('/docs/getting-started/introduction', locale.value),
                icon: 'i-lucide-book-open',
            },
            {
                label: siteCopy.value.blog,
                to: toLocalePath('/blogs', locale.value),
                icon: 'i-lucide-file-text',
            },
            {
                label: siteCopy.value.changelog,
                to: toLocalePath('/changelog', locale.value),
                icon: 'i-lucide-history',
            },
        ]

        if (locale.value === 'zh') {
            items.push({
                label: siteCopy.value.pricing,
                to: toLocalePath('/pricing', locale.value),
                icon: 'i-lucide-wallet',
            })
        }

        return items
    })

    const isActive = (item: HeaderMenuItem) => {
        if (item.to.includes('/docs/')) {
            return route.path.includes('/docs/')
        }

        if (item.to.includes('/blogs')) {
            return route.path.includes('/blogs')
        }

        if (item.to.includes('/changelog')) {
            return route.path.includes('/changelog')
        }

        if (item.to.includes('/pricing')) {
            return route.path.includes('/pricing')
        }

        return route.path.startsWith(item.to)
    }

    return {
        menuItems,
        isActive,
    }
}
