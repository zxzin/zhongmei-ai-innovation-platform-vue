<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArchiveRestore, ArrowLeft, ArrowUpRight, BookOpenText, Check, FileText, FolderOpen, Pencil, Plus, RotateCcw, Search, Trash2, Upload, X } from '@lucide/vue'
import PageHeader from '../components/PageHeader.vue'
import BaseSelect from '../components/BaseSelect.vue'
import { useAuthStore } from '../stores/auth.js'
import { useKnowledgeStore } from '../stores/knowledge.js'
import { useUiStore } from '../stores/ui.js'
import { routeChoice, useRouteQueryState } from '../composables/useRouteQueryState.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const knowledge = useKnowledgeStore()
const ui = useUiStore()

const owner = computed(() => auth.profile?.account || 'User')
const workspace = useRouteQueryState(route, router, 'workspace', 'manage', {
  ...routeChoice(['manage', 'recycle', 'detail'], 'manage'),
  serialize: (value) => ['recycle', 'detail'].includes(value) ? value : undefined,
})
const libraryQuery = ref('')
const librarySort = ref('最近更新')
const recycleQuery = ref('')
const recycleSort = ref('最近删除')
const selectedLibraryId = useRouteQueryState(route, router, 'library', null, {
  parse: (value) => typeof value === 'string' && value ? value : null,
})
const fileQuery = ref('')
const fileSort = ref('最近更新')
const libraryForm = ref(null)
const deleteCandidate = ref(null)
const previewFile = ref(null)

const activeLibraries = computed(() => knowledge.librariesFor(owner.value))
const recycledLibraries = computed(() => knowledge.recycledLibrariesFor(owner.value))
const recycledFiles = computed(() => knowledge.recycledFilesFor(owner.value))
const selectedLibrary = computed(() => activeLibraries.value.find((item) => item.id === selectedLibraryId.value) || null)
const currentFiles = computed(() => selectedLibrary.value ? knowledge.filesFor(owner.value, selectedLibrary.value.id) : [])

if (typeof knowledge.ensureRecycleExamples === 'function') knowledge.ensureRecycleExamples(owner.value)

function bySort(items, sort, dateKey = 'updated') {
  return [...items].sort((a, b) => {
    if (sort === '名称') return a.name.localeCompare(b.name, 'zh-CN')
    return String(b[dateKey] || '').localeCompare(String(a[dateKey] || ''))
  })
}

const visibleLibraries = computed(() => {
  const keyword = libraryQuery.value.trim()
  return bySort(activeLibraries.value.filter((item) => `${item.name}${item.description}`.includes(keyword)), librarySort.value)
})

const recycledItemCount = computed(() => recycledLibraries.value.length + recycledFiles.value.length)

const visibleRecycledItems = computed(() => {
  const keyword = recycleQuery.value.trim()
  const libraryNames = new Map([...activeLibraries.value, ...recycledLibraries.value].map((item) => [item.id, item.name]))
  const items = [
    ...recycledLibraries.value.map((item) => ({ ...item, kind: 'library' })),
    ...recycledFiles.value.map((item) => ({ ...item, kind: 'file', libraryName: libraryNames.get(item.libraryId) || '原知识库已删除' })),
  ]
  return bySort(items.filter((item) => `${item.name}${item.description || ''}${item.type || ''}${item.libraryName || ''}`.includes(keyword)), recycleSort.value, 'deleted')
})

const visibleFiles = computed(() => {
  const keyword = fileQuery.value.trim()
  return bySort(currentFiles.value.filter((item) => `${item.name}${item.type}${item.source}`.includes(keyword)), fileSort.value)
})

const manageSearchResults = computed(() => {
  const keyword = libraryQuery.value.trim()
  if (!keyword) return []
  const names = new Map(activeLibraries.value.map((item) => [item.id, item.name]))
  const libraries = activeLibraries.value
    .filter((item) => `${item.name}${item.description}`.includes(keyword))
    .map((item) => ({ ...item, kind: 'library', fileCount: filesCount(item.id) }))
  const files = activeLibraries.value.flatMap((library) => knowledge.filesFor(owner.value, library.id))
    .filter((item) => `${item.name}${previewSearchText(item)}`.includes(keyword))
    .map((item) => ({ ...item, kind: 'file', libraryName: names.get(item.libraryId) || '未归属知识库' }))
  return bySort(
    [...libraries, ...files],
    librarySort.value,
  )
})

