import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { historyRecords } from '../data/demo.js'

export const useTasksStore = defineStore('tasks', () => {
  const records = ref([...historyRecords])
  const selectedRecord = ref(null)
  const recent = computed(() => records.value.slice(0, 3))

  function addTask(agent, title, result = '结果预览') {
    const record = {
      id: `TASK-${Date.now().toString().slice(-9)}`,
      agent,
      title,
      user: '当前用户',
      org: '中煤深圳研究院',
      date: new Date().toLocaleString('zh-CN', { hour12: false }),
      status: '已完成',
      result,
    }
    records.value.unshift(record)
    return record
  }

  function removeTask(id) {
    records.value = records.value.filter((record) => record.id !== id)
    if (selectedRecord.value?.id === id) selectedRecord.value = null
  }

  function removeTasks(ids) {
    const set = new Set(ids)
    records.value = records.value.filter((record) => !set.has(record.id))
    if (selectedRecord.value && set.has(selectedRecord.value.id)) selectedRecord.value = null
  }

  function clearTasks() {
    records.value = []
    selectedRecord.value = null
  }

  return { records, selectedRecord, recent, addTask, removeTask, removeTasks, clearTasks }
})
