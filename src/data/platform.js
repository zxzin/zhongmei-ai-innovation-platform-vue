export const sourceCatalog = {
  专利: [
    { id: 'CN120428713A', type: '专利', title: '一种煤矿井下智能巡检机器人多模态协同控制系统', owner: '中煤科工集团', date: '2026-07-26', source: '专利数据服务', relevance: 92, summary: '公开多传感器融合、断网协同和巡检任务降级控制方法。', images: 4 },
    { id: 'CN118762905A', type: '专利', title: '井下复杂环境机器人自主定位与障碍识别方法', owner: '中国矿业大学', date: '2025-11-08', source: '专利数据服务', relevance: 88, summary: '提出弱光、粉尘条件下的激光雷达与视觉联合定位方案。', images: 6 },
  ],
  论文: [
    { id: 'DOI:10.3390/s22114051', type: '论文', title: '地下煤矿作业自主移动机器人可通行区域识别方法', owner: 'International Journal of Mining Science', date: '2026-06-18', source: '论文数据库', relevance: 87, summary: '研究地下煤矿场景中可通行区域识别、定位漂移和安全冗余。' },
    { id: 'DOI:10.1016/j.robot.2025.104812', type: '论文', title: 'Multi-modal perception for autonomous inspection in underground mines', owner: 'Robotics and Autonomous Systems', date: '2025-09-02', source: '论文数据库', relevance: 84, summary: '比较视觉、激光雷达、热成像在井下巡检中的适用条件。' },
  ],
  政策: [
    { id: '矿安〔2024〕42号', type: '政策', title: '关于深入推进矿山智能化建设促进矿山安全发展的指导意见', owner: '国家矿山安全监察局', date: '2024-04-28', source: '政策法规库', relevance: 82, summary: '明确矿山智能化建设、无人巡检和安全生产的政策方向。' },
    { id: '发改能源〔2025〕18号', type: '政策', title: '煤矿智能化标准体系建设指南', owner: '国家发展改革委', date: '2025-02-17', source: '政策法规库', relevance: 76, summary: '给出煤矿智能化系统建设、验收和数据治理要求。' },
  ],
  内部资料: [
    { id: 'KB-CM-2026-017', type: '内部资料', title: '井下巡检机器人现场试验记录（第三阶段）', owner: '技术研发部', date: '2026-08-11', source: '公司知识库', relevance: 95, scope: '公司', summary: '包含粉尘、低照度和通信中断工况下的现场试验数据。' },
    { id: 'KB-P-2026-006', type: '内部资料', title: '多传感器选型与可靠性验证笔记', owner: '徐博', date: '2026-08-05', source: '个人知识库', relevance: 86, scope: '个人', summary: '整理传感器选型、故障模式和验证指标。' },
  ],
}

export const personalLibraries = [
  { id: 'PKB-01', owner: 'User', name: '井下智能装备研究', description: '巡检机器人、传感器与协同控制资料', updated: '2026-08-24 09:42', access: '仅本人' },
  { id: 'PKB-02', owner: 'User', name: '矿井水资源化', description: '水处理技术路线、论文与项目材料', updated: '2026-08-23 16:18', access: '仅本人' },
  { id: 'PKB-03', owner: 'User', name: '待整理资料', description: '临时上传、尚未归档的工作文件', updated: '2026-08-18 11:20', access: '仅本人' },
  { id: 'PKB-A-01', owner: 'Admin', name: '科研管理资料', description: '课题立项、过程管理与验收归档资料', updated: '2026-08-24 08:36', access: '仅本人' },
  { id: 'PKB-A-02', owner: 'Admin', name: '创新评价参考', description: '评价规则、复核案例与支撑材料', updated: '2026-08-21 15:10', access: '仅本人' },
]

export const companyLibraries = [
  { id: 'CKB-01', name: '集团技术标准库', description: '集团级技术标准、制度与统一模板', updated: '2026-08-25 08:30' },
  { id: 'CKB-02', name: '深圳院项目成果库', description: '项目报告、验收材料与成果归档', updated: '2026-08-24 18:02' },
  { id: 'CKB-03', name: '智能矿山案例库', description: '已验证方案、现场案例与复盘记录', updated: '2026-08-18 15:44' },
]

