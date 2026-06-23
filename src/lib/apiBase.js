/** API base URL — relative in dev (Vite proxy), absolute when VITE_API_URL is set. */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL
  if (configured) return configured.replace(/\/$/, '')
  return '/api/v1'
}
