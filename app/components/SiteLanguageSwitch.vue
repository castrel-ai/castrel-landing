<script setup lang="ts">
    import type { SiteLocale } from '~~/utils/site-locale'
    import { CHINESE_LOCALE, DEFAULT_LOCALE } from '~~/utils/site-locale'

    const { locale, switchLocalePath, setPreferredLocale } = useSiteLocale()
    const siteCopy = useSiteCopy()

    const localeItems = computed(() => [
        {
            code: DEFAULT_LOCALE,
            label: 'English',
            to: switchLocalePath(DEFAULT_LOCALE),
        },
        {
            code: CHINESE_LOCALE,
            label: '简体中文',
            to: switchLocalePath(CHINESE_LOCALE),
        },
    ])

    function rememberPreference(targetLocale: SiteLocale) {
        setPreferredLocale(targetLocale)
    }
</script>

<template>
    <UPopover :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
        <UButton
            color="neutral"
            variant="ghost"
            class="size-9"
            :aria-label="siteCopy.languageMenu"
        >
            <UIcon name="i-lucide-languages" class="size-5" />
        </UButton>

        <template #content>
            <div class="min-w-44 rounded-xl p-1">
                <NuxtLink
                    v-for="item in localeItems"
                    :key="item.code"
                    :to="item.to"
                    class="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    :class="locale === item.code ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50' : 'text-neutral-700 dark:text-neutral-300'"
                    @click="rememberPreference(item.code)"
                >
                    <span class="font-medium">{{ item.label }}</span>

                    <UIcon
                        v-if="locale === item.code"
                        name="i-lucide-check"
                        class="size-4 text-primary-600 dark:text-primary-400"
                    />
                </NuxtLink>
            </div>
        </template>
    </UPopover>
</template>
