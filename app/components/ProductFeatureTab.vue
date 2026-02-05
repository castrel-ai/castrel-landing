<script setup lang="ts">
    import { computed, useSlots } from 'vue'

    interface TabData {
        label: string
        icon?: string
        title: string
        description: string
        rightImage?: string
        fullWidthImage?: string
        imagePosition?: string
        imageScale?: number
        demoUrl?: string
        videoUrl?: string
        docsUrl?: string
    }

    const props = defineProps<{
        tab: TabData
        index: number
    }>()

    const slots = useSlots()

    const hasButtons = computed(() => {
        return props.tab.demoUrl || props.tab.videoUrl || props.tab.docsUrl
    })

    const hasLeftSlot = computed(() => !!slots[`tab-${props.index}-left`])
    const hasRightSlot = computed(() => !!slots[`tab-${props.index}-right`])
</script>

<template>
    <div class="product-feature-tab">
        <!-- 视觉展示区域 -->
        <div v-if="tab.fullWidthImage"
            class="visual-area relative h-[400px] overflow-hidden gradient-base">
            <div class="image-wrapper">
                <NuxtImg :src="tab.fullWidthImage" :alt="tab.title"
                    class="w-full h-full object-cover rounded-lg" format="webp"
                    quality="80" loading="lazy" :style="{
                        objectPosition: tab.imagePosition || 'center'
                    }" />
            </div>
        </div>
        <div v-else
            class="visual-area grid grid-cols-1 lg:grid-cols-2 gap-0 h-[400px] overflow-hidden">
            <!-- 左侧：slot -->
            <div
                class="visual-left relative p-6 flex items-center justify-center border-r border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-800/50 overflow-hidden">
                <slot :name="`tab-${index}-left`">
                    <div class="text-neutral-400 text-sm">
                        left side
                    </div>
                </slot>
            </div>

            <!-- 右侧：slot 或图片 -->
            <div class="visual-right relative w-full h-full overflow-hidden"
                :class="{ 'gradient-base': tab.rightImage }">
                <slot :name="`tab-${index}-right`">
                    <div v-if="tab.rightImage" class="image-wrapper">
                        <NuxtImg :src="tab.rightImage" :alt="tab.title"
                            class="w-full h-full object-cover rounded-lg" format="webp"
                            quality="80" loading="lazy" :style="{
                                objectPosition: tab.imagePosition || 'center',
                                transform: tab.imageScale ? `scale(${tab.imageScale})` : undefined,
                                transformOrigin: tab.imagePosition || 'center'
                            }" />
                    </div>
                    <div v-else
                        class="w-full h-full flex items-center justify-center bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-400 text-sm">
                        right side
                    </div>
                </slot>
            </div>
        </div>

        <!-- 底部信息区域 -->
        <div
            class="footer-area flex flex-col lg:flex-row items-start justify-between gap-4 p-6 h-[180px] border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <!-- 左侧：标题和描述 -->
            <div class="info-section flex-1">
                <h3 class="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {{ tab.title }}
                </h3>
                <p
                    class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {{ tab.description }}
                </p>
            </div>

            <!-- 右侧：按钮组（垂直排列） -->
            <div v-if="hasButtons"
                class="buttons-section flex flex-col gap-2 min-w-[140px]">
                <UButton v-if="tab.demoUrl" :to="tab.demoUrl" target="_blank"
                    variant="outline" color="neutral" block
                    icon="i-lucide-external-link">
                    Demo
                </UButton>
                <UButton v-if="tab.videoUrl" :to="tab.videoUrl" target="_blank"
                    variant="outline" color="neutral" block
                    icon="i-lucide-external-link">
                    Video
                </UButton>
                <UButton v-if="tab.docsUrl" :to="tab.docsUrl" variant="outline"
                    color="neutral" block icon="i-lucide-file-text">
                    Documents
                </UButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 翡翠云雾绿渐变背景底座 */
.gradient-base {
    background: linear-gradient(135deg,
            #26a69a 0%,
            #80cbc4 25%,
            #b2dfdb 50%,
            #e0f2f1 75%,
            #ffffff 100%);
}

.dark .gradient-base {
    background: linear-gradient(135deg,
            #00695c 0%,
            #00897b 25%,
            #26a69a 50%,
            #4db6ac 75%,
            #80cbc4 100%);
}

/* 图片包装器 - 在渐变底座上留出边距 */
.image-wrapper {
    position: absolute;
    inset: 16px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
