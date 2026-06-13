---
name: changelog-dev
description: Generate bilingual, production-ready release changelogs for the Castrel landing page from a batch of Linear issues. Strictly enforces Castrel's official UI styling (no device frames), YAML frontmatter, and a strict core-feature vs. checklist hierarchy.
---

## Inputs

- Required: `LINEAR_ISSUE_KEYS` (逗号分隔的 Issue 列表，示例: `CAST-123, CAST-124`)
- Required: `VERSION` (版本号后缀，使用横杠分隔，示例: `1-6-0`)
- Optional: `CORE_ISSUE_KEYS` (手动指定核心主题的 Issue，逗号分隔，示例: `CAST-123, CAST-124`。若提供，直接作为核心功能章节，跳过 AI 识别)
- Optional: `ORDER` (frontmatter 中的 order 值；若不提供，在历史序号位移完成后统计 `content/zh/changelog/` 中的文件总数，以该数字作为 order 值)


## Fixed Output Paths

- **中文存放路径**: `content/zh/changelog/0.v{VERSION}.md`
- **英文存放路径**: `content/en/changelog/0.v{VERSION}.md`

## Execution Procedure

### 1. 获取数据

获取所有 Issue 的详细上下文（标题、描述、优先级），
并**无条件并行拉取每个 Issue 的评论**，
不得以"描述已足够"为由跳过评论获取。

### 2. 创建发布分支

在生成任何文件之前，先执行以下 git 操作：

```bash
git checkout main
git pull origin main
# 将 {VERSION} 替换为实际版本号，如 1.9.0（使用点分隔）
git checkout -b release/changelog-{VERSION}
```

### 3. 历史序号位移 (关键步骤)

在生成新文件前，执行以下脚本逻辑以腾出 0 号索引：

```bash
# 针对中英文目录分别执行
for lang in zh en; do
  dir="content/$lang/changelog"
  # 倒序排列文件 (如 5->6, 4->5)，防止重命名冲突
  files=$(ls $dir | grep -E '^[0-9]+\.v.*\.md$' | sort -rn)
  for file in $files; do
    old_idx=$(echo $file | cut -d. -f1)
    new_idx=$((old_idx + 1))
    rest=$(echo $file | cut -d. -f2-)
    mv "$dir/$file" "$dir/$new_idx.$rest"
  done
done
```

### 4. 内容分析与提炼

**战略提炼 (Main Feature extraction)**：

按以下优先级确定核心主题（1-2 个）：

1. **若用户提供了 `CORE_ISSUE_KEYS`**：直接将这些 Issue 作为核心功能章节，不做 AI 识别，不询问确认，直接进入下一步。
2. **若未提供 `CORE_ISSUE_KEYS`**：在写入任何文件之前，先列出你识别到的核心主题（Issue ID + 标题），**明确询问用户是否确认**，等待用户回复后再继续。

每个核心功能必须写 2-4 段**自然段落**正文，可包含行内图片和文档链接。

> ⚠️ **段落风格**：核心章节正文用自然段落叙述，不得使用列表式 bullet points。直接描述功能做什么、为什么有用，不提"之前/过去/原来"等对比句式。

**精简归纳 (Checklist compression)**：
- 将剩余所有 Issue（即非核心主题的 Issue）转化为极简的一句话动宾结构。
- 区分 `feat`（新功能与优化）和 `bugfix`（缺陷修复）。

### 4.5 术语自检 (关键步骤，写入前必做)

在写入文件前，逐句扫描中英文草稿，对照 Guardrails 第 3 条「语言风格」的禁用词映射表：

- 命中黑名单术语（如 Canvas、submit-ci、write-knowledge、写操作）或任何直接搬运自 Issue 描述/评论的工程师措辞，必须替换为用户视角说法后才能写入。
- 中文正文中的英文产品词（如 Connector）统一改为中文界面名称（连接器）。
- 自检未通过，不得进入步骤 5。

### 5. 写入 Changelog 文件

