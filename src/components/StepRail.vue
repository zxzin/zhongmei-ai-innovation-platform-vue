<script setup>
import { Check } from '@lucide/vue'

defineProps({ steps: { type: Array, required: true }, current: { type: Number, default: 0 }, max: { type: Number, default: 0 } })
defineEmits(['select'])
</script>

<template>
  <nav class="step-rail" aria-label="任务步骤">
    <button v-for="(step, index) in steps" :key="step" type="button" :class="{ active: index === current, done: index < current }" :disabled="index > max" @click="$emit('select', index)">
      <i><Check v-if="index < current" :size="13" /><template v-else>{{ index + 1 }}</template></i>
      <span>{{ step }}</span>
    </button>
  </nav>
</template>
