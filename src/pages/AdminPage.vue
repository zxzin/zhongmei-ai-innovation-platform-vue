<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Users, FileStack, ChartNoAxesCombined, Upload, UserPlus, Search, Activity, Clock3, Network, BookOpenText, Settings2, ScrollText, Building2, ChevronRight, ChevronDown, Plus, Pencil, ServerCog, CheckCircle2, KeyRound, ArrowDown, ArrowUp, ChevronsUpDown, Trash2, ArrowLeft, Cloud, FileText, Download, CircleAlert, Info } from '@lucide/vue'
import BaseModal from '../components/BaseModal.vue'
import BaseSelect from '../components/BaseSelect.vue'
import DateRangeFilter from '../components/DateRangeFilter.vue'
import { departmentTree, systemLogs, operationRecords, appPerformance, cockpitAppScopeProfiles, cockpitComparisonScopes, cockpitPeriods, cockpitScopes } from '../data/platform.js'
import {
  buildApplicationMetricRows,
  buildComparisonMetricUnit,
  buildScopeMetricSnapshot,
  comparisonTertiarySources as selectComparisonTertiarySources,
  distributeMetricTotal,
  operationMetricDefinitionGroups,
} from '../data/operationMetrics.js'
import { innovationDefaultWeights, innovationGradeBands, innovationScoreDimensions, innovationScoreItems, innovationWeightTotal, normalizeInnovationWeights } from '../data/innovationTemplate.js'
import { useAuthStore } from '../stores/auth.js'
import { useAdminWorkspaceStore } from '../stores/adminWorkspace.js'
import { useCompanyKnowledgeStore } from '../stores/companyKnowledge.js'
import { useUiStore } from '../stores/ui.js'
import { canEditCompanyLibrary as canEditCompanyLibraryByPolicy, isResourceVisibleToDepartment, resolveVisibility } from '../services/accessPolicy.js'
import { provisionCredential } from '../services/authGateway.js'