// 公司知识库本地演示文件：用于呈现文件列表、上传和权限管理流程，不代表已接入企业文档服务。
export const companyLibraryFiles = [
  { id: 'CKB-DOC-001', libraryId: 'CKB-01', name: '集团技术标准编制与管理办法（2026版）.pdf', type: 'PDF', size: '2.6 MB', source: '制度文件', updated: '2026-08-25 08:30', status: '可检索' },
  { id: 'CKB-DOC-002', libraryId: 'CKB-01', name: '科研项目技术报告统一模板.docx', type: 'Word', size: '1.2 MB', source: '模板文件', updated: '2026-08-23 15:46', status: '可检索' },
  { id: 'CKB-DOC-003', libraryId: 'CKB-01', name: '技术标准执行检查清单.xlsx', type: 'Excel', size: '680 KB', source: '管理资料', updated: '2026-08-20 10:12', status: '解析完成' },
  { id: 'CKB-DOC-004', libraryId: 'CKB-02', name: '井下智能巡检机器人项目验收报告.pdf', type: 'PDF', size: '8.4 MB', source: '项目归档', updated: '2026-08-24 18:02', status: '可检索' },
  { id: 'CKB-DOC-005', libraryId: 'CKB-02', name: '矿井水资源化阶段成果汇编.docx', type: 'Word', size: '4.7 MB', source: '项目归档', updated: '2026-08-19 16:28', status: '可检索' },
  { id: 'CKB-DOC-006', libraryId: 'CKB-03', name: '智能矿山边缘巡检方案复盘.pdf', type: 'PDF', size: '5.1 MB', source: '现场案例', updated: '2026-08-18 15:44', status: '可检索' },
  { id: 'CKB-DOC-007', libraryId: 'CKB-03', name: '皮带机智能巡检故障处置记录.xlsx', type: 'Excel', size: '920 KB', source: '现场案例', updated: '2026-08-16 14:06', status: '解析完成' },
]

export const libraryFiles = [
  { id: 'DOC-260818-021', owner: 'User', libraryId: 'PKB-01', name: '复杂煤矿环境智能巡检机器人项目建议书.docx', type: 'Word', size: '3.8 MB', source: '个人上传', updated: '2026-08-24 09:42', status: '可检索' },
  { id: 'DOC-260817-019', owner: 'User', libraryId: 'PKB-01', name: '第三阶段井下现场试验数据.xlsx', type: 'Excel', size: '6.1 MB', source: '项目资料', updated: '2026-08-23 16:18', status: '可检索' },
  { id: 'DOC-260816-014', owner: 'User', libraryId: 'PKB-02', name: '多模态感知技术路线调研.pdf', type: 'PDF', size: '11.4 MB', source: '个人上传', updated: '2026-08-18 11:20', status: '解析完成' },
  { id: 'DOC-260812-007', owner: 'User', libraryId: 'PKB-02', name: '矿井水深度处理工艺比选.pdf', type: 'PDF', size: '4.2 MB', source: '个人上传', updated: '2026-08-12 14:06', status: '可检索' },
  { id: 'DOC-A-260820-003', owner: 'Admin', libraryId: 'PKB-A-01', name: '科研项目过程管理指引.docx', type: 'Word', size: '2.1 MB', source: '个人上传', updated: '2026-08-24 08:36', status: '可检索' },
  { id: 'DOC-A-260817-010', owner: 'Admin', libraryId: 'PKB-A-02', name: '创新评价复核案例汇编.pdf', type: 'PDF', size: '5.7 MB', source: '个人上传', updated: '2026-08-21 15:10', status: '解析完成' },
]

export const recycledFiles = [
  { id: 'DOC-260710-004', owner: 'User', libraryId: 'PKB-01', name: '巡检方案旧版草稿.docx', type: 'Word', size: '1.9 MB', source: '个人上传', deleted: '2026-08-17 14:20', expires: '剩余 27 天' },
  { id: 'DOC-260622-011', owner: 'User', libraryId: 'PKB-01', name: '传感器供应商参数汇总.xlsx', type: 'Excel', size: '2.4 MB', source: '项目资料', deleted: '2026-08-12 09:36', expires: '剩余 22 天' },
  { id: 'DOC-A-260809-002', owner: 'Admin', libraryId: 'PKB-A-01', name: '项目验收材料旧版.docx', type: 'Word', size: '2.8 MB', source: '个人上传', deleted: '2026-08-09 10:24', expires: '剩余 19 天' },
]

