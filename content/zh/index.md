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
:u-button{color="neutral" size="xl" to="https://app.castrel.ai" target="_blank" trailing-icon="i-lucide-arrow-right"}[免费试用]
:u-button{color="neutral" size="xl" to="/zh/docs/getting-started/introduction" icon="i-lucide-book" variant="ghost"}[查看文档]
::::
::::div{.text-sm .text-muted}
Castrel 当前处于 :u-badge{variant="outline" color="neutral" class="align-middle -mt-0.5"}[beta] 阶段。
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
    - name: Prometheus
      icon: i-simple-icons-prometheus
      to: /zh/docs/getting-started/introduction
    - name: Elasticsearch
      icon: i-simple-icons-elasticsearch
      to: /zh/docs/getting-started/introduction
    - name: Grafana Loki
      icon: i-simple-icons-grafana
      to: /zh/docs/getting-started/introduction
    - name: Vercel
      icon: i-simple-icons-vercel
      to: /zh/docs/getting-started/introduction
  ---
  :::
::
