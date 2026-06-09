import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChatflowList({ data }) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const R = data.results

  const filtered = useMemo(() => {
    const s = search.toLowerCase()
    return R.filter(r => r.total_messages > 0 && r.chatflow.toLowerCase().includes(s))
      .sort((a, b) => b.total_messages - a.total_messages)
  }, [R, search])

  return (
    <div className="container">
      <input
        className="search-input"
        placeholder="🔍 Buscar chatflow por nombre..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtered.map(r => {
          const gapPct = r.bot_messages > 0 ? (r.knowledge_gaps.length / r.bot_messages * 100).toFixed(1) : '0'
          const ot = (r.off_topic || []).length
          return (
            <div
              key={r.chatflow}
              className="stat-card clickable"
              style={{ cursor: 'pointer', textAlign: 'left', padding: '16px 18px' }}
              onClick={() => navigate(`/chatflows/${encodeURIComponent(r.chatflow)}`)}
            >
              <div style={{ fontWeight: 700, fontSize: '.95em', marginBottom: 10, color: '#fff' }}>
                {r.chatflow}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '.82em' }}>
                <div><span style={{ color: '#888' }}>Mensajes:</span> <strong style={{ color: '#3498db' }}>{r.total_messages}</strong></div>
                <div><span style={{ color: '#888' }}>Convos:</span> <strong style={{ color: '#2ecc71' }}>{r.total_conversations}</strong></div>
                <div><span style={{ color: '#888' }}>Brechas:</span> <strong style={{ color: gapPct > 15 ? '#e94560' : gapPct > 5 ? '#e67e22' : '#2ecc71' }}>{r.knowledge_gaps.length} ({gapPct}%)</strong></div>
                <div><span style={{ color: '#888' }}>Filtraciones:</span> <strong style={{ color: r.doc_leaks.length > 0 ? '#e67e22' : '#2ecc71' }}>{r.doc_leaks.length}</strong></div>
                {ot > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: '#888' }}>Off-Topic:</span> <strong style={{ color: '#e94560' }}>{r.off_topic_answered || 0} respondidos / {ot} total</strong>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: 40 }}>
          No se encontraron chatflows con "{search}"
        </div>
      )}
    </div>
  )
}
