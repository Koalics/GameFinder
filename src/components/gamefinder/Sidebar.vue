<script setup>
import { RouterLink } from 'vue-router';
import { TOP_LISTS } from '../../data/topLists.js';

const props = defineProps({
  /** @type {{ name: string, slug: string }[]} */
  genreOptions: { type: Array, default: () => [] },
  /** @type {string[]} slugs */
  selectedGenres: { type: Array, required: true },
  activeListSlug: { type: String, default: 'all' },
  mobileOpen: { type: Boolean, default: false },
});

const emit = defineEmits(['update:selectedGenres', 'close']);

const topNavItems = [
  {
    slug: 'best-of-year',
    icon: 'mdi:trophy-outline',
    label: TOP_LISTS['best-of-year'].title,
  },
  {
    slug: 'popular-2025',
    icon: 'mdi:star-four-points',
    label: TOP_LISTS['popular-2025'].title,
  },
  {
    slug: 'all-time-250',
    icon: 'mdi:crown-outline',
    label: TOP_LISTS['all-time-250'].title,
  },
];

function toggleGenre(slug) {
  const set = new Set(props.selectedGenres);
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);
  emit('update:selectedGenres', [...set]);
}

function closePanel() {
  emit('close');
}

function onTopNavClick() {
  closePanel();
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--open': mobileOpen }">
    <div class="sidebar__head">
      <h2 class="sidebar__panel-title">Filters</h2>
      <button
        type="button"
        class="sidebar__close"
        aria-label="Close menu"
        @click="closePanel"
      >
        <Icon icon="mdi:close" width="22" height="22" />
      </button>
    </div>

    <nav class="sidebar__block" aria-label="Top lists">
      <h2 class="sidebar__heading">Top</h2>
      <ul class="sidebar__nav">
        <li>
          <RouterLink
            to="/"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': activeListSlug === 'all' }"
            @click="onTopNavClick"
          >
            <span class="sidebar__icon" aria-hidden="true">
              <Icon icon="mdi:view-grid-outline" width="18" height="18" />
            </span>
            All Games
          </RouterLink>
        </li>
        <li v-for="item in topNavItems" :key="item.slug">
          <RouterLink
            :to="TOP_LISTS[item.slug].path"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': activeListSlug === item.slug }"
            @click="onTopNavClick"
          >
            <span class="sidebar__icon" aria-hidden="true">
              <Icon :icon="item.icon" width="18" height="18" />
            </span>
            {{ item.label }}
          </RouterLink>
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

.sidebar__head {
  display: none;
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

.sidebar__panel-title {
  margin: 0;
  font-size: 1rem;
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

.sidebar__link--active,
.sidebar__link.router-link-active {
  background: #252525;
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

@media (max-width: 980px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    width: min(300px, 88vw);
    height: 100svh;
    padding: 1rem 1rem 2rem;
    border-right: 1px solid #2a2a2a;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: none;
  }

  .sidebar--open {
    transform: translateX(0);
    box-shadow: 8px 0 32px rgba(0, 0, 0, 0.55);
  }

  .sidebar__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #2a2a2a;
  }

  .sidebar__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: #202020;
    color: #fff;
    cursor: pointer;
  }

  .sidebar__close:hover {
    background: #2a2a2a;
  }
}
</style>
