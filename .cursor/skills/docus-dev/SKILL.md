---
name: docus development guide
description: This is a docus development guide tell you about nuxt content mdc and how to use it with docus and nuxt ui.
---

# MDC 开发指南

本文档说明 MDC (Markdown Components) 的开发逻辑，以及如何通过 MCP 工具阅读 Docus 和 Nuxt UI 文档。

## 一、MDC 语法概述

MDC 是 Nuxt Content 提供的语法扩展，允许在 Markdown 文件中使用 Vue 组件。

### 1.1 基本语法

```mdc
<!-- 块级组件：使用 :: -->
::component-name
内容
::

<!-- 行内组件：使用 : -->
:icon{name="i-lucide-star"}

<!-- 嵌套组件：增加冒号数量 -->
:::parent-component
  ::child-component
  ::
:::
```

### 1.2 传递 Props

**方式一：内联语法**

```mdc
::button{color="primary" size="lg"}
Click me
::
```

**方式二：YAML frontmatter**

```mdc
::button
---
color: primary
size: lg
to: /docs
---
Click me
::
```

### 1.3 使用 Slots

```mdc
::card
---
icon: i-lucide-star
---

#title
卡片标题

#description
卡片描述内容

#default
默认 slot 内容
::
```

**关键规则：**
- `#default` 或直接写内容 → 默认 slot
- `#slot-name` → 具名 slot

### 1.4 组织文档结构

在 MDC 中，文档不应当存在一级标题，所有文章内标题从二级开始（##）

## 二、自定义组件开发

### 2.1 组件位置

将 Vue 组件放在 `app/components/` 目录下，Nuxt 会自动注册。

```
app/
└── components/
    ├── ObservabilityDemo.vue
    ├── ProductFeatures.vue
    └── ProductFeatureTab.vue
```

### 2.2 在 Markdown 中使用

组件名会自动转换为 kebab-case：

```mdc
<!-- ObservabilityDemo.vue → observability-demo -->
::observability-demo
::
```

### 2.3 Slot 透传模式

当父组件需要将 slot 传递给子组件时：

**ProductFeatures.vue（父组件）：**

```vue
<template>
    <ProductFeatureTab :tab="activeTab" :index="activeIndex">
        <!-- 透传所有 slots -->
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]>
            <slot :name="slotName" />
        </template>
    </ProductFeatureTab>
</template>
```

**ProductFeatureTab.vue（子组件）：**

```vue
<template>
    <div>
        <!-- 具名 slot：tab-0-left, tab-1-left 等 -->
        <slot :name="`tab-${index}-left`">
            <div>默认内容</div>
        </slot>
    </div>
</template>
```

**index.md 中使用：**

```mdc
::product-features
---
tabs:
  - label: Tab 1
    title: 功能一
---

#tab-0-left
:::observability-demo
:::

#tab-1-left
:::another-component
:::
::
```

## 三、通过 MCP 工具阅读文档

项目配置了 Docus 文档的 MCP Server，可以直接查询官方文档。

### 3.1 可用工具

| 工具 | 用途 |
|------|------|
| `list-pages` | 列出所有文档页面 |
| `get-page` | 获取指定页面内容 |

### 3.2 使用示例

**列出所有页面：**

```
调用 MCP 工具:
- server: user-Docus documentation
- toolName: list-pages
- arguments: {}
```

**获取指定页面：**

```
调用 MCP 工具:
- server: user-Docus documentation
- toolName: get-page
- arguments: {"path": "/en/essentials/components"}
```

### 3.3 常用文档路径

| 路径 | 内容 |
|------|------|
| `/en/getting-started/introduction` | 入门介绍 |
| `/en/getting-started/installation` | 安装指南 |
| `/en/getting-started/project-structure` | 项目结构 |
| `/en/concepts/edition` | 编辑文档（MDC 语法详解） |
| `/en/concepts/configuration` | 配置说明 |
| `/en/concepts/customization` | 自定义组件 |
| `/en/essentials/components` | Markdown 组件列表 |
| `/en/essentials/markdown-syntax` | Markdown 语法 |
| `/en/essentials/code-blocks` | 代码块 |

## 四、开发工作流

### 4.1 新增自定义组件

1. 在 `app/components/` 创建 Vue 组件
2. 在 markdown 中使用 kebab-case 名称引用
3. 通过 props 和 slots 传递数据

### 4.2 调试组件

1. 使用浏览器开发者工具检查 DOM
2. 检查组件是否正确渲染
3. 注意 `resolveComponent` 的限制（见下文）

### 4.3 常见问题

**问题：动态组件无法渲染**

原因：`resolveComponent()` 只能解析全局注册或显式导入的组件。

解决方案：使用 slot 模式，让 Nuxt Content 在 markdown 层面解析组件。

```mdc
<!-- 不要用 leftComponent: "MyComponent" -->
<!-- 改用 slot -->
#slot-name
:::my-component
:::
```

## 五、参考资源

- [Nuxt Content MDC 语法](https://content.nuxt.com/docs/files/markdown#mdc-syntax)
- [Docus 文档](https://docus.dev)
- [Nuxt UI 组件](https://ui.nuxt.com/components)
