<template>
  <div class="min-h-screen flex" style="background:#0f172a">

    <!-- Left panel — branding -->
    <div class="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden"
      style="background:linear-gradient(135deg,#1e293b,#0f172a); border-right:1px solid rgba(255,255,255,0.06)">
      <div class="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
        style="background:radial-gradient(circle,#3b82f6,transparent)"></div>

      <div class="flex items-center gap-3 relative">
        <BrandLogo :size="40" />
      </div>

      <div class="relative">
        <p class="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">A new generation of clinical care</p>
        <h2 class="text-4xl font-black text-white leading-tight mb-6">
          Set up your<br/>clinic in<br/><span style="color:#34d399">under 5 minutes.</span>
        </h2>
        <div class="space-y-4">
          <div v-for="step in steps" :key="step.n" class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
              style="background:rgba(59,130,246,0.2); color:#60a5fa">{{ step.n }}</div>
            <div>
              <p class="text-white text-sm font-semibold">{{ step.title }}</p>
              <p class="text-slate-500 text-xs mt-0.5">{{ step.sub }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative p-4 rounded-2xl" style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07)">
        <p class="text-slate-300 text-sm italic">"Clinova cut our appointment chaos by 80%. The queue display alone saved us 2 staff hours a day."</p>
        <p class="text-slate-500 text-xs mt-3">— Dr. Priya Sharma, City Dental Care</p>
      </div>
    </div>

    <!-- Right panel — form -->
    <div class="flex-1 flex items-center justify-center p-6 overflow-y-auto">
      <div class="w-full max-w-md py-8">

        <!-- Mobile logo -->
        <div class="mb-8 lg:hidden">
          <BrandLogo :size="36" name-class="text-white font-black text-lg" />
        </div>

        <h1 class="text-3xl font-black text-white mb-1">Register your Clinic</h1>
        <p class="text-slate-400 text-sm mb-8">Start your free 14-day trial — no credit card needed</p>

        <form @submit.prevent="submit" class="space-y-4">

          <!-- Your details -->
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500 pt-1">Your Details</p>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">First Name</label>
              <input v-model="form.firstName" class="input" placeholder="Raj" required />
            </div>
            <div>
              <label class="label">Last Name</label>
              <input v-model="form.lastName" class="input" placeholder="Sharma" required />
            </div>
          </div>
          <div>
            <label class="label">Email</label>
            <input v-model="form.email" type="email" class="input" placeholder="doctor@clinic.com" required />
          </div>
          <div>
            <label class="label">Password</label>
            <input v-model="form.password" type="password" class="input" placeholder="Min. 8 characters" minlength="8" required />
          </div>

          <!-- Clinic details -->
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500 pt-2 border-t border-white/5">Clinic Details</p>
          <div>
            <label class="label">Clinic Name</label>
            <input v-model="form.orgName" class="input" placeholder="City Dental Care" required />
          </div>
          <div>
            <label class="label">Clinic Type</label>
            <select v-model="form.clinicType" class="input">
              <option value="HUMAN_GENERAL">General Practice</option>
              <option value="HUMAN_SPECIALTY">Specialty Clinic</option>
              <option value="VETERINARY_SMALL">Veterinary (Small Animals)</option>
              <option value="VETERINARY_LARGE">Veterinary (Large Animals)</option>
              <option value="PHYSIOTHERAPY">Physiotherapy</option>
              <option value="DENTAL">Dental</option>
            </select>
          </div>
          <div>
            <label class="label">Phone <span class="text-slate-600 normal-case font-normal">(optional)</span></label>
            <input v-model="form.phone" class="input" placeholder="+91 98765 43210" />
          </div>

          <div v-if="error" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400"
            style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2)">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full justify-center py-3 text-base font-bold" :disabled="loading">
            {{ loading ? 'Creating account…' : 'Create Free Account →' }}
          </button>

          <p class="text-xs text-slate-600 text-center">
            By registering you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <p class="text-center text-sm text-slate-500 mt-6">
          Already have an account?
          <RouterLink to="/login" class="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Sign in →</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BrandLogo from '@/components/BrandLogo.vue'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ firstName: '', lastName: '', email: '', password: '', orgName: '', clinicType: 'HUMAN_GENERAL', phone: '' })
const error = ref('')
const loading = ref(false)

const steps = [
  { n: 1, title: 'Create your account', sub: 'Takes less than 2 minutes' },
  { n: 2, title: 'Add your first patient', sub: 'Import or enter manually' },
  { n: 3, title: 'Book an appointment', sub: 'Queue starts auto-managing' },
]

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(form.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
