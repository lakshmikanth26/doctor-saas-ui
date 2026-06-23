<template>
  <div class="max-w-2xl mx-auto">
    <div class="page-header">
      <h1 class="page-title">{{ isEdit ? 'Edit Patient' : 'New Patient' }}</h1>
      <RouterLink to="/patients" class="btn-secondary">← Back</RouterLink>
    </div>

    <form @submit.prevent="submit" class="card space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">First Name *</label>
          <input v-model="form.firstName" class="input" :class="{ 'border-red-500': fe.firstName }" required />
          <p v-if="fe.firstName" class="field-error">{{ fe.firstName }}</p>
        </div>
        <div>
          <label class="label">Last Name *</label>
          <input v-model="form.lastName" class="input" :class="{ 'border-red-500': fe.lastName }" required />
          <p v-if="fe.lastName" class="field-error">{{ fe.lastName }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Date of Birth</label>
          <input v-model="form.dateOfBirth" type="date" class="input" :class="{ 'border-red-500': fe.dateOfBirth }" />
          <p v-if="fe.dateOfBirth" class="field-error">{{ fe.dateOfBirth }}</p>
        </div>
        <div>
          <label class="label">Gender</label>
          <select v-model="form.gender" class="input" :class="{ 'border-red-500': fe.gender }">
            <option value="">Select…</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <p v-if="fe.gender" class="field-error">{{ fe.gender }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Phone</label>
          <input v-model="form.phone" class="input" :class="{ 'border-red-500': fe.phone }" />
          <p v-if="fe.phone" class="field-error">{{ fe.phone }}</p>
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="form.email" type="email" class="input" :class="{ 'border-red-500': fe.email }" />
          <p v-if="fe.email" class="field-error">{{ fe.email }}</p>
        </div>
      </div>
      <div>
        <label class="label">Address</label>
        <input v-model="form.address" class="input" :class="{ 'border-red-500': fe.address }" />
        <p v-if="fe.address" class="field-error">{{ fe.address }}</p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Blood Group</label>
          <select v-model="form.bloodGroup" class="input" :class="{ 'border-red-500': fe.bloodGroup }">
            <option value="">Unknown</option>
            <option v-for="bg in ['A+','A-','B+','B-','AB+','AB-','O+','O-']" :key="bg" :value="bg">{{ bg }}</option>
          </select>
          <p v-if="fe.bloodGroup" class="field-error">{{ fe.bloodGroup }}</p>
        </div>
        <div>
          <label class="label">Patient Type</label>
          <select v-model="form.patientType" class="input">
            <option value="HUMAN">Human</option>
            <option value="PET">Pet / Animal</option>
          </select>
        </div>
      </div>
      <div>
        <label class="label">Emergency Contact Name</label>
        <input v-model="form.emergencyContact" class="input" />
      </div>
      <div>
        <label class="label">Emergency Contact Phone</label>
        <input v-model="form.emergencyPhone" class="input" />
      </div>
      <div><label class="label">Notes</label><textarea v-model="form.notes" class="input" rows="3" /></div>

      <div v-if="error" class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400"
        style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2)">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ error }}
      </div>

      <div class="flex gap-3 pt-2">
        <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? 'Saving…' : 'Save Patient' }}</button>
        <RouterLink to="/patients" class="btn-secondary">Cancel</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'

const route = useRoute()
const router = useRouter()
const isEdit = !!route.params.id
const loading = ref(false)
const error = ref('')
const fe = ref({})  // field errors keyed by field name
const form = ref({
  firstName: '', lastName: '', dateOfBirth: '', gender: '', phone: '', email: '',
  address: '', bloodGroup: '', patientType: 'HUMAN', emergencyContact: '', emergencyPhone: '', notes: ''
})

onMounted(async () => {
  if (isEdit) {
    const { data } = await api.get(`/patients/${route.params.id}`)
    const p = data.data
    Object.keys(form.value).forEach(k => { if (p[k] !== undefined) form.value[k] = p[k] })
    if (p.dateOfBirth) form.value.dateOfBirth = p.dateOfBirth.split('T')[0]
  }
})

async function submit() {
  loading.value = true; error.value = ''; fe.value = {}
  try {
    if (isEdit) {
      await api.put(`/patients/${route.params.id}`, form.value)
    } else {
      await api.post('/patients', form.value)
    }
    router.push('/patients')
  } catch (e) {
    const res = e.response?.data
    if (res?.errors?.length) {
      const map = {}
      res.errors.forEach(err => { if (err.field) map[err.field] = err.message })
      fe.value = map
      error.value = res.message || 'Please fix the errors below'
    } else {
      error.value = res?.message || 'Failed to save'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.field-error {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #f87171;
}
</style>
