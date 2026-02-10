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
:u-button{color="neutral" size="xl" to="https://app.castrel.ai" target="_blank" trailing-icon="i-lucide-arrow-right"}[Try Free]
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
    demoUrl: https://app-sit.castrel.ai/shared/4eeef2a9-f3b3-45ce-b2b4-a9204366001f
  - label: Incident Investigation
    icon: i-lucide-bug
    title: Incident Investigation
    description: Collaborate with AI to pinpoint root causes. Provide clues, review hypotheses, and get transparent evidence chains — human context meets AI's global data analysis.
    fullWidthImage: /images/incident-investigation.jpg
    imagePosition: top center
    demoUrl: https://app-sit.castrel.ai/shared/61f819ae-a351-438f-8bb3-e35753fd8fc0
    docsUrl: /docs/features/incident-investigation
  - label: Operation Tasks
    icon: i-lucide-terminal
    title: Operation Tasks
    description: Castrel can plan and perform deployments or infrastructure changes for you.
    rightImage: /images/task-execution.png
    imagePosition: top left
    imageScale: 1.1
    demoUrl: https://app-sit.castrel.ai/shared/b36ac90f-7e22-4a83-af76-f398e73708bb
    docsUrl: /docs/features/castrel-proxy
  - label: Deployment Verification
    icon: i-lucide-shield-check
    title: Deployment Verification
    description: Automatically verify deployments by correlating metrics, logs, and traces before and after changes. Detect anomalies early and ensure safe rollouts.
    rightImage: /images/deployment-verification.jpg
    imagePosition: top left
    imageScale: 1.1
    demoUrl: https://app-sit.castrel.ai/shared/eed90769-97a5-4c4f-ba72-85cc3ae10859
    docsUrl: /docs/features/deployment-verification
  - label: System Q&A
    icon: i-lucide-circle-question-mark
    title: System Q&A
    description: Query your system using natural language. Mention services / IT resources with @ to ask about status, architecture, or alerts.
    fullWidthImage: /images/system-qa.png
    imagePosition: top center
    demoUrl: https://app-sit.castrel.ai/shared/7dbdddb4-05aa-4625-9895-8e376b335964


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
    - name: Vercel
      icon: i-simple-icons-vercel
      to: /docs/integrations/vercel
    - name: GitHub
      icon: i-simple-icons-github
      to: /docs/integrations/github
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
