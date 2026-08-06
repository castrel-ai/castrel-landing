---
name: sync-to-lark
description: 发版后，将 changelog 摘要追加到飞书知识库文档，生成发版宣传消息并（经确认后）以 bot 身份发送到飞书群。
allowed-tools:
  - Skill
  - Read
  - Bash
---

# sync-to-lark

## 触发方式

```
sync-to-lark v1.8.0
```

## 输入

- Required: `VERSION` — 点分版本号，如 `v1.8.0`

## 前置条件

- 对应版本的 changelog PR 已合并并部署到官网
- `content/zh/changelog/` 和 `content/en/changelog/` 中已包含该版本的 changelog 文件

## 固定配置

### 飞书知识库文档

- URL: `https://yunzhihui.feishu.cn/wiki/HegZwhSOcipzm9kFK3EcCYQmngh`
- Wiki token: `HegZwhSOcipzm9kFK3EcCYQmngh`

### 发版群（bot 发送目标）

| 群名 | chat_id | 类型 |
|---|---|---|
| Castrel 内部反馈 | `oc_f856cd504f97fb412acd4e2882c92165` | 内部群 |
| Castrel 反馈交流群 | `oc_9dacb4ec375e433148ca451c1a3a7cc5` | 外部群 |

**发送前置条件（在飞书侧一次性配置，不满足则发送会失败）**：

- 应用（App ID `cli_a95450b976bb1bd2`）需在开发者后台开通 `im:message:send_as_bot` scope。
- bot 必须已被加入上述两个群；外部群还需应用允许外部群可用。
- 可用 `lark-cli im chats list --as bot` 核对 bot 当前所在群；用 `lark-cli auth scopes` 核对已开通 scope。

## Workflow

### 1. 解析版本号

将 `VERSION` 转为文件名中的 slug 格式：

- `v1.8.0` → slug: `v1-8-0`（去掉 `v` 前缀后，`.` 替换为 `-`，再加回 `v`）

### 2. 读取 Changelog 内容

从 `content/zh/changelog/` 目录中找到文件名包含 `v{VERSION_SLUG}` 的 `.md` 文件，读取完整内容。

示例：版本 `v1.8.0` → 匹配文件 `*v1-8-0.md`

### 3. 追加内容到飞书知识库文档

使用 `lark-doc` skill 将 changelog 内容追加到飞书知识库文档（wiki token: `HegZwhSOcipzm9kFK3EcCYQmngh`）：

**身份要求（重要）**：

- 该文档的 bot 身份**没有编辑权限**，写入（`docs +update`）必须显式带 `--as user`，否则会报 `forbidden`（错误码 1770032）。读取（`docs +fetch`）可用任意身份。
- 写入前如遇 `need_user_authorization`，用 `lark-cli auth login --scope "docx:document"` 发起授权（background 方式运行，把链接发给用户点）。授权 token 会被缓存，后续运行通常无需重复授权，直到 token 过期。
- 流程：先用 `lark-cli wiki spaces get_node --params '{"token":"HegZwhSOcipzm9kFK3EcCYQmngh"}'` 解析出真实 `obj_token`（docx 类型），再对 `obj_token` 执行读写。

**插入规则**：

- 追加位置：在 `## 📰 发版记录` 章节下，已有的第一条版本记录之前插入，使用 `insert_before` 模式，以 `--selection-with-ellipsis` 定位第一条记录的加粗版本号（如 `**V1.13.0**`）
- 写入前先读取文档现有内容，**若已存在相同版本号的记录则跳过并提示用户**
- 若文档缺失多个版本（如同时缺 v1.14.0、v1.15.0），按时间倒序在同一次 `insert_before` 内一并写入（新版本在前）

**写入格式转换规则**：

从 changelog 源文件提炼为精简发版记录，按以下规则处理：