const route = useRoute(); const router = useRouter(); const auth = useAuthStore(); const adminWorkspace = useAdminWorkspaceStore(); const companyKnowledge = useCompanyKnowledgeStore(); const ui = useUiStore()
const users = adminWorkspace.users; const templates = adminWorkspace.templates
const query = ref(''); const selectedUser = ref(null); const userEditorSource = ref('users'); const companyLibraryEditor = ref(null); const selectedTemplate = ref(null); const templateCreatorOpen = ref(false); const logType = ref('全部日志'); const logDateRange = ref({ start: '', end: '' }); const logUser = ref('全部用户'); const logScope = ref('全部范围'); const departmentFilter = ref('全部部门'); const roleFilter = ref('全部角色'); const statusFilter = ref('全部状态'); const companyLibraryQuery = ref(''); const companyLibrarySort = ref('最近更新'); const companyLibraryWorkspace = ref('directory'); const activeCompanyLibraryId = ref(null); const companyFileQuery = ref(''); const companyFileSort = ref('最近更新')
const passwordResetOpen = ref(false); const passwordResetSubmitting = ref(false); const passwordResetError = ref('')
const userImportPreview = ref(null); const userImportBusy = ref(false); const templateDraft = ref(null); const templateError = ref(''); const modelValidation = ref(null)
const passwordResetForm = reactive({ newPassword: '', confirmPassword: '' })
const roleFilterOptions = ['全部角色', '管理员', '普通用户']
const statusFilterOptions = ['全部状态', '启用', '停用']
const logTypeOptions = ['全部日志', '登录日志', '操作日志']
const logUserOptions = ['全部用户', ...Array.from(new Set(systemLogs.map((item) => item.user)))]
const logScopeOptions = ['全部范围', ...Array.from(new Set(systemLogs.map((item) => item.scope)))]
const userRoleOptions = ['普通用户', '管理员']
const accountStatusOptions = ['启用', '停用']
const companyVisibilityOptions = [
  { id: 'group', label: '全集团', detail: '全集团管理员均可见和编辑' },
  { id: 'department', label: '本部门', detail: '仅当前部门可见' },
  { id: 'department-children', label: '本部门及子部门', detail: '当前部门及下级组织可见' },
  { id: 'custom', label: '手动选择部门', detail: '按指定组织授予可见与编辑权限' },
]
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
const modelDeploymentMode = ref(adminWorkspace.modelConfig.activeMode)
const activeModelDeploymentMode = ref(adminWorkspace.modelConfig.activeMode)
const modelDeploymentModes = [
  { id: 'local', label: '本地部署', detail: '内网模型服务', icon: ServerCog },
  { id: 'cloud', label: '云端 API', detail: '云端模型服务', icon: Cloud },
]
const selectedLocalModelService = ref(adminWorkspace.modelConfig.local.service)
const selectedCloudModelService = ref(adminWorkspace.modelConfig.cloud.service)
const localModelConnection = reactive({
  endpoint: adminWorkspace.modelConfig.local.endpoint,
  apiPath: adminWorkspace.modelConfig.local.apiPath,
  modelId: adminWorkspace.modelConfig.local.modelId,
  credential: '',
  timeout: adminWorkspace.modelConfig.local.timeout,
})
const cloudModelConnection = reactive({
  endpoint: adminWorkspace.modelConfig.cloud.endpoint,
  apiPath: adminWorkspace.modelConfig.cloud.apiPath,
  modelId: adminWorkspace.modelConfig.cloud.modelId,
  credential: '',
  timeout: adminWorkspace.modelConfig.cloud.timeout,
})
const operationAppOptions = ['全部智能应用', ...new Set(operationRecords.map((item) => item.app))]
const operationDateOptions = ['全部日期', ...Array.from(new Set(operationRecords.map((item) => item.time.slice(0, 10)))).sort().reverse()]
const departmentHierarchy = ref(hydrateDepartmentTree(JSON.parse(JSON.stringify(departmentTree.flatMap((node) => node.children?.length ? node.children : [node])))))
const selectedDepartmentId = ref('dept-技术研发部')
const expandedDepartmentIds = ref(['dept-中煤深圳研究院'])
const departmentEditor = ref(null)
const memberAssignment = ref(null)
const departmentMembershipVersion = ref(0)
const departmentWorkspace = ref(null)
const operationsView = ref('overview')
const operationsPeriod = ref('month')
const operationsScope = ref('group')
const operationsDefinitionOpen = ref(false)
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
const innovationTemplates = computed(() => templates.filter((item) => isScoringTemplate(item)))
const templateDraftWeightTotal = computed(() => templateDraft.value ? innovationWeightTotal(templateDraft.value.weights) : 0)
const selectedDepartmentEntry = computed(() => findDepartmentEntry(selectedDepartmentId.value) || findDepartmentEntry(departmentHierarchy.value[0]?.id))
const selectedDepartment = computed(() => selectedDepartmentEntry.value?.node)
const selectedDepartmentParent = computed(() => selectedDepartmentEntry.value?.parent?.name || '无')
const departmentOptions = computed(() => {
  departmentMembershipVersion.value
  return flattenDepartmentHierarchy(departmentHierarchy.value).map((entry) => ({
      value: entry.node.name,
      label: entry.node.name,
      detail: departmentCompany(entry),
    }))
})
const userDepartmentFilterOptions = computed(() => [
  { value: '全部部门', label: '全部部门' },
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
  return users.filter((user) => user.departmentId === selectedDepartment.value?.id)
})
const canCreateDepartmentChild = computed(() => (selectedDepartment.value?.level || 0) < 2)
const departmentEditorTitle = computed(() => {
  if (departmentEditor.value?.mode === 'edit') return '编辑部门'
  return departmentEditor.value?.mode === 'root' ? '新建根部门' : '新建下级部门'
})
const memberAssignmentOptions = computed(() => {
  departmentMembershipVersion.value
  return users
    .filter((user) => user.departmentId !== selectedDepartment.value?.id)
    .map((user) => ({ value: user.id, label: `${user.name} · ${user.id}`, detail: `${user.department} · ${user.role}` }))
})
const filteredUsers = computed(() => {
  departmentMembershipVersion.value
  return users.filter((user) => `${user.name}${user.account || ''}${user.id}${user.department}`.toLowerCase().includes(query.value.toLowerCase())
    && (departmentFilter.value === '全部部门' || user.department === departmentFilter.value)
    && (roleFilter.value === '全部角色' || user.role === roleFilter.value)
    && (statusFilter.value === '全部状态' || user.status === statusFilter.value))
})
const userSummary = computed(() => ({
  total: users.length,
  active: users.filter((user) => user.status === '启用').length,
  inactive: users.filter((user) => user.status === '停用').length,
}))
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
  { id: 'completionRate', label: '任务完成率', tone: '#36ad8d', rate: true },
  { id: 'activeRate', label: '活跃用户占比', tone: '#7589d7', rate: true },
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
    calls: child.calls, successfulCalls: Math.round(child.calls * 0.97), starts: child.startedTasks ?? child.tasks, tasks: child.tasks, completedTasks: child.completedTasks ?? Math.round(child.tasks * 0.97), reports: child.reports, reviews: Math.max(1, Math.round(child.tasks * 0.08)), activeUsers: child.users, registeredUsers, historicalLogins: Math.round(child.users * 8.8), firstResponseSeconds: parent.firstResponseSeconds, responseSeconds: parent.responseSeconds, comparisonSource: parent.children, comparisonTitle: '同级单位使用情况',
  }
}
const selectedOperationsPeriod = computed(() => cockpitPeriods.find((item) => item.id === operationsPeriod.value) || cockpitPeriods[1])
const selectedOperationsScope = computed(() => resolveOperationsScope(operationsScope.value))
const operationsGroupScope = computed(() => cockpitScopes[0])
const operationsScopeShare = computed(() => selectedOperationsScope.value.calls / Math.max(operationsGroupScope.value.calls, 1))
const operationScopeMetrics = computed(() => buildScopeMetricSnapshot(selectedOperationsScope.value, selectedOperationsPeriod.value))
const operationCallTrend = computed(() => {
  const source = selectedOperationsPeriod.value.trend
  const calls = distributeMetricTotal(operationScopeMetrics.value.calls, source.map((item) => item.calls))
  const results = distributeMetricTotal(operationScopeMetrics.value.successfulCalls, source.map((item) => item.results))
  return source.map((item, index) => ({ ...item, calls: calls[index], results: results[index] }))
})
const operationCallTrendMax = computed(() => Math.max(...operationCallTrend.value.map((item) => item.calls), 1))
const operationApplicationRows = computed(() => buildApplicationMetricRows({
  apps: appPerformance,
  snapshot: operationScopeMetrics.value,
  profile: cockpitAppScopeProfiles[operationsScope.value.split('__')[0]] || cockpitAppScopeProfiles.group,
  scopeShare: operationsScopeShare.value,
}).map((item, index) => ({ ...item, id: `operation-app-${index}` })))
const operationSummary = computed(() => {
  const rows = operationApplicationRows.value
  const weightedDuration = rows.reduce((sum, item) => sum + durationToSeconds(item.duration) * item.calls, 0)
  return {
    ...operationScopeMetrics.value,
    duration: operationScopeMetrics.value.calls ? weightedDuration / operationScopeMetrics.value.calls : 0,
  }
})
const operationMetricCards = computed(() => [
  { id: 'calls', label: '调用总量', value: formatNumber(operationSummary.value.calls), unit: '次', icon: Activity, view: 'applications', tone: 'blue' },
  { id: 'completion', label: '任务完成率', value: formatRate(operationSummary.value.completionRate), unit: '', icon: CheckCircle2, view: 'applications', tone: 'green' },
  { id: 'response', label: '平均首次响应', value: operationSummary.value.firstResponseSeconds.toFixed(1), unit: '秒', icon: Clock3, view: 'applications', tone: 'amber' },
  { id: 'frequency', label: '用户均调用频次', value: operationSummary.value.perUserCallFrequency?.toFixed(1) ?? '—', unit: '次/人', icon: Users, view: 'users', tone: 'violet' },
])
const operationEventMetrics = computed(() => [
  { label: 'Agent 已启动任务', display: formatNumber(operationSummary.value.startedTasks), unit: '次' },
  { label: '完整任务', display: formatNumber(operationSummary.value.completedTasks), unit: '次' },
  { label: '报告生成', display: formatNumber(operationSummary.value.reports), unit: '份' },
  { label: '调用成功率', display: formatRate(operationSummary.value.callSuccessRate), unit: '' },
])
const operationActivitySummary = computed(() => ({
  activeUsers: operationSummary.value.activeUsers,
  registeredUsers: operationSummary.value.registeredUsers,
  activeRate: operationSummary.value.activeRate ?? 0,
  usageFrequency: operationSummary.value.perUserCallFrequency,
}))
const operationComparisonRows = computed(() => {
  const tertiary = selectComparisonTertiarySources(cockpitComparisonScopes, 10)
  const selectedRootName = cockpitScopes.find((scope) => scope.id === operationsScope.value.split('__')[0])?.name
  const selectedBranch = cockpitComparisonScopes.find((scope) => scope.name === selectedRootName)
  const sources = operationsScope.value === 'group'
    ? [
        ...cockpitComparisonScopes.map((scope) => ({ ...scope, level: '二级单位', depth: 0 })),
        ...tertiary.map((child) => ({ ...child, level: '三级单位', depth: 1 })),
      ]
    : (selectedBranch?.children || []).map((child) => ({ ...child, level: '三级单位', depth: 1 }))

  return sources.map((source) => ({
    ...buildComparisonMetricUnit(source, selectedOperationsPeriod.value),
    selected: selectedOperationsScope.value.name === source.name,
  }))
})
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
const currentAdminDepartmentId = computed(() => auth.profile?.departmentId || findDepartmentEntryByName(auth.profile?.department)?.node.id || departmentHierarchy.value[0]?.id || '')
const companyVisibilityDepartmentOptions = computed(() => flattenDepartmentHierarchy(departmentHierarchy.value)
  .map(({ node, parent }) => ({ value: node.id, label: node.name, detail: node.level === 0 ? '二级单位' : `三级单位 · ${parent?.name || ''}` })))
