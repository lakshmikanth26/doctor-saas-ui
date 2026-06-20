<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Staff</h1>
      <div class="flex gap-2">
        <RouterLink to="/staff/leave" class="btn-secondary">Leave Requests</RouterLink>
        <RouterLink to="/staff/attendance" class="btn-secondary">Attendance</RouterLink>
      </div>
    </div>

    <div class="card mb-4 flex gap-3">
      <input v-model="search" class="input max-w-sm" placeholder="Search staff…" @input="debounce" />
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-if="loading" class="col-span-3 text-center py-10 text-slate-400">Loading…</div>
      <div v-else-if="!staff.length" class="col-span-3 text-center py-10 text-slate-400">No staff found</div>
      <RouterLink
        v-for="s in staff" :key="s.id"
        :to="`/staff/${s.id}`"
        class="card hover:shadow-md transition-shadow block"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            {{ s.firstName?.[0] }}{{ s.lastName?.[0] }}
          </div>
          <div>
            <p class="font-semibold">{{ s.firstName }} {{ s.lastName }}</p>
            <p class="text-sm text-slate-500">{{ s.staffProfile?.designation || s.systemRole }}</p>
          </div>
        </div>
        <div class="text-sm space-y-1 text-slate-500">
          <p>📧 {{ s.email }}</p>
          <p v-if="s.staffProfile?.specialization">🏥 {{ s.staffProfile.specialization }}</p>
          <p v-if="s.staffProfile?.licenseNumber">🪪 {{ s.staffProfile.licenseNumber }}</p>
        </div>
        <div class="mt-3 flex gap-1 flex-wrap">
          <span v-for="ub in s.userBranches?.slice(0,2)" :key="ub.branch?.id" class="badge-blue text-xs">{{ ub.branch?.name }}</span>
        </div>
      </RouterLink>
    </div>
    <Pagination :page="page" :pages="pages" :total="total" @change="p => { page = p; load() }" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import Pagination from '@/components/Pagination.vue'

const staff = ref([]); const loading = ref(false)
const search = ref(''); const page = ref(1); const pages = ref(1); const total = ref(0)
let timer

async function load() {
  loading.value = true
  const { data } = await api.get('/staff', { params: { search: search.value, page: page.value, limit: 12 } })
  staff.value = data.data.staff; pages.value = data.data.pages; total.value = data.data.total
  loading.value = false
}
function debounce() { clearTimeout(timer); timer = setTimeout(() => { page.value = 1; load() }, 400) }
onMounted(load)
</script>
