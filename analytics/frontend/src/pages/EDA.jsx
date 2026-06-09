import { Fragment, useEffect, useMemo, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell,
} from 'recharts'
import StatCard from '../components/StatCard'
import { apiFetch } from '../utils/api'
import { IconActivity, IconCheck, IconFilter, IconShield, IconTools, IconTrend } from '../components/Icons'

const LIVE_FILE = 'live:all'
const COLORS = ['#F87171', '#FBBF24', '#60A5FA', '#34D399']
const DOW_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const tooltipStyle = { background: '#111A27', border: '1px solid #344861', color: '#E6EDF5', borderRadius: 8 }
const tickStyle = { fill: '#9FB0C5', fontSize: 11 }

function buildEdaParams(file, source) {
  const params = new URLSearchParams({ file: file || LIVE_FILE })
  if (source === 'live' || file === LIVE_FILE) params.set('source', 'live')
  return params
}

export default function EDA() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(LIVE_FILE)
  const [sourceMode, setSourceMode] = useState('live')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    apiFetch('/api/messages/files').then(r => r.json()).then(d => setFiles(d.files || []))
    loadEDA(LIVE_FILE, 'live')
  }, [])

  const loadEDA = async (filename = LIVE_FILE, source = filename === LIVE_FILE ? 'live' : 'file') => {
    setSelectedFile(filename)
    setSourceMode(source)
    setLoading(true)
    setError('')
    try {
      const params = buildEdaParams(filename, source)
      const r = await apiFetch(`/api/messages/eda?${params}`)
      const d = await r.json()
      if (d.error) {
        setError(d.error)
        return
      }
      setData(d)
    } catch (e) {
      setError('Error cargando EDA: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', color: '#60A5FA' },
    { id: 'temporal', label: 'Volumen', color: '#A78BFA' },
    { id: 'engagement', label: 'Engagement', color: '#FBBF24' },
    { id: 'tools', label: 'Herramientas', color: '#2DD4BF' },
    { id: 'distributions', label: 'Distribuciones', color: '#34D399' },
    { id: 'quality', label: 'Calidad de datos', color: '#F87171' },
  ]

  if (!selectedFile) {
    return (
      <div className="container eda-page">
        <section className="page-header">
          <div>
            <span className="eyebrow">Exploración</span>
            <h1>Análisis Exploratorio</h1>
            <p>La fuente recomendada es API actual; los JSON locales quedan como respaldo.</p>
          </div>
        </section>
        <SourcePicker files={files} onLoad={loadEDA} />
      </div>
    )
  }

  const sourceLabel = sourceMode === 'live' ? 'API actual' : selectedFile

  return (
    <div className="container eda-page">
      <section className="page-header">
        <div>
          <span className="eyebrow">Exploración</span>
          <h1>Análisis Exploratorio</h1>
          <p>Volumen, engagement, horarios, herramientas y calidad del dataset.</p>
        </div>
        <div className="health-panel ok">
          <span>Fuente</span>
          <strong>{sourceLabel}</strong>
        </div>
      </section>

      <div className="workbench-toolbar">
        <button className="secondary-action primary" onClick={() => loadEDA(LIVE_FILE, 'live')}>API actual</button>
        <button className="secondary-action" onClick={() => { setSelectedFile(null); setData(null) }}>Cambiar fuente</button>
        {data?.summary && <span className="source-pill">{data.summary.total_sessions} conversaciones · {data.summary.total_messages} mensajes</span>}
      </div>

      {loading && (
        <div className="loading-screen compact">
          <div className="spinner" />
          <div>Calculando EDA para {sourceLabel}...</div>
        </div>
      )}

      {error && (
        <div className="alert alert-red">
          <strong>No se pudo calcular EDA.</strong>
          <span>{error}</span>
        </div>
      )}

      {!loading && data && (
        <>
          <div className="quality-tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`quality-tab ${tab === t.id ? 'active' : ''}`}
                style={{ '--tab-color': t.color }}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'overview' && <OverviewTab summary={data.summary} msg_stats={data.msg_stats} conv_stats={data.conv_stats} engagement={data.engagement} />}
          {tab === 'temporal' && <TemporalTab daily_volume={data.daily_volume} hourly_dist={data.hourly_dist} dow_dist={data.dow_dist} heatmap={data.heatmap} />}
          {tab === 'engagement' && <EngagementTab engagement={data.engagement} distributions={data.distributions} />}
          {tab === 'tools' && <ToolsTab tool_usage={data.tool_usage} />}
          {tab === 'distributions' && <DistributionsTab distributions={data.distributions} msg_stats={data.msg_stats} />}
          {tab === 'quality' && <QualityTab quality={data.quality} msg_stats={data.msg_stats} summary={data.summary} />}
        </>
      )}
    </div>
  )
}

