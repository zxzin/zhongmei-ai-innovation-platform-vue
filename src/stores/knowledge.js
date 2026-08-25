import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { personalLibraries, libraryFiles, recycledFiles, recycledPersonalLibraries } from '../data/platform.js'

const STORAGE_KEY = 'cm-vue-personal-knowledge-v1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function initialState() {
  return {
    libraries: clone(personalLibraries),
    files: clone(libraryFiles),
    recycledLibraries: clone(recycledPersonalLibraries),
    recycledFiles: clone(recycledFiles),
  }
}

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && ['libraries', 'files', 'recycledLibraries', 'recycledFiles'].every((key) => Array.isArray(saved[key]))) return saved
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return initialState()
}

function timestamp() {
  return new Date().toLocaleString('sv-SE', { hour12: false }).replace('T', ' ')
}

function remainingDays() {
  return '剩余 30 天'
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

export const useKnowledgeStore = defineStore('knowledge', () => {
  const state = readState()
  const libraries = ref(state.libraries)
  const files = ref(state.files)
  const recycledLibraries = ref(state.recycledLibraries)
  const recycledFiles = ref(state.recycledFiles)
  const recycleExampleOwners = ref(Array.isArray(state.recycleExampleOwners) ? state.recycleExampleOwners : [])

  watch([libraries, files, recycledLibraries, recycledFiles, recycleExampleOwners], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      libraries: libraries.value,
      files: files.value,
      recycledLibraries: recycledLibraries.value,
      recycledFiles: recycledFiles.value,
      recycleExampleOwners: recycleExampleOwners.value,
    }))
  }, { deep: true })

  function librariesFor(owner) {
    return libraries.value.filter((item) => item.owner === owner)
  }

  function filesFor(owner, libraryId) {
    return files.value.filter((item) => item.owner === owner && item.libraryId === libraryId)
  }

  function recycledFilesFor(owner, libraryId) {
    return recycledFiles.value.filter((item) => item.owner === owner && (!libraryId || item.libraryId === libraryId))
  }

  function recycledLibrariesFor(owner) {
    return recycledLibraries.value.filter((item) => item.owner === owner)
  }

  function ensureRecycleExamples(owner) {
    if (recycleExampleOwners.value.includes(owner)) return
    const seeded = initialState()
    const libraryExample = seeded.recycledLibraries.find((item) => item.owner === owner)
    const fileExample = seeded.recycledFiles.find((item) => item.owner === owner)
    if (libraryExample && !recycledLibraries.value.some((item) => item.id === libraryExample.id)) {
      recycledLibraries.value.unshift(libraryExample)
    }
    if (fileExample && !recycledFiles.value.some((item) => item.id === fileExample.id)) {
      recycledFiles.value.unshift(fileExample)
    }
    recycleExampleOwners.value = [...recycleExampleOwners.value, owner]
  }

  function createLibrary(owner, payload) {
    const id = `PKB-${Date.now().toString(36).toUpperCase()}`
    const entry = { id, owner, name: payload.name.trim(), description: payload.description.trim(), access: '仅本人', updated: timestamp() }
    libraries.value.unshift(entry)
    return entry
  }

  function updateLibrary(owner, id, payload) {
    const index = libraries.value.findIndex((item) => item.owner === owner && item.id === id)
    if (index === -1) return null
    const entry = { ...libraries.value[index], name: payload.name.trim(), description: payload.description.trim(), updated: timestamp() }
    libraries.value[index] = entry
    return entry
  }

  function recycleLibrary(owner, id) {
    const index = libraries.value.findIndex((item) => item.owner === owner && item.id === id)
    if (index === -1) return null
    const [entry] = libraries.value.splice(index, 1)
    recycledLibraries.value.unshift({ ...entry, deleted: timestamp(), expires: remainingDays() })
    return entry
  }

  function restoreLibrary(owner, id) {
    const index = recycledLibraries.value.findIndex((item) => item.owner === owner && item.id === id)
    if (index === -1) return null
    const [entry] = recycledLibraries.value.splice(index, 1)
    const restored = { ...entry, updated: timestamp() }
    delete restored.deleted
    delete restored.expires
    libraries.value.unshift(restored)
    return restored
  }

  function permanentlyDeleteLibrary(owner, id) {
    recycledLibraries.value = recycledLibraries.value.filter((item) => !(item.owner === owner && item.id === id))
    files.value = files.value.filter((item) => !(item.owner === owner && item.libraryId === id))
    recycledFiles.value = recycledFiles.value.filter((item) => !(item.owner === owner && item.libraryId === id))
  }

  function addFiles(owner, libraryId, selectedFiles) {
    const added = Array.from(selectedFiles || []).map((file, index) => ({
      id: `DOC-${Date.now().toString(36).toUpperCase()}-${index + 1}`,
      owner,
      libraryId,
      name: file.name,
      type: fileType(file.name),
      size: fileSize(file.size),
      source: '个人上传',
      updated: timestamp(),
    }))
    files.value.unshift(...added)
    return added
  }

  function recycleFile(owner, id) {
    const index = files.value.findIndex((item) => item.owner === owner && item.id === id)
    if (index === -1) return null
    const [entry] = files.value.splice(index, 1)
    recycledFiles.value.unshift({ ...entry, deleted: timestamp(), expires: remainingDays() })
    return entry
  }

  function restoreFile(owner, id) {
    const index = recycledFiles.value.findIndex((item) => item.owner === owner && item.id === id)
    if (index === -1) return null
    const [entry] = recycledFiles.value.splice(index, 1)
    const restored = { ...entry, updated: timestamp() }
    delete restored.deleted
    delete restored.expires
    files.value.unshift(restored)
    return restored
  }

  function permanentlyDeleteFile(owner, id) {
    recycledFiles.value = recycledFiles.value.filter((item) => !(item.owner === owner && item.id === id))
  }

  return {
    librariesFor,
    filesFor,
    recycledFilesFor,
    recycledLibrariesFor,
    ensureRecycleExamples,
    createLibrary,
    updateLibrary,
    recycleLibrary,
    restoreLibrary,
    permanentlyDeleteLibrary,
    addFiles,
    recycleFile,
    restoreFile,
    permanentlyDeleteFile,
  }
})
