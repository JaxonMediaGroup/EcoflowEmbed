import { NavLink } from 'react-router-dom'
import {
  IconBot,
  IconBrain,
  IconFolder,
  IconHome,
  IconSettings,
  IconShield,
  IconTrend,
  IconX,
} from './Icons'

const KoppiLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="kg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="55%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#22C55E" />
      </linearGradient>
    </defs>
    <rect width="28" height="28" rx="7" fill="url(#kg)" />
    <text x="14" y="20" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Inter,system-ui,sans-serif">K</text>
  </svg>
)

const NavItem = ({ to, icon, label, badge, badgeTone = 'neutral', end = false, onNavigate }) => (
  <li>
    <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''} end={end} onClick={onNavigate}>
      <span className="sidebar-icon">{icon}</span>
      <span className="sidebar-label">{label}</span>
      {badge !== undefined && <span className={`sidebar-badge ${badgeTone}`}>{badge}</span>}
    </NavLink>
  </li>
)

export default function Sidebar({ data, open = false, onClose }) {
  const R = data?.results || []
  const totalMsgs = R.reduce((s, r) => s + (r.total_messages || 0), 0)
  const totalGaps = R.reduce((s, r) => s + (r.knowledge_gaps?.length || 0), 0)
  const totalLeaks = R.reduce((s, r) => s + (r.doc_leaks?.length || 0), 0)
  const totalOTA = R.reduce((s, r) => s + (r.off_topic_answered || 0), 0)
  const totalNoTools = R.filter(r => r.qa_without_tools_over_threshold ?? r.qa_without_info_get_over_threshold).length
  const totalIssues = totalGaps + totalLeaks + totalOTA + totalNoTools
  const activeChatflows = R.filter(r => r.total_messages > 0).length

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <span className="logo-icon"><KoppiLogo /></span>
        <span className="logo-text">
          koppi
          <span className="logo-sub">analytics</span>
        </span>
        <button className="sidebar-close" onClick={onClose} title="Cerrar navegación">
          <IconX />
        </button>
      </div>

      <ul className="sidebar-nav">
        <li className="sidebar-section">Diagnóstico</li>
        <NavItem to="/" icon={<IconHome />} label="Dashboard" badge={totalMsgs.toLocaleString()} badgeTone="green" end onNavigate={onClose} />
        <NavItem to="/quality" icon={<IconShield />} label="Centro de Calidad" badge={totalIssues || undefined} onNavigate={onClose} />
        <NavItem to="/conversations" icon={<IconBrain />} label="Conversaciones IA" onNavigate={onClose} />
        <NavItem to="/eda" icon={<IconTrend />} label="Análisis Exploratorio" onNavigate={onClose} />

        <li className="sidebar-section">Administración</li>
        <NavItem to="/chatflows" icon={<IconBot />} label="Chatflows" badge={activeChatflows} badgeTone="green" onNavigate={onClose} />
        <NavItem to="/projects" icon={<IconFolder />} label="Proyectos" onNavigate={onClose} />
        <NavItem to="/agents" icon={<IconSettings />} label="Agentes" badge={R.length} badgeTone="green" onNavigate={onClose} />
      </ul>
    </aside>
  )
}
