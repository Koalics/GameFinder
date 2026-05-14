<script setup>
import { computed, ref } from 'vue'
import Navbar from './gamefinder/Navbar.vue'
import Sidebar from './gamefinder/Sidebar.vue'
import MainContent from './gamefinder/MainContent.vue'
import { extraGames, initialGames } from '../data/games.js'

const searchQuery = ref('')
const selectedGenres = ref(['Action'])
const orderBy = ref('relevance')
const platform = ref('all')
const extrasLoaded = ref(false)

const pool = computed(() =>
  extrasLoaded.value ? [...initialGames, ...extraGames] : [...initialGames],
)

const visibleGames = computed(() => {
  let list = pool.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter((g) => g.title.toLowerCase().includes(q))

  if (selectedGenres.value.length) {
    list = list.filter((g) =>
      g.genres.some((genre) => selectedGenres.value.includes(genre)),
    )
  }

  if (platform.value !== 'all') {
    const key =
      platform.value === 'pc'
        ? 'windows'
        : platform.value === 'ps'
          ? 'playstation'
          : 'xbox'
    list = list.filter((g) => g.platforms.includes(key))
  }

  const out = [...list]
  if (orderBy.value === 'name') {
    out.sort((a, b) => a.title.localeCompare(b.title))
  } else if (orderBy.value === 'released') {
    out.sort((a, b) => b.releaseMs - a.releaseMs)
  } else if (orderBy.value === 'rating') {
    out.sort((a, b) => a.id - b.id)
  }
  return out
})

function loadMore() {
  if (!extrasLoaded.value) extrasLoaded.value = true
}
</script>

<template>
  <div class="gf">
    <Navbar v-model="searchQuery" />
    <div class="gf__body">
      <Sidebar v-model:selected-genres="selectedGenres" />
      <MainContent
        :games="visibleGames"
        :order-by="orderBy"
        :platform="platform"
        @update:order-by="orderBy = $event"
        @update:platform="platform = $event"
        @load-more="loadMore"
      />
    </div>
  </div>
</template>

<style scoped>
.gf {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: #151515;
  color: #e0e0e0;
}

.gf__body {
  display: flex;
  flex: 1;
  min-height: 0;
}

@media (max-width: 900px) {
  .gf__body {
    flex-direction: column;
  }
}
</style>
