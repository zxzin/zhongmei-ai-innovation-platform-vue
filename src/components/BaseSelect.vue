<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Check, ChevronDown } from '@lucide/vue'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  options: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: '选择选项' },
  prefix: { type: String, default: '' },
  size: { type: String, default: 'md' },
  tone: { type: String, default: 'light' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])
const root = ref(null)
const trigger = ref(null)
const optionRefs = ref([])
const open = ref(false)

const normalizedOptions = computed(() => props.options.map((option) => {
  if (typeof option === 'object' && option !== null) {
    return {
      value: option.value ?? option.id ?? option.label ?? option.name,
      label: option.label ?? option.name ?? option.value ?? option.id,
      detail: option.detail ?? '',
      disabled: Boolean(option.disabled),
    }
  }
  return { value: option, label: option, detail: '', disabled: false }
}))

const selected = computed(() => normalizedOptions.value.find((option) => Object.is(option.value, props.modelValue)) || normalizedOptions.value[0])

function closeMenu(refocus = false) {
  open.value = false
  if (refocus) nextTick(() => trigger.value?.focus())
}

function choose(option) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  closeMenu(true)
}

function setOptionRef(element, index) {
  if (element) optionRefs.value[index] = element
}

function focusOption(index) {
  const enabled = normalizedOptions.value
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ option }) => !option.disabled)
  if (!enabled.length) return
  const target = enabled.find(({ optionIndex }) => optionIndex === index) || enabled[0]
  open.value = true
  nextTick(() => optionRefs.value[target.optionIndex]?.focus())
}

function handleTriggerKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const index = normalizedOptions.value.findIndex((option) => Object.is(option.value, props.modelValue))
    focusOption(index)
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    const index = normalizedOptions.value.findIndex((option) => Object.is(option.value, props.modelValue))
    focusOption(index)
  }
}

function handleOptionKeydown(event, index) {
  const enabled = normalizedOptions.value
    .map((option, optionIndex) => ({ option, optionIndex }))
    .filter(({ option }) => !option.disabled)
  const current = enabled.findIndex(({ optionIndex }) => optionIndex === index)
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const delta = event.key === 'ArrowDown' ? 1 : -1
    const next = enabled[(current + delta + enabled.length) % enabled.length]
    focusOption(next.optionIndex)
  }
  if (event.key === 'Home') {
    event.preventDefault()
    focusOption(enabled[0]?.optionIndex)
  }
  if (event.key === 'End') {
    event.preventDefault()
    focusOption(enabled.at(-1)?.optionIndex)
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
  }
}

function onDocumentPointerdown(event) {
  if (!root.value?.contains(event.target)) closeMenu()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerdown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerdown))
</script>

<template>
  <div ref="root" class="app-select" :class="[`size-${size}`, `tone-${tone}`, { open, disabled }]" @keydown.esc.prevent="closeMenu(true)">
    <button
      ref="trigger"
      class="app-select-trigger"
      type="button"
      :disabled="disabled"
      :aria-label="ariaLabel"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
      @keydown="handleTriggerKeydown"
    >
      <span class="app-select-copy">
        <small v-if="prefix" class="app-select-prefix">{{ prefix }}</small>
        <b>{{ selected?.label }}</b>
        <small v-if="selected?.detail" class="app-select-detail">{{ selected.detail }}</small>
      </span>
      <ChevronDown :size="18" stroke-width="2" aria-hidden="true" />
    </button>

    <Transition name="app-select-pop">
      <div v-if="open" class="app-select-menu" role="listbox" :aria-label="ariaLabel">
        <button
          v-for="(option, index) in normalizedOptions"
          :key="String(option.value)"
          :ref="(element) => setOptionRef(element, index)"
          type="button"
          role="option"
          :disabled="option.disabled"
          :aria-selected="Object.is(option.value, modelValue)"
          :class="{ selected: Object.is(option.value, modelValue) }"
          @click="choose(option)"
          @keydown="handleOptionKeydown($event, index)"
        >
          <span class="app-select-copy"><b>{{ option.label }}</b><small v-if="option.detail" class="app-select-detail">{{ option.detail }}</small></span>
          <Check v-if="Object.is(option.value, modelValue)" :size="17" stroke-width="2.5" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-select { position: relative; z-index: 1; width: 100%; --app-select-height: 46px; }
