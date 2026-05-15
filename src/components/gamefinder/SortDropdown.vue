<script setup>
defineProps({
  label: { type: String, default: '' },
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <label class="dropdown">
    <span v-if="label" class="dropdown__prefix">{{ label }}:</span>
    <span class="dropdown__wrap">
      <select
        class="dropdown__select"
        :value="modelValue"
        @change="emit('update:modelValue', $event.target.value)"
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <Icon
        class="dropdown__chevron"
        icon="mdi:chevron-down"
        width="16"
        height="16"
        aria-hidden="true"
      />
    </span>
  </label>
</template>

<style scoped>
.dropdown {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.dropdown__prefix {
  font-size: 0.8125rem;
  color: #a0a0a0;
  white-space: nowrap;
}

.dropdown__wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.dropdown__select {
  appearance: none;
  padding: 0.5rem 2rem 0.5rem 0.875rem;
  font-size: 0.8125rem;
  color: #fff;
  background: #202020;
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  cursor: pointer;
  min-width: 8rem;
}

.dropdown__select:hover {
  border-color: #404040;
}

.dropdown__chevron {
  position: absolute;
  right: 0.55rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #808080;
  display: block;
}
</style>
