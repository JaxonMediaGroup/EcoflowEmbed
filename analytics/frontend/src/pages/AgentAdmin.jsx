import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'

const statusLabel = {
  ok: 'OK',
  warning: 'Revisar',
  error: 'Error',
  missing: 'Sin JSON',
}

const statusClass = {
  ok: 'badge-green',
  warning: 'badge-orange',
  error: 'badge-red',
  missing: 'badge-red',
}

export default function AgentAdmin() {
  const navigate = useNavigate()
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', category: 'real-estate', template_project: '' })

  const loadProjects = async () => {
    setLoading(true)
    setError('')
    try {
      const resp = await apiFetch('/api/admin/projects')
      const json = await resp.json()
      if (!resp.ok) throw new Error(json.error || 'No se pudo cargar el inventario')
      setPayload(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const projects = payload?.projects || []
  const summary = payload?.summary || {}
  const categories = useMemo(() => [...new Set(projects.map(p => p.category).filter(Boolean))].sort(), [projects])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return projects.filter(p => {
      if (q && !`${p.name} ${p.chatflow_id} ${p.models?.join(' ')}`.toLowerCase().includes(q)) return false
      if (category !== 'all' && p.category !== category) return false
      if (status !== 'all' && p.validation_status !== status) return false
      return true
    })
  }, [projects, search, category, status])

  const createProject = async (e) => {
    e.preventDefault()
    if (!createForm.name.trim()) return
    setCreating(true)
    setError('')
    try {
      const resp = await apiFetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await resp.json()
      if (!resp.ok) throw new Error(json.error || 'No se pudo crear el agente')
      setShowCreate(false)
      setCreateForm({ name: '', category: 'real-estate', template_project: '' })
      await loadProjects()
      navigate(`/agents/${encodeURIComponent(json.project.id || json.project.name)}`)
    } catch (e2) {
      setError(e2.message)
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="page-loading">Cargando administracion de agentes...</div>

  return (
    <div className="container">
      <div className="admin-header">
        <div>
          <h2>Agentes</h2>
          <p>Inventario local, estado remoto, validacion y publicacion controlada a Flowise.</p>
        </div>
        <button className="primary-action" onClick={() => setShowCreate(v => !v)}>
          Nuevo agente
        </button>
      </div>

      {error && <div className="alert alert-red">{error}</div>}

      <div className="cards">
        <Metric value={summary.total_projects || 0} label="Proyectos" />
        <Metric value={summary.with_local || 0} label="Con borrador local" />
        <Metric value={summary.with_remote || 0} label="Con snapshot remoto" />
        <Metric value={summary.total_issues || 0} label="Issues detectados" tone="orange" />
      </div>

      {showCreate && (
        <form className="panel admin-form" onSubmit={createProject}>
          <h3>Crear agente desde plantilla</h3>
          <div className="form-grid">
            <label>
              Nombre
              <input value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre del proyecto" />
            </label>
            <label>
              Categoria
              <select value={createForm.category} onChange={e => setCreateForm(f => ({ ...f, category: e.target.value }))}>
                <option value="real-estate">real-estate</option>
                <option value="commercial">commercial</option>
                <option value="education">education</option>
                <option value="industrial">industrial</option>
                <option value="crm">crm</option>
              </select>
            </label>
            <label>
              Plantilla
              <select value={createForm.template_project} onChange={e => setCreateForm(f => ({ ...f, template_project: e.target.value }))}>
                <option value="">Mejor flujo moderno disponible</option>
                {projects.filter(p => p.has_local && p.prompt_profile === 'modern-guardrailed').slice(0, 20).map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="secondary-action" onClick={() => setShowCreate(false)}>Cancelar</button>
            <button type="submit" className="primary-action" disabled={creating}>{creating ? 'Creando...' : 'Crear borrador'}</button>
          </div>
        </form>
      )}

      <div className="admin-toolbar">
        <input className="projects-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar agente, modelo o ID..." />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">Todas las categorias</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">Todos los estados</option>
          <option value="ok">OK</option>
          <option value="warning">Revisar</option>
          <option value="error">Error</option>
          <option value="missing">Sin JSON</option>
        </select>
        <button className="secondary-action" onClick={loadProjects}>Recargar</button>
      </div>

      <div className="admin-table panel">
        <div className="table-meta">
          <strong>{filtered.length}</strong> agentes
          {summary.snapshot && <span>Snapshot: {summary.snapshot}</span>}
        </div>
        <div className="scroll-table">
          <table>
            <thead>
              <tr>
                <th>Agente</th>
                <th>Estado</th>
                <th>Nodos</th>
                <th>Modelo</th>
                <th>Tools</th>
                <th>Local / remoto</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="clickable" onClick={() => navigate(`/agents/${encodeURIComponent(p.id)}`)}>
                  <td>
                    <div className="agent-title">{p.name}</div>
                    <div className="agent-subtitle">{p.category || 'sin categoria'} - {p.chatflow_id || 'sin chatflow id'}</div>
                  </td>
                  <td>
                    <span className={`badge ${statusClass[p.validation_status] || 'badge-blue'}`}>
                      {statusLabel[p.validation_status] || p.validation_status}
                    </span>
                    {p.prompt_profile && <div className="agent-subtitle">{p.prompt_profile}</div>}
                  </td>
                  <td>
                    <span>{p.node_counts?.agent || 0} agentes</span>
                    <div className="agent-subtitle">{p.node_counts?.condition || 0} routers, {p.node_counts?.start || 0} start</div>
                  </td>
                  <td>{(p.models || []).join(', ') || '-'}</td>
                  <td>
                    <div className="tool-list">{(p.custom_tools || []).slice(0, 4).map(t => <span key={t}>{t}</span>)}</div>
                  </td>
                  <td>
                    <span className={`badge ${p.has_local ? 'badge-green' : 'badge-red'}`}>Local</span>
                    <span className={`badge ${p.has_remote ? 'badge-green' : 'badge-orange'}`} style={{ marginLeft: 6 }}>Remoto</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#64748B', padding: 30 }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Metric({ value, label, tone = 'blue' }) {
  const color = tone === 'orange' ? '#F59E0B' : '#3B82F6'
  return (
    <div className="stat-card" style={{ '--card-gradient': `linear-gradient(135deg, ${color}, #06B6D4)` }}>
      <div className="num">{value}</div>
      <div className="label">{label}</div>
    </div>
  )
}
