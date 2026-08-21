<script setup>
import { computed, ref } from 'vue'
import { BookOpenText, Search, Plus, Upload, Trash2, RotateCcw, MoreHorizontal, FileText, Pencil, FolderOpen, ShieldCheck } from '@lucide/vue'
import PageHeader from '../components/PageHeader.vue'
import BaseDrawer from '../components/BaseDrawer.vue'
import BaseSelect from '../components/BaseSelect.vue'
import { personalLibraries, libraryFiles, recycledFiles } from '../data/platform.js'
import { useUiStore } from '../stores/ui.js'

const ui = useUiStore()
const libraries = ref(personalLibraries.map((item) => ({ ...item })))
const recycle = ref(recycledFiles.map((item) => ({ ...item })))
const query = ref('')
const sort = ref('最近更新')
const sortOptions = ['最近更新', '名称']
const view = ref('libraries')
const selectedLibrary = ref(null)
const editor = ref(null)

const visibleLibraries = computed(() => libraries.value
  .filter((item) => `${item.name}${item.description}`.includes(query.value.trim()))
  .sort((a, b) => sort.value === '名称' ? a.name.localeCompare(b.name, 'zh-CN') : b.updated.localeCompare(a.updated, 'zh-CN')))

function saveLibrary() {
  if (!editor.value?.name?.trim()) return
  if (editor.value.id) {
    const index = libraries.value.findIndex((item) => item.id === editor.value.id)
    libraries.value[index] = { ...libraries.value[index], ...editor.value }
  } else {
    libraries.value.unshift({ ...editor.value, id: `PKB-${String(libraries.value.length + 1).padStart(2, '0')}`, files: 0, updated: '刚刚', access: '仅本人' })
  }
  editor.value = null
  ui.notify('知识库信息已保存', 'success')
}

function deleteLibrary(item) {
  libraries.value = libraries.value.filter((library) => library.id !== item.id)
  ui.notify(`“${item.name}”已移入回收站`, 'warning')
}

function restoreFile(item) {
  recycle.value = recycle.value.filter((file) => file.id !== item.id)
  ui.notify('文件已恢复到原知识库', 'success')
}
</script>

<template>
  <section class="page-container knowledge-page">
    <PageHeader title="个人知识库" description="维护只属于当前账号的研究资料，并决定哪些资料参与智能应用检索。" eyebrow="个人工作空间">
      <template #actions><span class="data-baseline"><ShieldCheck :size="18" /><span>访问范围<b>仅当前账号</b></span></span></template>
    </PageHeader>

    <div class="knowledge-toolbar">
      <div class="segmented-control"><button :class="{ active: view === 'libraries' }" @click="view = 'libraries'"><BookOpenText :size="17" />知识库</button><button :class="{ active: view === 'recycle' }" @click="view = 'recycle'"><Trash2 :size="17" />回收站 <span>{{ recycle.length }}</span></button></div>
      <label class="search-field"><Search :size="17" /><input v-model="query" placeholder="搜索知识库或文件" /></label>
      <BaseSelect v-model="sort" :options="sortOptions" aria-label="排序规则" />
      <button v-if="view === 'libraries'" class="button primary" type="button" @click="editor = { name: '', description: '' }"><Plus :size="17" />创建知识库</button>
    </div>

    <template v-if="view === 'libraries'">
      <div class="knowledge-grid">
        <article v-for="item in visibleLibraries" :key="item.id" class="knowledge-card">
          <header><i><BookOpenText :size="22" /></i><button type="button" aria-label="编辑知识库" @click="editor = { ...item }"><MoreHorizontal :size="18" /></button></header>
          <span>{{ item.id }} · {{ item.access }}</span><h2>{{ item.name }}</h2><p>{{ item.description }}</p>
          <footer><span><b>{{ item.files }}</b> 个文件 · {{ item.updated }}</span><button type="button" @click="selectedLibrary = item">打开 <FolderOpen :size="16" /></button></footer>
          <button class="knowledge-delete" type="button" @click="deleteLibrary(item)"><Trash2 :size="14" />删除</button>
        </article>
      </div>
      <div v-if="!visibleLibraries.length" class="empty-state"><Search :size="28" /><h2>没有匹配的知识库</h2><p>调整关键词，或创建新的个人知识库。</p></div>
    </template>

    <div v-else class="recycle-list">
      <article v-for="item in recycle" :key="item.id"><i><FileText :size="20" /></i><span><b>{{ item.name }}</b><small>{{ item.id }} · 删除于 {{ item.deleted }} · {{ item.expires }}</small></span><button class="button secondary" @click="restoreFile(item)"><RotateCcw :size="16" />恢复</button><button class="button ghost" @click="recycle = recycle.filter(file => file.id !== item.id); ui.notify('文件已彻底删除', 'warning')"><Trash2 :size="16" />彻底删除</button></article>
      <div v-if="!recycle.length" class="empty-state"><Trash2 :size="28" /><h2>回收站为空</h2><p>删除的文件会在这里保留 30 天。</p></div>
    </div>

    <BaseDrawer :open="Boolean(selectedLibrary)" :title="selectedLibrary?.name" width="760px" @close="selectedLibrary = null">
      <div v-if="selectedLibrary" class="library-files">
        <header><div><span class="eyebrow">{{ selectedLibrary.id }}</span><h2>{{ selectedLibrary.files }} 个文件</h2><p>默认按最近更新时间排序；可检索文件会参与个人知识库召回。</p></div><label class="button primary"><Upload :size="17" />上传文件<input type="file" multiple @change="ui.notify('文件已加入解析队列', 'success')" /></label></header>
        <label class="search-field"><Search :size="17" /><input placeholder="在当前知识库中搜索" /></label>
        <div class="file-list"><article v-for="file in libraryFiles" :key="file.id"><i><FileText :size="19" /></i><span><b>{{ file.name }}</b><small>{{ file.type }} · {{ file.size }} · {{ file.source }}</small></span><em>{{ file.status }}</em><button class="icon-button" :aria-label="`管理${file.name}`" @click="ui.notify(`已打开${file.name}的文件操作`)"><MoreHorizontal :size="18" /></button></article></div>
      </div>
    </BaseDrawer>

    <BaseDrawer :open="Boolean(editor)" :title="editor?.id ? '编辑知识库' : '创建知识库'" @close="editor = null">
      <form v-if="editor" class="drawer-form" @submit.prevent="saveLibrary"><label>知识库名称<input v-model="editor.name" required placeholder="例如：智能巡检机器人研究" /></label><label>简介<textarea v-model="editor.description" placeholder="说明资料范围和使用目的" /></label><section><h3>检索权限</h3><p>个人知识库仅当前账号可见；勾选参与检索后，会作为企业知识库之外的独立召回通道。</p><label><input type="checkbox" checked />允许六项智能应用召回</label></section><button class="button primary wide" type="submit"><Pencil :size="17" />保存知识库</button></form>
    </BaseDrawer>
  </section>
</template>
