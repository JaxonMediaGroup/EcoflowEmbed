import { exportCSV } from '../utils/helpers'
import { IconDownload, IconTable } from './Icons'

export default function DataTable({ title, subtitle, headers, rows, exportName, maxHeight = 400, compact = false }) {
  return (
    <div className="panel data-table-panel">
      <div className="panel-heading">
        <div>
          <h3><IconTable /> {title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {exportName && rows.length > 0 && (
          <button
            className="secondary-action icon-action"
            onClick={() => exportCSV(headers, rows, exportName + '.csv')}
            title="Exportar CSV"
          >
            <IconDownload /> CSV
          </button>
        )}
      </div>
      <div className="scroll-table" style={{ maxHeight }}>
        <table className={compact ? 'compact-table' : ''}>
          <thead>
            <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="empty-cell">
                  Sin datos
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className={r.onClick ? 'clickable' : ''} onClick={r.onClick}>
                  {r.cells.map((c, j) => <td key={j}>{c}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
