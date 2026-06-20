<template>
  <div class="max-w-2xl">
    <h1 class="page-title mb-6">Settings</h1>

    <div class="space-y-4">
      <div class="card">
        <h3 class="font-semibold mb-3">Organization Info</h3>
        <dl class="grid grid-cols-2 gap-3 text-sm">
          <div><dt class="text-slate-500">Name</dt><dd class="font-medium">{{ auth.org?.name }}</dd></div>
          <div><dt class="text-slate-500">Type</dt><dd class="font-medium">{{ auth.org?.clinicType }}</dd></div>
          <div><dt class="text-slate-500">Slug</dt><dd class="font-mono text-xs">{{ auth.org?.slug }}</dd></div>
          <div><dt class="text-slate-500">Plan</dt><dd><span class="badge-blue">{{ auth.org?.subscription?.plan || 'FREE_TRIAL' }}</span></dd></div>
        </dl>
      </div>

      <div class="card">
        <h3 class="font-semibold mb-3">My Profile</h3>
        <dl class="grid grid-cols-2 gap-3 text-sm">
          <div><dt class="text-slate-500">Name</dt><dd class="font-medium">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</dd></div>
          <div><dt class="text-slate-500">Email</dt><dd>{{ auth.user?.email }}</dd></div>
          <div><dt class="text-slate-500">Role</dt><dd><span class="badge-blue">{{ auth.user?.role }}</span></dd></div>
        </dl>
      </div>

      <div class="card">
        <h3 class="font-semibold mb-3">Queue Display</h3>
        <p class="text-sm text-slate-500 mb-3">Share this URL on your waiting room TV or send to patients on their phone.</p>
        <div class="flex items-center gap-2">
          <input :value="`${origin}/queue/${auth.org?.slug}`" class="input flex-1 font-mono text-sm" readonly />
          <button @click="copyQueue" class="btn-secondary btn-sm">{{ copied ? '✓ Copied' : 'Copy' }}</button>
        </div>
        <RouterLink :to="`/queue/${auth.org?.slug}`" target="_blank" class="btn-primary btn-sm mt-3 inline-flex">
          📺 Open Queue Display
        </RouterLink>
      </div>

      <div class="card border-red-100">
        <h3 class="font-semibold mb-3 text-red-600">Danger Zone</h3>
        <button @click="auth.logout()" class="btn-danger btn-sm">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const copied = ref(false)
const origin = window.location.origin

function copyQueue() {
  navigator.clipboard.writeText(`${origin}/queue/${auth.org?.slug}`)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