export const recycledPersonalLibraries = [
  { id: 'PKB-REC-01', owner: 'User', name: '运输设备调研', description: '已归档的设备调研与会议纪要', updated: '2026-08-07 11:42', access: '仅本人', deleted: '2026-08-19 10:16', expires: '剩余 29 天' },
  { id: 'PKB-A-REC-01', owner: 'Admin', name: '旧版管理制度', description: '已替换的科研管理制度资料', updated: '2026-07-28 16:05', access: '仅本人', deleted: '2026-08-16 15:08', expires: '剩余 26 天' },
]

export const departmentTree = [
  { name: '中煤集团', count: 157, children: [
    { name: '中煤深圳研究院', count: 63, children: [{ name: '科研管理部', count: 14 }, { name: '技术研发部', count: 31 }, { name: '专家委员会', count: 17 }, { name: '科技发展部', count: 1 }] },
    { name: '煤矿智能化公司', count: 48, children: [{ name: '产品研发部', count: 28 }, { name: '工程验证部', count: 20 }] },
    { name: '装备技术公司', count: 46, children: [{ name: '智能装备部', count: 26 }, { name: '安全技术部', count: 20 }] },
  ] },
]

export const systemLogs = [
  { id: 'LOG-260821-0912', type: '登录日志', scope: '账户与权限', scopeKey: 'account', user: '张三', department: '科研管理部', action: '登录管理中心', target: '管理中心', targetName: '管理中心', time: '2026-08-21 09:12:18', result: '成功' },
  { id: 'LOG-260821-0844', type: '操作日志', scope: '创新性分析', scopeKey: 'innovation', user: '徐博', department: '技术研发部', action: '生成创新性分析报告', target: 'TASK-260818-021', targetName: '复杂煤矿环境下智能巡检机器人关键技术研究', time: '2026-08-21 08:44:09', result: '成功' },
  { id: 'LOG-260820-1736', type: '操作日志', scope: '个人知识库', scopeKey: 'knowledge', user: '王工', department: '技术研发部', action: '上传个人知识库文件', target: 'PKB-02', targetName: '井下水资源化项目资料', time: '2026-08-20 17:36:42', result: '成功' },
  { id: 'LOG-260820-1618', type: '登录日志', scope: '账户与权限', scopeKey: 'account', user: '陈研', department: '科技发展部', action: '登录管理中心', target: '管理中心', targetName: '管理中心', time: '2026-08-20 16:18:03', result: '失败' },
  { id: 'LOG-260819-1520', type: '操作日志', scope: '语义检索', scopeKey: 'semantic', user: '陈研', department: '科技发展部', action: '完成煤岩识别技术路线检索', target: 'TASK-260818-019', targetName: '煤岩识别技术路线专利与论文检索', time: '2026-08-19 15:20:36', result: '成功' },
  { id: 'LOG-260819-1446', type: '操作日志', scope: '技术问答', scopeKey: 'qa', user: '王工', department: '技术研发部', action: '提交技术问答请求', target: 'TASK-260818-020', targetName: '高矿化度矿井水资源化利用关键约束', time: '2026-08-19 14:46:12', result: '成功' },
  { id: 'LOG-260818-1608', type: '操作日志', scope: '模板管理', scopeKey: 'template', user: '张三', department: '科研管理部', action: '发布创新性分析评价模板', target: 'TPL-01', targetName: '创新性分析评价模板 V2.3', time: '2026-08-18 16:08:44', result: '成功' },
  { id: 'LOG-260818-1005', type: '操作日志', scope: '可行性分析', scopeKey: 'feasibility', user: '李专家', department: '专家委员会', action: '生成工程可行性报告', target: 'TASK-260817-017', targetName: '井下多模态巡检方案工程可行性', time: '2026-08-18 10:05:28', result: '成功' },
]

