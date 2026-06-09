import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { truncate } from '../utils/helpers'
import { apiFetch } from '../utils/api'
import { IconAlert, IconBrain, IconCheck, IconFilter, IconSearch, IconTools } from '../components/Icons'

const LIVE_FILE = 'live:all'

const INTENT_LABELS = {
  info_general: 'Info general',
  servicios_profesionales: 'Servicios profesionales',
  centro_comercial: 'Centro comercial',
  reglamento_acceso: 'Reglamento de acceso',
  propietarios: 'Propietarios',
  estacionamiento: 'Estacionamiento',
  espacios_disponibles: 'Espacios disponibles',
  off_topic: 'Off-topic',
  saludo: 'Saludo',
  otro: 'Otro',
  informacion_general: 'Info general',
  directorio: 'Directorio',
  oficinas_renta: 'Oficinas/Renta',
  eventos: 'Eventos',
  restaurantes: 'Restaurantes',
  quejas: 'Quejas',
}

const QUALITY_COLORS = { 5: '#34D399', 4: '#22C55E', 3: '#FBBF24', 2: '#FB923C', 1: '#F87171' }

function buildMessageParams(file, source, extra = {}) {
  const params = new URLSearchParams({ file: file || LIVE_FILE, ...extra })
  if (source === 'live' || file === LIVE_FILE) params.set('source', 'live')
  return params
}

