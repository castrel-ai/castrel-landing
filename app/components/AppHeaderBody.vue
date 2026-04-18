<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[]> | undefined>('navigation')
const { menuItems, isActive } = useHeaderMenuItems()

const showDocsNavigation = computed(() => route.path.includes('/docs/'))
const hasDocsNavigation = computed(() => (navigation?.value?.length ?? 0) > 0)
</script>

<template>
    <div class="flex flex-col gap-4 py-2">
        <nav class="grid gap-1">
            <NuxtLink v-for="item in menuItems" :key="item.label" :to="item.to" :class="[
                'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(item)
                    ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800/80',
            ]">
                <UIcon :name="item.icon" class="size-4 shrink-0" />
                <span class="truncate">{{ item.label }}</span>
            </NuxtLink>
        </nav>

        <div v-if="showDocsNavigation && hasDocsNavigation" class="border-t border-default/60 pt-4">
            <UContentNavigation
                highlight
                variant="link"
                :default-open="true"
                :navigation="navigation" />
        </div>
    </div>
</template>
