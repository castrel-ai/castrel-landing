<script setup lang="ts">
    import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

    interface Integration {
        name: string
        icon: string
        to?: string
    }

    const props = defineProps<{
        integrations: Integration[]
    }>()

    const INTEGRATION_LOGO_URLS: Record<string, string> = {
        'Aliyun': 'https://cdn.simpleicons.org/alibabacloud/FF6A00',
        '阿里云': 'https://cdn.simpleicons.org/alibabacloud/FF6A00',
        'Ansible': 'https://api.iconify.design/logos/ansible.svg',
        'AWS': 'https://api.iconify.design/logos/aws.svg',
        'ClickHouse': 'https://cdn.simpleicons.org/clickhouse/FFCC01',
        'Confluence': 'https://api.iconify.design/logos/confluence.svg',
        'Datadog': 'https://api.iconify.design/logos/datadog-icon.svg',
        'Dify': 'https://cdn.simpleicons.org/dify',
        'DingTalk': 'https://api.iconify.design/ant-design/dingtalk.svg?color=%231677FF',
        '钉钉': 'https://api.iconify.design/ant-design/dingtalk.svg?color=%231677FF',
        'Elasticsearch': 'https://api.iconify.design/logos/elasticsearch.svg',
        'Feishu': '/images/integrations/feishu-84a9.png',
        '飞书': '/images/integrations/feishu-84a9.png',
        'Freshworks': '/images/integrations/freshworks.svg',
        'GitHub': 'https://api.iconify.design/logos/github-icon.svg',
        'GitLab': 'https://cdn.simpleicons.org/gitlab/FC6D26',
        'Google Cloud': 'https://api.iconify.design/logos/google-cloud.svg',
        'Google Docs': 'https://api.iconify.design/logos/google-icon.svg',
        'Grafana': 'https://api.iconify.design/logos/grafana.svg',
        'Graylog': '/images/integrations/graylog-attachment.svg',
        'Huawei Cloud': 'https://cdn.simpleicons.org/huawei/D81E06',
        '华为云': 'https://cdn.simpleicons.org/huawei/D81E06',
        'Cloudwise JKB': '/images/integrations/cloudwise-purple.svg',
        '监控宝': '/images/integrations/cloudwise-purple.svg',
        'Jenkins': 'https://api.iconify.design/logos/jenkins.svg',
        'Kubernetes': 'https://api.iconify.design/logos/kubernetes.svg',
        'Kogia': '/images/integrations/kogia.svg',
        'LDAP': '/images/integrations/ldap-attachment1.svg',
        'Linear': 'https://cdn.simpleicons.org/linear/5E6AD2',
        'Grafana Loki': '/images/integrations/grafana-loki.svg',
        'n8n': 'https://cdn.simpleicons.org/n8n/EA4B71',
        'New Relic': 'https://api.iconify.design/logos/new-relic-icon.svg',
        'Notion': 'https://api.iconify.design/logos/notion-icon.svg',
        'PagerDuty': 'https://api.iconify.design/logos/pagerduty-icon.svg',
        'Prometheus': 'https://api.iconify.design/logos/prometheus.svg',
        'Sentry': '/images/integrations/sentry-glyph.svg',
        'Slack': 'https://api.iconify.design/logos/slack-icon.svg',
        'SolarWinds': 'https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_56d5d9c06838826bab60f7c98d0c16c6/solarwinds-worldwide-llc-solarwinds-observability.png',
        'Telegram': 'https://api.iconify.design/logos/telegram.svg',
        'Grafana Tempo': '/images/integrations/grafana-tempo.svg',
        'Tencent Cloud': '/images/integrations/tencent-cloud-icon.png',
        '腾讯云': '/images/integrations/tencent-cloud-icon.png',
        'Terraform': 'https://api.iconify.design/logos/terraform-icon.svg',
        'Cloudwise TSB': '/images/integrations/cloudwise-purple.svg',
        '透视宝': '/images/integrations/cloudwise-purple.svg',
        'Vercel': 'https://api.iconify.design/logos/vercel-icon.svg',
        'VictoriaMetrics': 'https://cdn.simpleicons.org/victoriametrics',
        'Volcengine': '/images/integrations/volcengine-favicon.png',
        '火山引擎': '/images/integrations/volcengine-favicon.png',
        '微信': 'https://cdn.simpleicons.org/wechat',
        'WeChat': 'https://cdn.simpleicons.org/wechat',
        'Riverbed': 'https://www.riverbed.com/riverbed-wp-content/themes/riverbed/favicon.ico',
        'Zabbix': 'https://api.iconify.design/logos/zabbix.svg',
        'Qingfan Cloud': 'https://www.qingfanyun.com/static/img/index/nav_logo.png',
        '轻帆云': 'https://www.qingfanyun.com/static/img/index/nav_logo.png',
    }

    const failedLogoNames = reactive(new Set<string>())

    interface VisibleCard {
        slot: number
        item: Integration
        renderKey: number
    }

    const SWAP_INTERVAL_MS = 3200

    const columns = ref(7)
    const visibleCards = ref<VisibleCard[]>([])
    let swapTimer: ReturnType<typeof setInterval> | null = null

    const visibleCount = computed(() => columns.value * 3)

    const randomInt = (max: number): number => Math.floor(Math.random() * max)

    const integrationId = (item: Integration): string =>
        `${item.name}|${item.icon}|${item.to || ''}`

    const getLogoUrl = (item: Integration): string | null => {
        if (failedLogoNames.has(item.name)) {
            return null
        }
        return INTEGRATION_LOGO_URLS[item.name] || null
    }

    const markLogoFailed = (name: string): void => {
        failedLogoNames.add(name)
    }

    const updateColumns = (): void => {
        if (window.innerWidth < 768) {
            columns.value = 3
            return
        }
        if (window.innerWidth < 1024) {
            columns.value = 5
            return
        }
        columns.value = 7
    }

    const pickUniqueItems = (count: number): Integration[] => {
        if (props.integrations.length <= count) {
            return [...props.integrations]
        }

        const pool = [...props.integrations]
        const selected: Integration[] = []
        while (selected.length < count && pool.length > 0) {
            const idx = randomInt(pool.length)
            selected.push(pool[idx]!)
            pool.splice(idx, 1)
        }
        return selected
    }

    const initVisibleCards = (): void => {
        const picked = pickUniqueItems(visibleCount.value)
        visibleCards.value = picked.map((item, slot) => ({
            slot,
            item,
            renderKey: 0,
        }))
    }

    const replaceCardItem = (slot: number): void => {
        const card = visibleCards.value[slot]
        if (!card) {
            return
        }

        const excludedIds = new Set(
            visibleCards.value
                .filter(item => item.slot !== slot)
                .map(item => integrationId(item.item))
        )

        let candidates = props.integrations.filter(
            item => !excludedIds.has(integrationId(item))
        )

        if (candidates.length === 0) {
            candidates = props.integrations
        }

        if (candidates.length === 0) {
            return
        }

        const nextItem = candidates[randomInt(candidates.length)]!
        visibleCards.value[slot] = {
            ...card,
            item: nextItem,
        }
    }

    const swapSlot = (slot: number): void => {
        const card = visibleCards.value[slot]
        if (!card) {
            return
        }

        replaceCardItem(slot)
        const updated = visibleCards.value[slot]
        if (!updated) {
            return
        }
        visibleCards.value[slot] = {
            ...updated,
            renderKey: updated.renderKey + 1,
        }
    }

    const swapRandomCards = (): void => {
        if (visibleCards.value.length === 0) {
            return
        }

        const swapCount = Math.random() < 0.4 ? 2 : 1
        const chosen = new Set<number>()
        while (
            chosen.size < swapCount &&
            chosen.size < visibleCards.value.length
        ) {
            chosen.add(randomInt(visibleCards.value.length))
        }

        for (const slot of chosen) {
            swapSlot(slot)
        }
    }

    const startSwapLoop = (): void => {
        if (swapTimer) {
            clearInterval(swapTimer)
        }
        swapTimer = setInterval(swapRandomCards, SWAP_INTERVAL_MS)
    }

    const stopSwapLoop = (): void => {
        if (swapTimer) {
            clearInterval(swapTimer)
            swapTimer = null
        }
    }

    onMounted(() => {
        updateColumns()
        initVisibleCards()
        startSwapLoop()
        window.addEventListener('resize', updateColumns)
    })

    onBeforeUnmount(() => {
        stopSwapLoop()
        window.removeEventListener('resize', updateColumns)
    })

    watch(
        () => [props.integrations, visibleCount.value],
        () => {
            initVisibleCards()
        }
    )
