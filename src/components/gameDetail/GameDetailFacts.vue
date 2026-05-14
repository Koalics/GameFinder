<script setup>
defineProps({
  platforms: { type: String, default: '—' },
  releaseDate: { type: String, default: '—' },
  genres: { type: String, default: '—' },
  developers: { type: String, default: '—' },
})
</script>

<template>
  <dl class="facts">
    <div class="facts__row">
      <dt class="facts__dt">Platforms</dt>
      <dd class="facts__dd">{{ platforms }}</dd>
    </div>
    <div class="facts__row">
      <dt class="facts__dt">Release date</dt>
      <dd class="facts__dd">{{ releaseDate }}</dd>
    </div>
    <div class="facts__row">
      <dt class="facts__dt">Genre</dt>
      <dd class="facts__dd">{{ genres }}</dd>
    </div>
    <div class="facts__row">
      <dt class="facts__dt">Developer</dt>
      <dd class="facts__dd">{{ developers }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 2rem;
  margin: 0 0 2rem;
}

@media (max-width: 640px) {
  .facts {
    grid-template-columns: 1fr;
  }
}

.facts__row {
  margin: 0;
}

.facts__dt {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #808080;
}

.facts__dd {
  margin: 0;
  font-size: 0.9375rem;
  color: #e8e8e8;
  line-height: 1.45;
}
</style>
