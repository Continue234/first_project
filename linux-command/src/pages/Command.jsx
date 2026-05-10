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
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <SearchBar query={query} onQueryChange={setQuery} results={results} isSearching={isSearching} />
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
          <p className="text-text-muted mb-6">找不到名为 <code className="text-terminal bg-surface-light px-2 py-0.5 rounded font-mono">{name}</code> 的命令</p>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terminal/10 text-terminal hover:bg-terminal/20 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            返回首页
          </Link>
        </div>
      )}
      {!loading && !error && detail && <CommandDetail htmlContent={detail} commandName={name} />}
    </div>
  )
}