严格对照下方**真实示例**写入，不得简化结构或省略任何章节。

### 6. 提交并推送

```bash
git add content/zh/changelog/ content/en/changelog/

# 将 {VERSION} 替换为实际版本号，如 1.9.0
git commit -m "chore(changelog): add v{VERSION} release notes"

git push origin release/changelog-{VERSION}
```

### 7. 创建 Pull Request

使用 `gh` 命令创建 PR：

```bash
# 将 {VERSION} 替换为实际版本号，如 1.9.0
gh pr create \
  --title "chore(changelog): add v{VERSION} release notes" \
  --body "Add bilingual changelog for v{VERSION}." \
  --base main
```

PR 创建成功后，输出 PR 链接，任务结束。

## Changelog Templates

以下是**从真实生产文件中提取的完整示例**。生成时须逐字段对齐其结构、引号规范、章节层级和行文风格，不得简化。

> ⚠️ **Frontmatter 引号规范（中英文相同）**：`title` 和 `date` 加双引号；`description` 和 `image.src` 不加引号。
> ⚠️ **英文专项**：`Full Release Checklist` 的 `### feat` 和 `### bugfix` 标题后各空一行再写条目；中文无此要求。

---

### 中文完整示例 (`content/zh/changelog/0.v1-8-0.md`)

```markdown
---
title: "菜单页面重构与 Sandbox 文件类型解析升级"
description: 本次发版重点是"菜单页面全面重构"，以及 "Sandbox 对多种复杂文件类型解析能力的增强"。我们优化了任务列表的展示逻辑，并以 Skill 和集成的方式扩展了对核心组件（MySQL、JVM、Redis）及 WPS 的支持。
date: "2026-04-23"
version: "v1.8.0"
order: 9
image:
  src: /images/changelog/v1-8-0/index-zh.png
navigation: false
---

## 新功能：菜单页面重构

我们对系统的导航架构进行了深度优化，使核心运维操作更触手可及：

- **入口全面重组**：重新梳理了导航菜单，明确了区块划分。同时对深/浅双主题的颜色对比度和组件状态进行了全面收口，消除视觉干扰。
- **自动化任务分组管理**：任务侧边栏新增"最近任务、定时触发、事件触发、收藏"四个视图。定时与事件任务现支持按自动化名称分组展示历史记录，支持折叠/展开，并可直接查看事件原始 JSON。
- **任务体验优化**：支持自动化任务标题自动生成，优化了详情面板的信息层级，使任务来源与触发类型一目了然。

## 新功能：Sandbox 文件类型解析升级

Sandbox 文件解析能力迎来质的飞跃，现已支持 **PDF、DOCX、XLSX、CSV、JSON、JSONL、YAML、YML、XML** 共 9 种文件类型（单文件上限 5 MB）。

![sandbox解析界面](/images/changelog/v1-8-0/sandbox-zh.png)

## 新增 4 项诊断 Skill

本次发版引入了底层的基础组件 Skill 库，为核心基础设施提供深入的智能诊断能力：

- **MySQL 诊断**：覆盖连接数、慢 SQL、死锁、主从延迟及 I/O 瓶颈分析。
- **JVM 诊断**：自动识别 OOM、GC 异常、线程死锁及类加载泄漏。
- **Redis 诊断**：涵盖大/热 Key 扫描、内存限制、缓存雪崩/击穿等场景。
- **Java Dump 分析**：新增专门用于处理 Java Heap Dump 文件的分析工具。

## 新增 1 项集成，增强 1 项代理能力

- **新增**：WPS Office
- **增强**：Castrel Proxy (Sub Agent 现在支持通过 Proxy 进行路由，实现跨网络边界的 Agent 任务委派)。

## 完整发版清单

### feat
- 重新梳理系统菜单与功能入口，上下文页面完成结构重组。
- 任务列表侧边栏重设计，支持定时/事件触发任务按名称分组展示。
- Sandbox 新增支持 PDF、DOCX、XLSX 等 9 种文件类型异步解析。
- Sub Agent 新增对 Castrel Proxy（BridgeNode）的路由支持。
- 新增 MySQL、JVM、Redis 诊断 Skill 及 Java Dump 文件分析工具。
- WPS ↔ Castrel 通讯链路打通，完成基础鉴权联调。
- @ 提及 Connector 流程专项优化，提升资源列表渲染准确性。

### bugfix
- 修复飞书 @ 提及功能在特定场景下偶发艾特全员的问题。
- 修复 Elasticsearch Connector 使用 API Key 认证时连接失败的问题。
- 修复修改自动化任务名称后，左侧列表未实时同步更新的问题。
- 修复成员列表暴露完整邮箱地址的安全问题，默认显示脱敏邮箱。
```

