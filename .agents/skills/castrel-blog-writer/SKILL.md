---
name: castrel-blog-writer
description: Write or improve publishable Castrel AI product articles for the official website, WeChat/public accounts, customer communication, and internal circulation. Use for core feature introductions, capability launches, practical scenario articles, and approved customer cases based on briefs, Castrel AI tasks, webpages, screenshots, recordings, reports, or other evidence. For website publication, create aligned English and Chinese Markdown files in content/en/blogs and content/zh/blogs; perform Git and PR delivery only when the user requests repository publication or delivery.
---

# Castrel AI Blog Writer

Turn source material into a credible product narrative that explains:

- What problem existed before Castrel AI
- Why the old process was fragmented, slow, difficult to verify, or difficult to reuse
- What part of the work Castrel AI changes or takes over
- What result is produced and how it can be checked
- What concrete business, efficiency, quality, or organizational value follows

Write for a mixed B2B audience by default. Adapt tone and length to the requested channel. Do not ask the user to define the audience unless that choice would materially change the article.

## Input And Autonomy Boundary

Treat a reliable source plus a request to write or improve an article as sufficient input. Do not require the user to supply a complete marketing brief, audience analysis, pain-point inventory, value proposition, differentiation, or article outline when these can be inferred from the evidence and Castrel AI's demonstrated actions.

Autonomously derive the typical reader, decision moment, old workflow, failure risk, product contribution, qualitative value, and reusable operating pattern. Ask the user only for facts that cannot be safely inferred or verified, including inaccessible sources, approval to name a customer, production-use classification, unpublished product claims, sensitive framing, or quantitative outcomes. Never invent those facts.

Do not confuse missing metrics with missing value. Without verified numbers, explain supported qualitative changes such as reducing repeated investigation, standardizing judgment, exposing gradual risk, preserving context, improving handoffs, or making decisions reviewable.

## Workflow

### 1. Understand The Request And Sources

Identify or infer:

- The publishing channel and communication goal
- The article type: feature introduction, capability launch, scenario article, or customer case
- The people affected, original process, Castrel AI workflow, final artifact, and value
- Whether the material represents a demo, typical scenario, internal workflow, PoC or trial, or customer production use

Read supplied sources with appropriate tools before asking the user to explain them. Accept Castrel AI task URLs, briefs, documentation, product pages, screenshots, recordings, meeting notes, reports, data, artifacts, or direct descriptions.

Ask a follow-up question only when a source is inaccessible or missing information would materially change the central argument, factual framing, customer classification, quantitative claim, or product claim. Otherwise proceed with clearly stated assumptions.

When given a Castrel AI task URL, reconstruct the useful workflow from its available content: the original goal, context, tools, actions, decisions, evidence, corrections, validation, final work product, and possible reuse.

Inspect nearby published articles when working in the repository. Identify what the new article must add instead of repeating an existing article's feature list, examples, or central argument.

### 2. Derive The Value Thesis Before Drafting

Create a concise internal value brief from the sources. Do not ask the user to fill it in, and do not start the article until it is coherent:

- **Reader and decision moment:** who faces the problem and what decision or action is blocked
- **Old workflow:** what people must inspect, reconcile, judge, document, or repeat without Castrel AI
- **Failure and consequence:** what gets delayed, missed, misclassified, or lost, and why that matters
- **Product agency:** which work Castrel AI actually performs beyond displaying or summarizing data
- **Counterfactual:** what a snapshot, dashboard, script, or manual process would likely conclude, versus what the Castrel AI workflow makes possible
- **Result and reuse:** what inspectable artifact or decision is produced and how it improves the next run, handoff, or operational cycle
- **Central thesis:** one sentence connecting the distinctive Castrel AI action to a meaningful outcome

Use this causal test:

```text
Old work and its failure mode
→ Castrel AI action supported by evidence
→ changed judgment or decision
→ operational, business, quality, or organizational value
→ reuse over time
```

