<script setup lang="ts">
const trialUrl = 'https://castrel-app.cloudwise.com?utm_source=castrel.ai&utm_medium=website&utm_campaign=zh_home'
const openSalesModal = ref(false)
const isMobile = ref(false)
let mobileMediaQuery: MediaQueryList | null = null

function syncMobileState() {
    isMobile.value = !!mobileMediaQuery?.matches
}

onMounted(() => {
    if (!import.meta.client) {
        return
    }

    mobileMediaQuery = window.matchMedia('(max-width: 767px)')
    syncMobileState()
    if (mobileMediaQuery.addEventListener) {
        mobileMediaQuery.addEventListener('change', syncMobileState)
        return
    }
    mobileMediaQuery.addListener(syncMobileState)
})

onBeforeUnmount(() => {
    if (!mobileMediaQuery) {
        return
    }

    if (mobileMediaQuery.removeEventListener) {
        mobileMediaQuery.removeEventListener('change', syncMobileState)
        return
    }
    mobileMediaQuery.removeListener(syncMobileState)
})

function handleFreeTrialClick() {
    if (isMobile.value) {
        openSalesModal.value = true
        return
    }

    window.open(trialUrl, '_blank', 'noopener,noreferrer')
}
</script>

<template>
    <UButton color="neutral" size="xl" trailing-icon="i-lucide-arrow-right"
        label="免费试用" @click="handleFreeTrialClick" />

    <SalesLeadModal v-model:open="openSalesModal" source-page-fallback="/zh"
        locale-tag="zh-CN" id-prefix="zh-home-hero"
        :trial-url="trialUrl" />
</template>
