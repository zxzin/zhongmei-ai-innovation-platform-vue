import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { historyRecords } from '../data/demo.js'
import { useAuthStore } from './auth.js'

export const useTasksStore = defineStore('tasks', () => {
  const records = ref([...historyRecords])
  const auth = useAuthStore()
  const personalRecords = computed(() => {
    const account = auth.profile?.account
    return account ? records.value.filter((record) => record.ownerAccount === account) : []
  })
  const recent = computed(() => personalRecords.value.slice(0, 4))

  function isOwnedByCurrentAccount(record) {
    return record.ownerAccount === auth.profile?.account
  }

  function defaultResumePath(agent) {
    if (agent === 'innovation') return `/innovation/${auth.isAdmin ? 'admin' : 'researcher'}/report`
    if (agent === 'qa') return '/agent/qa/chat'
    if (agent === 'semantic') return '/agent/semantic/results'
    if (agent === 'feasibility') return '/agent/feasibility/report'
    if (agent === 'disclosure') return '/agent/disclosure/scope'
    if (agent === 'research') return '/agent/research/report'
    return `/agent/${agent}/brief`
  }

  function addTask(agent, title, result = '结果预览') {
    const profile = auth.profile
    const record = {
      id: `TASK-${Date.now().toString().slice(-9)}`,
      ownerAccount: profile?.account || '',
      agent,
      title,
      user: profile?.name || '当前用户',
      org: profile?.company || '中煤深圳研究院',
      date: new Date().toLocaleString('zh-CN', { hour12: false }),
      status: '已完成',
      result,
      resumePath: defaultResumePath(agent),
    }
    records.value.unshift(record)
    return record
  }

  function removeTask(id) {
    records.value = records.value.filter((record) => record.id !== id || !isOwnedByCurrentAccount(record))
  }

  function removeTasks(ids) {
    const set = new Set(ids)
    records.value = records.value.filter((record) => !set.has(record.id) || !isOwnedByCurrentAccount(record))
  }

  function clearTasks() {
    records.value = records.value.filter((record) => !isOwnedByCurrentAccount(record))
  }

  return { records, personalRecords, recent, addTask, removeTask, removeTasks, clearTasks }
})
