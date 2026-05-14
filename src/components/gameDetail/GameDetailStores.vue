<script setup>
import StoreIcon from '../icons/StoreIcon.vue'

defineProps({
  /** @type {{ name: string, url: string, slug: string }[]} */
  stores: { type: Array, default: () => [] },
})
</script>

<template>
  <section v-if="stores.length" class="stores" aria-labelledby="stores-heading">
    <h2 id="stores-heading" class="stores__h">Where to buy</h2>
    <ul class="stores__grid">
      <li v-for="s in stores" :key="s.url" class="stores__cell">
        <a class="stores__btn" :href="s.url" target="_blank" rel="noopener noreferrer">
          <span class="stores__brand">
            <span class="stores__icon-wrap" aria-hidden="true">
              <StoreIcon :slug="s.slug" :size="22" />
            </span>
            <span class="stores__name">{{ s.name }}</span>
          </span>
          <Icon class="stores__ext" icon="mdi:open-in-new" width="14" height="14" aria-hidden="true" />
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.stores__h {
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #909090;
}

.stores__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.stores__btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  background: #202020;
  border: 1px solid #2e2e2e;
  color: #e8e8e8;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.stores__btn:hover {
  background: #2a2a2a;
  border-color: #404040;
}

.stores__brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}

.stores__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #151515;
  color: #e8e8e8;
}

.stores__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stores__ext {
  flex-shrink: 0;
  opacity: 0.65;
  color: currentColor;
  display: block;
}
</style>
