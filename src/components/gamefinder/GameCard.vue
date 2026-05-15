<script setup>
import PlatformIcon from '../icons/PlatformIcon.vue';

defineProps({
  title: { type: String, required: true },
  image: { type: String, default: '' },
  releaseDate: { type: String, required: true },
  /** @type {string[]} */
  genres: { type: Array, default: () => [] },
  /** @type {('windows'|'playstation'|'xbox')[]} */
  platforms: { type: Array, default: () => [] },
});
</script>

<template>
  <article class="card">
    <div class="card__media">
      <img
        v-if="image"
        class="card__img"
        :src="image"
        :alt="title"
        loading="lazy"
        width="640"
        height="360"
      />
      <div v-else class="card__ph" aria-hidden="true" />
      <div class="card__platforms" aria-label="Platforms">
        <span
          v-if="platforms.includes('windows')"
          class="card__plat"
          title="Windows"
        >
          <PlatformIcon name="windows" :size="16" />
        </span>
        <span
          v-if="platforms.includes('playstation')"
          class="card__plat"
          title="PlayStation"
        >
          <PlatformIcon name="playstation" :size="16" />
        </span>
        <span v-if="platforms.includes('xbox')" class="card__plat" title="Xbox">
          <PlatformIcon name="xbox" :size="16" />
        </span>
      </div>
    </div>
    <div class="card__body">
      <h3 class="card__title">{{ title }}</h3>
      <p class="card__meta">Release date: {{ releaseDate }}</p>
      <p class="card__meta">Genres: {{ genres.join(', ') }}</p>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #202020;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #2a2a2a;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  border-color: #3a3a3a;
}

.card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #151515;
}

.card__ph {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card__platforms {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  display: flex;
  gap: 0.4rem;
}

.card__plat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 7px;
  color: #fff;
}

.card__body {
  padding: 1rem 1.125rem 1.125rem;
}

.card__title {
  margin: 0 0 0.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.35;
}

.card__meta {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #808080;
  line-height: 1.4;
}
</style>
