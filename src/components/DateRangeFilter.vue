<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { CalendarDays, Check, ChevronDown, RotateCcw } from '@lucide/vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ start: '', end: '' }) },
  ariaLabel: { type: String, default: '选择日期范围' },
  prefix: { type: String, default: '日期' },
})

const emit = defineEmits(['update:modelValue', 'change'])
const root = ref(null)
const trigger = ref(null)
const open = ref(false)
const draftStart = ref('')
const draftEnd = ref('')
const selectedPreset = ref('')
const validationMessage = ref('')

const quickRanges = [
  { id: 'today', label: '今日' },
  { id: 'week', label: '近 7 天' },
  { id: 'month', label: '近 30 天' },
  { id: 'thisMonth', label: '本月' },
]

const selectedLabel = computed(() => {
  const { start = '', end = '' } = props.modelValue || {}
  if (!start && !end) return '全部时间'
  if (start && end) return `${start} 至 ${end}`
  return start ? `自 ${start}` : `截至 ${end}`
})

function toDateKey(date) {
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const timezoneOffset = localDate.getTimezoneOffset() * 60_000
  return new Date(localDate.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

function dateOffset(days) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

function thisMonthStart() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(1)
  return toDateKey(date)
}

function presetRange(preset) {
  const end = dateOffset(0)
  if (preset === 'today') return { start: end, end }
  if (preset === 'week') return { start: dateOffset(-6), end }
  if (preset === 'month') return { start: dateOffset(-29), end }
  if (preset === 'thisMonth') return { start: thisMonthStart(), end }
  return { start: '', end: '' }
}

function findPreset(start, end) {
  return quickRanges.find((item) => {
    const range = presetRange(item.id)
    return range.start === start && range.end === end
  })?.id || ''
}

function syncDraft() {
  draftStart.value = props.modelValue?.start || ''
  draftEnd.value = props.modelValue?.end || ''
  selectedPreset.value = findPreset(draftStart.value, draftEnd.value)
  validationMessage.value = ''
}

function openMenu() {
  syncDraft()
  open.value = true
}

function closeMenu(refocus = false) {
  open.value = false
  validationMessage.value = ''
  if (refocus) nextTick(() => trigger.value?.focus())
}

function toggleMenu() {
  if (open.value) closeMenu()
  else openMenu()
}

function choosePreset(preset) {
  const range = presetRange(preset)
  draftStart.value = range.start
  draftEnd.value = range.end
  selectedPreset.value = preset
  validationMessage.value = ''
}

function onManualDateChange() {
  selectedPreset.value = findPreset(draftStart.value, draftEnd.value)
  validationMessage.value = ''
}

function applyRange() {
  if (draftStart.value && draftEnd.value && draftStart.value > draftEnd.value) {
    validationMessage.value = '结束日期不能早于开始日期。'
    return
  }
  const nextValue = { start: draftStart.value, end: draftEnd.value }
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
  closeMenu(true)
}

function clearRange() {
  draftStart.value = ''
  draftEnd.value = ''
  selectedPreset.value = ''
  emit('update:modelValue', { start: '', end: '' })
  emit('change', { start: '', end: '' })
  closeMenu(true)
}

function onDocumentPointerdown(event) {
  if (!root.value?.contains(event.target)) closeMenu()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerdown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerdown))
</script>

<template>
  <div ref="root" class="date-range-filter" :class="{ open }" @keydown.esc.prevent="closeMenu(true)">
    <button
      ref="trigger"
      class="date-range-trigger"
      type="button"
      :aria-label="ariaLabel"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="toggleMenu"
    >
      <span class="date-range-copy"><small>{{ prefix }}</small><b>{{ selectedLabel }}</b></span>
      <span class="date-range-trigger-icons"><CalendarDays :size="16" aria-hidden="true" /><ChevronDown :size="17" stroke-width="2.2" aria-hidden="true" /></span>
    </button>

    <Transition name="date-range-pop">
      <section v-if="open" class="date-range-menu" role="dialog" :aria-label="ariaLabel">
        <header>
          <div><b>时间范围</b><small>选择后点击确定生效</small></div>
          <button type="button" class="date-range-clear" @click="clearRange"><RotateCcw :size="14" />清除</button>
        </header>

        <div class="date-range-presets" aria-label="快捷日期范围">
          <button
            v-for="preset in quickRanges"
            :key="preset.id"
            type="button"
            :class="{ selected: selectedPreset === preset.id }"
            @click="choosePreset(preset.id)"
          >
            <Check v-if="selectedPreset === preset.id" :size="13" stroke-width="2.7" aria-hidden="true" />
            <span>{{ preset.label }}</span>
          </button>
        </div>

        <div class="date-range-inputs">
          <label><span>开始日期</span><input v-model="draftStart" type="date" :max="draftEnd || undefined" @input="onManualDateChange" /></label>
          <i aria-hidden="true" />
          <label><span>结束日期</span><input v-model="draftEnd" type="date" :min="draftStart || undefined" @input="onManualDateChange" /></label>
        </div>

        <p v-if="validationMessage" class="date-range-error" role="alert">{{ validationMessage }}</p>

        <footer>
          <button type="button" class="date-range-cancel" @click="closeMenu(true)">取消</button>
          <button type="button" class="date-range-confirm" @click="applyRange">确定</button>
        </footer>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.date-range-filter { position: relative; z-index: 1; width: 100%; }
