---
name: castrel-blog-writer
description: Write or improve publishable Castrel product articles for the official website, WeChat/public accounts, customer communication, and internal circulation. Use for core feature introductions, capability launches, practical scenario articles, and approved customer cases based on briefs, Castrel tasks, webpages, screenshots, recordings, reports, or other evidence. For website publication, create aligned English and Chinese Markdown files in content/en/blogs and content/zh/blogs; perform Git and PR delivery only when the user requests repository publication or delivery.
---

# Castrel Blog Writer

Turn source material into a credible product narrative that explains:

- What problem existed before Castrel
- Why the old process was fragmented, slow, difficult to verify, or difficult to reuse
- What part of the work Castrel changes or takes over
- What result is produced and how it can be checked
- What concrete business, efficiency, quality, or organizational value follows

Write for a mixed B2B audience by default. Adapt tone and length to the requested channel. Do not ask the user to define the audience unless that choice would materially change the article.

## Workflow

### 1. Understand The Request And Sources

Identify or infer:

- The publishing channel and communication goal
- The article type: feature introduction, capability launch, scenario article, or customer case
- The people affected, original process, Castrel workflow, final artifact, and value
- Whether the material represents a demo, typical scenario, internal workflow, PoC or trial, or customer production use

Read supplied sources with appropriate tools before asking the user to explain them. Accept Castrel task URLs, briefs, documentation, product pages, screenshots, recordings, meeting notes, reports, data, artifacts, or direct descriptions.

Ask a follow-up question only when a source is inaccessible or missing information would materially change the central argument, factual framing, customer classification, quantitative claim, or product claim. Otherwise proceed with clearly stated assumptions.

When given a Castrel task URL, reconstruct the useful workflow from its available content: the original goal, context, tools, actions, decisions, evidence, corrections, validation, final work product, and possible reuse.

### 2. Establish The Evidence Boundary

Classify claims before drafting:

- **Observed fact:** directly supported by the supplied material
- **Reasoned judgment:** a conclusion supported by observed facts
- **Product action:** what Castrel demonstrably did or is designed to do
- **Conditional capability:** behavior that depends on configuration, permissions, data, or confirmation

Never invent customer names, metrics, production adoption, or live usage. Do not upgrade a demo, PoC, trial, or unnamed scenario into a customer case.

Use these public framings:

- No named customer or production proof: “typical scenario” or “practical workflow”
- Confirmed internal use: “internal workflow”
- Confirmed customer and approved framing: “customer case”

Do not call source material a “demo” in public copy unless the user explicitly wants that framing.

Use definitive language only for verified behavior. Use “can,” “when connected,” or “when configured” for conditional behavior. Qualify or omit unsupported links and improvement claims.

### 3. Build The Article

Use this narrative spine rather than a rigid heading template:

```text
Problem and consequence
→ limits of the old process
→ Castrel workflow and evidence
→ result
→ value and reuse
```

For complex workflows, group details into two to four meaningful stages. Headings should reveal the argument when read alone. Explain essential unfamiliar terms at first use without turning the article into a glossary.

Connect important facts causally where the evidence supports it:

```text
Business goal → signal or evidence → judgment → Castrel action → result → reuse
```

Explain why a capability, rule, metric, or output matters and how it affects the next decision or stage. Use a concise table or structured list when three or more items share fixed fields; otherwise prefer prose.

Make the title express at least two of these: scenario, change or outcome, and Castrel's role. Keep the title, description, imagery, and central claim aligned.

### 4. Write In Castrel's Editorial Style

Write clear, concrete, confident B2B prose. Be promotional without exaggeration and include enough process detail to make the result credible.

Avoid generic marketing language such as:

- “With the rapid development of AI...”
- “Empower digital transformation”
- “Unlock unlimited potential”
- “Revolutionize traditional workflows”
- Unsupported claims that Castrel “greatly” or “significantly” improves something

Prefer specific descriptions of the old work, what Castrel handled, what was produced, and why the change matters. If a paragraph mainly lists what “Castrel can” do, rewrite it around the change in work or resulting value.

When data is available, explain the before/after and connect the number to a business outcome. Do not insert illustrative numbers into publishable copy.

## Screenshots And Web Evidence

When URLs or screenshots are relevant, use available browser capabilities to inspect the visible workflow and final output. If authentication blocks access, ask the user to sign in; do not inspect passwords, cookies, local storage, or session stores.

Use screenshots as evidence rather than decoration. Prefer states that show:

- What Castrel inspected or operated
- A meaningful workflow step
- A before/after state
- The final output or result

For each selected screenshot, make clear what it shows, why it matters, and which claim it supports.

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

## Final Check

Before delivery, verify that:

- The affected reader, old process, failure mode, and consequence are clear before the product pitch
- The article explains how Castrel changes the work, not merely which features exist
- The result and value follow from supported evidence
- Customer, production-use, metric, and capability claims are correctly calibrated
- Demo material is framed safely
- The heading outline is coherent and the title works outside the article page
- Available data and screenshots contribute to the argument
- The copy avoids generic AI marketing language
- Website versions are idiomatic, structurally aligned, and use valid filenames and frontmatter
- Repository delivery, when requested, includes only related files and reports validation
