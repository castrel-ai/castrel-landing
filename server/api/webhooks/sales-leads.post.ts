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
    website?: string
}

interface RateLimitBucket {
    count: number
    resetAt: number
}

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 12
const SALES_WEBHOOK_TIMEOUT_MS = 5000

const rateLimitBuckets = (() => {
    const g = globalThis as typeof globalThis & {
        __salesLeadRateLimitBuckets?: Map<string, RateLimitBucket>
    }

    if (!g.__salesLeadRateLimitBuckets) {
        g.__salesLeadRateLimitBuckets = new Map<string, RateLimitBucket>()
    }

    return g.__salesLeadRateLimitBuckets
})()

const allowedOriginPatterns = [
    /^https:\/\/castrel\.ai$/i,
    /^https:\/\/www\.castrel\.ai$/i,
    /^https:\/\/castrel-landing-[a-z0-9-]+-castrel-ai\.vercel\.app$/i,
    /^http:\/\/localhost:\d+$/i,
    /^http:\/\/127\.0\.0\.1:\d+$/i,
]

function getClientIp(event: Parameters<typeof defineEventHandler>[0]) {
    const xff = getHeader(event, 'x-forwarded-for')
    if (xff) {
        return xff.split(',')[0].trim()
    }
    return event.node.req.socket.remoteAddress || 'unknown'
}

function checkRateLimit(key: string) {
    const now = Date.now()
    const existing = rateLimitBuckets.get(key)

    if (!existing || existing.resetAt <= now) {
        rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
        return true
    }

    if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false
    }

    existing.count += 1
    rateLimitBuckets.set(key, existing)
    return true
}

function isAllowedOrigin(origin: string | undefined | null) {
    if (!origin) {
        return process.env.NODE_ENV !== 'production'
    }

    try {
        const normalized = new URL(origin).origin
        return allowedOriginPatterns.some(pattern => pattern.test(normalized))
    } catch {
        return false
    }
}

function isValidPhone(phone: string): boolean {
    return /^[0-9+\-\s]{6,20}$/.test(phone.trim())
}

function hasInvalidLength(value: string | undefined, max: number) {
    return (value || '').trim().length > max
}

export default defineEventHandler(async (event) => {
    const origin = getHeader(event, 'origin') || getHeader(event, 'referer')
    if (!isAllowedOrigin(origin)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: '来源不受信任',
        })
    }

    const clientIp = getClientIp(event)
    if (!checkRateLimit(clientIp)) {
        throw createError({
            statusCode: 429,
            statusMessage: 'Too Many Requests',
            message: '请求过于频繁，请稍后重试',
        })
    }

    const body = await readBody<SalesLeadPayload>(event)
    if (!body?.phone || !body?.company) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: '缺少必填字段',
        })
    }

    // Honeypot field for naive bot submissions.
    if (body.website?.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: '请求无效',
        })
    }

    if (!isValidPhone(body.phone)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: '手机号格式不正确',
        })
    }

    if (
        hasInvalidLength(body.name, 80) ||
        hasInvalidLength(body.phone, 32) ||
        hasInvalidLength(body.company, 120) ||
        hasInvalidLength(body.workEmail, 120) ||
        hasInvalidLength(body.jobTitle, 80) ||
        hasInvalidLength(body.useCase, 1000)
    ) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: '字段长度超出限制',
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

    const bearerToken = process.env.FEISHU_SALES_BEARER_TOKEN?.trim()
    if (!bearerToken) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: '未配置 FEISHU_SALES_BEARER_TOKEN',
        })
    }

    try {
        await $fetch(webhookUrl, {
            method: 'POST',
            timeout: SALES_WEBHOOK_TIMEOUT_MS,
            retry: 0,
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
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
        console.error('Feishu sales webhook request failed', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
        })
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: '调用飞书 webhook 失败',
        })
    }
})