function SourcePicker({ files, onLoad }) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h3>Fuentes disponibles</h3>
          <p>Usa API actual para trabajar con los mensajes ya obtenidos por el backend.</p>
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
    </div>
  )
}

function OverviewTab({ summary, msg_stats, conv_stats, engagement }) {
  const bounceRate = engagement.find(e => e.segment.includes('Bounce'))?.pct || 0

  return (
    <>
      <div className="cards cards-tight">
        <StatCard value={summary.total_sessions.toLocaleString()} label="Conversaciones" color="#60A5FA" icon={<IconActivity />} />
        <StatCard value={summary.total_messages.toLocaleString()} label="Mensajes" color="#2DD4BF" />
        <StatCard value={`${summary.avg_daily}/día`} label="Promedio diario" color="#A78BFA" />
        <StatCard value={`${conv_stats.response_sec.median}s`} label="Respuesta bot mediana" color="#2DD4BF" />
        <StatCard value={`${bounceRate}%`} label="Bounce rate" color={bounceRate > 40 ? '#F87171' : '#FBBF24'} />
        <StatCard value={`${summary.date_range.days}d`} label="Periodo" color="#FBBF24" />
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Métricas de conversación</h3>
              <p>Resumen de duración, densidad y respuesta del bot.</p>
            </div>
          </div>
          <table>
            <tbody>
              <tr><td>Mensajes por conversación (mediana)</td><td className="metric-cell">{conv_stats.msgs_per_conv.median}</td></tr>
              <tr><td>Preguntas usuario por sesión (mediana)</td><td className="metric-cell">{conv_stats.user_msgs_per_conv.median}</td></tr>
              <tr><td>Duración mediana</td><td className="metric-cell">{conv_stats.duration_min.median} min</td></tr>
              <tr><td>Respuesta bot (mediana)</td><td className="metric-cell">{conv_stats.response_sec.median}s</td></tr>
              <tr><td>Respuesta bot (promedio)</td><td className="metric-cell">{conv_stats.response_sec.mean}s</td></tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Longitud de mensajes</h3>
              <p>Mediana y rangos por usuario/bot.</p>
            </div>
          </div>
          <table>
            <thead><tr><th></th><th>Mediana</th><th>P25</th><th>P75</th></tr></thead>
            <tbody>
              <tr><td>Usuario</td><td>{msg_stats.user_length.median} chars</td><td>{msg_stats.user_length.p25}</td><td>{msg_stats.user_length.p75}</td></tr>
              <tr><td>Bot</td><td>{msg_stats.bot_length.median} chars</td><td>{msg_stats.bot_length.p25}</td><td>{msg_stats.bot_length.p75}</td></tr>
              <tr><td>Ratio Bot/User</td><td>{msg_stats.ratio_bot_user}x</td><td></td><td></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Engagement por segmento</h3>
            <p>Distribución de conversaciones por número de mensajes de usuario.</p>
          </div>
        </div>
        <div className="segment-grid">
          {engagement.map((seg, i) => (
            <div key={seg.segment} className="segment-card">
              <strong style={{ color: COLORS[i % COLORS.length] }}>{seg.count}</strong>
              <span>{seg.segment}</span>
              <small>{seg.pct}% · {seg.median_duration} min med.</small>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function TemporalTab({ daily_volume, hourly_dist, dow_dist, heatmap }) {
  const heatmapData = useMemo(() => {
    const rows = []
    for (let dow = 0; dow < 7; dow++) {
      for (let h = 0; h < 24; h++) {
        const count = heatmap[`${dow}_${h}`] || 0
        rows.push({ dow, hour: h, count, day: DOW_NAMES[dow] })
      }
    }
    return rows
  }, [heatmap])
  const maxHeat = Math.max(...heatmapData.map(d => d.count), 1)

  return (
    <>
      <div className="panel">
        <div className="panel-heading"><div><h3>Volumen diario</h3><p>Conversaciones por día.</p></div></div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={daily_volume}>
            <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
            <XAxis dataKey="date" tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="conversations" stroke="#A78BFA" fill="rgba(167,139,250,.16)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid2">
        <ChartPanel title="Distribución por hora" data={hourly_dist} xKey="hour" barKey="count" color="#60A5FA" />
        <ChartPanel title="Distribución por día de semana" data={dow_dist} xKey="day" barKey="count" color="#34D399" />
      </div>

      <div className="panel">
        <div className="panel-heading"><div><h3>Heatmap hora por día</h3><p>Intensidad de conversaciones por franja horaria.</p></div></div>
        <div className="heatmap-scroll">
          <div className="heatmap-grid">
            <div />
            {Array.from({ length: 24 }, (_, h) => <div key={h} className="heatmap-head">{h}</div>)}
            {DOW_NAMES.map((day, dow) => (
              <Fragment key={dow}>
                <div className="heatmap-day">{day}</div>
                {Array.from({ length: 24 }, (_, h) => {
                  const count = heatmap[`${dow}_${h}`] || 0
                  const intensity = count / maxHeat
                  return (
                    <div
                      key={`${dow}-${h}`}
                      title={`${day} ${h}:00 - ${count} conversaciones`}
                      className="heatmap-cell"
                      style={{ '--heat': count === 0 ? 0 : 0.16 + intensity * 0.84 }}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function ChartPanel({ title, data, xKey, barKey, color }) {
  return (
    <div className="panel">
      <div className="panel-heading"><div><h3>{title}</h3></div></div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
          <XAxis dataKey={xKey} tick={tickStyle} />
          <YAxis tick={tickStyle} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Conversaciones']} />
          <Bar dataKey={barKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function EngagementTab({ engagement, distributions }) {
  const pieData = engagement.map((seg, i) => ({ name: seg.segment, value: seg.count, fill: COLORS[i % COLORS.length] }))

  return (
    <>
      <div className="grid2">
        <div className="panel">
          <div className="panel-heading"><div><h3>Segmentación de engagement</h3></div></div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ChartPanel title="Duración mediana por segmento" data={engagement} xKey="segment" barKey="median_duration" color="#FBBF24" />
      </div>

      <div className="grid2">
        <ChartPanel title="Mensajes por conversación" data={distributions.total_msgs} xKey="bin" barKey="count" color="#60A5FA" />
        <ChartPanel title="Duración de conversación (min)" data={distributions.duration} xKey="bin" barKey="count" color="#A78BFA" />
      </div>
    </>
  )
}

function ToolsTab({ tool_usage }) {
  const { top_tools, total_distinct, convos_with_tools, convos_with_tools_pct } = tool_usage

  if (top_tools.length === 0) {
    return (
      <div className="empty-state">
        <IconTools />
        <h3>Sin herramientas detectadas</h3>
        <p>No se encontraron herramientas usadas en las conversaciones.</p>
      </div>
    )
  }

  return (
    <>
      <div className="cards cards-tight">
        <StatCard value={total_distinct} label="Herramientas distintas" color="#2DD4BF" icon={<IconTools />} />
        <StatCard value={convos_with_tools} label="Convos con herramientas" color="#60A5FA" />
        <StatCard value={`${convos_with_tools_pct}%`} label="% con herramientas" color="#34D399" />
      </div>
      <div className="panel">
        <div className="panel-heading"><div><h3>Top herramientas usadas</h3></div></div>
        <ResponsiveContainer width="100%" height={Math.max(300, top_tools.length * 32)}>
          <BarChart data={[...top_tools].reverse()} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
            <XAxis type="number" tick={tickStyle} />
            <YAxis type="category" dataKey="tool" tick={{ ...tickStyle, fontSize: 10 }} width={180} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Conversaciones']} />
            <Bar dataKey="count" fill="#2DD4BF" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

function DistributionsTab({ distributions, msg_stats }) {
  return (
    <>
      <div className="grid2">
        <HistogramPanel title="Longitud mensajes usuario" data={distributions.user_msg_length} meta={`Mediana: ${msg_stats.user_length.median} · P25: ${msg_stats.user_length.p25} · P75: ${msg_stats.user_length.p75}`} color="#FBBF24" />
        <HistogramPanel title="Longitud mensajes bot" data={distributions.bot_msg_length} meta={`Mediana: ${msg_stats.bot_length.median} · P25: ${msg_stats.bot_length.p25} · P75: ${msg_stats.bot_length.p75}`} color="#60A5FA" />
      </div>
      <div className="grid2">
        <HistogramPanel title="Mensajes de usuario por conversación" data={distributions.user_msgs} color="#FB923C" />
        <HistogramPanel title="Tiempo respuesta bot (seg)" data={distributions.response_time} color="#A78BFA" />
      </div>
    </>
  )
}

function HistogramPanel({ title, data, meta, color }) {
  return (
    <div className="panel">
      <div className="panel-heading"><div><h3>{title}</h3>{meta && <p>{meta}</p>}</div></div>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
          <XAxis dataKey="bin" tick={tickStyle} />
          <YAxis tick={tickStyle} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Mensajes']} labelFormatter={l => `~${l}`} />
          <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function QualityTab({ quality, msg_stats, summary }) {
  const checks = [
    {
      label: 'Cobertura timestamps',
      value: `${quality.timestamp_coverage}%`,
      status: quality.timestamp_coverage > 95 ? 'ok' : quality.timestamp_coverage > 80 ? 'warn' : 'bad',
      detail: `${quality.timestamp_coverage}% de mensajes tienen timestamp válido`,
    },
    {
      label: 'Mensajes vacíos',
      value: `${quality.empty_messages_pct}%`,
      status: quality.empty_messages_pct < 1 ? 'ok' : quality.empty_messages_pct < 5 ? 'warn' : 'bad',
      detail: `${msg_stats.empty_user} de usuario + ${msg_stats.empty_bot} de bot`,
    },
    { label: 'Balance User/Bot', value: quality.user_bot_balance, status: 'ok', detail: 'Mensajes de usuario vs bot' },
    { label: 'Sesiones sin usuario', value: quality.no_user_sessions, status: quality.no_user_sessions === 0 ? 'ok' : 'warn', detail: 'Sesiones sin ningún mensaje de usuario' },
    { label: 'Sesiones de 1 mensaje', value: quality.single_msg_sessions, status: quality.single_msg_sessions < summary.total_sessions * 0.1 ? 'ok' : 'warn', detail: 'Sesiones con un solo mensaje total' },
  ]

  const statusClasses = { ok: 'badge-green', warn: 'badge-orange', bad: 'badge-red' }
  const statusLabels = { ok: 'OK', warn: 'Revisar', bad: 'Problema' }

  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h3><IconShield /> Calidad de datos</h3>
          <p>Validaciones básicas del dataset usado por EDA.</p>
        </div>
      </div>
      <div className="scroll-table">
        <table>
          <thead><tr><th>Check</th><th>Estado</th><th>Valor</th><th>Detalle</th></tr></thead>
          <tbody>
            {checks.map(c => (
              <tr key={c.label}>
                <td>{c.label}</td>
                <td><span className={`badge ${statusClasses[c.status]}`}>{statusLabels[c.status]}</span></td>
                <td>{c.value}</td>
                <td>{c.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
