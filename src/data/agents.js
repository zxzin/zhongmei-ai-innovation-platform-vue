import {
  Search,
  MessagesSquare,
  FileText,
  Lightbulb,
  ShieldCheck,
  ScrollText,
} from '@lucide/vue'

export const agents = [
  {
    id: 'semantic', number: '01', name: '语义检索', action: '开始检索', icon: Search,
    description: '检索专利、论文与授权知识库，按语义相关度排序并返回原文核验。',
    placeholder: '输入技术主题或检索问题，不少于 200 字可获得更准确的结果',
    sample: '检索煤岩识别技术路线相关专利与论文，重点关注多模态传感与井下复杂环境适配。',
    steps: ['检索要求', '范围确认', '结果列表', '原文核验'],
    sources: ['专利数据库', '论文数据库', '企业知识库', '个人知识库'],
    output: '按相关度排序的证据列表与检索式', accent: 'blue',
  },
  {
    id: 'innovation', number: '02', name: '创新性分析', action: '开始分析', icon: Lightbulb,
    description: '解析技术方案，核对创新点、现有技术、政策依据与评价结论。',
    placeholder: '上传立项材料，或输入技术方案、创新目标与关键技术内容',
    sample: '复杂煤矿环境下智能巡检机器人关键技术研究',
    steps: ['上传材料', '项目信息', '技术分析', '证据确认', '报告生成'],
    sources: ['专利数据库', '论文数据库', '政策法规', '立项材料'],
    output: '创新性分析报告与可追溯证据', accent: 'teal',
  },
  {
    id: 'qa', number: '03', name: '技术问答', action: '开始问答', icon: MessagesSquare,
    description: '支持连续对话，以专利、论文和企业资料作为引用依据。',
    placeholder: '输入技术问题，可继续补充工况、指标或对比方案',
    sample: '井下高矿化度矿井水资源化利用有哪些关键约束？',
    steps: ['提出问题', '证据检索', '生成回答', '继续追问'],
    sources: ['专利数据库', '论文数据库', '企业知识库'],
    output: '带引用的连续技术问答', accent: 'rose',
  },
  {
    id: 'research', number: '04', name: '技术预研报告', action: '开始预研', icon: FileText,
    description: '结合研究主题和补充材料，生成可编辑大纲与技术预研报告。',
    placeholder: '输入研究主题、目标、范围和已有材料',
    sample: '矿井水资源化利用技术路线预研与产业应用分析',
    steps: ['研究主题', '需求补充', '大纲确认', '生成报告'],
    sources: ['专利数据库', '论文数据库', '政策法规', '补充材料'],
    output: '可编辑、可引用的技术预研报告', accent: 'violet',
  },
  {
    id: 'feasibility', number: '05', name: '可行性分析', action: '开始论证', icon: ShieldCheck,
    description: '识别方案假设、约束、风险和论文证据，形成验证路径。',
    placeholder: '输入技术方案、工况边界和预期指标',
    sample: '井下巡检机器人采用激光雷达、视觉、IMU 与 5G 专网的融合方案。',
    steps: ['方案输入', '约束补充', '风险分析', '验证方案', '结论报告'],
    sources: ['方案材料', '论文数据库', '专利数据库', '行业规范'],
    output: '风险矩阵、验证路径与可行性报告', accent: 'cyan',
  },
  {
    id: 'disclosure', number: '06', name: '技术交底书撰写', action: '开始撰写', icon: ScrollText,
    description: '按技术问题、方案、效果和实施方式生成可编辑交底书初稿。',
    placeholder: '输入研发材料，说明技术问题、技术手段与实施效果',
    sample: '煤矿井下巡检机器人多传感器融合定位与断网协同控制方法。',
    steps: ['材料输入', '缺项检查', '结构确认', '生成初稿'],
    sources: ['研发材料', '企业模板', '专利检索状态'],
    output: '技术交底书初稿与缺失项清单', accent: 'amber',
  },
]

export const agentMap = Object.fromEntries(agents.map((agent) => [agent.id, agent]))
