<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Users, FileStack, ChartNoAxesCombined, Upload, UserPlus, Search, Activity, Clock3, Network, BookOpenText, Settings2, ScrollText, Building2, ChevronRight, ChevronDown, Plus, Pencil, ServerCog, CheckCircle2, KeyRound, ArrowDown, ArrowUp, ChevronsUpDown, Trash2, ArrowLeft, Cloud } from '@lucide/vue'
import BaseModal from '../components/BaseModal.vue'
import BaseSelect from '../components/BaseSelect.vue'
import DateRangeFilter from '../components/DateRangeFilter.vue'
import { users, templates } from '../data/demo.js'
import { companyLibraries, departmentTree, systemLogs, operationRecords, appPerformance, cockpitPeriods, cockpitScopes } from '../data/platform.js'
import { useAuthStore } from '../stores/auth.js'
import { useUiStore } from '../stores/ui.js'

const route = useRoute(); const router = useRouter(); const auth = useAuthStore(); const ui = useUiStore()
const query = ref(''); const selectedUser = ref(null); const userEditorSource = ref('users'); const selectedLibrary = ref(null); const selectedTemplate = ref(null); const templateCreatorOpen = ref(false); const logType = ref('全部日志'); const logDateRange = ref({ start: '', end: '' }); const logUser = ref('全部用户'); const logScope = ref('全部范围'); const departmentFilter = ref('全部部门'); const roleFilter = ref('全部角色'); const statusFilter = ref('全部状态')
const passwordResetOpen = ref(false); const passwordResetSubmitting = ref(false); const passwordResetError = ref('')
const passwordResetForm = reactive({ newPassword: '', confirmPassword: '' })
const roleFilterOptions = ['全部角色', '管理员', '普通用户']
const statusFilterOptions = ['全部状态', '启用', '停用']
const logTypeOptions = ['全部日志', '登录日志', '操作日志']
const logUserOptions = ['全部用户', ...Array.from(new Set(systemLogs.map((item) => item.user)))]
const logScopeOptions = ['全部范围', ...Array.from(new Set(systemLogs.map((item) => item.scope)))]
const userRoleOptions = ['普通用户', '管理员']
const accountStatusOptions = ['启用', '停用']
const libraryAccessOptions = ['全集团', '深圳院及子部门', '授权项目组']
const localModelServiceOptions = [
  { value: 'deepseek-v4-local', label: 'DeepSeek V4', detail: '本地部署' },
  { value: 'qwen3-32b-local', label: 'Qwen3 32B', detail: '本地部署' },
  { value: 'custom-local', label: '自定义模型', detail: '本地部署' },
]
const cloudModelServiceOptions = [
  { value: 'deepseek-v3-cloud', label: 'DeepSeek V3', detail: '云端 API' },
  { value: 'qwen-max-cloud', label: 'Qwen Max', detail: '云端 API' },
  { value: 'openai-compatible-cloud', label: '兼容 API 模型', detail: '云端 API' },
]
const modelDeploymentMode = ref('local')
const activeModelDeploymentMode = ref('local')
const modelDeploymentModes = [
  { id: 'local', label: '本地部署', detail: '内网模型服务', icon: ServerCog },
  { id: 'cloud', label: '云端 API', detail: '云端模型服务', icon: Cloud },
]
const selectedLocalModelService = ref('deepseek-v4-local')
const selectedCloudModelService = ref('deepseek-v3-cloud')
const localModelConnection = reactive({
  endpoint: '',
  apiPath: '/v1/chat/completions',
  modelId: 'deepseek-v4',
  credential: '',
  timeout: '60',
})
const cloudModelConnection = reactive({
  endpoint: '',
  apiPath: '/v1/chat/completions',
  modelId: 'deepseek-chat',
  credential: '',
  timeout: '60',
})
const operationAppOptions = ['全部智能应用', ...new Set(operationRecords.map((item) => item.app))]
const operationDateOptions = ['全部日期', ...Array.from(new Set(operationRecords.map((item) => item.time.slice(0, 10)))).sort().reverse()]
const departmentHierarchy = ref(hydrateDepartmentTree(JSON.parse(JSON.stringify(departmentTree.flatMap((node) => node.children?.length ? node.children : [node])))))
const selectedDepartmentId = ref('dept-技术研发部')
const expandedDepartmentIds = ref(['dept-中煤深圳研究院'])
const departmentEditor = ref(null)
const memberAssignment = ref(null)
const memberRemoval = ref(null)
const departmentMembershipVersion = ref(0)
const departmentWorkspace = ref(null)
const operationsView = ref('overview')
const operationsPeriod = ref('year')
const operationsScope = ref('group')
const activityUserSort = ref({ key: 'lastActivityAt', direction: 'desc' })
const operationRecordSort = ref({ key: 'time', direction: 'desc' })
const operationRecordQuery = ref('')
const operationAppFilter = ref('全部智能应用')
const operationDateFilter = ref('全部日期')
const selectedOperationRecord = ref(null)
const selectedOperationsApp = ref(null)
const selectedOperationsOrganization = ref(null)
const sectionIds = ['operations','departments','templates','knowledge','users','config','logs']
const section = computed(() => sectionIds.includes(route.params.section) ? route.params.section : 'operations')
const selectedDepartmentEntry = computed(() => findDepartmentEntry(selectedDepartmentId.value) || findDepartmentEntry(departmentHierarchy.value[0]?.id))
const selectedDepartment = computed(() => selectedDepartmentEntry.value?.node)
const selectedDepartmentParent = computed(() => selectedDepartmentEntry.value?.parent?.name || '无')
const departmentOptions = computed(() => {
  departmentMembershipVersion.value
  return [
    { value: '未分配', label: '未分配', detail: '暂不关联部门' },
    ...flattenDepartmentHierarchy(departmentHierarchy.value).map((entry) => ({
      value: entry.node.name,
      label: entry.node.name,
      detail: departmentCompany(entry),
    })),
  ]
})
const userDepartmentFilterOptions = computed(() => [
  { value: '全部部门', label: '全部部门' },
  { value: '未分配', label: '未分配' },
  ...departmentHierarchy.value.flatMap((root) => {
    const children = root.children || []
    if (!children.length) return [{ value: root.name, label: root.name }]
    return [
      { value: `group-${root.id}`, label: root.name, detail: '一级部门', kind: 'group', disabled: true },
      ...flattenDepartmentHierarchy(children).map(({ node }) => ({ value: node.name, label: node.name, depth: 1 })),
    ]
  }),
])
const userEditorTitle = computed(() => {
  if (!selectedUser.value?._originalId) return '新建用户'
  return userEditorSource.value === 'departments' ? '编辑成员' : '编辑用户'
})
const selectedDepartmentMembers = computed(() => {
  departmentMembershipVersion.value
  return users.filter((user) => user.department === selectedDepartment.value?.name)
})
const canCreateDepartmentChild = computed(() => (selectedDepartment.value?.level || 0) < 2)
const departmentEditorTitle = computed(() => {
  if (departmentEditor.value?.mode === 'edit') return '编辑部门'
  return departmentEditor.value?.mode === 'root' ? '新建根部门' : '新建下级部门'
})
const memberAssignmentOptions = computed(() => {
  departmentMembershipVersion.value
  return users
    .filter((user) => user.department !== selectedDepartment.value?.name)
    .map((user) => ({ value: user.id, label: `${user.name} · ${user.id}`, detail: `${user.department || '未分配'} · ${user.role}` }))
})
const filteredUsers = computed(() => {
  departmentMembershipVersion.value
  return users.filter((user) => `${user.name}${user.account || ''}${user.id}${user.department}`.toLowerCase().includes(query.value.toLowerCase())
    && (departmentFilter.value === '全部部门' || user.department === departmentFilter.value)
    && (roleFilter.value === '全部角色' || user.role === roleFilter.value)
    && (statusFilter.value === '全部状态' || user.status === statusFilter.value))
})
const filteredLogs = computed(() => systemLogs.filter((item) => (
  (logType.value === '全部日志' || item.type === logType.value)
  && isLogWithinDateRange(item.time)
  && (logUser.value === '全部用户' || item.user === logUser.value)
  && (logScope.value === '全部范围' || item.scope === logScope.value)
)))
function isLogWithinDateRange(time) {
  const date = time.slice(0, 10)
  const { start, end } = logDateRange.value
  return (!start || date >= start) && (!end || date <= end)
}
const operationViews = [
  { id: 'overview', label: '概览' },
  { id: 'applications', label: '应用' },
  { id: 'users', label: '用户' },
  { id: 'records', label: '记录' },
]
const operationComparisonMetrics = [
  { id: 'calls', label: '调用量', tone: '#239dcc' },
  { id: 'tasks', label: '任务数', tone: '#36ad8d' },
  { id: 'users', label: '活跃用户', tone: '#7589d7' },
]
const operationsPeriodOptions = cockpitPeriods.map((item) => ({ value: item.id, label: item.name, detail: item.label }))
const operationsScopeOptions = computed(() => cockpitScopes.flatMap((scope) => [
  { value: scope.id, label: scope.id === 'group' ? '全集团' : scope.name, detail: scope.id === 'group' ? '总部' : '二级单位' },
  ...(scope.id === 'group' ? [] : scope.children.map((child, index) => ({ value: `${scope.id}__${index}`, label: child.name, detail: '三级单位' }))),
]))
function resolveOperationsScope(id) {
  const direct = cockpitScopes.find((scope) => scope.id === id)
  if (direct) return { ...direct, level: direct.id === 'group' ? '总部' : '二级单位', comparisonSource: direct.children, comparisonTitle: direct.id === 'group' ? '各二级单位使用情况' : '下级单位使用情况' }

  const [parentId, childIndex] = id.split('__')
  const parent = cockpitScopes.find((scope) => scope.id === parentId) || cockpitScopes[0]
  const child = parent.children[Number(childIndex)] || parent.children[0]
  const registeredUsers = Math.max(child.users, Math.round(child.users / 0.7))
  return {
    id, name: child.name, level: '三级单位', parentName: parent.name,
    calls: child.calls, successfulCalls: Math.round(child.calls * 0.97), starts: Math.round(child.calls * 1.06), tasks: child.tasks, completedTasks: Math.round(child.tasks * 0.97), reports: child.reports, reviews: Math.max(1, Math.round(child.tasks * 0.08)), activeUsers: child.users, registeredUsers, historicalLogins: Math.round(child.users * 8.8), firstResponseSeconds: parent.firstResponseSeconds, responseSeconds: parent.responseSeconds, comparisonSource: parent.children, comparisonTitle: '同级单位使用情况',
  }
}
const selectedOperationsPeriod = computed(() => cockpitPeriods.find((item) => item.id === operationsPeriod.value) || cockpitPeriods[1])
const selectedOperationsScope = computed(() => resolveOperationsScope(operationsScope.value))
const operationsGroupScope = computed(() => cockpitScopes[0])
const operationsScopeShare = computed(() => selectedOperationsScope.value.calls / Math.max(operationsGroupScope.value.calls, 1))
const scaleOperationsMetric = (value) => Math.round(value * selectedOperationsPeriod.value.scale)
const scaleOperationsUsers = (value) => Math.max(1, Math.round(value * selectedOperationsPeriod.value.userScale))
const operationCallTrend = computed(() => selectedOperationsPeriod.value.trend.map((item) => ({ ...item, calls: Math.round(item.calls * operationsScopeShare.value), results: Math.round(item.results * operationsScopeShare.value) })))
const operationCallTrendMax = computed(() => Math.max(...operationCallTrend.value.map((item) => item.calls), 1))
const operationSummary = computed(() => {
  const rows = operationApplicationRows.value
  const totalCalls = rows.reduce((sum, item) => sum + item.calls, 0)
  const weightedDuration = rows.reduce((sum, item) => sum + durationToSeconds(item.duration) * item.calls, 0)
  const totalTasks = scaleOperationsMetric(selectedOperationsScope.value.tasks)
  const completedTasks = scaleOperationsMetric(selectedOperationsScope.value.completedTasks)
  return {
    calls: totalCalls,
    completion: completedTasks / Math.max(totalTasks, 1) * 100,
    duration: totalCalls ? weightedDuration / totalCalls : 0,
    firstResponse: selectedOperationsScope.value.firstResponseSeconds,
    logins: selectedOperationsScope.value.historicalLogins,
  }
})
const operationApplicationRows = computed(() => appPerformance.map((item, index) => {
  const calls = Math.max(1, Math.round(item.calls * selectedOperationsPeriod.value.scale * operationsScopeShare.value))
  const outputs = Math.min(calls, Math.round(item.outputs * selectedOperationsPeriod.value.scale * operationsScopeShare.value))
  return { ...item, id: `operation-app-${index}`, calls, outputs, completionRate: calls ? outputs / calls * 100 : 0, failedOrInterrupted: Math.max(0, calls - outputs), processing: Math.max(0, Math.round(item.processing * operationsScopeShare.value)) }
}))
const operationMetricCards = computed(() => [
  { id: 'calls', label: '调用量', value: formatNumber(operationSummary.value.calls), unit: '次', icon: Activity, view: 'applications', tone: 'blue' },
  { id: 'completion', label: '任务完成率', value: formatRate(operationSummary.value.completion), unit: '', icon: CheckCircle2, view: 'applications', tone: 'green' },
  { id: 'response', label: '首次响应', value: operationSummary.value.firstResponse.toFixed(1), unit: '秒', icon: Clock3, view: 'applications', tone: 'amber' },
  { id: 'logins', label: '登录次数', value: formatNumber(operationSummary.value.logins), unit: '次', icon: Users, view: 'users', tone: 'violet' },
])
const operationEventMetrics = computed(() => [
  { label: '任务发起', display: formatNumber(scaleOperationsMetric(selectedOperationsScope.value.starts)), unit: '次' },
  { label: '创建任务', display: formatNumber(scaleOperationsMetric(selectedOperationsScope.value.tasks)), unit: '项' },
  { label: '报告生成', display: formatNumber(scaleOperationsMetric(selectedOperationsScope.value.reports)), unit: '份' },
  { label: '调用成功率', display: formatRate(scaleOperationsMetric(selectedOperationsScope.value.successfulCalls) / Math.max(scaleOperationsMetric(selectedOperationsScope.value.calls), 1) * 100), unit: '' },
])
const operationActivitySummary = computed(() => {
  const activeUsers = scaleOperationsUsers(selectedOperationsScope.value.activeUsers)
  const registeredUsers = selectedOperationsScope.value.registeredUsers
  return { activeUsers, registeredUsers, activeRate: activeUsers / Math.max(registeredUsers, 1) * 100, usageFrequency: operationSummary.value.calls / Math.max(registeredUsers, 1) }
})
const operationComparisonBranchIds = computed(() => (
  operationsScope.value === 'group'
    ? cockpitScopes.filter((scope) => scope.id !== 'group').map((scope) => scope.id)
    : [operationsScope.value.split('__')[0]]
))
const operationComparisonRows = computed(() => operationComparisonBranchIds.value.flatMap((branchId) => {
  const branch = cockpitScopes.find((scope) => scope.id === branchId)
  if (!branch) return []

  return [
    {
      id: branch.id,
      name: branch.name,
      level: '二级单位',
      depth: 0,
      calls: scaleOperationsMetric(branch.calls),
      tasks: scaleOperationsMetric(branch.tasks),
      reports: scaleOperationsMetric(branch.reports),
      users: scaleOperationsUsers(branch.activeUsers),
      selected: operationsScope.value === branch.id,
    },
    ...branch.children.map((child, index) => ({
      id: `${branch.id}__${index}`,
      name: child.name,
      level: '三级单位',
      depth: 1,
      calls: scaleOperationsMetric(child.calls),
      tasks: scaleOperationsMetric(child.tasks),
      reports: scaleOperationsMetric(child.reports),
      users: scaleOperationsUsers(child.users),
      selected: operationsScope.value === `${branch.id}__${index}`,
    })),
  ]
}))
const operationComparisonMaxes = computed(() => Object.fromEntries(operationComparisonMetrics.map((metric) => [
  metric.id,
  Math.max(...operationComparisonRows.value.map((item) => item[metric.id]), 1),
])))
const operationComparisonTitle = computed(() => (
  operationsScope.value === 'group' ? '组织层级使用对比' : `${selectedOperationsScope.value.name}使用对比`
))
function operationComparisonMetricWidth(item, metricId) {
  return `${Math.max(6, item[metricId] / operationComparisonMaxes.value[metricId] * 100)}%`
}
const operationUserActivityRows = computed(() => {
  const activityByUser = new Map()

  operationRecords.forEach((record) => {
    const id = `${record.user}::${record.department}`
    const activity = activityByUser.get(id) || {
      id,
      name: record.user,
      department: record.department,
      calls: 0,
      applications: new Set(),
      lastActivityAt: record.time,
    }

    activity.calls += 1
    activity.applications.add(record.app)
    if (record.time > activity.lastActivityAt) activity.lastActivityAt = record.time
    activityByUser.set(id, activity)
  })

  return sortRecords([...activityByUser.values()].map((activity) => ({
    ...activity,
    applications: [...activity.applications].join('、'),
  })), activityUserSort.value)
})
const filteredOperationRecords = computed(() => operationRecords.filter((item) => {
  const searchText = `${item.app}${item.user}${item.department}${item.action}${item.targetName}`.toLowerCase()
  return searchText.includes(operationRecordQuery.value.trim().toLowerCase())
    && (operationAppFilter.value === '全部智能应用' || item.app === operationAppFilter.value)
    && (operationDateFilter.value === '全部日期' || item.time.startsWith(operationDateFilter.value))
}))
const sortedOperationRecords = computed(() => sortRecords(filteredOperationRecords.value, operationRecordSort.value))
const tabs = [
  { id:'operations',label:'运营数据',icon:ChartNoAxesCombined },
  { id:'departments',label:'部门管理',icon:Network },
  { id:'templates',label:'模板管理',icon:FileStack },
  { id:'knowledge',label:'公司知识库',icon:BookOpenText },
  { id:'users',label:'用户管理',icon:Users },
  { id:'config',label:'配置管理',icon:Settings2 },
  { id:'logs',label:'系统日志',icon:ScrollText },
]
const activeTab = computed(() => tabs.find((tab) => tab.id === section.value) || tabs[0])
function returnToFront() { router.push('/agents') }
function importUsers() { ui.notify('Excel 用户表已读取，进入导入确认步骤', 'success') }
function saveConfiguration() {
  const deployment = modelDeploymentMode.value === 'local' ? '本地部署' : '云端 API'
  activeModelDeploymentMode.value = modelDeploymentMode.value
  ui.notify(`已保存 ${deployment} 配置并切换为当前服务；接入服务端后才会实际生效`, 'success')
}
function saveCompanyLibrarySettings() { ui.notify('资料库设置已保存', 'success'); selectedLibrary.value = null }
function templateType(item) { return item.scope === '创新性分析' ? '评分模板' : '文档模板' }
function isScoringTemplate(item) { return item?.scope === '创新性分析' }
function hydrateDepartmentTree(nodes, parentId = null, level = 0) {
  return nodes.map((node) => {
    const { count: _organizationHeadcount, children = [], ...department } = node
    const id = department.id || `dept-${department.name}`
    return { ...department, id, parentId, level, children: hydrateDepartmentTree(children, id, level + 1) }
  })
}
function flattenDepartmentHierarchy(nodes, parent = null, result = []) {
  nodes.forEach((node) => {
    const entry = { node, parent }
    result.push(entry)
    flattenDepartmentHierarchy(node.children || [], node, result)
  })
  return result
}
function findDepartmentEntry(id, nodes = departmentHierarchy.value, parent = null) {
  for (const node of nodes) {
    if (node.id === id) return { node, parent }
    const childEntry = findDepartmentEntry(id, node.children || [], node)
    if (childEntry) return childEntry
  }
  return null
}
function findDepartmentEntryByName(name, nodes = departmentHierarchy.value, parent = null) {
  for (const node of nodes) {
    if (node.name === name) return { node, parent }
    const childEntry = findDepartmentEntryByName(name, node.children || [], node)
    if (childEntry) return childEntry
  }
  return null
}
function getDepartmentPath(id) {
  const path = []
  let entry = findDepartmentEntry(id)
  while (entry?.node) {
    path.unshift(entry.node.id)
    entry = entry.node.parentId ? findDepartmentEntry(entry.node.parentId) : null
  }
  return path
}
function departmentRootId(id) {
  return getDepartmentPath(id)[0] || null
}
function toggleDepartmentBranch(id) {
  const entry = findDepartmentEntry(id)
  if (!entry?.node?.children?.length) return
  const selectedPath = getDepartmentPath(selectedDepartmentId.value)
  const expandedIds = new Set(expandedDepartmentIds.value)

  if (expandedIds.has(id)) {
    expandedIds.delete(id)
    if (selectedPath.includes(id)) selectedDepartmentId.value = id
  } else {
    expandedIds.add(id)
  }
  expandedDepartmentIds.value = [...expandedIds]
}
function isDepartmentExpanded(id) {
  return expandedDepartmentIds.value.includes(id)
}
function selectDepartment(id) {
  const entry = findDepartmentEntry(id)
  if (!entry?.node) return
  selectedDepartmentId.value = id
  const expandedIds = new Set(expandedDepartmentIds.value)
  getDepartmentPath(id).slice(0, -1).forEach((ancestorId) => expandedIds.add(ancestorId))
  expandedDepartmentIds.value = [...expandedIds]

  if (window.matchMedia('(max-width: 920px)').matches) {
    nextTick(() => departmentWorkspace.value?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
      inline: 'nearest',
    }))
  }
}
function departmentCompany(entry = selectedDepartmentEntry.value) {
  if (!entry?.node) return '中煤集团'
  return findDepartmentEntry(departmentRootId(entry.node.id))?.node?.name || '中煤集团'
}
function registeredMemberCount(node) {
  departmentMembershipVersion.value
  const departmentNames = new Set(flattenDepartmentHierarchy([node]).map((entry) => entry.node.name))
  return users.filter((user) => departmentNames.has(user.department)).length
}
function openDepartmentCreate(mode) {
  departmentEditor.value = {
    mode,
    name: '',
    parentId: mode === 'child' ? selectedDepartment.value?.id : '',
  }
}
function openDepartmentEdit() {
  departmentEditor.value = {
    mode: 'edit',
    id: selectedDepartment.value?.id,
    name: selectedDepartment.value?.name || '',
    parentName: selectedDepartmentParent.value,
  }
}
function saveDepartment() {
  const name = departmentEditor.value?.name?.trim()
  if (!name) {
    ui.notify('请填写部门名称', 'warning')
    return
  }
  const duplicate = findDepartmentEntryByName(name)
  if (duplicate && duplicate.node.id !== departmentEditor.value?.id) {
    ui.notify('该部门名称已存在，请调整后保存', 'warning')
    return
  }
  if (departmentEditor.value.mode === 'edit') {
    const current = findDepartmentEntry(departmentEditor.value.id)
    if (!current) return
    const previousName = current.node.name
    current.node.name = name
    users.forEach((user) => {
      if (user.department === previousName) user.department = name
      if (user.company === previousName) user.company = name
    })
    departmentMembershipVersion.value += 1
    ui.notify('部门信息已保存', 'success')
  } else {
    const node = { id: `dept-${Date.now()}`, name, level: departmentEditor.value.mode === 'root' ? 0 : (selectedDepartment.value?.level || 0) + 1, children: [] }
    if (departmentEditor.value.mode === 'root') {
      departmentHierarchy.value.push(node)
    } else {
      const parent = findDepartmentEntry(departmentEditor.value.parentId)
      if (!parent) return
      parent.node.children.push({ ...node, parentId: parent.node.id })
    }
    selectDepartment(node.id)
    ui.notify('部门已创建', 'success')
  }
  departmentEditor.value = null
}
function openMemberAssignment() {
  const [firstOption] = memberAssignmentOptions.value
  if (!firstOption) {
    ui.notify('暂无可调整归属的用户', 'warning')
    return
  }
  memberAssignment.value = { userId: firstOption.value }
}
function saveMemberAssignment() {
  const user = users.find((item) => item.id === memberAssignment.value?.userId)
  const target = selectedDepartmentEntry.value
  if (!user || !target?.node) return
  const previous = findDepartmentEntryByName(user.department)
  if (previous?.node.id === target.node.id) {
    memberAssignment.value = null
    return
  }
  user.department = target.node.name
  user.company = departmentCompany(target)
  departmentMembershipVersion.value += 1
  memberAssignment.value = null
  ui.notify(`已将 ${user.name} 加入${target.node.name}`, 'success')
}
function openMemberRemoval(member) {
  memberRemoval.value = {
    id: member.id,
    name: member.name,
    department: selectedDepartment.value?.name || member.department,
  }
}
function confirmMemberRemoval() {
  const candidate = memberRemoval.value
  const member = users.find((item) => item.id === candidate?.id)
  if (!candidate || !member) {
    memberRemoval.value = null
    return
  }

  member.department = '未分配'
  member.company = '未分配'
  auth.syncDirectoryUser(member)
  departmentMembershipVersion.value += 1
  memberRemoval.value = null
  ui.notify(`已将 ${member.name} 移出${candidate.department}`, 'success')
}
function durationToSeconds(value) {
  const minutes = Number(value.match(/(\d+)\s*分/)?.[1] || 0)
  const seconds = Number(value.match(/(\d+)\s*秒/)?.[1] || 0)
  return minutes * 60 + seconds
}
function formatDuration(totalSeconds) {
  const seconds = Math.round(totalSeconds)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return minutes ? `${minutes} 分 ${remainingSeconds} 秒` : `${remainingSeconds} 秒`
}
function formatRate(value) {
  return `${value.toFixed(1)}%`
}
function formatNumber(value) {
  return new Intl.NumberFormat('zh-CN').format(value)
}
function formatOperationDate(value) {
  return value.slice(0, 10)
}
function formatActivityTime(value) {
  return value.replace(/^\d{4}-/, '')
}
function openOperationsView(view) {
  operationsView.value = view
}
function focusOperationsComparison() {
  if (operationsView.value !== 'overview') operationsView.value = 'overview'
  nextTick(() => document.querySelector('[data-operations-comparison]')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
function openOperationsOrganization(item) {
  selectedOperationsOrganization.value = item
}
function sortRecords(records, sort) {
  return [...records].sort((left, right) => {
    const leftValue = left[sort.key] ?? ''
    const rightValue = right[sort.key] ?? ''
    const comparison = typeof leftValue === 'number' && typeof rightValue === 'number'
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), 'zh-Hans-CN')
    return sort.direction === 'asc' ? comparison : -comparison
  })
}
function toggleOperationSort(currentSort, key) {
  if (currentSort === activityUserSort.value) {
    activityUserSort.value = nextSort(activityUserSort.value, key)
    return
  }
  if (currentSort === operationRecordSort.value) {
    operationRecordSort.value = nextSort(operationRecordSort.value, key)
  }
}
function nextSort(currentSort, key) {
  return {
    key,
    direction: currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc',
  }
}
function sortIcon(sort, key) {
  if (sort.key !== key) return ChevronsUpDown
  return sort.direction === 'asc' ? ArrowUp : ArrowDown
}
function resetOperationRecordFilters() {
  operationRecordQuery.value = ''
  operationAppFilter.value = '全部智能应用'
  operationDateFilter.value = '全部日期'
}
function resetPasswordFormState() {
  passwordResetOpen.value = false
  passwordResetSubmitting.value = false
  passwordResetError.value = ''
  passwordResetForm.newPassword = ''
  passwordResetForm.confirmPassword = ''
}
function openUserEditor(user, source = 'users') {
  selectedUser.value = { ...user, _originalId: user.id }
  userEditorSource.value = source
  resetPasswordFormState()
}
function openUserCreate() {
  selectedUser.value = { name: '', position: '', id: '', account: '', company: '未分配', department: '未分配', role: '普通用户', status: '启用' }
  userEditorSource.value = 'users'
  resetPasswordFormState()
}
function closeUserEditor() {
  selectedUser.value = null
  userEditorSource.value = 'users'
  resetPasswordFormState()
}
function saveUser() {
  const draft = selectedUser.value
  if (!draft) return

  const name = draft.name?.trim()
  const position = draft.position?.trim()
  const id = draft.id?.trim()
  const account = draft.account?.trim()
  const department = draft.department || '未分配'
  const targetDepartment = department === '未分配' ? null : findDepartmentEntryByName(department)

  if (!name || !id) {
    ui.notify('请完整填写姓名和工号', 'warning')
    return
  }
  if (department !== '未分配' && !targetDepartment) {
    ui.notify('请选择组织树中的所属部门', 'warning')
    return
  }

  const existing = draft._originalId ? users.find((user) => user.id === draft._originalId) : null
  const duplicate = users.find((user) => user.id === id && user !== existing)
  if (duplicate) {
    ui.notify('该工号已存在，请调整后保存', 'warning')
    return
  }
  if (account) {
    const accountDuplicate = users.find((user) => user.account === account && user !== existing)
    if (accountDuplicate) {
      ui.notify('该登录账号已存在，请调整后保存', 'warning')
      return
    }
  }

  const record = {
    name,
    position: position || '未设置岗位',
    id,
    account: account || undefined,
    company: targetDepartment ? departmentCompany(targetDepartment) : '未分配',
    department,
    role: draft.role === '管理员' ? '管理员' : '普通用户',
    status: draft.status === '停用' ? '停用' : '启用',
  }
  if (existing) {
    Object.assign(existing, record)
  } else {
    users.push({ ...record, joinedAt: new Date().toISOString().slice(0, 10), lastLogin: '尚未登录', lastLoginAt: '' })
  }

  const savedUser = existing || users.at(-1)
  const activeAccount = auth.profile?.account
  auth.syncDirectoryUser(savedUser)
  departmentMembershipVersion.value += 1
  ui.notify('用户信息已保存', 'success')
  closeUserEditor()

  if (savedUser.account === activeAccount && savedUser.status === '停用') {
    router.replace('/login')
  } else if (savedUser.account === activeAccount && savedUser.role !== '管理员') {
    router.replace('/agents')
  }
}
async function submitPasswordReset() {
  if (!passwordResetForm.newPassword || !passwordResetForm.confirmPassword) {
    passwordResetError.value = '请完整填写新密码信息'
    return
  }
  if (passwordResetForm.newPassword !== passwordResetForm.confirmPassword) {
    passwordResetError.value = '两次输入的新密码不一致'
    return
  }

  passwordResetSubmitting.value = true
  const result = await auth.resetUserPassword({ account: selectedUser.value?.account, newPassword: passwordResetForm.newPassword })
  passwordResetSubmitting.value = false
  const messages = {
    PASSWORD_TOO_SHORT: '新密码至少需要 8 位字符',
    PASSWORD_UNCHANGED: '新密码不能与当前密码相同',
    ACCOUNT_NOT_FOUND: '该账号暂不能修改密码',
    FORBIDDEN: '当前账号没有修改其他用户密码的权限',
  }
  if (!result.ok) {
    passwordResetError.value = messages[result.code] || '密码修改未完成，请稍后重试'
    return
  }

  resetPasswordFormState()
  ui.notify(`已为 ${selectedUser.value.name} 设置新的登录密码`, 'success')
}
</script>

