<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, Download, FileText, Info, Lightbulb, PanelRightClose, PanelRightOpen, Pencil, RefreshCw, ScrollText, Sparkles } from '@lucide/vue'
import ApplicationHeading from '../../components/ApplicationHeading.vue'
import { useUiStore } from '../../stores/ui.js'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const stage = ref('launch')
const input = ref('')
const showGuide = ref(false)
const assistantCollapsed = ref(false)
const adjusting = ref(false)
const editingBlock = ref(null)
const regenerateReady = ref(false)
const activeToc = ref('field')
const documentPane = ref(null)
const tocElement = ref(null)
const isGenerating = ref(false)
const generationProgress = ref(100)
const generationMessage = ref('')
const streamingSectionId = ref(null)
const streamedText = ref('')
let generationRun = 0

const example = '技术背景：现有煤矿井下巡检机器人在弱光、粉尘、高湿和局部通信中断条件下，容易出现视觉定位失效、惯导误差累积、巡检任务中断以及告警信息无法及时上传等问题。单一传感器难以保证定位可靠性，依赖地面平台的控制方式也无法在 5G 专网暂时中断时维持安全巡检。\n\n技术手段：本技术方案提出一种煤矿井下自主巡检机器人系统，包括机器人本体、防爆驱动组件、多传感器检测组件、防爆边缘控制器和通信组件。多传感器检测组件包括视觉传感器、激光雷达、惯性测量单元和气体传感器。防爆边缘控制器根据视觉、激光雷达和惯性测量单元的检测结果进行融合定位，并依据各传感器的质量评分动态调整融合权重；当气体浓度达到预警阈值时，在本地生成告警并控制机器人进入安全巡检模式；当通信组件与地面管理平台的连接中断时，将巡检数据和告警事件存入本地任务队列，并按照预设安全路线继续巡检或返回安全区域；通信恢复后，再按照事件优先级向地面管理平台补传数据。\n\n技术效果：本技术方案能够提高机器人在弱光和粉尘环境下的定位稳定性，在通信中断时保留气体检测、障碍识别、安全巡检和自主返航能力，避免任务直接中断；同时通过本地告警与分级补传缩短危险事件响应时间，减少数据丢失，并降低井下巡检对持续网络连接和人工干预的依赖。'
const sections = ref([
  { id: 'field', title: '技术领域', paragraphs: ['本发明涉及煤矿巡检领域，具体涉及一种煤矿井下自主巡检机器人系统。'] },
  { id: 'background', title: '背景技术', paragraphs: [
    '关于解决煤矿井下巡检机器人在弱光、粉尘、高湿和局部通信中断条件下出现视觉定位失效、惯导误差累积、巡检任务中断以及告警信息无法及时上传等问题，目前已经有了一些发明专利。',
    '例如，CN218226626U 公开了一种煤矿防爆智能越障巡检机器人，其包括履带底盘行走总成、防爆机体外壳、防爆控制仓和防爆激光雷达，防爆机体外壳支撑于履带底盘行走总成上，防爆控制仓固定在防爆机体外壳上，防爆控制仓内设置有防爆智能控制系统，防爆激光雷达固定在防爆控制仓的顶部，防爆智能控制系统与履带底盘行走总成和防爆激光雷达皆通讯连接，防爆智能控制系统适于根据防爆激光雷达检测信号控制履带底盘行走总成动作。但是，该专利在防爆激光雷达的检测精度方面仍存在不足，难以准确反馈信息给防爆智能控制系统，影响机器人能够精确控制行进轨迹。',
    'CN120853282A 公开了一种针对煤矿井下特殊环境的巡检机器人，包括行走轨道，还包括行走机构、主体框架、检测单元、供电单元、通信单元及云台护罩组件，其中行走机构与行走轨道配合实现移动，检测单元通过云台护罩组件实现仪表图像采集，供电单元与通信单元分别为整机供电及数据传输。但是，该专利在多源探测传感系统的精度和稳定性方面仍有待提高，难以及时发现并报警异常情况，影响煤矿井下人员和输煤皮带的安全。',
  ], blocks: [
    { subtitle: '背景技术缺点', paragraphs: ['现有煤矿井下巡检机器人存在以下缺点：', '1. 在弱光、粉尘、高湿等恶劣环境下，传统巡检机器人容易出现视觉定位失效、惯导误差累积等问题，影响其正常巡检任务的进行，难以保证定位的可靠性；', '2. 现有巡检机器人多源信息融合感知能力差，缺乏有效的障碍物清理手段，难以适应煤矿综掘工作面装备繁多且空间狭小的复杂作业工况；', '3. 在通信中断或网络不稳定的情况下，巡检机器人无法及时上传数据和告警信息，导致巡检任务中断，增加了巡检盲区，无法保证在 5G 专网暂时中断时的安全巡检；', '4. 现有巡检机器人的智能化程度不足，缺乏自主决策和远程监控能力，无法根据实时路况自主调整行进轨迹，也无法及时应对复杂环境中的突发情况；'] },
  ] },
  { id: 'purpose', title: '发明目的', blocks: [
    { subtitle: '现有问题描述', paragraphs: ['现有技术中存在煤矿井下巡检机器人在恶劣环境下定位不稳定、通信中断时无法自主巡检的问题。因此，本发明为了解决上述问题，提供了一种煤矿井下自主巡检机器人系统。'] },
    { subtitle: '有益效果描述', paragraphs: ['与现有技术相比，本发明提供了一种煤矿井下自主巡检机器人系统，具有以下有益效果：', '1. 本发明通过集成视觉传感器、激光雷达、惯性测量单元和气体传感器等多传感器，形成高精度、高稳定性的感知系统，有效解决现有巡检机器人在弱光、粉尘、高湿等恶劣环境下视觉定位失效、惯导误差累积的问题，显著提高机器人在复杂环境下的定位稳定性和可靠性；', '2. 本发明采用防爆边缘控制器根据各传感器的检测结果进行融合定位，并依据传感器质量评分动态调整融合权重，实现多传感器信息的有效融合，提高对煤矿井下环境的全面监测能力，及时发现并报警异常情况；', '3. 本发明通过气体传感器设置预警阈值机制，当气体浓度达到预警阈值时自动生成告警并控制机器人进入安全巡检模式，有效避免危险情况扩散，提高巡检的安全性和及时性；', '4. 本发明在通信组件与地面管理平台连接中断时，将巡检数据和告警事件存入本地任务队列，并按照预设安全路线继续巡检或返回安全区域，确保巡检任务的连续性和安全性，有效降低井下巡检对持续网络连接和人工干预的依赖；'] },
  ] },
  { id: 'solution', title: '技术方案', paragraphs: [
    '本发明的目的在于克服现有技术中存在的缺点，提供一种煤矿井下自主巡检机器人系统，该系统包括机器人本体、防爆驱动组件、多传感器检测组件、防爆边缘控制器和通信组件。',
    '所述机器人本体包括车身底板、主动轮组件、被动轮组件和升降机构，其中车身底板固定在主动轮组件和被动轮组件之间，升降机构设置在车身底板下方，用于调节机器人本体的高度。',
    '所述防爆驱动组件包括驱动电机、制动器和安全装置，驱动电机与制动器连接，安全装置设置在机器人本体的侧面。',
    '所述多传感器检测组件包括视觉传感器、激光雷达、惯性测量单元和气体传感器，其中视觉传感器采用高清摄像头，激光雷达采用塔顶式布局，惯性测量单元包括陀螺仪和加速度计，气体传感器用于检测周围气体浓度。',
    '所述防爆边缘控制器与各传感器连接，用于根据视觉、激光雷达和惯性测量单元的检测结果进行融合定位，并依据各传感器的质量评分动态调整融合权重。当气体浓度达到预警阈值时，防爆边缘控制器在本地生成告警并控制机器人进入安全巡检模式。',
    '所述通信组件包括无线通信模块和备用通信模块。无线通信模块用于与地面管理平台通信；当通信组件与地面管理平台的连接中断时，通信组件将巡检数据和告警事件存入本地任务队列，并按照预设安全路线继续巡检或返回安全区域。通信恢复后，通信组件按照事件优先级向地面管理平台补传数据。',
    '所述机器人本体还设有安全避障系统，包括超声波传感器和红外线传感器，用于检测周围环境的障碍物。当检测到障碍物时，安全避障系统控制机器人改变行进方向，避开障碍物。',
    '所述升降机构包括升降电机、升降导轨和升降平台，升降电机通过升降导轨驱动升降平台升降，用于适应不同高度的作业环境。升降平台上设有抓取装置，用于抓取和放置样本。',
    '所述车身底板上设有悬挂机构，用于安装和拆卸传感器和设备。悬挂机构包括悬挂支架和快速锁紧螺栓，悬挂支架采用铝合金材质，具有良好的抗腐蚀性和抗扭性。',
    '所述视觉传感器采用高清镜头和 CMOS 传感器，具有远距离感知功能，具备高精度和模块化维护能力。所述激光雷达传感器采用多线扫描结构，具备超广视角和高分辨率，并采用防水密封设计以适应复杂环境。',
    '所述惯性测量单元采用高精度陀螺仪和加速度计，能够实时监测机器人的运动状态，提供稳定可靠的导航信息，并采用模块化设计便于维护和升级。气体传感器采用防爆设计，能够检测多种气体成分，具有良好的抗干扰能力。',
    '所述防爆边缘控制器采用智能算法，能够根据各传感器的检测结果进行实时融合，实现高精度定位和智能避障，并采用热备份设计以确保系统稳定性。通信组件采用双模通信协议，并配置数据加密模块，用于保护传输数据的安全性。',
    '所述机器人系统还包括远程监控模块，用于实时将机器人状态和环境信息传输至地面管理平台。远程监控模块采用高清视频传输技术，可实现实时视频监控和远程操控。',
  ] },
  { id: 'embodiment', title: '具体实施方式', blocks: [
    { subtitle: '实施例一：', paragraphs: ['本发明提供了一种煤矿井下自主巡检机器人系统，包括机器人本体、防爆驱动组件、多传感器检测组件、防爆边缘控制器和通信组件。', '所述机器人本体包括车身底板、主动轮组件、被动轮组件和升降机构。车身底板固定在主动轮组件和被动轮组件之间，升降机构设置在车身底板下方，用于调节机器人本体的高度。主动轮组件和被动轮组件均包括两个万向轮，用于提高机器人的灵活性和稳定性。', '所述防爆驱动组件包括驱动电机、制动器和安全装置。驱动电机与制动器连接，安全装置设置在机器人本体侧面。驱动电机采用伺服电机；制动器用于控制机器人启动和停止。', '所述多传感器检测组件包括视觉传感器、激光雷达、惯性测量单元和气体传感器。视觉传感器采用高清镜头和 CMOS 传感器；激光雷达采用多线扫描结构；惯性测量单元包括高精度陀螺仪和加速度计；气体传感器用于检测多种气体成分。', '所述防爆边缘控制器采用智能算法，根据视觉、激光雷达和惯性测量单元的检测结果进行实时融合，实现高精度定位和智能避障，并采用热备份设计以确保系统稳定性。', '所述通信组件包括无线通信模块和备用通信模块，通信组件还包括数据加密模块，用于保护传输数据的安全性。', '所述机器人本体还设有安全避障系统，包括超声波传感器和红外线传感器；当检测到障碍物时，安全避障系统控制机器人改变行进方向，避开障碍物。', '所述升降机构包括升降电机、升降导轨和升降平台；升降平台上设有抓取装置，用于抓取和放置样本。所述车身底板设有悬挂机构，用于安装和拆卸传感器和设备。'] },
    { subtitle: '实施例二：', paragraphs: ['本发明提供的一种煤矿井下自主巡检机器人系统，包括机器人本体、防爆驱动组件、多传感器检测组件、防爆边缘控制器和通信组件。', '机器人本体采用模块化车身结构，车身底板设置于主动轮组件和被动轮组件之间，升降机构设置在车身底板下方；主动轮组件和被动轮组件均包括万向轮，以提升耐磨性、抗冲击性和复杂巷道通行能力。', '多传感器检测组件由视觉传感器、激光雷达、惯性测量单元和气体传感器组成。通过视觉与激光雷达协同完成环境感知，惯性测量单元提供稳定导航信息，气体传感器承担环境安全检测。', '防爆边缘控制器根据传感器检测结果进行实时融合与智能避障；通信组件通过主备通信链路完成数据回传，在网络暂时中断时维持本地任务队列和安全巡检策略。', '机器人本体配置安全避障、升降和悬挂机构，便于根据现场设备布置调整巡检高度，并支持传感器与设备的快速安装、拆卸和维护。'] },
    { subtitle: '实施例三：', paragraphs: ['本发明提供的一种煤矿井下自主巡检机器人系统，包括机器人本体、防爆驱动组件、多传感器检测组件、防爆边缘控制器和通信组件。', '机器人本体可采用轻量化高强度材料构成，车身底板、主动轮组件、被动轮组件及升降机构协同工作，以适应不同巷道高度和复杂路况。', '多传感器检测组件采用模块化设计，视觉、激光雷达、惯性测量和气体检测数据由防爆边缘控制器统一进行质量评估与融合处理，保证复杂工况下的定位稳定性。', '通信组件支持主备链路与加密数据传输；当网络不可用时，机器人进入离线安全巡检或返航模式，并将巡检数据和告警事件存入本地任务队列，待通信恢复后按优先级补传。', '机器人同时配置安全避障、升降和悬挂机构，以支持环境感知、样本抓取、设备维护及后续功能扩展。'] },
  ] },
])
const revealedSectionIds = ref(sections.value.map(section => section.id))
const referencesRevealed = ref(true)
const extracts = ref([
  { label: '改进主体', value: '煤矿井下自主巡检机器人系统' },
  { label: '用途', value: '煤矿巡检与安全监测' },
  { label: '技术背景', value: '现有巡检机器人在弱光、粉尘、高湿和局部通信中断条件下，容易发生视觉定位失效、惯导误差累积、巡检任务中断以及告警信息无法及时上传。' },
  { label: '技术手段', value: '包括机器人本体、防爆驱动组件、多传感器检测组件、防爆边缘控制器和通信组件；通过多传感器质量评分动态调整融合定位权重，并在通信中断时执行本地告警、任务队列缓存、安全巡检和自主返航。' },
  { label: '技术效果', value: '提高复杂井下环境中的定位稳定性和巡检连续性，缩短危险事件响应时间，减少数据丢失，并降低对持续网络连接和人工干预的依赖。' },
  { label: '待补充内容', value: '建议补充质量评分阈值、事件优先级规则、预设安全路线生成方式及关键部件的防爆参数。' },
])
const revealedExtractCount = ref(extracts.value.length)
const visibleExtracts = computed(() => extracts.value.slice(0, revealedExtractCount.value))
const generatingSection = computed(() => sections.value.find(section => section.id === streamingSectionId.value) || null)
const tocItems = [
  { id: 'field', label: '技术领域' },
  { id: 'background', label: '背景技术' },
  { id: 'purpose', label: '发明目的' },
  { id: 'solution', label: '技术方案' },
  { id: 'embodiment', label: '具体实施方式' },
  { id: 'references', label: '引用资料' },
]
const referenceGroups = [
  { title: '专利', items: [
    ['CN119550306A', '一种管带机防爆巡检机器人及其巡检方法'],
    ['CN117301089A', '一种综掘工作面多功能巡检机器人装置及使用方法'],
    ['CN120190817A', '一种主动导航式煤矿采空区埋管巡检机器人及使用方法'],
    ['CN120853282A', '一种针对煤矿井下特殊环境的巡检机器人及使用方法'],
    ['CN218226626U', '煤矿防爆智能越障巡检机器人'],
    ['CN116690608A', '一种基于云服务的防爆巡检机器人巡检系统'],
  ] },
  { title: '论文', items: [
    ['矿业安全与环保', '煤矿井下巡检机器人多传感器融合定位研究'],
    ['煤炭学报', '复杂巷道环境下移动机器人自主导航方法'],
    ['工矿自动化', '面向煤矿安全监测的边缘智能巡检技术综述'],
  ] },
  { title: '政策', items: [
    ['国家矿山安全监察局', '关于进一步加强矿山安全生产工作的意见'],
    ['应急管理部', '煤矿智能化建设指南（2021 年版）'],
    ['国家能源局', '关于加快煤矿智能化发展的指导意见'],
  ] },
  { title: '内部资料', items: [
    ['需求调研纪要', '矿井现场巡检工况与安全需求调研记录'],
    ['方案评审记录', '自主巡检机器人系统技术方案评审意见'],
    ['测试报告', '多传感器融合定位与断网续航测试报告'],
  ] },
]
const activeReferenceTitle = ref('专利')
const numberedReferenceGroups = computed(() => {
  let number = 0
  return referenceGroups.map(group => ({
    ...group,
    items: group.items.map(([source, title]) => ({ number: ++number, source, title })),
  }))
})
const activeReferenceGroup = computed(() => numberedReferenceGroups.value.find(group => group.title === activeReferenceTitle.value) || numberedReferenceGroups.value[0])
const paragraphRefs = {
  '技术领域||0': ['4', '7'],
  '背景技术||0': ['5', '7'],
  '背景技术||1': ['5'],
  '背景技术||2': ['4', '8'],
  '背景技术|背景技术缺点|0': ['4', '5'],
  '背景技术|背景技术缺点|1': ['1', '10'],
  '背景技术|背景技术缺点|2': ['3', '8'],
  '背景技术|背景技术缺点|3': ['11', '12'],
  '背景技术|背景技术缺点|4': ['5', '13'],
  '发明目的|现有问题描述|0': ['4', '7'],
  '发明目的|有益效果描述|1': ['7', '11'],
  '技术方案||0': ['4', '5', '7'],
  '技术方案||4': ['7', '11'],
  '技术方案||5': ['12', '15'],
  '具体实施方式|实施例一：|0': ['4', '5'],
  '具体实施方式|实施例二：|0': ['7', '8'],
  '具体实施方式|实施例三：|0': ['4', '15'],
}
function refsFor(sectionTitle, blockTitle, index) { return paragraphRefs[`${sectionTitle}|${blockTitle || ''}|${index}`] || [] }
function openReference(reference) {
  const group = numberedReferenceGroups.value.find(item => item.items.some(source => source.number === Number(reference)))
  if (!group) return
  activeReferenceTitle.value = group.title
  nextTick(() => goToSection('references'))
}
function setRoute(next, replace = false) { return router[replace ? 'replace' : 'push']('/agent/disclosure/' + next) }
function isSectionVisible(id) { return id === 'references' ? referencesRevealed.value : revealedSectionIds.value.includes(id) }
function waitForGeneration(ms) { return new Promise(resolve => window.setTimeout(resolve, ms)) }
function firstParagraph(section) { return section.paragraphs?.[0] || section.blocks?.[0]?.paragraphs?.[0] || '' }
function scrollDocumentTo(target, behavior = 'smooth') {
  if (!target) return
  const container = findScrollContainer(target) || documentPane.value
  if (!container) return
  const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top
  container.scrollTo({ top: Math.max(0, container.scrollTop + offset - 16), behavior })
}
function bringStreamingBlockIntoView(behavior = 'smooth') {
  scrollDocumentTo(documentPane.value?.querySelector('.disclosure-stream-block'), behavior)
}
async function runGeneration(isRegeneration = false) {
  const runId = ++generationRun
  isGenerating.value = true
  generationProgress.value = 4
  generationMessage.value = isRegeneration ? '正在根据调整内容重组交底书…' : '正在解析输入材料与技术要点…'
  streamingSectionId.value = null
  streamedText.value = ''
  revealedSectionIds.value = []
  referencesRevealed.value = false
  revealedExtractCount.value = 1
  activeToc.value = 'field'
  await nextTick()
  documentPane.value?.scrollTo({ top: 0, behavior: 'auto' })
  await waitForGeneration(520)

  for (let index = 0; index < sections.value.length; index += 1) {
    if (runId !== generationRun) return
    const section = sections.value[index]
    const text = firstParagraph(section)
    streamingSectionId.value = section.id
    streamedText.value = ''
    activeToc.value = section.id
    generationMessage.value = `正在撰写「${section.title}」`
    await nextTick()
    bringStreamingBlockIntoView()

    const chunkSize = Math.max(1, Math.ceil(text.length / 32))
    for (let cursor = chunkSize; cursor < text.length + chunkSize; cursor += chunkSize) {
      if (runId !== generationRun) return
      streamedText.value = text.slice(0, cursor)
      if (cursor % (chunkSize * 6) === 0 || cursor >= text.length) {
        await nextTick()
        bringStreamingBlockIntoView('auto')
      }
      await waitForGeneration(36)
    }

    if (runId !== generationRun) return
    revealedSectionIds.value = [...revealedSectionIds.value, section.id]
    revealedExtractCount.value = Math.min(extracts.value.length, Math.max(1, Math.ceil(((index + 1) / sections.value.length) * extracts.value.length)))
    generationProgress.value = Math.round(((index + 1) / (sections.value.length + 1)) * 100)
    streamingSectionId.value = null
    streamedText.value = ''
    await waitForGeneration(240)
  }

  if (runId !== generationRun) return
  generationMessage.value = '正在整理引用资料并校验正文结构…'
  generationProgress.value = 92
  await waitForGeneration(680)
  if (runId !== generationRun) return
  referencesRevealed.value = true
  revealedExtractCount.value = extracts.value.length
  generationProgress.value = 100
  await nextTick()
  scrollDocumentTo(document.getElementById('disclosure-section-references'))
  await waitForGeneration(650)
  if (runId !== generationRun) return
  isGenerating.value = false
  generationMessage.value = ''
  await nextTick()
  scrollDocumentTo(documentPane.value?.querySelector('.disclosure-document-title-row'))
}
function start() {
  if (!input.value.trim()) return
  stage.value = 'workbench'
  assistantCollapsed.value = false
  regenerateReady.value = false
  activeToc.value = 'field'
  setRoute('scope')
  nextTick(() => runGeneration())
}
function clearInput() { input.value = '' }
function isEditing(key) { return editingBlock.value === key }
function toggleBlockEdit(key) { editingBlock.value = isEditing(key) ? null : key }
function optimizeBlock() { ui.notify('AI 优化功能展示：可对当前内容进行润色、扩写或专业化改写。', 'success') }
function finishAdjusting() { adjusting.value = false; regenerateReady.value = true }
function extractValue(label) { return extracts.value.find(item => item.label === label)?.value.trim() || '' }
function regenerateDocument() {
  const subject = extractValue('改进主体') || '煤矿井下自主巡检机器人系统'
  const purpose = extractValue('用途') || '煤矿巡检与安全监测'
  const background = extractValue('技术背景')
  const method = extractValue('技术手段')
  const effect = extractValue('技术效果')
  sections.value[0].paragraphs[0] = `本发明涉及${purpose}领域，具体涉及一种${subject}。`
  if (background) sections.value[1].paragraphs[0] = background
  sections.value[2].blocks[0].paragraphs[0] = `现有技术中存在${background || '巡检机器人在复杂井下环境下作业稳定性不足'}的问题。因此，本发明提供一种${subject}。`
  sections.value[2].blocks[1].paragraphs[1] = `本发明通过${method || '多传感器协同感知与边缘自主控制'}，${effect || '提高复杂环境下的巡检稳定性和安全性'}。`
  sections.value[3].paragraphs[0] = `本发明提供一种${subject}，${method || '其通过多传感器协同感知、边缘控制和安全通信实现自主巡检'}。`
  sections.value[4].blocks[0].paragraphs[0] = `本实施例提供一种${subject}，${method || '包括机器人本体、多传感器检测组件、边缘控制器和通信组件'}。`
  editingBlock.value = null
  regenerateReady.value = false
  activeToc.value = 'field'
  runGeneration(true)
}
function beginAdjusting() { adjusting.value = true; regenerateReady.value = false }
function findScrollContainer(element) {
  let parent = element.parentElement
  while (parent) {
    const { overflowY } = window.getComputedStyle(parent)
    if (/(auto|scroll|overlay)/.test(overflowY) && parent.scrollHeight > parent.clientHeight) return parent
    parent = parent.parentElement
  }
  return null
}
function goToSection(id) {
  if (isGenerating.value && !isSectionVisible(id)) return
  activeToc.value = id
  nextTick(() => {
    const target = document.getElementById(`disclosure-section-${id}`)
    if (!target) return
    const container = findScrollContainer(target)
    if (container) {
      const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top
      container.scrollTo({ top: container.scrollTop + offset - 16, behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - 16, behavior: 'smooth' })
  })
}
function syncToc() {
  if (isGenerating.value && streamingSectionId.value) {
    activeToc.value = streamingSectionId.value
    return
  }
  const pane = documentPane.value
  if (!pane) return
  const marker = pane.getBoundingClientRect().top + 104
  let current = tocItems[0].id
  for (const item of tocItems) {
    const section = document.getElementById(`disclosure-section-${item.id}`)
    if (section && section.getBoundingClientRect().top <= marker) current = item.id
  }
  if (current === activeToc.value) return
  activeToc.value = current
  nextTick(() => {
    const tocList = tocElement.value?.querySelector('ol')
    const activeButton = tocElement.value?.querySelector(`[data-toc-id="${current}"]`)
    if (!tocList || !activeButton || tocList.scrollWidth <= tocList.clientWidth) return
    tocList.scrollTo({ left: activeButton.offsetLeft - (tocList.clientWidth - activeButton.offsetWidth) / 2, behavior: 'smooth' })
  })
}
function newTask() { generationRun += 1; isGenerating.value = false; stage.value = 'launch'; input.value = ''; editingBlock.value = null; adjusting.value = false; regenerateReady.value = false; setRoute('brief', true) }
function exportDocument() { ui.notify('技术交底书已准备导出；正式环境将生成 Word 文档。', 'success') }
watch(() => route.params.stage, (value) => {
  stage.value = value === 'scope' ? 'workbench' : 'launch'
  if (value === 'scope' && !input.value.trim()) input.value = example
}, { immediate: true })
watch(stage, value => { if (value === 'workbench') nextTick(syncToc) })
onMounted(() => window.addEventListener('scroll', syncToc, true))
onBeforeUnmount(() => { generationRun += 1; window.removeEventListener('scroll', syncToc, true) })
</script>

<template>
  <section class="disclosure-page">
    <main v-if="stage === 'launch'" class="disclosure-launch">
      <section class="disclosure-launch__inner">
        <div class="disclosure-launch__title">
          <ApplicationHeading app="disclosure" />
          <div class="disclosure-help-wrap"><button type="button" class="disclosure-help" :aria-expanded="showGuide" @click="showGuide = !showGuide"><Info :size="17" /><span>说明</span></button><aside v-show="showGuide" class="disclosure-guide"><h2>建议从三个方面描述技术方案</h2><section><b>技术背景</b><p>说明现有技术在实际使用中的问题、局限，以及需要解决的技术问题。</p></section><section><b>技术手段</b><p>说明为解决上述问题采用的结构、部件关系、处理步骤、控制逻辑或关键参数。</p></section><section><b>技术效果</b><p>说明采用技术手段后取得的效果，以及相较现有方案带来的改进。</p></section></aside></div>
        </div>
        <section class="disclosure-composer"><textarea v-model="input" maxlength="5000" placeholder="请输入包含了技术手段的想法或方案，让 AI 来帮助您生成专利交底书吧！（建议输入 200 字以上的内容，支持中文／英文）" aria-label="技术方案描述" @keydown.ctrl.enter.prevent="start" /><footer><button type="button" class="disclosure-clear" :disabled="!input" @click="clearInput">清空内容</button><button type="button" :disabled="!input.trim()" @click="start">开始生成</button></footer></section>
        <section class="disclosure-example"><span>示范输入</span><button type="button" title="带入完整示范内容" @click="input = example"><span>现有煤矿井下巡检机器人在弱光、粉尘和局部通信中断条件下容易出现定位漂移、任务中断和告警延迟……</span></button></section>
      </section>
    </main>

    <main v-else class="disclosure-workbench">
      <header class="disclosure-workbench__top"><h1><ScrollText :size="22" />技术交底书撰写</h1></header>
      <section class="disclosure-work-layout" :class="{ 'assistant-collapsed': assistantCollapsed }">
        <main ref="documentPane" class="disclosure-document" @scroll.passive="syncToc">
          <div class="disclosure-document-shell">
          <nav ref="tocElement" class="disclosure-toc" aria-label="交底书章节导航">
            <header><b>文档导航</b></header>
            <ol><li v-for="item in tocItems" :key="item.id"><button type="button" :data-toc-id="item.id" :disabled="isGenerating && !isSectionVisible(item.id)" :class="{ active: activeToc === item.id }" @click.stop="goToSection(item.id)"><span>{{ item.label }}</span></button></li></ol>
          </nav>
          <article>
            <header class="disclosure-document-title-row"><h2>一种煤矿井下自主巡检机器人系统</h2><div class="disclosure-document-title-row__actions"><span v-if="isGenerating" class="disclosure-generation-progress"><i></i>正在生成 {{ generationProgress }}%</span><button type="button" :disabled="isGenerating" @click="exportDocument"><Download :size="16" />导出</button></div></header>
            <template v-for="section in sections" :key="section.title">
              <section v-if="isSectionVisible(section.id) && section.paragraphs?.length" :id="`disclosure-section-${section.id}`" class="disclosure-edit-block" :class="{ 'is-editing': isEditing(section.title), 'is-generated': isGenerating }">
                <div class="disclosure-block-actions"><button type="button" @click="optimizeBlock"><Sparkles :size="14" />AI 优化</button><button type="button" @click="toggleBlockEdit(section.title)"><Check v-if="isEditing(section.title)" :size="14" /><Pencil v-else :size="14" />{{ isEditing(section.title) ? '完成' : '编辑' }}</button></div>
                <div class="disclosure-block-content"><h3>{{ section.title }}</h3><h4 v-if="section.subtitle">{{ section.subtitle }}</h4><template v-for="(_, index) in section.paragraphs" :key="`${section.title}-paragraph-${index}`"><textarea v-if="isEditing(section.title)" v-model="section.paragraphs[index]" /><p v-else>{{ section.paragraphs[index] }}<button v-for="reference in refsFor(section.title, '', index)" :key="reference" type="button" class="disclosure-ref" :title="`查看引用资料 [${reference}]`" @click="openReference(reference)">[{{ reference }}]</button></p></template></div>
              </section>
              <section v-for="(block, blockIndex) in section.blocks || []" v-if="isSectionVisible(section.id)" :id="blockIndex === 0 ? `disclosure-section-${section.id}` : undefined" :key="`${section.title}-${block.subtitle}`" class="disclosure-edit-block" :class="{ 'is-editing': isEditing(`${section.title}-${block.subtitle}`), 'is-generated': isGenerating }">
                <div class="disclosure-block-actions"><button type="button" @click="optimizeBlock"><Sparkles :size="14" />AI 优化</button><button type="button" @click="toggleBlockEdit(`${section.title}-${block.subtitle}`)"><Check v-if="isEditing(`${section.title}-${block.subtitle}`)" :size="14" /><Pencil v-else :size="14" />{{ isEditing(`${section.title}-${block.subtitle}`) ? '完成' : '编辑' }}</button></div>
                <div class="disclosure-block-content"><h4>{{ block.subtitle }}</h4><template v-for="(_, index) in block.paragraphs" :key="index"><textarea v-if="isEditing(`${section.title}-${block.subtitle}`)" v-model="block.paragraphs[index]" /><p v-else>{{ block.paragraphs[index] }}<button v-for="reference in refsFor(section.title, block.subtitle, index)" :key="reference" type="button" class="disclosure-ref" :title="`查看引用资料 [${reference}]`" @click="openReference(reference)">[{{ reference }}]</button></p></template></div>
              </section>
            </template>
            <section v-if="isGenerating && generatingSection" class="disclosure-stream-block" aria-live="polite"><div class="disclosure-stream-block__meta"><span><i></i>AI 正在撰写</span><b>{{ generationMessage }}</b></div><h3>{{ generatingSection.title }}</h3><p>{{ streamedText }}<em class="disclosure-stream-cursor"></em></p></section>
            <section v-if="referencesRevealed" id="disclosure-section-references" class="disclosure-references" :class="{ 'is-generated': isGenerating }"><header><h3>引用资料</h3><span>15 项参考资料</span></header><nav class="disclosure-reference-tabs" aria-label="资料分类"><button v-for="group in referenceGroups" :key="group.title" type="button" :class="{ active: activeReferenceTitle === group.title }" @click="activeReferenceTitle = group.title"><FileText :size="15" /><span>{{ group.title }}</span><b>{{ group.items.length }}</b></button></nav><section class="disclosure-reference-list" :key="activeReferenceGroup.title"><article v-for="item in activeReferenceGroup.items" :key="item.number"><span class="disclosure-reference-number">[{{ item.number }}]</span><b>{{ item.source }}</b><p>{{ item.title }}</p></article></section></section>
          </article>
          </div>
        </main>
        <aside class="disclosure-assistant">
          <header><div><i>AI</i><h2>AI 助手</h2></div><button type="button" @click="assistantCollapsed = true"><PanelRightClose :size="17" />折叠</button></header>
          <div class="disclosure-assistant__scroll"><section class="disclosure-extract-card" :class="{ adjusting, 'is-generating': isGenerating }"><header><div><h3>重点内容提取</h3><p>{{ isGenerating ? '正在识别技术主题、技术手段与预期效果。' : '调整关键信息后，可重新组织正文。' }}</p></div><span v-if="isGenerating" class="disclosure-assistant-generation"><i></i>提取中</span><button v-else-if="!adjusting" type="button" @click="beginAdjusting"><Pencil :size="15" />调整内容</button><button v-else type="button" @click="finishAdjusting"><Check :size="15" />完成调整</button></header><dl><template v-for="item in visibleExtracts" :key="item.label"><dt>{{ item.label }}</dt><dd><textarea v-if="adjusting" v-model="item.value" /><span v-else>{{ item.value }}</span></dd></template><template v-if="isGenerating"><div v-for="index in extracts.length - visibleExtracts.length" :key="`extract-skeleton-${index}`" class="disclosure-extract-skeleton"><i></i><b></b></div></template></dl><button v-if="regenerateReady && !adjusting && !isGenerating" type="button" class="disclosure-regenerate" @click="regenerateDocument"><RefreshCw :size="16" />重新生成左栏正文</button><footer v-if="isGenerating"><Lightbulb :size="17" /><span>{{ generationMessage }}</span></footer><footer v-else-if="adjusting"><Lightbulb :size="17" /><span>完成调整后，将以这里的内容重新组织左栏正文。</span></footer></section></div>
        </aside>
        <button class="assistant-restore" type="button" title="展开 AI 助手" @click="assistantCollapsed = false"><PanelRightOpen :size="19" /></button>
      </section>
    </main>
  </section>
</template>

<style scoped>
.disclosure-page{min-height:100vh;color:#223746;background:#fff}.disclosure-page button{font:inherit}.disclosure-launch{min-height:100vh;display:grid;place-items:center;padding:42px 24px 100px;background:radial-gradient(ellipse at 50% 40%,#e5f2fb 0%,#f7fafc 48%,#f7fafc 100%)}.disclosure-launch__inner{width:min(920px,100%);margin:-3vh auto 0}.disclosure-launch__title{display:flex;align-items:center;gap:13px;margin:0 0 23px}.disclosure-launch__title>i{width:46px;height:46px;display:grid;place-items:center;color:#1476b5;border-radius:14px;background:linear-gradient(145deg,#dff4f6,#e8f2fb);font-style:normal}.disclosure-launch__title h1{margin:0;color:#163957;font-size:30px;letter-spacing:-.03em}.disclosure-help-wrap{position:relative;margin-left:auto}.disclosure-help{display:flex;align-items:center;gap:7px;border:0;background:transparent;color:#627b90;cursor:pointer}.disclosure-help:hover{color:#126ca9}.disclosure-guide{position:absolute;z-index:20;top:36px;right:0;width:min(610px,calc(100vw - 100px));border:1px solid #d3e2eb;border-radius:13px;padding:18px 20px;background:#fff;box-shadow:0 18px 44px #274b6829}.disclosure-guide:before{position:absolute;top:-7px;right:28px;width:12px;height:12px;border-top:1px solid #d3e2eb;border-left:1px solid #d3e2eb;background:#fff;content:'';transform:rotate(45deg)}.disclosure-guide h2{margin:0 0 13px;color:#254a64;font-size:16px}.disclosure-guide section{position:relative;margin-top:9px;border-radius:9px;background:#f7fafc;padding:10px 12px 10px 108px}.disclosure-guide section b{position:absolute;top:10px;left:12px;width:78px;border-radius:15px;padding:4px 0;color:#fff;background:#39a12e;font-size:13px;text-align:center}.disclosure-guide section:nth-of-type(2) b{background:#087bec}.disclosure-guide section:nth-of-type(3) b{background:#e17a00}.disclosure-guide p{margin:0;color:#49677d;font-size:13px;line-height:1.65}
.disclosure-composer{overflow:hidden;border:1px solid #cbdce8;border-radius:14px;background:#fff;box-shadow:0 15px 38px #315f8520}.disclosure-composer:focus-within{border-color:#5da8d0;box-shadow:0 16px 40px #1975b723}.disclosure-composer textarea{box-sizing:border-box;display:block;width:100%;height:300px;resize:vertical;border:0;outline:0;padding:23px 24px 10px;color:#284b65;font:16px/1.75 "Microsoft YaHei",sans-serif}.disclosure-composer textarea::placeholder{color:#9aaab9}.disclosure-composer footer{display:flex;justify-content:space-between;align-items:center;padding:11px 17px 17px}.disclosure-composer footer span{color:#899dab;font-size:14px}.disclosure-composer footer button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:112px;border:0;border-radius:9px;padding:10px 18px;color:#fff;background:linear-gradient(135deg,#1877b7,#1baec1);box-shadow:0 5px 13px #1687b12c;font-size:15px;font-weight:800;cursor:pointer}.disclosure-composer footer button:disabled{color:#eef7fc;background:#b8d5e7;cursor:not-allowed;box-shadow:none}.disclosure-example{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;align-items:center;margin:17px 3px 0;color:#7890a1}.disclosure-example>span{font-size:13px}.disclosure-example button{display:flex;min-width:0;align-items:center;border:0;border-radius:8px;padding:9px 12px;color:#24698f;background:#e9f3f9;text-align:left;cursor:pointer}.disclosure-example button:hover{color:#0f6faa;background:#dceef7}.disclosure-example button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.disclosure-example button b{margin-left:9px;color:#1678b8;font-size:15px}
.disclosure-workbench{height:100vh;overflow:hidden;background:#fff}.disclosure-workbench__top{box-sizing:border-box;height:78px;display:flex;justify-content:space-between;align-items:center;gap:18px;border-bottom:1px solid #dce6ed;padding:14px 28px}.disclosure-workbench__top h1{display:flex;align-items:center;gap:9px;margin:0;color:#142f44;font-size:23px}.disclosure-workbench__top h1 svg{color:#1476b5}.disclosure-workbench__top nav{display:flex;gap:8px}.disclosure-workbench__top nav button{display:flex;align-items:center;gap:7px;border:1px solid transparent;border-radius:8px;padding:9px 11px;color:#35556e;background:transparent;font-size:13px;cursor:pointer}.disclosure-workbench__top nav button:hover{border-color:#cce0eb;color:#126da9;background:#f1f8fb}.disclosure-work-layout{position:relative;height:calc(100vh - 78px);display:grid;grid-template-columns:minmax(0,1fr) minmax(310px,34%);min-width:0;transition:grid-template-columns .2s ease}.disclosure-document{min-width:0;overflow:auto;background:#fff}.disclosure-document>article{box-sizing:border-box;max-width:900px;min-height:100%;margin:0 auto;padding:40px 48px 90px;color:#223746}.disclosure-document__head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:50px;padding-bottom:22px;border-bottom:1px solid #e3ebf0}.disclosure-document__head span{color:#1778ba;font-size:11px;font-weight:800;letter-spacing:.08em}.disclosure-document__head h2{margin:7px 0 0;color:#102c42;font-size:28px;letter-spacing:-.03em;line-height:1.4}.disclosure-document__head p{max-width:540px;margin:8px 0 0;color:#7b91a0;font-size:13px;line-height:1.7}.disclosure-document__head button{display:inline-flex;flex:0 0 auto;align-items:center;gap:5px;border:1px solid #d3e2eb;border-radius:7px;padding:8px 10px;color:#45637a;background:#fff;font-size:12px;cursor:pointer}.disclosure-document__head button.active{border-color:#53a7cf;color:#0d73ad;background:#eaf6fb}.disclosure-edit-block{margin:0 -15px 38px;border:1px solid transparent;border-radius:12px;padding:14px 15px 1px;transition:.16s ease}.disclosure-edit-block:hover{border-color:#dce8ee;background:#fbfdfe}.disclosure-document h3{margin:0 0 17px;color:#163e5c;font-size:23px}.disclosure-document h4{margin:27px 0 10px;color:#244961;font-size:17px}.disclosure-document p{margin:0 0 16px;color:#354f62;font-size:15px;line-height:1.95;text-align:justify}.disclosure-document textarea{box-sizing:border-box;width:100%;min-height:100px;margin:0 0 16px;resize:vertical;border:1px solid #c8dce7;border-radius:8px;padding:11px;color:#354f62;background:#fff;font:15px/1.85 "Microsoft YaHei",sans-serif;outline:0}.disclosure-document textarea:focus{border-color:#55a9d0;box-shadow:0 0 0 3px #e3f3f9}.disclosure-references{margin-top:12px;border-top:1px solid #e6edf1;padding-top:35px}.disclosure-references>div{display:grid;gap:25px}.disclosure-citation{display:grid;grid-template-columns:36px minmax(0,1fr);align-items:start}.disclosure-citation>span{color:#536b82;font-size:16px}.disclosure-citation h4{margin:0 0 8px;color:#162d40;font-size:16px;font-weight:600}.disclosure-citation p{display:flex;align-items:center;gap:8px;margin:0;color:#637b8d;font-size:13px;line-height:1.55;text-align:left}.disclosure-citation p i{width:20px;height:20px;display:grid;place-items:center;color:#1383b5;border-radius:6px;background:#eaf4f8}
.disclosure-assistant{min-width:0;overflow:hidden;border-left:1px solid #dbe5eb;background:#f8fbfd;transition:opacity .18s ease}.disclosure-assistant>header{height:62px;display:flex;justify-content:space-between;align-items:center;padding:0 21px;border-bottom:1px solid #dde8ee;background:#fff}.disclosure-assistant>header>div{display:flex;align-items:center;gap:9px}.disclosure-assistant>header i{width:29px;height:29px;display:grid;place-items:center;border-radius:10px;color:#fff;background:linear-gradient(135deg,#18bfc2,#1677df);font:800 11px Arial;font-style:normal}.disclosure-assistant h2{margin:0;color:#15364f;font-size:19px}.disclosure-assistant>header button{display:flex;align-items:center;gap:4px;border:0;color:#45637a;background:transparent;font-size:12px;cursor:pointer}.disclosure-assistant__scroll{height:calc(100% - 62px);overflow:auto;padding:22px 18px 50px}.disclosure-extract-card{border:1px solid #d7e4eb;border-radius:14px;padding:18px;background:linear-gradient(145deg,#fff,#f4fbfe);box-shadow:0 9px 24px #234f6d0c}.disclosure-extract-card.adjusting{border-color:#58a8cf;box-shadow:0 0 0 3px #dff1f8}.disclosure-extract-card>header{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:18px}.disclosure-extract-card header span{color:#1682b6;font-size:10px;font-weight:800;letter-spacing:.1em}.disclosure-extract-card h3{margin:4px 0 0;color:#163a55;font-size:18px}.disclosure-extract-card header button{display:inline-flex;align-items:center;gap:4px;border:0;color:#1375b9;background:transparent;font-size:12px;cursor:pointer}.disclosure-extract-card dl{margin:0}.disclosure-extract-card dt{margin:17px 0 6px;color:#8295a3;font-size:12px}.disclosure-extract-card dd{margin:0;border-radius:7px;padding:7px 8px;color:#345267;background:#f1f5f7;font-size:13px;line-height:1.65}.disclosure-extract-card dd textarea{box-sizing:border-box;width:100%;min-height:78px;resize:vertical;border:1px solid #c4d9e4;border-radius:6px;padding:7px;color:#345267;background:#fff;font:13px/1.65 "Microsoft YaHei",sans-serif;outline:0}.disclosure-extract-card footer{display:flex;gap:8px;margin-top:16px;border-top:1px solid #dce9ef;padding-top:12px;color:#638096;font-size:11px;line-height:1.6}.disclosure-extract-card footer svg{flex:0 0 auto;color:#1477b7}.disclosure-assistant__notice{display:grid;grid-template-columns:21px minmax(0,1fr);gap:10px;margin-top:15px;border:1px solid #dce8ee;border-radius:11px;padding:13px;background:#fff}.disclosure-assistant__notice svg{color:#1b87bb}.disclosure-assistant__notice b{color:#36566d;font-size:13px}.disclosure-assistant__notice p{margin:5px 0 0;color:#7c91a1;font-size:12px;line-height:1.65}.assistant-restore{display:none;position:absolute;z-index:5;top:15px;right:15px;width:42px;height:42px;border:0;border-radius:12px;color:#fff;background:linear-gradient(135deg,#16afb9,#1678d4);box-shadow:0 8px 18px #176da832;cursor:pointer}.assistant-collapsed{grid-template-columns:minmax(0,1fr) 0}.assistant-collapsed .disclosure-assistant{opacity:0;pointer-events:none}.assistant-collapsed .assistant-restore{display:grid;place-items:center}
@media(max-width:980px){.disclosure-work-layout{grid-template-columns:minmax(0,1fr) minmax(280px,42%)}.disclosure-document>article{padding:34px 30px 70px}.disclosure-document__head h2{font-size:25px}.disclosure-document p{font-size:14px}}@media(max-width:900px){.disclosure-launch{padding:28px 16px 70px}.disclosure-launch__inner{margin:0}.disclosure-launch__title h1{font-size:25px}.disclosure-help span{display:none}.disclosure-guide{right:-4px;width:calc(100vw - 96px);padding:14px}.disclosure-guide section{padding:44px 11px 10px}.disclosure-guide section b{top:9px;left:11px}.disclosure-composer textarea{height:240px;padding:18px;font-size:14px}.disclosure-example{grid-template-columns:1fr;gap:5px}.disclosure-workbench{height:auto;min-height:100vh;overflow:visible}.disclosure-workbench__top{height:auto;min-height:68px;padding:12px 16px}.disclosure-workbench__top h1{font-size:18px}.disclosure-workbench__top nav button{padding:7px;font-size:0}.disclosure-workbench__top nav button svg{width:18px;height:18px}.disclosure-work-layout{height:auto;min-height:calc(100vh - 68px);grid-template-columns:1fr}.disclosure-assistant{order:-1;border-right:0;border-bottom:1px solid #dbe5eb;border-left:0}.disclosure-assistant__scroll{height:auto;max-height:430px}.assistant-collapsed{grid-template-columns:1fr}.assistant-collapsed .disclosure-assistant{display:none}.disclosure-document{overflow:visible}.disclosure-document>article{padding:28px 19px 60px}.disclosure-document__head{margin-bottom:32px}.disclosure-document__head h2{font-size:22px}.disclosure-document__head p{font-size:12px}.disclosure-document h3{font-size:20px}.disclosure-document p{font-size:14px}.disclosure-edit-block{margin-right:-8px;margin-left:-8px;padding-right:8px;padding-left:8px}.disclosure-citation{grid-template-columns:28px minmax(0,1fr)}.disclosure-citation>span{font-size:14px}.disclosure-citation h4{font-size:14px}.assistant-restore{position:fixed;top:auto;right:16px;bottom:16px}}
.disclosure-ref{display:inline-grid;place-items:center;min-width:18px;height:18px;margin-left:5px;border-radius:5px;background:#eaf4f8;color:#1376a9;font-size:11px;font-weight:800;line-height:1.1;text-align:center;vertical-align:2px}.disclosure-composer footer .disclosure-clear{min-width:0;padding:10px 6px;color:#5f839a;background:transparent;box-shadow:none;font-weight:600}.disclosure-composer footer .disclosure-clear:hover:not(:disabled){color:#126fa9;background:#eef7fb}.disclosure-composer footer .disclosure-clear:disabled{color:#a3b5c0;background:transparent;box-shadow:none;cursor:default}.disclosure-example>span,.disclosure-example button span{font-size:15px}
.disclosure-document>article>h2{margin:0 0 54px;border-left:5px solid #1778ba;padding-left:17px;color:#102c42;font-size:27px;line-height:1.4}.disclosure-edit-block{position:relative;margin:0 -15px 22px;padding:14px 15px 1px;border:1px solid transparent;border-radius:12px;transition:border-color .16s,background .16s,box-shadow .16s}.disclosure-edit-block:hover{border-color:#dce8ee;background:#fbfdfe}.disclosure-block-actions{visibility:hidden;opacity:0;position:absolute;z-index:5;top:10px;right:11px;display:flex;gap:6px;padding:3px;border:1px solid #d9e5eb;border-radius:9px;background:#fff;box-shadow:0 7px 18px #173d5817;transform:translateY(-3px);transition:opacity .15s,transform .15s,visibility .15s}.disclosure-edit-block:hover>.disclosure-block-actions,.disclosure-edit-block:focus-within>.disclosure-block-actions,.disclosure-edit-block.is-editing>.disclosure-block-actions{visibility:visible;opacity:1;transform:none}.disclosure-block-actions button{display:flex;align-items:center;gap:5px;border:0;border-radius:6px;padding:6px 8px;color:#48677b;background:transparent;font:12px "Microsoft YaHei",sans-serif;cursor:pointer}.disclosure-block-actions button:hover{color:#0d73ad;background:#eaf5fa}.disclosure-block-actions button:first-child{color:#137bb7}.disclosure-block-content{border-radius:8px;outline:none}.disclosure-edit-block.is-editing{border-color:#61add0;background:#fff;box-shadow:0 0 0 3px #e3f3f9}.disclosure-edit-block.is-editing .disclosure-block-content{padding-top:32px}.disclosure-edit-block>.disclosure-block-content>h3,.disclosure-edit-block>.disclosure-block-content>h4{padding-right:154px}.disclosure-edit-block.is-editing textarea{display:block}

/* 工作台正文目录与资料区 */
.disclosure-document-shell{box-sizing:border-box;display:grid;grid-template-columns:164px minmax(0,830px);justify-content:center;align-items:start;gap:38px;min-height:100%;padding:40px 28px 90px}.disclosure-document-shell>.disclosure-toc{position:sticky;top:28px;padding:6px 0 10px}.disclosure-toc>header{display:grid;gap:5px;margin:0 0 17px;padding:0 0 13px;border-bottom:1px solid #dfeaf0}.disclosure-toc>header span{color:#7b9aab;font:800 9px/1.1 Arial,sans-serif;letter-spacing:.11em}.disclosure-toc>header b{color:#22495f;font-size:15px;letter-spacing:.02em}.disclosure-toc ol{position:relative;display:grid;gap:1px;margin:0;padding:0 0 0 13px;border-left:1px solid #d8e7ee;list-style:none}.disclosure-toc li{position:relative}.disclosure-toc button{position:relative;display:flex;align-items:center;gap:9px;width:100%;border:0;border-radius:0 7px 7px 0;padding:9px 8px 9px 5px;color:#5d7c8e;background:transparent;font:13px "Microsoft YaHei",sans-serif;text-align:left;cursor:pointer;transition:color .16s ease,background .16s ease}.disclosure-toc button em{min-width:17px;color:#9fb5c1;font:700 9px/1 Arial,sans-serif;font-style:normal}.disclosure-toc button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.disclosure-toc button:before{position:absolute;top:50%;left:-15px;width:4px;height:4px;border-radius:50%;background:#c3d8e2;content:'';transform:translateY(-50%);transition:.16s ease}.disclosure-toc button:hover{color:#166f9e;background:#f2f8fa}.disclosure-toc button.active{color:#0c6ea8;background:linear-gradient(90deg,#e2f3f8,#f6fbfc);font-weight:800}.disclosure-toc button.active:before{width:3px;height:22px;border-radius:0 3px 3px 0;background:#1687bd;box-shadow:0 0 0 3px #d9f0f6}.disclosure-toc button.active em{color:#1681b4}.disclosure-document-shell>article{box-sizing:border-box;width:100%;max-width:830px;min-height:100%;margin:0;padding:0;color:#223746}.disclosure-document-shell>article>h2{margin:0 0 54px;border-left:5px solid #1778ba;padding-left:17px;color:#102c42;font-size:27px;line-height:1.4}.disclosure-references{margin-top:38px;padding-top:30px}.disclosure-references>header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.disclosure-references>header h3{margin:0}.disclosure-references>header>span{color:#7d94a3;font-size:12px}.disclosure-references>.disclosure-reference-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.disclosure-reference-group{overflow:hidden;border:1px solid #dce8ee;border-radius:11px;background:#fff}.disclosure-reference-group>header{display:flex;justify-content:space-between;align-items:center;padding:10px 11px;border-bottom:1px solid #e6eef2;background:#f5fafc}.disclosure-reference-group>header span{display:flex;align-items:center;gap:5px;color:#1b5b7e;font-size:13px;font-weight:800}.disclosure-reference-group>header svg{color:#1582b8}.disclosure-reference-group>header b{min-width:18px;border-radius:10px;padding:2px 5px;color:#2c718f;background:#dceef6;font-size:10px;text-align:center}.disclosure-reference-group article{padding:9px 11px;border-bottom:1px solid #edf2f5}.disclosure-reference-group article:last-child{border-bottom:0}.disclosure-reference-group article>b{display:block;color:#26749c;font:700 11px/1.35 Arial,sans-serif}.disclosure-reference-group article p{display:-webkit-box;overflow:hidden;margin:4px 0 0;color:#536f80;font-size:12px;line-height:1.5;text-align:left;-webkit-box-orient:vertical;-webkit-line-clamp:2}.disclosure-extract-card>header{align-items:flex-start;margin-bottom:17px}.disclosure-extract-card h3{margin:0;color:#163a55;font-size:19px}.disclosure-extract-card>header p{margin:5px 0 0;color:#7892a1;font-size:12px;line-height:1.5}.disclosure-extract-card header button{flex:0 0 auto;border:1px solid #cfe3ec;border-radius:7px;padding:6px 8px;background:#fff;font-weight:700}.disclosure-extract-card header button:hover{border-color:#69b4d4;background:#ecf7fb}.disclosure-extract-card dl{display:grid;gap:12px}.disclosure-extract-card dt{margin:0 0 5px;padding-left:0;color:#285a76;font-size:14px;font-weight:800;letter-spacing:.01em}.disclosure-extract-card dt:before{display:none}.disclosure-extract-card dd{border:1px solid #e2ebef;border-radius:8px;padding:9px 10px;color:#294f67;background:#f3f7f9;font-size:14px;line-height:1.65}.disclosure-extract-card dd textarea{min-height:84px;border-color:#bbd7e4;font-size:14px}.disclosure-regenerate{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;margin-top:17px;border:0;border-radius:9px;padding:10px 12px;color:#fff;background:linear-gradient(135deg,#167bbc,#1bb3bd);box-shadow:0 6px 15px #167eb32b;font:800 14px "Microsoft YaHei",sans-serif;cursor:pointer}.disclosure-regenerate:hover{filter:brightness(1.04);transform:translateY(-1px)}.disclosure-extract-card footer{font-size:12px}
@media(max-width:1480px){.disclosure-document-shell{grid-template-columns:146px minmax(0,1fr);gap:22px;padding:32px 24px 80px}.disclosure-document-shell>article{max-width:none}}@media(max-width:1280px){.disclosure-document-shell{grid-template-columns:118px minmax(0,1fr);gap:16px;padding:30px 20px 72px}.disclosure-document-shell>.disclosure-toc{display:block}.disclosure-toc>header{margin-bottom:13px;padding-bottom:10px}.disclosure-toc>header b{font-size:14px}.disclosure-toc button{gap:6px;padding-top:8px;padding-bottom:8px;font-size:13px}.disclosure-toc button em{min-width:14px;font-size:8px}.disclosure-document-shell>article{max-width:none;margin:0;padding:0}}@media(max-width:980px){.disclosure-document-shell{padding:28px 18px 65px}.disclosure-references>.disclosure-reference-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:720px){.disclosure-document-shell{display:block;padding:0 19px 60px}.disclosure-document-shell>.disclosure-toc{position:sticky;z-index:8;top:0;margin:0 -19px 26px;padding:12px 19px 10px;border-bottom:1px solid #dce9ef;background:#fffffff0;backdrop-filter:blur(12px)}.disclosure-toc>header{display:flex;align-items:center;margin:0 0 9px;padding:0;border:0}.disclosure-toc>header b{font-size:13px}.disclosure-toc ol{display:flex;gap:7px;overflow-x:auto;margin:0 -3px;padding:0 3px 2px;border:0;scrollbar-width:none}.disclosure-toc ol::-webkit-scrollbar{display:none}.disclosure-toc li{flex:0 0 auto}.disclosure-toc button{border:1px solid #dce8ee;border-radius:999px;padding:7px 11px;color:#547287;background:#fff;font-size:13px}.disclosure-toc button:before{display:none}.disclosure-toc button em{display:none}.disclosure-toc button.active{border-color:#a7d8e8;color:#0b72ad;background:#e2f4fa}.disclosure-document>article>h2,.disclosure-document-shell>article>h2{margin-bottom:38px;font-size:22px}.disclosure-edit-block{margin-right:-8px;margin-left:-8px;padding-right:8px;padding-left:8px}.disclosure-block-actions{top:7px;right:7px}.disclosure-block-actions button{padding:5px 7px;font-size:11px}.disclosure-edit-block>.disclosure-block-content>h3,.disclosure-edit-block>.disclosure-block-content>h4{padding-right:130px}.disclosure-references>.disclosure-reference-grid{grid-template-columns:1fr}}
/* 输出阅读字号：保留原正文标题规格，提升正文与辅助信息的阅读舒适度。 */
.disclosure-document h3{margin-bottom:18px;font-size:25px}.disclosure-document h4{margin-top:28px;margin-bottom:11px;font-size:18px}.disclosure-document p{margin-bottom:18px;font-size:16px}.disclosure-document textarea{margin-bottom:18px;font-size:16px}.disclosure-toc button{font-size:14px}.disclosure-reference-group>header span{font-size:14px}.disclosure-reference-group article>b{font-size:12px}.disclosure-reference-group article p{font-size:13px}.disclosure-extract-card h3{font-size:20px}.disclosure-extract-card>header p{font-size:13px}.disclosure-extract-card header button{font-size:13px}.disclosure-extract-card dt{font-size:15px}.disclosure-extract-card dd,.disclosure-extract-card dd textarea{font-size:15px}.disclosure-extract-card footer{font-size:13px}
@media(max-width:900px){.disclosure-document h3{font-size:22px}.disclosure-document h4{font-size:17px}.disclosure-document p,.disclosure-document textarea{font-size:15px}}

/* 导航采用紧凑卡片，避免窄列中仅剩时间线装饰。 */
.disclosure-document-shell>.disclosure-toc{box-sizing:border-box;border:1px solid #d9e7ee;border-radius:13px;padding:12px 9px 9px;background:linear-gradient(145deg,#fff,#f4fafc);box-shadow:0 9px 25px #2b5d7410}.disclosure-toc>header{display:flex;align-items:center;justify-content:space-between;gap:6px;margin:0 3px 8px;padding:1px 4px 10px;border-bottom:1px solid #e1ebf0}.disclosure-toc>header b{color:#244c63;font-size:14px}.disclosure-toc>header span{color:#7d9bab;font:12px/1 "Microsoft YaHei",sans-serif;letter-spacing:0}.disclosure-toc ol{display:grid;gap:3px;margin:0;padding:0;border:0}.disclosure-toc button{display:flex;justify-content:space-between;gap:0;border:1px solid transparent;border-radius:8px;padding:8px 9px;color:#5c788a;background:transparent;font-size:13px}.disclosure-toc button:before,.disclosure-toc button.active:before{display:none}.disclosure-toc button:hover{border-color:#d7e8ef;color:#126f9f;background:#eff8fb}.disclosure-toc button.active{border-color:#cfe8f1;color:#0872ae;background:linear-gradient(90deg,#dff2f8,#f1fafc);box-shadow:inset 3px 0 0 #198ac0;font-weight:800}.disclosure-toc button.active:after{width:5px;height:5px;margin-left:auto;border-radius:50%;background:#17a0bd;content:''}
@media(max-width:1280px) and (min-width:721px){.disclosure-document-shell{grid-template-columns:146px minmax(0,1fr);gap:18px;padding:30px 18px 72px}.disclosure-toc>header{display:flex}.disclosure-toc button{font-size:13px}}
@media(max-width:720px){.disclosure-document-shell>.disclosure-toc{margin:0 -19px 24px;border-right:0;border-left:0;border-radius:0;padding:10px 19px 9px;background:#fffffff5;box-shadow:0 5px 14px #244d6010}.disclosure-toc>header{display:flex;margin:0 0 8px;padding:0;border:0}.disclosure-toc>header b{font-size:13px}.disclosure-toc ol{display:flex;gap:7px;overflow-x:auto;margin:0 -3px;padding:0 3px 2px}.disclosure-toc li{flex:0 0 auto}.disclosure-toc button{border-color:#dce8ee;border-radius:999px;padding:7px 11px;font-size:13px}.disclosure-toc button.active{box-shadow:none}.disclosure-toc button.active:after{display:none}}
.disclosure-toc ol:before{display:none}
/* 无边框吸顶导航：目录作为正文的辅助层，而非独立卡片。 */
.disclosure-document-shell>.disclosure-toc{top:20px;border:0;border-radius:0;padding:4px 0;background:transparent;box-shadow:none}.disclosure-toc>header{margin:0 0 7px;padding:0 8px 5px;border:0}.disclosure-toc ol{gap:2px}.disclosure-toc button{border:0;padding:8px 10px}.disclosure-toc button:hover{border:0;background:#eff8fb}.disclosure-toc button.active{border:0;background:linear-gradient(90deg,#dff2f8,#f7fbfc);box-shadow:inset 3px 0 0 #198ac0}.disclosure-toc button.active:after{display:none}
@media(max-width:720px){.disclosure-document-shell>.disclosure-toc{top:0;margin-bottom:20px;border:0;border-radius:0;padding:10px 19px 9px;background:#fffffff5;box-shadow:0 5px 14px #244d6010}.disclosure-toc button{border:0;background:#f3f8fa}.disclosure-toc button.active{border:0;background:#e0f3f9;box-shadow:inset 0 -2px 0 #198ac0}}

/* 正文与导航贴齐工作台表头，不再保留大段顶部空白。 */
.disclosure-document-shell{grid-template-columns:144px minmax(0,830px);gap:30px;padding-top:0}.disclosure-document-shell>.disclosure-toc{top:0}.disclosure-toc>header{justify-content:flex-start}.disclosure-toc>header b{font-size:15px}.disclosure-toc button{padding-right:8px;padding-left:8px;font-size:15px}@media(max-width:1480px){.disclosure-document-shell{grid-template-columns:136px minmax(0,1fr);gap:18px;padding-top:0}}@media(max-width:1280px){.disclosure-document-shell{grid-template-columns:128px minmax(0,1fr);gap:14px;padding-top:0}.disclosure-toc button{font-size:15px}}@media(max-width:980px){.disclosure-document-shell{padding-top:0}}@media(min-width:901px){.disclosure-assistant>header{height:54px;padding:0 18px}.disclosure-assistant__scroll{height:calc(100% - 54px);padding-top:16px}}
.disclosure-document-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin:0 0 54px}.disclosure-document-title-row h2{margin:0;border-left:5px solid #1778ba;padding-left:17px;color:#102c42;font-size:27px;line-height:1.4}.disclosure-document-title-row button{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;border:1px solid #d2e3eb;border-radius:8px;margin-top:3px;padding:8px 10px;color:#176f9f;background:#fff;font:700 13px "Microsoft YaHei",sans-serif;cursor:pointer;transition:.16s ease}.disclosure-document-title-row button:hover{border-color:#71b8d6;color:#0b6eaa;background:#eff8fb;box-shadow:0 5px 12px #24627a12}@media(max-width:720px){.disclosure-document-title-row{gap:10px;margin-bottom:38px}.disclosure-document-title-row h2{font-size:22px}.disclosure-document-title-row button{padding:7px 8px;font-size:12px}}
/* 启动页标题区下移，缩短与输入框之间的视觉距离。 */
.disclosure-launch__inner{margin:0 auto}
.disclosure-launch__title{transform:translateY(18px)}
@media(max-width:900px){.disclosure-launch__title{transform:translateY(10px)}}
/* 引用资料按类别切换展示。 */
.disclosure-reference-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:0 0 15px}.disclosure-reference-tabs button{display:flex;align-items:center;justify-content:center;gap:6px;min-width:0;border:1px solid #d7e7ee;border-radius:9px;padding:9px 10px;color:#5a7789;background:#fff;font:700 14px "Microsoft YaHei",sans-serif;cursor:pointer;transition:.16s ease}.disclosure-reference-tabs button svg{flex:0 0 auto;color:#1a88bd}.disclosure-reference-tabs button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.disclosure-reference-tabs button b{display:grid;place-items:center;flex:0 0 auto;min-width:19px;height:19px;border-radius:10px;padding:0 4px;color:#4a768d;background:#e8f3f8;font:800 11px/1 Arial,sans-serif}.disclosure-reference-tabs button:hover{border-color:#a9d5e6;color:#0c72ac;background:#f2fafc}.disclosure-reference-tabs button.active{border-color:#9ed2e4;color:#0870aa;background:#e2f4fa;box-shadow:inset 0 -2px 0 #1e9fbd}.disclosure-reference-tabs button.active b{color:#fff;background:#1b91bc}.disclosure-reference-list{overflow:hidden;border-top:1px solid #dce8ee}.disclosure-reference-list article{display:grid;grid-template-columns:156px minmax(0,1fr);gap:18px;align-items:start;border-bottom:1px solid #e5eef2;padding:14px 12px;transition:background .16s ease}.disclosure-reference-list article:hover{background:#f6fbfd}.disclosure-reference-list article>b{color:#1978aa;font:800 13px/1.5 Arial,sans-serif}.disclosure-reference-list article p{margin:0;color:#47697e;font-size:14px;line-height:1.6;text-align:left}.disclosure-reference-list article:last-child{border-bottom:0}@media(max-width:720px){.disclosure-reference-tabs{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.disclosure-reference-tabs button{padding:8px;font-size:13px}.disclosure-reference-list article{grid-template-columns:1fr;gap:4px;padding:12px 5px}.disclosure-reference-list article p{font-size:13px}}
/* 流式生成：正文逐章节出现，右侧要点同步提取。 */
.disclosure-document-title-row__actions{display:flex;align-items:center;gap:12px;flex:0 0 auto}.disclosure-generation-progress,.disclosure-assistant-generation{display:inline-flex;align-items:center;gap:6px;color:#1980b2;font-size:12px;font-weight:700;white-space:nowrap}.disclosure-generation-progress i,.disclosure-assistant-generation i,.disclosure-stream-block__meta span i{width:7px;height:7px;border-radius:50%;background:#18a6bb;box-shadow:0 0 0 4px #d8f1f4;animation:disclosure-pulse 1.25s ease-in-out infinite}.disclosure-document-title-row button:disabled{border-color:#e0e9ee;color:#9aabb6;background:#f5f8fa;box-shadow:none;cursor:wait}.disclosure-toc button:disabled{color:#a8bac4;background:transparent;cursor:wait}.disclosure-toc button.active:disabled{color:#1680b2;background:linear-gradient(90deg,#e5f4f8,#f7fbfc);opacity:1}.disclosure-stream-block{position:relative;overflow:hidden;margin:0 -15px 28px;border:1px solid #a8d8e8;border-radius:12px;padding:19px 20px 6px;background:linear-gradient(125deg,#f3fbfd,#fff 52%,#f3fafc);box-shadow:0 10px 26px #1e7fa516;animation:disclosure-reveal .34s ease both}.disclosure-stream-block:after{position:absolute;top:0;left:-38%;width:35%;height:100%;background:linear-gradient(90deg,transparent,#fff9,transparent);content:'';animation:disclosure-sheen 1.8s linear infinite}.disclosure-stream-block__meta{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.disclosure-stream-block__meta span{display:inline-flex;align-items:center;gap:7px;color:#1682b7;font-size:12px;font-weight:800}.disclosure-stream-block__meta b{overflow:hidden;color:#7893a2;font-size:12px;font-weight:600;white-space:nowrap;text-overflow:ellipsis}.disclosure-stream-block h3{position:relative;z-index:1;margin-bottom:15px}.disclosure-stream-block p{position:relative;z-index:1;min-height:31px}.disclosure-stream-cursor{display:inline-block;width:2px;height:1.12em;margin-left:3px;background:#0f8bbd;vertical-align:-.15em;animation:disclosure-cursor .82s steps(1) infinite}.disclosure-edit-block.is-generated,.disclosure-references.is-generated{animation:disclosure-reveal .4s ease both}.disclosure-extract-card.is-generating{border-color:#b4dce9}.disclosure-extract-card.is-generating dd{animation:disclosure-reveal .32s ease both}.disclosure-extract-skeleton{display:grid;gap:7px;margin-top:3px}.disclosure-extract-skeleton i,.disclosure-extract-skeleton b{display:block;overflow:hidden;border-radius:5px;background:linear-gradient(90deg,#eff4f6 20%,#f9fcfd 40%,#eff4f6 60%);background-size:200% 100%;animation:disclosure-loading 1.25s linear infinite}.disclosure-extract-skeleton i{width:68px;height:15px}.disclosure-extract-skeleton b{height:48px;border:1px solid #edf2f4}.disclosure-extract-card.is-generating footer{border-color:#dcebf0;color:#598196}.disclosure-extract-card.is-generating footer svg{animation:disclosure-light 1.25s ease-in-out infinite}.disclosure-assistant-generation{margin-top:4px;padding:6px 8px;border-radius:999px;background:#eaf7fa;font-size:11px}.disclosure-assistant-generation i{width:6px;height:6px;box-shadow:0 0 0 3px #d8f1f4}@keyframes disclosure-pulse{50%{opacity:.55;box-shadow:0 0 0 7px #d8f1f400}}@keyframes disclosure-cursor{50%{opacity:0}}@keyframes disclosure-reveal{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes disclosure-sheen{to{left:110%}}@keyframes disclosure-loading{to{background-position:-200% 0}}@keyframes disclosure-light{50%{color:#0b9ac0;transform:translateY(-2px)}}@media(max-width:720px){.disclosure-document-title-row__actions{gap:7px}.disclosure-generation-progress{font-size:11px}.disclosure-generation-progress i{width:6px;height:6px}.disclosure-stream-block{margin-right:-8px;margin-left:-8px;padding:16px 13px 4px}.disclosure-stream-block__meta{align-items:flex-start;flex-direction:column;gap:4px}.disclosure-stream-block__meta b{max-width:100%}.disclosure-document-title-row button:disabled{display:none}}
/* 正文引用与资料列表共用 [1]–[15] 的连续编号。 */
.disclosure-ref{box-sizing:border-box;border:0;padding:0;cursor:pointer;transition:background .16s,color .16s,transform .16s}.disclosure-ref:hover{color:#fff;background:#1685b8;transform:translateY(-1px)}.disclosure-ref:focus-visible{outline:2px solid #78c4dc;outline-offset:2px}.disclosure-reference-list article{grid-template-columns:38px minmax(128px,156px) minmax(0,1fr);gap:12px}.disclosure-reference-number{display:grid;place-items:center;min-width:32px;height:22px;margin-top:1px;border-radius:6px;color:#1680b4;background:#e4f4f9;font:800 11px/1 Arial,sans-serif}.disclosure-reference-list article>b{padding-top:2px}@media(max-width:720px){.disclosure-reference-list article{grid-template-columns:34px minmax(0,1fr);gap:4px 9px}.disclosure-reference-list article p{grid-column:2}.disclosure-reference-number{min-width:30px;height:20px;font-size:10px}}
</style>
