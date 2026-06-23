<template>
  <div class="min-h-screen flex" style="background:#0f172a">

    <!-- Left panel — branding -->
    <div class="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
      style="background:linear-gradient(135deg,#1e293b,#0f172a); border-right:1px solid rgba(255,255,255,0.06)">
      <!-- Glow -->
      <div class="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
        style="background:radial-gradient(circle,#3b82f6,transparent)"></div>
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 translate-x-1/2 translate-y-1/2"
        style="background:radial-gradient(circle,#06b6d4,transparent)"></div>

      <!-- Logo -->
      <div class="flex items-center gap-3 relative">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg"
          style="background:linear-gradient(135deg,#2563eb,#1d4ed8); box-shadow:0 4px 16px rgba(37,99,235,0.4)">C</div>
        <span class="text-white font-black text-xl">Mednest</span>
      </div>

      <!-- Middle copy -->
      <div class="relative">
        <p class="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Clinic Management</p>
        <h2 class="text-4xl font-black text-white leading-tight mb-6">
          Everything your<br/>clinic needs,<br/><span style="color:#60a5fa">in one place.</span>
        </h2>
        <div class="space-y-3">
          <div v-for="f in features" :key="f" class="flex items-center gap-3 text-slate-400 text-sm">
            <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style="background:rgba(16,185,129,0.2)">
              <svg class="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            {{ f }}
          </div>
        </div>
      </div>

      <!-- Patient portal callout -->
      <RouterLink to="/portal"
        class="relative flex items-center gap-4 p-4 rounded-2xl transition-all group"
        style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08)">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style="background:rgba(59,130,246,0.15)">
          <svg class="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-white text-sm font-bold group-hover:text-blue-300 transition-colors">Patient? Book an Appointment</p>
          <p class="text-slate-500 text-xs mt-0.5">No login needed · See live queue status</p>
        </div>
        <svg class="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </RouterLink>
    </div>

    <!-- Right panel — form -->
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-sm">

        <!-- Mobile logo -->
        <div class="flex items-center gap-3 mb-10 lg:hidden">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white"
            style="background:linear-gradient(135deg,#2563eb,#1d4ed8)">C</div>
          <span class="text-white font-black text-lg">Mednest</span>
        </div>

        <h1 class="text-3xl font-black text-white mb-1">Welcome back</h1>
        <p class="text-slate-400 text-sm mb-8">Sign in to your clinic dashboard</p>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="label">Email</label>
            <input v-model="form.email" type="email" class="input" placeholder="doctor@clinic.com" required />
          </div>
          <div>
            <label class="label">Password</label>
            <input v-model="form.password" type="password" class="input" placeholder="••••••••" required />
          </div>

          <div v-if="error" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400"
            style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2)">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full justify-center py-3 text-base font-bold" :disabled="loading">
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-6">
          New clinic?
          <RouterLink to="/register" class="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Register free →</RouterLink>
        </p>

        <!-- Mobile patient portal link -->
        <RouterLink to="/portal"
          class="mt-8 flex items-center gap-3 p-4 rounded-2xl lg:hidden"
          style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07)">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(59,130,246,0.15)">
            <svg class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-white text-sm font-bold">Book an Appointment</p>
            <p class="text-slate-500 text-xs">Patient portal · No login required</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

const features = [
  'Appointments & live queue management',
  'EMR with SOAP notes & prescriptions',
  'Billing, invoices & inventory',
  'Patient portal for self-booking',
]

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value.email, form.value.password)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>
