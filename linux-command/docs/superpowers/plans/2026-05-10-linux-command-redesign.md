# Linux Command 网站重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Linux 命令搜索引擎从纯静态 HTML 站点重构为 React SPA + Tailwind CSS 应用，现代暗色极简风格。

**Architecture:** React 18 + Vite + Tailwind CSS，HashRouter 路由，命令索引数据构建时打包，详情数据按需 fetch。组件化架构：Layout 包裹全局导航，Home 页聚焦搜索，Command 页渲染详情+侧边栏。

**Tech Stack:** React 18, Vite, Tailwind CSS, React Router (HashRouter), Prism.js, Vitest, React Testing Library

---

## 文件结构

| 操作 | 文件路径 | 职责 |
|------|----------|------|
| Create | `package.json` | 项目依赖与脚本 |
| Create | `vite.config.js` | Vite 构建配置 |
| Create | `tailwind.config.js` | Tailwind 主题定制 |
| Create | `postcss.config.js` | PostCSS 配置 |
| Create | `index.html` | Vite 入口 HTML |
| Create | `scripts/migrate-data.js` | 数据迁移脚本 |
| Create | `public/data/commands.json` | 命令索引（迁移生成） |
| Create | `public/data/command-detail.json` | 命令详情 HTML（迁移生成） |
| Create | `src/main.jsx` | React 入口 |
| Create | `src/App.jsx` | 路由配置 |
| Create | `src/index.css` | Tailwind 基础 + 自定义样式 |
| Create | `src/components/Layout.jsx` | 全局布局 |
| Create | `src/components/Navbar.jsx` | 顶部导航 |
| Create | `src/components/SearchBar.jsx` | 搜索框 + 下拉补全 |
| Create | `src/components/CommandCard.jsx` | 搜索结果卡片 |
| Create | `src/components/CommandDetail.jsx` | 命令详情渲染器 |
| Create | `src/components/CodeBlock.jsx` | 代码块（高亮+复制） |
| Create | `src/components/Sidebar.jsx` | 侧边栏 TOC |
| Create | `src/components/ThemeToggle.jsx` | 暗色/亮色切换 |
| Create | `src/components/Footer.jsx` | 页脚 |
| Create | `src/pages/Home.jsx` | 首页 |
| Create | `src/pages/Command.jsx` | 命令详情页 |
| Create | `src/hooks/useSearch.js` | 搜索逻辑 hook |
| Create | `src/hooks/useTheme.js` | 主题切换 hook |
| Create | `src/utils/search.js` | 搜索算法 |
| Create | `src/__tests__/search.test.js` | 搜索算法测试 |
| Create | `src/__tests__/useSearch.test.js` | useSearch hook 测试 |

---

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`

- [ ] **Step 1: 初始化 Vite + React 项目**

在项目根目录运行：

```bash
cd c:\Users\94159\Desktop\linux-command-gh-pages
npm create vite@latest . -- --template react
```

如果提示目录非空，选择覆盖 `index.html`。

- [ ] **Step 2: 安装依赖**

```bash
npm install react-router-dom prismjs
npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: 配置 Vite**

替换 `vite.config.js` 内容：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    outDir: 'dist',
  },
})
```

- [ ] **Step 4: 配置 Tailwind**

替换 `tailwind.config.js` 内容：

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
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
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: 配置 PostCSS**

替换 `postcss.config.js` 内容：

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: 编写入口 CSS**

替换 `src/index.css` 内容：

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-surface text-text font-sans antialiased;
}

::selection {
  @apply bg-terminal/30 text-white;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-surface-lighter rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-text-muted;
}
```

- [ ] **Step 7: 编写入口 HTML**

替换 `index.html` 内容：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Linux命令搜索引擎：最专业的Linux命令大全，内容包含Linux命令手册、详解、学习，值得收藏的Linux命令速查手册。" />
    <meta name="keywords" content="Linux,Command,命令大全,Linux命令手册,Linux命令搜索引擎" />
    <link rel="icon" href="/img/favicon.ico" />
    <title>Linux 命令搜索引擎</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 8: 编写 React 入口**

替换 `src/main.jsx` 内容：

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 9: 编写 App 骨架**

替换 `src/App.jsx` 内容：

```jsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Command from './pages/Command'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/command/:name" element={<Command />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
```

- [ ] **Step 10: 创建占位组件确保构建通过**