const deleteTitle = computed(() => deleteCandidate.value?.kind.startsWith('purge') ? '确认彻底删除' : '确认移入回收站')
const deleteDescription = computed(() => {
  if (!deleteCandidate.value) return ''
  const { kind, item } = deleteCandidate.value
  if (kind === 'archive-library') return `“${item.name}”及其库内文件将移入回收站，30 天内可恢复。`
  if (kind === 'archive-file') return `“${item.name}”将移入回收站，30 天内可恢复。`
  return `“${item.name}”将被彻底删除，无法恢复。`
})

function filesCount(libraryId) {
  return knowledge.filesFor(owner.value, libraryId).length
}

function dateText(value = '') {
  return value.replace(' ', ' · ')
}

function previewSections(file) {
  return [
    { title: '一、适用范围', paragraphs: ['本指引适用于科研项目立项、实施、阶段检查、结题验收与资料归档等过程管理场景。项目参与人员应按职责分工维护过程资料，确保关键记录可追溯。'] },
    { title: '二、过程管理要求', paragraphs: ['项目启动后应明确研究目标、阶段计划和成果形式；实施过程中应按周期记录任务进展、技术问题与调整事项。涉及关键方案变更时，应同步保留评审意见与依据材料。', '项目验收前应汇总研究报告、试验记录、经费材料和成果证明，形成完整归档目录。'] },
    { title: '三、资料归档', paragraphs: ['归档资料应标明来源、形成日期和责任人，并按照项目阶段、资料类别进行整理，确保归档材料完整、准确、可追溯。'] },
  ]
}

function previewSearchText(file) {
  return previewSections(file).flatMap((section) => [section.title, ...section.paragraphs]).join('')
}

