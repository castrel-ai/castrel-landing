# AGENTS.md

本文件给在本仓库协作的开发者/Agent 使用，重点说明国际化结构、Blob 资产流程和 Castrel Proxy 安装链路。

## 1) 国际化结构（i18n）

### 目录约定
- 英文内容：`content/en/**`
- 中文内容：`content/zh/**`
- 两种语言目录结构保持镜像：
  - `docs/1.getting-started`
  - `docs/2.features`
  - `docs/3.integrations`
  - `docs/4.more`
  - `docs/5.security`
  - `blogs/`

### 路由约定
- 英文首页：`/`
- 中文首页：`/zh`
- 英文文档：`/docs/**`
- 中文文档：`/zh/docs/**`
- 英文博客：`/blogs/**`
- 中文博客：`/zh/blogs/**`

对应页面入口：
- `app/pages/index.vue`、`app/pages/zh/index.vue`
- `app/pages/docs/[...slug].vue`、`app/pages/zh/docs/[...slug].vue`
- `app/pages/blogs/[...slug].vue`、`app/pages/zh/blogs/[...slug].vue`

对应 Content Collection 定义：`content.config.ts`
- `landing_en`, `landing_zh`
- `docs_en`, `docs_zh`
- `blogs_en`, `blogs_zh`

### 新增内容的最低要求
1. 英文与中文都要补（不要只改单语）。
2. 同一路径语义保持一致（slug 尽量镜像）。
3. 有截图/配图时，同步检查中英文页面引用路径。

## 2) Blob 资产用法

### 资产来源目录
- 图片：`blob-assets/images`
- 字体：`blob-assets/fonts`
- Castrel Proxy 二进制和校验文件：`blob-assets/castrel-proxy/packages`

### 运行时访问路径
- `/images/**` -> `server/routes/images/[...path].ts`
- `/fonts/**` -> `server/routes/fonts/[...path].ts`
- `/castrel-proxy/packages/**` -> `server/routes/castrel-proxy/packages/[...path].ts`

路由内部通过 `server/utils/blob-assets.ts`：
- 先读 `blob-assets-manifest.json` 找 Blob URL。
- 如果 Blob 拉取失败，自动回退本地 `blob-assets/**` 文件。

### 上传流程
1. （可选）先统一生成 webp：
   - `pnpm images:compress-webp`
2. 上传 Blob 并刷新 manifest：
   - `pnpm blob:upload-assets`
3. 仅预览将上传的文件：
   - `pnpm blob:upload-assets:dry-run`

上传脚本：`scripts/upload-assets-to-blob.mjs`
- 会读取 `blob-assets/` 下支持目录并上传。
- 环境变量优先级：`shell env > .env.local > .env`。

## 3) Castrel Proxy 安装链路

- 安装脚本保留在：`public/castrel-proxy/install.sh`（不要迁走）。
- 对外安装入口（推荐）：`/castrel-proxy/install.sh`。
  - 目标用法：`curl -fsSL https://castrel.ai/castrel-proxy/install.sh | bash`
- 二进制与 `.sha256` 放在 Blob 目录：
  - `blob-assets/castrel-proxy/packages/*`

## 4) Vercel Blob 密钥约定

- 上传 Blob 需要：`BLOB_READ_WRITE_TOKEN`。
- **如果没有 Vercel Blob API Key / Token，不要瞎猜，直接找 Arcadia 要。**
- 严禁把真实 Token 写入仓库（尤其是 `README`、代码、提交记录）。

## 5) 常用验收命令

- 检查安装入口：
  - `curl -I http://localhost:3000/castrel-proxy/install.sh`
- 检查 Proxy 包下载：
  - `curl -I http://localhost:3000/castrel-proxy/packages/castrel-proxy-linux-x86_64`
- 检查图片路由：
  - `curl -I http://localhost:3000/images/logo.webp`

## 6) Vercel 排障流程（CLI）

出现「Preview 正常打开但图片/字体全 404」时，按下面顺序排：

### 6.1 先确认 CLI 与 scope
- 检查 CLI 与登录：
  - `vercel --version`
  - `vercel whoami`
- 列团队：
  - `vercel teams ls`
- **所有命令显式带 scope**（避免 `Not authorized`）：
  - `--scope castrel-ai`

### 6.2 定位目标 deployment
- 列出项目部署：
  - `vercel ls castrel-landing --scope castrel-ai`
- 查看部署详情（状态/URL/Build）：
  - `vercel inspect <deployment-url-or-id> --scope castrel-ai`

### 6.3 拉日志看真实 404 来源
- 推荐命令（避免本地 link 状态干扰）：
  - `vercel logs <deployment-id> --scope castrel-ai --project castrel-landing --no-branch --no-follow --since 30m --json --limit 200`
- 重点看两类路径：
  - `/_vercel/image`（通常是结果，不一定是根因）
  - `/images/**`、`/fonts/**`（通常是根因）

### 6.4 本次问题的经验规则
- 如果日志里 `/_vercel/image` 是 404，同时 `/images/**` 也是 404：
  - 根因是源图路由没拿到资源，不是 image optimizer 本身坏了。
- 若 Blob URL 直接 `curl` 是 200，但应用 `/images/**` 404：
  - 优先检查 `server/utils/blob-assets.ts` 是否依赖了运行时文件系统读取 manifest。
  - 在 serverless 环境，`process.cwd()` 读文件不稳定，manifest 应优先走构建期静态导入。
- 若 preview URL `curl` 返回 401：
  - 先识别是否命中 Vercel Preview Protection（SSO/Password），不要把 401 当应用 404。

### 6.5 修复后回归验证
- 等新部署 `Ready`：
  - `vercel inspect <new-deployment> --scope castrel-ai`
- 再拉同 deployment 的日志，确认：
  - `/images/**`、`/fonts/**` 返回 200
  - `/_vercel/image` 的旧 404 若为 `cache: HIT`，多半是历史负缓存，换查询参数验证新 key。

## 7) 发版文档格式要求（Changelog）

### 7.1 适用范围
- `content/{zh,en}/changelog/**`
- 新版本从 `v1.4.0` 起采用固定格式（历史版本保持原样，除非用户明确要求重写）。

### 7.2 术语约定
- 中文文案中：Automation 统一写作「自动化」。
- 产品文案中：Bridge / BridgeNode 统一写作「Castrel Proxy」。
  - `Bridge*` 仅在代码语境使用，不作为对外发布名词。

### 7.3 标题与章节规则
- `title` 不写版本号；版本号只放在 frontmatter 的 `version` 字段。
- 章节标题禁止使用“第一部分/第二部分/第三部分”这类命名。

### 7.4 固定章节结构（四章）
1. `新功能：自动化`
2. `Proxy 新增代理模式`
3. `新增 x 项集成（并标注增强项）`
4. `完整发版清单`

### 7.5 写作要求
- 核心功能章节（自动化、Castrel Proxy）使用 1~2 段简短文字说明，不要只列点。
- 核心功能章节必须带对应文档链接。
- 集成章节必须逐项标明“新增”或“增强”，不能混写“新增/增强”。
- 完整发版清单必须分 `feat` 和 `bugfix` 两小节。
- `description` 用 2~3 句话概述核心功能章节，不写成长摘要。

### 7.6 i18n 要求
- 中英文 changelog 需同步更新；结构一致、语义对齐。

### 7.7 详细规范文档
- 见：`docs/release-note-format.md`
