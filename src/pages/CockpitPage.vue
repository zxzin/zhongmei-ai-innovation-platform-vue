<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Activity, ArrowDownRight, ArrowUpRight, Clock3, FileText, Info, Maximize2, Minimize2, UsersRound, X } from '@lucide/vue'
import BaseSelect from '../components/BaseSelect.vue'
import { useUiStore } from '../stores/ui.js'
import { agentUsage } from '../data/demo.js'
import { appPerformance, cockpitAppScopeProfiles, cockpitPeriods, cockpitScopes } from '../data/platform.js'

const ui = useUiStore()
const activePeriod = ref('month')
const activeScope = ref('group')
const isDataDefinitionOpen = ref(false)
const dataDefinitionPanel = ref(null)
const appTones = ['#52c9ef', '#66d6bf', '#8ba8ed', '#ddb46a', '#b99ae9', '#e78296']
const cockpitAppOrder = ['技术问答', '语义检索', '技术预研报告', '创新性分析', '可行性分析', '技术交底书撰写']
const appDurationSeconds = [42, 18, 492, 694, 368, 441]
const periodTabs = [
  { value: 'day', label: '日' },
  { value: 'month', label: '月' },
  { value: 'quarter', label: '季度' },
  { value: 'year', label: '年' },
]

const comparisonMetrics = [
  { id: 'calls', label: '调用量', tone: '#52c9ef' },
  { id: 'tasks', label: '任务数', tone: '#66d6bf' },
  { id: 'users', label: '活跃用户', tone: '#8ba8ed' },
]

const dataDefinitionGroups = [
  {
    id: 'scope',
    title: '统计范围',
    items: [
      { label: '统计周期', formula: '按“今日、近 30 天、近 90 天、本年度”筛选事件发生时间。', detail: '页面内所有趋势、数量和对比均使用同一周期。' },
      { label: '组织范围', formula: '按所选组织及其下级单位汇总；全集团视图覆盖全部二级、三级单位。', detail: '组织对比图保留层级关系，不将上下级重复作为同一排名。' },
    ],
  },
  {
    id: 'overview',
    title: '运营概览',
    items: [
      { label: '智能应用调用量', formula: '用户每发起一次智能应用调用计 1 次。', detail: '成功、失败、超时和中止的调用均计入。' },
      { label: '任务完成率', formula: '已完成任务 ÷ 已受理任务 × 100%。', detail: '按当前统计周期与组织范围计算。' },
      { label: '平均首次响应', formula: '首次系统响应耗时之和 ÷ 已获得首次响应的调用数。', detail: '不包含人工处理或人工停留时长。' },
      { label: '累计登录人次', formula: '成功建立登录会话计 1 次，按所选组织累计。', detail: '用户持续在线不会重复增加登录人次。' },
    ],
  },
  {
    id: 'tasks',
    title: '任务与应用性能',
    items: [
      { label: '应用运行状态', formula: '按各智能应用当前服务状态展示“正常”或“异常”。', detail: '状态是当前可用性，不参与调用量计算。' },
      { label: '当前周期处理状态', formula: '展示已完成任务与处理中任务；完成占比 = 已完成 ÷（已完成 + 处理中）× 100%。', detail: '仅统计当前周期内的任务状态。' },
      { label: '累计历史结果', formula: '展示历史成功与历史失败；累计成功率 = 历史成功 ÷（历史成功 + 历史失败）× 100%。', detail: '与当前周期处理状态分别计算。' },
      { label: '应用完成率与处理时长', formula: '单应用完成率 = 该应用已完成任务 ÷ 该应用已受理任务；处理时长为完成任务的平均处理时长。', detail: '调用次数趋势按同一周期内的事件时间分段汇总。' },
    ],
  },
  {
    id: 'activity',
    title: '用户活跃与组织对比',
    items: [
      { label: '活跃用户占比', formula: '周期内登录、发起任务或查看历史记录的去重用户 ÷ 注册用户 × 100%。', detail: '同一用户在周期内多次操作仍按 1 人计算。' },
      { label: '日均智能应用调用次数', formula: '智能应用调用总次数 ÷ 统计天数。', detail: '调用次数包含成功、失败、超时和中止的发起；趋势按所选周期的可用时间粒度汇总。' },
      { label: '各级单位使用对比', formula: '按调用量、任务数、活跃用户三项分别比较单位。', detail: '三项指标各自按本项最高值绘制，末端显示实际数值。' },
    ],
  },
]

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

