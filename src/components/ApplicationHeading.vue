<script setup>
import { computed } from 'vue'
import { agentMap } from '../data/agents.js'

const props = defineProps({
  app: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})

const application = computed(() => agentMap[props.app])
const headingTitle = computed(() => props.title || application.value?.name || '')
const headingDescription = computed(() => props.description || application.value?.description || '')
</script>

<template>
  <header v-if="application" class="application-heading" :class="`accent-${application.accent}`">
    <i class="application-heading__icon" aria-hidden="true">
      <component :is="application.icon" :size="29" :stroke-width="2.1" />
    </i>
    <div class="application-heading__copy">
      <h1>{{ headingTitle }}</h1>
      <p v-if="headingDescription">{{ headingDescription }}</p>
    </div>
    <span class="application-heading__watermark" aria-hidden="true">
      <component :is="application.icon" :size="152" :stroke-width="1.15" />
    </span>
  </header>
</template>

<style scoped>
.application-heading.application-heading { --application-tone: #1688e5; position: relative; isolation: isolate; min-width: 0; min-height: 106px; display: grid; flex: 1 1 auto; grid-template-columns: 64px minmax(0,1fr); align-items: center; gap: 17px; overflow: hidden; margin: 0; padding: 0 4px 20px; color: #153f60; background: transparent; text-align: left; }
.application-heading.accent-blue { --application-tone: #1688e5; }.application-heading.accent-teal { --application-tone: #17af99; }.application-heading.accent-rose { --application-tone: #e46b88; }.application-heading.accent-violet { --application-tone: #786fef; }.application-heading.accent-cyan { --application-tone: #1eb7d0; }.application-heading.accent-amber { --application-tone: #e4a327; }
.application-heading__icon { position: relative; z-index: 1; width: 64px; height: 64px; display: grid; place-items: center; color: var(--application-tone); border: 1px solid color-mix(in srgb,var(--application-tone) 24%,#cfe1eb); border-radius: 18px; background: color-mix(in srgb,var(--application-tone) 10%,#fff); box-shadow: inset 0 1px rgba(255,255,255,.84); font-style: normal; }
.application-heading__copy { position: relative; z-index: 1; min-width: 0; text-align: left; }.application-heading__copy h1 { margin: 0; color: #163f60; font-size: 30px; font-weight: 800; letter-spacing: -.045em; line-height: 1.18; }.application-heading__copy p { max-width: 58ch; margin: 8px 0 0; color: #728ba0; font-size: 14px; font-weight: 500; line-height: 1.65; }
.application-heading__watermark { position: absolute; z-index: -1; right: 48px; bottom: -58px; display: grid; place-items: center; color: var(--application-tone); opacity: .065; pointer-events: none; transform: rotate(-10deg); }
@media (max-width:700px) { .application-heading.application-heading { min-height: 92px; grid-template-columns: 52px minmax(0,1fr); gap: 13px; padding: 0 2px 17px; }.application-heading.application-heading::after { left: 67px; width: 45px; }.application-heading__icon { width: 52px; height: 52px; border-radius: 15px; }.application-heading__icon :deep(svg) { width: 25px; height: 25px; }.application-heading__copy h1 { font-size: 24px; }.application-heading__copy p { margin-top: 5px; font-size: 13px; line-height: 1.55; }.application-heading__watermark { right: -9px; bottom: -53px; }.application-heading__watermark :deep(svg) { width: 112px; height: 112px; } }
</style>
