import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { truncate, pct } from '../utils/helpers'
import { IconAlert, IconCheck, IconFilter, IconSearch, IconShield, IconTools } from '../components/Icons'

const TABS = [
  { key: 'overview', label: 'Resumen', color: '#60A5FA' },
  { key: 'brechas', label: 'Brechas', color: '#F87171' },
  { key: 'leaks', label: 'Filtraciones', color: '#FBBF24' },
  { key: 'offtopic', label: 'Off-topic', color: '#A78BFA' },
  { key: 'noinfo', label: 'Sin herramientas', color: '#2DD4BF' },
]

const qaWithoutToolsCount = r => r.qa_without_tools_count ?? r.qa_without_info_get_count ?? 0
const qaWithoutToolsPct = r => Number(r.qa_without_tools_pct ?? r.qa_without_info_get_pct ?? 0)
const qaWithoutToolsOver = r => r.qa_without_tools_over_threshold ?? r.qa_without_info_get_over_threshold ?? false
const qaWithoutToolsExamples = r => r.qa_without_tools_examples ?? r.qa_without_info_get_examples ?? []

const chartText = { fill: '#9FB0C5', fontSize: 11 }
const tooltipStyle = { background: '#111A27', border: '1px solid #344861', color: '#E6EDF5', borderRadius: 8 }
const badgeByPct = value => value > 10 ? 'badge-red' : value > 5 ? 'badge-orange' : 'badge-green'

export default function Quality({ data }) {
  const R = useMemo(() => data.results || [], [data.results])
  const [tab, setTab] = useState('overview')
  const [filter, setFilter] = useState('')

  const stats = useMemo(() => {
    let totalGaps = 0
    let totalLeaks = 0
    let totalOT = 0
    let totalOTA = 0
    let totalOTR = 0
    let totalBotMsgs = 0
    let totalMsgs = 0
    let totalQaMsgs = 0
    let totalQaNoTools = 0
    let cfNoToolsOver = 0
    let cfWithGaps = 0
    let cfWithLeaks = 0
    let totalGapExcluded = 0
    R.forEach(r => {
      totalGaps += r.knowledge_gaps?.length || 0
      totalGapExcluded += r.knowledge_gap_excluded_count || 0
      totalLeaks += r.doc_leaks?.length || 0
      totalOT += (r.off_topic || []).length
      totalOTA += r.off_topic_answered || 0
      totalOTR += r.off_topic_refused || 0
      totalBotMsgs += r.bot_messages || 0
      totalMsgs += r.total_messages || 0
      totalQaMsgs += r.qa_bot_messages || 0
      totalQaNoTools += qaWithoutToolsCount(r)
      if (qaWithoutToolsOver(r)) cfNoToolsOver += 1
      if ((r.knowledge_gaps?.length || 0) > 0) cfWithGaps += 1
      if ((r.doc_leaks?.length || 0) > 0) cfWithLeaks += 1
    })
    const totalIssues = totalGaps + totalLeaks + totalOTA + cfNoToolsOver
    const healthScore = totalBotMsgs > 0 ? Math.max(0, 100 - (totalIssues / totalBotMsgs * 100)) : 100
    const globalNoToolsPct = totalQaMsgs > 0 ? totalQaNoTools / totalQaMsgs * 100 : 0
    return { totalGaps, totalGapExcluded, totalLeaks, totalOT, totalOTA, totalOTR, totalBotMsgs, totalMsgs, totalQaMsgs, totalQaNoTools, cfNoToolsOver, cfWithGaps, cfWithLeaks, totalIssues, healthScore, globalNoToolsPct }
  }, [R])

  return (
    <div className="container quality-page">
      <section className="page-header">
        <div>
          <span className="eyebrow">Auditoría de calidad</span>
          <h1>Centro de Calidad</h1>
          <p>Revisa riesgos accionables, ubica dónde ocurren y abre evidencia concreta para corregir.</p>
        </div>
        <div className={`health-panel ${stats.healthScore >= 90 ? 'ok' : stats.healthScore >= 70 ? 'warning' : 'critical'}`}>
          <span>Salud</span>
          <strong>{stats.healthScore.toFixed(0)}%</strong>
        </div>
      </section>

      <div className="quality-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`quality-tab ${tab === t.key ? 'active' : ''}`}
            style={{ '--tab-color': t.color }}
            onClick={() => { setTab(t.key); setFilter('') }}
          >
            {t.label}
            {t.key === 'brechas' && stats.totalGaps > 0 && <span className="tab-count">{stats.totalGaps}</span>}
            {t.key === 'leaks' && stats.totalLeaks > 0 && <span className="tab-count">{stats.totalLeaks}</span>}
            {t.key === 'offtopic' && stats.totalOT > 0 && <span className="tab-count">{stats.totalOT}</span>}
            {t.key === 'noinfo' && stats.cfNoToolsOver > 0 && <span className="tab-count">{stats.cfNoToolsOver}</span>}
          </button>
        ))}
      </div>

      {tab === 'overview' && <QualityOverview R={R} stats={stats} />}
      {tab === 'brechas' && <BrechasTab R={R} data={data} stats={stats} filter={filter} setFilter={setFilter} />}
      {tab === 'leaks' && <LeaksTab R={R} stats={stats} filter={filter} setFilter={setFilter} />}
      {tab === 'offtopic' && <OffTopicTab R={R} stats={stats} filter={filter} setFilter={setFilter} />}
      {tab === 'noinfo' && <NoToolsTab R={R} stats={stats} filter={filter} setFilter={setFilter} />}
    </div>
  )
}

