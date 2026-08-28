export const innovationScoreDimensions = [
  {
    id: 'technology-trend',
    label: '技术领域态势',
    indicators: [
      { id: 'S1', label: '技术热度趋势', defaultWeight: 7, basis: '专利与论文增速、申请主体变化' },
      { id: 'S2', label: '技术阶段定位', defaultWeight: 6, basis: '论文与专利规模的四象限定位' },
      { id: 'S2a', label: '预期技术成熟度', defaultWeight: 7, basis: '预期成果成熟度与专家判断' },
    ],
  },
  {
    id: 'competitive-landscape',
    label: '竞争格局',
    indicators: [
      { id: 'S3', label: '竞争密集度', defaultWeight: 15, basis: '申请人增速与份额集中度' },
    ],
  },
  {
    id: 'innovation',
    label: '创新性',
    indicators: [
      { id: 'S4', label: '技术方案新颖性', defaultWeight: 14, basis: '创新点与已有方案最高相似度' },
      { id: 'S5', label: '创新点可量化程度', defaultWeight: 8, basis: '创新点与可量化指标对应关系' },
      { id: 'S6', label: '指标先进性', defaultWeight: 8, basis: '关键指标与现有最优方案对比' },
    ],
  },
  {
    id: 'policy',
    label: '政策',
    indicators: [
      { id: 'S7', label: '政策匹配分析', defaultWeight: 20, basis: '国家级、行业及集团政策支持强度' },
    ],
  },
  {
    id: 'delivery-capability',
    label: '承接能力',
    indicators: [
      { id: 'S8', label: '申报单位研究基础', defaultWeight: 8, basis: '专利论文积累、知识库相似课题' },
      { id: 'S9', label: '成果可交付性', defaultWeight: 7, basis: '成果齐备度、量化程度与校验资料' },
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
  const hasLegacyTechnologyWeights = Object.keys(weights || {}).length > 0 && !Object.prototype.hasOwnProperty.call(weights, 'S2a')
  return Object.fromEntries(innovationScoreItems.map((item) => {
    if (hasLegacyTechnologyWeights && ['S1', 'S2', 'S2a'].includes(item.id)) return [item.id, item.defaultWeight]
    const value = Number(weights?.[item.id])
    return [item.id, Number.isFinite(value) && value >= 0 && value <= 100 ? value : item.defaultWeight]
  }))
}

export function innovationWeightTotal(weights = {}) {
  return innovationScoreItems.reduce((sum, item) => sum + Number(weights?.[item.id] || 0), 0)
}
