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
