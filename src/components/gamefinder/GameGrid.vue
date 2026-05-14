<script setup>
import GameCard from './GameCard.vue'

defineProps({
  games: { type: Array, required: true },
})
</script>

<template>
  <div class="grid" role="list">
    <GameCard
      v-for="g in games"
      :key="g.id"
      :title="g.title"
      :image="g.image"
      :release-date="g.releaseDate"
      :genres="g.genres"
      :platforms="g.platforms"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}
</style>
