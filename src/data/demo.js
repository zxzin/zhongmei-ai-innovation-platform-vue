export const historyRecords = [
  {
    id: 'TASK-260818-021', ownerAccount: 'Admin', agent: 'innovation', title: '复杂煤矿环境下智能巡检机器人关键技术研究', user: '张三', org: '中煤深圳研究院', date: '2026-08-18 16:08', status: '已完成', result: '创新性分析报告', resumePath: '/innovation/admin/report',
  },
  {
    id: 'TASK-260818-019', ownerAccount: 'Admin', agent: 'semantic', title: '煤岩识别技术路线专利与论文检索', user: '张三', org: '中煤深圳研究院', date: '2026-08-18 14:52', status: '已完成', result: '126 条证据', resumePath: '/agent/semantic/results',
  },
  {
    id: 'TASK-260817-017', ownerAccount: 'Admin', agent: 'feasibility', title: '井下多模态巡检方案工程可行性', user: '张三', org: '中煤深圳研究院', date: '2026-08-17 15:11', status: '已完成', result: '可行性报告', resumePath: '/agent/feasibility/report',
  },
  {
    id: 'TASK-260816-014', ownerAccount: 'Admin', agent: 'disclosure', title: '断网协同控制方法技术交底材料', user: '张三', org: '中煤深圳研究院', date: '2026-08-16 10:05', status: '已完成', result: '交底书初稿', resumePath: '/agent/disclosure/scope',
  },
  {
    id: 'TASK-260818-020', ownerAccount: 'User', agent: 'qa', title: '高矿化度矿井水资源化利用关键约束', user: '徐博', org: '中煤深圳研究院', date: '2026-08-18 15:36', status: '已完成', result: '技术回答', resumePath: '/agent/qa/chat',
  },
  {
    id: 'TASK-260817-018', ownerAccount: 'User', agent: 'research', title: '矿井水资源化利用技术路线预研', user: '徐博', org: '中煤深圳研究院', date: '2026-08-17 17:20', status: '已完成', result: '预研报告', resumePath: '/agent/research/brief',
  },
]

export const users = [
  { account: 'Admin', id: 'CM-SZ-0001', name: '张三', position: '科研管理部负责人', company: '中煤深圳研究院', department: '科研管理部', departmentId: 'dept-科研管理部', role: '管理员', status: '启用', joinedAt: '2026-02-18', lastLogin: '今天 09:12', lastLoginAt: '2026-08-21 09:12:00' },
  { account: 'User', id: 'CM-SZ-0002', name: '徐博', position: '智能应用研发工程师', company: '中煤深圳研究院', department: '技术研发部', departmentId: 'dept-技术研发部', role: '普通用户', status: '启用', joinedAt: '2026-03-04', lastLogin: '今天 08:44', lastLoginAt: '2026-08-21 08:44:00' },
  { id: 'CM-01142', name: '王工', position: '高级研发工程师', company: '中煤深圳研究院', department: '技术研发部', departmentId: 'dept-技术研发部', role: '普通用户', status: '启用', joinedAt: '2026-03-08', lastLogin: '昨天 18:26', lastLoginAt: '2026-08-20 18:26:00' },
  { id: 'CM-00831', name: '李专家', position: '技术评审顾问', company: '中煤深圳研究院', department: '专家委员会', departmentId: 'dept-专家委员会', role: '普通用户', status: '启用', joinedAt: '2026-04-18', lastLogin: '昨天 16:40', lastLoginAt: '2026-08-20 16:40:00' },
  { id: 'CM-01309', name: '陈研', position: '技术情报研究员', company: '中煤深圳研究院', department: '科技发展部', departmentId: 'dept-科技发展部', role: '普通用户', status: '停用', joinedAt: '2026-05-09', lastLogin: '08-16 14:18', lastLoginAt: '2026-08-16 14:18:00' },
]

export const templates = [
  { id: 'TPL-01', name: '创新性分析评价模板', version: 'V1', scope: '创新性分析', owner: '科研管理部', status: '已发布' },
  { id: 'TPL-02', name: '创新性分析评价模板', version: 'V2', scope: '创新性分析', owner: '科研管理部', status: '已发布' },
  { id: 'TPL-03', name: '创新性分析评价模板', version: 'V3', scope: '创新性分析', owner: '科研管理部', status: '已发布' },
]

export const cockpitTrend = [
  { label: '02月', calls: 48, results: 44 }, { label: '03月', calls: 62, results: 59 },
  { label: '04月', calls: 88, results: 83 }, { label: '05月', calls: 118, results: 112 },
  { label: '06月', calls: 139, results: 133 }, { label: '07月', calls: 179, results: 171 },
  { label: '08月', calls: 203, results: 194 },
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
