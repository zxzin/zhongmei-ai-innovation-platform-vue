export const historyRecords = [
  { id: 'TASK-260818-021', agent: 'innovation', title: '复杂煤矿环境下智能巡检机器人关键技术研究', user: '徐博', org: '中煤深圳研究院', date: '2026-08-18 16:08', status: '已完成', result: '创新性分析报告' },
  { id: 'TASK-260818-020', agent: 'qa', title: '高矿化度矿井水资源化利用关键约束', user: '王工', org: '技术研发部', date: '2026-08-18 15:36', status: '已完成', result: '技术回答' },
  { id: 'TASK-260818-019', agent: 'semantic', title: '煤岩识别技术路线专利与论文检索', user: '陈研', org: '科技发展部', date: '2026-08-18 14:52', status: '已完成', result: '126 条证据' },
  { id: 'TASK-260817-018', agent: 'research', title: '矿井水资源化利用技术路线预研', user: '王工', org: '技术研发部', date: '2026-08-17 17:20', status: '已完成', result: '预研报告' },
  { id: 'TASK-260817-017', agent: 'feasibility', title: '井下多模态巡检方案工程可行性', user: '李专家', org: '专家委员会', date: '2026-08-17 15:11', status: '已完成', result: '可行性报告' },
  { id: 'TASK-260816-014', agent: 'disclosure', title: '断网协同控制方法技术交底材料', user: '陈研', org: '科技发展部', date: '2026-08-16 10:05', status: '已完成', result: '交底书初稿' },
]

export const users = [
  { id: 'Admin', name: '平台管理员', company: '中煤集团', department: '科研管理部', role: '平台管理员', status: '启用', lastLogin: '今天 09:12' },
  { id: 'CM-01027', name: '徐博', company: '中煤深圳研究院', department: '科研管理部', role: '科研人员', status: '启用', lastLogin: '今天 08:44' },
  { id: 'CM-01142', name: '王工', company: '中煤深圳研究院', department: '技术研发部', role: '科研人员', status: '启用', lastLogin: '昨天 18:26' },
  { id: 'CM-00831', name: '李专家', company: '中煤深圳研究院', department: '专家委员会', role: '复核专家', status: '启用', lastLogin: '昨天 16:40' },
  { id: 'CM-01309', name: '陈研', company: '中煤深圳研究院', department: '科技发展部', role: '科研人员', status: '停用', lastLogin: '08-16 14:18' },
]

export const templates = [
  { id: 'TPL-01', name: '创新性分析评价模板', version: 'V2.3', scope: '创新性分析', owner: '科研管理部', status: '已发布' },
  { id: 'TPL-02', name: '技术预研报告模板', version: 'V1.8', scope: '技术预研报告', owner: '技术研发部', status: '已发布' },
  { id: 'TPL-03', name: '技术交底书结构模板', version: 'V1.5', scope: '技术交底书撰写', owner: '知识产权组', status: '草稿' },
]

export const cockpitTrend = [
  { label: '02月', calls: 58, results: 51 }, { label: '03月', calls: 72, results: 66 },
  { label: '04月', calls: 96, results: 89 }, { label: '05月', calls: 124, results: 116 },
  { label: '06月', calls: 141, results: 132 }, { label: '07月', calls: 167, results: 158 },
  { label: '08月', calls: 203, results: 191 },
]

export const agentUsage = [
  { id: 'semantic', name: '语义检索', value: 31, color: '#168bd2' },
  { id: 'qa', name: '技术问答', value: 24, color: '#30a6dd' },
  { id: 'research', name: '技术预研报告', value: 13, color: '#716fee' },
  { id: 'innovation', name: '创新性分析', value: 12, color: '#20b7a7' },
  { id: 'feasibility', name: '可行性分析', value: 11, color: '#2cc4d7' },
  { id: 'disclosure', name: '技术交底书', value: 9, color: '#f0a72f' },
]

export const organizationUsage = [
  { name: '中煤深圳研究院', calls: 203, users: 41 },
  { name: '煤矿智能化公司', calls: 168, users: 36 },
  { name: '装备技术公司', calls: 132, users: 29 },
  { name: '安全技术中心', calls: 96, users: 22 },
]

export const evidenceItems = [
  { id: 'CN120428713A', type: '专利', title: '一种煤矿井下智能巡检机器人多模态协同控制系统', source: '智慧芽专利数据库', date: '2026-07-26', relevance: 92 },
  { id: 'DOI:10.3390/s22114051', type: '论文', title: '地下煤矿作业自主移动机器人可通行区域识别方法', source: '平台论文库', date: '2026-06-18', relevance: 87 },
  { id: '矿安〔2024〕42号', type: '政策', title: '关于深入推进矿山智能化建设促进矿山安全发展的指导意见', source: '国家矿山安全监察局', date: '2024-04-28', relevance: 82 },
]
