<script setup lang="ts">
import { computed, ref } from 'vue'

type Locale = 'en' | 'zh'

const props = defineProps<{
    locale: Locale
}>()

const search = ref('')

const DOC_SLUG_BY_NAME: Record<string, string> = {
    'Prometheus': 'prometheus',
    'Elasticsearch': 'elasticsearch',
    'Grafana Loki': 'grafana-loki',
    'Grafana Tempo': 'grafana-tempo',
    'GitHub': 'github',
    'Slack': 'slack',
    'Vercel': 'vercel',
    'Graylog': 'graylog',
    'Datadog': 'datadog',
}

const INTEGRATIONS_BY_LOCALE: Record<Locale, string[]> = {
    en: [
        'Aliyun',
        'Ansible',
        'AWS',
        'ClickHouse',
        'Confluence',
        'Datadog',
        'Dify',
        'DingTalk',
        'Elasticsearch',
        'Feishu',
        'Freshworks',
        'GitHub',
        'GitLab',
        'Google Cloud',
        'Google Docs',
        'Grafana',
        'Graylog',
        'Huawei Cloud',
        'Jenkins',
        'Cloudwise JKB',
        'Kogia',
        'Kubernetes',
        'LDAP',
        'Linear',
        'Grafana Loki',
        'n8n',
        'New Relic',
        'Notion',
        'PagerDuty',
        'Prometheus',
        'Qingfan Cloud',
        'Riverbed',
        'Sentry',
        'Slack',
        'SolarWinds',
        'Telegram',
        'Grafana Tempo',
        'Tencent Cloud',
        'Terraform',
        'Cloudwise TSB',
        'Vercel',
        'VictoriaMetrics',
        'Volcengine',
        'WeChat',
        'Zabbix',
    ],
    zh: [
        '阿里云',
        'Ansible',
        'AWS',
        'ClickHouse',
        'Confluence',
        'Datadog',
        'Dify',
        '钉钉',
        'Elasticsearch',
        'Feishu',
        'Freshworks',
        'GitHub',
        'GitLab',
        'Google Cloud',
        'Google Docs',
        'Grafana',
        'Graylog',
        '华为云',
        'Jenkins',
        '监控宝',
        'Kogia',
        'Kubernetes',
        'LDAP',
        'Linear',
        'Grafana Loki',
        'n8n',
        'New Relic',
        'Notion',
        'PagerDuty',
        'Prometheus',
        '轻帆云',
        'Riverbed',
        'Sentry',
        'Slack',
        'SolarWinds',
        'Telegram',
        'Grafana Tempo',
        '腾讯云',
        'Terraform',
        '透视宝',
        'Vercel',
        'VictoriaMetrics',
        '火山引擎',
        '微信',
        'Zabbix',
    ],
}

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
    'Freshworks': 'https://api.iconify.design/logos/fresh.svg',
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
    'Qingfan Cloud': 'https://www.qingfanyun.com/static/img/index/nav_logo.png',
    '轻帆云': 'https://www.qingfanyun.com/static/img/index/nav_logo.png',
    'Riverbed': 'https://www.riverbed.com/riverbed-wp-content/themes/riverbed/favicon.ico',
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
    'Zabbix': 'https://api.iconify.design/logos/zabbix.svg',
}

const normalizedSearch = computed(() => search.value.trim().toLowerCase())

const integrations = computed(() =>
    INTEGRATIONS_BY_LOCALE[props.locale].map(name => ({
        name,
        slug: DOC_SLUG_BY_NAME[name],
        logo: INTEGRATION_LOGO_URLS[name] || null,
    }))
)

const filteredIntegrations = computed(() => {
    if (!normalizedSearch.value) {
        return integrations.value
    }

    return integrations.value.filter(item =>
        item.name.toLowerCase().includes(normalizedSearch.value)
    )
})

const inputPlaceholder = computed(() =>
    props.locale === 'zh' ? '搜索集成名称…' : 'Search integrations...'
)

const noResultText = computed(() =>
    props.locale === 'zh'
        ? '没有匹配的集成项。'
        : 'No integrations matched your search.'
)

const availableText = computed(() =>
    props.locale === 'zh' ? '查看集成详情' : 'Open integration docs'
)

const unavailableText = computed(() =>
    props.locale === 'zh' ? '文档尚未发布' : 'Documentation not available yet'
)

const getLink = (slug: string): string =>
    props.locale === 'zh'
        ? `/zh/docs/integrations/${slug}`
        : `/docs/integrations/${slug}`
</script>

<template>
    <div class="space-y-4">
        <div
            class="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <input
                v-model="search"
                type="search"
                :placeholder="inputPlaceholder"
                class="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-primary-500 dark:border-neutral-700 dark:text-neutral-100 dark:focus:border-primary-400" />
        </div>

        <div class="space-y-3">
            <template v-for="item in filteredIntegrations" :key="item.name">
                <NuxtLink
                    v-if="item.slug"
                    :to="getLink(item.slug)"
                    class="block no-underline">
                    <div
                        class="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-500 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-400">
                        <img
                            v-if="item.logo"
                            :src="item.logo"
                            :alt="item.name"
                            width="40"
                            height="40"
                            loading="lazy"
                            decoding="async"
                            class="size-10 shrink-0 object-contain" />
                        <UIcon
                            v-else
                            name="i-lucide-plug"
                            class="size-10 shrink-0 text-neutral-700 dark:text-neutral-300" />

                        <div class="min-w-0 flex-1">
                            <p class="truncate text-base font-medium text-neutral-900 dark:text-neutral-100">
                                {{ item.name }}
                            </p>
                            <p class="text-sm text-neutral-500 dark:text-neutral-400">
                                {{ availableText }}
                            </p>
                        </div>

                        <UIcon
                            name="i-lucide-arrow-up-right"
                            class="size-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
                    </div>
                </NuxtLink>

                <div v-else class="block no-underline">
                    <div
                        class="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-500 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-400">
                        <img
                            v-if="item.logo"
                            :src="item.logo"
                            :alt="item.name"
                            width="40"
                            height="40"
                            loading="lazy"
                            decoding="async"
                            class="size-10 shrink-0 object-contain" />
                        <UIcon
                            v-else
                            name="i-lucide-plug"
                            class="size-10 shrink-0 text-neutral-700 dark:text-neutral-300" />

                        <div class="min-w-0 flex-1">
                            <p class="truncate text-base font-medium text-neutral-900 dark:text-neutral-100">
                                {{ item.name }}
                            </p>
                            <p class="text-sm text-neutral-500 dark:text-neutral-400">
                                {{ unavailableText }}
                            </p>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <p
            v-if="filteredIntegrations.length === 0"
            class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ noResultText }}
        </p>
    </div>
</template>
