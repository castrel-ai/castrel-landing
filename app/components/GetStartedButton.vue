<script setup lang="ts">
    const { locale } = useSiteLocale()

    const trialUrl = computed(() =>
        locale.value === 'zh'
            ? 'https://castrel-app.cloudwise.com?utm_source=castrel.ai&utm_medium=website&utm_campaign=zh_home'
            : 'https://app.castrel.ai?utm_source=castrel.ai&utm_medium=website&utm_campaign=en_home',
    )
</script>

<template>
    <UButton color="neutral" size="xl" :to="trialUrl" target="_blank"
        trailing-icon="i-lucide-arrow-right">
        Try Free
    </UButton>
</template>
