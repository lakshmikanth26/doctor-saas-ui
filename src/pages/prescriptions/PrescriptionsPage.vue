<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Prescriptions</h1>
      <button @click="showForm = true" class="btn-primary">+ New Prescription</button>
    </div>

    <div class="table-container">
      <table>
        <thead><tr><th>Rx ID</th><th>Patient</th><th>Doctor</th><th>Medications</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="loading"><td colspan="7" class="text-center py-10 text-slate-400">Loading…</td></tr>
          <tr v-else-if="!prescriptions.length"><td colspan="7" class="text-center py-10 text-slate-400">No prescriptions</td></tr>
          <tr v-for="rx in prescriptions" :key="rx.id">
            <td class="font-mono text-xs font-medium text-blue-700">#{{ rx.id.slice(-8) }}</td>
            <td>{{ rx.patient?.firstName }} {{ rx.patient?.lastName }}<p class="text-xs text-slate-400">{{ rx.patient?.mrn }}</p></td>
            <td class="text-sm">Dr. {{ rx.provider?.firstName }} {{ rx.provider?.lastName }}</td>
            <td>
              <div class="flex flex-wrap gap-1">
                <span v-for="item in rx.items?.slice(0,2)" :key="item.id" class="badge-blue">{{ item.drugName }}</span>
                <span v-if="rx.items?.length > 2" class="badge-gray">+{{ rx.items.length - 2 }}</span>
              </div>
            </td>
            <td>{{ fmtDate(rx.createdAt) }}</td>
            <td><span :class="rxBadge(rx.status)">{{ rx.status }}</span></td>
            <td>
              <button @click="viewRx(rx)" class="btn btn-secondary btn-sm">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :page="page" :pages="pages" :total="total" @change="p => { page = p; load() }" />

    <!-- View Modal -->
    <Modal :show="!!selectedRx" :title="`Prescription #${selectedRx?.id?.slice(-8)}`" @close="selectedRx = null" size="lg">
      <div v-if="selectedRx" class="space-y-3">
        <div class="flex justify-between text-sm">
          <div><p class="text-slate-500">Patient</p><p class="font-semibold">{{ selectedRx.patient?.firstName }} {{ selectedRx.patient?.lastName }}</p></div>
          <div><p class="text-slate-500">Date</p><p class="font-semibold">{{ fmtDate(selectedRx.createdAt) }}</p></div>
          <div><p class="text-slate-500">Status</p><span :class="rxBadge(selectedRx.status)">{{ selectedRx.status }}</span></div>
        </div>
        <table class="min-w-full text-sm mt-3">
          <thead class="bg-gray-50"><tr><th class="px-3 py-2 text-left">Drug</th><th class="px-3 py-2">Dosage</th><th class="px-3 py-2">Frequency</th><th class="px-3 py-2">Duration</th><th class="px-3 py-2">Instructions</th></tr></thead>
          <tbody>
            <tr v-for="item in selectedRx.items" :key="item.id" class="border-t">
              <td class="px-3 py-2 font-medium">{{ item.drugName }}</td>
              <td class="px-3 py-2 text-center">{{ item.dosage }}</td>
              <td class="px-3 py-2 text-center">{{ item.frequency }}</td>
              <td class="px-3 py-2 text-center">{{ item.durationDays }}d</td>
              <td class="px-3 py-2 text-slate-500">{{ item.instructions || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import Modal from '@/components/Modal.vue'
import Pagination from '@/components/Pagination.vue'

const prescriptions = ref([])
const loading = ref(false); const page = ref(1); const pages = ref(1); const total = ref(0)
const showForm = ref(false); const selectedRx = ref(null)

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN') : '—' }
function rxBadge(s) { return { ACTIVE: 'badge-green', DISPENSED: 'badge-blue', EXPIRED: 'badge-gray', CANCELLED: 'badge-red' }[s] || 'badge-gray' }
function viewRx(rx) { selectedRx.value = rx }

async function load() {
  loading.value = true
  const { data } = await api.get('/prescriptions', { params: { page: page.value, limit: 20 } })
  prescriptions.value = data.data.prescriptions; pages.value = data.data.pages; total.value = data.data.total
  loading.value = false
}

onMounted(load)
</script>
