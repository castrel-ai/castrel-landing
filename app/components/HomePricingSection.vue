<script setup lang="ts">
import type { PricingPlanProps } from '@nuxt/ui'

const pricingCopy = usePricingCopy()
const { locale } = useSiteLocale()

type BillingCycle = 'monthly' | 'yearly'
const billingCycle = ref<BillingCycle>('monthly')

const pricingCtaUrl = computed(() =>
    locale.value === 'zh'
        ? `https://castrel-app.cloudwise.com?utm_source=castrel.ai&utm_medium=website&utm_campaign=zh_home_pricing_${billingCycle.value}`
        : `https://app.castrel.ai?utm_source=castrel.ai&utm_medium=website&utm_campaign=en_home_pricing_${billingCycle.value}`,
)

const proPrice = computed(() =>
    billingCycle.value === 'monthly' ? '¥100' : '¥1000',
)

const proBillingCycle = computed(() =>
    billingCycle.value === 'monthly'
        ? pricingCopy.value.planPro.billingMonthly
        : pricingCopy.value.planPro.billingYearly,
)

const yearlyDiscount = computed(() => pricingCopy.value.yearlyDiscount)
const enterprisePhone = computed(() =>
    locale.value === 'zh'
        ? '欢迎致电：400-666-1332'
        : 'Call us: 400-666-1332',
)

const pricingPlanUi = {
    title: 'text-xl font-semibold sm:text-2xl',
}

const openSalesModal = ref(false)

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
        price: locale.value === 'zh' ? '联系我们' : 'Contact us',
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

</script>

<template>
    <div v-if="locale === 'zh'">
        <div class="mt-5">
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
        </div>

        <div class="mt-5">
            <UPricingPlans :plans="plans" :class="'gap-x-6 gap-y-6 lg:gap-x-8'">
                <template #price="{ plan }">
                    <template v-if="plan.title === pricingCopy.planPro.title">
                        <Transition name="pro-price" mode="out-in">
                            <span :key="billingCycle" class="inline-block tabular-nums">
                                {{ proPrice }}
                            </span>
                        </Transition>
                    </template>
                    <template v-else>
                        {{ plan.price }}
                    </template>
                </template>
                <template #button="{ plan, ui }">
                    <div v-if="plan.title === pricingCopy.planEnterprise.title" class="relative w-full">
                        <UButton
                            v-if="plan.button"
                            v-bind="{ block: true, size: 'lg', ...plan.button }"
                            data-slot="button"
                            :class="ui.button({ class: plan.ui?.button })"
                            @click="plan.button?.onClick" />
                        <p
                            class="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-muted">
                            {{ enterprisePhone }}
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
        </div>

        <SalesLeadModal v-model:open="openSalesModal"
            :source-page-fallback="locale === 'zh' ? '/zh' : '/'"
            :locale-tag="locale === 'zh' ? 'zh-CN' : 'en-US'"
            id-prefix="home-pricing" />
    </div>
</template>

<style scoped>
.pro-price-enter-active,
.pro-price-leave-active {
    transition: transform 0.18s ease, opacity 0.18s ease;
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
