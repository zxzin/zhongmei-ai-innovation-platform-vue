<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { Download, FileText } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '../stores/tasks.js'
import { useUiStore } from '../stores/ui.js'

const route = useRoute()
const router = useRouter()
const tasks = useTasksStore()
const ui = useUiStore()

const stages = ['project', 'analysis', 'themes', 'points', 'policy', 'report']
const stageAliases = { confirm: 'project', setup: 'project', evidence: 'themes', run: 'report' }
const workflowSteps = [
  { id: 'project', label: '项目信息确认' },
  { id: 'analysis', label: '技术与创新点分析' },
  { id: 'themes', label: '技术主题相关数据' },
  { id: 'points', label: '创新点相关数据' },
  { id: 'policy', label: '政策数据' },
  { id: 'report', label: '生成报告' },
]
const originalProfile = {
  name: '蒙陕矿区深部矿井煤水共采与矿井水资源化利用研究',
  field: '煤炭开采 · 矿井水害防治 · 矿井水资源化 · 水文地质',
  scenario: '深部侏罗系矿井',
  outputs: '地下水流动态模拟与各矿井涌水量、水质中长期预测；煤水分离与清浊分流系统优化方案和示范工程；典型矿井井下储水、净水方案及实施；矿井水资源化优化配置方案和示范工程；相关科技论文≥2篇。',
  breakthroughs: '各矿井涌水量和水质动态预计精度提高到80%以上；清水比例提高到60%以上；浊水量占比降至40%以下；实现矿井水全复用、零排放。',
  issue: '在保障深部矿井安全开采的同时，解决高矿化度、大流量涌水的防治、处理、资源化利用与生态保护协同问题。',
  manifestations: '高矿化度（2–9 g/L）大流量涌水外排，生态环境风险突出；井下污水量大、煤水混杂、采场积水，影响回采、排水与处理；矿井水利用率低，煤化工及生产生活用水与矿井排水水量、水质匹配矛盾突出。',
  solution: '以“煤水共采、煤水双资源”为理念，开展涌水量、水质动态预测，清浊分流，井下“控—储—净”，地面多级净化、分质供水与水资源优化配置。',
  features: '形成“低扰动、大循环、全复用、零排放”的煤—水资源环境协调开采模式，并推进“煤矿—化工厂—水处理厂—缓冲水池”一体化。',
}
const profile = reactive({ ...originalProfile })
const inputMode = ref('file')
const uploadedFile = ref(null)
const workflowMax = ref(1)
const themeSource = ref('patent')
const pointSource = ref('patent')
const pointTab = ref(0)
const themeExpanded = ref('')
const pointExpanded = ref('')
const taskRecorded = ref(false)
const scopeTopics = ref([
  '煤炭资源开采过程伴随大量高矿化度涌水的治理问题',
  '煤水混杂采场环境下工作面回采与井下排水的协同控制问题',
])
const scopePoints = ref([
  '地下水流与水化学耦合模拟驱动的涌水量、水质动态预测',
  '深部侏罗系矿井清浊分流与“控—储—净”一体化',
  '矿井水分级净化、分质供水与动态优化配置',
])

const themeEvidence = reactive({
  patent: [
    { id: 'T-P-01', title: '深部矿井采动扰动下涌水量与水质协同预测方法', source: '主题检索 · 专利候选', meta: '采动扰动 · 水量水质耦合', excerpt: '以采动强度、水文地质参数和在线水质监测数据为输入，协同预测涌水量与水质变化，可用于比对本项目的动态预测边界。', selected: true, topics: [0] },
    { id: 'T-P-02', title: '高矿化度矿井水分盐浓缩及副产盐资源化系统', source: '主题检索 · 专利候选', meta: '高矿化度 · 分盐资源化', excerpt: '围绕预处理、纳滤分盐、浓缩减量及副产盐利用形成处理链，适合核验高矿化度涌水的治理与资源化路径。', selected: true, topics: [0] },
    { id: 'T-P-03', title: '煤水共采矿井清浊分流与井下储净联动系统', source: '主题检索 · 专利候选', meta: '煤水共采 · 控储净', excerpt: '通过清浊分流、井下储水和分质净化单元联动运行，支撑采场排水与回采过程协同控制。', selected: true, topics: [1] },
    { id: 'T-P-04', title: '矿区多水源分质供水与动态优化配置方法', source: '主题检索 · 专利候选', meta: '多水源 · 动态配置', excerpt: '按照不同用水需求、水质等级和输配条件优化配置矿井水与常规水源，可对比项目分质供水与梯级利用设计。', selected: false, topics: [0, 1] },
  ],
  paper: [
    { id: 'T-L-01', title: '深部开采扰动下地下水流—水化学耦合模拟研究', source: '主题检索 · 论文候选', meta: '水文地质模拟 · 主题一', excerpt: '讨论开采扰动条件下地下水流场和水化学特征的联动演化，为矿井涌水量、水质中长期预测提供建模参照。', selected: true, topics: [0] },
    { id: 'T-L-02', title: '高矿化度矿井水纳滤分盐与膜污染控制技术', source: '主题检索 · 论文候选', meta: '浓盐水处理 · 主题一', excerpt: '聚焦高盐矿井水纳滤分盐过程中膜污染、结垢与稳定运行问题，可用于核验深度处理工艺的关键约束。', selected: true, topics: [0] },
    { id: 'T-L-03', title: '煤水混杂采场回采与井下排水协同调控机制', source: '主题检索 · 论文候选', meta: '回采协同 · 主题二', excerpt: '分析煤水混杂环境中回采推进、采场积水和井下排水负荷之间的时序关系，对应煤水共采工况下的协同控制问题。', selected: true, topics: [1] },
    { id: 'T-L-04', title: '矿区多水源分级利用与供需优化配置研究', source: '主题检索 · 论文候选', meta: '分质供水 · 双主题', excerpt: '针对矿井水、地表水和再生水等多类水源建立供需匹配模型，为分级利用和动态优化配置提供比较依据。', selected: false, topics: [0, 1] },
  ],
  policy: [
    { id: 'T-R-01', title: '关于加强矿井水保护和利用的指导意见（发改环资〔2024〕226号）', source: '国家发展改革委等八部门', meta: '2024 · 矿井水保护利用', excerpt: '提出矿井水源头保护、分质分级处理和综合利用要求，可支撑清污分流、井下储用与资源化路径的政策核验。', selected: true, topics: [0, 1] },
    { id: 'T-R-02', title: '关于加强非常规水源配置利用的指导意见（水节约〔2023〕206号）', source: '水利部、国家发展改革委', meta: '2023 · 非常规水源配置', excerpt: '明确矿坑（井）水应纳入水资源统一配置并实行目标管理，对多水源动态配置和矿区用水协同具有直接参考意义。', selected: true, topics: [0, 1] },
    { id: 'T-R-03', title: '工业废水循环利用实施方案（工信部联节〔2021〕213号）', source: '工业和信息化部等六部门', meta: '2021 · 分质处理回用', excerpt: '提出分质处理、高效回用和循环利用要求，可用于对照矿井水深度处理、厂区回用与零排放目标。', selected: false, topics: [0] },
    { id: 'T-R-04', title: '地下水管理条例（国务院令第748号）', source: '国务院', meta: '地下水保护 · 监测管理', excerpt: '对地下水污染防治、监测管理和开发利用提出要求，可作为深部矿井水量、水质动态监测的合规参考。', selected: false, topics: [0] },
  ],
})