function QualityOverview({ R, stats }) {
  const issuesData = useMemo(() => R.filter(r =>
    (r.knowledge_gaps?.length || 0) > 0 ||
    (r.doc_leaks?.length || 0) > 0 ||
    (r.off_topic_answered || 0) > 0 ||
    qaWithoutToolsOver(r)
  )
    .map(r => ({
      name: r.chatflow.length > 28 ? `${r.chatflow.substring(0, 28)}...` : r.chatflow,
      brechas: r.knowledge_gaps?.length || 0,
      filtraciones: r.doc_leaks?.length || 0,
      offtopic: r.off_topic_answered || 0,
      sinHerramientas: qaWithoutToolsOver(r) ? qaWithoutToolsCount(r) : 0,
    }))
    .sort((a, b) => (b.brechas + b.filtraciones + b.offtopic + b.sinHerramientas) - (a.brechas + a.filtraciones + a.offtopic + a.sinHerramientas))
    .slice(0, 16),
  [R])

  const detailRows = useMemo(() => R.filter(r => r.total_messages > 0)
    .sort((a, b) => qaWithoutToolsPct(b) - qaWithoutToolsPct(a))
    .map(r => {
      const gapPct = r.bot_messages > 0 ? (r.knowledge_gaps.length / r.bot_messages * 100) : 0
      const ot = (r.off_topic || []).length
      const otr = r.off_topic_refused || 0
      const noToolsPct = qaWithoutToolsPct(r)
      return {
        cells: [
          r.chatflow,
          (r.total_messages || 0).toLocaleString(),
          r.knowledge_gaps.length,
          <span className={`badge ${badgeByPct(gapPct)}`}>{gapPct.toFixed(1)}%</span>,
          r.doc_leaks.length,
          ot > 0 ? `${r.off_topic_answered || 0}/${ot}` : '0',
          ot > 0 ? <span className={`badge ${Number(pct(otr, ot)) >= 80 ? 'badge-green' : 'badge-red'}`}>{pct(otr, ot)}%</span> : '-',
          <span className={`badge ${badgeByPct(noToolsPct)}`}>{noToolsPct.toFixed(1)}%</span>,
        ],
      }
    }), [R])

  return (
    <>
      <div className="cards cards-tight">
        <StatCard value={`${stats.healthScore.toFixed(0)}%`} label="Salud general" color={stats.healthScore >= 90 ? '#34D399' : stats.healthScore >= 70 ? '#FBBF24' : '#F87171'} icon={<IconShield />} />
        <StatCard value={stats.totalIssues} label="Problemas" color="#F87171" icon={<IconAlert />} />
        <StatCard value={stats.totalGaps} label="Brechas" color="#F87171" />
        <StatCard value={stats.totalLeaks} label="Filtraciones" color="#FBBF24" />
        <StatCard value={stats.totalOTA} label="Off-topic respondido" color="#A78BFA" />
        <StatCard value={stats.cfNoToolsOver} label="Sin herramientas >10%" color="#2DD4BF" icon={<IconTools />} />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Problemas por chatflow</h3>
            <p>Top de proyectos con señales accionables en el periodo.</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={Math.max(300, issuesData.length * 30)}>
          <BarChart data={issuesData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
            <XAxis type="number" tick={chartText} />
            <YAxis type="category" dataKey="name" tick={chartText} width={180} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="brechas" stackId="a" fill="#F87171" name="Brechas" />
            <Bar dataKey="filtraciones" stackId="a" fill="#FBBF24" name="Filtraciones" />
            <Bar dataKey="offtopic" stackId="a" fill="#A78BFA" name="Off-topic" />
            <Bar dataKey="sinHerramientas" stackId="a" fill="#2DD4BF" name="Sin herramientas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTable
        title="Detalle por chatflow"
        subtitle="Incluye el KPI canónico de Q&A sin herramientas con fallback temporal a los campos antiguos."
        headers={['Chatflow', 'Mensajes', 'Brechas', '% Brechas', 'Filtraciones', 'Off-topic', 'Bloq. %', '% Q&A sin herramientas']}
        rows={detailRows}
        exportName="calidad-chatflows"
        maxHeight={420}
        compact
      />
    </>
  )
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <label className="table-search full">
      <IconSearch />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )
}

