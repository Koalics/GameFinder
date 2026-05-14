<script setup>
import { onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './gamefinder/Navbar.vue'
import Sidebar from './gamefinder/Sidebar.vue'
import MainContent from './gamefinder/MainContent.vue'
import {
  fetchGamesPage,
  fetchGenreOptions,
  fetchParentPlatformIds,
  getRawgKey,
  rawgOrdering,
} from '../api/rawg.js'
import { GENRE_SIDEBAR_ORDER } from '../data/games.js'

const configError = ref('')
const games = shallowRef([])
const loading = ref(false)
const loadError = ref('')
const page = ref(1)
const hasMore = ref(true)
const syncing = ref(true)

const parentPlatformMap = ref(new Map())
const genreOptions = ref([])

const route = useRoute()

const searchQuery = ref('')
const selectedGenres = ref([])
const orderBy = ref('relevance')
const platform = ref('all')

let apiKey = ''
let searchDebounce = null

function parentPlatformsParam() {
  const m = parentPlatformMap.value
  if (platform.value === 'all') return ''
  if (platform.value === 'pc') return m.get('pc') || ''
  if (platform.value === 'ps') return m.get('playstation') || ''
  if (platform.value === 'xbox') return m.get('xbox') || ''
  return ''
}

async function loadGames(append) {
  if (!apiKey) return
  loadError.value = ''
  loading.value = true
  try {
    const nextPage = append ? page.value + 1 : 1
    const ordering = rawgOrdering(orderBy.value)
    const genreSlugs =
      selectedGenres.value.length === 0
        ? []
        : selectedGenres.value.filter((s) =>
            genreOptions.value.some((g) => g.slug === s),
          )

    const { results, next } = await fetchGamesPage(apiKey, {
      page: nextPage,
      pageSize: 12,
      search: searchQuery.value,
      genreSlugs,
      ordering,
      parentPlatforms: parentPlatformsParam(),
    })

    hasMore.value = Boolean(next)
    page.value = nextPage

    if (append) {
      const merged = [...games.value]
      const seen = new Set(merged.map((g) => g.id))
      for (const r of results) {
        if (!seen.has(r.id)) {
          seen.add(r.id)
          merged.push(r)
        }
      }
      games.value = merged
    } else {
      games.value = results
    }
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Ошибка загрузки'
    if (!append) games.value = []
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (!hasMore.value || loading.value || !apiKey) return
  loadGames(true)
}

function scheduleSearchRefetch() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    if (!syncing.value && apiKey) loadGames(false)
  }, 400)
}

onMounted(async () => {
  syncing.value = true
  try {
    try {
      apiKey = getRawgKey()
    } catch (e) {
      configError.value = e instanceof Error ? e.message : String(e)
      return
    }

    parentPlatformMap.value = await fetchParentPlatformIds(apiKey)
    genreOptions.value = await fetchGenreOptions(apiKey, GENRE_SIDEBAR_ORDER)

    const action = genreOptions.value.find((g) => g.slug === 'action')
    selectedGenres.value = action
      ? [action.slug]
      : genreOptions.value[0]
        ? [genreOptions.value[0].slug]
        : []

    const q = route.query.q
    if (typeof q === 'string' && q.trim()) searchQuery.value = q.trim()

    await loadGames(false)
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Ошибка загрузки'
  } finally {
    syncing.value = false
  }
})

watch([orderBy, platform, selectedGenres], () => {
  if (syncing.value || !apiKey) return
  loadGames(false)
})

watch(searchQuery, () => {
  if (syncing.value || !apiKey) return
  scheduleSearchRefetch()
})

watch(
  () => (route.name === 'home' ? String(route.query.q ?? '') : null),
  (q) => {
    if (q === null || syncing.value || !apiKey) return
    if (searchQuery.value !== q) searchQuery.value = q
    clearTimeout(searchDebounce)
    loadGames(false)
  },
)

function onSearchSubmit() {
  clearTimeout(searchDebounce)
  if (apiKey && !syncing.value) loadGames(false)
}
</script>

<template>
  <div class="gf">
    <Navbar v-model="searchQuery" @submit="onSearchSubmit" />
    <p v-if="configError" class="gf__banner" role="alert">{{ configError }}</p>
    <div class="gf__body">
      <Sidebar v-model:selected-genres="selectedGenres" :genre-options="genreOptions" />
      <MainContent
        :games="games"
        :loading="loading"
        :error="loadError"
        :has-more="hasMore"
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

.gf__banner {
  margin: 0;
  padding: 0.75rem 1.5rem;
  background: #3d1f1f;
  color: #ffb4b4;
  font-size: 0.875rem;
  border-bottom: 1px solid #5a2a2a;
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
