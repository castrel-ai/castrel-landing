<script setup lang="ts">
    const colorMode = useColorMode()
    const siteCopy = useSiteCopy()

    const themeItems = computed(() => [
        {
            value: 'light',
            label: siteCopy.value.themeLight,
            icon: 'i-lucide-sun',
        },
        {
            value: 'dark',
            label: siteCopy.value.themeDark,
            icon: 'i-lucide-moon',
        },
        {
            value: 'system',
            label: siteCopy.value.themeSystem,
            icon: 'i-lucide-monitor',
        },
    ])

    const triggerIcon = computed(() => {
        if (colorMode.preference === 'light') return 'i-lucide-sun'
        if (colorMode.preference === 'dark') return 'i-lucide-moon'
        return 'i-lucide-monitor'
    })

    function selectTheme(theme: 'light' | 'dark' | 'system') {
        colorMode.preference = theme
    }
</script>

<template>
    <UPopover :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
        <UButton
            color="neutral"
            variant="ghost"
            class="size-9"
            :aria-label="siteCopy.themeMenu"
        >
            <UIcon :name="triggerIcon" class="size-5" />
        </UButton>

        <template #content>
            <div class="min-w-40 rounded-xl p-1">
                <button
                    v-for="item in themeItems"
                    :key="item.value"
                    type="button"
                    class="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    :class="colorMode.preference === item.value ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50' : 'text-neutral-700 dark:text-neutral-300'"
                    @click="selectTheme(item.value as 'light' | 'dark' | 'system')"
                >
                    <span class="flex items-center gap-2">
                        <UIcon :name="item.icon" class="size-4" />
                        <span class="font-medium">{{ item.label }}</span>
                    </span>

                    <UIcon
                        v-if="colorMode.preference === item.value"
                        name="i-lucide-check"
                        class="size-4 text-primary-600 dark:text-primary-400"
                    />
                </button>
            </div>
        </template>
    </UPopover>
</template>
