<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { BookmarkCheck, BookmarkPlus, Download, FileText, FileUp } from '@lucide/vue'
import ApplicationHeading from '../components/ApplicationHeading.vue'
import { technologyTopicPaperResults } from '../data/innovationResearchResults.js'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '../stores/tasks.js'
import { useUiStore } from '../stores/ui.js'

const route = useRoute()
const router = useRouter()
const tasks = useTasksStore()
const ui = useUiStore()

const stages = ['project', 'analysis', 'research', 'report']
const stageAliases = { confirm: 'project', setup: 'project', evidence: 'research', themes: 'research', points: 'research', policy: 'research', run: 'report' }
const workflowSteps = [
  { id: 'project', label: '信息确认' },
  { id: 'analysis', label: '项目分析' },
  { id: 'research', label: '资料检索' },
  { id: 'report', label: '报告生成' },
]
const originalProfile = {
  name: '煤炭资源开采过程伴随大量高矿化度涌水问题研究',
  field: '矿山生态环境 · 矿井水处理 · 高矿化度矿井水资源化利用',
  scenario: '蒙陕矿区深部矿井（煤水混杂采场作业环境）',
  outputs: '形成发明专利 6 项、核心期刊论文 4 篇、新技术/工艺 3 项及研究报告 1 项；建成 1 项稳定运行不少于 6 个月的工业示范。',
  breakthroughs: '矿井水回用率由 62% 提升至 ≥88%；结晶盐纯度由 92% 提升至 ≥98.5%；单位处理成本由 18.6 元/m³ 降至 ≤13 元/m³；建成 1 项工业示范。',
  issue: '解决高含盐条件下的膜污堵与结垢、煤水混杂采场环境下回采推进与排水负荷的时序耦合控制、浓盐水零排放路径的经济性约束三项关键技术难题。',
  manifestations: '蒙陕矿区随开采深度增加，矿井涌水量与矿化度同步上升，部分矿井涌水含盐量达到 8,000—15,000 mg/L；常规预处理加反渗透工艺出水难以稳定达标，浓盐水与结晶盐处置缺乏成熟路径，并制约矿区水资源循环利用、达标排放和矿井生产接续。',
  solution: '采用“煤水共采协同调控与矿井水分盐资源化”技术路线，通过工作面回采、井下排水与地面处理三段联动；以回采推进度为输入动态调控井下排水系统负荷，并以两级纳滤实现一价盐与二价盐分离。',
  features: '形成适用于深部矿区高矿化度矿井水的协同调控与分盐资源化技术体系，实现高比例回用与结晶盐资源化，并建成工业示范。',
}
const profile = reactive({ ...originalProfile })
const inputMode = ref('file')
const uploadedFile = ref(null)
const workflowMax = ref(1)
const themeSource = ref('patent')
const pointSource = ref('patent')
const themeSort = ref('relevance')
const pointSort = ref('relevance')
const themePage = ref(1)
const pointPage = ref(1)
const savedResearchPanel = ref('')
const pointTab = ref(0)
const patentTopicTab = ref(0)
const researchPanel = ref('theme')
const patentPreview = ref(null)
const savedPatentCodes = ref(new Set())
let patentPreviewCloseTimer
const reportWorkflowNavCollapsed = ref(false)
const themeExpanded = ref('')
const pointExpanded = ref('')
const projectDetailsExpanded = ref(false)
const projectEditing = ref(false)
const analysisEditing = ref(false)
const taskRecorded = ref(false)
const scopeTopics = ref([
  '煤炭资源开采过程伴随大量高矿化度涌水的治理问题',
  '煤水混杂采场环境下工作面回采与井下排水的协同控制问题',
])
const scopePoints = ref([
  '煤水共采协同调控方法',
  '高含盐矿井水纳滤分盐工艺',
  '浓盐水零排放经济性优化模型',
])
const projectMetricTargets = reactive([
  { label: '矿井水回用率', current: '62%', target: '≥88%' },
  { label: '结晶盐纯度', current: '92%', target: '≥98.5%' },
  { label: '单位处理成本', current: '18.6 元/m³', target: '≤13 元/m³' },
  { label: '工业示范', current: '无', target: '1 项 / ≥6 个月' },
])
const themeAnalysisDetails = reactive([
  { keywords: '高矿化度矿井水、矿井涌水、浓盐水处理、纳滤分盐、膜污堵与结垢、结晶盐提纯' },
  { keywords: '煤水共采、井下排水调控、回采推进与排水协同、涌水量动态预测' },
])
const innovationAnalysisDetails = reactive([
  { scheme: '以工作面回采推进度为输入，动态调控井下排水系统负荷。', scenario: '煤水混杂的深部矿井采场作业环境', differentiation: '将回采推进与排水负荷耦合，区别于单一排水环节控制。', metric: '待补充：排水能耗降幅、涌水量匹配精度。' },
  { scheme: '采用两级纳滤实现一价盐与二价盐分离，并配置浓水回流。', scenario: '高矿化度矿井水地面处理段，衔接蒸发结晶工序', differentiation: '需明确与现有高相似方案的规避设计或工艺组合差异。', metric: '结晶盐纯度 ≥98.5%' },
  { scheme: '以能耗与药剂成本为约束，建立浓盐水处置路径的经济性优化模型。', scenario: '浓盐水处置工艺路线设计与运行参数调优', differentiation: '将经济性作为目标函数前置于路径选择。', metric: '单位处理成本 ≤13 元/m³' },
])

const themeEvidence = reactive({
  patent: [
    { id: 'T-P-01', title: '富水煤矿井下工作面涌水量分段预计方法、系统及设备', source: '公开专利', meta: '采动扰动 · 涌水量预测', excerpt: '以工作面分段为对象进行涌水量预计，可用于核验本项目将回采过程纳入矿井涌水预测的技术边界。', selected: true, topics: [0, 1], highlightLabel: '相关度', highlight: '83%', facts: [{ label: '公开号', value: 'CN114991872A' }, { label: '相关度', value: '83%' }, { label: '匹配方向', value: '工作面 · 涌水量' }] },
    { id: 'T-P-02', title: '一种基于煤矿大数据的矿井涌水量预测方法及系统', source: '公开专利', meta: '矿井大数据 · 动态预测', excerpt: '以煤矿数据驱动矿井涌水量预测，为项目的多源数据输入、模型训练与预测精度核验提供可比证据。', selected: true, topics: [0], highlightLabel: '相关度', highlight: '83%', facts: [{ label: '公开号', value: 'CN113742995A' }, { label: '相关度', value: '83%' }, { label: '匹配方向', value: '多源数据 · 预测' }] },
    { id: 'T-P-03', title: '一种用于煤矿井下防治水预警系统、方法及应用', source: '公开专利', meta: '水害预警 · 在线监测', excerpt: '围绕煤矿井下防治水预警建立监测和判别机制，可作为项目水量、水质协同预测与预警闭环的对照资料。', selected: true, topics: [0], highlightLabel: '相关度', highlight: '83%', facts: [{ label: '公开号', value: 'CN114046178A' }, { label: '相关度', value: '83%' }, { label: '匹配方向', value: '在线监测 · 预警' }] },
    { id: 'T-P-04', title: '煤矿区水资源优化配置方法', source: '公开专利', meta: '矿区水资源 · 优化配置', excerpt: '对矿区水资源进行优化配置，可支撑项目矿井水资源化、多水源分级供水与动态调度的方案比对。', selected: false, topics: [0, 1], highlightLabel: '相关度', highlight: '81%', facts: [{ label: '公开号', value: 'CN114565121A' }, { label: '相关度', value: '81%' }, { label: '匹配方向', value: '分质供水 · 配置' }] },
    { id: 'T-P-05', title: '一种矿井采空区水害防治方法', source: '公开专利', meta: '采空区 · 水害防治', excerpt: '针对矿井采空区水害开展防治，可用于识别项目在采动条件、调蓄边界与水害风险控制方面需要进一步区分的技术特征。', selected: false, topics: [0, 1], highlightLabel: '相关度', highlight: '82%', facts: [{ label: '公开号', value: 'CN120822699A' }, { label: '相关度', value: '82%' }, { label: '匹配方向', value: '采空区 · 水害防治' }] },
    { id: 'T-P-06', title: '一种开采扰动条件下煤矿工作面涌水量的动态预测方法', source: '公开专利', meta: '开采扰动 · 动态预测', excerpt: '将开采扰动作为工作面涌水量预测条件，可用于细化项目采动强度、预测时效与排水调控之间的关系。', selected: true, topics: [0, 1], highlightLabel: '相关度', highlight: '81%', facts: [{ label: '公开号', value: 'CN111927555A' }, { label: '相关度', value: '81%' }, { label: '匹配方向', value: '采动扰动 · 动态预测' }] },
    { id: 'T-P-07', title: '一种煤矿突水体深部异位疏导回贮方法及系统', source: '公开专利', meta: '突水体 · 回贮调蓄', excerpt: '围绕矿井突水体的疏导与回贮形成系统方案，可作为项目井下调蓄、回用和安全控制边界的对照资料。', selected: false, topics: [1], highlightLabel: '相关度', highlight: '81%', facts: [{ label: '公开号', value: 'CN121520018A' }, { label: '相关度', value: '81%' }, { label: '匹配方向', value: '回贮调蓄 · 安全控制' }] },
    { id: 'T-P-08', title: '一种煤矿采空区涌水井下深度处理方法', source: '公开专利', meta: '井下处理 · 采空区涌水', excerpt: '针对采空区涌水提出井下深度处理路径，可用于比对项目清浊分流、井下处理单元及后续资源化利用的衔接方式。', selected: false, topics: [0, 1], highlightLabel: '相关度', highlight: '80%', facts: [{ label: '公开号', value: 'CN118833951A' }, { label: '相关度', value: '80%' }, { label: '匹配方向', value: '井下处理 · 资源化' }] },
  ],
  paper: [
    { id: 'T-L-01', title: 'Time series prediction model using LSTM-Transformer neural network for mine water inflow', source: '学术论文', meta: 'Scientific Reports · 2024', excerpt: '采用 LSTM-Transformer 进行矿井涌水时间序列预测，可作为项目预测模型、时间窗口与数据组织方式的文献参照。', selected: true, topics: [0], highlightLabel: '被引', highlight: '101', facts: [{ label: 'DOI', value: '10.1038/s41598-024-69418-z' }, { label: '被引', value: '101' }, { label: '研究方向', value: '涌水预测' }] },
    { id: 'T-L-02', title: 'Application of robust deep learning models to predict mine water inflow: Implication for groundwater environment management', source: '学术论文', meta: 'Science of the Total Environment · 2023', excerpt: '比较稳健深度学习模型在矿井涌水预测中的应用，为项目模型可靠性与地下水环境管理的关联分析提供参考。', selected: true, topics: [0], highlightLabel: '被引', highlight: '50', facts: [{ label: 'DOI', value: '10.1016/j.scitotenv.2023.162056' }, { label: '被引', value: '50' }, { label: '研究方向', value: '深度学习 · 涌水' }] },
    { id: 'T-L-03', title: 'A Sequential Structure for Water Inflow Forecasting in Coal Mines Integrating Feature Selection and Multi-Objective Optimization', source: '学术论文', meta: 'IEEE Access · 2020', excerpt: '将特征选择与多目标优化引入煤矿涌水预测，可用于比对项目多参数输入、优化目标与模型评价口径。', selected: true, topics: [0, 1], highlightLabel: '被引', highlight: '13', facts: [{ label: 'DOI', value: '10.1109/ACCESS.2020.3028959' }, { label: '被引', value: '13' }, { label: '研究方向', value: '特征选择 · 优化' }] },
    { id: 'T-L-04', title: 'Predicting mine water inflow and groundwater levels for coal mining operations in the Pangpangta coalfield, China', source: '学术论文', meta: 'Environmental Earth Sciences · 2019', excerpt: '对煤矿开采中的矿井涌水与地下水位进行预测，适合用于核验水文地质条件、开采活动与预测结果之间的关系。', selected: false, topics: [0, 1], highlightLabel: '被引', highlight: '37', facts: [{ label: 'DOI', value: '10.1007/s12665-019-8098-2' }, { label: '被引', value: '37' }, { label: '研究方向', value: '地下水位 · 涌水' }] },
    { id: 'T-L-05', title: '小纪汗煤矿矿井涌水量多方法预测及分析研究', source: '学术论文', meta: '能源技术与管理 · 2025', excerpt: '采用多种方法对小纪汗煤矿涌水量进行预测和分析，可作为项目现场数据组织、方法对照与结果复核的中文案例。', selected: false, topics: [0], highlightLabel: '年份', highlight: '2025', facts: [{ label: '文献标识', value: 'JSMT202502028' }, { label: '发表', value: '2025' }, { label: '研究方向', value: '涌水量预测' }] },
    { id: 'T-L-06', title: '高矿化度矿井水处理技术及资源化利用研究', source: '学术论文', meta: '工程与管理科学 · 2025', excerpt: '聚焦高矿化度矿井水处理与资源化利用，可用于核验项目分盐处理、浓盐水减量和资源化路径的工程约束。', selected: true, topics: [0], highlightLabel: '年份', highlight: '2025', facts: [{ label: 'DOI', value: '10.12238/ems.v7i10.15762' }, { label: '发表', value: '2025' }, { label: '研究方向', value: '高盐水资源化' }] },
    { id: 'T-L-07', title: 'Summarization of methods of distinguishing sources and forecasting inflow of water inrush in coal mines', source: '学术论文', meta: 'Coal Geology & Exploration · 2012', excerpt: '归纳煤矿突水水源判别与涌水预测方法，可用于梳理本项目多源监测、模型输入与水害识别的基础方法。', selected: false, topics: [0, 1], highlightLabel: '被引', highlight: '5', facts: [{ label: '发表', value: '2012' }, { label: '被引', value: '5' }, { label: '研究方向', value: '突水判别 · 预测' }] },
    { id: 'T-L-08', title: 'Research into Mine Water Inflow Forecast Based on Chaotic Theory', source: '学术论文', meta: '中国安全生产科学技术 · 2013', excerpt: '基于混沌理论开展矿井涌水预测研究，可作为项目对比不同预测模型适用条件和数据波动处理方式的基础资料。', selected: false, topics: [0], highlightLabel: '年份', highlight: '2013', facts: [{ label: '发表', value: '2013' }, { label: '被引', value: '2' }, { label: '研究方向', value: '涌水预测模型' }] },
  ],
  policy: [
    { id: 'T-R-01', title: '关于加强矿井水保护和利用的指导意见（发改环资〔2024〕226号）', source: '国家发展改革委等八部门', meta: '2024 · 矿井水保护利用', excerpt: '提出矿井水源头保护、分质分级处理和综合利用要求，可支撑清污分流、井下储用与资源化路径的政策核验。', selected: true, topics: [0] },
    { id: 'T-R-02', title: '关于加强非常规水源配置利用的指导意见（水节约〔2023〕206号）', source: '水利部、国家发展改革委', meta: '2023 · 非常规水源配置', excerpt: '明确矿坑（井）水应纳入水资源统一配置并实行目标管理，对多水源动态配置和矿区用水协同具有直接参考意义。', selected: true, topics: [0] },
    { id: 'T-R-03', title: '工业废水循环利用实施方案（工信部联节〔2021〕213号）', source: '工业和信息化部等六部门', meta: '2021 · 分质处理回用', excerpt: '提出分质处理、高效回用和循环利用要求，可用于对照矿井水深度处理、厂区回用与零排放目标。', selected: false, topics: [0] },
    { id: 'T-R-04', title: '地下水管理条例（国务院令第748号）', source: '国务院', meta: '地下水保护 · 监测管理', excerpt: '对地下水污染防治、监测管理和开发利用提出要求，可作为采动扰动下水量、水质监测与回采排水协同的合规参考。', selected: false, topics: [1] },
  ],
  internal: [
    { id: 'T-K-01', title: '蒙陕矿区深部矿井涌水预测与水质预警应用案例', source: '内部知识库 · 矿区工程案例', meta: '案例复盘 · 2025 更新', excerpt: '汇总多个深部矿井的涌水量、水化学监测与预测模型应用记录，可用于核验采动扰动下多源数据融合、模型精度和预警边界。', selected: true, topics: [1] },
    { id: 'T-K-02', title: '高矿化度矿井水分质处理与资源化利用技术手册', source: '内部知识库 · 技术规范', meta: '工艺指引 · V2.3', excerpt: '沉淀高盐矿井水预处理、膜法分盐、浓盐水减量和副产盐处置的工程参数与运行约束，为主题一的治理路径提供内部经验依据。', selected: true, topics: [0] },
    { id: 'T-K-03', title: '煤水共采矿井“控—储—净”系统建设与运行复盘', source: '内部知识库 · 项目档案', meta: '示范项目 · 已结题', excerpt: '记录清浊分流、井下调蓄、净化回用与采场排水协同的系统设计、运行问题及优化措施，对主题二的工程闭环具有参考价值。', selected: true, topics: [1] },
    { id: 'T-K-04', title: '矿区多水源分级利用与供需平衡分析模板', source: '内部知识库 · 方法工具', meta: '分析模板 · 2026 更新', excerpt: '提供矿井水、地表水和再生水的水量水质台账、用水单元分级及优化配置测算方法，可辅助比对项目的动态调配方案。', selected: false, topics: [0] },
  ],
})

const patentAbstractByCode = {
  CN112010484A: '本发明公开了一种高矿化度高碱度的矿井水处理系统及其处理方法。该系统包括预处理、纳滤、结晶及杂盐结晶单元，能够实现高矿化度高碱度矿井水达标排放或回用，并提高资源化利用率。',
  CN111362453B: '本发明涉及高矿化度煤矿矿井水达标处理及资源化利用装置及其使用方法，包含均质调节、高密度澄清、超滤、反渗透、纳滤、蒸发浓缩与结晶等单元，以降低脱盐处理药剂消耗、提高系统可靠性和盐产品附加值。',
  CN109336323A: '本发明涉及高矿化度矿井水处理方法及系统，采用矿井水膜浓缩和蒸发结晶分盐工艺；两级浓缩后经碟管式反渗透降低后续蒸发结晶规模，并通过三效蒸发和冷冻结晶产出工业盐。',
  CN114835323A: '本发明公开一种高矿化度矿井水资源智能配置及稳定达标排放系统：来水经调节、预处理、膜脱盐、深度除杂和蒸发结晶后进入综合水池，并通过水质、水量监测与联动调配实现稳定达标排放。',
  CN209368040U: '本实用新型公开高矿化度矿井水近零排放处理及综合资源化利用系统，依次设置深度处理、浓盐水处理和蒸发结晶分盐系统；浓盐水经除硬除硅、再浓缩、膜分离和结晶分离，实现矿井水近零排放与综合回收利用。',
  CN109231632A: '本发明提供高矿化度矿井水回用及资源化利用的处理方法及系统：经预处理降低硬度并回收碳酸钙，再经两次脱盐和蒸发结晶，实现废水零排放并降低处理成本。',
  CN115263304A: '本发明公开煤铀协调开采区含矿含水层水位主动智能调控方法，通过控制煤矿涌水、注浆围堵地下水流动路径及构建水位智能调控系统，分区调节矿井水回注流量，抑制含矿含水层水位下降。',
  CN109441450A: '一种覆岩水文地质条件扰动下煤水双资源矿井开采模式，根据隔水层控水控砂性能和回灌条件，组合超前疏干、洁污水分流、矿井水分级分质利用及回灌等措施，减少采煤过程中的水资源浪费。',
  CN115615980A: '本发明提供矿井水典型离子浓度预测方法、装置及计算机设备，分别确定采动工作面、采空区和掘进巷道的涌水量及主要离子浓度，进而计算未采煤层混合矿井水中典型离子的浓度。',
  CN106968707A: '本发明公开一种煤层为主含水层矿井工作面开采水害防治设计方法，通过核算排水能力、识别局部向斜、顶板冲刷带和相邻采空区，提出相应防治水措施并提供多种突水形式预警。',
  CN114046178A: '本发明属于煤矿预警技术领域，公开煤矿井下防治水预警系统、方法及应用；通过超前探查、地下水动态监测及矿井水水源快速判别，建立水化学数据库和含水层水质判别模型，开展突水预测预警。',
  CN114491921A: '本发明公开工作面全生命周期涌水量预测方法及系统，分析回采覆岩演化、采空区涌水量与导水裂隙带及隔水层再造的关系，构建工作面回采期和回采结束后的全周期涌水量预测方法。',
}

const patentTopicEvidence = reactive([
  {
    id: 'high-mineralized-water',
    title: '高矿化度矿井涌水治理与资源化',
    total: '1,000',
    items: [
      { id: 'PT1-01', code: 'CN112010484A', relevance: '89%', title: '高矿化度高碱度的矿井水处理系统及其处理方法', match: '高矿化度 · 矿井水处理', legalStatus: '审中', assignee: '内蒙古久科康瑞环保科技有限公司', classifications: ['水处理', '纳滤分盐'], filingDate: '2020-08-11', publicationDate: '2020-12-01', selected: true },
      { id: 'PT1-02', code: 'CN111362453B', relevance: '89%', title: '一种高矿化度煤矿矿井水达标处理及资源化利用装置及其使用方法', match: '达标处理 · 资源化利用', legalStatus: '授权', assignee: '北京百灵天地环保科技股份有限公司', classifications: ['矿井水处理', '资源化利用'], filingDate: '2020-03-18', publicationDate: '2020-11-03', selected: true },
      { id: 'PT1-03', code: 'CN109336323A', relevance: '87%', title: '高矿化度矿井水处理方法及系统', match: '处理工艺 · 系统集成', legalStatus: '审中', assignee: '内蒙古伊泰广联煤化工有限责任公司；内蒙古伊泰煤炭股份有限公司', classifications: ['矿井水处理', '蒸发结晶'], filingDate: '2018-11-20', publicationDate: '2019-02-15', selected: true },
      { id: 'PT1-04', code: 'CN114835323A', relevance: '87%', title: '一种高矿化度矿井水资源智能配置及稳定达标排放系统', match: '水资源配置 · 稳定排放', legalStatus: '授权', assignee: '华能陇东能源有限责任公司；西安西热水务环保有限公司', classifications: ['深度脱盐', '稳定排放'], filingDate: '2022-04-25', publicationDate: '2022-08-02', selected: false },
      { id: 'PT1-05', code: 'CN209368040U', relevance: '87%', title: '一种高矿化度矿井水近零排放处理及综合资源化利用系统', match: '近零排放 · 综合利用', legalStatus: '有效', assignee: '中煤西安设计工程有限责任公司', classifications: ['近零排放', '水资源化'], filingDate: '2018-11-27', publicationDate: '2019-09-10', selected: true },
      { id: 'PT1-06', code: 'CN109231632A', relevance: '84%', title: '一种高矿化度矿井水回用及资源化利用的处理方法及系统', match: '回用路径 · 资源化', legalStatus: '审中', assignee: '华电水务工程有限公司', classifications: ['矿井水回用', '资源化利用'], filingDate: '2018-11-05', publicationDate: '2019-01-18', selected: false },
    ],
  },
  {
    id: 'coal-water-mining',
    title: '煤水混杂采场回采与排水协同控制',
    total: '1,000',
    items: [
      { id: 'PT2-01', code: 'CN115263304A', relevance: '86%', title: '煤铀协调开采区含矿含水层水位主动智能调控方法', match: '含水层水位 · 主动调控', legalStatus: '授权', assignee: '中国矿业大学（北京）', classifications: ['地下采矿', '矿井排水'], filingDate: '2022-07-20', publicationDate: '2022-11-01', selected: true },
      { id: 'PT2-02', code: 'CN109441450A', relevance: '82%', title: '一种覆岩水文地质条件扰动下煤水双资源矿井开采模式', match: '采动扰动 · 煤水协同', legalStatus: '驳回', assignee: '中国矿业大学（北京）等', classifications: ['煤水协同', '采动扰动'], filingDate: '2018-09-03', publicationDate: '2019-03-08', selected: true },
      { id: 'PT2-03', code: 'CN115615980A', relevance: '82%', title: '一种矿井水典型离子浓度的预测方法、装置及计算机设备', match: '水质预测 · 典型离子', legalStatus: '驳回', assignee: '中煤科工西安研究院（集团）有限公司', classifications: ['水质预测', '离子分析'], filingDate: '2022-10-19', publicationDate: '2023-01-17', selected: true },
      { id: 'PT2-04', code: 'CN106968707A', relevance: '82%', title: '一种煤层为主含水层矿井的水害防治设计方法', match: '含水层 · 水害防治', legalStatus: '授权', assignee: '中国矿业大学', classifications: ['采矿安全', '水害防治'], filingDate: '2017-04-19', publicationDate: '2017-07-21', selected: false },
      { id: 'PT2-05', code: 'CN114046178A', relevance: '80%', title: '一种用于煤矿井下防治水预警系统、方法及应用', match: '井下预警 · 防治水', legalStatus: '驳回', assignee: '云南滇东雨汪能源有限公司；四川省煤炭设计研究院', classifications: ['矿井预警', '防治水'], filingDate: '2021-09-01', publicationDate: '2022-02-15', selected: true },
      { id: 'PT2-06', code: 'CN114491921A', relevance: '78%', title: '一种工作面全生命周期涌水量预测方法及系统', match: '工作面 · 涌水预测', legalStatus: '授权', assignee: '中煤科工西安研究院（集团）有限公司', classifications: ['涌水量预测', '工作面开采'], filingDate: '2021-12-09', publicationDate: '2022-05-13', selected: false },
    ],
  },
])

const paperTopicEvidence = reactive(technologyTopicPaperResults.map((topic) => ({
  ...topic,
  items: topic.items.map((item) => ({ ...item, keywords: [...item.keywords] })),
})))

const researchDemoSuffixes = ['工艺路径比对', '关键参数优化', '工程应用验证', '运行边界研究', '系统协同控制', '资源化利用分析', '监测预警方法', '处理效能评价', '技术路线对照', '典型案例研究', '控制策略研究', '运行机制分析', '工程适配研究', '综合评估方法']
function extendResearchDemoResults(items, targetLength, prefix) {
  const seedItems = items.map((item) => ({ ...item }))
  for (let index = items.length; index < targetLength; index += 1) {
    const seed = seedItems[index % seedItems.length]
    const serial = index + 1
    const generated = {
      ...seed,
      id: `${prefix}-${String(serial).padStart(2, '0')}`,
      title: `${seed.title}（${researchDemoSuffixes[(serial - 1) % researchDemoSuffixes.length]}）`,
      selected: false,
    }
    if (seed.code) {
      generated.code = `CN11${String(408000 + serial * 97 + prefix.length * 31).padStart(6, '0')}A`
      generated.relevance = `${Math.max(62, Number.parseInt(seed.relevance, 10) - (serial % 13))}%`
      generated.filingDate = `20${16 + (serial % 10)}-${String((serial % 12) + 1).padStart(2, '0')}-${String((serial % 27) + 1).padStart(2, '0')}`
      generated.publicationDate = `20${17 + (serial % 9)}-${String(((serial + 3) % 12) + 1).padStart(2, '0')}-${String(((serial + 6) % 27) + 1).padStart(2, '0')}`
    }
    if (seed.year) generated.year = String(2016 + (serial % 11))
    items.push(generated)
  }
}
patentTopicEvidence.forEach((topic, index) => extendResearchDemoResults(topic.items, 60, `PT${index + 1}`))
paperTopicEvidence.forEach((topic, index) => extendResearchDemoResults(topic.items, 60, `PA${index + 1}`))

