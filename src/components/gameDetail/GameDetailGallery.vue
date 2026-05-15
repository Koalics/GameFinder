<script setup>
defineProps({
  /** @type {string[]} */
  images: { type: Array, default: () => [] },
});
</script>

<template>
  <section v-if="images.length" class="gal" aria-label="Screenshots">
    <div class="gal__hero">
      <img
        class="gal__img gal__img--main"
        :src="images[0]"
        alt=""
        loading="lazy"
      />
    </div>
    <div v-if="images.length > 1" class="gal__grid">
      <img
        v-for="(src, i) in images.slice(1, 5)"
        :key="i"
        class="gal__img gal__img--thumb"
        :src="src"
        alt=""
        loading="lazy"
      />
    </div>
  </section>
</template>

<style scoped>
.gal {
  margin-bottom: 1.75rem;
}

.gal__hero {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.65rem;
  background: #151515;
}

.gal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.gal__img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.gal__img--main {
  aspect-ratio: 16 / 9;
  max-height: 220px;
}

.gal__img--thumb {
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  background: #151515;
}
</style>