const pointEvidenceDetails = {
  'I1-P-01': ['创新点 1 · 专利候选', '将工作面推进、顶底板岩性和含水层参数纳入预测模型，适合比对本项目采动条件下涌水量预测的输入变量与精度目标。', true],
  'I1-P-02': ['创新点 1 · 专利候选', '利用多参数水质在线监测和时序识别实现异常趋势预警，可用于核验水质动态预测与预警阈值设置。', true],
  'I1-P-03': ['创新点 1 · 专利候选', '联合水压、涌水量、采动强度等信息判别矿井水害风险，为水量、水质与采动响应的耦合分析提供对比对象。', false],
  'I1-L-01': ['创新点 1 · 论文候选', '建立采动扰动和涌水响应的时间序列关系，用于比较预测周期、训练样本和误差评价方式。', true],
  'I1-L-02': ['创新点 1 · 论文候选', '分析深部采动与水文地质条件变化对矿井水矿化度和主要离子的影响，为水质预测提供研究线索。', true],
  'I1-L-03': ['创新点 1 · 论文候选', '归纳水量、水质联合预测常用模型及适用条件，可支撑本项目预测技术路线的差异化核验。', false],
  'I1-R-01': ['国家矿山安全监察局等七部门', '提出环境智能感知、系统智能联动和重大灾害风险预警能力建设，为矿井水动态预测与预警系统提供政策背景。', true],
  'I1-R-02': ['国务院', '明确煤矿安全生产与灾害风险防控要求，可作为深部矿井水害监测、预警和动态处置的边界依据。', false],
  'I1-R-03': ['国家矿山安全监察局', '强调重大灾害风险监测预警和隐患治理，对多参数监测、风险辨识与预警闭环设计具有参考价值。', false],
  'I2-P-01': ['创新点 2 · 专利候选', '针对煤水混杂来水按浊度和污染负荷实施分流处理，为本项目清水比例提升和浊水减量提供工艺对比。', true],
  'I2-P-02': ['创新点 2 · 专利候选', '将井下储水、净化与回用控制单元集成布置，可用于核验控—储—净一体化的单元衔接与运行边界。', true],
  'I2-P-03': ['创新点 2 · 专利候选', '利用采空区调蓄矿井水并按照水质等级回用，适合对比项目井下储水方案与采场安全控制条件。', false],
  'I2-L-01': ['创新点 2 · 论文候选', '分析工作面推进、采场积水和排水负荷的联动关系，支撑煤水共采条件下回采与排水协同控制的技术比较。', true],
  'I2-L-02': ['创新点 2 · 论文候选', '研究采空区调蓄、井下净化和回用之间的运行机制，可用于核验井下控—储—净方案的工程可行性。', true],
  'I2-L-03': ['创新点 2 · 论文候选', '比较不同水质分流后的处理单元与负荷分配，为项目清浊分流系统优化提供工艺参数参考。', false],
  'I2-R-01': ['国家发展改革委等八部门', '提出推进矿井水分质分级处理与综合利用，对清污分流、井下储用及处理单元协同具有直接指引作用。', true],
  'I2-R-02': ['生态环境部', '要求合理充分利用矿井水并加强外排管理，可作为煤水共采条件下矿井水处理、回用与排放的合规参考。', false],
  'I2-R-03': ['自然资源主管部门', '强调资源节约集约利用和生态环境保护，为煤水共采、井下储水净化与绿色开采协同设计提供评价参考。', false],
  'I3-P-01': ['创新点 3 · 专利候选', '依据用水水质要求、供水能力和输配条件配置不同水源，可用于对照项目分质供水与多用户匹配逻辑。', true],
  'I3-P-02': ['创新点 3 · 专利候选', '将处理后矿井水按水质等级用于生产、生态和辅助用水，为全复用目标和资源化路径提供技术参照。', true],
  'I3-P-03': ['创新点 3 · 专利候选', '以供需变化、水质等级和管网能力为约束进行动态调配，可用于核验矿区水资源优化配置方案。', false],
  'I3-L-01': ['创新点 3 · 论文候选', '构建不同水源与用户需求的供需匹配模型，可用于比较动态配置目标、约束条件和评价指标。', true],
  'I3-L-02': ['创新点 3 · 论文候选', '从替代常规水、减排和运行成本等角度评价矿井水梯级利用，为资源化效益核验提供参考。', true],
  'I3-L-03': ['创新点 3 · 论文候选', '围绕工业用水与生态补水的水质要求开展匹配分析，可用于完善项目分质供水和全复用方案。', false],
  'I3-R-01': ['水利部、国家发展改革委', '明确矿坑（井）水应纳入水资源统一配置并实行目标管理，对多水源动态配置和非常规水源利用具有直接指导意义。', true],
  'I3-R-02': ['国家发展改革委等部门', '提出推动污水资源化、工业利用和生态补水，可作为矿井水处理后分级利用与资源化效益的上位政策依据。', true],
  'I3-R-03': ['国家发展改革委、水利部', '提出推进矿井水等非常规水源的多元、梯级、安全利用，支撑矿区水资源全复用和分质供水目标。', false],
}

const pointEvidence = reactive([
  {
    patent: [
      ['I1-P-01', '基于采动影响因子的矿井涌水量预测方法', '采动响应 · 涌水预测'], ['I1-P-02', '矿井水水质在线监测与趋势预警系统', '水质在线 · 趋势预警'], ['I1-P-03', '深部矿井水害多参数联合预警方法', '多参数预警 · 深部矿井'],
    ], paper: [
      ['I1-L-01', '采动扰动下矿井涌水量时序预测模型研究', '时序建模 · 涌水量'], ['I1-L-02', '深部矿井水文地质参数变化对水质演化的影响', '水质演化 · 水文地质'], ['I1-L-03', '矿井涌水量—水质耦合预测方法综述', '耦合预测 · 方法综述'],
    ], policy: [
      ['I1-R-01', '关于深入推进矿山智能化建设促进矿山安全发展的指导意见（矿安〔2024〕42号）', '2024 · 智能感知预警'], ['I1-R-02', '煤矿安全生产条例', '矿井安全 · 风险防控'], ['I1-R-03', '矿山安全生产治本攻坚三年行动方案（2024—2026年）', '风险监测 · 隐患治理'],
    ],
  },
  {
    patent: [
      ['I2-P-01', '煤水共采条件下矿井水清浊分流方法', '煤水共采 · 清浊分流'], ['I2-P-02', '井下储水净化一体化系统及控制方法', '井下储水 · 控储净'], ['I2-P-03', '采空区矿井水储存与分质回用方法', '采空区储水 · 分质回用'],
    ], paper: [
      ['I2-L-01', '煤水共采矿井工作面回采与排水协同控制研究', '回采协同 · 排水控制'], ['I2-L-02', '采空区储水与井下净化协同机制研究', '储水净化 · 协同运行'], ['I2-L-03', '清浊分流条件下矿井水处理工艺优化', '清浊分流 · 工艺优化'],
    ], policy: [
      ['I2-R-01', '关于加强矿井水保护和利用的指导意见（发改环资〔2024〕226号）', '2024 · 分质处理利用'], ['I2-R-02', '关于进一步加强煤炭资源开发环境影响评价管理的通知', '煤炭开发 · 矿井水管理'], ['I2-R-03', '绿色矿山建设评价指标', '绿色开采 · 资源利用'],
    ],
  },
  {
    patent: [
      ['I3-P-01', '面向矿区多水源的水质分级供水优化方法', '多水源 · 分级供水'], ['I3-P-02', '矿井水资源化梯级利用系统及方法', '梯级利用 · 资源化'], ['I3-P-03', '矿区水资源供需动态调配系统', '供需匹配 · 动态调配'],
    ], paper: [
      ['I3-L-01', '多水源多用户条件下矿区水资源优化配置研究', '优化配置 · 多用户'], ['I3-L-02', '矿井水资源化梯级利用效益评价研究', '梯级利用 · 效益评价'], ['I3-L-03', '工业—生态联合用水水质匹配方法研究', '分质供水 · 水质匹配'],
    ], policy: [
      ['I3-R-01', '关于加强非常规水源配置利用的指导意见（水节约〔2023〕206号）', '2023 · 统一配置'], ['I3-R-02', '关于推进污水资源化利用的指导意见（发改环资〔2021〕13号）', '2021 · 资源化利用'], ['I3-R-03', '国家节水行动方案（发改环资规〔2019〕695号）', '节水 · 非常规水源'],
    ],
  },
].map((point) => Object.fromEntries(Object.entries(point).map(([type, values]) => [type, values.map(([id, title, meta]) => {
  const [source, excerpt, selected] = pointEvidenceDetails[id]
  return { id, title, meta, source, excerpt, selected }
})]))))

const policyEvidence = reactive([
  { id: 'R-01', title: '关于加强矿井水保护和利用的指导意见（发改环资〔2024〕226号）', source: '国家发展改革委等八部门', meta: '2024-02-23 · 矿井水保护与利用', excerpt: '提出矿井水源头保护、分质分级处理和综合利用，强调统一配置与梯级利用，是本项目清污分流、井下储用及资源化路径的直接政策依据。', selected: true },
  { id: 'R-02', title: '关于加强非常规水源配置利用的指导意见（水节约〔2023〕206号）', source: '水利部、国家发展改革委', meta: '2023-06-22 · 非常规水源配置', excerpt: '明确矿坑（井）水属于非常规水源，要求纳入水资源统一配置并实行目标管理，可用于核验项目多水源动态配置与矿区用水协同的政策边界。', selected: true },
  { id: 'R-03', title: '关于推进污水资源化利用的指导意见（发改环资〔2021〕13号）', source: '国家发展改革委等部门', meta: '2021-01-04 · 污水资源化利用', excerpt: '明确推进污水资源化利用、工业利用和生态补水等方向，可作为项目矿井水处理后多路径回用与资源化效益的上位政策参考。', selected: true },
  { id: 'R-04', title: '国家节水行动方案（发改环资规〔2019〕695号）', source: '国家发展改革委、水利部', meta: '2019-04-15 · 节水与非常规水源', excerpt: '要求推动再生水、海水、雨水、矿井水、微咸水等非常规水源的多元、梯级、安全利用，支撑项目的全复用与绿色矿区目标。', selected: false },
  { id: 'R-05', title: '关于深入推进矿山智能化建设促进矿山安全发展的指导意见（矿安〔2024〕42号）', source: '国家矿山安全监察局等七部门', meta: '2024-04-24 · 矿山智能化建设', excerpt: '提出建设环境智能感知、系统智能联动和重大灾害风险智能预警能力，可作为项目矿井水动态预测、运行预警与智能调度设计的协同政策背景。', selected: false },
  { id: 'R-06', title: '工业废水循环利用实施方案（工信部联节〔2021〕213号）', source: '工业和信息化部等六部门', meta: '2021-12-24 · 工业废水循环利用', excerpt: '提出推进工业废水循环利用、分质处理和高效回用，为矿井水深度处理、厂区回用与循环利用效益核验提供可借鉴的政策要求。', selected: true },
  { id: 'R-07', title: '地下水管理条例（国务院令第748号）', source: '国务院', meta: '2021-12-01施行 · 地下水保护', excerpt: '强调地下水超采治理、污染防治和监测管理，可用于核验深部矿井水开发利用过程中的地下水环境影响与水量、水质监测要求。', selected: false },
  { id: 'R-08', title: '关于进一步加强煤炭资源开发环境影响评价管理的通知', source: '生态环境部', meta: '2020 · 煤炭开发环境管理', excerpt: '明确可利用的矿井水应合理充分利用，对矿井水外排和其他水源取用提出环境管理要求，可作为项目资源化利用与排放管理的合规依据。', selected: false },
])
const sourceMeta = {
  patent: { label: '专利', total: '238', filters: ['技术效果', '特征属性', '所有者'], tags: ['采动预测', '高盐水处理', '清浊分流', '控储净', '动态配置'] },
  paper: { label: '论文', total: '96', filters: ['发表时间', '期刊名称', '技术主题分类'], tags: ['耦合模拟', '水质演化', '分盐净化', '回采协同', '优化配置'] },
  policy: { label: '政策', total: '18', filters: ['发布机构', '政策层级', '适用地区'], tags: ['矿井水', '地下水保护', '非常规水源', '循环利用', '绿色开采'] },
}
const pointTotals = [
  { patent: '162', paper: '57', policy: '9' }, { patent: '145', paper: '48', policy: '8' }, { patent: '173', paper: '64', policy: '11' },
]

