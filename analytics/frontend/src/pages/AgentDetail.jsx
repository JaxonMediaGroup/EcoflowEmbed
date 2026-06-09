import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../utils/api'
import { truncate } from '../utils/helpers'

const tabs = [
  { id: 'overview', label: 'Resumen' },
  { id: 'editor', label: 'Editor' },
  { id: 'publish', label: 'Publicacion' },
  { id: 'audit', label: 'Auditoria' },
]

export default function AgentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview')

  const loadDetail = async () => {
    setLoading(true)
    setError('')
    try {
      const resp = await apiFetch(`/api/admin/projects/${encodeURIComponent(id)}`)
      const json = await resp.json()
      if (!resp.ok) throw new Error(json.error || 'No se pudo cargar el agente')
      setDetail(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetail()
  }, [id])

  if (loading) return <div className="page-loading">Cargando agente...</div>
  if (error) {
    return (
      <div className="container">
        <button className="secondary-action" onClick={() => navigate('/agents')}>Volver</button>
        <div className="alert alert-red" style={{ marginTop: 16 }}>{error}</div>
      </div>
    )
  }
  if (!detail) return null

  const { project, summary, validation, audit } = detail
  const analyticsIssues = audit?.issues || []

  return (
    <div className="container">
      <div className="admin-header">
        <div>
          <button className="secondary-action" onClick={() => navigate('/agents')}>Volver</button>
          <h2 style={{ marginTop: 12 }}>{project.name}</h2>
          <p>{project.category || 'sin categoria'} - {project.chatflow_id || 'sin chatflow id'}</p>
        </div>
        <div className="header-actions">
          <button className="secondary-action" onClick={loadDetail}>Recargar</button>
          <button className="primary-action" onClick={() => setTab('publish')}>Publicar</button>
        </div>
      </div>

      <div className="agent-tabs">
        {tabs.map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <OverviewTab project={project} summary={summary} validation={validation} analyticsIssues={analyticsIssues} />
      )}
      {tab === 'editor' && (
        <EditorTab detail={detail} onSaved={loadDetail} />
      )}
      {tab === 'publish' && (
        <PublishTab projectId={project.id || project.name} onPublished={loadDetail} />
      )}
      {tab === 'audit' && (
        <AuditTab history={detail.history || []} audit={audit} />
      )}
    </div>
  )
}