---

### 英文完整示例 (`content/en/changelog/0.v1-8-0.md`)

```markdown
---
title: "Menu Redesign & Sandbox File Type Parsing Upgrade"
description: This release focuses on a comprehensive menu redesign and enhanced Sandbox parsing support for complex file types. We optimized the task list display logic and expanded support for core infrastructure components (MySQL, JVM, Redis) and WPS through new Skills and integrations.
date: "2026-04-23"
version: "v1.8.0"
order: 9
image:
  src: /images/changelog/v1-8-0/index-en.png
navigation: false
---

## New Feature: Menu Redesign

We have deeply optimized the system's navigation architecture to make core operations more accessible:

- **Reorganized entry points:** Restructured the navigation menu with clearer section boundaries. Comprehensive refinement of color contrast and component states across both dark and light themes eliminates visual noise.
- **Automated task grouping:** The task sidebar now includes four views — "Recent Tasks", "Scheduled", "Event-Triggered", and "Favorites". Scheduled and event-triggered tasks support grouping by automation name with collapsible history, and you can view the raw event JSON directly.
- **Improved task experience:** Automation task titles are now auto-generated. The detail panel's information hierarchy has been optimized so that task source and trigger type are immediately clear at a glance.

## New Feature: Sandbox File Type Parsing Upgrade

Sandbox file parsing has reached a new level, now supporting **PDF, DOCX, XLSX, CSV, JSON, JSONL, YAML, YML, and XML** — 9 file types in total (5 MB limit per file).

![sandbox parsing](/images/changelog/v1-8-0/sandbox-en.png)

## 4 New Diagnostic Skills

This release introduces a foundational infrastructure Skill library, providing deep intelligent diagnostics for core components:

- **MySQL Diagnostics:** Covers connection count, slow queries, deadlocks, replication lag, and I/O bottleneck analysis.
- **JVM Diagnostics:** Automatically identifies OOM errors, GC anomalies, thread deadlocks, and class-loading leaks.
- **Redis Diagnostics:** Handles large/hot key scanning, memory limits, cache avalanche, and cache penetration scenarios.
- **Java Dump Analysis:** New dedicated tool for analyzing Java Heap Dump files.

## 1 New Integration, 1 Enhanced Agent Capability

- **New:** WPS Office
- **Enhanced:** Castrel Proxy (Sub Agent now supports routing through Proxy, enabling agent task delegation across network boundaries).

## Full Release Checklist

### feat

- Restructured system menu and feature entry points; context pages have been fully reorganized.
- Redesigned task list sidebar with support for grouping scheduled/event-triggered tasks by automation name.
- Sandbox now supports async parsing for PDF, DOCX, XLSX, and 6 other file types (9 total).
- Sub Agent now supports routing via Castrel Proxy (BridgeNode).
- Added MySQL, JVM, and Redis diagnostic Skills, plus a Java Heap Dump file analysis tool.
- Established WPS ↔ Castrel communication channel with basic auth integration.
- Specialized optimization for the @ mention Connector flow, improving resource list rendering accuracy.

### bugfix

- Fixed an issue where the Lark @ mention feature occasionally mentioned all members in certain scenarios.
- Fixed a connection failure with the Elasticsearch Connector when using API Key authentication.
- Fixed an issue where the left-side task list did not update in real time after renaming an automation task.
- Fixed a security issue where the member list exposed full email addresses; emails are now masked by default.
```

