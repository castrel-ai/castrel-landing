<script setup lang="ts">
    interface Feature {
        icon: string
        title: string
        description: string
        highlight?: string
        highlightLabel?: string
        badge?: string
        cols?: number
        rows?: number
    }

    defineProps<{
        features: Feature[]
        gridCols?: number
        mobileSingleColumn?: boolean
    }>()

    function getCardStyle(feature: Feature) {
        const style: Record<string, string> = {}
        if (feature.cols) {
            style.gridColumn = `span ${feature.cols}`
        }
        if (feature.rows) {
            style.gridRow = `span ${feature.rows}`
        }
        return style
    }
</script>

<template>
    <div class="bento-grid" :class="{ 'bento-grid--mobile-single-column': mobileSingleColumn }"
        :style="gridCols ? { '--grid-cols': gridCols } : {}">
        <div v-for="(feature, index) in features" :key="index"
            class="bento-card relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col"
            :style="getCardStyle(feature)">
            <!-- Badge -->
            <span v-if="feature.badge"
                class="absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded bg-primary-500/10 text-primary-500 border border-primary-500/20">
                {{ feature.badge }}
            </span>

            <!-- Highlight only card (no icon/title) -->
            <template
                v-if="feature.highlight && (!feature.icon || feature.icon === '')">
                <div class="flex-1 flex flex-col items-center justify-center">
                    <div class="text-5xl font-bold text-primary-500">
                        {{ feature.highlight }}
                    </div>
                    <div v-if="feature.highlightLabel"
                        class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                        {{ feature.highlightLabel }}
                    </div>
                </div>
            </template>

            <!-- Normal card -->
            <template v-else>
                <!-- Icon -->
                <div
                    class="size-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4">
                    <UIcon :name="feature.icon" class="size-6 text-primary-500" />
                </div>

                <!-- Title -->
                <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    {{ feature.title }}
                </h3>

                <!-- Description -->
                <p class="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">
                    {{ feature.description }}
                </p>
            </template>
        </div>
    </div>
</template>

<style scoped>
.bento-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 768px) {
    .bento-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .bento-grid {
        grid-template-columns: repeat(var(--grid-cols, 4), 1fr);
        grid-auto-rows: minmax(140px, auto);
    }
}

@media (max-width: 1023px) {
    .bento-grid--mobile-single-column {
        grid-template-columns: 1fr;
    }

    .bento-grid--mobile-single-column .bento-card {
        grid-column: auto !important;
        grid-row: auto !important;
    }
}
</style>
