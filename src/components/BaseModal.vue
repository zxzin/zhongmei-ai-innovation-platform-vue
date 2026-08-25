<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X } from '@lucide/vue'

const props = defineProps({
  open: Boolean,
  title: { type: String, default: '' },
  width: { type: String, default: '600px' },
})
const emit = defineEmits(['close'])
const panel = ref(null)

function handleKeydown(event) {
  if (event.key === 'Escape' && props.open) emit('close')
}

watch(() => props.open, async (open) => {
  if (!open) return
  await nextTick()
  panel.value?.focus()
})

window.addEventListener('keydown', handleKeydown)
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="modal-layer" @click.self="$emit('close')">
        <section ref="panel" class="modal-panel" :style="{ '--modal-width': width }" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1">
          <header>
            <h2>{{ title }}</h2>
            <button type="button" aria-label="关闭" @click="$emit('close')"><X :size="19" /></button>
          </header>
          <div class="modal-body"><slot /></div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
