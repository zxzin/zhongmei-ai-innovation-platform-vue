<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BookmarkPlus, Check, Copy, Download, ExternalLink, Search, X } from '@lucide/vue'
import ApplicationHeading from '../../components/ApplicationHeading.vue'
import BaseDrawer from '../../components/BaseDrawer.vue'
import { semanticReferenceResults } from '../../data/semanticResults.js'
import { useUiStore } from '../../stores/ui.js'

const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const query = ref('')
const semanticDemoInput = '一种适用于煤矿井下复杂环境的智能巡检机器人及其控制方法，包括移动底盘、激光雷达、低照度摄像头、热成像模块、惯性测量单元和气体传感器；通过多传感器融合定位建立巷道环境地图，并根据粉尘浓度、照度、通信质量和设备状态动态调整感知权重。在 5G 专网通信中断或信号弱覆盖区域，机器人将巡检任务、定位轨迹和异常告警缓存在本地任务队列中，按照预设安全策略继续完成自主巡检；通信恢复后执行断点续传与数据一致性校验。'
const searched = ref(false)
const category = ref('patent')
const sort = ref('相关度')
const selectedResults = ref([])
const savedResultIds = ref([])
const resultPage = ref(1)
const pageSize = 20
const detail = ref(null)
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
const pageNumbers = computed(() => Array.from({ length: Math.min(totalPages.value, 5) }, (_, index) => index + 1))
const displayRange = computed(() => {
  if (!sortedRecords.value.length) return '0–0'
  const start = (resultPage.value - 1) * pageSize + 1
  return `${start}–${Math.min(resultPage.value * pageSize, sortedRecords.value.length)}`
})

