<script setup>
import ClinovaMark from './ClinovaMark.vue'

defineProps({
  size: { type: [Number, String], default: 40 },
  showName: { type: Boolean, default: true },
  showTagline: { type: Boolean, default: false },
  tagline: { type: String, default: 'A new generation of clinical care' },
  nameClass: { type: String, default: 'text-white font-black text-xl' },
  taglineClass: { type: String, default: 'text-slate-400 text-xs mt-0.5' },
})
</script>

<template>
  <div class="flex items-center gap-3">
    <ClinovaMark :size="size" />
    <div v-if="showName || showTagline" class="min-w-0">
      <div v-if="showName" :class="nameClass">Clinova</div>
      <div v-if="showTagline" :class="taglineClass">{{ tagline }}</div>
    </div>
  </div>
</template>
