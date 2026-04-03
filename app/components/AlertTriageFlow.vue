<script setup lang="ts">
    import { computed } from 'vue'

    const { locale } = useSiteLocale()

    const description = computed(() => {
        if (locale.value === 'zh') {
            return 'Castrel 接入你的告警通道后，会自动完成告警分诊，压低噪音，并把真正关键的事故优先浮出来。'
        }

        return 'Castrel connects to your alerting channels and automatically triages alerts, reducing noise and surfacing critical incidents.'
    })
</script>

<template>
    <div
        class="alert-triage-flow w-full h-full flex flex-col items-center justify-center gap-6 p-6">
        <!-- Logo 区域 -->
        <div class="flex items-center justify-center gap-8">
            <div class="flex flex-col items-center gap-2">
                <div
                    class="w-16 h-16 rounded-xl bg-[#E6522C] flex items-center justify-center">
                    <UIcon name="i-simple-icons-prometheus"
                        class="w-10 h-10 text-white" />
                </div>
                <span class="text-sm text-gray-500">Prometheus</span>
            </div>

            <UIcon name="i-lucide-plus" class="w-6 h-6 text-gray-400" />

            <div class="flex flex-col items-center gap-2">
                <div
                    class="w-16 h-16 rounded-xl bg-[#4A154B] flex items-center justify-center">
                    <UIcon name="i-simple-icons-slack" class="w-10 h-10 text-white" />
                </div>
                <span class="text-sm text-gray-500">Slack</span>
            </div>

            <UIcon name="i-lucide-arrow-right" class="w-6 h-6 text-gray-400" />

            <div class="flex flex-col items-center gap-2">
                <div
                    class="w-16 h-16 rounded-xl bg-primary-500 flex items-center justify-center">
                    <UIcon name="i-lucide-bot" class="w-10 h-10 text-white" />
                </div>
                <span class="text-sm text-gray-500">Castrel</span>
            </div>
        </div>

        <!-- 说明文字 -->
        <p class="text-center text-gray-600 dark:text-gray-400 max-w-md">
            {{ description }}
        </p>
    </div>
</template>

<style scoped>
.alert-triage-flow {
    max-height: 352px;
}
</style>
