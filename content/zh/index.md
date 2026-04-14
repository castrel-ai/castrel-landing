---
seo:
  title: Castrel - AI SRE 智能体
  description: Castrel 是一名可靠且安全的 AI SRE 智能体，帮助你完成事故排查、告警分诊、自动化运维等工作。
---

::u-page-hero
---
orientation: horizontal
ui:
  container: "flex flex-col lg:grid py-12 sm:py-16 lg:py-20 gap-16 sm:gap-y-24"
---

#title
Hands off,<br/>Always on

#description
Castrel 是一名可靠且安全的 AI SRE 智能体，帮助你完成事故排查、告警分诊、自动化运维等工作。

#footer
:::div{.flex .flex-col .gap-6}
::::div{.flex .flex-wrap .gap-x-6 .gap-y-3}
:zh-hero-free-trial-cta
:u-button{color="neutral" size="xl" to="/zh/docs/getting-started/introduction" icon="i-lucide-book" variant="ghost"}[查看文档]
::::
:::

#default
:::hero-illustration
:::


::

::u-container{class="py-12 lg:py-16"}
<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=116333870125372&bvid=BV1TPXfBgEuD&cid=37170906802&p=1" title="Castrel Bilibili 视频" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="aspect-ratio: 16/9; width: 100%; border-radius: 12px;"></iframe>
::

::product-features
---
tabs:
  - label: 告警分诊
    icon: i-lucide-bell
    title: 告警分诊
    description: 自动将告警分类为误报、潜在风险或真实事故，并结合指标、日志与变更上下文给出可操作结论。
    rightImage: /images/alert-triage.png
    imagePosition: top left
    imageScale: 1.1
    docsUrl: /zh/docs/getting-started/introduction
    demoUrl: https://app.castrel.ai/shared/655b7313-efdd-45e4-89ab-d34bc8c4491d
  - label: 事故调查
    icon: i-lucide-bug
    title: 事故调查
    description: 与 AI 协作定位根因。你提供业务线索，Castrel 负责构造假设、收集证据并给出透明的排查链路。
    fullWidthImage: /images/incident-investigation.jpg
    imagePosition: top center
    demoUrl: https://app.castrel.ai/shared/d8ca3664-1f7d-4fbd-b4fc-11c771d469df
    docsUrl: /zh/docs/getting-started/introduction
  - label: 运维任务
    icon: i-lucide-terminal
    title: 运维任务
    description: Castrel 能基于 runbook 规划并执行部署、巡检和基础设施变更。
    rightImage: /images/task-execution.png
    imagePosition: top left
    imageScale: 1.1
    demoUrl: https://app.castrel.ai/shared/d423fb79-2e50-4d3d-8d9e-963780ca5ba5
    docsUrl: /zh/docs/getting-started/introduction
  - label: 部署验证
    icon: i-lucide-shield-check
    title: 部署验证
    description: 在变更前后自动关联指标、日志和链路，尽早发现异常并帮助你安全放量。
    rightImage: /images/deployment-verification.jpg
    imagePosition: top left
    imageScale: 1.1
    demoUrl: https://app.castrel.ai/shared/634a839b-d664-4384-adf6-e7f4033ceec8
---

#tab-0-left
:::alert-triage-flow
:::

#tab-2-left
:::operation-task-flow
:::

#tab-3-left
:::deployment-verification-flow
:::
::

::u-page-section
#title
无缝接入现有技术栈

#description
与主流可观测性、云平台和工程工具原生集成。

