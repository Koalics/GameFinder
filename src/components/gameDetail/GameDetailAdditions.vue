<script setup>
defineProps({
  /** @type {{ id: number, name: string }[]} */
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <section v-if="items.length" class="add" aria-labelledby="add-heading">
    <h2 id="add-heading" class="add__h">DLCs and editions</h2>
    <ul class="add__list">
      <li v-for="a in items" :key="a.id" class="add__item">{{ a.name }}</li>
    </ul>
  </section>
</template>

<style scoped>
.add {
  margin-bottom: 2rem;
}

.add__h {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.add__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add__item {
  padding: 0.65rem 0.875rem;
  border-radius: 8px;
  background: #1a1a1a;
  border: 1px solid #2e2e2e;
  font-size: 0.875rem;
  color: #d0d0d0;
}
</style>
