export const innovationScoreDimensions = [
  {
    id: 'technology-trend',
    label: '技术领域态势',
    indicators: [
      { id: 'S1', label: '技术热度趋势', defaultWeight: 10, basis: '专利、论文增速及近五年技术热度趋势' },
      { id: 'S2', label: '技术阶段定位', defaultWeight: 10, basis: '技术热点、成熟度与竞争强度的阶段判断' },
    ],
  },
  {
    id: 'competitive-landscape',
    label: '竞争格局',
    indicators: [
      { id: 'S3', label: '竞争密集度', defaultWeight: 15, basis: '申请主体规模、集中度与竞争格局' },
    ],
  },
  {
    id: 'innovation',
    label: '创新性',
    indicators: [
      { id: 'S4', label: '技术方案新颖性', defaultWeight: 14, basis: '创新点与现有技术方案的相似度' },
      { id: 'S5', label: '创新点可量化程度', defaultWeight: 8, basis: '创新点的量化指标完整度' },
      { id: 'S6', label: '指标先进性', defaultWeight: 8, basis: '关键性能指标与同类方案的对比结果' },
    ],
  },
  {
    id: 'policy',
    label: '政策',
    indicators: [
      { id: 'S7', label: '政策匹配分析', defaultWeight: 20, basis: '国家专项、集团制度与合规要求匹配度' },
    ],
  },
  {
    id: 'delivery-capability',
    label: '承接能力',
    indicators: [
      { id: 'S8', label: '申报单位研究基础', defaultWeight: 8, basis: '专利、论文积累与持续研究基础' },
      { id: 'S9', label: '成果可交付性', defaultWeight: 7, basis: '成果类型、完成指标与可交付材料' },
    ],
  },
]

export const innovationScoreItems = innovationScoreDimensions.flatMap((dimension) => dimension.indicators.map((indicator) => ({
  ...indicator,
  dimensionId: dimension.id,
  dimensionLabel: dimension.label,
})))

export const innovationGradeBands = [100, 80, 60, 30]

export const innovationDefaultWeights = Object.freeze(Object.fromEntries(
  innovationScoreItems.map((item) => [item.id, item.defaultWeight]),
))

export function normalizeInnovationWeights(weights = {}) {
  return Object.fromEntries(innovationScoreItems.map((item) => {
    const value = Number(weights?.[item.id])
    return [item.id, Number.isFinite(value) && value >= 0 && value <= 100 ? value : item.defaultWeight]
  }))
}

export function innovationWeightTotal(weights = {}) {
  return innovationScoreItems.reduce((sum, item) => sum + Number(weights?.[item.id] || 0), 0)
}
