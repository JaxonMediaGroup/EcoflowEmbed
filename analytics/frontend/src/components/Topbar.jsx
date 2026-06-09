import { IconActivity, IconMenu, IconRefresh } from './Icons'

const DAYS_OPTIONS = [
  { value: 7, label: 'Últimos 7 días' },
  { value: 14, label: 'Últimos 14 días' },
  { value: 30, label: 'Últimos 30 días' },
  { value: 60, label: 'Últimos 60 días' },
  { value: 90, label: 'Últimos 90 días' },
  { value: 180, label: 'Últimos 6 meses' },
  { value: 365, label: 'Último año' },
  { value: 0, label: 'Todo (desde Ene 2025)' },
]

export default function Topbar({ title, days, onDaysChange, onRefresh, onMenuClick, status = 'Listo', updatedAt }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} title="Abrir navegación">
          <IconMenu />
        </button>
        <div>
          <div className="topbar-title">{title}</div>
          <div className="topbar-meta">
            <span className="status-dot" />
            <span>{status}</span>
            {updatedAt && <span>Actualizado: {updatedAt}</span>}
          </div>
        </div>
      </div>

      <div className="topbar-controls">
        <label className="period-control">
          <span>Periodo</span>
          <select value={days} onChange={e => onDaysChange(Number(e.target.value))}>
            {DAYS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <button className="secondary-action icon-action" onClick={() => onRefresh(true)} title="Recalcular datos">
          <IconRefresh /> Recalcular
        </button>
        <span className="source-pill"><IconActivity /> Backend 5050</span>
      </div>
    </div>
  )
}