function BrechasTab({ R, data, stats, filter, setFilter }) {
  const gapRows = useMemo(() => {
    const all = []
    R.forEach(r => (r.knowledge_gaps || []).forEach(g => all.push({ chatflow: r.chatflow, ...g })))
    const f = filter.toLowerCase()
    return all
      .filter(g => !f || g.chatflow.toLowerCase().includes(f) || (g.user_question || '').toLowerCase().includes(f) || (g.bot_response || '').toLowerCase().includes(f))
      .map(g => ({ cells: [g.chatflow, (g.date || '').substring(0, 10), truncate(g.user_question, 150), truncate(g.bot_response, 220)] }))
  }, [R, filter])

  const sugRows = useMemo(() => (data.suggestions || []).map(s => ({ cells: [s[1], s[0]] })), [data.suggestions])
  const excludedRows = useMemo(() => {
    const all = []
    R.forEach(r => (r.knowledge_gap_excluded_examples || []).forEach(g => all.push({ chatflow: r.chatflow, ...g })))
    const f = filter.toLowerCase()
    return all
      .filter(g => !f || g.chatflow.toLowerCase().includes(f) || (g.reason || '').toLowerCase().includes(f) || (g.user_question || '').toLowerCase().includes(f) || (g.bot_response || '').toLowerCase().includes(f))
      .map(g => ({ cells: [g.chatflow, (g.date || '').substring(0, 10), g.reason || '-', truncate(g.user_question, 140), truncate(g.bot_response, 220)] }))
  }, [R, filter])

  return (
    <>
      <div className="cards cards-tight">
        <StatCard value={stats.totalGaps} label="Total brechas" color="#F87171" />
        <StatCard value={stats.totalGapExcluded} label="Descartadas por regla" color="#2DD4BF" />
        <StatCard value={stats.cfWithGaps} label="Chatflows afectados" color="#FBBF24" />
        <StatCard value={stats.totalBotMsgs > 0 ? `${(stats.totalGaps / stats.totalBotMsgs * 100).toFixed(1)}%` : '0%'} label="% global de brechas" color={stats.totalBotMsgs > 0 && stats.totalGaps / stats.totalBotMsgs * 100 > 10 ? '#F87171' : '#34D399'} />
      </div>
      <SearchBox value={filter} onChange={setFilter} placeholder="Filtrar por chatflow, pregunta o respuesta..." />
      <DataTable title={`Brechas de conocimiento (${gapRows.length})`} headers={['Chatflow', 'Fecha', 'Pregunta del usuario', 'Respuesta del bot']} rows={gapRows} exportName="brechas-completo" maxHeight={500} compact />
      {excludedRows.length > 0 && (
        <DataTable title={`Descartadas como brecha (${excludedRows.length})`} subtitle="Casos con frase de no información que no son brecha accionable: dato dinámico, respuesta parcial útil, catálogo/directorio, cierre o contacto." headers={['Chatflow', 'Fecha', 'Motivo', 'Pregunta', 'Respuesta']} rows={excludedRows} exportName="brechas-descartadas" maxHeight={360} compact />
      )}
      <DataTable title={`Contenido sugerido (${sugRows.length})`} headers={['Veces', 'Pregunta sin respuesta']} rows={sugRows} exportName="contenido-sugerido" maxHeight={320} compact />
    </>
  )
}

