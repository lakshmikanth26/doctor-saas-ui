<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">CRM Pipeline</h1>
      <button @click="showForm = true" class="btn-primary">+ New Lead</button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard :icon="DocumentTextIcon"  label="Total Leads"   :value="stats.totalLeads || 0" iconBg="background:rgba(59,130,246,0.15)"  iconColor="color:#60a5fa" />
      <StatCard :icon="CurrencyDollarIcon" label="Pipeline ARR" :value="`₹${stats.totalARR || 0}`"  iconBg="background:rgba(16,185,129,0.15)" iconColor="color:#34d399" />
      <StatCard :icon="CheckCircleIcon"   label="Won"          :value="stats.byStatus?.WON || 0"     iconBg="background:rgba(16,185,129,0.15)" iconColor="color:#34d399" />
      <StatCard :icon="BoltIcon"          label="Active"       :value="(stats.byStatus?.CONTACTED || 0) + (stats.byStatus?.DEMO || 0)" iconBg="background:rgba(245,158,11,0.15)" iconColor="color:#fbbf24" />
    </div>

    <!-- Pipeline Columns -->
    <div class="flex gap-4 overflow-x-auto pb-4">
      <div v-for="stage in stages" :key="stage.key" class="shrink-0 w-72">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-sm text-slate-300">{{ stage.label }}</h3>
          <span class="badge-blue">{{ leadsByStage(stage.key).length }}</span>
        </div>
        <div class="space-y-2">
          <div v-for="lead in leadsByStage(stage.key)" :key="lead.id"
            class="card hover:shadow-md transition-shadow cursor-pointer"
            @click="openLead(lead)">
            <p class="font-medium text-sm">{{ lead.clinicName || lead.contactName }}</p>
            <p class="text-xs text-slate-400 mt-1">{{ lead.contactName }} · {{ lead.phone }}</p>
            <div class="flex justify-between items-center mt-2">
              <span class="badge-green text-xs" v-if="lead.arr">₹{{ lead.arr }}/yr</span>
              <span class="badge-blue text-xs">{{ lead.source }}</span>
            </div>
          </div>
          <div v-if="!leadsByStage(stage.key).length" class="text-center py-4 text-gray-300 text-xs border-2 border-dashed rounded-xl">
            Drop leads here
          </div>
        </div>
      </div>
    </div>

    <!-- Lead Detail Modal -->
    <Modal :show="!!selectedLead" :title="selectedLead?.clinicName || 'Lead'" @close="selectedLead = null" size="lg">
      <div v-if="selectedLead" class="space-y-4">
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div><p class="text-slate-500">Contact</p><p class="font-medium">{{ selectedLead.contactName }}</p></div>
          <div><p class="text-slate-500">Phone</p><p class="font-medium">{{ selectedLead.phone || '—' }}</p></div>
          <div><p class="text-slate-500">Email</p><p class="font-medium">{{ selectedLead.email || '—' }}</p></div>
          <div><p class="text-slate-500">City</p><p class="font-medium">{{ selectedLead.city || '—' }}</p></div>
          <div><p class="text-slate-500">ARR</p><p class="font-semibold text-green-600">₹{{ selectedLead.arr || 0 }}/yr</p></div>
          <div><p class="text-slate-500">Status</p><span :class="stageBadge(selectedLead.status)">{{ selectedLead.status }}</span></div>
        </div>

        <div>
          <label class="label">Move to Stage</label>
          <div class="flex gap-2 flex-wrap mt-1">
            <button v-for="s in stages" :key="s.key" @click="moveStage(s.key)"
              class="btn btn-secondary btn-sm"
              :class="selectedLead.status === s.key ? 'bg-blue-100 border-blue-300 text-blue-700' : ''">
              {{ s.label }}
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-sm">Activities</h4>
          </div>
          <div v-if="!selectedLead.activities?.length" class="text-slate-400 text-sm text-center py-3">No activities</div>
          <div v-else class="space-y-2">
            <div v-for="a in selectedLead.activities" :key="a.id" class="text-sm p-2 bg-gray-50 rounded-lg">
              <div class="flex justify-between">
                <span class="font-medium">{{ a.type }}: {{ a.title }}</span>
                <span class="text-slate-400">{{ fmtDate(a.createdAt) }}</span>
              </div>
              <p class="text-slate-500 text-xs mt-1">{{ a.notes }}</p>
            </div>
          </div>
          <div class="mt-3 flex gap-2">
            <input v-model="activityNote" class="input flex-1 text-sm" placeholder="Log activity note…" />
            <button @click="logActivity" class="btn-primary btn-sm">Log</button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- New Lead Modal -->
    <Modal :show="showForm" title="New Lead" @close="showForm = false">
      <div class="space-y-3">
        <div><label class="label">Clinic Name</label><input v-model="form.clinicName" class="input" /></div>
        <div><label class="label">Contact Name *</label><input v-model="form.contactName" class="input" required /></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="label">Phone</label><input v-model="form.phone" class="input" /></div>
          <div><label class="label">Email</label><input v-model="form.email" type="email" class="input" /></div>
        </div>
        <div><label class="label">City</label><input v-model="form.city" class="input" /></div>
        <div><label class="label">ARR (₹/year)</label><input v-model="form.arr" class="input" type="number" /></div>
        <div><label class="label">Source</label>
          <select v-model="form.source" class="input">
            <option value="REFERRAL">Referral</option><option value="WEBSITE">Website</option>
            <option value="LINKEDIN">LinkedIn</option><option value="COLD_OUTREACH">Cold Outreach</option><option value="OTHER">Other</option>
          </select>
        </div>
        <div><label class="label">Notes</label><textarea v-model="form.notes" class="input" rows="2" /></div>
      </div>
      <template #footer>
        <button @click="showForm = false" class="btn-secondary">Cancel</button>
        <button @click="createLead" class="btn-primary">Create Lead</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import StatCard from '@/components/StatCard.vue'
