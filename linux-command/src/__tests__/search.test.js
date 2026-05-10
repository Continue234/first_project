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
