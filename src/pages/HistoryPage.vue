<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, CalendarDays, RotateCcw, ArrowRight, FileCheck2, Trash2 } from '@lucide/vue'
import PageHeader from '../components/PageHeader.vue'
import BaseDrawer from '../components/BaseDrawer.vue'
import { agents, agentMap } from '../data/agents.js'
import { useTasksStore } from '../stores/tasks.js'
import { useUiStore } from '../stores/ui.js'

const router = useRouter(); const tasks = useTasksStore(); const ui = useUiStore()
const query = ref(''); const application = ref('all'); const range = ref('all'); const sort = ref('time'); const selected = ref([])
const filtered = computed(() => tasks.records.filter((record) => {
  const matchesQuery = !query.value || `${record.title}${record.id}${record.user}`.toLowerCase().includes(query.value.toLowerCase())
  const recordTime = new Date(record.date.replace(' ', 'T')).getTime()
  const cutoff = range.value === 'week' ? new Date('2026-08-14T00:00:00').getTime() : range.value === 'month' ? new Date('2026-07-22T00:00:00').getTime() : 0
  const matchesRange = !cutoff || recordTime >= cutoff
  return matchesQuery && matchesRange && (application.value === 'all' || record.agent === application.value)
}).sort((a,b) => sort.value === 'name' ? a.title.localeCompare(b.title,'zh-CN') : b.date.localeCompare(a.date)))
const allSelected = computed(() => filtered.value.length > 0 && filtered.value.every((item) => selected.value.includes(item.id)))
function reset() { query.value = ''; application.value = 'all'; range.value = 'all'; sort.value = 'time'; selected.value = [] }
function toggleAll() { selected.value = allSelected.value ? [] : filtered.value.map((item) => item.id) }
function deleteSelected() { tasks.removeTasks(selected.value); selected.value = []; ui.notify('所选历史记录已删除','warning') }
function reopen(record) { tasks.selectedRecord = null; router.push(record.agent === 'innovation' ? '/innovation/researcher/report' : `/agent/${record.agent}/report`) }
</script>

<template>
  <section class="page-container history-page">
    <PageHeader title="历史记录" description="查找每次独立智能应用调用，查看输入快照、过程依据和已形成成果。" eyebrow="任务与成果" />
    <div class="filter-bar history-filters"><label class="search-field"><Search :size="18" /><input v-model="query" placeholder="搜索任务名称、编号或用户" /></label><label><span>智能应用</span><select v-model="application"><option value="all">全部智能应用</option><option v-for="item in agents" :key="item.id" :value="item.id">{{ item.name }}</option></select></label><label><span>时间</span><select v-model="range"><option value="all">全部时间</option><option value="week">近 7 天</option><option value="month">近 30 天</option></select></label><label><span>排序</span><select v-model="sort"><option value="time">最近使用</option><option value="name">任务名称</option></select></label><button class="button ghost" @click="reset"><RotateCcw :size="17" />重置</button></div>
    <div class="history-summary"><span>共 <b>{{ filtered.length }}</b> 条记录 · 每条记录对应一次智能应用调用</span><span><CalendarDays :size="16" />数据截至 2026-08-21</span></div>
    <div class="history-bulkbar"><label><input type="checkbox" :checked="allSelected" @change="toggleAll" />选择当前列表</label><span v-if="selected.length">已选择 {{ selected.length }} 条</span><button v-if="selected.length" class="button ghost" @click="deleteSelected"><Trash2 :size="16" />删除所选</button><button v-if="tasks.records.length" class="button ghost" @click="tasks.clearTasks(); selected = []; ui.notify('历史记录已全部删除','warning')">全部删除</button></div>
    <div class="record-list enhanced-record-list">
      <article v-for="record in filtered" :key="record.id" class="record-row"><label class="record-check"><input v-model="selected" type="checkbox" :value="record.id" /><span class="sr-only">选择 {{ record.title }}</span></label><i><component :is="agentMap[record.agent].icon" :size="20" /></i><button class="record-open" @click="tasks.selectedRecord = record"><div class="record-main"><span>{{ agentMap[record.agent].name }} · {{ record.date }}</span><h2>{{ record.title }}</h2><p>{{ record.id }} · {{ record.user }} · {{ record.org }}</p></div><div class="record-result"><b>{{ record.result }}</b><span>{{ record.status }}</span></div><ArrowRight :size="19" /></button><button class="icon-button record-delete" aria-label="删除记录" @click="tasks.removeTask(record.id); ui.notify('历史记录已删除','warning')"><Trash2 :size="17" /></button></article>
      <div v-if="!filtered.length" class="empty-state"><Search :size="28" /><h2>没有匹配记录</h2><p>调整关键词或智能应用条件后重新查找。</p></div>
    </div>
    <BaseDrawer :open="Boolean(tasks.selectedRecord)" :title="tasks.selectedRecord?.title" @close="tasks.selectedRecord = null"><div v-if="tasks.selectedRecord" class="record-detail"><div class="result-callout"><FileCheck2 :size="24" /><div><span>已形成成果</span><b>{{ tasks.selectedRecord.result }}</b></div></div><dl><div><dt>任务编号</dt><dd>{{ tasks.selectedRecord.id }}</dd></div><div><dt>使用智能应用</dt><dd>{{ agentMap[tasks.selectedRecord.agent].name }}</dd></div><div><dt>发起用户</dt><dd>{{ tasks.selectedRecord.user }}</dd></div><div><dt>所属单位</dt><dd>{{ tasks.selectedRecord.org }}</dd></div><div><dt>创建时间</dt><dd>{{ tasks.selectedRecord.date }}</dd></div><div><dt>运行结果</dt><dd>{{ tasks.selectedRecord.status }}</dd></div></dl><section><h3>保留内容</h3><p>输入快照、过程步骤、引用来源、关键操作与成果文件均与任务编号关联，可继续核验。</p></section></div><template #footer><button class="button primary wide" @click="reopen(tasks.selectedRecord)">打开成果 <ArrowRight :size="18" /></button></template></BaseDrawer>
  </section>
</template>
