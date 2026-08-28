<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Activity, ArrowDownRight, ArrowUpRight, Clock3, FileText, Info, Maximize2, Minimize2, UsersRound, X } from '@lucide/vue'
import BaseSelect from '../components/BaseSelect.vue'
import { useUiStore } from '../stores/ui.js'
import { agentUsage } from '../data/demo.js'
import { agentMap } from '../data/agents.js'
import { appPerformance, cockpitAppScopeProfiles, cockpitComparisonScopes, cockpitPeriods, cockpitScopes } from '../data/platform.js'
import {
  buildApplicationMetricRows,
  buildComparisonMetricUnit,
  buildScopeMetricSnapshot,
  comparisonTertiarySources as selectComparisonTertiarySources,
  distributeMetricTotal,
  operationMetricDefinitionGroups,
} from '../data/operationMetrics.js'

const ui = useUiStore()
const activePeriod = ref('month')
const activeScope = ref('group')
const comparisonHover = ref(null)
const comparisonChartContainer = ref(null)
const comparisonChartSize = ref({ width: 760, height: 244 })
const callTrendChartContainer = ref(null)
const callTrendChartSize = ref({ width: 620, height: 184 })
const activeUserTrendChartContainer = ref(null)
const activeUserTrendChartSize = ref({ width: 300, height: 184 })
const isDataDefinitionOpen = ref(false)
const dataDefinitionPanel = ref(null)
const appTones = ['#52c9ef', '#66d6bf', '#8ba8ed', '#ddb46a', '#b99ae9', '#e78296']
const cockpitAppOrder = ['技术问答', '语义检索', '技术预研报告', '创新性分析', '可行性分析', '技术交底书撰写']
let comparisonChartObserver
let lineChartObserver
const periodTabs = [
  { value: 'day', label: '日' },
  { value: 'month', label: '月' },
  { value: 'quarter', label: '季度' },
  { value: 'year', label: '年' },
]
const dataDefinitionGroups = operationMetricDefinitionGroups

const cockpitScopeOptions = computed(() => cockpitScopes.flatMap((scope) => [
  {
    value: scope.id,
    label: scope.id === 'group' ? '全集团' : scope.name,
    detail: scope.id === 'group' ? '总部' : '二级单位',
  },
  ...(scope.id === 'group' ? [] : scope.children.map((child, index) => ({
    value: `${scope.id}__${index}`,
    label: child.name,
    detail: '三级单位',
  }))),
]))

function number(value) {
  return new Intl.NumberFormat('zh-CN').format(value)
}

function percent(value) {
  return `${Math.round(value * 10) / 10}%`
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function resolveScope(id) {
  const direct = cockpitScopes.find((scope) => scope.id === id)
  if (direct) {
    return {
      ...direct,
      level: direct.id === 'group' ? '总部' : '二级单位',
    }
  }

  const [parentId, childIndex] = id.split('__')
  const parent = cockpitScopes.find((scope) => scope.id === parentId) || cockpitScopes[0]
  const child = parent.children[Number(childIndex)] || parent.children[0]
  const userBase = Math.max(child.users, child.registeredUsers ?? Math.round(child.users / 0.7))

  return {
    id,
    name: child.name,
    level: '三级单位',
    parentName: parent.name,
    calls: child.calls,
    successfulCalls: Math.round(child.calls * 0.97),
    starts: child.startedTasks ?? child.tasks,
    tasks: child.tasks,
    completedTasks: child.completedTasks ?? Math.round(child.tasks * 0.97),
    reports: child.reports,
    reviews: Math.max(1, Math.round(child.tasks * 0.08)),
    activeUsers: child.users,
    registeredUsers: userBase,
    historicalLogins: Math.round(child.users * 8.8),
    firstResponseSeconds: parent.firstResponseSeconds,
    responseSeconds: parent.responseSeconds,
  }
}

const selectedPeriod = computed(() => cockpitPeriods.find((item) => item.id === activePeriod.value) || cockpitPeriods[2])
const selectedScope = computed(() => resolveScope(activeScope.value))
const groupScope = computed(() => cockpitScopes[0])
const scopeShare = computed(() => selectedScope.value.calls / groupScope.value.calls)
const scopeMetrics = computed(() => buildScopeMetricSnapshot(selectedScope.value, selectedPeriod.value))
const currentCalls = computed(() => scopeMetrics.value.calls)
const startedTasks = computed(() => scopeMetrics.value.startedTasks)
const completionRate = computed(() => scopeMetrics.value.completionRate)
const completedTasks = computed(() => scopeMetrics.value.completedTasks)
const activeUsers = computed(() => scopeMetrics.value.activeUsers)
const registeredUsers = computed(() => scopeMetrics.value.registeredUsers)
const activeRate = computed(() => scopeMetrics.value.activeRate ?? 0)
const successfulCalls = computed(() => scopeMetrics.value.successfulCalls)
const failedCalls = computed(() => scopeMetrics.value.failedCalls)
const callSuccessRate = computed(() => scopeMetrics.value.callSuccessRate ?? 0)
const perUserCallFrequency = computed(() => scopeMetrics.value.perUserCallFrequency)

function selectPeriod(period) {
  activePeriod.value = period
}

const isCockpitFullscreen = computed(() => ui.cockpitFullscreen)
const isFullscreenTransitioning = ref(false)

function scheduleCockpitChartSizeSync() {
  nextTick(() => {
    requestAnimationFrame(() => {
      syncComparisonChartSize()
      syncLineChartSizes()
    })
  })
}

async function openDataDefinition() {
  isDataDefinitionOpen.value = true
  await nextTick()
  dataDefinitionPanel.value?.focus()
}

function closeDataDefinition() {
  isDataDefinitionOpen.value = false
}

function handleCockpitKeydown(event) {
  if (event.key === 'Escape' && isDataDefinitionOpen.value) {
    closeDataDefinition()
    return
  }

  if (event.key !== 'Escape' || !ui.cockpitFullscreen) return

  ui.setCockpitFullscreen(false)
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {})
}

