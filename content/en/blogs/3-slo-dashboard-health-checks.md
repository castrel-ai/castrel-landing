---
title: Turn SLOs into Visual Dashboards for Continuous Health Checks
description: See how Castrel turns an SLO request into a validated visual dashboard with charts and rules, then preserves the objectives, queries, and business context for future health checks.
date: 2026-08-04
order: 3
category: Product
navigation: false
---

An SLO is easy to write down and hard to make useful.

Most teams already have metrics, traces, dashboards, and alert rules. What they often do not have is a shared, defensible answer to a more important question: **what must stay healthy for the business to work?** Turning that answer into service-level objectives requires more than choosing a percentage. Someone has to identify the critical user journey, find a representative traffic window, validate the underlying queries, set targets with evidence, and build a dashboard that people can keep using.

Castrel can take over that middle part of the work. A user can ask for an SLO for an application, and Castrel can read the application context, explore observability data, define the objectives, generate a visual dashboard, and preserve the result as application knowledge. The result is not just a document or a chart. It is an operational baseline that later health checks can use.

## The real problem: SLOs are usually disconnected from daily operations

In many organizations, SLO work begins with good intentions and ends as an isolated artifact. A target may be written in a document, a few PromQL queries may live in a dashboard, and the service owner may know which path matters most. But the reasoning is spread across people and tools.

That creates a recurring manual process:

1. Find the service inventory, topology, runbooks, and previous inspection reports.
2. Decide which user journey is truly business-critical.
3. Switch between metrics, traces, and Kubernetes data to find a period of representative traffic.
4. Check error rates, latency, availability, restarts, and resource pressure.
5. Convert those observations into targets and dashboard queries.
6. Rebuild that context when the next health check or incident review begins.

The problem is not that engineers cannot do this work. It is that the work is fragmented, difficult to review, and difficult to reuse. A dashboard without the target rationale is hard to trust. A written SLO without a live view is hard to operate. And a health check that starts without the original business context often turns into another round of metric collection.

## A typical SLO workflow: start with the journey, not the metric

Consider a typical microservices application with a ticket-booking flow. The observed critical path was:

```text
ts-ui-dashboard → ts-travel-plan-service → ts-order-service
```

A request to create an SLO should not begin by assuming that the latest metric is a valid baseline. In this workflow, recent traffic was very low, so a current 24-hour view could not represent normal customer behavior. Castrel read the application context and the existing inspection SOP, then examined seven days of Prometheus data to locate an earlier window with meaningful business traffic.

It used the period from July 28 to July 31 as the working baseline and checked three core signals:

- service error rates across the `prod-chaos` namespace;
- P95 latency for the order service and other active services;
- Kubernetes Deployment readiness.

The data mattered because it shaped the objectives. During the active window, most active services had observed error rates in the 5–15% range, while `ts-consign-service` showed a persistent 100% error rate. `ts-order-service` had a P95 latency generally between 1 and 8 seconds, and Deployment readiness remained at 100%. These are observations from this specific workflow, not universal SLO defaults.

## Castrel turns the investigation into an operating dashboard

Based on the journey, the historical baseline, and the live data model, Castrel generated four OpenSLO definitions.

| SLO | Target | Scope | Operational purpose |
| --- | --- | --- | --- |
| Booking journey availability | ≥ 95% | Services in the `prod-chaos` namespace | Protect the core transaction path |
| Infrastructure readiness | 100% | Kubernetes Deployments in `prod-chaos` | Detect platform-level unavailability |
| Order service P95 latency | ≤ 10 seconds | `ts-order-service` | Detect degradation that affects ordering experience |
| Active service coverage | ≥ 60% | Services with traffic / observed services | Detect silent or gradual service degradation |

The availability objective uses non-error requests divided by total requests. Infrastructure readiness compares available replicas with desired replicas. The latency objective tracks the order service's P95 span duration. Active service coverage makes low-traffic and silent-service conditions visible instead of treating them as an empty chart.

Those objectives are then rendered as a 10-panel dashboard, rather than being left as configuration alone:

1. Booking journey availability
2. Infrastructure readiness
3. Order service P95 latency
4. Active service coverage
5. Error rate by service
6. Request rate by service
7. P95 latency by service
8. Pod restart health in a 30-minute window
9. Containers above 85% memory utilization
10. Top five services by error rate

This creates a view that connects a business objective with the signals needed to investigate a deviation. Teams can see whether a journey is unhealthy, whether the platform is ready, which services have traffic, and which resource or stability signals require attention.

## Validation is part of the output

Generating a query is not the same as generating a usable panel.

In this workflow, the memory-risk panel initially failed to load. Castrel validated the query directly against Prometheus and identified duplicate time series during the metric join. The same pod and container labels appeared across multiple series because of differing `id` labels.

Castrel corrected the query by aggregating both sides with `sum by (pod, container)`, joining on `pod` and `container`, and adding `or vector(0)` so that an absence of matching data does not produce an empty result. The corrected query returned data, and Castrel updated the dashboard configuration.

That distinction is important. The output is not merely a proposed YAML file. The workflow records a real data-source check, a diagnosis when a query fails, and an updated dashboard that can be loaded and used.

## Why the dashboard matters after it is created

The dashboard is useful immediately, but its longer-term value comes from being preserved as application knowledge.

When the SLO dashboard is archived with the application, it retains more than visual panels:

- the objectives and targets;
- the Prometheus queries and service scope;
- the critical journey and priority tiers;
- the historical baseline used to set the targets;
- the notes about low traffic, data gaps, and known persistent issues.

That gives later health checks a shared starting point. Instead of beginning with, “Which services matter?” or “What should normal look like?”, a health-check workflow can evaluate the existing SLOs, inspect their supporting panels, and report deviations in business terms.

For example, a later inspection can distinguish between these situations:

- a Tier-1 booking-availability objective is burning error budget;
- infrastructure readiness has departed from its 100% baseline;
- order latency is rising while availability still appears healthy;
- service coverage has fallen because traffic has disappeared from part of the application;
- memory pressure or restart activity is increasing before it changes the customer journey.

The SLO baseline does not replace judgment. When traffic patterns change, data sources are incomplete, or the product evolves, targets must be reviewed and recalibrated. In the workflow above, the application was in a low-traffic state, so the dashboard explicitly recorded that its targets should be revisited when normal traffic returns. Preserving that qualification is as important as preserving the number itself.

## From one request to a reusable operational baseline

The value of SLO automation is not just faster dashboard creation. It is the continuity between initial definition and ongoing operations.

Castrel helps teams move through a connected workflow:

```text
Application context + observability data
    → journey and baseline discovery
    → validated OpenSLO definitions
    → visual dashboard
    → archived application knowledge
    → future health checks and recalibration
```

With this approach, an SLO is no longer a one-time promise in a document. It becomes a visual, testable operating baseline: one that can guide health checks, focus investigation on the services and journeys that matter, and evolve as the application changes.