function formatDuration(totalSeconds) {
  if (totalSeconds < 60) return `${totalSeconds}秒`
  return `${Math.floor(totalSeconds / 60)}分${String(totalSeconds % 60).padStart(2, '0')}秒`
}

function distributeInteger(total, weights) {
  const normalizedWeights = weights.map((weight) => Math.max(0, weight))
  const weightTotal = Math.max(normalizedWeights.reduce((sum, weight) => sum + weight, 0), 1)
  const raw = normalizedWeights.map((weight) => total * weight / weightTotal)
  const values = raw.map((value) => Math.floor(value))
  const remainder = Math.max(0, total - values.reduce((sum, value) => sum + value, 0))

  raw
    .map((value, index) => ({ index, fraction: value - values[index] }))
    .sort((first, second) => second.fraction - first.fraction || first.index - second.index)
    .slice(0, remainder)
    .forEach(({ index }) => { values[index] += 1 })

  return values
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
  const userBase = Math.max(child.users, Math.round(child.users / 0.7))

  return {
    id,
    name: child.name,
    level: '三级单位',
    parentName: parent.name,
    calls: child.calls,
    successfulCalls: Math.round(child.calls * 0.97),
    starts: Math.round(child.calls * 1.06),
    tasks: child.tasks,
    completedTasks: Math.round(child.tasks * 0.97),
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
const periodScale = computed(() => selectedPeriod.value.scale)
const scopeShare = computed(() => selectedScope.value.calls / groupScope.value.calls)
const scaleCount = (value) => Math.round(value * periodScale.value)
const scaleUser = (value) => Math.max(1, Math.round(value * selectedPeriod.value.userScale))
const currentCalls = computed(() => scaleCount(selectedScope.value.calls))
const currentTasks = computed(() => scaleCount(selectedScope.value.tasks))
const completedTasks = computed(() => scaleCount(selectedScope.value.completedTasks))
const activeUsers = computed(() => scaleUser(selectedScope.value.activeUsers))
const registeredUsers = computed(() => selectedScope.value.registeredUsers)
const completionRate = computed(() => completedTasks.value / Math.max(currentTasks.value, 1) * 100)
const activeRate = computed(() => activeUsers.value / Math.max(registeredUsers.value, 1) * 100)
const averageDailyCalls = computed(() => currentCalls.value / Math.max(selectedPeriod.value.dayCount, 1))

function selectPeriod(period) {
  activePeriod.value = period
}

const isCockpitFullscreen = computed(() => ui.cockpitFullscreen)

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
  const shouldEnterFullscreen = !ui.cockpitFullscreen
  ui.setCockpitFullscreen(shouldEnterFullscreen)

  if (!shouldEnterFullscreen) {
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen()
      } catch {
        // The focused cockpit layout remains available if the browser has already left fullscreen.
      }
    }
    return
  }

  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      // Browser policy can reject native fullscreen; keep the intentional navigation-free layout.
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleCockpitKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleCockpitKeydown)
  ui.setCockpitFullscreen(false)
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {})
  }
})

const trendData = computed(() => selectedPeriod.value.trend.map((item) => ({
  ...item,
  calls: Math.round(item.calls * scopeShare.value),
  results: Math.round(item.results * scopeShare.value),
})))

function multiLineGeometry(rawSeries, width = 730, height = 214, left = 34, right = 13, top = 16, bottom = 30, labelData = []) {
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
    labels: Array.from({ length: count }, (_, index) => ({
      index,
      x: convert(0, index).x,
      label: labelData[index]?.label || '',
      fullLabel: labelData[index]?.fullLabel || labelData[index]?.label || '',
    })),
    series,
  }
}

