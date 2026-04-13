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
            color: 'neutral',
            variant: 'outline',
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

const salesForm = reactive({
    name: '',
    phone: '',
    company: '',
    workEmail: '',
    jobTitle: '',
    useCase: '',
})
const submitError = ref('')
const submitSuccess = ref(false)
const submitting = ref(false)
const openSalesModal = ref(false)

function isValidPhone(phone: string): boolean {
    return /^[0-9+\-\s]{6,20}$/.test(phone.trim())
}

async function submitSalesInquiry() {
    submitError.value = ''
    submitSuccess.value = false

    if (!salesForm.phone.trim() || !salesForm.company.trim()) {
        submitError.value = pricingCopy.value.salesModal.requiredError
        return
    }

    if (!isValidPhone(salesForm.phone)) {
        submitError.value = pricingCopy.value.salesModal.invalidPhoneError
        return
    }

    submitting.value = true
    try {
        await $fetch('/api/webhooks/sales-leads', {
            method: 'POST',
            body: {
                name: salesForm.name.trim(),
                phone: salesForm.phone.trim(),
                company: salesForm.company.trim(),
                workEmail: salesForm.workEmail.trim(),
                jobTitle: salesForm.jobTitle.trim(),
                useCase: salesForm.useCase.trim(),
                sourcePage: import.meta.client ? window.location.href : '/zh/pricing',
                locale: 'zh-CN',
                submittedAt: new Date().toISOString(),
            },
        })

        submitSuccess.value = true
        salesForm.name = ''
        salesForm.phone = ''
        salesForm.company = ''
        salesForm.workEmail = ''
        salesForm.jobTitle = ''
        salesForm.useCase = ''
        openSalesModal.value = false
    } catch (error: any) {
        submitError.value = error?.data?.message || pricingCopy.value.salesModal.submitError
    } finally {
        submitting.value = false
    }
}
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

        <UModal v-model:open="openSalesModal" :ui="{
                content: 'sm:max-w-2xl rounded-2xl border border-default/70 bg-default shadow-xl',
                header: 'hidden',
                body: 'pt-4',
                footer: 'pt-2',
            }">
            <template #body>
                <form class="space-y-5" autocomplete="off"
                    @submit.prevent="submitSalesInquiry">
                    <div>
                        <label for="name"
                            class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.name }}</label>
                        <input id="name" v-model="salesForm.name"
                            name="contact_name" type="text" autocomplete="off"
                            data-1p-ignore="true" data-lpignore="true"
                            :placeholder="pricingCopy.salesModal.namePlaceholder"
                            class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                    </div>

                    <div>
                        <label for="phone"
                            class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.phone }} <span
                                class="text-rose-500">*</span></label>
                        <input id="phone" v-model="salesForm.phone" name="phone"
                            type="tel" autocomplete="tel" required
                            :placeholder="pricingCopy.salesModal.phonePlaceholder"
                            class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                    </div>

                    <div>
                        <label for="company"
                            class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.company }} <span
                                class="text-rose-500">*</span></label>
                        <input id="company" v-model="salesForm.company"
                            name="company_name" type="text" autocomplete="off"
                            required data-1p-ignore="true" data-lpignore="true"
                            :placeholder="pricingCopy.salesModal.companyPlaceholder"
                            class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                    </div>

                    <div>
                        <label for="workEmail"
                            class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                                pricingCopy.salesModal.workEmail }}</label>
                        <input id="workEmail" v-model="salesForm.workEmail"
                            name="work_email" type="email" autocomplete="off"
                            data-1p-ignore="true" data-lpignore="true"
                            :placeholder="pricingCopy.salesModal.workEmailPlaceholder"
                            class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                    </div>

                    <div>
                        <label for="jobTitle"
                            class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.jobTitle }}</label>
                        <input id="jobTitle" v-model="salesForm.jobTitle"
                            name="job_title" type="text" autocomplete="off"
                            data-1p-ignore="true" data-lpignore="true"
                            :placeholder="pricingCopy.salesModal.jobTitlePlaceholder"
                            class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                    </div>

                    <div>
                        <label for="useCase"
                            class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.useCase }}</label>
                        <textarea id="useCase" v-model="salesForm.useCase"
                            name="use_case" rows="4" autocomplete="off"
                            data-1p-ignore="true" data-lpignore="true"
                            :placeholder="pricingCopy.salesModal.useCasePlaceholder"
                            class="w-full rounded-lg border border-default bg-muted/25 px-3 py-2.5 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2" />
                    </div>

                    <p v-if="submitError" class="text-sm text-rose-400">
                        {{ submitError }}
                    </p>
                    <div class="border-t border-default/70 pt-4">
                        <UButton type="submit" color="primary"
                            class="w-full justify-center rounded-lg"
                            :loading="submitting" :disabled="submitting"
                            :label="pricingCopy.salesModal.submit" />
                    </div>
                </form>
            </template>
        </UModal>
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
