import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { truncate, pct } from '../utils/helpers'

export default function OffTopic({ data }) {
  const R = data.results
  const [filter, setFilter] = useState('')

  const stats = useMemo(() => {
    let total = 0, answered = 0, refused = 0
    R.forEach(r => {
      total += (r.off_topic || []).length
      answered += r.off_topic_answered || 0
      refused += r.off_topic_refused || 0
    })
    const totalMsgs = R.reduce((s, r) => s + r.total_messages, 0)
    return { total, answered, refused, totalMsgs }
  }, [R])

  // By chatflow chart
  const chartData = useMemo(() => {
    return R.filter(r => (r.off_topic || []).length > 0)
      .map(r => ({
        name: r.chatflow.substring(0, 22),
        respondidos: r.off_topic_answered || 0,
        bloqueados: r.off_topic_refused || 0,
      }))
      .sort((a, b) => b.respondidos - a.respondidos)
      .slice(0, 15)
  }, [R])

  // Detail rows
  const rows = useMemo(() => {
    const all = []
    R.forEach(r => {
      (r.off_topic || []).forEach(o => {
        all.push({
          chatflow: r.chatflow,
          ...o,
        })
      })
    })
    const f = filter.toLowerCase()
    return all
      .filter(o => !f || o.chatflow.toLowerCase().includes(f) || (o.user_question || '').toLowerCase().includes(f))
      .map(o => ({
        cells: [
          o.chatflow,
          (o.date || '').substring(0, 10),
          o.agent_name || '-',
          o.refused
            ? <span className="badge badge-green">Bloqueado</span>
            : <span className="badge badge-red">Respondido</span>,
          truncate(o.user_question, 120),
          truncate(o.bot_response, 150),
        ]
      }))
  }, [R, filter])

  if (stats.total === 0) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
          🎉 No se detectaron preguntas off-topic en el período seleccionado.
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="grid3">
        <StatCard value={stats.total} label="Total Intentos Off-Topic" color="#e94560" border="#e94560" />
        <StatCard value={stats.answered} label="⚠️ Respondidos (GPT personal)" color="#e94560" border="#e94560" />
        <StatCard value={stats.refused} label="✅ Bloqueados correctamente" color="#2ecc71" border="#2ecc71" />
      </div>

      <div className="grid2">
        <div className="panel">
          <h3>🚫 Off-Topic por Chatflow</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis type="number" tick={{ fill: '#888', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 11 }} width={130} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', color: '#fff' }} />
              <Legend />
              <Bar dataKey="respondidos" stackId="a" fill="rgba(233,69,96,.8)" name="Respondidos (malo)" />
              <Bar dataKey="bloqueados" stackId="a" fill="rgba(46,204,113,.8)" name="Bloqueados (bueno)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h3>📊 Estadísticas</h3>
          <div style={{ color: '#888', lineHeight: 2, fontSize: '.95em', padding: '10px 0' }}>
            <p><strong style={{ color: '#e94560' }}>⚠️ Respondido (Malo)</strong>: El bot respondió una pregunta off-topic — fue usado como GPT personal</p>
            <p><strong style={{ color: '#2ecc71' }}>✅ Bloqueado (Bueno)</strong>: El bot rechazó correctamente la pregunta off-topic</p>
            <br />
            <p><strong>Tasa de Bloqueo:</strong>{' '}
              <span style={{ color: pct(stats.refused, stats.total) >= 80 ? '#2ecc71' : '#e94560', fontSize: '1.2em' }}>
                {pct(stats.refused, stats.total)}%
              </span>
            </p>
            <p><strong>Tasa de Abuso:</strong>{' '}
              <span style={{ color: '#e94560', fontSize: '1.2em' }}>
                {pct(stats.total, stats.totalMsgs, 2)}% de todos los mensajes
              </span>
            </p>
          </div>
        </div>
      </div>

      <input
        className="search-input"
        placeholder="🔍 Filtrar por chatflow o pregunta..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <DataTable
        title={`🚫 Detalle Off-Topic / GPT Personal (${rows.length})`}
        headers={['Chatflow', 'Fecha', 'Agente', 'Estado', 'Pregunta del Usuario', 'Respuesta del Bot']}
        rows={rows}
        exportName="off-topic-completo"
        maxHeight={500}
      />
    </div>
  )
}
