<script setup lang="ts">
    import { resolveBlobAssetUrl } from '~~/utils/blob-assets'

    const props = withDefaults(defineProps<{
        src?: string
        alt?: string
        width?: string | number
        height?: string | number
    }>(), {
        src: '',
        alt: '',
        width: undefined,
        height: undefined,
    })

    const resolvedSrc = computed(() => resolveBlobAssetUrl(props.src))
</script>

<template>
    <img
        :src="resolvedSrc"
        :alt="props.alt"
        :width="props.width"
        :height="props.height"
        loading="lazy"
        decoding="async"
    >
</template>