.date-range-filter.open, .date-range-filter:focus-within { z-index: 30; }
.date-range-trigger { width: 100%; min-height: 42px; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 7px 11px; color: var(--ink-2); border: 1px solid #cadde7; border-radius: 10px; background: rgba(250,253,254,.96); text-align: left; transition: border-color .18s ease, background .18s ease, box-shadow .18s ease; }
.date-range-trigger:hover, .date-range-filter.open .date-range-trigger { border-color: #80bee0; background: #fff; }
.date-range-trigger:focus-visible { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(0,134,209,.12); outline: none; }
.date-range-copy { min-width: 0; display: flex; align-items: baseline; gap: 6px; line-height: 1.2; }
.date-range-copy small { flex: 0 0 auto; color: #7894a7; font-size: 11px; font-weight: 700; }
.date-range-copy b { min-width: 0; overflow: hidden; color: var(--ink-2); font-size: 13px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; }
.date-range-trigger-icons { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 8px; color: #5a89a2; }
.date-range-trigger-icons svg:last-child { transition: color .18s ease, transform .18s ease; }
.date-range-filter.open .date-range-trigger-icons { color: var(--brand-strong); }
.date-range-filter.open .date-range-trigger-icons svg:last-child { transform: rotate(180deg); }
.date-range-menu { width: min(382px,calc(100vw - 32px)); position: absolute; z-index: 2; top: calc(100% + 8px); left: 0; display: grid; gap: 14px; padding: 15px; border: 1px solid #c9dce7; border-radius: 14px; background: rgba(255,255,255,.985); box-shadow: 0 18px 34px rgba(29,76,104,.16), 0 2px 5px rgba(29,76,104,.06); backdrop-filter: blur(14px); }
.date-range-menu > header, .date-range-menu > footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.date-range-menu > header > div { display: grid; gap: 3px; }
.date-range-menu > header b { color: var(--ink); font-size: 13px; }
.date-range-menu > header small { color: var(--muted); font-size: 11px; }
.date-range-clear { display: inline-flex; align-items: center; gap: 4px; padding: 4px 2px; color: #67869a; border-radius: 6px; background: transparent; font-size: 11px; font-weight: 750; }
.date-range-clear:hover, .date-range-clear:focus-visible { color: var(--brand-strong); background: #f0f8fc; outline: none; }
.date-range-presets { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 6px; }
.date-range-presets button { min-height: 31px; display: inline-flex; align-items: center; justify-content: center; gap: 3px; padding: 4px 3px; color: #55758a; border: 1px solid #d6e4eb; border-radius: 7px; background: #fbfdfe; font-size: 11px; font-weight: 750; white-space: nowrap; transition: border-color .16s ease, color .16s ease, background .16s ease; }
.date-range-presets button:hover, .date-range-presets button:focus-visible { color: var(--brand-strong); border-color: #a6d0e5; background: #f3faff; outline: none; }
.date-range-presets button.selected { color: #086eaa; border-color: #87c8e8; background: #e7f5fc; }
.date-range-inputs { display: grid; grid-template-columns: minmax(0,1fr) 12px minmax(0,1fr); align-items: end; gap: 7px; }
.date-range-inputs > i { height: 1px; margin-bottom: 16px; background: #acc8d8; }
.date-range-inputs label { min-width: 0; display: grid; gap: 5px; }
.date-range-inputs label > span { color: #7590a2; font-size: 10px; font-weight: 750; }
.date-range-inputs input { min-width: 0; width: 100%; height: 34px; padding: 0 7px; color: var(--ink-2); border: 1px solid #cadde7; border-radius: 7px; background: #fff; font: inherit; font-size: 11px; font-weight: 750; }
.date-range-inputs input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(0,134,209,.1); outline: none; }
.date-range-error { margin: -4px 0 0; color: #c25252; font-size: 11px; font-weight: 700; }
.date-range-menu > footer { justify-content: flex-end; padding-top: 2px; }
.date-range-menu > footer button { min-height: 31px; padding: 0 12px; border-radius: 7px; font-size: 11px; font-weight: 800; }
.date-range-cancel { color: #638198; background: transparent; }
.date-range-cancel:hover, .date-range-cancel:focus-visible { color: var(--ink-2); background: #f1f7fa; outline: none; }
.date-range-confirm { color: #fff; background: var(--brand); box-shadow: 0 6px 12px rgba(0,134,209,.16); }
.date-range-confirm:hover, .date-range-confirm:focus-visible { background: var(--brand-strong); outline: none; }
.date-range-pop-enter-active, .date-range-pop-leave-active { transition: opacity .16s ease, transform .16s ease; }
.date-range-pop-enter-from, .date-range-pop-leave-to { opacity: 0; transform: translateY(-5px) scale(.985); }
@media (prefers-reduced-motion: reduce) {
  .date-range-trigger, .date-range-trigger-icons svg:last-child, .date-range-presets button, .date-range-pop-enter-active, .date-range-pop-leave-active { transition: none; }
}
@media (max-width: 720px) {
  .date-range-menu { width: 100%; }
}
</style>
