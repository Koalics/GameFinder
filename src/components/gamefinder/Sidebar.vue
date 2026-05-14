<script setup>
const props = defineProps({
  /** @type {{ name: string, slug: string }[]} */
  genreOptions: { type: Array, default: () => [] },
  /** @type {string[]} slugs */
  selectedGenres: { type: Array, required: true },
})

const emit = defineEmits(['update:selectedGenres'])

function toggleGenre(slug) {
  const set = new Set(props.selectedGenres)
  if (set.has(slug)) set.delete(slug)
  else set.add(slug)
  emit('update:selectedGenres', [...set])
}
</script>

<template>
  <aside class="sidebar">
    <nav class="sidebar__block" aria-label="Top lists">
      <h2 class="sidebar__heading">Top</h2>
      <ul class="sidebar__nav">
        <li>
          <a href="#" class="sidebar__link" @click.prevent>
            <span class="sidebar__icon" aria-hidden="true">
              <Icon icon="mdi:trophy-outline" width="18" height="18" />
            </span>
            Best of the Year
          </a>
        </li>
        <li>
          <a href="#" class="sidebar__link" @click.prevent>
            <span class="sidebar__icon" aria-hidden="true">
              <Icon icon="mdi:star-four-points" width="18" height="18" />
            </span>
            Popular in 2026
          </a>
        </li>
        <li>
          <a href="#" class="sidebar__link" @click.prevent>
            <span class="sidebar__icon" aria-hidden="true">
              <Icon icon="mdi:crown-outline" width="18" height="18" />
            </span>
            All time top 250
          </a>
        </li>
      </ul>
    </nav>

    <section class="sidebar__block" aria-labelledby="genres-heading">
      <h2 id="genres-heading" class="sidebar__heading">Genres</h2>
      <ul v-if="genreOptions.length" class="sidebar__genres">
        <li v-for="g in genreOptions" :key="g.slug" class="sidebar__genre-row">
          <label class="sidebar__check">
            <input
              class="sidebar__checkbox"
              type="checkbox"
              :checked="selectedGenres.includes(g.slug)"
              @change="toggleGenre(g.slug)"
            />
            <span class="sidebar__box" aria-hidden="true" />
            <span>{{ g.name }}</span>
          </label>
        </li>
      </ul>
      <p v-else class="sidebar__hint">Загрузка жанров…</p>
    </section>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 1.25rem 1rem 1.25rem 1.25rem;
  border-right: 1px solid #2a2a2a;
  background: #151515;
}

.sidebar__block {
  margin-bottom: 1.75rem;
}

.sidebar__block:last-child {
  margin-bottom: 0;
}

.sidebar__heading {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
}

.sidebar__nav {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar__nav li {
  margin-bottom: 0.25rem;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #c8c8c8;
  text-decoration: none;
  transition:
    background 0.15s,
    color 0.15s;
}

.sidebar__link:hover {
  background: #202020;
  color: #fff;
}

.sidebar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  color: #d0d0d0;
}

.sidebar__genres {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar__genre-row {
  margin-bottom: 0.35rem;
}

.sidebar__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0.35rem 0.25rem;
  border-radius: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}

.sidebar__check:hover {
  background: #1c1c1c;
  color: #fff;
}

.sidebar__checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.sidebar__box {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  border: 1px solid #505050;
  background: #1a1a1a;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.sidebar__check:hover .sidebar__box {
  border-color: #707070;
}

.sidebar__checkbox:checked + .sidebar__box {
  background: #fff;
  border-color: #fff;
}

.sidebar__checkbox:checked + .sidebar__box::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid #151515;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translateY(-1px);
}

.sidebar__checkbox:focus-visible + .sidebar__box {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.sidebar__hint {
  margin: 0;
  font-size: 0.8125rem;
  color: #808080;
}

@media (max-width: 900px) {
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #2a2a2a;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1rem;
    padding: 1rem;
  }

  .sidebar__block {
    margin-bottom: 0;
  }

  .sidebar__genres {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 0.5rem;
  }
}
</style>