#default
  :::integration-grid
  ---
  integrations:
    - name: 阿里云
      icon: i-simple-icons-alibabacloud
    - name: Ansible
      icon: i-simple-icons-ansible
    - name: AWS
      icon: i-simple-icons-amazonwebservices
    - name: ClickHouse
      icon: i-simple-icons-clickhouse
    - name: Confluence
      icon: i-simple-icons-confluence
    - name: Datadog
      icon: i-simple-icons-datadog
      to: /zh/docs/integrations/datadog
    - name: Dify
      icon: i-lucide-plug
    - name: 钉钉
      icon: i-lucide-plug
    - name: Elasticsearch
      icon: i-simple-icons-elasticsearch
      to: /zh/docs/integrations/elasticsearch
    - name: Feishu
      icon: i-lucide-plug
    - name: Freshworks
      icon: i-lucide-plug
    - name: GitHub
      icon: i-simple-icons-github
      to: /zh/docs/integrations/github
    - name: GitLab
      icon: i-simple-icons-gitlab
    - name: Google Cloud
      icon: i-simple-icons-googlecloud
    - name: Google Docs
      icon: i-simple-icons-googledocs
    - name: Grafana
      icon: i-simple-icons-grafana
    - name: Graylog
      icon: i-simple-icons-graylog
      to: /zh/docs/integrations/graylog
    - name: 华为云
      icon: i-lucide-plug
    - name: Jenkins
      icon: i-simple-icons-jenkins
    - name: 监控宝
      icon: i-lucide-plug
    - name: Kogia
      icon: i-lucide-plug
    - name: Kubernetes
      icon: i-simple-icons-kubernetes
    - name: LDAP
      icon: i-lucide-plug
    - name: Linear
      icon: i-simple-icons-linear
    - name: Grafana Loki
      icon: i-simple-icons-grafana
      to: /zh/docs/integrations/grafana-loki
    - name: n8n
      icon: i-simple-icons-n8n
    - name: New Relic
      icon: i-simple-icons-newrelic
    - name: Notion
      icon: i-simple-icons-notion
    - name: PagerDuty
      icon: i-simple-icons-pagerduty
    - name: Prometheus
      icon: i-simple-icons-prometheus
      to: /zh/docs/integrations/prometheus
    - name: 轻帆云
      icon: i-lucide-plug
    - name: Riverbed
      icon: i-lucide-plug
    - name: Sentry
      icon: i-simple-icons-sentry
    - name: Slack
      icon: i-simple-icons-slack
      to: /zh/docs/integrations/slack
    - name: SolarWinds
      icon: i-lucide-plug
    - name: Telegram
      icon: i-simple-icons-telegram
    - name: Grafana Tempo
      icon: i-simple-icons-grafana
      to: /zh/docs/integrations/grafana-tempo
    - name: 腾讯云
      icon: i-lucide-plug
    - name: Terraform
      icon: i-simple-icons-terraform
    - name: 透视宝
      icon: i-lucide-plug
    - name: Vercel
      icon: i-simple-icons-vercel
      to: /zh/docs/integrations/vercel
    - name: VictoriaMetrics
      icon: i-simple-icons-victoriametrics
    - name: Volcengine
      icon: i-lucide-plug
    - name: 微信
      icon: i-simple-icons-wechat
    - name: Zabbix
      icon: i-lucide-plug
  ---
  :::
::

::u-page-section
#title
企业级安全保障

#description
数据安全是我们的最高优先级。Castrel 通过多层防护机制，确保你的数据始终私密且安全。

#default
  :::feature-bento
  ---
  gridCols: 4
  mobileSingleColumn: true
  features:
    - icon: i-lucide-shield-check
      title: 只读访问
      description: Castrel 仅需要数据读权限，不进行写入、不修改系统，最大限度降低风险。
      cols: 2
      rows: 2
    - icon: i-lucide-lock
      title: 零训练承诺
      description: 你的数据绝不会用于任何模型训练或微调。该承诺由 Castrel 及所使用模型服务商的隐私政策共同保障。
      cols: 2
      rows: 1
    - icon: i-lucide-shield
      title: 合规就绪
      description: 我们遵循行业标准的安全实践。
      cols: 1
      rows: 1
    - icon: i-lucide-eye-off
      title: 默认私有
      description: 除非你明确授权用于支持服务，否则任何员工均无权访问你的数据。
      cols: 1
      rows: 2
    - icon: i-lucide-server
      title: 私有化部署
      description: Castrel 可部署在你的基础设施中，支持接入自有 AI Infra，数据控制权完全归你所有。
      badge: 企业版
      cols: 2
      rows: 1
    - icon: i-lucide-key
      title: 端到端加密
      description: 采用 AES-256 静态加密与 TLS 传输加密，覆盖数据全链路。
      cols: 1
      rows: 1
  ---
  :::
::

::u-page-section
#title
定价

#default
:::home-pricing-section
:::
::
