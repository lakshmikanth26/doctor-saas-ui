<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')" />
        <div class="relative w-full overflow-hidden rounded-2xl shadow-xl" style="background:#1e293b; border:1px solid rgba(255,255,255,0.08)" :class="sizeClass">
          <div class="flex items-center justify-between px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <div class="px-6 py-4 overflow-y-auto max-h-[70vh]">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-6 py-4 border-t flex gap-3 justify-end">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String,
  size: { default: 'md' },
})
defineEmits(['close'])

const sizeClass = computed(() => ({ sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[props.size]))
</script>

<style>
.modal-enter-active, .modal-leave-active { transition: opacity .2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
