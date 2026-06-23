<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  size: { type: [Number, String], default: 40 },
})

const px = computed(() => {
  const n = typeof props.size === 'number' ? props.size : parseInt(props.size, 10)
  return Number.isFinite(n) ? n : 40
})

const uid = useId().replace(/:/g, '')
const bgId = `clinova-bg-${uid}`
const accentId = `clinova-accent-${uid}`
</script>

<template>
  <svg
    :width="px"
    :height="px"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Clinova"
    class="shrink-0"
  >
    <defs>
      <linearGradient :id="bgId" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop stop-color="#2563eb" />
        <stop offset="1" stop-color="#1d4ed8" />
      </linearGradient>
      <linearGradient :id="accentId" x1="30" y1="18" x2="38" y2="30" gradientUnits="userSpaceOnUse">
        <stop stop-color="#38bdf8" />
        <stop offset="1" stop-color="#06b6d4" />
      </linearGradient>
    </defs>

    <rect width="48" height="48" rx="12" :fill="`url(#${bgId})`" />

    <!-- Embracing C — clinical care -->
    <path
      d="M29.5 15.25C22.25 15.25 16.75 19.35 16.75 24C16.75 28.65 22.25 32.75 29.5 32.75"
      stroke="white"
      stroke-width="3.75"
      stroke-linecap="round"
      fill="none"
    />

    <!-- Pulse line inside the C -->
    <path
      d="M20.5 24h5.5"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      opacity="0.45"
    />

    <!-- Nova point — next-generation care -->
    <circle cx="33.25" cy="24" r="4.75" fill="#06b6d4" opacity="0.18" />
    <circle cx="33.25" cy="24" r="2.85" :fill="`url(#${accentId})`" />
  </svg>
</template>