// 操作记录本地演示数据：仅包含六项智能应用调用，不代表生产审计记录。
export const operationRecords = [
  { id: 'CALL-260821-0844', app: '创新性分析', appKey: 'innovation', user: '徐博', department: '技术研发部', action: '调用创新性分析', targetName: '复杂煤矿环境下智能巡检机器人关键技术研究', time: '2026-08-21 08:44:09' },
  { id: 'CALL-260820-1518', app: '语义检索', appKey: 'semantic', user: '陈研', department: '科技发展部', action: '调用语义检索', targetName: '煤岩识别技术路线专利与论文检索', time: '2026-08-20 15:18:36' },
  { id: 'CALL-260820-1446', app: '技术问答', appKey: 'qa', user: '王工', department: '技术研发部', action: '调用技术问答', targetName: '高矿化度矿井水资源化利用关键约束', time: '2026-08-20 14:46:12' },
  { id: 'CALL-260819-1610', app: '技术预研报告', appKey: 'research', user: '王工', department: '技术研发部', action: '调用技术预研报告', targetName: '矿井水资源化利用技术路线预研', time: '2026-08-19 16:10:25' },
  { id: 'CALL-260819-1005', app: '可行性分析', appKey: 'feasibility', user: '李专家', department: '专家委员会', action: '调用可行性分析', targetName: '井下多模态巡检方案工程可行性', time: '2026-08-19 10:05:28' },
  { id: 'CALL-260818-1542', app: '技术交底书撰写', appKey: 'disclosure', user: '张三', department: '科研管理部', action: '调用技术交底书撰写', targetName: '智能巡检机器人关键技术交底书', time: '2026-08-18 15:42:51' },
]

export const operationsLoginTrend = [
  { label: '02月', value: 74 }, { label: '03月', value: 91 }, { label: '04月', value: 112 },
  { label: '05月', value: 129 }, { label: '06月', value: 154 }, { label: '07月', value: 198 },
  { label: '08月', value: 253 },
]

// 单应用演示数据：调用、任务和成功结果使用独立字段，避免用“成果数 ÷ 调用量”代替任务完成率。
export const appPerformance = [
  { name: '语义检索', calls: 204, successfulCalls: 200, startedTasks: 216, completedTasks: 202, duration: '42 秒', firstResponseSeconds: 1.2, online: 1, processing: 3, historicSuccess: 528, historicFailure: 9 },
  { name: '技术问答', calls: 159, successfulCalls: 157, startedTasks: 168, completedTasks: 158, duration: '18 秒', firstResponseSeconds: 0.9, online: 1, processing: 2, historicSuccess: 412, historicFailure: 4 },
  { name: '技术预研报告', calls: 86, successfulCalls: 82, startedTasks: 91, completedTasks: 78, duration: '8 分 12 秒', firstResponseSeconds: 3.4, online: 1, processing: 4, historicSuccess: 214, historicFailure: 10 },
  { name: '创新性分析', calls: 80, successfulCalls: 75, startedTasks: 85, completedTasks: 68, duration: '11 分 34 秒', firstResponseSeconds: 4.6, online: 1, processing: 3, historicSuccess: 195, historicFailure: 11 },
  { name: '可行性分析', calls: 73, successfulCalls: 71, startedTasks: 77, completedTasks: 65, duration: '6 分 08 秒', firstResponseSeconds: 3.7, online: 1, processing: 2, historicSuccess: 180, historicFailure: 6 },
  { name: '技术交底书撰写', calls: 60, successfulCalls: 56, startedTasks: 63, completedTasks: 58, duration: '7 分 21 秒', firstResponseSeconds: 4.1, online: 1, processing: 3, historicSuccess: 153, historicFailure: 10 },
]