const pointPatentEvidence = reactive([
  {
    total: '1,000',
    items: [
      { id: 'IP1-01', code: 'CN111927555A', relevance: '88%', title: '一种开采扰动条件下煤矿工作面涌水量的动态预测方法', match: '以开采扰动为条件，对煤矿工作面涌水量进行动态预测。', legalStatus: '驳回', assignee: '南京大学', classifications: ['采矿装置', '预测'], filingDate: '2020-08-14', publicationDate: '2020-11-13', selected: true },
      { id: 'IP1-02', code: 'CN113742995A', relevance: '87%', title: '一种基于煤矿大数据的矿井涌水量预测方法及系统', match: '面向煤矿多源数据建立矿井涌水量预测方法及系统。', legalStatus: '未缴年费', assignee: '淄博矿业集团有限责任公司；济南大学', classifications: ['数据处理', '预测'], filingDate: '2021-07-28', publicationDate: '2021-12-03', selected: true },
      { id: 'IP1-03', code: 'CN112036609B', relevance: '86%', title: '基于多阶动力系统模型的煤矿工作面涌水量动态预测方法', match: '利用多阶动力系统模型描述工作面涌水量的动态变化。', legalStatus: '授权', assignee: '中煤科工西安研究院（集团）有限公司', classifications: ['采矿装置', '动态预测'], filingDate: '2020-08-07', publicationDate: '2024-05-24', selected: true },
      { id: 'IP1-04', code: 'CN115796339A', relevance: '85%', title: '矿井工作面涌水量预测方法、装置、电子设备及存储介质', match: '围绕工作面涌水量预测配置方法、装置及电子设备。', legalStatus: '实质审查', assignee: '中煤科工开采研究院有限公司；天地科技股份有限公司', classifications: ['采矿装置', '预测'], filingDate: '2022-11-10', publicationDate: '2023-03-14', selected: false },
      { id: 'IP1-05', code: 'CN108915667A', relevance: '84%', title: '基于渗透系数随分层开采动态变化的矿井涌水量预测方法', match: '将分层开采中渗透系数的变化纳入矿井涌水量预测。', legalStatus: '授权', assignee: '中煤科工西安研究院（集团）有限公司', classifications: ['采矿装置', '水文地质'], filingDate: '2018-06-27', publicationDate: '2018-11-30', selected: false },
      { id: 'IP1-06', code: 'CN118657387B', relevance: '84%', title: '一种矿井工作面及矿井相关区域实时水害评价方法及系统', match: '提供面向工作面及相关区域的实时水害评价方法与系统。', legalStatus: '授权', assignee: '中煤科工西安研究院（集团）有限公司', classifications: ['采矿装置', '水害评价'], filingDate: '2024-08-20', publicationDate: '2024-12-20', selected: false },
    ],
  },
  {
    total: '1,000',
    items: [
      { id: 'IP2-01', code: 'CN115263304B', relevance: '82%', title: '煤铀协调开采区含矿含水层水位主动智能调控方法', match: '通过矿井水回注与水位调控，支撑含水层响应的主动控制。', legalStatus: '授权', assignee: '中国矿业大学', classifications: ['地下采矿', '水位调控'], filingDate: '2022-07-20', publicationDate: '2025-09-19', selected: true },
      { id: 'IP2-02', code: 'CN120120064A', relevance: '80%', title: '近距离煤层下组煤开采顶板复合水害超前导流防治方法', match: '针对近距离煤层开采条件下的顶板复合水害进行超前导流防治。', legalStatus: '授权', assignee: '中煤科工西安研究院（集团）有限公司', classifications: ['地下采矿', '排水'], filingDate: '2025-04-07', publicationDate: '2025-06-10', selected: true },
      { id: 'IP2-03', code: 'CN109339746A', relevance: '80%', title: '一种顶板离层水与煤系气协同疏排方法', match: '将顶板离层水与煤系气纳入协同疏排方案。', legalStatus: '授权', assignee: '中国矿业大学', classifications: ['开采', '排水'], filingDate: '2018-12-07', publicationDate: '2019-02-15', selected: true },
      { id: 'IP2-04', code: 'CN119221990A', relevance: '79%', title: '利用煤矸石浆体进行采空区充填的系统及方法', match: '利用煤矸石浆体实施采空区充填，涉及采空区空间利用与调蓄条件。', legalStatus: '实质审查', assignee: '中煤能源研究院有限责任公司', classifications: ['地下采矿', '充填'], filingDate: '2024-11-11', publicationDate: '2024-12-31', selected: false },
      { id: 'IP2-05', code: 'CN119430385A', relevance: '79%', title: '一种煤矿矿井水的井下处理方法', match: '提出矿井水井下处理方法，覆盖采矿废水处理和回用单元。', legalStatus: '授权', assignee: '北京低碳清洁能源研究院；国家能源投资集团有限责任公司', classifications: ['采矿废水处理', '水处理'], filingDate: '2023-07-31', publicationDate: '2025-02-14', selected: false },
      { id: 'IP2-06', code: 'CN207686763U', relevance: '79%', title: '采空区过滤水系统', match: '在采空区设置过滤水系统，关联采空区涌水处理与排水组织。', legalStatus: '未缴年费', assignee: '鄂尔多斯市昊华精煤有限责任公司', classifications: ['采矿废水处理', '排水'], filingDate: '2018-01-12', publicationDate: '2018-08-03', selected: false },
    ],
  },
  {
    total: '1,000',
    items: [
      { id: 'IP3-01', code: 'CN119371048A', relevance: '82%', title: '一种高浊高盐矿井水分质资源化利用及零排放处理方法', match: '面向高浊高盐矿井水提出分质资源化利用及零排放处理方法。', legalStatus: '实质审查', assignee: '中建环能科技股份有限公司；济宁中建环能环境科技有限公司', classifications: ['采矿废水处理', '水软化'], filingDate: '2024-12-02', publicationDate: '2025-01-28', selected: true },
      { id: 'IP3-02', code: 'CN113896370A', relevance: '81%', title: '一种新型矿井水零排放系统及方法', match: '围绕矿井水零排放设置系统与处理方法。', legalStatus: '驳回', assignee: '西安西热水务环保有限公司；华能陇东能源有限责任公司', classifications: ['采矿废水处理', '水处理'], filingDate: '2021-11-18', publicationDate: '2022-01-07', selected: true },
      { id: 'IP3-03', code: 'CN120757194A', relevance: '80%', title: '一种基于煤电基地的高矿化矿井水全资源化利用方法', match: '针对煤电基地高矿化矿井水提出全资源化利用方法。', legalStatus: '实质审查', assignee: '淮南矿业（集团）有限责任公司；平安煤炭开采工程技术研究院有限责任公司', classifications: ['采矿废水处理', '电化学'], filingDate: '2025-05-30', publicationDate: '2025-10-10', selected: true },
      { id: 'IP3-04', code: 'CN118388069A', relevance: '78%', title: '一种矿井水废水的高效分盐除杂系统', match: '设置矿井水废水分盐除杂系统，关联膜法分盐与杂质控制。', legalStatus: '授权', assignee: '武汉净纯环保科技有限公司', classifications: ['采矿废水处理', '过滤处理'], filingDate: '2024-04-22', publicationDate: '2024-07-26', selected: false },
      { id: 'IP3-05', code: 'CN209368040U', relevance: '78%', title: '一种高矿化度矿井水近零排放处理及综合资源化利用系统', match: '将近零排放处理与综合资源化利用集成为一套系统。', legalStatus: '授权', assignee: '中煤西安设计工程有限责任公司；中煤能源研究院有限责任公司', classifications: ['采矿废水处理', '资源化利用'], filingDate: '2018-11-27', publicationDate: '2019-09-10', selected: false },
      { id: 'IP3-06', code: 'CN121085490A', relevance: '77%', title: '一种基于膜分离-诱导结晶-蒸发塘集成的高盐矿井水资源化处理方法', match: '集成膜分离、诱导结晶和蒸发塘开展高盐矿井水资源化处理。', legalStatus: '实质审查', assignee: '山东大学', classifications: ['采矿废水处理', '膜分离'], filingDate: '2025-10-29', publicationDate: '2025-12-09', selected: false },
    ],
  },
  {
    total: '1,000',
    items: [
      { id: 'IP4-01', code: 'CN112010484A', relevance: '88%', title: '高矿化度高碱度的矿井水处理系统及其处理方法', match: '采用预处理、纳滤、结晶等单元处理高矿化度高碱度矿井水。', legalStatus: '驳回', assignee: '内蒙古久科康瑞环保科技有限公司', classifications: ['采矿废水处理', '除垢和水软化'], filingDate: '2020-08-11', publicationDate: '2020-12-01', selected: true },
      { id: 'IP4-02', code: 'CN113716650A', relevance: '87%', title: '一种高矿化度矿井水脱盐装置及脱盐方法', match: '提出高矿化度矿井水脱盐装置与脱盐方法。', legalStatus: '驳回', assignee: '矿冶科技集团有限公司', classifications: ['采矿废水处理', '渗透/透析'], filingDate: '2020-05-25', publicationDate: '2021-11-30', selected: true },
      { id: 'IP4-03', code: 'CN112358103A', relevance: '87%', title: '纳滤装置、纳滤前置方式矿井水处理系统及工艺', match: '以纳滤装置和纳滤前置方式构建矿井水处理系统及工艺。', legalStatus: '驳回', assignee: '内蒙古久科康瑞环保科技有限公司', classifications: ['采矿废水处理', '纳滤'], filingDate: '2020-09-28', publicationDate: '2021-02-12', selected: true },
      { id: 'IP4-04', code: 'CN209368040U', relevance: '85%', title: '一种高矿化度矿井水近零排放处理及综合资源化利用系统', match: '通过深度处理、浓盐水处理和蒸发结晶分盐形成资源化利用系统。', legalStatus: '授权', assignee: '中煤西安设计工程有限责任公司；中煤能源研究院有限责任公司', classifications: ['采矿废水处理', '多级处理'], filingDate: '2018-11-27', publicationDate: '2019-09-10', selected: false },
      { id: 'IP4-05', code: 'CN114835323A', relevance: '85%', title: '一种高矿化度矿井水资源智能配置及稳定达标排放系统', match: '对高矿化度矿井水进行资源智能配置和稳定达标排放控制。', legalStatus: '授权', assignee: '华能陇东能源有限责任公司；西安西热水务环保有限公司', classifications: ['采矿废水处理', '过滤处理'], filingDate: '2022-04-25', publicationDate: '2022-08-02', selected: false },
      { id: 'IP4-06', code: 'CN108862768A', relevance: '84%', title: '一种矿井水资源化处理方法', match: '提出矿井水资源化处理方法，覆盖深度脱盐与资源化利用路径。', legalStatus: '驳回', assignee: '四川久远环境技术有限公司', classifications: ['水处理', '过滤处理'], filingDate: '2018-07-04', publicationDate: '2018-11-23', selected: false },
    ],
  },
])

// 三条创新点的专利首屏：逐条保留检索结果中的相关度、公开(公告)号、名称、法律状态、申请人、技术分类及日期。
// 仅使用实际检索到的首屏记录；不再以样本记录生成补位数据。
const pointPatentFirstPageRows = [
  [
    ['82%', 'CN115263304B', '煤铀协调开采区含矿含水层水位主动智能调控方法', '授权', '中国矿业大学', '地下硐室|地下采矿|地面采矿 +4', '2022-07-20', '2025-09-19'],
    ['82%', 'CN115263304A', '煤铀协调开采区含矿含水层水位主动智能调控方法', '授权', '中国矿业大学', '地下硐室|地下采矿|地面采矿 +4', '2022-07-20', '2022-11-01'],
    ['80%', 'CN120120064A', '近距离煤层下组煤开采顶板复合水害超前导流防治方法', '授权', '中煤科工西安研究院（集团）有限公司', '地下采矿|地面采矿|排水', '2025-04-07', '2025-06-10'],
    ['80%', 'CN109339746A', '一种顶板离层水与煤系气协同疏排方法', '授权', '中国矿业大学', '开采|流体|排水|瓦斯排放', '2018-12-07', '2019-02-15'],
    ['80%', 'CN109339746B', '一种顶板离层水与煤系气协同疏排方法', '授权', '中国矿业大学', '开采|流体|排水|瓦斯排放', '2018-12-07', '2020-08-25'],
    ['80%', 'CN120120064B', '近距离煤层下组煤开采顶板复合水害超前导流防治方法', '授权', '中煤科工西安研究院（集团）有限公司', '地下采矿|地面采矿|排水', '2025-04-07', '2025-12-02'],
    ['79%', 'CN119221990A', '利用煤矸石浆体进行采空区充填的系统及方法', '实质审查', '中煤能源研究院有限责任公司', '地下采矿|地面采矿|充填物 +3', '2024-11-11', '2024-12-31'],
    ['79%', 'CN119430385A', '一种煤矿矿井水的井下处理方法', '授权', '北京低碳清洁能源研究院；国家能源投资集团有限责任公司', '采矿废水处理|采矿装置|渗透/透析|水/污水处理', '2023-07-31', '2025-02-14'],
    ['79%', 'CN114687796A', '一种综合治理顶板老空水的系统', '授权', '河南理工大学', '排水', '2022-05-06', '2022-07-01'],
    ['79%', 'CN207686763U', '采空区过滤水系统', '未缴年费', '鄂尔多斯市昊华精煤有限责任公司', '采矿废水处理|水/污水处理|排水', '2018-01-12', '2018-08-03'],
    ['79%', 'CN118008296A', '煤系叠置水-煤-气资源协同开发方法', '实质审查', '中国矿业大学', '地下采矿|开采流体|地面采矿', '2023-12-28', '2024-05-10'],
    ['79%', 'CN120231589A', '一种旧采空区残留煤炭资源复采方法', '实质审查', '太原正越工程设计有限公司', '地下采矿|地面采矿|矿井/隧道的通风 +2', '2025-05-30', '2025-07-01'],
    ['79%', 'CN114215592A', '一种长壁工作面矸石与超高水材料充填绿色开采方法', '授权', '中国矿业大学', '地下采矿|充填物|地面采矿 +2', '2021-11-30', '2022-03-22'],
    ['79%', 'CN114215592B', '一种长壁工作面矸石与超高水材料充填绿色开采方法', '授权', '中国矿业大学', '地下采矿|充填物|地面采矿 +2', '2021-11-30', '2024-07-16'],
    ['78%', 'CN102061920A', '富含水矿区水解放工作面开采方法', '未缴年费', '西安科技大学', '地下采矿|地面采矿|排水', '2010-12-24', '2011-05-18'],
    ['78%', 'CN121273407A', '一种基于矿井采空区积水闭环利用的绿色充填方法', '实质审查', '安徽理工大学', '充填物', '2025-12-08', '2026-01-06'],
    ['78%', 'CN119434994B', '大倾角煤层高压水射流旋切碎煤无人采面绿色开采方法', '授权', '贵州贵能投资股份有限公司；安徽纬培矿山科技有限公司', '地下采矿|地面采矿|充填物 +2', '2024-11-13', '2025-12-02'],
    ['78%', 'CN119434994A', '大倾角煤层高压水射流旋切碎煤无人采面绿色开采方法', '授权', '贵州贵能投资股份有限公司；安徽纬培矿山科技有限公司', '地下采矿|地面采矿|充填物 +2', '2024-11-13', '2025-02-14'],
    ['78%', 'CN220081502U', '一种煤矿井下涌水清污分离排放系统', '授权', '陕西彬长胡家河矿业有限公司', '排水', '2023-01-07', '2023-11-24'],
    ['78%', 'CN117248962A', '治理小窑巷柱式遗留煤柱间老空水的方法', '授权', '太原理工大学', '采矿废水处理|水污染物|中和|水/污水处理 +2', '2023-11-20', '2023-12-19'],
  ],
  [
    ['88%', 'CN112010484A', '高矿化度高碱度的矿井水处理系统及其处理方法', '驳回一案双申', '内蒙古久科康瑞环保科技有限公司', '采矿废水处理|除垢和水软化|过滤处理 +11', '2020-08-11', '2020-12-01'],
    ['87%', 'CN113716650A', '一种高矿化度矿井水脱盐装置及脱盐方法', '驳回', '矿冶科技集团有限公司', '采矿废水处理|一般供水节约|渗透/透析|水/污水处理', '2020-05-25', '2021-11-30'],
    ['87%', 'CN112358103A', '纳滤装置、纳滤前置方式矿井水处理系统及工艺', '驳回一案双申', '内蒙古久科康瑞环保科技有限公司', '采矿废水处理|特殊处理目标|水污染物 +6', '2020-09-28', '2021-02-12'],
    ['85%', 'CN209368040U', '一种高矿化度矿井水近零排放处理及综合资源化利用系统', '授权', '中煤西安设计工程有限责任公司；中煤能源研究院有限责任公司', '采矿废水处理|一般供水节约|水/污水多级处理', '2018-11-27', '2019-09-10'],
    ['85%', 'CN114835323A', '一种高矿化度矿井水资源智能配置及稳定达标排放系统', '授权一案双申', '华能陇东能源有限责任公司；西安西热水务环保有限公司', '采矿废水处理|一般供水节约|过滤处理 +7', '2022-04-25', '2022-08-02'],
    ['85%', 'CN114835323B', '一种高矿化度矿井水资源智能配置及稳定达标排放系统', '授权一案双申', '华能陇东能源有限责任公司；西安西热水务环保有限公司', '采矿废水处理|一般供水节约|过滤处理 +9', '2022-04-25', '2023-05-23'],
    ['84%', 'CN108862768A', '一种矿井水资源化处理方法', '驳回', '四川久远环境技术有限公司', '水处理参数控制|光照|水/污水处理|过滤处理 +5', '2018-07-04', '2018-11-23'],
    ['84%', 'CN109231632A', '一种高矿化度矿井水回用及资源化利用的处理方法及系统', '撤回-视为撤回一案双申', '华电水务工程有限公司', '除垢和水软化|离子交换|水/污水处理|水/污水多级处理 +3', '2018-11-05', '2019-01-18'],
    ['84%', 'CN121085490A', '一种基于膜分离-诱导结晶-蒸发塘集成的高盐矿井水资源化处理方法', '实质审查', '山东大学', '采矿废水处理|水污染物|弥散|粒子分离 +6', '2025-10-29', '2025-12-09'],
    ['84%', 'CN105668893A', '一种高含盐工业废水分盐零排放系统', '授权一案双申质押', '内蒙古久科康瑞环保科技有限公司', '过滤处理|离子交换|水/污水处理|水/污水多级处理 +4', '2016-01-30', '2016-06-15'],
    ['84%', 'CN114477589A', '矿井水处理系统及方法', '撤回-视为撤回', '杰瑞环境工程技术有限公司', '采矿废水处理|水处理参数|水污染物 +4', '2022-01-26', '2022-05-13'],
    ['84%', 'CN207596652U', '一种高矿化度矿井水近零排放综合资源化PDCES处理系统', '授权', '中煤西安设计工程有限责任公司；中煤能源研究院有限责任公司', '一般供水节约|水/污水多级处理|被污染的地下水/沥滤液处理', '2017-11-17', '2018-07-10'],
    ['83%', 'CN111362453B', '一种高矿化度煤矿矿井水达标处理及资源化利用装置及其使用方法', '授权', '北京百灵天地环保科技股份有限公司', '采矿废水处理|一般供水节约|过滤处理 +8', '2020-03-18', '2020-11-03'],
    ['83%', 'CN111362453A', '一种高矿化度煤矿矿井水达标处理及资源化利用装置及其使用方法', '授权', '北京百灵天地环保科技股份有限公司', '采矿废水处理|一般供水节约|过滤处理 +8', '2020-03-18', '2020-07-03'],
    ['83%', 'CN111635050A', '一种高矿化度矿井水处理的方法及装置', '撤回-视为撤回一案双申', '江苏久吾高科技股份有限公司', '水/污水多级处理|渗透/透析|水/污水处理|加热水/污水处理 +2', '2019-12-16', '2020-09-08'],
    ['83%', 'CN105668893B', '一种高含盐工业废水分盐零排放系统', '授权一案双申质押', '内蒙古久科康瑞环保科技有限公司', '过滤处理|离子交换|水/污水处理|水/污水多级处理 +4', '2016-01-30', '2019-08-23'],
    ['83%', 'CN111039480B', '一种矿井水降盐的方法及装置', '授权', '江苏久吾高科技股份有限公司', '采矿废水处理|碱金属|亚硫酸盐/硫酸盐提纯|渗透/透析|水/污水处理 +5', '2019-06-27', '2025-03-04'],
    ['83%', 'CN107777803B', '一种煤矿矿井水的处理系统和处理工艺', '授权', '中煤鄂尔多斯能源化工有限公司', '采矿废水处理|过滤处理|水/污水多级处理 +5', '2016-08-25', '2021-04-02'],
    ['83%', 'CN107777803A', '一种煤矿矿井水的处理系统和处理工艺', '授权', '中煤鄂尔多斯能源化工有限公司', '采矿废水处理|过滤处理|水/污水多级处理 +5', '2016-08-25', '2018-03-09'],
    ['83%', 'CN118388069A', '一种矿井水废水的高效分盐除杂系统', '授权', '武汉净纯环保科技有限公司', '采矿废水处理|污泥处理|过滤处理 +10', '2024-04-22', '2024-07-26'],
  ],
  [
    ['82%', 'CN119371048A', '一种高浊高盐矿井水分质资源化利用及零排放处理方法', '实质审查', '中建环能科技股份有限公司；济宁中建环能环境科技有限公司', '采矿废水处理|过滤处理|水的软化 +14', '2024-12-02', '2025-01-28'],
    ['81%', 'CN113896370A', '一种新型矿井水零排放系统及方法', '驳回', '西安西热水务环保有限公司；华能陇东能源有限责任公司', '采矿废水处理|水处理参数|水污染物 +3', '2021-11-18', '2022-01-07'],
    ['80%', 'CN120757194A', '一种基于煤电基地的高矿化矿井水全资源化利用方法', '实质审查', '淮南矿业（集团）有限责任公司；平安煤炭开采工程技术研究院有限责任公司', '采矿废水处理|水污染物|电化学|水/污水处理 +1', '2025-05-30', '2025-10-10'],
    ['78%', 'CN118388069A', '一种矿井水废水的高效分盐除杂系统', '授权', '武汉净纯环保科技有限公司', '采矿废水处理|污泥处理|过滤处理 +10', '2024-04-22', '2024-07-26'],
    ['78%', 'CN209368040U', '一种高矿化度矿井水近零排放处理及综合资源化利用系统', '授权', '中煤西安设计工程有限责任公司；中煤能源研究院有限责任公司', '采矿废水处理|一般供水节约|水/污水多级处理', '2018-11-27', '2019-09-10'],
    ['77%', 'CN121085490A', '一种基于膜分离-诱导结晶-蒸发塘集成的高盐矿井水资源化处理方法', '实质审查', '山东大学', '采矿废水处理|水污染物|弥散|粒子分离 +6', '2025-10-29', '2025-12-09'],
    ['77%', 'CN114212938A', '一种矿井水资源化零排放系统及方法', '授权', '国家能源投资集团有限责任公司；国能神东煤炭集团有限责任公司；北京低碳清洁能源研究院', '采矿废水处理|一般供水节约|特殊处理目标 +4', '2021-12-15', '2022-03-22'],
    ['77%', 'CN114212938B', '一种矿井水资源化零排放系统及方法', '授权', '国家能源投资集团有限责任公司；国能神东煤炭集团有限责任公司；北京低碳清洁能源研究院', '采矿废水处理|一般供水节约|特殊处理目标 +7', '2021-12-15', '2024-01-26'],
    ['77%', 'CN114835323B', '一种高矿化度矿井水资源智能配置及稳定达标排放系统', '授权一案双申', '华能陇东能源有限责任公司；西安西热水务环保有限公司', '采矿废水处理|一般供水节约|过滤处理 +9', '2022-04-25', '2023-05-23'],
    ['77%', 'CN113526760A', '一种含盐矿井水高效复用的资源化处理系统及方法', '驳回', '国能水务环保有限公司', '采矿废水处理|一般供水节约|过滤处理 +6', '2021-05-24', '2021-10-22'],
    ['77%', 'CN114835323A', '一种高矿化度矿井水资源智能配置及稳定达标排放系统', '授权一案双申', '华能陇东能源有限责任公司；西安西热水务环保有限公司', '采矿废水处理|一般供水节约|过滤处理 +7', '2022-04-25', '2022-08-02'],
    ['76%', 'CN118388069B', '一种矿井水废水的高效分盐除杂系统', '授权', '武汉净纯环保科技有限公司', '采矿废水处理|污泥处理|过滤处理 +10', '2024-04-22', '2026-03-27'],
    ['76%', 'CN107777803B', '一种煤矿矿井水的处理系统和处理工艺', '授权', '中煤鄂尔多斯能源化工有限公司', '采矿废水处理|过滤处理|水/污水多级处理 +5', '2016-08-25', '2021-04-02'],
    ['76%', 'CN107777803A', '一种煤矿矿井水的处理系统和处理工艺', '授权', '中煤鄂尔多斯能源化工有限公司', '采矿废水处理|过滤处理|水/污水多级处理 +5', '2016-08-25', '2018-03-09'],
    ['76%', 'CN114956482A', '一种酸性矿坑/矿井水回用至煤化工的联合节水方法', '未缴年费', '昆明理工大学', '采矿废水处理|一般供水节约|过滤处理 +13', '2022-06-23', '2022-08-30'],
    ['76%', 'CN209554975U', '一种矿井水用于煤化工的零排放资源化利用系统', '授权', '中煤鄂尔多斯能源化工有限公司', '水/污水多级处理', '2019-01-22', '2019-10-29'],
    ['76%', 'CN112551790A', '一种负硬矿井水零排放处理方法', '驳回', '国能水务环保有限公司', '采矿废水处理|水污染物|过滤处理 +6', '2020-12-04', '2021-03-26'],
    ['76%', 'CN111362453B', '一种高矿化度煤矿矿井水达标处理及资源化利用装置及其使用方法', '授权', '北京百灵天地环保科技股份有限公司', '采矿废水处理|一般供水节约|过滤处理 +8', '2020-03-18', '2020-11-03'],
    ['76%', 'CN111362453A', '一种高矿化度煤矿矿井水达标处理及资源化利用装置及其使用方法', '授权', '北京百灵天地环保科技股份有限公司', '采矿废水处理|一般供水节约|过滤处理 +8', '2020-03-18', '2020-07-03'],
    ['75%', 'CN112010484A', '高矿化度高碱度的矿井水处理系统及其处理方法', '驳回一案双申', '内蒙古久科康瑞环保科技有限公司', '采矿废水处理|除垢和水软化|过滤处理 +11', '2020-08-11', '2020-12-01'],
  ],
]

const pointPatentEvidenceIndex = [1, 3, 2]
pointPatentFirstPageRows.forEach((rows, pointIndex) => {
  const evidence = pointPatentEvidence[pointPatentEvidenceIndex[pointIndex]]
  evidence.items.splice(0, evidence.items.length, ...rows.map(([relevance, code, title, legalStatus, assignee, classifications, filingDate, publicationDate], index) => ({
    id: `IPP${pointIndex + 1}-${String(index + 1).padStart(2, '0')}`,
    relevance,
    code,
    title,
    legalStatus,
    assignee,
    classifications: classifications.split('|'),
    filingDate,
    publicationDate,
    match: `法律状态：${legalStatus}；当前申请人/权利人：${assignee}；技术分类：${classifications.replaceAll('|', '、')}；申请日：${filingDate}；公开日：${publicationDate}`,
    selected: index < 3,
  })))
})

const pointPaperEvidence = reactive([
  {
    total: '5',
    items: [
      { id: 'IL1-01', title: 'Dynamic prediction method and application of mine water inflow based on mining rock mass seepage theory', year: '2026', authors: '杜锋 · 鲁鹏涛 · 李振华 · 马丹 等', outlet: 'Journal of China Coal Society, 51(4), 2323–2344', identifier: '10.13225/j.cnki.jccs.WA25.0697', identifierLabel: 'DOI', abstract: '基于采动岩体渗流理论开展矿井涌水量动态预测，并给出工程应用验证。', keywords: ['采动渗流', '动态预测'], selected: true },
      { id: 'IL1-02', title: 'Time series prediction model using LSTM-Transformer neural network for mine water inflow', year: '2024', authors: 'Junwei Shi · Shiqi Wang · Pengfei Qu · Jianli Shao', outlet: 'Scientific Reports, 14, 18284', identifier: '10.1038/s41598-024-69418-z', identifierLabel: 'DOI', abstract: '采用 LSTM-Transformer 建立矿井涌水时间序列预测模型。', keywords: ['涌水预测', 'LSTM-Transformer'], selected: true },
      { id: 'IL1-03', title: 'Application of robust deep learning models to predict mine water inflow: Implication for groundwater environment management', year: '2023', authors: 'Songlin Yang · Huiqing Lian · Bin Xu 等', outlet: 'Science of the Total Environment, 871, 162056', identifier: '10.1016/j.scitotenv.2023.162056', identifierLabel: 'DOI', abstract: '比较稳健深度学习模型在矿井涌水预测与地下水环境管理中的适用性。', keywords: ['深度学习', '地下水管理'], selected: true },
      { id: 'IL1-04', title: 'A Sequential Structure for Water Inflow Forecasting in Coal Mines Integrating Feature Selection and Multi-Objective Optimization', year: '2020', authors: 'Shi Chen · Shuning Dong', outlet: 'IEEE Access, 8, 183619–183632', identifier: '10.1109/ACCESS.2020.3028959', identifierLabel: 'DOI', abstract: '将特征选择和多目标优化结合，用于煤矿涌水预测。', keywords: ['特征选择', '多目标优化'], selected: false },
      { id: 'IL1-05', title: 'Prediction of mine water inflow from multi-source recharge: based on multi-scale time-frequency features and lag mechanism', year: '2026', authors: 'Yun Bai · Qiang Wu · Peitao Li', outlet: 'Journal of Hydrology, 667, 134927', identifier: '10.1016/j.jhydrol.2026.134927', identifierLabel: 'DOI', abstract: '考虑多水源动态耦合和滞后效应，建立矿井涌水量非线性预测模型。', keywords: ['多水源', '滞后机制'], selected: false },
    ],
  },
  {
    total: '5',
    items: [
      { id: 'IL2-01', title: '五阳煤矿煤水共采及矿井水资源化研究', year: '2025', authors: '郑丽萍 · 蒋宇程 · 刘万成 · 王骞 等', outlet: '煤炭技术, 44(04), 149–153', identifier: '10.13301/j.cnki.ct.2025.04.028', identifierLabel: 'DOI', abstract: '结合五阳煤矿地质、水文地质与涌水条件，提出煤水共采与矿井水资源化利用方案。', keywords: ['煤水共采', '资源化利用'], selected: true },
      { id: 'IL2-02', title: 'On the Coordinated Development of Coal-Water-Soil Multiple Resources', year: '2024', authors: 'Wang Shuangming · Sun Qiang · Yuan Shihao 等', outlet: 'Northwestern Geology, 57(5), 1–10', identifier: '10.12401/j.nwg.2024069', identifierLabel: 'DOI', abstract: '从煤、水、土多资源的时空组合和动态耦合响应出发，讨论协同开发与调控。', keywords: ['煤水协同', '动态耦合'], selected: true },
      { id: 'IL2-03', title: 'Water Supply and Regulation of Underground Reservoir in Coal Mine considering Coal-Water Occurrence Relationship', year: '2022', authors: 'Mingbo Chi · Zhiguo Cao · Quansheng Li · Yong Zhang 等', outlet: 'Geofluids, 2022, 2892964', identifier: '10.1155/2022/2892964', identifierLabel: 'DOI', abstract: '构建流固耦合模型，分析采动扰动下含水层变化及地下水库的调蓄方法。', keywords: ['地下水库', '调蓄'], selected: true },
      { id: 'IL2-04', title: 'Simulation of mine water inflow and gas emission during longwall mining', year: '2009', authors: 'H. Guo · D. P. Adhikary · M. S. Craig', outlet: 'Rock Mechanics and Rock Engineering, 42(1), 25–51', identifier: '10.1007/s00603-008-0168-9', identifierLabel: 'DOI', abstract: '模拟长壁开采中岩体变形、矿井涌水和瓦斯运移的耦合过程。', keywords: ['长壁开采', '涌水模拟'], selected: false },
      { id: 'IL2-05', title: 'Coal mine water management: optimization models and field application in North China', year: '2010', authors: 'Qiang Wu · Bill X. Hu · Li Wan · Chunmiao Zheng', outlet: 'Hydrological Sciences Journal, 55(4), 609–623', identifier: '10.1080/02626661003798310', identifierLabel: 'DOI', abstract: '将地下水数值模拟与优化模型结合，统筹矿井排水、供水和环境保护目标。', keywords: ['排水调度', '优化模型'], selected: false },
    ],
  },
  {
    total: '5',
    items: [
      { id: 'IL3-01', title: '高矿化度矿井水纳滤膜适度脱盐技术研究', year: '2021', authors: '葛光荣 · 吴一平 · 张全', outlet: '煤炭科学技术, 49(3), 208–214', identifier: '10.13199/j.cnki.cst.2021.03.029', identifierLabel: 'DOI', abstract: '提出针对微咸矿井水分级分质回用的纳滤适度脱盐工艺，讨论脱盐率、能耗和膜污染约束。', keywords: ['纳滤脱盐', '分级回用'], selected: true },
      { id: 'IL3-02', title: '高矿化度矿井水处理技术及资源化利用研究', year: '2025', authors: '张春海', outlet: '工程与管理科学, 7(10)', identifier: '10.12238/ems.v7i10.15762', identifierLabel: 'DOI', abstract: '分析高矿化度矿井水处理技术和水、矿物质资源化利用路径。', keywords: ['高矿化度', '资源化'], selected: true },
      { id: 'IL3-03', title: '矿井水水化学特征及生态复用研究——以山西省西山矿区为例', year: '2025', authors: '杜珍妮 · 张家贵 · 马彦彪 · 王益 等', outlet: '现代地质, 39(5), 1363–1372', identifier: '10.19657/J.GEOSCIENCE.1000-8527.2025.053', identifierLabel: 'DOI', abstract: '分析高矿化度矿井水水化学特征、盐害风险与生态复用潜力。', keywords: ['水化学', '生态复用'], selected: true },
      { id: 'IL3-04', title: '煤矿矿井水处理和资源化利用的关键问题及对策', year: '2025', authors: '薛罡 · 刘建奇 · 强志斌 · 王永刚 等', outlet: '工业水处理', identifier: '10.19965/j.cnki.iwt.2024-0560', identifierLabel: 'DOI', abstract: '总结纳滤膜脱盐回用等低碳低成本方向，并讨论矿井水资源化综合利用模式。', keywords: ['纳滤膜', '综合利用'], selected: false },
      { id: 'IL3-05', title: '高矿化度矿井水处理综述', year: '2021', authors: '余欢', outlet: '环境保护前沿, 11(2), 299–303', identifier: '10.12677/AEP.2021.112031', identifierLabel: 'DOI', abstract: '综述高矿化度矿井水的处理方法、脱盐机理与技术选择。', keywords: ['脱盐机理', '工艺选择'], selected: false },
    ],
  },
  {
    total: '5',
    items: [
      { id: 'IL4-01', title: '内蒙古西部干旱地区煤矿反渗透浓盐水的综合利用', year: '2023', authors: '孙红福 · 吴叶琪 · 赵峰华 · 权琳 等', outlet: '煤炭学报, 48(12), 4512–4520', identifier: '10.13225/j.cnki.jccs.2023.0361', identifierLabel: 'DOI', abstract: '比较浓盐水排海、蒸发池浓缩、零排放和离子提取等路径，并评估资源回收的经济可行性。', keywords: ['浓盐水', '经济性'], selected: true },
      { id: 'IL4-02', title: 'Research Progress on Zero Discharge and Resource Utilization of Industrial High-Salt Wastewater', year: '2021', authors: 'Dan Liu · Qiongqiong Liu · Y. Zhang', outlet: 'Clean – Soil, Air, Water, 49, 2000410', identifier: '10.1002/clen.202000410', identifierLabel: 'DOI', abstract: '综述高盐废水零排放与资源化路径，重点讨论浓缩结晶耦合工艺。', keywords: ['零排放', '高盐废水'], selected: true },
      { id: 'IL4-03', title: 'Membrane distillation crystallization for brine mining and zero liquid discharge: opportunities, challenges, and recent progress', year: '2019', authors: 'Youngkwon Choi · Gayathri Naidu · Long D. Nghiem · Sangho Lee · Saravanamuthu Vigneswaran', outlet: 'Environmental Science: Water Research & Technology, 5, 1202–1221', identifier: '10.1039/C9EW00157C', identifierLabel: 'DOI', abstract: '评述膜蒸馏结晶用于高盐浓液资源化和零排放的技术机会与结垢控制挑战。', keywords: ['膜蒸馏结晶', '盐资源化'], selected: true },
      { id: 'IL4-04', title: 'Research on Multi-Level Scheduling of Mine Water Reuse Based on Improved Whale Optimization Algorithm', year: '2022', authors: 'Lei Bo · Zhihan Li · Yang Liu · Yiying Wang 等', outlet: 'Sensors, 22(14), 5164', identifier: '10.3390/s22145164', identifierLabel: 'DOI', abstract: '以回用效率和成本为目标，构建矿井水多层级优化调度模型。', keywords: ['分级调度', '运行成本'], selected: false },
      { id: 'IL4-05', title: 'Coal mine water management: optimization models and field application in North China', year: '2010', authors: 'Qiang Wu · Bill X. Hu · Li Wan · Chunmiao Zheng', outlet: 'Hydrological Sciences Journal, 55(4), 609–623', identifier: '10.1080/02626661003798310', identifierLabel: 'DOI', abstract: '将地下水数值模拟与优化模型结合，统筹矿井排水、供水和环境保护目标。', keywords: ['优化模型', '供需约束'], selected: false },
    ],
  },
])

