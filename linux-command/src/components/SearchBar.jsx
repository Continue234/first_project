import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { highlightText } from '../utils/search'

export default function SearchBar({ query, onQueryChange, results, isSearching }) {
  const [focused, setFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const showDropdown = focused && query.trim().length > 0

  useEffect(() => { setSelectedIndex(-1) }, [query])

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
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${focused ? 'border-terminal/50 bg-surface-light shadow-lg shadow-terminal/5' : 'border-surface-lighter bg-surface-light hover:border-text-muted/30'}`}>
        <svg className="absolute left-4 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input ref={inputRef} type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 200)} onKeyDown={handleKeyDown} placeholder="搜索 Linux 命令..." className="w-full bg-transparent pl-12 pr-4 py-3.5 text-text placeholder-text-muted outline-none font-mono text-base" autoComplete="off" />
        {isSearching && (
          <div className="absolute right-4"><div className="w-4 h-4 border-2 border-terminal/30 border-t-terminal rounded-full animate-spin" /></div>
        )}
      </div>
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-surface-lighter bg-surface-light/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-text-muted"><p className="text-lg mb-1">未找到匹配命令</p><p className="text-sm">试试其他关键词</p></div>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-2">
              {results.slice(0, 8).map((cmd, idx) => (
                <li key={cmd.name}>
                  <button onClick={() => { navigate(`/command/${cmd.name}`); setFocused(false) }} className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${idx === selectedIndex ? 'bg-terminal/10' : 'hover:bg-surface-lighter'}`}>
                    <span className="font-mono text-terminal font-semibold shrink-0">
                      {highlightText(cmd.name, query).map(part => part.highlighted ? <mark key={part.key} className="bg-terminal/30 text-terminal rounded px-0.5">{part.text}</mark> : <span key={part.key}>{part.text}</span>)}
                    </span>
                    <span className="text-text-muted text-sm truncate">{cmd.description}</span>
                  </button>
                </li>
              ))}
              {results.length > 8 && <li className="px-4 py-2 text-center text-text-muted text-sm border-t border-surface-lighter">还有 {results.length - 8} 个结果...</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
