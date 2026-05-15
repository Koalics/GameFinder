<script setup>
import { RouterLink } from 'vue-router'
import GameCard from './GameCard.vue'

defineProps({
  games: { type: Array, required: true },
})
</script>

<template>
  <div class="grid" role="list">
    <RouterLink
      v-for="g in games"
      :key="g.id"
      class="grid__link"
      role="listitem"
      :to="{ name: 'game', params: { id: String(g.id) } }"
    >
      <GameCard
        :title="g.title"
        :image="g.image"
        :release-date="g.releaseDate"
        :genres="g.genres"
        :platforms="g.platforms"
      />
    </RouterLink>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
}

.grid__link {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 14px;
  outline-offset: 3px;
}

@media (max-width: 1400px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