创建 `src/components/Layout.jsx`：

```jsx
export default function Layout({ children }) {
  return <div>{children}</div>
}
```

创建 `src/pages/Home.jsx`：

```jsx
export default function Home() {
  return <div>Home</div>
}
```

创建 `src/pages/Command.jsx`：

```jsx
export default function Command() {
  return <div>Command</div>
}
```

- [ ] **Step 11: 验证构建**

```bash
npm run build
```

Expected: 构建成功，`dist/` 目录生成。

- [ ] **Step 12: 提交**

```bash
git add package.json vite.config.js tailwind.config.js postcss.config.js index.html src/
git commit -m "feat: initialize React + Vite + Tailwind project"
```

---

### Task 2: 数据迁移脚本

**Files:**
- Create: `scripts/migrate-data.js`
- Create: `public/data/commands.json` (生成)
- Create: `public/data/command-detail.json` (生成)

- [ ] **Step 1: 创建 public/data 目录**

```bash
mkdir -p public/data
```

- [ ] **Step 2: 编写迁移脚本**

创建 `scripts/migrate-data.js`：

```js
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function migrateCommandsIndex() {
  const dtPath = resolve(ROOT, 'js/dt.js')
  const content = readFileSync(dtPath, 'utf-8')
  const match = content.match(/var linux_commands=(\[[\s\S]*\]);?$/m)
  if (!match) throw new Error('Cannot parse dt.js')
  const raw = JSON.parse(match[1])
  const commands = raw.map(item => ({
    name: item.n,
    path: item.p,
    description: item.d,
  }))
  const outPath = resolve(ROOT, 'public/data/commands.json')
  writeFileSync(outPath, JSON.stringify(commands, null, 2), 'utf-8')
  console.log(`commands.json: ${commands.length} commands written`)
}

function migrateCommandDetail() {
  const cDir = resolve(ROOT, 'c')
  const files = readdirSync(cDir).filter(f => f.endsWith('.html'))
  const detail = {}

  for (const file of files) {
    const filePath = resolve(cDir, file)
    const html = readFileSync(filePath, 'utf-8')
    const markdownMatch = html.match(/<div class="markdown-body">([\s\S]*?)<\/div>\s*<!-- Linux命令行搜索引擎/)
    if (!markdownMatch) continue
    let content = markdownMatch[1].trim()
    const scriptEnd = content.lastIndexOf('</script>')
    if (scriptEnd !== -1) {
      content = content.substring(scriptEnd + 9).trim()
    }
    const name = file.replace('.html', '')
    detail[name] = content
  }

  const outPath = resolve(ROOT, 'public/data/command-detail.json')
  writeFileSync(outPath, JSON.stringify(detail), 'utf-8')
  console.log(`command-detail.json: ${Object.keys(detail).length} commands written`)
}

migrateCommandsIndex()
migrateCommandDetail()
```

- [ ] **Step 3: 在 package.json 添加迁移脚本**

在 `package.json` 的 `scripts` 中添加：

```json
"migrate": "node scripts/migrate-data.js"
```

- [ ] **Step 4: 运行迁移脚本**

```bash
npm run migrate
```

Expected: 控制台输出命令数量，`public/data/commands.json` 和 `public/data/command-detail.json` 生成。

- [ ] **Step 5: 验证数据**

```bash
node -e "const d=require('./public/data/commands.json'); console.log(d.length, d[0])"
node -e "const d=require('./public/data/command-detail.json'); console.log(Object.keys(d).length, Object.keys(d).slice(0,3))"
```

Expected: 615 条命令，详情包含 ls 等命令。

- [ ] **Step 6: 提交**

```bash
git add scripts/ public/data/
git commit -m "feat: add data migration script and generated JSON"
```

---

### Task 3: 主题系统

**Files:**
- Create: `src/hooks/useTheme.js`
- Create: `src/components/ThemeToggle.jsx`

- [ ] **Step 1: 编写 useTheme hook**

创建 `src/hooks/useTheme.js`：

```js
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'linux-command-theme'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, toggleTheme }
}
```

- [ ] **Step 2: 编写 ThemeToggle 组件**

创建 `src/components/ThemeToggle.jsx`：

```jsx
export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-10 h-10 flex items-center justify-center rounded-lg
                 bg-surface-light hover:bg-surface-lighter border border-surface-lighter
                 transition-all duration-200"
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}
```

