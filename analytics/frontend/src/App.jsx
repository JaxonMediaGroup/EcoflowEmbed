import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useApi } from './hooks/useApi'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import LoadingScreen from './components/LoadingScreen'
import Overview from './pages/Overview'
import ChatflowList from './pages/ChatflowList'
import ChatflowDetail from './pages/ChatflowDetail'
import Quality from './pages/Quality'
import Projects from './pages/Projects'
import Conversations from './pages/Conversations'
import EDA from './pages/EDA'
import AgentAdmin from './pages/AgentAdmin'
import AgentDetail from './pages/AgentDetail'

function LoadingShell({ loading, error, progress, onRetry }) {
  return (
    <div className="layout">
      <Sidebar data={{ results: [] }} />
      <div className="main-content">
        <LoadingScreen
          progress={loading ? progress : { current: 0, total: 0, text: 'Conectando con el servidor...' }}
          error={error}
          onRetry={onRetry}
        />
      </div>
    </div>
  )
}

export default function App() {
  const { data, loading, error, progress, days, updatedAt, refresh, changeDays } = useApi()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading || error || !data) {
    return <LoadingShell loading={loading} error={error} progress={progress} onRetry={() => refresh(false)} />
  }

  return (
    <div className="layout">
      <Sidebar data={data} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="mobile-scrim" aria-label="Cerrar navegación" onClick={() => setSidebarOpen(false)} />}
      <div className="main-content">
        <Topbar
          title="Dashboard operativo"
          days={days}
          onDaysChange={changeDays}
          onRefresh={refresh}
          onMenuClick={() => setSidebarOpen(true)}
          status="Análisis listo"
          updatedAt={updatedAt}
        />
        <Routes>
          <Route path="/" element={<Overview data={data} />} />
          <Route path="/quality" element={<Quality data={data} />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/eda" element={<EDA />} />
          <Route path="/chatflows" element={<ChatflowList data={data} />} />
          <Route path="/chatflows/:name" element={<ChatflowDetail data={data} />} />
          <Route path="/projects" element={<Projects data={data} />} />
          <Route path="/agents" element={<AgentAdmin />} />
          <Route path="/agents/:id" element={<AgentDetail />} />
        </Routes>
      </div>
    </div>
  )
}
