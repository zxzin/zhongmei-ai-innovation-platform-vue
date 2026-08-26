import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { companyLibraries, companyLibraryFiles } from '../data/platform.js'

const STORAGE_KEY = 'cm-vue-company-knowledge-v1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function initialVisibility(id) {
  if (id === 'CKB-01') return { mode: 'group', ownerDepartmentId: '', departmentIds: [] }
  if (id === 'CKB-02') return { mode: 'department-children', ownerDepartmentId: 'dept-中煤深圳研究院', departmentIds: [] }
  return { mode: 'custom', ownerDepartmentId: 'dept-中煤深圳研究院', departmentIds: ['dept-中煤深圳研究院', 'dept-煤矿智能化公司'] }
}

function initialState() {
  return {
    libraries: clone(companyLibraries).map((item) => ({ ...item, visibility: initialVisibility(item.id) })),
    files: clone(companyLibraryFiles),
  }
}

function normalizeState(saved) {
  const seed = initialState()
  const savedLibraries = Array.isArray(saved?.libraries) ? saved.libraries : []
  const savedFiles = Array.isArray(saved?.files) ? saved.files : []
  const libraryById = new Map(savedLibraries.map((item) => [item.id, item]))
  const fileById = new Map(savedFiles.map((item) => [item.id, item]))

  return {
    libraries: [
      ...seed.libraries.map((item) => ({
        ...item,
        ...(libraryById.get(item.id) || {}),
        visibility: libraryById.get(item.id)?.visibility?.ownerDepartmentId === 'dept-中煤集团'
          ? item.visibility
          : libraryById.get(item.id)?.visibility || item.visibility,
      })),
      ...savedLibraries.filter((item) => !seed.libraries.some((seedItem) => seedItem.id === item.id)),
    ],
    files: [
      ...seed.files.map((item) => fileById.get(item.id) || item),
      ...savedFiles.filter((item) => !seed.files.some((seedItem) => seedItem.id === item.id)),
    ],
  }
}

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && Array.isArray(saved.libraries) && Array.isArray(saved.files)) return normalizeState(saved)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return initialState()
}

function timestamp() {
  return new Date().toLocaleString('sv-SE', { hour12: false }).replace('T', ' ')
}

function fileType(name = '') {
  const extension = name.split('.').pop()?.toLowerCase()
  return ({ doc: 'Word', docx: 'Word', xls: 'Excel', xlsx: 'Excel', ppt: 'PPT', pptx: 'PPT', pdf: 'PDF', txt: '文本' })[extension] || '文件'
}

function fileSize(bytes = 0) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const useCompanyKnowledgeStore = defineStore('companyKnowledge', () => {
  const state = readState()
  const libraries = ref(state.libraries)
  const files = ref(state.files)

  watch([libraries, files], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ libraries: libraries.value, files: files.value }))
  }, { deep: true })

  function filesFor(libraryId) {
    return files.value.filter((item) => item.libraryId === libraryId)
  }

  function createLibrary(payload) {
    const id = `CKB-${Date.now().toString(36).toUpperCase()}`
    const entry = {
      id,
      name: payload.name.trim(),
      description: payload.description.trim(),
      updated: timestamp(),
      visibility: clone(payload.visibility),
    }
    libraries.value.unshift(entry)
    return entry
  }

  function updateLibrary(id, payload) {
    const index = libraries.value.findIndex((item) => item.id === id)
    if (index === -1) return null
    const entry = {
      ...libraries.value[index],
      name: payload.name.trim(),
      description: payload.description.trim(),
      updated: timestamp(),
      visibility: clone(payload.visibility),
    }
    libraries.value[index] = entry
    return entry
  }

  function addFiles(libraryId, selectedFiles) {
    const added = Array.from(selectedFiles || []).map((file, index) => ({
      id: `CKB-DOC-${Date.now().toString(36).toUpperCase()}-${index + 1}`,
      libraryId,
      name: file.name,
      type: fileType(file.name),
      size: fileSize(file.size),
      source: '管理员上传',
      updated: timestamp(),
      status: '待解析',
    }))
    files.value.unshift(...added)
    return added
  }

  function removeFile(id) {
    files.value = files.value.filter((item) => item.id !== id)
  }

  return { libraries, files, filesFor, createLibrary, updateLibrary, addFiles, removeFile }
})
