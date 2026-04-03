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
- 对外统一入口：`/install`（`server/routes/install.get.ts`）。
  - 目标用法：`curl -fsSL https://castrel.ai/install | sh`
- 二进制与 `.sha256` 放在 Blob 目录：
  - `blob-assets/castrel-proxy/packages/*`

## 4) Vercel Blob 密钥约定

- 上传 Blob 需要：`BLOB_READ_WRITE_TOKEN`。
- **如果没有 Vercel Blob API Key / Token，不要瞎猜，直接找 Arcadia 要。**
- 严禁把真实 Token 写入仓库（尤其是 `README`、代码、提交记录）。

## 5) 常用验收命令

- 检查安装入口：
  - `curl -I http://localhost:3000/install`
- 检查 Proxy 包下载：
  - `curl -I http://localhost:3000/castrel-proxy/packages/castrel-proxy-linux-x86_64`
- 检查图片路由：
  - `curl -I http://localhost:3000/images/logo.webp`