export default function Conversations() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(LIVE_FILE)
  const [sourceMode, setSourceMode] = useState('live')
  const [loadData, setLoadData] = useState(null)
  const [aiData, setAiData] = useState(null)
  const [aiStatus, setAiStatus] = useState('idle')
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0, text: '' })
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [intentFilter, setIntentFilter] = useState('')
  const [expandedConv, setExpandedConv] = useState(null)
  const [page, setPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState(null)

  const handleLoadFile = useCallback(async (filename = LIVE_FILE, source = filename === LIVE_FILE ? 'live' : 'file') => {
    setSelectedFile(filename)
    setSourceMode(source)
    setAiData(null)
    setAiStatus('idle')
    setLoadError('')
    setPage(1)
    setExpandedConv(null)
    const params = buildMessageParams(filename, source)
    const resp = await apiFetch(`/api/messages/load?${params}`)
    const data = await resp.json()
    if (!resp.ok || data.error) {
      setLoadData(null)
      setLoadError(data.error || 'No se pudieron cargar los mensajes desde el backend.')
      return
    }
    setLoadData(data)
    try {
      const aiResp = await apiFetch(`/api/messages/analyze-status?${params}`)
      const aiSt = await aiResp.json()
      if (aiSt.status === 'ready' && aiSt.data) {
        setAiData(aiSt.data)
        setAiStatus('ready')
      }
    } catch {
      // Cached AI analysis is optional.
    }
  }, [])

  useEffect(() => {
    handleLoadFile(LIVE_FILE, 'live')
    apiFetch('/api/messages/files').then(r => r.json()).then(d => setFiles(d.files || []))
  }, [handleLoadFile])

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return
    setAiStatus('analyzing')
    setAiProgress({ current: 0, total: 0, text: 'Iniciando análisis...' })
    setLoadError('')
    try {
      const resp = await apiFetch('/api/messages/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selectedFile, source: sourceMode }),
      })
      const body = await resp.json()
      if (!resp.ok && body.error) {
        setLoadError(body.error)
        setAiStatus('idle')
        return
      }
    } catch {
      setLoadError('No se pudo conectar con el backend para iniciar el análisis IA.')
      setAiStatus('idle')
      return
    }

    const poll = async () => {
      try {
        const params = buildMessageParams(selectedFile, sourceMode)
        const sr = await apiFetch(`/api/messages/analyze-status?${params}`)
        const st = await sr.json()
        if (st.status === 'ready') {
          setAiData(st.data)
          setAiStatus('ready')
        } else if (st.status === 'error') {
          setLoadError(st.error || 'Error desconocido en análisis IA.')
          setAiStatus('idle')
        } else if (st.status === 'analyzing') {
          setAiProgress({ current: st.current, total: st.total, text: st.progress })
          setTimeout(poll, 3000)
        } else {
          setAiStatus('idle')
        }
      } catch {
        setTimeout(poll, 3000)
      }
    }
    setTimeout(poll, 2000)
  }, [selectedFile, sourceMode])

  const handleUpload = useCallback(async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const resp = await apiFetch('/api/messages/upload', { method: 'POST', body: fd })
    const data = await resp.json()
    if (data.ok) {
      const fr = await apiFetch('/api/messages/files')
      const fd2 = await fr.json()
      setFiles(fd2.files || [])
      handleLoadFile(data.filename, 'file')
    }
  }, [handleLoadFile])

  useEffect(() => {
    if (!selectedFile) return
    const params = buildMessageParams(selectedFile, sourceMode, { page, per_page: 50 })
    if (search) params.set('search', search)
    if (intentFilter) params.set('route', intentFilter)
    apiFetch(`/api/messages/conversations?${params}`)
      .then(r => r.json())
      .then(d => setPaginatedData(d))
  }, [selectedFile, sourceMode, page, search, intentFilter])

  const convs = paginatedData?.conversations || loadData?.conversations || []
  const sourceLabel = loadData?.label || (sourceMode === 'live' ? 'API actual' : selectedFile)
  const aiConvMap = useMemo(() => {
    const map = {}
    for (const c of aiData?.conversations || []) {
      if (c.ai) map[c.session_id] = c.ai
    }
    return map
  }, [aiData])

  if (!selectedFile) {
    return (
      <div className="container conversations-page">
        <section className="page-header">
          <div>
            <span className="eyebrow">Auditoría profunda</span>
            <h1>Conversaciones IA</h1>
            <p>Usa API actual como fuente principal. Los JSON locales quedan como respaldo.</p>
          </div>
        </section>
        <SourcePicker files={files} onLoad={handleLoadFile} onUpload={handleUpload} />
      </div>
    )
  }

  return (
    <div className="container conversations-page">
      <section className="page-header">
        <div>
          <span className="eyebrow">Auditoría profunda</span>
          <h1>Conversaciones IA</h1>
          <p>Revisa conversaciones reales, clasificación IA, herramientas usadas y resolución.</p>
        </div>
        <div className={`health-panel ${aiStatus === 'ready' ? 'ok' : aiStatus === 'analyzing' ? 'warning' : 'neutral'}`}>
          <span>Fuente</span>
          <strong>{sourceLabel}</strong>
        </div>
      </section>

      <div className="workbench-toolbar">
        <button className="secondary-action" onClick={() => handleLoadFile(LIVE_FILE, 'live')}>API actual</button>
        <button className="secondary-action" onClick={() => { setSelectedFile(null); setLoadData(null); setAiData(null) }}>Cambiar fuente</button>
        {loadData && <span className="source-pill">{loadData.total_sessions} sesiones · {loadData.total_messages} mensajes</span>}
        {aiStatus === 'idle' && <button className="secondary-action primary" onClick={handleAnalyze}><IconBrain /> Analizar con IA</button>}
        {aiStatus === 'analyzing' && <span className="source-pill">{aiProgress.text || 'Analizando...'} ({aiProgress.current}/{aiProgress.total})</span>}
        {aiStatus === 'ready' && <span className="badge badge-green">Análisis IA listo</span>}
      </div>

      {loadError && (
        <div className="alert alert-red">
          <strong>No se pudo cargar la fuente.</strong>
          <span>{loadError}</span>
        </div>
      )}

      {aiData ? <AISummary data={aiData} /> : loadData?.pattern_analysis && <PatternSummary analysis={loadData.pattern_analysis} />}

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Explorar conversaciones</h3>
            <p>Filtra por texto o por ruta IA para llegar rápido a la evidencia.</p>
          </div>
        </div>
        <div className="filter-row">
          <label className="table-search full">
            <IconSearch />
            <input
              type="text"
              placeholder="Buscar en conversaciones..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </label>
          {aiData && (
            <label className="select-control">
              <IconFilter />
              <select value={intentFilter} onChange={e => { setIntentFilter(e.target.value); setPage(1) }}>
                <option value="">Todas las rutas</option>
                {Object.entries(aiData.routes || aiData.intents || {}).sort((a, b) => b[1] - a[1]).map(([k, count]) => (
                  <option key={k} value={k}>{INTENT_LABELS[k] || k} ({count})</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Conversaciones</h3>
            {paginatedData && <p>{paginatedData.total} total · Página {paginatedData.page}/{paginatedData.pages}</p>}
          </div>
        </div>
        <div className="scroll-table conversation-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Primer mensaje</th>
                <th>Msgs</th>
                {aiData && <th>Ruta</th>}
                {aiData && <th>Calidad</th>}
                {aiData && <th>Resuelto</th>}
                <th>Herramientas</th>
              </tr>
            </thead>
            <tbody>
              {convs.map(c => {
                const ai = aiConvMap[c.session_id]
                const isExpanded = expandedConv === c.session_id
                return (
                  <Fragment key={c.session_id}>
                    <tr className="clickable" onClick={() => setExpandedConv(isExpanded ? null : c.session_id)}>
                      <td className="nowrap-cell">{(c.started_at || '').replace('T', ' ').substring(0, 16)}</td>
                      <td>{truncate(ai?.summary || c.first_message, 110)}</td>
                      <td>{c.message_count}</td>
                      {aiData && <td><span className="badge badge-blue">{ai ? INTENT_LABELS[ai.route || ai.intent] || ai.route || ai.intent : '-'}</span></td>}
                      {aiData && <td>{ai ? <QualityBadge score={ai.quality_score} /> : '-'}</td>}
                      {aiData && <td>{ai ? (ai.handled ? <span className="badge badge-green">Sí</span> : <span className="badge badge-red">No</span>) : '-'}</td>}
                      <td>{(c.tools_used || []).join(', ') || '-'}</td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={aiData ? 7 : 4} className="conversation-detail-cell">
                          <ConversationDetail conv={c} ai={ai} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {convs.length === 0 && <tr><td className="empty-cell" colSpan={aiData ? 7 : 4}>Sin conversaciones para este filtro.</td></tr>}
            </tbody>
          </table>
        </div>
        {paginatedData && paginatedData.pages > 1 && (
          <div className="pagination-row">
            <button className="secondary-action" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
            <span>Página {page} de {paginatedData.pages}</span>
            <button className="secondary-action" disabled={page >= paginatedData.pages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
          </div>
        )}
      </div>
    </div>
  )
}

function SourcePicker({ files, onLoad, onUpload }) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h3>Fuentes disponibles</h3>
          <p>La fuente recomendada es API actual; los archivos JSON son respaldo manual.</p>
        </div>
        <button className="secondary-action primary" onClick={() => onLoad(LIVE_FILE, 'live')}>Usar API actual</button>
      </div>
      <div className="scroll-table">
        <table>
          <thead><tr><th>Fuente</th><th>Tamaño</th><th>Acción</th></tr></thead>
          <tbody>
            {files.map(f => (
              <tr key={f.filename}>
                <td>{f.label || f.filename}</td>
                <td>{f.size_mb} MB</td>
                <td><button className="secondary-action" onClick={() => onLoad(f.filename, f.source === 'live' ? 'live' : 'file')}>Cargar</button></td>
              </tr>
            ))}
            {files.length === 0 && <tr><td className="empty-cell" colSpan="3">Sin archivos JSON locales.</td></tr>}
          </tbody>
        </table>
      </div>
      <label className="secondary-action upload-action">
        Subir Message.json
        <input type="file" accept=".json" onChange={onUpload} />
      </label>
    </div>
  )
}

function AISummary({ data }) {
  const routeRows = Object.entries(data.routes || data.intents || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name, value]) => ({ cells: [INTENT_LABELS[name] || name, value] }))

  const issueRows = Object.entries(data.issues || {})
    .sort((a, b) => b[1] - a[1])
    .map(([issue, count]) => ({ cells: [issue, count] }))

  return (
    <>
      <div className="cards cards-tight">
        <StatCard value={data.total_conversations} label="Conversaciones" color="#60A5FA" icon={<IconBrain />} />
        <StatCard value={data.total_messages} label="Mensajes" color="#2DD4BF" />
        <StatCard value={data.avg_quality_score} label="Calidad promedio" color={data.avg_quality_score >= 4 ? '#34D399' : data.avg_quality_score >= 3 ? '#FBBF24' : '#F87171'} />
        <StatCard value={`${data.handled_pct}%`} label="Resueltas" color={data.handled_pct >= 80 ? '#34D399' : '#FBBF24'} icon={<IconCheck />} />
        <StatCard value={data.unhandled} label="No resueltas" color="#F87171" icon={<IconAlert />} />
      </div>
      <div className="grid2">
        <DataTable title="Rutas IA" headers={['Ruta', 'Conversaciones']} rows={routeRows} maxHeight={320} compact />
        <DataTable title="Problemas detectados" headers={['Problema', 'Casos']} rows={issueRows} maxHeight={320} compact />
      </div>
    </>
  )
}

function PatternSummary({ analysis }) {
  return (
    <div className="cards cards-tight">
      <StatCard value={analysis.total_messages} label="Mensajes" color="#60A5FA" />
      <StatCard value={analysis.total_conversations} label="Conversaciones" color="#2DD4BF" />
      <StatCard value={analysis.knowledge_gaps?.length || 0} label="Brechas por patrones" color="#F87171" />
      <StatCard value={analysis.doc_leaks?.length || 0} label="Filtraciones" color="#FBBF24" />
      <StatCard value={(analysis.off_topic || []).length} label="Off-topic" color="#A78BFA" />
    </div>
  )
}

function QualityBadge({ score }) {
  return (
    <span className="quality-score" style={{ '--score-color': QUALITY_COLORS[score] || '#91A2B7' }}>
      {score}
    </span>
  )
}

function ConversationDetail({ conv, ai }) {
  return (
    <div className="conversation-detail">
      {ai && (
        <div className="conversation-ai-strip">
          {(ai.topics || []).map(t => <span key={t} className="badge badge-blue">{t}</span>)}
          {(ai.issues || []).map(iss => <span key={iss} className="badge badge-red">{iss}</span>)}
          {ai.sentiment && <span className="badge badge-green">{ai.sentiment}</span>}
        </div>
      )}
      <div className="conversation-timeline">
        {conv.messages?.map((m, i) => (
          <div key={i} className={`message-bubble ${m.role === 'user' ? 'user' : 'bot'}`}>
            <div className="message-meta">
              <span>{m.role === 'user' ? 'Usuario' : 'Bot'}</span>
              <span>{(m.time || '').replace('T', ' ').substring(11, 19)}</span>
            </div>
            <div className="message-content">{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
