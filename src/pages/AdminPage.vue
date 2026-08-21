<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Users, FileStack, ChartNoAxesCombined, Upload, UserPlus, Search, MoreHorizontal, Database, Activity, Clock3, Network, BookOpenText, Settings2, ScrollText, Building2, ChevronRight, Plus, ShieldCheck, ServerCog, CheckCircle2 } from '@lucide/vue'
import PageHeader from '../components/PageHeader.vue'
import BaseDrawer from '../components/BaseDrawer.vue'
import LineChart from '../components/LineChart.vue'
import { users, templates, cockpitTrend, agentUsage } from '../data/demo.js'
import { companyLibraries, departmentTree, systemLogs } from '../data/platform.js'
import { useUiStore } from '../stores/ui.js'

const route = useRoute(); const router = useRouter(); const ui = useUiStore()
const query = ref(''); const selectedUser = ref(null); const selectedLibrary = ref(null); const logType = ref('全部日志')
const selectedDepartment = ref({ name:'技术研发部', parent:'中煤深圳研究院', count:31, admin:'王工' })
const sectionIds = ['operations','departments','templates','knowledge','users','config','logs']
const section = computed(() => sectionIds.includes(route.params.section) ? route.params.section : 'operations')
const filteredUsers = computed(() => users.filter((user) => `${user.name}${user.id}${user.department}`.toLowerCase().includes(query.value.toLowerCase())))
const filteredLogs = computed(() => logType.value === '全部日志' ? systemLogs : systemLogs.filter((item) => item.type === logType.value))
const tabs = [
  { id:'operations',label:'运营数据',icon:ChartNoAxesCombined },
  { id:'departments',label:'部门管理',icon:Network },
  { id:'templates',label:'模板管理',icon:FileStack },
  { id:'knowledge',label:'公司知识库',icon:BookOpenText },
  { id:'users',label:'用户管理',icon:Users },
  { id:'config',label:'配置管理',icon:Settings2 },
  { id:'logs',label:'系统日志',icon:ScrollText },
]
function importUsers() { ui.notify('Excel 用户表已读取，进入导入确认步骤', 'success') }
function selectDepartment(company, child) {
  selectedDepartment.value = { name:child.name, parent:company.name, count:child.count, admin:child.name === '技术研发部' ? '王工' : '待分配' }
}
</script>

