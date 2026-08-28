export const operationMetricDefinitionGroups = [
  {
    id: 'scope',
    title: '统计范围',
    items: [
      { label: '统计周期', formula: '按“今日、近 30 天、近 90 天、本年度”筛选事件发生时间。', detail: '今日与前一自然日比较；近 30 天与前 30 天比较；近 90 天与前 90 天比较；本年度与上年同期比较。' },
      { label: '组织范围', formula: '按所选组织及其下级单位汇总；全集团覆盖全部纳入统计的二级、三级单位。', detail: '同一事件只归属一个最明细组织，上级汇总时不重复计数。' },
      { label: '空值与零分母', formula: '计数类无记录时显示 0；比率类分母为 0 时显示“—”。', detail: '不使用 0% 代替无法计算的比率。' },
    ],
  },
  {
    id: 'overview',
    title: '运营概览',
    items: [
      { label: '调用总量', formula: '统计周期内智能应用调用请求数。', detail: '用户每发起一次调用计 1 次；成功、失败、超时和中止均计入。' },
      { label: '成功调用数', formula: '调用结果状态为“成功”的调用请求数。', detail: '仅完成系统调用并返回成功状态的请求计入。' },
      { label: '未成功调用数', formula: '调用总量 − 成功调用数。', detail: '包括失败、超时和中止的调用。' },
      { label: '调用成功率', formula: '成功调用数 ÷ 调用总量 × 100%。', detail: '仅统计当前周期和组织范围。' },
      { label: '平均首次响应', formula: '首次系统响应耗时之和 ÷ 已获得首次响应的调用数。', detail: '首次响应耗时 = 首次响应时间 − 请求时间；不包含人工停留时长。' },
      { label: '调用次数趋势', formula: '以当前周期各时间段的调用量为基础绘制变化趋势。', detail: '今日保留 6 个时段节点；近 30 天每 5 个自然日统计为一段，共展示 6 个节点，各点为对应五日区间的日均调用次数；近 90 天按约半月统计，保留起始边界及各月月中、月末，共展示 7 个区间调用量节点；本年度按自然月统计，共展示 12 个月度调用量节点。' },
    ],
  },
  {
    id: 'tasks',
    title: '任务与成果',
    items: [
      { label: 'Agent 已启动任务数', formula: '用户提交输入且 Agent 已开始执行的任务运行次数。', detail: '同一任务重新运行会新增 1 次；尚未启动的草稿不计入。' },
      { label: '创建任务数', formula: '统计周期内成功保存的任务记录数。', detail: '一条任务记录可以启动多次，因此不作为任务完成率分母。' },
      { label: '完整任务数', formula: '已启动并走完全部流程、产生最终输出的任务运行次数。', detail: '中断、暂停、退出或没有最终输出均不计为完整任务。' },
      { label: '任务完成率', formula: '完整任务数 ÷ Agent 已启动任务数 × 100%。', detail: '驾驶舱、管理员概览、单应用性能和单位对比统一使用该公式。' },
      { label: '报告生成数', formula: '成功生成并保存的报告文件数。', detail: '生成失败、预览内容和未保存草稿不计入。' },
    ],
  },
  {
    id: 'users',
    title: '用户活跃',
    items: [
      { label: '活跃用户数', formula: '统计周期内至少发生 1 次有效行为的去重用户数。', detail: '有效行为包括登录、调用应用、发起任务、查询或查看历史记录；同一用户在周期内只计 1 人。' },
      { label: '注册用户数', formula: '当前组织范围内已登记的平台用户账号数。', detail: '排除已删除的系统或测试账号，作为活跃率与用户均调用频次的统一分母。' },
      { label: '用户活跃率', formula: '活跃用户数 ÷ 注册用户数 × 100%。', detail: '卡片展示整个周期的人数；趋势展示各时间段人数，不将各段人数直接相加作为周期总数。' },
      { label: '用户均调用频次', formula: '调用总量 ÷ 注册用户数。', detail: '分母使用当前组织范围注册用户总数，不使用活跃用户数。' },
      { label: '登录次数', formula: '统计周期内成功登录平台的事件数。', detail: '失败登录保留在系统日志中，不计入登录次数。' },
    ],
  },
  {
    id: 'performance',
    title: '单应用性能',
    items: [
      { label: '单应用调用量', formula: '当前范围内该智能应用的调用请求数。', detail: '成功与未成功调用均计入。' },
      { label: '单应用完整任务数', formula: '该智能应用已启动并产生最终输出的任务运行次数。', detail: '不再使用“形成成果数”代替完整任务数。' },
      { label: '单应用任务完成率', formula: '该智能应用完整任务数 ÷ 该智能应用 Agent 已启动任务数 × 100%。', detail: '每项智能应用独立计算。' },
      { label: '单应用平均首次响应', formula: '该智能应用首次响应耗时之和 ÷ 已获得首次响应的调用数。', detail: '越短表示首次响应越快。' },
      { label: '单应用平均处理时间', formula: '该智能应用完整任务处理耗时之和 ÷ 完整任务数。', detail: '任务处理耗时从 Agent 启动计算至最终输出生成。' },
      { label: '单应用调用成功率', formula: '该智能应用成功调用数 ÷ 该智能应用调用量 × 100%。', detail: '不使用任务完成率或报告生成率代替。' },
      { label: '运行状态与处理中任务', formula: '运行状态取当前服务快照；处理中任务数取当前未结束的任务运行数。', detail: '两项均为当前时点状态，不随统计周期累计。' },
    ],
  },
  {
    id: 'comparison',
    title: '趋势与单位对比',
    items: [
      { label: '活跃用户趋势', formula: '按当前周期的各时间段统计发生有效行为的用户数。', detail: '同一用户可以出现在不同时间段，但整个周期的活跃用户总数仍按用户统计，不重复累计。' },
      { label: '单位调用量', formula: '当前周期内归属该单位及其下级单位的调用请求数。', detail: '单位对比与运营概览使用同一周期缩放和组织归属规则。' },
      { label: '单位任务完成率', formula: '该单位完整任务数 ÷ 该单位 Agent 已启动任务数 × 100%。', detail: '纵轴越高表示任务闭环比例越高。' },
      { label: '单位用户活跃度', formula: '该单位活跃用户数 ÷ 该单位注册用户数 × 100%。', detail: '紫色柱使用右侧百分比刻度，表示当前周期内的用户活跃覆盖情况。' },
      { label: '各级单位使用对比', formula: '红色柱展示 Agent 调用量，紫色柱展示用户活跃度。', detail: '统计周期和组织范围跟随驾驶舱顶部全局筛选；全集团展示二级单位及代表性三级单位，选择具体单位后自动展示对应下属单位。' },
    ],
  },
  {
    id: 'records',
    title: '活动记录',
    items: [
      { label: '单用户调用次数', formula: '当前记录范围内该用户的智能应用调用事件数。', detail: '每条调用记录计 1 次。' },
      { label: '使用过的智能应用', formula: '当前记录范围内该用户调用过的智能应用去重集合。', detail: '同一应用多次调用只列 1 次。' },
      { label: '最近活跃时间', formula: '当前记录范围内该用户最后一条有效行为的发生时间。', detail: '没有有效行为时不生成用户活动行。' },
    ],
  },
]

