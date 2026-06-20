<template>
  <div class="card flex items-center gap-4">
    <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :style="iconBg">
      <component :is="icon" class="w-6 h-6" :style="iconColor" />
    </div>
    <div>
      <p class="text-sm text-slate-400">{{ label }}</p>
      <p class="text-2xl font-bold text-white">{{ value }}</p>
      <p v-if="sub" class="text-xs text-slate-500 mt-0.5">{{ sub }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { default: null },
  label: String,
  value: [String, Number],
  sub: String,
  iconBg: { default: 'background:rgba(59,130,246,0.15)' },
  iconColor: { default: 'color:#60a5fa' },
})
</script>
