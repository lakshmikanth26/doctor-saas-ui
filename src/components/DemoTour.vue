<template>
  <Teleport to="body">
    <Transition name="tour">
      <div v-if="demo.active" class="fixed z-[9999] bottom-6 right-6 select-none">

        <!-- Minimised pill -->
        <div v-if="demo.minimised"
          @click="demo.minimised = false"
          class="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-full shadow-2xl cursor-pointer hover:bg-gray-800 transition-colors border border-gray-700">
          <span class="text-lg">{{ demo.currentStep.icon }}</span>
          <span class="text-sm font-semibold">Demo Tour</span>
          <span class="text-xs text-gray-400">{{ demo.step + 1 }}/{{ totalSteps }}</span>
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-1"></span>
        </div>

        <!-- Full card -->
        <div v-else class="w-[380px] bg-gray-900 rounded-3xl shadow-2xl border border-gray-700/60 overflow-hidden">

          <!-- Header bar -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live Demo Tour</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">{{ demo.step + 1 }} of {{ totalSteps }}</span>
              <button @click="demo.minimised = true" class="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-800" title="Minimise">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
              </button>
              <button @click="exitDemo" class="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-gray-800" title="Exit demo">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="h-0.5 bg-gray-800">
            <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out" :style="{ width: demo.progress + '%' }"></div>
          </div>

          <!-- Step dots -->
          <div class="flex items-center gap-1 px-5 pt-4 flex-wrap">
            <button v-for="(s, i) in steps" :key="s.id"
              @click="navigateTo(i)"
              class="w-5 h-5 rounded-full text-[9px] font-bold transition-all duration-200 flex items-center justify-center"
              :class="i === demo.step
                ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/30'
                : i < demo.step
                  ? 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                  : 'bg-gray-800 text-gray-600 hover:bg-gray-700'"
              :title="s.title">
              {{ i + 1 }}
            </button>
          </div>

          <!-- Content -->
          <div class="px-5 pb-2 pt-3">
            <Transition name="step-fade" mode="out-in">
              <div :key="demo.step">
                <!-- Icon + title -->
                <div class="flex items-start gap-3 mb-3">
                  <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
                    {{ demo.currentStep.icon }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-white font-bold text-sm leading-snug">{{ demo.currentStep.title }}</h3>
                  </div>
                </div>

                <!-- Insight -->
                <p class="text-gray-300 text-sm leading-relaxed mb-3">{{ demo.currentStep.insight }}</p>

                <!-- Tip -->
                <div class="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2.5">
                  <span class="text-yellow-400 text-xs mt-0.5 shrink-0">💡</span>
                  <p class="text-yellow-200/80 text-xs leading-relaxed">{{ demo.currentStep.tip }}</p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Navigation -->
          <div class="flex items-center gap-3 px-5 py-4 border-t border-gray-800 mt-2">
            <button @click="handlePrev"
              :disabled="demo.isFirst"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              :class="demo.isFirst
                ? 'text-gray-700 cursor-not-allowed'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'">
              ← Back
            </button>

            <div class="flex-1 text-center">
              <span class="text-xs text-gray-600">{{ demo.currentStep.id }}</span>
            </div>

            <button v-if="!demo.isLast" @click="handleNext"
              class="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/30">
              Next →
            </button>
            <button v-else @click="exitDemo"
              class="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-500 transition-all active:scale-95">
              Finish ✓
            </button>
          </div>

          <!-- Exit CTA -->
          <div class="px-5 pb-4">
            <RouterLink to="/register"
              @click="demo.stop()"
              class="block text-center py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg">
              Start Your Free Clinic — 14 Days Free →
            </RouterLink>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDemoStore, DEMO_STEPS } from '@/stores/demo'

const demo = useDemoStore()
const router = useRouter()

const totalSteps = DEMO_STEPS.length
const steps = DEMO_STEPS

function navigateTo(idx) {
  demo.goTo(idx)
  router.push(DEMO_STEPS[idx].path)
}

function handleNext() {
  demo.next()
  router.push(demo.currentStep.path)
}

function handlePrev() {
  demo.prev()
  router.push(demo.currentStep.path)
}

function exitDemo() {
  demo.stop()
  router.push('/')
}
</script>

<style scoped>
.tour-enter-active, .tour-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.tour-enter-from, .tour-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }

.step-fade-enter-active, .step-fade-leave-active { transition: all 0.2s ease; }
.step-fade-enter-from { opacity: 0; transform: translateX(12px); }
.step-fade-leave-to { opacity: 0; transform: translateX(-12px); }
</style>
