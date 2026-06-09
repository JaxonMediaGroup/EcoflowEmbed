export default function LoadingScreen({ progress, error, onRetry }) {
  const pct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0
  if (error) {
    return (
      <div className="loading-screen state-screen">
        <div className="state-kicker">Backend no disponible</div>
        <h2>No se pudo cargar el análisis actual</h2>
        <p>{error}</p>
        {onRetry && <button className="primary-action" onClick={onRetry}>Reintentar conexión</button>}
      </div>
    )
  }

  return (
    <div className="loading-screen">
      <div className="spinner" />
      <h2>Cargando análisis actual</h2>
      <p>
        {progress.total > 0
          ? `[${progress.current}/${progress.total}] ${progress.text}`
          : progress.text}
      </p>
      {progress.total > 0 && (
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: pct + '%' }} />
        </div>
      )}
    </div>
  )
}