function LeaksTab({ R, stats, filter, setFilter }) {
  const rows = useMemo(() => {
    const all = []
    R.forEach(r => (r.doc_leaks || []).forEach(l => all.push({ chatflow: r.chatflow, ...l })))
    const f = filter.toLowerCase()
    return all
      .filter(l => !f || l.chatflow.toLowerCase().includes(f) || (l.bot_response || '').toLowerCase().includes(f))
      .map(l => ({ cells: [l.chatflow, (l.date || '').substring(0, 10), truncate(l.bot_response, 320)] }))
  }, [R, filter])

  return (
    <>
      <div className="cards cards-tight">
        <StatCard value={stats.totalLeaks} label="Total filtraciones" color="#FBBF24" />
        <StatCard value={stats.cfWithLeaks} label="Chatflows afectados" color="#FBBF24" />
        <StatCard value={R.length} label="Chatflows auditados" color="#34D399" />
      </div>
      <SearchBox value={filter} onChange={setFilter} placeholder="Filtrar por chatflow o respuesta..." />
      <DataTable title={`Filtraciones de documento (${rows.length})`} subtitle="Casos donde el bot expone frases como 'según el documento' o 'de acuerdo al documento'." headers={['Chatflow', 'Fecha', 'Respuesta del bot']} rows={rows} exportName="filtraciones-completo" maxHeight={600} compact />
    </>
  )
}

function NoToolsTab({ R, stats, filter, setFilter }) {
  const violatingChatflows = useMemo(() => R.filter(r => qaWithoutToolsOver(r))
    .sort((a, b) => qaWithoutToolsPct(b) - qaWithoutToolsPct(a)), [R])

  const chatflowRows = useMemo(() => violatingChatflows.map(r => ({
    cells: [
      r.chatflow,
      r.qa_bot_messages || 0,
      qaWithoutToolsCount(r),
      <span className="badge badge-red">{qaWithoutToolsPct(r).toFixed(1)}%</span>,
      ((qaWithoutToolsExamples(r) || [])[0]?.date || '').substring(0, 10) || '-',
    ],
  })), [violatingChatflows])

  const exampleRows = useMemo(() => {
    const all = []
    violatingChatflows.forEach(r => (qaWithoutToolsExamples(r) || []).forEach(e => all.push({ chatflow: r.chatflow, ...e })))
    const f = filter.toLowerCase()
    return all
      .filter(e => !f || e.chatflow.toLowerCase().includes(f) || (e.user_question || '').toLowerCase().includes(f) || (e.bot_response || '').toLowerCase().includes(f))
      .map(e => ({
        cells: [
          e.chatflow,
          (e.date || '').substring(0, 10),
          e.agent_name || '-',
          <div className="text-cell">{e.user_question || '-'}</div>,
          <div className="text-cell wide">{e.bot_response || '-'}</div>,
          (e.tools_used || []).join(', ') || '-',
        ],
      }))
  }, [violatingChatflows, filter])

  return (
    <>
      <div className="cards cards-tight">
        <StatCard value={stats.cfNoToolsOver} label="Chatbots sobre 10%" color="#2DD4BF" icon={<IconFilter />} />
        <StatCard value={stats.totalQaNoTools} label="Respuestas Q&A sin herramientas" color="#F87171" icon={<IconTools />} />
        <StatCard value={`${stats.globalNoToolsPct.toFixed(1)}%`} label="% global Q&A sin herramientas" color={stats.globalNoToolsPct > 10 ? '#F87171' : '#34D399'} />
      </div>

      {violatingChatflows.length === 0 ? (
        <div className="empty-state">
          <IconCheck />
          <h3>Sin chatbots sobre el umbral</h3>
          <p>No hay chatbots con más de 10% de respuestas Q&A informativas sin herramientas en el periodo seleccionado.</p>
        </div>
      ) : (
        <>
          <DataTable title={`Chatbots sobre 10% sin herramientas (${chatflowRows.length})`} headers={['Chatflow', 'Respuestas Q&A', 'Sin herramientas', '%', 'Fecha reciente']} rows={chatflowRows} exportName="chatbots-sin-herramientas" maxHeight={360} compact />
          <SearchBox value={filter} onChange={setFilter} placeholder="Filtrar por chatbot, pregunta o respuesta..." />
          <DataTable title={`Ejemplos de respuestas sin herramientas (${exampleRows.length})`} subtitle="Solo respuestas informativas de Q&A después de excluir saludos, cierres, rechazos y flujos operativos." headers={['Chatflow', 'Fecha', 'Agente', 'Pregunta', 'Respuesta', 'Herramientas']} rows={exampleRows} exportName="respuestas-sin-herramientas" maxHeight={560} compact />
        </>
      )}
    </>
  )
}

