<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Copy, Download, LayoutGrid, Search, Table2, X } from '@lucide/vue'
import ApplicationHeading from '../../components/ApplicationHeading.vue'
import { semanticReferenceResults } from '../../data/semanticResults.js'
import { routeChoice, routePositiveInteger, useRouteQueryState } from '../../composables/useRouteQueryState.js'
import { useUiStore } from '../../stores/ui.js'

const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const query = ref('')
const semanticDemoInput = '一种适用于煤矿井下复杂环境的智能巡检机器人及其控制方法，包括移动底盘、激光雷达、低照度摄像头、热成像模块、惯性测量单元和气体传感器；通过多传感器融合定位建立巷道环境地图，并根据粉尘浓度、照度、通信质量和设备状态动态调整感知权重。在 5G 专网通信中断或信号弱覆盖区域，机器人将巡检任务、定位轨迹和异常告警缓存在本地任务队列中，按照预设安全策略继续完成自主巡检；通信恢复后执行断点续传与数据一致性校验。'
const searched = ref(false)
const category = useRouteQueryState(route, router, 'type', 'patent', routeChoice(['patent', 'paper', 'policy', 'internal'], 'patent'))
const sort = useRouteQueryState(route, router, 'sort', '相关度', routeChoice(['相关度', '申请日', '公开日'], '相关度'))
const viewMode = useRouteQueryState(route, router, 'view', 'card', routeChoice(['card', 'table'], 'card'))
const selectedResults = ref([])
const resultPage = useRouteQueryState(route, router, 'page', 1, routePositiveInteger())
const pageSize = 20
const queryDialogOpen = ref(false)
const hoverPreview = ref(null)
const hoverPreviewPosition = ref({ left: 16, top: 16 })
let hoverPreviewTimer
const generating = ref(false)
const generationStep = ref(0)
let generationTimers = []
const generationSteps = [
  { title: '解析检索内容', detail: '识别技术主题、应用场景与关键约束' },
  { title: '提取技术特征', detail: '构建多维语义特征与关联表达' },
  { title: '匹配多源资料', detail: '比对专利、论文、政策与内部资料' },
  { title: '生成相关性排序', detail: '综合技术语义与资料质量生成结果' },
]
const resultTypeLabels = { patent: '专利', paper: '论文', policy: '政策', internal: '内部资料' }
const categoryRecords = computed(() => semanticReferenceResults.filter((item) => item.type === category.value))
const filteredRecords = computed(() => categoryRecords.value)
const sortedRecords = computed(() => [...filteredRecords.value].sort((left, right) => {
  if (sort.value === '相关度') return parseFloat(right.similarity) - parseFloat(left.similarity)
  const field = sort.value === '申请日' ? 'filing' : 'publication'
  return right[field].localeCompare(left[field])
}))
const totalPages = computed(() => Math.max(1, Math.ceil(sortedRecords.value.length / pageSize)))
const pagedRecords = computed(() => sortedRecords.value.slice((resultPage.value - 1) * pageSize, resultPage.value * pageSize))
const currentPageResultIds = computed(() => pagedRecords.value.map((item) => item.id))
const isCurrentPageFullySelected = computed(() => currentPageResultIds.value.length > 0 && currentPageResultIds.value.every((id) => selectedResults.value.includes(id)))
const hasPartialCurrentPageSelection = computed(() => {
  const selectedCount = currentPageResultIds.value.filter((id) => selectedResults.value.includes(id)).length
  return selectedCount > 0 && selectedCount < currentPageResultIds.value.length
})
const pageNumbers = computed(() => Array.from({ length: Math.min(totalPages.value, 5) }, (_, index) => index + 1))

