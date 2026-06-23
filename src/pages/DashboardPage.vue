<template>
  <div class="space-y-6">

    <!-- ── WELCOME BANNER ── -->
    <div class="relative overflow-hidden rounded-2xl p-6 text-white"
      style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%)">
      <div class="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10 -translate-y-16 translate-x-16"
        style="background: radial-gradient(circle, #3b82f6, transparent)"></div>
      <div class="flex items-start justify-between relative">
        <div>
          <p class="text-slate-400 text-sm font-medium mb-1">{{ today }}</p>
          <h1 class="text-2xl font-black text-white">Good {{ greeting }}, Dr. {{ auth.user?.firstName }} 👋</h1>
          <p class="text-slate-400 text-sm mt-1">{{ auth.org?.name }} &nbsp;·&nbsp; Here's what's happening today</p>
        </div>
        <RouterLink to="/appointments/new"
          class="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30">
          + New Appointment
        </RouterLink>
      </div>
    </div>

    <!-- ── STAT CARDS ── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in statCards" :key="s.label"
        class="relative overflow-hidden rounded-2xl p-5 border border-white/5"
        :style="{ background: s.bg }">
        <component :is="s.icon" class="absolute right-3 top-3 w-7 h-7 opacity-20" :style="{ color: s.color }" />
        <p class="text-xs font-semibold uppercase tracking-wider mb-2" :style="{ color: s.color }">{{ s.label }}</p>
        <p class="text-3xl font-black text-white mb-1">{{ s.value }}</p>
        <p v-if="s.trend" class="text-xs font-medium flex items-center gap-1" :style="{ color: s.color }">
          <span>{{ s.trendUp ? '↑' : '↓' }}</span> {{ s.trend }}
        </p>
      </div>
    </div>

    <!-- ── CURRENTLY SERVING + QUEUE ── -->
    <div class="grid lg:grid-cols-3 gap-6">

      <!-- NOW SERVING hero -->
      <div class="lg:col-span-1">
        <div v-if="currentlyServing"
          class="relative overflow-hidden rounded-2xl p-6 text-white h-full flex flex-col"
          style="background: linear-gradient(135deg, #059669, #065f46)">
          <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20"
            style="background: radial-gradient(circle, #34d399, transparent)"></div>
          <div class="flex items-center gap-2 mb-4">
            <span class="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
            <span class="text-green-200 text-xs font-bold uppercase tracking-widest">Now Serving</span>
          </div>
          <div class="text-8xl font-black text-white leading-none mb-3">
            {{ String(currentlyServing.tokenNumber).padStart(2, '0') }}
          </div>
          <p class="text-xl font-bold text-white">
            {{ currentlyServing.patient?.firstName }} {{ currentlyServing.patient?.lastName }}
          </p>
          <p class="text-green-200 text-sm mt-1">
            Dr. {{ currentlyServing.doctor?.firstName }} {{ currentlyServing.doctor?.lastName }}
          </p>
          <p class="text-green-300 text-xs mt-1">{{ currentlyServing.scheduledTime }}</p>
          <div class="mt-auto pt-4 border-t border-green-600/50">
            <p class="text-green-200 text-xs">{{ waitingQueue.length }} patient{{ waitingQueue.length !== 1 ? 's' : '' }} waiting</p>
          </div>
        </div>
        <div v-else class="rounded-2xl p-6 flex flex-col items-center justify-center h-full min-h-48 text-center" style="border:2px dashed rgba(255,255,255,0.08)">
          <component :is="BuildingOffice2Icon" class="w-10 h-10 mb-3 text-slate-700" />
          <p class="font-semibold text-slate-500">Queue is empty</p>
          <p class="text-sm text-slate-600 mt-1">No patient in consultation</p>
        </div>
      </div>

      <!-- Waiting queue list -->
      <div class="lg:col-span-2 rounded-2xl overflow-hidden"
        style="background: #0f172a; border: 1px solid rgba(255,255,255,0.06)">
        <div class="flex items-center justify-between px-5 py-4 border-b" style="border-color: rgba(255,255,255,0.06)">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <h2 class="text-white font-bold text-sm uppercase tracking-wider">Live Queue Today</h2>
          </div>
          <RouterLink to="/appointments" class="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors">
            View all →
          </RouterLink>
        </div>

        <div v-if="queue.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-600">
          <component :is="ClipboardDocumentListIcon" class="w-8 h-8 mb-2 text-slate-700" />
          <p class="text-sm">No patients in queue</p>
        </div>

        <div v-else class="divide-y" style="divide-color: rgba(255,255,255,0.04)">
          <div v-for="(appt, i) in queue.slice(0, 7)" :key="appt.id"
            class="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
            <!-- Token -->
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
              :style="tokenStyle(appt.status, i)">
              {{ String(appt.tokenNumber).padStart(2, '0') }}
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-semibold truncate">
                {{ appt.patient?.firstName }} {{ appt.patient?.lastName }}
              </p>
              <p class="text-slate-500 text-xs truncate">
                Dr. {{ appt.doctor?.firstName }} {{ appt.doctor?.lastName }}
                <span v-if="appt.scheduledTime"> · {{ appt.scheduledTime }}</span>
              </p>
            </div>
            <!-- Status -->
            <div class="shrink-0 flex items-center gap-2">
              <span v-if="appt.status === 'IN_PROGRESS'" class="flex items-center gap-1 text-xs font-bold text-green-400">
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> In Progress
              </span>
              <span v-else-if="appt.status === 'WAITING' && i === 1" class="text-xs font-bold text-yellow-400">⚡ Next</span>
              <span v-else-if="appt.status === 'WAITING'" class="text-xs text-slate-500">{{ i }} ahead</span>
              <span v-else-if="appt.status === 'COMPLETED'" class="text-xs text-slate-600">Done</span>
              <!-- Quick action -->
              <button v-if="appt.status === 'WAITING'"
                @click="markInProgress(appt)"
                class="ml-1 text-xs font-semibold text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/60 px-2 py-0.5 rounded-lg transition-all">
                Call
              </button>
              <button v-if="appt.status === 'IN_PROGRESS'"
                @click="markCompleted(appt)"
                class="ml-1 text-xs font-semibold text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400/60 px-2 py-0.5 rounded-lg transition-all">
                Done ✓
              </button>
            </div>
          </div>
        </div>

        <div class="px-5 py-3 border-t flex items-center justify-between" style="border-color: rgba(255,255,255,0.06)">
          <RouterLink :to="`/queue/${auth.org?.slug}`" target="_blank"
            class="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <component :is="TvIcon" class="w-3.5 h-3.5" /> Open TV Queue Display →
          </RouterLink>
          <span class="text-slate-600 text-xs">Auto-refreshes every 30s</span>
        </div>
      </div>
    </div>

    <!-- ── BOTTOM ROW: Recent Patients + Quick Actions ── -->
    <div class="grid lg:grid-cols-3 gap-6">

      <!-- Recent Patients -->
      <div class="lg:col-span-2 rounded-2xl overflow-hidden"
        style="background:#1e293b; border:1px solid rgba(255,255,255,0.06)">
        <div class="flex items-center justify-between px-5 py-4"
          style="border-bottom:1px solid rgba(255,255,255,0.06)">
          <h2 class="font-bold text-slate-200 text-sm uppercase tracking-wider">Recent Patients</h2>
          <RouterLink to="/patients" class="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors">View all →</RouterLink>
        </div>
        <div v-if="recentPatients.length === 0" class="flex flex-col items-center py-10 text-slate-500 text-sm">
          <component :is="UserIcon" class="w-8 h-8 mb-2 text-slate-600" />No patients yet
        </div>
        <div v-else>
          <RouterLink v-for="p in recentPatients" :key="p.id" :to="`/patients/${p.id}`"
            class="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group"
            style="border-bottom:1px solid rgba(255,255,255,0.04)">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              :style="{ background: avatarGradient(p.firstName) }">
              {{ p.firstName[0] }}{{ p.lastName[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-slate-200 group-hover:text-blue-400 transition-colors">
                {{ p.firstName }} {{ p.lastName }}
              </p>
              <p class="text-xs text-slate-500">{{ p.mrn }} · {{ p.phone || 'No phone' }}</p>
            </div>
            <span v-if="p.lastVisit" class="text-xs text-slate-500">{{ formatDate(p.lastVisit) }}</span>
            <span class="text-slate-600 group-hover:text-blue-400 transition-colors text-sm">→</span>
          </RouterLink>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="rounded-2xl overflow-hidden"
        style="background:#1e293b; border:1px solid rgba(255,255,255,0.06)">
        <div class="px-5 py-4" style="border-bottom:1px solid rgba(255,255,255,0.06)">
          <h2 class="font-bold text-slate-200 text-sm uppercase tracking-wider">Quick Actions</h2>
        </div>
        <div class="p-4 space-y-1">
          <RouterLink v-for="action in quickActions" :key="action.label" :to="action.to"
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              style="background:rgba(255,255,255,0.07)">
              <component :is="action.icon" class="w-5 h-5 text-slate-300" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{{ action.label }}</p>
              <p class="text-xs text-slate-500">{{ action.sub }}</p>
            </div>
            <span class="text-slate-600 group-hover:text-blue-400 transition-colors">→</span>
          </RouterLink>
        </div>
        <!-- Patient Portal shortcut -->
        <div class="mx-4 mb-4 rounded-xl overflow-hidden"
          style="background:linear-gradient(135deg,#1e3a5f,#172554); border:1px solid rgba(59,130,246,0.2)">
          <RouterLink v-if="auth.org?.slug" :to="`/portal/${auth.org.slug}`" target="_blank" class="flex items-center gap-3 p-4 group">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              style="background:rgba(59,130,246,0.15)">
              <LinkIcon class="w-5 h-5 text-blue-400" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Patient Portal</p>
              <p class="text-xs text-slate-400">Booking + live queue for patients</p>
            </div>
            <span class="text-slate-500 group-hover:text-blue-300 transition-colors">↗</span>
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/api'
import {
  CalendarDaysIcon, ClockIcon, CurrencyDollarIcon, UsersIcon,
  UserPlusIcon, BeakerIcon, DocumentPlusIcon, ArchiveBoxIcon,
  LinkIcon, UserIcon, BuildingOffice2Icon, ClipboardDocumentListIcon, TvIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const stats = ref({})
const queue = ref([])
const recentPatients = ref([])

const now = new Date()
const today = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
const hour = now.getHours()
const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

const currentlyServing = computed(() => queue.value.find(a => a.status === 'IN_PROGRESS'))
const waitingQueue = computed(() => queue.value.filter(a => a.status === 'WAITING'))

const statCards = computed(() => [
  {
    label: "Today's Appointments", icon: CalendarDaysIcon,
    value: stats.value.todayAppointments ?? queue.value.length,
    trend: 'vs yesterday', trendUp: true,
    bg: 'linear-gradient(135deg, #1e3a5f, #172554)',
    color: '#60a5fa',
  },
  {
    label: 'In Queue Now', icon: ClockIcon,
    value: waitingQueue.value.length,
    trend: currentlyServing.value ? '1 in progress' : 'none in progress', trendUp: false,
    bg: 'linear-gradient(135deg, #3b1f6e, #2e1065)',
    color: '#a78bfa',
  },
  {
    label: "Today's Revenue", icon: CurrencyDollarIcon,
    value: stats.value.todayRevenue ? `₹${Number(stats.value.todayRevenue).toLocaleString('en-IN')}` : '₹0',
    trend: '+12% this week', trendUp: true,
    bg: 'linear-gradient(135deg, #064e3b, #022c22)',
    color: '#34d399',
  },
  {
    label: 'Total Patients', icon: UsersIcon,
    value: stats.value.totalPatients ?? '—',
    trend: 'registered', trendUp: true,
    bg: 'linear-gradient(135deg, #7c2d12, #431407)',
    color: '#fb923c',
  },
])

const quickActions = [
  { label: 'Add Patient', sub: 'Register new patient', icon: UserPlusIcon, to: '/patients/new' },
  { label: 'New Prescription', sub: 'Write & print Rx', icon: BeakerIcon, to: '/prescriptions' },
  { label: 'Create Invoice', sub: 'Bill a patient', icon: DocumentPlusIcon, to: '/billing/new' },
  { label: 'Check Inventory', sub: 'Low stock alerts', icon: ArchiveBoxIcon, to: '/inventory' },
]

function tokenStyle(status, index) {
  if (status === 'IN_PROGRESS') return { background: 'linear-gradient(135deg, #059669, #047857)', color: 'white' }
  if (index === 1 && status === 'WAITING') return { background: 'linear-gradient(135deg, #d97706, #b45309)', color: 'white' }
  return { background: '#1e293b', color: '#94a3b8' }
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#2563eb,#1d4ed8)',
  'linear-gradient(135deg,#059669,#047857)',
  'linear-gradient(135deg,#7c3aed,#6d28d9)',
  'linear-gradient(135deg,#dc2626,#b91c1c)',
  'linear-gradient(135deg,#d97706,#b45309)',
]
function avatarGradient(name) {
  return AVATAR_GRADIENTS[(name?.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length]
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

async function markInProgress(appt) {
  await api.patch(`/appointments/${appt.id}/status`, { status: 'IN_PROGRESS' }).catch(() => {})
  await loadQueue()
}
async function markCompleted(appt) {
  await api.patch(`/appointments/${appt.id}/status`, { status: 'COMPLETED' }).catch(() => {})
  await loadQueue()
}

async function loadQueue() {
  const res = await api.get('/appointments/queue').catch(() => null)
  if (res) queue.value = res.data.data || []
}

let refreshTimer
onMounted(async () => {
  const [billRes, queueRes, patRes] = await Promise.allSettled([
    api.get('/billing/stats'),
    api.get('/appointments/queue'),
    api.get('/patients?limit=8'),
  ])
  if (billRes.status === 'fulfilled') stats.value = billRes.value.data.data
  if (queueRes.status === 'fulfilled') queue.value = queueRes.value.data.data || []
  if (patRes.status === 'fulfilled') recentPatients.value = patRes.value.data.data?.patients || []
  refreshTimer = setInterval(loadQueue, 30000)
})
onUnmounted(() => clearInterval(refreshTimer))
</script>
