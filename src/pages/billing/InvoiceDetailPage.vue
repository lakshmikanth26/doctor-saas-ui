<template>
  <div v-if="invoice" class="max-w-3xl mx-auto">
    <div class="page-header">
      <div class="flex items-center gap-3">
        <RouterLink to="/billing" class="text-slate-400 hover:text-slate-500">←</RouterLink>
        <div>
          <h1 class="page-title">{{ invoice.invoiceNumber }}</h1>
          <p class="text-slate-500 text-sm">{{ invoice.patient?.firstName }} {{ invoice.patient?.lastName }}</p>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <span :class="badge(invoice.status)">{{ invoice.status }}</span>
        <button v-if="invoice.status !== 'PAID'" @click="showPayModal = true" class="btn-primary btn-sm">💳 Record Payment</button>
      </div>
    </div>

    <div class="card mb-4">
      <div class="flex justify-between text-sm mb-4">
        <div><p class="text-slate-500">Patient</p><p class="font-semibold">{{ invoice.patient?.firstName }} {{ invoice.patient?.lastName }}</p></div>
        <div><p class="text-slate-500">Date</p><p class="font-semibold">{{ fmtDate(invoice.createdAt) }}</p></div>
        <div><p class="text-slate-500">Due Date</p><p class="font-semibold">{{ fmtDate(invoice.dueDate) }}</p></div>
      </div>

      <table class="min-w-full text-sm">
        <thead class="bg-gray-50"><tr><th class="text-left px-3 py-2">Description</th><th class="text-right px-3 py-2">Qty</th><th class="text-right px-3 py-2">Unit Price</th><th class="text-right px-3 py-2">Total</th></tr></thead>
        <tbody>
          <tr v-for="item in invoice.items" :key="item.id" class="border-t">
            <td class="px-3 py-2">{{ item.description }}</td>
            <td class="px-3 py-2 text-right">{{ item.quantity }}</td>
            <td class="px-3 py-2 text-right">₹{{ item.unitPrice }}</td>
            <td class="px-3 py-2 text-right font-medium">₹{{ item.lineTotal }}</td>
          </tr>
        </tbody>
        <tfoot class="border-t-2 font-semibold">
          <tr><td colspan="3" class="px-3 py-2 text-right">Subtotal</td><td class="px-3 py-2 text-right">₹{{ invoice.subtotal }}</td></tr>
          <tr v-if="invoice.discount"><td colspan="3" class="px-3 py-2 text-right text-slate-500">Discount</td><td class="px-3 py-2 text-right text-red-600">-₹{{ invoice.discount }}</td></tr>
          <tr v-if="invoice.tax"><td colspan="3" class="px-3 py-2 text-right text-slate-500">Tax</td><td class="px-3 py-2 text-right">₹{{ invoice.tax }}</td></tr>
          <tr class="text-lg"><td colspan="3" class="px-3 py-2 text-right">Total</td><td class="px-3 py-2 text-right text-blue-700">₹{{ invoice.totalAmount }}</td></tr>
          <tr class="text-green-600"><td colspan="3" class="px-3 py-2 text-right">Paid</td><td class="px-3 py-2 text-right">₹{{ invoice.paidAmount || 0 }}</td></tr>
          <tr class="text-orange-600 font-bold"><td colspan="3" class="px-3 py-2 text-right">Balance Due</td><td class="px-3 py-2 text-right">₹{{ (invoice.totalAmount - (invoice.paidAmount || 0)) }}</td></tr>
        </tfoot>
      </table>
    </div>

    <!-- Payment history -->
    <div class="card" v-if="invoice.payments?.length">
      <h3 class="font-semibold mb-3">Payment History</h3>
      <div class="space-y-2">
        <div v-for="p in invoice.payments" :key="p.id" class="flex items-center justify-between p-2 bg-green-50 rounded-lg text-sm">
          <div>
            <p class="font-medium">₹{{ p.amount }} — {{ p.method }}</p>
            <p class="text-xs text-slate-400">{{ fmtDate(p.paidAt) }} · Ref: {{ p.reference || '—' }}</p>
          </div>
          <span class="badge-green">Paid</span>
        </div>
      </div>
    </div>

    <Modal :show="showPayModal" title="Record Payment" @close="showPayModal = false">
      <div class="space-y-3">
        <div><label class="label">Amount (₹) *</label><input v-model="payForm.amount" type="number" class="input" :max="invoice.totalAmount - (invoice.paidAmount || 0)" required /></div>
        <div><label class="label">Payment Method</label>
          <select v-model="payForm.method" class="input">
            <option value="CASH">Cash</option><option value="UPI">UPI</option><option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option><option value="INSURANCE">Insurance</option>
          </select>
        </div>
        <div><label class="label">Reference</label><input v-model="payForm.reference" class="input" placeholder="Transaction ID, receipt no…" /></div>
        <div><label class="label">Notes</label><input v-model="payForm.notes" class="input" /></div>
      </div>
      <template #footer>
        <button @click="showPayModal = false" class="btn-secondary">Cancel</button>
        <button @click="recordPayment" class="btn-primary">Record Payment</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/lib/api'
import Modal from '@/components/Modal.vue'

const route = useRoute()
const invoice = ref(null)
const showPayModal = ref(false)
const payForm = ref({ amount: '', method: 'CASH', reference: '', notes: '' })

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN') : '—' }
function badge(s) { return { DRAFT: 'badge-gray', SENT: 'badge-blue', PARTIAL: 'badge-yellow', PAID: 'badge-green', OVERDUE: 'badge-red' }[s] || 'badge-gray' }

async function load() {
  const { data } = await api.get(`/billing/${route.params.id}`)
  invoice.value = data.data
}

async function recordPayment() {
  await api.post(`/billing/${route.params.id}/payments`, payForm.value)
  showPayModal.value = false
  load()
}

onMounted(load)
</script>