- [ ] **Step 3: 提交**

```bash
git add src/hooks/useTheme.js src/components/ThemeToggle.jsx
git commit -m "feat: add theme system with useTheme hook and ThemeToggle component"
```

---

### Task 4: 搜索算法与 Hook

**Files:**
- Create: `src/utils/search.js`
- Create: `src/hooks/useSearch.js`
- Create: `src/__tests__/search.test.js`
- Create: `src/__tests__/useSearch.test.js`

- [ ] **Step 1: 编写搜索算法**

创建 `src/utils/search.js`：

```js
export function searchCommands(commands, query) {
  if (!query || !query.trim()) return []

  const q = query.toLowerCase().trim()
  const results = []

  for (const cmd of commands) {
    const nameLower = cmd.name.toLowerCase()
    const descLower = cmd.description.toLowerCase()

    let priority = -1
    if (nameLower === q) {
      priority = 0
    } else if (nameLower.startsWith(q)) {
      priority = 1
    } else if (nameLower.includes(q)) {
      priority = 2
    } else if (descLower.includes(q)) {
      priority = 3
    }

    if (priority >= 0) {
      results.push({ ...cmd, priority })
    }
  }

  results.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    return a.name.localeCompare(b.name)
  })

  return results.slice(0, 50)
}

export function highlightText(text, query) {
  if (!query || !query.trim()) return text
  const q = query.trim()
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? { text: part, highlighted: true, key: i }
      : { text: part, highlighted: false, key: i }
  )
}
```

- [ ] **Step 2: 编写搜索算法测试**

创建 `src/__tests__/search.test.js`：

```js
import { describe, it, expect } from 'vitest'
import { searchCommands, highlightText } from '../utils/search'

const commands = [
  { name: 'ls', description: '显示目录内容列表' },
  { name: 'lsof', description: '显示打开的文件列表' },
  { name: 'grep', description: '文本搜索工具' },
  { name: 'find', description: '在指定目录下查找文件' },
  { name: 'curl', description: '文件传输工具' },
  { name: 'less', description: '分页查看文件内容' },
]

describe('searchCommands', () => {
  it('returns empty for empty query', () => {
    expect(searchCommands(commands, '')).toEqual([])
    expect(searchCommands(commands, '  ')).toEqual([])
  })

  it('prioritizes exact name match', () => {
    const results = searchCommands(commands, 'ls')
    expect(results[0].name).toBe('ls')
  })

  it('prioritizes prefix match over contains match', () => {
    const results = searchCommands(commands, 'ls')
    const names = results.map(r => r.name)
    expect(names).toContain('ls')
    expect(names).toContain('lsof')
    expect(names.indexOf('ls')).toBeLessThan(names.indexOf('lsof'))
  })

  it('matches description', () => {
    const results = searchCommands(commands, '搜索')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].name).toBe('grep')
  })

  it('returns at most 50 results', () => {
    const many = Array.from({ length: 100 }, (_, i) => ({
      name: `cmd${i}`,
      description: 'test command',
    }))
    const results = searchCommands(many, 'cmd')
    expect(results.length).toBe(50)
  })
})

describe('highlightText', () => {
  it('returns plain text when no query', () => {
    const result = highlightText('hello', '')
    expect(result).toEqual([{ text: 'hello', highlighted: false, key: 0 }])
  })

  it('highlights matching text', () => {
    const result = highlightText('ls command', 'ls')
    expect(result).toEqual([
      { text: 'ls', highlighted: true, key: 0 },
      { text: ' command', highlighted: false, key: 1 },
    ])
  })

  it('is case insensitive', () => {
    const result = highlightText('LS Command', 'ls')
    expect(result[0]).toEqual({ text: 'LS', highlighted: true, key: 0 })
  })
})
```

- [ ] **Step 3: 运行测试验证失败**

```bash
npx vitest run src/__tests__/search.test.js
```

Expected: PASS（因为实现已写好，此步验证实现正确）

- [ ] **Step 4: 编写 useSearch hook**

创建 `src/hooks/useSearch.js`：

