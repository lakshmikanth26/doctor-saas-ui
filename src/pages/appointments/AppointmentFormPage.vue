<template>
  <div class="max-w-5xl mx-auto">
    <div class="page-header">
      <div>
        <h1 class="page-title">New Appointment</h1>
        <p class="text-slate-500 text-sm mt-0.5">Fill in the details to book a slot</p>
      </div>
      <RouterLink to="/appointments" class="btn-secondary">← Back</RouterLink>
    </div>

    <form @submit.prevent="submit" class="space-y-5">

      <!-- Row 1: Patient + Details (wider) | Doctor (narrower) -->
      <div class="grid lg:grid-cols-5 gap-5">

        <!-- Left: Patient details + Type + Reason -->
        <div class="lg:col-span-3 card space-y-4">
          <h3 class="font-bold text-slate-200 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">1</span>
            Patient Details
          </h3>

          <!-- Search -->
          <div class="relative">
            <label class="label">Search by name, phone or MRN</label>
            <input v-model="patientSearch" class="input" placeholder="Start typing…" @input="searchPatients" @blur="hideResults" />
            <div v-if="patientResults.length" class="absolute z-20 left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl" style="background:#1e293b; border:1px solid rgba(255,255,255,0.1)">
              <button v-for="p in patientResults" :key="p.id" type="button" @mousedown.prevent="selectPatient(p)"
                class="w-full text-left px-4 py-3 text-sm flex items-center gap-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style="background:linear-gradient(135deg,#2563eb,#1d4ed8)">
                  {{ p.firstName[0] }}{{ p.lastName[0] }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-200">{{ p.firstName }} {{ p.lastName }}</p>
                  <p class="text-xs text-slate-500">{{ p.mrn }} · {{ p.phone }}</p>
                </div>
                <span class="text-xs text-blue-400 font-semibold shrink-0">Autofill →</span>
              </button>
            </div>
          </div>

          <!-- Always-visible fields — autofilled on patient select, editable for new patients -->
          <div class="space-y-3">
            <!-- Existing patient badge -->
            <div v-if="selectedPatient" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2)">
              <svg class="w-3.5 h-3.5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span class="text-green-300 font-semibold">Existing patient found</span>
              <span class="text-slate-500 ml-auto">{{ selectedPatient.mrn }}</span>
              <button type="button" @click="clearPatient" class="text-slate-500 hover:text-white transition-colors ml-2">✕ Clear</button>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="label">First Name *</label>
                <input v-model="newPatient.firstName" class="input" placeholder="First name" :readonly="!!selectedPatient" :style="selectedPatient ? 'opacity:0.7' : ''" />
              </div>
              <div>
                <label class="label">Last Name *</label>
                <input v-model="newPatient.lastName" class="input" placeholder="Last name" :readonly="!!selectedPatient" :style="selectedPatient ? 'opacity:0.7' : ''" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="label">Phone *</label>
                <input v-model="newPatient.phone" class="input" placeholder="10-digit number" maxlength="10" :readonly="!!selectedPatient" :style="selectedPatient ? 'opacity:0.7' : ''" />
              </div>
              <div>
                <label class="label">Email <span class="text-slate-600 normal-case font-normal">(optional)</span></label>
                <input v-model="newPatient.email" type="email" class="input" placeholder="patient@email.com" :readonly="!!selectedPatient" :style="selectedPatient ? 'opacity:0.7' : ''" />
              </div>
            </div>
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.05)" class="pt-3 space-y-3">
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
              <textarea v-model="form.reason" class="input" rows="2" placeholder="e.g. Fever, check-up, follow-up…" />
            </div>
            <div>
              <label class="label">Notes <span class="text-slate-600 normal-case font-normal">(optional)</span></label>
              <textarea v-model="form.notes" class="input" rows="2" />
            </div>
          </div>
        </div>

        <!-- Right: Doctor + Calendar -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Doctor selection -->
          <div class="card">
            <h3 class="font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">2</span>
              Select Doctor
            </h3>
            <div class="space-y-2">
              <button v-for="d in doctors" :key="d.id" type="button" @click="selectDoctor(d)"
                class="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                :style="form.doctorId === d.id
                  ? 'background:rgba(37,99,235,0.2); border:1px solid rgba(37,99,235,0.4)'
                  : 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06)'">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
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

          <!-- Calendar -->
          <div class="card">
            <h3 class="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">3</span>
              Pick a Date
            </h3>
            <div class="flex items-center justify-between mb-3">
              <button type="button" @click="prevMonth" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <p class="font-bold text-white text-sm">{{ monthLabel }}</p>
              <button type="button" @click="nextMonth" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="grid grid-cols-7 mb-1">
              <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d"
                class="text-center text-xs font-semibold py-1" style="color:#475569">{{ d }}</div>
            </div>
            <div class="grid grid-cols-7 gap-1">
              <div v-for="(cell, i) in calendarCells" :key="i">
                <button v-if="cell" type="button"
                  @click="!cell.past && selectDate(cell.iso)"
                  class="w-full aspect-square rounded-lg text-xs font-semibold transition-all flex items-center justify-center relative"
                  :style="cellStyle(cell)" :disabled="cell.past">
                  {{ cell.day }}
                  <span v-if="cell.iso === todayIso && cell.iso !== form.scheduledDate"
                    class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"></span>
                </button>
                <div v-else class="w-full aspect-square"></div>
              </div>
            </div>
            <p v-if="form.scheduledDate" class="text-center text-xs text-slate-400 mt-3">{{ selectedDateLabel }}</p>
          </div>
        </div>
      </div>

      <!-- Row 2: Time slots — full width -->
      <div class="card" v-if="form.scheduledDate">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-slate-200 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">4</span>
            Pick a Time
          </h3>
          <p class="text-xs text-slate-500">{{ selectedDateLabel }} · 1-hour slots</p>
        </div>

        <div v-if="loadingSlots" class="grid grid-cols-5 sm:grid-cols-10 gap-2">
          <div v-for="n in 10" :key="n" class="h-14 rounded-xl animate-pulse" style="background:rgba(255,255,255,0.05)"></div>
        </div>

        <div v-else-if="!displaySlots.length" class="text-center py-8 text-sm text-slate-500">
          No open slots left for this date. Pick another date or try again tomorrow.
        </div>

        <div v-else class="grid grid-cols-5 sm:grid-cols-10 gap-2">
          <button v-for="s in displaySlots" :key="s.time" type="button"
            @click="!s.busy && (form.scheduledTime = s.time)"
            class="flex flex-col items-center justify-center py-3 px-1 rounded-xl text-xs font-semibold transition-all relative"
            :style="slotStyle(s)" :disabled="s.busy">
            <span class="text-sm font-black leading-none mb-1">{{ s.time }}</span>
            <span class="text-[10px] opacity-70">{{ s.busy ? 'Busy' : 'Open' }}</span>
            <span v-if="s.busy" class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
          </button>
        </div>

        <div class="flex items-center gap-4 mt-4 pt-4 text-xs text-slate-500" style="border-top:1px solid rgba(255,255,255,0.06)">
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background:rgba(37,99,235,0.25)"></span> Available</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background:rgba(37,99,235,0.7)"></span> Selected</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded" style="background:rgba(239,68,68,0.15)"></span> Busy</span>
        </div>
      </div>

      <!-- Payment -->
      <div class="card space-y-4">
        <h3 class="font-bold text-slate-200 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs flex items-center justify-center font-black">5</span>
          Payment
        </h3>

        <!-- Mode toggle -->
        <div class="grid grid-cols-2 gap-3">
          <button type="button" @click="payment.mode = 'AT_CLINIC'"
            class="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl transition-all"
            :style="payment.mode === 'AT_CLINIC'
              ? 'background:rgba(16,185,129,0.15); border:1.5px solid rgba(16,185,129,0.5)'
              : 'background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.07)'">
            <span class="text-2xl">🏥</span>
            <div class="text-center">
              <p class="font-bold text-sm" :style="payment.mode === 'AT_CLINIC' ? 'color:#34d399' : 'color:#94a3b8'">Pay at Clinic</p>
              <p class="text-xs mt-0.5" :style="payment.mode === 'AT_CLINIC' ? 'color:#6ee7b7' : 'color:#475569'">Cash / card on arrival</p>
            </div>
            <div v-if="payment.mode === 'AT_CLINIC'" class="w-5 h-5 rounded-full flex items-center justify-center" style="background:#059669">
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
          </button>

          <button type="button" @click="payment.mode = 'PAY_NOW'"
            class="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl transition-all"
            :style="payment.mode === 'PAY_NOW'
              ? 'background:rgba(37,99,235,0.15); border:1.5px solid rgba(37,99,235,0.5)'
              : 'background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.07)'">
            <span class="text-2xl">💳</span>
            <div class="text-center">
              <p class="font-bold text-sm" :style="payment.mode === 'PAY_NOW' ? 'color:#60a5fa' : 'color:#94a3b8'">Pay Now</p>
              <p class="text-xs mt-0.5" :style="payment.mode === 'PAY_NOW' ? 'color:#93c5fd' : 'color:#475569'">Card / UPI / Net Banking</p>
            </div>
            <div v-if="payment.mode === 'PAY_NOW'" class="w-5 h-5 rounded-full flex items-center justify-center" style="background:#2563eb">
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
          </button>
        </div>

        <!-- Pay Now: fee selector + Cashfree badge -->
        <div v-if="payment.mode === 'PAY_NOW'" class="space-y-3">
          <div>
            <label class="label">Select Fees</label>
            <div v-if="activeFees.length" class="space-y-2">
              <label v-for="fee in activeFees" :key="fee.id"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                :style="payment.selectedFees.includes(fee.id)
                  ? 'background:rgba(37,99,235,0.12); border:1px solid rgba(37,99,235,0.35)'
                  : 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07)'">
                <input type="checkbox" :value="fee.id" v-model="payment.selectedFees" class="accent-blue-500 w-4 h-4 shrink-0" />
                <span class="flex-1 text-sm text-slate-200">{{ fee.name }}</span>
                <span class="text-sm font-bold text-white shrink-0">₹{{ Number(fee.fee).toLocaleString('en-IN') }}</span>
              </label>
            </div>
            <p v-else class="text-xs text-slate-500 py-2">No fees configured. Add them in <RouterLink to="/settings" class="text-blue-400 underline">Settings → Fee Management</RouterLink>.</p>
          </div>

          <div v-if="payment.selectedFees.length" class="flex items-center justify-between px-3 py-2 rounded-xl" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08)">
            <span class="text-xs text-slate-400">Total</span>
            <span class="text-sm font-black text-white">₹{{ totalFeeAmount.toLocaleString('en-IN') }}</span>
          </div>

          <div class="flex items-center gap-3 px-4 py-3 rounded-xl" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07)">
            <svg class="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            <p class="text-xs text-slate-400">Secure checkout via <span class="text-white font-semibold">Cashfree</span> — supports Card, UPI, Net Banking &amp; Wallets</p>
          </div>
        </div>

        <!-- Pay at clinic note -->
        <div v-if="payment.mode === 'AT_CLINIC'"
          class="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
          style="background:rgba(16,185,129,0.07); border:1px solid rgba(16,185,129,0.15)">
          <svg class="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-green-300">You can pay by cash or card when you arrive at the clinic. Please arrive 10 minutes before your appointment.</p>
        </div>
      </div>

      <!-- Submit bar -->
      <div v-if="error" class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400"
        style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2)">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ error }}
      </div>

      <div class="card flex items-center justify-between" style="background:linear-gradient(135deg,#1e3a5f,#172554); border-color:rgba(59,130,246,0.2)">
        <div>
          <p class="text-white font-bold">Ready to book?</p>
          <p class="text-slate-400 text-sm mt-0.5">{{ submitHint || (patientLabel + ' · ' + form.scheduledDate + (form.scheduledTime ? ' @ ' + form.scheduledTime : '') + (payment.mode === 'PAY_NOW' && totalFeeAmount > 0 ? ' · ₹' + totalFeeAmount.toLocaleString('en-IN') : ' · Pay at clinic')) }}</p>
        </div>
        <button type="submit" class="btn-primary px-6 py-3 font-bold" :disabled="loading || !canSubmit">
          {{ loading ? 'Booking…' : payment.mode === 'PAY_NOW' ? 'Book & Pay →' : 'Book Appointment' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'
import { launchCashfreeCheckout } from '@/composables/useCashfree'
import { localTodayIso, normalizeSlots, generateDefaultSlots, isPastSlot } from '@/lib/slots'

const route  = useRoute()
const router = useRouter()

const todayIso = localTodayIso()

const form = ref({
  patientId: '', scheduledDate: todayIso, scheduledTime: '',
  doctorId: '', type: 'IN_PERSON', reason: '', notes: '',
  patientPhone: '', patientEmail: '',
})

const payment = ref({
  mode: 'AT_CLINIC',
  selectedFees: [],   // array of ServiceType IDs
})
const allFees   = ref([])
const activeFees = computed(() => allFees.value.filter(f => f.isActive))
const totalFeeAmount = computed(() =>
  payment.value.selectedFees.reduce((sum, id) => {
    const f = allFees.value.find(f => f.id === id)
    return sum + (f ? Number(f.fee) : 0)
  }, 0)
)
const newPatient     = ref({ firstName: '', lastName: '', phone: '', email: '' })
const patientSearch  = ref('')
const patientResults = ref([])
const selectedPatient = ref(null)
const doctors         = ref([])
const branchId        = ref('')
const slots           = ref([])
const loadingSlots    = ref(false)
const loading         = ref(false)
const error           = ref('')
let   debounce

// ── Calendar ──
const calYear  = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth())
const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December']
const monthLabel = computed(() => `${MONTHS[calMonth.value]} ${calYear.value}`)

const calendarCells = computed(() => {
  const first = new Date(calYear.value, calMonth.value, 1).getDay()
  const days  = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  const cells = Array(first).fill(null)
  for (let d = 1; d <= days; d++) {
    const iso = `${calYear.value}-${String(calMonth.value + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    cells.push({ day: d, iso, past: iso < todayIso })
  }
  return cells
})

function cellStyle(cell) {
  if (cell.iso === form.value.scheduledDate) return 'background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white; box-shadow:0 4px 16px rgba(37,99,235,0.4)'
  if (cell.past) return 'color:#1e293b; cursor:not-allowed'
  if (cell.iso === todayIso) return 'background:rgba(59,130,246,0.15); color:#60a5fa'
  return 'background:rgba(255,255,255,0.03); color:#cbd5e1'
}

function prevMonth() { if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- } else calMonth.value-- }
function nextMonth() { if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ } else calMonth.value++ }

function selectDate(iso) {
  form.value.scheduledDate = iso
  form.value.scheduledTime = ''
  loadSlots()
}

const selectedDateLabel = computed(() => {
  if (!form.value.scheduledDate) return ''
  return new Date(form.value.scheduledDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
})

// ── Slots ──
async function loadSlots() {
  if (!form.value.scheduledDate) return
  loadingSlots.value = true; slots.value = []
  try {
    const { data } = await api.get('/appointments/slots', {
      params: { date: form.value.scheduledDate, doctorId: form.value.doctorId || undefined }
    })
    slots.value = normalizeSlots(data.data, form.value.scheduledDate)
    if (!slots.value.length) slots.value = generateDefaultSlots(form.value.scheduledDate)
  } catch {
    slots.value = generateDefaultSlots(form.value.scheduledDate)
  } finally {
    if (form.value.scheduledTime && isPastSlot(form.value.scheduledTime, form.value.scheduledDate)) {
      form.value.scheduledTime = ''
    }
    loadingSlots.value = false
  }
}

const displaySlots = computed(() => {
  if (!form.value.scheduledDate) return []
  if (slots.value.length) return slots.value
  return generateDefaultSlots(form.value.scheduledDate)
})

function slotStyle(s) {
  if (form.value.scheduledTime === s.time) return 'background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white; border:1px solid rgba(37,99,235,0.6); box-shadow:0 4px 16px rgba(37,99,235,0.3)'
  if (s.busy) return 'background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15); color:#f87171; cursor:not-allowed; opacity:0.6'
  return 'background:rgba(37,99,235,0.1); border:1px solid rgba(37,99,235,0.2); color:#93c5fd'
}

// ── Doctors ──
const COLORS = ['linear-gradient(135deg,#2563eb,#1d4ed8)','linear-gradient(135deg,#059669,#047857)','linear-gradient(135deg,#7c3aed,#6d28d9)','linear-gradient(135deg,#dc2626,#b91c1c)','linear-gradient(135deg,#d97706,#b45309)']
function doctorColor(id) { return COLORS[(id?.charCodeAt(0) || 0) % COLORS.length] }

function selectDoctor(d) {
  form.value.doctorId = d.id
  form.value.scheduledTime = ''
  if (form.value.scheduledDate) loadSlots()
}

// ── Types ──
const types = [
  { value: 'IN_PERSON',  label: 'In Person',  color: '#60a5fa' },
  { value: 'TELEHEALTH', label: 'Telehealth', color: '#34d399' },
]

// ── Patient search ──
async function searchPatients() {
  clearTimeout(debounce)
  if (patientSearch.value.length < 2) { patientResults.value = []; return }
  if (selectedPatient.value) clearPatient()
  debounce = setTimeout(async () => {
    try {
      const { data } = await api.get('/patients', { params: { search: patientSearch.value, limit: 5 } })
      patientResults.value = data.data.patients || []
    } catch { patientResults.value = [] }
  }, 300)
}

function selectPatient(p) {
  form.value.patientId  = p.id
  selectedPatient.value = p
  patientSearch.value   = `${p.firstName} ${p.lastName}`
  patientResults.value  = []
  newPatient.value = {
    firstName: p.firstName || '',
    lastName:  p.lastName  || '',
    phone:     p.phone     || '',
    email:     p.email     || '',
  }
}

function clearPatient() {
  form.value.patientId  = ''
  selectedPatient.value = null
  patientSearch.value   = ''
  newPatient.value      = { firstName: '', lastName: '', phone: '', email: '' }
}

function hideResults() {
  setTimeout(() => { patientResults.value = [] }, 150)
}

// ── Computed submit state ──
const patientLabel = computed(() => {
  if (selectedPatient.value) return `${selectedPatient.value.firstName} ${selectedPatient.value.lastName}`
  if (newPatient.value.firstName) return `${newPatient.value.firstName} ${newPatient.value.lastName}`.trim()
  return 'No patient selected'
})

const hasPatient = computed(() =>
  !!form.value.patientId || (newPatient.value.firstName && newPatient.value.phone && newPatient.value.phone.length >= 10)
)

const canSubmit = computed(() => {
  if (!hasPatient.value || !form.value.doctorId || !form.value.scheduledDate) return false
  if (slots.value.length && !form.value.scheduledTime) return false
  if (payment.value.mode === 'PAY_NOW') {
    return activeFees.value.length > 0 && totalFeeAmount.value > 0
  }
  return true
})

const submitHint = computed(() => {
  if (!hasPatient.value)       return 'Enter patient details to continue'
  if (!form.value.doctorId)    return 'Choose a doctor to continue'
  if (slots.value.length && !form.value.scheduledTime) return 'Pick a time slot to continue'
  if (payment.value.mode === 'PAY_NOW' && !activeFees.value.length) return 'Add fees in Settings before accepting online payment.'
  if (payment.value.mode === 'PAY_NOW' && totalFeeAmount.value <= 0) return 'Select at least one fee to pay online.'
  return ''
})

function ensurePayNowFeeSelection() {
  if (payment.value.mode !== 'PAY_NOW' || !activeFees.value.length) return
  const valid = payment.value.selectedFees.filter(id => activeFees.value.some(f => f.id === id))
  payment.value.selectedFees = valid.length ? valid : [activeFees.value[0].id]
}

watch(() => payment.value.mode, (mode) => {
  if (mode === 'PAY_NOW') ensurePayNowFeeSelection()
})

// ── Mount ──
onMounted(async () => {
  try {
    const { data } = await api.get('/staff', { params: { limit: 100 } })
    const filtered = (data.data.staff || []).filter(s =>
      s.userBranches?.some(b => b.role === 'DOCTOR') || s.staffProfile?.specialization
    )
    doctors.value = filtered
    // Extract the first available branchId from staff
    if (!branchId.value) {
      for (const s of filtered) {
        const b = s.userBranches?.[0]?.branch?.id || s.userBranches?.[0]?.branchId
        if (b) { branchId.value = b; break }
      }
    }
  } catch { doctors.value = [] }

  loadSlots()

  // Load fee types
  try {
    if (localStorage.getItem('demo_mode')) {
      allFees.value = [
        { id: 'df1', name: 'Consultation', fee: 500,  isActive: true },
        { id: 'df2', name: 'Lab Report',   fee: 300,  isActive: true },
        { id: 'df3', name: 'Medicine',     fee: 200,  isActive: false },
      ]
    } else {
      const { data } = await api.get('/fees')
      allFees.value = data.data || []
    }
    ensurePayNowFeeSelection()
  } catch { allFees.value = [] }

  const patientId = route.query.patientId
  if (!patientId) return
  form.value.patientId = String(patientId)
  try {
    const { data } = await api.get(`/patients/${patientId}`)
    selectedPatient.value = data.data
    patientSearch.value   = `${data.data.firstName} ${data.data.lastName}`
  } catch { form.value.patientId = '' }
})

// ── Submit ──
async function submit() {
  loading.value = true; error.value = ''
  try {
    if (payment.value.mode === 'PAY_NOW') {
      ensurePayNowFeeSelection()
      if (!activeFees.value.length) {
        error.value = 'Configure fees in Settings before accepting online payment.'
        return
      }
      if (totalFeeAmount.value <= 0) {
        error.value = 'Select at least one fee to pay online.'
        return
      }
    }

    const timeStr = form.value.scheduledTime || '09:00'
    const scheduledAt = new Date(`${form.value.scheduledDate}T${timeStr}:00`).toISOString()

    const payload = {
      providerId: form.value.doctorId,
      branchId: branchId.value,
      scheduledAt,
      type: form.value.type,
      chiefComplaint: form.value.reason || undefined,
      notes: form.value.notes || undefined,
      paymentMode: payment.value.mode,
      ...(payment.value.mode === 'PAY_NOW'
        ? { consultationFee: totalFeeAmount.value, feeIds: payment.value.selectedFees }
        : {}),
      ...(payment.value.mode === 'PAY_NOW' ? { paymentMethod: payment.value.method } : {}),
    }

    if (form.value.patientId) {
      payload.patientId = form.value.patientId
    } else {
      payload.patientPhone = newPatient.value.phone
      if (newPatient.value.email) payload.patientEmail = newPatient.value.email
    }

    const apptRes = await api.post('/appointments', payload)
    const appointmentId = apptRes.data?.data?.id || apptRes.data?.data?.appointment?.id

    if (payment.value.mode === 'PAY_NOW') {
      const orderRes = await api.post('/payments/cashfree/create-order', {
        amount: totalFeeAmount.value,
        appointmentId,
        customerName: `${newPatient.value.firstName} ${newPatient.value.lastName}`.trim(),
        customerPhone: newPatient.value.phone,
        customerEmail: newPatient.value.email || undefined,
      })
      const order = orderRes.data.data
      const payResult = await launchCashfreeCheckout({
        paymentSessionId: order.paymentSessionId,
        orderId: order.orderId,
        order,
      })
      if (payResult.status === 'PAID') {
        router.push('/appointments')
        return
      }
      if (payResult.status === 'CANCELLED') {
        error.value = 'Payment cancelled. Appointment was created — pay at clinic or retry from billing.'
        router.push('/appointments')
        return
      }
      router.push(`/payment/status?order_id=${payResult.orderId}`)
      return
    }

    router.push('/appointments')
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to book appointment'
  } finally { loading.value = false }
}
</script>
