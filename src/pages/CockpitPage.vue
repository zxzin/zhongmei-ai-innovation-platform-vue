<script setup>
import { ref } from 'vue'
import { Database, Users, Activity, CheckCircle2, Clock3, ArrowRight, Building2, Gauge, UserCheck, Repeat2, ServerCog, AlertTriangle } from '@lucide/vue'
import PageHeader from '../components/PageHeader.vue'
import BaseDrawer from '../components/BaseDrawer.vue'
import LineChart from '../components/LineChart.vue'
import { cockpitTrend, organizationUsage } from '../data/demo.js'
import { appPerformance, taskStatus } from '../data/platform.js'

const detail = ref(null); const dateRange = ref('本年度'); const company = ref('全集团')
const metrics = [
  { key:'calls',label:'调用量',value:'837',unit:'次',note:'成功创建的独立调用记录',icon:Activity },
  { key:'completion',label:'任务完成率',value:'94.6',unit:'%',note:'完成状态为 1 的任务占比',icon:CheckCircle2 },
  { key:'duration',label:'平均响应时长',value:'5:21',unit:'',note:'已完成调用的平均处理时间',icon:Clock3 },
  { key:'active',label:'用户均活跃数',value:'42.3',unit:'人/日',note:'日活跃账号的时间均值',icon:UserCheck },
  { key:'frequency',label:'用户均调用频次',value:'5.4',unit:'次',note:'调用量除以有效调用用户数',icon:Repeat2 },
  { key:'success',label:'调用成功率',value:'96.8',unit:'%',note:'成功结束调用占全部结束调用',icon:Gauge },
]
const sourceDescriptions = {
  calls:['来源：智能应用调用日志','统计主键：call_id','口径：成功创建任务且记录开始时间的独立调用'],
  completion:['来源：任务状态台账','字段：completion_status','口径：状态为 1 的任务数 ÷ 已结束任务数'],
  duration:['来源：智能应用调用日志','字段：finished_at - started_at','口径：只计算状态为 completed 的调用'],
  active:['来源：统一身份登录日志与调用日志','统计主键：user_id + active_date','口径：时间范围内每日有效调用用户数的平均值'],
  frequency:['来源：智能应用调用日志','统计主键：call_id、user_id','口径：调用总量 ÷ 有效调用去重用户数'],
  success:['来源：智能应用调用日志','字段：result_status','口径：success ÷ (success + failed)'],
}
</script>

<template>
  <section class="page-container cockpit-page">
    <PageHeader title="全景驾驶舱" description="按日期和公司查看平台总体运营、任务状态、单项性能与各级公司使用情况。" eyebrow="管理员视图"><template #actions><div class="cockpit-filters"><label>日期<select v-model="dateRange"><option>本年度</option><option>本季度</option><option>近 30 天</option></select></label><label>公司<select v-model="company"><option>全集团</option><option>中煤深圳研究院</option><option>煤矿智能化公司</option></select></label><span class="data-baseline"><Database :size="17" /><span>数据截至<b>2026-08-21</b></span></span></div></template></PageHeader>
    <section class="metric-band cockpit-metrics" aria-label="运营概览"><button v-for="item in metrics" :key="item.key" @click="detail = item.key"><i><component :is="item.icon" :size="19" /></i><span>{{ item.label }}<b>{{ item.value }}<small>{{ item.unit }}</small></b><em>{{ item.note }}</em></span><ArrowRight :size="16" /></button></section>
    <div class="cockpit-architecture-grid">
      <section class="cockpit-region trend-region"><header><div><span class="eyebrow">运营概览</span><h2>平台调用与成果趋势</h2><p>{{ company }} · {{ dateRange }}</p></div><div class="chart-legend-inline"><span><i class="calls" />新增调用</span><span><i class="results" />形成成果</span></div></header><LineChart :data="cockpitTrend" /><footer><span>本期新增调用 <b>+203</b></span><span>本期形成成果 <b>+191</b></span><span>成果完整率 <b>94.1%</b></span></footer></section>
      <section class="cockpit-region task-board"><header><div><span class="eyebrow">任务看板</span><h2>智能应用运行状态</h2><p>1 表示正常，0 表示不可用</p></div><ServerCog :size="24" /></header><button v-for="item in taskStatus" :key="item.id" @click="detail = item"><i :class="item.status ? 'online' : 'offline'"><CheckCircle2 v-if="item.status" :size="17" /><AlertTriangle v-else :size="17" /></i><span><b>{{ item.name }}</b><small>{{ item.note }} · {{ item.updated }}</small></span><strong>{{ item.status }}</strong></button></section>
      <section class="cockpit-region app-performance-region"><header><div><span class="eyebrow">性能看板</span><h2>单项智能应用性能</h2><p>同一统计口径下比较调用、完成、时长和成功率</p></div></header><div class="performance-table"><div class="performance-head"><span>智能应用</span><span>调用量</span><span>任务完成率</span><span>平均响应时长</span><span>调用成功率</span><span>状态</span></div><button v-for="item in appPerformance" :key="item.name" @click="detail = item"><b>{{ item.name }}</b><span>{{ item.calls }} 次</span><span>{{ item.completion }}%</span><span>{{ item.duration }}</span><span>{{ item.success }}%</span><em :class="item.online ? 'online' : 'offline'">{{ item.online }}</em></button></div></section>
      <section class="cockpit-region organization-region"><header><div><span class="eyebrow">横向对比</span><h2>各级公司使用情况</h2><p>比较调用量与实际使用用户数</p></div><button @click="detail = 'organizations'">查看统计口径 <ArrowRight :size="16" /></button></header><div class="organization-bars"><div v-for="item in organizationUsage" :key="item.name"><span><Building2 :size="17" />{{ item.name }}</span><div><i :style="{ width: `${item.calls / 2.1}%` }" /></div><b>{{ item.calls }} 次</b><em>{{ item.users }} 人</em></div></div></section>
    </div>
    <BaseDrawer :open="Boolean(detail)" title="数据依据" @close="detail = null"><div v-if="typeof detail === 'string' && sourceDescriptions[detail]" class="source-detail"><span class="eyebrow">指标口径</span><h2>{{ metrics.find(item => item.key === detail)?.label }}</h2><ul><li v-for="line in sourceDescriptions[detail]" :key="line">{{ line }}</li><li>当前筛选：{{ company }} · {{ dateRange }}</li></ul><p>统计服务按组织、日期和智能应用重新聚合，仅纳入符合当前业务口径的记录。</p></div><div v-else-if="detail === 'organizations'" class="source-detail"><span class="eyebrow">公司对比口径</span><h2>各级公司使用情况</h2><ul><li>来源：统一身份组织树、智能应用调用日志</li><li>关联字段：organization_id、user_id、call_id</li><li>口径：按调用发起人的归属公司汇总</li></ul></div><div v-else-if="detail" class="source-detail"><span class="eyebrow">{{ detail.name ? '单项性能' : '运行状态' }}</span><h2>{{ detail.name }}</h2><ul v-if="detail.calls"><li>调用量：{{ detail.calls }} 次</li><li>任务完成率：{{ detail.completion }}%</li><li>平均响应时长：{{ detail.duration }}</li><li>调用成功率：{{ detail.success }}%</li></ul><ul v-else><li>当前状态：{{ detail.status }}</li><li>状态说明：{{ detail.note }}</li><li>最近更新：{{ detail.updated }}</li></ul></div></BaseDrawer>
  </section>
</template>