export function clampMetric(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function calculateMetricRate(numerator, denominator) {
  return denominator > 0 ? numerator / denominator * 100 : null
}

export function distributeMetricTotal(total, weights) {
  const normalizedWeights = weights.map((weight) => Math.max(0, Number(weight) || 0))
  const weightTotal = Math.max(normalizedWeights.reduce((sum, weight) => sum + weight, 0), 1)
  const rawValues = normalizedWeights.map((weight) => total * weight / weightTotal)
  const values = rawValues.map((value) => Math.floor(value))
  const remainder = Math.max(0, total - values.reduce((sum, value) => sum + value, 0))

  rawValues
    .map((value, index) => ({ index, fraction: value - values[index] }))
    .sort((first, second) => second.fraction - first.fraction || first.index - second.index)
    .slice(0, remainder)
    .forEach(({ index }) => { values[index] += 1 })

  return values
}

export function buildScopeMetricSnapshot(scope, period) {
  const countScale = period?.scale ?? 1
  const userScale = period?.userScale ?? 1
  const completionShift = period?.completionShift ?? 0
  const calls = Math.max(0, Math.round(scope.calls * countScale))
  const startedTasks = Math.max(0, Math.round(scope.starts * countScale))
  const createdTasks = Math.max(0, Math.round(scope.tasks * countScale))
  const baseCompletionRate = calculateMetricRate(scope.completedTasks, scope.starts) ?? 0
  const completionRate = clampMetric(baseCompletionRate + completionShift, 0, 100)
  const completedTasks = Math.min(startedTasks, Math.max(0, Math.round(startedTasks * completionRate / 100)))
  const successfulCalls = Math.min(calls, Math.max(0, Math.round(scope.successfulCalls * countScale)))
  const failedCalls = Math.max(0, calls - successfulCalls)
  const activeUsers = Math.min(scope.registeredUsers, Math.max(0, Math.round(scope.activeUsers * userScale)))
  const registeredUsers = Math.max(0, scope.registeredUsers)

  return {
    calls,
    successfulCalls,
    failedCalls,
    callSuccessRate: calculateMetricRate(successfulCalls, calls),
    startedTasks,
    createdTasks,
    completedTasks,
    completionRate,
    reports: Math.max(0, Math.round(scope.reports * countScale)),
    reviews: Math.max(0, Math.round(scope.reviews * countScale)),
    activeUsers,
    registeredUsers,
    activeRate: calculateMetricRate(activeUsers, registeredUsers),
    perUserCallFrequency: registeredUsers > 0 ? calls / registeredUsers : null,
    loginCount: Math.max(0, Math.round(scope.historicalLogins * countScale)),
    firstResponseSeconds: scope.firstResponseSeconds,
    responseSeconds: scope.responseSeconds,
  }
}

export function buildApplicationMetricRows({ apps, snapshot, profile, scopeShare = 1 }) {
  const callMix = profile?.callMix || apps.map(() => 1)
  const completionDelta = profile?.completionDelta || apps.map(() => 0)
  const durationScale = profile?.durationScale || apps.map(() => 1)
  const callsByApp = distributeMetricTotal(snapshot.calls, apps.map((app, index) => app.calls * callMix[index]))
  const startedByApp = distributeMetricTotal(snapshot.startedTasks, apps.map((app, index) => app.startedTasks * callMix[index]))
  const incompleteByApp = distributeMetricTotal(
    Math.max(0, snapshot.startedTasks - snapshot.completedTasks),
    apps.map((app, index) => Math.max(1, app.startedTasks - app.completedTasks) * Math.max(.2, 1 - completionDelta[index] * .2)),
  )
  const failedByApp = distributeMetricTotal(
    snapshot.failedCalls,
    apps.map((app, index) => Math.max(1, app.calls - app.successfulCalls) * callMix[index]),
  )

  return apps.map((app, index) => {
    const calls = callsByApp[index]
    const startedTasks = startedByApp[index]
    const completedTasks = Math.max(0, startedTasks - Math.min(startedTasks, incompleteByApp[index]))
    const successfulCalls = Math.max(0, calls - Math.min(calls, failedByApp[index]))

    return {
      ...app,
      calls,
      startedTasks,
      completedTasks,
      successfulCalls,
      failedCalls: Math.max(0, calls - successfulCalls),
      completionRate: calculateMetricRate(completedTasks, startedTasks),
      successRate: calculateMetricRate(successfulCalls, calls),
      firstResponseSeconds: Math.round(app.firstResponseSeconds * durationScale[index] * 10) / 10,
      processing: Math.max(0, Math.round(app.processing * scopeShare * callMix[index])),
      historicSuccess: Math.max(0, Math.round(app.historicSuccess * scopeShare * callMix[index])),
      historicFailure: Math.max(0, Math.round(app.historicFailure * scopeShare * callMix[index])),
    }
  })
}

export function comparisonTertiarySources(scopes, limit = 10) {
  const rows = []
  const childCount = Math.max(...scopes.map((scope) => scope.children.length), 0)

  for (let childIndex = 0; childIndex < childCount && rows.length < limit; childIndex += 1) {
    scopes.forEach((scope) => {
      const child = scope.children[childIndex]
      if (child && rows.length < limit) rows.push({ ...child, parentName: scope.name })
    })
  }

  return rows
}

export function buildComparisonMetricUnit(unit, period) {
  const countScale = period?.scale ?? 1
  const userScale = period?.userScale ?? 1
  const completionShift = period?.completionShift ?? 0
  const calls = Math.max(1, Math.round(unit.calls * countScale))
  const startedTasks = Math.max(1, Math.round(unit.startedTasks * countScale))
  const baseCompletionRate = calculateMetricRate(unit.completedTasks, unit.startedTasks) ?? 0
  const completionRate = clampMetric(baseCompletionRate + completionShift, 0, 100)
  const completedTasks = Math.min(startedTasks, Math.max(0, Math.round(startedTasks * completionRate / 100)))
  const registeredUsers = Math.max(unit.registeredUsers, 1)
  const activeUsers = Math.min(registeredUsers, Math.max(1, Math.round(unit.activeUsers * userScale)))

  return {
    ...unit,
    calls,
    startedTasks,
    completedTasks,
    completionRate: calculateMetricRate(completedTasks, startedTasks) ?? 0,
    activeUsers,
    registeredUsers,
    activeRate: calculateMetricRate(activeUsers, registeredUsers) ?? 0,
  }
}
