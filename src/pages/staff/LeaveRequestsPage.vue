<template>
  <div>
    <div class="page-header">
      <div class="flex items-center gap-3">
        <RouterLink to="/staff" class="text-slate-400 hover:text-slate-500">←</RouterLink>
        <h1 class="page-title">Leave Requests</h1>
      </div>
      <button @click="showForm = true" class="btn-primary">+ Request Leave</button>
    </div>

    <div class="table-container">
      <table>
        <thead><tr><th>Staff</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="!leaves.length"><td colspan="8" class="text-center py-10 text-slate-400">No leave requests</td></tr>
          <tr v-for="l in leaves" :key="l.id">
            <td>{{ l.user?.firstName }} {{ l.user?.lastName }}</td>
            <td><span class="badge-blue">{{ l.type }}</span></td>
            <td>{{ fmtDate(l.startDate) }}</td>
            <td>{{ fmtDate(l.endDate) }}</td>
            <td>{{ daysBetween(l.startDate, l.endDate) }}</td>
            <td class="max-w-xs truncate text-sm text-slate-500">{{ l.reason }}</td>
            <td><span :class="leaveBadge(l.status)">{{ l.status }}</span></td>
            <td>
              <div v-if="l.status === 'PENDING'" class="flex gap-1">
                <button @click="updateLeave(l.id, 'APPROVED')" class="btn btn-primary btn-sm">✓</button>
                <button @click="updateLeave(l.id, 'REJECTED')" class="btn btn-danger btn-sm">✗</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :show="showForm" title="Request Leave" @close="showForm = false">
      <div class="space-y-3">
        <div><label class="label">Type</label>
          <select v-model="form.type" class="input">
            <option value="SICK">Sick Leave</option><option value="CASUAL">Casual</option>
            <option value="ANNUAL">Annual</option><option value="MATERNITY">Maternity</option><option value="OTHER">Other</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="label">From *</label><input v-model="form.startDate" type="date" class="input" required /></div>
          <div><label class="label">To *</label><input v-model="form.endDate" type="date" class="input" required /></div>
        </div>
        <div><label class="label">Reason</label><textarea v-model="form.reason" class="input" rows="2" /></div>
      </div>
      <template #footer>
        <button @click="showForm = false" class="btn-secondary">Cancel</button>
        <button @click="submitLeave" class="btn-primary">Submit</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import Modal from '@/components/Modal.vue'

const leaves = ref([]); const showForm = ref(false)
const form = ref({ type: 'SICK', startDate: '', endDate: '', reason: '' })

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN') : '—' }
function daysBetween(a, b) { return Math.ceil((new Date(b) - new Date(a)) / 86400000) + 1 }
function leaveBadge(s) { return { PENDING: 'badge-yellow', APPROVED: 'badge-green', REJECTED: 'badge-red' }[s] || 'badge-gray' }

async function load() {
  const { data } = await api.get('/staff/leave/requests')
  leaves.value = data.data.leaves
}
async function submitLeave() {
  await api.post('/staff/leave/requests', form.value)
  showForm.value = false; load()
}
async function updateLeave(id, status) {
  await api.patch(`/staff/leave/requests/${id}/status`, { status })
  load()
}
onMounted(load)
</script>
