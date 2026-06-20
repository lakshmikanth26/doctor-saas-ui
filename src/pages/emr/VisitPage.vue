<template>
  <div v-if="visit" class="max-w-4xl mx-auto">
    <div class="page-header">
      <div class="flex items-center gap-3">
        <RouterLink to="/appointments" class="text-slate-400 hover:text-slate-500">←</RouterLink>
        <div>
          <h1 class="page-title">EMR Visit</h1>
          <p class="text-slate-500 text-sm">{{ visit.patient?.firstName }} {{ visit.patient?.lastName }} · {{ fmtDate(visit.createdAt) }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <span :class="visit.status === 'COMPLETED' ? 'badge-green' : 'badge-blue'">{{ visit.status }}</span>
        <button v-if="visit.status !== 'COMPLETED'" @click="completeVisit" class="btn-primary btn-sm">Complete Visit</button>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4">
      <!-- Left: SOAP -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Vitals -->
        <div class="card">
          <h3 class="font-semibold mb-3">Vitals</h3>
          <div class="grid grid-cols-3 gap-3">
            <div><label class="label text-xs">Weight (kg)</label><input v-model="vitals.weight" class="input" type="number" /></div>
            <div><label class="label text-xs">Height (cm)</label><input v-model="vitals.height" class="input" type="number" /></div>
            <div><label class="label text-xs">Temp (°F)</label><input v-model="vitals.temperature" class="input" type="number" /></div>
            <div><label class="label text-xs">BP Systolic</label><input v-model="vitals.bpSystolic" class="input" type="number" /></div>
            <div><label class="label text-xs">BP Diastolic</label><input v-model="vitals.bpDiastolic" class="input" type="number" /></div>
            <div><label class="label text-xs">Pulse (bpm)</label><input v-model="vitals.pulse" class="input" type="number" /></div>
            <div><label class="label text-xs">SpO2 (%)</label><input v-model="vitals.spO2" class="input" type="number" /></div>
            <div><label class="label text-xs">RR (breaths/min)</label><input v-model="vitals.respiratoryRate" class="input" type="number" /></div>
          </div>
          <button @click="saveVitals" class="btn-secondary btn-sm mt-3" :disabled="savingVitals">
            {{ savingVitals ? 'Saving…' : '💾 Save Vitals' }}
          </button>
          <div v-if="visit.vitals?.length" class="mt-3 text-xs text-slate-500">
            Last: BP {{ visit.vitals[0].bpSystolic }}/{{ visit.vitals[0].bpDiastolic }}, Pulse {{ visit.vitals[0].pulse }}, Temp {{ visit.vitals[0].temperature }}°F
          </div>
        </div>

        <!-- SOAP Notes -->
        <div class="card">
          <h3 class="font-semibold mb-3">SOAP Notes</h3>
          <div class="space-y-3">
            <div><label class="label">S — Subjective (Patient's complaint)</label><textarea v-model="soap.subjective" class="input" rows="3" placeholder="Chief complaint, history of present illness…" /></div>
            <div><label class="label">O — Objective (Examination findings)</label><textarea v-model="soap.objective" class="input" rows="3" placeholder="Physical examination, test results…" /></div>
            <div><label class="label">A — Assessment (Diagnosis)</label><textarea v-model="soap.assessment" class="input" rows="2" placeholder="Clinical impression and diagnosis…" /></div>
            <div><label class="label">P — Plan (Treatment)</label><textarea v-model="soap.plan" class="input" rows="3" placeholder="Treatment plan, medications, follow-up…" /></div>
          </div>
          <button @click="saveSoap" class="btn-primary btn-sm mt-3" :disabled="savingSoap">
            {{ savingSoap ? 'Saving…' : '💾 Save SOAP' }}
          </button>
        </div>

        <!-- Diagnoses -->
        <div class="card">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">Diagnoses</h3>
            <button @click="showDiagForm = true" class="btn-secondary btn-sm">+ Add</button>
          </div>
          <div v-if="!visit.diagnoses?.length" class="text-slate-400 text-sm text-center py-4">No diagnoses added</div>
          <div v-else class="space-y-2">
            <div v-for="d in visit.diagnoses" :key="d.id" class="flex items-center gap-3 p-2 rounded-lg" style="background:rgba(255,255,255,0.05)">
              <span class="font-mono text-xs px-2 py-0.5 rounded" style="border:1px solid rgba(255,255,255,0.15); color:#94a3b8">{{ d.icdCode || 'No ICD' }}</span>
              <span class="text-sm flex-1">{{ d.name }}</span>
              <span :class="d.type === 'PRIMARY' ? 'badge-blue' : 'badge-gray'">{{ d.type }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Prescriptions & info -->
      <div class="space-y-4">
        <div class="card">
          <h3 class="font-semibold mb-2">Patient</h3>
          <RouterLink :to="`/patients/${visit.patientId}`" class="text-blue-600 text-sm hover:underline">
            {{ visit.patient?.firstName }} {{ visit.patient?.lastName }}
          </RouterLink>
          <p class="text-xs text-slate-400 mt-1">{{ visit.patient?.mrn }}</p>
          <div class="mt-3 pt-3 border-t text-sm space-y-1">
            <p class="text-slate-500">Blood: <span class="font-semibold text-red-600">{{ visit.patient?.bloodGroup || 'Unknown' }}</span></p>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold">Prescriptions</h3>
            <RouterLink :to="`/prescriptions`" class="text-blue-600 text-xs">+ New</RouterLink>
          </div>
          <div v-if="!visit.prescriptions?.length" class="text-slate-400 text-sm text-center py-4">No prescriptions</div>
          <div v-else class="space-y-2">
            <div v-for="rx in visit.prescriptions" :key="rx.id" class="text-sm p-2 rounded-lg" style="background:rgba(255,255,255,0.05)">
              <p class="font-medium">Rx #{{ rx.id.slice(-6) }}</p>
              <p class="text-xs text-slate-500">{{ rx.items?.length }} medication(s)</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Diagnosis Modal -->
    <Modal :show="showDiagForm" title="Add Diagnosis" @close="showDiagForm = false">
      <div class="space-y-3">
        <div><label class="label">Diagnosis Name *</label><input v-model="diagForm.name" class="input" required /></div>
        <div><label class="label">ICD Code</label><input v-model="diagForm.icdCode" class="input" placeholder="e.g. J00" /></div>
        <div><label class="label">Type</label>
          <select v-model="diagForm.type" class="input">
            <option value="PRIMARY">Primary</option>
            <option value="SECONDARY">Secondary</option>
            <option value="DIFFERENTIAL">Differential</option>
          </select>
        </div>
      </div>
      <template #footer>
        <button @click="showDiagForm = false" class="btn-secondary">Cancel</button>
        <button @click="addDiagnosis" class="btn-primary">Add</button>
      </template>
    </Modal>
  </div>
  <div v-else class="text-center py-20 text-slate-400">Loading visit…</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'
import Modal from '@/components/Modal.vue'

const route = useRoute()
const router = useRouter()
const visit = ref(null)
const showDiagForm = ref(false)
const savingVitals = ref(false)
const savingSoap = ref(false)

const vitals = ref({ weight: '', height: '', temperature: '', bpSystolic: '', bpDiastolic: '', pulse: '', spO2: '', respiratoryRate: '' })
const soap = ref({ subjective: '', objective: '', assessment: '', plan: '' })
const diagForm = ref({ name: '', icdCode: '', type: 'PRIMARY' })

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN', { dateStyle: 'long' }) : '' }

async function loadVisit() {
  const { data } = await api.get(`/emr/visits/${route.params.visitId}`)
  visit.value = data.data
  if (data.data.soapNote) Object.assign(soap.value, data.data.soapNote)
}

async function saveVitals() {
  savingVitals.value = true
  await api.post(`/emr/visits/${route.params.visitId}/vitals`, vitals.value)
  await loadVisit()
  savingVitals.value = false
}

async function saveSoap() {
  savingSoap.value = true
  await api.put(`/emr/visits/${route.params.visitId}/soap`, soap.value)
  savingSoap.value = false
}

async function addDiagnosis() {
  await api.post(`/emr/visits/${route.params.visitId}/diagnoses`, diagForm.value)
  diagForm.value = { name: '', icdCode: '', type: 'PRIMARY' }
  showDiagForm.value = false
  loadVisit()
}

async function completeVisit() {
  await api.patch(`/emr/visits/${route.params.visitId}/complete`)
  loadVisit()
}

onMounted(loadVisit)
</script>