async function toggleCockpitFullscreen() {
  if (isFullscreenTransitioning.value) return

  const shouldEnterFullscreen = !ui.cockpitFullscreen
  isFullscreenTransitioning.value = true

  try {
    if (shouldEnterFullscreen) {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen()
        } catch {
          // Browser policy can reject native fullscreen; the cockpit still enters its focused layout.
        }
      }
      ui.setCockpitFullscreen(true)
      scheduleCockpitChartSizeSync()
      return
    }

    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen()
      } catch {
        // The browser may have already left fullscreen; the cockpit still restores its normal layout.
      }
    }
    ui.setCockpitFullscreen(false)
    scheduleCockpitChartSizeSync()
  } finally {
    isFullscreenTransitioning.value = false
  }
}

function handleFullscreenChange() {
  ui.setCockpitFullscreen(document.fullscreenElement === document.documentElement)
  scheduleCockpitChartSizeSync()
}

function syncComparisonChartSize() {
  const container = comparisonChartContainer.value
  const styles = container ? window.getComputedStyle(container) : null
  const horizontalPadding = styles ? parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight) : 0
  const verticalPadding = styles ? parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom) : 0
  const width = Math.round((container?.clientWidth || 0) - horizontalPadding)
  const height = Math.round((container?.clientHeight || 0) - verticalPadding)

  if (width < 260 || height < 120) return
  if (comparisonChartSize.value.width === width && comparisonChartSize.value.height === height) return
  comparisonChartSize.value = { width, height }
}

function syncLineChartSizes() {
  const syncChart = (element, sizeRef, minimumWidth = 180) => {
    const rect = element?.getBoundingClientRect()
    const width = Math.round(rect?.width || 0)
    const height = Math.round(rect?.height || 0)

    if (width < minimumWidth || height < 120) return
    if (sizeRef.value.width === width && sizeRef.value.height === height) return
    sizeRef.value = { width, height }
  }

  syncChart(callTrendChartContainer.value, callTrendChartSize, 240)
  syncChart(activeUserTrendChartContainer.value, activeUserTrendChartSize)
}

onMounted(() => {
  document.addEventListener('keydown', handleCockpitKeydown)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  window.addEventListener('resize', scheduleCockpitChartSizeSync)
  syncComparisonChartSize()
  syncLineChartSizes()

  if (typeof ResizeObserver !== 'undefined' && comparisonChartContainer.value) {
    comparisonChartObserver = new ResizeObserver(syncComparisonChartSize)
    comparisonChartObserver.observe(comparisonChartContainer.value)
  }

  if (typeof ResizeObserver !== 'undefined') {
    lineChartObserver = new ResizeObserver(syncLineChartSizes)
    if (callTrendChartContainer.value) lineChartObserver.observe(callTrendChartContainer.value)
    if (activeUserTrendChartContainer.value) lineChartObserver.observe(activeUserTrendChartContainer.value)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleCockpitKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  window.removeEventListener('resize', scheduleCockpitChartSizeSync)
  comparisonChartObserver?.disconnect()
  lineChartObserver?.disconnect()
  ui.setCockpitFullscreen(false)
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {})
  }
})

const trendData = computed(() => {
  const source = selectedPeriod.value.trend
  const calls = distributeMetricTotal(currentCalls.value, source.map((item) => item.calls))
  const results = distributeMetricTotal(successfulCalls.value, source.map((item) => item.results))

  return source.map((item, index) => ({ ...item, calls: calls[index], results: results[index] }))
})

