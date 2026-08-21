import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const profiles = {
  Admin: { account: 'Admin', name: '平台管理员', label: '平台管理员', role: 'admin', avatar: 'A', department: '科研管理部', company: '中煤深圳研究院' },
  User: { account: 'User', name: '徐博', label: '科研人员', role: 'researcher', avatar: '徐', department: '技术研发部', company: '中煤深圳研究院' },
  Judge: { account: 'Judge', name: '李专家', label: '复核专家', role: 'reviewer', avatar: '李', department: '专家委员会', company: '中煤深圳研究院' },
}

function readSavedSession() {
  try {
    return JSON.parse(localStorage.getItem('cm-vue-session') || 'null')
  } catch {
    localStorage.removeItem('cm-vue-session')
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const saved = readSavedSession()
  const profile = ref(saved && profiles[saved.account] ? profiles[saved.account] : null)
  const authenticated = computed(() => Boolean(profile.value))
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const canViewCockpit = computed(() => ['admin', 'reviewer'].includes(profile.value?.role))

  function login(account = 'Admin') {
    profile.value = profiles[account] || profiles.Admin
    localStorage.setItem('cm-vue-session', JSON.stringify({ account: profile.value.account }))
  }

  function logout() {
    profile.value = null
    localStorage.removeItem('cm-vue-session')
  }

  function updateProfile(changes) {
    if (!profile.value) return
    profile.value = { ...profile.value, ...changes }
  }

  return { profile, authenticated, isAdmin, canViewCockpit, login, logout, updateProfile, profiles }
})
