<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ArrowRight, Trash2 } from '@lucide/vue'
import PageHeader from '../components/PageHeader.vue'
import BaseSelect from '../components/BaseSelect.vue'
import DateRangeFilter from '../components/DateRangeFilter.vue'
import { agents, agentMap } from '../data/agents.js'
import { useTasksStore } from '../stores/tasks.js'
import { useUiStore } from '../stores/ui.js'

const router = useRouter()
const tasks = useTasksStore(); const ui = useUiStore()
const query = ref(''); const application = ref('all'); const dateRange = ref({ start: '', end: '' }); const sort = ref('time'); const selected = ref([])
const applicationOptions = [{ value: 'all', label: '全部' }, ...agents.map((item) => ({ value: item.id, label: item.name }))]
const sortOptions = [{ value: 'time', label: '日期' }, { value: 'name', label: '名称' }]
const accentStyles = {
  blue: { '--record-accent': '#1688e5', '--record-tint': '#e6f3ff' },
  cyan: { '--record-accent': '#1eb7d0', '--record-tint': '#e2f8fb' },
  teal: { '--record-accent': '#429a4d', '--record-tint': '#eaf6e9' },
  amber: { '--record-accent': '#d99a1c', '--record-tint': '#fff3db' },
  violet: { '--record-accent': '#746bf1', '--record-tint': '#eeecff' },
  rose: { '--record-accent': '#e46b88', '--record-tint': '#ffecf1' },
}
function recordAccent(record) { return accentStyles[agentMap[record.agent]?.accent] || accentStyles.blue }
const filtered = computed(() => tasks.personalRecords.filter((record) => {
  const matchesQuery = !query.value || `${record.title}${agentMap[record.agent]?.name || ''}`.toLowerCase().includes(query.value.toLowerCase())
  const recordDate = taskDate(record.date)
  const matchesRange = (!dateRange.value.start || recordDate >= dateRange.value.start)
    && (!dateRange.value.end || recordDate <= dateRange.value.end)
  return matchesQuery && matchesRange && (application.value === 'all' || record.agent === application.value)
}).sort((a,b) => sort.value === 'name' ? a.title.localeCompare(b.title,'zh-CN') : b.date.localeCompare(a.date)))
const allSelected = computed(() => filtered.value.length > 0 && filtered.value.every((item) => selected.value.includes(item.id)))
function toggleAll() { selected.value = allSelected.value ? [] : filtered.value.map((item) => item.id) }
function deleteSelected() {
  if (!window.confirm(`确认删除已选择的 ${selected.value.length} 条历史记录？`)) return
  tasks.removeTasks(selected.value); selected.value = []; ui.notify('所选历史记录已删除','warning')
}
function deleteRecord(record) {
  if (!window.confirm(`确认删除“${record.title}”？`)) return
  tasks.removeTask(record.id); ui.notify('历史记录已删除','warning')
}
function openRecord(record) {
  router.push(record.resumePath || '/agents')
}
function taskDate(value) {
  return value?.slice(0, 10) || ''
}
</script>

<template>
  <section class="page-container history-page">
    <PageHeader title="历史记录" />
    <div class="filter-bar history-filters"><label class="search-field"><Search :size="18" /><input v-model="query" placeholder="搜索我的任务名称或智能应用" /></label><BaseSelect v-model="application" class="history-filter-application" :options="applicationOptions" prefix="名称" aria-label="筛选名称" /><DateRangeFilter v-model="dateRange" class="history-filter-range" prefix="时间" aria-label="按任务日期筛选" /><BaseSelect v-model="sort" class="history-filter-sort" :options="sortOptions" prefix="排序" aria-label="筛选排序" /></div>
    <div class="history-summary"><span>当前账号共 <b>{{ filtered.length }}</b> 条任务记录</span></div>
    <div class="history-list-shell">
      <div class="history-bulkbar">
        <label class="history-select-all"><input type="checkbox" :checked="allSelected" @change="toggleAll" />全选</label>
        <div v-if="selected.length" class="history-bulk-actions"><span>已选择 {{ selected.length }} 条</span><button class="button ghost" @click="deleteSelected"><Trash2 :size="16" />删除所选</button></div>
        <div v-else class="history-column-headings" aria-hidden="true"><div class="history-column-main-headings"><span>Agent 名称</span><span>任务名称</span></div><span>任务日期</span></div>
      </div>
      <div class="record-list enhanced-record-list">
        <article v-for="record in filtered" :key="record.id" class="record-row" :style="recordAccent(record)"><label class="record-check"><input v-model="selected" type="checkbox" :value="record.id" /><span class="sr-only">选择 {{ record.title }}</span></label><button class="record-open" type="button" @click="openRecord(record)"><i><component :is="agentMap[record.agent].icon" :size="21" /></i><div class="record-main"><div class="record-meta"><span class="record-agent">{{ agentMap[record.agent].name }} Agent</span></div><h2>{{ record.title }}</h2></div><time class="record-date" :datetime="record.date.replace(' ', 'T')"><b>{{ taskDate(record.date) }}</b></time><ArrowRight :size="19" /></button><button class="icon-button record-delete" aria-label="删除记录" @click="deleteRecord(record)"><Trash2 :size="17" /></button></article>
        <div v-if="!filtered.length" class="empty-state"><Search :size="28" /><h2>没有匹配记录</h2><p>调整关键词或智能应用条件后重新查找。</p></div>
      </div>
    </div>
  </section>
</template>
