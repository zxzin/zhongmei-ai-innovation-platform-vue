<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Activity, ArrowDownRight, ArrowUpRight, Clock3, FileText, Info, Maximize2, Minimize2, UsersRound, X } from '@lucide/vue'
import BaseSelect from '../components/BaseSelect.vue'
import { useUiStore } from '../stores/ui.js'
import { agentUsage } from '../data/demo.js'
import { agentMap } from '../data/agents.js'
import { appPerformance, cockpitAppScopeProfiles, cockpitComparisonScopes, cockpitPeriods, cockpitScopes } from '../data/platform.js'

const ui = useUiStore()
const activePeriod = ref('month')
const activeScope = ref('group')
const comparisonDimension = ref('group')
const comparisonPeriod = ref('month')
const comparisonHover = ref(null)
const comparisonChartSvg = ref(null)
const comparisonChartSize = ref({ width: 760, height: 244 })
const callTrendChartContainer = ref(null)
const callTrendChartSize = ref({ width: 620, height: 184 })
const activeUserTrendChartContainer = ref(null)
const activeUserTrendChartSize = ref({ width: 300, height: 184 })
const isDataDefinitionOpen = ref(false)
const dataDefinitionPanel = ref(null)
const appTones = ['#52c9ef', '#66d6bf', '#8ba8ed', '#ddb46a', '#b99ae9', '#e78296']
const comparisonTones = ['#4fb9d8', '#dfa04f', '#9b78d9', '#50b99a', '#d4776d', '#648ddd', '#a7b95d', '#c96fad', '#589fc2', '#d28752', '#5bb9ad', '#aa6da5', '#6aa7d8', '#d36f91', '#767ccc', '#43aa90']
const cockpitAppOrder = ['技术问答', '语义检索', '技术预研报告', '创新性分析', '可行性分析', '技术交底书撰写']
const cockpitVolumeMultiplier = 30
let comparisonChartObserver
let lineChartObserver
const periodTabs = [
  { value: 'day', label: '日' },
  { value: 'month', label: '月' },
  { value: 'quarter', label: '季度' },
  { value: 'year', label: '年' },
]
const comparisonDimensionOptions = [
  { value: 'group', label: '全集团', detail: '全部公司' },
  { value: 'secondary', label: '二级公司', detail: '6 家公司' },
  { value: 'tertiary', label: '三级公司', detail: '10 家公司' },
]
const comparisonPeriodOptions = [
  { value: 'month', label: '按月比', detail: '近 30 天' },
  { value: 'quarter', label: '按季度比', detail: '近 90 天' },
  { value: 'year', label: '按年比', detail: '本年度' },
]
const comparisonPeriodProfiles = {
  month: { label: '近 30 天', countScale: .26, activeScale: .68, completionShift: -1.1, variance: 1.1 },
  quarter: { label: '近 90 天', countScale: .69, activeScale: .86, completionShift: -.35, variance: .75 },
  year: { label: '本年度', countScale: 1, activeScale: 1, completionShift: .4, variance: .45 },
}

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
      { label: '平均首次响应', formula: '首次系统响应耗时之和 ÷ 已获得首次响应的调用数。', detail: '不包含人工处理或人工停留时长。' },
      { label: '活跃用户数', formula: '每个趋势时间桶内至少发生 1 次有效行为的活跃用户数。', detail: '有效行为包括登录、发起任务、查询或查看历史记录；近 30 天按日、近 90 天按周、本年度按半月统计，同一用户在单个时间桶内计 1 人。' },
      { label: '用户活跃率', formula: '周期活跃用户数 ÷ 当前组织范围的总注册用户数 × 100%。', detail: '例如：月活跃率 = 当月活跃用户数 ÷ 总注册用户数。' },
      { label: '用户均调用频次', formula: '智能应用调用总次数 ÷ 注册用户数。', detail: '调用总次数包含成功、失败、超时和中止的发起。' },
      { label: '调用成功率', formula: '成功调用次数 ÷ 智能应用调用总次数 × 100%。', detail: '失败率 = 未成功调用次数 ÷ 调用总次数；两者仅统计当前筛选范围。' },
      { label: '调用次数趋势', formula: '按所选周期拆分时间桶，分别汇总六项智能应用在每个时间桶内的调用次数。', detail: '今日按时段；近 30 天按自然日形成 30 个节点，横轴每 5 日标注；近 90 天按自然周形成 13 个节点，横轴仅标月份边界；本年度按上、下半月形成每月 2 个节点，横轴仅标月份。折线连接各时间桶汇总值，不采用跨月平均点。' },
    ],
  },
  {
    id: 'tasks',
    title: '智能应用运行与任务',
    items: [
      { label: '智能应用运行状态', formula: '当前服务可正常接受调用显示为“正常”，停用的服务显示为“停用”。', detail: '运行状态是当前时点快照，不按统计周期累计，也不参与调用总量计算。' },
      { label: '任务完成率', formula: '产生最终输出的完整任务数 ÷ Agent 已启动任务数 × 100%。', detail: '用户提交输入且 Agent 开始执行后，必须走完全部流程并产生最终输出才计为完整；中断、暂停、退出或没有最终输出均计为未完成。尚未启动 Agent 的草稿不进入分母。' },
    ],
  },
  {
    id: 'performance',
    title: '性能看板',
    items: [
      { label: '单应用调用量', formula: '当前筛选范围内该智能应用被发起调用的总次数。', detail: '六项智能应用分别统计，成功与未成功调用均计入。' },
      { label: '单应用任务完成率', formula: '该智能应用产生最终输出的完整任务数 ÷ 该智能应用 Agent 已启动任务数 × 100%。', detail: '每项智能应用独立计算；中断、暂停或无最终输出的任务均计为未完成。' },
      { label: '单应用平均首次响应', formula: '该智能应用首次响应耗时之和 ÷ 已获得首次响应的调用数。', detail: '越短表示首次响应越快；不等同于任务完整处理时长。' },
      { label: '单应用调用成功率', formula: '该智能应用成功调用次数 ÷ 该智能应用调用总次数 × 100%。', detail: '每项智能应用独立计算。' },
    ],
  },
  {
    id: 'comparison',
    title: '横向对比',
    items: [
      { label: '各级单位使用对比', formula: '横轴为智能应用调用量，纵轴为任务完成率，气泡面积表示活跃用户占比，颜色区分单位。', detail: '可按全集团、二级公司、三级公司切换比较维度，并独立选择按月、按季度或按年统计。' },
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

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
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
  const userBase = Math.max(child.users, child.registeredUsers ?? Math.round(child.users / 0.7))

  return {
    id,
    name: child.name,
    level: '三级单位',
    parentName: parent.name,
    calls: child.calls,
    successfulCalls: Math.round(child.calls * 0.97),
    starts: Math.round(child.calls * 1.06),
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
const periodScale = computed(() => selectedPeriod.value.scale)
const scopeShare = computed(() => selectedScope.value.calls / groupScope.value.calls)
const scaleCount = (value) => Math.round(value * periodScale.value * cockpitVolumeMultiplier)
const scaleUser = (value) => Math.max(1, Math.round(value * selectedPeriod.value.userScale))
const currentCalls = computed(() => scaleCount(selectedScope.value.calls))
const startedTasks = computed(() => scaleCount(selectedScope.value.starts))
const completedTasks = computed(() => scaleCount(selectedScope.value.completedTasks))
const activeUsers = computed(() => scaleUser(selectedScope.value.activeUsers))
const registeredUsers = computed(() => selectedScope.value.registeredUsers)
const completionRate = computed(() => completedTasks.value / Math.max(startedTasks.value, 1) * 100)
const activeRate = computed(() => activeUsers.value / Math.max(registeredUsers.value, 1) * 100)
const successfulCalls = computed(() => Math.min(currentCalls.value, scaleCount(selectedScope.value.successfulCalls)))
const failedCalls = computed(() => Math.max(0, currentCalls.value - successfulCalls.value))
const callSuccessRate = computed(() => successfulCalls.value / Math.max(currentCalls.value, 1) * 100)
const perUserCallFrequency = computed(() => {
  if (registeredUsers.value <= 0) return null
  return currentCalls.value / registeredUsers.value
})

function selectPeriod(period) {
  activePeriod.value = period
}

const isCockpitFullscreen = computed(() => ui.cockpitFullscreen)
const isFullscreenTransitioning = ref(false)

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
  } finally {
    isFullscreenTransitioning.value = false
  }
}

function handleFullscreenChange() {
  ui.setCockpitFullscreen(document.fullscreenElement === document.documentElement)
}

function syncComparisonChartSize() {
  const rect = comparisonChartSvg.value?.getBoundingClientRect()
  const width = Math.round(rect?.width || 0)
  const height = Math.round(rect?.height || 0)

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
  syncComparisonChartSize()
  syncLineChartSizes()

  if (typeof ResizeObserver !== 'undefined' && comparisonChartSvg.value) {
    comparisonChartObserver = new ResizeObserver(syncComparisonChartSize)
    comparisonChartObserver.observe(comparisonChartSvg.value)
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
  comparisonChartObserver?.disconnect()
  lineChartObserver?.disconnect()
  ui.setCockpitFullscreen(false)
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {})
  }
})

