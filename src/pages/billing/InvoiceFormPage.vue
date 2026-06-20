<template>
  <div class="max-w-2xl mx-auto">
    <div class="page-header">
      <h1 class="page-title">New Invoice</h1>
      <RouterLink to="/billing" class="btn-secondary">← Back</RouterLink>
    </div>
    <form @submit.prevent="submit" class="card space-y-4">
      <div>
        <label class="label">Patient</label>
        <input v-model="patientSearch" class="input" placeholder="Search patient…" @input="searchPatients" />
        <div v-if="results.length" class="mt-1 border rounded-lg divide-y shadow-lg max-h-48 overflow-y-auto">
          <button v-for="p in results" :key="p.id" type="button" @click="selectPatient(p)" class="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm">{{ p.firstName }} {{ p.lastName }} · {{ p.mrn }}</button>
        </div>
      </div>
      <div>
        <label class="label">Due Date</label>
        <input v-model="form.dueDate" type="date" class="input" />
      </div>

      <!-- Line Items -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="label mb-0">Line Items</label>
          <button type="button" @click="addItem" class="btn-secondary btn-sm">+ Item</button>
        </div>
        <div v-for="(item, i) in form.items" :key="i" class="flex gap-2 mb-2">
          <input v-model="item.description" class="input flex-1" placeholder="Description" />
          <input v-model="item.quantity" class="input w-16" type="number" min="1" placeholder="Qty" />
          <input v-model="item.unitPrice" class="input w-24" type="number" placeholder="Price" />
          <button type="button" @click="form.items.splice(i, 1)" class="text-red-400 hover:text-red-600 px-1">×</button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div><label class="label">Discount (₹)</label><input v-model="form.discount" class="input" type="number" /></div>
        <div><label class="label">Tax (₹)</label><input v-model="form.tax" class="input" type="number" /></div>
      </div>
      <div class="bg-gray-50 p-3 rounded-lg text-sm font-semibold flex justify-between">
        <span>Total</span>
        <span class="text-blue-700">₹{{ total }}</span>
      </div>
      <div><label class="label">Notes</label><textarea v-model="form.notes" class="input" rows="2" /></div>

      <p v-if="error" class="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{{ error }}</p>
      <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? 'Creating…' : 'Create Invoice' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/api'

const router = useRouter()
const patientSearch = ref(''); const results = ref([])
const form = ref({ patientId: '', dueDate: '', items: [{ description: '', quantity: 1, unitPrice: '' }], discount: 0, tax: 0, notes: '' })
const loading = ref(false); const error = ref('')
let timer

const total = computed(() => {
  const sub = form.value.items.reduce((s, i) => s + (i.quantity * i.unitPrice || 0), 0)
  return sub - (form.value.discount || 0) + (form.value.tax || 0)
})

async function searchPatients() {
  clearTimeout(timer)
  if (patientSearch.value.length < 2) { results.value = []; return }
  timer = setTimeout(async () => {
    const { data } = await api.get('/patients', { params: { search: patientSearch.value, limit: 5 } })
    results.value = data.data.patients
  }, 300)
}
function selectPatient(p) { form.value.patientId = p.id; patientSearch.value = `${p.firstName} ${p.lastName}`; results.value = [] }
function addItem() { form.value.items.push({ description: '', quantity: 1, unitPrice: '' }) }

async function submit() {
  loading.value = true; error.value = ''
  try {
    await api.post('/billing', form.value)
    router.push('/billing')
  } catch (e) { error.value = e.response?.data?.message || 'Failed' } finally { loading.value = false }
}
</script>