const scopeProfileKey = computed(() => activeScope.value.split('__')[0])
const scopeAppProfile = computed(() => cockpitAppScopeProfiles[scopeProfileKey.value] || cockpitAppScopeProfiles.group)
const appRows = computed(() => {
  const profile = scopeAppProfile.value
  const callWeights = appPerformance.map((app, index) => app.calls * profile.callMix[index])
  const callsByApp = distributeInteger(currentCalls.value, callWeights)
  const completedByApp = distributeInteger(completedTasks.value, callWeights)

  return appPerformance.map((app, index) => {
    const callMix = profile.callMix[index]
    const completion = Math.min(99.9, Math.max(0, Math.round((app.completion + profile.completionDelta[index]) * 10) / 10))

    return {
      id: agentUsage[index]?.id || `app-${index}`,
      name: app.name,
      calls: callsByApp[index],
      completion,
      duration: formatDuration(Math.round(appDurationSeconds[index] * profile.durationScale[index])),
      online: app.online,
      processing: Math.max(0, Math.round(app.processing * scopeShare.value * callMix)),
      completed: completedByApp[index],
      historicSuccess: Math.round(app.historicSuccess * scopeShare.value * callMix),
      historicFailure: Math.round(app.historicFailure * scopeShare.value * callMix),
      tone: appTones[index],
    }
  }).sort((first, second) => cockpitAppOrder.indexOf(first.name) - cockpitAppOrder.indexOf(second.name))
})