const trendData = computed(() => {
  const source = selectedPeriod.value.trend
  const calls = distributeInteger(currentCalls.value, source.map((item) => item.calls))
  const results = distributeInteger(successfulCalls.value, source.map((item) => item.results))

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
  const profile = scopeAppProfile.value
  const callWeights = appPerformance.map((app, index) => app.calls * profile.callMix[index])
  const callsByApp = distributeInteger(currentCalls.value, callWeights)
  const completedByApp = distributeInteger(completedTasks.value, callWeights)

  return appPerformance.map((app, index) => {
    const callMix = profile.callMix[index]
    const completion = Math.min(99.9, Math.max(0, Math.round((app.completion + profile.completionDelta[index]) * 10) / 10))
    const agentId = agentUsage[index]?.id || `app-${index}`

    return {
      id: agentId,
      name: app.name,
      icon: agentMap[agentId]?.icon || Activity,
      calls: callsByApp[index],
      completion,
      firstResponseSeconds: Math.round(app.firstResponseSeconds * profile.durationScale[index] * 10) / 10,
      success: clamp(Math.round((app.success + profile.completionDelta[index] * .45) * 10) / 10, 0, 100),
      online: app.online,
      processing: Math.max(0, Math.round(app.processing * scopeShare.value * callMix)),
      completed: completedByApp[index],
      historicSuccess: Math.round(app.historicSuccess * scopeShare.value * callMix),
      historicFailure: Math.round(app.historicFailure * scopeShare.value * callMix),
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
    values: distributeInteger(app.calls, periodWeights.map((weight, pointIndex) => {
      const stagger = Math.sin((pointIndex + 1) * 1.45 + appIndex * .86) * .14
      const cadence = ((pointIndex + appIndex) % 3 - 1) * .035
      return Math.max(.2, weight * (1 + stagger + cadence))
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
const appCallTrendChart = computed(() => multiLineGeometry(
  appTrendRows.value.map((app) => ({ id: app.id, name: app.name, tone: app.tone, values: app.values })),
  callTrendChartSize.value.width,
  callTrendChartSize.value.height,
  12,
  12,
  15,
  28,
  appTrendLabels.value,
))
const selectedComparisonPeriod = computed(() => comparisonPeriodProfiles[comparisonPeriod.value] || comparisonPeriodProfiles.month)
const comparisonTertiarySources = computed(() => {
  const rows = []
  const childCount = Math.max(...cockpitComparisonScopes.map((scope) => scope.children.length), 0)

  for (let childIndex = 0; childIndex < childCount && rows.length < 10; childIndex += 1) {
    cockpitComparisonScopes.forEach((scope) => {
      const child = scope.children[childIndex]
      if (child && rows.length < 10) rows.push({ ...child, parentName: scope.name })
    })
  }

  return rows
})

function comparisonVariance(id, salt = 0) {
  const hash = Array.from(String(id)).reduce((sum, character) => sum + character.codePointAt(0), 0)
  return ((hash + salt * 19) % 17 - 8) / 8
}

function makeComparisonUnit({ id, name, level, calls, startedTasks, completedTasks, activeUsers, registeredUsers, tone }) {
  const profile = selectedComparisonPeriod.value
  const periodSalt = comparisonPeriod.value === 'month' ? 1 : comparisonPeriod.value === 'quarter' ? 2 : 3
  const variance = comparisonVariance(id, periodSalt)
  const countFactor = profile.countScale * (1 + variance * .28 * profile.variance)
  const scaledCalls = Math.max(1, Math.round(calls * countFactor))
  const scaledStartedTasks = Math.max(1, Math.round(startedTasks * countFactor * (1 - variance * .025)))
  const baseCompletionRate = completedTasks / Math.max(startedTasks, 1) * 100
  const targetCompletionRate = clamp(baseCompletionRate + profile.completionShift + variance * 6.2 * profile.variance, 76, 99.5)
  const scaledCompletedTasks = Math.min(scaledStartedTasks, Math.max(0, Math.round(scaledStartedTasks * targetCompletionRate / 100)))
  const safeRegisteredUsers = Math.max(registeredUsers, 1)
  const baseActiveRate = activeUsers / safeRegisteredUsers
  const targetActiveRate = clamp(baseActiveRate * profile.activeScale * (1 + variance * .16 * profile.variance), .12, .98)
  const scaledActiveUsers = Math.min(safeRegisteredUsers, Math.max(1, Math.round(safeRegisteredUsers * targetActiveRate)))

  return {
    id,
    name,
    level,
    calls: scaledCalls,
    startedTasks: scaledStartedTasks,
    completedTasks: scaledCompletedTasks,
    completionRate: scaledCompletedTasks / Math.max(scaledStartedTasks, 1) * 100,
    activeUsers: scaledActiveUsers,
    registeredUsers: safeRegisteredUsers,
    activeRate: scaledActiveUsers / safeRegisteredUsers * 100,
    tone,
  }
}

const comparisonUnits = computed(() => {
  const secondaryUnits = cockpitComparisonScopes.map((scope, index) => makeComparisonUnit({
      id: scope.id,
      name: scope.name,
      level: '二级公司',
      calls: scope.calls,
      startedTasks: scope.startedTasks,
      completedTasks: scope.completedTasks,
      activeUsers: scope.activeUsers,
      registeredUsers: scope.registeredUsers,
      tone: comparisonTones[index],
    }))
  const tertiaryUnits = comparisonTertiarySources.value.map((child, index) => makeComparisonUnit({
    id: child.id,
    name: child.name,
    level: '三级公司',
    calls: child.calls,
    startedTasks: child.startedTasks,
    completedTasks: child.completedTasks,
    activeUsers: child.activeUsers,
    registeredUsers: child.registeredUsers,
    tone: comparisonTones[index + secondaryUnits.length],
  }))

  if (comparisonDimension.value === 'secondary') return secondaryUnits
  if (comparisonDimension.value === 'tertiary') return tertiaryUnits
  return [...secondaryUnits, ...tertiaryUnits]
})
const comparisonUnitCount = computed(() => comparisonUnits.value.length)
const comparisonIsDense = computed(() => comparisonUnitCount.value > 6)
const comparisonTitle = computed(() => '各级单位使用对比')
const comparisonHoverBubble = computed(() => comparisonUnits.value.find((item) => item.id === comparisonHover.value) || null)

function selectComparisonFilter() {
  comparisonHover.value = null
}

function niceAxisStep(value) {
  const safeValue = Math.max(value, .1)
  const magnitude = 10 ** Math.floor(Math.log10(safeValue))
  const normalized = safeValue / magnitude
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10
  return step * magnitude
}

function comparisonAxisRange(values, segments = 4, limits = {}) {
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  const paddingRatio = limits.paddingRatio ?? .12
  const rawSpan = Math.max(maximum - minimum, Math.max(Math.abs(maximum), 1) * .08)
  const paddedMinimum = minimum - rawSpan * paddingRatio
  const paddedMaximum = maximum + rawSpan * paddingRatio
  const step = niceAxisStep((paddedMaximum - paddedMinimum) / segments)
  const calculatedMin = limits.dynamic ? paddedMinimum : Math.floor(paddedMinimum / step) * step
  const calculatedMax = limits.dynamic ? paddedMaximum : Math.ceil(paddedMaximum / step) * step
  const min = Number.isFinite(limits.floor) ? Math.max(limits.floor, calculatedMin) : calculatedMin
  const max = Number.isFinite(limits.ceiling) ? Math.min(limits.ceiling, calculatedMax) : calculatedMax

  return { min, max: max > min ? max : min + step }
}

function comparisonScalePower(values) {
  const positiveValues = values.filter((value) => value > 0)
  const minimum = Math.min(...positiveValues)
  const maximum = Math.max(...positiveValues)
  const ratio = maximum / Math.max(minimum, 1)

  if (ratio >= 8) return .56
  if (ratio >= 4) return .7
  return 1
}

const comparisonPlot = computed(() => {
  const width = Math.max(280, comparisonChartSize.value.width)
  const height = Math.max(220, comparisonChartSize.value.height)
  const isCompact = width < 540
  const units = comparisonUnits.value
  const labelMaximum = clamp(width * (isCompact ? .36 : .25), 82, 142)
  const frame = {
    left: isCompact ? 42 : 52,
    right: isCompact ? 18 : 28,
    top: 18,
    bottom: 38,
  }
  const innerWidth = Math.max(110, width - frame.left - frame.right)
  const innerHeight = Math.max(106, height - frame.top - frame.bottom)
  const companyCount = Math.max(units.length, 1)
  const axisPadding = clamp(.07 + 1 / Math.sqrt(companyCount) * .2, .1, .16)
  const callAxis = comparisonAxisRange(units.map((item) => item.calls), companyCount <= 6 ? 3 : 4, { floor: 0, paddingRatio: axisPadding, dynamic: true })
  const completionAxis = comparisonAxisRange(units.map((item) => item.completionRate), companyCount <= 6 ? 3 : 4, { floor: 0, ceiling: 100, paddingRatio: axisPadding, dynamic: true })
  const callScalePower = comparisonScalePower(units.map((item) => item.calls))
  const xTicks = [0, .25, .5, .75, 1].map((ratio) => ({
    value: Math.round(callAxis.min + (callAxis.max - callAxis.min) * ratio ** (1 / callScalePower)),
    x: frame.left + innerWidth * ratio,
  }))
  const yTicks = [0, .25, .5, .75, 1].map((ratio) => ({
    value: completionAxis.min + (completionAxis.max - completionAxis.min) * ratio,
    y: height - frame.bottom - innerHeight * ratio,
  }))
  const availableAreaPerCompany = innerWidth * innerHeight / companyCount
  const maxRadius = clamp(Math.sqrt(availableAreaPerCompany) * (isCompact ? .28 : .25), isCompact ? 14 : 18, isCompact ? 28 : 38)
  const minRadius = maxRadius * (comparisonIsDense.value ? .48 : .44)
  const minBubbleArea = minRadius ** 2
  const maxBubbleArea = maxRadius ** 2
  const bubbleGap = clamp(
    Math.sqrt(availableAreaPerCompany) * (comparisonIsDense.value ? .135 : .1),
    isCompact ? 10 : 12,
    isCompact ? 19 : 26,
  )
  const bubbles = units.map((item) => ({
    ...item,
    targetX: frame.left + ((item.calls - callAxis.min) / Math.max(callAxis.max - callAxis.min, 1)) ** callScalePower * innerWidth,
    targetY: height - frame.bottom - (item.completionRate - completionAxis.min) / Math.max(completionAxis.max - completionAxis.min, 1) * innerHeight,
    radius: Math.sqrt(minBubbleArea + item.activeRate / 100 * (maxBubbleArea - minBubbleArea)),
  }))
  const minimumLabelFontSize = isCompact ? 7.1 : 7.4
  const maximumLabelFontSize = isCompact ? 9.4 : 10.6
  const radiusSpan = Math.max(maxRadius - minRadius, 1)
  bubbles.forEach((bubble) => {
    bubble.x = bubble.targetX
    bubble.y = bubble.targetY
    const radiusRatio = clamp((bubble.radius - minRadius) / radiusSpan, 0, 1)
    bubble.labelFontSize = Math.round((minimumLabelFontSize + radiusRatio * (maximumLabelFontSize - minimumLabelFontSize)) * 10) / 10
  })
  const labelWidths = new Map(bubbles.map((bubble) => [
    bubble.id,
    clamp(Array.from(bubble.name).length * bubble.labelFontSize + 8, 58, labelMaximum),
  ]))

  // Demo samples keep the metric direction while using a roomier collision layout for legible comparison.
  const layoutIterations = comparisonIsDense.value ? 144 : 96
  const targetAttraction = comparisonIsDense.value ? .014 : .026
  const collisionStrength = comparisonIsDense.value ? .58 : .5
  for (let iteration = 0; iteration < layoutIterations; iteration += 1) {
    bubbles.forEach((bubble) => {
      bubble.x += (bubble.targetX - bubble.x) * targetAttraction
      bubble.y += (bubble.targetY - bubble.y) * targetAttraction
    })

    for (let firstIndex = 0; firstIndex < bubbles.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < bubbles.length; secondIndex += 1) {
        const first = bubbles[firstIndex]
        const second = bubbles[secondIndex]
        let deltaX = second.x - first.x
        let deltaY = second.y - first.y
        let distance = Math.hypot(deltaX, deltaY)
        if (distance < .01) {
          const angle = (firstIndex * 47 + secondIndex * 71) * Math.PI / 180
          deltaX = Math.cos(angle)
          deltaY = Math.sin(angle)
          distance = 1
        }
        const minimumDistance = first.radius + second.radius + bubbleGap
        if (distance >= minimumDistance) continue
        const push = (minimumDistance - distance) * collisionStrength
        first.x -= deltaX / distance * push
        first.y -= deltaY / distance * push
        second.x += deltaX / distance * push
        second.y += deltaY / distance * push
      }
    }

    bubbles.forEach((bubble) => {
      bubble.x = clamp(bubble.x, frame.left + bubble.radius, width - frame.right - bubble.radius)
      bubble.y = clamp(bubble.y, frame.top + bubble.radius, height - frame.bottom - bubble.radius)
    })
  }

  const labelHeight = Math.ceil(maximumLabelFontSize + 6)
  const attachLabel = (bubble, rect, side) => {
    bubble.label = {
      x: side === 'left' ? rect.x : side === 'right' ? rect.x + rect.width : rect.x + rect.width / 2,
      y: rect.y + rect.height / 2 + bubble.labelFontSize * .34,
      anchor: side === 'left' ? 'start' : side === 'right' ? 'end' : 'middle',
      fontSize: bubble.labelFontSize,
    }
  }

  const labelRow = labelHeight + 4
  const chartBounds = {
    left: 3,
    right: width - 3,
    top: 3,
    bottom: height - 22,
  }
  const overlaps = (first, second, gap = 4) => first.x < second.x + second.width + gap
    && first.x + first.width + gap > second.x
    && first.y < second.y + second.height + gap
    && first.y + first.height + gap > second.y
  const rowY = (value) => clamp(
    Math.round((value - chartBounds.top) / labelRow) * labelRow + chartBounds.top,
    chartBounds.top,
    chartBounds.bottom - labelHeight,
  )
  const candidatesByBubble = new Map()
  bubbles.forEach((bubble) => {
    const labelWidth = labelWidths.get(bubble.id)
    const labelOverlap = clamp(Math.min(labelWidth * .42, bubble.radius * 1.3) + 6, 20, 40)
    const candidates = []
    const addCandidate = (x, y, side, priority = 0, snapToRow = true) => {
      const candidateY = snapToRow ? rowY(y) : clamp(y, chartBounds.top, chartBounds.bottom - labelHeight)
      const rect = {
        x: clamp(x, chartBounds.left, chartBounds.right - labelWidth),
        y: candidateY,
        width: labelWidth,
        height: labelHeight,
      }
      const endX = side === 'left' ? rect.x + rect.width : rect.x
      const endY = rect.y + rect.height / 2
      const distance = Math.hypot(endX - bubble.x, endY - bubble.y)
      const clampedDistance = Math.abs(rect.x - x) + Math.abs(rect.y - candidateY)
      const distanceCost = distance + Math.max(distance - 52, 0) * 6
      candidates.push({ rect, side, distance, score: distanceCost + clampedDistance * 2 + priority })
    }

    const preferredSide = bubble.x < frame.left + innerWidth / 2 ? 'right' : 'left'
    const sideOrder = preferredSide === 'right' ? ['right', 'left'] : ['left', 'right']
    ;[0, -.38, .38, -.68, .68, -.94, .94].forEach((verticalRatio, slotIndex) => {
      const y = bubble.y + bubble.radius * verticalRatio - labelHeight / 2
      sideOrder.forEach((side, sideIndex) => {
        const x = side === 'right'
          ? bubble.x + bubble.radius - labelOverlap
          : bubble.x - bubble.radius - labelWidth + labelOverlap
        addCandidate(x, y, side, slotIndex * 12 + sideIndex * 2, false)
      })
    })

    ;[10, 22, 34, 46, 58].forEach((extra, ringIndex) => {
      const priority = 96 + ringIndex * 12
      ;[-1, 1].forEach((direction, verticalIndex) => {
        const y = bubble.y + direction * (bubble.radius + extra) - labelHeight / 2
        sideOrder.forEach((side, sideIndex) => {
          const x = side === 'right'
            ? bubble.x + bubble.radius - labelOverlap
            : bubble.x - bubble.radius - labelWidth + labelOverlap
          addCandidate(x, y, side, priority + verticalIndex * 4 + sideIndex * 2)
        })
      })
    })

    // Local row alternatives keep every name on the bubble's left or right pressure edge.
    const localTop = Math.max(chartBounds.top, bubble.y - 82)
    const localBottom = Math.min(chartBounds.bottom - labelHeight, bubble.y + 82)
    for (let y = localTop; y <= localBottom; y += labelRow) {
      sideOrder.forEach((side, sideIndex) => {
        const x = side === 'right'
          ? bubble.x + bubble.radius - labelOverlap
          : bubble.x - bubble.radius - labelWidth + labelOverlap
        addCandidate(x, y, side, 180 + sideIndex * 2)
      })
    }
    candidatesByBubble.set(bubble.id, candidates)
  })

  const crowding = new Map(bubbles.map((bubble) => [
    bubble.id,
    bubbles.filter((item) => item.id !== bubble.id && Math.hypot(item.x - bubble.x, item.y - bubble.y) < 96).length,
  ]))
  const byY = [...bubbles].sort((first, second) => first.y - second.y || first.x - second.x)
  const byX = [...bubbles].sort((first, second) => first.x - second.x || first.y - second.y)
  const byCrowding = [...bubbles].sort((first, second) => crowding.get(second.id) - crowding.get(first.id) || first.y - second.y)
  const orders = [byY, [...byY].reverse(), byX, [...byX].reverse(), byCrowding]
  ;[byY, byX, byCrowding].forEach((ordered) => {
    ordered.forEach((_, offset) => orders.push([...ordered.slice(offset), ...ordered.slice(0, offset)]))
  })

  const trials = orders.map((ordered) => {
    const placed = []
    const selections = new Map()
    let labelCollisions = 0
    let totalDistance = 0
    let maximumDistance = 0
    let totalCandidateScore = 0

    ordered.forEach((bubble) => {
      const selected = candidatesByBubble.get(bubble.id)
        .map((candidate) => {
          const collisions = placed.filter((rect) => overlaps(candidate.rect, rect)).length
          return { ...candidate, collisions, placementScore: candidate.score + collisions * 100000 }
        })
        .sort((first, second) => first.placementScore - second.placementScore)[0]
      placed.push(selected.rect)
      selections.set(bubble.id, selected)
      labelCollisions += selected.collisions
      totalDistance += selected.distance
      maximumDistance = Math.max(maximumDistance, selected.distance)
      totalCandidateScore += selected.score
    })

    return {
      selections,
      score: labelCollisions * 10000000 + maximumDistance * 22 + totalDistance + totalCandidateScore,
    }
  })
  const bestTrial = trials.sort((first, second) => first.score - second.score)[0]
  bubbles.forEach((bubble) => {
    const selected = bestTrial.selections.get(bubble.id)
    attachLabel(bubble, selected.rect, selected.side)
  })

  return {
    width,
    height,
    frame,
    xTicks,
    yTicks,
    bubbles: bubbles
      .sort((first, second) => Number(first.id === comparisonHover.value) - Number(second.id === comparisonHover.value)),
  }
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
            <div class="cockpit-active-user-summary" :aria-label="`${selectedPeriod.name}活跃用户 ${number(activeUsers)} 人`">
              <span>{{ selectedPeriod.name }}活跃用户</span>
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
          <div class="cockpit-comparison-controls">
            <BaseSelect v-model="comparisonDimension" class="cockpit-comparison-dimension-select" :options="comparisonDimensionOptions" aria-label="选择比较维度" tone="dark" size="sm" menu-class="cockpit-comparison-select-menu" @change="selectComparisonFilter" />
            <BaseSelect v-model="comparisonPeriod" class="cockpit-comparison-period-select" :options="comparisonPeriodOptions" aria-label="选择比较时间范围" tone="dark" size="sm" menu-class="cockpit-comparison-select-menu" @change="selectComparisonFilter" />
          </div>
        </header>
        <div class="cockpit-comparison-content">
          <div class="cockpit-comparison-legend" :class="{ 'has-hover-readout': comparisonHoverBubble }" aria-label="图表统计口径">
            <div class="cockpit-comparison-encoding">
              <span><i class="axis-x" /><b>横轴</b>智能应用调用量 <em>越右越高</em></span>
              <span><i class="axis-y" /><b>纵轴</b>任务完成率 <em>越上越高</em></span>
              <span><i class="axis-size" /><b>大小</b>活跃用户占比 <em>越大越高</em></span>
              <span><i class="axis-color" /><b>颜色</b>不同单位</span>
            </div>
            <p v-if="comparisonHoverBubble" class="cockpit-comparison-hover-readout" aria-live="polite">
              <b>{{ comparisonHoverBubble.name }}</b>
              <span>调用 {{ number(comparisonHoverBubble.calls) }} 次</span>
              <span>完成率 {{ percent(comparisonHoverBubble.completionRate) }}</span>
              <span>活跃 {{ percent(comparisonHoverBubble.activeRate) }}</span>
            </p>
          </div>
          <div class="cockpit-comparison-chart">
            <svg ref="comparisonChartSvg" :viewBox="`0 0 ${comparisonPlot.width} ${comparisonPlot.height}`" preserveAspectRatio="xMidYMid meet" role="img" :aria-label="`${comparisonTitle}。横轴为智能应用调用量，纵轴为任务完成率，气泡面积为活跃用户占比，颜色区分单位。`">
              <g class="cockpit-comparison-grid">
                <line v-for="tick in comparisonPlot.yTicks" :key="`y-grid-${tick.value}`" :x1="comparisonPlot.frame.left" :x2="comparisonPlot.width - comparisonPlot.frame.right" :y1="tick.y" :y2="tick.y" />
                <line v-for="tick in comparisonPlot.xTicks" :key="`x-grid-${tick.value}`" :x1="tick.x" :x2="tick.x" :y1="comparisonPlot.frame.top" :y2="comparisonPlot.height - comparisonPlot.frame.bottom" />
              </g>
              <line class="cockpit-comparison-axis" :x1="comparisonPlot.frame.left" :x2="comparisonPlot.width - comparisonPlot.frame.right" :y1="comparisonPlot.height - comparisonPlot.frame.bottom" :y2="comparisonPlot.height - comparisonPlot.frame.bottom" />
              <line class="cockpit-comparison-axis" :x1="comparisonPlot.frame.left" :x2="comparisonPlot.frame.left" :y1="comparisonPlot.frame.top" :y2="comparisonPlot.height - comparisonPlot.frame.bottom" />
              <g class="cockpit-comparison-ticks">
                <text v-for="tick in comparisonPlot.xTicks" :key="`x-tick-${tick.value}`" :x="tick.x" :y="comparisonPlot.height - 13" text-anchor="middle">{{ number(tick.value) }}</text>
                <text v-for="tick in comparisonPlot.yTicks" :key="`y-tick-${tick.value}`" :x="comparisonPlot.frame.left - 7" :y="tick.y + 3" text-anchor="end">{{ percent(tick.value) }}</text>
              </g>
              <text
                class="cockpit-comparison-axis-title y-axis"
                :x="-((comparisonPlot.frame.top + comparisonPlot.height - comparisonPlot.frame.bottom) / 2)"
                y="10"
                text-anchor="middle"
                transform="rotate(-90)"
              >任务完成率（%）↑</text>
              <text class="cockpit-comparison-axis-title x-axis" :x="comparisonPlot.width - comparisonPlot.frame.right" :y="comparisonPlot.height - 3" text-anchor="end">智能应用调用量（次）→</text>
              <g class="cockpit-comparison-bubble-layer">
                <g
                  v-for="bubble in comparisonPlot.bubbles"
                  :key="`bubble-${bubble.id}`"
                  class="cockpit-comparison-bubble"
                  :class="{ hovered: comparisonHover === bubble.id }"
                  :style="{ '--bubble-tone': bubble.tone, '--bubble-label-size': `${bubble.label?.fontSize || 8.4}px` }"
                  role="img"
                  tabindex="0"
                  :aria-label="`${bubble.name}，${bubble.level}；智能应用调用量 ${number(bubble.calls)} 次，任务完成率 ${percent(bubble.completionRate)}，活跃用户占比 ${percent(bubble.activeRate)}。`"
                  @mouseenter="setComparisonHover(bubble.id)"
                  @mouseleave="clearComparisonHover(bubble.id)"
                  @focus="setComparisonHover(bubble.id)"
                  @blur="clearComparisonHover(bubble.id)"
                >
                  <circle class="cockpit-comparison-bubble-halo is-outer" :cx="bubble.x" :cy="bubble.y" :r="bubble.radius + 11" />
                  <circle class="cockpit-comparison-bubble-halo is-inner" :cx="bubble.x" :cy="bubble.y" :r="bubble.radius + 4" />
                  <circle class="cockpit-comparison-bubble-point" :cx="bubble.x" :cy="bubble.y" :r="bubble.radius"><title>{{ `${bubble.name}｜调用量 ${number(bubble.calls)} 次｜任务完成率 ${percent(bubble.completionRate)}｜活跃用户占比 ${percent(bubble.activeRate)}` }}</title></circle>
                </g>
              </g>
              <g class="cockpit-comparison-label-layer" aria-hidden="true">
                <g
                  v-for="bubble in comparisonPlot.bubbles"
                  v-show="bubble.label"
                  :key="`label-${bubble.id}`"
                  class="cockpit-comparison-bubble-label"
                  :class="{ hovered: comparisonHover === bubble.id }"
                  :style="{ '--bubble-tone': bubble.tone }"
                >
                  <text :x="bubble.label?.x" :y="bubble.label?.y" :text-anchor="bubble.label?.anchor">{{ bubble.name }}</text>
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
            <p class="cockpit-definition-note">所有指标均按以上口径汇总与呈现。</p>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
