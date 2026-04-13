<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<{
    sourcePageFallback?: string
    localeTag?: string
    idPrefix?: string
}>(), {
    sourcePageFallback: '/zh/pricing',
    localeTag: 'zh-CN',
    idPrefix: 'sales',
})

const pricingCopy = usePricingCopy()

const salesForm = reactive({
    name: '',
    phone: '',
    company: '',
    workEmail: '',
    jobTitle: '',
    useCase: '',
})
const submitError = ref('')
const submitting = ref(false)
const phonePrefix = '+86'

watch(open, (isOpen) => {
    if (isOpen) {
        submitError.value = ''
    }
})

function isValidPhone(phone: string): boolean {
    return /^\d{11}$/.test(phone.trim())
}

async function submitSalesInquiry() {
    submitError.value = ''

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
                phone: `${phonePrefix}${salesForm.phone.trim()}`,
                company: salesForm.company.trim(),
                workEmail: salesForm.workEmail.trim(),
                jobTitle: salesForm.jobTitle.trim(),
                useCase: salesForm.useCase.trim(),
                sourcePage: import.meta.client ? window.location.href : props.sourcePageFallback,
                locale: props.localeTag,
                submittedAt: new Date().toISOString(),
            },
        })

        salesForm.name = ''
        salesForm.phone = ''
        salesForm.company = ''
        salesForm.workEmail = ''
        salesForm.jobTitle = ''
        salesForm.useCase = ''
        open.value = false
    } catch (error: any) {
        submitError.value = error?.data?.message || pricingCopy.value.salesModal.submitError
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <UModal v-model:open="open" :ui="{
            content: 'sm:max-w-2xl rounded-2xl border border-default/70 bg-default shadow-xl',
            header: 'hidden',
            body: 'pt-4',
            footer: 'pt-2',
        }">
        <template #body>
            <form class="space-y-5" autocomplete="off" @submit.prevent="submitSalesInquiry">
                <div>
                    <label :for="`${idPrefix}-name`"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.name }}</label>
                    <input :id="`${idPrefix}-name`" v-model="salesForm.name"
                        name="contact_name" type="text" autocomplete="off"
                        data-1p-ignore="true" data-lpignore="true"
                        :placeholder="pricingCopy.salesModal.namePlaceholder"
                        class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                </div>

                <div>
                    <label :for="`${idPrefix}-phone`"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.phone }} <span class="text-rose-500">*</span></label>
                    <div
                        class="flex h-11 w-full overflow-hidden rounded-lg border border-default bg-muted/25 transition focus-within:border-primary focus-within:bg-default focus-within:ring-2 focus-within:ring-primary/20">
                        <span
                            class="inline-flex items-center border-r border-default px-3 text-sm text-muted">
                            {{ phonePrefix }}
                        </span>
                        <input :id="`${idPrefix}-phone`" v-model="salesForm.phone"
                            name="phone" type="tel" autocomplete="tel" required
                            inputmode="numeric" pattern="[0-9]{11}" maxlength="11"
                            :placeholder="pricingCopy.salesModal.phonePlaceholder"
                            class="h-full w-full border-0 bg-transparent px-3 text-sm text-default outline-none ring-0">
                    </div>
                </div>

                <div>
                    <label :for="`${idPrefix}-company`"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.company }} <span class="text-rose-500">*</span></label>
                    <input :id="`${idPrefix}-company`" v-model="salesForm.company"
                        name="company_name" type="text" autocomplete="off" required
                        data-1p-ignore="true" data-lpignore="true"
                        :placeholder="pricingCopy.salesModal.companyPlaceholder"
                        class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                </div>

                <div>
                    <label :for="`${idPrefix}-work-email`"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.workEmail }}</label>
                    <input :id="`${idPrefix}-work-email`" v-model="salesForm.workEmail"
                        name="work_email" type="email" autocomplete="off"
                        data-1p-ignore="true" data-lpignore="true"
                        :placeholder="pricingCopy.salesModal.workEmailPlaceholder"
                        class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                </div>

                <div>
                    <label :for="`${idPrefix}-job-title`"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.jobTitle }}</label>
                    <input :id="`${idPrefix}-job-title`" v-model="salesForm.jobTitle"
                        name="job_title" type="text" autocomplete="off"
                        data-1p-ignore="true" data-lpignore="true"
                        :placeholder="pricingCopy.salesModal.jobTitlePlaceholder"
                        class="h-11 w-full rounded-lg border border-default bg-muted/25 px-3 text-sm text-default outline-none ring-primary/20 transition focus:border-primary focus:bg-default focus:ring-2">
                </div>

                <div>
                    <label :for="`${idPrefix}-use-case`"
                        class="mb-2 block text-xs font-semibold tracking-wide text-muted">{{
                            pricingCopy.salesModal.useCase }}</label>
                    <textarea :id="`${idPrefix}-use-case`" v-model="salesForm.useCase"
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
</template>
