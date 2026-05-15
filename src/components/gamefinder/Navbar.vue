<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  modelValue: { type: String, default: '' },
  showFiltersMenu: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'submit', 'toggle-filters']);

function onEnter(e) {
  if (e.key === 'Enter') emit('submit');
}
</script>

<template>
  <header class="navbar">
    <RouterLink to="/" class="navbar__logo">GameFinder</RouterLink>

    <div class="navbar__search">
      <Icon
        class="navbar__search-icon"
        icon="mdi:magnify"
        width="18"
        height="18"
        aria-hidden="true"
      />
      <input
        class="navbar__input"
        type="search"
        placeholder="Search games..."
        :value="modelValue"
        aria-label="Search games"
        @input="emit('update:modelValue', $event.target.value)"
        @keydown="onEnter"
      />
    </div>

    <button
      v-if="showFiltersMenu"
      type="button"
      class="navbar__burger"
      aria-label="Open filters"
      @click="emit('toggle-filters')"
    >
      <Icon icon="mdi:menu" width="22" height="22" />
    </button>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  min-width: 0;
  padding: 0.875rem 1.5rem;
  background: #0d0d0d;
  border-bottom: 1px solid #2a2a2a;
}

.navbar__logo {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 1.125rem;
  color: #fff;
  text-decoration: none;
  letter-spacing: -0.02em;
}

.navbar__logo:hover {
  color: #e0e0e0;
}

.navbar__search {
  flex: 1 1 0;
  min-width: 0;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #202020;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: border-color 0.15s;
}

.navbar__search:focus-within {
  border-color: #404040;
}

.navbar__search-icon {
  flex-shrink: 0;
  color: #808080;
}

.navbar__input {
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 0.9375rem;
  outline: none;
}

.navbar__input::placeholder {
  color: #606060;
}

.navbar__burger {
  display: none;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  margin-left: auto;
  border: none;
  border-radius: 8px;
  background: #202020;
  color: #fff;
  cursor: pointer;
}

.navbar__burger:hover {
  background: #2a2a2a;
}

@media (max-width: 980px) {
  .navbar__burger {
    display: flex;
  }

  .navbar__search {
    margin: 0;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .navbar {
    gap: 0.5rem;
    padding: 0.75rem 0.75rem;
  }

  .navbar__logo {
    font-size: 1rem;
  }

  .navbar__search {
    padding: 0.45rem 0.625rem;
    gap: 0.375rem;
  }

  .navbar__search-icon {
    width: 16px !important;
    height: 16px !important;
  }

  .navbar__input {
    font-size: 0.875rem;
  }

  .navbar__input::placeholder {
    font-size: 0.8125rem;
  }

  .navbar__burger {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 420px) {
  .navbar__logo {
    font-size: 0.9375rem;
    max-width: 5.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media (max-width: 380px) {
  .navbar {
    gap: 0.375rem;
    padding: 0.625rem 0.625rem;
  }

  .navbar__logo {
    max-width: 5.1rem;
    font-size: 0.875rem;
  }

  .navbar__search {
    padding: 0.4rem 0.5rem;
  }
}
</style>
