<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Search, SlidersHorizontal, ExternalLink, Image, AlertTriangle, CheckCircle2, Database, ChevronDown } from '@lucide/vue'
import BaseDrawer from '../../components/BaseDrawer.vue'
import { sourceCatalog } from '../../data/platform.js'
import { useUiStore } from '../../stores/ui.js'

const router = useRouter()
const ui = useUiStore()
const query = ref('检索煤岩识别技术路线相关专利与论文，重点关注多模态传感、弱光粉尘环境适配、井下通信中断时的任务连续性，以及已开展现场验证的技术方案。')
const searched = ref(false)
const type = ref('全部')
const sort = ref('语义相关度')
const detail = ref(null)
const patentNotice = ref(true)
const allResults = computed(() => Object.values(sourceCatalog).flat())
const results = computed(() => {
  const list = type.value === '全部' ? allResults.value : sourceCatalog[type.value]
  return [...list].sort((a, b) => sort.value === '公开日期' ? b.date.localeCompare(a.date) : b.relevance - a.relevance)
})
</script>

<template>
  <section class="structured-workspace semantic-workspace">
    <header class="workspace-bar"><button type="button" @click="router.push('/agents')"><ArrowLeft :size="17" />智能应用首页</button><div><b>语义检索</b><span>专利 · 论文 · 政策 · 内部资料</span></div><span class="status-chip success"><CheckCircle2 :size="14" />检索服务可用</span></header>
    <main class="semantic-main">
      <section class="semantic-query" :class="{ compact: searched }"><div><span class="eyebrow">检索问题</span><h1>{{ searched ? '调整检索问题' : '描述需要检索的技术问题' }}</h1><p v-if="!searched">建议说明技术主题、应用环境、关键指标和需要排除的方案，输入越完整，语义召回越准确。</p></div><label><textarea v-model="query" placeholder="例如：检索煤岩识别技术路线相关专利与论文……" /><span>{{ query.length }} 字 · 建议不少于 200 字</span></label><button class="button primary" type="button" :disabled="!query.trim()" @click="searched = true"><Search :size="18" />{{ searched ? '重新检索' : '开始检索' }}</button></section>
      <section v-if="searched" class="semantic-results">
        <aside v-if="patentNotice" class="service-notice"><AlertTriangle :size="21" /><div><b>专利数据服务状态</b><p>智慧芽专利在线服务当前暂停；专利结果使用平台最近一次同步数据，数据截至 2026-08-18。</p></div><button type="button" @click="patentNotice = false">我知道了</button></aside>
        <header><div><span class="eyebrow">召回结果</span><h2>{{ results.length }} 条高相关资料</h2><p>数据来源、排序规则和关键字段均在列表中明确展示。</p></div><div><label><SlidersHorizontal :size="16" /><select v-model="sort"><option>语义相关度</option><option>公开日期</option></select><ChevronDown :size="15" /></label></div></header>
        <nav class="result-tabs"><button v-for="item in ['全部','专利','论文','政策','内部资料']" :key="item" :class="{ active: type === item }" @click="type = item">{{ item }}<span>{{ item === '全部' ? allResults.length : sourceCatalog[item].length }}</span></button></nav>
        <div class="semantic-result-list"><article v-for="item in results" :key="item.id"><label><input type="checkbox" />选择</label><div><span>{{ item.type }} · {{ item.id }}</span><h3>{{ item.title }}</h3><p>{{ item.summary }}</p><footer><span><Database :size="14" />{{ item.source }}</span><span>{{ item.owner }}</span><span>{{ item.date }}</span></footer></div><strong>{{ item.relevance }}<small>%</small><em>语义相关度</em></strong><div class="result-actions"><button v-if="item.images" type="button" @click="detail = { ...item, showImage: true }"><Image :size="16" />查看图片</button><button type="button" @click="detail = item">查看详情 <ExternalLink :size="15" /></button></div></article></div>
      </section>
    </main>
    <BaseDrawer :open="Boolean(detail)" :title="detail?.title" width="720px" @close="detail = null"><div v-if="detail" class="source-detail"><span class="eyebrow">{{ detail.type }} · {{ detail.id }}</span><h2>{{ detail.title }}</h2><div v-if="detail.showImage" class="patent-figure"><Image :size="42" /><b>专利附图 {{ detail.images }} 张</b><p>点击附图缩略图可逐张放大查看。</p></div><ul><li>正式来源：{{ detail.source }}</li><li>申请人／作者：{{ detail.owner }}</li><li>公开日期：{{ detail.date }}</li><li>语义相关度：{{ detail.relevance }}%</li><li>排序规则：当前问题与标题、摘要、权利要求的向量相似度</li></ul><p>{{ detail.summary }}</p><button class="button primary wide" @click="ui.notify('已打开资料原文')">打开资料原文 <ExternalLink :size="17" /></button></div></BaseDrawer>
  </section>
</template>