const taskBoard = computed(() => {
  const completed = appRows.value.reduce((total, app) => total + app.completed, 0)
  const processing = appRows.value.reduce((total, app) => total + app.processing, 0)
  const historicSuccess = appRows.value.reduce((total, app) => total + app.historicSuccess, 0)
  const historicFailure = appRows.value.reduce((total, app) => total + app.historicFailure, 0)
  const historicTotal = historicSuccess + historicFailure
  const currentTotal = completed + processing
  const current = [
    { id: 'completed', label: '已完成', value: completed, tone: '#54d6ba' },
    { id: 'processing', label: '处理中', value: processing, tone: '#51ccef' },
  ]

  return {
    current,
    currentTotal,
    currentCompletedRate: completed / Math.max(currentTotal, 1) * 100,
    historic: [
      { id: 'success', label: '历史成功', value: historicSuccess, tone: '#8ba8ed' },
      { id: 'failure', label: '历史失败', value: historicFailure, tone: '#e5b867' },
    ],
    historicTotal,
    historicSuccessRate: historicSuccess / Math.max(historicTotal, 1) * 100,
  }
})
const onlineAppCount = computed(() => appRows.value.filter((app) => app.online).length)
const appTrendRows = computed(() => {
  const rows = appRows.value.map((app) => ({
    ...app,
    values: trendData.value.map((point) => Math.max(0, Math.round(point.calls * app.calls / Math.max(currentCalls.value, 1)))),
  }))
  const max = Math.max(...rows.flatMap((row) => row.values), 1)
  return rows.map((row) => ({
    ...row,
    bars: row.values.map((value) => ({ value, height: Math.max(10, Math.round(value / max * 100)) })),
  }))
})
const trendPointCount = computed(() => Math.max(trendData.value.length, 1))
const activityTrendSource = computed(() => selectedPeriod.value.activityTrend || selectedPeriod.value.trend)
const activityTrendData = computed(() => {
  const source = activityTrendSource.value
  const dailyCalls = distributeInteger(currentCalls.value, source.map((item) => item.calls))
  const groupPeriodActiveUsers = Math.max(1, scaleUser(groupScope.value.activeUsers))
  const activityUserScale = activeUsers.value / groupPeriodActiveUsers

  return source.map((item, index) => ({
    label: item.label,
    calls: dailyCalls[index],
    activeUsers: Number.isFinite(item.activeUsers) ? Math.max(1, Math.round(item.activeUsers * activityUserScale)) : null,
  }))
})
const activityAxisLabels = computed(() => {
  const isDailyTrend = activityTrendData.value.length === 30
  const visibleDailyIndexes = new Set([0, 4, 9, 14, 19, 24, 29])

  return activityTrendData.value.map((item, index) => ({
    label: !isDailyTrend || visibleDailyIndexes.has(index) ? item.label.replace(/\s+/g, '') : '',
    fullLabel: item.label.replace(/\s+/g, ''),
  }))
})
const activityRateTrend = computed(() => {
  if (activityTrendData.value.every((item) => Number.isFinite(item.activeUsers))) {
    return activityTrendData.value.map((item) => Math.round(item.activeUsers / Math.max(registeredUsers.value, 1) * 1000) / 10)
  }

  const maxCalls = Math.max(...activityTrendData.value.map((item) => item.calls), 1)
  return activityTrendData.value.map((item) => Math.max(1, Math.round(activeRate.value * (.55 + item.calls / maxCalls * .45) * 10) / 10))
})
const activityRateChart = computed(() => multiLineGeometry([{ id: 'active-rate', tone: '#54d6ba', values: activityRateTrend.value }], 560, 156, 27, 12, 14, 27, activityAxisLabels.value))
const activityCallsChart = computed(() => multiLineGeometry([{ id: 'daily-calls', tone: '#52c9ef', values: activityTrendData.value.map((item) => item.calls) }], 560, 156, 27, 12, 14, 27, activityAxisLabels.value))
const comparisonBranchIds = computed(() => {
  if (activeScope.value === 'group') return cockpitScopes.filter((scope) => scope.id !== 'group').map((scope) => scope.id)
  return [activeScope.value.split('__')[0]]
})
const comparisonRows = computed(() => comparisonBranchIds.value.flatMap((branchId) => {
  const branch = cockpitScopes.find((scope) => scope.id === branchId)
  if (!branch) return []

  return [
    {
      id: branch.id,
      name: branch.name,
      level: '二级单位',
      depth: 0,
      calls: scaleCount(branch.calls),
      tasks: scaleCount(branch.tasks),
      users: scaleUser(branch.activeUsers),
      selected: activeScope.value === branch.id,
    },
    ...branch.children.map((child, index) => ({
      id: `${branch.id}__${index}`,
      name: child.name,
      level: '三级单位',
      depth: 1,
      calls: scaleCount(child.calls),
      tasks: scaleCount(child.tasks),
      users: scaleUser(child.users),
      selected: activeScope.value === `${branch.id}__${index}`,
    })),
  ]
}))
const comparisonMaxes = computed(() => Object.fromEntries(comparisonMetrics.map((metric) => [
  metric.id,
  Math.max(...comparisonRows.value.map((item) => item[metric.id]), 1),
])))
const comparisonTitle = computed(() => activeScope.value === 'group' ? '各级单位使用对比' : `${selectedScope.value.name}使用对比`)
const comparisonDescription = computed(() => `${comparisonRows.value.length} 家单位 · 三指标分尺度比较`)

function comparisonMetricWidth(item, metricId) {
  return `${Math.max(6, item[metricId] / comparisonMaxes.value[metricId] * 100)}%`
}

const metricCards = computed(() => [
  {
    id: 'calls', label: '智能应用调用量', value: number(currentCalls.value), unit: '次',
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
    id: 'logins', label: '累计登录人次', value: number(selectedScope.value.historicalLogins), unit: '次',
    tone: '#8ba8ed', icon: UsersRound,
    comparison: selectedPeriod.value.comparison.logins, comparisonLabel: selectedPeriod.value.comparisonLabel, improved: true,
  },
])
</script>

