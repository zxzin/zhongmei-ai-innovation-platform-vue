<script setup>
import { Activity, CheckCircle2, Database, Gauge, ServerCog, Users } from '@lucide/vue'
import DonutChart from '../components/DonutChart.vue'
import LineChart from '../components/LineChart.vue'
import { agentUsage, cockpitTrend, organizationUsage } from '../data/demo.js'
import { appPerformance, taskStatus } from '../data/platform.js'

const totalCalls = appPerformance.reduce((sum, item) => sum + item.calls, 0)
const totalOutputs = appPerformance.reduce((sum, item) => sum + item.outputs, 0)
const organizationMax = Math.max(...organizationUsage.map((item) => item.calls))
const metrics = [
  { label: '智能应用调用', value: totalCalls, unit: '次', source: '调用日志 · call_id 去重', icon: Activity },
  { label: '形成成果', value: totalOutputs, unit: '份', source: '成果台账 · 已归档成果', icon: CheckCircle2 },
  { label: '使用用户', value: 156, unit: '人', source: '身份日志 · user_id 去重', icon: Users },
  { label: '调用成功率', value: '96.8', unit: '%', source: '已结束调用 · success 占比', icon: Gauge },
]
</script>

<template>
  <section class="page-container cockpit-page dark-cockpit">
    <header class="cockpit-hero">
      <div>
        <span>全集团运营总览</span>
        <h1>全景驾驶舱</h1>
      </div>
      <div class="cockpit-context" aria-label="统计范围">
        <span>全集团</span><span>本年度</span><span><Database :size="15" />截至 2026-08-21</span>
      </div>
    </header>

    <section class="dark-metric-grid" aria-label="核心运营指标">
      <article v-for="item in metrics" :key="item.label">
        <i><component :is="item.icon" :size="19" /></i>
        <div><span>{{ item.label }}</span><b>{{ item.value }}<small>{{ item.unit }}</small></b><em>{{ item.source }}</em></div>
      </article>
    </section>

    <div class="dark-cockpit-grid">
      <section class="dark-panel cockpit-trend-panel">
        <header>
          <div><span>近 7 个月</span><h2>平台调用与成果趋势</h2></div>
          <div class="dark-chart-legend"><span><i class="calls" />调用</span><span><i class="results" />成果</span></div>
        </header>
        <LineChart :data="cockpitTrend" />
        <footer><span>本月调用 <b>203 次</b></span><span>本月成果 <b>194 份</b></span><span>来源：调用日志与成果台账</span></footer>
      </section>

      <section class="dark-panel cockpit-status-panel">
        <header><div><span>实时状态</span><h2>服务运行情况</h2></div><ServerCog :size="22" /></header>
        <div class="dark-status-list">
          <article v-for="item in taskStatus" :key="item.id">
            <i :class="item.status ? 'online' : 'offline'" />
            <div><b>{{ item.name }}</b><span>{{ item.note }}</span></div>
            <em :class="item.status ? 'online' : 'offline'">{{ item.status ? '正常' : '暂停' }}</em>
          </article>
        </div>
        <footer>来源：服务健康检查 · 最近更新 09:30</footer>
      </section>

      <section class="dark-panel cockpit-usage-panel">
        <header><div><span>调用构成</span><h2>智能应用使用分布</h2></div><b>{{ totalCalls }}<small> 次</small></b></header>
        <DonutChart :data="agentUsage" total-label="%" />
      </section>

      <section class="dark-panel cockpit-organization-panel">
        <header><div><span>组织对比</span><h2>二级公司使用情况</h2></div><b>调用 / 用户</b></header>
        <div class="dark-organization-bars">
          <article v-for="item in organizationUsage" :key="item.name">
            <span>{{ item.name }}</span>
            <div><i :style="{ width: `${item.calls / organizationMax * 100}%` }" /></div>
            <b>{{ item.calls }}</b><em>{{ item.users }} 人</em>
          </article>
        </div>
        <footer>来源：调用日志与组织用户目录</footer>
      </section>
    </div>
  </section>
</template>
