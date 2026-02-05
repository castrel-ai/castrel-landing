<script setup lang="ts">
    const appConfig = useAppConfig()
</script>

<template>
    <NuxtLink to="/" class="flex items-center gap-2">
        <ClientOnly>
            <UColorModeImage
                v-if="appConfig.header?.logo?.dark || appConfig.header?.logo?.light"
                :light="appConfig.header?.logo?.light || appConfig.header?.logo?.dark"
                :dark="appConfig.header?.logo?.dark || appConfig.header?.logo?.light"
                :alt="appConfig.header?.logo?.alt || appConfig.header?.title"
                class="h-6 w-auto shrink-0" />
            <template #fallback>
                <NuxtImg v-if="appConfig.header?.logo?.light"
                    :src="appConfig.header?.logo?.light"
                    :alt="appConfig.header?.logo?.alt || appConfig.header?.title"
                    class="h-6 w-auto shrink-0" format="webp" quality="80" />
            </template>
        </ClientOnly>
        <span class="font-bold text-sm text-neutral-500 dark:text-neutral-500">
            {{ appConfig.header?.title || 'Castrel AI' }}
        </span>
    </NuxtLink>
</template>
