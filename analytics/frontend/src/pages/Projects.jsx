import { useState, useEffect } from 'react'
import { apiFetch } from '../utils/api'

const CATEGORY_COLORS = {
  'real-estate': '#4DD0E1',
  'commercial': '#FFB74D',
  'hospitality': '#CE93D8',
  'industrial': '#90A4AE',
  'education': '#81C784',
  'aviation': '#64B5F6',
  'coworking': '#F48FB1',
  'tech': '#A5D6A7',
  'crm': '#FFD54F',
}

const CATEGORY_LABELS = {
  'real-estate': 'Inmobiliario',
  'commercial': 'Comercial',
  'hospitality': 'Hotelero',
  'industrial': 'Industrial',
  'education': 'Educacion',
  'aviation': 'Aviacion',
  'coworking': 'Coworking',
  'tech': 'Tecnologia',
  'crm': 'CRM',
}

export default function Projects({ data }) {
  const [projects, setProjects] = useState([])
  const [totalEmbeds, setTotalEmbeds] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    apiFetch('/api/projects')
      .then(r => r.json())
      .then(d => {
        setProjects(d.projects || [])
        setTotalEmbeds(d.total_embeds || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-loading">Cargando proyectos...</div>

  // Build analytics lookup
  const analyticsMap = {}
  for (const r of (data?.results || [])) {
    analyticsMap[r.chatflow_name] = r
  }

  // Get unique categories
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))].sort()

  // Filter
  const filtered = projects.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    return true
  })

  // Stats
  const totalProjects = projects.length
  const withLocal = projects.filter(p => p.has_local).length
  const withAnalytics = projects.filter(p => analyticsMap[p.name]).length
  return (
    <div className="projects-page">
      <div className="stat-cards">
        <div className="stat-card" style={{ borderColor: '#4DD0E1' }}>
          <div className="stat-number">{totalProjects}</div>
          <div className="stat-label">Proyectos</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#81C784' }}>
          <div className="stat-number">{withLocal}</div>
          <div className="stat-label">Con JSON local</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#FFB74D' }}>
          <div className="stat-number">{withAnalytics}</div>
          <div className="stat-label">Con analytics</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#64B5F6' }}>
          <div className="stat-number">{totalEmbeds}</div>
          <div className="stat-label">HTML Embeds</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#CE93D8' }}>
          <div className="stat-number">{categories.length}</div>
          <div className="stat-label">Categorias</div>
        </div>
      </div>

      <div className="projects-toolbar">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="projects-search"
        />
        <div className="category-filters">
          <button
            className={`cat-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            Todos ({projects.length})
          </button>
          {categories.map(cat => {
            const count = projects.filter(p => p.category === cat).length
            return (
              <button
                key={cat}
                className={`cat-btn ${categoryFilter === cat ? 'active' : ''}`}
                style={{ '--cat-color': CATEGORY_COLORS[cat] || '#999' }}
                onClick={() => setCategoryFilter(cat)}
              >
                {CATEGORY_LABELS[cat] || cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <div className="projects-grid">
        {filtered.map(p => {
          const analytics = analyticsMap[p.name]
          const isExpanded = expanded === p.name
          return (
            <div
              key={p.name}
              className={`project-card ${isExpanded ? 'expanded' : ''}`}
              style={{ '--card-accent': CATEGORY_COLORS[p.category] || '#666' }}
            >
              <div className="project-header" onClick={() => setExpanded(isExpanded ? null : p.name)}>
                <div className="project-name">{p.name}</div>
                <div className="project-badges">
                  <span className="badge cat-badge">{CATEGORY_LABELS[p.category] || p.category || 'Sin cat.'}</span>
                  {p.has_local && <span className="badge local-badge">JSON</span>}
                  {p.embeds?.length > 0 && <span className="badge embed-badge">{p.embeds.length} embed{p.embeds.length > 1 ? 's' : ''}</span>}
                  {analytics && <span className="badge analytics-badge">{analytics.total_messages} msgs</span>}
                </div>
              </div>

              {isExpanded && (
                <div className="project-details">
                  <div className="detail-row">
                    <span className="detail-label">Chatflow ID</span>
                    <code className="detail-value">{p.chatflow_id || '-'}</code>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tipo</span>
                    <span className="detail-value">{p.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">JSON</span>
                    <span className="detail-value">{p.json_file || 'No local file'}</span>
                  </div>
                  {analytics && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Mensajes</span>
                        <span className="detail-value">{analytics.total_messages}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Conversaciones</span>
                        <span className="detail-value">{analytics.total_conversations}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Brechas</span>
                        <span className="detail-value">{analytics.knowledge_gaps?.length || 0}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Off-topic</span>
                        <span className="detail-value">{analytics.off_topic?.length || 0}</span>
                      </div>
                    </>
                  )}
                  {p.agents.length > 0 && (
                    <div className="agents-section">
                      <div className="detail-label">Agentes ({p.agents.length})</div>
                      <div className="agents-list">
                        {p.agents.map(a => (
                          <div key={a.id} className="agent-chip">
                            <span className="agent-type">{a.type === 'ConditionAgent' ? 'Router' : a.type === 'Start' ? 'Start' : 'Agent'}</span>
                            <span className="agent-name">{a.label}</span>
                            {a.model && <span className="agent-model">{a.model}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {p.embeds?.length > 0 && (
                    <div className="embeds-section">
                      <div className="detail-label">HTML Embeds ({p.embeds.length})</div>
                      <div className="embeds-list">
                        {p.embeds.map((e, i) => (
                          <div key={i} className="embed-card">
                            <div className="embed-header">
                              <span className="embed-color-dot" style={{ background: e.primary_color || '#666' }} />
                              <span className="embed-title">{e.title || e.folder}</span>
                              <span className="embed-file">{e.file}</span>
                            </div>
                            <div className="embed-meta">
                              {e.tooltip_text && <span className="embed-tag">{e.tooltip_text}</span>}
                              {e.window_width && e.window_height && (
                                <span className="embed-tag">{e.window_width}x{e.window_height}</span>
                              )}
                              {e.primary_color && (
                                <span className="embed-tag">
                                  <span className="embed-color-swatch" style={{ background: e.primary_color }} />
                                  {e.primary_color}
                                </span>
                              )}
                            </div>
                            {e.bot_avatar && (
                              <div className="embed-avatar-row">
                                <img className="embed-avatar" src={e.bot_avatar} alt="" />
                                <span className="embed-tag dim">Bot avatar</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
