<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FileUp, ArrowLeft, ArrowRight, Lightbulb, Database, FileCheck2, UserRoundCheck, SlidersHorizontal, Check, ExternalLink, Search } from '@lucide/vue'
import StepRail from '../components/StepRail.vue'
import BaseDrawer from '../components/BaseDrawer.vue'
import { useInnovationStore } from '../stores/innovation.js'
import { useAuthStore } from '../stores/auth.js'
import { useTasksStore } from '../stores/tasks.js'
import { useUiStore } from '../stores/ui.js'

const route = useRoute()
const router = useRouter()
const innovation = useInnovationStore()
const auth = useAuthStore()
const tasks = useTasksStore()
const ui = useUiStore()
const steps = ['上传材料', '项目信息', '技术与创新点', '相关证据', '政策与规则', '生成报告']
const stageIds = ['upload', 'project', 'analysis', 'evidence', 'policy', 'report']
const stageAlias = { themes: 'evidence', points: 'evidence', confirm: 'project', setup: 'project', run: 'report' }
const current = ref(0)
const fileReady = ref(false)
const sourceTab = ref('全部')
const detail = ref(null)
const generating = ref(false)
const evidenceScope = ref('技术主题资料')
const supplementOpen = ref(false)
const fullReport = ref(false)

const canSwitchMode = computed(() => auth.isAdmin || auth.profile?.role === 'reviewer')
const visibleEvidence = computed(() => innovation.evidence.filter((item) => sourceTab.value === '全部' || item.type === sourceTab.value))

function syncRoute() {
  innovation.setMode(route.params.mode)
  const stage = stageAlias[route.params.stage] || route.params.stage || 'upload'
  current.value = Math.max(0, stageIds.indexOf(stage))
  innovation.maxStep = Math.max(innovation.maxStep, current.value)
}
watch(() => [route.params.mode, route.params.stage], syncRoute, { immediate: true })

function routeTo(index, mode = innovation.mode) {
  router.replace(`/innovation/${mode}/${stageIds[index]}`)
}
function selectMode(mode) {
  innovation.setMode(mode)
  routeTo(current.value, mode)
}
function next() {
  if (current.value === 0 && !fileReady.value) { ui.notify('请先选择材料或使用示例', 'warning'); return }
  const nextIndex = Math.min(current.value + 1, steps.length - 1)
  if (nextIndex === steps.length - 1) {
    generating.value = true
    setTimeout(() => {
      generating.value = false
      innovation.completeStep(current.value)
      routeTo(nextIndex)
      tasks.addTask('innovation', innovation.project.name, '创新性分析报告')
    }, 900)
    return
  }
  innovation.completeStep(current.value)
  routeTo(nextIndex)
}
function back() { if (current.value > 0) routeTo(current.value - 1) }
function selectStep(index) { if (index <= innovation.maxStep) routeTo(index) }
</script>

