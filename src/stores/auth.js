import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const org = ref(JSON.parse(localStorage.getItem('org') || 'null'))

  const isLoggedIn = computed(() => !!user.value && !!localStorage.getItem('access_token'))
  const isSystemAdmin = computed(() => ['SYSTEM_ADMIN', 'SALES_REP', 'SALES_MANAGER'].includes(user.value?.systemRole))

  async function login(emailOrPayload, password) {
    const payload = typeof emailOrPayload === 'object'
      ? emailOrPayload
      : { email: emailOrPayload, password }
    const { data } = await api.post('/auth/login', payload)
    const d = data.data
    localStorage.setItem('access_token', d.accessToken)
    localStorage.setItem('refresh_token', d.refreshToken)
    user.value = d.user
    org.value = d.org
    localStorage.setItem('user', JSON.stringify(d.user))
    localStorage.setItem('org', JSON.stringify(d.org))
    return d
  }

  function loginAsDemo() {
    const demoUser = {
      id: 'demo-user-id', firstName: 'Demo', lastName: 'Doctor',
      email: 'demo@mednest.in', role: 'DOCTOR', systemRole: 'CLINIC_ADMIN',
    }
    const demoOrg = {
      id: 'demo-org-id', name: 'City Medical Center',
      slug: 'city-medical-demo', plan: 'growth',
    }
    localStorage.setItem('access_token', 'demo-token')
    localStorage.setItem('refresh_token', 'demo-refresh')
    localStorage.setItem('user', JSON.stringify(demoUser))
    localStorage.setItem('org', JSON.stringify(demoOrg))
    localStorage.setItem('demo_mode', '1')
    user.value = demoUser
    org.value = demoOrg
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload)
    const d = data.data
    localStorage.setItem('access_token', d.accessToken)
    localStorage.setItem('refresh_token', d.refreshToken)
    user.value = d.user
    org.value = d.org
    localStorage.setItem('user', JSON.stringify(d.user))
    localStorage.setItem('org', JSON.stringify(d.org))
    return d
  }

  async function fetchMe() {
    const { data } = await api.get('/auth/me')
    user.value = data.data.user
    org.value = data.data.org
    localStorage.setItem('user', JSON.stringify(data.data.user))
    localStorage.setItem('org', JSON.stringify(data.data.org))
  }

  function logout() {
    if (!localStorage.getItem('demo_mode')) api.post('/auth/logout').catch(() => {})
    localStorage.clear()
    user.value = null
    org.value = null
    window.location.href = '/login'
  }

  return { user, org, isLoggedIn, isSystemAdmin, login, loginAsDemo, register, fetchMe, logout }
})
