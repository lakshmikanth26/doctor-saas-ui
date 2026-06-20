import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      // Never kick out a demo session — just silently reject API calls
      if (localStorage.getItem('demo_mode')) return Promise.reject(err)
      try {
        const refresh = localStorage.getItem('refresh_token')
        const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken: refresh })
        localStorage.setItem('access_token', data.data.accessToken)
        localStorage.setItem('refresh_token', data.data.refreshToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
