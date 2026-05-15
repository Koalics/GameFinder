<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SortDropdown from './SortDropdown.vue';
import GameGrid from './GameGrid.vue';

const props = defineProps({
  title: { type: String, default: 'All Games' },
  games: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  hasMore: { type: Boolean, default: true },
  orderBy: { type: String, required: true },
  platform: { type: String, required: true },
});

const emit = defineEmits(['update:orderBy', 'update:platform', 'load-more']);

const sentinel = ref(null);
let observer = null;

function tryLoadMore() {
  if (!props.hasMore || props.loading || props.games.length === 0) return;
  emit('load-more');
}

function attachObserver() {
  observer?.disconnect();
  const el = sentinel.value;
  if (!el) return;

  observer = new IntersectionObserver(
    (entries) => {
      const hit = entries.some((e) => e.isIntersecting);
      if (hit) tryLoadMore();
    },
    { root: null, rootMargin: '280px 0px 0px 0px', threshold: 0 },
  );
  observer.observe(el);
}

onMounted(() => {
  nextTick(() => attachObserver());
});

watch(
  () => [props.games.length, props.hasMore, props.loading],
  () => {
    nextTick(() => attachObserver());
  },
);

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

const orderOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name', label: 'Name' },
  { value: 'released', label: 'Release date' },
  { value: 'rating', label: 'Rating' },
];

const platformOptions = [
  { value: 'all', label: 'All platforms' },
  { value: 'pc', label: 'PC' },
  { value: 'ps', label: 'PlayStation' },
  { value: 'xbox', label: 'Xbox' },
];
</script>

<template>
  <main class="main">
    <h1 class="main__title">{{ title }}</h1>

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

    <p v-if="error" class="main__alert" role="alert">{{ error }}</p>
    <p v-if="loading && games.length === 0" class="main__status">Загрузка…</p>
    <p
      v-else-if="!loading && !error && games.length === 0"
      class="main__status main__status--muted"
    >
      Ничего не найдено. Измените фильтры или поиск.
    </p>

    <GameGrid :games="games" />

    <p v-if="loading && games.length > 0" class="main__loading-more">
      Загрузка…
    </p>

    <div
      v-if="games.length > 0 && hasMore"
      ref="sentinel"
      class="main__sentinel"
      aria-hidden="true"
    />
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

.main__alert {
  margin: 0 0 1rem;
  padding: 0.65rem 0.875rem;
  border-radius: 8px;
  background: #3d1f1f;
  color: #ffb4b4;
  font-size: 0.875rem;
}

.main__status {
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: #c0c0c0;
}

.main__status--muted {
  color: #808080;
}

.main__loading-more {
  margin: 1rem 0 0;
  text-align: center;
  font-size: 0.8125rem;
  color: #909090;
}

.main__sentinel {
  height: 4px;
  margin-top: 0.5rem;
  pointer-events: none;
}
</style>