Run a differentiation test: if the claimed value could be achieved equally by merely opening a dashboard, scheduling a static script, or asking a generic model to summarize data, the thesis is still too shallow. Identify the Castrel AI-specific reasoning, cross-source action, validation, historical context, correction, orchestration, or knowledge reuse supported by the source. Do not make unsupported competitor claims.

When evidence supports several possible angles, choose the one with the strongest consequence and most distinctive product action. Treat other capabilities as supporting evidence rather than competing themes.

### 3. Establish The Evidence Boundary

Classify claims before drafting:

- **Observed fact:** directly supported by the supplied material
- **Reasoned judgment:** a conclusion supported by observed facts
- **Product action:** what Castrel AI demonstrably did or is designed to do
- **Conditional capability:** behavior that depends on configuration, permissions, data, or confirmation

Never invent customer names, metrics, production adoption, or live usage. Do not upgrade a demo, PoC, trial, or unnamed scenario into a customer case.

Use these public framings:

- No named customer or production proof: “typical scenario” or “practical workflow”
- Confirmed internal use: “internal workflow”
- Confirmed customer and approved framing: “customer case”

Do not call source material a “demo” in public copy unless the user explicitly wants that framing.

Use definitive language only for verified behavior. Use “can,” “when connected,” or “when configured” for conditional behavior. Qualify or omit unsupported links and improvement claims.

Reasoned judgments may explain typical workflow friction and qualitative value when they follow directly from observed product actions. Clearly avoid presenting them as measured customer outcomes.

### 4. Build The Article

Use this narrative spine rather than a rigid heading template:

```text
Problem and consequence
→ limits of the old process
→ Castrel AI workflow and evidence
→ result
→ value and reuse
```

For complex workflows, group details into two to four meaningful stages. Headings should reveal the argument when read alone. Explain essential unfamiliar terms at first use without turning the article into a glossary.

Connect important facts causally where the evidence supports it:

```text
Business goal → signal or evidence → judgment → Castrel AI action → result → reuse
```

Explain why a capability, rule, metric, or output matters and how it affects the next decision or stage. Use a concise table or structured list when three or more items share fixed fields; otherwise prefer prose.

Do not let task chronology, signal inventories, metric tables, or implementation details become the article's main subject. Keep a technical detail only when it proves the problem, product action, changed judgment, or value thesis. After every substantial section, apply the “so what?” test: the reader should understand why the evidence changes an operational or business decision.

Make the strongest counterfactual concrete. Show what the old method might miss or misclassify and how the Castrel AI workflow changes that judgment. For capabilities that support several targets, explain the shared operating model and the distinct problem it solves at each level; do not substitute a scope table for a value argument.

Every article title must include the exact product name “Castrel AI” and express at least two of these: scenario, change or outcome, and Castrel AI's role. Keep the title, description, imagery, and central claim aligned.

### 5. Write In Castrel AI's Editorial Style

Write clear, concrete, confident B2B prose. Be promotional without exaggeration and include enough process detail to make the result credible.

Avoid generic marketing language such as:

- “With the rapid development of AI...”
- “Empower digital transformation”
- “Unlock unlimited potential”
- “Revolutionize traditional workflows”
- Unsupported claims that Castrel AI “greatly” or “significantly” improves something

Use the complete product name “Castrel AI” throughout titles, descriptions, frontmatter, headings, body copy, image captions, calls to action, and other public-facing text. Never shorten it to “Castrel” in article copy unless quoting a source verbatim or referring to a distinct official name that must remain unchanged.

Prefer specific descriptions of the old work, what Castrel AI handled, what was produced, and why the change matters. If a paragraph mainly lists what “Castrel AI can” do, rewrite it around the change in work or resulting value.

When data is available, explain the before/after and connect the number to a business outcome. Do not insert illustrative numbers into publishable copy.

## Web Evidence And Human Screenshot Handoff

