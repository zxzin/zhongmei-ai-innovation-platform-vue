<script setup>
import { X } from '@lucide/vue'
defineProps({ open: Boolean, title: { type: String, default: '' }, width: { type: String, default: '560px' } })
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="open" class="drawer-layer" @click.self="$emit('close')">
        <aside class="drawer-panel" :style="{ '--drawer-width': width }" role="dialog" aria-modal="true" :aria-label="title">
          <header><h2>{{ title }}</h2><button type="button" aria-label="关闭" @click="$emit('close')"><X :size="20" /></button></header>
          <div class="drawer-body"><slot /></div>
          <footer v-if="$slots.footer"><slot name="footer" /></footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
