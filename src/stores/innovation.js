import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { evidenceItems } from '../data/demo.js'

export const useInnovationStore = defineStore('innovation', () => {
  const mode = ref('researcher')
  const maxStep = ref(0)
  const project = reactive({
    name: '复杂煤矿环境下智能巡检机器人关键技术研究',
    applicant: '中煤深圳研究院技术研发部',
    owner: '徐博',
    field: '煤矿智能化与特种机器人',
    problem: '粉尘、弱光和通信受限环境下，巡检机器人感知可靠性与连续运行能力不足。',
    solution: '构建激光雷达、视觉、IMU 与气体传感器的分层融合感知和断网协同控制方案。',
    targets: '提高定位连续性、异常识别可靠性和通信盲区任务完成能力。',
  })
  const points = ref([
    '面向粉尘与弱光工况的多源感知质量动态评估',
    '通信盲区下的定位与任务连续性协同控制',
    '安全监测与自主导航的分层故障降级机制',
  ])
  const evidence = ref(evidenceItems.map((item) => ({ ...item, selected: true })))
  const weights = reactive({ novelty: 40, advancement: 35, applicability: 25 })
  const selectedTemplate = ref('标准创新性评价 V2.3')
  const isReviewer = computed(() => mode.value === 'reviewer')

  function setMode(value) { mode.value = value === 'reviewer' ? 'reviewer' : 'researcher' }
  function completeStep(index) { maxStep.value = Math.max(maxStep.value, index + 1) }
  function reset() { maxStep.value = 0 }

  return { mode, maxStep, project, points, evidence, weights, selectedTemplate, isReviewer, setMode, completeStep, reset }
})