function multiLineGeometry(rawSeries, width = 730, height = 214, left = 34, right = 13, top = 16, bottom = 30, labelData = [], domain = null) {
  const allValues = rawSeries.flatMap((item) => item.values)
  const dataMax = Math.max(...allValues, 1)
  const min = domain?.min ?? 0
  const max = domain?.max ?? dataMax
  const span = Math.max(max - min, 1e-6)
  const plotWidth = width - left - right
  const plotHeight = height - top - bottom
  const count = Math.max(...rawSeries.map((item) => item.values.length), 1)
  const convert = (value, index) => {
    const x = count === 1 ? left + plotWidth / 2 : left + index / (count - 1) * plotWidth
    const y = top + (1 - (value - min) / span) * plotHeight
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
    width, height, left, right, top, bottom, min, max,
    grid: [0, .25, .5, .75, 1].map((step) => ({ value: max - span * step, y: top + step * plotHeight })),
    labels: Array.from({ length: count }, (_, index) => ({
      index,
      x: convert(0, index).x,
      label: labelData[index]?.label || '',
      fullLabel: labelData[index]?.fullLabel || labelData[index]?.label || '',
    })),
    series,
  }
}

function trendAxisLabels(items) {
  return items.map((item, index) => ({
    label: Object.prototype.hasOwnProperty.call(item, 'axisLabel')
      ? item.axisLabel
      : (items.length <= 12 || index === 0 || index === items.length - 1 || (index + 1) % 5 === 0 ? item.label : ''),
    fullLabel: item.label,
  }))
}

const activeUserTrend = computed(() => {
  const source = selectedPeriod.value.trend
  const scopeRatio = selectedScope.value.activeUsers / Math.max(groupScope.value.activeUsers, 1)

  return source.map((item) => ({
    label: item.label,
    ...(Object.prototype.hasOwnProperty.call(item, 'axisLabel') ? { axisLabel: item.axisLabel } : {}),
    value: Math.max(0, Math.round((item.activeUsers || 0) * scopeRatio)),
  }))
})
const activeUserTrendChart = computed(() => {
  const values = activeUserTrend.value.map((item) => item.value)
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  const padding = Math.max(1, Math.ceil((maximum - minimum) * .18))
  const chart = multiLineGeometry(
    [{ id: 'active-users', name: '活跃用户数', tone: '#8ba8ed', values }],
    activeUserTrendChartSize.value.width,
    activeUserTrendChartSize.value.height,
    30,
    12,
    15,
    28,
    trendAxisLabels(activeUserTrend.value),
    { min: Math.max(0, minimum - padding), max: maximum + padding },
  )

  return { ...chart, series: chart.series[0] }
})
const activeUserTrendCaption = computed(() => ({
  day: '分时有效用户趋势',
  month: '每日有效用户趋势',
  quarter: '每周有效用户趋势',
  year: '半月有效用户趋势',
}[activePeriod.value]))

const scopeProfileKey = computed(() => activeScope.value.split('__')[0])
const scopeAppProfile = computed(() => cockpitAppScopeProfiles[scopeProfileKey.value] || cockpitAppScopeProfiles.group)
const appRows = computed(() => {
  const rows = buildApplicationMetricRows({
    apps: appPerformance,
    snapshot: scopeMetrics.value,
    profile: scopeAppProfile.value,
    scopeShare: scopeShare.value,
  })

  return rows.map((app, index) => {
    const agentId = agentUsage[index]?.id || `app-${index}`

    return {
      ...app,
      id: agentId,
      name: app.name,
      icon: agentMap[agentId]?.icon || Activity,
      completion: app.completionRate ?? 0,
      success: app.successRate ?? 0,
      completed: app.completedTasks,
      tone: appTones[index],
    }
  }).sort((first, second) => cockpitAppOrder.indexOf(first.name) - cockpitAppOrder.indexOf(second.name))
})
const onlineAppCount = computed(() => appRows.value.filter((app) => app.online).length)
const maxAppCalls = computed(() => Math.max(...appRows.value.map((app) => app.calls), 1))
const maxAppResponse = computed(() => Math.max(...appRows.value.map((app) => app.firstResponseSeconds), 1))
const appTrendRows = computed(() => {
  const apps = appRows.value
  const periodWeights = trendData.value.map((point) => point.calls)

  return apps.map((app, appIndex) => ({
    ...app,
    values: distributeMetricTotal(app.calls, periodWeights.map((weight, pointIndex) => {
      const primaryWave = Math.sin((pointIndex + 1) * .62 + appIndex * .91) * .12
      const secondaryWave = Math.sin((pointIndex + 1) * 1.08 + appIndex * .47) * .045
      return Math.max(.2, weight * (1 + primaryWave + secondaryWave))
    })),
  }))
})
const appTrendLabels = computed(() => trendAxisLabels(trendData.value))
const callTrendPeriodLabel = computed(() => ({
  day: '按时段 · 今日',
  month: '按日 · 近 30 天',
  quarter: '按周 · 近 90 天',
  year: '按半月 · 本年度',
}[activePeriod.value]))
const activeTrendPeriodLabel = computed(() => callTrendPeriodLabel.value)
const appCallTrendChart = computed(() => {
  const series = appTrendRows.value.map((app) => ({ id: app.id, name: app.name, tone: app.tone, values: app.values }))
  const dataMax = Math.max(...series.flatMap((item) => item.values), 1)
  const axisStep = niceAxisStep(dataMax / 4)
  const axisMax = Math.ceil(dataMax / axisStep) * axisStep

  return multiLineGeometry(
    series,
    callTrendChartSize.value.width,
    callTrendChartSize.value.height,
    38,
    12,
    15,
    28,
    appTrendLabels.value,
    { min: 0, max: axisMax },
  )
})
const comparisonTertiarySources = computed(() => selectComparisonTertiarySources(cockpitComparisonScopes, 10))

