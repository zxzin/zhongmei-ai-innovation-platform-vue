import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { findDirectoryUser } from './adminWorkspace.js'
import { changeCredentialPassword, resetCredentialPassword, verifyCredentials } from '../services/authGateway.js'
import { isManagementAdmin, normalizeRole } from '../services/accessPolicy.js'

const profileDetails = {
  Admin: { email: 'zhangsan@chinacoal.com' },
  User: { email: 'xu.bo@chinacoal.com' },
}

function resolveDirectoryProfile(account) {
  const user = findDirectoryUser(account)
  const details = profileDetails[account] || {}
  if (!user || user.status !== '启用') return null
  return {
    account,
    name: user.name,
    label: user.role,
    role: normalizeRole(user.role),
    avatar: user.name?.slice(0, 1) || '用',
    employeeId: user.id,
    email: details.email || user.email || '未设置',
    department: user.department,
    departmentId: user.departmentId || '',
    company: user.company,
  }
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
  const profile = ref(saved ? resolveDirectoryProfile(saved.account) : null)
  if (saved && !profile.value) localStorage.removeItem('cm-vue-session')
  const authenticated = computed(() => Boolean(profile.value))
  const isAdmin = computed(() => isManagementAdmin(profile.value))

  async function login(account = 'Admin', password = '') {
    const nextProfile = resolveDirectoryProfile(account)
    if (!nextProfile) return false
    if (!await verifyCredentials({ account, password })) return false
    profile.value = nextProfile
    localStorage.setItem('cm-vue-session', JSON.stringify({ account: profile.value.account }))
    return true
  }

  function logout() {
    profile.value = null
    localStorage.removeItem('cm-vue-session')
  }

  function updateProfile(changes) {
    if (!profile.value) return
    profile.value = { ...profile.value, ...changes }
  }

  function syncDirectoryUser(user) {
    if (!user?.account || profile.value?.account !== user.account) return
    const nextProfile = user.status === '启用' ? {
      account: user.account,
      name: user.name,
      label: user.role,
      role: normalizeRole(user.role),
      avatar: user.name?.slice(0, 1) || '用',
      employeeId: user.id,
      email: profileDetails[user.account]?.email || user.email || '未设置',
      department: user.department,
      departmentId: user.departmentId || '',
      company: user.company,
    } : null
    if (!nextProfile) {
      logout()
      return
    }
    profile.value = nextProfile
    localStorage.setItem('cm-vue-session', JSON.stringify({ account: nextProfile.account }))
  }

  async function changePassword({ currentPassword, newPassword }) {
    if (!profile.value) return { ok: false, code: 'NOT_AUTHENTICATED' }
    return changeCredentialPassword({ account: profile.value.account, currentPassword, newPassword })
  }

  async function resetUserPassword({ account, newPassword }) {
    if (!isAdmin.value) return { ok: false, code: 'FORBIDDEN' }
    return resetCredentialPassword({ account, newPassword })
  }

  return { profile, authenticated, isAdmin, login, logout, updateProfile, syncDirectoryUser, changePassword, resetUserPassword, profiles: profileDetails }
})
