---
seo:
  title: Castrel - the AI SRE Agent
  description: Castrel is a helpful and secure SRE Agent for incident investigation, alert triage, auto operation and more.
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
Castrel is a helpful and secure SRE Agent for incident investigation, alert triage, auto operation and more.

#footer
:::div{.flex .flex-col .gap-6}
::::div{.flex .flex-wrap .gap-x-6 .gap-y-3}
:u-button{color="neutral" size="xl" to="https://app.castrel.ai?utm_source=castrel.ai&utm_medium=website&utm_campaign=en_home" target="_blank" trailing-icon="i-lucide-arrow-right"}[Try Free]
:u-button{color="neutral" size="xl" to="/docs/getting-started/introduction" icon="i-lucide-book" variant="ghost"}[Documentation]
::::
::::div{.text-sm .text-muted}
Castrel is currently in :u-badge{variant="outline" color="neutral" class="align-middle -mt-0.5"}[beta].
::::
:::

#default
:::hero-illustration
:::


::

::u-container{class="py-12 lg:py-16"}
<iframe src="https://www.youtube-nocookie.com/embed/zLKHCN6il-U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="aspect-ratio: 16/9; width: 100%; border-radius: 12px;"></iframe>
::

::product-features
---
tabs:
  - label: Alert Triage
    icon: i-lucide-bell
    title: Alert Triage
    description: Automatically classify alerts as False Positive, Potential Risk, or Incident. Correlate metrics, logs, and changes to cut through noise and focus on what matters.
    rightImage: /images/alert-triage.png
    imagePosition: top left
    imageScale: 1.1
    docsUrl: /docs/features/alert-triage
    demoUrl: https://app.castrel.ai/shared/655b7313-efdd-45e4-89ab-d34bc8c4491d
  - label: Incident Investigation
    icon: i-lucide-bug
    title: Incident Investigation
    description: Collaborate with AI to pinpoint root causes. Provide clues, review hypotheses, and get transparent evidence chains — human context meets AI's global data analysis.
    fullWidthImage: /images/incident-investigation.jpg
    imagePosition: top center
    demoUrl: https://app.castrel.ai/shared/d8ca3664-1f7d-4fbd-b4fc-11c771d469df
    docsUrl: /docs/features/incident-investigation
  - label: Operation Tasks
    icon: i-lucide-terminal
    title: Operation Tasks
    description: Castrel can plan and perform deployments or infrastructure changes for you.
    rightImage: /images/task-execution.png
    imagePosition: top left
    imageScale: 1.1
    demoUrl: https://app.castrel.ai/shared/d423fb79-2e50-4d3d-8d9e-963780ca5ba5
    docsUrl: /docs/features/castrel-proxy
  - label: Deployment Verification
    icon: i-lucide-shield-check
    title: Deployment Verification
    description: Automatically verify deployments by correlating metrics, logs, and traces before and after changes. Detect anomalies early and ensure safe rollouts.
    rightImage: /images/deployment-verification.jpg
    imagePosition: top left
    imageScale: 1.1
    demoUrl: https://app.castrel.ai/shared/634a839b-d664-4384-adf6-e7f4033ceec8
    docsUrl: /docs/features/deployment-verification
  - label: System Q&A
    icon: i-lucide-circle-question-mark
    title: System Q&A
    description: Query your system using natural language. Mention services / IT resources with @ to ask about status, architecture, or alerts.
    fullWidthImage: /images/system-qa.png
    imagePosition: top center
    demoUrl: https://app.castrel.ai/shared/fd7cef41-3dbb-4159-b147-15c535a106d6


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
Works with Your Existing Stack

#description
Native integrations with popular observability, cloud and technology tools.

#default
  :::integration-grid
  ---
  integrations:
    - name: Aliyun
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
      to: /docs/integrations/datadog
    - name: Dify
      icon: i-lucide-plug
    - name: DingTalk
      icon: i-lucide-plug
    - name: Elasticsearch
      icon: i-simple-icons-elasticsearch
      to: /docs/integrations/elasticsearch
    - name: Feishu
      icon: i-lucide-plug
    - name: Freshworks
      icon: i-lucide-plug
    - name: GitHub
      icon: i-simple-icons-github
      to: /docs/integrations/github
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
      to: /docs/integrations/graylog
    - name: Huawei Cloud
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
      to: /docs/integrations/grafana-loki
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
      to: /docs/integrations/prometheus
    - name: 轻帆云
      icon: i-lucide-plug
    - name: Riverbed
      icon: i-lucide-plug
    - name: Sentry
      icon: i-simple-icons-sentry
    - name: Slack
      icon: i-simple-icons-slack
      to: /docs/integrations/slack
    - name: SolarWinds
      icon: i-lucide-plug
    - name: Telegram
      icon: i-simple-icons-telegram
    - name: Grafana Tempo
      icon: i-simple-icons-grafana
      to: /docs/integrations/grafana-tempo
    - name: Tencent Cloud
      icon: i-lucide-plug
    - name: Terraform
      icon: i-simple-icons-terraform
    - name: 透视宝
      icon: i-lucide-plug
    - name: Vercel
      icon: i-simple-icons-vercel
      to: /docs/integrations/vercel
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
Enterprise Level Security

#description
Your data security is our top priority. Castrel is built with multiple layers of protection to ensure your data remains private and secure.

#default
  :::feature-bento
  ---
  gridCols: 4
  mobileSingleColumn: true
  features:
    - icon: i-lucide-shield-check
      title: Read-Only Access
      description: Castrel only requires read access to your data. No write permissions, no modifications, no risks.
      cols: 2
      rows: 2
    - icon: i-lucide-lock
      title: Zero Training Guarantee
      description: Your data is never used to train or fine-tune any models. Guaranteed by the privacy policy of castrel and all the providers we use.
      cols: 2
      rows: 1
    - icon: i-lucide-shield
      title: Compliance Ready
      description: We follow industry-standard security practices.
      cols: 1
      rows: 1
    - icon: i-lucide-eye-off
      title: Private by Default
      description: No employee has access to your data unless explicitly authorized by you for support purposes.
      cols: 1
      rows: 2
    - icon: i-lucide-server
      title: On-Premise Deployment
      description: Deploy Castrel in your own infrastructure. Use your own AI Infra. Full control over your data.
      badge: Enterprise
      cols: 2
      rows: 1
    - icon: i-lucide-key
      title: End-to-End Encryption
      description: AES-256 encryption and TLS in transit. Your data is protected at every layer.
      cols: 1
      rows: 1
  ---
  :::
::
