--- Cursor Command: git/commit-semantic ---
<meta>
description: Create a commit with semantic commit message format (Conventional Commits)
argument-hint: [commit-message]
</meta>

# Git 创建提交（Semantic Commit 规范）

## 概述

创建符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范的提交信息并提交已暂存的变更。

## Semantic Commit Message 规范

### 格式要求
- **标准格式**：`<type>(<scope>): <subject>`
- **完整格式**：`<type>(<scope>): <subject>`
  - **type**（必需）：提交类型
  - **scope**（可选）：影响范围
  - **subject**（必需）：简短描述

### 提交类型（Type）

- **feat**: 新功能（feature）
- **fix**: 修复 bug
- **docs**: 文档变更
- **style**: 代码格式（不影响代码运行的变动，如空格、格式化等）
- **refactor**: 重构（既不是新增功能，也不是修复 bug）
- **perf**: 性能优化
- **test**: 添加或修改测试
- **build**: 构建系统或外部依赖的变更（如 webpack、npm）
- **ci**: CI 配置文件和脚本的变更
- **chore**: 其他变更（如构建过程、辅助工具的变动）
- **revert**: 回滚之前的提交

### 正确示例

- ✅ `feat: add SpeedInsights component to default layout`
- ✅ `feat(layout): integrate Vercel Speed Insights`
- ✅ `fix: resolve navigation issue in mobile view`
- ✅ `fix(header): correct logo display in dark mode`
- ✅ `docs: update installation instructions`
- ✅ `style: format code with prettier`
- ✅ `refactor: simplify authentication logic`
- ✅ `perf: optimize image loading performance`
- ✅ `test: add unit tests for user service`
- ✅ `chore: update dependencies`
- ✅ `build: configure webpack for production`
- ✅ `ci: add GitHub Actions workflow`

### 错误示例

- ❌ `add SpeedInsights`（缺少 type）
- ❌ `feat add SpeedInsights`（缺少冒号）
- ❌ `feat:add SpeedInsights`（冒号后缺少空格）
- ❌ `feat: Add SpeedInsights`（subject 首字母不应大写）
- ❌ `feat: add speedinsights`（subject 应使用动词开头）

### 规则说明

1. **type 必需**：必须指定提交类型
2. **冒号后空格**：type 和 subject 之间必须有空格
3. **subject 格式**：
   - 使用小写字母开头（除非是专有名词）
   - 使用祈使语气（如 "add" 而不是 "added" 或 "adds"）
   - 不要以句号结尾
   - 长度建议不超过 50 个字符
4. **scope 可选**：用于说明影响范围，如模块、组件等
5. **多行提交**：可以在 subject 后添加空行和详细描述

## 步骤

1. **审查变更**
   - 检查差异：`git diff --cached`（如果变更已暂存）或 `git diff`（如果未暂存）
   - 理解变更内容和原因

2. **确定提交类型**
   - 根据变更内容选择合适的 type
   - 可选：确定 scope（影响范围）

3. **生成符合规范的 commit message**
   - 格式：`<type>(<scope>): <subject>`
   - 如果用户提供了描述信息但没有 type 前缀，根据变更内容自动推断并添加合适的 type
   - 如果用户提供的描述信息已经包含 type 前缀，保持原样

4. **暂存变更（如果尚未暂存）**
   - `git add -A` 或 `git add <files>`

5. **提交变更**
   - 使用符合规范的 commit message 执行提交
   - 示例：`git commit -m "feat(layout): add SpeedInsights component"`
   - 示例：`git commit -m "fix: resolve navigation issue"`

## 类型推断规则

当用户输入没有 type 前缀时，根据变更内容自动推断：

- 新增文件/功能 → `feat`
- 修改现有功能 → `feat` 或 `refactor`
- 修复错误 → `fix`
- 文档变更 → `docs`
- 测试相关 → `test`
- 依赖/构建变更 → `chore` 或 `build`
- 代码格式 → `style`
- 性能优化 → `perf`

## 模板

- 标准格式：`git commit -m "<type>(<scope>): <subject>"`
- 简化格式：`git commit -m "<type>: <subject>"`

## 注意事项

- **格式要求**：必须符合 Conventional Commits 规范
- **自动推断**：如果用户输入没有 type，根据变更内容自动添加
- **空格要求**：type 和 subject 之间必须有空格
- **subject 格式**：使用小写字母开头，祈使语气，不超过 50 字符
