<template>
  <div class="min-h-screen flex flex-col" style="background:#0f172a; color:#e2e8f0; font-family:system-ui,sans-serif">

    <!-- Header -->
    <header class="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 shrink-0"
      style="background:#111827; border-bottom:1px solid rgba(255,255,255,0.06)">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black text-white shrink-0"
          style="background:linear-gradient(135deg,#2563eb,#1d4ed8); box-shadow:0 4px 16px rgba(37,99,235,0.4)">⚕️</div>
        <div>
          <div class="text-white font-black text-base sm:text-xl leading-none">Patient Queue</div>
          <div class="text-slate-400 text-xs sm:text-sm mt-0.5 truncate max-w-[140px] sm:max-w-none">{{ clinicName || route.params.orgSlug }}</div>
        </div>
      </div>
      <div class="text-right shrink-0">
        <div class="text-white font-mono text-xl sm:text-3xl font-bold tracking-tight">{{ time }}</div>
        <div class="text-slate-400 text-xs sm:text-sm mt-0.5 hidden sm:block">{{ date }}</div>
      </div>
    </header>

    <!-- Now Serving -->
    <div class="px-8 pt-8 pb-4 shrink-0">
      <div v-if="currentToken"
        class="relative overflow-hidden rounded-3xl p-8 text-center"
        style="background:linear-gradient(135deg,#059669,#047857); box-shadow:0 8px 40px rgba(5,150,105,0.4)">
        <div class="absolute inset-0 opacity-10"
          style="background:radial-gradient(circle at 70% 50%, white, transparent)"></div>
        <p class="text-green-200 text-sm font-bold uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-300 animate-pulse inline-block"></span>
          NOW SERVING
        </p>
        <div class="text-[8rem] font-black text-white leading-none tracking-tight">
          {{ String(currentToken.tokenNumber).padStart(2,'0') }}
        </div>
        <p class="text-2xl font-bold text-white mt-3">
          {{ currentToken.patient?.firstName }} {{ currentToken.patient?.lastName }}
        </p>
        <p class="text-green-200 mt-1 text-base">
          Dr. {{ currentToken.doctor?.firstName }} {{ currentToken.doctor?.lastName }}
        </p>
      </div>
      <div v-else class="rounded-3xl p-10 text-center"
        style="background:#1e293b; border:2px dashed rgba(255,255,255,0.08)">
        <div class="text-5xl mb-3">🏥</div>
        <p class="text-slate-400 text-xl font-semibold">No patient currently being served</p>
      </div>
    </div>

    <!-- Waiting Queue Grid -->
    <div class="px-8 pb-8 flex-1">
      <div v-if="waitingQueue.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="(appt, i) in waitingQueue" :key="appt.id"
          class="rounded-2xl p-5 flex items-center gap-4 transition-all"
          :style="i === 0
            ? 'background:linear-gradient(135deg,#1e3a5f,#172554); border:1px solid rgba(59,130,246,0.3)'
            : 'background:#1e293b; border:1px solid rgba(255,255,255,0.06)'">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shrink-0"
            :style="i === 0
              ? 'background:linear-gradient(135deg,#d97706,#b45309); color:white'
              : 'background:rgba(255,255,255,0.07); color:#94a3b8'">
            {{ String(appt.tokenNumber).padStart(2,'0') }}
          </div>
          <div class="min-w-0">
            <p class="font-bold text-sm truncate" :style="{ color: i === 0 ? '#e2e8f0' : '#94a3b8' }">
              {{ appt.patient?.firstName }} {{ appt.patient?.lastName }}
            </p>
            <p class="text-xs mt-0.5 truncate" style="color:#475569">
              Dr. {{ appt.doctor?.firstName }} {{ appt.doctor?.lastName }}
            </p>
            <p class="text-xs font-semibold mt-1"
              :style="{ color: i === 0 ? '#fbbf24' : '#475569' }">
              {{ i === 0 ? '⚡ You\'re next!' : `${i} ahead` }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="!currentToken && !waitingQueue.length"
        class="flex flex-col items-center justify-center py-24">
        <div class="text-6xl mb-4">✅</div>
        <p class="text-slate-400 text-2xl font-semibold">Queue is empty</p>
        <p class="text-slate-600 mt-2">No patients waiting right now</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between text-xs text-slate-600 shrink-0"
      style="border-top:1px solid rgba(255,255,255,0.04)">
      <span>{{ waitingQueue.length }} waiting · {{ currentToken ? '1 in progress' : 'none in progress' }}</span>
      <span class="flex items-center gap-1.5 hidden sm:flex">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
        Auto-refreshes every 30 seconds
      </span>
      <span>Powered by <span class="text-slate-400 font-semibold">Clinova</span></span>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { getApiBaseUrl } from '@/lib/apiBase.js'

const route = useRoute()
const queue = ref([])
const clinicName = ref('')
const time = ref('')
const date = ref('')

const currentToken  = computed(() => queue.value.find(a => a.status === 'IN_PROGRESS'))
const waitingQueue  = computed(() => queue.value.filter(a => ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN'].includes(a.status)))

function updateClock() {
  const now = new Date()
  time.value = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  date.value = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const DEMO_QUEUE = [
  { id: 'dq1', tokenNumber: 4, status: 'IN_PROGRESS', patient: { firstName: 'Meena', lastName: 'Iyer' },   provider: { firstName: 'Arun', lastName: 'Mehta' } },
  { id: 'dq2', tokenNumber: 5, status: 'CHECKED_IN',  patient: { firstName: 'Vikram', lastName: 'Das' },   provider: { firstName: 'Arun', lastName: 'Mehta' } },
  { id: 'dq3', tokenNumber: 6, status: 'SCHEDULED',   patient: { firstName: 'Anita', lastName: 'Roy' },    provider: { firstName: 'Priya', lastName: 'Nair' } },
  { id: 'dq4', tokenNumber: 7, status: 'SCHEDULED',   patient: { firstName: 'Ravi', lastName: 'Shankar' }, provider: { firstName: 'Rajesh', lastName: 'Kumar' } },
  { id: 'dq5', tokenNumber: 8, status: 'SCHEDULED',   patient: { firstName: 'Sunita', lastName: 'Patel' }, provider: { firstName: 'Arun', lastName: 'Mehta' } },
  { id: 'dq6', tokenNumber: 9, status: 'SCHEDULED',   patient: { firstName: 'Deepak', lastName: 'Gupta' }, provider: { firstName: 'Priya', lastName: 'Nair' } },
]

async function loadQueue() {
  if (localStorage.getItem('demo_mode')) {
    queue.value = DEMO_QUEUE
    clinicName.value = 'Clinova Demo Clinic'
    return
  }
  const orgSlug = route.params.orgSlug
  const base = getApiBaseUrl()
  const url = orgSlug ? `${base}/appointments/queue/public?orgSlug=${orgSlug}` : `${base}/appointments/queue/public`
  const { data } = await axios.get(url).catch(() => ({ data: { data: [] } }))
  queue.value = data.data || []
}

let clockTimer, queueTimer
onMounted(() => {
  updateClock()
  loadQueue()
  clockTimer = setInterval(updateClock, 1000)
  queueTimer = setInterval(loadQueue, 30000)
})
onUnmounted(() => { clearInterval(clockTimer); clearInterval(queueTimer) })
</script>
