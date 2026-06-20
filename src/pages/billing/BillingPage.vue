<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Billing</h1>
      <RouterLink to="/billing/new" class="btn-primary">+ New Invoice</RouterLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard :icon="CurrencyDollarIcon" label="Total Revenue" :value="`₹${stats.totalRevenue || 0}`" iconBg="background:rgba(16,185,129,0.15)" iconColor="color:#34d399" />
      <StatCard :icon="DocumentTextIcon"  label="Total Invoices" :value="stats.totalInvoices || 0"          iconBg="background:rgba(59,130,246,0.15)"  iconColor="color:#60a5fa" />
      <StatCard :icon="ClockIcon"         label="Pending"        :value="stats.pendingInvoices || 0"        iconBg="background:rgba(245,158,11,0.15)" iconColor="color:#fbbf24" />
      <StatCard :icon="ExclamationCircleIcon" label="Overdue"   :value="stats.overdueInvoices || 0"        iconBg="background:rgba(239,68,68,0.15)"  iconColor="color:#f87171" />
    </div>

    <div class="card mb-4 flex flex-wrap gap-3 items-center">
      <select v-model="filters.status" class="input w-40" @change="load">
        <option value="">All Status</option>
        <option value="DRAFT">Draft</option>
        <option value="SENT">Sent</option>
        <option value="PARTIAL">Partial</option>
        <option value="PAID">Paid</option>
        <option value="OVERDUE">Overdue</option>
      </select>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Amount</th><th>Paid</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="loading"><td colspan="7" class="text-center py-10 text-slate-400">Loading…</td></tr>
          <tr v-else-if="!invoices.length"><td colspan="7" class="text-center py-10 text-slate-400">No invoices</td></tr>
          <tr v-for="inv in invoices" :key="inv.id">
            <td class="font-mono text-sm font-medium text-blue-700">{{ inv.invoiceNumber }}</td>
            <td>{{ inv.patient?.firstName }} {{ inv.patient?.lastName }}</td>
            <td>{{ fmtDate(inv.createdAt) }}</td>
            <td class="font-semibold">₹{{ inv.totalAmount }}</td>
            <td class="text-green-600">₹{{ inv.paidAmount || 0 }}</td>
            <td><span :class="invBadge(inv.status)">{{ inv.status }}</span></td>
            <td>
              <RouterLink :to="`/billing/${inv.id}`" class="btn btn-secondary btn-sm">View</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :page="page" :pages="pages" :total="total" @change="p => { page = p; load() }" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import StatCard from '@/components/StatCard.vue'
import Pagination from '@/components/Pagination.vue'
import { CurrencyDollarIcon, DocumentTextIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const invoices = ref([])
const stats = ref({})
const loading = ref(false)
const page = ref(1); const pages = ref(1); const total = ref(0)
const filters = ref({ status: '' })

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN') : '—' }
function invBadge(s) { return { DRAFT: 'badge-gray', SENT: 'badge-blue', PARTIAL: 'badge-yellow', PAID: 'badge-green', OVERDUE: 'badge-red' }[s] || 'badge-gray' }

async function load() {
  loading.value = true
  const { data } = await api.get('/billing', { params: { ...filters.value, page: page.value, limit: 20 } })
  invoices.value = data.data.invoices; pages.value = data.data.pages; total.value = data.data.total
  loading.value = false
}

onMounted(async () => {
  const [statsRes] = await Promise.allSettled([api.get('/billing/stats')])
  if (statsRes.status === 'fulfilled') stats.value = statsRes.value.data.data
  load()
})
</script>