```js
import { useState, useMemo, useRef, useCallback } from 'react'
import { searchCommands } from '../utils/search'

export function useSearch(commands) {
  const [query, setQuery] = useState('')
  const timerRef = useRef(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const handleQueryChange = useCallback((value) => {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value)
    }, 200)
  }, [])

  const results = useMemo(() => {
    return searchCommands(commands, debouncedQuery)
  }, [commands, debouncedQuery])

  return { query, setQuery: handleQueryChange, results, isSearching: query !== debouncedQuery }
}
```

- [ ] **Step 5: 编写 useSearch hook 测试**

创建 `src/__tests__/useSearch.test.js`：

```js
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearch } from '../hooks/useSearch'

const commands = [
  { name: 'ls', description: '显示目录内容列表' },
  { name: 'grep', description: '文本搜索工具' },
  { name: 'find', description: '在指定目录下查找文件' },
]

describe('useSearch', () => {
  it('returns empty results initially', () => {
    const { result } = renderHook(() => useSearch(commands))
    expect(result.current.results).toEqual([])
  })

  it('updates query immediately', () => {
    const { result } = renderHook(() => useSearch(commands))
    act(() => {
      result.current.setQuery('ls')
    })
    expect(result.current.query).toBe('ls')
  })
})
```

- [ ] **Step 6: 运行全部测试**

```bash
npx vitest run
```

Expected: 全部 PASS

- [ ] **Step 7: 提交**

```bash
git add src/utils/search.js src/hooks/useSearch.js src/__tests__/
git commit -m "feat: add search algorithm and useSearch hook with tests"
```

---

### Task 5: Navbar 组件

**Files:**
- Create: `src/components/Navbar.jsx`

- [ ] **Step 1: 编写 Navbar 组件**

创建 `src/components/Navbar.jsx`：

```jsx
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ theme, onToggleTheme }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-surface-lighter bg-surface/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-terminal/20 flex items-center justify-center
                          group-hover:bg-terminal/30 transition-colors">
            <span className="text-terminal font-mono text-sm font-bold">$_</span>
          </div>
          <span className="text-text font-semibold text-lg hidden sm:inline">
            Linux Command
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/jaywcjlove/linux-command"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: add Navbar component with logo and theme toggle"
```

---

### Task 6: SearchBar 组件

**Files:**
- Create: `src/components/SearchBar.jsx`

- [ ] **Step 1: 编写 SearchBar 组件**

创建 `src/components/SearchBar.jsx`：

```jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { highlightText } from '../utils/search'

export default function SearchBar({ query, onQueryChange, results, isSearching }) {
  const [focused, setFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const showDropdown = focused && query.trim().length > 0

  useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const idx = selectedIndex >= 0 ? selectedIndex : 0
      if (results[idx]) {
        navigate(`/command/${results[idx].name}`)
        setFocused(false)
        inputRef.current?.blur()
      }
    } else if (e.key === 'Escape') {
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative w-full">
      <div className={`relative flex items-center rounded-xl border transition-all duration-200
                       ${focused
                         ? 'border-terminal/50 bg-surface-light shadow-lg shadow-terminal/5'
                         : 'border-surface-lighter bg-surface-light hover:border-text-muted/30'}`}>
        <svg className="absolute left-4 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="搜索 Linux 命令..."
          className="w-full bg-transparent pl-12 pr-4 py-3.5 text-text placeholder-text-muted
                     outline-none font-mono text-base"
          autoComplete="off"
        />
        {isSearching && (
          <div className="absolute right-4">
            <div className="w-4 h-4 border-2 border-terminal/30 border-t-terminal rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-surface-lighter
                        bg-surface-light/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-text-muted">
              <p className="text-lg mb-1">未找到匹配命令</p>
              <p className="text-sm">试试其他关键词</p>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-2">
              {results.slice(0, 8).map((cmd, idx) => (
                <li key={cmd.name}>
                  <button
                    onClick={() => {
                      navigate(`/command/${cmd.name}`)
                      setFocused(false)
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors
                               ${idx === selectedIndex ? 'bg-terminal/10' : 'hover:bg-surface-lighter'}`}
                  >
                    <span className="font-mono text-terminal font-semibold shrink-0">
                      {highlightText(cmd.name, query).map(part =>
                        part.highlighted
                          ? <mark key={part.key} className="bg-terminal/30 text-terminal rounded px-0.5">{part.text}</mark>
                          : <span key={part.key}>{part.text}</span>
                      )}
                    </span>
                    <span className="text-text-muted text-sm truncate">
                      {cmd.description}
                    </span>
                  </button>
                </li>
              ))}
              {results.length > 8 && (
                <li className="px-4 py-2 text-center text-text-muted text-sm border-t border-surface-lighter">
                  还有 {results.length - 8} 个结果...
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/SearchBar.jsx
git commit -m "feat: add SearchBar component with autocomplete and keyboard navigation"
```

---

### Task 7: CommandCard 组件

**Files:**
- Create: `src/components/CommandCard.jsx`

- [ ] **Step 1: 编写 CommandCard 组件**

创建 `src/components/CommandCard.jsx`：

```jsx
import { useNavigate } from 'react-router-dom'
import { highlightText } from '../utils/search'

export default function CommandCard({ command, query }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/command/${command.name}`)}
      className="w-full text-left group rounded-xl border border-surface-lighter
                 bg-surface-light/50 hover:bg-surface-light hover:border-terminal/30
                 p-4 transition-all duration-200 hover:shadow-lg hover:shadow-terminal/5
                 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-terminal/10 flex items-center justify-center
                        shrink-0 group-hover:bg-terminal/20 transition-colors">
          <span className="text-terminal font-mono text-sm font-bold">$</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-terminal font-semibold text-lg group-hover:text-terminal transition-colors">
            {query
              ? highlightText(command.name, query).map(part =>
                  part.highlighted
                    ? <mark key={part.key} className="bg-terminal/30 text-terminal rounded px-0.5">{part.text}</mark>
                    : <span key={part.key}>{part.text}</span>
                )
              : command.name
            }
          </h3>
          <p className="text-text-muted text-sm mt-1 truncate">
            {command.description}
          </p>
        </div>
        <svg className="w-5 h-5 text-text-muted group-hover:text-terminal transition-colors shrink-0 mt-1"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/CommandCard.jsx
git commit -m "feat: add CommandCard component with hover effects"
```

---

### Task 8: Footer 组件

**Files:**
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: 编写 Footer 组件**

创建 `src/components/Footer.jsx`：

```jsx
export default function Footer({ commandCount = 615 }) {
  return (
    <footer className="border-t border-surface-lighter bg-surface/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center gap-4 text-text-muted text-sm">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <a href="https://github.com/jaywcjlove/linux-command/new/master/command"
               target="_blank" rel="noopener noreferrer"
               className="hover:text-terminal transition-colors">添加命令</a>
            <span className="text-surface-lighter">|</span>
            <a href="https://github.com/jaywcjlove/linux-command"
               target="_blank" rel="noopener noreferrer"
               className="hover:text-terminal transition-colors">GitHub</a>
            <span className="text-surface-lighter">|</span>
            <a href="https://github.com/jaywcjlove/linux-command/releases"
               target="_blank" rel="noopener noreferrer"
               className="hover:text-terminal transition-colors">Alfred</a>
            <span className="text-surface-lighter">|</span>
            <a href="https://github.com/jaywcjlove/linux-command/releases"
               target="_blank" rel="noopener noreferrer"
               className="hover:text-terminal transition-colors">Dash</a>
          </div>
          <p>
            共搜集到 <span className="text-terminal font-semibold">{commandCount}</span> 个 Linux 命令
          </p>
          <p className="text-text-muted/60">收藏本站请使用 Ctrl+D 或 Command+D</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Footer.jsx
git commit -m "feat: add Footer component"
```

---

### Task 9: Layout 组件

**Files:**
- Modify: `src/components/Layout.jsx`

- [ ] **Step 1: 重写 Layout 组件**

替换 `src/components/Layout.jsx`：

```jsx
import { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../hooks/useTheme'

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Layout.jsx
git commit -m "feat: add Layout component with Navbar and Footer"
```

---

### Task 10: Home 页面

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: 重写 Home 页面**

替换 `src/pages/Home.jsx`：

```jsx
import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import CommandCard from '../components/CommandCard'
import { useSearch } from '../hooks/useSearch'

const CATEGORIES = [
  { label: '热门命令', icon: '🔥', commands: ['ls', 'cd', 'grep', 'find', 'chmod', 'chown'] },
  { label: '文件操作', icon: '📁', commands: ['cp', 'mv', 'rm', 'mkdir', 'touch', 'cat'] },
  { label: '网络管理', icon: '🌐', commands: ['curl', 'wget', 'ssh', 'ping', 'netstat', 'ifconfig'] },
  { label: '系统管理', icon: '⚙️', commands: ['top', 'ps', 'kill', 'systemctl', 'df', 'du'] },
]

export default function Home() {
  const [commands, setCommands] = useState([])
  const { query, setQuery, results, isSearching } = useSearch(commands)

  useEffect(() => {
    fetch('./data/commands.json')
      .then(res => res.json())
      .then(data => setCommands(data))
      .catch(console.error)
  }, [])

  const randomCommands = commands.length > 0
    ? [...commands].sort(() => Math.random() - 0.5).slice(0, 6)
    : []

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <div className="pt-16 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Terminal Window */}
          <div className="inline-block mb-8">
            <div className="rounded-xl border border-surface-lighter bg-surface-light overflow-hidden shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-lighter">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-text-muted text-xs font-mono">bash</span>
              </div>
              <div className="px-6 py-4 font-mono text-sm">
                <span className="text-terminal">$</span>
                <span className="inline-block w-2 h-4 bg-terminal ml-1 animate-pulse" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">
            Linux 命令搜索引擎
          </h1>
          <p className="text-text-muted mb-8">
            {commands.length} 个命令 · 最专业的 Linux 命令速查手册
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              results={results}
              isSearching={isSearching}
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {query.trim() && results.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-text-muted text-sm mb-4">
            找到 {results.length} 个结果
          </h2>
          <div className="grid gap-3">
            {results.map(cmd => (
              <CommandCard key={cmd.name} command={cmd} query={query} />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {!query.trim() && (
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {CATEGORIES.map(cat => (
              <div key={cat.label}
                   className="rounded-xl border border-surface-lighter bg-surface-light/50
                              p-4 hover:border-terminal/30 hover:bg-surface-light
                              transition-all duration-200 cursor-default">
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="text-text font-semibold text-sm mb-1">{cat.label}</h3>
                <p className="text-text-muted text-xs font-mono">{cat.commands.join(' · ')}</p>
              </div>
            ))}
          </div>

          {/* Random Commands */}
          {randomCommands.length > 0 && (
            <div>
              <h2 className="text-text-muted text-sm mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                随机推荐
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {randomCommands.map(cmd => (
                  <CommandCard key={cmd.name} command={cmd} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/Home.jsx
git commit -m "feat: add Home page with hero, search, categories, and random commands"
```

---

### Task 11: CodeBlock 组件

**Files:**
- Create: `src/components/CodeBlock.jsx`

- [ ] **Step 1: 编写 CodeBlock 组件**

创建 `src/components/CodeBlock.jsx`：

```jsx
import { useState, useRef } from 'react'

export default function CodeBlock({ code, language = 'shell' }) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative group rounded-lg border border-surface-lighter bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-lighter bg-surface-light/50">
        <span className="text-text-muted text-xs font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-text-muted hover:text-terminal
                     text-xs transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-terminal" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
              </svg>
              <span className="text-terminal">已复制</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z" />
                <path fillRule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z" />
              </svg>
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre ref={codeRef} className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/CodeBlock.jsx
git commit -m "feat: add CodeBlock component with copy functionality"
```

---

### Task 12: Sidebar 组件

**Files:**
- Create: `src/components/Sidebar.jsx`

- [ ] **Step 1: 编写 Sidebar 组件**

创建 `src/components/Sidebar.jsx`：

```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ htmlContent, commandName }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent || '', 'text/html')
    const hElements = doc.querySelectorAll('h1, h2, h3')
    const items = []
    hElements.forEach(el => {
      const id = el.id || el.querySelector('a.anchor')?.getAttribute('href')?.replace('#', '')
      if (id && el.textContent) {
        items.push({
          id,
          text: el.textContent.replace(/¶$/, '').trim(),
          level: parseInt(el.tagName[1]),
        })
      }
    })
    setHeadings(items)
  }, [htmlContent])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  const relatedCommands = ['ls', 'cd', 'grep', 'find', 'cat', 'pwd', 'mkdir', 'rm']
    .filter(name => name !== commandName)
    .slice(0, 5)

  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-20 space-y-6">
        {/* TOC */}
        <div>
          <h4 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            目录
          </h4>
          <nav className="space-y-1">
            {headings.map(h => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`block text-sm py-1 transition-colors truncate
                           ${h.level === 2 ? 'pl-0' : h.level === 3 ? 'pl-3' : 'pl-6'}
                           ${activeId === h.id
                             ? 'text-terminal font-medium'
                             : 'text-text-muted hover:text-text'}`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </div>

        {/* Related Commands */}
        <div>
          <h4 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            相关命令
          </h4>
          <div className="space-y-1">
            {relatedCommands.map(name => (
              <button
                key={name}
                onClick={() => navigate(`/command/${name}`)}
                className="block text-sm font-mono text-text-muted hover:text-terminal transition-colors py-0.5"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Sidebar.jsx
git commit -m "feat: add Sidebar component with TOC and related commands"
```

---

### Task 13: CommandDetail 组件

**Files:**
- Create: `src/components/CommandDetail.jsx`

- [ ] **Step 1: 编写 CommandDetail 组件**

创建 `src/components/CommandDetail.jsx`：

```jsx
import { useEffect, useRef } from 'react'
import Sidebar from './Sidebar'

export default function CommandDetail({ htmlContent, commandName }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current || !htmlContent) return
    const pres = contentRef.current.querySelectorAll('pre')
    pres.forEach(pre => {
      const code = pre.querySelector('code')
      if (!code) return
      const raw = code.textContent || ''
      const copiedDiv = pre.querySelector('.copied')
      if (copiedDiv) {
        copiedDiv.remove()
      }
      pre.setAttribute('data-raw-code', raw)
    })
  }, [htmlContent])

  const handleCopy = (e) => {
    const btn = e.target.closest('[data-copy-btn]')
    if (!btn) return
    const pre = btn.closest('pre')
    if (!pre) return
    const raw = pre.getAttribute('data-raw-code') || pre.textContent
    navigator.clipboard.writeText(raw).then(() => {
      btn.textContent = '✓'
      setTimeout(() => { btn.textContent = '复制' }, 2000)
    }).catch(() => {})
  }

  if (!htmlContent) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted text-lg">加载中...</p>
      </div>
    )
  }

  return (
    <div className="flex gap-8 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex-1 min-w-0">
        <div
          ref={contentRef}
          onClick={handleCopy}
          className="prose prose-invert max-w-none
                     prose-headings:text-text prose-headings:border-b prose-headings:border-surface-lighter
                     prose-h1:text-3xl prose-h1:pb-2 prose-h1:mb-4
                     prose-h2:text-xl prose-h2:pb-2 prose-h2:mb-3
                     prose-h3:text-lg prose-h3:mb-2
                     prose-p:text-text-muted prose-p:leading-relaxed
                     prose-a:text-terminal prose-a:no-underline hover:prose-a:underline
                     prose-code:text-terminal prose-code:bg-surface-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                     prose-pre:bg-surface prose-pre:border prose-pre:border-surface-lighter prose-pre:rounded-lg
                     prose-strong:text-text
                     prose-li:text-text-muted
                     prose-blockquote:border-terminal/30 prose-blockquote:text-text-muted
                     markdown-body"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <div className="mt-8 pt-6 border-t border-surface-lighter flex gap-4">
          <a
            href={`https://github.com/jaywcjlove/linux-command/edit/master/command/${commandName}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-muted hover:text-terminal transition-colors"
          >
            纠正错误
          </a>
          <a
            href={`https://github.com/jaywcjlove/linux-command/edit/master/command/${commandName}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-muted hover:text-terminal transition-colors"
          >
            添加实例
          </a>
        </div>
      </div>
      <Sidebar htmlContent={htmlContent} commandName={commandName} />
    </div>
  )
}
```

- [ ] **Step 2: 添加 markdown-body 样式到 index.css**

在 `src/index.css` 末尾追加：

```css
.markdown-body .edit_btn {
  display: none;
}

.markdown-body pre {
  position: relative;
}

.markdown-body pre code {
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace !important;
  font-size: 0.875rem;
  line-height: 1.7;
}

.markdown-body .code-line {
  display: block;
  padding-left: 1rem;
  position: relative;
}

.markdown-body .line-number::before {
  content: attr(line);
  position: absolute;
  left: -0.5rem;
  width: 2rem;
  text-align: right;
  color: #484f58;
  font-size: 0.75rem;
  user-select: none;
}

.markdown-body .token.comment { color: #8b949e; }
.markdown-body .token.function { color: #d2a8ff; }
.markdown-body .token.parameter { color: #ffa657; }
.markdown-body .token.variable { color: #79c0ff; }
.markdown-body .token.string { color: #a5d6ff; }
.markdown-body .token.keyword { color: #ff7b72; }
.markdown-body .token.number { color: #79c0ff; }
.markdown-body .token.operator { color: #ff7b72; }
.markdown-body .token.punctuation { color: #c9d1d9; }
.markdown-body .token.builtin { color: #ffa657; }
```

- [ ] **Step 3: 提交**

```bash
git add src/components/CommandDetail.jsx src/index.css
git commit -m "feat: add CommandDetail component with markdown rendering and code styling"
```

---

### Task 14: Command 页面

**Files:**
- Modify: `src/pages/Command.jsx`

- [ ] **Step 1: 重写 Command 页面**

替换 `src/pages/Command.jsx`：

```jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CommandDetail from '../components/CommandDetail'
import SearchBar from '../components/SearchBar'
import { useSearch } from '../hooks/useSearch'

export default function Command() {
  const { name } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [commands, setCommands] = useState([])
  const { query, setQuery, results, isSearching } = useSearch(commands)

  useEffect(() => {
    fetch('./data/commands.json')
      .then(res => res.json())
      .then(data => setCommands(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch('./data/command-detail.json')
      .then(res => res.json())
      .then(data => {
        if (data[name]) {
          setDetail(data[name])
        } else {
          setError(true)
        }
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [name])

  return (
    <div className="py-6">
      {/* Inline Search */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          results={results}
          isSearching={isSearching}
        />
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-terminal/30 border-t-terminal rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">加载中...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-text text-xl font-semibold mb-2">未找到命令</h2>
          <p className="text-text-muted mb-6">
            找不到名为 <code className="text-terminal bg-surface-light px-2 py-0.5 rounded font-mono">{name}</code> 的命令
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terminal/10 text-terminal
                       hover:bg-terminal/20 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>
      )}

      {!loading && !error && detail && (
        <CommandDetail htmlContent={detail} commandName={name} />
      )}
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/Command.jsx
git commit -m "feat: add Command page with detail loading and 404 handling"
```

---

### Task 15: 最终集成与验证

**Files:**
- Modify: `src/App.jsx` (添加错误边界)
- Modify: `package.json` (添加 vitest 配置)

- [ ] **Step 1: 添加错误边界到 App**

替换 `src/App.jsx`：

```jsx
import { Component } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Command from './pages/Command'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <h2 className="text-text text-xl mb-2">出了点问题</h2>
            <p className="text-text-muted mb-4">页面加载时发生错误</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-terminal/10 text-terminal hover:bg-terminal/20 transition-colors"
            >
              重新加载
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/command/:name" element={<Command />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ErrorBoundary>
  )
}
```

- [ ] **Step 2: 添加 vitest 配置到 package.json**

在 `package.json` 中添加：

```json
"vitest": {
  "environment": "jsdom",
  "globals": true
}
```

- [ ] **Step 3: 运行全部测试**

```bash
npx vitest run
```

Expected: 全部 PASS

- [ ] **Step 4: 运行开发服务器验证**

```bash
npm run dev
```

Expected: 浏览器打开后可见暗色主题首页，搜索框可用，点击结果跳转详情页。

- [ ] **Step 5: 构建生产版本**

```bash
npm run build
```

Expected: `dist/` 目录生成，无构建错误。

- [ ] **Step 6: 提交**

```bash
git add src/App.jsx package.json
git commit -m "feat: add ErrorBoundary and finalize integration"
```

---

### Task 16: 清理旧文件

**Files:**
- 保留 `c/` 目录和 `js/` 目录（旧版兼容）
- 保留 `img/` 目录

- [ ] **Step 1: 确认新站点功能完整**

在浏览器中验证：
1. 首页搜索功能正常
2. 点击搜索结果跳转详情页
3. 详情页 TOC 导航正常
4. 代码块复制功能正常
5. 暗色/亮色切换正常
6. 移动端响应式布局正常

- [ ] **Step 2: 将 img 资源复制到 public**

```bash
cp -r img/ public/img/
```

- [ ] **Step 3: 最终提交**

```bash
git add public/img/
git commit -m "chore: copy image assets to public directory"
```
