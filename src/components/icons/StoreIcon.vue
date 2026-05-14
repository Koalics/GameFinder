<script setup>
import { computed } from 'vue'
import { resolveStoreIconify } from '../../utils/storeIcon.js'

const props = defineProps({
  /** RAWG `store.slug` */
  slug: { type: String, default: '' },
  size: { type: [Number, String], default: 22 },
})

const icon = computed(() => resolveStoreIconify(props.slug))
</script>

<template>
  <Icon :icon="icon" :width="size" :height="size" class="store-icon" />
</template>

<style scoped>
.store-icon {
  display: block;
  flex-shrink: 0;
  color: currentColor;
}
</style>
