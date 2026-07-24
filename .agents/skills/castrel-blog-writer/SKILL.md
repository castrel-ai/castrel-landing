---
name: castrel-blog-writer
description: Write and publish-ready commit Castrel external product blogs and WeChat/public-account articles for official publishing. Use when drafting or improving posts about Castrel core features, real or typical usage scenarios, scenario cases based on demo materials, product capability launches, customer-facing value narratives, screenshots, webpage evidence, and measurable outcomes. For website blog requests, write both English and Chinese Markdown files under content/en/blogs and content/zh/blogs, then commit, push, and open a PR. Focus on what problem Castrel solves, what work changes, and what value is created rather than listing features or calling something a demo.
---

# Castrel Blog Writer

Use this skill to write Castrel product articles for the official website, company public account, internal circulation, customer communication, and product promotion.

The main article types are:

- Core feature promotion
- Scenario case articles
- Product capability launch posts
- Usage scenario explanations
- Case-style articles based on demo materials

Write for mixed audiences: potential customers, first-time readers, internal employees, leadership, product/technical readers, and business decision makers.

## Core Goal

Do not simply introduce Castrel. Make readers believe Castrel solves a real problem and creates concrete value.

Every article should make clear:

- What problem existed before Castrel
- Why the old way was slow, fragmented, hard to verify, or hard to reuse
- How Castrel changes the work process
- What result Castrel produces
- Why the result is credible
- What business, efficiency, or organizational value is created

## Required Repository Workflow

When the user asks to write a Castrel website blog, complete the repository workflow instead of only drafting in chat:

1. Check the current working tree and identify existing user changes.
2. Get the latest code before editing.
3. Create a dedicated branch before writing files.
4. Default branch name: `feat/blog-<short-topic>`.
5. Read existing blog files in both `content/en/blogs` and `content/zh/blogs` before deciding the file name, frontmatter, and structure.
6. Write both English and Chinese blog files.
7. Validate the result, commit only the related files, push the branch, and open a PR.

Do not overwrite or revert unrelated user changes. If existing changes affect the blog files or branch workflow, work with them carefully and ask only when proceeding would be risky.

## Blog File Output Rules

Write website blog files to:

- English: `content/en/blogs`
- Chinese: `content/zh/blogs`

Create both language versions for every new website blog. Keep the routes and filenames mirrored unless the user explicitly requests otherwise.

Before writing, inspect existing files and follow their naming pattern. The current pattern is numeric prefix plus slug:

```text
<number>.<slug>.md
```

Use the next available numeric prefix based on the latest files in the target blog directories. Do not assume the next number from memory.

Use the existing frontmatter shape from nearby blog files. Do not invent fields the site does not already use. Keep English and Chinese frontmatter semantically aligned, including title, description, date, order, category, image, SEO image, and navigation fields when present.

## Bilingual Blog Requirements

The English and Chinese versions should be publishable in their own languages, not literal translations of each other.

- English should read naturally for international B2B product readers.
- Chinese should read naturally for the Chinese website or public account context.
- Keep the same facts, claims, data, customer framing, and public messaging constraints in both versions.
- Keep the section structure aligned so reviewers can compare the two versions easily.
- Do not create an English-only or Chinese-only blog unless the user explicitly asks.

## Validation And Delivery

Before committing, check:

- Both language files exist in the correct directories.
- Filenames and numeric prefixes follow the existing blog pattern.
- Frontmatter matches existing blog conventions.
- The two versions are structurally aligned.
- The article does not present demo material as a customer case unless approved.
- Claims, customer names, metrics, and production usage are supported by provided material.
- Only files related to the blog are staged.

Run reasonable project validation based on the repository's available scripts. If validation cannot be run, explain why.

Commit with a concise message such as:

```text
feat: add <short-topic> blog
```

Open a PR that includes:

- English blog path
- Chinese blog path
- Summary of the article angle
- Validation performed

## Writing Direction

Use the user's feature brief, demo URL, screenshots, webpage content, data, and notes as source material. Convert them into a publishable product narrative.

When the source material is a demo, do not write the article as a demo recap. Reframe it as:

- A real usage scenario
- A typical customer scenario
- A common business task
- A practical workflow
- A case based on a real work process

Avoid saying:

- "This demo shows..."
- "In this demo..."
- "We built a demo..."
- "Let's play with..."

Prefer:

- "In a typical scenario..."
- "Take product content production as an example..."
- "In actual work, this kind of task often requires..."
- "Castrel can take over this part of the workflow..."

Do not invent customer names, production usage claims, or quantitative results that the user did not provide. If the material is a demo and no real customer is named, present it as a typical scenario or practical workflow rather than a customer case.

## Style

Reference AI-native B2B product blog style, but keep the subject focused on Castrel core features and scenario cases.

The article should be:

- Clear, concrete, and publishable
- Promotional but not hollow
- Confident but not exaggerated
- Business-readable, with enough process detail to be credible
- Focused on problems, process, results, and value
- Free of generic AI-sounding phrasing

Avoid empty phrases such as:

- "With the rapid development of AI..."
- "Empower digital transformation..."
- "Build an intelligent closed loop..."
- "Greatly improve efficiency..."
- "Unlock unlimited potential..."
- "Revolutionize traditional workflows..."

Prefer specific writing:

- "The hard part of this work is not that people do not know how to do it. It is that the process is too fragmented."
- "A person has to collect context, check pages, preserve evidence, and explain the result."
- "Castrel lets the agent take over that middle part of the work."
- "The output is not just an answer. It is a work product that can be checked and reused."

