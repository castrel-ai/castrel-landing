<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { locale } = useSiteLocale()
</script>

<template>
    <div class="space-y-6">
        <UContentNavigation
            highlight
            :navigation="navigation"
        />

        <SiteSupportBanner v-if="locale === 'zh'" />
    </div>
</template>
