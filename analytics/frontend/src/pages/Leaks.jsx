import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import StatCard from '../components/StatCard'
import { truncate } from '../utils/helpers'

export default function Leaks({ data }) {
  const R = data.results
  const [filter, setFilter] = useState('')

  const stats = useMemo(() => {
    const totalLeaks = R.reduce((s, r) => s + r.doc_leaks.length, 0)
    const chatflowsWithLeaks = R.filter(r => r.doc_leaks.length > 0).length
    return { totalLeaks, chatflowsWithLeaks }
  }, [R])

  const rows = useMemo(() => {
    const all = []
    R.forEach(r => {
      r.doc_leaks.forEach(l => {
        all.push({ chatflow: r.chatflow, ...l })
      })
    })
    const f = filter.toLowerCase()
    return all
      .filter(l => !f || l.chatflow.toLowerCase().includes(f) || (l.bot_response || '').toLowerCase().includes(f))
      .map(l => ({
        cells: [
          l.chatflow,
          (l.date || '').substring(0, 10),
          truncate(l.bot_response, 300),
        ]
      }))
  }, [R, filter])

  return (
    <div className="container">
      <div className="grid3">
        <StatCard value={stats.totalLeaks} label="Total Filtraciones" color="#e67e22" border="#e67e22" />
        <StatCard value={stats.chatflowsWithLeaks} label="Chatflows Afectados" color="#e67e22" />
        <StatCard value={R.length} label="Total Chatflows" color="#2ecc71" />
      </div>

      <input
        className="search-input"
        placeholder="🔍 Filtrar por chatflow o respuesta..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <DataTable
        title={`🟡 Filtraciones de Documento (${rows.length})`}
        headers={['Chatflow', 'Fecha', 'Respuesta del Bot']}
        rows={rows}
        exportName="filtraciones-completo"
        maxHeight={600}
      />

      <div className="panel" style={{ marginTop: 15 }}>
        <h3>ℹ️ ¿Qué son las filtraciones?</h3>
        <p style={{ color: '#888', lineHeight: 1.8, fontSize: '.9em' }}>
          Una <strong style={{ color: '#e67e22' }}>filtración de documento</strong> es cuando el bot dice frases como
          "según el documento", "de acuerdo al documento", "the document mentions", etc.
          <br /><br />
          Esto expone al usuario que el bot está leyendo de un archivo y rompe la ilusión de que es un
          asistente experto. El bot debería responder como si fuera su propio conocimiento, sin
          referenciar documentos internos.
        </p>
      </div>
    </div>
  )
}
