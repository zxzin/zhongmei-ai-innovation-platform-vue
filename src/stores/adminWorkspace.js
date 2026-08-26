import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { templates as seedTemplates, users as seedUsers } from '../data/demo.js'
import { normalizeInnovationWeights } from '../data/innovationTemplate.js'

const STORAGE_KEY = 'cm-vue-admin-workspace-v1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function timestamp() {
  return new Date().toLocaleString('sv-SE', { hour12: false }).replace('T', ' ')
}

function templateKind(item = {}) {
  return item.kind || (item.scope === '创新性分析' ? 'scoring' : 'document')
}

function normalizeTemplate(item = {}) {
  const kind = templateKind(item)
  return {
    id: item.id || `TPL-${Date.now().toString(36).toUpperCase()}`,
    name: item.name || '未命名模板',
    kind,
    version: item.version || 'V1',
    scope: item.scope || (kind === 'scoring' ? '创新性分析' : '技术预研报告'),
    owner: item.owner || '科研管理部',
    status: item.status || '草稿',
    updatedAt: item.updatedAt || timestamp(),
    weights: kind === 'scoring' ? normalizeInnovationWeights(item.weights) : null,
    sections: kind === 'document' ? String(item.sections || '') : '',
  }
}

function defaultModelConfig() {
  return {
    activeMode: 'local',
    local: {
      service: 'deepseek-v4-local',
      endpoint: '',
      apiPath: '/v1/chat/completions',
      modelId: 'deepseek-v4',
      credentialConfigured: false,
      timeout: '60',
      checkedAt: '',
      checkStatus: '',
    },
    cloud: {
      service: 'deepseek-v3-cloud',
      endpoint: '',
      apiPath: '/v1/chat/completions',
      modelId: 'deepseek-chat',
      credentialConfigured: false,
      timeout: '60',
      checkedAt: '',
      checkStatus: '',
    },
  }
}

function initialState() {
  return {
    users: clone(seedUsers),
    templates: clone(seedTemplates).map(normalizeTemplate),
    modelConfig: defaultModelConfig(),
  }
}

function normalizeModelConfig(config = {}) {
  const defaults = defaultModelConfig()
  const normalizeConnection = (mode) => ({
    service: String(config[mode]?.service || defaults[mode].service),
    endpoint: String(config[mode]?.endpoint || ''),
    apiPath: String(config[mode]?.apiPath || defaults[mode].apiPath),
    modelId: String(config[mode]?.modelId || defaults[mode].modelId),
    credentialConfigured: Boolean(config[mode]?.credentialConfigured),
    timeout: String(config[mode]?.timeout || defaults[mode].timeout),
    checkedAt: String(config[mode]?.checkedAt || ''),
    checkStatus: String(config[mode]?.checkStatus || ''),
  })

  return {
    activeMode: config.activeMode === 'cloud' ? 'cloud' : 'local',
    local: normalizeConnection('local'),
    cloud: normalizeConnection('cloud'),
  }
}

function normalizeState(saved) {
  const seed = initialState()
  const storedUsers = Array.isArray(saved?.users) ? saved.users : null
  const storedTemplates = Array.isArray(saved?.templates) ? saved.templates : null
  return {
    users: storedUsers?.length ? storedUsers.map((item) => ({ ...item })) : seed.users,
    templates: storedTemplates?.length ? storedTemplates.map(normalizeTemplate) : seed.templates,
    modelConfig: normalizeModelConfig(saved?.modelConfig),
  }
}

export function readAdminWorkspaceState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return normalizeState(saved)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return initialState()
  }
}

function writeAdminWorkspaceState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function findDirectoryUser(account) {
  if (!account) return null
  return readAdminWorkspaceState().users.find((user) => user.account === account) || null
}

export const useAdminWorkspaceStore = defineStore('adminWorkspace', () => {
  const initial = readAdminWorkspaceState()
  const users = ref(initial.users)
  const templates = ref(initial.templates)
  const modelConfig = ref(initial.modelConfig)

  function persist() {
    writeAdminWorkspaceState({ users: users.value, templates: templates.value, modelConfig: modelConfig.value })
  }

  watch([users, templates, modelConfig], persist, { deep: true })

  function upsertUsers(records = []) {
    const summary = { created: 0, updated: 0 }
    records.forEach((record) => {
      const index = users.value.findIndex((user) => user.id === record.id || (record.account && user.account === record.account))
      if (index >= 0) {
        users.value.splice(index, 1, { ...users.value[index], ...record })
        summary.updated += 1
      } else {
        users.value.push({ ...record })
        summary.created += 1
      }
    })
    persist()
    return summary
  }

  function createTemplate(payload) {
    const entry = normalizeTemplate({
      id: `TPL-${Date.now().toString(36).toUpperCase()}`,
      ...payload,
      updatedAt: timestamp(),
    })
    templates.value.unshift(entry)
    persist()
    return entry
  }

  function saveModelConfiguration(mode, connection) {
    const nextMode = mode === 'cloud' ? 'cloud' : 'local'
    const { credential, ...safeConnection } = clone(connection)
    modelConfig.value = normalizeModelConfig({
      ...modelConfig.value,
      activeMode: nextMode,
      [nextMode]: {
        ...modelConfig.value[nextMode],
        ...safeConnection,
        credentialConfigured: Boolean(credential) || modelConfig.value[nextMode]?.credentialConfigured,
      },
    })
    persist()
  }

  return { users, templates, modelConfig, upsertUsers, createTemplate, saveModelConfiguration, persist }
})
