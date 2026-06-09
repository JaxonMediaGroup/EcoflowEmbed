const COLOR_GRADIENTS = {
  '#3b82f6': 'linear-gradient(135deg, #3B82F6, #06B6D4)',
  '#3498db': 'linear-gradient(135deg, #3B82F6, #06B6D4)',
  '#22c55e': 'linear-gradient(135deg, #22C55E, #14B8A6)',
  '#2ecc71': 'linear-gradient(135deg, #22C55E, #14B8A6)',
  '#14b8a6': 'linear-gradient(135deg, #14B8A6, #06B6D4)',
  '#1abc9c': 'linear-gradient(135deg, #14B8A6, #06B6D4)',
  '#ef4444': 'linear-gradient(135deg, #EF4444, #F59E0B)',
  '#e94560': 'linear-gradient(135deg, #EF4444, #F59E0B)',
  '#f59e0b': 'linear-gradient(135deg, #F59E0B, #EF4444)',
  '#e67e22': 'linear-gradient(135deg, #F59E0B, #EF4444)',
  '#8b5cf6': 'linear-gradient(135deg, #7C3AED, #3B82F6)',
  '#9b59b6': 'linear-gradient(135deg, #7C3AED, #3B82F6)',
  '#7c3aed': 'linear-gradient(135deg, #7C3AED, #3B82F6)',
}

export default function StatCard({ value, label, color = '#3b82f6', border, helper, icon, tone = 'neutral' }) {
  const lc = color.toLowerCase()
  const gradient = COLOR_GRADIENTS[lc] || `linear-gradient(135deg, ${color}, ${color}aa)`
  return (
    <div
      className={`stat-card tone-${tone}`}
      style={{ '--card-gradient': gradient, '--metric-color': color, ...(border ? { border: `1px solid ${border}` } : {}) }}
    >
      <div className="stat-card-header">
        <div className="label">{label}</div>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      <div className="num">{value}</div>
      {helper && <div className="stat-helper">{helper}</div>}
    </div>
  )
}
