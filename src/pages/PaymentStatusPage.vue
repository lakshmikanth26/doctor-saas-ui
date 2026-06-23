<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background:#0f172a">
    <div class="max-w-md w-full text-center">

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div class="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto"></div>
        <p class="text-slate-400">Verifying payment…</p>
      </div>

      <!-- Paid -->
      <div v-else-if="status === 'PAID'" class="space-y-4">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style="background:rgba(16,185,129,0.2)">
          <svg class="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h1 class="text-2xl font-black text-white">Payment Successful!</h1>
        <p class="text-slate-400">Your appointment is confirmed. Order ID: <span class="text-white font-mono">{{ orderId }}</span></p>
        <RouterLink to="/appointments" class="inline-block mt-4 px-6 py-3 rounded-xl text-sm font-bold text-white" style="background:linear-gradient(135deg,#2563eb,#1d4ed8)">
          View Appointments →
        </RouterLink>
      </div>

      <!-- Failed / Expired -->
      <div v-else-if="status" class="space-y-4">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style="background:rgba(239,68,68,0.2)">
          <svg class="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </div>
        <h1 class="text-2xl font-black text-white">Payment {{ status === 'EXPIRED' ? 'Expired' : 'Failed' }}</h1>
        <p class="text-slate-400">{{ status === 'EXPIRED' ? 'The payment session expired.' : 'Something went wrong with your payment.' }} Please try again.</p>
        <button @click="$router.back()" class="inline-block mt-4 px-6 py-3 rounded-xl text-sm font-bold text-white" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1)">
          ← Go Back
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { getApiBaseUrl } from '@/lib/apiBase.js'

const route   = useRoute()
const loading = ref(true)
const status  = ref('')
const orderId = ref('')

onMounted(async () => {
  orderId.value = route.query.order_id || ''
  if (!orderId.value) { status.value = 'ERROR'; loading.value = false; return }
  try {
    const { data } = await axios.get(`${getApiBaseUrl()}/payments/cashfree/verify?order_id=${encodeURIComponent(orderId.value)}`)
    status.value = data.data?.status || 'UNKNOWN'
  } catch {
    status.value = 'ERROR'
  } finally {
    loading.value = false
  }
})
</script>
