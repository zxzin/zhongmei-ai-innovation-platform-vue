import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem('cm-vue-ui') || '{}')
  } catch {
    localStorage.removeItem('cm-vue-ui')
    return {}
  }
}

export const useUiStore = defineStore('ui', () => {
  const saved = readPreferences()
  const layout = ref(saved.layout || 'top')
  const theme = ref(saved.theme || 'clear')
  const sidebarCollapsed = ref(Boolean(saved.sidebarCollapsed))
  const cockpitFullscreen = ref(false)
  const toast = ref(null)
  let toastTimer

  watch([layout, theme, sidebarCollapsed], () => {
    localStorage.setItem('cm-vue-ui', JSON.stringify({ layout: layout.value, theme: theme.value, sidebarCollapsed: sidebarCollapsed.value }))
  }, { deep: true })

  function notify(message, tone = 'info') {
    clearTimeout(toastTimer)
    toast.value = { message, tone }
    toastTimer = setTimeout(() => { toast.value = null }, 2400)
  }

  function setCockpitFullscreen(value) {
    cockpitFullscreen.value = Boolean(value)
  }

  return { layout, theme, sidebarCollapsed, cockpitFullscreen, toast, notify, setCockpitFullscreen }
})
