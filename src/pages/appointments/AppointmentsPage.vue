<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Appointments</h1>
      <RouterLink to="/appointments/new" class="btn-primary">+ New Appointment</RouterLink>
    </div>

    <!-- Filters -->
    <div class="card mb-4 flex flex-wrap gap-3 items-center">
      <input v-model="filters.date" type="date" class="input w-40" @change="load" />
      <select v-model="filters.status" class="input w-40" @change="load">
        <option value="">All Status</option>
        <option value="SCHEDULED">Scheduled</option>
        <option value="WAITING">Waiting</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <button class="btn-secondary btn-sm" @click="resetFilters">Clear</button>
    </div>

    <!-- Live Queue Banner -->
    <div v-if="liveQueue.length" class="rounded-xl p-4 mb-4" style="background:#1e3a5f; border:1px solid rgba(59,130,246,0.25)">
      <p class="text-sm font-semibold mb-2" style="color:#93c5fd">🟢 Live Queue ({{ liveQueue.length }} patients)</p>
      <div class="flex gap-3 overflow-x-auto pb-1">
        <div v-for="a in liveQueue" :key="a.id"
          class="shrink-0 flex flex-col items-center rounded-xl p-3 min-w-[80px]" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08)">
          <span class="text-2xl font-bold" style="color:#60a5fa">{{ a.tokenNumber }}</span>
          <span class="text-xs text-slate-500 mt-1 text-center">{{ a.patient?.firstName }}</span>
          <span :class="statusBadge(a.status)" class="mt-1 text-xs">{{ a.status === 'IN_PROGRESS' ? '🩺' : '⏳' }}</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr><th>Token</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Type</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="loading"><td colspan="7" class="text-center py-10 text-slate-400">Loading…</td></tr>
          <tr v-else-if="!appointments.length"><td colspan="7" class="text-center py-10 text-slate-400">No appointments</td></tr>
          <tr v-for="a in appointments" :key="a.id">
            <td class="font-bold text-blue-700">#{{ a.tokenNumber }}</td>
            <td>
              <RouterLink :to="`/patients/${a.patientId}`" class="font-medium hover:text-blue-600">
                {{ a.patient?.firstName }} {{ a.patient?.lastName }}
              </RouterLink>
            </td>
            <td>{{ a.doctor?.firstName }} {{ a.doctor?.lastName }}</td>
            <td>{{ fmtDate(a.scheduledDate) }} {{ a.scheduledTime }}</td>
            <td><span class="badge-blue">{{ a.type }}</span></td>
            <td><span :class="statusBadge(a.status)">{{ a.status.replace('_', ' ') }}</span></td>
            <td>
              <div class="flex gap-1">
                <button v-if="a.status === 'WAITING'" @click="updateStatus(a.id, 'IN_PROGRESS')" class="btn btn-primary btn-sm">Start</button>
                <button v-if="a.status === 'IN_PROGRESS'" @click="startVisit(a)" class="btn btn-primary btn-sm">EMR</button>
                <button v-if="['WAITING','IN_PROGRESS'].includes(a.status)" @click="updateStatus(a.id, 'COMPLETED')" class="btn btn-secondary btn-sm">Done</button>
                <button v-if="a.status === 'SCHEDULED'" @click="updateStatus(a.id, 'CANCELLED')" class="btn btn-secondary btn-sm text-red-600">Cancel</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :page="page" :pages="pages" :total="total" @change="p => { page = p; load() }" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/api'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()
const appointments = ref([])
const liveQueue = ref([])
const loading = ref(false)
const page = ref(1)
const pages = ref(1)
const total = ref(0)

const filters = ref({ date: new Date().toISOString().split('T')[0], status: '' })

function statusBadge(s) {
  return { SCHEDULED: 'badge-gray', WAITING: 'badge-blue', IN_PROGRESS: 'badge-green', COMPLETED: 'badge-gray', CANCELLED: 'badge-red' }[s] || 'badge-gray'
}

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'
}

async function load() {
  loading.value = true
  const { data } = await api.get('/appointments', { params: { ...filters.value, page: page.value, limit: 20 } })
  appointments.value = data.data.appointments
  pages.value = data.data.pages || 1
  total.value = data.data.total
  loading.value = false
}

async function loadQueue() {
  const { data } = await api.get('/appointments/queue')
  liveQueue.value = data.data
}

async function updateStatus(id, status) {
  await api.patch(`/appointments/${id}/status`, { status })
  load(); loadQueue()
}

async function startVisit(appt) {
  const { data } = await api.post(`/emr/appointments/${appt.id}/visit`)
  router.push(`/visits/${data.data.id}`)
}

function resetFilters() {
  filters.value = { date: '', status: '' }
  load()
}

let pollTimer
onMounted(() => { load(); loadQueue(); pollTimer = setInterval(loadQueue, 30000) })
onUnmounted(() => clearInterval(pollTimer))
</script>
