<script setup>
defineProps({
  title: { type: String, required: true },
  image: { type: String, default: '' },
  releaseDate: { type: String, required: true },
  /** @type {string[]} */
  genres: { type: Array, default: () => [] },
  /** @type {('windows'|'playstation'|'xbox')[]} */
  platforms: { type: Array, default: () => [] },
})
</script>

<template>
  <article class="card" role="listitem">
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
        <span v-if="platforms.includes('windows')" class="card__plat" title="Windows">
          <svg viewBox="0 0 88 88" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M0 12.5 37.8 7.1V42.4H0V12.5zm0 32.2h37.8v35.2L0 74.5V44.7zm41.8-38.7L88 0v42.4H41.8V6zm0 38.6H88V88L41.8 80.9V44.6z"
            />
          </svg>
        </span>
        <span v-if="platforms.includes('playstation')" class="card__plat" title="PlayStation">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9.5 17.5c-.5 0-1-.2-1.4-.6L6 14.8c-.4-.4-.6-1-.4-1.5l1-3c.2-.5.7-.8 1.3-.8h.3l2.7.7c.3.1.5.3.6.5l.5 1.5c.2.5 0 1-.4 1.4l-2.1 2.1c-.4.4-.9.6-1.4.6Zm5-13c.5 0 1 .2 1.4.6l2.1 2.1c.4.4.6 1 .4 1.5l-1 3c-.2.5-.7.8-1.3.8h-.3l-2.7-.7a1.3 1.3 0 0 1-.6-.5l-.5-1.5c-.2-.5 0-1 .4-1.4l2.1-2.1c.4-.4.9-.6 1.4-.6Z"
            />
          </svg>
        </span>
        <span v-if="platforms.includes('xbox')" class="card__plat" title="Xbox">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6" />
            <path
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              d="m8.5 8.5 7 7m0-7-7 7"
            />
          </svg>
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
  border-radius: 12px;
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
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  gap: 0.35rem;
}

.card__plat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 6px;
  color: #fff;
}

.card__body {
  padding: 0.875rem 1rem 1rem;
}

.card__title {
  margin: 0 0 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.35;
}

.card__meta {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: #808080;
  line-height: 1.4;
}
</style>