function OverviewTab({ project, summary, validation, analyticsIssues }) {
  return (
    <>
      <div className="cards">
        <Stat value={summary?.node_counts?.agent || 0} label="Agentes" />
        <Stat value={summary?.node_counts?.condition || 0} label="Routers" />
        <Stat value={(summary?.models || []).length} label="Modelos" />
        <Stat value={(validation?.errors || []).length + (validation?.warnings || []).length} label="Alertas" tone="orange" />
      </div>

      <div className="grid2">
        <div className="panel">
          <h3>Ficha tecnica</h3>
          <Info label="JSON local" value={project.json_file || '-'} mono />
          <Info label="Tipo" value={project.type || '-'} />
          <Info label="Actualizado local" value={project.local_mtime || '-'} />
          <Info label="Actualizado remoto" value={project.remote_updated_at || '-'} />
          <Info label="Perfil prompt" value={summary?.prompt_profile || '-'} />
          <Info label="Q&A principal" value={summary?.qna_label || '-'} />
        </div>

        <div className="panel">
          <h3>Validacion</h3>
          <IssueList title="Errores" items={validation?.errors || []} tone="red" />
          <IssueList title="Advertencias" items={validation?.warnings || []} tone="orange" />
          <IssueList title="Auditoria remota" items={analyticsIssues} tone="blue" />
        </div>
      </div>

      <div className="panel">
        <h3>Nodos y herramientas</h3>
        <div className="scroll-table">
          <table>
            <thead>
              <tr>
                <th>Nodo</th>
                <th>Tipo</th>
                <th>Modelo</th>
                <th>Tools</th>
                <th>Prompt</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.nodes || []).map(node => (
                <tr key={node.id}>
                  <td>{node.label}</td>
                  <td>{node.type}</td>
                  <td>{node.model || '-'}</td>
                  <td><div className="tool-list">{[...(node.custom_tools || []), ...(node.builtin_tools || [])].map(t => <span key={t}>{t}</span>)}</div></td>
                  <td>{node.prompt_length ? `${node.prompt_length.toLocaleString()} chars` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function EditorTab({ detail, onSaved }) {
  const editableNodes = useMemo(() => (detail.flow?.nodes || [])
    .filter(n => getMessages(n).length > 0 || getModel(n))
    .map(n => ({
      id: n.id || n.data?.id,
      label: n.data?.label || n.id,
      model: getModel(n),
      messages: getMessages(n),
    })), [detail])
  const [selectedId, setSelectedId] = useState(editableNodes[0]?.id || '')
  const selected = editableNodes.find(n => n.id === selectedId) || editableNodes[0]
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (selected) setDraft(JSON.parse(JSON.stringify(selected)))
  }, [selectedId, detail])

  if (!selected || !draft) {
    return <div className="panel">Este flujo no tiene nodos editables.</div>
  }

  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      const resp = await apiFetch(`/api/admin/projects/${encodeURIComponent(detail.project.id || detail.project.name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow_patch: {
            nodes: [{
              id: draft.id,
              label: draft.label,
              model: draft.model,
              messages: draft.messages.map(m => ({ index: m.index, role: m.role, content: m.content })),
            }],
          },
        }),
      })
      const json = await resp.json()
      if (!resp.ok) throw new Error(json.error || 'No se pudo guardar')
      setMessage('Borrador guardado. Aun no se publico en Flowise.')
      await onSaved()
    } catch (e) {
      setMessage(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="editor-layout">
      <div className="panel node-list">
        <h3>Nodos editables</h3>
        {editableNodes.map(node => (
          <button key={node.id} className={node.id === selected.id ? 'active' : ''} onClick={() => setSelectedId(node.id)}>
            <span>{node.label}</span>
            <small>{node.model || 'sin modelo'}</small>
          </button>
        ))}
      </div>

      <div className="panel editor-panel">
        <h3>Editor de borrador</h3>
        {message && <div className={`alert ${message.includes('guardado') ? 'alert-green' : 'alert-red'}`}>{message}</div>}
        <label>
          Etiqueta
          <input value={draft.label} onChange={e => setDraft(d => ({ ...d, label: e.target.value }))} />
        </label>
        <label>
          Modelo
          <input value={draft.model || ''} onChange={e => setDraft(d => ({ ...d, model: e.target.value }))} placeholder="gpt-5.2" />
        </label>
        {draft.messages.map((msg, idx) => (
          <label key={idx}>
            Prompt {idx + 1} ({msg.role || 'message'})
            <textarea
              value={msg.content}
              onChange={e => setDraft(d => ({
                ...d,
                messages: d.messages.map((m, i) => i === idx ? { ...m, content: e.target.value } : m),
              }))}
            />
          </label>
        ))}
        <div className="form-actions">
          <button className="secondary-action" onClick={() => setDraft(JSON.parse(JSON.stringify(selected)))}>Descartar cambios</button>
          <button className="primary-action" onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar borrador'}</button>
        </div>
      </div>
    </div>
  )
}

function PublishTab({ projectId, onPublished }) {
  const [validation, setValidation] = useState(null)
  const [diff, setDiff] = useState(null)
  const [confirmText, setConfirmText] = useState('')
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState('')

  const runAction = async (action) => {
    setBusy(action)
    setResult('')
    try {
      let path = `/api/admin/projects/${encodeURIComponent(projectId)}/${action}`
      let body = {}
      if (action === 'validate') body = { require_publish_ready: true }
      if (action === 'backup') body = { reason: 'manual_ui' }
      if (action === 'publish') body = { confirm: true }
      const resp = await apiFetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await resp.json()
      if (!resp.ok) throw new Error(json.error || `Error en ${action}`)
      if (action === 'validate') setValidation(json)
      if (action === 'diff') setDiff(json)
      if (action === 'backup') setResult(`Backup creado: ${json.backup}`)
      if (action === 'publish') {
        setResult(`Publicado en Flowise: ${json.published_at}`)
        await onPublished()
      }
    } catch (e) {
      setResult(e.message)
    } finally {
      setBusy('')
    }
  }

  const canPublish = confirmText === 'PUBLICAR'

  return (
    <div className="grid2 publish-grid">
      <div className="panel">
        <h3>Checklist</h3>
        <p className="muted">La publicacion usa el JSON local como borrador, crea backup y actualiza Flowise solo con confirmacion.</p>
        <div className="publish-actions">
          <button className="secondary-action" disabled={busy} onClick={() => runAction('validate')}>Validar publish-ready</button>
          <button className="secondary-action" disabled={busy} onClick={() => runAction('diff')}>Generar diff</button>
          <button className="secondary-action" disabled={busy} onClick={() => runAction('backup')}>Crear backup</button>
        </div>
        {validation && (
          <div className="validation-box">
            <strong>Estado: {validation.status}</strong>
            <IssueList title="Errores" items={validation.errors || []} tone="red" />
            <IssueList title="Advertencias" items={validation.warnings || []} tone="orange" />
          </div>
        )}
        <label className="danger-confirm">
          Escribe PUBLICAR para habilitar
          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="PUBLICAR" />
        </label>
        <button
          className="danger-action"
          disabled={!canPublish || busy}
          onClick={() => window.confirm('Publicar este borrador en Flowise?') && runAction('publish')}
        >
          Publicar en Flowise
        </button>
        {result && <div className={`alert ${result.includes('Error') || result.includes('blocked') || result.includes('required') ? 'alert-red' : 'alert-green'}`}>{result}</div>}
      </div>

      <div className="panel">
        <h3>Diff remoto vs borrador</h3>
        {!diff && <p className="muted">Genera un diff para revisar exactamente que cambiara antes de publicar.</p>}
        {diff && (
          <>
            <div className="table-meta">
              <span>{diff.changed ? `${diff.line_count} lineas con cambios` : 'Sin cambios detectados'}</span>
              {diff.truncated && <span>Vista truncada</span>}
            </div>
            <pre className="diff-box">{(diff.diff || []).join('\n')}</pre>
          </>
        )}
      </div>
    </div>
  )
}

function AuditTab({ history, audit }) {
  return (
    <div className="grid2">
      <div className="panel">
        <h3>Bitacora local</h3>
        {history.length === 0 && <p className="muted">Aun no hay cambios locales registrados.</p>}
        <div className="audit-list">
          {history.map((item, idx) => (
            <div key={idx} className="audit-item">
              <strong>{item.action}</strong>
              <span>{item.timestamp}</span>
              <code>{JSON.stringify(item.details || {})}</code>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>Auditoria remota</h3>
        <Info label="Registrado como" value={audit?.registered_name || '-'} />
        <Info label="Actualizado" value={audit?.updatedDate || '-'} />
        <Info label="Perfil" value={audit?.analysis?.prompt_profile || '-'} />
        <IssueList title="Issues" items={audit?.issues || []} tone="orange" />
      </div>
    </div>
  )
}

function getModel(node) {
  const inputs = node.data?.inputs || {}
  for (const key of ['agentModelConfig', 'conditionAgentModelConfig', 'llmModelConfig']) {
    if (inputs[key]?.modelName) return inputs[key].modelName
  }
  return ''
}

function getMessages(node) {
  const inputs = node.data?.inputs || {}
  const raw = inputs.agentMessages || inputs.llmMessages || []
  if (!Array.isArray(raw)) return []
  return raw.map((m, index) => ({
    index,
    role: m?.role || m?.type || 'message',
    content: m?.content || '',
  })).filter(m => m.content || m.index === 0)
}

function Stat({ value, label, tone = 'blue' }) {
  const color = tone === 'orange' ? '#F59E0B' : '#3B82F6'
  return (
    <div className="stat-card" style={{ '--card-gradient': `linear-gradient(135deg, ${color}, #06B6D4)` }}>
      <div className="num">{value}</div>
      <div className="label">{label}</div>
    </div>
  )
}

function Info({ label, value, mono = false }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className={mono ? 'detail-value mono' : 'detail-value'}>{value}</span>
    </div>
  )
}

function IssueList({ title, items, tone }) {
  if (!items?.length) return <p className="muted">{title}: sin hallazgos</p>
  const cls = tone === 'red' ? 'badge-red' : tone === 'orange' ? 'badge-orange' : 'badge-blue'
  return (
    <div className="issue-list">
      <div className="issue-title"><span className={`badge ${cls}`}>{title}</span></div>
      {items.map((item, idx) => <div key={idx} className="issue-item">{truncate(item, 220)}</div>)}
    </div>
  )
}
