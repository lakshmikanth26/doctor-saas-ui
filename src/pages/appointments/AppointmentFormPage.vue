<template>
  <div class="max-w-4xl mx-auto">
    <div class="page-header">
      <div>
        <h1 class="page-title">New Appointment</h1>
        <p class="text-slate-500 text-sm mt-0.5">Fill in the details below to book a slot</p>
      </div>
      <RouterLink to="/appointments" class="btn-secondary">← Back</RouterLink>
    </div>

    <form @submit.prevent="submit" class="grid lg:grid-cols-5 gap-6">

      <!-- ── LEFT: Patient + Type + Reason ── -->
      <div class="lg:col-span-2 space-y-5">

        <!-- Patient search -->
        <div class="card">
          <h3 class="font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">1</span>
            Select Patient
          </h3>
          <input v-model="patientSearch" class="input" placeholder="Search by name or MRN…" @input="searchPatients" />

          <!-- Results dropdown -->
          <div v-if="patientResults.length" class="mt-2 rounded-xl overflow-hidden" style="border:1px solid rgba(255,255,255,0.08)">
            <button v-for="p in patientResults" :key="p.id" type="button" @click="selectPatient(p)"
              class="w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
              style="background:#0f172a" onmouseover="this.style.background='rgba(59,130,246,0.08)'" onmouseout="this.style.background='#0f172a'">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style="background:linear-gradient(135deg,#2563eb,#1d4ed8)">
                {{ p.firstName[0] }}{{ p.lastName[0] }}
              </div>
              <div>
                <p class="font-semibold text-slate-200">{{ p.firstName }} {{ p.lastName }}</p>
                <p class="text-xs text-slate-500">{{ p.mrn }} · {{ p.phone }}</p>
              </div>
            </button>
          </div>

          <p v-if="!form.patientId && patientSearch.length >= 2 && !patientResults.length"
            class="mt-2 text-xs text-amber-400 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            No patients found — add the patient first.
          </p>

          <!-- Selected patient chip -->
          <div v-if="selectedPatient" class="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl" style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2)">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style="background:linear-gradient(135deg,#059669,#047857)">
              {{ selectedPatient.firstName[0] }}{{ selectedPatient.lastName[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-green-300">{{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</p>
              <p class="text-xs text-slate-500">{{ selectedPatient.mrn }}</p>
            </div>
            <button type="button" @click="clearPatient" class="text-slate-500 hover:text-white transition-colors text-xs">Change</button>
          </div>
        </div>

        <!-- Doctor -->
        <div class="card">
          <h3 class="font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">2</span>
            Select Doctor
          </h3>
          <div class="space-y-2">
            <button v-for="d in doctors" :key="d.id" type="button" @click="selectDoctor(d)"
              class="w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
              :style="form.doctorId === d.id
                ? 'background:rgba(37,99,235,0.2); border:1px solid rgba(37,99,235,0.4)'
                : 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06)'">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                :style="{ background: doctorColor(d.id) }">
                {{ d.firstName[0] }}{{ d.lastName[0] }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-slate-200">Dr. {{ d.firstName }} {{ d.lastName }}</p>
                <p class="text-xs text-slate-500">{{ d.staffProfile?.specialization || 'General' }}</p>
              </div>
              <div v-if="form.doctorId === d.id" class="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style="background:#2563eb">
                <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
            </button>
            <p v-if="!doctors.length" class="text-slate-500 text-sm text-center py-4">Loading doctors…</p>
          </div>
        </div>

        <!-- Type + Reason -->
        <div class="card space-y-4">
          <h3 class="font-bold text-slate-200 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">4</span>
            Details
          </h3>
          <div>
            <label class="label">Appointment Type</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="t in types" :key="t.value" type="button" @click="form.type = t.value"
                class="px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center"
                :style="form.type === t.value
                  ? `background:${t.color}22; border:1px solid ${t.color}55; color:${t.color}`
                  : 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); color:#94a3b8'">
                {{ t.label }}
              </button>
            </div>
          </div>
          <div>
            <label class="label">Reason / Complaint</label>
            <textarea v-model="form.reason" class="input" rows="2" placeholder="e.g. Fever, checkup, follow-up…" />
          </div>
          <div>
            <label class="label">Notes <span class="text-slate-600 normal-case font-normal">(optional)</span></label>
            <textarea v-model="form.notes" class="input" rows="2" />
          </div>
        </div>
      </div>

      <!-- ── RIGHT: Calendar + Slots ── -->
      <div class="lg:col-span-3 space-y-5">

        <!-- Calendar -->
        <div class="card">
          <h3 class="font-bold text-slate-200 mb-5 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">3</span>
            Pick a Date &amp; Time
          </h3>

          <!-- Month header -->
          <div class="flex items-center justify-between mb-4">
            <button type="button" @click="prevMonth" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <p class="font-bold text-white">{{ monthLabel }}</p>
            <button type="button" @click="nextMonth" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Day labels -->
          <div class="grid grid-cols-7 mb-1">
            <div v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d"
              class="text-center text-xs font-semibold py-1" style="color:#475569">{{ d }}</div>
          </div>

          <!-- Day cells -->
          <div class="grid grid-cols-7 gap-1">
            <div v-for="(cell, i) in calendarCells" :key="i">
              <button v-if="cell" type="button"
                @click="!cell.past && selectDate(cell.iso)"
                class="w-full aspect-square rounded-xl text-sm font-semibold transition-all flex items-center justify-center relative"
                :class="[
                  cell.iso === form.scheduledDate && 'ring-2 ring-blue-500',
                ]"
                :style="cellStyle(cell)"
                :disabled="cell.past">
                {{ cell.day }}
                <span v-if="cell.iso === todayIso && cell.iso !== form.scheduledDate"
                  class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"></span>
              </button>
              <div v-else class="w-full aspect-square"></div>
            </div>
          </div>
        </div>

        <!-- Time slots -->
        <div class="card" v-if="form.scheduledDate">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-slate-200">Available Times</h3>
            <p class="text-xs text-slate-500">{{ selectedDateLabel }}</p>
          </div>

          <div v-if="loadingSlots" class="grid grid-cols-4 gap-2">
            <div v-for="n in 10" :key="n" class="h-14 rounded-xl animate-pulse" style="background:rgba(255,255,255,0.05)"></div>
          </div>

          <div v-else-if="slots.length" class="grid grid-cols-4 gap-2">
            <button v-for="s in slots" :key="s.time" type="button"
              @click="!s.busy && (form.scheduledTime = s.time)"
              class="flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-semibold transition-all relative"
              :style="slotStyle(s)"
              :disabled="s.busy">
              <span class="text-base font-black leading-none mb-1">{{ s.time }}</span>
              <span class="text-[10px] font-medium opacity-70">{{ s.busy ? 'Busy' : '1h slot' }}</span>
              <span v-if="s.busy" class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span v-if="form.scheduledTime === s.time" class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-400"></span>
            </button>
          </div>

          <div v-else class="text-center py-8 text-slate-500 text-sm">
            {{ form.doctorId ? 'No slots available for this date' : 'Select a doctor first to see slots' }}
          </div>

          <!-- Legend -->
          <div class="flex items-center gap-4 mt-4 pt-4 text-xs text-slate-500" style="border-top:1px solid rgba(255,255,255,0.06)">
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background:rgba(37,99,235,0.25)"></span> Available</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background:rgba(37,99,235,0.7)"></span> Selected</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background:rgba(239,68,68,0.15)"></span> Busy</span>
          </div>
        </div>

        <!-- Submit -->
        <div v-if="error" class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400"
          style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2)">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ error }}
        </div>

        <div class="card" style="background:linear-gradient(135deg,#1e3a5f,#172554); border-color:rgba(59,130,246,0.2)">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-bold">Ready to book?</p>
              <p v-if="submitHint" class="text-slate-400 text-sm mt-0.5">{{ submitHint }}</p>
              <p v-else class="text-slate-400 text-sm mt-0.5">
                {{ selectedPatient?.firstName }} · {{ form.scheduledDate }} {{ form.scheduledTime ? '@ ' + form.scheduledTime : '' }}
              </p>
            </div>
            <button type="submit" class="btn-primary px-6 py-3 font-bold" :disabled="loading || !canSubmit">
              {{ loading ? 'Booking…' : 'Book Appointment' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'

const route  = useRoute()
const router = useRouter()

const todayIso  = new Date().toISOString().split('T')[0]
const today     = todayIso

// ── form state ──
const form = ref({
  patientId: '', scheduledDate: today, scheduledTime: '',
  doctorId: '', type: 'SCHEDULED', reason: '', notes: ''
})
const patientSearch  = ref('')
const patientResults = ref([])
const selectedPatient = ref(null)
const doctors   = ref([])
const slots     = ref([])
const loadingSlots = ref(false)
const loading   = ref(false)
const error     = ref('')
let   debounce

// ── calendar state ──
const calYear  = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth()) // 0-indexed

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const monthLabel  = computed(() => `${MONTH_NAMES[calMonth.value]} ${calYear.value}`)

const calendarCells = computed(() => {
  const first = new Date(calYear.value, calMonth.value, 1).getDay()
  const days  = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  const cells = Array(first).fill(null)
  for (let d = 1; d <= days; d++) {
    const iso  = `${calYear.value}-${String(calMonth.value + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    cells.push({ day: d, iso, past: iso < todayIso })
  }
  return cells
})

function cellStyle(cell) {
  if (cell.iso === form.value.scheduledDate)
    return 'background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white; box-shadow:0 4px 16px rgba(37,99,235,0.4)'
  if (cell.past)
    return 'color:#1e293b; cursor:not-allowed'
  if (cell.iso === todayIso)
    return 'background:rgba(59,130,246,0.15); color:#60a5fa'
  return 'background:rgba(255,255,255,0.03); color:#cbd5e1; hover:background:rgba(255,255,255,0.08)'
}

function prevMonth() {
  if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- }
  else calMonth.value--
}
function nextMonth() {
  if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ }
  else calMonth.value++
}

function selectDate(iso) {
  form.value.scheduledDate = iso
  form.value.scheduledTime = ''
  loadSlots()
}

const selectedDateLabel = computed(() => {
  if (!form.value.scheduledDate) return ''
  const d = new Date(form.value.scheduledDate + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
})

// ── time slots ──
function generateDefaultSlots() {
  const times = []
  for (let h = 9; h <= 18; h++) {
    times.push(`${String(h).padStart(2,'0')}:00`)
  }
  return times.map(t => ({ time: t, busy: false }))
}

async function loadSlots() {
  if (!form.value.scheduledDate) return
  loadingSlots.value = true
  slots.value = []
  try {
    const { data } = await api.get('/appointments/slots', {
      params: { date: form.value.scheduledDate, doctorId: form.value.doctorId || undefined }
    })
    slots.value = data.data || generateDefaultSlots()
  } catch {
    slots.value = generateDefaultSlots()
  } finally {
    loadingSlots.value = false
  }
}

function slotStyle(s) {
  if (form.value.scheduledTime === s.time)
    return 'background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white; border:1px solid rgba(37,99,235,0.6); box-shadow:0 4px 16px rgba(37,99,235,0.3)'
  if (s.busy)
    return 'background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15); color:#f87171; cursor:not-allowed; opacity:0.7'
  return 'background:rgba(37,99,235,0.1); border:1px solid rgba(37,99,235,0.2); color:#93c5fd'
}

// ── doctor colors ──
const COLORS = ['linear-gradient(135deg,#2563eb,#1d4ed8)','linear-gradient(135deg,#059669,#047857)','linear-gradient(135deg,#7c3aed,#6d28d9)','linear-gradient(135deg,#dc2626,#b91c1c)','linear-gradient(135deg,#d97706,#b45309)']
function doctorColor(id) { return COLORS[(id?.charCodeAt(0) || 0) % COLORS.length] }

function selectDoctor(d) {
  form.value.doctorId = d.id
  form.value.scheduledTime = ''
  if (form.value.scheduledDate) loadSlots()
}

// ── appointment types ──
const types = [
  { value: 'SCHEDULED',  label: 'Scheduled',  color: '#60a5fa' },
  { value: 'WALK_IN',    label: 'Walk-in',    color: '#34d399' },
  { value: 'FOLLOW_UP',  label: 'Follow-up',  color: '#a78bfa' },
  { value: 'EMERGENCY',  label: 'Emergency',  color: '#f87171' },
]

// ── patient search ──
async function searchPatients() {
  clearTimeout(debounce)
  if (patientSearch.value.length < 2) { patientResults.value = []; return }
  if (selectedPatient.value && patientSearch.value !== `${selectedPatient.value.firstName} ${selectedPatient.value.lastName}`) clearPatient()
  debounce = setTimeout(async () => {
    try {
      const { data } = await api.get('/patients', { params: { search: patientSearch.value, limit: 5 } })
      patientResults.value = data.data.patients || []
    } catch { patientResults.value = [] }
  }, 300)
}

function selectPatient(p) {
  form.value.patientId = p.id
  selectedPatient.value = p
  patientSearch.value = `${p.firstName} ${p.lastName}`
  patientResults.value = []
}

function clearPatient() {
  form.value.patientId = ''
  selectedPatient.value = null
  patientSearch.value = ''
}

// ── computed state ──
const canSubmit = computed(() => {
  if (!form.value.patientId || !form.value.doctorId || !form.value.scheduledDate) return false
  if (slots.value.length && !form.value.scheduledTime) return false
  return true
})

const submitHint = computed(() => {
  if (!form.value.patientId) return 'Select a patient to continue'
  if (!form.value.doctorId)  return 'Choose a doctor to continue'
  if (slots.value.length && !form.value.scheduledTime) return 'Pick a time slot to continue'
  return ''
})

// ── mount ──
onMounted(async () => {
  try {
    const { data } = await api.get('/staff', { params: { limit: 100 } })
    doctors.value = data.data.staff || []
  } catch { doctors.value = [] }

  loadSlots()

  const patientId = route.query.patientId
  if (!patientId) return
  form.value.patientId = String(patientId)
  try {
    const { data } = await api.get(`/patients/${patientId}`)
    selectedPatient.value = data.data
    patientSearch.value = `${data.data.firstName} ${data.data.lastName}`
  } catch { form.value.patientId = '' }
})

async function submit() {
  loading.value = true; error.value = ''
  try {
    await api.post('/appointments', form.value)
    router.push('/appointments')
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to book appointment'
  } finally { loading.value = false }
}
</script>