function makeComparisonUnit(unit) {
  return buildComparisonMetricUnit(unit, selectedPeriod.value)
}

const comparisonUnits = computed(() => {
  const secondaryUnits = cockpitComparisonScopes.map((scope) => makeComparisonUnit({
      id: scope.id,
      name: scope.name,
      level: '二级公司',
      calls: scope.calls,
      startedTasks: scope.startedTasks,
      completedTasks: scope.completedTasks,
      activeUsers: scope.activeUsers,
      registeredUsers: scope.registeredUsers,
    }))
  const makeTertiaryUnit = (child) => makeComparisonUnit({
    id: child.id,
    name: child.name,
    level: '三级公司',
    calls: child.calls,
    startedTasks: child.startedTasks,
    completedTasks: child.completedTasks,
    activeUsers: child.activeUsers,
    registeredUsers: child.registeredUsers,
  })

  if (activeScope.value === 'group') {
    return [...secondaryUnits, ...comparisonTertiarySources.value.map(makeTertiaryUnit)]
  }

  const selectedName = selectedScope.value.name
  if (activeScope.value.includes('__')) {
    const selectedChild = cockpitComparisonScopes
      .flatMap((scope) => scope.children)
      .find((child) => child.name === selectedName)
    return selectedChild ? [makeTertiaryUnit(selectedChild)] : []
  }

  const selectedBranch = cockpitComparisonScopes.find((scope) => scope.name === selectedName)
  return selectedBranch ? selectedBranch.children.map(makeTertiaryUnit) : []
})
const comparisonUnitCount = computed(() => comparisonUnits.value.length)
const comparisonIsDense = computed(() => comparisonUnitCount.value > 6)
const comparisonTitle = computed(() => '各级单位活跃与调用对比')
const comparisonScopeCaption = computed(() => `${selectedScope.value.name} · ${selectedPeriod.value.name}`)

function niceAxisStep(value) {
  const safeValue = Math.max(value, .1)
  const magnitude = 10 ** Math.floor(Math.log10(safeValue))
  const normalized = safeValue / magnitude
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10
  return step * magnitude
}

function comparisonLabelLines(name, charactersPerLine = 6) {
  const characters = Array.from(name)
  const lines = []

  for (let index = 0; index < characters.length; index += charactersPerLine) {
    lines.push(characters.slice(index, index + charactersPerLine).join(''))
  }

  return lines.length ? lines : ['']
}

