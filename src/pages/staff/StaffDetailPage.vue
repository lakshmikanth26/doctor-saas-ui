<template>
  <div v-if="member" class="max-w-2xl mx-auto">
    <div class="page-header">
      <div class="flex items-center gap-3">
        <RouterLink to="/staff" class="text-slate-400 hover:text-slate-500">←</RouterLink>
        <h1 class="page-title">{{ member.firstName }} {{ member.lastName }}</h1>
      </div>
      <button @click="editing = !editing" class="btn-secondary">{{ editing ? 'Cancel' : 'Edit Profile' }}</button>
    </div>

    <div class="card" v-if="!editing">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
          {{ member.firstName?.[0] }}{{ member.lastName?.[0] }}
        </div>
        <div>
          <h2 class="text-xl font-bold">{{ member.firstName }} {{ member.lastName }}</h2>
          <p class="text-slate-500">{{ member.staffProfile?.designation || member.systemRole }}</p>
        </div>
      </div>
      <dl class="grid grid-cols-2 gap-4 text-sm">
        <div><dt class="text-slate-500">Email</dt><dd>{{ member.email }}</dd></div>
        <div><dt class="text-slate-500">Specialization</dt><dd>{{ member.staffProfile?.specialization || '—' }}</dd></div>
        <div><dt class="text-slate-500">License No.</dt><dd>{{ member.staffProfile?.licenseNumber || '—' }}</dd></div>
        <div><dt class="text-slate-500">Consultation Fee</dt><dd>{{ member.staffProfile?.consultationFee ? `₹${member.staffProfile.consultationFee}` : '—' }}</dd></div>
        <div class="col-span-2"><dt class="text-slate-500">Bio</dt><dd class="mt-1">{{ member.staffProfile?.bio || '—' }}</dd></div>
        <div class="col-span-2">
          <dt class="text-slate-500 mb-1">Branches</dt>
          <div class="flex gap-2 flex-wrap">
            <span v-for="ub in member.userBranches" :key="ub.branch?.id" class="badge-blue">{{ ub.branch?.name }}</span>
          </div>
        </div>
      </dl>
    </div>

    <form v-else @submit.prevent="saveProfile" class="card space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div><label class="label">First Name</label><input v-model="form.firstName" class="input" /></div>
        <div><label class="label">Last Name</label><input v-model="form.lastName" class="input" /></div>
      </div>
      <div><label class="label">Designation</label><input v-model="form.designation" class="input" placeholder="Senior Doctor, Nurse…" /></div>
      <div><label class="label">Specialization</label><input v-model="form.specialization" class="input" /></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="label">License Number</label><input v-model="form.licenseNumber" class="input" /></div>
        <div><label class="label">Consultation Fee (₹)</label><input v-model="form.consultationFee" class="input" type="number" /></div>
      </div>
      <div><label class="label">Bio</label><textarea v-model="form.bio" class="input" rows="3" /></div>
      <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/lib/api'

const route = useRoute()
const member = ref(null); const editing = ref(false); const saving = ref(false)
const form = ref({})

async function load() {
  const { data } = await api.get(`/staff/${route.params.id}`)
  member.value = data.data
  const sp = data.data.staffProfile || {}
  form.value = { firstName: data.data.firstName, lastName: data.data.lastName, ...sp }
}

async function saveProfile() {
  saving.value = true
  await api.put(`/staff/${route.params.id}/profile`, form.value)
  editing.value = false; saving.value = false; load()
}

onMounted(load)
</script>