function OffTopicTab({ R, stats, filter, setFilter }) {
  const chartData = useMemo(() => R.filter(r => (r.off_topic || []).length > 0)
    .map(r => ({
      name: r.chatflow.length > 24 ? `${r.chatflow.substring(0, 24)}...` : r.chatflow,
      respondidos: r.off_topic_answered || 0,
      bloqueados: r.off_topic_refused || 0,
    }))
    .sort((a, b) => b.respondidos - a.respondidos)
    .slice(0, 15), [R])

  const rows = useMemo(() => {
    const all = []
    R.forEach(r => (r.off_topic || []).forEach(o => all.push({ chatflow: r.chatflow, ...o })))
    const f = filter.toLowerCase()
    return all
      .filter(o => !f || o.chatflow.toLowerCase().includes(f) || (o.user_question || '').toLowerCase().includes(f))
      .map(o => ({
        cells: [
          o.chatflow,
          (o.date || '').substring(0, 10),
          o.agent_name || '-',
          o.refused ? <span className="badge badge-green">Bloqueado</span> : <span className="badge badge-red">Respondido</span>,
          truncate(o.user_question, 140),
          truncate(o.bot_response, 180),
        ],
      }))
  }, [R, filter])

  if (stats.totalOT === 0) {
    return (
      <div className="empty-state">
        <IconCheck />
        <h3>Sin preguntas off-topic detectadas</h3>
        <p>No se detectaron intentos fuera de tema en el periodo seleccionado.</p>
      </div>
    )
  }

  return (
    <>
      <div className="cards cards-tight">
        <StatCard value={stats.totalOT} label="Intentos off-topic" color="#A78BFA" />
        <StatCard value={stats.totalOTA} label="Respondidos" color="#F87171" />
        <StatCard value={stats.totalOTR} label="Bloqueados" color="#34D399" />
        <StatCard value={`${pct(stats.totalOTR, stats.totalOT)}%`} label="Tasa de bloqueo" color={Number(pct(stats.totalOTR, stats.totalOT)) >= 80 ? '#34D399' : '#F87171'} />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Off-topic por chatflow</h3>
            <p>Comparación entre respuestas bloqueadas y respondidas.</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
            <XAxis type="number" tick={chartText} />
            <YAxis type="category" dataKey="name" tick={chartText} width={160} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="respondidos" stackId="a" fill="#F87171" name="Respondidos" />
            <Bar dataKey="bloqueados" stackId="a" fill="#34D399" name="Bloqueados" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <SearchBox value={filter} onChange={setFilter} placeholder="Filtrar por chatflow o pregunta..." />
      <DataTable title={`Detalle off-topic (${rows.length})`} headers={['Chatflow', 'Fecha', 'Agente', 'Estado', 'Pregunta', 'Respuesta']} rows={rows} exportName="off-topic-completo" maxHeight={500} compact />
    </>
  )
}