const comparisonBarChart = computed(() => {
  const units = comparisonUnits.value
  const visibleWidth = Math.max(320, comparisonChartSize.value.width)
  const height = Math.max(230, comparisonChartSize.value.height)
  const fitAllUnits = isCockpitFullscreen.value && units.length > 0
  const frame = { left: 48, right: 48, top: 34, bottom: 56 }
  const minimumBandWidth = units.length > 10 ? 46 : units.length > 6 ? 64 : 92
  const contentMinimumWidth = frame.left + frame.right + Math.max(units.length, 1) * minimumBandWidth
  const width = fitAllUnits ? visibleWidth : Math.max(visibleWidth, contentMinimumWidth)
  const innerWidth = Math.max(180, width - frame.left - frame.right)
  const groupWidth = innerWidth / Math.max(units.length, 1)
  const labelCharactersPerLine = fitAllUnits && groupWidth < 40 ? 4 : fitAllUnits && groupWidth < 52 ? 5 : 6
  frame.bottom = labelCharactersPerLine <= 4 ? 64 : 56
  const innerHeight = Math.max(120, height - frame.top - frame.bottom)
  const callMaximum = Math.max(...units.map((unit) => unit.calls), 1)
  const callStep = niceAxisStep(callMaximum / 4)
  const callAxisMaximum = Math.max(callStep * 4, Math.ceil(callMaximum / callStep) * callStep)
  const barWidth = clamp(groupWidth * .24, fitAllUnits ? 5 : 8, 18)
  const barGap = clamp(groupWidth * .08, fitAllUnits ? 2 : 3, 7)
  const labelFontSize = fitAllUnits ? clamp(groupWidth * .15, 5.7, 7.2) : 7.5
  const levelFontSize = fitAllUnits ? clamp(groupWidth * .13, 5.2, 6.3) : 6.5
  const valueFontSize = fitAllUnits ? clamp(groupWidth * .15, 5.8, 7.2) : 7.5
  const labelLineHeight = labelCharactersPerLine <= 4 ? 8 : 9
  const baseline = height - frame.bottom
  const callTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4
    return {
      value: Math.round(callAxisMaximum * ratio),
      y: baseline - innerHeight * ratio,
    }
  })
  const activeTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4
    return {
      value: Math.round(100 * ratio),
      y: baseline - innerHeight * ratio,
    }
  })
  const groups = units.map((unit, index) => {
    const center = frame.left + groupWidth * (index + .5)
    const callHeight = unit.calls / callAxisMaximum * innerHeight
    const activeHeight = unit.activeRate / 100 * innerHeight
    return {
      ...unit,
      center,
      labelLines: comparisonLabelLines(unit.name, labelCharactersPerLine),
      callBar: {
        x: center - barGap / 2 - barWidth,
        y: baseline - callHeight,
        width: barWidth,
        height: callHeight,
      },
      activeBar: {
        x: center + barGap / 2,
        y: baseline - activeHeight,
        width: barWidth,
        height: activeHeight,
      },
    }
  })

  return { width, height, frame, baseline, callTicks, activeTicks, groups, labelFontSize, levelFontSize, valueFontSize, labelLineHeight }
})

function setComparisonHover(id) {
  comparisonHover.value = id
}

function clearComparisonHover(id) {
  if (comparisonHover.value === id) comparisonHover.value = null
}

const metricCards = computed(() => [
  {
    id: 'calls', label: '调用总量', value: number(currentCalls.value), unit: '次',
    tone: '#52c9ef', icon: Activity,
    comparison: selectedPeriod.value.comparison.calls, comparisonLabel: selectedPeriod.value.comparisonLabel, improved: true,
  },
  {
    id: 'completion', label: '任务完成率', value: percent(completionRate.value), unit: '',
    tone: '#54d6ba', icon: FileText,
    comparison: selectedPeriod.value.comparison.completion, comparisonLabel: selectedPeriod.value.comparisonLabel, improved: true,
  },
  {
    id: 'response', label: '平均首次响应', value: selectedScope.value.firstResponseSeconds.toFixed(1), unit: '秒',
    tone: '#e5b867', icon: Clock3,
    comparison: selectedPeriod.value.comparison.response, comparisonLabel: selectedPeriod.value.comparisonLabel, improved: true, lowerIsBetter: true,
  },
  {
    id: 'per-user-calls', label: '用户均调用频次', value: perUserCallFrequency.value === null ? '—' : perUserCallFrequency.value.toFixed(1), unit: '次 / 人',
    tone: '#b99ae9', icon: UsersRound,
    context: `${number(currentCalls.value)} 次 ÷ ${number(registeredUsers.value)} 人`,
  },
])
</script>

