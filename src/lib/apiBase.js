const DEFAULT_PRODUCTION_API = 'https://doctor-saas-gamma.vercel.app/api/v1'

/** API base URL — relative in dev (Vite proxy), absolute in production. */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL
  if (configured) return configured.replace(/\/$/, '')
  if (import.meta.env.PROD) return DEFAULT_PRODUCTION_API
  return '/api/v1'
}
