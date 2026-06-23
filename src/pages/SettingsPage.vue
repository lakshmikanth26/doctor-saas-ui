<template>
  <div class="max-w-2xl">
    <h1 class="page-title mb-6">Settings</h1>

    <div class="space-y-4">
      <div class="card">
        <h3 class="font-semibold mb-3">Organization Info</h3>
        <dl class="grid grid-cols-2 gap-3 text-sm">
          <div><dt class="text-slate-500">Name</dt><dd class="font-medium">{{ auth.org?.name }}</dd></div>
          <div><dt class="text-slate-500">Type</dt><dd class="font-medium">{{ auth.org?.clinicType }}</dd></div>
          <div><dt class="text-slate-500">Slug</dt><dd class="font-mono text-xs">{{ auth.org?.slug }}</dd></div>
          <div><dt class="text-slate-500">Plan</dt><dd><span class="badge-blue">{{ auth.org?.subscription?.plan || 'FREE_TRIAL' }}</span></dd></div>
        </dl>
      </div>

      <div class="card">
        <h3 class="font-semibold mb-3">My Profile</h3>
        <dl class="grid grid-cols-2 gap-3 text-sm">
          <div><dt class="text-slate-500">Name</dt><dd class="font-medium">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</dd></div>
          <div><dt class="text-slate-500">Email</dt><dd>{{ auth.user?.email }}</dd></div>
          <div><dt class="text-slate-500">Role</dt><dd><span class="badge-blue">{{ auth.user?.role }}</span></dd></div>
        </dl>
      </div>

      <!-- ── Fee Management ── -->
      <div class="card space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">Fee Management</h3>
            <p class="text-xs text-slate-500 mt-0.5">Fees shown during appointment booking. Toggle to enable/disable.</p>
          </div>
          <button @click="showAddFee = true" class="btn-primary btn-sm flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Fee
          </button>
        </div>

        <!-- Fee list -->
        <div v-if="feesLoading" class="space-y-2">
          <div v-for="n in 2" :key="n" class="h-14 rounded-xl animate-pulse" style="background:rgba(255,255,255,0.05)"></div>
        </div>

        <div v-else-if="fees.length" class="space-y-2">
          <div v-for="fee in fees" :key="fee.id"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            :style="fee.isActive
              ? 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08)'
              : 'background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); opacity:0.6'">

            <!-- Toggle -->
            <button type="button" @click="toggleFee(fee)"
              class="shrink-0 w-10 h-6 rounded-full transition-all relative"
              :style="fee.isActive ? 'background:#2563eb' : 'background:#334155'">
              <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                :style="fee.isActive ? 'left:22px' : 'left:2px'"></span>
            </button>

            <!-- Name (editable inline) -->
            <div class="flex-1 min-w-0">
              <template v-if="editingId === fee.id">
                <input v-model="editForm.name" class="input py-1 text-sm w-full" @keyup.enter="saveEdit(fee)" @keyup.escape="editingId = null" />
              </template>
              <template v-else>
                <p class="text-sm font-semibold text-slate-200 truncate">{{ fee.name }}</p>
              </template>
            </div>

            <!-- Amount (editable inline) -->
            <div class="shrink-0">
              <template v-if="editingId === fee.id">
                <div class="flex items-center gap-1">
                  <span class="text-slate-400 text-sm">₹</span>
                  <input v-model="editForm.fee" type="number" min="0" class="input py-1 text-sm w-24 text-right" @keyup.enter="saveEdit(fee)" />
                </div>
              </template>
              <template v-else>
                <span class="text-sm font-bold text-white">₹{{ Number(fee.fee).toLocaleString('en-IN') }}</span>
              </template>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 shrink-0">
              <template v-if="editingId === fee.id">
                <button @click="saveEdit(fee)" class="w-7 h-7 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/10 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </button>
                <button @click="editingId = null" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white/5 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </template>
              <template v-else>
                <button @click="startEdit(fee)" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button @click="confirmDelete(fee)" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </template>
            </div>
          </div>
        </div>

        <div v-else class="py-8 text-center text-slate-500 text-sm">
          No fees configured yet. Click <strong class="text-slate-300">Add Fee</strong> to get started.
        </div>

        <p v-if="feeError" class="text-red-400 text-xs">{{ feeError }}</p>
      </div>

      <!-- Add Fee modal -->
      <Teleport to="body">
        <div v-if="showAddFee" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.7)">
          <div class="w-full max-w-sm rounded-2xl p-6 space-y-4" style="background:#1e293b; border:1px solid rgba(255,255,255,0.1)">
            <h3 class="font-bold text-white">Add New Fee</h3>
            <div>
              <label class="label">Fee Name *</label>
              <input v-model="newFee.name" class="input" placeholder="e.g. Consultation, Lab Report, Medicine" @keyup.enter="addFee" />
            </div>
            <div>
              <label class="label">Amount (₹) *</label>
              <input v-model="newFee.fee" type="number" min="0" class="input" placeholder="0" @keyup.enter="addFee" />
            </div>
            <div v-if="addError" class="text-red-400 text-xs">{{ addError }}</div>
            <div class="flex gap-3 pt-1">
              <button @click="addFee" :disabled="addLoading" class="btn-primary flex-1">{{ addLoading ? 'Adding…' : 'Add Fee' }}</button>
              <button @click="showAddFee = false; newFee = { name: '', fee: '' }; addError = ''" class="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      </Teleport>

      <div class="card">
        <h3 class="font-semibold mb-3">Patient Portal</h3>
        <p class="text-sm text-slate-500 mb-3">Share this link so patients can book appointments online.</p>
        <div class="flex items-center gap-2">
          <input :value="`${origin}/portal/${auth.org?.slug}`" class="input flex-1 font-mono text-sm" readonly />
          <button @click="copyPortal" class="btn-secondary btn-sm">{{ portalCopied ? '✓ Copied' : 'Copy' }}</button>
        </div>
        <RouterLink v-if="auth.org?.slug" :to="`/portal/${auth.org.slug}`" target="_blank" class="btn-primary btn-sm mt-3 inline-flex">
          📅 Open Patient Portal
        </RouterLink>
      </div>

      <div class="card">
        <h3 class="font-semibold mb-3">Queue Display</h3>
        <p class="text-sm text-slate-500 mb-3">Share this URL on your waiting room TV or send to patients on their phone.</p>
        <div class="flex items-center gap-2">
          <input :value="`${origin}/queue/${auth.org?.slug}`" class="input flex-1 font-mono text-sm" readonly />
          <button @click="copyQueue" class="btn-secondary btn-sm">{{ copied ? '✓ Copied' : 'Copy' }}</button>
        </div>
        <RouterLink :to="`/queue/${auth.org?.slug}`" target="_blank" class="btn-primary btn-sm mt-3 inline-flex">
          📺 Open Queue Display
        </RouterLink>
      </div>

      <div class="card border-red-100">
        <h3 class="font-semibold mb-3 text-red-600">Danger Zone</h3>
        <button @click="auth.logout()" class="btn-danger btn-sm">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/api'