## User Inputs

Before writing, identify whether the user is asking for:

1. Core feature promotion
2. Scenario case promotion

For core feature promotion, collect or infer:

- Feature name
- What problem the feature solves
- How users handled the problem before Castrel
- How Castrel handles it now
- What final output or result Castrel creates
- Target audience: customers, first-time readers, employees, leadership, or mixed audience
- Available data: time saved, fewer steps, lower cost, higher success rate, shorter delivery cycle
- URLs, screenshots, or screenshot targets
- Public messaging constraints: sensitive information, unreleased features, customer names, claims to avoid

For scenario case promotion, collect or infer:

- Scenario name
- Real problem represented by the scenario
- Original manual process
- Castrel workflow: what it reads, opens, operates, decides, captures, and produces
- Final result or artifact
- URLs: Castrel page, scenario page, result page, reference pages, or public pages
- Before/after data: original time vs current time, number of people, number of steps, cycle time
- Whether it can be described as actual internal usage, a typical customer scenario, or a scenario based on a real workflow

Ask concise follow-up questions only when a missing item would change the argument, credibility, or public messaging. Otherwise proceed with explicit assumptions.

## Article Structures

Use these structures as defaults. Adapt headings to fit the publishing channel and article angle.

### Core Feature Article

```markdown
# Title

## A Concrete Problem

Start from a recognizable work problem. Explain what users do today and why it is inefficient, fragmented, hard to verify, or hard to repeat.

## Why The Old Way Falls Short

Explain why manual work, scripts, ordinary chatbots, or traditional workflow tools are insufficient.

## How Castrel Solves It

Introduce the Castrel capability. Do not list functions mechanically. Explain what part of the work Castrel takes over.

## What The Workflow Looks Like

Describe a realistic use process:

- What the user wants to accomplish
- What context Castrel collects
- What pages, files, or tools Castrel checks
- What evidence Castrel preserves
- What output Castrel produces

## Results And Value

Use available data. If no data exists, emphasize concrete value: less manual collection work, clearer evidence, repeatable process, shorter cycle, more stable output.

## Why This Matters

Connect the feature to a broader work change without becoming vague.

## Closing

Close with Castrel's product value and the scenarios where this capability is useful.
```

### Scenario Case Article

```markdown
# Title

## Background

Describe a real or typical work scenario. Do not say it is a demo unless instructed.

## The Original Process

Explain what people previously had to do manually. Highlight time cost, context switching, repeated work, verification difficulty, or lack of reuse.

## How Castrel Takes Over The Workflow

Describe Castrel's work process:

- Understand the goal
- Read relevant materials
- Browse pages
- Extract key information
- Capture screenshots or evidence
- Organize structure
- Generate the final artifact
- Preserve the workflow for reuse when relevant

## The Result

Show what was produced: article, report, decision, screenshot set, table, page state, or other artifact.

## The Value

Explain what the scenario proves about Castrel:

- The agent can build context
- The agent can complete continuous work
- The result can be checked
- The process can be reused
- People spend less time on repeated collection, organization, and coordination

## Closing

Explain which similar scenarios this capability can expand to.
```

## Data Handling

If the user provides numbers, make the data part of the article's value argument.

Examples of useful data:

- Time saved
- Fewer manual steps
- Fewer people involved
- Shorter delivery cycle
- Lower communication cost
- Higher success rate
- More stable output quality
- Fewer repeated operations

Do not write only "Castrel improves efficiency." Explain the before/after.

Example:

> A task that previously required about 2 hours of manual reading, screenshotting, and first-draft writing can now be completed in about 15 minutes. More importantly, the process leaves behind webpage references, screenshots, and a reusable workflow, making the result easier to review and repeat.

## Browser And Screenshot Workflow

When the user provides URLs or asks for screenshots, use browser capabilities when available to:

- Open the provided URLs
- Read visible webpage content
- Navigate through the product or scenario flow
- Capture important interface states
- Inspect final outputs
- Write captions and article paragraphs based on screenshots

For pages that require login, ask the user to sign in in the selected browser when authentication blocks access. Do not inspect passwords, cookies, local storage, or session stores.

Prefer screenshots that serve as evidence, not decoration. Capture:

- The page Castrel inspected
- The workflow step that proves the case
- A before/after state
- A final output or result
- A relevant product interface state

For each screenshot used in an article, explain:

- What the screenshot shows
- Why it matters
- How it supports the article's claim

## Safe Reframing

If the user provides demo material:

- Do not call it a demo in the public-facing article unless the user explicitly asks.
- Use "typical scenario" when there is no named customer or production proof.
- Use "actual internal workflow" only when the user confirms it was actually used internally.
- Use "customer case" only when the user provides a real customer and approves that framing.

Do not fabricate customer names, metrics, production adoption, or live usage.

## Quality Bar

Before finalizing, check:

- Does the article lead with a real problem instead of a feature list?
- Does it explain what Castrel changes in the work process?
- Does it say what problem is solved?
- Does it include a concrete scenario or case?
- If data exists, is the data turned into a value claim?
- If screenshots exist, are they used as evidence?
- Does it avoid directly calling the source material a demo?
- Does it avoid generic AI marketing language?
- Is it suitable for an official website or company public account?

If a paragraph mainly says "Castrel can...", rewrite it around "This matters because..." or "This changes the work because...".
