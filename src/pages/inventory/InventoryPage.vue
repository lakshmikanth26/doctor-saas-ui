<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Inventory</h1>
      <button @click="showAddModal = true" class="btn-primary">+ Add Item</button>
    </div>

    <div v-if="lowStock.length" class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
      <p class="text-sm font-semibold text-orange-800 mb-2">⚠️ Low Stock Alert ({{ lowStock.length }} items)</p>
      <div class="flex flex-wrap gap-2">
        <span v-for="item in lowStock" :key="item.id" class="badge-yellow">{{ item.name }} ({{ item.quantity }} left)</span>
      </div>
    </div>

    <div class="card mb-4 flex gap-3">
      <input v-model="search" class="input max-w-sm" placeholder="Search items…" @input="debounce" />
      <select v-model="category" class="input w-40" @change="load">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div class="table-container">
      <table>
        <thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Qty</th><th>Unit</th><th>Reorder Level</th><th>Actions</th></tr></thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="loading"><td colspan="7" class="text-center py-10 text-slate-400">Loading…</td></tr>
          <tr v-else-if="!items.length"><td colspan="7" class="text-center py-10 text-slate-400">No items</td></tr>
          <tr v-for="item in items" :key="item.id">
            <td><p class="font-medium">{{ item.name }}</p><p class="text-xs text-slate-400">{{ item.description }}</p></td>
            <td class="font-mono text-xs">{{ item.sku || '—' }}</td>
            <td><span class="badge-blue">{{ item.category || '—' }}</span></td>
            <td>
              <span :class="item.quantity <= item.reorderLevel ? 'text-red-600 font-bold' : 'text-white'">
                {{ item.quantity }}
              </span>
            </td>
            <td>{{ item.unit }}</td>
            <td>{{ item.reorderLevel }}</td>
            <td>
              <button @click="openAdjust(item)" class="btn btn-secondary btn-sm">Adjust Stock</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :page="page" :pages="pages" :total="total" @change="p => { page = p; load() }" />

    <!-- Add Item Modal -->
    <Modal :show="showAddModal" title="Add Inventory Item" @close="showAddModal = false">
      <div class="space-y-3">
        <div><label class="label">Name *</label><input v-model="itemForm.name" class="input" required /></div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="label">SKU</label><input v-model="itemForm.sku" class="input" /></div>
          <div><label class="label">Category</label><input v-model="itemForm.category" class="input" /></div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div><label class="label">Initial Qty</label><input v-model="itemForm.quantity" class="input" type="number" /></div>
          <div><label class="label">Unit</label><input v-model="itemForm.unit" class="input" placeholder="tabs/ml/units" /></div>
          <div><label class="label">Reorder Level</label><input v-model="itemForm.reorderLevel" class="input" type="number" /></div>
        </div>
        <div><label class="label">Unit Cost (₹)</label><input v-model="itemForm.unitCost" class="input" type="number" /></div>
      </div>
      <template #footer>
        <button @click="showAddModal = false" class="btn-secondary">Cancel</button>
        <button @click="addItem" class="btn-primary">Add Item</button>
      </template>
    </Modal>

    <!-- Adjust Modal -->
    <Modal :show="showAdjustModal" :title="`Adjust Stock: ${adjustItem?.name}`" @close="showAdjustModal = false">
      <div class="space-y-3">
        <div class="flex gap-3">
          <button @click="adjustForm.type = 'IN'" class="flex-1 py-2 rounded-lg border text-sm font-medium" :class="adjustForm.type === 'IN' ? 'bg-green-600 text-white border-green-600' : 'border-white/5'">📥 Stock In</button>
          <button @click="adjustForm.type = 'OUT'" class="flex-1 py-2 rounded-lg border text-sm font-medium" :class="adjustForm.type === 'OUT' ? 'bg-red-600 text-white border-red-600' : 'border-white/5'">📤 Stock Out</button>
        </div>
        <div><label class="label">Quantity</label><input v-model="adjustForm.quantity" class="input" type="number" min="1" /></div>
        <div><label class="label">Reason</label><input v-model="adjustForm.reason" class="input" placeholder="Purchase, dispensed, expired…" /></div>
        <div><label class="label">Unit Cost (₹)</label><input v-model="adjustForm.unitCost" class="input" type="number" /></div>
      </div>
      <template #footer>
        <button @click="showAdjustModal = false" class="btn-secondary">Cancel</button>
        <button @click="saveAdjust" class="btn-primary">Confirm</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import Modal from '@/components/Modal.vue'
import Pagination from '@/components/Pagination.vue'

const items = ref([]); const lowStock = ref([])
const loading = ref(false)
const search = ref(''); const category = ref('')
const page = ref(1); const pages = ref(1); const total = ref(0)
const categories = ['MEDICINE', 'EQUIPMENT', 'CONSUMABLE', 'VACCINE', 'OTHER']
const showAddModal = ref(false); const showAdjustModal = ref(false)
const adjustItem = ref(null)
const itemForm = ref({ name: '', sku: '', category: '', quantity: 0, unit: 'units', reorderLevel: 10, unitCost: '' })
const adjustForm = ref({ type: 'IN', quantity: 1, reason: '', unitCost: '' })
let timer

async function load() {
  loading.value = true
  const { data } = await api.get('/inventory', { params: { search: search.value, category: category.value, page: page.value, limit: 20 } })
  items.value = data.data.items; pages.value = data.data.pages; total.value = data.data.total
  loading.value = false
}
function debounce() { clearTimeout(timer); timer = setTimeout(() => { page.value = 1; load() }, 400) }
function openAdjust(item) { adjustItem.value = item; adjustForm.value = { type: 'IN', quantity: 1, reason: '', unitCost: '' }; showAdjustModal.value = true }

async function addItem() {
  await api.post('/inventory', itemForm.value)
  showAddModal.value = false; load()
  itemForm.value = { name: '', sku: '', category: '', quantity: 0, unit: 'units', reorderLevel: 10, unitCost: '' }
}

async function saveAdjust() {
  await api.post(`/inventory/${adjustItem.value.id}/adjust`, adjustForm.value)
  showAdjustModal.value = false; load()
}

onMounted(async () => {
  const { data } = await api.get('/inventory/low-stock').catch(() => ({ data: { data: [] } }))
  lowStock.value = data.data
  load()
})
</script>
