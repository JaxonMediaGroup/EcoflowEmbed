import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import StatCard from '../components/StatCard'
import { truncate } from '../utils/helpers'

export default function Brechas({ data }) {
  const R = data.results
  const [filter, setFilter] = useState('')

  const stats = useMemo(() => {
    const totalGaps = R.reduce((s, r) => s + r.knowledge_gaps.length, 0)
    const totalBotMsgs = R.reduce((s, r) => s + r.bot_messages, 0)
    const chatflowsWithGaps = R.filter(r => r.knowledge_gaps.length > 0).length
    return { totalGaps, totalBotMsgs, chatflowsWithGaps }
  }, [R])

  // Gap detail rows
  const gapRows = useMemo(() => {
    const all = []
    R.forEach(r => {
      r.knowledge_gaps.forEach(g => {
        all.push({ chatflow: r.chatflow, ...g })
      })
    })
    const f = filter.toLowerCase()
    return all
      .filter(g => !f || g.chatflow.toLowerCase().includes(f) || (g.user_question || '').toLowerCase().includes(f))
      .map(g => ({
        cells: [
          g.chatflow,
          (g.date || '').substring(0, 10),
          truncate(g.user_question, 150),
          truncate(g.bot_response, 200),
        ]
      }))
  }, [R, filter])

  // Content suggestions
  const sugRows = useMemo(() => {
    return (data.suggestions || []).map(s => ({
      cells: [s[1], s[0]]
    }))
  }, [data.suggestions])

  return (
    <div className="container">
      <div className="grid3">
        <StatCard value={stats.totalGaps} label="Total Brechas" color="#e94560" border="#e94560" />
        <StatCard value={stats.chatflowsWithGaps} label="Chatflows Afectados" color="#e67e22" />
        <StatCard
          value={stats.totalBotMsgs > 0 ? (stats.totalGaps / stats.totalBotMsgs * 100).toFixed(1) + '%' : '0%'}
          label="% Global de Brechas"
          color={stats.totalGaps / stats.totalBotMsgs * 100 > 10 ? '#e94560' : '#2ecc71'}
        />
      </div>

      <input
        className="search-input"
        placeholder="🔍 Filtrar por chatflow o pregunta..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <div style={{ marginBottom: 15 }}>
        <DataTable
          title={`🔴 Brechas de Conocimiento (${gapRows.length})`}
          headers={['Chatflow', 'Fecha', 'Pregunta del Usuario', 'Respuesta del Bot']}
          rows={gapRows}
          exportName="brechas-completo"
          maxHeight={500}
        />
      </div>

      <DataTable
        title={`📋 Contenido Sugerido para Agregar (${sugRows.length})`}
        headers={['Veces', 'Pregunta sin Respuesta']}
        rows={sugRows}
        exportName="contenido-sugerido"
      />
    </div>
  )
}
