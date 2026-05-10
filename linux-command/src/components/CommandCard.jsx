import { useNavigate } from 'react-router-dom'
import { highlightText } from '../utils/search'

export default function CommandCard({ command, query }) {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(`/command/${command.name}`)} className="w-full text-left group rounded-xl border border-surface-lighter bg-surface-light/50 hover:bg-surface-light hover:border-terminal/30 p-4 transition-all duration-200 hover:shadow-lg hover:shadow-terminal/5 hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-terminal/10 flex items-center justify-center shrink-0 group-hover:bg-terminal/20 transition-colors">
          <span className="text-terminal font-mono text-sm font-bold">$</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-terminal font-semibold text-lg group-hover:text-terminal transition-colors">
            {query ? highlightText(command.name, query).map(part => part.highlighted ? <mark key={part.key} className="bg-terminal/30 text-terminal rounded px-0.5">{part.text}</mark> : <span key={part.key}>{part.text}</span>) : command.name}
          </h3>
          <p className="text-text-muted text-sm mt-1 truncate">{command.description}</p>
        </div>
        <svg className="w-5 h-5 text-text-muted group-hover:text-terminal transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </div>
    </button>
  )
}
