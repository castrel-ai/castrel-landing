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