const activeCompanyLibrary = computed(() => companyKnowledge.libraries.find((item) => item.id === activeCompanyLibraryId.value) || null)
const currentCompanyFiles = computed(() => activeCompanyLibrary.value ? companyKnowledge.filesFor(activeCompanyLibrary.value.id) : [])
const visibleCompanyLibraries = computed(() => {
  const keyword = companyLibraryQuery.value.trim().toLowerCase()
  const entries = companyKnowledge.libraries.filter((item) => isCompanyLibraryVisibleToDepartment(item, currentAdminDepartmentId.value)
    && (!keyword || [item.name, item.description, companyLibraryVisibilityLabel(item)].some((value) => value.toLowerCase().includes(keyword))))
  return companyLibrarySort.value === '名称'
    ? [...entries].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    : [...entries].sort((a, b) => String(b.updated).localeCompare(String(a.updated)))
})
const visibleCompanyFiles = computed(() => {
  const keyword = companyFileQuery.value.trim().toLowerCase()
  const entries = currentCompanyFiles.value.filter((item) => !keyword || [item.name, item.type, item.source, item.status].some((value) => value.toLowerCase().includes(keyword)))
  return companyFileSort.value === '名称'
    ? [...entries].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    : [...entries].sort((a, b) => String(b.updated).localeCompare(String(a.updated)))
})
function returnToFront() { router.push('/agents') }
const IMPORT_COLUMNS = { '工号': 'id', '员工工号': 'id', '姓名': 'name', '岗位': 'position', '登录账号': 'account', '账号': 'account', '所属部门': 'department', '部门': 'department', '平台角色': 'role', '角色': 'role', '账号状态': 'status', '状态': 'status' }
function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (char === '"' && quoted && text[index + 1] === '"') { cell += '"'; index += 1 }
    else if (char === '"') quoted = !quoted
    else if (char === ',' && !quoted) { row.push(cell); cell = '' }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && text[index + 1] === '\n') index += 1; row.push(cell); if (row.some((value) => String(value).trim())) rows.push(row); row = []; cell = '' }
    else cell += char
  }
  row.push(cell); if (row.some((value) => String(value).trim())) rows.push(row)
  return rows
}
function buildImportPreview(rawRows, fileName) {
  const headers = (rawRows[0] || []).map((value) => IMPORT_COLUMNS[String(value).replace(/^\uFEFF/, '').trim()] || '')
  if (!headers.includes('id') || !headers.includes('name') || !headers.includes('account') || !headers.includes('department')) throw new Error('表格缺少工号、姓名、登录账号或所属部门列')
  const seenIds = new Set(); const seenAccounts = new Set()
  const rows = rawRows.slice(1).filter((row) => row.some((value) => String(value ?? '').trim())).map((row, index) => {
    const values = {}; headers.forEach((key, column) => { if (key) values[key] = String(row[column] ?? '').trim() })
    const errors = []; const targetDepartment = findDepartmentEntryByName(values.department)
    if (!values.id) errors.push('缺少工号'); if (!values.name) errors.push('缺少姓名'); if (!values.account) errors.push('缺少登录账号'); if (!targetDepartment) errors.push('所属部门不在组织树中')
    if (seenIds.has(values.id)) errors.push('工号在文件中重复'); if (seenAccounts.has(values.account)) errors.push('登录账号在文件中重复')
    seenIds.add(values.id); seenAccounts.add(values.account)
    const existingById = users.find((user) => user.id === values.id); const existingByAccount = users.find((user) => user.account === values.account)
    if (existingById && existingByAccount && existingById !== existingByAccount) errors.push('工号和账号对应到不同用户')
    const role = values.role || '普通用户'; const status = values.status || '启用'
    if (!['普通用户', '管理员'].includes(role)) errors.push('平台角色应为普通用户或管理员')
    if (!['启用', '停用'].includes(status)) errors.push('账号状态应为启用或停用')
    const existing = existingById || existingByAccount
    return { line: index + 2, action: existing ? '更新' : '新增', errors, record: { ...existing, id: values.id, name: values.name, position: values.position || existing?.position || '未设置岗位', account: values.account, company: targetDepartment ? departmentCompany(targetDepartment) : '', department: values.department, departmentId: targetDepartment?.node.id || '', role, status, joinedAt: existing?.joinedAt || new Date().toISOString().slice(0, 10), lastLogin: existing?.lastLogin || '尚未登录', lastLoginAt: existing?.lastLoginAt || '' } }
  })
  return { fileName, rows, invalidCount: rows.filter((row) => row.errors.length).length }
}
async function importUsers(event) {
  const file = event.target.files?.[0]; event.target.value = ''; if (!file) return
  userImportBusy.value = true
  try {
    const extension = file.name.split('.').pop()?.toLowerCase()
    const rawRows = extension === 'csv' ? parseCsv(await file.text()) : await (await import('read-excel-file/browser')).default(file)
    userImportPreview.value = buildImportPreview(rawRows, file.name)
  } catch (error) { ui.notify(error.message || '无法读取导入文件', 'warning') }
  finally { userImportBusy.value = false }
}
function downloadUserImportTemplate() {
  const csv = '\uFEFF工号,姓名,岗位,登录账号,所属部门,平台角色,账号状态\nE0099,示例用户,研发工程师,sample.user,技术研发部,普通用户,启用'
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = '用户批量导入模板.csv'; link.click(); URL.revokeObjectURL(url)
}
async function confirmUserImport() {
  if (!userImportPreview.value || userImportPreview.value.invalidCount) return
  const records = userImportPreview.value.rows.map((row) => row.record); const result = adminWorkspace.upsertUsers(records)
  await Promise.all(records.map((record) => provisionCredential({ account: record.account })))
  records.forEach((record) => auth.syncDirectoryUser(record)); departmentMembershipVersion.value += 1; userImportPreview.value = null
  ui.notify(`已导入 ${records.length} 条：新增 ${result.created} 条，更新 ${result.updated} 条`, 'success')
}
function currentModelConnection() { return modelDeploymentMode.value === 'local' ? localModelConnection : cloudModelConnection }
function modelErrors() {
  const connection = currentModelConnection(); const errors = []
  try { const url = new URL(connection.endpoint); if (!['http:', 'https:'].includes(url.protocol)) errors.push('服务地址仅支持 HTTP 或 HTTPS') } catch { errors.push('请填写完整服务地址') }
  if (!connection.apiPath.startsWith('/')) errors.push('请求路径需以 / 开头')
  if (!connection.modelId) errors.push('请填写模型标识')
  const timeout = Number(connection.timeout); if (!Number.isFinite(timeout) || timeout < 1 || timeout > 300) errors.push('超时时间需为 1–300 秒')
  if (modelDeploymentMode.value === 'cloud' && !connection.credential) errors.push('请输入云端 API Key（密钥仅保留在当前会话）')
  return errors
}
function validateConfiguration() {
  const errors = modelErrors(); modelValidation.value = { ok: !errors.length, message: errors.length ? errors.join('；') : '配置格式校验通过，可以保存。' }; return !errors.length
}
function saveConfiguration() {
  if (!validateConfiguration()) { ui.notify(modelValidation.value.message, 'warning'); return }
  const mode = modelDeploymentMode.value; const connection = { ...currentModelConnection(), service: mode === 'local' ? selectedLocalModelService.value : selectedCloudModelService.value, checkedAt: new Date().toLocaleString('sv-SE'), checkStatus: 'validated' }
  adminWorkspace.saveModelConfiguration(mode, connection); activeModelDeploymentMode.value = mode
  ui.notify('配置已保存并切换', 'success')
}
function companyLibraryFilesCount(libraryId) { return companyKnowledge.filesFor(libraryId).length }
function companyDateText(value = '') { return String(value).replace(' ', ' · ') }
function companyDateDay(value = '') { return String(value).trim().split(/\s+/)[0] || '—' }
function resolveCompanyLibraryVisibility(library) {
  return resolveVisibility(library, currentAdminDepartmentId.value)
}
function isCompanyLibraryVisibleToDepartment(library, departmentId) {
  return isResourceVisibleToDepartment(library, departmentId, getDepartmentPath, currentAdminDepartmentId.value)
}
function companyLibraryVisibilityLabel(library) {
  const visibility = resolveCompanyLibraryVisibility(library)
  if (visibility.mode === 'group') return '全集团'
  const owner = findDepartmentEntry(visibility.ownerDepartmentId)?.node.name || '本部门'
  if (visibility.mode === 'department') return `本部门 · ${owner}`
  if (visibility.mode === 'department-children') return `本部门及子部门 · ${owner}`
  const names = (visibility.departmentIds || []).map((id) => findDepartmentEntry(id)?.node.name).filter(Boolean)
  return names.length ? `指定部门 · ${names.join('、')}` : '未设置可见部门'
}
function companyLibraryScopeShortLabel(library) {
  const visibility = resolveCompanyLibraryVisibility(library)
  if (visibility.mode === 'group') return '全集团'
  if (visibility.mode === 'department') return '本部门'
  if (visibility.mode === 'department-children') return '本部门及子部门'
  return '指定部门'
}
function companyLibraryVisibilityDescription(library) {
  const visibility = resolveCompanyLibraryVisibility(library)
  if (visibility.mode === 'group') return '全集团范围内具有管理员权限的账号均可查看和编辑。'
  const owner = findDepartmentEntry(visibility.ownerDepartmentId)?.node.name || '当前部门'
  if (visibility.mode === 'department') return `仅 ${owner} 的管理员可查看和编辑。`
  if (visibility.mode === 'department-children') return `${owner} 及下级组织中具有管理员权限的账号可查看和编辑。`
  const names = (visibility.departmentIds || []).map((id) => findDepartmentEntry(id)?.node.name).filter(Boolean)
  return names.length ? `已授予 ${names.join('、')} 的管理员查看和编辑权限。` : '尚未授予任何部门查看和编辑权限。'
}
function companyLibraryEditorDescription() {
  if (!companyLibraryEditor.value) return ''
  return companyLibraryVisibilityDescription({ visibility: {
    mode: companyLibraryEditor.value.visibilityMode,
    ownerDepartmentId: companyLibraryEditor.value.ownerDepartmentId,
    departmentIds: companyLibraryEditor.value.departmentIds,
  } })
}
function canEditCompanyLibrary(library) {
  return canEditCompanyLibraryByPolicy(auth.profile, library, getDepartmentPath, currentAdminDepartmentId.value)
}
function openCompanyLibrary(library) {
  if (!canEditCompanyLibrary(library)) {
    ui.notify('当前管理员不在该资料库的可见范围内', 'warning')
    return
  }
  activeCompanyLibraryId.value = library.id
  companyLibraryWorkspace.value = 'detail'
  companyFileQuery.value = ''
  companyFileSort.value = '最近更新'
}
function returnToCompanyLibraryDirectory() {
  activeCompanyLibraryId.value = null
  companyLibraryWorkspace.value = 'directory'
  companyFileQuery.value = ''
}
function openCompanyLibraryEditor(library = null) {
  const visibility = resolveCompanyLibraryVisibility(library || {})
  companyLibraryEditor.value = {
    mode: library ? 'edit' : 'create',
    id: library?.id || '',
    name: library?.name || '',
    description: library?.description || '',
    visibilityMode: visibility.mode,
    ownerDepartmentId: visibility.ownerDepartmentId || currentAdminDepartmentId.value,
    departmentIds: [...(visibility.departmentIds || [])],
  }
}
function saveCompanyLibrarySettings() {
  const editor = companyLibraryEditor.value
  if (!editor?.name?.trim()) {
    ui.notify('请填写资料库名称', 'warning')
    return
  }
  if (editor.visibilityMode === 'custom' && !editor.departmentIds.length) {
    ui.notify('请至少选择一个可见部门', 'warning')
    return
  }
  const payload = {
    name: editor.name,
    description: editor.description,
    visibility: {
      mode: editor.visibilityMode,
      ownerDepartmentId: editor.ownerDepartmentId,
      departmentIds: [...editor.departmentIds],
    },
  }
  const saved = editor.mode === 'create'
    ? companyKnowledge.createLibrary(payload)
    : companyKnowledge.updateLibrary(editor.id, payload)
  companyLibraryEditor.value = null
  if (!saved) {
    ui.notify('资料库保存失败，请重新打开后再试', 'warning')
    return
  }
  if (isCompanyLibraryVisibleToDepartment(saved, currentAdminDepartmentId.value)) {
    activeCompanyLibraryId.value = saved.id
    companyLibraryWorkspace.value = 'detail'
  } else {
    returnToCompanyLibraryDirectory()
  }
  ui.notify(editor.mode === 'create' ? '资料库已创建，可继续上传文件' : '资料库权限与信息已保存', 'success')
}
function handleCompanyFileUpload(event) {
  const added = companyKnowledge.addFiles(activeCompanyLibrary.value?.id, event.target.files)
  event.target.value = ''
  if (!added.length) return
  ui.notify(`${added.length} 个文件已加入该资料库`, 'success')
}
function removeCompanyLibraryFile(file) {
  companyKnowledge.removeFile(file.id)
  ui.notify(`已从资料库移除“${file.name}”`, 'success')
}
function templateType() { return '评分模板' }
function isScoringTemplate(item) { return item?.kind === 'scoring' || item?.scope === '创新性分析' }
function templateWeights(item) { return normalizeInnovationWeights(item?.weights) }
function templateWeightTotal(item) { return innovationWeightTotal(templateWeights(item)) }
function templateDimensions(item) {
  const weights = templateWeights(item)
  return innovationScoreDimensions.map((dimension) => ({
    ...dimension,
    weight: dimension.indicators.reduce((sum, indicator) => sum + Number(weights[indicator.id] || 0), 0),
  }))
}
function nextInnovationTemplateVersion() {
  const latest = innovationTemplates.value.reduce((highest, item) => {
    const version = Number(String(item.version || '').match(/\d+/)?.[0] || 0)
    return Math.max(highest, version)
  }, 0)
  return `V${latest + 1}`
}
function openTemplateCreator() {
  templateError.value = ''
  templateDraft.value = {
    name: '',
    kind: 'scoring',
    scope: '创新性分析',
    version: nextInnovationTemplateVersion(),
    status: '草稿',
    weights: { ...innovationDefaultWeights },
  }
  templateCreatorOpen.value = true
}
function closeTemplateCreator() { templateCreatorOpen.value = false; templateDraft.value = null; templateError.value = '' }
function saveTemplate() {
  const draft = templateDraft.value
  const name = String(draft?.name || '').trim()
  const weights = normalizeInnovationWeights(draft?.weights)
  const total = innovationWeightTotal(weights)
  if (!name) {
    templateError.value = '请输入版本名称'
    return
  }
  if (Math.abs(total - 100) > 0.001) {
    templateError.value = `${innovationScoreItems.length} 项权重合计需为 100%，当前为 ${total}%`
    return
  }
  const saved = adminWorkspace.createTemplate({
    name,
    kind: 'scoring',
    scope: '创新性分析',
    version: draft.version,
    status: '草稿',
    weights,
    owner: auth.profile?.department || '科研管理部',
  })
  closeTemplateCreator(); ui.notify(`“${saved.name}”已保存`, 'success')
}
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
  const departmentIds = new Set(flattenDepartmentHierarchy([node]).map((entry) => entry.node.id))
  return users.filter((user) => departmentIds.has(user.departmentId)).length
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
      if (user.departmentId === current.node.id) user.department = name
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
  if (user.departmentId === target.node.id) {
    memberAssignment.value = null
    return
  }
  user.department = target.node.name
  user.departmentId = target.node.id
  user.company = departmentCompany(target)
  departmentMembershipVersion.value += 1
  memberAssignment.value = null
  ui.notify(`已将 ${user.name} 加入${target.node.name}`, 'success')
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
  const department = selectedDepartment.value
  selectedUser.value = {
    name: '', position: '', id: '', account: '',
    company: departmentCompany(selectedDepartmentEntry.value),
    department: department?.name || '', departmentId: department?.id || '',
    role: '普通用户', status: '启用',
  }
  userEditorSource.value = 'users'
  resetPasswordFormState()
}
function closeUserEditor() {
  selectedUser.value = null
  userEditorSource.value = 'users'
  resetPasswordFormState()
}
async function saveUser() {
  const draft = selectedUser.value
  if (!draft) return

  const name = draft.name?.trim()
  const position = draft.position?.trim()
  const id = draft.id?.trim()
  const account = draft.account?.trim()
  const department = draft.department
  const targetDepartment = findDepartmentEntryByName(department)

  if (!name || !id || !account) {
    ui.notify('请完整填写姓名、工号和登录账号', 'warning')
    return
  }
  if (!targetDepartment) {
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
    company: departmentCompany(targetDepartment),
    department,
    departmentId: targetDepartment.node.id,
    role: draft.role === '管理员' ? '管理员' : '普通用户',
    status: draft.status === '停用' ? '停用' : '启用',
  }
  if (existing) {
    Object.assign(existing, record)
  } else {
    users.push({ ...record, joinedAt: new Date().toISOString().slice(0, 10), lastLogin: '尚未登录', lastLoginAt: '' })
  }

  const savedUser = existing || users.at(-1)
  adminWorkspace.persist()
  const credential = await provisionCredential({ account: savedUser.account })
  const activeAccount = auth.profile?.account
  auth.syncDirectoryUser(savedUser)
  departmentMembershipVersion.value += 1
  ui.notify(credential.created ? '用户已保存，初始密码为 demo123' : '用户信息已保存', 'success')
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
        <span><b>AI 创新应用平台</b></span>
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
                <button class="operations-comparison-trigger operations-definition-trigger" type="button" @click="operationsDefinitionOpen = true"><Info :size="15" />统计口径</button>
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
                <div class="operations-activity-metrics"><article><span>活跃用户</span><b>{{ formatRate(operationActivitySummary.activeRate) }}</b><p>{{ formatNumber(operationActivitySummary.activeUsers) }} / {{ formatNumber(operationActivitySummary.registeredUsers) }} 人</p></article><article><span>人均调用</span><b>{{ operationActivitySummary.usageFrequency?.toFixed(1) ?? '—' }}<em>次 / 人</em></b></article></div>
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
                    <span v-for="metric in operationComparisonMetrics" :key="metric.id" class="operations-comparison-metric" :style="{ '--comparison-tone': metric.tone }"><small>{{ metric.label }}</small><i><u :style="{ width: operationComparisonMetricWidth(item, metric.id) }" /></i><b>{{ metric.rate ? formatRate(item[metric.id]) : formatNumber(item[metric.id]) }}</b></span>
                    <ChevronRight :size="16" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>
          </template>

          <section v-else-if="operationsView === 'applications'" class="operations-detail-card operations-list-card">
            <header><h3>智能应用</h3><span>{{ selectedOperationsPeriod.name }} · {{ selectedOperationsScope.name }}</span></header>
            <div class="operations-table-wrap"><table class="operations-table operations-app-table"><thead><tr><th>智能应用</th><th>调用次数</th><th>Agent 已启动任务</th><th>完整任务</th><th>任务完成率</th><th>调用成功率</th><th>平均处理时间</th><th aria-label="查看详情" /></tr></thead><tbody><tr v-for="item in operationApplicationRows" :key="item.id" class="operation-record-row" tabindex="0" @click="selectedOperationsApp = item" @keydown.enter.prevent="selectedOperationsApp = item"><td><b>{{ item.name }}</b><small>{{ item.processing ? `${item.processing} 项处理中` : '运行正常' }}</small></td><td>{{ formatNumber(item.calls) }} 次</td><td>{{ formatNumber(item.startedTasks) }} 次</td><td>{{ formatNumber(item.completedTasks) }} 次</td><td>{{ formatRate(item.completionRate) }}</td><td>{{ formatRate(item.successRate) }}</td><td>{{ item.duration }}</td><td><ChevronRight :size="17" /></td></tr></tbody></table></div>
          </section>

          <template v-else-if="operationsView === 'users'">
            <section class="operations-user-summary"><article><span>活跃用户占比</span><b>{{ formatRate(operationActivitySummary.activeRate) }}</b><small>{{ formatNumber(operationActivitySummary.activeUsers) }} 名活跃用户</small></article><article><span>注册用户</span><b>{{ formatNumber(operationActivitySummary.registeredUsers) }} 名</b><small>所选组织范围</small></article><article><span>用户均调用频次</span><b>{{ operationActivitySummary.usageFrequency?.toFixed(1) ?? '—' }} 次</b><small>按注册用户平均计算</small></article></section>
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
                <div class="department-members-table-wrap"><table class="department-members-table"><thead><tr><th>成员 / 岗位</th><th>账号 / 工号</th><th>平台角色</th><th>状态</th><th>加入时间</th><th>操作</th></tr></thead><tbody><tr v-for="member in selectedDepartmentMembers" :key="member.id"><td><b>{{ member.name }}</b><small class="department-member-position">{{ member.position || '未设置岗位' }}</small></td><td>{{ member.account ? `${member.account} / ${member.id}` : member.id }}</td><td>{{ member.role }}</td><td><span class="status-chip" :class="member.status === '启用' ? 'success' : 'neutral'">{{ member.status }}</span></td><td>{{ member.joinedAt }}</td><td><div class="department-member-actions"><button class="department-edit-member" type="button" @click="openUserEditor(member, 'departments')"><Pencil :size="14" />调整归属</button></div></td></tr><tr v-if="!selectedDepartmentMembers.length"><td class="department-members-empty" colspan="6">当前部门暂无已关联的平台账号</td></tr></tbody></table></div>
              </section>
            </section>
          </div>
        </template>

        <template v-else-if="section === 'templates'">
          <header class="panel-heading template-page-heading">
            <div><h2>创新性分析模板</h2><p>固定 {{ innovationScoreItems.length }} 项二级评分指标与四档赋分规则；管理员可通过调整权重创建新的评价模板。</p></div>
            <button class="button primary" type="button" @click="openTemplateCreator"><Plus :size="17" />创建权重模板</button>
          </header>
          <section class="template-directory template-score-directory" aria-label="创新性分析评价模板目录">
            <header><div><h3>评价模板版本</h3><p>每个版本使用相同的评分项、档位和判定依据，仅权重配置不同。</p></div><span>{{ innovationTemplates.length }} 个版本</span></header>
            <div class="template-table-wrap">
              <table class="template-table template-score-directory-table"><thead><tr><th>版本名称</th><th>评分范围</th><th>权重合计</th><th>维护部门</th><th>状态</th><th aria-label="查看详情" /></tr></thead><tbody>
                <tr v-for="item in innovationTemplates" :key="item.id" class="template-row" tabindex="0" @click="selectedTemplate = { ...item }" @keydown.enter.prevent="selectedTemplate = { ...item }"><td><b :title="item.name">{{ item.name }}</b><small>{{ item.version }}</small></td><td><span class="template-kind">{{ innovationScoreItems.length }} 项二级指标</span></td><td><b class="template-total-weight">{{ templateWeightTotal(item) }}%</b></td><td>{{ item.owner }}</td><td><span class="status-chip" :class="item.status === '已发布' ? 'success' : 'warning'">{{ item.status }}</span></td><td><button class="table-row-action" type="button" :aria-label="`查看${item.name}详情`" @click.stop="selectedTemplate = { ...item }">查看规则<ChevronRight :size="16" /></button></td></tr>
              </tbody></table>
            </div>
          </section>
        </template>

        <template v-else-if="section === 'knowledge'">
          <section v-if="companyLibraryWorkspace === 'directory'" class="company-library-directory company-library-directory-v2" aria-label="公司资料库目录">
            <div class="knowledge-toolbar knowledge-toolbar-v2 company-library-toolbar"><label class="search-field"><Search :size="17" /><input v-model="companyLibraryQuery" placeholder="搜索资料库、可见部门或内容说明" /></label><BaseSelect v-model="companyLibrarySort" :options="['最近更新', '名称']" aria-label="公司知识库排序规则" /><button class="button primary company-library-create" type="button" @click="openCompanyLibraryEditor()"><Plus :size="17" />创建资料库</button></div>
            <div v-if="visibleCompanyLibraries.length" class="knowledge-library-list company-knowledge-library-list">
              <article v-for="item in visibleCompanyLibraries" :key="item.id">
                <button class="knowledge-library-row" type="button" :aria-label="`管理${item.name}`" @click="openCompanyLibrary(item)">
                  <i><BookOpenText :size="24" /></i>
                  <span class="knowledge-library-identity"><span class="company-library-access" :title="companyLibraryVisibilityLabel(item)"><small>可见及编辑</small><b>{{ companyLibraryScopeShortLabel(item) }}</b></span><b>{{ item.name }}</b><em>{{ item.description }}</em></span>
                  <span class="company-library-meta"><span><small>资料文件</small><b>{{ companyLibraryFilesCount(item.id) }} 份</b></span><i aria-hidden="true" /><span><small>更新日期</small><b>{{ companyDateDay(item.updated) }}</b></span></span>
                </button>
                <div class="knowledge-library-actions company-library-actions"><button type="button" class="text-action" @click="openCompanyLibrary(item)">打开资料库 <b><ChevronRight :size="16" /></b></button></div>
                <span class="knowledge-library-watermark" aria-hidden="true"><BookOpenText :size="172" /></span>
              </article>
            </div>
            <div v-else class="empty-state knowledge-empty company-library-empty"><BookOpenText :size="30" /><h2>暂无可管理的资料库</h2><p>当前管理员仅能查看获授权范围内的公司资料库。</p></div>
          </section>
          <section v-else-if="activeCompanyLibrary" class="company-library-detail knowledge-detail-page" aria-labelledby="company-library-detail-title">
            <nav class="company-library-detail-nav" aria-label="公司资料库导航">
              <button class="detail-back company-library-detail-back" type="button" @click="returnToCompanyLibraryDirectory"><ArrowLeft :size="15" />返回目录</button>
            </nav>
            <article class="knowledge-detail-hero company-library-detail-hero">
              <header>
                <div class="company-library-detail-copy"><h2 id="company-library-detail-title">{{ activeCompanyLibrary.name }}</h2><p>{{ activeCompanyLibrary.description }}</p></div>
                <div class="company-library-detail-meta">
                  <span class="company-library-scope-chip" :title="companyLibraryVisibilityDescription(activeCompanyLibrary)" :aria-label="`可见范围：${companyLibraryVisibilityLabel(activeCompanyLibrary)}`">{{ companyLibraryVisibilityLabel(activeCompanyLibrary) }}</span>
                  <button class="button secondary company-library-detail-edit" type="button" @click="openCompanyLibraryEditor(activeCompanyLibrary)"><Pencil :size="14" />编辑</button>
                </div>
              </header>
            </article>
            <section class="knowledge-file-workspace company-library-file-workspace" aria-labelledby="company-library-files-title"><header><div><h2 id="company-library-files-title">资料文件</h2></div></header><div class="library-file-toolbar company-library-file-toolbar"><label class="search-field"><Search :size="17" /><input v-model="companyFileQuery" placeholder="搜索文件" /></label><BaseSelect v-model="companyFileSort" :options="['最近更新', '名称']" aria-label="公司资料库文件排序规则" /><label class="button primary upload-button company-library-upload-button"><Upload :size="15" />上传文件<input type="file" multiple @change="handleCompanyFileUpload" /></label></div>
              <div v-if="visibleCompanyFiles.length" class="file-list file-list-v2 company-library-file-list"><article v-for="file in visibleCompanyFiles" :key="file.id"><span class="file-preview-trigger"><i><FileText :size="19" /></i><span><b>{{ file.name }}</b><small>{{ file.type }} · {{ file.size }} · {{ file.source }} · {{ file.status }} · 更新于 {{ companyDateText(file.updated) }}</small></span></span><div class="file-row-actions"><button class="text-action danger" type="button" @click="removeCompanyLibraryFile(file)"><Trash2 :size="15" />移除</button></div></article></div>
              <div v-else class="empty-state library-files-empty"><FileText :size="28" /><h2>当前资料库还没有文件</h2><p>上传资料后，会在这里统一展示来源、状态和更新时间。</p></div>
            </section>
          </section>
        </template>

        <template v-else-if="section === 'users'">
          <header class="panel-heading"><div><h2>用户管理</h2><p>账号由管理员统一创建，平台权限由“普通用户”和“管理员”两类角色决定。</p></div><div><button class="button secondary" type="button" @click="downloadUserImportTemplate"><Download :size="17" />下载模板</button><label class="button secondary import-button"><Upload :size="17" />{{ userImportBusy ? '读取中…' : 'Excel 批量导入' }}<input type="file" accept=".xlsx,.csv" :disabled="userImportBusy" @change="importUsers" /></label><button class="button primary" type="button" @click="openUserCreate"><UserPlus :size="17" />单独创建</button></div></header>
          <div class="admin-summary" aria-label="用户概览"><article><span>用户总数</span><b>{{ userSummary.total }}</b></article><article><span>已启用</span><b>{{ userSummary.active }}</b></article><article><span>已停用</span><b>{{ userSummary.inactive }}</b></article></div>
          <div class="table-tools"><label class="search-field"><Search :size="17" /><input v-model="query" placeholder="搜索姓名、工号或部门" /></label><BaseSelect v-model="departmentFilter" :options="userDepartmentFilterOptions" aria-label="筛选部门" /><BaseSelect v-model="roleFilter" :options="roleFilterOptions" aria-label="筛选角色" /><BaseSelect v-model="statusFilter" :options="statusFilterOptions" aria-label="筛选账号状态" /></div>
          <div class="data-table-wrap"><table><thead><tr><th>用户</th><th>工号</th><th>公司</th><th>部门</th><th>角色</th><th>状态</th><th>最近登录</th><th>操作</th></tr></thead><tbody><tr v-for="user in filteredUsers" :key="user.id"><td><b>{{ user.name }}</b></td><td>{{ user.id }}</td><td>{{ user.company }}</td><td>{{ user.department }}</td><td>{{ user.role }}</td><td><span class="status-chip" :class="user.status === '启用' ? 'success' : 'neutral'">{{ user.status }}</span></td><td>{{ user.lastLogin }}</td><td><button class="user-edit-button" type="button" aria-label="编辑用户" @click="openUserEditor(user, 'users')"><Pencil :size="16" />编辑</button></td></tr></tbody></table></div>
        </template>

        <template v-else-if="section === 'config'">
          <header class="panel-heading config-page-heading"><div><h2>大模型配置</h2></div><div class="config-page-actions"><button class="button secondary" type="button" @click="validateConfiguration"><CheckCircle2 :size="16" />校验配置</button><button class="button primary" type="button" @click="saveConfiguration">保存并切换</button></div></header>
          <section class="model-settings-card" aria-label="大模型服务接入">
            <header><i><ServerCog :size="21" /></i><div><h3>模型服务接入</h3><p>按当前部署方式填写必要连接信息。</p></div></header>
            <nav class="model-deployment-switch" aria-label="选择模型部署方式">
              <button v-for="mode in modelDeploymentModes" :key="mode.id" type="button" :class="{ active: activeModelDeploymentMode === mode.id, pending: modelDeploymentMode === mode.id && activeModelDeploymentMode !== mode.id }" :aria-pressed="activeModelDeploymentMode === mode.id" @click="modelDeploymentMode = mode.id"><i><component :is="mode.icon" :size="18" /></i><span><b>{{ mode.label }}</b><small>{{ mode.detail }}</small></span><CheckCircle2 v-if="activeModelDeploymentMode === mode.id" :size="18" /></button>
            </nav>
            <section class="model-settings-workspace" :data-mode="modelDeploymentMode">
              <header><div><span>{{ modelDeploymentMode === 'local' ? '本地部署' : '云端 API' }}</span><h4>{{ modelDeploymentMode === 'local' ? '内网模型服务' : '云端模型服务' }}</h4></div><p>{{ modelDeploymentMode === 'local' ? '服务地址需包含协议与端口。' : '密钥仅保留在当前会话，不写入浏览器存储。' }}</p></header>

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
              <div v-if="modelValidation" class="model-validation" :class="modelValidation.ok ? 'success' : 'danger'"><CheckCircle2 v-if="modelValidation.ok" :size="18" /><CircleAlert v-else :size="18" /><span>{{ modelValidation.message }}</span></div>
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
        <label v-else>登录账号<input v-model.trim="selectedUser.account" autocomplete="username" required /></label>
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
    <BaseModal :open="Boolean(selectedTemplate)" :title="selectedTemplate ? `${selectedTemplate.name} · ${selectedTemplate.version}` : '模板规则'" width="1040px" @close="selectedTemplate = null">
      <section v-if="selectedTemplate" class="template-detail template-scoring-detail">
        <header class="template-detail-banner"><div><span class="template-kind">{{ templateType(selectedTemplate) }}</span><h3>{{ selectedTemplate.name }}</h3><p>{{ innovationScoreItems.length }} 项二级指标各按 100 / 80 / 60 / 30 四档赋值后加权求和，形成 0–100 分评价结果。</p></div><span class="status-chip" :class="selectedTemplate.status === '已发布' ? 'success' : 'warning'">{{ selectedTemplate.status }}</span></header>
        <dl class="template-detail-meta"><div><dt>适用智能应用</dt><dd>创新性分析</dd></div><div><dt>维护部门</dt><dd>{{ selectedTemplate.owner }}</dd></div><div><dt>权重合计</dt><dd>{{ templateWeightTotal(selectedTemplate) }}%</dd></div></dl>
        <section class="template-score-rule"><header><div><h3>固定评分项</h3><p>指标、评分档位及判定依据由平台统一维护；本模板仅记录各指标的权重配置。</p></div><span>{{ innovationScoreItems.length }} 项</span></header><div class="template-score-table-wrap"><table class="template-score-table"><colgroup><col class="template-dimension-column" /><col class="template-indicator-column" /><col class="template-weight-column" /><col class="template-band-column" /><col class="template-basis-column" /></colgroup><thead><tr><th>一级维度</th><th>二级指标</th><th>权重</th><th>档位</th><th>判定依据</th></tr></thead><tbody v-for="dimension in templateDimensions(selectedTemplate)" :key="dimension.id"><tr v-for="(indicator, index) in dimension.indicators" :key="indicator.id"><th v-if="index === 0" class="template-dimension-cell" :rowspan="dimension.indicators.length" scope="rowgroup"><span>{{ dimension.label }}</span><b>{{ dimension.weight }}%</b></th><td class="template-indicator-cell"><b>{{ indicator.id }}</b><span>{{ indicator.label }}</span></td><td class="template-weight-cell"><strong>{{ templateWeights(selectedTemplate)[indicator.id] }}%</strong></td><td class="template-band-cell"><span class="template-grade-band">{{ innovationGradeBands.join(' / ') }}</span></td><td class="template-basis-cell">{{ indicator.basis }}</td></tr></tbody></table></div></section>
      </section>
    </BaseModal>
    <BaseModal :open="templateCreatorOpen" title="创建创新性分析评价模板" width="780px" @close="closeTemplateCreator">
      <form v-if="templateDraft" class="modal-form template-create-form" @submit.prevent="saveTemplate">
        <section class="template-weight-editor"><header class="template-weight-heading"><h3>指标权重</h3><strong :class="{ invalid: Math.abs(templateDraftWeightTotal - 100) > 0.001 }"><small>合计</small>{{ templateDraftWeightTotal }}%</strong></header><div class="template-weight-list"><label v-for="indicator in innovationScoreItems" :key="indicator.id"><span><small>{{ indicator.dimensionLabel }}</small><b>{{ indicator.id }} {{ indicator.label }}</b></span><span class="template-weight-input"><input v-model.number="templateDraft.weights[indicator.id]" :aria-label="`${indicator.label}权重`" type="number" min="0" max="100" step="1" @input="templateError = ''" /><em>%</em></span></label></div></section>
        <label class="template-version-name"><span>版本名称</span><input v-model.trim="templateDraft.name" required maxlength="32" placeholder="例如：重点技术评估版" @input="templateError = ''" /></label>
        <p v-if="templateError" class="form-error">{{ templateError }}</p><footer><button class="button secondary" type="button" @click="closeTemplateCreator">取消</button><button class="button primary" type="submit" :disabled="Math.abs(templateDraftWeightTotal - 100) > 0.001 || !templateDraft.name.trim()">保存版本</button></footer>
      </form>
    </BaseModal>
    <BaseModal :open="Boolean(userImportPreview)" title="确认批量导入" width="900px" @close="userImportPreview = null">
      <section v-if="userImportPreview" class="user-import-preview"><header><div><b>{{ userImportPreview.fileName }}</b><span>{{ userImportPreview.rows.length }} 条记录</span></div><span :class="userImportPreview.invalidCount ? 'danger' : 'success'">{{ userImportPreview.invalidCount ? `${userImportPreview.invalidCount} 条待修正` : '全部通过校验' }}</span></header><div class="user-import-table"><table><thead><tr><th>行</th><th>操作</th><th>工号</th><th>姓名</th><th>登录账号</th><th>部门</th><th>校验结果</th></tr></thead><tbody><tr v-for="row in userImportPreview.rows" :key="row.line" :class="{ invalid: row.errors.length }"><td>{{ row.line }}</td><td>{{ row.action }}</td><td>{{ row.record.id }}</td><td>{{ row.record.name }}</td><td>{{ row.record.account }}</td><td>{{ row.record.department }}</td><td>{{ row.errors.length ? row.errors.join('；') : '通过' }}</td></tr></tbody></table></div><p>确认后会一次性写入用户目录，新账号初始密码为 demo123。</p><footer><button class="button secondary" type="button" @click="userImportPreview = null">取消</button><button class="button primary" type="button" :disabled="userImportPreview.invalidCount > 0" @click="confirmUserImport">确认导入</button></footer></section>
    </BaseModal>
    <BaseModal :open="Boolean(companyLibraryEditor)" :title="companyLibraryEditor?.mode === 'create' ? '创建资料库' : '编辑资料库'" width="680px" @close="companyLibraryEditor = null">
      <form v-if="companyLibraryEditor" class="drawer-form library-settings-form company-library-settings-form" @submit.prevent="saveCompanyLibrarySettings">
        <header class="company-library-settings-intro"><i><BookOpenText :size="21" /></i><div><span>公司资料库</span><p>资料库名称、内容说明与授权范围采用和个人库一致的资料管理结构。</p></div></header>
        <div class="company-library-settings-fields"><label>资料库名称<input v-model="companyLibraryEditor.name" required maxlength="32" /></label><label>资料库简介<textarea v-model="companyLibraryEditor.description" maxlength="100" placeholder="说明资料范围和使用目的" /></label></div>
        <section class="company-library-permission-editor"><header><h3>可见范围与编辑权限</h3><p>处于可见范围内的管理员可查看并编辑该资料库；不在范围内的管理员不会看到该资料库。</p></header><div class="company-visibility-options"><label v-for="option in companyVisibilityOptions" :key="option.id" :class="{ active: companyLibraryEditor.visibilityMode === option.id }"><input v-model="companyLibraryEditor.visibilityMode" type="radio" name="company-library-visibility" :value="option.id" /><span><b>{{ option.label }}</b><small>{{ option.id === 'department' ? `当前部门：${findDepartmentEntry(companyLibraryEditor.ownerDepartmentId)?.node.name || '未设置'}` : option.detail }}</small></span></label></div><div v-if="companyLibraryEditor.visibilityMode === 'custom'" class="company-department-picker"><header><span>指定可见部门</span><small>选择上级单位时，其下级部门管理员也可查看和编辑。</small></header><div><label v-for="option in companyVisibilityDepartmentOptions" :key="option.value"><input v-model="companyLibraryEditor.departmentIds" type="checkbox" :value="option.value" /><span><b>{{ option.label }}</b><small>{{ option.detail }}</small></span></label></div></div><p class="company-library-permission-preview">{{ companyLibraryEditorDescription() }}</p></section>
        <footer><button class="button secondary" type="button" @click="companyLibraryEditor = null">取消</button><button class="button primary" type="submit">{{ companyLibraryEditor.mode === 'create' ? '创建资料库' : '保存资料库' }}</button></footer>
      </form>
    </BaseModal>
    <BaseModal :open="Boolean(departmentEditor)" :title="departmentEditorTitle" width="448px" @close="departmentEditor = null"><form v-if="departmentEditor" class="modal-form" @submit.prevent="saveDepartment"><label>部门名称<input v-model="departmentEditor.name" autofocus required maxlength="30" /></label><label v-if="departmentEditor.mode !== 'root'">上级部门<input :value="findDepartmentEntry(departmentEditor.parentId)?.node.name || departmentEditor.parentName" readonly /></label><footer><button class="button secondary" type="button" @click="departmentEditor = null">取消</button><button class="button primary" type="submit">保存</button></footer></form></BaseModal>
    <BaseModal :open="Boolean(memberAssignment)" title="添加成员" width="448px" @close="memberAssignment = null"><form v-if="memberAssignment" class="modal-form" @submit.prevent="saveMemberAssignment"><label><span>选择平台账号</span><BaseSelect v-model="memberAssignment.userId" :options="memberAssignmentOptions" aria-label="选择平台账号" /></label><footer><button class="button secondary" type="button" @click="memberAssignment = null">取消</button><button class="button primary" type="submit">确认添加</button></footer></form></BaseModal>
    <BaseModal :open="Boolean(selectedOperationRecord)" title="活动详情" width="600px" @close="selectedOperationRecord = null">
      <section v-if="selectedOperationRecord" class="operation-record-detail">
        <header><span class="operation-scope-chip" :class="`scope-${selectedOperationRecord.appKey}`">{{ selectedOperationRecord.app }}</span></header>
        <div><h3>{{ selectedOperationRecord.action }}</h3><p>{{ selectedOperationRecord.targetName }}</p></div>
        <dl><div><dt>调用时间</dt><dd>{{ selectedOperationRecord.time }}</dd></div><div><dt>用户</dt><dd>{{ selectedOperationRecord.user }} · {{ selectedOperationRecord.department }}</dd></div><div><dt>智能应用</dt><dd>{{ selectedOperationRecord.app }}</dd></div><div><dt>记录编号</dt><dd>{{ selectedOperationRecord.id }}</dd></div></dl>
      </section>
    </BaseModal>
    <BaseModal :open="operationsDefinitionOpen" title="统计口径与计算方式" width="960px" @close="operationsDefinitionOpen = false">
      <section class="operations-definition">
        <header><div><span>当前范围</span><b>{{ selectedOperationsScope.name }} · {{ selectedOperationsPeriod.name }}</b></div><p>管理员中心与驾驶舱共用以下口径；切换周期或组织时，所有概览、明细与单位对比同步更新。</p></header>
        <div class="operations-definition-groups">
          <section v-for="group in operationMetricDefinitionGroups" :key="group.id">
            <h3>{{ group.title }}</h3>
            <dl><div v-for="item in group.items" :key="item.label"><dt>{{ item.label }}</dt><dd><b>{{ item.formula }}</b><small>{{ item.detail }}</small></dd></div></dl>
          </section>
        </div>
      </section>
    </BaseModal>
    <BaseModal :open="Boolean(selectedOperationsApp)" :title="selectedOperationsApp ? `${selectedOperationsApp.name}明细` : '智能应用明细'" width="600px" @close="selectedOperationsApp = null">
      <section v-if="selectedOperationsApp" class="operation-record-detail operations-app-detail">
        <header><span class="operation-scope-chip" :class="`scope-${selectedOperationsApp.id.replace('operation-app-', '')}`">{{ selectedOperationsApp.name }}</span><span>{{ selectedOperationsPeriod.name }}</span></header>
        <div><h3>{{ selectedOperationsScope.name }} · {{ selectedOperationsApp.name }}</h3><p>数据随当前组织和统计周期同步汇总。</p></div>
        <dl><div><dt>调用次数</dt><dd>{{ formatNumber(selectedOperationsApp.calls) }} 次</dd></div><div><dt>Agent 已启动任务</dt><dd>{{ formatNumber(selectedOperationsApp.startedTasks) }} 次</dd></div><div><dt>完整任务</dt><dd>{{ formatNumber(selectedOperationsApp.completedTasks) }} 次</dd></div><div><dt>任务完成率</dt><dd>{{ formatRate(selectedOperationsApp.completionRate) }}</dd></div><div><dt>调用成功率</dt><dd>{{ formatRate(selectedOperationsApp.successRate) }}</dd></div><div><dt>平均首次响应</dt><dd>{{ selectedOperationsApp.firstResponseSeconds.toFixed(1) }} 秒</dd></div><div><dt>平均处理时间</dt><dd>{{ selectedOperationsApp.duration }}</dd></div><div><dt>当前状态</dt><dd>{{ selectedOperationsApp.processing ? `${selectedOperationsApp.processing} 项处理中` : '运行正常' }}</dd></div></dl>
      </section>
    </BaseModal>
    <BaseModal :open="Boolean(selectedOperationsOrganization)" :title="selectedOperationsOrganization ? `${selectedOperationsOrganization.name}详情` : '单位详情'" width="560px" @close="selectedOperationsOrganization = null">
      <section v-if="selectedOperationsOrganization" class="operation-record-detail operations-organization-detail">
        <header><span class="operation-scope-chip">{{ selectedOperationsOrganization.level }}</span><span>{{ selectedOperationsPeriod.name }}</span></header>
        <div><h3>{{ selectedOperationsOrganization.name }}</h3><p>当前组织范围内的单位使用情况。</p></div>
        <dl><div><dt>调用量</dt><dd>{{ formatNumber(selectedOperationsOrganization.calls) }} 次</dd></div><div><dt>Agent 已启动任务</dt><dd>{{ formatNumber(selectedOperationsOrganization.startedTasks) }} 次</dd></div><div><dt>完整任务</dt><dd>{{ formatNumber(selectedOperationsOrganization.completedTasks) }} 次</dd></div><div><dt>任务完成率</dt><dd>{{ formatRate(selectedOperationsOrganization.completionRate) }}</dd></div><div><dt>活跃用户</dt><dd>{{ formatNumber(selectedOperationsOrganization.activeUsers) }} / {{ formatNumber(selectedOperationsOrganization.registeredUsers) }} 名</dd></div><div><dt>活跃用户占比</dt><dd>{{ formatRate(selectedOperationsOrganization.activeRate) }}</dd></div></dl>
      </section>
    </BaseModal>
    <div v-if="ui.toast" class="app-toast" :class="`tone-${ui.toast.tone}`" role="status">{{ ui.toast.message }}</div>
  </section>
</template>