const stage = computed(() => {
  const raw = route.params.stage || 'upload'
  return stageAliases[raw] || (stages.includes(raw) ? raw : 'upload')
})
const activeThemeItems = computed(() => themeEvidence[themeSource.value])
const activePointItems = computed(() => pointEvidence[pointTab.value][pointSource.value])
const selectedEvidenceCount = computed(() => [
  ...Object.values(themeEvidence).flat(), ...pointEvidence.flatMap((group) => Object.values(group).flat()), ...policyEvidence,
].filter((item) => item.selected).length)

watch(stage, (value) => {
  const index = stages.indexOf(value)
  if (index >= 0) workflowMax.value = Math.max(workflowMax.value, index + 1)
}, { immediate: true })

function move(next) { router.push(`/innovation/researcher/${next}`) }
function selectFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploadedFile.value = { name: file.name, size: `${Math.max(file.size / 1024 / 1024, 0.1).toFixed(1)} MB` }
}
function useTemplate() {
  Object.assign(profile, originalProfile)
  uploadedFile.value = { name: `${originalProfile.name}.docx`, size: '约 0.2 MB' }
}
function removeFile() { uploadedFile.value = null }
function startFile() {
  if (!uploadedFile.value) return ui.notify('请先上传立项建议书或导入范本文件', 'warning')
  move('project')
}
function startManual() {
  if (!profile.name.trim()) return ui.notify('请填写项目名称', 'warning')
  move('project')
}
function nextStage() {
  const next = stages[stages.indexOf(stage.value) + 1] || 'report'
  if (stage.value === 'policy' && !taskRecorded.value) {
    tasks.addTask('innovation', profile.name, '创新性分析报告')
    taskRecorded.value = true
  }
  move(next)
}
function previousStage() { move(stages[stages.indexOf(stage.value) - 1] || 'upload') }
function navigateStep(step, index) { if (index + 1 <= workflowMax.value) move(step.id) }
function selectAll(items, selected) { items.forEach((item) => { item.selected = selected }) }
function toggleThemeDetail(id) { themeExpanded.value = themeExpanded.value === id ? '' : id }
function togglePointDetail(id) { pointExpanded.value = pointExpanded.value === id ? '' : id }
function exportReport() { ui.notify('已生成《煤炭资源开采过程高矿化度涌水问题研究-立项审查报告》PDF', 'success') }
</script>

