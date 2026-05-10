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
