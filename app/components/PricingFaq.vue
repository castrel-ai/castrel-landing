<script setup lang="ts">
    import { ref } from 'vue'

    interface PricingFaqItem {
        question: string
        answer: string
    }

    defineProps<{
        items: PricingFaqItem[]
    }>()

    const activeIndex = ref<number | null>(null)

    function toggleItem(index: number) {
        activeIndex.value = activeIndex.value === index ? null : index
    }
</script>

<template>
    <div class="space-y-3">
        <div
            v-for="(item, index) in items"
            :key="item.question"
            class="rounded-xl border bg-default p-4 transition"
            :class="activeIndex === index
                ? 'border-primary/40'
                : 'border-default'"
        >
            <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between gap-3 text-left text-sm font-semibold text-highlighted"
                :aria-expanded="activeIndex === index"
                @click="toggleItem(index)"
            >
                <span>{{ item.question }}</span>
                <span
                    class="text-primary transition-transform duration-200"
                    :class="activeIndex === index ? 'rotate-45' : ''"
                >+</span>
            </button>
            <div
                class="grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out"
                :class="activeIndex === index ? 'mt-3 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'"
            >
                <p class="min-h-0 overflow-hidden text-sm leading-6 text-muted">
                    {{ item.answer }}
                </p>
            </div>
        </div>
    </div>
</template>
