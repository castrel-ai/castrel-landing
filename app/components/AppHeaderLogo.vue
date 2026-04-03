<script setup lang="ts">
    const appConfig = useAppConfig()
    const logoSrc = computed(() =>
        appConfig.header?.logo?.light || appConfig.header?.logo?.dark || '',
    )
</script>

<template>
    <div class="flex items-center gap-2">
        <img
            v-if="logoSrc"
            :src="logoSrc"
            :alt="appConfig.header?.logo?.alt || appConfig.header?.title"
            class="h-6 w-auto shrink-0"
        />
        <span class="font-bold text-sm text-neutral-500 dark:text-neutral-500">
            {{ appConfig.header?.title || 'Castrel AI' }}
        </span>
    </div>
</template>