</script>

<template>
    <div class="w-full grid gap-4"
        :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
        <div v-for="card in visibleCards" :key="card.slot" class="integration-cell">
            <Transition name="card-swap" mode="out-in">
                <div
                    :key="`${card.slot}-${card.renderKey}`"
                    class="integration-card no-underline cursor-default">
                    <div
                        class="flex h-full flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-500 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-400">
                        <img v-if="getLogoUrl(card.item)"
                            :src="getLogoUrl(card.item) || ''" :alt="card.item.name"
                            width="40" height="40" loading="lazy" decoding="async"
                            class="size-10 object-contain"
                            @error="markLogoFailed(card.item.name)" />
                        <UIcon v-else-if="card.item.icon.startsWith('i-')"
                            :name="card.item.icon"
                            class="size-10 text-neutral-700 dark:text-neutral-300" />
                        <img v-else :src="card.item.icon" :alt="card.item.name"
                            width="40" height="40" loading="lazy" decoding="async"
                            class="size-10 object-contain" />
                        <span
                            class="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
                            {{ card.item.name }}
                        </span>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
    .integration-cell {
        min-height: 124px;
    }

    .integration-card {
        display: block;
        height: 100%;
        will-change: opacity, transform;
    }

    .card-swap-enter-active {
        transition:
            opacity 220ms ease-out,
            transform 220ms ease-out;
    }

    .card-swap-leave-active {
        transition:
            opacity 180ms ease-in,
            transform 180ms ease-in;
    }

    .card-swap-enter-from {
        opacity: 0;
        transform: translateY(6px) scale(0.985);
    }

    .card-swap-leave-to {
        opacity: 0;
        transform: translateY(-4px) scale(0.99);
    }

    .card-swap-enter-to,
    .card-swap-leave-from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    @media (prefers-reduced-motion: reduce) {
        .card-swap-enter-active,
        .card-swap-leave-active {
            transition: none;
        }
    }
</style>
