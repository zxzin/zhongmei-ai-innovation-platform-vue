<script setup>
import { useRouter } from 'vue-router'
import { ArrowUpRight } from '@lucide/vue'
import { agents } from '../data/agents.js'

const router = useRouter()

function applicationHref(id) {
  const target = id === 'innovation' ? '/innovation/researcher/upload' : `/agent/${id}/brief`
  return router.resolve(target).href
}
</script>

<template>
  <section class="page-container agent-hub-page">
    <header class="hub-heading">
      <h1>
        <span class="hub-title-task">选择一个 <em>智能应用</em>，</span>
        <span class="hub-title-welcome">开始愉快的工作吧。</span>
      </h1>
    </header>
    <main class="agent-matrix" aria-label="六项智能应用入口">
      <a
        v-for="agent in agents"
        :key="agent.id"
        :href="applicationHref(agent.id)"
        target="_blank"
        rel="noopener noreferrer"
        class="agent-tile"
        :class="`accent-${agent.accent}`"
        :aria-label="`打开${agent.name}`"
      >
        <span class="agent-index">{{ agent.number }}</span>
        <i class="agent-tile-icon"><component :is="agent.icon" :size="25" /></i>
        <div class="agent-tile-copy">
          <div class="agent-tile-title">
            <h2>{{ agent.name }}</h2>
          </div>
          <p>{{ agent.description }}</p>
        </div>
        <span class="agent-tile-action">{{ agent.action }}<b><ArrowUpRight :size="17" /></b></span>
        <span class="agent-tile-watermark" aria-hidden="true"><component :is="agent.icon" :size="160" /></span>
      </a>
    </main>
  </section>
</template>
