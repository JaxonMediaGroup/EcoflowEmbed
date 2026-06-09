const envApiBase = import.meta.env.VITE_API_URL || ''
const isLocalBrowser = ['localhost', '127.0.0.1'].includes(window.location.hostname)
const API_BASE = isLocalBrowser ? '' : envApiBase
const API_KEY = import.meta.env.VITE_API_KEY || ''

/**
 * Fetch wrapper that adds API base URL and auth header.
 * Drop-in replacement for fetch('/api/...').
 */
export function apiFetch(path, options = {}) {
  const url = API_BASE + path
  const headers = { ...options.headers }
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY
  }
  return fetch(url, { ...options, headers })
}
