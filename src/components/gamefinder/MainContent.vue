<script setup>
import SortDropdown from './SortDropdown.vue'
import GameGrid from './GameGrid.vue'
import LoadMoreButton from './LoadMoreButton.vue'

defineProps({
  games: { type: Array, required: true },
  orderBy: { type: String, required: true },
  platform: { type: String, required: true },
})

defineEmits(['update:orderBy', 'update:platform', 'load-more'])

const orderOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name', label: 'Name' },
  { value: 'released', label: 'Release date' },
  { value: 'rating', label: 'Rating' },
]

const platformOptions = [
  { value: 'all', label: 'All platforms' },
  { value: 'pc', label: 'PC' },
  { value: 'ps', label: 'PlayStation' },
  { value: 'xbox', label: 'Xbox' },
]
</script>

<template>
  <main class="main">
    <h1 class="main__title">All Games</h1>

    <div class="main__toolbar">
      <SortDropdown
        label="Order by"
        :model-value="orderBy"
        :options="orderOptions"
        @update:model-value="$emit('update:orderBy', $event)"
      />
      <SortDropdown
        label="Platforms"
        :model-value="platform"
        :options="platformOptions"
        @update:model-value="$emit('update:platform', $event)"
      />
    </div>

    <GameGrid :games="games" />
    <LoadMoreButton @click="$emit('load-more')" />
  </main>
</template>

<style scoped>
.main {
  flex: 1;
  min-width: 0;
  padding: 1.5rem 1.5rem 2rem;
}

.main__title {
  margin: 0 0 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
}

.main__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
