<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  gameName: { type: String, default: '' },
})
</script>

<template>
  <nav class="crumbs" aria-label="Breadcrumb">
    <RouterLink class="crumbs__link" to="/">Home</RouterLink>
    <span class="crumbs__sep" aria-hidden="true">/</span>
    <RouterLink class="crumbs__link" to="/">Games</RouterLink>
    <span class="crumbs__sep" aria-hidden="true">/</span>
    <span class="crumbs__current">{{ gameName }}</span>
  </nav>
</template>

<style scoped>
.crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: #a0a0a0;
  margin-bottom: 1.25rem;
}

.crumbs__link {
  color: #c8c8c8;
  text-decoration: none;
}

.crumbs__link:hover {
  color: #fff;
  text-decoration: underline;
}

.crumbs__sep {
  color: #606060;
  user-select: none;
}

.crumbs__current {
  color: #e8e8e8;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