function setCategory(value) { category.value = value; resultPage.value = 1; hoverPreview.value = null }
function changePage(page) { resultPage.value = Math.min(Math.max(1, page), totalPages.value) }
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
  if (route.params.stage !== 'results') router.push('/agent/semantic/results')
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
function isSaved(item) { return savedResultIds.value.includes(item.id) }
function saveItem(item) {
  if (isSaved(item)) {
    ui.notify('该资料已在个人知识库中', 'success')
    return
  }
  savedResultIds.value.push(item.id)
  ui.notify(`已将${sourceLabel(item.type)}保存至个人知识库`, 'success')
}
function saveSelected() {
  if (!selectedResults.value.length) return
  const pendingIds = selectedResults.value.filter((id) => !savedResultIds.value.includes(id))
  if (pendingIds.length) savedResultIds.value.push(...pendingIds)
  const savedCount = pendingIds.length
  selectedResults.value = []
  ui.notify(savedCount ? `已将 ${savedCount} 条资料保存至个人知识库` : '已勾选资料均已在个人知识库中', 'success')
}
function downloadItem(item) {
  const content = [
    `资料类型：${sourceLabel(item.type)}`,
    `标题：${item.title}`,
    item.originalTitle ? `英文标题：${item.originalTitle}` : '',
    `编号：${item.number || '-'}`,
    `摘要：${item.summary || '-'}`,
  ].filter(Boolean).join('\n\n')
  const objectUrl = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = `${item.title.replace(/[\\/:*?"<>|]/g, '_')}.txt`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
  ui.notify(`已开始下载《${item.title}》`, 'success')
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
          <nav class="semantic-result-tabs" role="tablist" aria-label="结果来源分类">
            <div class="semantic-result-tabs__list"><button v-for="item in [['patent','专利'],['paper','论文'],['policy','政策'],['internal','内部资料']]" :key="item[0]" :class="{ active: category === item[0] }" type="button" role="tab" :aria-selected="category === item[0]" @click="setCategory(item[0])">{{ item[1] }}</button></div>
          </nav>
          <header class="semantic-results-toolbar-v3">
            <div class="semantic-results-toolbar-v3__count"><b>{{ filteredRecords.length.toLocaleString() }} {{ category === 'paper' ? '篇文献' : category === 'patent' ? '条专利' : '条数据' }}</b><span>第 {{ resultPage }} 页，每页 {{ pageSize }} 条</span></div>
            <div class="semantic-results-toolbar-v3__controls">
              <button class="semantic-results-toolbar-v3__save" type="button" title="一键保存已勾选到个人知识库" :disabled="!selectedResults.length" @click="saveSelected"><BookmarkPlus :size="16" />保存</button>
              <label class="semantic-results-toolbar-v3__filter"><span class="sr-only">结果排序</span><select v-model="sort" aria-label="结果排序" @change="resultPage = 1"><option value="相关度">最相关</option><option :value="category === 'paper' ? '发表时间' : '申请日'">{{ category === 'paper' ? '最新发表' : '最新申请' }}</option></select></label>
            </div>
          </header>
          <div v-if="category === 'paper'" class="literature-result-list">
            <article v-for="(item, index) in pagedRecords" :key="item.id" class="literature-result-item">
              <div class="literature-result-item__index"><label class="literature-result-item__selection"><input v-model="selectedResults" type="checkbox" :value="item.id" :aria-label="`选择${item.title}`" /><span class="sr-only">选择文献</span></label></div>
              <div class="literature-result-item__body">
                <header><div class="literature-result-item__title-row"><b class="literature-result-item__order">{{ (resultPage - 1) * pageSize + index + 1 }}</b><button type="button" :title="item.title" @click="detail = item"><span class="literature-result-item__title-line"><strong>{{ item.title }}</strong><span class="literature-result-item__year">{{ item.year || item.publication || '-' }}</span></span><small v-if="item.originalTitle">{{ item.originalTitle }}</small></button><div class="semantic-result-inline-actions"><button type="button" :class="{ saved: isSaved(item) }" :aria-label="`保存《${item.title}》到个人知识库`" :title="isSaved(item) ? '已保存到个人知识库' : '保存到个人知识库'" @click.stop="saveItem(item)"><Check v-if="isSaved(item)" :size="15" /><BookmarkPlus v-else :size="15" /></button><button type="button" :aria-label="`下载《${item.title}》`" title="下载" @click.stop="downloadItem(item)"><Download :size="15" /></button></div></div><span v-if="item.citations && item.citations !== '-'" class="literature-result-item__citation">被引 {{ item.citations }}</span></header>
                <dl><div><dt>作者</dt><dd>{{ item.authors || item.applicant }}</dd></div><div><dt>期刊 / 会议</dt><dd>{{ item.journal || item.number }}</dd></div><div v-if="item.number && item.number !== '—'"><dt>DOI</dt><dd>{{ item.number }}</dd></div></dl>
                <p v-if="item.summary && item.summary !== '—'" class="literature-result-item__abstract">{{ item.summary }}</p>
                <footer><span v-for="topic in paperTopics(item)" :key="topic">{{ topic }}</span><em v-if="item.applicant && item.applicant !== '—'">{{ item.applicant }}</em></footer>
              </div>
            </article>
            <div v-if="!pagedRecords.length" class="semantic-empty">暂无此类检索结果</div>
          </div>
          <div v-else class="semantic-result-table-wrap">
            <table>
              <thead><tr><th></th><th>序号</th><th>相关度</th><th>{{ category === 'patent' ? '公开(公告)号' : '来源 / 编号' }}</th><th>标题</th><th>{{ category === 'patent' ? '法律状态/事件' : '状态' }}</th><th>{{ category === 'patent' ? '当前申请(专利权)人' : '发布 / 归属单位' }}</th><th>应用领域分类</th><th>{{ category === 'patent' ? '申请日' : '形成日期' }}</th><th>{{ category === 'patent' ? '公开(公告)日' : '发布日期' }}</th></tr></thead>
              <tbody>
                <tr v-for="(item, index) in pagedRecords" :key="item.id">
                  <td><input v-model="selectedResults" type="checkbox" :value="item.id" :aria-label="`选择${item.title}`" /></td>
                  <td>{{ (resultPage - 1) * pageSize + index + 1 }}</td>
                  <td><b class="semantic-result-score">{{ item.similarity }}</b></td>
                  <td class="semantic-result-number"><i></i><small>{{ item.number }}</small></td>
                  <td class="semantic-result-title"><div class="semantic-result-title__content"><button type="button" :class="{ 'has-preview': Boolean(item.preview) }" :title="item.title" @pointerenter="showPatentPreview(item, $event)" @pointerleave="scheduleHoverPreviewClose" @click="detail = item">{{ item.title }}</button><div v-if="category === 'patent'" class="semantic-result-inline-actions"><button type="button" :class="{ saved: isSaved(item) }" :aria-label="`保存《${item.title}》到个人知识库`" :title="isSaved(item) ? '已保存到个人知识库' : '保存到个人知识库'" @click.stop="saveItem(item)"><Check v-if="isSaved(item)" :size="15" /><BookmarkPlus v-else :size="15" /></button><button type="button" :aria-label="`下载《${item.title}》`" title="下载" @click.stop="downloadItem(item)"><Download :size="15" /></button></div></div></td>
                  <td class="semantic-result-statuses"><span v-for="status in statusItems(item.status)" :key="status" class="semantic-result-status" :class="statusTone(status)">{{ status }}</span></td>
                  <td class="semantic-result-applicant">{{ item.applicant }}</td><td><div class="semantic-result-tags"><span v-for="tag in areaTags(item)" :key="tag" :class="{ more: tag.startsWith('+') }">{{ tag }}</span></div></td><td>{{ item.filing }}</td><td>{{ item.publication }}</td>
                </tr>
                <tr v-if="!pagedRecords.length"><td class="semantic-empty" colspan="10">暂无此类检索结果</td></tr>
              </tbody>
            </table>
          </div>
          <footer class="semantic-pagination"><span>显示第 {{ displayRange }} 条，共 {{ filteredRecords.length }} 条结果</span><div><button type="button" :disabled="resultPage === 1" @click="changePage(resultPage - 1)">上一页</button><button v-for="page in pageNumbers" :key="page" type="button" :class="{ active: resultPage === page }" @click="changePage(page)">{{ page }}</button><i v-if="totalPages > pageNumbers.length">…</i><button type="button" :disabled="resultPage === totalPages" @click="changePage(resultPage + 1)">下一页</button></div></footer>
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
    <BaseDrawer :open="Boolean(detail)" :title="detail?.title" width="780px" @close="detail = null">
      <article v-if="detail" class="patent-drawer-detail">
        <section class="patent-drawer-title">
          <div class="patent-drawer-title__label">{{ detail.type === 'paper' ? '文献概览' : 'Patsnap专利标题' }} <span v-if="detail.type !== 'paper'">AI</span></div>
          <p>{{ detail.patentTitle || detail.summary }}</p>
        </section>
        <section class="patent-drawer-section">
          <header><h3>摘要</h3><i></i></header>
          <div class="patent-drawer-abstract" :class="{ 'patent-drawer-abstract--without-image': !detail.preview }">
            <p>{{ detail.preview?.abstract || detail.summary }}</p>
            <figure v-if="detail.preview"><img :src="detail.preview.image" :alt="`${detail.number} 专利附图`" /></figure>
          </div>
        </section>
        <section v-if="detail.aiSummary?.length" class="patent-drawer-section patent-drawer-section--ai">
          <header><h3>AI 专利摘要 <span>AI</span></h3><i></i></header>
          <div class="patent-drawer-ai-list"><section v-for="item in detail.aiSummary" :key="item.title"><h4>{{ item.title }} <span>AI</span></h4><p>{{ item.content }}</p></section></div>
        </section>
      </article>
      <template #footer><button v-if="detail" class="button primary wide" @click="ui.notify(detail.type === 'paper' ? '已打开文献原文' : '已打开资料原文')">{{ detail.type === 'paper' ? '打开文献原文' : '打开资料原文' }} <ExternalLink :size="17" /></button></template>
    </BaseDrawer>
  </section>
</template>
