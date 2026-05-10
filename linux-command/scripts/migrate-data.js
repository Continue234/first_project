import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function migrateCommandsIndex() {
  const dtPath = resolve(ROOT, 'js/dt.js')
  const content = readFileSync(dtPath, 'utf-8')
  const match = content.match(/var linux_commands=(\[[\s\S]*\]);?$/m)
  if (!match) throw new Error('Cannot parse dt.js')
  const raw = JSON.parse(match[1])
  const commands = raw.map(item => ({
    name: item.n,
    path: item.p,
    description: item.d,
  }))
  const outPath = resolve(ROOT, 'public/data/commands.json')
  writeFileSync(outPath, JSON.stringify(commands, null, 2), 'utf-8')
  console.log(`commands.json: ${commands.length} commands written`)
}

function extractMarkdownBody(html) {
  const startMarker = '<div class="markdown-body">'
  const startIdx = html.indexOf(startMarker)
  if (startIdx === -1) return null

  const contentStart = startIdx + startMarker.length

  let depth = 1
  let i = contentStart
  while (i < html.length && depth > 0) {
    if (html.substring(i, i + 4) === '<div') {
      depth++
      i += 4
    } else if (html.substring(i, i + 6) === '</div>') {
      depth--
      if (depth === 0) break
      i += 6
    } else {
      i++
    }
  }

  if (depth !== 0) return null
  return html.substring(contentStart, i).trim()
}

function cleanMarkdownContent(content) {
  let cleaned = content

  const msStart = cleaned.indexOf('<markdown-style')
  const msEnd = cleaned.indexOf('</markdown-style>')
  if (msStart !== -1 && msEnd !== -1) {
    const msTagEnd = cleaned.indexOf('>', msStart) + 1
    cleaned = cleaned.substring(msTagEnd, msEnd)
  }

  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '')
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '')
  cleaned = cleaned.replace(/<dark-mode[^>]*><\/dark-mode>/gi, '')
  cleaned = cleaned.replace(/<span class="edit_btn">[\s\S]*?<\/span>/gi, '')

  return cleaned.trim()
}

function migrateCommandDetail() {
  const cDir = resolve(ROOT, 'c')
  const files = readdirSync(cDir).filter(f => f.endsWith('.html'))
  const detail = {}
  let skipped = 0

  for (const file of files) {
    const filePath = resolve(cDir, file)
    const html = readFileSync(filePath, 'utf-8')
    const rawContent = extractMarkdownBody(html)
    if (!rawContent) {
      skipped++
      continue
    }
    const content = cleanMarkdownContent(rawContent)
    if (content.length < 10) {
      skipped++
      continue
    }
    const name = file.replace('.html', '')
    detail[name] = content
  }

  const outPath = resolve(ROOT, 'public/data/command-detail.json')
  writeFileSync(outPath, JSON.stringify(detail), 'utf-8')
  console.log(`command-detail.json: ${Object.keys(detail).length} commands written, ${skipped} skipped`)
}

migrateCommandsIndex()
migrateCommandDetail()
