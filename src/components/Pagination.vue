<template>
  <div v-if="pages > 1" class="flex items-center justify-between mt-4 px-1">
    <p class="text-sm text-gray-500">Page {{ page }} of {{ pages }} ({{ total }} total)</p>
    <div class="flex gap-2">
      <button class="btn btn-secondary btn-sm" :disabled="page <= 1" @click="$emit('change', page - 1)">← Prev</button>
      <button class="btn btn-secondary btn-sm" :disabled="page >= pages" @click="$emit('change', page + 1)">Next →</button>
    </div>
  </div>
</template>
<script setup>
defineProps({ page: Number, pages: Number, total: Number })
defineEmits(['change'])
</script>
