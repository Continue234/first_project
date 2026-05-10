export default function Footer({ commandCount = 615 }) {
  return (
    <footer className="border-t border-surface-lighter bg-surface/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center gap-4 text-text-muted text-sm">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <a href="https://github.com/jaywcjlove/linux-command/new/master/command" target="_blank" rel="noopener noreferrer" className="hover:text-terminal transition-colors">添加命令</a>
            <span className="text-surface-lighter">|</span>
            <a href="https://github.com/jaywcjlove/linux-command" target="_blank" rel="noopener noreferrer" className="hover:text-terminal transition-colors">GitHub</a>
            <span className="text-surface-lighter">|</span>
            <a href="https://github.com/jaywcjlove/linux-command/releases" target="_blank" rel="noopener noreferrer" className="hover:text-terminal transition-colors">Alfred</a>
            <span className="text-surface-lighter">|</span>
            <a href="https://github.com/jaywcjlove/linux-command/releases" target="_blank" rel="noopener noreferrer" className="hover:text-terminal transition-colors">Dash</a>
          </div>
          <p>共搜集到 <span className="text-terminal font-semibold">{commandCount}</span> 个 Linux 命令</p>
          <p className="text-text-muted/60">收藏本站请使用 Ctrl+D 或 Command+D</p>
        </div>
      </div>
    </footer>
  )
}
