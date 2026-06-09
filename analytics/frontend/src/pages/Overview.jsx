import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import StatCard from '../components/StatCard'
import { IconAlert, IconArrowRight, IconBot, IconBrain, IconSearch, IconShield, IconTools, IconTrend } from '../components/Icons'

const qaWithoutToolsCount = r => r.qa_without_tools_count ?? r.qa_without_info_get_count ?? 0
const qaWithoutToolsPct = r => Number(r.qa_without_tools_pct ?? r.qa_without_info_get_pct ?? 0)
const qaWithoutToolsOver = r => r.qa_without_tools_over_threshold ?? r.qa_without_info_get_over_threshold ?? false

const chartText = { fill: '#9FB0C5', fontSize: 11 }
const tooltipStyle = { background: '#111A27', border: '1px solid #344861', color: '#E6EDF5', borderRadius: 8 }
const badgeClass = value => value > 10 ? 'badge-red' : value > 5 ? 'badge-orange' : 'badge-green'

export default function Overview({ data }) {
  const navigate = useNavigate()
  const R = useMemo(() => data.results || [], [data.results])
  const [query, setQuery] = useState('')

  const stats = useMemo(() => {
    let totalMsgs = 0
    let totalConvos = 0
    let totalGaps = 0
    let totalLeaks = 0
    let totalOTA = 0
    let totalQaMsgs = 0
    let totalQaNoTools = 0
    let totalNoToolAlerts = 0
    R.forEach(r => {
      totalMsgs += r.total_messages || 0
      totalConvos += r.total_conversations || 0
      totalGaps += r.knowledge_gaps?.length || 0
      totalLeaks += r.doc_leaks?.length || 0
      totalOTA += r.off_topic_answered || 0
      totalQaMsgs += r.qa_bot_messages || 0
      totalQaNoTools += qaWithoutToolsCount(r)
      if (qaWithoutToolsOver(r)) totalNoToolAlerts += 1
    })
    const totalIssues = totalGaps + totalLeaks + totalOTA + totalNoToolAlerts
    const totalBotMsgs = R.reduce((s, r) => s + (r.bot_messages || 0), 0)
    const activeChatflows = R.filter(r => r.total_messages > 0).length
    const healthScore = totalBotMsgs > 0 ? Math.max(0, 100 - (totalIssues / totalBotMsgs * 100)) : 100
    const globalNoToolsPct = totalQaMsgs > 0 ? totalQaNoTools / totalQaMsgs * 100 : 0
    return { totalMsgs, totalConvos, totalGaps, totalLeaks, totalOTA, totalQaMsgs, totalQaNoTools, totalNoToolAlerts, totalIssues, activeChatflows, healthScore, globalNoToolsPct }
  }, [R])

  const dailyData = useMemo(() => {
    const daily = {}
    R.forEach(r => Object.entries(r.daily_volume || {}).forEach(([d, v]) => { daily[d] = (daily[d] || 0) + v }))
    return Object.keys(daily).sort().map(d => ({ date: d, mensajes: daily[d] }))
  }, [R])

  const topChatflows = useMemo(() => R.filter(r => r.total_messages > 0)
    .sort((a, b) => (b.total_messages || 0) - (a.total_messages || 0))
    .slice(0, 12)
    .map(r => ({ name: r.chatflow.length > 28 ? `${r.chatflow.substring(0, 28)}...` : r.chatflow, mensajes: r.total_messages })),
  [R])

  const priorities = useMemo(() => [
    { label: 'Brechas de conocimiento', value: stats.totalGaps, helper: 'Preguntas sin respuesta útil', tone: stats.totalGaps > 0 ? 'critical' : 'ok', to: '/quality' },
    { label: 'Q&A sin herramientas', value: stats.totalNoToolAlerts, helper: 'Chatbots sobre el umbral de 10%', tone: stats.totalNoToolAlerts > 0 ? 'critical' : 'ok', to: '/quality' },
    { label: 'Off-topic respondido', value: stats.totalOTA, helper: 'Casos donde el guardrail no bloqueó', tone: stats.totalOTA > 0 ? 'warning' : 'ok', to: '/quality' },
    { label: 'Filtraciones', value: stats.totalLeaks, helper: 'Menciones al documento/fuente', tone: stats.totalLeaks > 0 ? 'warning' : 'ok', to: '/quality' },
  ].sort((a, b) => Number(b.value) - Number(a.value)), [stats])

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    return R.filter(r => r.total_messages > 0)
      .filter(r => !q || r.chatflow.toLowerCase().includes(q))
      .sort((a, b) => qaWithoutToolsPct(b) - qaWithoutToolsPct(a) || (b.total_messages || 0) - (a.total_messages || 0))
  }, [R, query])

  return (
    <div className="container overview-page">
      <section className="page-header">
        <div>
          <span className="eyebrow">Diagnóstico operativo</span>
          <h1>Dashboard</h1>
          <p>Primero detecta qué está mal, luego entra a la evidencia y finalmente actúa.</p>
        </div>
        <div className={`health-panel ${stats.healthScore >= 90 ? 'ok' : stats.healthScore >= 70 ? 'warning' : 'critical'}`}>
          <span>Salud general</span>
          <strong>{stats.healthScore.toFixed(0)}%</strong>
        </div>
      </section>

      <div className="cards cards-tight">
        <StatCard value={stats.totalMsgs.toLocaleString()} label="Mensajes" color="#60A5FA" icon={<IconTrend />} />
        <StatCard value={stats.totalConvos.toLocaleString()} label="Conversaciones" color="#2DD4BF" icon={<IconBrain />} />
        <StatCard value={stats.activeChatflows} label="Chatflows activos" color="#34D399" icon={<IconBot />} />
        <StatCard value={`${stats.globalNoToolsPct.toFixed(1)}%`} label="Q&A sin herramientas" color={stats.globalNoToolsPct > 10 ? '#F87171' : '#34D399'} icon={<IconTools />} tone={stats.globalNoToolsPct > 10 ? 'critical' : 'ok'} />
      </div>

      <section className="priority-strip">
        {priorities.map(item => (
          <button key={item.label} className={`priority-item ${item.tone}`} onClick={() => navigate(item.to)}>
            <span className="priority-icon">{item.tone === 'ok' ? <IconShield /> : <IconAlert />}</span>
            <span>
              <strong>{item.value}</strong>
              <small>{item.label}</small>
              <em>{item.helper}</em>
            </span>
            <IconArrowRight />
          </button>
        ))}
      </section>

      <div className="quick-actions">
        <button className="quick-action" onClick={() => navigate('/quality')}>
          <span className="quick-action-icon"><IconShield /></span>
          <span><strong>Centro de Calidad</strong><small>{stats.totalIssues} hallazgos accionables</small></span>
          <IconArrowRight />
        </button>
        <button className="quick-action" onClick={() => navigate('/conversations')}>
          <span className="quick-action-icon"><IconBrain /></span>
          <span><strong>Conversaciones IA</strong><small>Auditar conversaciones, rutas y resolución</small></span>
          <IconArrowRight />
        </button>
        <button className="quick-action" onClick={() => navigate('/eda')}>
          <span className="quick-action-icon"><IconTrend /></span>
          <span><strong>Análisis Exploratorio</strong><small>Explorar volumen, engagement y herramientas</small></span>
          <IconArrowRight />
        </button>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Volumen diario</h3>
              <p>Mensajes por día en el periodo seleccionado.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
              <XAxis dataKey="date" tick={chartText} />
              <YAxis tick={chartText} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="mensajes" stroke="#60A5FA" fill="rgba(96,165,250,.16)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Chatflows con más actividad</h3>
              <p>Top por volumen de mensajes.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topChatflows} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
              <XAxis type="number" tick={chartText} />
              <YAxis type="category" dataKey="name" tick={chartText} width={170} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="mensajes" fill="#2DD4BF" name="Mensajes" radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Resumen de chatflows</h3>
            <p>Ordenado por riesgo de respuestas informativas sin herramientas.</p>
          </div>
          <label className="table-search">
            <IconSearch />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar chatflow..." />
          </label>
        </div>
        <div className="scroll-table">
          <table>
            <thead>
              <tr>
                <th>Chatflow</th>
                <th>Mensajes</th>
                <th>Convos</th>
                <th>Brechas</th>
                <th>Filtraciones</th>
                <th>Off-topic</th>
                <th>% Q&A sin herramientas</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(r => {
                const noToolsPct = qaWithoutToolsPct(r)
                const noToolsCount = qaWithoutToolsCount(r)
                return (
                  <tr key={r.chatflow} className="clickable" onClick={() => navigate(`/chatflows/${encodeURIComponent(r.chatflow)}`)}>
                    <td><strong>{r.chatflow}</strong></td>
                    <td>{(r.total_messages || 0).toLocaleString()}</td>
                    <td>{(r.total_conversations || 0).toLocaleString()}</td>
                    <td>{r.knowledge_gaps?.length || 0}</td>
                    <td>{r.doc_leaks?.length || 0}</td>
                    <td>{r.off_topic_answered || 0}/{(r.off_topic || []).length}</td>
                    <td>
                      <span className={`badge ${badgeClass(noToolsPct)}`}>{noToolsPct.toFixed(1)}%</span>
                      <span className="muted-cell">{noToolsCount} casos</span>
                    </td>
                  </tr>
                )
              })}
              {sorted.length === 0 && (
                <tr><td className="empty-cell" colSpan="7">Sin chatflows para este filtro.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
