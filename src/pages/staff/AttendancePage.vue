<template>
  <div>
    <div class="page-header">
      <div class="flex items-center gap-3">
        <RouterLink to="/staff" class="text-slate-400 hover:text-slate-500">←</RouterLink>
        <h1 class="page-title">Attendance</h1>
      </div>
      <button @click="showForm = true" class="btn-primary">Record Attendance</button>
    </div>

    <div class="card mb-4 flex gap-3 items-center">
      <input v-model="filters.from" type="date" class="input w-40" @change="load" />
      <span class="text-slate-400">to</span>
      <input v-model="filters.to" type="date" class="input w-40" @change="load" />
    </div>

    <div class="table-container">
      <table>
        <thead><tr><th>Staff</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Method</th><th>Notes</th></tr></thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="!records.length"><td colspan="6" class="text-center py-10 text-slate-400">No records</td></tr>
          <tr v-for="r in records" :key="r.id">
            <td>{{ r.user?.firstName }} {{ r.user?.lastName }}</td>
            <td>{{ fmtDate(r.date) }}</td>
            <td class="text-green-600">{{ r.checkIn ? new Date(r.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—' }}</td>
            <td class="text-orange-600">{{ r.checkOut ? new Date(r.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—' }}</td>
            <td><span class="badge-gray">{{ r.method }}</span></td>
            <td class="text-slate-400">{{ r.notes || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :show="showForm" title="Record Attendance" @close="showForm = false">
      <div class="space-y-3">
        <div><label class="label">Date *</label><input v-model="form.date" type="date" class="input" required /></div>
        <div><label class="label">Branch ID</label><input v-model="form.branchId" class="input" placeholder="Branch UUID" /></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="label">Check In</label><input v-model="form.checkIn" type="time" class="input" /></div>
          <div><label class="label">Check Out</label><input v-model="form.checkOut" type="time" class="input" /></div>
        </div>
        <div><label class="label">Method</label>
          <select v-model="form.method" class="input">
            <option value="MANUAL">Manual</option><option value="BIOMETRIC">Biometric</option>
          </select>
        </div>
        <div><label class="label">Notes</label><input v-model="form.notes" class="input" /></div>
      </div>
      <template #footer>
        <button @click="showForm = false" class="btn-secondary">Cancel</button>
        <button @click="submit" class="btn-primary">Save</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import Modal from '@/components/Modal.vue'

const records = ref([]); const showForm = ref(false)
const today = new Date().toISOString().split('T')[0]
const filters = ref({ from: today, to: today })
const form = ref({ date: today, branchId: '', checkIn: '', checkOut: '', method: 'MANUAL', notes: '' })

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN') : '—' }

async function load() {
  const { data } = await api.get('/staff/attendance', { params: filters.value })
  records.value = data.data.records
}
async function submit() {
  const payload = { ...form.value, checkIn: form.value.checkIn ? `${form.value.date}T${form.value.checkIn}` : undefined, checkOut: form.value.checkOut ? `${form.value.date}T${form.value.checkOut}` : undefined }
  await api.post('/staff/attendance', payload)
  showForm.value = false; load()
}
onMounted(load)
</script>
