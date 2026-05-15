<script setup>
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
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
import { getTopListConfig, resolveListSlugFromRoute } from '../data/topLists.js'

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

const listSlug = computed(() => resolveListSlugFromRoute(route))
const listConfig = computed(() => getTopListConfig(listSlug.value))
const pageTitle = computed(() => listConfig.value.title)

const searchQuery = ref('')
const selectedGenres = ref([])
const orderBy = ref('relevance')
const platform = ref('all')
const sidebarOpen = ref(false)

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

function resolveListDates() {
  const d = listConfig.value.dates
  if (!d) return ''
  return typeof d === 'function' ? d() : d
}

function resolveOrdering() {
  const user = rawgOrdering(orderBy.value)
  if (user) return user
  return listConfig.value.defaultRawgOrdering || ''
}

function applyListDefaults() {
  const cfg = listConfig.value
  orderBy.value = 'relevance'
  platform.value = 'all'

  if (cfg.defaultGenreSlugs?.length) {
    const valid = cfg.defaultGenreSlugs.filter((s) =>
      genreOptions.value.some((g) => g.slug === s),
    )
    selectedGenres.value = valid.length ? [...valid] : []
  } else {
    selectedGenres.value = []
  }
}

async function loadGames(append) {
  if (!apiKey) return
  loadError.value = ''
  loading.value = true
  try {
    const nextPage = append ? page.value + 1 : 1
    const cfg = listConfig.value
    const maxGames = cfg.maxGames
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
      ordering: resolveOrdering(),
      parentPlatforms: parentPlatformsParam(),
      dates: resolveListDates(),
      metacritic: cfg.metacritic || '',
    })

    let batch = results
    if (maxGames) {
      const current = append ? games.value.length : 0
      const room = maxGames - current
      if (room <= 0) {
        hasMore.value = false
        loading.value = false
        return
      }
      batch = batch.slice(0, room)
    }

    const totalAfter = append ? games.value.length + batch.length : batch.length
    hasMore.value =
      Boolean(next) &&
      batch.length > 0 &&
      (!maxGames || totalAfter < maxGames)
    page.value = nextPage

    if (append) {
      const merged = [...games.value]
      const seen = new Set(merged.map((g) => g.id))
      for (const r of batch) {
        if (!seen.has(r.id)) {
          seen.add(r.id)
          merged.push(r)
        }
      }
      games.value = merged
    } else {
      games.value = batch
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

async function initCatalog() {
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

    applyListDefaults()

    const q = route.query.q
    if (typeof q === 'string' && q.trim()) searchQuery.value = q.trim()

    await loadGames(false)
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Ошибка загрузки'
  } finally {
    syncing.value = false
  }
}

async function onListRouteChange() {
  if (!apiKey) return
  syncing.value = true
  searchQuery.value = ''
  applyListDefaults()
  sidebarOpen.value = false
  try {
    await loadGames(false)
  } finally {
    syncing.value = false
  }
}

onMounted(() => {
  initCatalog()
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
  () => route.query.q,
  (q) => {
    if (syncing.value || !apiKey) return
    const next = typeof q === 'string' ? q.trim() : ''
    if (searchQuery.value !== next) searchQuery.value = next
    clearTimeout(searchDebounce)
    loadGames(false)
  },
)

watch(listSlug, (next, prev) => {
  if (prev === undefined || next === prev || !apiKey) return
  onListRouteChange()
})

function onSearchSubmit() {
  clearTimeout(searchDebounce)
  if (apiKey && !syncing.value) loadGames(false)
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="gf">
    <Navbar
      v-model="searchQuery"
      show-filters-menu
      @submit="onSearchSubmit"
      @toggle-filters="toggleSidebar"
    />
    <p v-if="configError" class="gf__banner" role="alert">{{ configError }}</p>
    <div
      v-if="sidebarOpen"
      class="gf__backdrop"
      aria-hidden="true"
      @click="sidebarOpen = false"
    />
    <div class="gf__body">
      <Sidebar
        v-model:selected-genres="selectedGenres"
        :genre-options="genreOptions"
        :active-list-slug="listSlug"
        :mobile-open="sidebarOpen"
        @close="sidebarOpen = false"
      />
      <MainContent
        :title="pageTitle"
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
  position: relative;
}

.gf__backdrop {
  display: none;
}

@media (max-width: 980px) {
  .gf__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 150;
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>
