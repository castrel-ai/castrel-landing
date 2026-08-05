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

    const videoRef = ref<HTMLVideoElement | null>(null)
    const resolvedSrc = computed(() => resolveBlobAssetUrl(props.src))
    const isVideo = computed(() => {
        const path = props.src.split(/[?#]/, 1)[0]?.toLowerCase() ?? ''
        return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')
    })

    let observer: IntersectionObserver | undefined

    onMounted(() => {
        if (!isVideo.value || !videoRef.value) return

        observer = new IntersectionObserver(
            ([entry]) => {
                const video = videoRef.value
                if (!video) return

                if (entry?.isIntersecting) {
                    video.play().catch(() => {
                        // Some browsers may still block autoplay. The video remains visible.
                    })
                    return
                }

                video.pause()
            },
            {
                threshold: 0.45,
            },
        )

        observer.observe(videoRef.value)
    })

    onBeforeUnmount(() => {
        observer?.disconnect()
    })
</script>

<template>
    <figure v-if="isVideo" class="not-prose my-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 shadow-sm dark:border-neutral-800">
        <video
            ref="videoRef"
            :src="resolvedSrc"
            :width="props.width"
            :height="props.height"
            class="w-full"
            autoplay
            loop
            muted
            playsinline
            preload="metadata"
            :aria-label="props.alt"
        >
            {{ props.alt }}
        </video>
    </figure>
    <img
        v-else
        :src="resolvedSrc"
        :alt="props.alt"
        :width="props.width"
        :height="props.height"
        loading="lazy"
        decoding="async"
    >
</template>
