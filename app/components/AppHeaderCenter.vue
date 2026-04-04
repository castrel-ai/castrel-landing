<script setup lang="ts">
    interface MenuItem {
        label: string
        to: string
        icon: string
    }

    const route = useRoute()
    const { locale, toLocalePath } = useSiteLocale()
    const siteCopy = useSiteCopy()

    const menuItems = computed<MenuItem[]>(() => {
        const items: MenuItem[] = [
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

        return items
    })

    const isActive = (item: MenuItem) => {
        if (item.to.includes('/docs/')) {
            return route.path.includes('/docs/')
        }

        if (item.to.includes('/blogs')) {
            return route.path.includes('/blogs')
        }
        if (item.to.includes('/changelog')) {
            return route.path.includes('/changelog')
        }
        return route.path.startsWith(item.to)
    }
</script>

<template>
    <nav class="w-full lg:flex items-center justify-center gap-1">
        <NuxtLink v-for="item in menuItems" :key="item.label" :to="item.to" :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            isActive(item)
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
        ]">
            <UIcon :name="item.icon" class="size-4" />
            {{ item.label }}
        </NuxtLink>
    </nav>
</template>
