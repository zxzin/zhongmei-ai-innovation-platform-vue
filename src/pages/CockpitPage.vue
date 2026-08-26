<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Activity, ArrowDownRight, ArrowUpRight, Clock3, FileText, Info, Maximize2, Minimize2, UsersRound, X } from '@lucide/vue'
import BaseSelect from '../components/BaseSelect.vue'
import { useUiStore } from '../stores/ui.js'
import { agentUsage } from '../data/demo.js'
import { appPerformance, cockpitAppScopeProfiles, cockpitComparisonScopes, cockpitPeriods, cockpitScopes } from '../data/platform.js'

const ui = useUiStore()
const activePeriod = ref('month')
const activeScope = ref('group')
const comparisonDimension = ref('group')
const comparisonPeriod = ref('month')
const comparisonHover = ref(null)
const comparisonChartSvg = ref(null)
const comparisonChartSize = ref({ width: 760, height: 244 })
const isDataDefinitionOpen = ref(false)
const dataDefinitionPanel = ref(null)
const appTones = ['#52c9ef', '#66d6bf', '#8ba8ed', '#ddb46a', '#b99ae9', '#e78296']
const comparisonTones = ['#45c9f0', '#55d9b8', '#8ea9f4', '#eab666', '#bf93eb', '#ea7f9a', '#70b8f0', '#79c68c', '#d18dce', '#e89158', '#6ad1d0', '#b8cd71', '#72a6e8', '#d7a176', '#82c8a2', '#c58bd4']
const cockpitAppOrder = ['技术问答', '语义检索', '技术预研报告', '创新性分析', '可行性分析', '技术交底书撰写']
let comparisonChartObserver
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
      { label: '任务完成率', formula: '已完成任务 ÷ 已受理任务 × 100%。', detail: '按当前统计周期与组织范围计算。' },
      { label: '平均首次响应', formula: '首次系统响应耗时之和 ÷ 已获得首次响应的调用数。', detail: '不包含人工处理或人工停留时长。' },
      { label: '活跃用户数', formula: '周期内登录、发起任务或查看历史记录的去重用户数。', detail: '同一用户在周期内多次操作仍按 1 人计算；活跃率 = 活跃用户数 ÷ 注册用户数。' },
      { label: '用户均调用频次', formula: '智能应用调用总次数 ÷ 注册用户数。', detail: '调用总次数包含成功、失败、超时和中止的发起。' },
      { label: '调用成功率', formula: '成功调用次数 ÷ 智能应用调用总次数 × 100%。', detail: '失败率 = 未成功调用次数 ÷ 调用总次数；两者仅统计当前筛选范围。' },
      { label: '调用次数趋势', formula: '按所选周期拆分时间段，分别汇总六项智能应用的调用次数。', detail: '日按时段、近 30 天按周、近 90 天及本年度按月呈现。' },
    ],
  },
  {
    id: 'tasks',
    title: '任务看板',
    items: [
      { label: '智能应用运行状态', formula: '当前服务可正常接受调用记为 1，服务异常或不可用记为 0。', detail: '运行状态是当前时点快照，不按统计周期累计，也不参与调用量计算。' },
    ],
  },
  {
    id: 'performance',
    title: '性能看板',
    items: [
      { label: '单应用调用量', formula: '当前筛选范围内该智能应用被发起调用的总次数。', detail: '六项智能应用分别统计，成功与未成功调用均计入。' },
      { label: '单应用任务完成率', formula: '该智能应用已完成任务 ÷ 该智能应用已受理任务 × 100%。', detail: '每项智能应用独立计算。' },
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
const scaleCount = (value) => Math.round(value * periodScale.value)
const scaleUser = (value) => Math.max(1, Math.round(value * selectedPeriod.value.userScale))
const currentCalls = computed(() => scaleCount(selectedScope.value.calls))
const currentTasks = computed(() => scaleCount(selectedScope.value.tasks))
const completedTasks = computed(() => scaleCount(selectedScope.value.completedTasks))
const activeUsers = computed(() => scaleUser(selectedScope.value.activeUsers))
const registeredUsers = computed(() => selectedScope.value.registeredUsers)
const completionRate = computed(() => completedTasks.value / Math.max(currentTasks.value, 1) * 100)
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

function syncComparisonChartSize() {
  const rect = comparisonChartSvg.value?.getBoundingClientRect()
  const width = Math.round(rect?.width || 0)
  const height = Math.round(rect?.height || 0)

  if (width < 260 || height < 160) return
  if (comparisonChartSize.value.width === width && comparisonChartSize.value.height === height) return
  comparisonChartSize.value = { width, height }
}

onMounted(() => {
  document.addEventListener('keydown', handleCockpitKeydown)
  syncComparisonChartSize()

  if (typeof ResizeObserver !== 'undefined' && comparisonChartSvg.value) {
    comparisonChartObserver = new ResizeObserver(syncComparisonChartSize)
    comparisonChartObserver.observe(comparisonChartSvg.value)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleCockpitKeydown)
  comparisonChartObserver?.disconnect()
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
const callResultBreakdown = computed(() => [
  { id: 'success', label: '成功', value: successfulCalls.value, tone: '#54d6ba' },
  { id: 'failed', label: '失败', value: failedCalls.value, tone: '#e5b867' },
])
const appTrendRows = computed(() => {
  return appRows.value.map((app) => ({
    ...app,
    values: trendData.value.map((point) => Math.max(0, Math.round(point.calls * app.calls / Math.max(currentCalls.value, 1)))),
  }))
})
const appCallTrendChart = computed(() => multiLineGeometry(
  appTrendRows.value.map((app) => ({ id: app.id, name: app.name, tone: app.tone, values: app.values })),
  620,
  184,
  30,
  12,
  15,
  28,
  trendData.value.map((item) => ({ label: item.label, fullLabel: item.label })),
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

function makeComparisonUnit({ id, name, level, calls, acceptedTasks, completedTasks, activeUsers, registeredUsers, tone }) {
  const profile = selectedComparisonPeriod.value
  const periodSalt = comparisonPeriod.value === 'month' ? 1 : comparisonPeriod.value === 'quarter' ? 2 : 3
  const variance = comparisonVariance(id, periodSalt)
  const countFactor = profile.countScale * (1 + variance * .28 * profile.variance)
  const scaledCalls = Math.max(1, Math.round(calls * countFactor))
  const scaledAcceptedTasks = Math.min(scaledCalls, Math.max(1, Math.round(acceptedTasks * countFactor * (1 - variance * .025))))
  const baseCompletionRate = completedTasks / Math.max(acceptedTasks, 1) * 100
  const targetCompletionRate = clamp(baseCompletionRate + profile.completionShift + variance * 6.2 * profile.variance, 76, 99.5)
  const scaledCompletedTasks = Math.min(scaledAcceptedTasks, Math.max(0, Math.round(scaledAcceptedTasks * targetCompletionRate / 100)))
  const safeRegisteredUsers = Math.max(registeredUsers, 1)
  const baseActiveRate = activeUsers / safeRegisteredUsers
  const targetActiveRate = clamp(baseActiveRate * profile.activeScale * (1 + variance * .16 * profile.variance), .12, .98)
  const scaledActiveUsers = Math.min(safeRegisteredUsers, Math.max(1, Math.round(safeRegisteredUsers * targetActiveRate)))

  return {
    id,
    name,
    level,
    calls: scaledCalls,
    acceptedTasks: scaledAcceptedTasks,
    completedTasks: scaledCompletedTasks,
    completionRate: scaledCompletedTasks / Math.max(scaledAcceptedTasks, 1) * 100,
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
      acceptedTasks: scope.acceptedTasks,
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
    acceptedTasks: child.acceptedTasks,
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
const comparisonTitle = computed(() => '各级单位使用对比')
const comparisonDescription = computed(() => {
  if (comparisonDimension.value === 'secondary') return `二级公司 · ${comparisonUnitCount.value} 家横向对比 · ${selectedComparisonPeriod.value.label}`
  if (comparisonDimension.value === 'tertiary') return `三级公司 · ${comparisonUnitCount.value} 家横向对比 · ${selectedComparisonPeriod.value.label}`
  return `全集团 · ${comparisonUnitCount.value} 家公司 · ${selectedComparisonPeriod.value.label}`
})
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
  const rawSpan = Math.max(maximum - minimum, Math.max(Math.abs(maximum), 1) * .08)
  const paddedMinimum = minimum - rawSpan * .12
  const paddedMaximum = maximum + rawSpan * .12
  const step = niceAxisStep((paddedMaximum - paddedMinimum) / segments)
  const calculatedMin = Math.floor(paddedMinimum / step) * step
  const calculatedMax = Math.ceil(paddedMaximum / step) * step
  const min = Number.isFinite(limits.floor) ? Math.max(limits.floor, calculatedMin) : calculatedMin
  const max = Number.isFinite(limits.ceiling) ? Math.min(limits.ceiling, calculatedMax) : calculatedMax

  return { min, max: max > min ? max : min + step }
}

const comparisonPlot = computed(() => {
  const width = Math.max(280, comparisonChartSize.value.width)
  const height = Math.max(220, comparisonChartSize.value.height)
  const isCompact = width < 540
  const units = comparisonUnits.value
  const frame = {
    left: isCompact ? 42 : 52,
    right: isCompact ? 18 : 28,
    top: 30,
    bottom: 38,
  }
  const innerWidth = Math.max(110, width - frame.left - frame.right)
  const innerHeight = Math.max(106, height - frame.top - frame.bottom)
  const callAxis = comparisonAxisRange(units.map((item) => item.calls), 4, { floor: 0 })
  const completionAxis = comparisonAxisRange(units.map((item) => item.completionRate), 4, { floor: 0, ceiling: 100 })
  const xTicks = [0, .25, .5, .75, 1].map((ratio) => ({
    value: callAxis.min + (callAxis.max - callAxis.min) * ratio,
    x: frame.left + innerWidth * ratio,
  }))
  const yTicks = [0, .25, .5, .75, 1].map((ratio) => ({
    value: completionAxis.min + (completionAxis.max - completionAxis.min) * ratio,
    y: height - frame.bottom - innerHeight * ratio,
  }))
  const maxRadius = isCompact ? 16 : 21
  const minBubbleArea = 6.5 ** 2
  const maxBubbleArea = maxRadius ** 2
  const bubbles = units.map((item) => ({
    ...item,
    targetX: frame.left + (item.calls - callAxis.min) / Math.max(callAxis.max - callAxis.min, 1) * innerWidth,
    targetY: height - frame.bottom - (item.completionRate - completionAxis.min) / Math.max(completionAxis.max - completionAxis.min, 1) * innerHeight,
    radius: Math.sqrt(minBubbleArea + item.activeRate / 100 * (maxBubbleArea - minBubbleArea)),
  }))
  bubbles.forEach((bubble) => {
    bubble.x = bubble.targetX
    bubble.y = bubble.targetY
  })

  // The visual position keeps the metric direction while adding only the spacing needed to separate close samples.
  for (let iteration = 0; iteration < 54; iteration += 1) {
    bubbles.forEach((bubble) => {
      bubble.x += (bubble.targetX - bubble.x) * .018
      bubble.y += (bubble.targetY - bubble.y) * .018
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
        const minimumDistance = first.radius + second.radius + (isCompact ? 8 : 13)
        if (distance >= minimumDistance) continue
        const push = (minimumDistance - distance) * .5
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

  const placedLabels = []
  const labelHeight = 16
  const overlaps = (first, second, gap = 4) => first.x < second.x + second.width + gap
    && first.x + first.width + gap > second.x
    && first.y < second.y + second.height + gap
    && first.y + first.height + gap > second.y
  const touchesBubble = (rect, bubble) => {
    const nearestX = clamp(bubble.x, rect.x, rect.x + rect.width)
    const nearestY = clamp(bubble.y, rect.y, rect.y + rect.height)
    return Math.hypot(bubble.x - nearestX, bubble.y - nearestY) < bubble.radius + 5
  }

  ;[...bubbles]
    .sort((first, second) => first.y - second.y || first.x - second.x)
    .forEach((bubble) => {
      const labelWidth = clamp(Array.from(bubble.name).length * 8.2 + 8, 62, 116)
      const baseDistance = bubble.radius + 7
      const candidates = [0, 13, 26, 39].flatMap((extra) => {
        const distance = baseDistance + extra
        return [
          { x: bubble.x - labelWidth / 2, y: bubble.y + distance, anchor: 'middle', priority: 0 },
          { x: bubble.x + distance, y: bubble.y - labelHeight / 2, anchor: 'start', priority: 1 },
          { x: bubble.x - distance - labelWidth, y: bubble.y - labelHeight / 2, anchor: 'end', priority: 1 },
          { x: bubble.x - labelWidth / 2, y: bubble.y - distance - labelHeight, anchor: 'middle', priority: 2 },
          { x: bubble.x + distance * .72, y: bubble.y + distance * .64, anchor: 'start', priority: 2 },
          { x: bubble.x - labelWidth - distance * .72, y: bubble.y + distance * .64, anchor: 'end', priority: 2 },
        ]
      })

      const ranked = candidates.map((candidate, index) => {
        const rect = {
          x: clamp(candidate.x, frame.left + 2, width - frame.right - labelWidth - 2),
          y: clamp(candidate.y, frame.top + 1, height - frame.bottom - labelHeight - 1),
          width: labelWidth,
          height: labelHeight,
        }
        const labelCollisions = placedLabels.filter((placed) => overlaps(rect, placed)).length
        const bubbleCollisions = bubbles.filter((point) => point.id !== bubble.id && touchesBubble(rect, point)).length
        return { rect, anchor: candidate.anchor, score: labelCollisions * 10000 + bubbleCollisions * 600 + candidate.priority * 12 + index }
      }).sort((first, second) => first.score - second.score)
      const selected = ranked[0]
      const rect = selected.rect
      const isBelow = rect.y >= bubble.y + bubble.radius
      const isAbove = rect.y + rect.height <= bubble.y - bubble.radius
      const isLeft = !isBelow && !isAbove && rect.x + rect.width / 2 < bubble.x
      const endX = isBelow || isAbove
        ? clamp(bubble.x, rect.x + 5, rect.x + rect.width - 5)
        : isLeft ? rect.x + rect.width : rect.x
      const endY = isBelow ? rect.y : isAbove ? rect.y + rect.height : rect.y + rect.height / 2
      const lineLength = Math.hypot(endX - bubble.x, endY - bubble.y) || 1

      bubble.label = {
        lineStartX: bubble.x + (endX - bubble.x) / lineLength * (bubble.radius + 1),
        lineStartY: bubble.y + (endY - bubble.y) / lineLength * (bubble.radius + 1),
        lineEndX: endX,
        lineEndY: endY,
        x: selected.anchor === 'middle' ? rect.x + rect.width / 2 : selected.anchor === 'end' ? rect.x + rect.width : rect.x,
        y: rect.y + 11,
        anchor: selected.anchor,
      }
      placedLabels.push(rect)
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
    id: 'active-users', label: '活跃用户数', value: number(activeUsers.value), unit: '人',
    tone: '#8ba8ed', icon: UsersRound,
    context: `占注册用户 ${percent(activeRate.value)}`,
  },
  {
    id: 'per-user-calls', label: '用户均调用频次', value: perUserCallFrequency.value === null ? '—' : perUserCallFrequency.value.toFixed(1), unit: '次 / 人',
    tone: '#b99ae9', icon: UsersRound,
    context: `${number(currentCalls.value)} 次 ÷ ${number(registeredUsers.value)} 人`,
  },
  {
    id: 'success-rate', label: '调用成功率', value: percent(callSuccessRate.value), unit: '',
    tone: '#e78296', icon: Activity,
    context: `${number(successfulCalls.value)} 成功 / ${number(failedCalls.value)} 失败`,
  },
])
</script>

<template>
  <section class="page-container cockpit-page cockpit-view">
    <header class="cockpit-toolbar">
      <div class="cockpit-title">
        <span>运营驾驶舱</span>
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
          <section class="cockpit-call-trend" aria-label="六项智能应用调用次数趋势">
            <header><span>调用次数趋势</span><small>{{ selectedPeriod.name }}</small></header>
            <div class="cockpit-call-trend-legend" aria-label="智能应用图例">
              <span v-for="app in appTrendRows" :key="app.id" :style="{ '--app-tone': app.tone }"><i /><b>{{ app.name }}</b><em>{{ number(app.calls) }} 次</em></span>
            </div>
            <div class="cockpit-call-trend-chart">
              <svg :viewBox="`0 0 ${appCallTrendChart.width} ${appCallTrendChart.height}`" preserveAspectRatio="none" role="img" :aria-label="`六项智能应用在${selectedPeriod.name}内的调用次数折线趋势`">
                <g class="cockpit-chart-grid"><line v-for="grid in appCallTrendChart.grid" :key="grid.y" :x1="appCallTrendChart.left" :x2="appCallTrendChart.width - appCallTrendChart.right" :y1="grid.y" :y2="grid.y" /></g>
                <g class="cockpit-call-trend-y-axis"><text v-for="grid in appCallTrendChart.grid" :key="grid.y" :x="appCallTrendChart.left - 6" :y="grid.y + 3" text-anchor="end">{{ number(grid.value) }}</text></g>
                <g v-for="series in appCallTrendChart.series" :key="series.id" :style="{ '--app-tone': series.tone }" class="cockpit-call-trend-series">
                  <path :d="series.path" />
                  <circle v-for="(point, index) in series.points" :key="index" :cx="point.x" :cy="point.y" r="2.5"><title>{{ `${series.name}｜${appCallTrendChart.labels[index].fullLabel} ${series.values[index]} 次` }}</title></circle>
                </g>
                <g class="cockpit-call-trend-x-axis"><text v-for="label in appCallTrendChart.labels" :key="label.index" :x="label.x" :y="appCallTrendChart.height - 7" text-anchor="middle">{{ label.label }}</text></g>
              </svg>
            </div>
          </section>

          <section class="cockpit-success-summary" aria-label="当前筛选范围调用成功率">
            <header><span>调用结果</span><small>{{ selectedPeriod.name }}</small></header>
            <div class="cockpit-success-donut" :style="{ '--success-rate': `${callSuccessRate}%` }" role="img" :aria-label="`成功 ${number(successfulCalls)} 次，失败 ${number(failedCalls)} 次，调用成功率 ${percent(callSuccessRate)}`">
              <div><b>{{ percent(callSuccessRate) }}</b><span>调用成功率</span></div>
            </div>
            <dl>
              <div v-for="item in callResultBreakdown" :key="item.id" :style="{ '--result-tone': item.tone }"><dt><i />{{ item.label }}</dt><dd>{{ number(item.value) }}<small>次</small></dd></div>
            </dl>
          </section>
        </div>
      </div>
    </section>

    <section class="cockpit-main-grid">
      <section class="cockpit-panel cockpit-task-panel" aria-label="AI 应用任务看板">
        <header class="cockpit-panel-heading"><h2><span>02 /</span> 任务看板</h2><p>当前运行快照 · {{ onlineAppCount }} / {{ appRows.length }} 正常</p></header>
        <section class="cockpit-runtime-grid" aria-label="六项智能应用运行状态">
          <article v-for="app in appRows" :key="app.id" :class="{ offline: !app.online }" :style="{ '--app-tone': app.tone }" :aria-label="`${app.name}运行状态：${app.online ? 1 : 0}，${app.online ? '正常' : '异常'}`">
            <div><i /><b>{{ app.name }}</b></div>
            <strong><b>{{ app.online ? 1 : 0 }}</b><span>{{ app.online ? '正常' : '异常' }}</span></strong>
          </article>
        </section>
      </section>

      <section class="cockpit-panel cockpit-performance-panel" aria-label="AI 应用性能看板">
        <header class="cockpit-panel-heading"><h2><span>03 /</span> 性能看板</h2><p>六项智能应用独立性能 · {{ selectedPeriod.name }}</p></header>
        <section class="cockpit-performance-matrix" aria-label="六项智能应用四项性能指标">
          <header><span>智能应用</span><span>调用量</span><span>任务完成率</span><span>平均首次响应<small>越短越好</small></span><span>调用成功率</span></header>
          <article v-for="app in appRows" :key="app.id" :style="{ '--app-tone': app.tone }">
            <h3><i />{{ app.name }}</h3>
            <div class="calls"><span><i :style="{ width: `${app.calls / maxAppCalls * 100}%` }" /></span><b>{{ number(app.calls) }}<small>次</small></b></div>
            <div class="completion"><span><i :style="{ width: `${app.completion}%` }" /></span><b>{{ percent(app.completion) }}</b></div>
            <div class="response"><span><i :style="{ width: `${app.firstResponseSeconds / maxAppResponse * 100}%` }" /></span><b>{{ app.firstResponseSeconds.toFixed(1) }}<small>秒</small></b></div>
            <div class="success"><span><i :style="{ width: `${app.success}%` }" /></span><b>{{ percent(app.success) }}</b></div>
          </article>
        </section>
      </section>
    </section>

    <section class="cockpit-comparison-wrap">
      <section class="cockpit-panel cockpit-comparison-panel" :class="{ 'is-dense': comparisonUnitCount > 6 }" aria-label="组织使用情况横向对比">
        <header class="cockpit-panel-heading cockpit-comparison-heading">
          <div class="cockpit-comparison-heading-copy">
            <h2><span>04 /</span> {{ comparisonTitle }}</h2>
            <p>{{ comparisonDescription }}</p>
          </div>
          <div class="cockpit-comparison-controls">
            <BaseSelect v-model="comparisonDimension" class="cockpit-comparison-dimension-select" :options="comparisonDimensionOptions" aria-label="选择比较维度" tone="dark" size="sm" @change="selectComparisonFilter" />
            <BaseSelect v-model="comparisonPeriod" class="cockpit-comparison-period-select" :options="comparisonPeriodOptions" aria-label="选择比较时间范围" tone="dark" size="sm" @change="selectComparisonFilter" />
          </div>
        </header>
        <div class="cockpit-comparison-content">
          <div class="cockpit-comparison-legend" aria-label="图表统计口径">
            <div class="cockpit-comparison-encoding">
              <span><i class="axis-x" /><b>横轴</b>智能应用调用量 <em>越右越高</em></span>
              <span><i class="axis-y" /><b>纵轴</b>任务完成率 <em>越上越高</em></span>
              <span><i class="axis-color" /><b>颜色</b>不同单位</span>
            </div>
            <p class="cockpit-comparison-hover-readout" aria-live="polite">
              <template v-if="comparisonHoverBubble">
                <b>{{ comparisonHoverBubble.name }}</b>
                <span>调用 {{ number(comparisonHoverBubble.calls) }} 次</span>
                <span>完成率 {{ percent(comparisonHoverBubble.completionRate) }}</span>
                <span>活跃 {{ percent(comparisonHoverBubble.activeRate) }}</span>
              </template>
              <template v-else>
                <b>单位明细</b>
                <span>悬停或聚焦气泡查看精确值</span>
              </template>
            </p>
          </div>
          <div class="cockpit-comparison-chart">
            <svg ref="comparisonChartSvg" :viewBox="`0 0 ${comparisonPlot.width} ${comparisonPlot.height}`" preserveAspectRatio="xMidYMid meet" role="img" :aria-label="`${comparisonTitle}。横轴为智能应用调用量，纵轴为任务完成率，气泡面积为活跃用户占比，颜色区分单位。`">
              <defs>
                <radialGradient v-for="bubble in comparisonPlot.bubbles" :id="`bubble-fill-${bubble.id}`" :key="`gradient-${bubble.id}`" cx="30%" cy="24%" r="78%">
                  <stop offset="0%" stop-color="#f2fdff" stop-opacity=".78" />
                  <stop offset="22%" :stop-color="bubble.tone" stop-opacity=".94" />
                  <stop offset="68%" :stop-color="bubble.tone" stop-opacity=".72" />
                  <stop offset="100%" :stop-color="bubble.tone" stop-opacity=".42" />
                </radialGradient>
              </defs>
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
              <text class="cockpit-comparison-axis-title y-axis" :x="comparisonPlot.frame.left" :y="15">任务完成率（%）↑</text>
              <text class="cockpit-comparison-axis-title x-axis" :x="comparisonPlot.width - comparisonPlot.frame.right" :y="comparisonPlot.height - 3" text-anchor="end">智能应用调用量（次）→</text>
              <g
                v-for="bubble in comparisonPlot.bubbles"
                :key="bubble.id"
                class="cockpit-comparison-bubble"
                :class="{ hovered: comparisonHover === bubble.id }"
                :style="{ '--bubble-tone': bubble.tone }"
                role="img"
                tabindex="0"
                :aria-label="`${bubble.name}，${bubble.level}；智能应用调用量 ${number(bubble.calls)} 次，任务完成率 ${percent(bubble.completionRate)}，活跃用户占比 ${percent(bubble.activeRate)}。`"
                @mouseenter="setComparisonHover(bubble.id)"
                @mouseleave="clearComparisonHover(bubble.id)"
                @focus="setComparisonHover(bubble.id)"
                @blur="clearComparisonHover(bubble.id)"
              >
                <line v-if="bubble.label" class="cockpit-comparison-label-connector" :x1="bubble.label.lineStartX" :y1="bubble.label.lineStartY" :x2="bubble.label.lineEndX" :y2="bubble.label.lineEndY" />
                <circle class="cockpit-comparison-bubble-halo" :cx="bubble.x" :cy="bubble.y" :r="bubble.radius + 4" />
                <circle class="cockpit-comparison-bubble-orbit" :cx="bubble.x" :cy="bubble.y" :r="bubble.radius + 1.5" />
                <circle class="cockpit-comparison-bubble-point" :cx="bubble.x" :cy="bubble.y" :r="bubble.radius" :style="{ fill: `url(#bubble-fill-${bubble.id})` }"><title>{{ `${bubble.name}｜调用量 ${number(bubble.calls)} 次｜任务完成率 ${percent(bubble.completionRate)}｜活跃用户占比 ${percent(bubble.activeRate)}` }}</title></circle>
                <g v-if="bubble.label" class="cockpit-comparison-bubble-label">
                  <text :x="bubble.label.x" :y="bubble.label.y" :text-anchor="bubble.label.anchor">{{ bubble.name }}</text>
                </g>
              </g>
            </svg>
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
            <p class="cockpit-definition-note">所有指标均按以上口径汇总与呈现。</p>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