const pointPaperEvidenceIndex = [1, 2, 3]

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
  'I1-K-01': ['内部知识库 · 矿区工程案例', '沉淀深部矿井涌水量预测模型的输入变量、校验周期与误差复盘记录，可用于核验多源数据融合路线。', true],
  'I1-K-02': ['内部知识库 · 技术方案', '记录水质在线监测、异常阈值和预警联动规则，为水量—水质协同预测的工程部署提供内部参照。', true],
  'I1-K-03': ['内部知识库 · 专家复盘', '归纳复杂水文地质条件下模型迁移、样本缺口与人工复核的常见问题，提示本创新点需要验证的边界。', false],
  'I2-P-01': ['创新点 2 · 专利候选', '针对煤水混杂来水按浊度和污染负荷实施分流处理，为本项目清水比例提升和浊水减量提供工艺对比。', true],
  'I2-P-02': ['创新点 2 · 专利候选', '将井下储水、净化与回用控制单元集成布置，可用于核验控—储—净一体化的单元衔接与运行边界。', true],
  'I2-P-03': ['创新点 2 · 专利候选', '利用采空区调蓄矿井水并按照水质等级回用，适合对比项目井下储水方案与采场安全控制条件。', false],
  'I2-L-01': ['创新点 2 · 论文候选', '分析工作面推进、采场积水和排水负荷的联动关系，支撑煤水共采条件下回采与排水协同控制的技术比较。', true],
  'I2-L-02': ['创新点 2 · 论文候选', '研究采空区调蓄、井下净化和回用之间的运行机制，可用于核验井下控—储—净方案的工程可行性。', true],
  'I2-L-03': ['创新点 2 · 论文候选', '比较不同水质分流后的处理单元与负荷分配，为项目清浊分流系统优化提供工艺参数参考。', false],
  'I2-R-01': ['国家发展改革委等八部门', '提出推进矿井水分质分级处理与综合利用，对清污分流、井下储用及处理单元协同具有直接指引作用。', true],
  'I2-R-02': ['生态环境部', '要求合理充分利用矿井水并加强外排管理，可作为煤水共采条件下矿井水处理、回用与排放的合规参考。', false],
  'I2-R-03': ['自然资源主管部门', '强调资源节约集约利用和生态环境保护，为煤水共采、井下储水净化与绿色开采协同设计提供评价参考。', false],
  'I2-K-01': ['内部知识库 · 示范项目档案', '记录煤水混杂工况下清浊分流的设备配置、控制阈值和水量平衡，可用于对比项目的分流逻辑。', true],
  'I2-K-02': ['内部知识库 · 运行复盘', '汇总井下储水、净化与回用单元的运行数据和风险处置经验，为“控—储—净”一体化方案提供工程依据。', true],
  'I2-K-03': ['内部知识库 · 技术评审纪要', '归纳采空区调蓄与采场安全协同的关键审查点，可辅助明确方案的适用边界和验证条件。', false],
  'I3-P-01': ['创新点 3 · 专利候选', '依据用水水质要求、供水能力和输配条件配置不同水源，可用于对照项目分质供水与多用户匹配逻辑。', true],
  'I3-P-02': ['创新点 3 · 专利候选', '将处理后矿井水按水质等级用于生产、生态和辅助用水，为全复用目标和资源化路径提供技术参照。', true],
  'I3-P-03': ['创新点 3 · 专利候选', '以供需变化、水质等级和管网能力为约束进行动态调配，可用于核验矿区水资源优化配置方案。', false],
  'I3-L-01': ['创新点 3 · 论文候选', '构建不同水源与用户需求的供需匹配模型，可用于比较动态配置目标、约束条件和评价指标。', true],
  'I3-L-02': ['创新点 3 · 论文候选', '从替代常规水、减排和运行成本等角度评价矿井水梯级利用，为资源化效益核验提供参考。', true],
  'I3-L-03': ['创新点 3 · 论文候选', '围绕工业用水与生态补水的水质要求开展匹配分析，可用于完善项目分质供水和全复用方案。', false],
  'I3-R-01': ['水利部、国家发展改革委', '明确矿坑（井）水应纳入水资源统一配置并实行目标管理，对多水源动态配置和非常规水源利用具有直接指导意义。', true],
  'I3-R-02': ['国家发展改革委等部门', '提出推动污水资源化、工业利用和生态补水，可作为矿井水处理后分级利用与资源化效益的上位政策依据。', true],
  'I3-R-03': ['国家发展改革委、水利部', '提出推进矿井水等非常规水源的多元、梯级、安全利用，支撑矿区水资源全复用和分质供水目标。', false],
  'I3-K-01': ['内部知识库 · 配置方案库', '收录多水源、多用户条件下的分质供水方案与水质等级划分规则，可作为动态优化配置的内部对标案例。', true],
  'I3-K-02': ['内部知识库 · 效益测算模型', '提供矿井水梯级利用的水量平衡、运行成本和替代效益测算口径，支撑资源化路径的可验证性分析。', true],
  'I3-K-03': ['内部知识库 · 项目复盘', '总结工业用水、生态补水等不同场景的水质匹配及管网约束，为全复用目标的实施边界提供参考。', false],
}

const pointEvidence = reactive([
  {
    patent: [
      ['I1-P-01', '基于采动影响因子的矿井涌水量预测方法', '采动响应 · 涌水预测'], ['I1-P-02', '矿井水水质在线监测与趋势预警系统', '水质在线 · 趋势预警'], ['I1-P-03', '深部矿井水害多参数联合预警方法', '多参数预警 · 深部矿井'],
    ], paper: [
      ['I1-L-01', '采动扰动下矿井涌水量时序预测模型研究', '时序建模 · 涌水量'], ['I1-L-02', '深部矿井水文地质参数变化对水质演化的影响', '水质演化 · 水文地质'], ['I1-L-03', '矿井涌水量—水质耦合预测方法综述', '耦合预测 · 方法综述'],
    ], policy: [
      ['I1-R-01', '关于深入推进矿山智能化建设促进矿山安全发展的指导意见（矿安〔2024〕42号）', '2024 · 智能感知预警'], ['I1-R-02', '煤矿安全生产条例', '矿井安全 · 风险防控'], ['I1-R-03', '矿山安全生产治本攻坚三年行动方案（2024—2026年）', '风险监测 · 隐患治理'],
    ], internal: [
      ['I1-K-01', '蒙陕矿区深部矿井涌水预测模型应用案例', '工程案例 · 模型校验'], ['I1-K-02', '矿井水水质在线监测与预警联动技术方案', '技术方案 · 预警联动'], ['I1-K-03', '复杂水文地质条件下预测模型专家复盘纪要', '专家复盘 · 适用边界'],
    ],
  },
  {
    patent: [
      ['I2-P-01', '煤水共采条件下矿井水清浊分流方法', '煤水共采 · 清浊分流'], ['I2-P-02', '井下储水净化一体化系统及控制方法', '井下储水 · 控储净'], ['I2-P-03', '采空区矿井水储存与分质回用方法', '采空区储水 · 分质回用'],
    ], paper: [
      ['I2-L-01', '煤水共采矿井工作面回采与排水协同控制研究', '回采协同 · 排水控制'], ['I2-L-02', '采空区储水与井下净化协同机制研究', '储水净化 · 协同运行'], ['I2-L-03', '清浊分流条件下矿井水处理工艺优化', '清浊分流 · 工艺优化'],
    ], policy: [
      ['I2-R-01', '关于加强矿井水保护和利用的指导意见（发改环资〔2024〕226号）', '2024 · 分质处理利用'], ['I2-R-02', '关于进一步加强煤炭资源开发环境影响评价管理的通知', '煤炭开发 · 矿井水管理'], ['I2-R-03', '绿色矿山建设评价指标', '绿色开采 · 资源利用'],
    ], internal: [
      ['I2-K-01', '煤水共采矿井清浊分流系统示范项目档案', '项目档案 · 分流控制'], ['I2-K-02', '井下“控—储—净”一体化系统运行复盘', '运行复盘 · 协同运行'], ['I2-K-03', '采空区储水与采场安全协同技术评审纪要', '评审纪要 · 安全边界'],
    ],
  },
  {
    patent: [
      ['I3-P-01', '面向矿区多水源的水质分级供水优化方法', '多水源 · 分级供水'], ['I3-P-02', '矿井水资源化梯级利用系统及方法', '梯级利用 · 资源化'], ['I3-P-03', '矿区水资源供需动态调配系统', '供需匹配 · 动态调配'],
    ], paper: [
      ['I3-L-01', '多水源多用户条件下矿区水资源优化配置研究', '优化配置 · 多用户'], ['I3-L-02', '矿井水资源化梯级利用效益评价研究', '梯级利用 · 效益评价'], ['I3-L-03', '工业—生态联合用水水质匹配方法研究', '分质供水 · 水质匹配'],
    ], policy: [
      ['I3-R-01', '关于加强非常规水源配置利用的指导意见（水节约〔2023〕206号）', '2023 · 统一配置'], ['I3-R-02', '关于推进污水资源化利用的指导意见（发改环资〔2021〕13号）', '2021 · 资源化利用'], ['I3-R-03', '国家节水行动方案（发改环资规〔2019〕695号）', '节水 · 非常规水源'],
    ], internal: [
      ['I3-K-01', '矿区多水源分质供水与优化配置方案库', '方案库 · 多水源配置'], ['I3-K-02', '矿井水梯级利用效益测算模型与应用指引', '方法工具 · 效益测算'], ['I3-K-03', '矿区水资源全复用项目复盘报告', '项目复盘 · 场景边界'],
    ],
  },
].map((point) => Object.fromEntries(Object.entries(point).map(([type, values]) => [type, values.map(([id, title, meta]) => {
  const [source, excerpt, selected] = pointEvidenceDetails[id]
  return { id, title, meta, source, excerpt, selected }
})]))))

const themeSupplementalEvidence = {
  patent: [
    ['T-P-05', '矿井水高盐浓缩液分级处理与结晶盐提纯方法', '浓缩结晶 · 盐品质控制', '围绕高盐浓缩液的预处理、分级浓缩和结晶盐提纯建立工艺组合，可补充核验项目两级纳滤与副产盐资源化之间的衔接关系。', [0]],
    ['T-P-06', '采掘工作面涌水量动态预测与排水负荷调节系统', '采掘推进 · 负荷调节', '将采掘进度、涌水量和排水设备工况纳入联动控制，可用于比较项目中回采推进度作为控制输入的差异化设计。', [1]],
  ],
  paper: [
    ['T-L-05', '高盐矿井水膜法深度处理运行边界与结垢风险研究', '膜运行 · 结垢风险', '梳理纳滤与反渗透在高矿化度矿井水中的通量衰减、结垢控制和清洗周期，为项目工艺稳定性指标提供文献参照。', [0]],
    ['T-L-06', '采煤扰动下矿井排水系统负荷时序响应分析', '采动响应 · 负荷曲线', '以工作面推进和井下涌水响应为主线分析排水负荷的时序变化，可用于佐证采排协同控制的必要性。', [1]],
  ],
  policy: [
    ['T-R-05', '黄河流域生态环境保护规划（2021—2030年）', '流域约束 · 水资源保护', '对黄河流域水资源节约集约利用与生态保护提出要求，可补充核验矿区矿井水资源化利用的区域政策边界。', [0]],
    ['T-R-06', '绿色矿山建设评价指标', '绿色开采 · 循环利用', '将资源节约、环境治理与矿井水综合利用纳入评价框架，可作为煤水共采、采场排水协同和绿色矿区效益的支撑依据。', [1]],
    ['T-R-07', '关于深入推进矿山智能化建设促进矿山安全发展的指导意见（矿安〔2024〕42号）', '智能矿山 · 预测预警', '提出环境智能感知、系统智能联动和重大灾害风险预警能力建设，可支撑采动扰动下涌水预测、排水联控与风险处置设计。', [1]],
    ['T-R-08', '关于进一步加强煤炭资源开发环境影响评价管理的通知', '煤炭开发 · 矿井水管理', '明确可利用矿井水应合理充分利用，并对外排与取用提出环境管理要求，可作为回采排水协同和矿井水处置的合规依据。', [1]],
  ],
  internal: [
    ['T-K-05', '矿井水膜系统故障模式与运维知识图谱', '运维知识 · 故障模式', '汇总膜污染、结垢、清洗和药剂投加等故障模式及处置记录，可补充识别两级纳滤系统的运行风险与验证点。', [0]],
    ['T-K-06', '西北矿区采排协同调度参数复用清单', '调度参数 · 可复用经验', '沉淀采掘推进、涌水预测和排水设备联控的参数配置与复盘结论，可为煤水共采协同控制提供内部工程参照。', [1]],
  ],
}

Object.entries(themeSupplementalEvidence).forEach(([source, items]) => {
  themeEvidence[source].push(...items.map(([id, title, meta, excerpt, topics]) => ({
    id, title, meta, excerpt, topics, selected: false,
    source: source === 'patent' ? '主题检索 · 专利候选' : source === 'paper' ? '主题检索 · 论文候选' : source === 'policy' ? '政策法规库 · 条款关联' : '内部知识库 · 结构化经验',
  })))
})

const pointSupplementalProfiles = {
  patent: [
    ['关联专利同族与权利要求要素比对', '同族簇 · 权利要求'],
    ['矿井水治理关键控制单元组合方法', '技术单元 · 组合关系'],
    ['工程运行参数约束下的处理系统优化方案', '运行参数 · 优化控制'],
  ],
  paper: [
    ['工程机理与运行边界研究进展', '研究进展 · 方法对照'],
    ['关键参数影响与性能评价模型研究', '性能评价 · 参数敏感性'],
    ['矿区水处理工程应用案例综述', '工程案例 · 应用验证'],
  ],
  policy: [
    ['矿井水资源化利用与绿色开采政策要求', '政策要求 · 适用边界'],
    ['非常规水源配置与循环利用条款解读', '条款解读 · 合规要点'],
    ['矿山生态环境治理项目审查指引', '审查指引 · 风险提示'],
  ],
  internal: [
    ['同类矿区工程实施台账与效益复盘', '工程台账 · 效益复盘'],
    ['技术评审专家意见与问题闭环记录', '专家意见 · 闭环记录'],
    ['项目方案版本差异与参数校验记录', '方案版本 · 参数校验'],
  ],
}

pointEvidence.forEach((group, pointIndex) => {
  Object.entries(pointSupplementalProfiles).forEach(([source, profiles]) => {
    group[source].push(...profiles.map(([title, meta], profileIndex) => ({
      id: `I${pointIndex + 1}-${source[0].toUpperCase()}-${String(profileIndex + 4).padStart(2, '0')}`,
      title: `${title}（关联创新点 ${pointIndex + 1}）`,
      meta,
      source: source === 'patent' ? `创新点 ${pointIndex + 1} · 专利候选` : source === 'paper' ? `创新点 ${pointIndex + 1} · 论文候选` : source === 'policy' ? '政策法规库 · 条款关联' : '内部知识库 · 关联经验',
      excerpt: `围绕“${scopePoints.value[pointIndex]}”补充召回的高关联资料，用于核验技术边界、实施条件与差异化证据。`,
      selected: false,
    })))
  })
})

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
  patent: { label: '专利', recordLabel: '公开专利', total: '2', unit: '个主题', coverage: '每主题 1,000 条 · 首屏 20 条', method: '已按主题分别检索', tags: ['涌水预测', '水害预警', '水资源配置', '采动扰动'] },
  paper: { label: '论文', recordLabel: '学术论文', total: '246', unit: '篇', coverage: '每页 20 篇', method: '按技术主题匹配排序', tags: ['涌水预测', '深度学习', '水文地质', '多目标优化'] },
  policy: { label: '政策', recordLabel: '政策条款', total: '47', unit: '件', coverage: '条款级比对 1,382 条', method: '以现行政策法规为主，按条款关联筛选', tags: ['矿井水', '地下水保护', '非常规水源', '循环利用', '绿色开采'] },
  internal: { label: '内部知识', recordLabel: '院内知识', total: '286', unit: '条', coverage: '工程案例 74 项 · 项目档案 68 项 · 技术报告 83 份 · 专家复盘 61 份', method: '院内知识库按文档版本、项目与专题去重', tags: ['工程案例', '项目档案', '技术方案', '运行复盘', '方法工具'] },
}
const pointTotals = [
  { patent: '118', paper: '47', policy: '11', internal: '74' }, { patent: '187', paper: '62', policy: '15', internal: '91' }, { patent: '29', paper: '34', policy: '9', internal: '58' },
]

function researchFacts(source, item, index) {
  if (item.facts) return item.facts
  if (source === 'patent' || source === 'paper') return [
    { label: '匹配方向', value: item.meta },
    { label: '证据状态', value: item.selected ? '已选入' : '待复核' },
  ]
  const numericId = Number((item.id.match(/\d+/g) || [String(index + 1)]).join('')) || index + 1
  const organisations = ['国家能源集团', '中煤科工集团', '中国矿业大学', '煤炭科学研究总院', '太原理工大学']
  const journals = ['煤炭科学技术', '煤炭学报', 'Journal of Cleaner Production', 'Desalination', '矿业安全与环保']
  const knowledgeTypes = ['工程案例', '项目档案', '技术报告', '专家复盘', '方法工具']
  if (source === 'patent') return [
    { label: '公开（申请）号', value: `CN11${String(408000 + numericId * 97).padStart(6, '0')}A` },
    { label: '申请人', value: organisations[numericId % organisations.length] },
    { label: '法律状态', value: numericId % 5 === 0 ? '审中' : numericId % 4 === 0 ? '已失效' : '在华有效' },
    { label: '文本相似度', value: `${91 - (numericId % 17)}%` },
  ]
  if (source === 'paper') return [
    { label: '刊源', value: journals[numericId % journals.length] },
    { label: '发表年份', value: String(2021 + (numericId % 5)) },
    { label: '作者机构', value: organisations[(numericId + 2) % organisations.length] },
    { label: '被引次数', value: `${18 + (numericId % 46)} 次` },
  ]
  if (source === 'policy') return [
    { label: '发布单位', value: item.source },
    { label: '文件属性', value: item.meta },
    { label: '施行状态', value: '现行有效' },
  ]
  return [
    { label: '知识类型', value: item.source.split('·').pop().trim() || knowledgeTypes[numericId % knowledgeTypes.length] },
    { label: '资料属性', value: item.meta },
    { label: '可用范围', value: '院内可见' },
  ]
}

function internalKnowledgeTag(item) {
  const text = `${item.title} ${item.source} ${item.meta}`
  return /专家|个人/.test(text) ? '个人知识' : '企业知识'
}

function sourceResultTotal(source, fallback) {
  return source === 'patent' || source === 'paper' ? sourceMeta[source].total : fallback
}

