<script setup>
import PlatformIcon from '../icons/PlatformIcon.vue';

defineProps({
  releaseBadge: { type: String, default: '—' },
  /** @type {('windows'|'playstation'|'xbox')[]} */
  platforms: { type: Array, default: () => [] },
  playtimeHours: { type: Number, default: 0 },
  title: { type: String, required: true },
  metacritic: { type: Number, default: null },
});
</script>

<template>
  <div class="hero-meta">
    <div class="hero-meta__row">
      <span class="hero-meta__date">{{ releaseBadge }}</span>
      <div class="hero-meta__icons" aria-label="Platforms">
        <span
          v-if="platforms.includes('windows')"
          class="hero-meta__plat"
          title="Windows"
        >
          <PlatformIcon name="windows" :size="16" />
        </span>
        <span
          v-if="platforms.includes('playstation')"
          class="hero-meta__plat"
          title="PlayStation"
        >
          <PlatformIcon name="playstation" :size="16" />
        </span>
        <span
          v-if="platforms.includes('xbox')"
          class="hero-meta__plat"
          title="Xbox"
        >
          <PlatformIcon name="xbox" :size="16" />
        </span>
      </div>
      <p v-if="playtimeHours > 0" class="hero-meta__play">
        Average playtime: <strong>{{ playtimeHours }} hours</strong>
      </p>
    </div>

    <h1 class="hero-meta__title">{{ title }}</h1>

    <div v-if="metacritic != null" class="hero-meta__mc">
      <span class="hero-meta__mc-label">Metascore</span>
      <span class="hero-meta__mc-badge">{{ metacritic }}</span>
    </div>
  </div>
</template>

<style scoped>
.hero-meta__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.hero-meta__date {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  background: #fff;
  color: #111;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.hero-meta__icons {
  display: flex;
  gap: 0.4rem;
}

.hero-meta__plat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
}

.hero-meta__play {
  margin: 0;
  margin-left: auto;
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a8a8a8;
}

.hero-meta__play strong {
  color: #e0e0e0;
  font-weight: 600;
  text-transform: uppercase;
}

.hero-meta__title {
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.hero-meta__mc {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hero-meta__mc-label {
  font-size: 0.875rem;
  color: #c0c0c0;
}

.hero-meta__mc-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border-radius: 8px;
  background: #16a34a;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
}

@media (max-width: 720px) {
  .hero-meta__play {
    margin-left: 0;
    width: 100%;
  }
}
</style>