function setCategory(value) { category.value = value; resultPage.value = 1; hoverPreview.value = null }
function changePage(page) { resultPage.value = Math.min(Math.max(1, page), totalPages.value) }
function toggleCurrentPageSelection(checked) {
  const currentPageIds = new Set(currentPageResultIds.value)
  const nextSelection = new Set(selectedResults.value)
  currentPageIds.forEach((id) => {
    if (checked) nextSelection.add(id)
    else nextSelection.delete(id)
  })
  selectedResults.value = [...nextSelection]
}
function clearGenerationTimers() {
  generationTimers.forEach((timer) => window.clearTimeout(timer))
  generationTimers = []
}
function beginGeneration() {
  clearGenerationTimers()
  generating.value = true
  generationStep.value = 0
  generationSteps.slice(1).forEach((_, index) => {
    generationTimers.push(window.setTimeout(() => { generationStep.value = index + 1 }, 520 * (index + 1)))
  })
  generationTimers.push(window.setTimeout(() => { generating.value = false }, 2620))
}
function showResults() {
  if (!query.value.trim()) return
  resultPage.value = 1
  hoverPreview.value = null
  beginGeneration()
  if (route.params.stage !== 'results') router.push({ path: '/agent/semantic/results', query: route.query })
}
async function copyQuery() {
  if (!query.value.trim()) return
  try {
    await navigator.clipboard.writeText(query.value)
    ui.notify('检索原文已复制到剪贴板', 'success')
  } catch {
    ui.notify('复制失败，请手动复制检索原文')
  }
}
function runDialogSearch() {
  if (!query.value.trim()) return
  queryDialogOpen.value = false
  showResults()
}
function sourceLabel(type) { return resultTypeLabels[type] || '资料' }
function statusItems(status) { return status.split('|') }
function statusTone(status) {
  if (status === '授权' || status === '有效') return 'granted'
  if (status.includes('实质')) return 'review'
  if (status.includes('权利') || status.includes('一案')) return 'event'
  if (status === '个人') return 'personal'
  if (status === '企业') return 'enterprise'
  if (status === '现行') return 'current'
  if (status === '即将施行') return 'upcoming'
  if (status === '征求意见') return 'consultation'
  if (status === '已废止') return 'repealed'
  return 'rejected'
}
function areaTags(item) { return item.areaTags || item.area.split(' · ') }
function paperTopics(item) { return (item.topics || areaTags(item)).filter(Boolean).slice(0, 4) }
function cardSummary(item) { return item.type === 'patent' ? item.preview?.abstract || item.summary : item.summary }
function downloadSelected() {
  if (!selectedResults.value.length) return
  const selectedItems = semanticReferenceResults.filter((item) => selectedResults.value.includes(item.id))
  const content = selectedItems.map((item, index) => [
    `${index + 1}. ${sourceLabel(item.type)}`,
    `标题：${item.title}`,
    item.originalTitle ? `英文标题：${item.originalTitle}` : '',
    `编号：${item.number || '-'}`,
    `摘要：${item.summary || '-'}`,
  ].filter(Boolean).join('\n')).join('\n\n')
  const objectUrl = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = '语义检索结果.txt'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
  ui.notify(`已开始下载 ${selectedItems.length} 条资料`, 'success')
}
function clearHoverPreviewTimer() {
  if (hoverPreviewTimer) window.clearTimeout(hoverPreviewTimer)
}
function showPatentPreview(item, event) {
  if (!item.preview) return
  clearHoverPreviewTimer()
  const rect = event.currentTarget.getBoundingClientRect()
  const popupWidth = 422
  const popupHeight = 300
  const edge = 16
  let left = Math.min(rect.left, window.innerWidth - popupWidth - edge)
  let top = rect.bottom + 12
  if (top + popupHeight > window.innerHeight - edge) top = rect.top - popupHeight - 12
  left = Math.max(edge, left)
  top = Math.max(edge, Math.min(top, window.innerHeight - popupHeight - edge))
  hoverPreviewPosition.value = { left, top }
  hoverPreview.value = item
}
function scheduleHoverPreviewClose() {
  clearHoverPreviewTimer()
  hoverPreviewTimer = window.setTimeout(() => { hoverPreview.value = null }, 160)
}

watch(() => route.params.stage, (stage) => {
  searched.value = stage === 'results'
  if (stage === 'results' && !query.value.trim()) query.value = semanticDemoInput
  if (stage !== 'results') { resultPage.value = 1; hoverPreview.value = null; generating.value = false; clearGenerationTimers() }
}, { immediate: true })
onBeforeUnmount(() => {
  clearHoverPreviewTimer()
  clearGenerationTimers()
})
</script>

