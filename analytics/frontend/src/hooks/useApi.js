import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../utils/api'

export function useApi() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState({ current: 0, total: 0, text: 'Conectando...' })
  const [days, setDays] = useState(30)
  const [updatedAt, setUpdatedAt] = useState('')

  const fetchData = useCallback(async (d, force = false) => {
    setLoading(true)
    setError('')
    setProgress({ current: 0, total: 0, text: 'Conectando...' })

    try {
      // Poll status until ready
      let ready = false
      let triggered = false
      let failures = 0
      while (!ready) {
        let sr
        try {
          sr = await apiFetch('/api/status')
        } catch {
          failures += 1
          if (failures >= 3) throw new Error('No hay conexión con el backend en localhost:5050. Inicia DataAnalist y vuelve a intentar.')
          setProgress({ current: 0, total: 0, text: 'Esperando backend en localhost:5050...' })
          await new Promise(r => setTimeout(r, 3000))
          continue
        }
        if (!sr.ok) {
          failures += 1
          if (failures >= 3) throw new Error(`El backend respondió con estado ${sr.status}.`)
          await new Promise(r => setTimeout(r, 3000))
          continue
        }
        failures = 0
        const st = await sr.json()
        if (st.status === 'ready') {
          ready = true
        } else if (st.status === 'loading') {
          setProgress({ current: st.current, total: st.total, text: st.progress })
          if (force && !triggered) {
            apiFetch(`/api/data?days=${d}&force=true`).catch(() => {})
            triggered = true
          }
          await new Promise(r => setTimeout(r, 4000))
        } else {
          apiFetch(`/api/data?days=${d}&force=false`).catch(() => {})
          await new Promise(r => setTimeout(r, 2000))
        }
      }

      setProgress(p => ({ ...p, text: 'Procesando datos...' }))
      const resp = await apiFetch(`/api/data?days=${d}&force=false`)
      const json = await resp.json()
      if (json && json.results) {
        setData(json)
        setUpdatedAt(new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }))
      } else if (json?.status === 'loading') {
        throw new Error('El análisis todavía está corriendo. Reintenta en unos segundos.')
      } else {
        throw new Error('La respuesta del backend no incluyó resultados de análisis.')
      }
    } catch (e) {
      console.error('Error loading data:', e)
      setError(e.message || 'No se pudo cargar el análisis.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(days)
  }, []) // eslint-disable-line

  const refresh = (force = false) => fetchData(days, force)
  const changeDays = (d) => {
    setDays(d)
    fetchData(d, true)
  }

  return { data, loading, error, progress, days, updatedAt, refresh, changeDays }
}