<template>
  <section class="page-container cockpit-page cockpit-view">
    <header class="cockpit-toolbar">
      <div class="cockpit-title">
        <span>01 / 运营概览</span>
        <h1>AI 应用运营驾驶舱</h1>
        <p>{{ selectedScope.name }} · {{ selectedPeriod.name }}</p>
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
          :title="isCockpitFullscreen ? '退出全屏' : '全屏查看'"
          @click="toggleCockpitFullscreen"
        >
          <Minimize2 v-if="isCockpitFullscreen" :size="16" />
          <Maximize2 v-else :size="16" />
        </button>
      </div>
    </header>

    <section class="cockpit-kpi-grid" aria-label="运营核心指标">
      <article v-for="card in metricCards" :key="card.id" class="cockpit-kpi-card" :style="{ '--metric-tone': card.tone }">
        <header><span>{{ card.label }}</span><component :is="card.icon" :size="17" /></header>
        <b>{{ card.value }}<small>{{ card.unit }}</small></b>
        <p :class="{ improved: card.improved }" :aria-label="`${card.label}${card.comparisonLabel}变化${card.comparison}`">
          <small>{{ card.comparisonLabel }}</small>
          <strong><ArrowDownRight v-if="card.lowerIsBetter" :size="13" /><ArrowUpRight v-else :size="13" />{{ card.comparison }}</strong>
        </p>
      </article>
    </section>

    <section class="cockpit-main-grid">
      <section class="cockpit-panel cockpit-task-panel" aria-label="AI 应用任务看板">
        <header class="cockpit-panel-heading"><h2><span>02 /</span> AI 应用任务看板</h2><p>统计周期：{{ selectedPeriod.name }}</p></header>
        <div class="cockpit-task-layout">
          <section class="cockpit-health" aria-label="六项智能应用运行状态">
            <header><span>应用运行状态</span><strong><i /><b>{{ onlineAppCount }} / {{ appRows.length }}</b> 正常</strong></header>
            <ul>
              <li v-for="app in appRows" :key="app.id" :class="{ offline: !app.online }" :aria-label="`${app.name}：${app.online ? '正常' : '异常'}`">
                <i :class="{ offline: !app.online }" />
                <b>{{ app.name }}</b>
                <em>{{ app.online ? '正常' : '异常' }}</em>
              </li>
            </ul>
          </section>
          <section class="cockpit-task-summary" aria-label="任务统计概览">
            <section
              class="cockpit-task-track cockpit-current-track"
              :style="{ '--task-primary': taskBoard.current[0].tone, '--task-secondary': taskBoard.current[1].tone, '--task-progress': `${taskBoard.currentCompletedRate}%` }"
            >
              <header><span>当前周期处理状态</span><small>{{ selectedPeriod.name }} · {{ number(taskBoard.currentTotal) }} 项</small></header>
              <div class="cockpit-task-donut" role="img" :aria-label="`当前周期已完成 ${number(taskBoard.current[0].value)} 项，占 ${percent(taskBoard.currentCompletedRate)}；处理中 ${number(taskBoard.current[1].value)} 项`">
                <div><b>{{ percent(taskBoard.currentCompletedRate) }}</b><span>已完成占比</span></div>
              </div>
              <dl>
                <div v-for="item in taskBoard.current" :key="item.id" :style="{ '--task-tone': item.tone }"><dt><i />{{ item.label }}</dt><dd>{{ number(item.value) }}<em>项</em></dd></div>
              </dl>
            </section>
            <section
              class="cockpit-task-track cockpit-history-track"
              :style="{ '--task-primary': taskBoard.historic[0].tone, '--task-secondary': taskBoard.historic[1].tone, '--task-progress': `${taskBoard.historicSuccessRate}%` }"
            >
              <header><span>累计历史结果</span><small>共 {{ number(taskBoard.historicTotal) }} 项</small></header>
              <div class="cockpit-task-donut" role="img" :aria-label="`历史成功 ${number(taskBoard.historic[0].value)} 项，历史失败 ${number(taskBoard.historic[1].value)} 项，累计成功率 ${percent(taskBoard.historicSuccessRate)}`">
                <div><b>{{ percent(taskBoard.historicSuccessRate) }}</b><span>累计成功率</span></div>
              </div>
              <dl>
                <div v-for="item in taskBoard.historic" :key="item.id" :style="{ '--task-tone': item.tone }"><dt><i />{{ item.label }}</dt><dd>{{ number(item.value) }}<em>项</em></dd></div>
              </dl>
            </section>
            <p class="cockpit-task-note">人工中断可能影响完成与成功统计</p>
          </section>
        </div>
      </section>

      <section class="cockpit-panel cockpit-performance-panel" aria-label="AI 应用性能看板">
        <header class="cockpit-panel-heading"><h2><span>03 /</span> AI 应用性能看板</h2><p>完成率与平均处理时长</p></header>
        <div class="cockpit-performance-layout">
          <section class="cockpit-performance-list" aria-label="六项智能应用性能">
            <header><span>智能应用</span><span>完成率</span><span>处理时长</span></header>
            <div v-for="app in appRows" :key="app.id" :style="{ '--app-tone': app.tone }"><b>{{ app.name }}</b><span><i :style="{ width: `${app.completion}%` }" /><strong>{{ app.completion }}%</strong></span><em>{{ app.duration }}</em></div>
          </section>
          <section class="cockpit-call-trend" aria-label="六项智能应用调用次数趋势">
            <header><span>调用次数趋势</span><small>{{ selectedPeriod.name }}</small></header>
            <div class="cockpit-trend-labels" :style="{ '--trend-points': trendPointCount }"><span v-for="point in trendData" :key="point.label">{{ point.label }}</span></div>
            <div class="cockpit-trend-rows" :style="{ '--trend-points': trendPointCount }">
              <article v-for="app in appTrendRows" :key="app.id" :style="{ '--app-tone': app.tone }">
                <header><span><i />{{ app.name }}</span><strong>{{ number(app.calls) }}</strong></header>
                <div class="cockpit-trend-bars" :aria-label="`${app.name}调用次数趋势`">
                  <i v-for="(bar, index) in app.bars" :key="index" :style="{ '--bar-height': `${bar.height}%` }" :title="`${trendData[index]?.label} ${bar.value} 次`" />
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </section>

    <section class="cockpit-bottom-grid">
      <section class="cockpit-panel cockpit-activity-panel" aria-label="用户活跃度统计">
        <header class="cockpit-panel-heading"><h2><span>04 /</span> 用户活跃度统计</h2></header>
        <div class="cockpit-activity-grid">
          <section class="cockpit-activity-item" style="--activity-tone: #54d6ba">
            <div class="cockpit-activity-copy">
              <header><span>活跃用户占比</span><em>{{ selectedPeriod.name }}</em></header>
              <b>{{ percent(activeRate) }}</b>
              <p><strong>{{ number(activeUsers) }}</strong> / {{ number(registeredUsers) }} 人</p>
              <small>登录、发起任务或查看历史记录的去重用户</small>
            </div>
            <div class="cockpit-activity-trend">
              <svg :viewBox="`0 0 ${activityRateChart.width} ${activityRateChart.height}`" preserveAspectRatio="none"><g class="cockpit-chart-grid"><line v-for="grid in activityRateChart.grid" :key="grid.y" :x1="activityRateChart.left" :x2="activityRateChart.width - activityRateChart.right" :y1="grid.y" :y2="grid.y" /></g><path :d="activityRateChart.series[0].area" fill="rgba(84,214,186,.12)" /><path class="cockpit-chart-line" :d="activityRateChart.series[0].path" stroke="#54d6ba" /><circle v-for="(point, index) in activityRateChart.series[0].points" :key="index" :cx="point.x" :cy="point.y" r="2.6" fill="#54d6ba"><title>{{ `${activityRateChart.labels[index].fullLabel}：${activityRateTrend[index]}%` }}</title></circle><text v-for="label in activityRateChart.labels" :key="label.index" :x="label.x" :y="activityRateChart.height - 7" text-anchor="middle">{{ label.label }}</text></svg>
            </div>
          </section>
          <section class="cockpit-activity-item" style="--activity-tone: #52c9ef">
            <div class="cockpit-activity-copy">
              <header><span>日均智能应用调用次数</span><em>{{ selectedPeriod.name }}</em></header>
              <b>{{ averageDailyCalls.toFixed(1) }}<i>次 / 日</i></b>
              <p><strong>{{ number(currentCalls) }}</strong> / {{ selectedPeriod.dayCount }} 天</p>
              <small>调用总次数 / 统计天数</small>
            </div>
            <div class="cockpit-activity-trend">
              <svg :viewBox="`0 0 ${activityCallsChart.width} ${activityCallsChart.height}`" preserveAspectRatio="none"><g class="cockpit-chart-grid"><line v-for="grid in activityCallsChart.grid" :key="grid.y" :x1="activityCallsChart.left" :x2="activityCallsChart.width - activityCallsChart.right" :y1="grid.y" :y2="grid.y" /></g><path :d="activityCallsChart.series[0].area" fill="rgba(82,201,239,.12)" /><path class="cockpit-chart-line" :d="activityCallsChart.series[0].path" stroke="#52c9ef" /><circle v-for="(point, index) in activityCallsChart.series[0].points" :key="index" :cx="point.x" :cy="point.y" r="2.6" fill="#52c9ef"><title>{{ `${activityCallsChart.labels[index].fullLabel}：${activityTrendData[index].calls} 次` }}</title></circle><text v-for="label in activityCallsChart.labels" :key="label.index" :x="label.x" :y="activityCallsChart.height - 7" text-anchor="middle">{{ label.label }}</text></svg>
            </div>
          </section>
        </div>
      </section>

      <section class="cockpit-panel cockpit-comparison-panel" aria-label="组织使用情况横向对比">
        <header class="cockpit-panel-heading"><h2><span>05 /</span> {{ comparisonTitle }}</h2><p>{{ comparisonDescription }}</p></header>
        <div class="cockpit-comparison-content">
          <div class="cockpit-comparison-legend" aria-label="组织对比指标图例">
            <span v-for="metric in comparisonMetrics" :key="metric.id" :style="{ '--comparison-tone': metric.tone }"><i />{{ metric.label }}</span>
            <small>各指标按自身最高值缩放</small>
          </div>
          <div class="cockpit-comparison-scroll">
            <div class="cockpit-comparison-chart" role="table" :aria-label="comparisonTitle">
              <div class="cockpit-comparison-head" role="row"><span>组织层级</span><span v-for="metric in comparisonMetrics" :key="metric.id">{{ metric.label }}</span></div>
              <div v-for="item in comparisonRows" :key="item.id" class="cockpit-comparison-row" :class="[`is-depth-${item.depth}`, { selected: item.selected }]" role="row">
                <div class="cockpit-comparison-name"><i aria-hidden="true" /><b>{{ item.name }}</b><small>{{ item.level }}</small></div>
                <div v-for="metric in comparisonMetrics" :key="metric.id" class="cockpit-comparison-metric" :style="{ '--comparison-tone': metric.tone }">
                  <i><u :style="{ width: comparisonMetricWidth(item, metric.id) }" /></i><b>{{ number(item[metric.id]) }}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </section>

  <Teleport to="body">
    <Transition name="cockpit-definition">
      <div v-if="isDataDefinitionOpen" class="cockpit-definition-layer" @click.self="closeDataDefinition">
        <section ref="dataDefinitionPanel" class="cockpit-definition-panel" role="dialog" aria-modal="true" aria-labelledby="cockpit-definition-title" tabindex="-1">
          <header>
            <div><span>统计口径</span><h2 id="cockpit-definition-title">统计口径与计算方式</h2></div>
            <button type="button" aria-label="关闭统计口径" @click="closeDataDefinition"><X :size="18" /></button>
          </header>
          <div class="cockpit-definition-body">
            <div class="cockpit-definition-context"><span>当前统计范围</span><b>{{ selectedScope.name }}</b><i /> <b>{{ selectedPeriod.name }}</b><small>{{ selectedPeriod.label }}</small></div>
            <section v-for="(group, groupIndex) in dataDefinitionGroups" :key="group.id" class="cockpit-definition-group">
              <header><span>{{ String(groupIndex + 1).padStart(2, '0') }}</span><h3>{{ group.title }}</h3></header>
              <dl>
                <div v-for="item in group.items" :key="item.label">
                  <dt>{{ item.label }}</dt><dd>{{ item.formula }}</dd><small>{{ item.detail }}</small>
                </div>
              </dl>
            </section>
            <p class="cockpit-definition-note">当前版本展示样例统计；后续接入平台数据后，仍按以上口径聚合与呈现。</p>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