// 驾驶舱本地演示的组织视图参数：仅用于让不同组织范围呈现可解释的应用结构差异，不代表实时性能接口。
export const cockpitAppScopeProfiles = {
  group: {
    callMix: [1, 1, 1, 1, 1, 1],
    completionDelta: [0, 0, 0, 0, 0, 0],
    durationScale: [1, 1, 1, 1, 1, 1],
  },
  shenzhen: {
    callMix: [.93, 1.15, .98, 1.05, .92, .88],
    completionDelta: [.2, .1, -.3, .2, .1, -.1],
    durationScale: [1.03, .92, 1.08, 1.03, .96, 1.04],
  },
  'intelligent-mine': {
    callMix: [1.13, 1.1, .82, .75, 1.25, .92],
    completionDelta: [.1, .2, -.4, -.3, .3, -.2],
    durationScale: [.94, .9, .96, .94, .88, 1.02],
  },
  equipment: {
    callMix: [.88, .84, 1.21, 1.23, .94, 1.12],
    completionDelta: [-.2, -.1, .3, .4, -.2, .2],
    durationScale: [1.07, 1.04, .95, .96, 1.06, .91],
  },
}

function buildCockpitTrend(labels, calls, activeUsers) {
  return labels.map((label, index) => {
    const labelFields = typeof label === 'string' ? { label } : label
    const callCount = calls[index]
    return {
      ...labelFields,
      calls: callCount,
      results: Math.max(0, callCount - Math.max(1, Math.round(callCount * .035))),
      activeUsers: activeUsers[index],
    }
  })
}

const cockpitMonthTrend = buildCockpitTrend(
  Array.from({ length: 30 }, (_, index) => {
    const day = index + 1
    const label = `${String(day).padStart(2, '0')}日`
    return { label, axisLabel: day === 1 || day === 5 || day % 5 === 0 ? label : '' }
  }),
  [136, 152, 147, 165, 158, 174, 149, 181, 169, 188, 161, 179, 154, 193, 171, 202, 176, 189, 168, 211, 184, 218, 179, 224, 196, 207, 187, 231, 203, 219],
  [19, 20, 20, 21, 22, 21, 23, 22, 23, 24, 23, 25, 24, 26, 25, 27, 26, 28, 27, 28, 29, 28, 30, 29, 31, 32, 30, 33, 34, 35],
)

const cockpitQuarterTrend = buildCockpitTrend(
  [
    '05月末', '06月中', '06月末', '07月中', '07月末', '08月中', '08月末',
  ],
  [118, 129, 139, 146, 155, 160, 167],
  [75, 77, 83, 87, 92, 95, 100],
)

const cockpitYearTrend = buildCockpitTrend(
  ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
  [31, 37, 46, 59, 75, 89, 105, 133, 148, 156, 169, 183],
  [50, 55, 64, 75, 87, 98, 111, 123, 130, 137, 143, 149],
)

// 驾驶舱本地演示汇总：字段结构对应后续运营统计接口，不代表实时生产数据。trend.calls 为发起调用总量，包含成功、失败、超时和中止的调用；trend.results 仅统计成功形成的结果；activeUsers 为对应时间分段内发生有效行为的去重用户数；axisLabel 控制稀疏横轴标签，不改变实际统计节点数量。
export const cockpitPeriods = [
  {
    id: 'day', name: '今日', label: '2026年08月24日', scale: 15 / 662, userScale: 0.19, completionShift: -1.2, dayCount: 1,
    comparisonLabel: '较昨日', comparison: { calls: '+6.4%', completion: '+0.7%', response: '-8.2%', logins: '+2.6%' },
    trend: [
      { label: '09时', calls: 2, results: 2, activeUsers: 6 }, { label: '11时', calls: 2, results: 2, activeUsers: 9 },
      { label: '13时', calls: 3, results: 3, activeUsers: 12 }, { label: '15时', calls: 3, results: 3, activeUsers: 16 },
      { label: '17时', calls: 2, results: 2, activeUsers: 20 }, { label: '19时', calls: 3, results: 3, activeUsers: 24 },
    ],
  },
  {
    id: 'year', name: '本年度', label: '2026年01月—12月', scale: 1, userScale: 1, completionShift: 2.7, activeDays: 8.6, dayCount: 365,
    comparisonLabel: '较上年同期', comparison: { calls: '+24.7%', completion: '+2.6%', response: '-11.3%', logins: '+17.8%' },
    trend: cockpitYearTrend,
  },
  {
    id: 'quarter', name: '近 90 天', label: '2026年06月—08月', scale: 417 / 662, userScale: 0.79, completionShift: 1.4, activeDays: 4.8, dayCount: 90,
    comparisonLabel: '较上一季度', comparison: { calls: '+18.2%', completion: '+1.9%', response: '-9.4%', logins: '+12.1%' },
    trend: cockpitQuarterTrend,
  },
  {
    id: 'month', name: '近 30 天', label: '2026年08月', scale: 160 / 662, userScale: 0.56, completionShift: 0, activeDays: 2.1, dayCount: 30,
    comparisonLabel: '较上月', comparison: { calls: '+12.6%', completion: '+1.4%', response: '-6.9%', logins: '+8.3%' },
    trend: cockpitMonthTrend,
  },
]

