<script setup>
defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <header class="navbar">
    <a href="/" class="navbar__logo">GameFinder</a>
    <div class="navbar__search">
      <svg class="navbar__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2" />
        <path d="M16 16 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <input
        class="navbar__input"
        type="search"
        placeholder="Search games..."
        :value="modelValue"
        aria-label="Search games"
        @input="emit('update:modelValue', $event.target.value)"
      />
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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
  flex: 1;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.625rem;
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
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 0.9375rem;
  outline: none;
}

.navbar__input::placeholder {
  color: #606060;
}
</style>
