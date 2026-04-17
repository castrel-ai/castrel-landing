<script setup lang="ts">
defineProps<{
    title: string
    links: Array<Record<string, any>>
}>()
</script>

<template>
    <div class="hidden lg:block">
        <UContentToc
            highlight
            :title="title"
            :links="links"
        >
            <template #bottom>
                <DocsAsideRightBottom />
            </template>
        </UContentToc>
    </div>
</template>
