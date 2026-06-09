export function exportCSV(headers, rows, filename) {
  const bom = '\uFEFF'
  const normalizedRows = rows.map(r => Array.isArray(r) ? r : r?.cells || [])
  const csv = bom + [headers.join(','), ...normalizedRows.map(r =>
    r.map(c => '"' + cellText(c).replace(/"/g, '""') + '"').join(',')
  )].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function cellText(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(cellText).join(' ')
  if (value?.props?.children !== undefined) return cellText(value.props.children)
  return String(value)
}

export function pct(n, d, dec = 1) {
  if (!d) return '0'
  return (n / d * 100).toFixed(dec)
}

export function truncate(s, max = 120) {
  if (!s) return ''
  return s.length > max ? s.substring(0, max) + '...' : s
}
