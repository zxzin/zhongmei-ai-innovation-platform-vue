<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FileText } from '@lucide/vue'
import ApplicationHeading from '../../components/ApplicationHeading.vue'
import { useUiStore } from '../../stores/ui.js'
import sourceDemo from '../../../../demo副本/中煤科创平台-Demo-单文件版.html?raw'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const stage = ref('launch')
const prompt = ref('')
const requirement = ref('')
const focus = ref('')
const tocOpen = ref(false)
const playersEditing = ref(false)
const streamSectionIndex = ref(0)
const streamChunk = ref(0)
const streamActive = ref(false)
const scopeStreamStep = ref(0)
const detailStreamStep = ref(0)
const outlineVisibleCount = ref(0)
const scopeStreaming = ref(false)
const detailStreaming = ref(false)
const outlineStreaming = ref(false)
let reportStreamTimer = null
let flowStreamTimer = null

const examples = [
  ['研发策略', '煤矿井下智能巡检机器人的多传感器融合与防爆边缘计算关键技术预研'],
  ['技术路线', '矿井高盐废水深度处理与资源化利用的技术路线及工程适配研究'],
  ['产业趋势', '煤矿智能化背景下井下无人巡检与 5G-A 融合应用的发展趋势'],
]
const defaultTopic = examples[0][1]
const topic = computed(() => prompt.value || defaultTopic)
const detail = computed(() => requirement.value.trim() || '提升巡检准确率至95%以上，实现毫秒级数据处理响应')
const refinedTopic = '煤矿井下智能巡检机器人的多传感器融合与防爆边缘计算关键技术预研，提升巡检准确率至95%以上，实现实时数据处理响应时间小于100ms'
const outline = ref([
  '煤矿巡检机器人技术背景与目标', '井下智能巡检市场需求分析', '多传感器融合技术现状与挑战',
  '煤矿机器人技术演进路径', '井下巡检机器人主要玩家分析', '多传感器融合当前技术方案',
  '实时数据处理潜在创新方向', '煤矿防爆认证与安全法规', '井下恶劣环境适应性技术', '引用资料',
])
const reportSections = (() => {
  const match = sourceDemo.match(/window\.__CM_RESEARCH_REPORT_SOURCE__=(\[[\s\S]*?\]);\s*<\/script>/)
  if (!match) return []
  const sections = JSON.parse(match[1])
  const references = sections.find((section) => section.number === 7)
  const regularSections = sections
    .filter((section) => section.number !== 7)
    .map((section, index) => ({
      ...section,
      originalNumber: section.number,
      number: index + 1,
    }))
  return [
    ...regularSections,
    ...(references
      ? [{ ...references, originalNumber: references.number, number: regularSections.length + 1, title: '引用资料', isReferences: true }]
      : []),
  ]
})()
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
const activeReferenceGroup = computed(() => referenceGroups.find((group) => group.title === activeReferenceTitle.value) || referenceGroups[0])
const referenceTotal = computed(() => referenceGroups.reduce((total, group) => total + group.items.length, 0))
const streamedReportSections = computed(() => reportSections.slice(0, streamSectionIndex.value + (streamChunk.value > 0 ? 1 : 0)))
const streamingSection = computed(() => reportSections[streamSectionIndex.value] || null)
const streamProgress = computed(() => {
  if (!reportSections.length) return 0
  if (streamSectionIndex.value >= reportSections.length) return 100
  const parts = streamPartCount(streamingSection.value)
  return Math.min(99, Math.round(((streamSectionIndex.value + streamChunk.value / parts) / reportSections.length) * 100))
})
const streamStatus = computed(() => {
  if (streamSectionIndex.value >= reportSections.length) return '报告内容已生成完毕，正在整理阅读版式…'
  if (!streamChunk.value) return streamSectionIndex.value ? '正在组织下一章节内容…' : '正在分析研究目标与资料依据…'
  const section = streamingSection.value
  return `正在生成第 ${String(section.number).padStart(2, '0')} 章 · ${section.title}`
})
function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
function formatReportText(value) {
  return escapeHtml(value).replace(/^#\s*/, '').replace(/\[([0-9]+)\]/g, '<sup>$1</sup>').replace(/\n/g, '<br>')
}
function isSubheading(block, nextBlock, section) {
  if (!block || block.type !== 'paragraph' || !nextBlock || nextBlock.type !== 'paragraph') return false
  const sourceNumber = section.originalNumber ?? section.number
  return (sourceNumber === 5 || sourceNumber === 8) && block.text.length <= 36
}
function tableHtml(block) {
  const rows = Array.isArray(block.rows) ? block.rows : []
  if (!rows.length) return ''
  const headers = rows[0] || []
  const values = rows[1] || []
  const entries = headers.map((header, index) => ({ header, value: values[index] })).filter((item) => item.header && item.value)
  if (entries.length) {
    return '<div class="research-report-innovation-list">' + entries.map((item) => '<article><b>' + escapeHtml(item.header) + '</b><p>' + formatReportText(item.value) + '</p></article>').join('') + '</div>'
  }
  return '<div class="research-report-table-wrap"><table>' + rows.map((row, rowIndex) => '<tr>' + row.map((cell) => rowIndex === 0 ? '<th>' + formatReportText(cell) + '</th>' : '<td>' + formatReportText(cell) + '</td>').join('') + '</tr>').join('') + '</table></div>'
}
function solutionHtml(section) {
  const paragraphs = (section.blocks || []).filter((block) => block.type === 'paragraph' && block.text)
  const pairs = []
  for (let index = 0; index < paragraphs.length; index += 2) pairs.push({ title: paragraphs[index]?.text || '', body: paragraphs[index + 1]?.text || '' })
  const intro = pairs[0] || {}
  const core = pairs.slice(1, 5)
  const extension = pairs.slice(5)
  return '<div class="research-solutions"><div class="research-solutions-intro"><h3>' + formatReportText(intro.title) + '</h3><p>' + formatReportText(intro.body) + '</p></div><div class="research-solutions-core">' + core.map((item) => '<article><span>●</span><div><h4>' + formatReportText(item.title) + '</h4><p>' + formatReportText(item.body) + '</p></div></article>').join('') + '</div><div class="research-solutions-extension"><h3>应用能力延展</h3>' + extension.map((item) => '<details><summary><span>' + formatReportText(item.title) + '</span><i></i></summary><p>' + formatReportText(item.body) + '</p></details>').join('') + '</div></div>'
}
function playerHtml(section) {
  const full = ((section.blocks || []).find((block) => block.type === 'paragraph') || {}).text || ''
  const overviewEnd = '整体技术已接近工业化应用水平。'
  const overviewIndex = full.indexOf(overviewEnd)
  const overview = overviewIndex >= 0 ? full.slice(0, overviewIndex + overviewEnd.length) : full
  const remainder = overviewIndex >= 0 ? full.slice(overviewIndex + overviewEnd.length) : ''
  const names = ['中煤科工集团沈阳研究院有限公司', '太原科技大学', '北京天玛智控科技股份有限公司', '煤炭科学研究总院有限公司', '安翼机器人(江苏)有限公司']
  const players = names.map((name, index) => {
    const start = remainder.indexOf(name)
    const nextName = names[index + 1]
    const end = nextName ? remainder.indexOf(nextName, start + name.length) : remainder.length
    return start >= 0 ? { name, body: remainder.slice(start + name.length, end < 0 ? remainder.length : end).trim() } : null
  }).filter(Boolean)
  return '<div class="research-players"><div class="research-players-toolbar"><p>' + formatReportText(overview) + '</p><button type="button" class="research-player-edit"><span>✎</span> 编辑玩家</button></div><div class="research-player-list">' + players.map((player, index) => '<article><div class="research-player-mark">' + String(index + 1).padStart(2, '0') + '</div><div class="research-player-main"><h3>' + escapeHtml(player.name) + '</h3><div class="research-player-solution"><b>技术方案</b><p data-player-body>' + formatReportText(player.body) + '</p></div></div></article>').join('') + '</div></div>'
}
function reportBlocksHtml(section, blockLimit = Number.POSITIVE_INFINITY) {
  const sourceNumber = section.originalNumber ?? section.number
  if (sourceNumber === 5) return blockLimit > 0 ? solutionHtml(section) : ''
  if (sourceNumber === 6) return blockLimit > 0 ? playerHtml(section) : ''
  if (section.isReferences) return ''
  const blocks = (Array.isArray(section.blocks) ? section.blocks : []).slice(0, blockLimit)
  return blocks.map((block, index) => {
    if (block.type === 'image') {
      if (sourceNumber === 10 || /image8\.png$/i.test(block.src || '')) return ''
      return '<figure class="research-report-figure"><div><img src="' + escapeHtml(block.src) + '" alt="' + escapeHtml(block.alt || section.title) + '"></div><figcaption>可左右滑动查看完整内容</figcaption></figure>'
    }
    if (block.type === 'table') return tableHtml(block)
    if (block.type !== 'paragraph' || !block.text) return ''
    let text = block.text.trim()
    if (sourceNumber === 3) text = text.replace(/^#\s*技术现状与挑战\s*/, '')
    if (sourceNumber === 9) text = text.replace(/^#\s*煤矿防爆认证与安全法规\s*/, '')
    if (text.replace(/^#\s*/, '') === section.title) return ''
    if (isSubheading(block, blocks[index + 1], section)) return '<h3>' + formatReportText(text) + '</h3>'
    if (/^((专利|文献)\s*\d*：|标题：)/.test(text)) return '<p class="research-report-fact ' + (/^((专利|文献)\s*\d*：)/.test(text) ? 'is-group' : '') + '">' + formatReportText(text) + '</p>'
    return '<p>' + formatReportText(text) + '</p>'
  }).join('')
}
function streamPartCount(section) {
  if (!section) return 1
  if (section.isReferences || [5, 6].includes(section.originalNumber ?? section.number)) return 2
  const blocks = (section.blocks || []).filter((block) => ['paragraph', 'image', 'table'].includes(block.type) && (block.text || block.src || block.rows))
  return Math.max(2, Math.min(4, Math.ceil(blocks.length / 2)))
}
function streamedBlockLimit(section) {
  const blocks = (section.blocks || []).filter((block) => ['paragraph', 'image', 'table'].includes(block.type) && (block.text || block.src || block.rows)).length
  if (!blocks) return Number.POSITIVE_INFINITY
  return Math.max(1, Math.ceil((blocks * streamChunk.value) / streamPartCount(section)))
}
function reportSectionClass(section) {
  const sourceNumber = section.originalNumber ?? section.number
  const variants = { 5: 'solutions', 6: 'players', 4: 'timeline', 8: 'innovation', 9: 'compliance', 10: 'network' }
  return [section.isReferences ? 'references' : variants[sourceNumber], sourceNumber === 6 && playersEditing.value ? 'is-editing' : ''].filter(Boolean)
}
function handleReportClick(event) {
  const button = event.target.closest('.research-player-edit')
  if (!button) return
  const section = button.closest('.research-report-section.players')
  if (!section) return
  const editing = !playersEditing.value
  playersEditing.value = editing
  section.querySelectorAll('[data-player-body]').forEach((body) => {
    body.contentEditable = editing ? 'true' : 'false'
    body.setAttribute('spellcheck', 'false')
  })
  button.innerHTML = editing ? '<span>✓</span> 完成编辑' : '<span>✎</span> 编辑玩家'
  if (editing) section.querySelector('[data-player-body]')?.focus()
}
function scrollToReport(number) {
  document.getElementById('research-report-' + number)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function stopFlowStream() {
  if (flowStreamTimer) window.clearTimeout(flowStreamTimer)
  flowStreamTimer = null
  scopeStreaming.value = false
  detailStreaming.value = false
  outlineStreaming.value = false
}
function scheduleFlowStep(target, limit, interval = 360) {
  flowStreamTimer = window.setTimeout(() => {
    const active = target === 'scope' ? scopeStreaming : target === 'detail' ? detailStreaming : outlineStreaming
    const step = target === 'scope' ? scopeStreamStep : target === 'detail' ? detailStreamStep : outlineVisibleCount
    if (!active.value) return
    step.value += 1
    if (step.value >= limit) {
      active.value = false
      flowStreamTimer = null
      return
    }
    scheduleFlowStep(target, limit, interval)
  }, interval)
}
function startScopeStream() {
  stopFlowStream()
  scopeStreamStep.value = 0
  scopeStreaming.value = true
  move('scope')
  scheduleFlowStep('scope', 5, 360)
}
function startDetailStream() {
  stopFlowStream()
  detailStreamStep.value = 0
  detailStreaming.value = true
  move('detail')
  scheduleFlowStep('detail', 5, 360)
}
function startOutlineStream() {
  stopFlowStream()
  outlineVisibleCount.value = 0
  outlineStreaming.value = true
  move('outline')
  scheduleFlowStep('outline', outline.value.length, 250)
}
function stopReportStream() {
  if (reportStreamTimer) window.clearTimeout(reportStreamTimer)
  reportStreamTimer = null
  streamActive.value = false
}
function scheduleReportChunk(delay = 420) {
  if (!streamActive.value) return
  reportStreamTimer = window.setTimeout(() => {
    if (!streamActive.value) return
    if (streamSectionIndex.value >= reportSections.length) {
      stopReportStream()
      move('report')
      return
    }
    const section = reportSections[streamSectionIndex.value]
    const parts = streamPartCount(section)
    if (streamChunk.value < parts) {
      streamChunk.value += 1
      scheduleReportChunk(streamChunk.value === parts ? 560 : 360)
      return
    }
    streamSectionIndex.value += 1
    streamChunk.value = 0
    scheduleReportChunk(260)
  }, delay)
}
function startReportGeneration() {
  stopReportStream()
  streamSectionIndex.value = 0
  streamChunk.value = 0
  streamActive.value = true
  move('generating')
  scheduleReportChunk(520)
}
function viewCompleteReport() {
  stopReportStream()
  move('report')
}

function routeFor(next) {
  return '/agent/research/' + (next === 'launch' ? 'brief' : next)
}
function move(next) {
  stage.value = next
  router.push(routeFor(next))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function startResearch() {
  if (!prompt.value.trim()) return
  requirement.value = ''
  focus.value = ''
  startScopeStream()
}
function addRequirement() {
  if (!requirement.value.trim()) return
  startDetailStream()
}
function download() {
  ui.notify('技术预研报告已生成 Word 文件', 'success')
}
watch(() => route.params.stage, (value) => {
  const nextStage = ['scope', 'detail', 'outline', 'generating', 'report'].includes(value) ? value : 'launch'
  stage.value = nextStage
  if (nextStage === 'generating' && !streamActive.value) {
    streamSectionIndex.value = 0
    streamChunk.value = 0
    streamActive.value = true
    scheduleReportChunk(520)
  } else if (nextStage !== 'generating') {
    stopReportStream()
  }
  if ((scopeStreaming.value && nextStage !== 'scope') || (detailStreaming.value && nextStage !== 'detail') || (outlineStreaming.value && nextStage !== 'outline')) stopFlowStream()
}, { immediate: true })
onBeforeUnmount(() => {
  stopFlowStream()
  stopReportStream()
})
</script>

<template>
  <section class="research-page">
    <main v-if="stage === 'launch'" class="research-launch">
      <section class="research-launch-inner">
        <ApplicationHeading class="research-launch-title" app="research" />
        <section class="research-composer"><textarea v-model="prompt" maxlength="5000" aria-label="技术预研问题" placeholder="请描述需要预研的技术问题、应用场景和研究目标。" /><footer><button class="research-clear" type="button" :disabled="!prompt" @click="prompt = ''">清空内容</button><button class="research-submit" type="button" :disabled="!prompt.trim()" aria-label="开始预研" title="开始预研" @click="startResearch"><span aria-hidden="true">➤</span></button></footer></section>
        <section class="research-examples" aria-label="示范输入"><span>示范输入</span><button type="button" title="带入完整示范内容" @click="prompt = examples[0][1]"><span>{{ examples[0][1] }}</span></button></section>
      </section>
    </main>

    <main v-else-if="stage === 'scope'" class="research-clarify">
      <div class="research-clarify-layout">
        <main class="research-dialogue">
          <section v-if="scopeStreaming" class="research-flow-stream-status"><i /><span>正在解析研究主题并生成补充问题…</span></section>
          <div v-if="scopeStreamStep >= 1 || !scopeStreaming" class="research-topic-bubble research-stream-reveal"><span>研发策略</span><b>{{ topic }}</b></div>
          <section v-if="scopeStreamStep >= 1 || !scopeStreaming" class="research-assistant-card research-stream-reveal"><header><i>✦</i><h2>您要进行技术预研的研究内容是：</h2></header><strong v-if="scopeStreamStep >= 2 || !scopeStreaming" class="research-stream-reveal">{{ topic }}</strong><div v-if="scopeStreamStep >= 3 || !scopeStreaming" class="research-assistant-question research-stream-reveal"><p>为了帮助您生成高质量的预研报告，建议补充更详细的信息。</p><b v-if="scopeStreamStep >= 4 || !scopeStreaming" class="research-stream-reveal">您希望该技术达到什么样的具体技术效果或性能指标？比如：提升巡检准确率至95%以上，实现毫秒级数据处理响应</b></div><template v-if="scopeStreamStep >= 5 || !scopeStreaming"><p class="research-assistant-note research-stream-reveal">如果没有更多需要补充的信息，也可以直接生成预研报告。</p><button class="research-generate research-stream-reveal" type="button" @click="startOutlineStream">生成预研报告</button></template></section>
          <section class="research-followup research-followup-quick"><div class="research-followup-composer"><textarea v-model="requirement" :disabled="scopeStreaming" placeholder="补充具体技术效果或性能指标" /><button type="button" :disabled="scopeStreaming" aria-label="提交补充描述" title="提交补充描述" @click="addRequirement">➤</button></div><button class="research-followup-example" type="button" :disabled="scopeStreaming" @click="requirement = '提升巡检准确率至95%以上，实现毫秒级数据处理响应'">示例输入</button></section>
        </main>
        <aside class="research-progress"><div class="research-progress-line" /><article class="active"><i>1</i><div><h2>开始您的研究</h2><p>{{ topic }}</p></div></article><article><i>2</i><div><h2>报告大纲</h2></div></article><article><i>3</i><div><h2>开始生成报告</h2></div></article></aside>
      </div>
    </main>

    <main v-else-if="stage === 'detail'" class="research-clarify research-clarify-detail">
      <div class="research-clarify-layout">
        <main class="research-dialogue">
          <div class="research-dialogue-scroll"><section class="research-assistant-card research-prior-card"><header><i>✦</i><h2>您要进行技术预研的研究内容是：</h2></header><strong>{{ topic }}</strong><div class="research-assistant-question"><p>为了帮助您生成高质量的预研报告，建议补充更详细的信息。</p><b>您希望该技术达到什么样的具体技术效果或性能指标？比如：提升巡检准确率至95%以上，实现毫秒级数据处理响应</b></div></section><div class="research-topic-bubble research-detail-bubble"><b>{{ detail }}</b></div><section v-if="detailStreaming" class="research-flow-stream-status"><i /><span>正在融合补充信息并生成下一轮研究建议…</span></section><section v-if="detailStreamStep >= 1 || !detailStreaming" class="research-assistant-card research-stream-reveal"><header><i>✦</i><h2>您要进行技术预研的研究内容是：</h2></header><strong v-if="detailStreamStep >= 2 || !detailStreaming" class="research-stream-reveal">{{ refinedTopic }}</strong><div v-if="detailStreamStep >= 3 || !detailStreaming" class="research-assistant-question research-stream-reveal"><p>为了帮助您生成高质量的预研报告，建议补充更详细的信息。</p><b v-if="detailStreamStep >= 4 || !detailStreaming" class="research-stream-reveal">您希望重点研究多传感器融合技术还是防爆边缘计算技术？比如：多传感器融合算法优化、防爆边缘计算硬件设计</b></div><template v-if="detailStreamStep >= 5 || !detailStreaming"><p class="research-assistant-note research-stream-reveal">如果没有更多需要补充的信息，也可以直接生成预研报告。</p><button class="research-generate research-stream-reveal" type="button" @click="startOutlineStream">生成预研报告</button></template></section></div>
          <section class="research-followup research-followup-plain"><div class="research-followup-composer"><textarea v-model="focus" :disabled="detailStreaming" placeholder="继续补充重点研究方向或其他要求" /><button type="button" :disabled="detailStreaming" aria-label="提交补充描述" title="提交补充描述" @click="startOutlineStream">➤</button></div></section>
        </main>
        <aside class="research-progress"><div class="research-progress-line" /><article class="active"><i>1</i><div><h2>开始您的研究</h2><p>{{ refinedTopic }}</p></div></article><article><i>2</i><div><h2>报告大纲</h2></div></article><article><i>3</i><div><h2>开始生成报告</h2></div></article></aside>
      </div>
    </main>

    <main v-else-if="stage === 'outline'" class="research-clarify research-outline-page">
      <div class="research-clarify-layout">
        <main class="research-dialogue research-outline-dialogue">
          <div class="research-dialogue-scroll"><section class="research-assistant-card research-prior-card"><header><i>✦</i><h2>您要进行技术预研的研究内容是：</h2></header><strong>{{ topic }}</strong><div class="research-assistant-question"><p>为了帮助您生成高质量的预研报告，建议补充更详细的信息。</p><b>您希望该技术达到什么样的具体技术效果或性能指标？比如：提升巡检准确率至95%以上，实现毫秒级数据处理响应</b></div></section><div class="research-topic-bubble research-detail-bubble"><b>{{ detail }}</b></div><section class="research-assistant-card"><header><i>✦</i><h2>您要进行技术预研的研究内容是：</h2></header><strong>{{ refinedTopic }}</strong><div class="research-assistant-question"><p>为了帮助您生成高质量的预研报告，建议补充更详细的信息。</p><b>您希望重点研究多传感器融合技术还是防爆边缘计算技术？比如：多传感器融合算法优化、防爆边缘计算硬件设计</b></div></section><div class="research-outline-notice" :class="{ 'is-streaming': outlineStreaming }"><i v-if="outlineStreaming" /><span>{{ outlineStreaming ? `正在生成报告大纲 ${outlineVisibleCount} / ${outline.length}…` : '您可以在右侧查看或编辑报告大纲，确认后开始生成报告。' }}</span></div></div>
          <section class="research-followup research-followup-plain research-outline-followup"><div class="research-followup-composer"><textarea v-model="focus" :disabled="outlineStreaming" placeholder="继续补充研究要求或提出问题" /><button type="button" :disabled="outlineStreaming" aria-label="提交补充提问" title="提交补充提问" @click="ui.notify('补充提问已记录。', 'success')">➤</button></div></section>
        </main>
        <aside class="research-progress research-outline-progress"><div class="research-progress-line" /><article class="completed"><i>✓</i><div><h2>开始您的研究</h2><p>{{ refinedTopic }}</p></div></article><article class="active outline-step"><i>2</i><div><h2>报告大纲</h2><p v-if="outlineStreaming" class="research-outline-stream-caption">正在梳理章节结构…</p><div class="research-outline-list"><template v-for="(item, index) in outline.slice(0, outlineStreaming ? outlineVisibleCount : outline.length)" :key="index"><div v-if="index < 8" class="research-outline-item research-outline-static research-stream-reveal"><span>{{ item }}</span></div><label v-else class="research-outline-item research-outline-editable research-stream-reveal"><input v-model="outline[index]" :disabled="outlineStreaming" :aria-label="'可编辑大纲条目 ' + (index + 1)" /></label></template></div><button v-if="!outlineStreaming" class="research-outline-confirm research-stream-reveal" type="button" @click="startReportGeneration">确认并继续</button></div></article><article><i>3</i><div><h2>开始生成报告</h2></div></article></aside>
      </div>
    </main>

    <main v-else-if="stage === 'generating'" class="research-report-page research-stream-page">
      <header class="research-report-header"><div class="research-report-name"><span>技术预研报告 · 流式生成中</span><h1>煤矿井下智能巡检机器人的多传感器融合与防爆边缘计算关键技术预研</h1></div><div class="research-stream-actions"><div class="research-stream-percentage"><b>{{ streamProgress }}%</b><span>已完成</span></div><button type="button" @click="viewCompleteReport">查看完整报告</button></div></header>
      <main class="research-report-main">
        <section class="research-stream-status" aria-live="polite"><div><i /><span>{{ streamStatus }}</span></div><p><b>{{ streamedReportSections.length }}</b> / {{ reportSections.length }} 个章节已输出</p></section>
        <div class="research-report-document research-stream-document">
          <article v-for="(section, index) in streamedReportSections" :key="section.number" class="research-report-section research-stream-section" :class="[reportSectionClass(section), { 'is-streaming': index === streamSectionIndex, 'is-complete': index < streamSectionIndex }]">
            <header><span>{{ String(section.number).padStart(2, '0') }}</span><div><h2>{{ section.title }}</h2></div></header>
            <div v-if="section.isReferences" class="research-report-copy"><div class="research-stream-references"><b>引用资料已整理</b><span>已汇集 {{ referenceTotal }} 项参考资料，正在核对分类与引用关系。</span></div></div>
            <div v-else class="research-report-copy" v-html="reportBlocksHtml(section, index === streamSectionIndex ? streamedBlockLimit(section) : Number.POSITIVE_INFINITY)" />
            <footer v-if="index === streamSectionIndex" class="research-stream-cursor"><span>正在写入本章节</span><i /></footer>
          </article>
        </div>
      </main>
    </main>

    <main v-else class="research-report-page">
      <header class="research-report-header"><div class="research-report-name"><span>技术预研报告</span><h1>煤矿井下智能巡检机器人的多传感器融合与防爆边缘计算关键技术预研</h1></div><div class="research-report-actions"><button class="research-report-toc" type="button" aria-label="查看报告目录" title="查看报告目录" @click="tocOpen = !tocOpen">☷</button><button class="research-report-download" type="button" @click="download">下载报告</button></div></header>
      <main class="research-report-main">
        <div class="research-report-document" @click="handleReportClick">
          <article v-for="section in reportSections" :id="'research-report-' + section.number" :key="section.number" class="research-report-section" :class="reportSectionClass(section)"><header><span>{{ String(section.number).padStart(2, '0') }}</span><div><h2>{{ section.title }}</h2></div></header><div v-if="section.isReferences" class="research-report-copy"><section class="research-references" aria-label="引用资料"><header><h3>引用资料</h3><span>{{ referenceTotal }} 项参考资料</span></header><nav class="research-reference-tabs" aria-label="资料分类"><button v-for="group in referenceGroups" :key="group.title" type="button" :class="{ active: activeReferenceTitle === group.title }" :aria-selected="activeReferenceTitle === group.title" @click="activeReferenceTitle = group.title"><FileText :size="17" /><span>{{ group.title }}</span><b>{{ group.items.length }}</b></button></nav><section class="research-reference-list" :key="activeReferenceGroup.title"><article v-for="item in activeReferenceGroup.items" :key="item[0]"><b>{{ item[0] }}</b><p>{{ item[1] }}</p></article></section></section></div><div v-else class="research-report-copy" v-html="reportBlocksHtml(section)" /></article>
        </div>
        <aside v-if="tocOpen" class="research-report-toc-panel"><h3>报告目录</h3><div><button v-for="section in reportSections" :key="section.number" type="button" @click="scrollToReport(section.number)"><b>{{ String(section.number).padStart(2, '0') }}</b><span>{{ section.title }}</span></button></div></aside>
      </main>
    </main>
  </section>
</template>

<style>
.research-page{min-height:100vh;color:#20394f;background:#fff}.research-page button{font:inherit}.research-launch{min-height:calc(100vh - 54px);display:grid;place-items:center;padding:20px;background:radial-gradient(ellipse at 50% 40%,#e5f2fb 0%,#f7fafc 48%,#f7fafc 100%)}.research-launch-inner{width:min(980px,100%);margin:-3vh auto 0}.research-launch-title{text-align:center;margin-bottom:22px}.research-launch-title .agent-flow-mark{width:48px;height:48px;display:grid;place-items:center;margin:0 auto 10px;border-radius:14px;background:linear-gradient(145deg,#dff2fa,#e8f6fb);color:#1269aa;font-size:23px}.research-launch-title h1{margin:0;color:#102f50;font-size:clamp(34px,3vw,50px);font-weight:600;letter-spacing:-.04em}.research-launch-title p{margin:10px 0 0;color:#758ba0;font-size:15px}.research-composer{overflow:hidden;border:1px solid #d4e1ea;border-radius:16px;background:#fff;box-shadow:0 18px 44px #234c6810;transition:.2s}.research-composer:focus-within{border-color:#71b8e3;box-shadow:0 18px 48px #1d6f9f18}.research-composer textarea{display:block;width:100%;height:168px;min-height:132px;resize:vertical;border:0;outline:0;padding:22px 30px 10px;background:transparent;color:#173650;font:17px/1.8 "Microsoft YaHei",sans-serif}.research-composer textarea::placeholder,.research-followup textarea::placeholder{color:#9caebe}.research-composer footer{display:flex;align-items:center;justify-content:space-between;padding:12px 20px 18px 30px;color:#8da0b1;font-size:13px}.research-clear{min-height:32px;border:0;background:transparent;padding:6px;color:#6b90a8;font-size:13px;font-weight:700;cursor:pointer}.research-clear:hover:not(:disabled){color:#116cae;background:#eef7fb}.research-clear:disabled{color:#b2c2cd;cursor:default}.research-submit{width:50px;min-height:50px;height:50px;display:grid!important;place-items:center;border:0!important;border-radius:50%!important;background:linear-gradient(145deg,#22c7c7,#168acb)!important;padding:0!important;color:#fff!important;box-shadow:0 8px 18px #168bc638;cursor:pointer;transition:.2s}.research-submit span{font-size:20px;transform:rotate(-90deg)}.research-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 11px 22px #168bc64d}.research-submit:disabled{background:#dbe6ec!important;color:#9eb0bd!important;box-shadow:none;cursor:not-allowed}.research-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:38px;border:1px solid #1688c0;border-radius:7px;background:#1688c0;padding:0 15px;color:#fff;font-size:13px;font-weight:800;cursor:pointer}.research-primary:hover{border-color:#0e74a5;background:#0e74a5}.research-examples{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;align-items:center;margin:17px 3px 0;color:#7890a1}.research-examples>span{font-size:15px}.research-examples button{display:flex;min-width:0;align-items:center;border:0;border-radius:8px;padding:9px 12px;color:#24698f;background:#e9f3f9;font:15px/1.45 "Microsoft YaHei",sans-serif;text-align:left;cursor:pointer;transition:.18s}.research-examples button:hover{color:#0f6faa;background:#dceef7}.research-examples button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.research-clarify,.research-outline{min-height:100vh;padding:26px clamp(22px,4vw,56px) 42px;background:linear-gradient(180deg,#f3f9fc,#fff 43%)}.research-clarify-layout,.research-outline-layout{width:min(1220px,100%);display:grid;grid-template-columns:minmax(0,1.7fr) minmax(310px,.7fr);gap:18px;margin:0 auto}.research-dialogue{min-width:0;display:flex;flex-direction:column;gap:18px;padding-top:4px}.research-topic-bubble,.research-detail-bubble{align-self:flex-end;max-width:82%;display:grid;gap:6px;border-radius:14px 14px 2px 14px;background:linear-gradient(135deg,#0f64b8,#168fc5);padding:16px 20px;color:#fff;box-shadow:0 10px 24px #155f9930}.research-topic-bubble span{color:#d7f4ff;font-size:11px;font-weight:800}.research-topic-bubble b,.research-detail-bubble b{font-size:14px;line-height:1.7}.research-detail-bubble{margin-left:auto;background:#eaf4fa;color:#32536b;box-shadow:none}.research-assistant-card{border:1px solid #d9e7ee;border-radius:15px;background:#fff;padding:24px 26px;box-shadow:0 9px 26px #294e6810}.research-assistant-card header{display:flex;align-items:center;gap:10px}.research-assistant-card header>i{width:32px;height:32px;display:grid;place-items:center;flex:0 0 auto;color:#fff;border-radius:9px;background:#1688c0;font-style:normal}.research-assistant-card h1{margin:0;color:#25465f;font-size:17px}.research-assistant-card>strong{display:block;margin-top:17px;color:#153e5c;font-size:16px;line-height:1.65}.assistant-question{margin-top:19px;border-left:3px solid #7bc1e0;border-radius:0 8px 8px 0;background:#f5fafc;padding:14px 16px}.assistant-question p{margin:0;color:#6c8697;font-size:13px;line-height:1.75}.assistant-question b{display:block;margin-top:8px;color:#41647c;font-size:13px;line-height:1.75}.assistant-note{margin:15px 0;color:#758c9b;font-size:12px}.compact{padding:20px 22px}.compact>strong{margin-top:12px;font-size:14px}.research-followup{border:1px solid #dce8ef;border-radius:13px;background:#fff;padding:15px}.research-followup header{display:flex;align-items:center;gap:7px;color:#47667c;font-size:13px}.research-followup header i{width:24px;height:24px;display:grid;place-items:center;color:#1688c0;border-radius:6px;background:#e8f5fa}.research-followup>div{position:relative;overflow:hidden;margin-top:11px;border:1px solid #cbdde7;border-radius:9px}.research-followup textarea{display:block;width:100%;min-height:86px;border:0;outline:0;resize:vertical;padding:12px 48px 12px 13px;color:#3c5b70;font:13px/1.7 "Microsoft YaHei",sans-serif}.research-followup button:not(.example-button){position:absolute;right:9px;bottom:9px;width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:50%;color:#fff;background:#1688c0;cursor:pointer}.research-followup button:disabled{background:#d4e0e7;cursor:not-allowed}.example-button{margin-top:10px;border:1px solid #b9d9eb;border-radius:18px;background:#f4faff;padding:6px 13px;color:#126eaa;font-size:12px;font-weight:800;cursor:pointer}
.research-progress{position:relative;align-self:start;border:1px solid #dce7ee;border-radius:16px;background:#fff;padding:32px 25px;box-shadow:0 9px 28px #294e6810}.progress-line{position:absolute;top:56px;bottom:70px;left:42px;width:2px;background:#e5edf2}.research-progress article{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr);gap:14px;min-height:124px}.research-progress article>i{z-index:1;width:38px;height:38px;display:grid;place-items:center;color:#8fa0ae;border-radius:50%;background:#eef2f5;font-size:13px;font-style:normal;font-weight:800}.research-progress article.active>i{color:#fff;background:#157fc0;box-shadow:0 0 0 5px #e7f4fb}.research-progress article.done>i{color:#fff;background:#1682bd}.research-progress h2{margin:4px 0 10px;color:#17334c;font-size:17px}.research-progress p{margin:0;color:#4f687e;font-size:13px;line-height:1.75;overflow-wrap:anywhere}.outline-note{display:flex;align-items:flex-start;gap:10px;border:1px solid #dce7ee;border-radius:12px;background:#fff;padding:15px 17px;color:#50687d;font-size:13px;line-height:1.7}.outline-note svg{flex:0 0 auto;color:#1688c0}.outline-list{display:grid;gap:8px;margin:11px 0 14px}.outline-list label{display:block;min-width:0;border:1px solid transparent;border-radius:8px;background:#f6f9fb;padding:9px 11px}.outline-list label span{display:block;color:#27445c;font-size:13px;line-height:1.45}.outline-list label.editable{border-color:#b9cbd7;background:#fff;padding:0}.outline-list input{width:100%;border:0;outline:0;background:transparent;padding:9px 10px;color:#27445c;font:13px/1.45 "Microsoft YaHei",sans-serif}
.research-report{min-height:100vh;background:linear-gradient(180deg,#eef7fb 0,#f6f9fb 230px)}.research-report-header{display:flex;justify-content:space-between;align-items:flex-start;gap:22px;padding:34px clamp(24px,4vw,52px) 28px}.research-report-header>div{min-width:0}.research-report-header>div>span{color:#1682ba;font-size:12px;font-weight:800;letter-spacing:.12em}.research-report-header h1{max-width:960px;margin:9px 0 0;color:#153650;font-size:clamp(25px,2.4vw,34px);letter-spacing:-.025em;line-height:1.35}.research-report-header p{margin:8px 0 0;color:#8799a7;font-size:12px}.research-report-header nav{display:flex;gap:9px;align-items:center;flex:0 0 auto}.research-report-header nav>button{width:41px;height:41px;display:grid;place-items:center;border:1px solid #cbdce6;border-radius:8px;background:#fff;color:#355b75;cursor:pointer}.research-report-header .download-button{width:auto;display:inline-flex;gap:6px;border-color:#1689c1;background:#1689c1;padding:0 17px;color:#fff;font-size:13px;font-weight:800}.research-report-main{position:relative;max-width:1180px;margin:0 auto;padding:8px 34px 60px}.research-report-document{display:grid;gap:21px}.report-section{scroll-margin-top:20px;border-radius:12px;background:#fff;padding:45px 56px;box-shadow:0 12px 38px #1b49620d}.report-section>header{display:flex;align-items:flex-start;gap:18px;margin-bottom:28px}.report-section>header>span{flex:0 0 auto;color:#22a5bd;font-size:32px;font-weight:300;line-height:1}.report-section>header>div{border-left:1px solid #cfe1e9;padding-left:18px}.report-section header small{display:block;margin-bottom:7px;color:#7d94a5;font-size:11px;font-weight:800;letter-spacing:.12em}.report-section h2{margin:0;color:#102f4b;font-size:24px;letter-spacing:-.02em}.report-copy{border-top:1px solid #e2ebf0;padding-top:26px}.report-copy>p{margin:0 0 14px;color:#405d72;font-size:15px;line-height:2.02;text-align:justify}.citations{display:flex;flex-wrap:wrap;gap:7px;margin-top:22px}.citations span,.citations b{border-radius:999px;padding:5px 9px;font-size:11px}.citations span{color:#1876a6;background:#e8f5fa}.citations b{color:#6c8495;background:#f3f6f8;font-weight:700}.card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.card-grid article{border:1px solid #dae8ef;border-radius:10px;background:#f8fbfc;padding:19px 20px}.card-grid h3{margin:0 0 8px;color:#174a69;font-size:15px}.card-grid p{margin:0!important;color:#587186!important;font-size:13px!important;line-height:1.8!important;text-align:left!important}.report-callout,.report-boundary{display:grid;grid-template-columns:78px minmax(0,1fr);gap:10px;margin-top:20px;border-radius:8px;background:#eef8fb;padding:14px 15px;color:#406b82}.report-callout b,.report-boundary b{color:#1775a6;font-size:12px}.report-callout span,.report-boundary p{margin:0;font-size:13px;line-height:1.75}.route-list{display:grid;gap:0}.route-list article{display:grid;grid-template-columns:42px minmax(0,1fr);gap:14px;border-bottom:1px solid #e4edf1;padding:15px 0}.route-list article:last-child{border-bottom:0}.route-list i{width:31px;height:31px;display:grid;place-items:center;color:#1682ba;border-radius:8px;background:#e6f5fa;font-size:10px;font-style:normal;font-weight:800}.route-list h3{margin:3px 0 4px;color:#294b62;font-size:15px}.route-list p{margin:0!important;font-size:13px!important;line-height:1.75!important;text-align:left!important}.recommendations{display:grid;gap:12px;margin:0;padding-left:23px}.recommendations li{color:#405d72;font-size:14px;line-height:1.85}.report-boundary{margin-top:24px;background:#fff7e8;color:#79673f}.report-boundary b,.report-boundary p{color:#79673f}.report-toc{position:fixed;z-index:10;top:90px;right:clamp(18px,4vw,52px);width:min(325px,calc(100% - 36px));border:1px solid #dae5ec;border-radius:12px;background:#fff;padding:16px;box-shadow:0 16px 38px #173b5524}.report-toc header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;color:#173650}.report-toc header button{border:0;background:transparent;color:#6d8496;cursor:pointer}.report-toc>button{display:grid;width:100%;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:center;border:0;border-radius:8px;background:transparent;padding:10px 8px;color:#526c82;text-align:left;cursor:pointer}.report-toc>button:hover,.report-toc>button.active{background:#eaf5fa;color:#116b9f}.report-toc>button b{font-size:11px}.report-toc>button span{font-size:12px;line-height:1.5}
@media(max-width:980px){.research-clarify-layout,.research-outline-layout{grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr)}.research-progress{padding:26px 20px}.report-section{padding:34px 36px}.research-report-main{padding-right:22px;padding-left:22px}}@media(max-width:900px){.research-clarify,.research-outline{padding:20px 16px 38px}.research-clarify-layout,.research-outline-layout{grid-template-columns:1fr}.research-progress{order:-1}.research-progress article{min-height:auto;margin-bottom:17px}.progress-line{bottom:34px}.research-report-header{padding:25px 18px 19px}.research-report-main{padding:5px 14px 42px}.report-section{padding:30px 22px}.card-grid{grid-template-columns:1fr}.report-copy>p{font-size:14px;line-height:1.88}.report-toc{top:75px;right:14px}}@media(max-width:760px){.research-launch{display:block;padding:14px 10px}.research-launch-inner{margin:0 auto}.research-launch-title{margin-bottom:16px}.research-launch-title .agent-flow-mark{margin-bottom:6px}.research-launch-title h1{font-size:30px}.research-launch-title p{margin-top:6px}.research-composer textarea{height:138px;min-height:112px;padding:17px 20px 8px;font-size:15px}.research-composer footer{padding:8px 12px 11px 20px}.research-examples{grid-template-columns:1fr;row-gap:4px;margin-top:12px}.research-examples>span{grid-row:auto;padding-top:0}.research-examples button{grid-template-columns:82px minmax(0,1fr);padding:8px 10px;font-size:15px}}@media(max-width:560px){.research-topic-bubble,.research-detail-bubble{max-width:94%}.research-assistant-card{padding:19px 17px}.research-assistant-card h1{font-size:15px}.research-assistant-card>strong{font-size:14px}.research-report-header h1{font-size:24px}.research-report-header nav>button:first-child{display:none}.research-report-header .download-button{padding:0 12px}.report-section>header{gap:12px}.report-section>header>span{font-size:26px}.report-section>header>div{padding-left:12px}.report-section h2{font-size:20px}.report-callout,.report-boundary{grid-template-columns:1fr}}
/* 输入后点亮：沿用当前圆形按钮，仅切换为参考图的蓝色。 */
.research-submit:not(:disabled){background:#1874b5!important;box-shadow:0 8px 18px #196fa925}.research-submit:hover:not(:disabled){box-shadow:0 11px 22px #196fa93b}

/* 技术预研输出：与原 Demo 的澄清、大纲与十章报告结构保持一致。 */
.research-clarify{padding:0!important;min-height:calc(100vh - 40px);background:#f7fafc}.research-clarify-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(310px,.7fr);gap:18px;min-height:calc(100vh - 40px);max-width:none;margin:0}.research-dialogue{min-width:0;display:flex;flex-direction:column;gap:18px;padding:26px 4px 0 0}.research-topic-bubble{align-self:flex-end;max-width:82%;display:flex;gap:8px;align-items:center;background:linear-gradient(135deg,#0f64b8,#168fc5);color:#fff;border-radius:14px 14px 2px 14px;padding:16px 20px;box-shadow:0 10px 24px #155f9930}.research-topic-bubble span{color:inherit;font-size:16px;font-weight:600;opacity:.75}.research-topic-bubble span:after{content:"："}.research-topic-bubble b{font-size:16px;line-height:1.65}.research-assistant-card{border:1px solid #dce8ef;border-radius:16px;background:#fff;padding:24px 26px;box-shadow:0 9px 28px #294e6810}.research-assistant-card header{display:flex;align-items:center;gap:9px}.research-assistant-card header i{display:grid;place-items:center;width:29px;height:29px;border-radius:10px;background:#e5f4fb;color:#1174b2;font-style:normal}.research-assistant-card h2{margin:0;color:#173651;font-size:18px}.research-assistant-card>strong{display:block;margin:15px 0 18px;color:#173651;font-size:16px;line-height:1.7}.research-assistant-question{margin-top:0;border-left:4px solid #1887c1;border-radius:12px;background:#f5f9fc;padding:16px 18px}.research-assistant-question p{margin:0 0 10px;color:#5d758a;font-size:14px;line-height:1.6}.research-assistant-question b{display:block;margin:0;color:#1a344e;font-size:16px;line-height:1.75}.research-assistant-note{margin:17px 0 13px;color:#7a8fa1;font-size:14px}.research-generate{display:inline-flex;align-items:center;justify-content:center;min-height:40px;border:1px solid #1689bf;border-radius:8px;background:#1689bf;padding:0 20px;color:#fff;font-size:15px;font-weight:700;cursor:pointer}.research-generate:hover{border-color:#0f76a7;background:#0f76a7}.research-followup{margin-top:auto;border:1px solid #dce7ee;border-radius:16px;background:#fff;padding:18px 20px 13px;box-shadow:0 10px 28px #294d6510}.research-followup-title{display:flex;align-items:center;gap:8px;margin-bottom:12px;color:#1767aa;font-weight:700}.research-followup-title i{font-size:23px;font-style:normal}.research-followup-composer{display:grid;grid-template-columns:minmax(0,1fr) 48px;align-items:end;border:1px solid #d5e2ea;border-radius:12px;background:#fff;padding:4px}.research-followup-composer:focus-within{border-color:#6bb3db;box-shadow:0 0 0 3px #e5f4fb}.research-followup-composer textarea{height:88px;resize:none;border:0;outline:0;padding:15px;background:transparent;color:#173650;font:15px/1.7 "Microsoft YaHei",sans-serif}.research-followup-composer button{width:40px;height:40px;margin:0 4px 5px 0;border:0;border-radius:50%;background:#147ab9;color:#fff;font-size:18px;cursor:pointer;transform:rotate(-90deg)}.research-followup-example{margin-top:10px;border:1px solid #b9d9eb;border-radius:18px;background:#f4faff;padding:6px 14px;color:#126eaa;font:700 13px "Microsoft YaHei",sans-serif;cursor:pointer}.research-followup-example:hover{background:#e5f4fb}.research-progress{position:relative;align-self:start;border:1px solid #dce7ee;border-radius:16px;background:#fff;padding:34px 26px;box-shadow:0 9px 28px #294e6810}.research-progress-line{position:absolute;top:56px;bottom:38%;left:43px;width:2px;background:#e5edf2}.research-progress article{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr);gap:14px;min-height:120px}.research-progress article i{position:relative;z-index:1;display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:#eef2f5;color:#8fa0ae;font-style:normal;font-weight:700}.research-progress article.active i{background:#157fc0;color:#fff;box-shadow:0 0 0 5px #e7f4fb}.research-progress article.completed i{background:#1682bd;color:#fff}.research-progress h2{margin:4px 0 12px;color:#17334c;font-size:18px}.research-progress p{margin:0;color:#4f687e;font-size:14px;line-height:1.75;overflow-wrap:anywhere}.research-clarify-detail .research-dialogue,.research-outline-dialogue{max-height:calc(100vh - 42px);overflow-y:auto;padding-right:10px;padding-bottom:18px;scrollbar-width:thin;scrollbar-color:#a8b6c0 transparent}.research-prior-card{margin-top:0}.research-detail-bubble{margin:0 0 0 auto;padding:14px 20px;box-shadow:none}.research-followup-plain,.research-outline-followup{margin-top:0}.research-clarify-detail .research-assistant-card{box-shadow:0 5px 18px #294e680d}.research-outline-dialogue .research-assistant-card>strong,.research-outline-dialogue .research-assistant-question b{font-size:14px}.research-outline-dialogue .research-assistant-question p,.research-outline-dialogue .research-outline-notice{font-size:13px}.research-outline-notice{border:1px solid #dce7ee;border-radius:13px;background:#fff;padding:15px 18px;color:#50687d}.research-outline-progress{max-height:calc(100vh - 42px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:#a8b6c0 transparent}.research-outline-progress .research-progress-line{bottom:70px}.research-outline-progress article{min-height:100px}.research-outline-progress .outline-step{min-height:auto;padding-bottom:24px}.research-outline-list{display:grid;gap:9px;margin:10px 0 12px}.research-outline-item{display:block;min-width:0;border:1px solid transparent;border-radius:8px;background:#f6f9fb}.research-outline-static{padding:10px 13px}.research-outline-static span{display:block;color:#27445c;font-size:14px;line-height:1.45}.research-outline-editable{border-color:#b9cbd7;background:#fff;padding:0}.research-outline-editable:focus-within{border-color:#1688c0;box-shadow:0 0 0 3px #e6f4fa}.research-outline-editable input{display:block;width:100%;border:0;outline:0;background:transparent;padding:10px 12px;color:#27445c;font:14px/1.45 "Microsoft YaHei",sans-serif}.research-outline-confirm{display:inline-flex;align-items:center;justify-content:center;min-height:40px;margin-top:14px;border:1px solid #1688c0;border-radius:7px;background:#1688c0;padding:0 20px;color:#fff;font:700 14px "Microsoft YaHei",sans-serif;cursor:pointer}.research-outline-confirm:hover{border-color:#0f73a4;background:#0f73a4}

.research-report-page{min-height:calc(100vh - 36px);background:linear-gradient(180deg,#eef7fb 0,#f6f9fb 230px)}.research-report-header{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:14px;padding:34px 42px 28px;background:transparent}.research-report-name{min-width:0}.research-report-name>span{display:block;margin-bottom:9px;color:#1682ba;font-size:13px;font-weight:800;letter-spacing:.12em}.research-report-name h1{max-width:980px;margin:0;color:#153650;font-size:clamp(24px,2.2vw,34px);line-height:1.35;letter-spacing:-.025em}.research-report-actions{display:flex;align-items:center;gap:10px}.research-report-toc{width:42px;height:42px;border:1px solid #cbdce6;border-radius:8px;background:#fff;color:#153b57;font-size:20px;cursor:pointer}.research-report-download{min-height:42px;border:1px solid #1689c1;border-radius:8px;background:#1689c1;padding:0 20px;color:#fff;font:700 14px "Microsoft YaHei",sans-serif;cursor:pointer}.research-report-download:hover{border-color:#0e74a5;background:#0e74a5}.research-report-main{position:relative;max-width:1180px;margin:0 auto;padding:8px 34px 60px}.research-report-document{display:grid;gap:22px}.research-report-section{scroll-margin-top:24px;border-radius:12px;background:#fff;padding:48px 58px;box-shadow:0 12px 38px #1b49620d}.research-report-section>header{display:flex;align-items:flex-start;gap:18px;margin-bottom:30px}.research-report-section>header>span{flex:0 0 auto;color:#22a5bd;font-size:34px;font-weight:300;line-height:1}.research-report-section>header>div{display:flex;align-items:center;min-height:34px;border-left:1px solid #cfe1e9;padding-left:18px}.research-report-section h2{margin:0;color:#102f4b;font-size:25px;letter-spacing:-.02em}.research-report-copy{border-top:1px solid #e2ebf0;padding:28px 0 0}.research-report-copy>p{margin:0 0 18px;color:#405d72;font-size:16px;line-height:2.05;text-align:justify;overflow-wrap:anywhere}.research-report-copy>p:last-child{margin-bottom:0}.research-report-copy>p sup{display:inline-grid;place-items:center;min-width:20px;height:20px;margin:0 3px;border-radius:50%;background:#c8d0d8;color:#fff;font-size:11px;font-weight:700;vertical-align:middle}.research-report-copy>h3{margin:30px 0 12px;border-left:3px solid #20a4ba;padding-left:12px;color:#173f5a;font-size:18px;line-height:1.5}.research-report-copy>h3:first-child{margin-top:0}.research-report-figure{margin:4px 0 8px}.research-report-figure>div{max-width:100%;overflow-x:auto;padding:8px;border:1px solid #dce7ed;border-radius:10px;background:#f7fafb}.research-report-figure img{display:block;width:max(100%,1072px);height:auto}.research-report-figure figcaption{margin-top:8px;color:#8295a4;font-size:12px;text-align:right}.research-report-innovation-list{display:grid;gap:10px;margin:12px 0 24px}.research-report-innovation-list article{padding:15px 17px;border:1px solid #dce8ee;border-radius:9px;background:#f8fbfc}.research-report-innovation-list b{display:block;margin-bottom:6px;color:#1378a7}.research-report-innovation-list p{margin:0;color:#526d81;font-size:14px;line-height:1.85}.research-report-toc-panel{position:fixed;z-index:20;top:92px;right:34px;max-height:calc(100vh - 120px);width:min(330px,calc(100% - 56px));overflow:auto;border:1px solid #dedede;border-radius:12px;background:#fff;padding:18px;box-shadow:0 14px 36px #00000014}.research-report-toc-panel h3{margin:0 0 12px;color:#171717}.research-report-toc-panel>div{display:grid;gap:5px}.research-report-toc-panel button{display:grid;grid-template-columns:30px minmax(0,1fr);gap:8px;align-items:center;border:1px solid transparent;border-radius:7px;background:#fff;padding:11px;color:#242424;text-align:left;font-weight:600;cursor:pointer;transition:background-color .16s,border-color .16s,transform .16s}.research-report-toc-panel button b{color:#6e6e6e;font-variant-numeric:tabular-nums}.research-report-toc-panel button:hover{border-color:#d6d6d6;background:#f1f1f1;color:#050505;transform:translateX(3px)}.research-report-toc-panel button:hover b{color:#111}

.research-solutions{display:grid;gap:22px}.research-solutions-intro{border:1px solid #cfe5ef;border-radius:12px;background:linear-gradient(135deg,#eff8fb,#fbfdfe);padding:22px}.research-solutions-intro h3{margin:0 0 12px;border:0;padding:0;color:#1377a8;font-size:20px}.research-solutions-intro p{margin:0;color:#456579;font-size:15px;line-height:1.9}.research-solutions-core{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.research-solutions-core article{display:grid;grid-template-columns:24px minmax(0,1fr);gap:10px;border:1px solid #dce8ee;border-radius:10px;background:#fff;padding:17px}.research-solutions-core article>span{color:#1a9abd;font-size:13px}.research-solutions-core h4{margin:0 0 8px;color:#173f5a;font-size:16px}.research-solutions-core p{margin:0;color:#526d81;font-size:14px;line-height:1.8}.research-solutions-extension{border:1px solid #dce8ee;border-radius:11px;overflow:hidden}.research-solutions-extension>h3{margin:0;border:0;border-bottom:1px solid #dce8ee;padding:14px 17px;color:#173f5a;font-size:17px}.research-solutions-extension details{border-bottom:1px solid #e7eef2}.research-solutions-extension details:last-child{border:0}.research-solutions-extension summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 17px;color:#2c536e;font-weight:700;cursor:pointer}.research-solutions-extension summary i{width:7px;height:7px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg)}.research-solutions-extension details[open] summary i{transform:rotate(225deg)}.research-solutions-extension details>p{margin:0;padding:0 17px 17px;color:#526c80;font-size:14px;line-height:1.85}.research-players{display:grid;gap:20px}.research-players-toolbar{position:relative;border:1px solid #eadfc9;border-radius:10px;background:#fffaf0;padding:21px 156px 21px 22px}.research-players-toolbar p{margin:0;color:#52687a;font-size:15px;line-height:1.95;text-align:justify}.research-players-toolbar button{position:absolute;top:20px;right:20px;display:inline-flex;align-items:center;gap:7px;min-height:38px;border:1px solid #c98a31;border-radius:7px;background:#fff;padding:0 15px;color:#9a5c08;font:700 14px "Microsoft YaHei",sans-serif;cursor:pointer}.research-players-toolbar button:hover{border-color:#b87820;background:#fff2d9}.research-player-list{display:grid;gap:13px}.research-player-list>article{display:grid;grid-template-columns:56px minmax(0,1fr);overflow:hidden;border:1px solid #e4e8eb;border-radius:11px;background:#fff}.research-player-mark{display:grid;place-items:start center;background:#f3f0ea;padding-top:22px;color:#93703d;font-size:13px;font-weight:800;font-variant-numeric:tabular-nums}.research-player-main{min-width:0;padding:20px 22px}.research-player-main h3{margin:0 0 13px;color:#182f42;font-size:18px;line-height:1.45}.research-player-solution{border-radius:8px;background:#f7f8f9;padding:16px 18px}.research-player-solution b{display:block;margin-bottom:8px;color:#7e5b2f;font-size:14px}.research-player-solution p{margin:0;color:#506778;font-size:14px;line-height:1.9;outline:0}.players .research-player-solution p[contenteditable="true"]{border-radius:6px;background:#fff;padding:7px 9px;box-shadow:0 0 0 1px #e3b86e}.research-evidence{display:grid;gap:30px}.research-evidence>section{display:grid;gap:12px}.research-evidence-heading{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid #d9e7e1;padding-bottom:10px}.research-evidence-heading>span{color:#173d35;font-size:18px;font-weight:800}.research-evidence-heading>small{color:#82968e;font-size:12px}.research-evidence-card{display:grid;grid-template-columns:42px minmax(0,1fr);gap:14px;border:1px solid #dce7e2;border-radius:11px;background:#fff;padding:20px}.research-evidence-card.is-paper{border-color:#dce5ec;background:#fbfcfd}.research-evidence-number{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:#e9f5ef;color:#24805f;font-size:13px;font-weight:800}.research-evidence-card.is-paper .research-evidence-number{background:#edf3f8;color:#35749b}.research-evidence-main{min-width:0}.research-evidence-main header{display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px;margin-bottom:12px}.research-evidence-main header>span{flex:0 0 auto;border-radius:5px;background:#eaf6e9;padding:4px 8px;color:#329023;font-size:13px}.research-evidence-card.is-paper header>span{background:#ebf3fb;color:#1874be}.research-evidence-main h4{flex:1 1 440px;margin:0;color:#172f42;font-size:17px;line-height:1.5}.research-evidence-main code{border-radius:5px;background:#f3f5f6;padding:4px 8px;color:#5e7180;font:13px "Microsoft YaHei",sans-serif}.research-evidence-main em{border:1px solid #b8c1c8;border-radius:6px;padding:3px 8px;color:#7b878f;font-size:12px;font-style:normal}.research-evidence-main em.is-valid{border-color:#72b868;color:#2c9024}.research-evidence-summary{display:flex;align-items:flex-start;gap:10px;margin:0 0 13px;color:#526b7e;font-size:14px;line-height:1.8}.research-evidence-summary b{flex:0 0 auto;border:1px solid #4e9dc8;border-radius:12px;padding:2px 8px;color:#2477a3;font-size:12px;line-height:1.55}.research-evidence-innovation{border-radius:8px;background:linear-gradient(135deg,#edf7ff,#f2fbf8);padding:15px 17px}.research-evidence-innovation strong{display:inline-block;margin-bottom:7px;color:#1578b7;font-size:13px}.research-evidence-innovation p,.research-paper-abstract{margin:0;color:#425e72;font-size:14px;line-height:1.9}.research-paper-abstract{padding:3px 0 2px}.research-evidence-main footer{display:flex;flex-wrap:wrap;gap:10px 28px;margin-top:14px;color:#8193a0;font-size:12px}
@media(max-width:1050px){.research-clarify-layout{grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr)}.research-topic-bubble{max-width:94%}.research-progress{padding:28px 20px}.research-progress-line{left:37px}}@media(max-width:820px){.research-clarify-layout{grid-template-columns:1fr}.research-dialogue{padding-right:0}.research-progress{order:-1}.research-progress article{min-height:auto;margin-bottom:18px}.research-progress-line{bottom:30px}.research-followup{margin-top:0}.research-solutions-core{grid-template-columns:1fr}.research-players-toolbar{padding:20px}.research-players-toolbar button{position:static;margin-top:14px}.research-player-list>article{grid-template-columns:42px minmax(0,1fr)}.research-player-main{padding:17px 15px}.research-evidence-card{grid-template-columns:32px minmax(0,1fr);padding:16px 14px}.research-evidence-number{width:28px;height:28px}.research-evidence-main h4{flex-basis:100%;font-size:15px}}@media(max-width:760px){.research-report-header{padding:24px 18px 18px}.research-report-actions .research-report-toc{display:none}.research-report-main{padding:6px 14px 40px}.research-report-section{padding:30px 22px}.research-report-section>header>span{font-size:26px}.research-report-copy>p{font-size:14px;line-height:1.9}.research-report-toc-panel{top:78px;right:14px;width:calc(100% - 28px)}.research-report-document{gap:14px}}

/* 报告输出逐项采用源 Demo 的分组和卡片样式。 */
.research-report-fact{margin-bottom:8px!important;padding:9px 13px;border-radius:7px;background:#f6f9fb;text-align:left!important}.research-report-fact.is-group{margin-top:28px!important;background:#edf6fa;color:#176c96!important;font-weight:800}.research-report-table-wrap,.research-report-figure>div{max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain}.research-report-table-wrap table{width:100%;min-width:620px;border-collapse:collapse;color:#405d72;font-size:14px}.research-report-table-wrap th,.research-report-table-wrap td{padding:12px 14px;border:1px solid #dbe6ec;text-align:left;vertical-align:top;line-height:1.7}.research-report-table-wrap th{background:#f1f6f8;color:#274e68}
.research-report-section.solutions{background:linear-gradient(145deg,#f7fbff 0,#fff 44%)!important;border-top:4px solid #2586c8!important}.research-report-section.players{background:linear-gradient(145deg,#fffdf8 0,#fff 48%)!important;border-top:4px solid #d99c3e!important}.research-report-section.references{background:linear-gradient(145deg,#f8fcfe 0,#fff 50%)!important;border-top:4px solid #27a1bd!important}.research-report-section.evidence{background:linear-gradient(145deg,#f7fcfa 0,#fff 50%)!important;border-top:4px solid #32a17b!important}.research-report-section.timeline{border-top:4px solid #8799a8!important}.research-report-section.innovation{border-top:4px solid #7d6ac8!important}.research-report-section.compliance{border-top:4px solid #c5785b!important}.research-report-section.network{border-top:4px solid #4f8891!important}.research-report-section.solutions .research-report-copy,.research-report-section.players .research-report-copy{border-top:0!important;padding-top:0!important}
.research-references>header{display:flex;align-items:baseline;justify-content:space-between;gap:18px;margin:0 0 18px}.research-references>header h3{margin:0;color:#173f5a;font-size:26px;line-height:1.25;letter-spacing:-.02em}.research-references>header>span{flex:0 0 auto;color:#7d95a5;font-size:14px}.research-reference-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:0 0 18px}.research-reference-tabs button{display:flex;align-items:center;justify-content:center;gap:7px;min-width:0;border:1px solid #d4e5ed;border-radius:10px;background:#fff;padding:11px 10px;color:#547386;font:700 15px/1 "Microsoft YaHei",sans-serif;cursor:pointer;transition:.16s ease}.research-reference-tabs button svg{flex:0 0 auto;color:#1d8ac0}.research-reference-tabs button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.research-reference-tabs button b{display:grid;place-items:center;flex:0 0 auto;min-width:21px;height:21px;border-radius:50%;padding:0 4px;color:#4b768d;background:#e8f3f8;font:800 12px/1 Arial,sans-serif}.research-reference-tabs button:hover{border-color:#a9d5e6;background:#f2fafc;color:#0c72ac}.research-reference-tabs button.active{border-color:#9ed2e4;background:#e2f4fa;color:#0870aa;box-shadow:inset 0 -3px 0 #1e9fbd}.research-reference-tabs button.active b{background:#1b91bc;color:#fff}.research-reference-list{overflow:hidden;border-top:1px solid #dce8ee}.research-reference-list article{display:grid;grid-template-columns:174px minmax(0,1fr);gap:20px;align-items:start;border-bottom:1px solid #e2ecf1;padding:17px 14px;transition:background .16s ease}.research-reference-list article:hover{background:#f6fbfd}.research-reference-list article>b{color:#1978aa;font:800 15px/1.55 Arial,"Microsoft YaHei",sans-serif}.research-reference-list article p{margin:0;color:#47697e;font-size:16px;line-height:1.6;text-align:left}.research-reference-list article:last-child{border-bottom:0}
@media(max-width:760px){.research-references>header{align-items:flex-start;gap:10px;margin-bottom:14px}.research-references>header h3{font-size:23px}.research-references>header>span{padding-top:5px;font-size:12px}.research-reference-tabs{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:14px}.research-reference-tabs button{gap:5px;padding:10px 7px;font-size:13px}.research-reference-list article{grid-template-columns:1fr;gap:5px;padding:13px 5px}.research-reference-list article>b{font-size:13px}.research-reference-list article p{font-size:14px}}
.research-solutions{gap:24px}.research-solutions-intro{border:0;border-left:4px solid #2586c8;border-radius:0 10px 10px 0;background:#edf6fc;padding:20px 22px}.research-solutions-intro h3{margin:0 0 9px;color:#153a55;font-size:19px}.research-solutions-intro p{color:#506b80}.research-solutions-core{gap:14px}.research-solutions-core article{grid-template-columns:13px minmax(0,1fr);gap:12px;border-color:#d6e5ee;border-left:3px solid #2687c9;padding:20px 22px;box-shadow:0 7px 20px #24536f0a}.research-solutions-core article>span{color:#2387cb;line-height:1.7}.research-solutions-core h4{margin-bottom:9px;color:#125e91;font-size:17px}.research-solutions-core p{color:#506b80;line-height:1.85}.research-solutions-extension{display:grid;gap:9px;border:0;overflow:visible}.research-solutions-extension>h3{margin:2px 0 3px;border:0;padding:0;color:#173b55;font-size:17px}.research-solutions-extension details{border:1px solid #dce6ec;border-radius:9px;background:#fff}.research-solutions-extension summary{gap:16px;padding:15px 17px;color:#223d52;font-size:15px;list-style:none}.research-solutions-extension summary::-webkit-details-marker{display:none}.research-solutions-extension summary i{width:9px;height:9px;border-right:2px solid #2884ba;border-bottom:2px solid #2884ba;transition:transform .18s}.research-solutions-extension details[open] summary{background:#f0f7fb;color:#116a9d}
.research-players-toolbar button span{font-size:16px}.research-report-section.players.is-editing .research-player-solution{background:#fff9e9;box-shadow:inset 0 0 0 1px #e3b86e}.research-report-section.players.is-editing [data-player-body]{padding:7px 9px;border-radius:6px;background:#fff;cursor:text}.research-report-section.players.is-editing [data-player-body]:focus{box-shadow:0 0 0 3px #f5e5c6}

/* 中间流程的进度轨道按实际内容收口，避免最后一个步骤下方留下空白卡片。 */
.research-clarify{min-height:100dvh}.research-clarify-layout{align-items:start;min-height:0}.research-clarify:not(.research-clarify-detail):not(.research-outline-page) .research-clarify-layout,.research-clarify:not(.research-clarify-detail):not(.research-outline-page) .research-dialogue{min-height:100dvh}.research-progress{padding:28px 26px 24px}.research-progress article{min-height:0!important;margin-bottom:0!important;padding-bottom:22px}.research-progress article:last-child{padding-bottom:0}.research-progress h2{margin-bottom:8px}.research-progress-line{top:48px;bottom:42px}.research-outline-progress article{min-height:0!important;padding-bottom:22px}.research-outline-progress .outline-step{padding-bottom:24px}.research-progress.research-outline-progress{padding-bottom:8px}.research-progress.research-outline-progress .research-progress-line{bottom:27px}

/* 保留补充输入，只移除其上方的“补充描述／补充提问”标题卡。 */
.research-followup-quick{flex:0 0 auto}.research-followup-quick .research-followup-composer{margin-top:0}.research-followup .research-followup-example{position:static!important;z-index:1;display:inline-flex!important;align-items:center;justify-content:center;width:auto!important;height:24px!important;min-height:24px;margin:8px 0 0!important;border:1px solid #dbe7ed!important;border-radius:999px!important;background:#fcfdfe!important;padding:0 8px!important;color:#7194aa!important;font:600 11px/1 "Microsoft YaHei",sans-serif!important;box-shadow:none!important;transform:none!important}.research-followup .research-followup-example:hover{border-color:#b9d0dd!important;background:#f5fafc!important;color:#4f819e!important}.research-followup .research-followup-example:active{transform:translateY(1px)!important}

/* 追问与大纲阶段：消息列表单独滚动，补充输入固定在左栏底部。 */
html:has(.research-clarify),body:has(.research-clarify),#app:has(.research-clarify),.app-shell:has(.research-clarify),.app-content:has(.research-clarify),.research-page:has(.research-clarify){background:#f7fafc}.research-clarify-detail .research-dialogue,.research-outline-dialogue{height:100dvh;max-height:100dvh!important;overflow:hidden!important;padding:0 4px 0 0}.research-dialogue-scroll{display:flex;flex:1 1 auto;flex-direction:column;gap:18px;min-height:0;overflow-y:auto;padding:26px 10px 18px 0;scrollbar-width:thin;scrollbar-color:#a8b6c0 transparent}.research-clarify-detail .research-followup,.research-outline-page .research-followup{flex:0 0 auto;margin:0 4px 0 0}

/* 大纲阶段的右栏与左侧流程同高，避免卡片下方露出未使用的页面底色。 */
.research-progress.research-outline-progress{height:100dvh;max-height:100dvh;box-sizing:border-box}

/* 前序步骤同样采用逐段写入的反馈节奏。 */
.research-flow-stream-status{display:flex;align-items:center;gap:10px;align-self:flex-start;border:1px solid #d4e8f1;border-radius:9px;background:#f2f9fc;padding:10px 13px;color:#39708e;font-size:13px;font-weight:700}.research-flow-stream-status i,.research-outline-notice.is-streaming>i{width:8px;height:8px;flex:0 0 auto;border-radius:50%;background:#168cc0;box-shadow:0 0 0 4px #dff2f9;animation:research-stream-pulse 1.25s ease-in-out infinite}.research-stream-reveal{animation:research-stream-enter .3s ease both}.research-outline-notice.is-streaming{display:flex;align-items:center;gap:10px;border-color:#cce5ef;background:#f2f9fc;color:#267198}.research-outline-stream-caption{margin:-2px 0 10px!important;color:#5f8ca4!important;font-size:12px!important}.research-followup textarea:disabled{cursor:wait;color:#9aaeba}.research-followup button:disabled,.research-followup-example:disabled{cursor:wait!important;opacity:.55}

/* 报告以章节与内容块持续写入，保留完整阅读页作为生成完成态。 */
.research-stream-page{min-height:100dvh}.research-stream-actions{display:flex;align-items:center;gap:12px}.research-stream-percentage{display:grid;gap:2px;text-align:right}.research-stream-percentage b{color:#1682ba;font-size:20px;line-height:1;font-variant-numeric:tabular-nums}.research-stream-percentage span{color:#7b92a2;font-size:11px}.research-stream-actions>button{min-height:38px;border:1px solid #bdd7e5;border-radius:8px;background:#fff;padding:0 14px;color:#38718f;font:700 13px "Microsoft YaHei",sans-serif;cursor:pointer}.research-stream-actions>button:hover{border-color:#78b5d2;background:#f2f9fc;color:#126d9f}.research-stream-status{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:18px;border:1px solid #d4e7f0;border-radius:10px;background:linear-gradient(90deg,#f1f9fc,#fff);padding:13px 17px;color:#39667d}.research-stream-status>div{display:flex;align-items:center;gap:10px;min-width:0}.research-stream-status i{width:9px;height:9px;flex:0 0 auto;border-radius:50%;background:#1690be;box-shadow:0 0 0 4px #dff3fa;animation:research-stream-pulse 1.25s ease-in-out infinite}.research-stream-status span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:700}.research-stream-status p{flex:0 0 auto;margin:0;color:#7891a0;font-size:12px}.research-stream-status p b{color:#1682ba;font-size:14px}.research-stream-section{animation:research-stream-enter .34s ease both}.research-stream-section.is-streaming{border:1px solid #b9ddec;box-shadow:0 12px 36px #1a7fac16}.research-stream-section.is-streaming>header{margin-bottom:24px}.research-stream-cursor{display:flex;align-items:center;gap:8px;margin-top:16px;color:#1c83b3;font-size:12px;font-weight:700}.research-stream-cursor i{display:block;width:2px;height:16px;background:#1d8fc0;animation:research-stream-caret .75s steps(1) infinite}.research-stream-references{display:flex;align-items:center;gap:12px;border-radius:8px;background:#eff8fb;padding:17px;color:#547486;font-size:14px;line-height:1.7}.research-stream-references b{flex:0 0 auto;color:#167aab;font-size:15px}@keyframes research-stream-pulse{50%{transform:scale(.78);opacity:.55}}@keyframes research-stream-caret{50%{opacity:0}}@keyframes research-stream-enter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@media(max-width:760px){.research-stream-actions{gap:8px}.research-stream-percentage{display:none}.research-stream-actions>button{min-height:34px;padding:0 10px;font-size:12px}.research-stream-status{align-items:flex-start;gap:8px;padding:11px 13px}.research-stream-status span{white-space:normal;font-size:12px}.research-stream-status p{font-size:11px}.research-stream-references{align-items:flex-start;flex-direction:column;gap:4px;padding:14px;font-size:13px}}

/* 原 Demo 的报告阅读字体与字距。 */
.research-report-page,.research-report-page button{font-family:"Microsoft YaHei",Arial,sans-serif}
</style>