export const cockpitScopes = [
  {
    id: 'group', name: '全集团', calls: 19860, successfulCalls: 19230, starts: 700, tasks: 649, completedTasks: 629,
    reports: 295, reviews: 59, activeUsers: 126, registeredUsers: 183, historicalLogins: 1011, firstResponseSeconds: 2.7, responseSeconds: 156,
    children: [
      { name: '中煤深圳研究院', calls: 7470, tasks: 244, reports: 114, users: 47 },
      { name: '煤矿智能化公司', calls: 6660, tasks: 217, reports: 98, users: 42 },
      { name: '装备技术公司', calls: 5730, tasks: 188, reports: 83, users: 37 },
    ],
  },
  {
    id: 'shenzhen', name: '中煤深圳研究院', calls: 7470, successfulCalls: 7230, starts: 263, tasks: 244, completedTasks: 237,
    reports: 114, reviews: 24, activeUsers: 47, registeredUsers: 66, historicalLogins: 374, firstResponseSeconds: 2.7, responseSeconds: 176,
    children: [
      { name: '深圳科创服务公司', calls: 2370, tasks: 77, completedTasks: 75, reports: 35, users: 13, registeredUsers: 20 },
      { name: '深圳数字技术公司', calls: 3360, tasks: 110, completedTasks: 107, reports: 49, users: 22, registeredUsers: 28 },
      { name: '深圳工程技术公司', calls: 1740, tasks: 57, completedTasks: 55, reports: 30, users: 12, registeredUsers: 18 },
    ],
  },
  {
    id: 'intelligent-mine', name: '煤矿智能化公司', calls: 6660, successfulCalls: 6450, starts: 235, tasks: 217, completedTasks: 210,
    reports: 98, reviews: 15, activeUsers: 42, registeredUsers: 61, historicalLogins: 336, firstResponseSeconds: 2.4, responseSeconds: 148,
    children: [
      { name: '煤矿智能装备公司', calls: 2520, tasks: 82, completedTasks: 79, reports: 37, users: 16, registeredUsers: 20 },
      { name: '煤矿智能软件公司', calls: 2340, tasks: 76, completedTasks: 74, reports: 34, users: 15, registeredUsers: 22 },
      { name: '煤矿智能运维公司', calls: 1800, tasks: 59, completedTasks: 57, reports: 27, users: 11, registeredUsers: 19 },
    ],
  },
  {
    id: 'equipment', name: '装备技术公司', calls: 5730, successfulCalls: 5550, starts: 202, tasks: 188, completedTasks: 182,
    reports: 83, reviews: 20, activeUsers: 37, registeredUsers: 56, historicalLogins: 301, firstResponseSeconds: 2.9, responseSeconds: 203,
    children: [
      { name: '装备制造公司', calls: 2160, tasks: 71, completedTasks: 69, reports: 31, users: 14, registeredUsers: 20 },
      { name: '装备服务公司', calls: 1950, tasks: 64, completedTasks: 63, reports: 28, users: 13, registeredUsers: 18 },
      { name: '装备检测公司', calls: 1620, tasks: 53, completedTasks: 50, reports: 24, users: 10, registeredUsers: 18 },
    ],
  },
]

const cockpitComparisonPalette = ['#45c9f0', '#55d9b8', '#8ea9f4', '#eab666', '#bf93eb', '#ea7f9a', '#70b8f0', '#79c68c', '#d18dce', '#e89158']

