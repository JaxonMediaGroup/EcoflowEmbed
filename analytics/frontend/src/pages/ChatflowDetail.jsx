import { useParams, useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { truncate } from '../utils/helpers'

const COLORS = ['#3498db', '#2ecc71', '#e94560', '#e67e22', '#9b59b6', '#1abc9c', '#f39c12', '#c0392b']

const qaWithoutToolsPct = r => Number(r.qa_without_tools_pct ?? r.qa_without_info_get_pct ?? 0)
const qaWithoutToolsOver = r => r.qa_without_tools_over_threshold ?? r.qa_without_info_get_over_threshold ?? false
const qaWithoutToolsExamples = r => r.qa_without_tools_examples ?? r.qa_without_info_get_examples ?? []

export default function ChatflowDetail({ data }) {
  const { name } = useParams()
  const navigate = useNavigate()
  const decoded = decodeURIComponent(name)
  const r = data.results.find(x => x.chatflow === decoded)

  if (!r) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
          Chatflow "{decoded}" no encontrado.
          <br /><br />
          <button className="btn-export" onClick={() => navigate('/chatflows')}>← Volver a Chatflows</button>
        </div>
      </div>
    )
  }

  const gapPct = r.bot_messages > 0 ? (r.knowledge_gaps.length / r.bot_messages * 100).toFixed(1) : '0'
  const noInfoPct = qaWithoutToolsPct(r)

  // Daily volume
  const dailyData = Object.keys(r.daily_volume).sort().map(d => ({ date: d, mensajes: r.daily_volume[d] }))

  // Tool usage pie
  const toolData = Object.entries(r.tool_usage)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name: name.substring(0, 30), value }))

  // Unanswered topics
  const topicRows = Object.entries(r.unanswered_topics)
    .sort((a, b) => b[1] - a[1])
    .map(([topic, count]) => ({ cells: [count, topic] }))

  // Knowledge gap rows
  const gapRows = r.knowledge_gaps.map(g => ({
    cells: [(g.date || '').substring(0, 10), truncate(g.user_question, 150), truncate(g.bot_response, 200)]
  }))

  // Doc leak rows
  const leakRows = r.doc_leaks.map(l => ({
    cells: [(l.date || '').substring(0, 10), truncate(l.bot_response, 250)]
  }))

  // Off-topic rows
  const otRows = (r.off_topic || []).map(o => ({
    cells: [
      (o.date || '').substring(0, 10),
      o.agent_name || '-',
      o.refused
        ? <span className="badge badge-green">Bloqueado</span>
        : <span className="badge badge-red">Respondido</span>,
      truncate(o.user_question, 120),
      truncate(o.bot_response, 150),
    ]
  }))

  const noInfoRows = qaWithoutToolsExamples(r).map(e => ({
    cells: [
      (e.date || '').substring(0, 10),
      e.agent_name || '-',
      truncate(e.user_question, 150),
      truncate(e.bot_response, 220),
      (e.tools_used || []).join(', ') || '-',
    ]
  }))

  return (
    <div className="container">
      <div style={{ marginBottom: 15 }}>
        <button className="btn-export" style={{ float: 'none', marginRight: 10 }} onClick={() => navigate('/chatflows')}>
          ← Volver
        </button>
        <span style={{ fontSize: '1.3em', fontWeight: 700 }}>{r.chatflow}</span>
      </div>

      <div className="cards">
        <StatCard value={r.total_messages} label="Mensajes" color="#3498db" />
        <StatCard value={r.total_conversations} label="Conversaciones" color="#2ecc71" />
        <StatCard value={r.knowledge_gaps.length} label="Brechas" color="#e94560" />
        <StatCard value={`${gapPct}%`} label="% Brechas" color={gapPct > 15 ? '#e94560' : gapPct > 5 ? '#e67e22' : '#2ecc71'} />
        <StatCard value={r.doc_leaks.length} label="Filtraciones" color="#e67e22" />
        <StatCard value={(r.off_topic || []).length} label="Off-Topic" color="#9b59b6" />
        <StatCard value={`${noInfoPct.toFixed(1)}%`} label="Q&A sin herramientas" color={noInfoPct > 10 ? '#e94560' : noInfoPct > 5 ? '#e67e22' : '#2ecc71'} />
      </div>

      <div className="grid2">
        <div className="panel">
          <h3>📈 Volumen Diario</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} />
              <YAxis tick={{ fill: '#888', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', color: '#fff' }} />
              <Area type="monotone" dataKey="mensajes" stroke="#3498db" fill="rgba(52,152,219,.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h3>🔧 Uso de Herramientas</h3>
          {toolData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={toolData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {toolData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: '#666', padding: 40 }}>Sin datos de herramientas</div>
          )}
        </div>
      </div>

      {gapRows.length > 0 && (
        <div style={{ marginBottom: 15 }}>
          <DataTable
            title={`🔴 Brechas de Conocimiento (${gapRows.length})`}
            headers={['Fecha', 'Pregunta del Usuario', 'Respuesta del Bot']}
            rows={gapRows}
            exportName={`brechas-${r.chatflow}`}
          />
        </div>
      )}

      {otRows.length > 0 && (
        <div style={{ marginBottom: 15 }}>
          <DataTable
            title={`🚫 Off-Topic / GPT Personal (${otRows.length})`}
            headers={['Fecha', 'Agente', 'Estado', 'Pregunta', 'Respuesta']}
            rows={otRows}
            exportName={`offtopic-${r.chatflow}`}
          />
        </div>
      )}

      {qaWithoutToolsOver(r) && noInfoRows.length > 0 && (
        <div style={{ marginBottom: 15 }}>
          <DataTable
            title={`Sin herramientas en Q&A (${noInfoRows.length})`}
            headers={['Fecha', 'Agente', 'Pregunta del Usuario', 'Respuesta del Bot', 'Herramientas']}
            rows={noInfoRows}
            exportName={`sin-herramientas-${r.chatflow}`}
          />
        </div>
      )}

      {leakRows.length > 0 && (
        <div style={{ marginBottom: 15 }}>
          <DataTable
            title={`🟡 Filtraciones de Documento (${leakRows.length})`}
            headers={['Fecha', 'Respuesta del Bot']}
            rows={leakRows}
            exportName={`filtraciones-${r.chatflow}`}
          />
        </div>
      )}

      {topicRows.length > 0 && (
        <DataTable
          title={`📋 Contenido por Agregar (${topicRows.length})`}
          headers={['Veces', 'Pregunta sin Respuesta']}
          rows={topicRows}
          exportName={`contenido-${r.chatflow}`}
        />
      )}
    </div>
  )
}
