<script setup lang="ts">
    import { resolveBlobAssetUrl } from '~~/utils/blob-assets'
</script>

<template>
    <NuxtImg :src="resolveBlobAssetUrl('/images/tasks.png')" alt="Task Execution" class="task-image"
        format="webp" quality="80" loading="lazy" />
</template>

<style scoped>
.task-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: right top;
    transform: perspective(1000px) rotateY(-12deg) rotateX(2deg) scale(1.3);
    transform-origin: right center;
}
</style>
