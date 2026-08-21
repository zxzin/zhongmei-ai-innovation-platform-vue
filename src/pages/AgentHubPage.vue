<script setup>
import { useRouter } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import { agents } from '../data/agents.js'

const router = useRouter()
function openAgent(id) {
  router.push(id === 'innovation' ? '/innovation/researcher/upload' : `/agent/${id}/brief`)
}
</script>

<template>
  <section class="page-container agent-hub-page">
    <header class="hub-heading">
      <h1>开始愉快的工作吧。</h1>
    </header>
    <main class="agent-matrix" aria-label="六项智能应用入口">
      <button v-for="agent in agents" :key="agent.id" type="button" class="agent-tile" :class="[`accent-${agent.accent}`, { preferred: agent.id === 'qa' }]" :aria-label="`打开${agent.name}`" @click="openAgent(agent.id)">
        <span v-if="agent.id === 'qa'" class="agent-recommend">常用</span>
        <i><component :is="agent.icon" :size="25" /></i>
        <div>
          <h2>{{ agent.name }}</h2>
          <p>{{ agent.description }}</p>
        </div>
        <span class="agent-open-icon"><ArrowRight :size="18" /></span>
      </button>
    </main>
  </section>
</template>
