<template>
  <div class="flex h-screen overflow-hidden" style="background:#0f172a">

    <!-- Mobile backdrop -->
    <div v-if="sidebarOpen && isMobile"
      class="fixed inset-0 z-40 bg-black/60"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="flex flex-col w-64 text-white shrink-0 transition-transform duration-200"
      style="background:#111827; border-right:1px solid rgba(255,255,255,0.05)"
      :class="sidebarOpen
        ? 'fixed lg:relative inset-y-0 left-0 z-50 translate-x-0'
        : 'fixed lg:relative inset-y-0 left-0 z-50 -translate-x-full lg:translate-x-0'"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 py-5 border-b" style="border-color:rgba(255,255,255,0.06)">
        <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">M</div>
        <div>
          <div class="font-bold text-sm">Mednest</div>
          <div class="text-xs text-slate-400 truncate max-w-[120px]">{{ auth.org?.name }}</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <NavItem to="/dashboard"     :icon="HomeIcon"                    label="Dashboard"      @click="closeMobile" />
        <NavItem to="/appointments"  :icon="CalendarDaysIcon"            label="Appointments"   @click="closeMobile" />
        <NavItem to="/patients"      :icon="UserIcon"                    label="Patients"       @click="closeMobile" />
        <NavItem to="/visits"        :icon="ClipboardDocumentListIcon"   label="EMR / Visits"   @click="closeMobile" />
        <NavItem to="/prescriptions" :icon="BeakerIcon"                  label="Prescriptions"  @click="closeMobile" />
        <NavItem to="/billing"       :icon="CurrencyDollarIcon"          label="Billing"        @click="closeMobile" />
        <NavItem to="/inventory"     :icon="ArchiveBoxIcon"              label="Inventory"      @click="closeMobile" />
        <NavItem to="/staff"         :icon="UsersIcon"                   label="Staff"          @click="closeMobile" />
        <NavItem to="/website"       :icon="GlobeAltIcon"                label="Website Builder" @click="closeMobile" />
        <div v-if="auth.isSystemAdmin" class="pt-2 mt-2 border-t border-white/5">
          <p class="px-3 text-xs text-slate-500 uppercase tracking-wider mb-1">Admin</p>
          <NavItem to="/crm" :icon="ChartBarIcon" label="CRM" @click="closeMobile" />
        </div>
        <div class="pt-2 mt-2 border-t border-white/5">
          <NavItem to="/settings" :icon="Cog6ToothIcon" label="Settings" @click="closeMobile" />
        </div>
      </nav>

      <!-- User -->
      <div class="px-4 py-4 border-t border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {{ auth.user?.firstName?.[0] }}{{ auth.user?.lastName?.[0] }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
            <p class="text-xs text-slate-400 truncate">{{ auth.user?.role }}</p>
          </div>
          <button @click="auth.logout()" class="text-slate-400 hover:text-white">
            <ArrowLeftOnRectangleIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Topbar -->
      <header class="px-4 py-3 flex items-center gap-3 shrink-0"
        style="background:#111827; border-bottom:1px solid rgba(255,255,255,0.05)">
        <button @click="sidebarOpen = !sidebarOpen" class="text-slate-400 hover:text-white lg:hidden shrink-0">
          <Bars3Icon class="w-5 h-5" />
        </button>
        <div class="flex items-center gap-2 ml-auto">
          <RouterLink to="/appointments" class="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
            <SignalIcon class="w-4 h-4" /><span class="hidden sm:inline">Live Queue</span>
          </RouterLink>
          <RouterLink
            v-if="auth.org?.slug"
            :to="`/queue/${auth.org.slug}`"
            target="_blank"
            class="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            style="background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.08)"
          >
            <TvIcon class="w-3.5 h-3.5" /><span class="hidden sm:inline">Queue Display</span>
          </RouterLink>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6" style="background:#0f172a">
        <RouterView />
      </main>
    </div>

    <!-- Demo tour overlay (always rendered, teleports to body) -->
    <DemoTour />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDemoStore } from '@/stores/demo'
import NavItem from '@/components/NavItem.vue'
import DemoTour from '@/components/DemoTour.vue'
import {
  HomeIcon, CalendarDaysIcon, UserIcon, ClipboardDocumentListIcon,
  BeakerIcon, CurrencyDollarIcon, ArchiveBoxIcon, UsersIcon,
  GlobeAltIcon, ChartBarIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon,
  Bars3Icon, SignalIcon, TvIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const demo = useDemoStore()

const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 1024)
const sidebarOpen = ref(windowWidth.value >= 1024)

function onResize() {
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 1024) sidebarOpen.value = true
}

function closeMobile() {
  if (isMobile.value) sidebarOpen.value = false
}

onMounted(() => {
  demo.resume()
  window.addEventListener('resize', onResize)
})
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>