<template>
  <section class="innovation-page">
    <section v-if="stage === 'upload'" class="inn-simple-launch">
      <div class="inn-simple-launch-inner">
        <header class="inn-simple-launch-title"><div class="inn-simple-mark">◎</div><div><h1>创新性分析</h1><p>从立项建议书出发，形成创新评价与立项建议。</p></div></header>
        <div class="inn-simple-mode-switch"><button :class="{ active: inputMode === 'file' }" type="button" @click="inputMode = 'file'">上传 Word</button><button :class="{ active: inputMode === 'manual' }" type="button" @click="inputMode = 'manual'">手动录入</button></div>
        <p class="inn-simple-mode-hint">{{ inputMode === 'file' ? '上传立项建议书后开始分析。' : '填写项目关键信息后开始分析。' }}</p>
        <div class="inn-simple-composer">
          <template v-if="inputMode === 'file'">
            <label v-if="!uploadedFile" class="inn-simple-dropzone"><input type="file" accept=".doc,.docx" @change="selectFile" /><i>WORD</i><b>上传立项建议书</b><small>支持 .doc、.docx 文件</small></label>
            <label v-else class="inn-simple-dropzone is-file-selected"><input type="file" accept=".doc,.docx" @change="selectFile" /><span class="inn-simple-selected-file-icon"><FileText :size="27" /></span><b>{{ uploadedFile.name }}</b><small>立项建议书　·　{{ uploadedFile.size }}　·　点击更换文件</small></label>
            <button v-if="!uploadedFile" class="inn-simple-template-link" type="button" @click="useTemplate">导入范本文件</button>
          </template>
          <div v-else class="inn-simple-manual">
            <div class="inn-simple-fields">
              <label class="inn-simple-field wide"><span>项目名称 <i>*</i></span><input v-model="profile.name" placeholder="请输入项目名称" /></label>
              <label class="inn-simple-field"><span>技术领域</span><input v-model="profile.field" placeholder="例如：矿井水资源化" /></label>
              <label class="inn-simple-field"><span>应用场景</span><input v-model="profile.scenario" placeholder="例如：深部煤矿" /></label>
              <label class="inn-simple-field wide"><span>核心技术问题</span><textarea v-model="profile.issue" placeholder="请输入待解决的核心技术问题" /></label>
              <label class="inn-simple-field wide"><span>总体技术路线</span><textarea v-model="profile.solution" placeholder="请输入研究方案或总体技术路线" /></label>
              <label class="inn-simple-field wide"><span>预期指标</span><textarea v-model="profile.breakthroughs" placeholder="请输入主要指标或预期效果" /></label>
            </div>
            <footer class="inn-simple-manual-footer"><button class="primary-btn" type="button" @click="startManual">开始分析　→</button></footer>
          </div>
        </div>
        <footer v-if="inputMode === 'file' && uploadedFile" class="inn-simple-upload-continue"><button class="inn-simple-clear" type="button" @click="removeFile">移除文件</button><button class="primary-btn" type="button" @click="startFile">开始分析　→</button></footer>
      </div>
    </section>

    <section v-else class="inn-wf-shell">
      <div class="inn-wf-layout">
        <aside class="inn-wf-nav"><h1>创新性分析</h1><div><button v-for="(item, index) in workflowSteps" :key="item.id" :class="{ active: stage === item.id, done: index + 1 < workflowMax }" :disabled="index + 1 > workflowMax" type="button" @click="navigateStep(item, index)"><i>{{ index + 1 < workflowMax ? '✓' : index + 1 }}</i><span>{{ item.label }}</span></button></div></aside>
        <main class="inn-wf-main">
          <article class="inn-wf-card">
            <section v-if="stage === 'project'" class="inn-wf-section"><div class="inn-wf-grid inn-wf-project-grid">
              <label class="inn-wf-field wide"><span>项目名称</span><input v-model="profile.name" /></label><label class="inn-wf-field wide"><span>行业领域</span><input v-model="profile.field" /></label>
              <label class="inn-wf-field"><span>项目预期产出</span><textarea v-model="profile.outputs" rows="4" /></label><label class="inn-wf-field"><span>技术指标突破</span><textarea v-model="profile.breakthroughs" rows="4" /></label>
              <label class="inn-wf-field"><span>技术问题</span><textarea v-model="profile.issue" rows="4" /></label><label class="inn-wf-field"><span>具体问题表现</span><textarea v-model="profile.manifestations" rows="4" /></label>
              <label class="inn-wf-field"><span>核心技术方案 / 创新模式</span><textarea v-model="profile.solution" rows="4" /></label><label class="inn-wf-field"><span>创新模式特点</span><textarea v-model="profile.features" rows="4" /></label>
            </div></section>

            <section v-else-if="stage === 'analysis'" class="inn-wf-section"><div class="inn-wf-grid"><label class="inn-wf-field"><span>技术问题</span><textarea v-model="profile.issue" rows="4" /></label><label class="inn-wf-field"><span>技术手段</span><textarea v-model="profile.solution" rows="4" /></label><label class="inn-wf-field"><span>技术目标 / 效果</span><textarea v-model="profile.breakthroughs" rows="4" /></label></div><div class="inn-wf-divider"><span>技术主题</span></div><div class="inn-wf-anchor-grid"><label v-for="(_, index) in scopeTopics" :key="`topic-${index}`"><i>主题 {{ index + 1 }}</i><input v-model="scopeTopics[index]" /></label></div><div class="inn-wf-divider"><span>创新点</span></div><div class="inn-wf-anchor-grid"><label v-for="(_, index) in scopePoints" :key="`point-${index}`"><i>创新点 {{ index + 1 }}</i><input v-model="scopePoints[index]" /></label></div></section>

            <section v-else-if="stage === 'themes'" class="inn-wf-section inn-wf-theme-page"><section class="inn-wf-point-recall"><header class="inn-recall-controls"><nav class="inn-recall-type-tabs"><button v-for="source in Object.keys(sourceMeta)" :key="source" :class="{ active: themeSource === source }" type="button" @click="themeSource = source; themeExpanded = ''">{{ sourceMeta[source].label }}</button></nav><div class="inn-recall-filters"><button v-for="filter in sourceMeta[themeSource].filters" :key="filter" type="button">{{ filter }}</button></div></header><div class="inn-recall-meta"><div><strong>{{ sourceMeta[themeSource].total }}</strong><span>条数据</span><small>当前展示 {{ activeThemeItems.length }} 条高相关候选</small></div><div><button type="button" @click="selectAll(activeThemeItems, true)">全选</button><button type="button" @click="selectAll(activeThemeItems, false)">清空</button><button class="inn-recall-sort" type="button">最相关</button></div></div><section class="inn-recall-results"><article v-for="(item, index) in activeThemeItems" :key="item.id" class="inn-recall-result" :class="{ 'is-selected': item.selected }"><header><span class="inn-recall-order">{{ String(index + 1).padStart(2, '0') }}</span><div class="inn-recall-title"><div class="inn-wf-theme-membership"><span v-for="topic in item.topics" :key="topic">主题{{ topic === 0 ? '一' : '二' }}</span></div><h3>{{ item.title }}<i>›</i></h3><div class="inn-recall-tags"><span v-for="tag in sourceMeta[themeSource].tags.slice(index % 3, index % 3 + 3)" :key="tag">{{ tag }}</span></div></div><label class="inn-recall-selection"><input v-model="item.selected" type="checkbox" /><span>{{ item.selected ? '已入选' : '待选择' }}</span></label></header><p><b>摘要</b>{{ item.excerpt }}</p><footer><span>{{ item.source }}</span><span>{{ item.meta }}</span><div><button type="button" @click="toggleThemeDetail(item.id)">{{ themeExpanded === item.id ? '收起详情' : '查看详情' }}</button></div></footer><div v-if="themeExpanded === item.id" class="inn-recall-detail"><b>证据摘要</b><p>{{ item.excerpt }}</p><small>请结合原文核验技术特征、适用边界与对应技术主题。</small></div></article></section></section></section>

            <section v-else-if="stage === 'points'" class="inn-wf-section inn-wf-point-page"><nav class="inn-wf-point-tabs"><button v-for="(point, index) in scopePoints" :key="point" :class="{ active: pointTab === index }" type="button" @click="pointTab = index; pointExpanded = ''"><b>创新点 {{ index + 1 }}</b><span>{{ point }}</span></button></nav><section class="inn-wf-point-recall"><header class="inn-recall-controls"><nav class="inn-recall-type-tabs"><button v-for="source in Object.keys(sourceMeta)" :key="source" :class="{ active: pointSource === source }" type="button" @click="pointSource = source; pointExpanded = ''">{{ sourceMeta[source].label }}</button></nav><div class="inn-recall-filters"><button v-for="filter in sourceMeta[pointSource].filters" :key="filter" type="button">{{ filter }}</button></div></header><div class="inn-recall-meta"><div><strong>{{ pointTotals[pointTab][pointSource] }}</strong><span>条数据</span><small>当前展示 {{ activePointItems.length }} 条高相关候选</small></div><div><button type="button" @click="selectAll(activePointItems, true)">全选</button><button type="button" @click="selectAll(activePointItems, false)">清空</button><button class="inn-recall-sort" type="button">最相关</button></div></div><section class="inn-recall-results"><article v-for="(item, index) in activePointItems" :key="item.id" class="inn-recall-result" :class="{ 'is-selected': item.selected }"><header><span class="inn-recall-order">{{ String(index + 1).padStart(2, '0') }}</span><div class="inn-recall-title"><h3>{{ item.title }}<i>›</i></h3><div class="inn-recall-tags"><span v-for="tag in sourceMeta[pointSource].tags.slice(0, 3)" :key="tag">{{ tag }}</span></div></div><label class="inn-recall-selection"><input v-model="item.selected" type="checkbox" /><span>{{ item.selected ? '已入选' : '待选择' }}</span></label></header><p><b>摘要</b>{{ item.excerpt }}</p><footer><span>{{ item.source }}</span><span>{{ item.meta }}</span><div><button type="button" @click="togglePointDetail(item.id)">{{ pointExpanded === item.id ? '收起详情' : '查看详情' }}</button></div></footer><div v-if="pointExpanded === item.id" class="inn-recall-detail"><b>证据摘要</b><p>{{ item.excerpt }}</p><small>请结合原文核验技术特征、适用边界与本创新点的关联。</small></div></article></section></section></section>

            <section v-else-if="stage === 'policy'" class="inn-wf-section inn-wf-data-section"><article class="inn-wf-data-group"><div class="inn-wf-evidence-list inn-wf-policy-list"><label v-for="item in policyEvidence" :key="item.id" class="inn-wf-evidence-card"><span class="inn-wf-evidence-top"><input v-model="item.selected" type="checkbox" /><i>政策</i></span><input v-model="item.title" /><textarea v-model="item.excerpt" rows="3" /><small>{{ item.source }}　·　{{ item.meta }}</small></label></div></article></section>

            <section v-else class="inn-wf-section inn-wf-report">
              <header class="inn-wf-report-tools"><button class="inn-wf-back" type="button" @click="move('policy')">返回</button><button class="primary-btn" type="button" @click="exportReport"><Download :size="15" />导出 PDF</button></header>
              <article class="inn-full-report">
                <header class="inn-simple-report-title"><h2>{{ profile.name }}</h2><p>创新性分析报告　·　V1.0　·　MW-2026.08.14</p></header>
                <nav class="inn-report-outline"><span>项目概况</span><span>技术主题</span><span>专利与论文</span><span>逐点对比</span><span>政策与评级</span><span>证据附录</span></nav>
                <div class="inn-simple-decision"><div><b>综合结论：建议有条件立项</b><p>项目已形成面向 {{ profile.field }} 的研究问题与技术路线。公开技术中可见若干单项方案，项目价值应聚焦于跨环节协同、矿区工况适配与工程闭环验证。</p></div><div class="inn-simple-grade"><strong>B</strong><small>综合评分 75.2</small></div></div>
                <div class="inn-simple-metrics"><div><span>领域先进性</span><b>74</b></div><div><span>趋势契合度</span><b>78</b></div><div><span>创新点新颖性</span><b>76</b></div></div>
                <section class="inn-full-section"><h3>1. 执行摘要与项目概况</h3><p class="inn-full-lead">本报告区分立项材料原文、项目预期与基于检索证据形成的分析判断；未在材料或证据中披露的信息不补写为确定性事实。</p><div class="inn-report-facts"><div><b>技术领域</b><span>{{ profile.field }}</span></div><div><b>应用场景</b><span>{{ profile.scenario }}</span></div><div class="wide"><b>核心技术问题</b><span>{{ profile.issue }}</span></div><div class="wide"><b>总体技术路线</b><span>{{ profile.solution }}</span></div><div class="wide"><b>预期指标与效果</b><span>{{ profile.breakthroughs }}</span></div></div></section>
                <section class="inn-full-section"><h3>2. 技术主题、分析方法与证据状态</h3><p class="inn-full-lead">主题体系按“项目总体技术体系—一级技术主题—二级检索专题”组织，每个主题保留问题、路线、场景、目标和原文依据。</p><table class="inn-report-table"><thead><tr><th>主题 ID</th><th>一级技术主题</th><th>拟解决问题</th><th>检索/技术路线</th><th>评价目标</th></tr></thead><tbody><tr v-for="(topic, index) in scopeTopics" :key="topic"><td>T-0{{ index + 1 }}</td><td><b>{{ topic }}</b></td><td>{{ index === 0 ? '识别深部矿井涌水量与水质的时空变化' : '缓解煤水混杂、排水压力与井下处理协同难题' }}</td><td>{{ index === 0 ? '水文地质资料融合、地下水流与水化学数值模拟' : '清浊分流、采空区储水、控—储—净一体化' }}</td><td>预测精度与模型适用边界</td></tr></tbody></table><div class="inn-report-method"><div><b>材料解析</b><small>抽取并定位项目原文</small></div><div><b>主题建模</b><small>形成主题与创新点卡片</small></div><div><b>检索取证</b><small>专利、论文、政策交叉召回</small></div><div><b>逐点对比</b><small>比较相似技术与研究进展</small></div><div><b>评级复核</b><small>保留模型、依据和调整记录</small></div></div></section>
                <section class="inn-full-section"><h3>3.1 专利检索分析</h3><p class="inn-full-lead">围绕技术问题、技术手段、目标/效果形成主题检索卡；统计口径包括公开日、申请人、受理局、技术标签和同族去重状态。年度申请量用于观察研发活跃度，不直接等同于技术价值或市场竞争地位。</p><div class="inn-report-analysis-grid"><article class="inn-report-block"><div class="inn-report-block-head"><h4>专利数量与年度分布</h4><span class="inn-report-status">10 年窗口</span></div><div class="inn-mini-chart"><span v-for="(height, index) in [28, 35, 43, 55, 68, 74, 79, 86, 93, 100]" :key="height" :style="{ height: `${height}%` }"><i>{{ ['2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'][index] }}</i></span></div><p class="inn-chart-caption">按主题合并后的申请趋势快照；最近年度需考虑公开滞后影响。</p></article><article class="inn-report-block"><div class="inn-report-block-head"><h4>技术覆盖与布局主体</h4><span class="inn-report-status">主题聚类</span></div><div class="inn-report-tags"><span>控水开采</span><span>地下水库</span><span>井下净化</span><span>分质供水</span><span>优化配置</span></div><table class="inn-report-table"><thead><tr><th>分析项</th><th>输出重点</th></tr></thead><tbody><tr><td>地域布局</td><td>按受理局统计，区分技术活动范围与申请人所在地。</td></tr><tr><td>申请人 Top5</td><td>输出近年申请趋势、代表技术路线和相关证据入口。</td></tr><tr><td>科研院所对标</td><td>按管理方指定名录补充近年技术活动曲线。</td></tr></tbody></table></article></div><table class="inn-report-table"><thead><tr><th>检索专题</th><th>查询逻辑</th><th>主要输出</th><th>复核关注点</th></tr></thead><tbody><tr v-for="topic in scopeTopics" :key="topic"><td>{{ topic }}</td><td>技术问题 + 技术手段 + 目标/效果</td><td>年度趋势、技术标签、受理局、申请人 Top5、代表专利</td><td>相关度阈值、同族去重、公开滞后</td></tr></tbody></table></section>
                <section class="inn-full-section"><h3>3.2 论文检索分析</h3><p class="inn-full-lead">论文分析用于识别研究主题、方法演进、实验/应用案例与待解决问题；与专利分析共同构成“研究活跃度—工程布局—学术前沿”的交叉判断。</p><div class="inn-report-analysis-grid"><article class="inn-report-block"><div class="inn-report-block-head"><h4>论文主题与热点</h4><span class="inn-report-status">10 年窗口</span></div><div class="inn-mini-chart"><span v-for="(height, index) in [31, 37, 48, 56, 66, 71, 80, 88, 94, 97]" :key="height" :style="{ height: `${height}%` }"><i>{{ ['2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'][index] }}</i></span></div><div class="inn-report-tags"><span>水文地质模拟</span><span>保水采煤</span><span>矿井水处理</span><span>资源化利用</span><span>优化配置</span></div><p class="inn-chart-caption">按发表年统计；新近文献存在收录积累期时，趋势需标记为参考信号。</p></article><article class="inn-report-block"><div class="inn-report-block-head"><h4>研究机构与高影响力文献</h4><span class="inn-report-status">分层筛选</span></div><table class="inn-report-table"><thead><tr><th>对象</th><th>输出内容</th></tr></thead><tbody><tr><td>技术聚类</td><td>展示主题占比、关键词共现与研究方法的关联。</td></tr><tr><td>机构分布</td><td>优先按作者单位/机构地域统计，保留多机构计数规则。</td></tr><tr><td>高影响力论文</td><td>按被引、发表时间、期刊等级等可用字段筛选并列出代表文献。</td></tr></tbody></table><p class="inn-chart-caption">若数据源不含被引或期刊等级字段，报告明确标注“未纳入影响力判断”。</p></article></div></section>
                <section class="inn-full-section"><h3>3.3 领域技术趋势总结</h3><p class="inn-full-lead">以下结论由专利、论文、政策及项目材料的交叉信号形成，用于立项辅助研判；对最近年度、样本量不足或数据可用性受限的情形，系统应同步输出不确定性说明。</p><div class="inn-trend-judgment"><article><b>快速发展期信号</b><span>结合连续年度专利/论文活跃度、主体数量和主题扩展情况判断；不以单一年度波动形成结论。</span></article><article><b>新兴技术方向</b><span>关注论文方法创新快于专利工程化布局、且出现新增主题聚类的组合信号。</span></article><article><b>成熟度与应用拓展</b><span>从代表专利和论文中归纳应用方案、场景边界、工程单元和可复用条件。</span></article><article><b>潜在技术突破点</b><span>提取高相关论文/专利中的技术难题、未解决问题和后续研究方向，形成验证清单。</span></article><article><b>项目先进性判断</b><span>项目当前价值在于“预测—控储净—动态配置”的协同闭环；先进性需由独立技术特征、现场数据、关键指标及与相似方案的逐项差异共同验证。</span></article></div></section>
                <section class="inn-full-section"><h3>4. 创新点逐项对比与创新性评估</h3><p class="inn-full-lead">每项创新点单独检索、单独对比、单独评分。候选相似证据较少不等同于技术不存在或可直接认定首创；系统仅输出基于本次检索范围的差异化判断与后续验证建议。</p><article v-for="(point, index) in scopePoints" :key="point" class="inn-full-point"><header><h4>I-0{{ index + 1 }}　{{ point }}<small>从立项材料提取的独立技术特征，按项建立检索、对比和评分卡。</small></h4><span>{{ [75, 78, 76][index] }}<small>创新性分</small></span></header><p>{{ ['将采动影响、涌水量与水化学特征纳入同一预测与调控框架。', '以清浊分流、井下储水净化和排水系统协同形成工程单元。', '面向多水源、多用户及水质分级提出动态优化配置。'][index] }}</p><div><section><b>专利对比</b><span>{{ ['相似方案重点关注地下水流模拟、涌水预测和水化学演化；需验证三类变量的耦合机制及预测改善依据。', '相似方案重点关注分流、储水或净化单项环节；需固化工艺边界、控制逻辑及连续运行指标。', '相似方案重点关注处理、供需匹配或资源配置；需验证需求侧约束、优化目标与复用路径。'][index] }}</span></section><section><b>论文进展</b><span>{{ ['论文侧重点核验模型方法、数据边界与现场应用案例。', '论文侧重点核验井下净化、储水安全与系统协同的研究进展。', '论文侧重点核验优化模型、情景设定和工程应用可迁移性。'][index] }}</span></section><section><b>判断与验证</b><span>结论以差异化技术特征、相似证据密度、工程条件和人工复核共同确定。</span></section></div></article><table class="inn-report-table"><thead><tr><th>对比维度</th><th>专利侧重点</th><th>论文侧重点</th><th>输出规则</th></tr></thead><tbody><tr><td>技术方案</td><td>技术特征、权利要求或说明书中的实现方式</td><td>研究方法、实验方案和应用案例</td><td>输出共同点、差异点与证据入口</td></tr><tr><td>性能/效果</td><td>已披露指标、工程边界与可保护特征</td><td>实验指标、适用条件与待解决问题</td><td>未披露时标记“未提供”，不推断优势</td></tr><tr><td>创新性判断</td><td colspan="3">综合相似证据密度、时间分布、差异化技术特征、可验证条件与专家复核记录形成条件性结论。</td></tr></tbody></table></section>
                <section class="inn-full-section"><h3>5.1 政策环境与适用约束</h3><p class="inn-full-lead">政策检索同时输出支持方向、适用条件与约束要求。排序综合相关度、现行有效性、政策层级、项目实施区域和适用对象，避免仅以语义相关度形成结论。</p><div class="inn-report-analysis-grid"><article class="inn-report-block"><div class="inn-report-block-head"><h4>政策覆盖与趋势</h4><span class="inn-report-status">近 3 年</span></div><div class="inn-mini-chart"><span v-for="(height, index) in [46, 59, 73, 86, 100]" :key="height" :style="{ height: `${height}%` }"><i>{{ ['2024','2025','2026','',''][index] }}</i></span></div><p class="inn-chart-caption">仅用于识别政策关注度与适用方向；不得据此推断资金、审批或工程验收结果。</p></article><article class="inn-report-block"><div class="inn-report-block-head"><h4>项目政策判断</h4><span class="inn-report-status">支持 + 约束</span></div><div class="inn-report-tags"><span>矿井水资源化</span><span>节水</span><span>生态保护</span><span>绿色开采</span><span>安全生产</span></div><p>建议将分质供水、回用率、外排控制、水害防治和典型场景合规边界纳入后续示范方案与专家审查要点。</p></article></div><div class="inn-policy-list"><div v-for="(item, index) in policyEvidence" :key="item.id"><b>P-0{{ index + 1 }}</b><span>{{ item.title }}</span><em>{{ index < 5 ? '支持/导向' : '适用/约束' }}</em></div></div></section>
                <section class="inn-full-section"><h3>5.2 审查建议与项目评级</h3><p class="inn-full-lead">审查建议汇总领域趋势、逐创新点评估和政策分析结果，给出“建议立项 / 有条件立项 / 调整后再评估 / 暂缓”的辅助意见；最终立项决定由科研管理部门和评审专家作出。</p><div class="inn-review-grid"><article><b>行业发展趋势契合度</b><span>项目方向与矿井水资源化、节水、绿色开采和智能化管理等关注方向具有衔接基础，需结合实施矿区条件落实适用边界。</span><em>基本符合</em></article><article><b>主要技术布局与研究进展</b><span>公开技术已覆盖预测、分流、储净、处理与配置等单项路线；应重点验证本项目跨环节协同机制的独立技术特征。</span><em>具备研究价值</em></article><article><b>行业机遇与挑战</b><span>机遇在于资源化利用与绿色转型需求；挑战集中在深部矿井复杂水文地质、高矿化度水质、井下安全及连续运行可靠性。</span><em>需明确验证计划</em></article></div><table class="inn-report-table inn-rating-table"><thead><tr><th>一级维度</th><th>权重</th><th>得分</th><th>评分依据</th></tr></thead><tbody><tr><td>技术领域先进性</td><td>30%</td><td>74</td><td>主题覆盖、技术活跃度、成熟度信号与主体布局</td></tr><tr><td>行业趋势契合度</td><td>25%</td><td>78</td><td>专利—论文协同信号、政策支持方向与适用约束</td></tr><tr><td>技术创新点新颖性</td><td>45%</td><td>76</td><td>逐点相似证据、技术差异、可保护特征与复核记录</td></tr><tr><td><b>项目综合分</b></td><td><b>100%</b></td><td><b>75.2</b></td><td><b>建议等级 B：有条件立项</b></td></tr></tbody></table><p class="inn-report-footnote">等级映射：A（85–100）/ B（70–84）/ C（55–69）/ D（＜55）；当数据范围不足、来源不可用或关键事实待补充时，结果应标记为“待复核”。</p></section>
                <section class="inn-full-section"><h3>附录：检索主题卡与证据留痕</h3><table class="inn-report-table"><thead><tr><th>卡片 ID</th><th>对象</th><th>查询主题/条件</th><th>时间范围与筛选</th><th>留痕内容</th></tr></thead><tbody><tr v-for="(topic, index) in scopeTopics" :key="topic"><td>Q-00{{ index + 1 }}</td><td>专利 / 论文 / 政策</td><td>{{ topic }}：问题 + 技术手段 + 目标/效果</td><td>专利/论文近 10 年；政策近 3 年</td><td>查询版本、样本量、原文入口、评分依据与人工调整记录</td></tr></tbody></table><p class="inn-simple-disclaimer">本报告由中煤深圳院 AI 创新平台基于项目材料与本报告载明的数据范围生成，用于科研立项与技术研判辅助；不构成专利查新、自由实施、法律意见、市场预测或工程验收结论。</p></section>
              </article>
            </section>
            <footer v-if="stage !== 'report'" class="inn-wf-actions"><button class="inn-wf-back" type="button" @click="previousStage">返回</button><button class="primary-btn" type="button" @click="nextStage">{{ stage === 'policy' ? '确认并生成报告' : '确认并进入下一步' }}</button></footer>
          </article>
        </main>
      </div>
    </section>
  </section>
