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
      const copiedDiv = pre.querySelector('.copied')
      if (copiedDiv) copiedDiv.remove()
      pre.setAttribute('data-raw-code', code.textContent || '')
    })
  }, [htmlContent])

  if (!htmlContent) {
    return <div className="text-center py-20"><p className="text-text-muted text-lg">加载中...</p></div>
  }

  return (
    <div className="flex gap-8 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex-1 min-w-0">
        <div ref={contentRef} className="prose prose-invert max-w-none prose-headings:text-text prose-headings:border-b prose-headings:border-surface-lighter prose-h1:text-3xl prose-h1:pb-2 prose-h1:mb-4 prose-h2:text-xl prose-h2:pb-2 prose-h2:mb-3 prose-h3:text-lg prose-h3:mb-2 prose-p:text-text-muted prose-p:leading-relaxed prose-a:text-terminal prose-a:no-underline hover:prose-a:underline prose-code:text-terminal prose-code:bg-surface-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-surface prose-pre:border prose-pre:border-surface-lighter prose-pre:rounded-lg prose-strong:text-text prose-li:text-text-muted prose-blockquote:border-terminal/30 prose-blockquote:text-text-muted markdown-body" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <div className="mt-8 pt-6 border-t border-surface-lighter flex gap-4">
          <a href={`https://github.com/jaywcjlove/linux-command/edit/master/command/${commandName}.md`} target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-terminal transition-colors">纠正错误</a>
          <a href={`https://github.com/jaywcjlove/linux-command/edit/master/command/${commandName}.md`} target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-terminal transition-colors">添加实例</a>
        </div>
      </div>
      <Sidebar htmlContent={htmlContent} commandName={commandName} />
    </div>
  )
}