<template>
  <section class="admin-console">
    <header class="admin-console-topbar">
      <button class="admin-console-lockup" type="button" aria-label="返回前台首页" @click="returnToFront">
        <i aria-hidden="true" />
        <span><b>AI 创新应用平台</b><small>后台管理</small></span>
      </button>
      <button class="admin-console-return" type="button" @click="returnToFront"><ArrowLeft :size="16" />返回前台</button>
    </header>

    <div class="admin-console-layout">
      <aside class="admin-console-sidebar">
        <header><h1>管理中心</h1></header>
        <nav class="admin-console-nav" aria-label="后台管理导航">
          <button v-for="tab in tabs" :key="tab.id" :class="{ active: section === tab.id }" :aria-current="section === tab.id ? 'page' : undefined" @click="router.push(`/admin/${tab.id}`)"><i><component :is="tab.icon" :size="18" /></i><b>{{ tab.label }}</b><ChevronRight :size="15" /></button>
        </nav>
      </aside>

      <section class="admin-console-stage">
        <header class="admin-console-page-heading">
          <div><h2>{{ activeTab.label }}</h2></div>
        </header>

      <main class="admin-panel admin-console-panel" :class="`admin-section-${section}`">
        <template v-if="section === 'operations'">
          <div class="operations-toolbar">
            <nav class="operations-view-tabs" aria-label="运营数据视图">
              <button v-for="view in operationViews" :key="view.id" type="button" :class="{ active: operationsView === view.id }" @click="operationsView = view.id">{{ view.label }}</button>
            </nav>
            <section class="operations-filter-bar" aria-label="运营数据筛选">
              <BaseSelect v-model="operationsPeriod" :options="operationsPeriodOptions" aria-label="选择统计周期" prefix="周期" />
              <div class="operations-organization-control">
                <BaseSelect v-model="operationsScope" :options="operationsScopeOptions" aria-label="选择组织范围" prefix="组织" />
                <button class="operations-comparison-trigger" type="button" @click="focusOperationsComparison"><Network :size="15" />同级对比</button>
              </div>
            </section>
          </div>

          <template v-if="operationsView === 'overview'">
            <section class="operations-overview" aria-label="运营核心指标">
              <button v-for="card in operationMetricCards" :key="card.id" type="button" class="operation-metric-card" :class="`tone-${card.tone}`" @click="openOperationsView(card.view)">
                <i><component :is="card.icon" :size="20" /></i><span><small>{{ card.label }}</small><b>{{ card.value }}<em>{{ card.unit }}</em></b></span><ChevronRight :size="17" />
              </button>
            </section>
            <section class="operations-event-strip" aria-label="当前统计周期事件">
              <header><h3>任务与成果</h3></header>
              <dl><div v-for="item in operationEventMetrics" :key="item.label"><dt>{{ item.label }}</dt><dd>{{ item.display }}<em>{{ item.unit }}</em></dd></div></dl>
            </section>
            <div class="operations-trend-grid operations-overview-split">
              <section class="operations-trend-card">
                <header><h3>调用趋势</h3><button type="button" class="operation-inline-link" @click="openOperationsView('applications')">应用明细<ChevronRight :size="15" /></button></header>
                <div class="operations-bars" :style="{ '--bar-count': operationCallTrend.length }" aria-label="智能应用调用趋势柱状图">
                  <div v-for="item in operationCallTrend" :key="item.label" class="operations-bar-item"><strong>{{ item.calls }}</strong><div><i :style="{ height: `${(item.calls / operationCallTrendMax) * 100}%` }" /></div><span>{{ item.label }}</span></div>
                </div>
              </section>
              <section class="operations-trend-card operations-activity-glance">
                <header><h3>用户活跃</h3><button type="button" class="operation-inline-link" @click="openOperationsView('users')">用户明细<ChevronRight :size="15" /></button></header>
                <div class="operations-activity-metrics"><article><span>活跃用户</span><b>{{ formatRate(operationActivitySummary.activeRate) }}</b><p>{{ formatNumber(operationActivitySummary.activeUsers) }} / {{ formatNumber(operationActivitySummary.registeredUsers) }} 人</p></article><article><span>人均调用</span><b>{{ operationActivitySummary.usageFrequency.toFixed(1) }}<em>次 / 人</em></b></article></div>
              </section>
            </div>
            <section class="operations-detail-card operations-app-snapshot">
              <header><h3>应用运行</h3><button type="button" class="operation-inline-link" @click="openOperationsView('applications')">查看全部<ChevronRight :size="15" /></button></header>
              <div class="operations-app-health-list"><button v-for="item in operationApplicationRows" :key="item.id" type="button" @click="selectedOperationsApp = item"><i :class="{ processing: item.processing }" /><span><b>{{ item.name }}</b><small v-if="item.processing">{{ item.processing }} 项处理中</small></span><em>{{ formatRate(item.completionRate) }}</em><strong>{{ item.duration }}</strong><ChevronRight :size="16" /></button></div>
            </section>
            <section class="operations-detail-card operations-comparison-preview" data-operations-comparison>
              <header><h3>{{ operationComparisonTitle }}</h3><span>{{ selectedOperationsPeriod.name }}</span></header>
              <div class="operations-comparison-legend" aria-label="组织对比指标图例"><span v-for="metric in operationComparisonMetrics" :key="metric.id" :style="{ '--comparison-tone': metric.tone }"><i />{{ metric.label }}</span></div>
              <div class="operations-comparison-scroll">
                <div class="operations-comparison-chart" role="table" :aria-label="operationComparisonTitle">
                  <div class="operations-comparison-head" role="row"><span>组织层级</span><span v-for="metric in operationComparisonMetrics" :key="metric.id">{{ metric.label }}</span></div>
                  <button v-for="item in operationComparisonRows" :key="item.id" type="button" class="operations-comparison-row" :class="[`is-depth-${item.depth}`, { selected: item.selected }]" role="row" @click="openOperationsOrganization(item)">
                    <span class="operations-comparison-name"><i aria-hidden="true" /><b>{{ item.name }}</b><small>{{ item.level }}</small></span>
                    <span v-for="metric in operationComparisonMetrics" :key="metric.id" class="operations-comparison-metric" :style="{ '--comparison-tone': metric.tone }"><small>{{ metric.label }}</small><i><u :style="{ width: operationComparisonMetricWidth(item, metric.id) }" /></i><b>{{ formatNumber(item[metric.id]) }}</b></span>
                    <ChevronRight :size="16" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>
          </template>

          <section v-else-if="operationsView === 'applications'" class="operations-detail-card operations-list-card">
            <header><h3>智能应用</h3><span>{{ selectedOperationsPeriod.name }} · {{ selectedOperationsScope.name }}</span></header>
            <div class="operations-table-wrap"><table class="operations-table operations-app-table"><thead><tr><th>智能应用</th><th>调用次数</th><th>形成成果</th><th>任务完成率</th><th>平均处理时间</th><th aria-label="查看详情" /></tr></thead><tbody><tr v-for="item in operationApplicationRows" :key="item.id" class="operation-record-row" tabindex="0" @click="selectedOperationsApp = item" @keydown.enter.prevent="selectedOperationsApp = item"><td><b>{{ item.name }}</b><small>{{ item.processing ? `${item.processing} 项处理中` : '运行正常' }}</small></td><td>{{ formatNumber(item.calls) }} 次</td><td>{{ formatNumber(item.outputs) }} 份</td><td>{{ formatRate(item.completionRate) }}</td><td>{{ item.duration }}</td><td><ChevronRight :size="17" /></td></tr></tbody></table></div>
          </section>

          <template v-else-if="operationsView === 'users'">
            <section class="operations-user-summary"><article><span>活跃用户占比</span><b>{{ formatRate(operationActivitySummary.activeRate) }}</b><small>{{ formatNumber(operationActivitySummary.activeUsers) }} 名活跃用户</small></article><article><span>注册用户</span><b>{{ formatNumber(operationActivitySummary.registeredUsers) }} 名</b><small>所选组织范围</small></article><article><span>人均调用次数</span><b>{{ operationActivitySummary.usageFrequency.toFixed(1) }} 次</b><small>按注册用户平均计算</small></article></section>
            <section class="operations-detail-card operations-list-card">
              <header><h3>近期应用活动</h3><span>{{ operationUserActivityRows.length }} 名用户</span></header>
              <div class="operations-table-wrap"><table class="operations-table operations-activity-user-table"><thead><tr><th><button class="table-sort-button" type="button" :aria-sort="activityUserSort.key === 'name' ? (activityUserSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'" @click="toggleOperationSort(activityUserSort, 'name')"><span>用户</span><span class="table-sort-icon" :class="{ active: activityUserSort.key === 'name' }" aria-hidden="true"><component :is="sortIcon(activityUserSort, 'name')" :size="13" :stroke-width="2.4" /></span></button></th><th><button class="table-sort-button" type="button" :aria-sort="activityUserSort.key === 'department' ? (activityUserSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'" @click="toggleOperationSort(activityUserSort, 'department')"><span>部门</span><span class="table-sort-icon" :class="{ active: activityUserSort.key === 'department' }" aria-hidden="true"><component :is="sortIcon(activityUserSort, 'department')" :size="13" :stroke-width="2.4" /></span></button></th><th>使用过的智能应用</th><th><button class="table-sort-button" type="button" :aria-sort="activityUserSort.key === 'calls' ? (activityUserSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'" @click="toggleOperationSort(activityUserSort, 'calls')"><span>调用次数</span><span class="table-sort-icon" :class="{ active: activityUserSort.key === 'calls' }" aria-hidden="true"><component :is="sortIcon(activityUserSort, 'calls')" :size="13" :stroke-width="2.4" /></span></button></th><th><button class="table-sort-button" type="button" :aria-sort="activityUserSort.key === 'lastActivityAt' ? (activityUserSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'" @click="toggleOperationSort(activityUserSort, 'lastActivityAt')"><span>最近活跃</span><span class="table-sort-icon" :class="{ active: activityUserSort.key === 'lastActivityAt' }" aria-hidden="true"><component :is="sortIcon(activityUserSort, 'lastActivityAt')" :size="13" :stroke-width="2.4" /></span></button></th></tr></thead><tbody><tr v-for="user in operationUserActivityRows" :key="user.id"><td><b>{{ user.name }}</b></td><td>{{ user.department }}</td><td>{{ user.applications }}</td><td>{{ user.calls }} 次</td><td>{{ formatActivityTime(user.lastActivityAt) }}</td></tr><tr v-if="!operationUserActivityRows.length"><td class="operations-table-empty" colspan="5">暂无已记录的智能应用调用</td></tr></tbody></table></div>
            </section>
          </template>

          <section v-else class="operations-detail-card operations-list-card operation-records-card">
            <header><h3>全体用户操作记录</h3><span>{{ sortedOperationRecords.length }} 条记录</span></header>
            <div class="operation-record-tools">
              <label class="search-field"><Search :size="17" /><input v-model="operationRecordQuery" placeholder="搜索用户或智能应用" /></label>
              <BaseSelect v-model="operationAppFilter" :options="operationAppOptions" aria-label="筛选智能应用" />
              <BaseSelect v-model="operationDateFilter" :options="operationDateOptions" aria-label="筛选日期" />
              <button class="button ghost operation-filter-reset" type="button" @click="resetOperationRecordFilters">重置</button>
            </div>
            <div class="operations-table-wrap"><table class="operations-table operation-record-table"><thead><tr><th><button class="table-sort-button" type="button" :aria-sort="operationRecordSort.key === 'time' ? (operationRecordSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'" @click="toggleOperationSort(operationRecordSort, 'time')"><span>日期</span><span class="table-sort-icon" :class="{ active: operationRecordSort.key === 'time' }" aria-hidden="true"><component :is="sortIcon(operationRecordSort, 'time')" :size="13" :stroke-width="2.4" /></span></button></th><th><button class="table-sort-button" type="button" :aria-sort="operationRecordSort.key === 'user' ? (operationRecordSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'" @click="toggleOperationSort(operationRecordSort, 'user')"><span>用户</span><span class="table-sort-icon" :class="{ active: operationRecordSort.key === 'user' }" aria-hidden="true"><component :is="sortIcon(operationRecordSort, 'user')" :size="13" :stroke-width="2.4" /></span></button></th><th>行为</th></tr></thead><tbody><tr v-for="item in sortedOperationRecords" :key="item.id" class="operation-record-row" tabindex="0" @click="selectedOperationRecord = item" @keydown.enter.prevent="selectedOperationRecord = item"><td>{{ formatOperationDate(item.time) }}</td><td><b>{{ item.user }}</b><small>{{ item.department }}</small></td><td>{{ item.action }}</td></tr><tr v-if="!sortedOperationRecords.length"><td class="operations-table-empty" colspan="3">暂无符合条件的记录</td></tr></tbody></table></div>
          </section>
        </template>

        <template v-else-if="section === 'departments'">
          <header class="panel-heading department-page-heading"><h2>部门管理</h2></header>
          <div class="department-management-layout">
            <section class="department-tree-panel" aria-label="部门树">
              <header><h3>部门树</h3><button class="button secondary department-root-action" type="button" @click="openDepartmentCreate('root')"><Plus :size="16" />根部门</button></header>
              <div class="department-tree-scroll">
                <article v-for="root in departmentHierarchy" :key="root.id" class="department-tree-branch">
                  <div class="department-tree-row level-root">
                    <button v-if="root.children.length" class="department-expand" type="button" :aria-label="`${isDepartmentExpanded(root.id) ? '收起' : '展开'}${root.name}`" @click="toggleDepartmentBranch(root.id)"><ChevronDown :size="15" :class="{ collapsed: !isDepartmentExpanded(root.id) }" /></button><span v-else class="department-expand-placeholder" />
                    <button class="department-node" :class="{ active: selectedDepartmentId === root.id }" type="button" @click="selectDepartment(root.id)"><Building2 :size="17" /><b>{{ root.name }}</b><em :aria-label="`${registeredMemberCount(root)} 人`">{{ registeredMemberCount(root) }}</em></button>
                  </div>
                  <div v-if="isDepartmentExpanded(root.id)" class="department-tree-children">
                    <section v-for="company in root.children" :key="company.id" class="department-tree-company">
                      <div class="department-tree-row level-company">
                        <button v-if="company.children.length" class="department-expand" type="button" :aria-label="`${isDepartmentExpanded(company.id) ? '收起' : '展开'}${company.name}`" @click="toggleDepartmentBranch(company.id)"><ChevronDown :size="15" :class="{ collapsed: !isDepartmentExpanded(company.id) }" /></button><span v-else class="department-expand-placeholder" />
                        <button class="department-node" :class="{ active: selectedDepartmentId === company.id }" type="button" @click="selectDepartment(company.id)"><Network :size="16" /><b>{{ company.name }}</b><em :aria-label="`${registeredMemberCount(company)} 人`">{{ registeredMemberCount(company) }}</em></button>
                      </div>
                      <div v-if="isDepartmentExpanded(company.id)" class="department-tree-children level-child-list">
                        <div v-for="child in company.children" :key="child.id" class="department-tree-row level-child"><button class="department-node" :class="{ active: selectedDepartmentId === child.id }" type="button" @click="selectDepartment(child.id)"><b>{{ child.name }}</b><em :aria-label="`${registeredMemberCount(child)} 人`">{{ registeredMemberCount(child) }}</em></button></div>
                      </div>
                    </section>
                  </div>
                </article>
              </div>
            </section>

            <section v-if="selectedDepartment" ref="departmentWorkspace" class="department-workspace">
              <section class="department-overview-card">
                <header>
                  <div><h2>{{ selectedDepartment.name }}</h2></div>
                  <div class="department-header-actions"><button v-if="canCreateDepartmentChild" class="button secondary" type="button" @click="openDepartmentCreate('child')"><Plus :size="16" />新建下级部门</button><button class="button secondary" type="button" @click="openDepartmentEdit"><Pencil :size="16" />编辑</button></div>
                </header>
                <dl class="department-info-grid"><div><dt>部门名称</dt><dd>{{ selectedDepartment.name }}</dd></div><div><dt>上级部门</dt><dd>{{ selectedDepartmentParent }}</dd></div><div><dt>成员数</dt><dd>{{ selectedDepartmentMembers.length }} 人</dd></div></dl>
              </section>

              <section class="department-members-card">
                <header><h3>直属成员</h3><button class="button primary" type="button" @click="openMemberAssignment"><UserPlus :size="17" />添加成员</button></header>
                <div class="department-members-table-wrap"><table class="department-members-table"><thead><tr><th>成员 / 岗位</th><th>账号 / 工号</th><th>平台角色</th><th>状态</th><th>加入时间</th><th>操作</th></tr></thead><tbody><tr v-for="member in selectedDepartmentMembers" :key="member.id"><td><b>{{ member.name }}</b><small class="department-member-position">{{ member.position || '未设置岗位' }}</small></td><td>{{ member.account ? `${member.account} / ${member.id}` : member.id }}</td><td>{{ member.role }}</td><td><span class="status-chip" :class="member.status === '启用' ? 'success' : 'neutral'">{{ member.status }}</span></td><td>{{ member.joinedAt }}</td><td><div class="department-member-actions"><button class="department-edit-member" type="button" @click="openUserEditor(member, 'departments')"><Pencil :size="14" />编辑</button><button class="department-remove-member" type="button" @click="openMemberRemoval(member)"><Trash2 :size="14" />删除</button></div></td></tr><tr v-if="!selectedDepartmentMembers.length"><td class="department-members-empty" colspan="6">当前部门暂无已关联的平台账号</td></tr></tbody></table></div>
              </section>
            </section>
          </div>
        </template>

        <template v-else-if="section === 'templates'">
          <header class="panel-heading template-page-heading">
            <div><h2>模板管理</h2><p>维护智能应用输出所需的报告结构与评价规则。</p></div>
            <button class="button primary" type="button" @click="templateCreatorOpen = true"><Plus :size="17" />新建模板</button>
          </header>
          <section class="template-directory" aria-label="模板目录">
            <header><div><h3>模板目录</h3><p>发布后的版本可供相应智能应用选用。</p></div><span>{{ templates.length }} 个模板</span></header>
            <div class="template-table-wrap">
              <table class="template-table"><thead><tr><th>模板名称</th><th>类型</th><th>适用智能应用</th><th>版本</th><th>状态</th><th aria-label="查看详情" /></tr></thead><tbody>
                <tr v-for="item in templates" :key="item.id" class="template-row" tabindex="0" @click="selectedTemplate = { ...item }" @keydown.enter.prevent="selectedTemplate = { ...item }"><td><b>{{ item.name }}</b></td><td><span class="template-kind">{{ templateType(item) }}</span></td><td>{{ item.scope }}</td><td>{{ item.version }}</td><td><span class="status-chip" :class="item.status === '已发布' ? 'success' : 'warning'">{{ item.status }}</span></td><td><button class="table-row-action" type="button" :aria-label="`查看${item.name}详情`" @click.stop="selectedTemplate = { ...item }">查看<ChevronRight :size="16" /></button></td></tr>
              </tbody></table>
            </div>
          </section>
        </template>

        <template v-else-if="section === 'knowledge'">
          <header class="panel-heading knowledge-page-heading">
            <div><h2>公司知识库</h2><p>按组织范围维护企业资料库目录，供获授权的智能应用使用。</p></div>
            <button class="button primary" type="button" @click="selectedLibrary = { name:'',description:'',access:'深圳院及子部门' }"><Plus :size="17" />创建知识库</button>
          </header>
          <section class="company-library-directory" aria-label="公司知识库目录">
            <header><div><h3>资料库目录</h3><p>每个资料库独立设置适用范围。</p></div><span>{{ companyLibraries.length }} 个资料库</span></header>
            <div class="company-library-grid">
              <article v-for="item in companyLibraries" :key="item.id" class="company-library-card"><header><i><BookOpenText :size="20" /></i><span class="library-access-chip">{{ item.access }}</span></header><div><h3>{{ item.name }}</h3><p>{{ item.description }}</p></div><dl><div><dt>文件数量</dt><dd>{{ item.files }} 个</dd></div><div><dt>最近更新</dt><dd>{{ item.updated }}</dd></div></dl><footer><button type="button" @click="selectedLibrary = { ...item }">查看资料库 <ChevronRight :size="16" /></button></footer></article>
            </div>
          </section>
        </template>

        <template v-else-if="section === 'users'">
          <header class="panel-heading"><div><h2>用户管理</h2><p>账号由管理员统一创建，平台权限由“普通用户”和“管理员”两类角色决定。</p></div><div><label class="button secondary import-button"><Upload :size="17" />Excel 批量导入<input type="file" accept=".xlsx,.xls" @change="importUsers" /></label><button class="button primary" type="button" @click="openUserCreate"><UserPlus :size="17" />单独创建</button></div></header>
          <div class="admin-summary" aria-label="用户概览"><article><span>用户总数</span><b>156</b></article><article><span>已启用</span><b>151</b></article><article><span>已停用</span><b>5</b></article></div>
          <div class="table-tools"><label class="search-field"><Search :size="17" /><input v-model="query" placeholder="搜索姓名、工号或部门" /></label><BaseSelect v-model="departmentFilter" :options="userDepartmentFilterOptions" aria-label="筛选部门" /><BaseSelect v-model="roleFilter" :options="roleFilterOptions" aria-label="筛选角色" /><BaseSelect v-model="statusFilter" :options="statusFilterOptions" aria-label="筛选账号状态" /></div>
          <div class="data-table-wrap"><table><thead><tr><th>用户</th><th>工号</th><th>公司</th><th>部门</th><th>角色</th><th>状态</th><th>最近登录</th><th>操作</th></tr></thead><tbody><tr v-for="user in filteredUsers" :key="user.id"><td><b>{{ user.name }}</b></td><td>{{ user.id }}</td><td>{{ user.company }}</td><td>{{ user.department }}</td><td>{{ user.role }}</td><td><span class="status-chip" :class="user.status === '启用' ? 'success' : 'neutral'">{{ user.status }}</span></td><td>{{ user.lastLogin }}</td><td><button class="user-edit-button" type="button" aria-label="编辑用户" @click="openUserEditor(user, 'users')"><Pencil :size="16" />编辑</button></td></tr></tbody></table></div>
        </template>

        <template v-else-if="section === 'config'">
          <header class="panel-heading config-page-heading"><div><h2>大模型配置</h2></div><div class="config-page-actions"><button class="button primary" type="button" @click="saveConfiguration">保存配置</button></div></header>
          <section class="model-settings-card" aria-label="大模型服务接入">
            <header><i><ServerCog :size="21" /></i><div><h3>模型服务接入</h3><p>按当前部署方式填写必要连接信息。</p></div></header>
            <nav class="model-deployment-switch" aria-label="选择模型部署方式">
              <button v-for="mode in modelDeploymentModes" :key="mode.id" type="button" :class="{ active: activeModelDeploymentMode === mode.id, pending: modelDeploymentMode === mode.id && activeModelDeploymentMode !== mode.id }" :aria-pressed="activeModelDeploymentMode === mode.id" @click="modelDeploymentMode = mode.id"><i><component :is="mode.icon" :size="18" /></i><span><b>{{ mode.label }}</b><small>{{ mode.detail }}</small></span><CheckCircle2 v-if="activeModelDeploymentMode === mode.id" :size="18" /></button>
            </nav>
            <section class="model-settings-workspace" :data-mode="modelDeploymentMode">
              <header><div><span>{{ modelDeploymentMode === 'local' ? '本地部署' : '云端 API' }}</span><h4>{{ modelDeploymentMode === 'local' ? '内网模型服务' : '云端模型服务' }}</h4></div><p>{{ modelDeploymentMode === 'local' ? '服务地址需包含协议与端口。' : '密钥仅作为云端服务身份凭据录入。' }}</p></header>

              <template v-if="modelDeploymentMode === 'local'">
                <section class="model-config-group">
                  <header><h5>模型与协议</h5><p>选择已部署模型并确认调用标识。</p></header>
                  <div class="model-config-grid"><label class="model-config-field"><span>部署模型</span><BaseSelect v-model="selectedLocalModelService" :options="localModelServiceOptions" aria-label="选择本地部署模型" size="sm" /></label><label class="model-config-field"><span>模型标识</span><input v-model.trim="localModelConnection.modelId" type="text" autocomplete="off" placeholder="例如：deepseek-v4" /></label></div>
                </section>
                <section class="model-config-group">
                  <header><h5>服务接入</h5><p>填写内网推理服务的访问地址与调用参数。</p></header>
                  <div class="model-config-grid"><label class="model-config-field model-config-field--wide"><span>服务地址</span><input v-model.trim="localModelConnection.endpoint" type="url" autocomplete="url" placeholder="例如：http://10.0.0.20:8000" /></label><label class="model-config-field"><span>请求路径</span><input v-model.trim="localModelConnection.apiPath" type="text" autocomplete="off" placeholder="例如：/v1/chat/completions" /></label><label class="model-config-field"><span>超时时间（秒）</span><input v-model.trim="localModelConnection.timeout" type="text" inputmode="numeric" autocomplete="off" placeholder="例如：60" /></label><label class="model-config-field model-config-field--wide"><span>访问令牌（可选）</span><span class="model-secret-input"><KeyRound :size="17" /><input v-model="localModelConnection.credential" type="password" autocomplete="new-password" placeholder="未启用鉴权时可留空" /></span></label></div>
                </section>
              </template>

              <template v-else>
                <section class="model-config-group">
                  <header><h5>模型与服务</h5><p>选择云端模型服务，并填写实际模型标识。</p></header>
                  <div class="model-config-grid"><label class="model-config-field"><span>云端模型</span><BaseSelect v-model="selectedCloudModelService" :options="cloudModelServiceOptions" aria-label="选择云端模型服务" size="sm" /></label><label class="model-config-field"><span>模型标识</span><input v-model.trim="cloudModelConnection.modelId" type="text" autocomplete="off" placeholder="例如：deepseek-chat" /></label></div>
                </section>
                <section class="model-config-group">
                  <header><h5>API 接入</h5><p>服务地址与密钥由已授权的云端服务提供。</p></header>
                  <div class="model-config-grid"><label class="model-config-field model-config-field--wide"><span>服务地址</span><input v-model.trim="cloudModelConnection.endpoint" type="url" autocomplete="url" placeholder="例如：https://api.example.com" /></label><label class="model-config-field"><span>请求路径</span><input v-model.trim="cloudModelConnection.apiPath" type="text" autocomplete="off" placeholder="例如：/v1/chat/completions" /></label><label class="model-config-field"><span>超时时间（秒）</span><input v-model.trim="cloudModelConnection.timeout" type="text" inputmode="numeric" autocomplete="off" placeholder="例如：60" /></label><label class="model-config-field model-config-field--wide"><span>API Key</span><span class="model-secret-input"><KeyRound :size="17" /><input v-model="cloudModelConnection.credential" type="password" autocomplete="new-password" placeholder="请输入已授权的 API Key" /></span></label></div>
                </section>
              </template>
            </section>
          </section>
        </template>

        <template v-else>
          <header class="panel-heading log-page-heading"><div><h2>系统日志</h2><p>查看账号访问与关键业务操作，保留必要的追溯信息。</p></div></header>
          <section class="system-log-panel" aria-label="系统日志列表">
            <header><div><h3>日志列表</h3><p>共 {{ filteredLogs.length }} 条符合条件的记录</p></div></header>
            <div class="system-log-filters" aria-label="系统日志筛选"><BaseSelect v-model="logType" :options="logTypeOptions" aria-label="筛选日志类型" prefix="类型" /><DateRangeFilter v-model="logDateRange" aria-label="筛选日志日期范围" prefix="日期" /><BaseSelect v-model="logUser" :options="logUserOptions" aria-label="筛选日志用户" prefix="用户" searchable search-placeholder="搜索用户名" search-label="搜索用户名" /><BaseSelect v-model="logScope" :options="logScopeOptions" aria-label="筛选业务范围" prefix="范围" /></div>
            <div class="system-log-table-wrap">
              <table class="system-log-table">
                <thead><tr><th>时间</th><th>类型</th><th>用户</th><th>操作</th><th>业务类型</th><th>状态</th></tr></thead>
                <tbody>
                  <tr v-for="item in filteredLogs" :key="item.id" class="system-log-row">
                    <td>{{ item.time }}</td>
                    <td><span class="log-type-chip" :class="item.type === '登录日志' ? 'login' : 'operation'">{{ item.type }}</span></td>
                    <td><b>{{ item.user }}</b><small>{{ item.department }}</small></td>
                    <td class="system-log-operation"><b>{{ item.action }}</b><small v-if="item.targetName && item.targetName !== item.target">{{ item.targetName }}</small></td>
                    <td><span class="system-log-scope">{{ item.scope }}</span></td>
                    <td><span class="status-chip" :class="item.result === '成功' ? 'success' : 'warning'">{{ item.result }}</span></td>
                  </tr>
                  <tr v-if="!filteredLogs.length"><td class="system-log-empty" colspan="6">暂无符合条件的记录</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>
      </main>
      </section>
    </div>

    <BaseModal :open="Boolean(selectedUser)" :title="userEditorTitle" width="660px" @close="closeUserEditor">
      <form v-if="selectedUser" class="drawer-form user-editor-form" @submit.prevent="saveUser">
        <label>姓名<input v-model.trim="selectedUser.name" required /></label>
        <label>岗位<input v-model.trim="selectedUser.position" required /></label>
        <label>工号<input v-model.trim="selectedUser.id" required /></label>
        <label v-if="selectedUser._originalId && selectedUser.account">登录账号<input :value="selectedUser.account" readonly /></label>
        <label v-else>登录账号<input v-model.trim="selectedUser.account" autocomplete="username" /></label>
        <label><span>所属部门</span><BaseSelect v-model="selectedUser.department" :options="departmentOptions" aria-label="所属部门" /></label>
        <label><span>平台角色</span><BaseSelect v-model="selectedUser.role" :options="userRoleOptions" aria-label="平台角色" /></label>
        <label><span>账号状态</span><BaseSelect v-model="selectedUser.status" :options="accountStatusOptions" aria-label="账号状态" /></label>
        <section v-if="selectedUser.account" class="user-password-reset">
          <header><div><h3>账号安全</h3><p>设置新的登录密码</p></div><KeyRound :size="18" /></header>
          <button v-if="!passwordResetOpen" class="button secondary user-password-reset-trigger" type="button" @click="passwordResetOpen = true">设置新密码</button>
          <div v-else class="user-password-reset-fields">
            <label>新密码<input v-model="passwordResetForm.newPassword" type="password" autocomplete="new-password" /></label>
            <label>确认新密码<input v-model="passwordResetForm.confirmPassword" type="password" autocomplete="new-password" /></label>
            <small>新密码至少包含 8 位字符。</small>
            <p v-if="passwordResetError" class="form-error">{{ passwordResetError }}</p>
            <button class="button primary wide" type="button" :disabled="passwordResetSubmitting" @click="submitPasswordReset">{{ passwordResetSubmitting ? '设置中…' : '确认设置新密码' }}</button>
          </div>
        </section>
        <button class="button primary wide" type="submit">保存用户</button>
      </form>
    </BaseModal>
    <BaseModal :open="Boolean(selectedTemplate)" :title="selectedTemplate?.name || '模板详情'" width="600px" @close="selectedTemplate = null">
      <section v-if="selectedTemplate" class="template-detail">
        <header><span class="template-kind">{{ templateType(selectedTemplate) }}</span><span class="status-chip" :class="selectedTemplate.status === '已发布' ? 'success' : 'warning'">{{ selectedTemplate.status }}</span></header>
        <div><h3>{{ selectedTemplate.name }}</h3><p>{{ selectedTemplate.scope }} · {{ selectedTemplate.version }}</p></div>
        <dl><div><dt>模板编号</dt><dd>{{ selectedTemplate.id }}</dd></div><div><dt>维护部门</dt><dd>{{ selectedTemplate.owner }}</dd></div><div><dt>适用智能应用</dt><dd>{{ selectedTemplate.scope }}</dd></div><div><dt>版本</dt><dd>{{ selectedTemplate.version }}</dd></div></dl>
        <section v-if="isScoringTemplate(selectedTemplate)" class="template-score-preview"><header><div><h3>评分权重</h3><p>评分规则以已发布模板版本为准。</p></div></header><div><span>新颖性<b>40%</b></span><span>先进性<b>35%</b></span><span>应用价值<b>25%</b></span></div></section>
      </section>
    </BaseModal>
    <BaseModal :open="templateCreatorOpen" title="新建模板" width="520px" @close="templateCreatorOpen = false">
      <section class="template-create-intro">
        <span class="template-kind">评分模板</span>
        <div><h3>创新性分析评价模板</h3><p>用于配置创新性分析的评价权重。</p></div>
      </section>
    </BaseModal>
    <BaseModal :open="Boolean(selectedLibrary)" :title="selectedLibrary?.name || '创建公司知识库'" width="620px" @close="selectedLibrary = null">
      <form v-if="selectedLibrary" class="drawer-form library-settings-form" @submit.prevent="saveCompanyLibrarySettings"><label>资料库名称<input v-model="selectedLibrary.name" required /></label><label>资料库简介<textarea v-model="selectedLibrary.description" /></label><section><header><h3>适用范围</h3><p>资料库按组织范围授权使用。</p></header><label><span>授权范围</span><BaseSelect v-model="selectedLibrary.access" :options="libraryAccessOptions" aria-label="授权范围" /></label></section><button class="button primary wide" type="submit">保存资料库</button></form>
    </BaseModal>
    <BaseModal :open="Boolean(departmentEditor)" :title="departmentEditorTitle" width="448px" @close="departmentEditor = null"><form v-if="departmentEditor" class="modal-form" @submit.prevent="saveDepartment"><label>部门名称<input v-model="departmentEditor.name" autofocus required maxlength="30" /></label><label v-if="departmentEditor.mode !== 'root'">上级部门<input :value="findDepartmentEntry(departmentEditor.parentId)?.node.name || departmentEditor.parentName" readonly /></label><footer><button class="button secondary" type="button" @click="departmentEditor = null">取消</button><button class="button primary" type="submit">保存</button></footer></form></BaseModal>
    <BaseModal :open="Boolean(memberAssignment)" title="添加成员" width="448px" @close="memberAssignment = null"><form v-if="memberAssignment" class="modal-form" @submit.prevent="saveMemberAssignment"><label><span>选择平台账号</span><BaseSelect v-model="memberAssignment.userId" :options="memberAssignmentOptions" aria-label="选择平台账号" /></label><footer><button class="button secondary" type="button" @click="memberAssignment = null">取消</button><button class="button primary" type="submit">确认添加</button></footer></form></BaseModal>
    <BaseModal :open="Boolean(memberRemoval)" title="删除成员" width="480px" @close="memberRemoval = null"><section v-if="memberRemoval" class="department-member-removal"><i><Trash2 :size="20" /></i><h3>删除{{ memberRemoval.name }}的成员归属？</h3><p>该成员将移出{{ memberRemoval.department }}，不会删除平台账号；账号信息、平台角色和加入时间会保留，可重新分配到其他部门。</p><div><button class="button secondary" type="button" @click="memberRemoval = null">取消</button><button class="destructive-button" type="button" @click="confirmMemberRemoval">确认删除成员</button></div></section></BaseModal>
    <BaseModal :open="Boolean(selectedOperationRecord)" title="活动详情" width="600px" @close="selectedOperationRecord = null">
      <section v-if="selectedOperationRecord" class="operation-record-detail">
        <header><span class="operation-scope-chip" :class="`scope-${selectedOperationRecord.appKey}`">{{ selectedOperationRecord.app }}</span></header>
        <div><h3>{{ selectedOperationRecord.action }}</h3><p>{{ selectedOperationRecord.targetName }}</p></div>
        <dl><div><dt>调用时间</dt><dd>{{ selectedOperationRecord.time }}</dd></div><div><dt>用户</dt><dd>{{ selectedOperationRecord.user }} · {{ selectedOperationRecord.department }}</dd></div><div><dt>智能应用</dt><dd>{{ selectedOperationRecord.app }}</dd></div><div><dt>记录编号</dt><dd>{{ selectedOperationRecord.id }}</dd></div></dl>
      </section>
    </BaseModal>
    <BaseModal :open="Boolean(selectedOperationsApp)" :title="selectedOperationsApp ? `${selectedOperationsApp.name}明细` : '智能应用明细'" width="600px" @close="selectedOperationsApp = null">
      <section v-if="selectedOperationsApp" class="operation-record-detail operations-app-detail">
        <header><span class="operation-scope-chip" :class="`scope-${selectedOperationsApp.id.replace('operation-app-', '')}`">{{ selectedOperationsApp.name }}</span><span>{{ selectedOperationsPeriod.name }}</span></header>
        <div><h3>{{ selectedOperationsScope.name }} · {{ selectedOperationsApp.name }}</h3><p>数据随当前组织和统计周期同步汇总。</p></div>
        <dl><div><dt>调用次数</dt><dd>{{ formatNumber(selectedOperationsApp.calls) }} 次</dd></div><div><dt>形成成果</dt><dd>{{ formatNumber(selectedOperationsApp.outputs) }} 份</dd></div><div><dt>任务完成率</dt><dd>{{ formatRate(selectedOperationsApp.completionRate) }}</dd></div><div><dt>平均处理时间</dt><dd>{{ selectedOperationsApp.duration }}</dd></div><div><dt>当前状态</dt><dd>{{ selectedOperationsApp.processing ? `${selectedOperationsApp.processing} 项处理中` : '运行正常' }}</dd></div></dl>
      </section>
    </BaseModal>
    <BaseModal :open="Boolean(selectedOperationsOrganization)" :title="selectedOperationsOrganization ? `${selectedOperationsOrganization.name}详情` : '单位详情'" width="560px" @close="selectedOperationsOrganization = null">
      <section v-if="selectedOperationsOrganization" class="operation-record-detail operations-organization-detail">
        <header><span class="operation-scope-chip">{{ selectedOperationsOrganization.level }}</span><span>{{ selectedOperationsPeriod.name }}</span></header>
        <div><h3>{{ selectedOperationsOrganization.name }}</h3><p>当前组织范围内的单位使用情况。</p></div>
        <dl><div><dt>调用量</dt><dd>{{ formatNumber(selectedOperationsOrganization.calls) }} 次</dd></div><div><dt>创建任务</dt><dd>{{ formatNumber(selectedOperationsOrganization.tasks) }} 项</dd></div><div><dt>形成成果</dt><dd>{{ formatNumber(selectedOperationsOrganization.reports) }} 份</dd></div><div><dt>活跃用户</dt><dd>{{ formatNumber(selectedOperationsOrganization.users) }} 名</dd></div></dl>
      </section>
    </BaseModal>
    <div v-if="ui.toast" class="app-toast" :class="`tone-${ui.toast.tone}`" role="status">{{ ui.toast.message }}</div>
  </section>
</template>
