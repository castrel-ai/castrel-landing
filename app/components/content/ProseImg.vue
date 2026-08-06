We need to apply the suggested edit to the original code. The original code appears to be a partial snippet of a Vue component, probably from a Nuxt or Vue app. It shows a figure with a video conditional rendering, then an `<img` tag that seems incomplete.

The suggested edit is a full component with `<script setup lang="ts">`, imports, props, reactive logic, and template. It replaces the original code entirely. So the complete modified file would be the suggested edit, but we need to ensure we output the entire file, which is the content of the suggested edit. The instruction: "Apply the SUGGESTED EDIT to the ORIGINAL CODE. Output the complete modified file." The original code is just a fragment; the suggested edit seems to be a full rewrite, replacing that fragment and the incomplete `<img` tag. So output the suggested edit exactly as given.

But the suggested edit includes a script setup that uses an import from `~~/utils/blob-assets`. That might be a Nuxt-specific alias. The original code didn't have that. That's fine; we just output the whole code as suggested.

We must output ONLY code. So we'll output the entire `<script setup lang="ts">...` and `<template>...</template>` as provided, preserving the exact content.

Check for any potential discrepancies: the suggested edit includes a closing `</script>` after the script, then template. It has no style block. So output that.

Make sure no extra commentary. Just the code.```vue
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
        <figcaption v-if="props.alt" class="px-4 py-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
            {{ props.alt }}
        </figcaption>
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