<template>
  <section class="page-container cockpit-page cockpit-view">
    <header class="cockpit-toolbar">
      <div class="cockpit-title">
        <h1>AI 应用运营驾驶舱</h1>
      </div>
      <div class="cockpit-controls">
        <nav aria-label="统计周期">
          <button v-for="tab in periodTabs" :key="tab.value" type="button" :class="{ active: activePeriod === tab.value }" @click="selectPeriod(tab.value)">{{ tab.label }}</button>
        </nav>
        <BaseSelect v-model="activeScope" :options="cockpitScopeOptions" aria-label="选择组织范围" tone="dark" size="sm" />
        <button class="cockpit-data-definition" type="button" aria-haspopup="dialog" :aria-expanded="isDataDefinitionOpen" @click="openDataDefinition"><Info :size="14" />统计口径</button>
        <button
          class="cockpit-fullscreen-toggle"
          type="button"
          :aria-label="isCockpitFullscreen ? '退出驾驶舱全屏' : '进入驾驶舱全屏'"
          :aria-busy="isFullscreenTransitioning"
          :disabled="isFullscreenTransitioning"
          :title="isCockpitFullscreen ? '退出全屏' : '全屏查看'"
          @click="toggleCockpitFullscreen"
        >
          <Minimize2 v-if="isCockpitFullscreen" :size="16" />
          <Maximize2 v-else :size="16" />
        </button>
      </div>
    </header>

    <section class="cockpit-panel cockpit-overview-panel" aria-label="运营概览">
      <header class="cockpit-panel-heading"><h2><span>01 /</span> 运营概览</h2><p>{{ selectedScope.name }} · {{ selectedPeriod.name }}</p></header>
      <div class="cockpit-overview-content">
        <section class="cockpit-kpi-grid" aria-label="运营核心指标">
          <article v-for="card in metricCards" :key="card.id" class="cockpit-kpi-card" :style="{ '--metric-tone': card.tone }">
            <header><span>{{ card.label }}</span><component :is="card.icon" :size="17" /></header>
            <b>{{ card.value }}<small>{{ card.unit }}</small></b>
            <p v-if="card.comparison" class="cockpit-kpi-comparison" :aria-label="`${card.label}${card.comparisonLabel}变化${card.comparison}`">
              <small>{{ card.comparisonLabel }}</small>
              <strong><ArrowDownRight v-if="card.lowerIsBetter" :size="13" /><ArrowUpRight v-else :size="13" />{{ card.comparison }}</strong>
            </p>
            <p v-else class="cockpit-kpi-context">{{ card.context }}</p>
          </article>
        </section>

        <div class="cockpit-overview-visuals">
          <div class="cockpit-call-overview">
            <section class="cockpit-call-trend" aria-label="六项智能应用调用次数趋势">
              <header><span>调用次数趋势</span><small>{{ callTrendPeriodLabel }}</small></header>
              <div class="cockpit-call-trend-legend" aria-label="智能应用图例">
                <span v-for="app in appTrendRows" :key="app.id" :style="{ '--app-tone': app.tone }"><i /><b>{{ app.name }}</b></span>
              </div>
              <div ref="callTrendChartContainer" class="cockpit-call-trend-chart">
                <svg :viewBox="`0 0 ${appCallTrendChart.width} ${appCallTrendChart.height}`" preserveAspectRatio="xMidYMid meet" role="img" :aria-label="`六项智能应用在${selectedPeriod.name}内的调用次数折线趋势`">
                  <g class="cockpit-chart-grid"><line v-for="grid in appCallTrendChart.grid" :key="grid.y" :x1="appCallTrendChart.left" :x2="appCallTrendChart.width - appCallTrendChart.right" :y1="grid.y" :y2="grid.y" /></g>
                  <g class="cockpit-call-trend-y-axis">
                    <text :x="appCallTrendChart.left - 7" y="10" text-anchor="end">次</text>
                    <text v-for="grid in appCallTrendChart.grid" :key="grid.y" :x="appCallTrendChart.left - 7" :y="grid.y + 3" text-anchor="end">{{ number(Math.round(grid.value)) }}</text>
                  </g>
                  <g v-for="series in appCallTrendChart.series" :key="series.id" :style="{ '--app-tone': series.tone }" class="cockpit-call-trend-series">
                    <path :d="series.path" />
                  </g>
                  <g class="cockpit-call-trend-x-axis"><text v-for="label in appCallTrendChart.labels" :key="label.index" :x="label.x" :y="appCallTrendChart.height - 7" text-anchor="middle">{{ label.label }}</text></g>
                </svg>
              </div>
            </section>
            <section class="cockpit-call-success" aria-label="调用成功率">
              <header><span>调用成功率</span></header>
              <div class="cockpit-call-success-pie" :style="{ '--success-rate': `${callSuccessRate}%` }" role="img" :aria-label="`调用成功率 ${percent(callSuccessRate)}`">
                <b>{{ percent(callSuccessRate) }}</b>
                <small>成功</small>
              </div>
              <div class="cockpit-call-success-stats">
                <p><strong>{{ number(successfulCalls) }}</strong><span>成功</span></p>
                <p><strong>{{ number(failedCalls) }}</strong><span>失败</span></p>
              </div>
            </section>
          </div>

          <section class="cockpit-active-user-trend" aria-label="活跃用户数趋势">
            <header><span>活跃用户数趋势</span><small>{{ activeTrendPeriodLabel }}</small></header>
            <div class="cockpit-active-user-summary" :aria-label="`${selectedPeriod.name}内活跃用户总数 ${number(activeUsers)} 人`">
              <span>{{ selectedPeriod.name }}内活跃用户总数</span>
              <b>{{ number(activeUsers) }}<small>人</small></b>
            </div>
            <div ref="activeUserTrendChartContainer" class="cockpit-active-user-chart">
              <svg :viewBox="`0 0 ${activeUserTrendChart.width} ${activeUserTrendChart.height}`" preserveAspectRatio="xMidYMid meet" role="img" :aria-label="`${selectedScope.name}${activeUserTrendCaption}`">
                <g class="cockpit-chart-grid"><line v-for="grid in activeUserTrendChart.grid" :key="grid.y" :x1="activeUserTrendChart.left" :x2="activeUserTrendChart.width - activeUserTrendChart.right" :y1="grid.y" :y2="grid.y" /></g>
                <g class="cockpit-call-trend-y-axis"><text v-for="grid in activeUserTrendChart.grid" :key="grid.y" :x="activeUserTrendChart.left - 6" :y="grid.y + 3" text-anchor="end">{{ number(grid.value) }}</text></g>
                <path class="cockpit-active-user-area" :d="activeUserTrendChart.series.area" />
                <path class="cockpit-active-user-line" :d="activeUserTrendChart.series.path" />
                <g class="cockpit-call-trend-x-axis"><text v-for="label in activeUserTrendChart.labels" :key="label.index" :x="label.x" :y="activeUserTrendChart.height - 7" text-anchor="middle">{{ label.label }}</text></g>
              </svg>
            </div>
          </section>
        </div>
      </div>
    </section>

    <section class="cockpit-comparison-wrap">
      <section class="cockpit-panel cockpit-comparison-panel" :class="{ 'is-dense': comparisonIsDense }" aria-label="组织使用情况横向对比">
        <header class="cockpit-panel-heading cockpit-comparison-heading">
          <div class="cockpit-comparison-heading-copy">
            <h2><span>02 /</span> {{ comparisonTitle }}</h2>
          </div>
          <p class="cockpit-comparison-scope">{{ comparisonScopeCaption }} · 跟随全局范围</p>
        </header>
        <div class="cockpit-comparison-content">
          <div class="cockpit-comparison-legend" aria-label="图表统计口径">
            <div class="cockpit-comparison-encoding">
              <span><i class="metric-calls" /><b>Agent 调用量</b><em>左轴 · 次</em></span>
              <span><i class="metric-active" /><b>用户活跃度</b><em>右轴 · %</em></span>
            </div>
          </div>
          <div ref="comparisonChartContainer" class="cockpit-comparison-chart">
            <svg
              :style="{
                minWidth: `${comparisonBarChart.width}px`,
                '--comparison-label-size': `${comparisonBarChart.labelFontSize}px`,
                '--comparison-level-size': `${comparisonBarChart.levelFontSize}px`,
                '--comparison-value-size': `${comparisonBarChart.valueFontSize}px`,
              }"
              :viewBox="`0 0 ${comparisonBarChart.width} ${comparisonBarChart.height}`"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              :aria-label="`${comparisonTitle}。红色柱表示 Agent 调用量，紫色柱表示用户活跃度；统计范围为${comparisonScopeCaption}。`"
            >
              <g class="cockpit-comparison-grid">
                <line v-for="tick in comparisonBarChart.callTicks" :key="`grid-${tick.value}`" :x1="comparisonBarChart.frame.left" :x2="comparisonBarChart.width - comparisonBarChart.frame.right" :y1="tick.y" :y2="tick.y" />
              </g>
              <line class="cockpit-comparison-axis" :x1="comparisonBarChart.frame.left" :x2="comparisonBarChart.width - comparisonBarChart.frame.right" :y1="comparisonBarChart.baseline" :y2="comparisonBarChart.baseline" />
              <g class="cockpit-comparison-ticks cockpit-comparison-call-axis">
                <text v-for="tick in comparisonBarChart.callTicks" :key="`call-${tick.value}`" :x="comparisonBarChart.frame.left - 8" :y="tick.y + 3" text-anchor="end">{{ number(tick.value) }}</text>
              </g>
              <g class="cockpit-comparison-ticks cockpit-comparison-active-axis">
                <text v-for="tick in comparisonBarChart.activeTicks" :key="`active-${tick.value}`" :x="comparisonBarChart.width - comparisonBarChart.frame.right + 8" :y="tick.y + 3" text-anchor="start">{{ tick.value }}%</text>
              </g>
              <text class="cockpit-comparison-axis-title calls-axis" x="7" y="13">Agent 调用量（次）</text>
              <text class="cockpit-comparison-axis-title active-axis" :x="comparisonBarChart.width - 7" y="13" text-anchor="end">用户活跃度（%）</text>
              <g class="cockpit-comparison-bar-layer">
                <g
                  v-for="group in comparisonBarChart.groups"
                  :key="group.id"
                  class="cockpit-comparison-bar-group"
                  :class="{ hovered: comparisonHover === group.id }"
                  role="img"
                  tabindex="0"
                  :aria-label="`${group.name}，${group.level}；Agent 调用量 ${number(group.calls)} 次，用户活跃度 ${percent(group.activeRate)}。`"
                  @mouseenter="setComparisonHover(group.id)"
                  @mouseleave="clearComparisonHover(group.id)"
                  @focus="setComparisonHover(group.id)"
                  @blur="clearComparisonHover(group.id)"
                >
                  <title>{{ group.name }}：Agent 调用量 {{ number(group.calls) }} 次，用户活跃度 {{ percent(group.activeRate) }}</title>
                  <rect class="cockpit-comparison-bar calls" :x="group.callBar.x" :y="group.callBar.y" :width="group.callBar.width" :height="group.callBar.height" rx="3" />
                  <rect class="cockpit-comparison-bar active" :x="group.activeBar.x" :y="group.activeBar.y" :width="group.activeBar.width" :height="group.activeBar.height" rx="3" />
                  <text class="cockpit-comparison-bar-value calls" :x="group.callBar.x + group.callBar.width / 2" :y="Math.max(25, group.callBar.y - 5)" text-anchor="middle">{{ number(group.calls) }}</text>
                  <text class="cockpit-comparison-bar-value active" :x="group.activeBar.x + group.activeBar.width / 2" :y="Math.max(25, group.activeBar.y - 5)" text-anchor="middle">{{ percent(group.activeRate) }}</text>
                  <text class="cockpit-comparison-bar-label" :x="group.center" :y="comparisonBarChart.baseline + 17" text-anchor="middle">
                    <tspan v-for="(line, lineIndex) in group.labelLines" :key="`${line}-${lineIndex}`" :x="group.center" :dy="lineIndex ? comparisonBarChart.labelLineHeight : 0">{{ line }}</tspan>
                    <tspan :x="group.center" :dy="comparisonBarChart.labelLineHeight" class="level">{{ group.level }}</tspan>
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>
    </section>

    <section class="cockpit-panel cockpit-performance-panel" aria-label="AI 应用运行与使用看板">
      <header class="cockpit-panel-heading"><h2><span>03 /</span> 智能应用运行与使用</h2><p>运行快照 {{ onlineAppCount }} / {{ appRows.length }} 正常 · 指标周期 {{ selectedPeriod.name }}</p></header>
      <section class="cockpit-agent-comparison" aria-label="六项智能应用运行状态与四项使用指标对比">
        <header><span>智能应用与运行状态</span><span>调用量</span><span>任务完成率</span><span>平均首次响应<small>越短越好</small></span><span>调用成功率</span></header>
        <article v-for="app in appRows" :key="app.id" :class="{ offline: !app.online }" :style="{ '--app-tone': app.tone }" :aria-label="`${app.name}，${app.online ? '正常运行' : '已停用'}，调用 ${number(app.calls)} 次，任务完成率 ${percent(app.completion)}`">
          <h3><i class="cockpit-performance-app-icon" aria-hidden="true"><component :is="app.icon" :size="15" /></i><b>{{ app.name }}</b><strong class="cockpit-agent-status"><i />{{ app.online ? '正常' : '停用' }}</strong></h3>
          <div class="calls" :style="{ '--metric-progress': `${app.calls / maxAppCalls * 100}%` }"><span><i /></span><b>{{ number(app.calls) }}<small>次</small></b></div>
          <div class="completion" :style="{ '--metric-progress': `${app.completion}%` }"><span><i /></span><b>{{ percent(app.completion) }}</b></div>
          <div class="response" :style="{ '--metric-progress': `${app.firstResponseSeconds / maxAppResponse * 100}%` }"><span><i /></span><b>{{ app.firstResponseSeconds.toFixed(1) }}<small>秒</small></b></div>
          <div class="success" :style="{ '--metric-progress': `${app.success}%` }"><span><i /></span><b>{{ percent(app.success) }}</b></div>
        </article>
      </section>
    </section>
  </section>

  <Teleport to="body">
    <Transition name="cockpit-definition">
      <div v-if="isDataDefinitionOpen" class="cockpit-definition-layer" @click.self="closeDataDefinition">
        <section ref="dataDefinitionPanel" class="cockpit-definition-panel" role="dialog" aria-modal="true" aria-labelledby="cockpit-definition-title" tabindex="-1">
          <header>
            <h2 id="cockpit-definition-title">统计口径</h2>
            <button type="button" aria-label="关闭统计口径" @click="closeDataDefinition"><X :size="18" /></button>
          </header>
          <div class="cockpit-definition-body">
            <div class="cockpit-definition-context"><span>当前范围</span><b>{{ selectedScope.name }}</b><i /> <b>{{ selectedPeriod.name }}</b><small>{{ selectedPeriod.label }}</small></div>
            <section v-for="group in dataDefinitionGroups" :key="group.id" class="cockpit-definition-group">
              <header><h3>{{ group.title }}</h3></header>
              <dl>
                <div v-for="item in group.items" :key="item.label">
                  <dt>{{ item.label }}</dt><dd><b>{{ item.formula }}</b><small>{{ item.detail }}</small></dd>
                </div>
              </dl>
            </section>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
