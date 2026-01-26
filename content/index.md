---
seo:
  title: Castrel - the AI SRE Agent
  description: Ship fast, flexible, and SEO-optimized documentation with beautiful
    design out of the box. Docus brings together the best of the Nuxt ecosystem.
    Powered by Nuxt UI.
---

::u-page-hero
---
orientation: horizontal
---

#title
Hands off, Always on

#description
Castrel is an SRE Agent. It can triage alerts, investigate incidents, verify deployments, plan and perform operation tasks and answer Ops questions for you.

#links
  :::get-started-button
  :::

  :::u-button
  ---
  color: neutral
  icon: i-lucide-book
  size: xl
  to: /docs/getting-started/introduction
  variant: ghost
  ---
  Documentation
  :::

#default
  :::hero-illustration
  :::
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
    demoUrl: https://app-sit.castrel.ai/shared/4eeef2a9-f3b3-45ce-b2b4-a9204366001f
  - label: Incident Investigation
    icon: i-lucide-bug
    title: Incident Investigation
    description: Collaborate with AI to pinpoint root causes. Provide clues, review hypotheses, and get transparent evidence chains — human context meets AI's global data analysis.
    demoUrl: http://10.0.12.149:5000/chat/session-chat-chat_graph-20260112180806-06ef0f0f
    docsUrl: /docs/features/incident-investigation
  - label: Operation Tasks
    icon: i-lucide-terminal
    title: Operation Tasks
    description: Castrel can plan and perform deployments or infrastructure changes for you.
    demoUrl: http://10.0.12.149:5000/shared/session-chat-chat_graph-20260106194839-3b8b21aa
  - label: Deployment Verification
    icon: i-lucide-shield-check
    title: Deployment Verification
    description: Automatically verify deployments by correlating metrics, logs, and traces before and after changes. Detect anomalies early and ensure safe rollouts.
    docsUrl: /docs/features/deployment-verification
  - label: System Q&A
    icon: i-lucide-circle-question-mark
    title: System Q&A
    description: Query your system using natural language. Mention services / IT resources with @ to ask about status, architecture, or alerts.
    fullWidthImage: /images/ask1.png
    imagePosition: top center
    demoUrl: http://10.0.12.149:5000/shared/ad6d09ff-5a96-49d9-854d-74a30d14b2fe

---

#tab-0-left
:::alert-triage-flow
:::

#tab-1-left
:::incident-investigation-flow
:::

#tab-1-right
:::incident-images
:::

#tab-2-left
:::operation-task-flow
:::

#tab-2-right
:::task-image
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
    - name: Prometheus
      icon: i-simple-icons-prometheus
      to: /docs/integrations/prometheus
    - name: Elasticsearch
      icon: i-simple-icons-elasticsearch
      to: /docs/integrations/elasticsearch
    - name: Grafana Loki
      icon: /images/logo-grafana-loki.png
      to: /docs/integrations/grafana-loki
    - name: Grafana Tempo
      icon: /images/tempo-icon.png
      to: /docs/integrations/grafana-tempo
    - name: Datadog
      icon: i-simple-icons-datadog
      to: /docs/integrations/datadog
    - name: Graylog
      icon: i-simple-icons-graylog
      to: /docs/integrations/graylog
    - name: Slack
      icon: i-simple-icons-slack
      to: /docs/integrations/slack
    - name: GitHub
      icon: i-simple-icons-github
      to: /docs/integrations/github
    - name: Vercel
      icon: i-simple-icons-vercel
      to: /docs/integrations/vercel
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
      description: GDPR compliant.
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
      description: AES-256 encryption at rest and TLS 1.3 in transit. Your data is protected at every layer.
      cols: 1
      rows: 1
  ---
  :::
::