<template>
  <section class="innovation-workspace">
    <header class="innovation-head">
      <button type="button" class="back-link" @click="router.push('/agents')"><ArrowLeft :size="17" />智能应用首页</button>
      <div><i><Lightbulb :size="22" /></i><span><b>{{ innovation.isReviewer ? '创新性分析 · 专家评审' : '创新性分析 · 科研人员' }}</b><small>{{ innovation.isReviewer ? '完整方案评审、评分与裁判依据' : '技术构想梳理、创新点核验与改进建议' }}</small></span></div>
      <div v-if="canSwitchMode" class="mode-switch"><button :class="{ active: !innovation.isReviewer }" @click="selectMode('researcher')">科研人员入口</button><button :class="{ active: innovation.isReviewer }" @click="selectMode('reviewer')">管理员评审入口</button></div>
    </header>
    <div class="innovation-layout">
      <aside class="innovation-rail"><h1>创新性分析</h1><StepRail :steps="steps" :current="current" :max="innovation.maxStep" @select="selectStep" /></aside>
      <main class="innovation-stage">
        <section v-if="current === 0" class="innovation-upload">
          <header><span>{{ innovation.isReviewer ? '完整方案评审入口' : '技术构想分析入口' }}</span><h1>{{ innovation.isReviewer ? '上传待评审的完整技术方案' : '从现有构想或项目材料开始' }}</h1><p>{{ innovation.isReviewer ? '评审材料通常包含完整方案、指标、实施路径和已有验证数据。' : '科研人员可以从不完整的构想开始，系统会引导补充必要信息。' }}</p></header>
          <button type="button" class="upload-zone" :class="{ ready: fileReady }" @click="fileReady = true"><FileUp :size="29" /><span><b>{{ fileReady ? '复杂煤矿环境下智能巡检机器人项目建议书.docx' : '选择 Word 或 PDF 材料' }}</b><small>{{ fileReady ? '已读取 28 页，识别 9 个章节与 3 个创新点' : '文件解析后作为本次创新性分析的任务输入' }}</small></span><em>{{ fileReady ? '重新选择' : '浏览文件' }}</em></button>
          <div class="example-start"><span>没有完整材料？</span><button type="button" @click="fileReady = true">使用示例项目开始 <ArrowRight :size="16" /></button></div>
          <aside><UserRoundCheck :size="21" /><span><b>角色差异</b><small>{{ innovation.isReviewer ? '评审人员可查看评分规则、权重和完整评价依据。' : '科研人员只看到与方案改进相关的创新判断，不显示裁判评分。' }}</small></span></aside>
        </section>

        <section v-else-if="current === 1" class="innovation-form-stage">
          <div class="stage-title"><span>02</span><h1>项目信息确认</h1><p>核对从材料中提取的信息，本页内容单独保存。</p></div>
          <div class="form-grid"><label>项目名称<input v-model="innovation.project.name" /></label><label>申报单位<input v-model="innovation.project.applicant" /></label><label>项目负责人<input v-model="innovation.project.owner" /></label><label>技术领域<input v-model="innovation.project.field" /></label></div>
          <label class="large-textarea compact"><span>拟解决的技术问题</span><textarea v-model="innovation.project.problem" /></label>
          <label class="large-textarea compact"><span>核心技术方案</span><textarea v-model="innovation.project.solution" /></label>
          <label class="large-textarea compact"><span>预期技术目标</span><textarea v-model="innovation.project.targets" /></label>
        </section>

        <section v-else-if="current === 2" class="innovation-form-stage">
          <div class="stage-title"><span>03</span><h1>技术与创新点分析</h1><p>系统提取技术主题与创新点，可修改但不保留上一版内容。</p></div>
          <div class="analysis-summary"><Database :size="21" /><span><b>已提取 2 个技术主题与 3 个创新点</b><small>来源：项目材料正文、技术路线与预期指标章节</small></span></div>
          <section class="point-editor"><header><h2>创新点</h2><span>直接编辑后进入证据核验</span></header><label v-for="(point, index) in innovation.points" :key="index"><i>0{{ index + 1 }}</i><textarea v-model="innovation.points[index]" /></label></section>
          <aside v-if="innovation.isReviewer" class="reviewer-note"><SlidersHorizontal :size="21" /><span><b>评审输入完整性</b><small>当前材料包含实施方案和阶段验证数据，可进入量化评价；缺失项会降低对应维度的证据等级。</small></span></aside>
        </section>

        <section v-else-if="current === 3" class="innovation-evidence-stage">
          <div class="stage-title"><span>04</span><h1>相关证据确认</h1><p>按技术主题和创新点检索 Top 100，勾选后作为报告依据。</p></div>
          <div class="evidence-scope-switch"><button v-for="scope in ['技术主题资料','创新点资料']" :key="scope" :class="{ active: evidenceScope === scope }" @click="evidenceScope = scope">{{ scope }}</button></div>
          <div class="evidence-toolbar"><div><button v-for="tab in ['全部', '专利', '论文', '政策', '内部资料']" :key="tab" :class="{ active: sourceTab === tab }" @click="sourceTab = tab">{{ tab }}</button></div><span>排序：语义相似度</span></div>
          <div class="innovation-evidence-list"><article v-for="item in visibleEvidence" :key="item.id" :class="{ selected: item.selected }"><header><label><input v-model="item.selected" type="checkbox" /><span>{{ item.type }}</span></label><b>相关度 {{ item.relevance }}%</b></header><h2>{{ item.title }}</h2><p>{{ item.id }} · {{ item.source }} · {{ item.date }}</p><button type="button" @click="detail = item">查看详情 <ExternalLink :size="15" /></button></article></div>
          <button class="supplement-search" type="button" @click="supplementOpen = true">＋ 补充检索并加入当前证据池</button>
        </section>

        <section v-else-if="current === 4" class="innovation-policy-stage">
          <div class="stage-title"><span>05</span><h1>{{ innovation.isReviewer ? '政策与评价规则' : '政策依据确认' }}</h1><p>{{ innovation.isReviewer ? '确认政策条款，并选择管理员发布的评价模板。' : '仅列出与当前方案相关的政策依据。' }}</p></div>
          <div class="policy-list"><article v-for="item in innovation.evidence.filter(item => item.type === '政策')" :key="item.id"><Check :size="18" /><div><b>{{ item.title }}</b><span>{{ item.source }} · {{ item.id }}</span></div><button type="button" @click="detail = item">查看</button></article></div>
          <template v-if="innovation.isReviewer">
            <section class="score-config"><header><div><h2>评价模板</h2><p>模板由平台管理员维护，选择后会影响报告评价方式。</p></div><select v-model="innovation.selectedTemplate"><option>标准创新性评价 V2.3</option><option>重大专项评价 V1.1</option></select></header><div><label>新颖性 <input v-model.number="innovation.weights.novelty" type="number" min="0" max="100" /><span>%</span></label><label>先进性 <input v-model.number="innovation.weights.advancement" type="number" min="0" max="100" /><span>%</span></label><label>应用价值 <input v-model.number="innovation.weights.applicability" type="number" min="0" max="100" /><span>%</span></label></div><footer>当前权重合计：<b>{{ innovation.weights.novelty + innovation.weights.advancement + innovation.weights.applicability }}%</b></footer></section>
          </template>
        </section>

        <section v-else class="innovation-report" :class="{ fullscreen: fullReport }">
          <header class="report-cover"><div><span>创新性分析报告</span><h1>{{ innovation.project.name }}</h1><p>报告人：{{ auth.profile?.name }}（{{ auth.profile?.account }}） · 生成日期：2026-08-21</p></div><div class="report-cover-actions"><button class="button ghost" @click="routeTo(2)">修改报告依据</button><button class="button secondary" @click="fullReport = !fullReport">{{ fullReport ? '退出全屏' : '网页全屏' }}</button><FileCheck2 :size="34" /></div></header>
          <section class="report-conclusion"><span>综合结论</span><h2>项目技术组合具有明确应用场景与一定差异化基础，建议补强极端工况实测和关键算法对比证据后进入下一阶段。</h2><p>本结论基于当前提交材料、已选择专利与论文证据、政策条款以及人工确认信息形成。</p></section>
          <section v-if="innovation.isReviewer" class="review-score"><div><span>专家评价得分</span><b>82<small>/100</small></b></div><ul><li><span>新颖性</span><b>84</b></li><li><span>先进性</span><b>79</b></li><li><span>应用价值</span><b>85</b></li></ul><p>评分用于专家裁判参考，不向科研人员版本展示。</p></section>
          <section class="report-points"><h2>创新点判断</h2><article v-for="(point, index) in innovation.points" :key="point"><i>0{{ index + 1 }}</i><div><b>{{ point }}</b><p>现有证据提供部分技术支撑，但目标工况和协同机制仍需补充对比验证。</p><button type="button" class="citation" @click="detail = innovation.evidence[index % innovation.evidence.length]">依据 {{ innovation.evidence[index % innovation.evidence.length].id }}</button></div></article></section>
          <section class="report-advice"><h2>后续建议</h2><ol><li>补充粉尘浓度、照度和通信中断时长下的对照试验数据。</li><li>明确各传感器失效时的降级顺序与安全边界。</li><li>围绕核心算法和系统协同机制继续开展补充检索。</li></ol></section>
        </section>

        <footer class="innovation-actions"><button v-if="current > 0" class="button ghost" type="button" @click="back"><ArrowLeft :size="17" />上一步</button><span /><button v-if="current < steps.length - 1" class="button primary" type="button" :disabled="generating" @click="next"><template v-if="generating">正在生成报告…</template><template v-else>{{ current === steps.length - 2 ? '确认并生成报告' : '确认并继续' }}<ArrowRight :size="17" /></template></button><button v-else class="button primary" type="button" @click="ui.notify('已生成可编辑 Word 报告', 'success')">导出 Word 报告</button></footer>
      </main>
    </div>
    <BaseDrawer :open="Boolean(detail)" title="证据详情" @close="detail = null"><div v-if="detail" class="source-detail"><span class="eyebrow">{{ detail.type }} · {{ detail.id }}</span><h2>{{ detail.title }}</h2><ul><li>正式来源：{{ detail.source }}</li><li>公开日期：{{ detail.date }}</li><li>语义相关度：{{ detail.relevance }}%</li></ul><p>该资料已纳入本次证据池，可用于报告引用与结论核验。</p></div></BaseDrawer>
    <BaseDrawer :open="supplementOpen" title="补充检索" width="720px" @close="supplementOpen = false"><div class="supplement-drawer"><header><span class="eyebrow">{{ evidenceScope }}</span><h2>检索并加入补充证据</h2><p>补充结果会排除当前证据池中已经存在的资料。</p></header><label class="search-field"><Search :size="17" /><input placeholder="输入补充检索问题" value="井下粉尘环境多模态感知可靠性验证" /></label><div class="supplement-results"><label v-for="item in innovation.evidence.slice(0,3)" :key="item.id"><input type="checkbox" /><span><b>{{ item.title }}</b><small>{{ item.type }} · {{ item.id }} · 相关度 {{ item.relevance }}%</small></span></label></div><button class="button primary wide" @click="supplementOpen = false; ui.notify('已加入 2 条补充证据','success')">添加所选资料</button></div></BaseDrawer>
  </section>
</template>