const cockpitComparisonScopeSeeds = [
  {
    id: 'comparison-shenzhen',
    name: '中煤深圳研究院',
    children: [
      ['深圳科创服务公司', 54, 50, 47, 16, 22],
      ['深圳数字技术公司', 68, 62, 58, 14, 19],
      ['深圳工程技术公司', 37, 34, 31, 8, 11],
      ['深圳智能控制公司', 48, 45, 43, 12, 16],
      ['深圳材料技术公司', 31, 28, 25, 7, 10],
      ['深圳信息服务公司', 42, 38, 36, 10, 13],
      ['深圳成果转化公司', 26, 24, 22, 6, 8],
      ['深圳数据服务公司', 38, 34, 31, 9, 13],
      ['深圳实验验证公司', 29, 27, 26, 8, 10],
      ['深圳项目管理公司', 23, 21, 20, 9, 13],
    ],
  },
  {
    id: 'comparison-intelligent-mine',
    name: '煤矿智能化公司',
    children: [
      ['煤矿智能装备公司', 48, 45, 41, 8, 16],
      ['煤矿智能软件公司', 44, 40, 36, 7, 15],
      ['煤矿智能运维公司', 39, 35, 32, 6, 13],
      ['煤矿智能感知公司', 32, 29, 26, 5, 12],
      ['煤矿智能控制公司', 36, 32, 29, 10, 20],
      ['煤矿智能通信公司', 28, 25, 23, 7, 17],
      ['煤矿智能数据公司', 27, 24, 21, 8, 16],
      ['煤矿智能安全公司', 35, 31, 27, 6, 14],
      ['煤矿智能机器人公司', 25, 22, 19, 5, 14],
      ['煤矿智能服务公司', 24, 21, 18, 6, 16],
    ],
  },
  {
    id: 'comparison-equipment',
    name: '装备技术公司',
    children: [
      ['装备制造公司', 40, 35, 34, 12, 18],
      ['装备服务公司', 34, 30, 28, 8, 15],
      ['装备检测公司', 29, 27, 26, 10, 16],
      ['装备研发公司', 28, 24, 23, 9, 13],
      ['装备运维公司', 31, 27, 26, 7, 12],
      ['装备质量公司', 23, 20, 19, 11, 14],
      ['装备数控公司', 25, 22, 21, 8, 13],
      ['装备工程公司', 21, 18, 17, 9, 11],
      ['装备供应链公司', 24, 21, 20, 10, 14],
      ['装备试验公司', 21, 19, 18, 7, 11],
    ],
  },
  {
    id: 'comparison-coal-service',
    name: '煤炭技术服务公司',
    children: [
      ['煤炭技术咨询公司', 46, 42, 40, 8, 19],
      ['煤炭工程服务公司', 42, 39, 37, 7, 17],
      ['煤炭信息服务公司', 37, 33, 32, 6, 15],
      ['煤炭检测服务公司', 35, 32, 30, 5, 14],
      ['煤炭项目服务公司', 34, 30, 27, 9, 22],
      ['煤炭培训服务公司', 32, 29, 27, 8, 19],
      ['煤炭成果服务公司', 31, 28, 25, 7, 17],
      ['煤炭运维服务公司', 28, 25, 23, 5, 14],
      ['煤炭数据服务公司', 24, 23, 22, 6, 16],
      ['煤炭标准服务公司', 22, 21, 20, 5, 13],
    ],
  },
  {
    id: 'comparison-safety',
    name: '安全工程技术公司',
    children: [
      ['安全评价公司', 31, 28, 28, 7, 11],
      ['安全监测公司', 27, 25, 24, 5, 12],
      ['安全设计公司', 24, 21, 21, 8, 11],
      ['安全检测公司', 23, 21, 20, 6, 13],
      ['安全培训公司', 22, 20, 19, 7, 15],
      ['安全应急公司', 20, 18, 17, 8, 11],
      ['安全技术咨询公司', 19, 18, 18, 6, 14],
      ['安全数据服务公司', 18, 17, 17, 7, 12],
      ['安全工程服务公司', 25, 22, 21, 8, 16],
      ['安全运维公司', 20, 19, 18, 6, 16],
    ],
  },
  {
    id: 'comparison-green',
    name: '绿色低碳技术公司',
    children: [
      ['绿色低碳研究公司', 35, 31, 28, 4, 17],
      ['生态修复公司', 32, 29, 27, 5, 18],
      ['碳资产管理公司', 28, 25, 23, 6, 16],
      ['清洁能源公司', 27, 25, 24, 4, 19],
      ['节能技术公司', 25, 22, 20, 5, 20],
      ['环保装备公司', 24, 21, 19, 6, 18],
      ['绿色材料公司', 23, 20, 18, 5, 17],
      ['碳监测公司', 22, 20, 18, 4, 20],
      ['资源循环公司', 20, 19, 18, 6, 19],
      ['环境数据公司', 19, 18, 17, 5, 21],
    ],
  },
]