const auth   = useAuthStore()
const copied = ref(false)
const portalCopied = ref(false)
const origin = window.location.origin

function copyQueue() {
  navigator.clipboard.writeText(`${origin}/queue/${auth.org?.slug}`)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function copyPortal() {
  navigator.clipboard.writeText(`${origin}/portal/${auth.org?.slug}`)
  portalCopied.value = true
  setTimeout(() => { portalCopied.value = false }, 2000)
}

// ── Fees ──
const fees        = ref([])
const feesLoading = ref(false)
const feeError    = ref('')
const showAddFee  = ref(false)
const addLoading  = ref(false)
const addError    = ref('')
const newFee      = ref({ name: '', fee: '' })
const editingId   = ref(null)
const editForm    = ref({ name: '', fee: '' })

const DEMO_FEES = [
  { id: 'df1', name: 'Consultation', fee: 500,  isActive: true },
  { id: 'df2', name: 'Lab Report',   fee: 300,  isActive: true },
  { id: 'df3', name: 'Medicine',     fee: 200,  isActive: false },
]

async function loadFees() {
  feesLoading.value = true
  if (localStorage.getItem('demo_mode')) {
    fees.value = [...DEMO_FEES]; feesLoading.value = false; return
  }
  try {
    const { data } = await api.get('/fees')
    fees.value = data.data || []
  } catch { feeError.value = 'Failed to load fees' }
  finally { feesLoading.value = false }
}

async function addFee() {
  if (!newFee.value.name.trim()) { addError.value = 'Name is required'; return }
  if (newFee.value.fee === '' || isNaN(Number(newFee.value.fee))) { addError.value = 'Valid amount is required'; return }
  addLoading.value = true; addError.value = ''
  if (localStorage.getItem('demo_mode')) {
    fees.value.push({ id: `df${Date.now()}`, name: newFee.value.name, fee: Number(newFee.value.fee), isActive: true })
    showAddFee.value = false; newFee.value = { name: '', fee: '' }; addLoading.value = false; return
  }
  try {
    const { data } = await api.post('/fees', { name: newFee.value.name, fee: Number(newFee.value.fee) })
    fees.value.push(data.data)
    showAddFee.value = false; newFee.value = { name: '', fee: '' }
  } catch (e) { addError.value = e.response?.data?.message || 'Failed to add fee' }
  finally { addLoading.value = false }
}

async function toggleFee(fee) {
  const prev = fee.isActive
  fee.isActive = !prev
  if (localStorage.getItem('demo_mode')) return
  try { await api.put(`/fees/${fee.id}`, { isActive: fee.isActive }) }
  catch { fee.isActive = prev; feeError.value = 'Failed to update' }
}

function startEdit(fee) {
  editingId.value = fee.id
  editForm.value = { name: fee.name, fee: String(fee.fee) }
}

async function saveEdit(fee) {
  const prev = { name: fee.name, fee: fee.fee }
  fee.name = editForm.value.name
  fee.fee  = Number(editForm.value.fee)
  editingId.value = null
  if (localStorage.getItem('demo_mode')) return
  try { await api.put(`/fees/${fee.id}`, { name: fee.name, fee: fee.fee }) }
  catch { fee.name = prev.name; fee.fee = prev.fee; feeError.value = 'Failed to save' }
}

async function confirmDelete(fee) {
  if (!confirm(`Delete "${fee.name}"?`)) return
  fees.value = fees.value.filter(f => f.id !== fee.id)
  if (localStorage.getItem('demo_mode')) return
  try { await api.delete(`/fees/${fee.id}`) }
  catch { await loadFees(); feeError.value = 'Failed to delete' }
}

onMounted(loadFees)
</script>
