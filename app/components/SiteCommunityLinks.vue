<script setup lang="ts">
    const props = withDefaults(defineProps<{
        variant?: 'aside' | 'footer' | 'hero'
        withSeparator?: boolean
        featuredOnly?: boolean
    }>(), {
        variant: 'aside',
        withSeparator: false,
        featuredOnly: false,
    })
    const siteCopy = useSiteCopy()
    const communityLinks = useCommunityLinks()
    const visibleLinks = computed(() =>
        props.featuredOnly
            ? communityLinks.value.filter(link => link.featured)
            : communityLinks.value,
    )
</script>

<template>
    <div
        v-if="visibleLinks.length"
        :class="[
            variant === 'footer' ? 'flex items-center justify-end gap-1 sm:gap-2' : '',
            variant === 'hero' ? 'space-y-3' : '',
            variant === 'aside' ? 'space-y-6' : '',
        ]"
    >
        <USeparator
            v-if="variant === 'aside' && withSeparator"
            type="dashed"
        />

        <template v-if="variant === 'footer'">
            <UTooltip
                v-for="link in visibleLinks"
                :key="link.label"
                :text="link.label"
                :delay-duration="450"
                :content="{ side: 'top', sideOffset: 10 }"
            >
                <UButton
                    color="neutral"
                    variant="ghost"
                    class="size-9 rounded-full"
                    :to="link.to"
                    :target="link.target"
                    :aria-label="link.label"
                >
                    <UIcon :name="link.icon" class="size-5" />
                </UButton>
            </UTooltip>
        </template>

        <template v-else-if="variant === 'hero'">
            <div class="space-y-3">
                <div class="flex items-center gap-2 text-sm font-medium text-highlighted">
                    <span class="inline-flex size-2 rounded-full bg-primary" />
                    <span>{{ siteCopy.communityHeroTitle }}</span>
                </div>

                <div class="flex flex-wrap gap-2.5">
                    <UButton
                        v-for="link in visibleLinks"
                        :key="link.label"
                        color="neutral"
                        variant="outline"
                        size="sm"
                        class="rounded-full border-default/80 bg-default/75 backdrop-blur-sm"
                        :to="link.to"
                        :target="link.target"
                    >
                        <UIcon :name="link.icon" class="size-4" />
                        <span>{{ link.label }}</span>
                    </UButton>
                </div>
            </div>
        </template>

        <UPageLinks
            v-else
            :title="siteCopy.communityTitle"
            :links="visibleLinks"
        />
    </div>
</template>