1. **标题行**：`**V{VERSION}** ({DATE})· [摘要标题->](官网链接)`，版本号大写 V 并加粗，日期取 frontmatter 中的 `date`，摘要标题带链接指向官网 changelog 页面（格式：`https://www.castrel.ai/zh/changelog/{VERSION_SLUG}`）
2. **摘要行**：不再单独一行，直接作为标题行链接文字的一部分
3. **条目列表**：从 `## 完整发版清单` 的 `### feat` 中提取所有条目，每条以 `- ` 开头，保持一句话精简格式
4. **不包含 bugfix**：飞书文档记录只写 feat，不写 bugfix
5. **不包含详细描述**：不搬运核心功能章节的正文段落，只保留清单条目

**写入模板**：

以 v1.10.0 为例，从 changelog 提炼后写入飞书文档的内容如下：

```
**V1.10.0** (2026-05-19)· [Incident Studio 与 Application 模块全面升级->](https://www.castrel.ai/zh/changelog/v1-10-0)

- 统一所有 AI 对话入口的输入框组件，支持任务类型、所属应用、连接器与代理节点的统一配置。
- 新增任务类型切换能力，支持通用、假设驱动调查、数据探索三种模式及各自独立的扩展数据与工具。
- 统一插件模块架构，将连接配置、工具、技能、知识、通道、事件订阅、自动化模版与上下文同步合并为统一的插件体系。
- 迁移 22 项插件至新架构，新增 K8s、Zabbix、Tempo、SkyWalking、透视宝的资源同步能力。
- 通讯渠道整体迁移至插件体系，新增安装状态管理。
- 新增昆仑联通自建 AIOPS 平台消息渠道集成，通过 Feature Flags 管理。
- 选择应用后向 General Graph 注入 Application 简介作为全局上下文，取代原有的实体简介。
- Automation 执行统一到 GeneralChatGraph，增加 application_id 与 trigger_type 支持。
```

以 v1.8.0 为例：

```
**V1.8.0** (2026-04-23)· [菜单页面重构与 Sandbox 文件类型解析升级->](https://www.castrel.ai/zh/changelog/v1-8-0)

- 重新梳理系统菜单与功能入口，上下文页面完成结构重组
- 任务列表侧边栏重设计，支持定时/事件触发任务按名称分组展示
- Sandbox 新增支持 PDF、DOCX、XLSX 等 9 种文件类型异步解析
- Sub Agent 新增对 Castrel Proxy（BridgeNode）的路由支持
- 新增 MySQL、JVM、Redis 诊断 Skill 及 Java Dump 文件分析工具
- WPS ↔ Castrel 通讯链路打通，完成基础鉴权联调
- @ 提及 Connector 流程专项优化，提升资源列表渲染准确性
```

**提取映射**：

| changelog 源 | 飞书文档记录 |
|---|---|
| frontmatter `version` + `date` | 标题行 `**V1.10.0** (2026-05-19)` |
| frontmatter `title` 或核心功能章节标题 | 标题行链接 `· [Incident Studio 与 ...->](url)` |
| `## 完整发版清单` → `### feat` 条目 | `- ` 开头的条目列表 |
| `### bugfix` | 不写入 |

### 4. 生成客户群发版消息

根据 changelog 内容生成一段面向客户和潜在客户的发版消息。默认按「客户群分享」来写：像产品同学在群里分享这次更新能帮用户做什么，而不是正式公告或工程 release note。

**语气与风格**：

- 有温度、不僵硬，像在客户群里自然分享好消息
- 用 emoji 做段落标记，增强可读性
- 核心功能用 `📌` 逐条高亮，但不强制压成一句；优先说明用户场景、解决的问题和使用后的变化
- 少用“新增、增强、补齐”等工程化表达，多写“现在可以怎么用、能少做什么、能更快解决什么问题”
- 避免只复述功能名称；每条都要体现功能价值，让客户知道“这个能力能帮我做什么”
- 避免客户不一定理解的内部术语；必须出现时要顺手解释清楚，例如 `Skill`、`连接器`、`DOCP`
- 非核心更新可以用一句话带过，不逐条罗列
- 尾部附官网 changelog 链接，引导用户查看完整说明
- 结尾友好收尾，鼓励反馈

**官网链接格式**：`https://castrel.ai/zh/changelog/{VERSION_SLUG}`

