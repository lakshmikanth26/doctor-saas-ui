<template>
  <div class="max-w-2xl mx-auto">
    <div class="page-header">
      <h1 class="page-title">{{ isEdit ? 'Edit Patient' : 'New Patient' }}</h1>
      <RouterLink to="/patients" class="btn-secondary">← Back</RouterLink>
    </div>

    <form @submit.prevent="submit" class="card space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div><label class="label">First Name *</label><input v-model="form.firstName" class="input" required /></div>
        <div><label class="label">Last Name *</label><input v-model="form.lastName" class="input" required /></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Date of Birth</label>
          <input v-model="form.dateOfBirth" type="date" class="input" />
        </div>
        <div>
          <label class="label">Gender</label>
          <select v-model="form.gender" class="input">
            <option value="">Select…</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="label">Phone</label><input v-model="form.phone" class="input" /></div>
        <div><label class="label">Email</label><input v-model="form.email" type="email" class="input" /></div>
      </div>
      <div>
        <label class="label">Address</label>
        <input v-model="form.address" class="input" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Blood Group</label>
          <select v-model="form.bloodGroup" class="input">
            <option value="">Unknown</option>
            <option v-for="bg in ['A+','A-','B+','B-','AB+','AB-','O+','O-']" :key="bg" :value="bg">{{ bg }}</option>
          </select>
        </div>
        <div>
          <label class="label">Patient Type</label>
          <select v-model="form.patientType" class="input">
            <option value="HUMAN">Human</option>
            <option value="PET">Pet / Animal</option>
          </select>
        </div>
      </div>
      <div><label class="label">Emergency Contact Name</label><input v-model="form.emergencyContact" class="input" /></div>
      <div><label class="label">Emergency Contact Phone</label><input v-model="form.emergencyPhone" class="input" /></div>
      <div><label class="label">Notes</label><textarea v-model="form.notes" class="input" rows="3" /></div>

      <p v-if="error" class="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{{ error }}</p>
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
  loading.value = true; error.value = ''
  try {
    if (isEdit) {
      await api.put(`/patients/${route.params.id}`, form.value)
    } else {
      await api.post('/patients', form.value)
    }
    router.push('/patients')
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to save'
  } finally {
    loading.value = false
  }
}
</script>
