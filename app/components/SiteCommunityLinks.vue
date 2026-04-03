<script setup lang="ts">
    withDefaults(defineProps<{
        variant?: 'aside' | 'footer'
        withSeparator?: boolean
    }>(), {
        variant: 'aside',
        withSeparator: false,
    })

    const siteCopy = useSiteCopy()
    const communityLinks = useCommunityLinks()
</script>

<template>
    <div
        v-if="communityLinks.length"
        :class="variant === 'footer' ? 'flex items-center justify-end gap-1 sm:gap-2' : 'space-y-6'"
    >
        <USeparator
            v-if="variant === 'aside' && withSeparator"
            type="dashed"
        />

        <template v-if="variant === 'footer'">
            <UTooltip
                v-for="link in communityLinks"
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

        <UPageLinks
            v-else
            :title="siteCopy.communityTitle"
            :links="communityLinks"
        />
    </div>
</template>
