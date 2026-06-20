<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Patients</h1>
      <RouterLink to="/patients/new" class="btn-primary">+ Add Patient</RouterLink>
    </div>

    <div class="card mb-4">
      <input v-model="search" class="input max-w-sm" placeholder="Search by name, MRN, phone…" @input="debounceSearch" />
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Patient</th><th>MRN</th><th>Age / Gender</th><th>Phone</th><th>Blood Group</th><th>Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="loading"><td colspan="6" class="text-center py-10 text-slate-400">Loading…</td></tr>
          <tr v-else-if="patients.length === 0"><td colspan="6" class="text-center py-10 text-slate-400">No patients found</td></tr>
          <tr v-for="p in patients" :key="p.id">
            <td>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {{ p.firstName[0] }}{{ p.lastName[0] }}
                </div>
                <div>
                  <p class="font-medium">{{ p.firstName }} {{ p.lastName }}</p>
                  <p class="text-xs text-slate-400">{{ p.email || '—' }}</p>
                </div>
              </div>
            </td>
            <td class="font-mono text-xs">{{ p.mrn }}</td>
            <td>{{ p.dateOfBirth ? age(p.dateOfBirth) : '—' }} / {{ p.gender || '—' }}</td>
            <td>{{ p.phone || '—' }}</td>
            <td><span class="badge-red" v-if="p.bloodGroup">{{ p.bloodGroup }}</span><span v-else>—</span></td>
            <td>
              <div class="flex gap-2">
                <RouterLink :to="`/patients/${p.id}`" class="btn btn-secondary btn-sm">View</RouterLink>
                <RouterLink :to="`/patients/${p.id}/edit`" class="btn btn-secondary btn-sm">Edit</RouterLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :page="page" :pages="pages" :total="total" @change="loadPage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import Pagination from '@/components/Pagination.vue'

const patients = ref([])
const search = ref('')
const page = ref(1)
const pages = ref(1)
const total = ref(0)
const loading = ref(false)
let timer = null

function age(dob) {
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000))
}

async function load() {
  loading.value = true
  const { data } = await api.get('/patients', { params: { search: search.value, page: page.value, limit: 20 } })
  patients.value = data.data.patients
  pages.value = data.data.pages
  total.value = data.data.total
  loading.value = false
}

function debounceSearch() {
  clearTimeout(timer)
  timer = setTimeout(() => { page.value = 1; load() }, 400)
}

function loadPage(p) { page.value = p; load() }

onMounted(load)
</script>