.app-select.size-sm { --app-select-height: 42px; }
.app-select.size-lg { --app-select-height: 50px; }
.app-select.open, .app-select:focus-within { z-index: 25; }
.app-select-trigger { width: 100%; min-height: var(--app-select-height); display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 8px 15px 8px 16px; color: var(--ink-2); border: 1px solid #cadde7; border-radius: 10px; background: rgba(250,253,254,.96); text-align: left; transition: border-color .18s ease, background .18s ease, box-shadow .18s ease; }
.app-select-trigger:hover, .app-select.open .app-select-trigger { border-color: #80bee0; background: #fff; }
.app-select-trigger:focus-visible { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(0, 134, 209, .12); }
.app-select-copy { min-width: 0; display: flex; flex: 1; flex-wrap: wrap; align-items: baseline; gap: 6px 8px; line-height: 1.2; }
.app-select-copy b { font-size: 15px; font-weight: 750; }
.app-select-copy small { font-size: 13px; font-weight: 650; }
.app-select-prefix, .app-select-detail { color: #66849a; }
.app-select-prefix { flex: 0 0 auto; }
.app-select-trigger > svg { flex: 0 0 auto; color: #5a89a2; transition: color .18s ease, transform .18s ease; }
.app-select.open .app-select-trigger > svg { color: var(--brand-strong); transform: rotate(180deg); }
.app-select-menu { position: absolute; z-index: 2; top: calc(100% + 8px); right: 0; left: 0; display: grid; gap: 3px; padding: 7px; border: 1px solid #c9dce7; border-radius: 13px; background: rgba(255,255,255,.98); box-shadow: 0 18px 34px rgba(29,76,104,.16), 0 2px 5px rgba(29,76,104,.06); backdrop-filter: blur(14px); }
.app-select-menu button { min-height: 44px; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 8px 11px; color: var(--ink-2); border-radius: 8px; background: transparent; text-align: left; transition: color .16s ease, background .16s ease; }
.app-select-menu button:hover, .app-select-menu button:focus-visible { color: var(--brand-strong); background: #f0f8fc; }
.app-select-menu button.selected { color: #075f90; background: #e5f4fc; }
.app-select-menu button.selected > svg { flex: 0 0 auto; color: var(--brand); }
.app-select.tone-dark .app-select-trigger { color: #eaf7ff; border-color: var(--cockpit-line-strong, #2b5064); background: var(--cockpit-surface-raised, #102c3e); }
.app-select.tone-dark .app-select-trigger:hover, .app-select.tone-dark.open .app-select-trigger { border-color: rgba(103,201,237,.72); background: #15364a; }
.app-select.tone-dark .app-select-prefix, .app-select.tone-dark .app-select-detail { color: var(--cockpit-muted, #99b2c1); }
.app-select.tone-dark .app-select-trigger > svg { color: var(--cockpit-accent, #67c9ed); }
.app-select.tone-dark .app-select-menu { border-color: #315d74; background: rgba(10,31,46,.98); box-shadow: 0 18px 34px rgba(0,12,22,.34); }
.app-select.tone-dark .app-select-menu button { color: #eaf7ff; }
.app-select.tone-dark .app-select-menu button:hover, .app-select.tone-dark .app-select-menu button:focus-visible { color: #fff; background: rgba(103,201,237,.13); }
.app-select.tone-dark .app-select-menu button.selected { color: #fff; background: rgba(103,201,237,.2); }
.app-select.tone-dark .app-select-menu button.selected > svg { color: var(--cockpit-accent, #67c9ed); }
.app-select-pop-enter-active, .app-select-pop-leave-active { transition: opacity .16s ease, transform .16s ease; }
.app-select-pop-enter-from, .app-select-pop-leave-to { opacity: 0; transform: translateY(-5px) scale(.985); }
@media (prefers-reduced-motion: reduce) {
  .app-select-trigger, .app-select-trigger > svg, .app-select-menu button, .app-select-pop-enter-active, .app-select-pop-leave-active { transition: none; }
}
</style>
