<script setup lang="ts">
import type { PricingPlanProps } from '@nuxt/ui'

const pricingCopy = usePricingCopy()

definePageMeta({
    layout: 'default',
})

useSeoMeta({
    title: computed(() => pricingCopy.value.seoTitle),
    description: computed(() => pricingCopy.value.seoDescription),
})

type BillingCycle = 'monthly' | 'yearly'

const billingCycle = ref<BillingCycle>('monthly')
const pricingCtaUrl = computed(() =>
    `https://castrel-app.cloudwise.com?utm_source=castrel.ai&utm_medium=website&utm_campaign=zh_pricing_${billingCycle.value}`,
)
const proPrice = computed(() =>
    billingCycle.value === 'monthly'
        ? '¥100'
        : '¥1000',
)
const proBillingCycle = computed(() =>
    billingCycle.value === 'monthly'
        ? pricingCopy.value.planPro.billingMonthly
        : pricingCopy.value.planPro.billingYearly,
)
const yearlyDiscount = computed(() => pricingCopy.value.yearlyDiscount)
const pricingPlanUi = {
    title: 'text-xl font-semibold sm:text-2xl',
}

const plans = computed<PricingPlanProps[]>(() => [
    {
        title: pricingCopy.value.planFree.title,
        description: pricingCopy.value.planFree.description,
        price: '¥0',
        ui: pricingPlanUi,
        features: pricingCopy.value.planFree.features,
        button: {
            label: pricingCopy.value.planFree.button,
            to: pricingCtaUrl.value,
            target: '_blank',
            color: 'neutral',
            variant: 'outline',
        },
    },
    {
        title: pricingCopy.value.planPro.title,
        description: pricingCopy.value.planPro.description,
        price: proPrice.value,
        ui: pricingPlanUi,
        billingCycle: proBillingCycle.value,
        features: pricingCopy.value.planPro.features,
        button: {
            label: pricingCopy.value.planPro.button,
            to: pricingCtaUrl.value,
            target: '_blank',
        },
    },
    {
        title: pricingCopy.value.planEnterprise.title,
        description: pricingCopy.value.planEnterprise.description,
        price: '联系我们',
        ui: pricingPlanUi,
        features: pricingCopy.value.planEnterprise.features,
        button: {
            label: pricingCopy.value.planEnterprise.button,
            onClick: () => { openSalesModal.value = true },
            color: 'primary',
            variant: 'solid',
        },
    },
])

const faqItems = computed(() => [
    {
        question: pricingCopy.value.planPro.faqQuestion,
        answer: pricingCopy.value.faq.proBillingAnswer,
    },
    {
        question: pricingCopy.value.faq.pointsQuestion,
        answer: pricingCopy.value.faq.pointsAnswer,
    },
    {
        question: pricingCopy.value.faq.overseasQuestion,
        answer: pricingCopy.value.faq.overseasAnswer,
    },
    {
        question: pricingCopy.value.faq.enterpriseQuestion,
        answer: pricingCopy.value.faq.enterpriseAnswer,
    },
])

const openSalesModal = ref(false)
</script>

<template>
    <div class="pricing-scene relative overflow-hidden">
        <div class="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <section class="mx-auto max-w-4xl text-center">
                <h1
                    class="text-4xl font-black text-neutral-900 dark:text-white sm:text-5xl">
                    {{ pricingCopy.pageTitle }}
                </h1>
            </section>

            <section class="mt-5">
                <div
                    class="mx-auto flex w-fit items-center gap-2 rounded-full border border-default bg-default p-1 shadow-xs">
                    <button type="button"
                        class="rounded-full px-4 py-2 text-sm font-semibold transition"
                        :class="billingCycle === 'monthly'
                            ? 'bg-primary text-inverted'
                            : 'text-default hover:bg-elevated'"
                        @click="billingCycle = 'monthly'">
                        {{ pricingCopy.billingMonthly }}
                    </button>
                    <button type="button"
                        class="rounded-full px-4 py-2 text-sm font-semibold transition"
                        :class="billingCycle === 'yearly'
                            ? 'bg-primary text-inverted'
                            : 'text-primary font-bold hover:bg-elevated'"
                        @click="billingCycle = 'yearly'">
                        {{ pricingCopy.billingYearly }}（{{ yearlyDiscount }}）
                    </button>
                </div>
            </section>

            <section class="mt-5">
                <UPricingPlans :plans="plans"
                    :class="'gap-x-6 gap-y-6 lg:gap-x-8'">
                    <template #price="{ plan }">
                        <template v-if="plan.title === pricingCopy.planPro.title">
                            <Transition name="pro-price" mode="out-in">
                                <span :key="billingCycle"
                                    class="inline-block tabular-nums">
                                    {{ proPrice }}
                                </span>
                            </Transition>
                        </template>
                        <template v-else>
                            {{ plan.price }}
                        </template>
                    </template>
                    <template #button="{ plan, ui }">
                        <div
                            v-if="plan.title === pricingCopy.planEnterprise.title"
                            class="relative w-full">
                            <UButton
                                v-if="plan.button"
                                v-bind="{ block: true, size: 'lg', ...plan.button }"
                                data-slot="button"
                                :class="ui.button({ class: plan.ui?.button })"
                                @click="plan.button?.onClick" />
                            <p
                                class="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-muted">
                                欢迎致电：400-666-1332
                            </p>
                        </div>
                        <UButton
                            v-else-if="plan.button"
                            v-bind="{ block: true, size: 'lg', ...plan.button }"
                            data-slot="button"
                            :class="ui.button({ class: plan.ui?.button })"
                            @click="plan.button?.onClick" />
                    </template>
                </UPricingPlans>
            </section>

            <section class="mt-6">
                <div class="p-2 sm:p-3">
                    <h2
                        class="text-center text-2xl font-bold text-neutral-900 dark:text-white">
                        {{ pricingCopy.faqTitle }}
                    </h2>
                    <div class="mt-6">
                        <PricingFaq :items="faqItems" />
                    </div>
                </div>
            </section>

        </div>

        <SalesLeadModal v-model:open="openSalesModal"
            source-page-fallback="/zh/pricing" locale-tag="zh-CN"
            id-prefix="pricing" />
    </div>
</template>

<style scoped>
.pricing-scene {
    background: transparent;
}

.pro-price-enter-active,
.pro-price-leave-active {
    transition: transform 180ms ease, opacity 180ms ease;
}

.pro-price-enter-from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
}

.pro-price-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(1.04);
}
</style>
