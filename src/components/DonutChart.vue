<script setup>
import { computed } from 'vue'
const props = defineProps({ data: { type: Array, required: true }, totalLabel: { type: String, default: '占比' } })
const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))
const gradient = computed(() => {
  let start = 0
  return `conic-gradient(${props.data.map((item) => {
    const end = start + (item.value / total.value) * 100
    const segment = `${item.color} ${start}% ${end}%`
    start = end
    return segment
  }).join(',')})`
})
</script>

<template>
  <div class="donut-wrap">
    <div class="donut" :style="{ background: gradient }"><span><b>{{ total }}</b>{{ totalLabel }}</span></div>
    <div class="donut-legend">
      <div v-for="item in data" :key="item.id"><i :style="{ background: item.color }" /><span>{{ item.name }}</span><b>{{ item.value }}%</b></div>
    </div>
  </div>
</template>
