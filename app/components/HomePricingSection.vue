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
            color: 'neutral',
            variant: 'outline',
        },
    },
])

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
                sourcePage: import.meta.client ? window.location.href : (locale.value === 'zh' ? '/zh' : '/'),
                locale: locale.value === 'zh' ? 'zh-CN' : 'en-US',
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

    <UModal v-model:open="openSalesModal" :ui="{
            content: 'sm:max-w-2xl rounded-2xl border border-default/70 bg-default shadow-xl',
            header: 'hidden',
            body: 'pt-4',
            footer: 'pt-2',
        }">
        <template #body>
            <form class="space-y-5" autocomplete="off" @submit.prevent="submitSalesInquiry">
                <div>
                    <label for="home-pricing-name"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.name }}</label>
                    <input id="home-pricing-name" v-model="salesForm.name"
                        name="contact_name" type="text" autocomplete="off"
                        data-1p-ignore="true" data-lpignore="true"
                        :placeholder="pricingCopy.salesModal.namePlaceholder"
                        class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                </div>

                <div>
                    <label for="home-pricing-phone"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.phone }} <span class="text-rose-500">*</span></label>
                    <input id="home-pricing-phone" v-model="salesForm.phone" name="phone"
                        type="tel" autocomplete="tel" required
                        :placeholder="pricingCopy.salesModal.phonePlaceholder"
                        class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                </div>

                <div>
                    <label for="home-pricing-company"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.company }} <span class="text-rose-500">*</span></label>
                    <input id="home-pricing-company" v-model="salesForm.company"
                        name="company" type="text" autocomplete="organization" required
                        :placeholder="pricingCopy.salesModal.companyPlaceholder"
                        class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label for="home-pricing-work-email"
                            class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                                pricingCopy.salesModal.workEmail }}</label>
                        <input id="home-pricing-work-email" v-model="salesForm.workEmail"
                            name="work_email" type="email" autocomplete="email"
                            :placeholder="pricingCopy.salesModal.workEmailPlaceholder"
                            class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                    </div>

                    <div>
                        <label for="home-pricing-job-title"
                            class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                                pricingCopy.salesModal.jobTitle }}</label>
                        <input id="home-pricing-job-title" v-model="salesForm.jobTitle"
                            name="job_title" type="text" autocomplete="organization-title"
                            :placeholder="pricingCopy.salesModal.jobTitlePlaceholder"
                            class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                    </div>
                </div>

                <div>
                    <label for="home-pricing-use-case"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.useCase }}</label>
                    <textarea id="home-pricing-use-case" v-model="salesForm.useCase"
                        name="use_case" rows="3"
                        :placeholder="pricingCopy.salesModal.useCasePlaceholder"
                        class="w-full rounded-lg border border-default bg-muted/25 px-3 py-2 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2" />
                </div>

                <p v-if="submitError" class="text-sm text-rose-500">
                    {{ submitError }}
                </p>
                <p v-if="submitSuccess" class="text-sm text-emerald-600">
                    Success.
                </p>

                <div class="flex justify-end">
                    <UButton type="submit" :loading="submitting" :disabled="submitting"
                        :label="pricingCopy.salesModal.submit" />
                </div>
            </form>
        </template>
    </UModal>
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
