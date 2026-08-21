<script setup>
import { computed, ref } from 'vue'
import { Activity, Building2, Clock3, FileText, Search, UsersRound } from '@lucide/vue'
import BaseSelect from '../components/BaseSelect.vue'
import { useUiStore } from '../stores/ui.js'
import { agentUsage } from '../data/demo.js'
import { appPerformance, cockpitPeriods, cockpitScopes, sourceCatalog } from '../data/platform.js'

const ui = useUiStore()
const draftPeriod = ref('month')
const draftScope = ref('group')
const activePeriod = ref('month')
const activeScope = ref('group')
const activeApp = ref('semantic')
const appTones = ['#3fcdf4', '#54d7bd', '#82aefa', '#f0bd4f', '#bf8cf0', '#fb8196']
const periodTabs = [
  { value: 'month', label: '月' },
  { value: 'quarter', label: '季度' },
  { value: 'year', label: '年' },
]
const cockpitPeriodOptions = cockpitPeriods.map((item) => ({ value: item.id, label: item.name }))
const cockpitScopeOptions = cockpitScopes.map((item) => ({ value: item.id, label: item.name }))

const selectedPeriod = computed(() => cockpitPeriods.find((item) => item.id === activePeriod.value) || cockpitPeriods[2])
const selectedScope = computed(() => cockpitScopes.find((item) => item.id === activeScope.value) || cockpitScopes[0])
const groupScope = computed(() => cockpitScopes[0])
const scopeShare = computed(() => selectedScope.value.calls / groupScope.value.calls)
const periodScale = computed(() => selectedPeriod.value.scale)
const activeUsers = computed(() => Math.max(1, Math.round(selectedScope.value.activeUsers * selectedPeriod.value.userScale)))
const callTotal = computed(() => Math.round(selectedScope.value.calls * periodScale.value))
const reportTotal = computed(() => Math.round(selectedScope.value.reports * periodScale.value))
const reviewTotal = computed(() => Math.round(selectedScope.value.reviews * periodScale.value))
const responseSeconds = computed(() => selectedScope.value.responseSeconds)
const outputRatio = computed(() => Math.round(reportTotal.value / Math.max(callTotal.value, 1) * 1000) / 10)
const sourceSampleTotal = computed(() => Object.values(sourceCatalog).flat().length)

function number(value) {
  return new Intl.NumberFormat('zh-CN').format(value)
}

function applyFilters() {
  activePeriod.value = draftPeriod.value
  activeScope.value = draftScope.value
  activeApp.value = 'semantic'
  ui.notify(`已更新为“${selectedScope.value.name} · ${selectedPeriod.value.name}”本地演示汇总`, 'success')
}

function selectPeriod(period) {
  draftPeriod.value = period
  activePeriod.value = period
  activeApp.value = 'semantic'
}

const trendData = computed(() => selectedPeriod.value.trend.map((item) => ({
  ...item,
  calls: Math.round(item.calls * scopeShare.value),
  results: Math.round(item.results * scopeShare.value),
})))

function miniLine(values, width = 132, height = 34) {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)
  const points = values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : index / (values.length - 1) * width
    const y = height - ((value - min) / range * (height - 7) + 3)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return { points, area: `0,${height} ${points} ${width},${height}` }
}

function multiLineGeometry(rawSeries, width = 730, height = 214, left = 34, right = 13, top = 16, bottom = 30) {
  const allValues = rawSeries.flatMap((item) => item.values)
  const max = Math.max(...allValues, 1)
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const count = Math.max(...rawSeries.map((item) => item.values.length), 1)
  const convert = (value, index) => {
    const x = count === 1 ? left + plotWidth / 2 : left + index / (count - 1) * plotWidth
    const y = top + (1 - value / max) * plotHeight
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) }
  }
  const series = rawSeries.map((item) => {
    const points = item.values.map(convert)
    return {
      ...item,
      points,
      path: points.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' '),
      area: `M${points[0].x} ${height - bottom} ${points.map((point) => `L${point.x} ${point.y}`).join(' ')} L${points.at(-1).x} ${height - bottom} Z`,
    }
  })
  return {
    width, height, left, right, top, bottom, max,
    grid: [0, .25, .5, .75, 1].map((step) => ({ value: Math.round(max * (1 - step)), y: top + step * plotHeight })),
    labels: Array.from({ length: count }, (_, index) => ({ x: convert(0, index).x, label: (trendData.value[index]?.label || '').replace(/\s+/g, '') })),
    series,
  }
}

