# Castrel MCP 配置要求检查报告

## 官方文档要求总结

根据 Docus 和 Nuxt MCP Toolkit 的官方文档,MCP 服务器的配置要求如下:

### 1. 自动启用 (✅ Castrel 已满足)

**Docus 官方说明**:
> "Every Docus instance includes a built-in MCP server"
> "Your MCP server is automatically available at the `/mcp` path"

Castrel 使用 `--extends docus`,因此自动继承了 MCP 服务器功能,**无需额外配置**。

### 2. 必需的依赖 (✅ Castrel 已满足)

Docus 已经包含了所有必需的依赖:
- `@nuxtjs/mcp-toolkit` - MCP 服务器核心模块
- `zod` - 输入验证库

这些依赖通过 Docus 自动安装,在 `node_modules/docus/package.json` 中可以看到。

### 3. 实验性功能配置 (✅ Docus 已配置)

**官方文档说明** (来自 Nuxt MCP Toolkit 博客):
> "To use Nuxt server utilities like useEvent() in your handlers, enable asyncContext in your Nuxt config"

```typescript
export default defineNuxtConfig({
  experimental: {
    asyncContext: true
  }
})
```

**Castrel 状态**: Docus 的 `nuxt.config.ts` 中已经启用了此配置,Castrel 通过 `--extends docus` 自动继承。

### 4. 可选配置

#### 4.1 禁用 MCP 服务器 (可选)

如果需要禁用 MCP 服务器:

```typescript
export default defineNuxtConfig({
  mcp: {
    enabled: false,
  },
})
```

Castrel **未禁用**,所以 MCP 服务器是启用状态。

#### 4.2 自定义 MCP 名称 (可选)

```typescript
export default defineNuxtConfig({
  mcp: {
    name: 'my-app',
  },
})
```

Castrel 未设置自定义名称,使用默认名称。

## Castrel 项目配置检查

### 当前配置状态

检查 `/home/ubuntu/castrel-landing/nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
    routeRules: { ... },
    modules: ['@barzhsieh/nuxt-content-mermaid'],
    vite: { ... },
    app: { ... },
    css: [...],
    fonts: { ... },
    tailwindcss: { ... },
})
```

**发现**: Castrel 项目的 `nuxt.config.ts` 中:
- ❌ **没有** `experimental.asyncContext` 配置
- ❌ **没有** 显式添加 `@nuxtjs/mcp-toolkit` 模块
- ✅ 通过 `--extends docus` 继承了 Docus 的配置

### 配置继承机制

Nuxt 的 `extends` 功能会合并配置:
1. Docus 的 `nuxt.config.ts` 配置
2. Castrel 项目的 `nuxt.config.ts` 配置

**理论上**,Castrel 应该继承了 Docus 的 `experimental.asyncContext: true` 配置。

## 潜在问题分析

### 问题 1: 配置继承可能不完整

虽然 Docus 启用了 `asyncContext`,但 Castrel 项目的 `nuxt.config.ts` 中没有显式声明。在某些情况下,配置继承可能不完整。

**建议**: 在 Castrel 项目中显式添加此配置。

### 问题 2: 缺少 MCP 模块配置

Docus 的 `nuxt.config.ts` 中包含 `@nuxtjs/mcp-toolkit` 模块,但 Castrel 项目中没有显式声明。

**建议**: 虽然通过 extends 应该已经包含,但为了确保正确性,可以显式添加。

## 推荐的配置修改

### 方案 1: 显式添加必需配置 (推荐)

修改 `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
    // 路由重定向
    routeRules: {
        '/privacy': { redirect: '/docs/security/privacy-policy' },
        '/terms': { redirect: '/docs/security/terms-of-service' },
    },

    // Mermaid 图表支持
    modules: ['@barzhsieh/nuxt-content-mermaid'],

    // 实验性功能 - MCP 服务器需要
    experimental: {
        asyncContext: true,
    },

    // Vite 配置 - 解决 mermaid ESM 兼容性问题
    vite: {
        optimizeDeps: {
            include: ['mermaid'],
        },
    },

    // ... 其他配置保持不变
})
```

### 方案 2: 添加 MCP 配置 (可选,用于自定义)

如果需要自定义 MCP 服务器:

```typescript
export default defineNuxtConfig({
    // ... 其他配置

    // MCP 服务器配置
    mcp: {
        name: 'castrel-docs',
        // enabled: true, // 默认启用,无需设置
    },

    experimental: {
        asyncContext: true,
    },
})
```

## 结论

### 配置要求检查表

| 配置项 | 是否必需 | Docus 提供 | Castrel 状态 | 建议 |
|--------|---------|-----------|-------------|------|
| `@nuxtjs/mcp-toolkit` 模块 | ✅ 必需 | ✅ 已包含 | ✅ 通过 extends 继承 | 无需修改 |
| `experimental.asyncContext` | ✅ 必需 | ✅ 已配置 | ⚠️ 未显式声明 | **建议显式添加** |
| `zod` 依赖 | ✅ 必需 | ✅ 已包含 | ✅ 通过 Docus 安装 | 无需修改 |
| `mcp.enabled` | ❌ 可选 | - | ✅ 默认启用 | 无需修改 |
| `mcp.name` | ❌ 可选 | - | - | 可选添加 |

### 最终建议

1. **立即执行**: 在 Castrel 项目的 `nuxt.config.ts` 中添加 `experimental.asyncContext: true`
2. **可选优化**: 添加 `mcp.name: 'castrel-docs'` 以便于识别
3. **验证**: 部署后测试 MCP 工具是否正常工作

虽然通过 `extends` 应该已经继承了配置,但显式声明可以确保配置不会因为继承顺序或其他原因而丢失。这是一个**最佳实践**,可以提高配置的可维护性和可靠性。

## 参考文档

- [Docus MCP Server](https://docus.dev/en/ai/mcp)
- [Nuxt MCP Toolkit](https://mcp-toolkit.nuxt.dev/)
- [Building an MCP Server for Nuxt](https://nuxt.com/blog/building-nuxt-mcp)
- [Nuxt Extends Feature](https://nuxt.com/docs/guide/going-further/layers)
