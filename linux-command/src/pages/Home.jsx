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

  const [selectedCategory, setSelectedCategory] = useState(null)

  const categoryCommands = selectedCategory
    ? commands.filter(cmd => selectedCategory.commands.includes(cmd.name))
    : []

  const randomCommands = commands.length > 0
    ? [...commands].sort(() => Math.random() - 0.5).slice(0, 6)
    : []

  const handleCategoryClick = (cat) => {
    if (selectedCategory?.label === cat.label) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(cat)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="pt-16 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
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
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">Linux 命令搜索引擎</h1>
          <p className="text-text-muted mb-8">{commands.length} 个命令 · 最专业的 Linux 命令速查手册</p>
          <div className="max-w-xl mx-auto">
            <SearchBar query={query} onQueryChange={setQuery} results={results} isSearching={isSearching} />
          </div>
        </div>
      </div>
      {query.trim() && results.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-text-muted text-sm mb-4">找到 {results.length} 个结果</h2>
          <div className="grid gap-3">
            {results.map(cmd => <CommandCard key={cmd.name} command={cmd} query={query} />)}
          </div>
        </div>
      )}
      {!query.trim() && (
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => handleCategoryClick(cat)}
                className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                  selectedCategory?.label === cat.label
                    ? 'border-terminal/50 bg-terminal/10 shadow-lg shadow-terminal/5'
                    : 'border-surface-lighter bg-surface-light/50 hover:border-terminal/30 hover:bg-surface-light'
                }`}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className={`font-semibold text-sm mb-1 ${selectedCategory?.label === cat.label ? 'text-terminal' : 'text-text'}`}>{cat.label}</h3>
                <p className="text-text-muted text-xs font-mono">{cat.commands.join(' · ')}</p>
              </button>
            ))}
          </div>
          {selectedCategory && categoryCommands.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-muted text-sm flex items-center gap-2">
                  <span>{selectedCategory.icon}</span>
                  {selectedCategory.label}
                </h2>
                <button onClick={() => setSelectedCategory(null)} className="text-text-muted hover:text-terminal text-xs transition-colors">
                  收起
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryCommands.map(cmd => <CommandCard key={cmd.name} command={cmd} />)}
              </div>
            </div>
          )}
          {randomCommands.length > 0 && (
            <div>
              <h2 className="text-text-muted text-sm mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                随机推荐
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {randomCommands.map(cmd => <CommandCard key={cmd.name} command={cmd} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
