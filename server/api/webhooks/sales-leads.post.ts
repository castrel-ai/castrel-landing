interface SalesLeadPayload {
    name?: string
    phone: string
    company: string
    workEmail?: string
    jobTitle?: string
    useCase?: string
    sourcePage?: string
    locale?: string
    submittedAt?: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody<SalesLeadPayload>(event)
    if (!body?.phone || !body?.company) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: '缺少必填字段',
        })
    }

    const webhookUrl = process.env.FEISHU_SALES_WEBHOOK_URL
    if (!webhookUrl) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: '未配置 FEISHU_SALES_WEBHOOK_URL',
        })
    }

    try {
        await $fetch(webhookUrl, {
            method: 'POST',
            body: {
                name: body.name || '',
                phone: body.phone,
                company: body.company,
                companyName: body.company,
                workEmail: body.workEmail || '',
                jobTitle: body.jobTitle || '',
                useCase: body.useCase || '',
                sourcePage: body.sourcePage || '/zh/pricing',
                locale: body.locale || 'zh-CN',
                submittedAt: body.submittedAt || new Date().toISOString(),
            },
        })

        return { ok: true }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error?.message || '调用飞书 webhook 失败',
        })
    }
})
