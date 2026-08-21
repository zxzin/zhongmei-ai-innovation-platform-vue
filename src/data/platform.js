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
  { id: 'PKB-01', name: '井下智能装备研究', description: '巡检机器人、传感器与协同控制资料', files: 24, updated: '今天 09:42', access: '仅本人' },
  { id: 'PKB-02', name: '矿井水资源化', description: '水处理技术路线、论文与项目材料', files: 17, updated: '昨天 16:18', access: '仅本人' },
  { id: 'PKB-03', name: '待整理资料', description: '临时上传、尚未归档的工作文件', files: 8, updated: '08-18 11:20', access: '仅本人' },
]

export const companyLibraries = [
  { id: 'CKB-01', name: '集团技术标准库', description: '集团级技术标准、制度与统一模板', files: 386, updated: '今天 08:30', access: '全集团' },
  { id: 'CKB-02', name: '深圳院项目成果库', description: '项目报告、验收材料与成果归档', files: 214, updated: '昨天 18:02', access: '深圳院及子部门' },
  { id: 'CKB-03', name: '智能矿山案例库', description: '已验证方案、现场案例与复盘记录', files: 128, updated: '08-18 15:44', access: '授权项目组' },
]

export const libraryFiles = [
  { id: 'DOC-260818-021', name: '复杂煤矿环境智能巡检机器人项目建议书.docx', type: 'Word', size: '3.8 MB', source: '个人上传', updated: '今天 09:42', status: '可检索' },
  { id: 'DOC-260817-019', name: '第三阶段井下现场试验数据.xlsx', type: 'Excel', size: '6.1 MB', source: '项目资料', updated: '昨天 16:18', status: '可检索' },
  { id: 'DOC-260816-014', name: '多模态感知技术路线调研.pdf', type: 'PDF', size: '11.4 MB', source: '个人上传', updated: '08-18 11:20', status: '解析完成' },
]

export const recycledFiles = [
  { id: 'DOC-260710-004', name: '巡检方案旧版草稿.docx', deleted: '08-17 14:20', expires: '剩余 27 天' },
  { id: 'DOC-260622-011', name: '传感器供应商参数汇总.xlsx', deleted: '08-12 09:36', expires: '剩余 22 天' },
]

export const departmentTree = [
  { name: '中煤集团', count: 156, children: [
    { name: '中煤深圳研究院', count: 62, children: [{ name: '科研管理部', count: 14 }, { name: '技术研发部', count: 31 }, { name: '专家委员会', count: 17 }] },
    { name: '煤矿智能化公司', count: 48, children: [{ name: '产品研发部', count: 28 }, { name: '工程验证部', count: 20 }] },
    { name: '装备技术公司', count: 46, children: [{ name: '智能装备部', count: 26 }, { name: '安全技术部', count: 20 }] },
  ] },
]

export const systemLogs = [
  { id: 'LOG-260821-0912', type: '登录日志', user: '平台管理员', action: '账号密码登录', target: '管理中心', time: '2026-08-21 09:12:18', result: '成功' },
  { id: 'LOG-260821-0844', type: '操作日志', user: '徐博', action: '生成创新性分析报告', target: 'TASK-260818-021', time: '2026-08-21 08:44:09', result: '成功' },
  { id: 'LOG-260820-1736', type: '操作日志', user: '王工', action: '上传个人知识库文件', target: 'PKB-02', time: '2026-08-20 17:36:42', result: '成功' },
  { id: 'LOG-260820-1618', type: '登录日志', user: '陈研', action: '账号密码登录', target: '统一身份认证', time: '2026-08-20 16:18:03', result: '失败' },
]

export const appPerformance = [
  { name: '语义检索', calls: 258, completion: 97.7, duration: '42 秒', success: 98.4, online: 1 },
  { name: '技术问答', calls: 201, completion: 98.5, duration: '18 秒', success: 99.0, online: 1 },
  { name: '技术预研报告', calls: 109, completion: 93.6, duration: '8 分 12 秒', success: 95.4, online: 1 },
  { name: '创新性分析', calls: 101, completion: 91.1, duration: '11 分 34 秒', success: 94.1, online: 1 },
  { name: '可行性分析', calls: 92, completion: 94.6, duration: '6 分 08 秒', success: 96.7, online: 1 },
  { name: '技术交底书撰写', calls: 76, completion: 92.1, duration: '7 分 21 秒', success: 93.4, online: 1 },
]

export const taskStatus = [
  { id: 'semantic-service', name: '语义检索服务', status: 1, updated: '09:30', note: '检索队列正常' },
  { id: 'qa-service', name: '技术问答服务', status: 1, updated: '09:30', note: '连续对话正常' },
  { id: 'report-service', name: '报告生成服务', status: 1, updated: '09:29', note: 'Word 导出正常' },
  { id: 'patent-service', name: '智慧芽专利服务', status: 0, updated: '09:28', note: '外部服务暂停' },
]