**消息模板**（以 v1.8.0 为例）：

```
🚀 Castrel v1.8.0 发版上线

这次主要补强了菜单导航、任务分组和文件分析几个常用场景：

📌 菜单和任务入口更清晰了。我们重新梳理了导航架构，定时/事件触发任务也支持按名称分组查看，日常找入口、看任务会更顺手。

📌 Sandbox 文件解析能力更强了。现在 PDF、DOCX、XLSX 等 9 种文件可以直接上传分析，减少格式转换和手工整理的时间。

同时，这次也补充了 MySQL、JVM、Redis 等基础设施诊断能力，并完成 WPS 集成的基础联调，后续排查和协作场景会继续完善。

完整发版说明在这里：
https://castrel.ai/zh/changelog/v1-8-0

操作手册：
https://yunzhihui.feishu.cn/docx/DGHedNqjTo7S93xr1KIc4Uhnnjf

免费注册试用 Castrel：
国内：https://castrel-app.cloudwise.com/
海外：https://app.castrel.ai/

如有任何使用问题或建议，欢迎随时反馈 🙌
```

**生成规则**：

1. 标题行：`🚀 Castrel {VERSION} 发版上线`
2. 开场用一句话概括本次更新覆盖的客户场景，如“这次主要补强了 xxx、xxx 和 xxx 几个常用场景”
3. 核心功能（从 changelog 的核心章节或 `## 完整发版清单` → `### feat` 提取）：每个用 `📌` 开头，可以写 2~3 句；必须说清使用场景、解决的问题和用户能感受到的变化
4. 非核心更新（诊断 Skill、集成等）：合并为一句话带过；若对客户价值不明显，可以不写
5. 链接区使用客户群自然表达：
   - `完整发版说明在这里：`
   - `https://castrel.ai/zh/changelog/{VERSION_SLUG}`
   - `操作手册：`
   - `https://yunzhihui.feishu.cn/docx/DGHedNqjTo7S93xr1KIc4Uhnnjf`
6. 注册试用链接使用自然表达：`免费注册试用 Castrel：` + 国内/海外链接
7. 收尾：一句友好的反馈引导，放在最末尾

### 5. 发送发版宣传消息到飞书群

将第 4 步生成的消息以 **bot 身份**发送到「固定配置」中列出的两个发版群。

**发送前必须先确认（强制）**：

打印「目标群名 + 完整消息内容 + 发送身份（bot）」，等待用户明确同意后再发送。未确认不得发送。

**发送命令**（逐群发送，用 `--text` + `$'...'` 保留 emoji、缩进与换行；不要用 `--markdown`，它会重排标题与空行）：

```bash
# Castrel 内部反馈
lark-cli im +messages-send --as bot --chat-id oc_f856cd504f97fb412acd4e2882c92165 --text $'🚀 Castrel v1.8.0 发版上线\n...'

# Castrel 反馈交流群
lark-cli im +messages-send --as bot --chat-id oc_9dacb4ec375e433148ca451c1a3a7cc5 --text $'🚀 Castrel v1.8.0 发版上线\n...'
```

**注意**：

- 两个群发送同一份消息内容。
- 建议为每条发送加 `--idempotency-key sync-{VERSION}-{chat_id}`，避免重复触发时重复发送。
- 若返回缺权限（如未开通 `im:message:send_as_bot`）或 bot 不在群，输出错误详情并提示用户补齐「发送前置条件」，不要静默跳过。

### 6. 输出确认

告知用户执行结果：

- 飞书文档：写入成功 / 已存在跳过，附文档链接
- 发版宣传消息：本次发送的消息文本
- 群发送结果：逐群列出发送成功 / 失败（含失败原因）

## 注意

- 版本 slug 转换：`v1.8.0` → `v1-8-0`
- 官网链接固定使用中文 changelog 路径（`/zh/changelog/`）
- 如飞书文档写入失败，输出错误详情，不要静默跳过
- 发送群消息前必须经用户确认；以 bot 身份发送，依赖 `im:message:send_as_bot` scope 与 bot 已入群（见「固定配置 → 发送前置条件」）
