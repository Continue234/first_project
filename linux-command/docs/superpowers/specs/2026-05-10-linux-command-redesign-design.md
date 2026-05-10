# Linux Command 网站重构设计文档

## 概述

将 Linux 命令搜索引擎（当前纯静态 HTML 站点）重构为 React SPA + Tailwind CSS 应用，采用现代暗色极简视觉风格，提升 UI 品质和交互体验。

## 技术方案

**React 18 + Vite + Tailwind CSS + React Router (HashRouter)**

- 组件化架构，搜索框、命令卡片、代码块等独立维护
- Tailwind 快速实现暗色极简风格，自定义主题方便
- Vite 构建后输出静态文件，部署到 GitHub Pages 不变
- HashRouter 兼容 GitHub Pages 无服务端路由

## 项目结构

```
linux-command/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── scripts/
│   └── migrate-data.js          # 数据迁移脚本
├── public/
│   ├── data/
│   │   ├── commands.json        # 命令索引数据
│   │   └── command-detail.json  # 命令详情 HTML
│   └── img/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── CommandCard.jsx
│   │   ├── CommandDetail.jsx
│   │   ├── CodeBlock.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Command.jsx
│   ├── hooks/
│   │   ├── useSearch.js
│   │   └── useTheme.js
│   └── utils/
│       └── search.js
```

## 视觉设计

### 整体风格

- 暗色极简：深灰/近黑背景 `#0d1117`，灰白文字 `#c9d1d9`
- 毛玻璃效果：导航栏和卡片使用 `backdrop-filter: blur()` 半透明
- 等宽字体：JetBrains Mono / Fira Code 用于命令名和代码块
- 强调色：终端绿 `#3fb950`，用于链接、高亮、按钮
- 大量留白，内容区最大宽度 960px 居中

### Tailwind 主题

```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: '#3fb950',
        surface: {
          DEFAULT: '#0d1117',
          light: '#161b22',
          lighter: '#21262d',
        },
        text: {
          DEFAULT: '#c9d1d9',
          muted: '#8b949e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    }
  }
}
```

亮色模式通过 `dark:` 前缀控制，自动切换为白底深字。

### 首页布局

- Hero 区域模拟终端窗口，带闪烁光标动画
- 居中大搜索框，实时下拉补全，匹配关键词高亮为绿色
- 分类卡片（热门、文件操作、网络管理、系统管理），hover 微上浮 + 边框发光
- 随机命令推荐区域，每次刷新展示不同命令

### 命令详情页布局

- 左侧固定侧边栏：TOC 目录导航 + 相关命令快速跳转
- 右侧内容区：Markdown 渲染，代码块带行号 + 复制按钮
- 代码块 hover 时右上角浮现复制按钮，点击后变为 ✓ 反馈
- 标题锚点链接，hover 时显示链接图标
- 移动端侧边栏折叠为顶部横向标签

### 搜索交互

- 输入时实时过滤，200ms 防抖
- 排序：命令名精确匹配 > 前缀匹配 > 描述匹配
- 下拉列表最多 8 条，超出显示"查看全部结果"
- 键盘 ↑↓ 导航，Enter 跳转
- 搜索关键词在结果中用绿色高亮

## 数据流

```
commands.json (构建时打包)
       │
       ▼
  useSearch hook ◄──── 用户输入
       │
       ├── 模糊匹配 + 排序
       │
       ▼
  SearchBar (下拉补全)    Home (结果列表)
       │                       │
       ▼                       ▼
  CommandCard × N         CommandCard × N
       │                       │
       ▼                       ▼
  React Router ──────► Command 页面
                            │
                            ▼
                     command-detail.json 按需加载
                            │
                            ▼
                     CommandDetail 渲染
                       │           │
                       ▼           ▼
                   CodeBlock    Sidebar TOC
```

## 核心 Hook

### useSearch(commands, query)

- 输入：完整命令列表 + 搜索关键词
- 输出：`{ results, isSearching }`
- 逻辑：200ms 防抖 → 三级优先排序（精确 > 前缀 > 描述）→ 同级字母序 → 最多 50 条

### useTheme()

- 读取 localStorage 主题偏好
- 监听系统 prefers-color-scheme 变化
- 切换时更新 document.documentElement 的 class
- 输出：`{ theme, toggleTheme }`

## 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/#/` | Home | 首页搜索 |
| `/#/list` | Home (list mode) | 全部命令列表 |
| `/#/command/:name` | Command | 命令详情 |

## 数据迁移

编写 Node.js 脚本 `scripts/migrate-data.js`：

1. 读取 `js/dt.js` → 输出 `public/data/commands.json`（命令索引：名称、路径、描述）
2. 遍历 `c/*.html` → 提取 markdown-body 内的 HTML → 输出 `public/data/command-detail.json`（键为命令名，值为 HTML 内容）

旧 URL 不保留兼容重定向，因为 GitHub Pages 无法做服务端重定向。

## 错误处理

| 场景 | 处理方式 |
|------|----------|
| 搜索无结果 | 空状态插图 + "未找到匹配命令，试试其他关键词" |
| 命令详情不存在 | 404 页面，提供搜索框和返回首页链接 |
| 数据加载失败 | 全局错误边界捕获，显示重试按钮 |
| 路由不匹配 | 兜底重定向到首页 |

## 测试策略

- 单元测试：Vitest + React Testing Library
  - useSearch hook：搜索排序逻辑、防抖、空查询
  - search.js 工具函数：模糊匹配、高亮标记
- 组件测试：
  - SearchBar：输入触发回调、键盘导航、下拉显示/隐藏
  - CodeBlock：复制功能、语法高亮渲染
  - ThemeToggle：切换主题、持久化
- E2E 测试（可选）：Playwright 首页搜索 → 点击结果 → 详情页 → 返回

## 性能考量

- commands.json 约 30KB gzip，首屏加载无压力
- command-detail.json 约 2-3MB gzip，详情页组件使用 React.lazy() 代码分割，command-detail.json 在详情页挂载时通过 fetch() 按需加载
- 搜索在客户端执行，615 条数据量无需虚拟化
- 代码分割：详情页路由 lazy() 加载

## 重构范围

核心页面优先：
1. 首页（搜索体验）
2. 命令详情页

列表页和贡献者页后续迭代。