const appNodes = computed(() => appPerformance.map((item, index) => ({
  id: agentUsage[index]?.id || `app-${index}`,
  name: item.name,
  calls: Math.round(item.calls * periodScale.value * scopeShare.value),
  outputs: Math.round(item.outputs * periodScale.value * scopeShare.value),
  duration: item.duration.replace(/\s+/g, ''),
  ratio: Math.round(item.outputs / Math.max(item.calls, 1) * 1000) / 10,
  tone: appTones[index],
})))
const appMax = computed(() => Math.max(...appNodes.value.map((item) => item.calls), 1))
const appTrendChart = computed(() => multiLineGeometry(appNodes.value.map((app) => ({
  ...app,
  values: trendData.value.map((point) => Math.round(point.calls * app.calls / Math.max(callTotal.value, 1))),
}))))
const activityUsers = computed(() => {
  const maxCalls = Math.max(...trendData.value.map((item) => item.calls), 1)
  return trendData.value.map((item) => Math.max(1, Math.round(activeUsers.value * item.calls / maxCalls)))
})
const activityFrequency = computed(() => activityUsers.value.map((users, index) => Math.round(trendData.value[index].calls / Math.max(users, 1) * 10) / 10))
const activityUserChart = computed(() => multiLineGeometry([{ id: 'users', tone: '#50d9ba', values: activityUsers.value }], 780, 188, 28, 15, 14, 29))
const activityFrequencyChart = computed(() => multiLineGeometry([{ id: 'frequency', tone: '#43caf5', values: activityFrequency.value }], 780, 188, 28, 15, 14, 29))
const metricCards = computed(() => [
  { id: 'calls', label: 'AI 应用调用', value: number(callTotal.value), unit: '次', note: `当期 ${trendData.value.at(-1)?.calls || 0} 次`, tone: '#42cdf5', icon: Activity, trend: miniLine(trendData.value.map((item) => item.calls)) },
  { id: 'output', label: '结果记录占比', value: outputRatio.value.toFixed(1), unit: '%', note: '结果记录 ÷ 调用记录', tone: '#51d6b8', icon: FileText, trend: miniLine(trendData.value.map((item) => item.results / Math.max(item.calls, 1) * 100)) },
  { id: 'response', label: '平均系统响应', value: number(responseSeconds.value), unit: '秒', note: '运行事件本地样例', tone: '#e8b84b', icon: Clock3, trend: miniLine(trendData.value.map((item, index) => responseSeconds.value + (index % 3 - 1) * 9)) },
  { id: 'users', label: '调用用户数', value: number(activeUsers.value), unit: '人', note: 'user_id 去重样例', tone: '#72adff', icon: UsersRound, trend: miniLine(activityUsers.value) },
])
const taskBars = computed(() => [
  { id: 'calls', label: '调用记录', value: callTotal.value, tone: '#43ccf4', width: 100 },
  { id: 'outputs', label: '结果记录', value: reportTotal.value, tone: '#54d3ba', width: reportTotal.value / Math.max(callTotal.value, 1) * 100 },
  { id: 'reviews', label: '复核记录', value: reviewTotal.value, tone: '#e6ba58', width: reviewTotal.value / Math.max(callTotal.value, 1) * 100 },
  { id: 'sources', label: '资料样例', value: sourceSampleTotal.value, tone: '#e9859a', width: sourceSampleTotal.value / Math.max(callTotal.value, 1) * 100 },
])
</script>