When URLs or existing screenshots are relevant, use available browser capabilities to inspect the visible workflow and final output as source evidence. If authentication blocks access, ask the user to sign in; do not inspect passwords, cookies, local storage, or session stores.

Publication screenshots are added manually after writing. Do not capture, generate, download, insert, or require screenshots as part of the article deliverable unless the user explicitly requests that work. Do not block or downgrade an otherwise complete article because publication screenshots are absent.

When useful, provide a separate, concise handoff suggesting where a human could add a screenshot and which claim it should support. Do not add placeholders or captions to the article unless requested. Keep the article credible on its own through specific textual evidence.

## Website Blog Output

When creating website blog files:

1. Inspect nearby files in `content/en/blogs` and `content/zh/blogs`.
2. Create both English and Chinese versions unless the user explicitly requests one language.
3. Mirror filenames, routes, section structure, facts, claims, metrics, and customer framing.
4. Write idiomatically in each language rather than translating literally.
5. Follow the existing numeric filename pattern, `<number>.<slug>.md`, using the next available prefix found in the repository.
6. Reuse the frontmatter shape of nearby files; do not invent fields. Keep titles, descriptions, dates, ordering, categories, images, SEO fields, and navigation fields semantically aligned when present.

If the user asks only for drafting or revision, stop after delivering the requested copy or files. Do not pull, branch, commit, push, or open a PR implicitly.

## Repository Delivery

Only when the user requests repository delivery, publication, a commit, or a PR:

1. Inspect the working tree and preserve unrelated user changes.
2. Update from the target branch when safe and necessary.
3. Create a dedicated branch following the repository or environment naming convention.
4. Validate both language files and run reasonable project checks.
5. Stage only article-related files.
6. Commit with a concise message such as `feat: add <topic> blog`.
7. Push and open a PR when requested.

Include both article paths, the narrative angle, and validation performed in the PR description. If existing changes overlap the article or make the branch workflow risky, pause and ask before proceeding.

## Mandatory Draft-Revise-Verify Loop

Treat final checking as an editing step, not a passive review or a list of observations:

1. Draft the complete article, including frontmatter when required.
2. Evaluate the actual draft against every applicable check below and mark each one internally as pass or fail.
3. Revise the draft to fix every failed check. Do not merely note the weakness, explain it to the user, or defer it to a later pass.
4. Re-run the full check after revision. Continue until every applicable item passes.
5. Deliver only the corrected final draft. Missing manually supplied screenshots are not a failure and should be treated as not applicable.

If a failed item cannot be resolved from available evidence, inspect additional available sources. Ask one focused question only when the missing fact is irreducible; do not fill the gap with unsupported claims.

Before delivery, verify that:

- A one-sentence central thesis states the distinctive Castrel AI action and why it matters
- The affected reader, old process, failure mode, and consequence are clear before the product pitch
- The article contains a concrete counterfactual showing what the previous method could miss, repeat, or misjudge
- The article explains how Castrel AI changes the work, not merely which features exist
- Castrel AI's product agency is distinguishable from a dashboard, static script, or generic summary
- Comparisons with dashboards, scripts, other tools, or prior workflows are specific, qualified, and supported rather than categorical
- The result and value follow from supported evidence
- Technical facts and tables prove the central thesis instead of turning the article into a task recap or report summary
- Each major section passes the “so what?” test and advances a user decision, consequence, or value
- Multi-object or multi-feature coverage explains a reusable operating model rather than only listing supported scope
- Customer, production-use, metric, and capability claims are correctly calibrated
- Demo material is framed safely
- The heading outline is coherent and the title works outside the article page
- The title and description both communicate the article's value and align with its central thesis instead of merely listing features or supported scope
- Available source evidence contributes to the argument
- The article adds a distinct angle instead of substantially repeating nearby published content
- The copy avoids generic AI marketing language
- Website versions are idiomatic, structurally aligned, and use valid filenames and frontmatter
- Repository delivery, when requested, includes only related files and reports validation

Do not deliver a publishable draft while any applicable check remains failed.
