<script setup>
import { computed } from 'vue'

const props = defineProps({ data: { type: Array, required: true } })
const width = 760
const height = 230
const pad = 28
const maxValue = computed(() => Math.max(...props.data.flatMap((item) => [item.calls, item.results])) * 1.12)
function points(key) {
  return props.data.map((item, index) => {
    const x = pad + index * ((width - pad * 2) / Math.max(props.data.length - 1, 1))
    const y = height - pad - (item[key] / maxValue.value) * (height - pad * 2)
    return `${x},${y}`
  }).join(' ')
}
</script>

<template>
  <div class="line-chart">
    <svg viewBox="0 0 760 230" role="img" aria-label="平台调用与成果趋势折线图">
      <g class="chart-grid"><line v-for="n in 4" :key="n" x1="28" x2="732" :y1="28 + (n - 1) * 58" :y2="28 + (n - 1) * 58" /></g>
      <polyline class="series calls" :points="points('calls')" />
      <polyline class="series results" :points="points('results')" />
      <g v-for="(item, index) in data" :key="item.label">
        <circle class="point calls" :cx="28 + index * (704 / Math.max(data.length - 1, 1))" :cy="230 - 28 - (item.calls / maxValue) * 174" r="4" />
        <circle class="point results" :cx="28 + index * (704 / Math.max(data.length - 1, 1))" :cy="230 - 28 - (item.results / maxValue) * 174" r="4" />
        <text :x="28 + index * (704 / Math.max(data.length - 1, 1))" y="224" text-anchor="middle">{{ item.label }}</text>
      </g>
    </svg>
  </div>
</template>
