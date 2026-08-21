<script setup>
import { useRouter } from 'vue-router'
import { ArrowUpRight } from '@lucide/vue'
import { agents } from '../data/agents.js'

const router = useRouter()
function openAgent(id) {
  router.push(id === 'innovation' ? '/innovation/researcher/upload' : `/agent/${id}/brief`)
}
</script>

<template>
  <section class="page-container agent-hub-page">
    <header class="hub-heading">
      <div><span>智能应用工作台</span><h1>开始愉快的工作吧。</h1><p>根据今天的工作目标，选择一项智能应用开始处理。</p></div>
    </header>
    <main class="agent-matrix" aria-label="六项智能应用入口">
      <button v-for="agent in agents" :key="agent.id" type="button" class="agent-tile" :class="[`accent-${agent.accent}`, { preferred: agent.id === 'qa' }]" @click="openAgent(agent.id)">
        <span class="agent-number">{{ agent.number }}</span>
        <span v-if="agent.id === 'qa'" class="agent-recommend">常用</span>
        <i><component :is="agent.icon" :size="25" /></i>
        <div>
          <h2>{{ agent.name }}</h2>
          <p>{{ agent.description }}</p>
          <span>{{ agent.action }} <b><ArrowUpRight :size="16" /></b></span>
        </div>
      </button>
    </main>
  </section>
</template>
