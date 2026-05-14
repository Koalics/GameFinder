<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** @type {'windows'|'playstation'|'xbox'} */
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
})

const icon = computed(() => {
  switch (props.name) {
    case 'windows':
      return 'mdi:microsoft-windows'
    case 'playstation':
      return 'simple-icons:playstation'
    case 'xbox':
      return 'simple-icons:xbox'
    default:
      return 'mdi:help-circle-outline'
  }
})
</script>

<template>
  <Icon :icon="icon" :width="size" :height="size" class="picon" />
</template>

<style scoped>
.picon {
  display: block;
  color: currentColor;
}
</style>
