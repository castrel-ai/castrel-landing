<script setup lang="ts">
    interface Integration {
        name: string
        icon: string
        to?: string
    }

    defineProps<{
        integrations: Integration[]
    }>()
</script>

<template>
    <div class="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <component :is="item.to ? 'a' : 'div'" v-for="item in integrations"
            :key="item.name" :href="item.to" :target="item.to ? '_blank' : undefined"
            class="flex flex-col items-center justify-center p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary-500 dark:hover:border-primary-400 transition-colors no-underline"
            :class="item.to ? 'cursor-pointer' : 'cursor-default'">
            <UIcon v-if="item.icon.startsWith('i-')" :name="item.icon"
                class="size-10 text-neutral-700 dark:text-neutral-300" />
            <NuxtImg v-else :src="item.icon" :alt="item.name"
                class="size-10 object-contain grayscale dark:invert dark:brightness-90"
                format="webp" quality="80" loading="lazy" />
            <span
                class="mt-2 text-sm text-center text-neutral-600 dark:text-neutral-400">
                {{ item.name }}
            </span>
        </component>
    </div>
</template>