function previewMatchExcerpt(file, keyword) {
  const text = previewSearchText(file)
  const position = text.indexOf(keyword)
  if (position === -1) return '命中资料内容。'
  const start = Math.max(0, position - 20)
  const end = Math.min(text.length, position + keyword.length + 42)
  return `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

function documentTitle(file) {
  return file.name.replace(/\.[^/.]+$/, '')
}

function openFilePreview(file) {
  previewFile.value = file
}

function returnToManage() {
  workspace.value = 'manage'
  selectedLibraryId.value = null
  libraryForm.value = null
  fileQuery.value = ''
}

function openLibrary(library) {
  selectedLibraryId.value = library.id
  workspace.value = 'detail'
  fileSort.value = '最近更新'
  fileQuery.value = ''
  libraryForm.value = null
}

function openCreateLibrary() {
  libraryForm.value = { mode: 'create', name: '', description: '' }
  workspace.value = 'create'
}

function startLibraryEdit() {
  if (!selectedLibrary.value) return
  libraryForm.value = { mode: 'edit', id: selectedLibrary.value.id, name: selectedLibrary.value.name, description: selectedLibrary.value.description }
}

function cancelLibraryForm() {
  const creating = libraryForm.value?.mode === 'create'
  libraryForm.value = null
  if (creating) returnToManage()
}

function saveLibrary() {
  if (!libraryForm.value?.name?.trim()) {
    ui.notify('请填写知识库名称', 'warning')
    return
  }
  if (libraryForm.value.mode === 'create') {
    const created = knowledge.createLibrary(owner.value, libraryForm.value)
    selectedLibraryId.value = created.id
    workspace.value = 'detail'
    ui.notify('知识库已创建，可继续上传文件', 'success')
  } else {
    knowledge.updateLibrary(owner.value, libraryForm.value.id, libraryForm.value)
    ui.notify('知识库信息已保存', 'success')
  }
  libraryForm.value = null
}

function requestDeletion(kind, item) {
  deleteCandidate.value = { kind, item }
}

function confirmDeletion() {
  const candidate = deleteCandidate.value
  if (!candidate) return
  const { kind, item } = candidate
  if (kind === 'archive-library') {
    knowledge.recycleLibrary(owner.value, item.id)
    returnToManage()
    ui.notify('知识库已移入回收站', 'warning')
  }
  if (kind === 'archive-file') {
    knowledge.recycleFile(owner.value, item.id)
    ui.notify('文件已移入回收站', 'warning')
  }
  if (kind === 'purge-library') {
    knowledge.permanentlyDeleteLibrary(owner.value, item.id)
    ui.notify('知识库已彻底删除', 'warning')
  }
  if (kind === 'purge-file') {
    knowledge.permanentlyDeleteFile(owner.value, item.id)
    ui.notify('文件已彻底删除', 'warning')
  }
  deleteCandidate.value = null
}

function restoreLibrary(item) {
  knowledge.restoreLibrary(owner.value, item.id)
  ui.notify('知识库及其库内文件已恢复', 'success')
}

function restoreFile(item) {
  knowledge.restoreFile(owner.value, item.id)
  ui.notify('文件已恢复到原知识库', 'success')
}

function handleFileUpload(event) {
  const added = knowledge.addFiles(owner.value, selectedLibrary.value?.id, event.target.files)
  event.target.value = ''
  if (!added.length) return
  ui.notify(`${added.length} 个文件已上传至知识库`, 'success')
}

function showFileSearchResult(item) {
  openLibrary({ id: item.libraryId })
  previewFile.value = item
}

function openManageSearchResult(item) {
  if (item.kind === 'library') {
    openLibrary(item)
    return
  }
  showFileSearchResult(item)
}
</script>

<template>
  <section class="page-container knowledge-page knowledge-page-v2">
    <PageHeader title="个人知识库" />

    <nav class="knowledge-mode-tabs" aria-label="个人知识库功能">
      <button type="button" :class="{ active: workspace === 'manage' }" @click="returnToManage"><BookOpenText :size="18" />管理库</button>
      <button type="button" :class="{ active: workspace === 'recycle' }" @click="workspace = 'recycle'; selectedLibraryId = null"><Trash2 :size="18" />回收站 <span>{{ recycledItemCount }}</span></button>
    </nav>

    <section v-if="workspace === 'manage'" class="knowledge-region" aria-labelledby="library-management-title">
      <header class="knowledge-region-heading knowledge-manage-heading"><div><h2 id="library-management-title">我的知识库</h2></div><strong>{{ activeLibraries.length }} 个</strong></header>
      <div class="knowledge-toolbar knowledge-toolbar-v2"><label class="search-field"><Search :size="17" /><input v-model="libraryQuery" placeholder="搜索知识库、文件名或资料内容" /></label><BaseSelect v-model="librarySort" :options="['最近更新', '名称']" aria-label="排序规则" /><button class="button primary" type="button" @click="openCreateLibrary"><Plus :size="17" />创建知识库</button></div>
      <template v-if="!libraryQuery.trim()"><div v-if="visibleLibraries.length" class="knowledge-library-list"><article v-for="item in visibleLibraries" :key="item.id"><button class="knowledge-library-row" type="button" :aria-label="`打开${item.name}`" @click="openLibrary(item)"><i><BookOpenText :size="24" /></i><span class="knowledge-library-identity"><b>{{ item.name }}</b><em>{{ item.description }}</em></span><span class="knowledge-library-files"><small>资料文件</small><b>{{ filesCount(item.id) }} 份</b></span><span class="knowledge-library-updated"><small>最近更新</small><b>{{ dateText(item.updated) }}</b></span></button><div class="knowledge-library-actions"><button type="button" class="text-action danger" @click="requestDeletion('archive-library', item)"><Trash2 :size="15" />删除</button><button type="button" class="text-action" @click="openLibrary(item)">打开知识库 <b><ArrowUpRight :size="16" /></b></button></div><span class="knowledge-library-watermark" aria-hidden="true"><BookOpenText :size="172" /></span></article></div><div v-else class="empty-state knowledge-empty"><BookOpenText :size="30" /><h2>还没有知识库</h2><p>创建一个知识库后，可在其中统一维护和检索资料。</p><button class="button primary" type="button" @click="openCreateLibrary"><Plus :size="17" />创建知识库</button></div></template>
      <template v-else><div v-if="manageSearchResults.length" class="knowledge-result-list"><button v-for="item in manageSearchResults" :key="`${item.kind}-${item.id}`" type="button" :aria-label="item.kind === 'library' ? `打开${item.name}` : `查看${item.name}的预览`" @click="openManageSearchResult(item)"><i><BookOpenText v-if="item.kind === 'library'" :size="20" /><FileText v-else :size="20" /></i><span><small>{{ item.kind === 'library' ? `知识库 · ${item.fileCount} 个文件` : `${item.libraryName} · ${item.type} · 内容匹配` }}</small><b>{{ item.name }}</b><em>{{ item.kind === 'library' ? item.description : previewMatchExcerpt(item, libraryQuery.trim()) }}</em></span><FolderOpen :size="19" /></button></div><div v-else class="empty-state knowledge-search-empty"><Search :size="30" /><h2>没有找到相关资料</h2><p>可尝试知识库名称、文件名或资料中的关键词。</p></div></template>
    </section>

    <section v-else-if="workspace === 'create' && libraryForm" class="knowledge-composer" aria-labelledby="library-create-title"><button class="detail-back" type="button" @click="cancelLibraryForm"><ArrowLeft :size="18" />返回管理库</button><header><span>创建库</span><h2 id="library-create-title">先命名，再补充资料</h2><p>创建完成后直接进入库内文件页面，可继续上传和编辑文件。</p></header><form class="library-form-surface" @submit.prevent="saveLibrary"><label>知识库名称<input v-model="libraryForm.name" required maxlength="32" autofocus placeholder="例如：智能巡检机器人研究" /></label><label>简介<textarea v-model="libraryForm.description" maxlength="100" placeholder="说明资料范围和使用目的" /></label><footer><button class="button secondary" type="button" @click="cancelLibraryForm">取消</button><button class="button primary" type="submit"><Check :size="17" />创建并进入知识库</button></footer></form></section>

    <section v-else-if="workspace === 'detail' && selectedLibrary" class="knowledge-detail-page" :aria-label="`${selectedLibrary.name}资料库详情`">
      <section class="knowledge-detail-overview">
        <header class="knowledge-detail-toolbar">
          <button class="detail-back" type="button" aria-label="返回管理库" @click="returnToManage"><ArrowLeft :size="17" />管理库</button>
          <button v-if="libraryForm?.mode !== 'edit'" class="knowledge-detail-edit" type="button" @click="startLibraryEdit"><Pencil :size="15" />编辑资料库</button>
        </header>
        <article class="knowledge-detail-hero">
          <template v-if="libraryForm?.mode === 'edit'">
            <form class="detail-library-form" @submit.prevent="saveLibrary">
              <label>知识库名称<input v-model="libraryForm.name" required maxlength="32" autofocus /></label>
              <label>简介<textarea v-model="libraryForm.description" maxlength="100" /></label>
              <footer>
                <button class="button secondary" type="button" @click="cancelLibraryForm">取消</button>
                <button class="button primary" type="submit"><Check :size="17" />保存库信息</button>
              </footer>
            </form>
          </template>
          <template v-else>
            <div class="knowledge-detail-summary">
              <div class="knowledge-detail-copy">
                <h2 id="library-detail-title">{{ selectedLibrary.name }}</h2>
                <p>{{ selectedLibrary.description }}</p>
              </div>
              <dl class="knowledge-detail-meta" aria-label="知识库概况">
                <div><dt>资料文件</dt><dd>{{ filesCount(selectedLibrary.id) }} 份</dd></div>
                <div><dt>最近更新</dt><dd>{{ dateText(selectedLibrary.updated) }}</dd></div>
              </dl>
            </div>
          </template>
        </article>
      </section>
      <section v-if="!libraryForm" class="knowledge-file-workspace"><header><h2>资料文件</h2><label class="button primary upload-button"><Upload :size="17" />上传文件<input type="file" multiple @change="handleFileUpload" /></label></header><div class="library-file-toolbar"><label class="search-field"><Search :size="17" /><input v-model="fileQuery" placeholder="在当前知识库中搜索文件" /></label><BaseSelect v-model="fileSort" :options="['最近更新', '名称']" aria-label="文件排序规则" /></div>
        <div v-if="visibleFiles.length" class="file-list file-list-v2"><article v-for="file in visibleFiles" :key="file.id"><button class="file-preview-trigger" type="button" :aria-label="`预览${file.name}`" @click="openFilePreview(file)"><i><FileText :size="19" /></i><span><b>{{ file.name }}</b><small>{{ file.type }} · {{ file.size }} · {{ file.source }} · 更新于 {{ dateText(file.updated) }}</small></span></button><div class="file-row-actions"><button class="text-action danger" type="button" @click="requestDeletion('archive-file', file)"><Trash2 :size="15" />删除</button></div></article></div>
        <div v-else class="empty-state library-files-empty"><FileText :size="28" /><h2>当前知识库还没有文件</h2><p>上传资料后，会在这里显示来源和更新时间。</p></div></section></section>

    <section v-else class="knowledge-region" aria-labelledby="library-recycle-title"><header class="knowledge-region-heading"><div><h2 id="library-recycle-title">回收站</h2><p>已删除的知识库和资料文件会集中保留 30 天；恢复后回到原位置，彻底删除后无法恢复。</p></div><strong>{{ recycledItemCount }} 项</strong></header><div class="knowledge-toolbar knowledge-toolbar-v2"><label class="search-field"><Search :size="17" /><input v-model="recycleQuery" placeholder="搜索回收站中的内容" /></label><BaseSelect v-model="recycleSort" :options="['最近删除', '名称']" aria-label="回收站排序规则" /></div><div v-if="visibleRecycledItems.length" class="recycle-list recycle-list-v2"><article v-for="item in visibleRecycledItems" :key="`${item.kind}-${item.id}`" :class="`recycle-item-${item.kind}`"><i class="recycle-item-icon"><BookOpenText v-if="item.kind === 'library'" :size="20" /><FileText v-else :size="20" /></i><div class="recycle-item-content"><div class="recycle-item-identity"><div class="recycle-item-tags"><span class="recycle-item-kind">{{ item.kind === 'library' ? '知识库' : '资料文件' }}</span><span class="recycle-item-expiry">{{ item.expires }}</span></div><b>{{ item.name }}</b></div><div class="recycle-item-context"><p>{{ item.kind === 'library' ? item.description : `${item.libraryName} · ${item.type} · ${item.size}` }}</p><time>删除于 {{ dateText(item.deleted) }}</time></div></div><div class="recycle-item-actions"><button class="button secondary" type="button" @click="item.kind === 'library' ? restoreLibrary(item) : restoreFile(item)"><RotateCcw :size="16" />恢复</button><button class="button ghost destructive" type="button" @click="requestDeletion(item.kind === 'library' ? 'purge-library' : 'purge-file', item)"><Trash2 :size="16" />彻底删除</button></div></article></div><div v-else class="empty-state knowledge-empty"><ArchiveRestore :size="30" /><h2>回收站为空</h2><p>删除的知识库和资料文件会在这里保留 30 天。</p></div></section>

    <Teleport to="body"><Transition name="knowledge-confirm-fade"><div v-if="deleteCandidate" class="knowledge-confirm-layer" @click.self="deleteCandidate = null"><section class="knowledge-confirm-dialog" role="dialog" aria-modal="true" :aria-label="deleteTitle"><i><Trash2 :size="21" /></i><h2>{{ deleteTitle }}</h2><h3>{{ deleteCandidate.item.name }}</h3><p>{{ deleteDescription }}</p><footer><button class="button secondary" type="button" @click="deleteCandidate = null">取消</button><button class="button destructive-button" type="button" @click="confirmDeletion">{{ deleteCandidate.kind.startsWith('purge') ? '彻底删除' : '移入回收站' }}</button></footer></section></div></Transition></Teleport>
    <Teleport to="body"><Transition name="knowledge-confirm-fade"><div v-if="previewFile" class="file-preview-layer" @click.self="previewFile = null"><section class="file-preview-dialog" role="dialog" aria-modal="true" :aria-label="`${previewFile.name}文件预览`"><header><div><h2>{{ previewFile.name }}</h2><p>{{ previewFile.type }} · {{ previewFile.size }} · {{ previewFile.source }}</p></div><button class="icon-button" type="button" aria-label="关闭文件预览" @click="previewFile = null"><X :size="20" /></button></header><article class="file-preview-paper"><section class="word-document-page"><header class="word-document-running-head"><span>中煤深圳研究院</span><span>{{ documentTitle(previewFile) }}</span></header><h1>{{ documentTitle(previewFile) }}</h1><div class="word-document-rule"></div><section v-for="section in previewSections(previewFile)" :key="section.title"><h2>{{ section.title }}</h2><p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p></section><footer class="word-document-footer"><span>中煤深圳研究院</span><span>第 1 页</span></footer></section></article><footer><button class="button secondary" type="button" @click="previewFile = null">关闭预览</button></footer></section></div></Transition></Teleport>
  </section>
</template>