<template>
  <section class="structured-workspace semantic-workspace">
    <main v-if="!searched" class="semantic-launch">
      <section class="semantic-launch__inner">
        <ApplicationHeading class="semantic-launch__title" app="semantic" />
        <div class="semantic-composer">
          <textarea v-model="query" maxlength="20000" placeholder="输入一个专利的公开(公告)号（例如：CN103712722B）或者输入任意中文简繁体/英文文本，建议200字以上。" aria-label="语义检索内容" />
          <span class="semantic-composer__footer">
            <button class="semantic-composer__clear" type="button" :disabled="!query" @click="query = ''">清空内容</button>
            <button type="button" :class="{ ready: query.trim() }" :disabled="!query.trim()" @click="showResults"><Search :size="15" />开始检索</button>
          </span>
        </div>
        <div class="semantic-quick-sample"><span>示范输入</span><button type="button" title="带入完整示范内容" @click="query = semanticDemoInput"><span>一种适用于煤矿井下复杂环境的智能巡检机器人及其控制方法，包括移动底盘、激光雷达、低照度摄像头、热成像模块、惯性测量单元和气体传感器；通过多传感器融合定位建立巷道环境地图，并根据粉尘浓度、照度、通信质量和设备状态动态调整感知权重……</span></button></div>
      </section>
    </main>
    <main v-else class="semantic-output" :class="{ 'semantic-output--generating': generating }">
      <section v-if="generating" class="semantic-generation" role="status" aria-live="polite">
        <div class="semantic-generation__panel">
          <div class="semantic-generation__signal"><Search :size="28" /></div>
          <header><span>语义检索引擎</span><h1>正在分析检索内容</h1><p>基于技术语义、应用场景和约束条件匹配多源资料</p></header>
          <div class="semantic-generation__progress"><i :style="{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }"></i></div>
          <ol class="semantic-generation__steps">
            <li v-for="(step, index) in generationSteps" :key="step.title" :class="{ complete: index < generationStep, active: index === generationStep }">
              <i>{{ index + 1 }}</i><div><b>{{ step.title }}</b><span>{{ step.detail }}</span></div><em>{{ index < generationStep ? '已完成' : index === generationStep ? '处理中' : '等待中' }}</em>
            </li>
          </ol>
          <footer><span></span>正在生成可解释的相关性排序结果</footer>
        </div>
      </section>
      <template v-else>
      <header class="semantic-output__heading">
        <i><Search :size="25" /></i>
        <h1>语义检索结果</h1>
        <div class="semantic-output__actions semantic-output__actions--single"><button type="button" @click="queryDialogOpen = true">查看检索原文</button></div>
      </header>

      <section class="semantic-results-table-panel">
          <div class="semantic-results-toolbar-v3__left">
            <nav class="semantic-result-tabs" role="tablist" aria-label="结果来源分类">
              <div class="semantic-result-tabs__list"><button v-for="item in [['patent','专利'],['paper','论文'],['policy','政策'],['internal','内部资料']]" :key="item[0]" :class="{ active: category === item[0] }" type="button" role="tab" :aria-selected="category === item[0]" @click="setCategory(item[0])">{{ item[1] }}</button></div>
            </nav>
            <div class="semantic-results-view-switch" role="group" aria-label="结果呈现方式">
              <button type="button" :class="{ active: viewMode === 'table' }" title="表格视图" aria-label="表格视图" :aria-pressed="viewMode === 'table'" @click="viewMode = 'table'"><Table2 :size="16" /></button>
              <button type="button" :class="{ active: viewMode === 'card' }" title="卡片视图" aria-label="卡片视图" :aria-pressed="viewMode === 'card'" @click="viewMode = 'card'"><LayoutGrid :size="16" /></button>
            </div>
          </div>
          <header class="semantic-results-toolbar-v3">
            <div class="semantic-results-toolbar-v3__count"><b>{{ filteredRecords.length.toLocaleString() }} {{ category === 'paper' ? '篇文献' : category === 'patent' ? '条专利' : '条数据' }}</b><span class="semantic-results-toolbar-v3__page">第 {{ resultPage }} 页，每页 {{ pageSize }} 条</span></div>
            <div class="semantic-results-toolbar-v3__controls">
              <button class="semantic-results-toolbar-v3__download" type="button" title="一键下载已选中" aria-label="一键下载已选中" :disabled="!selectedResults.length" @click="downloadSelected"><Download :size="17" /></button>
              <label class="semantic-results-toolbar-v3__filter"><span class="sr-only">结果排序</span><select v-model="sort" aria-label="结果排序" @change="resultPage = 1"><option value="相关度">最相关</option><option value="公开日">最新</option></select></label>
            </div>
          </header>
          <footer class="semantic-pagination"><div><button type="button" :disabled="resultPage === 1" @click="changePage(resultPage - 1)">上一页</button><button v-for="page in pageNumbers" :key="page" type="button" :class="{ active: resultPage === page }" @click="changePage(page)">{{ page }}</button><i v-if="totalPages > pageNumbers.length">…</i><button type="button" :disabled="resultPage === totalPages" @click="changePage(resultPage + 1)">下一页</button></div></footer>
          <div v-if="viewMode === 'card' && category === 'paper'" class="literature-result-list">
            <article v-for="(item, index) in pagedRecords" :key="item.id" class="literature-result-item">
              <label class="literature-result-item__selection"><input v-model="selectedResults" type="checkbox" :value="item.id" :aria-label="`选择${item.title}`" /><span class="sr-only">选择文献</span></label>
              <div class="literature-result-item__body">
                <header class="literature-result-item__header">
                  <div class="literature-result-item__heading">
                    <div class="literature-result-item__title-line"><b class="literature-result-item__order">{{ (resultPage - 1) * pageSize + index + 1 }}</b><strong :title="item.title">{{ item.title }}</strong><div class="literature-result-item__identifiers"><span v-if="item.number && item.number !== '—'" class="literature-result-item__identifier" :title="item.number">{{ item.number }}</span><span v-if="item.status && item.status !== '—'" class="semantic-result-status" :class="statusTone(item.status)">{{ item.status }}</span></div></div>
                    <small v-if="item.originalTitle">{{ item.originalTitle }}</small>
                  </div>
                </header>
                <p v-if="item.summary && item.summary !== '—'" class="literature-result-item__abstract">{{ item.summary }}</p>
                <footer class="literature-result-item__metadata"><b class="literature-result-item__score">{{ item.similarity }}</b><span class="literature-result-item__year">{{ item.year || item.publication || '—' }}</span><span v-if="item.citations && item.citations !== '—' && item.citations !== '-'" class="literature-result-item__citation">{{ item.citations }}</span><span class="literature-result-item__authors" :title="item.authors || item.applicant || '—'">{{ item.authors || item.applicant || '—' }}</span><span class="literature-result-item__journal" :title="item.journal || '—'">{{ item.journal || '—' }}</span><span v-for="topic in paperTopics(item)" :key="topic">{{ topic }}</span><em v-if="item.applicant && item.applicant !== '—'">{{ item.applicant }}</em></footer>
                </div>
            </article>
            <div v-if="!pagedRecords.length" class="semantic-empty">暂无此类检索结果</div>
          </div>
          <div v-else-if="viewMode === 'card'" class="semantic-result-card-list">
            <article v-for="(item, index) in pagedRecords" :key="item.id" class="semantic-result-card">
              <label class="semantic-result-card__selection"><input v-model="selectedResults" type="checkbox" :value="item.id" :aria-label="`选择${item.title}`" /><span class="sr-only">选择资料</span></label>
              <div class="semantic-result-card__body">
                <header class="semantic-result-card__header">
                  <div class="semantic-result-card__heading">
                    <div><b class="semantic-result-card__index">{{ (resultPage - 1) * pageSize + index + 1 }}</b><span class="semantic-result-card__title" :title="item.title">{{ item.title }}</span><div class="semantic-result-card__identifiers"><span v-if="item.number && item.number !== '—'" class="semantic-result-card__number" :title="item.number">{{ item.number }}</span><span v-if="item.status && item.status !== '—'" class="semantic-result-card__statuses"><span v-for="status in statusItems(item.status)" :key="status" class="semantic-result-status" :class="statusTone(status)">{{ status }}</span></span></div></div>
                    <small v-if="item.originalTitle">{{ item.originalTitle }}</small>
                  </div>
                </header>
                <p v-if="cardSummary(item) && cardSummary(item) !== '—'" class="semantic-result-card__summary" :class="{ 'semantic-result-card__summary--detailed': category === 'patent' && item.preview?.abstract }">{{ cardSummary(item) }}</p>
                <footer class="semantic-result-card__footer"><b class="semantic-result-card__score">{{ item.similarity }}</b><div class="semantic-result-tags"><span v-for="tag in areaTags(item)" :key="tag" :class="{ more: tag.startsWith('+') }">{{ tag }}</span></div><em v-if="item.applicant && item.applicant !== '—'">{{ item.applicant }}</em><dl class="semantic-result-card__facts"><div><dt>{{ category === 'patent' ? '申请日' : '形成日期' }}</dt><dd>{{ item.filing || '—' }}</dd></div><div><dt>{{ category === 'patent' ? '公开（公告）日' : '发布日期' }}</dt><dd>{{ item.publication || '—' }}</dd></div></dl></footer>
              </div>
            </article>
            <div v-if="!pagedRecords.length" class="semantic-empty">暂无此类检索结果</div>
          </div>
          <div v-else-if="category === 'paper'" class="semantic-result-table-wrap">
            <table class="semantic-paper-result-table">
              <colgroup><col class="semantic-paper-result-table__select" /><col class="semantic-paper-result-table__order" /><col class="semantic-paper-result-table__score" /><col class="semantic-paper-result-table__title" /><col class="semantic-paper-result-table__authors" /><col class="semantic-paper-result-table__journal" /><col class="semantic-paper-result-table__doi" /><col class="semantic-paper-result-table__citations" /><col class="semantic-paper-result-table__applicant" /><col class="semantic-paper-result-table__year" /></colgroup>
              <thead><tr><th><input :checked="isCurrentPageFullySelected" :indeterminate.prop="hasPartialCurrentPageSelection" type="checkbox" aria-label="全选当前页" :disabled="!pagedRecords.length" @change="toggleCurrentPageSelection($event.target.checked)" /></th><th>序号</th><th>相关度</th><th>标题</th><th>作者</th><th>期刊 / 会议</th><th>DOI</th><th>被引</th><th>归属单位</th><th>年份</th></tr></thead>
              <tbody>
                <tr v-for="(item, index) in pagedRecords" :key="item.id"><td><input v-model="selectedResults" type="checkbox" :value="item.id" :aria-label="`选择${item.title}`" /></td><td>{{ (resultPage - 1) * pageSize + index + 1 }}</td><td><b class="semantic-result-score">{{ item.similarity }}</b></td><td class="semantic-result-title"><div class="semantic-result-title__content"><span :title="item.title">{{ item.title }}</span></div></td><td :title="item.authors || '—'">{{ item.authors || '—' }}</td><td :title="item.journal || '—'">{{ item.journal || '—' }}</td><td :title="item.number || '—'">{{ item.number || '—' }}</td><td>{{ item.citations || '—' }}</td><td :title="item.applicant || '—'">{{ item.applicant || '—' }}</td><td>{{ item.year || item.publication || '—' }}</td></tr>
                <tr v-if="!pagedRecords.length"><td class="semantic-empty" colspan="10">暂无此类检索结果</td></tr>
              </tbody>
            </table>
          </div>
          <div v-else class="semantic-result-table-wrap">
            <table :class="['semantic-source-result-table', `semantic-${category}-result-table`]">
              <colgroup v-if="category === 'patent'">
                <col class="semantic-patent-result-table__select" /><col class="semantic-patent-result-table__order" /><col class="semantic-patent-result-table__score" /><col class="semantic-patent-result-table__number" /><col class="semantic-patent-result-table__title" /><col class="semantic-patent-result-table__status" /><col class="semantic-patent-result-table__applicant" /><col class="semantic-patent-result-table__classification" /><col class="semantic-patent-result-table__filing" /><col class="semantic-patent-result-table__publication" />
              </colgroup>
              <colgroup v-else-if="category === 'policy'">
                <col class="semantic-policy-result-table__select" /><col class="semantic-policy-result-table__order" /><col class="semantic-policy-result-table__score" /><col class="semantic-policy-result-table__source" /><col class="semantic-policy-result-table__title" /><col class="semantic-policy-result-table__status" /><col class="semantic-policy-result-table__owner" /><col class="semantic-policy-result-table__classification" /><col class="semantic-policy-result-table__formed" /><col class="semantic-policy-result-table__published" />
              </colgroup>
              <colgroup v-else>
                <col class="semantic-internal-result-table__select" /><col class="semantic-internal-result-table__order" /><col class="semantic-internal-result-table__score" /><col class="semantic-internal-result-table__source" /><col class="semantic-internal-result-table__title" /><col class="semantic-internal-result-table__status" /><col class="semantic-internal-result-table__owner" /><col class="semantic-internal-result-table__classification" /><col class="semantic-internal-result-table__formed" /><col class="semantic-internal-result-table__published" />
              </colgroup>
              <thead><tr><th><input :checked="isCurrentPageFullySelected" :indeterminate.prop="hasPartialCurrentPageSelection" type="checkbox" aria-label="全选当前页" :disabled="!pagedRecords.length" @change="toggleCurrentPageSelection($event.target.checked)" /></th><th>序号</th><th>相关度</th><th>{{ category === 'patent' ? '公开(公告)号' : '来源 / 编号' }}</th><th>标题</th><th>{{ category === 'patent' ? '法律状态/事件' : '状态' }}</th><th>{{ category === 'patent' ? '当前申请(专利权)人' : '发布 / 归属单位' }}</th><th>应用领域分类</th><th>{{ category === 'patent' ? '申请日' : '形成日期' }}</th><th>{{ category === 'patent' ? '公开(公告)日' : '发布日期' }}</th></tr></thead>
              <tbody>
                <tr v-for="(item, index) in pagedRecords" :key="item.id">
                  <td><input v-model="selectedResults" type="checkbox" :value="item.id" :aria-label="`选择${item.title}`" /></td>
                  <td>{{ (resultPage - 1) * pageSize + index + 1 }}</td>
                  <td><b class="semantic-result-score">{{ item.similarity }}</b></td>
                  <td class="semantic-result-number"><i></i><small>{{ item.number }}</small></td>
                  <td class="semantic-result-title"><div class="semantic-result-title__content"><span :class="{ 'has-preview': Boolean(item.preview) }" :title="item.title" @pointerenter="showPatentPreview(item, $event)" @pointerleave="scheduleHoverPreviewClose">{{ item.title }}</span></div></td>
                  <td class="semantic-result-statuses"><span v-for="status in statusItems(item.status)" :key="status" class="semantic-result-status" :class="statusTone(status)">{{ status }}</span></td>
                  <td class="semantic-result-applicant">{{ item.applicant }}</td><td><div class="semantic-result-tags"><span v-for="tag in areaTags(item)" :key="tag" :class="{ more: tag.startsWith('+') }">{{ tag }}</span></div></td><td>{{ item.filing }}</td><td>{{ item.publication }}</td>
                </tr>
                <tr v-if="!pagedRecords.length"><td class="semantic-empty" colspan="10">暂无此类检索结果</td></tr>
              </tbody>
            </table>
          </div>
      </section>
      </template>
    </main>
    <Teleport to="body">
      <aside v-if="hoverPreview" class="semantic-patent-hover-card" role="tooltip" :style="{ left: `${hoverPreviewPosition.left}px`, top: `${hoverPreviewPosition.top}px` }" @pointerenter="clearHoverPreviewTimer" @pointerleave="scheduleHoverPreviewClose">
        <div class="semantic-patent-hover-card__abstract">{{ hoverPreview.preview.abstract }}</div>
        <figure class="semantic-patent-hover-card__figure"><img :src="hoverPreview.preview.image" :alt="`${hoverPreview.number} 专利附图`" /></figure>
      </aside>
    </Teleport>
    <Teleport to="body">
      <div v-if="queryDialogOpen" class="semantic-query-dialog-layer" @click.self="queryDialogOpen = false">
        <section class="semantic-query-dialog" role="dialog" aria-modal="true" aria-labelledby="semantic-query-dialog-title">
          <header><div><span>检索内容</span><h2 id="semantic-query-dialog-title">查看并修改原文</h2></div><button type="button" aria-label="关闭" @click="queryDialogOpen = false"><X :size="20" /></button></header>
          <div class="semantic-query-dialog__body"><label for="semantic-query-dialog-input">检索原文</label><textarea id="semantic-query-dialog-input" v-model="query" rows="12" /></div>
          <footer><button class="semantic-query-dialog__copy" type="button" :disabled="!query.trim()" @click="copyQuery"><Copy :size="16" />复制原文</button><div><button class="semantic-query-dialog__close" type="button" @click="queryDialogOpen = false">取消</button><button type="button" :disabled="!query.trim()" @click="runDialogSearch"><Search :size="16" />发起新检索</button></div></footer>
        </section>
      </div>
    </Teleport>
  </section>
</template>
