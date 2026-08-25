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
  { id: 'CKB-01', name: '集团技术标准库', description: '集团级技术标准、制度与统一模板', files: 386, updated: '今天 08:30', access: '全集团' },
  { id: 'CKB-02', name: '深圳院项目成果库', description: '项目报告、验收材料与成果归档', files: 214, updated: '昨天 18:02', access: '深圳院及子部门' },
  { id: 'CKB-03', name: '智能矿山案例库', description: '已验证方案、现场案例与复盘记录', files: 128, updated: '08-18 15:44', access: '授权项目组' },
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
  { name: '中煤集团', count: 156, children: [
    { name: '中煤深圳研究院', count: 62, children: [{ name: '科研管理部', count: 14 }, { name: '技术研发部', count: 31 }, { name: '专家委员会', count: 17 }] },
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

// 运营演示数据口径：calls 为用户发起的智能应用调用总量，包含成功、失败、超时和中止的调用；outputs 仅统计成功形成的结果。
export const appPerformance = [
  { name: '语义检索', calls: 204, outputs: 199, duration: '42 秒', completion: 97.9, success: 98.4, online: 1, processing: 3, historicSuccess: 528, historicFailure: 9 },
  { name: '技术问答', calls: 159, outputs: 157, duration: '18 秒', completion: 98.5, success: 99.0, online: 1, processing: 2, historicSuccess: 412, historicFailure: 4 },
  { name: '技术预研报告', calls: 86, outputs: 81, duration: '8 分 12 秒', completion: 94.7, success: 95.4, online: 1, processing: 4, historicSuccess: 214, historicFailure: 10 },
  { name: '创新性分析', calls: 80, outputs: 73, duration: '11 分 34 秒', completion: 93.2, success: 94.1, online: 1, processing: 3, historicSuccess: 195, historicFailure: 11 },
  { name: '可行性分析', calls: 73, outputs: 69, duration: '6 分 08 秒', completion: 95.6, success: 96.7, online: 1, processing: 2, historicSuccess: 180, historicFailure: 6 },
  { name: '技术交底书撰写', calls: 60, outputs: 51, duration: '7 分 21 秒', completion: 92.4, success: 93.4, online: 1, processing: 3, historicSuccess: 153, historicFailure: 10 },
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

// 驾驶舱本地演示汇总：字段结构对应后续运营统计接口，不代表实时生产数据。trend.calls 为发起调用总量，包含成功、失败、超时和中止的调用；trend.results 仅统计成功形成的结果。
export const cockpitPeriods = [
  {
    id: 'day', name: '今日', label: '2026年08月24日', scale: 15 / 662, userScale: 0.19, dayCount: 1,
    comparisonLabel: '较昨日', comparison: { calls: '+6.4%', completion: '+0.7%', response: '-8.2%', logins: '+2.6%' },
    trend: [
      { label: '09时', calls: 2, results: 2 }, { label: '11时', calls: 2, results: 2 },
      { label: '13时', calls: 3, results: 3 }, { label: '15时', calls: 3, results: 3 },
      { label: '17时', calls: 2, results: 2 }, { label: '19时', calls: 3, results: 3 },
    ],
  },
  {
    id: 'year', name: '本年度', label: '2026年02月—08月', scale: 1, userScale: 1, activeDays: 8.6, dayCount: 205,
    comparisonLabel: '较上年同期', comparison: { calls: '+24.7%', completion: '+2.6%', response: '-11.3%', logins: '+17.8%' },
    trend: [
      { label: '02月', calls: 39, results: 38 }, { label: '03月', calls: 49, results: 47 },
      { label: '04月', calls: 70, results: 67 }, { label: '05月', calls: 93, results: 90 },
      { label: '06月', calls: 110, results: 106 }, { label: '07月', calls: 141, results: 136 },
      { label: '08月', calls: 160, results: 154 },
    ],
  },
  {
    id: 'quarter', name: '近 90 天', label: '2026年06月—08月', scale: 417 / 662, userScale: 0.79, activeDays: 4.8, dayCount: 90,
    comparisonLabel: '较上一季度', comparison: { calls: '+18.2%', completion: '+1.9%', response: '-9.4%', logins: '+12.1%' },
    trend: [
      { label: '06月', calls: 126, results: 122 }, { label: '07月', calls: 138, results: 133 }, { label: '08月', calls: 153, results: 149 },
    ],
  },
  {
    id: 'month', name: '近 30 天', label: '2026年08月', scale: 160 / 662, userScale: 0.56, activeDays: 2.1, dayCount: 30,
    comparisonLabel: '较上月', comparison: { calls: '+12.6%', completion: '+1.4%', response: '-6.9%', logins: '+8.3%' },
    trend: [
      { label: '第 1 周', calls: 31, results: 30 }, { label: '第 2 周', calls: 37, results: 36 },
      { label: '第 3 周', calls: 43, results: 41 }, { label: '第 4 周', calls: 49, results: 47 },
    ],
    activityTrend: [
      { label: '01日', calls: 3, activeUsers: 19 }, { label: '02日', calls: 5, activeUsers: 20 },
      { label: '03日', calls: 4, activeUsers: 20 }, { label: '04日', calls: 4, activeUsers: 21 },
      { label: '05日', calls: 5, activeUsers: 22 }, { label: '06日', calls: 4, activeUsers: 21 },
      { label: '07日', calls: 5, activeUsers: 23 }, { label: '08日', calls: 4, activeUsers: 22 },
      { label: '09日', calls: 5, activeUsers: 23 }, { label: '10日', calls: 5, activeUsers: 24 },
      { label: '11日', calls: 4, activeUsers: 23 }, { label: '12日', calls: 5, activeUsers: 25 },
      { label: '13日', calls: 5, activeUsers: 24 }, { label: '14日', calls: 5, activeUsers: 26 },
      { label: '15日', calls: 5, activeUsers: 25 }, { label: '16日', calls: 6, activeUsers: 27 },
      { label: '17日', calls: 5, activeUsers: 26 }, { label: '18日', calls: 6, activeUsers: 28 },
      { label: '19日', calls: 5, activeUsers: 27 }, { label: '20日', calls: 6, activeUsers: 28 },
      { label: '21日', calls: 6, activeUsers: 29 }, { label: '22日', calls: 5, activeUsers: 28 },
      { label: '23日', calls: 6, activeUsers: 30 }, { label: '24日', calls: 6, activeUsers: 29 },
      { label: '25日', calls: 6, activeUsers: 31 }, { label: '26日', calls: 7, activeUsers: 32 },
      { label: '27日', calls: 6, activeUsers: 30 }, { label: '28日', calls: 7, activeUsers: 33 },
      { label: '29日', calls: 7, activeUsers: 34 }, { label: '30日', calls: 8, activeUsers: 35 },
    ],
  },
]

export const cockpitScopes = [
  {
    id: 'group', name: '全集团', calls: 662, successfulCalls: 641, starts: 700, tasks: 649, completedTasks: 629,
    reports: 295, reviews: 59, activeUsers: 126, registeredUsers: 183, historicalLogins: 1011, firstResponseSeconds: 2.7, responseSeconds: 156,
    children: [
      { name: '中煤深圳研究院', calls: 249, tasks: 244, reports: 114, users: 47 },
      { name: '煤矿智能化公司', calls: 222, tasks: 217, reports: 98, users: 42 },
      { name: '装备技术公司', calls: 191, tasks: 188, reports: 83, users: 37 },
    ],
  },
  {
    id: 'shenzhen', name: '中煤深圳研究院', calls: 249, successfulCalls: 241, starts: 263, tasks: 244, completedTasks: 237,
    reports: 114, reviews: 24, activeUsers: 47, registeredUsers: 66, historicalLogins: 374, firstResponseSeconds: 2.7, responseSeconds: 176,
    children: [
      { name: '深圳科创服务公司', calls: 79, tasks: 77, reports: 35, users: 13 },
      { name: '深圳数字技术公司', calls: 112, tasks: 110, reports: 49, users: 22 },
      { name: '深圳工程技术公司', calls: 58, tasks: 57, reports: 30, users: 12 },
    ],
  },
  {
    id: 'intelligent-mine', name: '煤矿智能化公司', calls: 222, successfulCalls: 215, starts: 235, tasks: 217, completedTasks: 210,
    reports: 98, reviews: 15, activeUsers: 42, registeredUsers: 61, historicalLogins: 336, firstResponseSeconds: 2.4, responseSeconds: 148,
    children: [
      { name: '煤矿智能装备公司', calls: 84, tasks: 82, reports: 37, users: 16 },
      { name: '煤矿智能软件公司', calls: 78, tasks: 76, reports: 34, users: 15 },
      { name: '煤矿智能运维公司', calls: 60, tasks: 59, reports: 27, users: 11 },
    ],
  },
  {
    id: 'equipment', name: '装备技术公司', calls: 191, successfulCalls: 185, starts: 202, tasks: 188, completedTasks: 182,
    reports: 83, reviews: 20, activeUsers: 37, registeredUsers: 56, historicalLogins: 301, firstResponseSeconds: 2.9, responseSeconds: 203,
    children: [
      { name: '装备制造公司', calls: 72, tasks: 71, reports: 31, users: 14 },
      { name: '装备服务公司', calls: 65, tasks: 64, reports: 28, users: 13 },
      { name: '装备检测公司', calls: 54, tasks: 53, reports: 24, users: 10 },
    ],
  },
]