import Modal from '@/components/Modal.vue'
import { DocumentTextIcon, CurrencyDollarIcon, CheckCircleIcon, BoltIcon } from '@heroicons/vue/24/outline'

const leads = ref([]); const stats = ref({}); const showForm = ref(false); const selectedLead = ref(null)
const activityNote = ref('')
const stages = [
  { key: 'NEW', label: 'New' }, { key: 'CONTACTED', label: 'Contacted' }, { key: 'DEMO', label: 'Demo' },
  { key: 'PROPOSAL', label: 'Proposal' }, { key: 'NEGOTIATION', label: 'Negotiation' },
  { key: 'WON', label: 'Won' }, { key: 'LOST', label: 'Lost' },
]
const form = ref({ clinicName: '', contactName: '', phone: '', email: '', city: '', arr: '', source: 'REFERRAL', notes: '' })

function leadsByStage(stage) { return leads.value.filter(l => l.status === stage) }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN') : '' }
function stageBadge(s) { return { WON: 'badge-green', LOST: 'badge-red', NEW: 'badge-gray' }[s] || 'badge-blue' }

async function load() {
  const [leadsRes, statsRes] = await Promise.allSettled([api.get('/crm?limit=100'), api.get('/crm/stats')])
  if (leadsRes.status === 'fulfilled') leads.value = leadsRes.value.data.data.leads
  if (statsRes.status === 'fulfilled') stats.value = statsRes.value.data.data
}
function openLead(lead) { selectedLead.value = lead }
async function moveStage(status) {
  await api.put(`/crm/${selectedLead.value.id}`, { status })
  selectedLead.value = { ...selectedLead.value, status }; load()
}
async function logActivity() {
  if (!activityNote.value.trim()) return
  await api.post(`/crm/${selectedLead.value.id}/activities`, { type: 'NOTE', title: 'Note', notes: activityNote.value })
  activityNote.value = ''; load()
}
async function createLead() {
  await api.post('/crm', form.value)
  showForm.value = false; load()
  form.value = { clinicName: '', contactName: '', phone: '', email: '', city: '', arr: '', source: 'REFERRAL', notes: '' }
}
onMounted(load)
</script>