---

## Strict Constraints (Guardrails)

1. **整体格式 (YAML Frontmatter)**：必须严格以标准的 YAML frontmatter 开头（包含 title, description, date, version, order, image: src, navigation: false）。不可遗漏任何字段。引号规范严格对照上方示例，不得自行调整。

2. **执行顺序**：必须严格按照 Execution Procedure 的步骤顺序执行。**创建分支（步骤 2）必须在写入文件（步骤 5）之前完成**，不得颠倒。

3. **语言风格（用户视角）**：
   - **不说专业术语**：不得使用内部代码名称或实现层措辞，必须用用户在界面上看到的名字描述。常见映射如下（黑名单含但不限于）：

     | 禁用（内部 / 实现术语） | 改写为（用户视角） |
     | --- | --- |
     | Canvas | 右侧面板 |
     | ghost、toolset、Steering、ask_user_question | 用界面实际功能名描述 |
     | submit-ci / write-knowledge / 写操作 | 提交资源 / 写入知识库 |
     | Connector（中文正文中） | 连接器 |
     | Bridge / BridgeNode | Castrel Proxy |
     | 子智能体视图 / Sub Agent view、文档画布 / 终端转录等内部界面名 | 直接省略内部视图枚举，或用普通用户能看懂的说法 |

     > ⚠️ 黑名单仅是示例，不是穷举。任何直接来自代码、Issue 描述或评论的工程师措辞，都必须先翻译成用户视角再写入，严禁逐字搬运。
   - **简洁直接（参考 OpenAI Codex changelog 风格）**：句子短、用词平实、先说用户能做什么；避免堆叠形容词与营销话术，不枚举内部界面/视图名称。
   - **价值导向**：每段正文回答"这个功能让用户能做什么/获得什么"，而非"我们做了什么改动"。
   - **不提对比**：禁止出现"之前/过去/原来/Previously"等对比旧行为的句式。直接描述新能力。
   - 中文保持自然，英文保持简洁。

4. **主次分明原则 (Core Rule)**：
   - **重点介绍**：只有最核心的战略级功能才配拥有独立的 `## [Feature Name]` 章节，并包含 2-4 段正文、行内图片（`![描述](/images/changelog/v{VERSION}/xxx.png)`）及文档链接（如适用）。
   - **列表折叠**：其他所有常规的新功能、流程优化、体验升级，绝对不要在正文中作详细段落介绍。必须将它们转化为精简的一句话，全部放入底部的 `## 完整发版清单` / `## Full Release Checklist` 对应列表中。

5. **集成章节可选**：只有当本次发版确实有新增或增强的集成时，才包含集成章节（如 `## 新增 x 项集成` / `## x New Integrations`）。若没有，跳过该章节。

6. **语言规范 (Linguistic Rigor)**：
   - **风格**：Full Release Checklist 中的条目必须极其精简，一句话描述。
   - **英文条目动词**：feat 统一使用 Improved、Added、Expanded、Optimized、Restructured 等过去式；bugfix 统一使用 Fixed。
   - **中文条目**：使用简洁动宾结构，无需动词前缀。
   - **语气**：描述必须客观、专业。生成过程中严禁输出思考过程或冗余解释，直接输出最终的 Markdown 结构。

7. **description 写作规范**：
   - 用 2-3 句话概述核心章节的关键能力，不提问题背景（如"为了解决……"），直接说本次新增了什么。
   - 英文示例：`This release introduces..., adds..., and improves... for more efficient...`
   - 中文示例：`本次发版新增……，引入……，并优化……`

8. **图片路径规范**：所有图片路径格式为 `/images/changelog/v{VERSION}/{filename}.png`，版本号使用横杠分隔（如 `v1-8-0`）。封面图片路径写在 frontmatter 的 `image.src` 中；正文行内图片直接用 Markdown 图片语法插入对应章节内。
