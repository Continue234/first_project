export function searchCommands(commands, query) {
  if (!query || !query.trim()) return []

  const q = query.toLowerCase().trim()
  const results = []

  for (const cmd of commands) {
    const nameLower = cmd.name.toLowerCase()
    const descLower = cmd.description.toLowerCase()

    let priority = -1
    if (nameLower === q) {
      priority = 0
    } else if (nameLower.startsWith(q)) {
      priority = 1
    } else if (nameLower.includes(q)) {
      priority = 2
    } else if (descLower.includes(q)) {
      priority = 3
    }

    if (priority >= 0) {
      results.push({ ...cmd, priority })
    }
  }

  results.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    return a.name.localeCompare(b.name)
  })

  return results.slice(0, 50)
}

export function highlightText(text, query) {
  if (!query || !query.trim()) return [{ text, highlighted: false, key: 0 }]
  const q = query.trim()
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts
    .filter(part => part.length > 0)
    .map((part, i) => {
      const isMatch = part.toLowerCase() === q.toLowerCase()
      return { text: part, highlighted: isMatch, key: i }
    })
}
