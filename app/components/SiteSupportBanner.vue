<script setup lang="ts">
    const { locale, toLocalePath } = useSiteLocale()
    const siteCopy = useSiteCopy()
    const communityLinks = useCommunityLinks()

    const isChinese = computed(() => locale.value === 'zh')
    const supportPath = computed(() => toLocalePath('/docs/more/support', locale.value))
</script>

<template>
    <UCard
        v-if="isChinese"
        class="overflow-hidden border-default/70 bg-gradient-to-br from-primary-500/8 via-bg/90 to-bg/95 shadow-sm"
        :ui="{ body: 'p-4' }"
    >
        <div class="space-y-4">
            <div class="space-y-2">
                <div class="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">
                    <UIcon name="i-lucide-life-buoy" class="size-3.5" />
                    <span>{{ siteCopy.supportPage }}</span>
                </div>

                <div class="space-y-1.5">
                    <p class="text-sm font-semibold text-highlighted">
                        {{ siteCopy.supportBannerTitle }}
                    </p>
                    <p class="text-sm leading-6 text-muted">
                        {{ siteCopy.supportBannerDescription }}
                    </p>
                </div>
            </div>

            <UButton
                color="primary"
                variant="soft"
                size="sm"
                class="w-full justify-center"
                icon="i-lucide-arrow-right"
                trailing
                :to="supportPath"
            >
                {{ siteCopy.supportBannerCta }}
            </UButton>

            <div class="space-y-2">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                    {{ siteCopy.communityTitle }}
                </p>

                <div class="flex flex-wrap gap-2">
                    <UButton
                        v-for="link in communityLinks"
                        :key="link.label"
                        color="neutral"
                        variant="outline"
                        size="xs"
                        class="rounded-full"
                        :to="link.to"
                        :target="link.target"
                    >
                        <UIcon :name="link.icon" class="size-3.5" />
                        <span>{{ link.label }}</span>
                    </UButton>
                </div>
            </div>
        </div>
    </UCard>
</template>
