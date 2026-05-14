<script setup>
defineProps({
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <div class="load-wrap">
    <button
      type="button"
      class="load-more"
      :disabled="disabled"
      :class="{ 'load-more--disabled': disabled }"
      aria-label="Load more games"
      @click="$emit('click')"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 12a8 8 0 0 1 8-8v3l4-4-4-4v3a10 10 0 1 0 10 10h-2a8 8 0 0 1-16 0Z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.load-wrap {
  display: flex;
  justify-content: center;
  padding: 2rem 0 1rem;
}

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid #2e2e2e;
  border-radius: 12px;
  background: #202020;
  color: #fff;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.15s;
}

.load-more:hover {
  background: #2a2a2a;
  border-color: #404040;
}

.load-more:disabled,
.load-more--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.load-more:disabled:hover,
.load-more--disabled:hover {
  background: #202020;
  border-color: #2e2e2e;
}
</style>
