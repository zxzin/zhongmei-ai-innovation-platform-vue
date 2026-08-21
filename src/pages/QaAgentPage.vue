<script setup>
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Send, Plus, ExternalLink, FileText, CheckCircle2, Clock3, Layers3 } from '@lucide/vue'
import BaseDrawer from '../components/BaseDrawer.vue'
import { evidenceItems } from '../data/demo.js'
import { useTasksStore } from '../stores/tasks.js'

const router = useRouter()
const tasks = useTasksStore()
const input = ref('')
const thinking = ref(false)
const source = ref(null)
const messages = ref([
  { role: 'assistant', text: '你好，我可以围绕技术问题连续对话，并在回答中标记专利、论文和企业资料引用。', citations: [], time: '09:31' },
])
const examples = ['井下高矿化度矿井水资源化利用有哪些关键约束？', '粉尘与弱光环境下，哪类传感器组合更可靠？', '5G 盲区中如何保持巡检机器人任务连续性？']

function ask(text = input.value) {
  const question = text.trim()
  if (!question || thinking.value) return
  messages.value.push({ role: 'user', text: question, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) })
  input.value = ''
  thinking.value = true
  setTimeout(async () => {
    messages.value.push({
      role: 'assistant',
      text: '建议将问题拆分为环境适配、核心技术、工程验证和合规边界四部分。以井下巡检为例，可采用激光雷达作为结构定位主干，视觉与热成像补充语义信息，IMU 负责短时航迹桥接；具体可靠性仍需结合粉尘浓度、防爆等级和现场测试数据确认。',
      citations: evidenceItems.slice(0, 2),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    })
    thinking.value = false
    tasks.addTask('qa', question, '技术回答')
    await nextTick()
    document.querySelector('.chat-messages')?.scrollTo({ top: 99999, behavior: 'smooth' })
  }, 850)
}
</script>

<template>
  <section class="qa-workspace">
    <header><button class="brand-back" type="button" @click="router.push('/agents')"><ArrowLeft :size="17" />智能应用首页</button><div><b>技术问答</b><span>连续对话 · 引用可核验</span></div><span class="status-chip success"><CheckCircle2 :size="14" />服务可用</span></header>
    <div class="qa-layout">
      <aside class="qa-context"><h1>技术问答</h1><p>最简单、直接的科研问答入口。回答引用来自授权专利、论文和知识库。</p><section><h2>可以这样问</h2><button v-for="item in examples" :key="item" type="button" @click="ask(item)">{{ item }}<Send :size="15" /></button></section><footer><FileText :size="18" /><span><b>回答依据</b><small>专利 · 论文 · 企业知识库</small></span></footer></aside>
      <main class="qa-conversation">
        <div class="chat-messages">
          <article v-for="(message, index) in messages" :key="index" :class="['chat-message', message.role]">
            <span>{{ message.role === 'user' ? '你' : 'AI' }}</span>
            <div><p>{{ message.text }}</p><div v-if="message.citations?.length" class="citation-list"><button v-for="item in message.citations" :key="item.id" type="button" :title="item.title" @click="source = item"><ExternalLink :size="14" />{{ item.type }} {{ item.id }}</button><button class="all-sources" type="button" @click="source = 'all'"><Layers3 :size="14" />26 个来源</button></div><small class="message-time"><Clock3 :size="13" />{{ message.time }}</small></div>
          </article>
          <article v-if="thinking" class="chat-message assistant"><span>AI</span><div class="thinking-row"><i /><i /><i /><p>正在核对引用与适用条件…</p></div></article>
        </div>
        <footer class="chat-composer"><div><textarea v-model="input" placeholder="继续补充技术条件、对比方案或验证要求" @keydown.enter.exact.prevent="ask()" /><div><button type="button" aria-label="添加资料"><Plus :size="19" /></button><small>Enter 发送 · Shift + Enter 换行</small><button class="send-button" type="button" aria-label="发送问题" :disabled="thinking" @click="ask()"><Send :size="19" /></button></div></div><p>AI 结果可能存在遗漏，关键结论请核对引用原文和现场数据。</p></footer>
      </main>
    </div>
    <BaseDrawer :open="Boolean(source)" :title="source === 'all' ? '本次回答的 26 个来源' : '引用来源'" @close="source = null"><div v-if="source === 'all'" class="all-source-groups"><header><span class="eyebrow">生成时间 2026-08-21 09:31</span><h2>回答依据按来源类型整理</h2><p>来源列表默认按语义相关度排序，点击任一资料查看摘要和原文。</p></header><section v-for="group in [{name:'论文',count:11},{name:'专利',count:8},{name:'政策',count:3},{name:'内部资料',count:4}]" :key="group.name"><div><b>{{ group.name }}</b><span>{{ group.count }} 条</span></div><button v-for="item in evidenceItems.filter(item => item.type === group.name).slice(0,2)" :key="item.id" @click="source = item"><span>{{ item.id }}</span><b>{{ item.title }}</b><em>相关度 {{ item.relevance }}%</em></button></section></div><div v-else-if="source" class="source-detail"><span class="eyebrow">{{ source.type }} · {{ source.id }}</span><h2>{{ source.title }}</h2><ul><li>数据来源：{{ source.source }}</li><li>公开日期：{{ source.date }}</li><li>与当前问题相关度：{{ source.relevance }}%</li></ul><button class="button primary wide">打开来源原文 <ExternalLink :size="17" /></button></div></BaseDrawer>
  </section>
</template>
