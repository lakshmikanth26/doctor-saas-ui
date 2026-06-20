<template>
  <div v-if="patient">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <RouterLink to="/patients" class="text-slate-400 hover:text-slate-500">←</RouterLink>
        <div>
          <h1 class="page-title">{{ patient.firstName }} {{ patient.lastName }}</h1>
          <p class="text-slate-500 text-sm">{{ patient.mrn }} · {{ patient.gender }} · {{ age }}</p>
        </div>
      </div>
      <div class="flex gap-3">
        <RouterLink :to="`/appointments/new?patientId=${patient.id}`" class="btn-primary">+ Appointment</RouterLink>
        <RouterLink :to="`/patients/${patient.id}/edit`" class="btn-secondary">Edit</RouterLink>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
      <button v-for="t in tabs" :key="t" @click="tab = t"
        class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
        :class="tab === t ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'">
        {{ t }}
      </button>
    </div>

    <!-- Overview -->
    <div v-if="tab === 'Overview'" class="grid lg:grid-cols-3 gap-4">
      <div class="card col-span-1">
        <h3 class="font-semibold mb-3">Personal Info</h3>
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between"><dt class="text-slate-500">Phone</dt><dd>{{ patient.phone || '—' }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Email</dt><dd>{{ patient.email || '—' }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Blood Group</dt><dd class="font-semibold text-red-600">{{ patient.bloodGroup || '—' }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Address</dt><dd>{{ patient.address || '—' }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Emergency</dt><dd>{{ patient.emergencyContact || '—' }}</dd></div>
        </dl>
      </div>
      <div class="card col-span-2">
        <h3 class="font-semibold mb-3">Recent Appointments</h3>
        <div class="text-sm text-slate-400" v-if="!timeline.length">No records yet</div>
        <div v-else class="space-y-2">
          <div v-for="item in timeline.slice(0,5)" :key="item.id" class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
            <div class="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></div>
            <div>
              <p class="text-sm font-medium">{{ item.type }}: {{ item.title || item.status }}</p>
              <p class="text-xs text-slate-400">{{ new Date(item.date).toLocaleDateString('en-IN') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visits Timeline -->
    <div v-if="tab === 'Visits'" class="space-y-4">
      <div v-if="!timeline.length" class="card text-center text-slate-400 py-10">No visits yet</div>
      <RouterLink v-for="v in timeline.filter(t => t.type === 'VISIT')" :key="v.id"
        :to="`/visits/${v.id}`"
        class="card block hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">{{ new Date(v.date).toLocaleDateString('en-IN', { dateStyle: 'long' }) }}</p>
            <p class="text-sm text-slate-500">{{ v.doctor || 'Unknown doctor' }}</p>
          </div>
          <span :class="v.status === 'COMPLETED' ? 'badge-green' : 'badge-blue'">{{ v.status }}</span>
        </div>
      </RouterLink>
    </div>

    <!-- Allergies -->
    <div v-if="tab === 'Allergies'" class="card">
      <p class="text-slate-400 text-sm text-center py-8" v-if="!patient.allergies?.length">No allergies recorded</p>
      <div v-else class="space-y-2">
        <div v-for="a in patient.allergies" :key="a.id" class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div>
            <p class="font-medium text-red-800">{{ a.allergen }}</p>
            <p class="text-sm text-red-600">{{ a.reaction }} · {{ a.severity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20 text-slate-400">Loading…</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/lib/api'

const route = useRoute()
const patient = ref(null)
const timeline = ref([])
const tab = ref('Overview')
const tabs = ['Overview', 'Visits', 'Allergies']

const age = computed(() => {
  if (!patient.value?.dateOfBirth) return 'Unknown age'
  return Math.floor((Date.now() - new Date(patient.value.dateOfBirth)) / (365.25 * 24 * 3600 * 1000)) + ' yrs'
})

onMounted(async () => {
  const [pRes, tRes] = await Promise.allSettled([
    api.get(`/patients/${route.params.id}`),
    api.get(`/patients/${route.params.id}/timeline`),
  ])
  if (pRes.status === 'fulfilled') patient.value = pRes.value.data.data
  if (tRes.status === 'fulfilled') timeline.value = tRes.value.data.data
})
</script>