</template>

<style scoped>
.innovation-page{min-height:100vh;background:#fff;color:#20394f}.innovation-page button,.innovation-page input,.innovation-page textarea{font-family:"Microsoft YaHei",sans-serif}.primary-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;border:1px solid #1679ad;border-radius:8px;background:#1679ad;padding:0 16px;color:#fff;font-size:13px;font-weight:700;cursor:pointer}.primary-btn:hover{background:#0f6798}.inn-simple-launch{min-height:calc(100vh - 112px);display:grid;place-items:center;padding:20px;background:radial-gradient(ellipse at 50% 40%,#e5f2fb 0%,#f7fafc 48%,#f7fafc 100%)}.inn-simple-launch-inner{width:min(900px,100%);margin:-4vh auto 0;padding:36px;border:1px solid #d8e6ee;border-radius:20px;background:linear-gradient(145deg,#fff,#f4fafd);box-shadow:0 16px 38px #173c5c0d}.inn-simple-launch-title{display:flex;align-items:center;gap:13px;margin-bottom:21px}.inn-simple-mark{width:50px;height:50px;display:grid;place-items:center;border:1px solid #cae4f0;border-radius:15px;background:#edf8fc;color:#1679ad;font-size:23px}.inn-simple-launch-title h1{margin:0;color:#163e5d;font-size:32px;letter-spacing:-.04em}.inn-simple-launch-title p{margin:5px 0 0;color:#728a9c;font-size:13px}.inn-simple-mode-switch{display:flex;gap:4px;width:max-content;margin-bottom:15px;padding:4px;border:1px solid #dce8ef;border-radius:10px;background:#f6fafc}.inn-simple-mode-switch button{border:0;border-radius:8px;background:transparent;padding:8px 13px;color:#6f8799;font-size:13px;font-weight:700;cursor:pointer}.inn-simple-mode-switch button.active{background:#e5f4fa;color:#126da3}.inn-simple-mode-hint{display:none}.inn-simple-composer{overflow:hidden;border:1px solid #d9e7ee;border-radius:16px;background:#fff;box-shadow:0 8px 20px #173c5c0a}.inn-simple-dropzone{display:grid;place-items:center;min-height:184px;padding:24px;border:1.5px dashed #c7dce7;border-radius:14px;background:#fbfdfe;text-align:center;cursor:pointer}.inn-simple-dropzone:hover{border-color:#72afd0;background:#f3fafe}.inn-simple-dropzone input{display:none}.inn-simple-dropzone i,.inn-simple-selected-file-icon{width:48px;height:54px;display:grid;place-items:center;margin-bottom:10px;border-radius:8px;background:#e8f4fa;color:#1679ad;font-size:10px;font-style:normal;font-weight:800}.inn-simple-dropzone b,.inn-simple-dropzone small{display:block}.inn-simple-dropzone b{max-width:min(86%,620px);overflow:hidden;color:#244b66;font-size:16px;text-overflow:ellipsis;white-space:nowrap}.inn-simple-dropzone small{margin-top:5px;color:#7a91a1;font-size:12px}.inn-simple-template-link{display:block;margin:12px auto;border:0;background:transparent;color:#2e75a1;font-size:12px;font-weight:700;cursor:pointer}.inn-simple-upload-continue{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:13px}.inn-simple-clear{border:0;background:transparent;padding:8px 2px;color:#8093a0;font-size:13px;cursor:pointer}.inn-simple-manual{padding:20px 21px 15px}.inn-simple-fields,.inn-wf-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.inn-simple-field,.inn-wf-field{display:grid;gap:5px;min-width:0;border:1px solid #dfe9ef;border-radius:9px;background:#fcfeff;padding:11px 12px;color:#7b91a1;font-size:11px;font-weight:700}.inn-simple-field.wide,.inn-wf-field.wide{grid-column:1/-1}.inn-simple-field i{color:#1680b2;font-style:normal}.inn-simple-field input,.inn-simple-field textarea,.inn-wf-field input,.inn-wf-field textarea{box-sizing:border-box;width:100%;border:0;outline:0;background:transparent;color:#264b65;font-size:13px;font-weight:600;line-height:1.6;resize:vertical}.inn-simple-field input,.inn-wf-field input{height:27px}.inn-simple-field textarea{min-height:46px}.inn-simple-manual-footer{display:flex;justify-content:flex-end;margin-top:14px}.inn-wf-shell{max-width:1560px;margin:0 auto;padding:8px 24px 28px}.inn-wf-layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:16px;align-items:start}.inn-wf-nav{position:sticky;top:12px;overflow:hidden;border:1px solid #d9e6ed;border-radius:14px;background:#fff;box-shadow:0 8px 22px #1d50600a}.inn-wf-nav h1{margin:0;padding:19px 18px 16px;border-bottom:1px solid #e6eef3;color:#173f5e;font-size:18px}.inn-wf-nav>div{padding:9px}.inn-wf-nav button{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:10px;width:100%;min-height:44px;border:0;border-radius:9px;background:transparent;padding:8px;color:#7890a0;text-align:left;font-size:13px;font-weight:700;cursor:pointer}.inn-wf-nav button i{width:24px;height:24px;display:grid;place-items:center;border:1px solid #d7e4eb;border-radius:50%;color:#8aa0ae;font:700 11px/1 Arial;font-style:normal}.inn-wf-nav button.active{background:#eaf7fb;color:#167cad}.inn-wf-nav button.active i{border-color:#1688c0;background:#1688c0;color:#fff}.inn-wf-nav button.done{color:#3f6d78}.inn-wf-nav button.done i{border-color:#41b18c;background:#e7f8f1;color:#198463}.inn-wf-nav button:disabled{cursor:default;opacity:.48}.inn-wf-card{display:flex;flex-direction:column;height:calc(100vh - 96px);min-height:620px;overflow:hidden;border:1px solid #d7e5ed;border-radius:14px;background:#fff;box-shadow:0 8px 22px #1d50600a}.inn-wf-section{flex:1;min-height:0;overflow-y:auto;padding:26px 28px}.inn-wf-field{border-radius:10px;padding:10px 12px 9px;color:#5c788a;font-size:12px}.inn-wf-field textarea{min-height:88px;color:#294e68;font-size:14px}.inn-wf-field:focus-within,.inn-wf-anchor-grid label:focus-within{border-color:#72bdd7;background:#fff;box-shadow:0 0 0 3px #e9f7fb}.inn-wf-divider{display:flex;align-items:center;gap:12px;margin:24px 0 13px;color:#315b75;font-size:14px;font-weight:800}.inn-wf-divider:after{height:1px;flex:1;background:#e5eef2;content:""}.inn-wf-anchor-grid{display:grid;gap:9px}.inn-wf-anchor-grid label{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;align-items:center;border:1px solid #dce8ef;border-radius:9px;background:#fbfdfe;padding:9px 10px}.inn-wf-anchor-grid i{color:#197da8;font-size:11px;font-style:normal;font-weight:800}.inn-wf-anchor-grid input{width:100%;border:0;outline:0;background:transparent;color:#294e68;font-size:13px;font-weight:600}.inn-wf-actions,.inn-wf-report-tools{display:flex;justify-content:flex-end;gap:10px;border-top:1px solid #dce8ee;padding:16px 28px;background:#fbfdfe;box-shadow:0 -10px 24px #214d6710}.inn-wf-back{min-height:40px;border:0;border-radius:8px;background:transparent;padding:0 12px;color:#627f91;font-size:13px;font-weight:700;cursor:pointer}.inn-wf-back:hover{background:#edf7fa;color:#1478aa}.inn-wf-theme-page,.inn-wf-point-page{display:grid;gap:12px}.inn-wf-point-recall{overflow:hidden;border:1px solid #dce8ef;border-radius:12px;background:#fff}.inn-recall-controls{display:flex;justify-content:space-between;align-items:center;gap:14px;border-bottom:1px solid #e3edf2;padding:14px 17px}.inn-recall-type-tabs{display:flex;gap:4px}.inn-recall-type-tabs button{border:0;border-radius:7px;background:transparent;padding:9px 11px;color:#71899a;font-size:13px;font-weight:700;cursor:pointer}.inn-recall-type-tabs button.active{background:#f3f9fc;color:#126f9f}.inn-recall-filters{display:flex;gap:7px}.inn-recall-filters button,.inn-recall-meta button,.inn-recall-result footer button{border:1px solid #d3e2ea;border-radius:7px;background:#fff;padding:6px 9px;color:#396c88;font-size:12px;cursor:pointer}.inn-recall-meta{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 18px;background:#fbfdfe}.inn-recall-meta>div:first-child{display:flex;align-items:baseline;gap:7px}.inn-recall-meta strong{color:#197e95;font-size:22px}.inn-recall-meta span{color:#42677f;font-size:12px;font-weight:700}.inn-recall-meta small{margin-left:4px;color:#7b92a1;font-size:12px}.inn-recall-meta>div:last-child{display:flex;gap:7px}.inn-recall-sort{color:#1679ad!important;font-weight:700}.inn-recall-results{padding:0 18px}.inn-recall-result{padding:16px 0;border-top:1px solid #e8eff3}.inn-recall-result:first-child{border-top:0}.inn-recall-result.is-selected{background:linear-gradient(90deg,#f9fdfe,transparent)}.inn-recall-result header{display:grid;grid-template-columns:31px minmax(0,1fr) auto;gap:11px;align-items:start}.inn-recall-order{width:24px;height:24px;display:grid;place-items:center;border-radius:6px;background:#e8f5f9;color:#167ead;font-size:10px;font-weight:800}.inn-recall-title h3{margin:0;color:#183f5c;font-size:16px;line-height:1.55}.inn-recall-title h3 i{margin-left:8px;color:#1786bd;font-size:22px;font-style:normal;font-weight:400}.inn-recall-tags,.inn-wf-theme-membership{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.inn-recall-tags span,.inn-wf-theme-membership span{border-radius:5px;background:#eff7fa;padding:3px 6px;color:#477287;font-size:10px}.inn-wf-theme-membership{margin:0 0 6px}.inn-wf-theme-membership span{border-radius:99px;background:#e4f3f8;color:#147da9;font-weight:800}.inn-recall-selection{display:inline-flex;align-items:center;gap:5px;color:#49786d;font-size:11px;font-weight:700;white-space:nowrap}.inn-recall-selection input{width:16px;height:16px;margin:0;accent-color:#1685ac}.inn-recall-result>p{margin:10px 0 0;padding-left:42px;color:#718999;font-size:12px;line-height:1.65}.inn-recall-result>p b{margin-right:7px;color:#45677c}.inn-recall-result footer{display:flex;align-items:center;gap:11px;margin-top:10px;padding-left:42px;color:#7a92a1;font-size:11px}.inn-recall-result footer span:nth-child(2){margin-left:auto}.inn-recall-detail{margin:11px 0 0 42px;border-radius:8px;background:#f5fafc;padding:10px 12px;color:#577287;font-size:12px;line-height:1.7}.inn-recall-detail p{margin:5px 0}.inn-recall-detail small{color:#7b91a0}.inn-wf-point-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:6px;border-radius:11px;background:#edf4f7}.inn-wf-point-tabs button{min-width:0;border:1px solid transparent;border-radius:8px;background:transparent;padding:11px 12px;color:#6b8596;text-align:left;cursor:pointer}.inn-wf-point-tabs b,.inn-wf-point-tabs span{display:block}.inn-wf-point-tabs b{font-size:13px}.inn-wf-point-tabs span{overflow:hidden;margin-top:4px;font-size:11px;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}.inn-wf-point-tabs button.active{border-color:#a8d5e5;background:#fff;color:#167dac;box-shadow:0 4px 12px #1d50600d}.inn-wf-data-group{overflow:hidden;border:1px solid #dce8ef;border-radius:11px}.inn-wf-evidence-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;padding:12px}.inn-wf-policy-list{grid-template-columns:1fr}.inn-wf-evidence-card{display:grid;gap:7px;border:1px solid #dce8ef;border-radius:9px;background:#fff;padding:12px}.inn-wf-evidence-top{display:flex;align-items:center;gap:7px}.inn-wf-evidence-top input{width:15px;height:15px;margin:0;accent-color:#1688c1}.inn-wf-evidence-top i{border-radius:99px;background:#eaf7fb;padding:3px 7px;color:#167baa;font-size:10px;font-style:normal;font-weight:800}.inn-wf-evidence-card>input,.inn-wf-evidence-card>textarea{width:100%;border:0;outline:0;background:transparent;color:#294e68;font-size:13px;font-weight:600;line-height:1.55}.inn-wf-evidence-card>textarea{min-height:72px;resize:vertical;color:#607b8d;font-weight:500}.inn-wf-evidence-card small{color:#8298a6;font-size:11px;line-height:1.5}.inn-wf-report{display:block;overflow:auto;background:#f8fbfc;padding:0}.inn-wf-report-tools{position:sticky;top:0;z-index:2;background:#fff}.inn-wf-report-tools .primary-btn{min-height:36px}.inn-full-report{max-width:1040px;margin:0 auto;background:#fff;padding:34px 42px 64px;color:#263d4f}.inn-simple-report-title{margin-bottom:28px}.inn-simple-report-title h2{margin:0 0 8px;color:#132d42;font-size:27px;line-height:1.35}.inn-simple-report-title p{margin:0;color:#7b91a1;font-size:12px}.inn-report-outline{display:flex;flex-wrap:wrap;gap:7px;margin:-10px 0 25px}.inn-report-outline span{border-radius:999px;background:#f1f7fa;padding:5px 8px;color:#668196;font-size:11px}.inn-simple-decision{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;margin:0 0 27px;border-left:4px solid #1687b9;background:#f0f8fc;padding:17px 19px}.inn-simple-decision b{display:block;color:#174a68;font-size:15px}.inn-simple-decision p{margin:5px 0 0;color:#5d7789;font-size:13px;line-height:1.7}.inn-simple-grade{text-align:right}.inn-simple-grade strong{display:block;color:#0f8193;font-size:33px;line-height:1}.inn-simple-grade small{color:#688394;font-size:11px}.inn-simple-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:0 0 28px}.inn-simple-metrics div{border:1px solid #dce9ef;border-top:3px solid #2287bf;border-radius:9px;padding:11px}.inn-simple-metrics div:nth-child(2){border-top-color:#1aa3a2}.inn-simple-metrics div:nth-child(3){border-top-color:#d69c2a}.inn-simple-metrics span,.inn-simple-metrics b{display:block}.inn-simple-metrics span{color:#7890a0;font-size:11px}.inn-simple-metrics b{margin-top:3px;color:#204b69;font-size:21px}.inn-full-section{margin-bottom:34px}.inn-full-section h3{display:flex;align-items:center;gap:8px;margin:0 0 13px;color:#096fc0;font-size:19px}.inn-full-section h3:before{width:4px;height:19px;border-radius:4px;background:#1687b9;content:""}.inn-full-lead{margin:0 0 14px;color:#60798b;font-size:13px;line-height:1.78}.inn-report-facts{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.inn-report-facts>div{border:1px solid #dfeaf0;border-radius:9px;background:#fbfdfe;padding:12px 13px}.inn-report-facts .wide{grid-column:1/-1}.inn-report-facts b,.inn-report-facts span{display:block}.inn-report-facts b{margin-bottom:4px;color:#2b5672;font-size:12px}.inn-report-facts span{color:#607a8d;font-size:12px;line-height:1.68}.inn-report-table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #dce7ed;border-radius:9px;overflow:hidden;font-size:12px}.inn-report-table th,.inn-report-table td{padding:10px 11px;border-right:1px solid #e2ebf0;border-bottom:1px solid #e2ebf0;color:#587286;text-align:left;vertical-align:top;line-height:1.62}.inn-report-table th{background:#eff7fb;color:#275674;font-weight:800}.inn-report-table tr:last-child td{border-bottom:0}.inn-report-table th:last-child,.inn-report-table td:last-child{border-right:0}.inn-report-method{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:14px}.inn-report-method div{position:relative;min-height:76px;border:1px solid #dce8ee;border-radius:8px;background:#fff;padding:10px}.inn-report-method b,.inn-report-method small{display:block}.inn-report-method b{color:#2a5875;font-size:12px}.inn-report-method small{margin-top:5px;color:#7890a0;font-size:11px;line-height:1.5}.inn-report-analysis-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.inn-report-analysis-grid article{border:1px solid #dfe9ef;border-radius:10px;background:#fff;padding:14px}.inn-report-analysis-grid h4{margin:0 0 9px;color:#234f6d;font-size:14px}.inn-report-analysis-grid p{margin:0;color:#607a8d;font-size:12px;line-height:1.75}.inn-mini-chart{display:flex;align-items:flex-end;gap:5px;height:98px;margin:12px 0 25px;border-bottom:1px solid #dbe7ed;padding:7px 3px 0;background:repeating-linear-gradient(to bottom,transparent 0,transparent 31px,#f0f5f7 32px)}.inn-mini-chart span{display:block;flex:1;min-width:9px;border-radius:4px 4px 0 0;background:linear-gradient(#6ec2d7,#1b82b7)}.inn-report-tags{display:flex;flex-wrap:wrap;gap:6px;margin:9px 0}.inn-report-tags span{border-radius:6px;background:#eff7fa;padding:5px 7px;color:#3f718d;font-size:11px}.inn-full-point{margin:0 0 12px;border:1px solid #dce8ef;border-radius:11px;background:#fff;padding:15px}.inn-full-point>header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}.inn-full-point h4{margin:0;color:#1c4f70;font-size:15px}.inn-full-point h4 small{display:block;margin-top:4px;color:#7690a2;font-size:11px;font-weight:400}.inn-full-point>header>span{min-width:50px;border-radius:7px;background:#edf8fa;padding:5px 7px;color:#117f91;text-align:center;font-size:16px;font-weight:800}.inn-full-point>header>span small{display:block;color:#6f8b9a;font-size:9px;font-weight:600}.inn-full-point>p{margin:0 0 11px;color:#526f82;font-size:12px;line-height:1.75}.inn-full-point>div{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.inn-full-point section{border-radius:7px;background:#f7fafc;padding:9px 10px}.inn-full-point section b,.inn-full-point section span{display:block}.inn-full-point section b{color:#315e7b;font-size:11px}.inn-full-point section span{margin-top:4px;color:#708899;font-size:11px;line-height:1.55}.inn-policy-list{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:11px 0}.inn-policy-list div{display:grid;grid-template-columns:32px 1fr auto;gap:7px;align-items:center;border:1px solid #e1ebf0;border-radius:7px;background:#fbfdfe;padding:8px 9px}.inn-policy-list b{color:#1677a7;font-size:11px}.inn-policy-list span{color:#567387;font-size:11px;line-height:1.45}.inn-policy-list em{color:#6c8c9d;font-size:10px;font-style:normal;white-space:nowrap}.inn-rating-table{margin-top:14px}.inn-simple-disclaimer{margin:14px 0 0;border-top:1px solid #e3edf2;padding-top:13px;color:#8195a3;font-size:11px!important;line-height:1.65!important}@media(max-width:980px){.inn-wf-layout{grid-template-columns:1fr}.inn-wf-nav{position:static}.inn-wf-nav>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.inn-wf-nav button{grid-template-columns:24px minmax(0,1fr);min-height:48px;font-size:11px}.inn-wf-card{height:calc(100vh - 250px);min-height:560px}}@media(max-width:720px){.inn-simple-launch{display:block;padding:24px 8px}.inn-simple-launch-inner{margin:0;padding:25px 18px}.inn-simple-launch-title h1{font-size:29px}.inn-simple-mode-switch{width:100%}.inn-simple-mode-switch button{flex:1}.inn-simple-dropzone{min-height:154px}.inn-simple-dropzone b{max-width:100%;white-space:normal}.inn-simple-upload-continue{align-items:stretch;flex-direction:column-reverse}.inn-simple-upload-continue .primary-btn{width:100%}.inn-wf-shell{padding:8px}.inn-wf-nav>div{grid-template-columns:1fr 1fr}.inn-wf-card{height:calc(100vh - 320px);min-height:520px}.inn-wf-section{padding:18px}.inn-wf-grid,.inn-wf-evidence-list,.inn-report-facts,.inn-report-analysis-grid,.inn-full-point>div,.inn-policy-list{grid-template-columns:1fr}.inn-wf-field.wide,.inn-report-facts .wide{grid-column:auto}.inn-wf-point-tabs{grid-template-columns:1fr}.inn-recall-controls,.inn-recall-meta{align-items:flex-start;flex-direction:column}.inn-recall-result header{grid-template-columns:27px minmax(0,1fr)}.inn-recall-selection{grid-column:2}.inn-recall-result>p,.inn-recall-result footer{padding-left:0}.inn-recall-result footer{align-items:flex-start;flex-direction:column}.inn-recall-result footer span:nth-child(2){margin-left:0}.inn-recall-detail{margin-left:0}.inn-full-report{padding:26px 18px 42px}.inn-simple-decision{grid-template-columns:1fr}.inn-simple-grade{text-align:left}.inn-simple-metrics{grid-template-columns:1fr}.inn-report-method{grid-template-columns:1fr 1fr}.inn-report-table{display:block;overflow-x:auto}.inn-report-table th,.inn-report-table td{min-width:110px}}
.inn-report-block-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}.inn-report-status{border-radius:999px;background:#eaf7f1;padding:4px 7px;color:#16855f;font-size:10px;font-weight:800;white-space:nowrap}.inn-mini-chart span{position:relative}.inn-mini-chart span i{position:absolute;bottom:-20px;left:50%;color:#8a9da9;font:10px Arial;font-style:normal;transform:translateX(-50%)}.inn-mini-chart span:nth-child(2n){background:linear-gradient(#9ad7e4,#4ca0c4)}.inn-chart-caption{margin:25px 0 0!important;color:#8498a5!important;font-size:11px!important;text-align:left!important}.inn-trend-judgment{display:grid;grid-template-columns:1fr 1fr;gap:9px}.inn-trend-judgment article{border-left:3px solid #2a8dbc;background:#f5fafc;padding:12px}.inn-trend-judgment article:nth-child(2){border-left-color:#22a39d}.inn-trend-judgment article:nth-child(3){border-left-color:#d69c2a}.inn-trend-judgment article:nth-child(4){border-left-color:#477eaf}.inn-trend-judgment article:nth-child(5){grid-column:1/-1;border-left-color:#7b89bb}.inn-trend-judgment b,.inn-trend-judgment span{display:block}.inn-trend-judgment b{color:#285675;font-size:12px}.inn-trend-judgment span{margin-top:5px;color:#607a8d;font-size:12px;line-height:1.65}.inn-review-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.inn-review-grid article{border:1px solid #dfe9ef;border-radius:9px;padding:13px}.inn-review-grid article:last-child{grid-column:1/-1}.inn-review-grid b,.inn-review-grid span{display:block}.inn-review-grid b{color:#275775;font-size:13px}.inn-review-grid span{margin-top:5px;color:#617c8e;font-size:12px;line-height:1.65}.inn-review-grid em{display:inline-block;margin-top:8px;border-radius:5px;background:#eef7fa;padding:3px 6px;color:#17749e;font-size:10px;font-style:normal;font-weight:800}.inn-report-footnote{margin-top:11px;color:#8194a1;font-size:11px;line-height:1.65;text-align:left}
@media(max-width:720px){.inn-trend-judgment,.inn-review-grid{grid-template-columns:1fr}.inn-trend-judgment article:nth-child(5),.inn-review-grid article:last-child{grid-column:auto}}
</style>