const cockpitComparisonScopeTargets = [
  { calls: 156, startedTasks: 155, completedTasks: 154, activeUsers: 34, registeredUsers: 38 },
  { calls: 132, startedTasks: 128, completedTasks: 118, activeUsers: 12, registeredUsers: 33 },
  { calls: 112, startedTasks: 112, completedTasks: 110, activeUsers: 28, registeredUsers: 29 },
  { calls: 104, startedTasks: 104, completedTasks: 101, activeUsers: 11, registeredUsers: 25 },
  { calls: 85, startedTasks: 82, completedTasks: 81, activeUsers: 24, registeredUsers: 34 },
  { calls: 73, startedTasks: 68, completedTasks: 65, activeUsers: 17, registeredUsers: 24 },
]

function distributeCockpitComparisonTotal(total, weights) {
  const weightTotal = Math.max(weights.reduce((sum, weight) => sum + Math.max(weight, 0), 0), 1)
  const rawValues = weights.map((weight) => total * Math.max(weight, 0) / weightTotal)
  const values = rawValues.map((value) => Math.floor(value))
  const remainder = total - values.reduce((sum, value) => sum + value, 0)

  rawValues
    .map((value, index) => ({ index, fraction: value - values[index] }))
    .sort((first, second) => second.fraction - first.fraction || first.index - second.index)
    .slice(0, remainder)
    .forEach(({ index }) => { values[index] += 1 })

  return values
}

function buildCockpitComparisonScope(seed, scopeIndex) {
  const target = cockpitComparisonScopeTargets[scopeIndex]
  const callWeights = seed.children.map(([, calls]) => calls)
  const registeredUserWeights = seed.children.map(([, , , , , registeredUsers]) => registeredUsers)
  const calls = distributeCockpitComparisonTotal(target.calls, callWeights)
  const startedTasks = distributeCockpitComparisonTotal(target.startedTasks, callWeights)
  const incompleteTasks = distributeCockpitComparisonTotal(target.startedTasks - target.completedTasks, callWeights)
  const registeredUsers = distributeCockpitComparisonTotal(target.registeredUsers, registeredUserWeights)
  const activeUsers = distributeCockpitComparisonTotal(target.activeUsers, registeredUserWeights)
  const children = seed.children.map(([name], index) => ({
    id: `${seed.id}-${String(index + 1).padStart(2, '0')}`,
    name,
    calls: calls[index],
    startedTasks: startedTasks[index],
    completedTasks: startedTasks[index] - incompleteTasks[index],
    activeUsers: activeUsers[index],
    registeredUsers: registeredUsers[index],
    color: cockpitComparisonPalette[index],
  }))
  const total = (field) => children.reduce((sum, child) => sum + child[field], 0)

  return {
    id: seed.id,
    name: seed.name,
    color: cockpitComparisonPalette[scopeIndex],
    calls: total('calls'),
    startedTasks: total('startedTasks'),
    completedTasks: total('completedTasks'),
    activeUsers: total('activeUsers'),
    registeredUsers: total('registeredUsers'),
    children,
  }
}

export const cockpitComparisonScopes = cockpitComparisonScopeSeeds
  .map((scope, index) => buildCockpitComparisonScope(scope, index))