<template>
  <section class="page-container admin-workbench-page">
    <PageHeader title="管理中心" />
    <div class="admin-workbench-shell">
      <nav class="admin-workbench-nav" aria-label="管理员功能"><button v-for="tab in tabs" :key="tab.id" :class="{ active: section === tab.id }" @click="router.push(`/admin/${tab.id}`)"><i><component :is="tab.icon" :size="19" /></i><b>{{ tab.label }}</b><ChevronRight :size="17" /></button></nav>

      <main class="admin-panel" :class="`admin-section-${section}`">
        <template v-if="section === 'operations'">
          <header class="panel-heading"><div><h2>运营数据</h2><p>数据来自统一身份登录日志、智能应用调用日志和成果台账。</p></div><span class="data-date"><Database :size="17" />数据截至 2026-08-21</span></header>
          <div class="operations-metrics"><article><Users :size="20" /><span>使用用户<b>156 人</b><small>按账号去重</small></span></article><article><Activity :size="20" /><span>智能应用调用<b>837 次</b><small>按 call_id 去重</small></span></article><article><CheckCircle2 :size="20" /><span>形成成果<b>796 份</b><small>已归档成果</small></span></article><article><Clock3 :size="20" /><span>平均处理时长<b>5 分 21 秒</b><small>已结束调用平均值</small></span></article></div>
          <section class="operations-chart"><header><h3>用户登录与调用趋势</h3><span>按月统计</span></header><LineChart :data="cockpitTrend" /></section>
          <section class="agent-operation-list"><header><h3>按智能应用统计</h3><span>记录来源：智能应用调用日志</span></header><div v-for="item in agentUsage" :key="item.id"><i :style="{ background: item.color }" /><span>{{ item.name }}</span><div><b :style="{ width: `${item.value * 2.8}%`, background: item.color }" /></div><strong>{{ item.value }}%</strong></div></section>
        </template>

        <template v-else-if="section === 'departments'">
          <header class="panel-heading"><div><h2>部门管理</h2><p>维护根公司、二级公司、子部门与成员归属，权限按组织树向下生效。</p></div><button class="button primary" @click="ui.notify('已创建待编辑子部门')"><Plus :size="17" />新建部门</button></header>
          <div class="department-layout"><section class="department-tree"><article v-for="root in departmentTree" :key="root.name"><header><i><Building2 :size="20" /></i><span><b>{{ root.name }}</b><small>{{ root.count }} 名成员</small></span></header><div v-for="company in root.children" :key="company.name" class="tree-company"><div><Network :size="17" /><b>{{ company.name }}</b><span>{{ company.count }} 人</span></div><button v-for="child in company.children" :key="child.name" :class="{ active: selectedDepartment.name === child.name && selectedDepartment.parent === company.name }" @click="selectDepartment(company, child)"><span>{{ child.name }}</span><em>{{ child.count }} 人</em><ChevronRight :size="15" /></button></div></article></section><aside class="department-detail"><span class="eyebrow">当前部门</span><h2>{{ selectedDepartment.parent }} · {{ selectedDepartment.name }}</h2><dl><div><dt>上级组织</dt><dd>{{ selectedDepartment.parent }}</dd></div><div><dt>部门成员</dt><dd>{{ selectedDepartment.count }} 人</dd></div><div><dt>部门管理员</dt><dd>{{ selectedDepartment.admin }}</dd></div><div><dt>可用知识库</dt><dd>集团技术标准库、深圳院项目成果库</dd></div></dl><button class="button secondary" @click="ui.notify('已打开部门编辑')">编辑部门信息</button></aside></div>
        </template>

        <template v-else-if="section === 'templates'">
          <header class="panel-heading"><div><h2>模板管理</h2><p>维护报告结构，以及管理员创新性评价使用的评分权重。</p></div><button class="button primary" @click="ui.notify('已新建模板草稿')"><Plus :size="17" />新建模板</button></header>
          <div class="template-list"><article v-for="item in templates" :key="item.id"><i><FileStack :size="21" /></i><div><span>{{ item.id }} · {{ item.scope }}</span><h3>{{ item.name }}</h3><p>{{ item.owner }} · {{ item.version }}</p></div><span class="status-chip" :class="item.status === '已发布' ? 'success' : 'warning'">{{ item.status }}</span><button class="button ghost" @click="ui.notify('已打开模板详情')">查看</button></article></div>
          <section class="weight-template"><header><div><span class="eyebrow">管理员评审专用</span><h3>创新性分析评分权重模板</h3><p>管理员生成评审报告前选择，科研人员端不展示评分。</p></div><ShieldCheck :size="27" /></header><div><span>新颖性<b>40%</b></span><span>先进性<b>35%</b></span><span>应用价值<b>25%</b></span></div><button class="button secondary" @click="ui.notify('已打开评分权重编辑')">编辑权重</button></section>
        </template>

        <template v-else-if="section === 'knowledge'">
          <header class="panel-heading"><div><h2>公司知识库</h2><p>管理员维护企业资料、使用范围和部门权限，普通用户仅能检索获授权的资料。</p></div><button class="button primary" @click="selectedLibrary = { name:'',description:'',access:'深圳院及子部门' }"><Plus :size="17" />创建知识库</button></header>
          <div class="company-knowledge-grid"><article v-for="item in companyLibraries" :key="item.id"><header><i><BookOpenText :size="22" /></i><span class="status-chip info">{{ item.access }}</span></header><span>{{ item.id }}</span><h3>{{ item.name }}</h3><p>{{ item.description }}</p><footer><b>{{ item.files }} 个文件</b><span>{{ item.updated }}</span><button @click="selectedLibrary = { ...item }">管理 <ChevronRight :size="16" /></button></footer></article></div>
        </template>

        <template v-else-if="section === 'users'">
          <header class="panel-heading"><div><h2>用户管理</h2><p>账号由管理员分配，可按公司、子部门和角色设置访问权限。</p></div><div><label class="button secondary import-button"><Upload :size="17" />Excel 批量导入<input type="file" accept=".xlsx,.xls" @change="importUsers" /></label><button class="button primary" type="button" @click="selectedUser = { name:'',id:'',company:'中煤集团',department:'',role:'科研人员',status:'启用' }"><UserPlus :size="17" />单独创建</button></div></header>
          <div class="admin-summary"><article><span>平台账号</span><b>156</b><small>含 3 类角色</small></article><article><span>二级公司</span><b>12</b><small>组织树统一维护</small></article><article><span>当前启用</span><b>151</b><small>5 个账号停用</small></article></div>
          <div class="table-tools"><label class="search-field"><Search :size="17" /><input v-model="query" placeholder="搜索姓名、工号或部门" /></label><select><option>全部角色</option><option>平台管理员</option><option>科研人员</option><option>复核专家</option></select><select><option>全部状态</option><option>启用</option><option>停用</option></select></div>
          <div class="data-table-wrap"><table><thead><tr><th>用户</th><th>账号 / 工号</th><th>公司</th><th>部门</th><th>角色</th><th>状态</th><th>最近登录</th><th aria-label="操作" /></tr></thead><tbody><tr v-for="user in filteredUsers" :key="user.id"><td><b>{{ user.name }}</b></td><td>{{ user.id }}</td><td>{{ user.company }}</td><td>{{ user.department }}</td><td>{{ user.role }}</td><td><span class="status-chip" :class="user.status === '启用' ? 'success' : 'neutral'">{{ user.status }}</span></td><td>{{ user.lastLogin }}</td><td><button class="icon-button" aria-label="编辑用户" @click="selectedUser = { ...user }"><MoreHorizontal :size="18" /></button></td></tr></tbody></table></div>
        </template>

        <template v-else-if="section === 'config'">
          <header class="panel-heading"><div><h2>配置管理</h2><p>分别设置智能应用可调用知识库数量和大模型服务参数。</p></div><button class="button primary" @click="ui.notify('配置已保存','success')">保存配置</button></header>
          <div class="config-grid"><section><header><i><Settings2 :size="22" /></i><div><h3>智能应用配置</h3><p>按应用控制企业知识库和个人知识库召回数量。</p></div></header><article v-for="item in agentUsage" :key="item.id"><span>{{ item.name }}</span><label>企业库 <input type="number" value="3" min="0" max="10" /></label><label>个人库 <input type="number" value="2" min="0" max="10" /></label></article></section><section><header><i><ServerCog :size="22" /></i><div><h3>大模型配置</h3><p>服务密钥不在客户端展示。</p></div></header><dl><div><dt>模型服务</dt><dd>企业大模型网关</dd></div><div><dt>服务状态</dt><dd><span class="status-chip success">连接正常</span></dd></div><div><dt>输出温度</dt><dd>0.2（严谨模式）</dd></div><div><dt>最长上下文</dt><dd>128K</dd></div></dl><button class="button secondary" @click="ui.notify('模型服务连接正常','success')">测试连接</button></section></div>
        </template>

        <template v-else>
          <header class="panel-heading"><div><h2>系统日志</h2><p>登录日志与操作日志分别记录账号访问和关键业务操作。</p></div><select v-model="logType"><option>全部日志</option><option>登录日志</option><option>操作日志</option></select></header>
          <div class="data-table-wrap"><table><thead><tr><th>日志编号</th><th>类型</th><th>用户</th><th>操作</th><th>对象</th><th>时间</th><th>结果</th></tr></thead><tbody><tr v-for="item in filteredLogs" :key="item.id"><td>{{ item.id }}</td><td>{{ item.type }}</td><td><b>{{ item.user }}</b></td><td>{{ item.action }}</td><td>{{ item.target }}</td><td>{{ item.time }}</td><td><span class="status-chip" :class="item.result === '成功' ? 'success' : 'warning'">{{ item.result }}</span></td></tr></tbody></table></div>
        </template>
      </main>
    </div>

    <BaseDrawer :open="Boolean(selectedUser)" :title="selectedUser?.id ? '编辑用户' : '新建用户'" @close="selectedUser = null"><form v-if="selectedUser" class="drawer-form" @submit.prevent="ui.notify('用户信息已保存','success'); selectedUser = null"><label>姓名<input v-model="selectedUser.name" required /></label><label>账号 / 工号<input v-model="selectedUser.id" required /></label><label>所属公司<select v-model="selectedUser.company"><option>中煤集团</option><option>中煤深圳研究院</option></select></label><label>所属部门<input v-model="selectedUser.department" required /></label><label>平台角色<select v-model="selectedUser.role"><option>科研人员</option><option>复核专家</option><option>平台管理员</option></select></label><label>账号状态<select v-model="selectedUser.status"><option>启用</option><option>停用</option></select></label><section><h3>功能权限</h3><label><input type="checkbox" checked />使用六项智能应用</label><label><input type="checkbox" />查看驾驶舱</label><label><input type="checkbox" />进入管理员工作台</label></section><button class="button primary wide" type="submit">保存用户</button></form></BaseDrawer>
    <BaseDrawer :open="Boolean(selectedLibrary)" :title="selectedLibrary?.name || '创建公司知识库'" @close="selectedLibrary = null"><form v-if="selectedLibrary" class="drawer-form" @submit.prevent="ui.notify('公司知识库已保存','success'); selectedLibrary = null"><label>知识库名称<input v-model="selectedLibrary.name" required /></label><label>简介<textarea v-model="selectedLibrary.description" /></label><label>使用范围<select v-model="selectedLibrary.access"><option>全集团</option><option>深圳院及子部门</option><option>授权项目组</option></select></label><section><h3>库权限</h3><label><input type="checkbox" checked />允许智能应用召回</label><label><input type="checkbox" />允许普通用户上传</label><label><input type="checkbox" checked />仅管理员可删除</label></section><button class="button primary wide" type="submit">保存知识库</button></form></BaseDrawer>
  </section>
</template>