<template>
  <section class="page-container cockpit-page ops-cockpit">
    <header class="ops-command-bar">
      <div class="ops-command-title"><h1>集团全域运营概览</h1></div>
      <div class="ops-command-controls">
        <nav aria-label="统计周期"><button v-for="tab in periodTabs" :key="tab.value" type="button" :class="{ active: activePeriod === tab.value }" @click="selectPeriod(tab.value)">{{ tab.label }}</button></nav>
        <form @submit.prevent="applyFilters"><BaseSelect v-model="draftScope" :options="cockpitScopeOptions" aria-label="选择组织范围" tone="dark" size="sm" /><button type="submit" aria-label="应用驾驶舱筛选"><Search :size="15" /></button></form>
      </div>
    </header>

    <section class="ops-metric-grid" aria-label="运营核心指标">
      <button v-for="card in metricCards" :key="card.id" type="button" class="ops-metric-card" :style="{ '--metric-tone': card.tone }" @click="activeApp = card.id === 'users' ? activeApp : 'semantic'">
        <span>{{ card.label }}</span><component :is="card.icon" :size="17" class="ops-metric-icon" /><b>{{ card.value }}<small>{{ card.unit }}</small></b>
        <svg class="ops-metric-spark" viewBox="0 0 132 34" preserveAspectRatio="none" aria-hidden="true"><polygon :points="card.trend.area" /><polyline :points="card.trend.points" /></svg>
        <em>{{ card.note }}</em><i />
      </button>
    </section>

    <section class="ops-primary-grid">
      <section class="ops-panel ops-task-board" aria-label="应用任务看板">
        <header class="ops-panel-heading"><h2><span>02 /</span> 应用任务看板</h2><p>6 个应用 · 本地演示统计</p></header>
        <div class="ops-task-content">
          <section class="ops-app-health" aria-label="六项应用调用卡片">
            <span>应用调用记录</span>
            <div>
              <button v-for="app in appNodes" :key="app.id" type="button" :class="{ active: activeApp === app.id }" :style="{ '--app-tone': app.tone }" @click="activeApp = app.id"><b>{{ app.name }}</b><small><i />本地统计</small><em><span>调用 {{ number(app.calls) }}</span><strong>{{ number(app.outputs) }} 条</strong></em></button>
            </div>
          </section>
          <section class="ops-task-distribution" aria-label="记录分布">
            <header><span>记录分布</span><b>当前范围</b></header>
            <button v-for="bar in taskBars" :key="bar.id" type="button" :style="{ '--bar-tone': bar.tone, '--bar-width': `${Math.max(7, bar.width)}%` }"><span>{{ bar.label }}</span><strong>{{ number(bar.value) }}</strong><i><u /></i></button>
          </section>
        </div>
      </section>

      <section class="ops-panel ops-performance-board" aria-label="应用性能看板">
        <header class="ops-panel-heading"><h2><span>03 /</span> 应用性能看板</h2><p>结果记录 / 调用 · 本地占比分摊趋势</p></header>
        <div class="ops-performance-content">
          <section class="ops-performance-matrix" aria-label="应用统计矩阵"><header><span>AI 应用</span><span>结果记录占比</span><span>平均时长</span></header><button v-for="app in appNodes" :key="app.id" type="button" :class="{ active: activeApp === app.id }" :style="{ '--app-tone': app.tone }" @click="activeApp = app.id"><b>{{ app.name }}</b><span><i :style="{ width: `${app.ratio}%` }" /><strong>{{ app.ratio }}%</strong></span><em>{{ app.duration }}</em></button></section>
          <section class="ops-trend-field" aria-label="六项应用调用趋势"><div class="ops-trend-legend"><span v-for="app in appNodes" :key="app.id" :style="{ '--legend-tone': app.tone }"><i />{{ app.name }}</span></div><svg :viewBox="`0 0 ${appTrendChart.width} ${appTrendChart.height}`" preserveAspectRatio="none"><g class="ops-chart-grid"><line v-for="grid in appTrendChart.grid" :key="grid.y" :x1="appTrendChart.left" :x2="appTrendChart.width - appTrendChart.right" :y1="grid.y" :y2="grid.y" /></g><path v-for="(series, index) in appTrendChart.series" :key="`${series.id}-area`" :d="series.area" :fill="index === 0 ? `${series.tone}20` : 'transparent'" /><g v-for="series in appTrendChart.series" :key="series.id"><path class="ops-chart-line" :d="series.path" :stroke="series.tone" /><circle v-for="(point, index) in series.points" :key="index" :cx="point.x" :cy="point.y" r="2.6" :fill="series.tone" /></g><text v-for="label in appTrendChart.labels" :key="label.label" :x="label.x" :y="appTrendChart.height - 7" text-anchor="middle">{{ label.label }}</text></svg></section>
        </div>
      </section>
    </section>

    <section class="ops-panel ops-activity-board" aria-label="用户活跃度统计">
      <header class="ops-panel-heading"><h2><span>04 /</span> 用户活跃度统计</h2><p>有效行为：调用应用、查看历史记录</p></header>
      <div class="ops-activity-grid">
        <section class="ops-activity-chart"><div class="ops-activity-copy"><span>月活跃调用用户</span><small>按调用节奏映射的本地样例</small><b>{{ number(activeUsers) }}<em>人</em></b><p>调用用户 <strong>{{ number(activeUsers) }}</strong> 人</p></div><svg :viewBox="`0 0 ${activityUserChart.width} ${activityUserChart.height}`" preserveAspectRatio="none"><g class="ops-chart-grid"><line v-for="grid in activityUserChart.grid" :key="grid.y" :x1="activityUserChart.left" :x2="activityUserChart.width - activityUserChart.right" :y1="grid.y" :y2="grid.y" /></g><path :d="activityUserChart.series[0].area" fill="rgba(80,217,186,.17)" /><path class="ops-chart-line" :d="activityUserChart.series[0].path" stroke="#50d9ba" /><circle v-for="(point, index) in activityUserChart.series[0].points" :key="index" :cx="point.x" :cy="point.y" r="3" fill="#50d9ba" /><text v-for="label in activityUserChart.labels" :key="label.label" :x="label.x" :y="activityUserChart.height - 7" text-anchor="middle">{{ label.label }}</text></svg></section>
        <section class="ops-activity-chart"><div class="ops-activity-copy"><span>人均调用频次</span><small>调用记录 ÷ 调用用户</small><b>{{ (callTotal / activeUsers).toFixed(1) }}<em>次 / 人</em></b><p>总调用 <strong>{{ number(callTotal) }}</strong> 次</p></div><svg :viewBox="`0 0 ${activityFrequencyChart.width} ${activityFrequencyChart.height}`" preserveAspectRatio="none"><g class="ops-chart-grid"><line v-for="grid in activityFrequencyChart.grid" :key="grid.y" :x1="activityFrequencyChart.left" :x2="activityFrequencyChart.width - activityFrequencyChart.right" :y1="grid.y" :y2="grid.y" /></g><path :d="activityFrequencyChart.series[0].area" fill="rgba(67,202,245,.17)" /><path class="ops-chart-line" :d="activityFrequencyChart.series[0].path" stroke="#43caf5" /><circle v-for="(point, index) in activityFrequencyChart.series[0].points" :key="index" :cx="point.x" :cy="point.y" r="3" fill="#43caf5" /><text v-for="label in activityFrequencyChart.labels" :key="label.label" :x="label.x" :y="activityFrequencyChart.height - 7" text-anchor="middle">{{ label.label }}</text></svg></section>
      </div>
    </section>
    <footer class="ops-disclosure"><Building2 :size="13" />本页为本地演示数据汇总；应用趋势按当前调用占比分摊，用于展示驾驶舱版式，不代表实时生产统计。</footer>
  </section>
</template>
