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
        items.push({ id, text: el.textContent.replace(/¶$/, '').trim(), level: parseInt(el.tagName[1]) })
      }
    })
    setHeadings(items)
  }, [htmlContent])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveId(entry.target.id) })
    }, { rootMargin: '-80px 0px -70% 0px' })
    headings.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [headings])

  const relatedCommands = ['ls', 'cd', 'grep', 'find', 'cat', 'pwd', 'mkdir', 'rm'].filter(name => name !== commandName).slice(0, 5)

  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-20 space-y-6">
        <div>
          <h4 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">目录</h4>
          <nav className="space-y-1">
            {headings.map(h => (
              <a key={h.id} href={`#${h.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }) }} className={`block text-sm py-1 transition-colors truncate ${h.level === 2 ? 'pl-0' : h.level === 3 ? 'pl-3' : 'pl-6'} ${activeId === h.id ? 'text-terminal font-medium' : 'text-text-muted hover:text-text'}`}>{h.text}</a>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">相关命令</h4>
          <div className="space-y-1">
            {relatedCommands.map(name => (
              <button key={name} onClick={() => navigate(`/command/${name}`)} className="block text-sm font-mono text-text-muted hover:text-terminal transition-colors py-0.5">{name}</button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
