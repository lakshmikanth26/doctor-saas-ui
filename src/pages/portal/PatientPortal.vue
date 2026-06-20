<template>
  <div class="min-h-screen font-sans" style="background:#0f172a">

    <!-- Header -->
    <header style="background:#111827; border-bottom:1px solid rgba(255,255,255,0.06)">
      <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base"
            style="background:linear-gradient(135deg,#2563eb,#1d4ed8); box-shadow:0 4px 12px rgba(37,99,235,0.35)">C</div>
          <div>
            <div class="text-white font-black text-base leading-none">ClinicOS</div>
            <div class="text-slate-400 text-xs mt-0.5">Patient Portal</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-white font-mono text-lg font-bold">{{ time }}</div>
          <div class="text-slate-400 text-xs">{{ dateStr }}</div>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 pt-6 pb-12">

      <!-- Tabs -->
      <div class="flex gap-1 p-1 rounded-2xl mb-6" style="background:#1e293b">
        <button @click="activeTab = 'book'"
          class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
          :style="activeTab === 'book' ? 'background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white' : 'color:#64748b'">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Book Appointment
        </button>
        <button @click="activeTab = 'track'"
          class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
          :style="activeTab === 'track' ? 'background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white' : 'color:#64748b'">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Track My Queue
        </button>
      </div>

      <!-- ── BOOK TAB ── -->
      <div v-if="activeTab === 'book'">

        <!-- Success -->
        <div v-if="booked" class="rounded-3xl p-8 text-center" style="background:linear-gradient(135deg,#064e3b22,#022c2211); border:1px solid rgba(16,185,129,0.2)">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background:rgba(16,185,129,0.2)">
            <svg class="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 class="text-2xl font-black text-white mb-2">You're booked!</h2>
          <p class="text-slate-400 mb-6">Show this token at the clinic reception.</p>
          <div class="inline-block rounded-2xl px-12 py-6 mb-6" style="background:linear-gradient(135deg,#059669,#047857); box-shadow:0 8px 32px rgba(5,150,105,0.4)">
            <p class="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">Your Token</p>
            <div class="text-8xl font-black text-white leading-none">{{ String(bookedToken).padStart(2,'0') }}</div>
          </div>
          <div class="rounded-2xl p-4 text-left space-y-2.5 mb-6" style="background:#1e293b">
            <div class="flex justify-between text-sm"><span class="text-slate-400">Name</span><span class="text-white font-semibold">{{ form.firstName }} {{ form.lastName }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-slate-400">Date</span><span class="text-white font-semibold">{{ form.scheduledDate }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-slate-400">Time</span><span class="text-white font-semibold">{{ form.scheduledTime || 'Walk-in' }}</span></div>
          </div>
          <button @click="activeTab = 'track'; trackPhone = form.phone; trackQueue()"
            class="w-full py-3.5 rounded-xl text-white font-bold text-sm mb-3"
            style="background:linear-gradient(135deg,#2563eb,#1d4ed8)">
            Track My Queue Position →
          </button>
          <button @click="resetBook" class="w-full py-3 rounded-xl text-slate-400 text-sm hover:text-white transition-colors">
            Book Another Appointment
          </button>
        </div>

        <!-- Booking form -->
        <div v-else class="space-y-4">

          <!-- Row 1: Details (wider) + Calendar (narrower) -->
          <div class="grid md:grid-cols-5 gap-4">

            <!-- Left: Patient details — wider -->
            <div class="md:col-span-3">
              <div class="rounded-2xl p-5 h-full" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06)">
                <h3 class="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                  <span class="w-5 h-5 rounded-full bg-blue-600/25 text-blue-400 text-xs flex items-center justify-center font-black">1</span>
                  Your Details
                </h3>
                <div class="space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="label text-[10px]">First Name *</label>
                      <input v-model="form.firstName" class="portal-input" placeholder="First name" />
                    </div>
                    <div>
                      <label class="label text-[10px]">Last Name *</label>
                      <input v-model="form.lastName" class="portal-input" placeholder="Last name" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="label text-[10px]">Phone Number *</label>
                      <input v-model="form.phone" type="tel" class="portal-input" placeholder="10-digit mobile number" maxlength="10" />
                    </div>
                    <div>
                      <label class="label text-[10px]">Doctor</label>
                      <select v-model="form.doctorId" class="portal-input" @change="loadSlots">
                        <option value="">Any doctor</option>
                        <option v-for="d in doctors" :key="d.id" :value="d.id">Dr. {{ d.firstName }} {{ d.lastName }}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="label text-[10px]">Reason for Visit</label>
                    <textarea v-model="form.reason" class="portal-input" rows="3" placeholder="Describe your symptoms or reason for visit"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Calendar — narrower -->
            <div class="md:col-span-2">
              <div class="rounded-2xl p-5 h-full" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06)">
                <h3 class="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                  <span class="w-5 h-5 rounded-full bg-blue-600/25 text-blue-400 text-xs flex items-center justify-center font-black">2</span>
                  Pick a Date
                </h3>

                <!-- Month nav -->
                <div class="flex items-center justify-between mb-3">
                  <button type="button" @click="prevMonth"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    style="background:rgba(255,255,255,0.05)">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <p class="text-white font-bold text-sm">{{ monthLabel }}</p>
                  <button type="button" @click="nextMonth"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    style="background:rgba(255,255,255,0.05)">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>

                <!-- Day names -->
                <div class="grid grid-cols-7 mb-1">
                  <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d"
                    class="text-center text-xs font-semibold py-1" style="color:#475569">{{ d }}</div>
                </div>

                <!-- Day grid -->
                <div class="grid grid-cols-7 gap-1">
                  <div v-for="(cell, i) in calendarCells" :key="i">
                    <button v-if="cell" type="button"
                      @click="!cell.past && selectDate(cell.iso)"
                      class="w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all relative"
                      :style="calDayStyle(cell)"
                      :disabled="cell.past">
                      {{ cell.day }}
                      <span v-if="cell.iso === todayIso && cell.iso !== form.scheduledDate"
                        class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"></span>
                    </button>
                    <div v-else class="w-full aspect-square"></div>
                  </div>
                </div>

                <p v-if="form.scheduledDate" class="text-center text-xs text-slate-400 mt-3">
                  {{ selectedDateLabel }}
                </p>
              </div>
            </div>
          </div>

          <!-- Row 2: Time slots — full width -->
          <div class="rounded-2xl p-5" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06)">
            <h3 class="text-white font-bold mb-4 flex items-center justify-between text-sm">
              <span class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-600/25 text-blue-400 text-xs flex items-center justify-center font-black">3</span>
                Pick a Time
              </span>
              <span class="text-slate-500 text-xs font-normal">1-hour slots</span>
            </h3>

            <div v-if="loadingSlots" class="grid grid-cols-5 sm:grid-cols-10 gap-2">
              <div v-for="n in 10" :key="n" class="h-14 rounded-xl animate-pulse" style="background:rgba(255,255,255,0.05)"></div>
            </div>

            <div v-else class="grid grid-cols-5 sm:grid-cols-10 gap-2">
              <button v-for="s in displaySlots" :key="s.time" type="button"
                @click="!s.busy && (form.scheduledTime = s.time)"
                class="flex flex-col items-center justify-center py-3 px-1 rounded-xl text-xs font-bold transition-all relative"
                :style="portalSlotStyle(s)"
                :disabled="s.busy">
                <span class="text-sm font-black leading-none mb-1">{{ s.time }}</span>
                <span class="text-[10px] opacity-70">{{ s.busy ? 'Busy' : 'Open' }}</span>
                <span v-if="s.busy" class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400"></span>
              </button>
            </div>

            <p v-if="!form.scheduledTime" class="text-center text-xs text-slate-600 mt-3">Walk-in if no time selected</p>
          </div>

          <!-- Error & Submit -->
          <div v-if="bookError" class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400"
            style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2)">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ bookError }}
          </div>

          <button @click="bookAppointment" :disabled="bookLoading"
            class="w-full py-4 rounded-2xl text-white font-black text-sm transition-all disabled:opacity-50"
            style="background:linear-gradient(135deg,#2563eb,#1d4ed8); box-shadow:0 4px 20px rgba(37,99,235,0.35)">
            {{ bookLoading ? 'Booking…' : 'Confirm Appointment →' }}
          </button>

          <p class="text-center text-slate-600 text-xs">No account required · Your data is private &amp; secure</p>
        </div>
      </div>

      <!-- ── TRACK TAB ── -->
      <div v-if="activeTab === 'track'">
        <div class="rounded-2xl p-5 mb-4" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06)">
          <h2 class="text-white font-bold text-sm mb-3">Track Your Queue Position</h2>
          <div class="flex gap-2">
            <input v-model="trackPhone" type="tel" class="portal-input flex-1" placeholder="Enter your phone number" maxlength="10" @keyup.enter="trackQueue" />
            <button @click="trackQueue" :disabled="trackLoading || trackPhone.length < 10"
              class="px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-50 shrink-0"
              style="background:linear-gradient(135deg,#2563eb,#1d4ed8)">
              {{ trackLoading ? '…' : 'Find →' }}
            </button>
          </div>
        </div>

        <div v-if="myAppointment" class="rounded-2xl overflow-hidden mb-4" style="border:1px solid rgba(255,255,255,0.06)">
          <div class="px-5 py-4 flex items-center gap-4"
            :style="myAppointment.status === 'IN_PROGRESS' ? 'background:linear-gradient(135deg,#059669,#047857)'
              : myAppointment.status === 'COMPLETED' ? 'background:#1e293b'
              : 'background:linear-gradient(135deg,#1e3a5f,#172554)'">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0"
              style="background:rgba(255,255,255,0.15)">
              {{ String(myAppointment.tokenNumber).padStart(2,'0') }}
            </div>
            <div class="flex-1">
              <p class="text-white font-black text-lg">Token #{{ myAppointment.tokenNumber }}</p>
              <p class="text-white/70 text-sm">
                {{ myAppointment.status === 'IN_PROGRESS' ? 'You are being seen now!'
                  : myAppointment.status === 'COMPLETED' ? 'Consultation complete'
                  : `${myPosition} patient${myPosition !== 1 ? 's' : ''} ahead of you` }}
              </p>
              <p class="text-white/50 text-xs mt-0.5">Dr. {{ myAppointment.doctor?.firstName }} {{ myAppointment.doctor?.lastName }}
                <span v-if="myAppointment.scheduledTime"> · {{ myAppointment.scheduledTime }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl overflow-hidden" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06)">
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid rgba(255,255,255,0.06)">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span class="text-white font-bold text-sm">Live Queue</span>
            </div>
            <button @click="loadPublicQueue" class="text-slate-400 hover:text-white text-xs font-semibold transition-colors">↺ Refresh</button>
          </div>
          <div v-if="!publicQueue.length" class="py-12 text-center text-slate-500 text-sm">Queue is empty right now</div>
          <div v-else>
            <div v-if="publicCurrentlyServing" class="px-5 py-4" style="border-bottom:1px solid rgba(255,255,255,0.06)">
              <p class="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Now Serving</p>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white"
                  style="background:linear-gradient(135deg,#059669,#047857)">
                  {{ String(publicCurrentlyServing.tokenNumber).padStart(2,'0') }}
                </div>
                <div>
                  <p class="text-white font-bold">{{ publicCurrentlyServing.patient?.firstName }} {{ publicCurrentlyServing.patient?.lastName }}</p>
                  <p class="text-slate-400 text-xs">Dr. {{ publicCurrentlyServing.doctor?.firstName }} {{ publicCurrentlyServing.doctor?.lastName }}</p>
                </div>
              </div>
            </div>
            <div v-for="(appt, i) in publicWaiting.slice(0, 10)" :key="appt.id"
              class="flex items-center gap-3 px-5 py-3 transition-colors"
              :style="myAppointment?.id === appt.id ? 'background:rgba(59,130,246,0.1)' : ''"
              style="border-bottom:1px solid rgba(255,255,255,0.04)">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                :style="i === 0 ? 'background:linear-gradient(135deg,#d97706,#b45309)' : 'background:rgba(255,255,255,0.06)'">
                {{ String(appt.tokenNumber).padStart(2,'0') }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white text-sm font-semibold truncate">{{ appt.patient?.firstName }} {{ appt.patient?.lastName }}</p>
                <p class="text-slate-500 text-xs">{{ i === 0 ? 'Next up' : `${i + 1} in queue` }}</p>
              </div>
              <span v-if="myAppointment?.id === appt.id"
                class="text-blue-400 text-xs font-bold px-2 py-0.5 rounded-lg"
                style="border:1px solid rgba(59,130,246,0.3)">YOU</span>
            </div>
          </div>
          <div class="px-5 py-3 flex justify-between text-xs text-slate-600" style="border-top:1px solid rgba(255,255,255,0.04)">
            <span>{{ publicWaiting.length }} waiting</span><span>Updates every 30s</span>
          </div>
        </div>

        <p v-if="trackError" class="text-red-400 text-sm text-center mt-3">{{ trackError }}</p>
        <p v-if="!myAppointment && !trackError && trackPhone.length >= 10" class="text-slate-500 text-sm text-center mt-3">
          No active appointment found for this number today.
        </p>
      </div>

      <p class="text-center text-slate-700 text-xs pt-10">
        Powered by <span class="text-slate-500 font-semibold">ClinicOS</span> · Patient data is private & encrypted
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route   = useRoute()
const orgSlug = computed(() => route.params.orgSlug || route.query.clinic || '')

// ── Clock ──
const time = ref(''); const dateStr = ref('')
const todayIso  = new Date().toISOString().split('T')[0]
const todayDate = todayIso
function updateClock() {
  const n = new Date()
  time.value    = n.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  dateStr.value = n.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

// ── Tabs ──
const activeTab = ref('book')

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

function calDayStyle(cell) {
  if (cell.iso === form.value.scheduledDate)
    return 'background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white; box-shadow:0 3px 12px rgba(37,99,235,0.4)'
  if (cell.past) return 'color:rgba(255,255,255,0.1); cursor:not-allowed'
  if (cell.iso === todayIso) return 'background:rgba(59,130,246,0.15); color:#60a5fa'
  return 'background:rgba(255,255,255,0.04); color:#94a3b8'
}

function prevMonth() {
  if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- } else calMonth.value--
}
function nextMonth() {
  if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ } else calMonth.value++
}
function selectDate(iso) {
  form.value.scheduledDate = iso
  form.value.scheduledTime = ''
  loadSlots()
}
const selectedDateLabel = computed(() => {
  if (!form.value.scheduledDate) return ''
  return new Date(form.value.scheduledDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
})

// ── Booking ──
const doctors     = ref([])
const slots       = ref([])
const loadingSlots = ref(false)
const booked      = ref(false)
const bookedToken = ref(null)
const bookLoading = ref(false)
const bookError   = ref('')
const form = ref({ firstName:'', lastName:'', phone:'', scheduledDate: todayDate, scheduledTime:'', doctorId:'', reason:'' })

const canBook = computed(() =>
  form.value.firstName && form.value.lastName && form.value.phone.length >= 10 && form.value.scheduledDate
)

function generateDefaultSlots() {
  return Array.from({ length: 10 }, (_, i) => ({
    time: `${String(9 + i).padStart(2,'0')}:00`, busy: false
  }))
}

function portalSlotStyle(s) {
  if (form.value.scheduledTime === s.time)
    return 'background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white; border:1px solid rgba(37,99,235,0.5); box-shadow:0 4px 14px rgba(37,99,235,0.3)'
  if (s.busy)
    return 'background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15); color:#f87171; cursor:not-allowed; opacity:0.65'
  return 'background:rgba(37,99,235,0.1); border:1px solid rgba(37,99,235,0.2); color:#93c5fd'
}

const displaySlots = computed(() => slots.value.length ? slots.value : generateDefaultSlots())

async function loadDoctors() {
  const { data } = await axios.get('/api/v1/staff', { params: { limit: 50 } }).catch(() => ({ data: { data: { staff: [] } } }))
  doctors.value = (data.data?.staff || []).filter(s => s.role === 'DOCTOR' || s.staffProfile?.specialization)
}

async function loadSlots() {
  if (!form.value.scheduledDate) return
  loadingSlots.value = true
  try {
    const { data } = await axios.get('/api/v1/appointments/slots', {
      params: { date: form.value.scheduledDate, doctorId: form.value.doctorId || undefined }
    }).catch(() => ({ data: { data: [] } }))
    slots.value = data.data || []
  } finally { loadingSlots.value = false }
}

async function bookAppointment() {
  bookError.value = ''
  if (!form.value.firstName || !form.value.lastName) { bookError.value = 'Please enter your first and last name.'; return }
  if (form.value.phone.length < 10) { bookError.value = 'Please enter a valid 10-digit phone number.'; return }
  if (!form.value.scheduledDate) { bookError.value = 'Please select a date.'; return }
  bookLoading.value = true
  try {
    const { data } = await axios.post('/api/v1/appointments/public', {
      ...form.value, orgSlug: orgSlug.value || undefined
    })
    bookedToken.value = data.data?.tokenNumber || data.data?.appointment?.tokenNumber || '01'
    booked.value = true
    trackPhone.value = form.value.phone
    await loadPublicQueue()
  } catch (e) {
    bookError.value = e.response?.data?.message || 'Booking failed. Please try again or call the clinic.'
  } finally { bookLoading.value = false }
}

function resetBook() {
  booked.value = false; bookedToken.value = null
  form.value = { firstName:'', lastName:'', phone:'', scheduledDate: todayDate, scheduledTime:'', doctorId:'', reason:'' }
  slots.value = []
}

// ── Track ──
const trackPhone  = ref(''); const trackLoading = ref(false); const trackError = ref('')
const publicQueue = ref([]); const myAppointment = ref(null)
const publicCurrentlyServing = computed(() => publicQueue.value.find(a => a.status === 'IN_PROGRESS'))
const publicWaiting          = computed(() => publicQueue.value.filter(a => a.status === 'WAITING'))
const myPosition             = computed(() => {
  if (!myAppointment.value) return null
  return publicWaiting.value.findIndex(a => a.id === myAppointment.value.id)
})

async function loadPublicQueue() {
  const slug = orgSlug.value
  const { data } = await axios.get(slug ? `/api/v1/appointments/queue?orgSlug=${slug}` : '/api/v1/appointments/queue')
    .catch(() => ({ data: { data: [] } }))
  publicQueue.value = data.data || []
}

async function trackQueue() {
  if (trackPhone.value.length < 10) return
  trackLoading.value = true; trackError.value = ''
  try {
    await loadPublicQueue()
    myAppointment.value = publicQueue.value.find(a => a.patient?.phone === trackPhone.value) || null
  } catch { trackError.value = 'Could not load queue. Please try again.' }
  finally { trackLoading.value = false }
}

let clockTimer, queueTimer
onMounted(async () => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  await Promise.all([loadDoctors(), loadPublicQueue()])
  loadSlots()
  queueTimer = setInterval(async () => {
    await loadPublicQueue()
    if (myAppointment.value)
      myAppointment.value = publicQueue.value.find(a => a.id === myAppointment.value.id) || null
  }, 30000)
})
onUnmounted(() => { clearInterval(clockTimer); clearInterval(queueTimer) })
</script>

<style scoped>
.portal-input {
  width: 100%;
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 0.75rem;
  color: #e2e8f0;
  padding: 0.6rem 0.875rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s;
  color-scheme: dark;
}
.portal-input:focus { border-color: rgba(59,130,246,0.6); }
.portal-input::placeholder { color: #94a3b8 !important; opacity: 1; }
.portal-input::-webkit-input-placeholder { color: #94a3b8 !important; }
.portal-input::-moz-placeholder { color: #94a3b8 !important; opacity: 1; }
select.portal-input { color-scheme: dark; background: #0f172a; }
.portal-input option { background: #1e293b; color: #e2e8f0; }
/* Fix autofill */
.portal-input:-webkit-autofill,
.portal-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #0f172a inset !important;
  -webkit-text-fill-color: #e2e8f0 !important;
}
</style>