const stage = computed(() => {
  const raw = route.params.stage || 'upload'
  return stageAliases[raw] || (stages.includes(raw) ? raw : 'upload')
})
const currentStageIndex = computed(() => Math.max(0, stages.indexOf(stage.value)))
const stageInfo = computed(() => ({
  project: {
    title: '确认项目输入',
    description: '',
    metrics: [
      { label: '项目材料', value: uploadedFile.value ? '已上传' : '待补充' },
      { label: '关键字段', value: '8 项' },
    ],
  },
  analysis: {
    title: '形成分析框架',
    description: '',
    metrics: [
      { label: '技术主题', value: `${scopeTopics.value.length} 项` },
      { label: '创新点', value: `${scopePoints.value.length} 项` },
    ],
  },
  research: {
    title: '建立检索证据链',
    metrics: [
      { label: '已选证据', value: `${selectedEvidenceCount.value} 项` },
      { label: '资料覆盖', value: '专利 · 论文' },
    ],
  },
}[stage.value] || { title: '', description: '', metrics: [] }))
const nextStageLabel = computed(() => workflowSteps[currentStageIndex.value + 1]?.label || '报告查看')
const researchPageSize = 20
const patentTopicItems = computed(() => patentTopicEvidence.flatMap((topic) => topic.items))
const activePatentTopic = computed(() => patentTopicEvidence[patentTopicTab.value])
const activePaperTopic = computed(() => paperTopicEvidence[patentTopicTab.value])
const activeThemeItems = computed(() => {
  if (themeSource.value === 'patent') return patentTopicItems.value
  return themeEvidence[themeSource.value]
    .filter((item) => !item.topics || item.topics.includes(patentTopicTab.value))
    .slice(0, 8)
})
const activeResearchItems = computed(() => {
  if (themeSource.value === 'patent') return activePatentTopic.value.items
  if (themeSource.value === 'paper') return activePaperTopic.value.items
  return activeThemeItems.value
})
const activePointItems = computed(() => {
  const source = pointSource.value
  if (source === 'patent') return pointPatentEvidence[pointPatentEvidenceIndex[pointTab.value]].items
  if (source === 'paper') return pointPaperEvidence[pointPaperEvidenceIndex[pointTab.value]].items
  return pointEvidence[pointTab.value][source].slice(0, 3)
})
function sortResearchItems(items, sort) {
  if (sort === 'title') return [...items].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
  return items
}
const themeSourceIsPaged = computed(() => themeSource.value === 'patent' || themeSource.value === 'paper')
const themePageCount = computed(() => {
  const total = themeSource.value === 'patent'
    ? Number(activePatentTopic.value.total.replace(/,/g, ''))
    : themeSource.value === 'paper'
      ? Number(activePaperTopic.value.total.replace(/,/g, ''))
      : Number(sourceMeta[themeSource.value].total.replace(/,/g, ''))
  return Math.max(1, Math.ceil(total / researchPageSize))
})
const themePageOffset = computed(() => (themePage.value - 1) * researchPageSize)
const themePaginationEntries = computed(() => {
  const count = themePageCount.value
  const current = themePage.value
  const pages = [...new Set([1, current - 1, current, current + 1, count].filter((page) => page >= 1 && page <= count))].sort((a, b) => a - b)
  return pages.flatMap((page, index) => index > 0 && page - pages[index - 1] > 1 ? ['…', page] : [page])
})
function setThemePage(page) {
  themePage.value = Math.min(Math.max(page, 1), themePageCount.value)
  themeExpanded.value = ''
}
const displayThemeItems = computed(() => {
  const items = sortResearchItems(activeResearchItems.value, themeSort.value)
  if (!themeSourceIsPaged.value) return items
  const samplePageCount = Math.max(1, Math.ceil(items.length / researchPageSize))
  const samplePage = (themePage.value - 1) % samplePageCount
  return items.slice(samplePage * researchPageSize, (samplePage + 1) * researchPageSize)
})
const pointSourceIsPaged = computed(() => pointSource.value === 'patent' || pointSource.value === 'paper')
const pointPageCount = computed(() => Math.max(1, Math.ceil(activePointItems.value.length / researchPageSize)))
const pointPaginationEntries = computed(() => {
  const count = pointPageCount.value
  const current = pointPage.value
  const pages = [...new Set([1, current - 1, current, current + 1, count].filter((page) => page >= 1 && page <= count))].sort((a, b) => a - b)
  return pages.flatMap((page, index) => index > 0 && page - pages[index - 1] > 1 ? ['…', page] : [page])
})
function setPointPage(page) {
  pointPage.value = Math.min(Math.max(page, 1), pointPageCount.value)
  pointExpanded.value = ''
}
const displayPointItems = computed(() => {
  const items = sortResearchItems(activePointItems.value, pointSort.value)
  if (!pointSourceIsPaged.value) return items
  const offset = (pointPage.value - 1) * researchPageSize
  return items.slice(offset, offset + researchPageSize)
})
function researchResultTotal(panel) {
  const source = panel === 'theme' ? themeSource.value : pointSource.value
  if (panel === 'theme' && source === 'patent') return activePatentTopic.value.total
  if (panel === 'theme' && source === 'paper') return activePaperTopic.value.total
  if (panel === 'point' && source === 'patent') return pointPatentEvidence[pointPatentEvidenceIndex[pointTab.value]].total
  if (panel === 'point' && source === 'paper') return pointPaperEvidence[pointPaperEvidenceIndex[pointTab.value]].total
  return panel === 'theme' ? sourceMeta[source].total : pointTotals[pointTab.value][source]
}
function researchResultUnit(source) {
  return { patent: '条专利', paper: '篇论文', policy: '件政策', internal: '条内部知识' }[source]
}
function saveResearchEvidence(panel) {
  savedResearchPanel.value = panel
}
function savePatentToKnowledge(item) {
  savedPatentCodes.value = new Set([...savedPatentCodes.value, item.code])
  ui.notify('已收藏至个人知识库', 'success')
}
function downloadPatentInformation(item) {
  const content = [
    `专利名称：${item.title}`,
    `公开（公告）号：${item.code}`,
    `法律状态：${item.legalStatus}`,
    `当前申请人/权利人：${item.assignee}`,
    `技术分类：${item.classifications.join('、')}`,
    `申请日：${item.filingDate}`,
    `公开日：${item.publicationDate}`,
    ...(patentPreviewAbstract(item) ? ['', `${patentPreviewLabel(item)}：${patentPreviewAbstract(item)}`] : []),
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob(['\ufeff', content], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${item.code}-专利信息.txt`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
  ui.notify('已下载专利信息', 'success')
}
function patentPreviewAbstract(item) {
  return patentAbstractByCode[item.code] || item.abstract || ''
}
function patentPreviewLabel(item) {
  return patentPreviewAbstract(item) ? '专利摘要' : '专利信息'
}
function showPatentPreview(item, type, event) {
  window.clearTimeout(patentPreviewCloseTimer)
  const rect = event.currentTarget.getBoundingClientRect()
  const width = type === 'title' ? 420 : 328
  const height = type === 'title' ? 390 : 224
  const left = Math.min(Math.max(16, rect.left), window.innerWidth - width - 16)
  const top = rect.bottom + height + 10 <= window.innerHeight
    ? rect.bottom + 10
    : Math.max(16, rect.top - height - 10)
  patentPreview.value = { item, type, left, top }
}
function schedulePatentPreviewClose() {
  patentPreviewCloseTimer = window.setTimeout(() => { patentPreview.value = null }, 110)
}
function keepPatentPreviewOpen() {
  window.clearTimeout(patentPreviewCloseTimer)
}
const selectedEvidenceCount = computed(() => [
  ...patentTopicItems.value,
  ...Object.entries(themeEvidence).filter(([source]) => source !== 'patent' && source !== 'paper').flatMap(([, items]) => items),
  ...paperTopicEvidence.flatMap((topic) => topic.items),
  ...pointPatentEvidenceIndex.flatMap((index) => pointPatentEvidence[index].items),
  ...pointPaperEvidenceIndex.flatMap((index) => pointPaperEvidence[index].items),
  ...pointEvidence.flatMap((group) => [...group.policy, ...group.internal]),
  ...policyEvidence,
].filter((item) => item.selected).length)

watch(stage, (value) => {
  const index = stages.indexOf(value)
  if (index >= 0) workflowMax.value = Math.max(workflowMax.value, index + 1)
  if (value === 'project') syncProjectTextareaHeights()
}, { immediate: true })

function syncProjectTextareaHeights() {
  nextTick(() => {
    document.querySelectorAll('.inn-project-confirm-item textarea').forEach((textarea) => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    })
  })
}
function autoResizeProjectTextarea(event) {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}
onMounted(() => {
  window.addEventListener('resize', syncProjectTextareaHeights)
  syncProjectTextareaHeights()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', syncProjectTextareaHeights)
  window.clearTimeout(patentPreviewCloseTimer)
})

function move(next) {
  const mode = route.params.mode === 'admin' ? 'admin' : 'researcher'
  router.push(`/innovation/${mode}/${next}`)
}
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
  if (stage.value === 'research' && !taskRecorded.value) {
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
function toggleProjectEditing() { projectEditing.value = !projectEditing.value }
function toggleAnalysisEditing() { analysisEditing.value = !analysisEditing.value }
function exportReport() { ui.notify('已生成《煤炭资源开采过程高矿化度涌水问题研究-立项审查报告》PDF', 'success') }
</script>

<template>
  <section class="innovation-page">
    <section v-if="stage === 'upload'" class="inn-simple-launch">
      <div class="inn-simple-launch-inner">
        <ApplicationHeading class="inn-simple-launch-title" app="innovation" description="从立项建议书出发，形成创新评价与立项建议。" />
        <div class="inn-simple-mode-switch"><button :class="{ active: inputMode === 'file' }" type="button" @click="inputMode = 'file'">上传 Word</button><button :class="{ active: inputMode === 'manual' }" type="button" @click="inputMode = 'manual'">手动录入</button></div>
        <p class="inn-simple-mode-hint">{{ inputMode === 'file' ? '上传立项建议书后开始分析。' : '填写项目关键信息后开始分析。' }}</p>
        <div class="inn-simple-composer">
          <template v-if="inputMode === 'file'">
            <label v-if="!uploadedFile" class="inn-simple-dropzone"><input type="file" accept=".doc,.docx" @change="selectFile" /><span class="inn-simple-file-glyph" aria-hidden="true"><FileUp :size="30" :stroke-width="2" /><em>DOC</em></span><b>上传立项建议书</b><small>支持 .doc、.docx 文件</small></label>
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
            <footer class="inn-simple-manual-footer"><button class="primary-btn inn-simple-start" type="button" @click="startManual">开始分析</button></footer>
          </div>
        </div>
        <footer v-if="inputMode === 'file' && uploadedFile" class="inn-simple-upload-continue"><button class="inn-simple-clear" type="button" @click="removeFile">移除文件</button><button class="primary-btn inn-simple-start" type="button" @click="startFile">开始分析</button></footer>
      </div>
    </section>

    <section v-else class="inn-wf-shell">
      <div class="inn-wf-layout" :class="{ 'report-flow-collapsed': reportWorkflowNavCollapsed }">
        <aside class="inn-wf-nav" :class="{ collapsed: reportWorkflowNavCollapsed }">
          <h1 v-show="!reportWorkflowNavCollapsed">创新性分析</h1>
          <button class="inn-wf-nav-collapse" :aria-label="reportWorkflowNavCollapsed ? '展开流程导航' : '收起流程导航'" :title="reportWorkflowNavCollapsed ? '展开流程导航' : '收起流程导航'" type="button" @click="reportWorkflowNavCollapsed = !reportWorkflowNavCollapsed">{{ reportWorkflowNavCollapsed ? '›' : '‹' }}</button>
          <div v-show="!reportWorkflowNavCollapsed">
            <template v-for="(item, index) in workflowSteps" :key="item.id">
              <button :class="{ active: stage === item.id, done: index + 1 < workflowMax }" :disabled="index + 1 > workflowMax" type="button" @click="navigateStep(item, index)">
                <i>{{ index + 1 < workflowMax ? '✓' : index + 1 }}</i>
                <span>{{ item.label }}</span>
              </button>
              <nav v-if="item.id === 'research' && (stage === 'research' || stage === 'report')" class="inn-wf-subnav" aria-label="资料检索分类">
                <button type="button" :class="{ active: stage === 'research' && researchPanel === 'theme' }" @click="researchPanel = 'theme'">技术主题资料</button>
                <button type="button" :class="{ active: stage === 'research' && researchPanel === 'point' }" @click="researchPanel = 'point'">创新点资料</button>
              </nav>
            </template>
          </div>
        </aside>
        <main class="inn-wf-main">
          <article class="inn-wf-card" :class="[`inn-wf-card-${stage}`, { 'is-project-editing': stage === 'project' && projectEditing, 'is-analysis-editing': stage === 'analysis' && analysisEditing }]">
            <header v-if="stage !== 'report'" class="inn-wf-stage-header">
              <div class="inn-wf-stage-copy"><span>当前环节</span><h2>{{ stageInfo.title }}</h2><p v-if="stageInfo.description">{{ stageInfo.description }}</p></div>
              <button v-if="stage === 'project'" class="inn-project-edit-toggle" :aria-pressed="projectEditing" type="button" @click="toggleProjectEditing">{{ projectEditing ? '完成' : '编辑' }}</button>
              <div v-else-if="stage === 'analysis'" class="inn-analysis-header-actions"><dl class="inn-wf-stage-metrics"><div v-for="metric in stageInfo.metrics" :key="metric.label"><dt>{{ metric.label }}</dt><dd>{{ metric.value }}</dd></div></dl><button class="inn-project-edit-toggle inn-analysis-edit-toggle" :aria-pressed="analysisEditing" type="button" @click="toggleAnalysisEditing">{{ analysisEditing ? '完成' : '编辑' }}</button></div>
              <dl v-else-if="stage !== 'research'" class="inn-wf-stage-metrics"><div v-for="metric in stageInfo.metrics" :key="metric.label"><dt>{{ metric.label }}</dt><dd>{{ metric.value }}</dd></div></dl>
            </header>
            <section v-if="stage === 'project'" class="inn-wf-section inn-wf-project-page">
              <section class="inn-project-overview">
                <header class="inn-project-section-head"><span>项目概览</span></header>
                <div class="inn-project-overview-fields">
                  <label class="inn-wf-field"><span>项目名称</span><input v-model="profile.name" :readonly="!projectEditing" /></label>
                  <label class="inn-wf-field"><span>行业领域</span><input v-model="profile.field" :readonly="!projectEditing" /></label>
                </div>
                <div class="inn-project-confirm-grid">
                  <label class="inn-wf-field inn-project-confirm-item"><span>关键问题</span><textarea v-model="profile.issue" :readonly="!projectEditing" rows="3" @input="autoResizeProjectTextarea" /></label>
                  <label class="inn-wf-field inn-project-confirm-item inn-project-route-item"><span>技术路线</span><textarea v-model="profile.solution" :readonly="!projectEditing" rows="4" @input="autoResizeProjectTextarea" /></label>
                </div>
              </section>

              <section class="inn-project-targets">
                <header class="inn-project-section-head"><span>关键目标与指标</span></header>
                <div class="inn-project-target-grid"><article v-for="(metric, index) in projectMetricTargets" :key="index"><input v-model="metric.label" :readonly="!projectEditing" aria-label="指标名称" /><div><small>当前</small><input v-model="metric.current" :readonly="!projectEditing" aria-label="当前值" /></div><div><small>目标</small><input v-model="metric.target" :readonly="!projectEditing" aria-label="目标值" /></div></article></div>
              </section>

              <section class="inn-project-details-shell" :class="{ 'is-expanded': projectDetailsExpanded }">
                <button class="inn-project-details-toggle" type="button" @click="projectDetailsExpanded = !projectDetailsExpanded"><span><b>补充信息</b></span><em>{{ projectDetailsExpanded ? '收起' : '展开' }}</em></button>
                <div v-if="projectDetailsExpanded" class="inn-project-details">
                  <label class="inn-wf-field"><span>完整技术指标说明</span><textarea v-model="profile.breakthroughs" :readonly="!projectEditing" rows="3" /></label>
                  <label class="inn-wf-field"><span>项目预期交付成果</span><textarea v-model="profile.outputs" :readonly="!projectEditing" rows="3" /></label>
                  <label class="inn-wf-field"><span>问题背景与具体表现</span><textarea v-model="profile.manifestations" :readonly="!projectEditing" rows="4" /></label>
                  <label class="inn-wf-field"><span>技术体系与方案特点</span><textarea v-model="profile.features" :readonly="!projectEditing" rows="4" /></label>
                </div>
              </section>
            </section>

            <section v-else-if="stage === 'analysis'" class="inn-wf-section inn-wf-analysis-page">
              <section class="inn-analysis-section">
                <header class="inn-analysis-section-head"><span>研究技术主题</span></header>
                <div class="inn-analysis-topic-grid"><article v-for="(detail, index) in themeAnalysisDetails" :key="`topic-${index}`" class="inn-analysis-topic-card"><header><i>{{ String(index + 1).padStart(2, '0') }}</i><div><textarea v-if="analysisEditing" v-model="scopeTopics[index]" rows="1" /><strong v-else class="inn-analysis-readonly-title">{{ scopeTopics[index] }}</strong></div></header><label><span>核心技术词</span><textarea v-if="analysisEditing" v-model="detail.keywords" rows="2" /><p v-else class="inn-analysis-readonly-copy">{{ detail.keywords }}</p></label></article></div>
              </section>

              <section class="inn-analysis-section">
                <header class="inn-analysis-section-head"><span>创新点确认</span></header>
                <div class="inn-analysis-point-list"><article v-for="(detail, index) in innovationAnalysisDetails" :key="`point-${index}`" class="inn-analysis-point-card"><header><div class="inn-analysis-point-title"><i>{{ String(index + 1).padStart(2, '0') }}</i><div><textarea v-if="analysisEditing" v-model="scopePoints[index]" rows="1" /><strong v-else class="inn-analysis-readonly-title">{{ scopePoints[index] }}</strong></div></div></header><div class="inn-analysis-point-body"><label class="inn-analysis-point-primary"><span>技术方案</span><textarea v-if="analysisEditing" v-model="detail.scheme" rows="2" /><p v-else class="inn-analysis-readonly-copy">{{ detail.scheme }}</p></label><label class="inn-analysis-point-differentiation"><span>差异化要点</span><textarea v-if="analysisEditing" v-model="detail.differentiation" rows="2" /><p v-else class="inn-analysis-readonly-copy">{{ detail.differentiation }}</p></label></div></article></div>
              </section>
            </section>

            <section v-else-if="stage === 'themes'" class="inn-wf-section inn-wf-theme-page"><section class="inn-wf-point-recall"><header class="inn-recall-controls"><nav class="inn-recall-type-tabs"><button v-for="source in Object.keys(sourceMeta)" :key="source" :class="{ active: themeSource === source }" type="button" @click="themeSource = source; themeExpanded = ''">{{ sourceMeta[source].label }}</button></nav></header><div class="inn-recall-meta"><div><strong>{{ sourceMeta[themeSource].total }}</strong><span>条数据</span><small>当前展示 {{ activeThemeItems.length }} 条高相关候选</small></div><div><button type="button" @click="selectAll(activeThemeItems, true)">全选</button><button type="button" @click="selectAll(activeThemeItems, false)">清空</button><button class="inn-recall-sort" type="button">最相关</button></div></div><section class="inn-recall-results"><article v-for="(item, index) in activeThemeItems" :key="item.id" class="inn-recall-result" :class="{ 'is-selected': item.selected }"><header><span class="inn-recall-order">{{ String(index + 1).padStart(2, '0') }}</span><div class="inn-recall-title"><div class="inn-wf-theme-membership"><span v-for="topic in item.topics" :key="topic">主题{{ topic === 0 ? '一' : '二' }}</span></div><h3>{{ item.title }}<i>›</i></h3><div class="inn-recall-tags"><span v-for="tag in sourceMeta[themeSource].tags.slice(index % 3, index % 3 + 3)" :key="tag">{{ tag }}</span></div></div><label class="inn-recall-selection"><input v-model="item.selected" type="checkbox" /><span>{{ item.selected ? '已入选' : '待选择' }}</span></label></header><p><b>摘要</b>{{ item.excerpt }}</p><footer><span>{{ item.source }}</span><span>{{ item.meta }}</span><div><button type="button" @click="toggleThemeDetail(item.id)">{{ themeExpanded === item.id ? '收起详情' : '查看详情' }}</button></div></footer><div v-if="themeExpanded === item.id" class="inn-recall-detail"><b>证据摘要</b><p>{{ item.excerpt }}</p><small>请结合原文核验技术特征、适用边界与对应技术主题。</small></div></article></section></section></section>

            <section v-else-if="stage === 'points'" class="inn-wf-section inn-wf-point-page"><nav class="inn-wf-point-tabs"><button v-for="(point, index) in scopePoints" :key="point" :class="{ active: pointTab === index }" type="button" @click="pointTab = index; pointExpanded = ''"><b>创新点 {{ index + 1 }}</b><span>{{ point }}</span></button></nav><section class="inn-wf-point-recall"><header class="inn-recall-controls"><nav class="inn-recall-type-tabs"><button v-for="source in Object.keys(sourceMeta)" :key="source" :class="{ active: pointSource === source }" type="button" @click="pointSource = source; pointExpanded = ''">{{ sourceMeta[source].label }}</button></nav></header><div class="inn-recall-meta"><div><strong>{{ pointTotals[pointTab][pointSource] }}</strong><span>条数据</span><small>当前展示 {{ activePointItems.length }} 条高相关候选</small></div><div><button type="button" @click="selectAll(activePointItems, true)">全选</button><button type="button" @click="selectAll(activePointItems, false)">清空</button><button class="inn-recall-sort" type="button">最相关</button></div></div><section class="inn-recall-results"><article v-for="(item, index) in activePointItems" :key="item.id" class="inn-recall-result" :class="{ 'is-selected': item.selected }"><header><span class="inn-recall-order">{{ String(index + 1).padStart(2, '0') }}</span><div class="inn-recall-title"><h3>{{ item.title }}<i>›</i></h3><div class="inn-recall-tags"><span v-for="tag in sourceMeta[pointSource].tags.slice(0, 3)" :key="tag">{{ tag }}</span></div></div><label class="inn-recall-selection"><input v-model="item.selected" type="checkbox" /><span>{{ item.selected ? '已入选' : '待选择' }}</span></label></header><p><b>摘要</b>{{ item.excerpt }}</p><footer><span>{{ item.source }}</span><span>{{ item.meta }}</span><div><button type="button" @click="togglePointDetail(item.id)">{{ pointExpanded === item.id ? '收起详情' : '查看详情' }}</button></div></footer><div v-if="pointExpanded === item.id" class="inn-recall-detail"><b>证据摘要</b><p>{{ item.excerpt }}</p><small>请结合原文核验技术特征、适用边界与本创新点的关联。</small></div></article></section></section></section>

            <section v-else-if="stage === 'policy'" class="inn-wf-section inn-wf-data-section"><article class="inn-wf-data-group"><div class="inn-wf-evidence-list inn-wf-policy-list"><label v-for="item in policyEvidence" :key="item.id" class="inn-wf-evidence-card"><span class="inn-wf-evidence-top"><input v-model="item.selected" type="checkbox" /><i>政策</i></span><input v-model="item.title" /><textarea v-model="item.excerpt" rows="3" /><small>{{ item.source }}　·　{{ item.meta }}</small></label></div></article></section>

            <section v-if="stage === 'research'" class="inn-wf-section inn-wf-research-page">

              <section v-if="researchPanel === 'theme'" class="inn-wf-point-recall">
                <nav class="inn-wf-point-tabs inn-patent-topic-tabs">
                  <button v-for="(topic, index) in patentTopicEvidence" :key="topic.id" :class="{ active: patentTopicTab === index }" type="button" @click="patentTopicTab = index; themeExpanded = ''; themePage = 1"><span class="inn-patent-topic-title">{{ topic.title }}</span></button>
                </nav>
                <header class="inn-recall-controls">
                  <nav class="inn-recall-type-tabs">
                    <button v-for="source in Object.keys(sourceMeta)" :key="source" :class="{ active: themeSource === source }" type="button" @click="themeSource = source; themeExpanded = ''; savedResearchPanel = ''; themePage = 1"><span>{{ sourceMeta[source].label }}</span></button>
                  </nav>
                  <div class="inn-recall-list-summary"><strong>{{ researchResultTotal('theme') }}</strong><b>{{ researchResultUnit(themeSource) }}</b><span v-if="themeSourceIsPaged">第 {{ themePage }} 页，每页 {{ researchPageSize }} 条</span></div>
                  <div class="inn-recall-list-actions"><button :class="{ saved: savedResearchPanel === 'theme' }" type="button" @click="saveResearchEvidence('theme')">{{ savedResearchPanel === 'theme' ? '已保存' : '保存' }}</button><select v-model="themeSort" aria-label="技术主题资料排序"><option value="relevance">最相关</option><option value="title">按题名</option></select></div>
                </header>
                <section v-if="themeSource === 'patent'" class="inn-patent-topic-list">
                  <div class="inn-patent-table-wrap"><table class="inn-patent-table"><thead><tr><th></th><th>序号</th><th>相关度</th><th>公开(公告)号</th><th>专利名称</th><th>法律状态</th><th>当前申请人/权利人</th><th>技术分类</th><th>申请日</th><th>公开日</th></tr></thead><tbody><template v-for="(item, index) in displayThemeItems" :key="item.id"><tr :class="{ 'is-selected': item.selected }"><td><input v-model="item.selected" type="checkbox" :aria-label="`选择${item.title}`" /></td><td>{{ String(index + 1).padStart(2, '0') }}</td><td><b>{{ item.relevance }}</b></td><td><span class="inn-patent-number" tabindex="0" @mouseenter="showPatentPreview(item, 'number', $event)" @mouseleave="schedulePatentPreviewClose" @focus="showPatentPreview(item, 'number', $event)" @blur="schedulePatentPreviewClose">{{ item.code }}</span></td><td class="inn-patent-title-cell"><button class="inn-patent-title" type="button" @mouseenter="showPatentPreview(item, 'title', $event)" @mouseleave="schedulePatentPreviewClose" @focus="showPatentPreview(item, 'title', $event)" @blur="schedulePatentPreviewClose" @click="toggleThemeDetail(item.id)">{{ item.title }}</button><span class="inn-patent-title-tools"><button :class="{ saved: savedPatentCodes.has(item.code) }" type="button" :aria-label="savedPatentCodes.has(item.code) ? '已收藏到个人知识库' : '收藏到个人知识库'" :title="savedPatentCodes.has(item.code) ? '已收藏到个人知识库' : '收藏到个人知识库'" @click.stop="savePatentToKnowledge(item)"><BookmarkCheck v-if="savedPatentCodes.has(item.code)" :size="14" /><BookmarkPlus v-else :size="14" /></button><button type="button" aria-label="下载到本地" title="下载到本地" @click.stop="downloadPatentInformation(item)"><Download :size="14" /></button></span></td><td><em class="inn-patent-status" :class="`is-${item.legalStatus}`">{{ item.legalStatus }}</em></td><td><span class="inn-patent-assignee" :title="item.assignee">{{ item.assignee }}</span></td><td><div class="inn-patent-classifications"><span v-for="classification in item.classifications" :key="classification">{{ classification }}</span></div></td><td><time>{{ item.filingDate }}</time></td><td><time>{{ item.publicationDate }}</time></td></tr><tr v-if="themeExpanded === item.id" class="inn-patent-table-detail"><td></td><td colspan="9"><b>匹配要点</b><span>{{ item.match }}</span></td></tr></template></tbody></table></div>
                </section>
                <section v-else-if="themeSource === 'paper'" class="inn-paper-list">
                  <article v-for="(item, index) in displayThemeItems" :key="item.id" class="inn-paper-item" :class="{ 'is-selected': item.selected }">
                    <div class="inn-paper-item-index"><label><input v-model="item.selected" type="checkbox" :aria-label="`选择${item.title}`" /></label></div>
                    <div class="inn-paper-item-body"><header><div class="inn-paper-title-row"><b>{{ String(index + 1).padStart(2, '0') }}</b><button type="button" @click="toggleThemeDetail(item.id)"><span><strong>{{ item.title }}</strong><em>{{ item.year }}</em></span></button></div><span class="inn-paper-status">{{ item.selected ? '已入选' : '待选择' }}</span></header><dl><div><dt>作者</dt><dd>{{ item.authors }}</dd></div><div><dt>期刊</dt><dd>{{ item.outlet }}</dd></div><div><dt>{{ item.identifierLabel }}</dt><dd>{{ item.identifier }}</dd></div></dl><p><b>摘要</b>{{ item.abstract }}</p><footer><span v-for="keyword in item.keywords" :key="keyword">{{ keyword }}</span></footer><div v-if="themeExpanded === item.id" class="inn-paper-detail"><b>资料定位</b><span>{{ item.outlet }} · {{ item.identifierLabel }} {{ item.identifier }}</span></div></div>
                  </article>
                </section>
                <section v-else-if="themeSource === 'policy' || themeSource === 'internal'" class="inn-evidence-ledger" :class="`is-${themeSource}`">
                  <article v-for="(item, index) in displayThemeItems" :key="item.id" class="inn-evidence-ledger-row" :class="{ 'is-selected': item.selected }">
                    <label class="inn-evidence-ledger-select"><input v-model="item.selected" type="checkbox" :aria-label="`选择${item.title}`" /><span>{{ String(index + 1).padStart(2, '0') }}</span></label>
                    <div class="inn-evidence-ledger-body"><header><button type="button" @click="toggleThemeDetail(item.id)">{{ item.title }}</button><div class="inn-evidence-ledger-header-meta"><span class="inn-evidence-ledger-type" :class="[`is-${themeSource}`, { 'is-personal': themeSource === 'internal' && internalKnowledgeTag(item) === '个人知识' }]">{{ themeSource === 'policy' ? '政策文件' : internalKnowledgeTag(item) }}</span><span class="inn-evidence-ledger-status">{{ item.selected ? '已入选' : '待选择' }}</span></div></header><p>{{ item.excerpt }}</p><dl><div v-for="fact in researchFacts(themeSource, item, index)" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div></dl><div v-if="themeExpanded === item.id" class="inn-evidence-ledger-detail"><b>摘要</b><p>{{ item.excerpt }}</p></div></div>
                  </article>
                </section>
                <section v-else class="inn-recall-results">
                  <article v-for="(item, index) in displayThemeItems" :key="item.id" class="inn-recall-result" :class="[{ 'is-selected': item.selected }, `inn-recall-result-${themeSource}`]">
                    <header><span class="inn-recall-order">{{ String(index + 1).padStart(2, '0') }}</span><div class="inn-recall-title"><div class="inn-recall-record-type"><b>{{ sourceMeta[themeSource].recordLabel }}</b><em v-if="item.highlight" class="inn-recall-key">{{ item.highlightLabel }} {{ item.highlight }}</em></div><h3><button type="button" @click="toggleThemeDetail(item.id)">{{ item.title }}</button></h3><div class="inn-recall-tags"><span v-for="tag in item.tags || sourceMeta[themeSource].tags.slice(index % 3, index % 3 + 3)" :key="tag">{{ tag }}</span></div></div><label class="inn-recall-selection"><input v-model="item.selected" type="checkbox" /><span>{{ item.selected ? '已入选' : '待选择' }}</span></label></header>
                    <p><b>摘要</b>{{ item.excerpt }}</p><dl class="inn-recall-facts"><div v-for="fact in researchFacts(themeSource, item, index)" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div></dl><footer><span>{{ item.source }}</span><span>{{ item.meta }}</span></footer><div v-if="themeExpanded === item.id" class="inn-recall-detail"><b>摘要</b><p>{{ item.excerpt }}</p></div>
                  </article>
                </section>
                <nav v-if="themeSourceIsPaged" class="inn-recall-pagination" aria-label="检索结果分页">
                  <span>共 {{ researchResultTotal('theme') }} {{ researchResultUnit(themeSource) }}</span>
                  <div><button type="button" aria-label="上一页" :disabled="themePage === 1" @click="setThemePage(themePage - 1)">‹</button><template v-for="entry in themePaginationEntries" :key="entry"><i v-if="entry === '…'">…</i><button v-else type="button" :class="{ active: themePage === entry }" @click="setThemePage(entry)">{{ entry }}</button></template><button type="button" aria-label="下一页" :disabled="themePage === themePageCount" @click="setThemePage(themePage + 1)">›</button></div>
                </nav>
              </section>

              <section v-else class="inn-wf-point-recall">
                <nav class="inn-wf-point-tabs"><button v-for="(point, index) in scopePoints" :key="point" :class="{ active: pointTab === index }" type="button" @click="pointTab = index; pointExpanded = ''; pointPage = 1"><b>创新点 {{ index + 1 }}</b><span>{{ point }}</span></button></nav>
                <header class="inn-recall-controls">
                  <nav class="inn-recall-type-tabs"><button v-for="source in Object.keys(sourceMeta)" :key="source" :class="{ active: pointSource === source }" type="button" @click="pointSource = source; pointExpanded = ''; savedResearchPanel = ''; pointPage = 1"><span>{{ sourceMeta[source].label }}</span></button></nav>
                  <div class="inn-recall-list-summary"><strong>{{ researchResultTotal('point') }}</strong><b>{{ researchResultUnit(pointSource) }}</b><span v-if="pointSourceIsPaged">第 {{ pointPage }} 页，每页 {{ researchPageSize }} 条</span></div>
                  <div class="inn-recall-list-actions"><button :class="{ saved: savedResearchPanel === 'point' }" type="button" @click="saveResearchEvidence('point')">{{ savedResearchPanel === 'point' ? '已保存' : '保存' }}</button><select v-model="pointSort" aria-label="创新点资料排序"><option value="relevance">最相关</option><option value="title">按题名</option></select></div>
                </header>
                <section v-if="pointSource === 'patent'" class="inn-patent-topic-list">
                  <div class="inn-patent-table-wrap"><table class="inn-patent-table"><thead><tr><th></th><th>序号</th><th>相关度</th><th>公开(公告)号</th><th>专利名称</th><th>法律状态</th><th>当前申请人/权利人</th><th>技术分类</th><th>申请日</th><th>公开日</th></tr></thead><tbody><template v-for="(item, index) in displayPointItems" :key="item.id"><tr :class="{ 'is-selected': item.selected }"><td><input v-model="item.selected" type="checkbox" :aria-label="`选择${item.title}`" /></td><td>{{ String(index + 1).padStart(2, '0') }}</td><td><b>{{ item.relevance }}</b></td><td><span class="inn-patent-number" tabindex="0" @mouseenter="showPatentPreview(item, 'number', $event)" @mouseleave="schedulePatentPreviewClose" @focus="showPatentPreview(item, 'number', $event)" @blur="schedulePatentPreviewClose">{{ item.code }}</span></td><td class="inn-patent-title-cell"><button class="inn-patent-title" type="button" @mouseenter="showPatentPreview(item, 'title', $event)" @mouseleave="schedulePatentPreviewClose" @focus="showPatentPreview(item, 'title', $event)" @blur="schedulePatentPreviewClose" @click="togglePointDetail(item.id)">{{ item.title }}</button><span class="inn-patent-title-tools"><button :class="{ saved: savedPatentCodes.has(item.code) }" type="button" :aria-label="savedPatentCodes.has(item.code) ? '已收藏到个人知识库' : '收藏到个人知识库'" :title="savedPatentCodes.has(item.code) ? '已收藏到个人知识库' : '收藏到个人知识库'" @click.stop="savePatentToKnowledge(item)"><BookmarkCheck v-if="savedPatentCodes.has(item.code)" :size="14" /><BookmarkPlus v-else :size="14" /></button><button type="button" aria-label="下载到本地" title="下载到本地" @click.stop="downloadPatentInformation(item)"><Download :size="14" /></button></span></td><td><em class="inn-patent-status" :class="`is-${item.legalStatus}`">{{ item.legalStatus }}</em></td><td><span class="inn-patent-assignee" :title="item.assignee">{{ item.assignee }}</span></td><td><div class="inn-patent-classifications"><span v-for="classification in item.classifications" :key="classification">{{ classification }}</span></div></td><td><time>{{ item.filingDate }}</time></td><td><time>{{ item.publicationDate }}</time></td></tr><tr v-if="pointExpanded === item.id" class="inn-patent-table-detail"><td></td><td colspan="9"><b>匹配要点</b><span>{{ item.match }}</span></td></tr></template></tbody></table></div>
                </section>
                <section v-else-if="pointSource === 'paper'" class="inn-paper-list">
                  <article v-for="(item, index) in displayPointItems" :key="item.id" class="inn-paper-item" :class="{ 'is-selected': item.selected }"><div class="inn-paper-item-index"><label><input v-model="item.selected" type="checkbox" :aria-label="`选择${item.title}`" /></label></div><div class="inn-paper-item-body"><header><div class="inn-paper-title-row"><b>{{ String(index + 1).padStart(2, '0') }}</b><button type="button" @click="togglePointDetail(item.id)"><span><strong>{{ item.title }}</strong><em>{{ item.year }}</em></span></button></div><span class="inn-paper-status">{{ item.selected ? '已入选' : '待选择' }}</span></header><dl><div><dt>作者</dt><dd>{{ item.authors }}</dd></div><div><dt>期刊</dt><dd>{{ item.outlet }}</dd></div><div><dt>{{ item.identifierLabel }}</dt><dd>{{ item.identifier }}</dd></div></dl><p><b>摘要</b>{{ item.abstract }}</p><footer><span v-for="keyword in item.keywords" :key="keyword">{{ keyword }}</span></footer><div v-if="pointExpanded === item.id" class="inn-paper-detail"><b>资料定位</b><span>{{ item.outlet }} · {{ item.identifierLabel }} {{ item.identifier }}</span></div></div></article>
                </section>
                <section v-else-if="pointSource === 'policy' || pointSource === 'internal'" class="inn-evidence-ledger" :class="`is-${pointSource}`">
                  <article v-for="(item, index) in displayPointItems" :key="item.id" class="inn-evidence-ledger-row" :class="{ 'is-selected': item.selected }"><label class="inn-evidence-ledger-select"><input v-model="item.selected" type="checkbox" :aria-label="`选择${item.title}`" /><span>{{ String(index + 1).padStart(2, '0') }}</span></label><div class="inn-evidence-ledger-body"><header><button type="button" @click="togglePointDetail(item.id)">{{ item.title }}</button><div class="inn-evidence-ledger-header-meta"><span class="inn-evidence-ledger-type" :class="[`is-${pointSource}`, { 'is-personal': pointSource === 'internal' && internalKnowledgeTag(item) === '个人知识' }]">{{ pointSource === 'policy' ? '政策文件' : internalKnowledgeTag(item) }}</span><span class="inn-evidence-ledger-status">{{ item.selected ? '已入选' : '待选择' }}</span></div></header><p>{{ item.excerpt }}</p><dl><div v-for="fact in researchFacts(pointSource, item, index)" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div></dl><div v-if="pointExpanded === item.id" class="inn-evidence-ledger-detail"><b>摘要</b><p>{{ item.excerpt }}</p></div></div></article>
                </section>
                <section v-else class="inn-recall-results"><article v-for="(item, index) in displayPointItems" :key="item.id" class="inn-recall-result" :class="[{ 'is-selected': item.selected }, `inn-recall-result-${pointSource}`]"><header><span class="inn-recall-order">{{ String(index + 1).padStart(2, '0') }}</span><div class="inn-recall-title"><div class="inn-recall-record-type"><b>{{ sourceMeta[pointSource].recordLabel }}</b><em v-if="item.highlight" class="inn-recall-key">{{ item.highlightLabel }} {{ item.highlight }}</em></div><h3><button type="button" @click="togglePointDetail(item.id)">{{ item.title }}</button></h3><div class="inn-recall-tags"><span v-for="tag in sourceMeta[pointSource].tags.slice(index % 3, index % 3 + 3)" :key="tag">{{ tag }}</span></div></div><label class="inn-recall-selection"><input v-model="item.selected" type="checkbox" /><span>{{ item.selected ? '已入选' : '待选择' }}</span></label></header><p><b>摘要</b>{{ item.excerpt }}</p><dl class="inn-recall-facts"><div v-for="fact in researchFacts(pointSource, item, index)" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div></dl><footer><span>{{ item.source }}</span><span>{{ item.meta }}</span></footer><div v-if="pointExpanded === item.id" class="inn-recall-detail"><b>摘要</b><p>{{ item.excerpt }}</p></div></article></section>
                <nav v-if="pointSourceIsPaged" class="inn-recall-pagination" aria-label="检索结果分页">
                  <span>共 {{ researchResultTotal('point') }} {{ researchResultUnit(pointSource) }}</span>
                  <div><button type="button" aria-label="上一页" :disabled="pointPage === 1" @click="setPointPage(pointPage - 1)">‹</button><template v-for="entry in pointPaginationEntries" :key="entry"><i v-if="entry === '…'">…</i><button v-else type="button" :class="{ active: pointPage === entry }" @click="setPointPage(entry)">{{ entry }}</button></template><button type="button" aria-label="下一页" :disabled="pointPage === pointPageCount" @click="setPointPage(pointPage + 1)">›</button></div>
                </nav>
              </section>
            </section>

            <section v-if="stage === 'report'" class="inn-wf-section inn-wf-report inn-wf-source-report">
              <iframe class="inn-source-report-frame" title="煤炭资源开采过程高矿化度涌水问题研究立项审查报告" src="/innovation-review-report.html" />
            </section>

            <section v-if="false && stage === 'report'" class="inn-wf-section inn-wf-report">
              <header class="inn-wf-report-tools"><button class="inn-wf-back" type="button" @click="move('research')">返回</button><button class="primary-btn" type="button" @click="exportReport"><Download :size="15" />导出 PDF</button></header>
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
            <footer v-if="stage !== 'report'" class="inn-wf-actions"><div class="inn-wf-action-context"><span>下一环节</span><b>{{ nextStageLabel }}</b></div><div class="inn-wf-action-buttons"><button class="inn-wf-back" type="button" @click="previousStage">返回</button><button class="primary-btn" type="button" @click="nextStage">{{ stage === 'research' ? '确认并生成报告' : '确认并进入下一步' }}</button></div></footer>
            <footer v-else class="inn-source-report-actions"><button class="inn-source-report-back" type="button" @click="move('research')">返回</button><button class="primary-btn" type="button" @click="exportReport"><Download :size="15" />导出 PDF</button></footer>
          </article>
        </main>
      </div>
    </section>
    <Teleport to="body">
      <aside v-if="patentPreview" class="inn-patent-preview" :class="`is-${patentPreview.type}`" :style="{ left: `${patentPreview.left}px`, top: `${patentPreview.top}px` }" @mouseenter="keepPatentPreviewOpen" @mouseleave="schedulePatentPreviewClose">
        <template v-if="patentPreview.type === 'title'">
          <header><span>{{ patentPreviewLabel(patentPreview.item) }}</span><b>{{ patentPreview.item.title }}</b></header>
          <p v-if="patentPreviewAbstract(patentPreview.item)">{{ patentPreviewAbstract(patentPreview.item) }}</p>
          <dl><div><dt>法律状态</dt><dd>{{ patentPreview.item.legalStatus }}</dd></div><div><dt>申请日</dt><dd>{{ patentPreview.item.filingDate }}</dd></div><div class="wide"><dt>当前申请人/权利人</dt><dd>{{ patentPreview.item.assignee }}</dd></div><div class="wide"><dt>公开日</dt><dd>{{ patentPreview.item.publicationDate }}</dd></div></dl>
          <footer><span v-for="classification in patentPreview.item.classifications" :key="classification">{{ classification }}</span></footer>
        </template>
        <template v-else>
          <header><span>公开(公告)号</span><strong>{{ patentPreview.item.code }}</strong></header>
          <dl><div><dt>法律状态</dt><dd>{{ patentPreview.item.legalStatus }}</dd></div><div><dt>申请日</dt><dd>{{ patentPreview.item.filingDate }}</dd></div><div class="wide"><dt>当前申请人/权利人</dt><dd>{{ patentPreview.item.assignee }}</dd></div><div class="wide"><dt>公开日</dt><dd>{{ patentPreview.item.publicationDate }}</dd></div></dl>
        </template>
      </aside>
    </Teleport>
  </section>
</template>

<style scoped>
.innovation-page{min-height:100vh;background:#fff;color:#20394f}.innovation-page button,.innovation-page input,.innovation-page textarea{font-family:"Microsoft YaHei",sans-serif}.primary-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;border:1px solid #1679ad;border-radius:8px;background:#1679ad;padding:0 16px;color:#fff;font-size:13px;font-weight:700;cursor:pointer}.primary-btn:hover{background:#0f6798}.inn-simple-launch{min-height:calc(100vh - 112px);display:grid;place-items:center;padding:20px;background:radial-gradient(ellipse at 50% 40%,#e5f2fb 0%,#f7fafc 48%,#f7fafc 100%)}.inn-simple-launch-inner{width:min(900px,100%);margin:4vh auto 0;padding:36px;border:1px solid #d8e6ee;border-radius:20px;background:linear-gradient(145deg,#fff,#f4fafd);box-shadow:0 16px 38px #173c5c0d}.inn-simple-launch-title{display:flex;align-items:center;gap:13px;margin-bottom:21px}.inn-simple-mark{width:50px;height:50px;display:grid;place-items:center;border:1px solid #cae4f0;border-radius:15px;background:#edf8fc;color:#1679ad;font-size:23px}.inn-simple-launch-title h1{margin:0;color:#163e5d;font-size:32px;letter-spacing:-.04em}.inn-simple-launch-title p{margin:5px 0 0;color:#728a9c;font-size:13px}.inn-simple-mode-switch{display:flex;gap:4px;width:max-content;margin-bottom:15px;padding:4px;border:1px solid #dce8ef;border-radius:10px;background:#f6fafc}.inn-simple-mode-switch button{border:0;border-radius:8px;background:transparent;padding:8px 13px;color:#6f8799;font-size:13px;font-weight:700;cursor:pointer}.inn-simple-mode-switch button.active{background:#e5f4fa;color:#126da3}.inn-simple-mode-hint{display:none}.inn-simple-composer{overflow:hidden;border:1px solid #d9e7ee;border-radius:16px;background:#fff;box-shadow:0 8px 20px #173c5c0a}.inn-simple-dropzone{display:grid;place-items:center;min-height:184px;padding:24px;border:1.5px dashed #c7dce7;border-radius:14px;background:#fbfdfe;text-align:center;cursor:pointer}.inn-simple-dropzone:hover{border-color:#72afd0;background:#f3fafe}.inn-simple-dropzone input{display:none}.inn-simple-dropzone i,.inn-simple-selected-file-icon{width:48px;height:54px;display:grid;place-items:center;margin-bottom:10px;border-radius:8px;background:#e8f4fa;color:#1679ad;font-size:10px;font-style:normal;font-weight:800}.inn-simple-dropzone b,.inn-simple-dropzone small{display:block}.inn-simple-dropzone b{max-width:min(86%,620px);overflow:hidden;color:#244b66;font-size:16px;text-overflow:ellipsis;white-space:nowrap}.inn-simple-dropzone small{margin-top:5px;color:#7a91a1;font-size:12px}.inn-simple-template-link{display:block;margin:12px auto;border:0;background:transparent;color:#2e75a1;font-size:12px;font-weight:700;cursor:pointer}.inn-simple-upload-continue{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:13px}.inn-simple-clear{border:0;background:transparent;padding:8px 2px;color:#8093a0;font-size:13px;cursor:pointer}.inn-simple-manual{padding:20px 21px 15px}.inn-simple-fields,.inn-wf-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.inn-simple-field,.inn-wf-field{display:grid;gap:5px;min-width:0;border:1px solid #dfe9ef;border-radius:9px;background:#fcfeff;padding:11px 12px;color:#7b91a1;font-size:11px;font-weight:700}.inn-simple-field.wide,.inn-wf-field.wide{grid-column:1/-1}.inn-simple-field i{color:#1680b2;font-style:normal}.inn-simple-field input,.inn-simple-field textarea,.inn-wf-field input,.inn-wf-field textarea{box-sizing:border-box;width:100%;border:0;outline:0;background:transparent;color:#264b65;font-size:13px;font-weight:600;line-height:1.6;resize:vertical}.inn-simple-field input,.inn-wf-field input{height:27px}.inn-simple-field textarea{min-height:46px}.inn-simple-manual-footer{display:flex;justify-content:flex-end;margin-top:14px}.inn-wf-shell{max-width:1560px;margin:0 auto;padding:8px 24px 28px}.inn-wf-layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:16px;align-items:start}.inn-wf-nav{position:sticky;top:12px;overflow:hidden;border:1px solid #d9e6ed;border-radius:14px;background:#fff;box-shadow:0 8px 22px #1d50600a}.inn-wf-nav h1{margin:0;padding:19px 18px 16px;border-bottom:1px solid #e6eef3;color:#173f5e;font-size:18px}.inn-wf-nav>div{padding:9px}.inn-wf-nav button{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:10px;width:100%;min-height:44px;border:0;border-radius:9px;background:transparent;padding:8px;color:#7890a0;text-align:left;font-size:13px;font-weight:700;cursor:pointer}.inn-wf-nav button i{width:24px;height:24px;display:grid;place-items:center;border:1px solid #d7e4eb;border-radius:50%;color:#8aa0ae;font:700 11px/1 Arial;font-style:normal}.inn-wf-nav button.active{background:#eaf7fb;color:#167cad}.inn-wf-nav button.active i{border-color:#1688c0;background:#1688c0;color:#fff}.inn-wf-nav button.done{color:#3f6d78}.inn-wf-nav button.done i{border-color:#41b18c;background:#e7f8f1;color:#198463}.inn-wf-nav button:disabled{cursor:default;opacity:.48}.inn-wf-card{display:flex;flex-direction:column;height:calc(100vh - 96px);min-height:620px;overflow:hidden;border:1px solid #d7e5ed;border-radius:14px;background:#fff;box-shadow:0 8px 22px #1d50600a}.inn-wf-section{flex:1;min-height:0;overflow-y:auto;padding:26px 28px}.inn-wf-field{border-radius:10px;padding:10px 12px 9px;color:#5c788a;font-size:12px}.inn-wf-field textarea{min-height:88px;color:#294e68;font-size:14px}.inn-wf-field:focus-within,.inn-wf-anchor-grid label:focus-within{border-color:#72bdd7;background:#fff;box-shadow:0 0 0 3px #e9f7fb}.inn-wf-divider{display:flex;align-items:center;gap:12px;margin:24px 0 13px;color:#315b75;font-size:14px;font-weight:800}.inn-wf-divider:after{height:1px;flex:1;background:#e5eef2;content:""}.inn-wf-anchor-grid{display:grid;gap:9px}.inn-wf-anchor-grid label{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;align-items:center;border:1px solid #dce8ef;border-radius:9px;background:#fbfdfe;padding:9px 10px}.inn-wf-anchor-grid i{color:#197da8;font-size:11px;font-style:normal;font-weight:800}.inn-wf-anchor-grid input{width:100%;border:0;outline:0;background:transparent;color:#294e68;font-size:13px;font-weight:600}.inn-wf-actions,.inn-wf-report-tools{display:flex;justify-content:flex-end;gap:10px;border-top:1px solid #dce8ee;padding:16px 28px;background:#fbfdfe;box-shadow:0 -10px 24px #214d6710}.inn-wf-back{min-height:40px;border:0;border-radius:8px;background:transparent;padding:0 12px;color:#627f91;font-size:13px;font-weight:700;cursor:pointer}.inn-wf-back:hover{background:#edf7fa;color:#1478aa}.inn-wf-theme-page,.inn-wf-point-page{display:grid;gap:12px}.inn-wf-point-recall{overflow:hidden;border:1px solid #dce8ef;border-radius:12px;background:#fff}.inn-recall-controls{display:flex;justify-content:space-between;align-items:center;gap:14px;border-bottom:1px solid #e3edf2;padding:14px 17px}.inn-recall-type-tabs{display:flex;gap:4px}.inn-recall-type-tabs button{border:0;border-radius:7px;background:transparent;padding:9px 11px;color:#71899a;font-size:13px;font-weight:700;cursor:pointer}.inn-recall-type-tabs button.active{background:#f3f9fc;color:#126f9f}.inn-recall-filters{display:flex;gap:7px}.inn-recall-filters button,.inn-recall-meta button,.inn-recall-result footer button{border:1px solid #d3e2ea;border-radius:7px;background:#fff;padding:6px 9px;color:#396c88;font-size:12px;cursor:pointer}.inn-recall-meta{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 18px;background:#fbfdfe}.inn-recall-meta>div:first-child{display:flex;align-items:baseline;gap:7px}.inn-recall-meta strong{color:#197e95;font-size:22px}.inn-recall-meta span{color:#42677f;font-size:12px;font-weight:700}.inn-recall-meta small{margin-left:4px;color:#7b92a1;font-size:12px}.inn-recall-meta>div:last-child{display:flex;gap:7px}.inn-recall-sort{color:#1679ad!important;font-weight:700}.inn-recall-results{padding:0 18px}.inn-recall-result{padding:16px 0;border-top:1px solid #e8eff3}.inn-recall-result:first-child{border-top:0}.inn-recall-result.is-selected{background:linear-gradient(90deg,#f9fdfe,transparent)}.inn-recall-result header{display:grid;grid-template-columns:31px minmax(0,1fr) auto;gap:11px;align-items:start}.inn-recall-order{width:24px;height:24px;display:grid;place-items:center;border-radius:6px;background:#e8f5f9;color:#167ead;font-size:10px;font-weight:800}.inn-recall-title h3{margin:0;color:#183f5c;font-size:16px;line-height:1.55}.inn-recall-title h3 i{margin-left:8px;color:#1786bd;font-size:22px;font-style:normal;font-weight:400}.inn-recall-tags,.inn-wf-theme-membership{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.inn-recall-tags span,.inn-wf-theme-membership span{border-radius:5px;background:#eff7fa;padding:3px 6px;color:#477287;font-size:10px}.inn-wf-theme-membership{margin:0 0 6px}.inn-wf-theme-membership span{border-radius:99px;background:#e4f3f8;color:#147da9;font-weight:800}.inn-recall-selection{display:inline-flex;align-items:center;gap:5px;color:#49786d;font-size:11px;font-weight:700;white-space:nowrap}.inn-recall-selection input{width:16px;height:16px;margin:0;accent-color:#1685ac}.inn-recall-result>p{margin:10px 0 0;padding-left:42px;color:#718999;font-size:12px;line-height:1.65}.inn-recall-result>p b{margin-right:7px;color:#45677c}.inn-recall-result footer{display:flex;align-items:center;gap:11px;margin-top:10px;padding-left:42px;color:#7a92a1;font-size:11px}.inn-recall-result footer span:nth-child(2){margin-left:auto}.inn-recall-detail{margin:11px 0 0 42px;border-radius:8px;background:#f5fafc;padding:10px 12px;color:#577287;font-size:12px;line-height:1.7}.inn-recall-detail p{margin:5px 0}.inn-recall-detail small{color:#7b91a0}.inn-wf-point-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:6px;border-radius:11px;background:#edf4f7}.inn-wf-point-tabs button{min-width:0;border:1px solid transparent;border-radius:8px;background:transparent;padding:11px 12px;color:#6b8596;text-align:left;cursor:pointer}.inn-wf-point-tabs b,.inn-wf-point-tabs span{display:block}.inn-wf-point-tabs b{font-size:13px}.inn-wf-point-tabs span{overflow:hidden;margin-top:4px;font-size:11px;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}.inn-wf-point-tabs button.active{border-color:#a8d5e5;background:#fff;color:#167dac;box-shadow:0 4px 12px #1d50600d}.inn-wf-data-group{overflow:hidden;border:1px solid #dce8ef;border-radius:11px}.inn-wf-evidence-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;padding:12px}.inn-wf-policy-list{grid-template-columns:1fr}.inn-wf-evidence-card{display:grid;gap:7px;border:1px solid #dce8ef;border-radius:9px;background:#fff;padding:12px}.inn-wf-evidence-top{display:flex;align-items:center;gap:7px}.inn-wf-evidence-top input{width:15px;height:15px;margin:0;accent-color:#1688c1}.inn-wf-evidence-top i{border-radius:99px;background:#eaf7fb;padding:3px 7px;color:#167baa;font-size:10px;font-style:normal;font-weight:800}.inn-wf-evidence-card>input,.inn-wf-evidence-card>textarea{width:100%;border:0;outline:0;background:transparent;color:#294e68;font-size:13px;font-weight:600;line-height:1.55}.inn-wf-evidence-card>textarea{min-height:72px;resize:vertical;color:#607b8d;font-weight:500}.inn-wf-evidence-card small{color:#8298a6;font-size:11px;line-height:1.5}.inn-wf-report{display:block;overflow:auto;background:#f8fbfc;padding:0}.inn-wf-report-tools{position:sticky;top:0;z-index:2;background:#fff}.inn-wf-report-tools .primary-btn{min-height:36px}.inn-full-report{max-width:1040px;margin:0 auto;background:#fff;padding:34px 42px 64px;color:#263d4f}.inn-simple-report-title{margin-bottom:28px}.inn-simple-report-title h2{margin:0 0 8px;color:#132d42;font-size:27px;line-height:1.35}.inn-simple-report-title p{margin:0;color:#7b91a1;font-size:12px}.inn-report-outline{display:flex;flex-wrap:wrap;gap:7px;margin:-10px 0 25px}.inn-report-outline span{border-radius:999px;background:#f1f7fa;padding:5px 8px;color:#668196;font-size:11px}.inn-simple-decision{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;margin:0 0 27px;border-left:4px solid #1687b9;background:#f0f8fc;padding:17px 19px}.inn-simple-decision b{display:block;color:#174a68;font-size:15px}.inn-simple-decision p{margin:5px 0 0;color:#5d7789;font-size:13px;line-height:1.7}.inn-simple-grade{text-align:right}.inn-simple-grade strong{display:block;color:#0f8193;font-size:33px;line-height:1}.inn-simple-grade small{color:#688394;font-size:11px}.inn-simple-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:0 0 28px}.inn-simple-metrics div{border:1px solid #dce9ef;border-top:3px solid #2287bf;border-radius:9px;padding:11px}.inn-simple-metrics div:nth-child(2){border-top-color:#1aa3a2}.inn-simple-metrics div:nth-child(3){border-top-color:#d69c2a}.inn-simple-metrics span,.inn-simple-metrics b{display:block}.inn-simple-metrics span{color:#7890a0;font-size:11px}.inn-simple-metrics b{margin-top:3px;color:#204b69;font-size:21px}.inn-full-section{margin-bottom:34px}.inn-full-section h3{display:flex;align-items:center;gap:8px;margin:0 0 13px;color:#096fc0;font-size:19px}.inn-full-section h3:before{width:4px;height:19px;border-radius:4px;background:#1687b9;content:""}.inn-full-lead{margin:0 0 14px;color:#60798b;font-size:13px;line-height:1.78}.inn-report-facts{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.inn-report-facts>div{border:1px solid #dfeaf0;border-radius:9px;background:#fbfdfe;padding:12px 13px}.inn-report-facts .wide{grid-column:1/-1}.inn-report-facts b,.inn-report-facts span{display:block}.inn-report-facts b{margin-bottom:4px;color:#2b5672;font-size:12px}.inn-report-facts span{color:#607a8d;font-size:12px;line-height:1.68}.inn-report-table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #dce7ed;border-radius:9px;overflow:hidden;font-size:12px}.inn-report-table th,.inn-report-table td{padding:10px 11px;border-right:1px solid #e2ebf0;border-bottom:1px solid #e2ebf0;color:#587286;text-align:left;vertical-align:top;line-height:1.62}.inn-report-table th{background:#eff7fb;color:#275674;font-weight:800}.inn-report-table tr:last-child td{border-bottom:0}.inn-report-table th:last-child,.inn-report-table td:last-child{border-right:0}.inn-report-method{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:14px}.inn-report-method div{position:relative;min-height:76px;border:1px solid #dce8ee;border-radius:8px;background:#fff;padding:10px}.inn-report-method b,.inn-report-method small{display:block}.inn-report-method b{color:#2a5875;font-size:12px}.inn-report-method small{margin-top:5px;color:#7890a0;font-size:11px;line-height:1.5}.inn-report-analysis-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.inn-report-analysis-grid article{border:1px solid #dfe9ef;border-radius:10px;background:#fff;padding:14px}.inn-report-analysis-grid h4{margin:0 0 9px;color:#234f6d;font-size:14px}.inn-report-analysis-grid p{margin:0;color:#607a8d;font-size:12px;line-height:1.75}.inn-mini-chart{display:flex;align-items:flex-end;gap:5px;height:98px;margin:12px 0 25px;border-bottom:1px solid #dbe7ed;padding:7px 3px 0;background:repeating-linear-gradient(to bottom,transparent 0,transparent 31px,#f0f5f7 32px)}.inn-mini-chart span{display:block;flex:1;min-width:9px;border-radius:4px 4px 0 0;background:linear-gradient(#6ec2d7,#1b82b7)}.inn-report-tags{display:flex;flex-wrap:wrap;gap:6px;margin:9px 0}.inn-report-tags span{border-radius:6px;background:#eff7fa;padding:5px 7px;color:#3f718d;font-size:11px}.inn-full-point{margin:0 0 12px;border:1px solid #dce8ef;border-radius:11px;background:#fff;padding:15px}.inn-full-point>header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}.inn-full-point h4{margin:0;color:#1c4f70;font-size:15px}.inn-full-point h4 small{display:block;margin-top:4px;color:#7690a2;font-size:11px;font-weight:400}.inn-full-point>header>span{min-width:50px;border-radius:7px;background:#edf8fa;padding:5px 7px;color:#117f91;text-align:center;font-size:16px;font-weight:800}.inn-full-point>header>span small{display:block;color:#6f8b9a;font-size:9px;font-weight:600}.inn-full-point>p{margin:0 0 11px;color:#526f82;font-size:12px;line-height:1.75}.inn-full-point>div{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.inn-full-point section{border-radius:7px;background:#f7fafc;padding:9px 10px}.inn-full-point section b,.inn-full-point section span{display:block}.inn-full-point section b{color:#315e7b;font-size:11px}.inn-full-point section span{margin-top:4px;color:#708899;font-size:11px;line-height:1.55}.inn-policy-list{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:11px 0}.inn-policy-list div{display:grid;grid-template-columns:32px 1fr auto;gap:7px;align-items:center;border:1px solid #e1ebf0;border-radius:7px;background:#fbfdfe;padding:8px 9px}.inn-policy-list b{color:#1677a7;font-size:11px}.inn-policy-list span{color:#567387;font-size:11px;line-height:1.45}.inn-policy-list em{color:#6c8c9d;font-size:10px;font-style:normal;white-space:nowrap}.inn-rating-table{margin-top:14px}.inn-simple-disclaimer{margin:14px 0 0;border-top:1px solid #e3edf2;padding-top:13px;color:#8195a3;font-size:11px!important;line-height:1.65!important}@media(max-width:980px){.inn-wf-layout{grid-template-columns:1fr}.inn-wf-nav{position:static}.inn-wf-nav>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.inn-wf-nav button{grid-template-columns:24px minmax(0,1fr);min-height:48px;font-size:11px}.inn-wf-card{height:calc(100vh - 250px);min-height:560px}}@media(max-width:720px){.inn-simple-launch{display:block;padding:24px 8px}.inn-simple-launch-inner{margin:0;padding:25px 18px}.inn-simple-launch-title h1{font-size:29px}.inn-simple-mode-switch{width:100%}.inn-simple-mode-switch button{flex:1}.inn-simple-dropzone{min-height:154px}.inn-simple-dropzone b{max-width:100%;white-space:normal}.inn-simple-upload-continue{align-items:stretch;flex-direction:column-reverse}.inn-simple-upload-continue .primary-btn{width:100%}.inn-wf-shell{padding:8px}.inn-wf-nav>div{grid-template-columns:1fr 1fr}.inn-wf-card{height:calc(100vh - 320px);min-height:520px}.inn-wf-section{padding:18px}.inn-wf-grid,.inn-wf-evidence-list,.inn-report-facts,.inn-report-analysis-grid,.inn-full-point>div,.inn-policy-list{grid-template-columns:1fr}.inn-wf-field.wide,.inn-report-facts .wide{grid-column:auto}.inn-wf-point-tabs{grid-template-columns:1fr}.inn-recall-controls,.inn-recall-meta{align-items:flex-start;flex-direction:column}.inn-recall-result header{grid-template-columns:27px minmax(0,1fr)}.inn-recall-selection{grid-column:2}.inn-recall-result>p,.inn-recall-result footer{padding-left:0}.inn-recall-result footer{align-items:flex-start;flex-direction:column}.inn-recall-result footer span:nth-child(2){margin-left:0}.inn-full-report{padding:26px 18px 42px}.inn-simple-decision{grid-template-columns:1fr}.inn-simple-grade{text-align:left}.inn-simple-metrics{grid-template-columns:1fr}.inn-report-method{grid-template-columns:1fr 1fr}.inn-report-table{display:block;overflow-x:auto}.inn-report-table th,.inn-report-table td{min-width:110px}}
.inn-report-block-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:9px}.inn-report-status{border-radius:999px;background:#eaf7f1;padding:4px 7px;color:#16855f;font-size:10px;font-weight:800;white-space:nowrap}.inn-mini-chart span{position:relative}.inn-mini-chart span i{position:absolute;bottom:-20px;left:50%;color:#8a9da9;font:10px Arial;font-style:normal;transform:translateX(-50%)}.inn-mini-chart span:nth-child(2n){background:linear-gradient(#9ad7e4,#4ca0c4)}.inn-chart-caption{margin:25px 0 0!important;color:#8498a5!important;font-size:11px!important;text-align:left!important}.inn-trend-judgment{display:grid;grid-template-columns:1fr 1fr;gap:9px}.inn-trend-judgment article{border-left:3px solid #2a8dbc;background:#f5fafc;padding:12px}.inn-trend-judgment article:nth-child(2){border-left-color:#22a39d}.inn-trend-judgment article:nth-child(3){border-left-color:#d69c2a}.inn-trend-judgment article:nth-child(4){border-left-color:#477eaf}.inn-trend-judgment article:nth-child(5){grid-column:1/-1;border-left-color:#7b89bb}.inn-trend-judgment b,.inn-trend-judgment span{display:block}.inn-trend-judgment b{color:#285675;font-size:12px}.inn-trend-judgment span{margin-top:5px;color:#607a8d;font-size:12px;line-height:1.65}.inn-review-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.inn-review-grid article{border:1px solid #dfe9ef;border-radius:9px;padding:13px}.inn-review-grid article:last-child{grid-column:1/-1}.inn-review-grid b,.inn-review-grid span{display:block}.inn-review-grid b{color:#275775;font-size:13px}.inn-review-grid span{margin-top:5px;color:#617c8e;font-size:12px;line-height:1.65}.inn-review-grid em{display:inline-block;margin-top:8px;border-radius:5px;background:#eef7fa;padding:3px 6px;color:#17749e;font-size:10px;font-style:normal;font-weight:800}.inn-report-footnote{margin-top:11px;color:#8194a1;font-size:11px;line-height:1.65;text-align:left}
.inn-simple-file-glyph{position:relative;width:64px;height:68px;display:grid;place-items:center;margin-bottom:14px;color:#0879b7;border:1px solid #bcddeb;border-radius:15px 15px 13px 15px;background:linear-gradient(145deg,#f5fcff,#e8f5fb);box-shadow:inset 0 1px #fff,0 7px 15px #226a8c0d;transition:transform .18s ease,border-color .18s ease,background .18s ease}.inn-simple-file-glyph:before{position:absolute;top:0;right:0;width:17px;height:17px;content:"";border-bottom:1px solid #bcddeb;border-left:1px solid #bcddeb;border-radius:0 14px 0 8px;background:#dff0f8}.inn-simple-file-glyph svg{position:relative;z-index:1;transform:translateY(-2px)}.inn-simple-file-glyph em{position:absolute;z-index:2;right:-9px;bottom:-7px;min-width:29px;border:2px solid #fbfdfe;border-radius:6px;padding:3px 4px;color:#fff;background:#1680b8;box-shadow:0 4px 10px #1573a324;font-family:"DIN Alternate","Avenir Next Condensed","PingFang SC",sans-serif;font-size:9px;font-style:normal;font-weight:900;letter-spacing:.06em;line-height:1}.inn-simple-dropzone:hover .inn-simple-file-glyph{border-color:#75b9d7;background:#f8fdff;transform:translateY(-2px)}
@media(max-width:720px){.inn-trend-judgment,.inn-review-grid{grid-template-columns:1fr}.inn-trend-judgment article:nth-child(5),.inn-review-grid article:last-child{grid-column:auto}}@media(prefers-reduced-motion:reduce){.inn-simple-file-glyph{transition:none}}
.inn-wf-research-page{display:grid;min-height:0;padding-top:18px}.inn-wf-research-page>.inn-wf-point-recall{min-height:0;overflow:auto}.inn-wf-research-page .inn-wf-point-tabs{margin:13px 13px 0}.inn-wf-subnav{display:grid;gap:2px;margin:0 0 7px 37px;border-left:1px solid #d9e9ef;padding:5px 0 5px 11px}.inn-wf-nav .inn-wf-subnav button{display:block;min-height:32px;border-radius:6px;padding:7px 8px;color:#7c94a4;font-size:12px;font-weight:700}.inn-wf-nav .inn-wf-subnav button.active{background:#f0f8fb;color:#147cae}
@media(max-width:980px){.inn-wf-subnav{grid-column:1/-1;margin:-2px 4px 4px 32px}}@media(max-width:720px){.inn-wf-subnav{margin:-2px 2px 3px 28px}.inn-wf-nav .inn-wf-subnav button{font-size:11px}}
@media(min-width:981px){.inn-wf-card{height:calc(100vh - 36px)}}
.inn-simple-launch{min-height:100vh}
.inn-simple-start{border-color:#087bb8;background:#087bb8}.inn-simple-start:hover{border-color:#075e90;background:#075e90}
.inn-wf-source-report{display:flex;overflow:hidden!important;padding:0!important;background:#f6f7f9}.inn-source-report-frame{display:block;width:100%;height:100%;flex:1;border:0;background:#f6f7f9}.inn-wf-card>.inn-source-report-actions{position:static;display:flex;flex:0 0 auto;justify-content:flex-end;align-items:center;gap:12px;min-height:72px;border-top:1px solid #dce8ee;background:#fbfdfe;padding:12px 28px}.inn-source-report-back{min-height:40px;border:1px solid #cbdde6;border-radius:8px;background:#fff;padding:0 16px;color:#617d8e;font-size:13px;font-weight:700;cursor:pointer}.inn-source-report-back:hover{border-color:#8fc2d6;background:#f2fafc;color:#1676a2}
@media(min-width:981px){.inn-wf-layout{grid-template-columns:180px minmax(0,1fr)}}
.inn-wf-nav .inn-wf-nav-collapse{position:absolute;top:13px;right:10px;display:grid;width:27px;min-height:27px;place-items:center;border:1px solid #c8dce7;border-radius:6px;background:#fff;padding:0;color:#39728e;font-size:22px;font-weight:400;line-height:1;cursor:pointer}.inn-wf-nav .inn-wf-nav-collapse:hover{border-color:#8ec5db;background:#edf8fb;color:#147cae}.inn-wf-nav.collapsed{display:grid;min-height:48px;place-items:center;overflow:visible;border:0;background:transparent;box-shadow:none}.inn-wf-nav.collapsed .inn-wf-nav-collapse{position:static;width:27px;min-height:27px;border:1px solid #c8dce7;border-radius:6px;background:#fff;font-size:22px;transform:translateY(4px)}.inn-wf-nav.collapsed .inn-wf-nav-collapse:hover{background:#edf8fb}
@media(min-width:981px){.inn-wf-layout.report-flow-collapsed{grid-template-columns:48px minmax(0,1fr)}}

/* 创新性分析：以企业研究工作台的节奏重构输入、检索和交付环节。 */
.innovation-page{--inn-ink:#133d59;--inn-muted:#71899a;--inn-line:#d8e7ee;--inn-surface:#fff;--inn-soft:#f4f9fb;--inn-accent:#087eb9;min-height:100%;background:radial-gradient(circle at 74% 5%,#e9f5f8 0,rgba(233,245,248,0) 27%),#f6fafc}
.inn-simple-launch{padding:clamp(34px,6vh,72px) 26px;background:transparent}
.inn-simple-launch-inner{position:relative;width:min(920px,100%);margin:0 auto;padding:clamp(30px,4vw,44px);overflow:hidden;border:1px solid #d7e6ed;border-radius:18px;background:linear-gradient(145deg,#fff 0%,#f7fbfc 100%);box-shadow:0 18px 42px rgba(22,68,93,.09)}
.inn-simple-launch-inner:before{position:absolute;top:0;right:0;left:0;height:3px;background:linear-gradient(90deg,#0c83bb,#46abc5 58%,#c5e7ea);content:""}
.inn-simple-launch-title{position:relative;margin-bottom:26px}.inn-simple-launch-title h1{font-size:clamp(30px,3vw,38px);letter-spacing:-.05em}.inn-simple-launch-title p{max-width:620px;margin-top:7px;color:#6f899b;font-size:14px;line-height:1.65}
.inn-simple-mode-switch{margin-bottom:8px;border-color:#dbe8ee;background:#f1f7f9}.inn-simple-mode-switch button{min-height:38px;padding:0 15px}.inn-simple-mode-switch button.active{background:#fff;box-shadow:0 2px 7px rgba(21,79,108,.09)}
.inn-simple-mode-hint{margin:0 0 17px;color:#7490a0;font-size:12px}
.inn-simple-composer{border-color:#d8e7ee;border-radius:14px;box-shadow:0 10px 25px rgba(19,67,94,.06)}
.inn-simple-dropzone{min-height:210px;border-color:#c7dfe9;background:linear-gradient(180deg,#fcfeff,#f7fbfc);transition:border-color .2s ease,background .2s ease,box-shadow .2s ease}.inn-simple-dropzone:hover,.inn-simple-dropzone:focus-within{border-color:#54a9ce;background:#fafdfe;box-shadow:inset 0 0 0 3px rgba(69,170,204,.08)}
.inn-simple-template-link{margin:13px auto 15px;color:#207aa5}.inn-simple-upload-continue{margin-top:16px}.inn-simple-upload-continue .primary-btn,.inn-simple-manual-footer .primary-btn{min-width:142px}
.inn-wf-shell{max-width:1660px;padding:22px clamp(18px,2.3vw,38px) 32px}.inn-wf-layout{gap:20px}.inn-wf-nav{top:20px;overflow:hidden;border-color:#d7e6ed;border-radius:16px;background:linear-gradient(180deg,#fff,#fbfdfe);box-shadow:0 12px 28px rgba(22,70,95,.07)}
.inn-wf-nav h1{padding:21px 18px 17px;border-color:#e4eef2;color:var(--inn-ink);font-size:18px;letter-spacing:-.03em}.inn-wf-nav>div{padding:10px}.inn-wf-nav button{position:relative;min-height:48px;border-radius:10px;padding:9px 10px;color:#6f899a;transition:background .18s ease,color .18s ease,transform .18s ease}.inn-wf-nav button:hover:not(:disabled){background:#f3f9fb;color:#2576a1}.inn-wf-nav button:active:not(:disabled){transform:translateY(1px)}
.inn-wf-nav button i{width:25px;height:25px;border-color:#d5e3ea;color:#8097a6}.inn-wf-nav button.active{background:#e7f5fa;color:#116e9f;box-shadow:inset 3px 0 0 #1486bc}.inn-wf-nav button.active i{border-color:#1688be;background:#1688be;box-shadow:0 3px 8px rgba(20,131,182,.18)}.inn-wf-nav button.done{color:#46707a}.inn-wf-nav button.done i{border-color:#7bcbaf;background:#effaf5;color:#188564}
.inn-wf-card{border-color:#d7e6ed;border-radius:16px;background:#fff;box-shadow:0 14px 32px rgba(19,67,94,.08)}
.inn-wf-stage-header{display:flex;align-items:flex-start;justify-content:space-between;gap:26px;flex:0 0 auto;border-bottom:1px solid #e0ebf0;background:linear-gradient(120deg,#fff 0%,#f4fafc 100%);padding:21px 28px 20px}.inn-wf-stage-copy{min-width:0}.inn-wf-stage-copy>span{display:block;margin-bottom:6px;color:#1681b2;font-size:11px;font-weight:800;letter-spacing:.08em}.inn-wf-stage-copy h2{margin:0;color:var(--inn-ink);font-size:22px;letter-spacing:-.035em;line-height:1.3}.inn-wf-stage-copy p{max-width:720px;margin:7px 0 0;color:#6d8798;font-size:13px;line-height:1.7}
.inn-wf-stage-metrics{display:grid;grid-template-columns:repeat(2,minmax(106px,1fr));gap:1px;flex:0 0 auto;min-width:250px;margin:2px 0 0;overflow:hidden;border:1px solid #d7e6ed;border-radius:10px;background:#d7e6ed}.inn-wf-stage-metrics div{min-width:0;background:rgba(255,255,255,.82);padding:11px 13px}.inn-wf-stage-metrics dt{margin:0;color:#8198a7;font-size:10px;font-weight:700}.inn-wf-stage-metrics dd{overflow:hidden;margin:5px 0 0;color:#24536e;font-size:13px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}
.inn-wf-section{padding:22px 28px;background:linear-gradient(180deg,#fff,#fcfeff)}.inn-wf-grid{gap:13px}.inn-wf-field{gap:7px;border-color:#dbe8ee;border-radius:11px;background:#f8fbfc;padding:12px 14px;transition:border-color .18s ease,background .18s ease,box-shadow .18s ease}.inn-wf-field:hover{border-color:#bdd8e5;background:#fbfdfe}.inn-wf-field>span{color:#52768c;font-size:12px;font-weight:800}.inn-wf-field input,.inn-wf-field textarea{color:#224b65;font-size:14px;font-weight:600}.inn-wf-field textarea{min-height:92px;line-height:1.7}.inn-wf-field:focus-within,.inn-wf-anchor-grid label:focus-within{border-color:#57aacb;background:#fff;box-shadow:0 0 0 3px rgba(77,171,205,.12)}
.inn-wf-project-page{display:grid;align-content:start;gap:15px;overflow:auto}.inn-project-overview,.inn-project-targets{border:1px solid #dce9ef;border-radius:13px;background:linear-gradient(145deg,#fbfeff,#f5fafc);padding:15px 16px}.inn-project-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:11px}.inn-project-section-head span,.inn-project-section-head b{display:block}.inn-project-section-head span{color:#295773;font-size:13px;font-weight:800}.inn-project-section-head p{margin:4px 0 0;color:#7892a1;font-size:11px;line-height:1.55}.inn-project-section-head>small{flex:0 0 auto;border:1px solid #d5e7ee;border-radius:999px;background:#fff;padding:4px 7px;color:#5b8093;font-size:10px;font-weight:700}.inn-project-overview-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.inn-project-overview .inn-wf-field{min-height:48px;background:#fff}.inn-project-overview .inn-wf-field input{height:24px}.inn-project-confirm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.inn-project-confirm-item{display:grid;gap:9px;border:1px solid #dce9ef;border-radius:13px;background:#fff;padding:14px 15px;transition:border-color .18s ease,box-shadow .18s ease}.inn-project-confirm-item:hover{border-color:#b7d8e6}.inn-project-confirm-item:focus-within{border-color:#57aacb;box-shadow:0 0 0 3px rgba(77,171,205,.12)}.inn-project-confirm-head{display:flex;align-items:center;gap:9px}.inn-project-confirm-head>i{width:23px;height:23px;display:grid;place-items:center;border-radius:7px;background:#e9f6fa;color:#147ca8;font:800 10px/1 Arial;font-style:normal}.inn-project-confirm-head b{display:block;color:#295773;font-size:13px}.inn-project-confirm-head small{display:block;margin-top:3px;color:#8198a6;font-size:10px}.inn-project-confirm-item textarea{box-sizing:border-box;width:100%;min-height:104px;border:0;border-top:1px solid #e8f0f3;outline:0;background:transparent;padding:9px 0 0;color:#2b536c;font-family:"Microsoft YaHei",sans-serif;font-size:13px;font-weight:600;line-height:1.68;resize:vertical}.inn-project-target-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.inn-project-target-grid article{display:grid;gap:7px;border:1px solid #dce8ee;border-radius:9px;background:#fff;padding:10px}.inn-project-target-grid article>span{overflow:hidden;color:#56778b;font-size:11px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}.inn-project-target-grid article>div{display:flex;align-items:baseline;justify-content:space-between;gap:6px}.inn-project-target-grid small{color:#91a3ad;font-size:10px}.inn-project-target-grid b{color:#6e8795;font-size:11px;white-space:nowrap}.inn-project-target-grid strong{color:#1379a9;font-size:12px;white-space:nowrap}.inn-project-details-toggle{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;border:1px dashed #c4dbe6;border-radius:11px;background:#fbfdfe;padding:12px 15px;color:#315e79;text-align:left;cursor:pointer;transition:border-color .18s ease,background .18s ease}.inn-project-details-toggle:hover{border-color:#79b9d3;background:#f4fafc}.inn-project-details-toggle b,.inn-project-details-toggle small{display:block}.inn-project-details-toggle b{font-size:12px}.inn-project-details-toggle small{margin-top:3px;color:#8197a4;font-size:10px}.inn-project-details-toggle em{flex:0 0 auto;color:#147ca8;font-size:11px;font-style:normal;font-weight:800}.inn-project-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:1px}.inn-project-details .inn-wf-field textarea{min-height:84px}
.inn-wf-project-page{gap:20px;background:#fff}.inn-project-overview,.inn-project-targets{border:0;border-radius:0;background:transparent;padding:0}.inn-project-section-head{margin-bottom:12px}.inn-project-section-head span{font-size:15px}.inn-project-section-head p{margin-top:5px;font-size:12px}.inn-project-section-head>small{border:0;background:#eef7fa;padding:5px 8px;color:#467488;font-size:11px}.inn-project-overview-fields{gap:12px}.inn-project-overview .inn-wf-field,.inn-project-details .inn-wf-field{border:0;background:#f4f8fa;padding:13px 15px}.inn-project-overview .inn-wf-field:hover,.inn-project-details .inn-wf-field:hover{background:#eff7fa}.inn-project-overview .inn-wf-field>span,.inn-project-details .inn-wf-field>span{font-size:13px}.inn-project-overview .inn-wf-field input{font-size:15px}.inn-project-confirm-grid{gap:14px}.inn-project-confirm-item{gap:10px;border:0;border-radius:11px;background:#f5f9fb;padding:16px}.inn-project-confirm-item:hover{border-color:transparent;background:#f1f8fb}.inn-project-confirm-item:focus-within{border-color:transparent;box-shadow:0 0 0 3px rgba(77,171,205,.13)}.inn-project-confirm-head>i{width:26px;height:26px;border-radius:8px;font-size:11px}.inn-project-confirm-head b{font-size:15px}.inn-project-confirm-head small{font-size:11px}.inn-project-confirm-item textarea{min-height:109px;border-top:0;padding:0;color:#244c66;font-size:14px;line-height:1.78}.inn-project-target-grid{gap:10px}.inn-project-target-grid article{gap:10px;border:0;border-radius:10px;background:#f5f9fb;padding:16px}.inn-project-target-grid article>span{font-size:15px}.inn-project-target-grid small{font-size:13px}.inn-project-target-grid b{font-size:15px}.inn-project-target-grid strong{font-size:17px}.inn-project-details-toggle{border:0;border-radius:10px;background:#f5f9fb;padding:16px 18px}.inn-project-details-toggle:hover{border-color:transparent;background:#eff7fa}.inn-project-details-toggle b{font-size:16px}.inn-project-details-toggle small{font-size:11px}.inn-project-details-toggle em{font-size:15px}.inn-project-details .inn-wf-field textarea{font-size:14px}
.inn-project-details .inn-wf-field>span{font-size:13px}.inn-project-details .inn-wf-field textarea{min-height:109px;font-size:14px;line-height:1.78}
.inn-wf-analysis-page{display:grid;align-content:start;gap:22px;overflow:auto}.inn-analysis-project-summary{padding:16px 18px;border-radius:12px;background:#f4f8fa}.inn-analysis-project-summary>header,.inn-analysis-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.inn-analysis-project-summary>header>span,.inn-analysis-section-head>span{color:#285773;font-size:15px;font-weight:800}.inn-analysis-project-summary>header button{border:0;border-radius:7px;background:#e8f5f9;padding:7px 10px;color:#187ca8;font-size:12px;font-weight:800;cursor:pointer}.inn-analysis-project-summary>div{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:13px}.inn-analysis-project-summary article{min-width:0;border-radius:9px;background:#fff;padding:11px 13px}.inn-analysis-project-summary article:first-child,.inn-analysis-project-summary article:nth-child(4){grid-column:1/-1}.inn-analysis-project-summary small,.inn-analysis-topic-card label>span,.inn-analysis-point-card label>span{display:block;color:#708c9c;font-size:11px;font-weight:800}.inn-analysis-project-summary b{display:block;margin-top:5px;color:#244c66;font-size:15px;line-height:1.55}.inn-analysis-project-summary p{margin:5px 0 0;color:#365f77;font-size:13px;font-weight:600;line-height:1.7}.inn-analysis-section{display:grid;gap:11px}.inn-analysis-section-head small{border-radius:999px;background:#e8f5f9;padding:4px 8px;color:#257c9f;font-size:11px;font-weight:800}.inn-analysis-topic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.inn-analysis-topic-card,.inn-analysis-point-card{display:grid;gap:12px;border-radius:12px;background:#f5f9fb;padding:15px}.inn-analysis-topic-card header,.inn-analysis-point-card header{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:9px}.inn-analysis-topic-card header i,.inn-analysis-point-card header i{border-radius:7px;background:#e5f4f9;padding:6px 7px;color:#147ca8;font-size:11px;font-style:normal;font-weight:800;white-space:nowrap}.inn-analysis-topic-card header input,.inn-analysis-point-card header input{width:100%;border:0;outline:0;background:transparent;color:#244d67;font-family:"Microsoft YaHei",sans-serif;font-size:14px;font-weight:800;line-height:1.5}.inn-analysis-topic-card label,.inn-analysis-point-card label{display:grid;gap:6px}.inn-analysis-topic-card textarea,.inn-analysis-topic-card label input,.inn-analysis-point-card textarea,.inn-analysis-point-card label input{box-sizing:border-box;width:100%;border:0;border-radius:8px;outline:0;background:#fff;padding:9px 10px;color:#365f77;font-family:"Microsoft YaHei",sans-serif;font-size:13px;font-weight:600;line-height:1.65}.inn-analysis-topic-card textarea,.inn-analysis-point-card textarea{min-height:62px;resize:vertical}.inn-analysis-topic-card>div,.inn-analysis-point-fields{display:grid;grid-template-columns:1fr 1fr;gap:9px}.inn-analysis-point-list{display:grid;gap:10px}.inn-analysis-point-card{gap:13px;background:#f6fafc}.inn-analysis-point-card header{padding-bottom:2px}.inn-analysis-point-fields label:first-child,.inn-analysis-point-fields label:nth-child(3){grid-column:1/-1}
.inn-analysis-point-card{grid-template-columns:minmax(235px,.78fr) minmax(0,2fr);gap:0;overflow:hidden;padding:0;background:#f6fafc}.inn-analysis-point-card header{grid-template-columns:1fr;align-content:start;gap:10px;background:#edf6f9;padding:17px}.inn-analysis-point-card header i{width:max-content}.inn-analysis-point-card header input{font-size:15px;line-height:1.65}.inn-analysis-point-fields{grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;gap:11px;padding:15px}.inn-analysis-point-fields label:first-child,.inn-analysis-point-fields label:nth-child(3){grid-column:auto}.inn-analysis-point-card textarea{min-height:76px}
.inn-wf-divider{margin:27px 0 14px;color:#254f69;font-size:14px}.inn-wf-divider:after{background:#dfeaf0}.inn-wf-anchor-grid{gap:10px}.inn-wf-anchor-grid label{grid-template-columns:82px minmax(0,1fr);min-height:48px;border-color:#dce8ee;border-radius:10px;background:#fbfdfe;padding:9px 12px;transition:border-color .18s ease,background .18s ease}.inn-wf-anchor-grid label:hover{border-color:#bdd8e5;background:#fff}.inn-wf-anchor-grid i{width:max-content;border-radius:5px;background:#e8f5f9;padding:4px 6px;color:#147ca8;font-size:10px}.inn-wf-anchor-grid input{color:#2b536c;font-size:13px}.inn-wf-analysis-page .inn-wf-grid>label:first-child{grid-column:1/-1}
.inn-wf-research-page{padding:17px;background:linear-gradient(180deg,#f9fcfd,#fff)}.inn-wf-point-recall{border-color:#d9e7ed;border-radius:14px;box-shadow:0 8px 22px rgba(20,73,98,.05)}.inn-recall-controls{gap:18px;border-color:#e0ebf0;padding:12px 16px;background:#fff}.inn-recall-type-tabs{gap:3px;padding:3px;border-radius:8px;background:#f1f7f9}.inn-recall-type-tabs button{min-height:32px;border-radius:6px;padding:0 12px}.inn-recall-type-tabs button.active{background:#fff;color:#0d709f;box-shadow:0 2px 6px rgba(25,84,111,.08)}.inn-recall-filters button,.inn-recall-meta button,.inn-recall-result footer button{border-color:#d2e1e8;border-radius:6px;background:#fff;color:#52768b;font-weight:700;transition:border-color .16s ease,background .16s ease,color .16s ease}.inn-recall-filters button:hover,.inn-recall-meta button:hover,.inn-recall-result footer button:hover{border-color:#8fc3d8;background:#f2fafc;color:#126f9e}
.inn-recall-meta{border-bottom:1px solid #e4edf1;background:#f8fbfc;padding:14px 18px}.inn-recall-meta strong{color:#087fad;font-size:24px}.inn-recall-meta small{color:#718b9b}.inn-recall-results{padding:4px 18px 10px}.inn-recall-result{padding:18px 0;border-color:#e6eef2;transition:background .16s ease,box-shadow .16s ease}.inn-recall-result.is-selected{margin:4px -8px;padding:18px 8px;border-top-color:transparent;border-radius:10px;background:#f3fafc;box-shadow:inset 3px 0 0 #20a2b6}.inn-recall-order{width:26px;height:26px;border-radius:7px;background:#e9f6fa;color:#137eaa}.inn-recall-title h3{color:#183f59;font-size:17px;line-height:1.5}.inn-recall-tags span{border-radius:4px;background:#edf5f8;color:#58788a}.inn-recall-result>p{color:#607e90;font-size:12px;line-height:1.75}.inn-recall-result>p b{color:#2d607d}.inn-recall-result footer{color:#7890a0}.inn-recall-detail{border:1px solid #dce9ee;background:#fff}
.inn-wf-actions{align-items:center;justify-content:space-between;min-height:68px;padding:12px 28px;border-color:#dce9ef;background:#fbfdfe;box-shadow:0 -8px 20px rgba(27,77,103,.06)}.inn-wf-action-context{display:grid;gap:3px}.inn-wf-action-context span{color:#8298a7;font-size:11px;font-weight:700}.inn-wf-action-context b{color:#386178;font-size:13px}.inn-wf-action-buttons{display:flex;align-items:center;gap:10px}.inn-wf-actions .primary-btn{min-width:158px}.inn-wf-back{min-height:40px;border:1px solid transparent;border-radius:8px}.inn-wf-back:hover{border-color:#d7e6ed;background:#f1f8fb}.inn-wf-card-report{border-color:#cedfe8;box-shadow:0 16px 38px rgba(18,63,90,.1)}.inn-wf-source-report{background:#edf4f7}.inn-wf-card>.inn-source-report-actions{min-height:68px;border-color:#dce9ef;background:#fbfdfe;box-shadow:0 -8px 20px rgba(27,77,103,.06)}
@media(prefers-reduced-motion:no-preference){.inn-wf-stage-header,.inn-wf-section{animation:inn-workflow-enter .28s cubic-bezier(.16,1,.3,1) both}.inn-simple-launch-inner{animation:inn-workflow-enter .32s cubic-bezier(.16,1,.3,1) both}}@keyframes inn-workflow-enter{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:980px){.inn-wf-shell{padding:16px}.inn-wf-stage-header{padding:19px 22px}.inn-wf-stage-metrics{min-width:230px}.inn-wf-section{padding:20px 22px}.inn-project-target-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){.inn-simple-launch{padding:20px 12px}.inn-simple-launch-inner{padding:28px 20px;border-radius:15px}.inn-simple-dropzone{min-height:178px}.inn-wf-stage-header{display:grid;gap:16px;padding:18px}.inn-wf-stage-copy h2{font-size:20px}.inn-wf-stage-metrics{width:100%;min-width:0}.inn-wf-section{padding:18px}.inn-wf-analysis-page .inn-wf-grid>label:first-child{grid-column:auto}.inn-wf-actions{padding:12px 18px}.inn-wf-action-context{display:none}.inn-wf-action-buttons{width:100%;justify-content:space-between}.inn-wf-actions .primary-btn{min-width:0}.inn-recall-controls{align-items:flex-start;flex-direction:column}.inn-recall-filters{flex-wrap:wrap}.inn-recall-results{padding:4px 12px 8px}.inn-recall-result.is-selected{margin-right:-3px;margin-left:-3px;padding-right:7px;padding-left:7px}.inn-project-overview-fields,.inn-project-confirm-grid,.inn-project-details{grid-template-columns:1fr}.inn-project-target-grid{grid-template-columns:1fr 1fr}.inn-project-confirm-item textarea{min-height:92px}.inn-project-details-toggle{align-items:flex-start;flex-direction:column;gap:7px}}
@media(min-width:1440px){.inn-wf-shell{max-width:1920px;padding:28px clamp(34px,3.1vw,70px) 38px}.inn-wf-layout{grid-template-columns:245px minmax(0,1fr);gap:24px}.inn-wf-nav h1{font-size:clamp(19px,1.1vw,23px)}.inn-wf-nav button{min-height:55px;font-size:clamp(14px,.82vw,17px)}.inn-wf-nav button i{width:29px;height:29px;font-size:12px}.inn-wf-stage-header{padding:25px 34px 23px}.inn-wf-stage-copy>span{font-size:12px}.inn-wf-stage-copy h2{font-size:clamp(24px,1.45vw,31px)}.inn-wf-stage-copy p{max-width:900px;font-size:clamp(14px,.8vw,17px)}.inn-wf-stage-metrics{min-width:310px}.inn-wf-stage-metrics dt{font-size:12px}.inn-wf-stage-metrics dd{font-size:clamp(14px,.82vw,17px)}.inn-wf-section{padding:28px 34px}.inn-wf-field{padding:14px 16px}.inn-wf-field>span{font-size:13px}.inn-wf-field input,.inn-wf-field textarea{font-size:clamp(15px,.84vw,17px)}.inn-wf-field textarea{min-height:108px}.inn-wf-divider{font-size:16px}.inn-wf-anchor-grid label{min-height:55px}.inn-wf-anchor-grid i{font-size:11px}.inn-wf-anchor-grid input{font-size:clamp(14px,.8vw,16px)}.inn-wf-actions{min-height:76px;padding:14px 34px}.inn-wf-action-context span{font-size:12px}.inn-wf-action-context b,.inn-wf-back,.inn-wf-actions .primary-btn{font-size:15px}.inn-wf-actions .primary-btn{min-height:46px}.inn-project-section-head span{font-size:clamp(16px,.9vw,19px)}.inn-project-overview .inn-wf-field>span,.inn-project-details .inn-wf-field>span{font-size:14px}.inn-project-overview .inn-wf-field input{font-size:clamp(16px,.9vw,18px)}.inn-project-confirm-head>i{width:30px;height:30px;font-size:12px}.inn-project-confirm-head b{font-size:clamp(16px,.9vw,18px)}.inn-project-confirm-item textarea{min-height:124px;font-size:clamp(15px,.84vw,17px)}.inn-project-target-grid article{padding:18px}.inn-project-target-grid article>span{font-size:clamp(16px,.9vw,19px)}.inn-project-target-grid small{font-size:clamp(13px,.74vw,15px)}.inn-project-target-grid b{font-size:clamp(15px,.84vw,18px)}.inn-project-target-grid strong{font-size:clamp(17px,1vw,21px)}.inn-project-details-toggle{padding:18px 20px}.inn-project-details-toggle b{font-size:clamp(16px,.9vw,19px)}.inn-project-details-toggle em{font-size:clamp(15px,.84vw,17px)}.inn-recall-type-tabs button,.inn-recall-filters button,.inn-recall-meta button,.inn-recall-result footer button{font-size:14px}.inn-recall-meta strong{font-size:30px}.inn-recall-meta small,.inn-recall-result>p,.inn-recall-result footer{font-size:13px}.inn-recall-title h3{font-size:clamp(18px,1vw,21px)}.inn-recall-tags span{font-size:12px}.inn-source-report-back,.inn-source-report-actions .primary-btn{font-size:15px}}
@media(min-width:1440px){.inn-project-details .inn-wf-field>span{font-size:14px}.inn-project-details .inn-wf-field textarea{min-height:124px;font-size:clamp(15px,.84vw,17px);line-height:1.78}}
@media(min-width:1440px){.inn-wf-analysis-page{gap:26px}.inn-analysis-project-summary{padding:20px 22px}.inn-analysis-project-summary>header>span,.inn-analysis-section-head>span{font-size:clamp(17px,.95vw,20px)}.inn-analysis-project-summary>header button{font-size:14px}.inn-analysis-project-summary small,.inn-analysis-topic-card label>span,.inn-analysis-point-card label>span{font-size:12px}.inn-analysis-project-summary b{font-size:clamp(16px,.9vw,19px)}.inn-analysis-project-summary p{font-size:clamp(14px,.82vw,17px)}.inn-analysis-section-head small{font-size:12px}.inn-analysis-topic-card,.inn-analysis-point-card{gap:14px;padding:18px}.inn-analysis-topic-card header i,.inn-analysis-point-card header i{font-size:12px}.inn-analysis-topic-card header input,.inn-analysis-point-card header input{font-size:clamp(16px,.9vw,19px)}.inn-analysis-topic-card textarea,.inn-analysis-topic-card label input,.inn-analysis-point-card textarea,.inn-analysis-point-card label input{padding:11px 12px;font-size:clamp(14px,.82vw,17px)}.inn-analysis-topic-card textarea,.inn-analysis-point-card textarea{min-height:72px}}
@media(min-width:1440px){.inn-analysis-point-card{grid-template-columns:minmax(270px,.78fr) minmax(0,2fr);gap:0;padding:0}.inn-analysis-point-card header{gap:12px;padding:21px}.inn-analysis-point-card header i{font-size:12px}.inn-analysis-point-card header input{font-size:clamp(16px,.9vw,19px)}.inn-analysis-point-fields{gap:13px;padding:19px}.inn-analysis-point-card textarea{min-height:82px}}
@media(max-width:720px){.inn-analysis-project-summary>div,.inn-analysis-topic-grid,.inn-analysis-topic-card>div,.inn-analysis-point-fields{grid-template-columns:1fr}.inn-analysis-project-summary article:first-child,.inn-analysis-point-fields label:first-child,.inn-analysis-point-fields label:nth-child(3){grid-column:auto}.inn-analysis-point-card{grid-template-columns:1fr}.inn-analysis-point-card header{padding:15px}.inn-analysis-point-fields{padding:13px}}
.inn-analysis-topic-card header textarea,.inn-analysis-point-card header textarea{box-sizing:border-box;width:100%;min-height:48px;border:0;outline:0;background:transparent;padding:0;color:#244d67;font-family:"Microsoft YaHei",sans-serif;font-size:15px;font-weight:800;line-height:1.6;resize:none}.inn-analysis-topic-card>div textarea{min-height:62px}.inn-analysis-point-card{grid-template-columns:1fr;gap:12px;overflow:visible;padding:16px;background:#f5f9fb}.inn-analysis-point-card header{grid-template-columns:auto minmax(0,1fr);align-items:start;gap:10px;background:transparent;padding:0}.inn-analysis-point-card header i{margin-top:2px}.inn-analysis-point-fields{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:0}.inn-analysis-point-fields label:first-child,.inn-analysis-point-fields label:nth-child(3){grid-column:auto}.inn-analysis-point-card textarea{min-height:70px}.inn-analysis-point-fields textarea{resize:vertical}
@media(min-width:1440px){.inn-analysis-topic-card header textarea,.inn-analysis-point-card header textarea{min-height:54px;font-size:clamp(16px,.9vw,19px)}.inn-analysis-topic-card textarea,.inn-analysis-point-card textarea{font-size:clamp(14px,.82vw,17px)}.inn-analysis-point-card{gap:15px;padding:19px}.inn-analysis-point-fields{gap:13px}.inn-analysis-point-card textarea{min-height:82px}}
@media(max-width:720px){.inn-analysis-topic-card header textarea,.inn-analysis-point-card header textarea{min-height:52px}.inn-analysis-point-card,.inn-analysis-point-fields{grid-template-columns:1fr}.inn-analysis-point-card{padding:14px}.inn-analysis-point-fields{gap:9px}.inn-analysis-point-card textarea{min-height:66px}}
.inn-analysis-point-list{gap:16px}.inn-analysis-point-card{display:block;overflow:hidden;padding:0;border-radius:14px;background:#f3f8fa;box-shadow:0 7px 18px rgba(21,74,99,.045)}.inn-analysis-point-card>header{display:block;background:linear-gradient(100deg,#e5f4f8,#edf8fb);padding:15px 18px}.inn-analysis-point-title{display:grid;grid-template-columns:40px minmax(0,1fr);align-items:center;gap:12px}.inn-analysis-point-title>i{width:40px;height:40px;display:grid;place-items:center;margin:0;border-radius:10px;background:#1688ba;color:#fff;font:800 14px/1 Arial;font-style:normal}.inn-analysis-point-title small{display:block;margin-bottom:4px;color:#23769a;font-size:11px;font-weight:800}.inn-analysis-point-title textarea{box-sizing:border-box;width:100%;min-height:42px;border:0;outline:0;background:transparent;padding:0;color:#1f4c68;font-family:"Microsoft YaHei",sans-serif;font-size:16px;font-weight:800;line-height:1.55;resize:none}.inn-analysis-point-body{display:grid;gap:12px;padding:14px 18px 17px}.inn-analysis-point-body label{display:grid;gap:6px}.inn-analysis-point-body label>span{color:#668798;font-size:12px;font-weight:800}.inn-analysis-point-body textarea{box-sizing:border-box;width:100%;min-height:66px;border:0;border-radius:9px;outline:0;background:#fff;padding:10px 12px;color:#365f77;font-family:"Microsoft YaHei",sans-serif;font-size:14px;font-weight:600;line-height:1.7;resize:vertical}.inn-analysis-point-primary textarea{min-height:72px}.inn-analysis-point-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.inn-analysis-point-meta textarea{min-height:66px}
@media(min-width:1440px){.inn-analysis-point-list{gap:19px}.inn-analysis-point-card>header{padding:19px 22px}.inn-analysis-point-title{grid-template-columns:46px minmax(0,1fr);gap:14px}.inn-analysis-point-title>i{width:46px;height:46px;font-size:16px}.inn-analysis-point-title small{font-size:12px}.inn-analysis-point-title textarea{min-height:48px;font-size:clamp(18px,1.05vw,22px)}.inn-analysis-point-body{gap:14px;padding:18px 22px 21px}.inn-analysis-point-body label>span{font-size:13px}.inn-analysis-point-body textarea{min-height:78px;padding:12px 14px;font-size:clamp(15px,.84vw,18px)}.inn-analysis-point-primary textarea{min-height:84px}.inn-analysis-point-meta{gap:13px}}
@media(max-width:720px){.inn-analysis-point-card>header{padding:14px}.inn-analysis-point-title{grid-template-columns:36px minmax(0,1fr);gap:10px}.inn-analysis-point-title>i{width:36px;height:36px;font-size:13px}.inn-analysis-point-title textarea{font-size:15px}.inn-analysis-point-body{padding:13px;gap:10px}.inn-analysis-point-meta{grid-template-columns:1fr;gap:9px}.inn-analysis-point-body textarea{min-height:64px;font-size:14px}}
@media(prefers-reduced-motion:reduce){.inn-wf-stage-header,.inn-wf-section,.inn-simple-launch-inner{animation:none}.inn-wf-nav button,.inn-wf-field,.inn-wf-anchor-grid label,.inn-recall-result{transition:none}}
.inn-recall-sort{display:none!important}
.inn-recall-type-tabs button{display:inline-flex;align-items:center;gap:6px}.inn-recall-type-tabs button em{border-radius:999px;background:#e1edf2;padding:2px 5px;color:#718996;font-size:9px;font-style:normal;font-weight:800;line-height:1}.inn-recall-type-tabs button.active em{background:#e4f5fa;color:#087aa7}.inn-recall-result-patent .inn-recall-facts,.inn-recall-result-paper .inn-recall-facts{grid-template-columns:repeat(3,minmax(0,1fr))}
.inn-analysis-topic-card header{align-items:start}.inn-analysis-topic-card header i{margin-top:2px}
.inn-wf-card-research .inn-wf-stage-header{align-items:center;padding-top:15px;padding-bottom:15px}.inn-wf-card-research .inn-wf-stage-copy>span{margin-bottom:3px}.inn-wf-card-research .inn-wf-research-page{padding-top:10px}
.inn-recall-total{display:flex;align-items:center;gap:7px;min-width:0}.inn-recall-total>div{display:grid;gap:2px;min-width:0;margin-left:5px}.inn-recall-total b{overflow:hidden;color:#335c75;font-size:12px;font-weight:800;text-overflow:ellipsis;white-space:nowrap}.inn-recall-total small{margin:0!important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.inn-recall-record-type{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin:0 0 6px}.inn-recall-record-type b,.inn-recall-record-type span{border-radius:999px;padding:3px 7px;font-size:10px;line-height:1.2}.inn-recall-record-type b{background:#e7f4f8;color:#117aa5;font-weight:800}.inn-recall-record-type span{background:#f1f6f8;color:#658091}.inn-recall-facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:12px 0 0 42px;border:1px solid #e1ebef;border-radius:8px;background:#fbfdfe;overflow:hidden}.inn-recall-facts>div{min-width:0;padding:8px 10px;border-right:1px solid #e5edf1}.inn-recall-facts>div:last-child{border-right:0}.inn-recall-facts dt{margin:0;color:#7c92a0;font-size:10px;font-weight:700;line-height:1.35}.inn-recall-facts dd{overflow:hidden;margin:3px 0 0;color:#355b72;font-size:11px;font-weight:800;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}.inn-recall-result-patent .inn-recall-order,.inn-recall-result-patent .inn-recall-record-type b{background:#e6f4fb;color:#087caf}.inn-recall-result-paper .inn-recall-order,.inn-recall-result-paper .inn-recall-record-type b{background:#f0edfb;color:#6757a5}.inn-recall-result-policy .inn-recall-order,.inn-recall-result-policy .inn-recall-record-type b{background:#fff4df;color:#9a6a16}.inn-recall-result-internal .inn-recall-order,.inn-recall-result-internal .inn-recall-record-type b{background:#e8f8f0;color:#237c5f}.inn-recall-result-paper .inn-recall-facts{border-left:3px solid #8d7ac1}.inn-recall-result-policy .inn-recall-facts{border-left:3px solid #d4a445}.inn-recall-result-internal .inn-recall-facts{border-left:3px solid #4bae84}.inn-recall-result-patent .inn-recall-facts{border-left:3px solid #5aabd0}
@media(max-width:720px){.inn-recall-total{align-items:flex-start}.inn-recall-total>div{max-width:calc(100vw - 140px)}.inn-recall-facts{grid-template-columns:repeat(2,minmax(0,1fr));margin-left:0}.inn-recall-facts>div:nth-child(2){border-right:0}.inn-recall-facts>div:nth-child(-n+2){border-bottom:1px solid #e5edf1}}
.inn-wf-card-project{background:#f7fafc}.inn-wf-card-project .inn-wf-stage-header{border-bottom-color:#dbe8ee;background:#fff}.inn-wf-card-project .inn-wf-section{padding:22px 24px 26px}.inn-wf-project-page{gap:16px;background:linear-gradient(180deg,#f7fafc 0%,#fff 100%)}.inn-project-overview,.inn-project-targets,.inn-project-details-shell{overflow:hidden;border:1px solid #d9e7ee;border-radius:12px;background:#fff;box-shadow:0 8px 22px rgba(27,74,98,.045)}.inn-project-overview{border-top:3px solid #1683b3}.inn-project-targets{border-top:3px solid #4b9dbd}.inn-project-section-head{align-items:center;margin:0;padding:16px 19px 14px;border-bottom:1px solid #e5eef2;background:linear-gradient(100deg,#f4fafc,#fff)}.inn-project-section-head span{color:#173f5c;font-size:17px;font-weight:800;letter-spacing:-.02em}.inn-project-section-head p{max-width:620px;margin:5px 0 0;color:#6c8797;font-size:12px;line-height:1.55}.inn-project-section-index{width:32px;height:32px;display:grid;place-items:center;border-radius:9px;background:#e4f3f8;color:#1680ad;font:800 11px/1 Arial}.inn-project-overview-fields{gap:11px;padding:16px 19px 0}.inn-project-overview .inn-wf-field{min-height:57px;border:1px solid #e1ebef;background:#fbfdfe;padding:11px 13px}.inn-project-overview .inn-wf-field>span{color:#688493;font-size:11px;font-weight:800}.inn-project-overview .inn-wf-field input{height:25px;color:#264c65;font-size:14px;font-weight:700}.inn-project-content-divider{display:flex;align-items:baseline;gap:10px;margin:17px 19px 0;border-top:1px solid #e5eef2;padding-top:15px}.inn-project-content-divider b{color:#315d75;font-size:12px}.inn-project-content-divider span{color:#8a9ca7;font-size:11px}.inn-project-overview .inn-project-confirm-grid{gap:10px;padding:11px 19px 19px}.inn-project-confirm-item{gap:11px;border:1px solid #e0ebef;border-radius:9px;background:#f8fbfc;padding:14px}.inn-project-confirm-item:hover{border-color:#acd3e2;background:#f4fafc}.inn-project-confirm-item:focus-within{border-color:#60afcb;background:#fff;box-shadow:0 0 0 3px rgba(34,143,182,.12)}.inn-project-confirm-head{gap:9px}.inn-project-confirm-head>i{width:29px;height:29px;border-radius:8px;background:#e3f3f8;color:#1177a4;font-size:10px;font-style:normal;letter-spacing:.02em}.inn-project-confirm-head b{color:#234a64;font-size:14px}.inn-project-confirm-head small{margin-top:3px;color:#8096a4;font-size:10px}.inn-project-confirm-item textarea{min-height:96px;border-top:1px solid #e1ecef;padding-top:10px;color:#355d74;font-size:13px;font-weight:600;line-height:1.7}.inn-project-target-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;padding:1px;background:#dbe8ee}.inn-project-target-grid article{min-height:106px;gap:8px;border:0;border-radius:0;background:#fff;padding:14px 15px}.inn-project-target-grid article:nth-child(even){background:#fbfdfe}.inn-project-target-grid article>span{color:#456b81;font-size:12px}.inn-project-target-grid article>div{display:block}.inn-project-target-grid article>div+div{margin-top:2px;border-top:1px solid #edf2f4;padding-top:7px}.inn-project-target-grid small{display:block;color:#8a9ca7;font-size:10px}.inn-project-target-grid b{display:block;margin-top:2px;color:#6f8796;font-size:12px}.inn-project-target-grid strong{display:block;margin-top:2px;color:#127eac;font-size:16px;letter-spacing:-.01em}.inn-project-details-shell{border-style:dashed;border-top:3px solid #91b9ca;background:#fbfdfe}.inn-project-details-shell.is-expanded{border-style:solid;border-color:#cde1e9;border-top-color:#5aa7c6;background:#fff}.inn-project-details-toggle{border:0;border-radius:0;background:transparent;padding:15px 18px}.inn-project-details-toggle:hover{background:#f2f9fb}.inn-project-details-toggle>span{display:flex;align-items:center;gap:10px}.inn-project-details-toggle>span>i{width:29px;height:29px;display:grid;place-items:center;border-radius:8px;background:#e9f5f8;color:#4d8299;font:800 10px/1 Arial;font-style:normal}.inn-project-details-toggle b{color:#315c75;font-size:14px}.inn-project-details-toggle small{margin-top:3px;color:#839aa8;font-size:11px}.inn-project-details-toggle em{color:#177da9;font-size:12px}.inn-project-details{gap:10px;border-top:1px solid #e3edf1;padding:14px 18px 18px;background:#fff}.inn-project-details .inn-wf-field{border:1px solid #e1ebef;background:#f9fcfd;padding:11px 13px}.inn-project-details .inn-wf-field>span{color:#688493;font-size:11px;font-weight:800}.inn-project-details .inn-wf-field textarea{min-height:90px;color:#355d74;font-size:13px;font-weight:600;line-height:1.7}@media(max-width:980px){.inn-wf-card-project .inn-wf-section{padding:20px}.inn-project-target-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:1px}}@media(max-width:720px){.inn-wf-card-project .inn-wf-section{padding:14px}.inn-wf-project-page{gap:12px}.inn-project-section-head{align-items:flex-start;padding:14px}.inn-project-section-head span{font-size:16px}.inn-project-section-head p{font-size:11px}.inn-project-overview-fields,.inn-project-overview .inn-project-confirm-grid{grid-template-columns:1fr;padding-right:14px;padding-left:14px}.inn-project-content-divider{align-items:flex-start;flex-direction:column;gap:4px;margin-right:14px;margin-left:14px}.inn-project-target-grid{grid-template-columns:1fr 1fr}.inn-project-target-grid article{min-height:95px;padding:12px}.inn-project-details{grid-template-columns:1fr;padding:12px 14px 14px}}
/* 研究主题与创新点：提高信息密度，并用内容类型建立视觉层级 */
.inn-wf-analysis-page{gap:16px}
.inn-analysis-section{gap:9px}
.inn-analysis-section-head>span{color:#163f5e}
.inn-analysis-section-head small{background:#e8f5fa;color:#147ca8}
.inn-analysis-topic-grid{gap:10px}
.inn-analysis-topic-card{display:grid;gap:0;overflow:hidden;padding:0;border-radius:12px;background:#f4f8fa}
.inn-analysis-topic-card>header{display:grid;grid-template-columns:34px minmax(0,1fr);align-items:start;gap:10px;padding:12px 14px 10px;background:linear-gradient(100deg,#e7f5f9,#f1f8fa)}
.inn-analysis-topic-card>header>i{display:grid;place-items:center;box-sizing:border-box;width:30px;height:30px;border-radius:8px;background:#1a90bf;padding:0;color:#fff;font:800 11px/1 Arial;font-style:normal}
.inn-analysis-topic-card>header small{display:block;margin-bottom:2px;color:#287b9f;font-size:11px;font-weight:800}
.inn-analysis-topic-card>header textarea{min-height:42px;font-size:15px;color:#1c4863}
.inn-analysis-topic-card>label{display:grid;gap:5px;padding:11px 14px 13px}
.inn-analysis-topic-card>label>span{color:#5d8495;font-size:12px}
.inn-analysis-topic-card>label textarea{min-height:64px;border:0;border-radius:8px;background:#fff;padding:9px 10px;color:#355e75;font-size:13px;line-height:1.65}
.inn-analysis-point-list{gap:12px}
.inn-analysis-point-card{display:block;overflow:hidden;padding:0;border-radius:13px;background:#f3f8fa;box-shadow:none}
.inn-analysis-point-card>header{display:block;background:linear-gradient(100deg,#e4f4f8,#eef8fb);padding:10px 16px}
.inn-analysis-point-title{grid-template-columns:34px minmax(0,1fr);align-items:start;gap:10px}
.inn-analysis-point-title>i{box-sizing:border-box;width:34px;height:34px;border-radius:9px;background:#167fae;padding:0;font-size:12px}
.inn-analysis-point-title small{margin-bottom:2px;color:#25789c}
.inn-analysis-point-title textarea{min-height:34px;font-size:16px;line-height:1.45}
.inn-analysis-topic-card>header{padding:9px 14px}
.inn-analysis-topic-card>header>i{width:26px;height:26px;font-size:10px}
.inn-analysis-topic-card>header textarea,.inn-analysis-point-title textarea{field-sizing:content;min-height:24px;max-height:58px}
.inn-analysis-point-card>header{padding:8px 16px}
.inn-analysis-point-title{grid-template-columns:28px minmax(0,1fr);align-items:start;gap:9px}
.inn-analysis-point-card .inn-analysis-point-title>i{align-self:start;width:28px;height:auto;margin:0;border-radius:0;background:transparent;padding:3px 0 0;color:#167fae;font:800 11px/1.45 Arial;font-style:normal}
.inn-analysis-point-title textarea{min-height:24px;line-height:1.45}
.inn-analysis-point-card .inn-analysis-point-title textarea{field-sizing:content;min-height:24px;max-height:58px}
.inn-analysis-point-body{display:grid;grid-template-columns:1.15fr 1fr;gap:9px;padding:12px 16px 14px}
.inn-analysis-point-body label{display:grid;gap:5px}
.inn-analysis-point-body label>span{font-size:11px;font-weight:800}
.inn-analysis-point-body textarea{min-height:64px;border:0;border-radius:8px;padding:9px 10px;background:#fff;color:#365e73;font-size:13px;line-height:1.65}
.inn-analysis-point-body .inn-analysis-point-primary>span{color:#1478a7}
.inn-analysis-point-body .inn-analysis-point-context>span{color:#138b88}
.inn-analysis-point-body .inn-analysis-point-differentiation>span{color:#69799b}
.inn-analysis-point-body .inn-analysis-point-metric>span{color:#a8751d}
.inn-analysis-point-context textarea{background:#f8fcfb}
.inn-analysis-point-differentiation textarea{background:#fafbfe}
.inn-analysis-point-metric textarea{background:#fffbf4;color:#805d1d}
@media(max-width:1439px){.inn-analysis-point-body{grid-template-columns:1.15fr 1fr}.inn-analysis-point-primary{grid-column:auto}}
@media(min-width:1440px){.inn-wf-analysis-page{gap:20px}.inn-analysis-section{gap:11px}.inn-analysis-topic-grid{gap:13px}.inn-analysis-topic-card>header{grid-template-columns:38px minmax(0,1fr);padding:12px 17px}.inn-analysis-topic-card>header>i{width:30px;height:30px;font-size:11px}.inn-analysis-topic-card>header textarea{min-height:28px;font-size:clamp(16px,.9vw,19px)}.inn-analysis-topic-card>label{padding:13px 17px 16px}.inn-analysis-topic-card>label>span{font-size:13px}.inn-analysis-topic-card>label textarea{min-height:72px;padding:11px 12px;font-size:clamp(14px,.82vw,17px)}.inn-analysis-point-list{gap:15px}.inn-analysis-point-card>header{padding:11px 20px}.inn-analysis-point-title{grid-template-columns:31px minmax(0,1fr);gap:10px}.inn-analysis-point-card .inn-analysis-point-title>i{width:31px;padding-top:4px;font-size:12px}.inn-analysis-point-card .inn-analysis-point-title textarea{min-height:28px;font-size:clamp(17px,1vw,21px)}.inn-analysis-point-body{gap:12px;padding:15px 20px 18px}.inn-analysis-point-body label>span{font-size:12px}.inn-analysis-point-body textarea{min-height:75px;padding:11px 12px;font-size:clamp(14px,.8vw,17px)}}
@media(max-width:720px){.inn-wf-analysis-page{gap:14px}.inn-analysis-topic-grid,.inn-analysis-point-body{grid-template-columns:1fr}.inn-analysis-topic-card>header{grid-template-columns:32px minmax(0,1fr);padding:12px}.inn-analysis-topic-card>label{padding:10px 12px 12px}.inn-analysis-topic-card>label textarea{min-height:64px}.inn-analysis-point-card>header{padding:12px 13px}.inn-analysis-point-body{grid-template-columns:1fr;padding:11px 13px 13px}.inn-analysis-point-primary{grid-column:auto}.inn-analysis-point-body textarea{min-height:64px}}
.inn-wf-card-project{height:auto;min-height:calc(100vh - 96px);overflow:visible}.inn-wf-card-project .inn-wf-section{flex:0 0 auto;overflow:visible}.inn-project-section-head{min-height:20px;padding-top:14px;padding-bottom:13px;background:#f7fbfc}.inn-project-section-head span{font-size:16px}.inn-project-overview-fields{padding-top:14px}.inn-project-content-divider{margin-top:14px;padding-top:13px}.inn-project-overview .inn-project-confirm-grid{padding-top:10px;padding-bottom:16px}.inn-project-confirm-item{padding:12px}.inn-project-confirm-item textarea{min-height:82px;padding-top:8px;line-height:1.65}.inn-project-target-grid article{min-height:96px;padding:12px 14px}.inn-project-details-toggle>span{display:block}.inn-project-details-toggle b{font-size:14px}@media(max-width:720px){.inn-wf-card-project{min-height:calc(100vh - 48px)}.inn-wf-card-project .inn-wf-section{overflow:visible}.inn-project-content-divider{display:block}.inn-project-confirm-item textarea{min-height:84px}}
.inn-wf-card-project .inn-wf-stage-copy>span{font-size:12px}.inn-wf-card-project .inn-wf-stage-copy h2{font-size:25px}.inn-wf-card-project .inn-project-section-head span{font-size:18px}.inn-wf-card-project .inn-wf-field>span{font-size:13px}.inn-wf-card-project .inn-project-overview .inn-wf-field input{font-size:16px}.inn-wf-card-project .inn-project-content-divider b{font-size:14px}.inn-wf-card-project .inn-project-confirm-head>i{font-size:11px}.inn-wf-card-project .inn-project-confirm-head b{font-size:16px}.inn-wf-card-project .inn-project-confirm-item textarea{font-size:15px;line-height:1.72}.inn-wf-card-project .inn-project-target-grid article>span{font-size:14px}.inn-wf-card-project .inn-project-target-grid small{font-size:12px}.inn-wf-card-project .inn-project-target-grid b{font-size:14px}.inn-wf-card-project .inn-project-target-grid strong{font-size:19px}.inn-wf-card-project .inn-project-details-toggle b{font-size:16px}.inn-wf-card-project .inn-project-details .inn-wf-field textarea{font-size:15px;line-height:1.72}@media(min-width:1440px){.inn-wf-card-project .inn-wf-stage-copy>span{font-size:13px}.inn-wf-card-project .inn-wf-stage-copy h2{font-size:clamp(28px,1.6vw,34px)}.inn-wf-card-project .inn-project-section-head span{font-size:clamp(19px,1.1vw,22px)}.inn-wf-card-project .inn-wf-field>span{font-size:14px}.inn-wf-card-project .inn-project-overview .inn-wf-field input{font-size:clamp(17px,.96vw,20px)}.inn-wf-card-project .inn-project-content-divider b{font-size:15px}.inn-wf-card-project .inn-project-confirm-head b{font-size:clamp(17px,.95vw,19px)}.inn-wf-card-project .inn-project-confirm-item textarea{font-size:clamp(15px,.84vw,17px)}.inn-wf-card-project .inn-project-target-grid article>span{font-size:clamp(14px,.8vw,16px)}.inn-wf-card-project .inn-project-target-grid small{font-size:13px}.inn-wf-card-project .inn-project-target-grid b{font-size:15px}.inn-wf-card-project .inn-project-target-grid strong{font-size:clamp(19px,1.05vw,22px)}.inn-wf-card-project .inn-project-details-toggle b{font-size:18px}.inn-wf-card-project .inn-project-details .inn-wf-field textarea{font-size:clamp(15px,.84vw,17px)}}@media(max-width:720px){.inn-wf-card-project .inn-wf-stage-copy>span{font-size:11px}.inn-wf-card-project .inn-wf-stage-copy h2{font-size:23px}.inn-wf-card-project .inn-project-section-head span{font-size:18px}.inn-wf-card-project .inn-wf-field>span{font-size:12px}.inn-wf-card-project .inn-project-overview .inn-wf-field input{font-size:15px}.inn-wf-card-project .inn-project-content-divider b{font-size:13px}.inn-wf-card-project .inn-project-confirm-head b{font-size:15px}.inn-wf-card-project .inn-project-confirm-item textarea{font-size:14px}.inn-wf-card-project .inn-project-target-grid article>span{font-size:13px}.inn-wf-card-project .inn-project-target-grid small{font-size:11px}.inn-wf-card-project .inn-project-target-grid b{font-size:13px}.inn-wf-card-project .inn-project-target-grid strong{font-size:18px}.inn-wf-card-project .inn-project-details-toggle b{font-size:16px}.inn-wf-card-project .inn-project-details .inn-wf-field textarea{font-size:14px}}
.inn-wf-card-project .inn-project-confirm-grid{align-items:stretch}.inn-wf-card-project .inn-project-confirm-item{align-content:start}.inn-wf-card-project .inn-project-confirm-item textarea{height:auto;min-height:0;overflow:hidden;resize:vertical}.inn-wf-card-project .inn-project-route-item textarea{height:auto;min-height:0}
.inn-wf-card-project .inn-project-target-grid article>input,.inn-wf-card-project .inn-project-target-grid article>div input{box-sizing:border-box;width:100%;border:0;outline:0;background:transparent;font-family:"Microsoft YaHei",sans-serif;font-weight:800}.inn-wf-card-project .inn-project-target-grid article>input{overflow:hidden;padding:0;color:#456b81;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.inn-wf-card-project .inn-project-target-grid article>div input{margin-top:2px;padding:0;color:#6f8796;font-size:14px}.inn-wf-card-project .inn-project-target-grid article>div+div input{color:#127eac;font-size:19px}.inn-wf-card-project .inn-project-target-grid article:focus-within{position:relative;z-index:1;background:#f8fcfd;box-shadow:inset 0 0 0 1px #91c5d8}.inn-wf-card-project .inn-project-target-grid article input:focus{color:#0c6f9e}@media(min-width:1440px){.inn-wf-card-project .inn-project-target-grid article>input{font-size:clamp(14px,.8vw,16px)}.inn-wf-card-project .inn-project-target-grid article>div input{font-size:15px}.inn-wf-card-project .inn-project-target-grid article>div+div input{font-size:clamp(19px,1.05vw,22px)}}@media(max-width:720px){.inn-wf-card-project .inn-project-target-grid article>input{font-size:13px}.inn-wf-card-project .inn-project-target-grid article>div input{font-size:13px}.inn-wf-card-project .inn-project-target-grid article>div+div input{font-size:18px}}
.inn-wf-card-project .inn-project-targets .inn-project-section-head{padding-top:12px;padding-bottom:11px}
.inn-wf-card-project .inn-project-target-grid article{min-height:88px;gap:6px;padding:11px 14px}
.inn-wf-card-project .inn-project-target-grid article>div+div{margin-top:1px;padding-top:5px}
.inn-wf-card-research .inn-recall-results{display:grid;gap:10px;padding:14px 16px 18px;background:#f6fafc}.inn-wf-card-research .inn-recall-result,.inn-wf-card-research .inn-recall-result:first-child{position:relative;margin:0;border:1px solid #dce8ee;border-radius:12px;background:#fff;padding:16px 17px 15px;box-shadow:0 3px 10px rgba(24,68,91,.035)}.inn-wf-card-research .inn-recall-result.is-selected{box-shadow:inset 3px 0 0 #1688ba,0 5px 15px rgba(21,93,122,.07)}.inn-wf-card-research .inn-recall-result header{grid-template-columns:32px minmax(0,1fr) auto;gap:12px}.inn-wf-card-research .inn-recall-order{width:28px;height:28px;border:1px solid #c8e0ea;border-radius:8px;background:#f2f9fb;color:#176f99;font-size:11px}.inn-wf-card-research .inn-recall-title h3{margin-top:2px;color:#153d59;font-size:17px;font-weight:800;line-height:1.52;letter-spacing:-.01em}.inn-wf-card-research .inn-recall-record-type{gap:6px;margin-bottom:5px}.inn-wf-card-research .inn-recall-record-type b{border-radius:5px;background:#e6f3f8;color:#11759f;font-size:10px}.inn-wf-card-research .inn-recall-record-type span{border-radius:5px;background:#f0f4f6;color:#607b8b;font-size:10px}.inn-wf-card-research .inn-recall-record-type .inn-recall-key{margin-left:2px;color:#157aa7;font-size:11px;font-style:normal;font-weight:800}.inn-wf-card-research .inn-recall-tags{gap:5px;margin-top:8px}.inn-wf-card-research .inn-recall-tags span{border-radius:4px;background:#f2f6f8;color:#547183;font-size:10px}.inn-wf-card-research .inn-recall-result>p{margin:12px 0 0;padding-left:40px;color:#536f81;font-size:12px;line-height:1.75}.inn-wf-card-research .inn-recall-result>p b{display:inline-block;margin-right:8px;color:#167da8;font-weight:800}.inn-wf-card-research .inn-recall-facts{grid-template-columns:1.15fr .75fr 1.4fr;margin:13px 0 0 40px;border-color:#dbe7ec;border-radius:8px;background:#f8fbfc}.inn-wf-card-research .inn-recall-facts>div{padding:9px 11px}.inn-wf-card-research .inn-recall-facts dt{color:#78909f;font-size:10px}.inn-wf-card-research .inn-recall-facts dd{margin-top:4px;color:#294f68;font-size:12px;letter-spacing:0}.inn-wf-card-research .inn-recall-result footer{margin-top:11px;padding-left:40px;color:#6f8795;font-size:11px}.inn-wf-card-research .inn-recall-result footer span:first-child{color:#416a81;font-weight:700}.inn-wf-card-research .inn-recall-result footer button{min-height:28px;border-color:#bfd7e3;background:#fff;color:#176f99;font-weight:800}.inn-wf-card-research .inn-recall-result-patent .inn-recall-order,.inn-wf-card-research .inn-recall-result-patent .inn-recall-record-type b{border-color:#b7dce9;background:#e8f6fb;color:#0d79a8}.inn-wf-card-research .inn-recall-result-paper .inn-recall-order,.inn-wf-card-research .inn-recall-result-paper .inn-recall-record-type b{border-color:#bde2dc;background:#e8f7f3;color:#14766f}.inn-wf-card-research .inn-recall-result-paper .inn-recall-record-type .inn-recall-key{color:#14766f}.inn-wf-card-research .inn-recall-result-paper .inn-recall-facts{border-left:3px solid #54aa9d}.inn-wf-card-research .inn-recall-result-patent .inn-recall-facts{border-left:3px solid #51a9cb}.inn-wf-card-research .inn-recall-detail{margin:12px 0 0 40px;border-color:#dce8ed;border-radius:8px;background:#f8fbfc;color:#567386}.inn-wf-card-research .inn-recall-detail b{color:#176f99}
@media(max-width:720px){.inn-wf-card-research .inn-recall-results{padding:10px}.inn-wf-card-research .inn-recall-result,.inn-wf-card-research .inn-recall-result:first-child{padding:14px}.inn-wf-card-research .inn-recall-title h3{font-size:15px}.inn-wf-card-research .inn-recall-result>p,.inn-wf-card-research .inn-recall-facts,.inn-wf-card-research .inn-recall-result footer,.inn-wf-card-research .inn-recall-detail{margin-left:0;padding-left:0}.inn-wf-card-research .inn-recall-facts{grid-template-columns:1fr 1fr}.inn-wf-card-research .inn-recall-facts>div:nth-child(2){border-right:0}.inn-wf-card-research .inn-recall-facts>div:nth-child(3){grid-column:1/-1;border-top:1px solid #e5edf1}.inn-wf-card-research .inn-recall-result footer{padding-left:0}}
.inn-wf-nav>div>button.active{background:transparent;box-shadow:none;color:#116f9e}.inn-wf-nav>div>button.active::before{position:absolute;top:10px;bottom:10px;left:-10px;width:3px;border-radius:0 3px 3px 0;background:#1689bd;content:""}.inn-wf-nav>div>button.active i{border-color:#58a9ca;background:#fff;box-shadow:none;color:#117cad}.inn-wf-nav .inn-wf-subnav button.active{position:relative;background:transparent;box-shadow:none;color:#1478a7}.inn-wf-nav .inn-wf-subnav button.active::after{position:absolute;right:9px;bottom:3px;left:9px;height:2px;border-radius:2px;background:#75b9d4;content:""}
.inn-patent-topic-list{padding:0 13px 17px;background:#f7fafc}.inn-patent-table-wrap{overflow:auto;border:1px solid #dce8ee;border-radius:10px;background:#fff}.inn-patent-table{width:100%;min-width:700px;border-collapse:separate;border-spacing:0;color:#36576b;font-size:12px}.inn-patent-table th{background:#f0f6f9;padding:10px 11px;color:#5e7c8e;text-align:left;font-size:11px;font-weight:800;white-space:nowrap}.inn-patent-table th:first-child{width:36px}.inn-patent-table th:nth-child(2){width:44px}.inn-patent-table th:nth-child(3){width:66px}.inn-patent-table th:nth-child(4){width:146px}.inn-patent-table td{border-top:1px solid #e8eff3;padding:11px;color:#49697c;vertical-align:middle}.inn-patent-table tr.is-selected td{background:#f6fcfe}.inn-patent-table tr.is-selected td:first-child{box-shadow:inset 3px 0 0 #1687ba}.inn-patent-table td input{width:16px;height:16px;margin:0;accent-color:#1685ac}.inn-patent-table td:nth-child(2){color:#758f9f;font-family:"DIN Alternate","Arial",sans-serif;font-size:13px;font-weight:800}.inn-patent-table td:nth-child(3) b{display:inline-block;border-radius:5px;background:#e9f6fa;padding:3px 6px;color:#087cac;font-family:"DIN Alternate","Arial",sans-serif;font-size:12px}.inn-patent-table td:nth-child(4) span{color:#305d76;font-family:"DIN Alternate","Arial",sans-serif;font-size:12px;font-weight:800;letter-spacing:.015em;white-space:nowrap}.inn-patent-table td:last-child button{border:0;background:transparent;padding:0;color:#1f4b67;text-align:left;font:800 13px/1.55 "Microsoft YaHei",sans-serif;cursor:pointer}.inn-patent-table td:last-child button:hover{color:#087cad;text-decoration:underline;text-decoration-color:#9ccfe0;text-underline-offset:3px}.inn-patent-table-detail td{border-top:0;background:#fbfdfe!important;padding:0 11px 11px}.inn-patent-table-detail td:first-child{box-shadow:none!important}.inn-patent-table-detail td:last-child{border-left:0}.inn-patent-table-detail b{margin-right:9px;color:#17789f;font-size:10px}.inn-patent-table-detail span{color:#587589;font-size:11px;font-weight:700}
.inn-patent-table{min-width:1370px;table-layout:auto;font-size:14px}.inn-patent-table th{padding:11px 10px;font-size:13px}.inn-patent-table th:first-child{width:36px}.inn-patent-table th:nth-child(2){width:48px}.inn-patent-table th:nth-child(3){width:68px}.inn-patent-table th:nth-child(4){width:140px}.inn-patent-table th:nth-child(5){min-width:270px}.inn-patent-table th:nth-child(6){width:84px}.inn-patent-table th:nth-child(7){min-width:176px}.inn-patent-table th:nth-child(8){min-width:150px}.inn-patent-table th:nth-child(9),.inn-patent-table th:nth-child(10){width:104px}.inn-patent-table td{padding:12px 10px;font-size:14px}.inn-patent-number{display:inline-block;outline:0;color:#305d76;font-family:"DIN Alternate","Arial",sans-serif;font-size:12px;font-weight:800;letter-spacing:.015em;white-space:nowrap;cursor:help}.inn-patent-number:hover,.inn-patent-number:focus{color:#087cad;text-decoration:underline;text-decoration-color:#9ccfe0;text-underline-offset:3px}.inn-patent-table td.inn-patent-title-cell{position:relative;padding-right:10px}.inn-patent-table td:nth-child(5) .inn-patent-title{display:block;box-sizing:border-box;width:100%;border:0;background:transparent;padding:0;overflow:hidden;color:#1f4b67;text-align:left;font:800 14px/1.55 "Microsoft YaHei",sans-serif;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.inn-patent-table td:nth-child(5) .inn-patent-title:hover,.inn-patent-table td:nth-child(5) .inn-patent-title:focus-visible{color:#087cad;text-decoration:underline;text-decoration-color:#9ccfe0;text-underline-offset:3px;outline:0}.inn-patent-title-tools{position:absolute;z-index:2;top:50%;right:10px;display:flex;gap:4px;opacity:0;pointer-events:none;transform:translateY(-50%);transition:opacity .14s ease}.inn-patent-title-cell:hover .inn-patent-title-tools,.inn-patent-title-cell:focus-within .inn-patent-title-tools{opacity:1;pointer-events:auto}.inn-patent-title-cell:hover .inn-patent-title,.inn-patent-title-cell:focus-within .inn-patent-title{padding-right:68px}.inn-patent-table td:nth-child(5) .inn-patent-title-tools button{display:grid;width:28px;height:28px;place-items:center;border:1px solid #cae0e9;border-radius:6px;background:#fff;padding:0;overflow:visible;color:#36718d;font:inherit;cursor:pointer}.inn-patent-table td:nth-child(5) .inn-patent-title-tools button:hover{border-color:#78b5cc;background:#eef8fb;color:#087cad;text-decoration:none}.inn-patent-table td:nth-child(5) .inn-patent-title-tools button.saved{border-color:#9ed6c3;background:#eff9f5;color:#217d5e}.inn-patent-status{display:inline-block;border-radius:5px;padding:4px 7px;font-size:12px;font-style:normal;font-weight:800;line-height:1}.inn-patent-status.is-授权,.inn-patent-status.is-有效{background:#eaf7f1;color:#217d5e}.inn-patent-status.is-审中{background:#fff6e7;color:#9a6c1f}.inn-patent-status.is-驳回{background:#f0f3f5;color:#6d7f8a}.inn-patent-assignee{display:-webkit-box;overflow:hidden;color:#375c70;font-size:13px;font-weight:700;line-height:1.55;-webkit-box-orient:vertical;-webkit-line-clamp:2}.inn-patent-classifications{display:flex;flex-wrap:wrap;gap:5px}.inn-patent-classifications span{border-radius:4px;background:#edf6fa;padding:3px 6px;color:#42718a;font-size:12px;font-weight:700;line-height:1.2;white-space:nowrap}.inn-patent-table time{color:#516d7e;font-family:"DIN Alternate","Arial",sans-serif;font-size:13px;font-weight:700;white-space:nowrap}.inn-patent-preview{position:fixed;z-index:10000;box-sizing:border-box;width:min(328px,calc(100vw - 32px));border:1px solid #b7d8e5;border-radius:10px;background:#fff;padding:13px 14px 12px;color:#375a6d;box-shadow:0 13px 30px rgba(18,71,98,.2)}.inn-patent-preview:before{position:absolute;top:-4px;left:16px;width:26px;height:3px;border-radius:3px;background:#1688ba;content:""}.inn-patent-preview header>span{display:block;color:#6d8999;font-size:12px;font-weight:800}.inn-patent-preview header>b{display:-webkit-box;overflow:hidden;margin-top:5px;color:#173f5e;font-size:14px;line-height:1.55;-webkit-box-orient:vertical;-webkit-line-clamp:2}.inn-patent-preview header strong{display:block;margin-top:4px;color:#126f9d;font-family:"DIN Alternate","Arial",sans-serif;font-size:19px;letter-spacing:.015em}.inn-patent-preview>p{display:-webkit-box;overflow:hidden;margin:10px 0 0;border-top:1px solid #e8eff3;padding-top:9px;color:#516f7f;font-size:14px;line-height:1.68;-webkit-box-orient:vertical;-webkit-line-clamp:5}.inn-patent-preview footer{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}.inn-patent-preview footer span{border-radius:4px;background:#edf6fa;padding:3px 6px;color:#42718a;font-size:12px;font-weight:700}.inn-patent-preview dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:11px 0 0;border-top:1px solid #e8eff3;padding-top:10px}.inn-patent-preview dl div{min-width:0}.inn-patent-preview dl .wide{grid-column:1/-1}.inn-patent-preview dt{color:#7a929f;font-size:12px;font-weight:700}.inn-patent-preview dd{overflow:hidden;margin:3px 0 0;color:#315a70;font-size:14px;font-weight:800;line-height:1.45;text-overflow:ellipsis;white-space:nowrap}.inn-patent-preview dl .wide:first-of-type dd{white-space:normal}
.inn-paper-list{display:grid;gap:9px;padding:13px;background:#f8fbfb}.inn-paper-item{display:grid;grid-template-columns:27px minmax(0,1fr);gap:10px;min-width:0;border:1px solid #deece9;border-radius:10px;background:#fff;padding:13px 14px;box-shadow:0 2px 7px rgba(26,89,76,.025);transition:border-color .16s ease,box-shadow .16s ease}.inn-paper-item:hover{border-color:#9bd3c5;box-shadow:0 8px 18px rgba(21,93,75,.08)}.inn-paper-item.is-selected{border-left:3px solid #2c9d88;padding-left:12px}.inn-paper-item-index{padding-top:3px}.inn-paper-item-index input{width:16px;height:16px;margin:0;accent-color:#259581}.inn-paper-item-body{display:grid;min-width:0;gap:9px}.inn-paper-item-body>header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;min-width:0}.inn-paper-title-row{display:flex;flex:1 1 auto;min-width:0;gap:9px}.inn-paper-title-row>b{padding-top:1px;color:#267e70;font-family:"DIN Alternate","Arial",sans-serif;font-size:16px;line-height:1.45}.inn-paper-title-row button{min-width:0;flex:1 1 auto;border:0;background:transparent;padding:0;color:#244e61;text-align:left;cursor:pointer}.inn-paper-title-row button>span{display:flex;align-items:center;gap:8px;min-width:0}.inn-paper-title-row strong{min-width:0;flex:1 1 auto;overflow:hidden;color:inherit;font-size:14px;line-height:1.5;text-overflow:ellipsis;white-space:nowrap}.inn-paper-title-row em{flex:0 0 auto;border-radius:5px;background:#eaf7f3;padding:3px 6px;color:#247c6e;font-size:11px;font-style:normal;font-weight:800}.inn-paper-title-row button:hover strong{color:#168879;text-decoration:underline;text-decoration-color:#9fcfc5;text-underline-offset:3px}.inn-paper-status{flex:0 0 auto;padding-top:3px;color:#6d9387;font-size:11px;font-weight:800;white-space:nowrap}.inn-paper-item dl{display:flex;flex-wrap:wrap;gap:6px 8px;min-width:0;margin:0}.inn-paper-item dl div{display:inline-flex;align-items:baseline;gap:5px;min-width:0;max-width:100%;border-radius:5px;background:#f2f8f6;padding:4px 7px}.inn-paper-item dt{flex:0 0 auto;color:#5b887e;font-size:10px;font-weight:800}.inn-paper-item dd{min-width:0;overflow:hidden;margin:0;color:#41675e;font-size:11px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}.inn-paper-item dl div:nth-child(2){background:#f5f8fa}.inn-paper-item dl div:nth-child(2) dt{color:#728898}.inn-paper-item dl div:nth-child(2) dd{color:#556d7a}.inn-paper-item dl div:nth-child(3){background:#f5f1fb}.inn-paper-item dl div:nth-child(3) dt{color:#7863a4}.inn-paper-item dl div:nth-child(3) dd{color:#635180;font-family:"DIN Alternate","Arial",sans-serif;font-size:10px}.inn-paper-item>div p{display:-webkit-box;overflow:hidden;margin:0;color:#5d747e;font-size:12px;line-height:1.68;-webkit-box-orient:vertical;-webkit-line-clamp:2}.inn-paper-item>div p b{margin-right:7px;color:#397164;font-size:11px}.inn-paper-item footer{display:flex;flex-wrap:wrap;gap:5px;border-top:1px solid #edf3f1;padding-top:8px}.inn-paper-item footer span{border-radius:4px;background:#edf7f3;padding:3px 6px;color:#2b786b;font-size:10px;font-weight:700}.inn-paper-detail{display:flex;flex-wrap:wrap;gap:6px;border-top:1px dashed #d8e7e3;padding-top:8px;color:#58776f;font-size:11px}.inn-paper-detail b{color:#258071}
@media(max-width:720px){.inn-patent-topic-list{padding:0 9px 12px}.inn-patent-table{min-width:580px}.inn-paper-list{padding:10px}.inn-paper-item{padding:12px}.inn-paper-item.is-selected{padding-left:10px}.inn-paper-item-body>header{align-items:flex-start;flex-direction:column}.inn-paper-status{padding:0}.inn-paper-title-row strong{white-space:normal}.inn-paper-item dl{display:grid;grid-template-columns:1fr}.inn-paper-item dl div{display:grid;gap:2px}.inn-paper-item dd{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
.inn-wf-research-page .inn-recall-controls{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto;align-items:center;gap:18px;min-height:56px;padding:10px 12px}.inn-wf-research-page .inn-recall-type-tabs{flex:0 0 auto}.inn-wf-research-page .inn-recall-type-tabs button{min-height:34px;padding:0 13px;font-size:14px}.inn-wf-research-page .inn-recall-list-summary{display:flex;align-items:baseline;gap:5px;min-width:0;color:#668294;white-space:nowrap}.inn-wf-research-page .inn-recall-list-summary strong{color:#123e5e;font-family:"DIN Alternate","Arial",sans-serif;font-size:18px;font-weight:900}.inn-wf-research-page .inn-recall-list-summary b{color:#176c95;font-size:14px;font-weight:800}.inn-wf-research-page .inn-recall-list-summary span{margin-left:5px;color:#6d8696;font-size:14px}.inn-wf-research-page .inn-recall-list-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px}.inn-wf-research-page .inn-recall-list-actions button,.inn-wf-research-page .inn-recall-list-actions select{box-sizing:border-box;min-height:34px;border:1px solid #d6e4eb;border-radius:7px;background:#fff;color:#416b82;font-family:"Microsoft YaHei",sans-serif;font-size:14px;font-weight:700}.inn-wf-research-page .inn-recall-list-actions button{min-width:70px;padding:0 12px;cursor:pointer}.inn-wf-research-page .inn-recall-list-actions button:hover{border-color:#9fcddd;background:#f4fafc;color:#1379a8}.inn-wf-research-page .inn-recall-list-actions button.saved{border-color:#b8ddd1;background:#eff9f5;color:#247b62}.inn-wf-research-page .inn-recall-list-actions select{width:112px;padding:0 28px 0 11px;cursor:pointer;outline:0}.inn-wf-research-page .inn-recall-list-actions select:focus{border-color:#62b1cd;box-shadow:0 0 0 3px rgba(49,152,190,.12)}@media(max-width:980px){.inn-wf-research-page .inn-recall-controls{grid-template-columns:auto minmax(0,1fr) auto;gap:10px}.inn-wf-research-page .inn-recall-list-summary{grid-column:1/3;grid-row:2}.inn-wf-research-page .inn-recall-list-actions{grid-column:3;grid-row:1/3}}@media(max-width:720px){.inn-wf-research-page .inn-recall-controls{display:flex;align-items:stretch;gap:9px}.inn-wf-research-page .inn-recall-type-tabs{width:100%;overflow:auto}.inn-wf-research-page .inn-recall-type-tabs button{flex:1 0 auto}.inn-wf-research-page .inn-recall-list-summary{padding:0 4px}.inn-wf-research-page .inn-recall-list-actions{justify-content:space-between}.inn-wf-research-page .inn-recall-list-actions button,.inn-wf-research-page .inn-recall-list-actions select{min-height:38px}}
.inn-wf-nav .inn-wf-subnav button{font-size:14px;line-height:1.35}.inn-wf-nav .inn-wf-subnav{gap:5px;padding-top:7px;padding-bottom:7px}@media(min-width:1440px){.inn-wf-nav .inn-wf-subnav button{font-size:clamp(15px,.86vw,17px)}}@media(max-width:720px){.inn-wf-nav .inn-wf-subnav button{font-size:14px}}
.inn-wf-card-project .inn-project-confirm-item{gap:5px;min-height:57px;border:1px solid #e1ebef;border-radius:10px;background:#fbfdfe;padding:11px 13px}.inn-wf-card-project .inn-project-confirm-item:hover{border-color:#d4e5ec;background:#fbfdfe}.inn-wf-card-project .inn-project-confirm-item:focus-within{border-color:#72b8d2;background:#fff;box-shadow:0 0 0 3px rgba(44,139,177,.1)}.inn-wf-card-project .inn-project-confirm-item>span{color:#688493;font-size:13px;font-weight:800}.inn-wf-card-project .inn-project-confirm-item textarea{border:0;border-top:0;padding:0;color:#264c65;font-size:16px;font-weight:700;line-height:1.65}.inn-wf-card-project .inn-project-confirm-item textarea:focus{outline:0}@media(min-width:1440px){.inn-wf-card-project .inn-project-confirm-item>span{font-size:14px}.inn-wf-card-project .inn-project-confirm-item textarea{font-size:clamp(17px,.96vw,20px)}}@media(max-width:720px){.inn-wf-card-project .inn-project-confirm-item>span{font-size:12px}.inn-wf-card-project .inn-project-confirm-item textarea{font-size:15px}}
.inn-project-edit-toggle{align-self:flex-end;min-width:96px;min-height:44px;border:1px solid #8ec4da;border-radius:9px;background:#fff;padding:0 20px;color:#1375a2;font-family:"Microsoft YaHei",sans-serif;font-size:16px;font-weight:800;cursor:pointer;transition:background-color .16s,border-color .16s,color .16s,box-shadow .16s}.inn-project-edit-toggle:hover{border-color:#4299bd;background:#f2fafc;box-shadow:0 4px 10px rgba(19,117,162,.1)}.inn-wf-card-project:not(.is-project-editing){background:#f7fafc}.inn-wf-card-project:not(.is-project-editing) .inn-wf-field input,.inn-wf-card-project:not(.is-project-editing) .inn-wf-field textarea,.inn-wf-card-project:not(.is-project-editing) .inn-project-target-grid input{caret-color:transparent;cursor:default}.inn-wf-card-project:not(.is-project-editing) .inn-project-overview .inn-wf-field,.inn-wf-card-project:not(.is-project-editing) .inn-project-confirm-item,.inn-wf-card-project:not(.is-project-editing) .inn-project-details .inn-wf-field,.inn-wf-card-project:not(.is-project-editing) .inn-project-target-grid article{pointer-events:none}.inn-wf-card-project:not(.is-project-editing) .inn-project-overview .inn-wf-field,.inn-wf-card-project:not(.is-project-editing) .inn-project-confirm-item,.inn-wf-card-project:not(.is-project-editing) .inn-project-details .inn-wf-field{border-color:#e1ebef;background:#fbfdfe;box-shadow:none}.inn-wf-card-project:not(.is-project-editing) .inn-wf-field:focus-within,.inn-wf-card-project:not(.is-project-editing) .inn-project-confirm-item:hover,.inn-wf-card-project:not(.is-project-editing) .inn-project-confirm-item:focus-within{border-color:#e1ebef;background:#fbfdfe;box-shadow:none}.inn-wf-card-project:not(.is-project-editing) .inn-project-target-grid article:focus-within{background:inherit;box-shadow:none}.inn-wf-card-project.is-project-editing{background:#f0f8fb}.inn-wf-card-project.is-project-editing .inn-project-edit-toggle{border-color:#147dad;background:#147dad;color:#fff;box-shadow:0 5px 12px rgba(18,110,157,.18)}.inn-wf-card-project.is-project-editing .inn-project-overview,.inn-wf-card-project.is-project-editing .inn-project-targets,.inn-wf-card-project.is-project-editing .inn-project-details-shell{border-color:#91c9dd;box-shadow:0 9px 24px rgba(23,117,154,.1)}.inn-wf-card-project.is-project-editing .inn-project-overview .inn-wf-field,.inn-wf-card-project.is-project-editing .inn-project-confirm-item,.inn-wf-card-project.is-project-editing .inn-project-details .inn-wf-field{border-color:#b9d9e5;background:#fff}.inn-wf-card-project.is-project-editing .inn-project-target-grid article{background:#fff}.inn-wf-card-project.is-project-editing .inn-project-target-grid article:nth-child(even){background:#fafdfe}@media(max-width:720px){.inn-project-edit-toggle{min-width:84px;min-height:40px;padding:0 16px;font-size:15px}}
/* 政策与内部知识采用连续证据清单，避免结果卡与字段卡的双层容器。 */
.inn-wf-card-research .inn-evidence-ledger{overflow:hidden;border-top:1px solid #dce8ee;background:#fff}
.inn-wf-card-research .inn-evidence-ledger-row{position:relative;display:grid;grid-template-columns:58px minmax(0,1fr);min-width:0;border-bottom:1px solid #e2ebef;background:#fff;transition:background-color .16s ease}
.inn-wf-card-research .inn-evidence-ledger-row:hover{background:#fbfdfe}
.inn-wf-card-research .inn-evidence-ledger-row.is-selected{background:#f7fcfe;box-shadow:inset 3px 0 0 #1688ba}
.inn-wf-card-research .inn-evidence-ledger.is-internal .inn-evidence-ledger-row.is-selected{box-shadow:inset 3px 0 0 #2a9a78}
.inn-evidence-ledger-select{display:grid;grid-template-columns:16px 22px;align-items:center;align-content:start;justify-content:center;gap:7px;border-right:1px solid #edf2f4;padding:17px 7px;background:#f8fbfc;color:#7a929f;cursor:pointer}
.inn-evidence-ledger-select input{width:16px;height:16px;margin:0;accent-color:#1687b8;cursor:pointer}
.inn-evidence-ledger.is-internal .inn-evidence-ledger-select input{accent-color:#2b9778}
.inn-evidence-ledger-select span{font-family:"DIN Alternate","Arial",sans-serif;font-size:13px;font-weight:800;line-height:16px}
.inn-evidence-ledger-body{min-width:0;padding:14px 18px 12px}
.inn-evidence-ledger-body>header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;min-width:0}
.inn-evidence-ledger-body>header>button{min-width:0;border:0;background:transparent;padding:0;color:#173f5b;text-align:left;font-family:"Microsoft YaHei",sans-serif;font-size:15px;font-weight:800;line-height:1.55;cursor:pointer}
.inn-evidence-ledger-body>header>button:hover,.inn-evidence-ledger-body>header>button:focus-visible{outline:0;color:#0979a7;text-decoration:underline;text-decoration-color:#a6d3e2;text-underline-offset:3px}
.inn-evidence-ledger.is-internal .inn-evidence-ledger-body>header>button:hover,.inn-evidence-ledger.is-internal .inn-evidence-ledger-body>header>button:focus-visible{color:#217d62;text-decoration-color:#a6d8c8}
.inn-evidence-ledger-status{flex:0 0 auto;padding-top:3px;color:#6d8a98;font-size:12px;font-weight:800;white-space:nowrap}
.inn-evidence-ledger-row.is-selected .inn-evidence-ledger-status{color:#137ca8}
.inn-evidence-ledger.is-internal .inn-evidence-ledger-row.is-selected .inn-evidence-ledger-status{color:#247a61}
.inn-evidence-ledger-body>p{display:-webkit-box;overflow:hidden;margin:7px 0 0;color:#587281;font-size:14px;line-height:1.68;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.inn-evidence-ledger-body>dl{display:grid;grid-template-columns:minmax(180px,1.45fr) minmax(140px,1fr) minmax(100px,.72fr);gap:0;min-width:0;margin:10px 0 0;border-top:1px solid #edf2f4;padding-top:9px}
.inn-evidence-ledger-body>dl>div{min-width:0;padding:0 13px;border-left:1px solid #e4edf1}
.inn-evidence-ledger-body>dl>div:first-child{border-left:0;padding-left:0}
.inn-evidence-ledger-body dt{color:#8196a3;font-size:11px;font-weight:700;line-height:1.4}
.inn-evidence-ledger-body dd{overflow:hidden;margin:3px 0 0;color:#3d6073;font-size:13px;font-weight:700;line-height:1.45;text-overflow:ellipsis;white-space:nowrap}
.inn-evidence-ledger-body>footer{display:flex;justify-content:flex-end;margin-top:8px}
.inn-evidence-ledger-body>footer button{border:0;background:transparent;padding:0;color:#39718b;font-family:"Microsoft YaHei",sans-serif;font-size:13px;font-weight:700;cursor:pointer}
.inn-evidence-ledger-body>footer button:hover{color:#0d7daa;text-decoration:underline;text-underline-offset:3px}
.inn-evidence-ledger.is-internal .inn-evidence-ledger-body>footer button:hover{color:#287e63}
.inn-evidence-ledger-detail{margin-top:10px;border-top:1px dashed #d9e7ec;padding-top:9px}
.inn-evidence-ledger-detail b{color:#28708f;font-size:12px}
.inn-evidence-ledger.is-internal .inn-evidence-ledger-detail b{color:#277b62}
.inn-evidence-ledger-detail p{margin:5px 0 0;color:#587282;font-size:13px;line-height:1.7}
@media(max-width:720px){.inn-wf-card-research .inn-evidence-ledger-row{grid-template-columns:44px minmax(0,1fr)}.inn-evidence-ledger-select{gap:0;padding:15px 4px}.inn-evidence-ledger-select span{display:none}.inn-evidence-ledger-body{padding:13px 14px 12px}.inn-evidence-ledger-body>header{gap:9px}.inn-evidence-ledger-body>header>button{font-size:15px}.inn-evidence-ledger-status{font-size:11px}.inn-evidence-ledger-body>p{font-size:14px}.inn-evidence-ledger-body>dl{grid-template-columns:1fr;gap:7px}.inn-evidence-ledger-body>dl>div,.inn-evidence-ledger-body>dl>div:first-child{display:grid;grid-template-columns:72px minmax(0,1fr);gap:7px;padding:0;border-left:0}.inn-evidence-ledger-body dd{margin:0}.inn-evidence-ledger-body>footer{justify-content:flex-start;margin-top:9px}}
.inn-wf-nav h1{padding-right:54px;color:#133d59;font-size:20px;font-weight:800;letter-spacing:-.04em}.inn-wf-nav>div>button{min-height:51px;color:#587786;font-size:16px;font-weight:800;letter-spacing:-.025em;line-height:1.4}.inn-wf-nav>div>button i{width:27px;height:27px;font-size:12px}.inn-wf-nav>div>button.done{color:#426d76}.inn-wf-nav>div>button:disabled{opacity:.62}.inn-wf-nav .inn-wf-subnav{margin-left:40px;padding-left:13px}.inn-wf-nav .inn-wf-subnav button{min-height:36px;padding:8px 9px;font-family:"Microsoft YaHei",sans-serif;font-size:16px;font-weight:800;letter-spacing:-.025em;line-height:1.4}.inn-wf-nav .inn-wf-nav-collapse{top:17px;z-index:2;width:32px;min-height:32px;border-radius:8px;font-size:24px}@media(min-width:1440px){.inn-wf-nav h1{font-size:clamp(21px,1.15vw,25px)}.inn-wf-nav>div>button,.inn-wf-nav .inn-wf-subnav button{font-size:clamp(16px,.9vw,18px)}}@media(max-width:980px){.inn-wf-nav>div>button,.inn-wf-nav .inn-wf-subnav button{min-height:50px;font-size:15px}}@media(max-width:720px){.inn-wf-nav h1{font-size:20px}.inn-wf-nav>div>button,.inn-wf-nav .inn-wf-subnav button{font-size:15px}.inn-wf-nav .inn-wf-subnav{margin-left:36px;padding-left:11px}.inn-wf-nav .inn-wf-subnav button{min-height:36px}}
.inn-recall-pagination{display:flex;align-items:center;justify-content:space-between;gap:14px;border-top:1px solid #dfeaf0;background:#fff;padding:14px 16px;color:#607d8e;font-size:14px;font-weight:700}.inn-recall-pagination>div{display:flex;align-items:center;gap:6px}.inn-recall-pagination button{display:grid;place-items:center;min-width:32px;height:32px;border:1px solid #d4e3ea;border-radius:7px;background:#fff;color:#426a80;font:800 14px/1 "Microsoft YaHei",sans-serif;cursor:pointer}.inn-recall-pagination button:hover:not(:disabled){border-color:#83bed4;background:#f2fafc;color:#117aa7}.inn-recall-pagination button.active{border-color:#1686b8;background:#1686b8;color:#fff}.inn-recall-pagination button:disabled{cursor:default;opacity:.42}.inn-recall-pagination i{width:20px;color:#7490a0;text-align:center;font-size:14px;font-style:normal}@media(max-width:720px){.inn-recall-pagination{align-items:flex-start;flex-direction:column;padding:12px}.inn-recall-pagination>div{width:100%;justify-content:flex-end}}
.inn-wf-card-research .inn-recall-title h3 button{border:0;background:transparent;padding:0;color:inherit;font:inherit;line-height:inherit;text-align:left;cursor:pointer}.inn-wf-card-research .inn-recall-title h3 button:hover,.inn-wf-card-research .inn-recall-title h3 button:focus-visible{outline:0;color:#087cad;text-decoration:underline;text-decoration-color:#9ccfe0;text-underline-offset:3px}
.inn-wf-card-research .inn-evidence-ledger.is-policy .inn-evidence-ledger-row.is-selected{background:#fffdf8;box-shadow:inset 3px 0 0 #c69539}.inn-evidence-ledger.is-policy .inn-evidence-ledger-select input{accent-color:#bd8b2e}.inn-evidence-ledger.is-policy .inn-evidence-ledger-body>header>button:hover,.inn-evidence-ledger.is-policy .inn-evidence-ledger-body>header>button:focus-visible{color:#9a6a16;text-decoration-color:#e4c984}.inn-evidence-ledger.is-policy .inn-evidence-ledger-row.is-selected .inn-evidence-ledger-status{color:#9a6a16}.inn-evidence-ledger-header-meta{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0}.inn-evidence-ledger-type{flex:0 0 auto;border-radius:4px;padding:3px 6px;font-size:11px;font-weight:800;line-height:1.2;white-space:nowrap}.inn-evidence-ledger-type.is-policy{background:#fff4df;color:#9a6a16}.inn-evidence-ledger-type.is-internal{background:#e9f8f1;color:#257b60}.inn-evidence-ledger-type.is-internal.is-personal{background:#edf5fb;color:#307499}.inn-evidence-ledger-header-meta .inn-evidence-ledger-status{padding-top:0}
@media(max-width:980px){.inn-wf-nav .inn-wf-subnav button{min-height:36px}}
.inn-patent-topic-tabs{grid-template-columns:repeat(2,minmax(0,1fr));gap:0;border-bottom:1px solid #dce8ee;border-radius:0;background:#f7fafb;padding:0 10px}.inn-patent-topic-tabs button{position:relative;display:flex;min-width:0;min-height:52px;align-items:center;border:0;border-radius:0;background:transparent;padding:0 14px;color:#647f8e;text-align:left}.inn-patent-topic-tabs .inn-patent-topic-title{display:block;min-width:0;overflow:hidden;color:inherit;font-size:16px;font-weight:800;line-height:1.45;text-overflow:ellipsis;white-space:nowrap}.inn-patent-topic-tabs button:hover{background:#f1f8fa;color:#1a7199}.inn-patent-topic-tabs button.active{background:#fff;color:#123f5c;box-shadow:inset 0 -3px 0 #1686b8}.inn-patent-topic-tabs button.active .inn-patent-topic-title{color:inherit}@media(min-width:1440px){.inn-patent-topic-tabs .inn-patent-topic-title{font-size:clamp(16px,.9vw,18px)}}@media(max-width:720px){.inn-patent-topic-tabs{grid-template-columns:1fr;padding:4px 10px}.inn-patent-topic-tabs button{min-height:48px;padding:0 10px}.inn-patent-topic-tabs .inn-patent-topic-title{font-size:15px}}
.inn-wf-card-analysis:not(.is-analysis-editing){background:#f7fafc}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card,.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-card{border:1px solid #d7e8ee;background:linear-gradient(128deg,#eef9fc 0%,#f9fcfd 55%,#eef7fb 100%);box-shadow:0 7px 18px rgba(22,91,121,.045)}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>header,.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-card>header{background:transparent}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>label,.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body{background:transparent}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body label+label{border-left:1px solid rgba(104,158,180,.25);padding-left:16px}.inn-analysis-readonly-title{display:block;color:#1f4c68;font-size:16px;font-weight:800;line-height:1.55}.inn-analysis-readonly-copy{margin:0;color:#355f77;font-size:14px;font-weight:600;line-height:1.72}.inn-wf-card-analysis.is-analysis-editing{background:#f0f8fb}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-edit-toggle{border-color:#147dad;background:#147dad;color:#fff;box-shadow:0 5px 12px rgba(18,110,157,.18)}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-topic-card,.inn-wf-card-analysis.is-analysis-editing .inn-analysis-point-card{border:1px solid #9ecbdd;background:#f5fafc;box-shadow:0 9px 24px rgba(23,117,154,.09)}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-topic-card>header,.inn-wf-card-analysis.is-analysis-editing .inn-analysis-point-card>header{background:linear-gradient(100deg,#e8f6fa,#f5fbfd)}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-topic-card textarea,.inn-wf-card-analysis.is-analysis-editing .inn-analysis-point-card textarea{border:1px solid #d2e4eb;background:#fff;box-shadow:inset 0 1px 2px rgba(24,94,122,.035)}@media(max-width:720px){.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body label+label{border-top:1px solid rgba(104,158,180,.25);border-left:0;padding-top:12px;padding-left:0}.inn-analysis-readonly-title{font-size:15px}.inn-analysis-readonly-copy{font-size:14px}}
.inn-analysis-header-actions{display:flex;align-items:flex-end;gap:12px;margin-left:auto}.inn-analysis-header-actions .inn-wf-stage-metrics{width:210px;min-width:210px;margin:0}.inn-analysis-header-actions .inn-wf-stage-metrics div{padding:8px 10px}.inn-analysis-header-actions .inn-wf-stage-metrics dt{font-size:11px}.inn-analysis-header-actions .inn-wf-stage-metrics dd{margin-top:3px;font-size:15px}.inn-analysis-header-actions .inn-project-edit-toggle{align-self:auto}@media(max-width:720px){.inn-analysis-header-actions{width:100%;justify-content:space-between}.inn-analysis-header-actions .inn-wf-stage-metrics{width:calc(100% - 98px);min-width:0}.inn-analysis-header-actions .inn-project-edit-toggle{min-width:84px}}
.inn-wf-card-analysis:not(.is-analysis-editing) .inn-wf-analysis-page{gap:18px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-section{gap:10px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-section-head>span{font-size:19px;letter-spacing:-.02em}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-grid{gap:12px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>header{grid-template-columns:36px minmax(0,1fr);gap:10px;padding:12px 16px 5px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>header>i{width:30px;height:30px;border-radius:8px;background:#1688ba;color:#fff;font-size:11px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>label{gap:4px;padding:5px 16px 14px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>label>span,.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body label>span{font-size:13px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-list{gap:12px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-card>header{padding:12px 18px 5px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-title{grid-template-columns:36px minmax(0,1fr);align-items:center;gap:10px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-card .inn-analysis-point-title>i{width:30px;height:30px;display:grid;place-items:center;border-radius:8px;background:#1688ba;padding:0;color:#fff;font-size:11px;line-height:1}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body{grid-template-columns:1.1fr 1fr;gap:0;padding:7px 18px 14px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body label{gap:4px;min-width:0}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body label+label{padding-left:16px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-title{font-size:17px;line-height:1.5}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-copy{font-size:15px;line-height:1.68}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-section-head>span{font-size:19px}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-topic-card textarea,.inn-wf-card-analysis.is-analysis-editing .inn-analysis-point-card textarea{font-size:15px;line-height:1.65}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-topic-card>header textarea,.inn-wf-card-analysis.is-analysis-editing .inn-analysis-point-title textarea{font-size:17px;font-weight:800}@media(min-width:1440px){.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-section-head>span{font-size:clamp(20px,1.05vw,23px)}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-title{font-size:clamp(18px,.98vw,21px)}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-copy{font-size:clamp(15px,.82vw,17px)}}@media(max-width:720px){.inn-wf-card-analysis:not(.is-analysis-editing) .inn-wf-analysis-page{gap:15px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-section-head>span{font-size:18px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>header{padding:12px 13px 5px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>label{padding:5px 13px 13px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-card>header{padding:12px 13px 5px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body{grid-template-columns:1fr;gap:10px;padding:7px 13px 13px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body label+label{border-top:1px solid rgba(104,158,180,.25);border-left:0;padding-top:10px;padding-left:0}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-title{font-size:16px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-copy{font-size:14px}}
.inn-wf-card-analysis:not(.is-analysis-editing) .inn-wf-analysis-page{gap:16px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-section{gap:9px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-section-head>span{font-size:18px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-grid{gap:11px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>header{padding:12px 16px 7px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-topic-card>label{padding:7px 16px 15px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-list{gap:14px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-card>header{padding:13px 18px 7px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-point-body{padding:9px 18px 15px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-title{font-size:16px;line-height:1.55}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-copy{font-size:14px;line-height:1.72}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-section-head>span{font-size:18px}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-topic-card textarea,.inn-wf-card-analysis.is-analysis-editing .inn-analysis-point-card textarea{font-size:14px}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-topic-card>header textarea,.inn-wf-card-analysis.is-analysis-editing .inn-analysis-point-title textarea{font-size:16px}@media(min-width:1440px){.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-section-head>span{font-size:clamp(19px,1vw,21px)}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-title{font-size:clamp(16px,.9vw,19px)}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-copy{font-size:clamp(14px,.78vw,16px)}}@media(max-width:720px){.inn-wf-card-analysis:not(.is-analysis-editing) .inn-wf-analysis-page{gap:14px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-section-head>span{font-size:17px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-title{font-size:15px}.inn-wf-card-analysis:not(.is-analysis-editing) .inn-analysis-readonly-copy{font-size:14px}}
.inn-analysis-header-actions{gap:10px}.inn-analysis-header-actions .inn-wf-stage-metrics{box-sizing:border-box;height:56px;border-color:#cfe2eb;border-radius:10px;background:#cfe2eb}.inn-analysis-header-actions .inn-wf-stage-metrics div{display:grid;align-content:center;padding:7px 10px;background:#f8fcfd}.inn-analysis-header-actions .inn-project-edit-toggle{box-sizing:border-box;align-self:auto;min-width:88px;height:56px;min-height:56px;border-color:#9cc9db;border-radius:10px;background:#f8fcfd;padding:0 18px;box-shadow:none}.inn-analysis-header-actions .inn-project-edit-toggle:hover{border-color:#4a9fbe;background:#f1f9fc;box-shadow:none}.inn-wf-card-analysis.is-analysis-editing .inn-analysis-header-actions .inn-project-edit-toggle{border-color:#147dad;background:#147dad;box-shadow:0 5px 12px rgba(18,110,157,.18)}@media(max-width:720px){.inn-analysis-header-actions{gap:9px}.inn-analysis-header-actions .inn-wf-stage-metrics,.inn-analysis-header-actions .inn-project-edit-toggle{height:50px;min-height:50px;border-radius:9px}.inn-analysis-header-actions .inn-project-edit-toggle{min-width:84px}}
.inn-wf-nav .inn-wf-subnav button{min-height:34px;padding:7px 8px;font-size:14px;line-height:1.35}@media(min-width:1440px){.inn-wf-nav .inn-wf-subnav button{font-size:15px}}@media(max-width:980px){.inn-wf-nav .inn-wf-subnav button{min-height:34px;font-size:14px}}@media(max-width:720px){.inn-wf-nav .inn-wf-subnav button{font-size:14px}}
.inn-patent-preview.is-title{width:min(420px,calc(100vw - 32px))}.inn-patent-preview.is-title dl{margin-top:10px}.inn-patent-preview.is-title footer{margin-top:9px}.inn-patent-status.is-实质审查,.inn-patent-status.is-授权一案双申,.inn-patent-status.is-授权一案双申质押{background:#fff6e7;color:#9a6c1f}.inn-patent-status.is-驳回,.inn-patent-status.is-驳回一案双申,.inn-patent-status.is-撤回-视为撤回,.inn-patent-status.is-撤回-视为撤回一案双申,.inn-patent-status.is-未缴年费{background:#f0f3f5;color:#6d7f8a}
</style>
