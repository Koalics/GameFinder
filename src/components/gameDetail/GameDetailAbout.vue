<script setup>
defineProps({
  html: { type: String, default: '' },
})
</script>

<template>
  <section v-if="html" class="about" aria-labelledby="about-heading">
    <h2 id="about-heading" class="about__h">About</h2>
    <div class="about__body" v-html="html" />
  </section>
</template>

<style scoped>
.about {
  margin-bottom: 2rem;
}

.about__h {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
}

.about__body {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: #c4c4c4;
}

.about__body :deep(p) {
  margin: 0 0 1rem;
}

.about__body :deep(p:last-child) {
  margin-bottom: 0;
}

.about__body :deep(a) {
  color: #86efac;
}

.about__body :deep(h1),
.about__body :deep(h2),
.about__body :deep(h3) {
  color: #fff;
  font-size: 1rem;
  margin: 1.25rem 0 0.5rem;
}

.about__body :deep(ul),
.about__body :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
}
</style>
