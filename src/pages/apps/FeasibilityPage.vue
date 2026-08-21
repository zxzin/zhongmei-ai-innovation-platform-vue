<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowUp, Check, ChevronRight, Download, FileSearch, FileText,
  Network, Search, ShieldCheck, TriangleAlert,
} from '@lucide/vue'
import { useUiStore } from '../../stores/ui.js'
import { useTasksStore } from '../../stores/tasks.js'

const ui = useUiStore()
const tasks = useTasksStore()
const route = useRoute()
const router = useRouter()
const started = ref(false)
const proposal = ref('')
const activeProposal = ref('')
const followup = ref('')
const selectedDetail = ref(null)
const followupSent = ref(false)

const demoProposal = '面向煤矿井下弱光、粉尘、高湿与局部通信盲区，拟建设自主巡检机器人系统：采用视觉、激光雷达、惯导与气体传感器融合定位；以防爆边缘计算终端完成本地识别、告警和任务队列；通过 5G 专网回传视频与设备状态，并在断网时保持安全巡检和数据缓存。目标是在巷道坡度 ≤12°、粉尘浓度波动与连续作业 8 小时条件下，实现定位误差 ≤0.3m、告警响应 ≤3s。请评估技术可行性、关键工程风险、验证指标、实施成本及分阶段建设建议。'

const steps = [
  {
    id: 'split', title: '拆分检索内容', tool: '理解煤矿井下自主巡检机器人系统的技术方案核心要素',
    thought: '用户提出了一个煤矿井下自主巡检机器人系统的技术方案，需要进行可行性分析。这是一个复杂的技术方案，涉及多传感器融合定位、防爆边缘计算、5G通信等多个技术领域。按照预定义流程，我需要首先使用“问题理解工具”来深入理解和拆分这个技术方案，提取关键技术点和检索方向，为后续的专利文献检索和可行性分析奠定基础。',
  },
  {
    id: 'literature', title: '检索技术文献', tool: '已归集 52 件专利、31 篇论文',
    thought: '问题理解工具已成功拆分出5个核心检索方向，涵盖了定位精度、防爆计算、断网机制、坡度适应和传感器可靠性等关键技术点。接下来按照流程第二步，需要使用“多路检索专利文献”工具，基于这些拆分出的查询进行专利文献检索，以获取相关技术的现有研究和专利情况，为后续的缺陷分析提供依据。',
  },
  {
    id: 'gap', title: '缺陷分析', tool: '分析煤矿井下自主巡检机器人系统的技术缺陷和工程风险',
    thought: '已成功检索到大量煤矿井下自主巡检机器人相关专利文献，涵盖防爆边缘计算、多传感器融合定位、5G断网数据缓存、坡度适应性和气体传感器可靠性等关键技术领域。检索结果显示：防爆边缘计算在煤矿中已有3秒内告警响应的应用案例；视觉-激光雷达-惯导融合定位技术在井下环境可达厘米级精度；5G断网时的离线巡检和数据缓存机制已有成熟方案。接下来按照流程第三步，需要使用“可行性分析 - 缺陷分析”工具，对用户提出的技术方案进行多角度的缺陷分析。',
  },
  {
    id: 'report', title: '报告撰写', tool: '生成煤矿井下自主巡检机器人系统完整可行性分析报告',
    thought: '缺陷分析已完成，识别出多个技术风险点：惯导累积误差、激光雷达在相似场景下的鲁棒性不足、5G信号屏蔽干扰、弱网环境数据上传中断等问题，并给出了相应的解决方案。现在按照预定义流程的第四步，必须执行“可行性分析 - 报告撰写”工具，基于前面收集的专利文献检索结果和缺陷分析结果，生成一份完整的可行性分析报告，这将是最终答案的基础。',
  },
]

const literatureSources = {
  patents: [
    ['具有边缘计算功能的矿用报警设备及矿用报警系统', '通过在矿用报警设备中引入边缘计算模块处理数据并直接发送控制信号，实现更快速、可靠的报警响应。', '公开日期：2024-01-30　　所有者：福建省冶金工业设计院有限公司'],
    ['基于边缘计算模式的煤矿火灾报警系统、方法及存储介质', '在煤矿井下采用边缘计算模式采集与处理监测数据，提升火灾检测和报警响应的时效性。', '公开日期：2021-01-08　　所有者：天地（常州）自动化股份有限公司'],
    ['基于边缘计算的煤矿安全预警系统及方法', '划分区域并获取实时风险指数，实现煤矿开采多区域、多源数据融合监测与安全预警。', '公开日期：2025-08-22　　所有者：图为信息科技（深圳）有限公司'],
    ['一种预防紧急事故的煤矿用应急预警方法和系统', '利用分布式边缘计算节点计算紧急事故风险指数，动态调整采样率并发出应急预警信号。', '公开日期：2025-05-06　　所有者：郑州煤炭工业（集团）有限责任公司大平煤矿'],
    ['一种基于边缘计算的煤矿生产设备远程监控系统', '实现煤矿生产设备的可视化监控和一体化管理，提升安全性和生产效率。', '公开日期：2026-01-30　　所有者：河南煤安工控科技有限公司'],
    ['基于边缘计算的煤矿开发安全监控方法', '通过分布式摄像系统和边缘计算终端，提升煤矿开采区域监控的可靠性和全面性。', '公开日期：2024-09-06　　所有者：慧之安信息技术股份有限公司'],
    ['基于边缘计算的矿山安全监测方法', '在矿山内部安装边缘计算节点终端和传感器，进行独立监测和数据分析，提升实时性与准确性。', '公开日期：2022-10-11　　所有者：慧之安信息技术股份有限公司'],
    ['一种煤矿安全生产监控与应急响应综合系统', '通过安全监测管理终端和监控调度平台结合，实现矿井环境和人员的实时监测与应急响应。', '公开日期：2025-08-01　　所有者：浪潮软件集团有限公司'],
  ],
  papers: [
    ['基于物联网的煤矿井下事件报告与预警安全系统：案例研究', '介绍实时监测、事件报告和预警平台，结合物联网、云计算与时空统计分析，改善煤矿井下安全管理与事故预防。', '出版日期：2017-09-08　　所有者：Hanyang University'],
    ['煤矿地下巷道自动铺底机器人液压机械臂的研究', '研究集成底部铺设模块、运输、安装和拆卸的快速底部铺设机器人，适用于煤矿巷道等高风险环境的精密作业。', '出版日期：2022-01-01'],
    ['煤矿探测机器人的机械结构和防爆设计', '介绍带有铰接式履带臂的探测机器人，用于煤矿下爆炸性或有毒气体探测，并适应不平整巷道地面与坡度。', '出版日期：2011-01-01'],
    ['煤矿竖井施工智能安全监控机器人的设计与研究', '围绕机器人本体结构、行走机构、控制、通信、智能传感与危险源识别等方向开展研究。', '出版日期：2021-01-01'],
    ['煤矿移动机器人设计中防爆安全规定的实施', '讨论用于地下煤矿区域检查的侦察移动机器人系统在爆炸性环境中的设计标准与法规要求。', '出版日期：2018-11-19　　所有者：Vysoká škola Báňská-Technická Univerzita Ostrava'],
    ['煤矿机器人动力电池地下充电安全问题及研究', '研究煤矿机器人动力电池地下充电的能量传输机理与防爆自动充电装置检测试验平台。', '出版日期：2021-02-01'],
  ],
}

const assessment = computed(() => activeProposal.value || demoProposal)

function updateRoute(next, replace = false) {
  return router[replace ? 'replace' : 'push']('/agent/feasibility/' + next)
}

function startAnalysis() {
  const value = proposal.value.trim()
  if (!value) return
  activeProposal.value = value
  followup.value = ''
  followupSent.value = false
  selectedDetail.value = null
  started.value = true
  tasks.addTask('feasibility', value.slice(0, 32), '可行性分析报告')
  updateRoute('report')
}
function openDetail(step) {
  selectedDetail.value = step
}
function sendFollowup() {
  if (!followup.value.trim()) return
  followupSent.value = true
  ui.notify('补充问题已关联到本次可行性分析', 'success')
  followup.value = ''
}

watch(() => route.params.stage, (value) => {
  started.value = value === 'report' || value === 'scope'
  if (!started.value) selectedDetail.value = null
}, { immediate: true })
</script>

<template>
  <section class="feas-page">
    <main v-if="!started" class="feas-launch">
      <section class="feas-launch__inner">
        <header class="feas-launch__title">
          <i aria-hidden="true"><ShieldCheck :size="26" /></i>
          <div><h1>可行性分析</h1></div>
        </header>
        <section class="feas-launch__composer">
          <textarea v-model="proposal" maxlength="5000" aria-label="技术方案描述" placeholder="描述您的技术方案，进行可行性分析" @keydown.ctrl.enter.prevent="startAnalysis" />
          <footer><button class="feas-launch__clear" type="button" :disabled="!proposal" @click="proposal = ''">清空内容</button><button type="button" :disabled="!proposal.trim()" aria-label="开始分析" @click="startAnalysis"><ArrowUp :size="18" /></button></footer>
        </section>
        <section class="feas-launch__example"><span>示范输入</span><button type="button" title="带入完整示范内容" @click="proposal = demoProposal"><span>{{ demoProposal }}</span></button></section>
      </section>
    </main>

    <main v-else class="feas-workbench">
      <header class="feas-task-header"><div class="feas-task-brand"><i aria-hidden="true"><ShieldCheck :size="21" /></i><span>可行性分析</span><b aria-hidden="true">·</b><h1>煤矿井下自主巡检方案</h1></div></header>
      <div class="feas-layout">
        <aside class="feas-reasoning">
          <section class="feas-input-summary"><span>任务方案</span><p>{{ assessment }}</p></section>
          <section class="feas-thinking">
            <header><h2>分析思路</h2><p>每一步均保留过程依据，可按需查看。</p></header>
            <article v-for="(item, index) in steps" :key="item.id" class="feas-thinking-step">
              <i><Check :size="12" /></i>
              <div><b>{{ index + 1 }}. {{ item.title }}</b><p>{{ item.thought }}</p><button type="button" @click="openDetail(item)"><span>{{ item.tool }}</span><span>查看 <ChevronRight :size="14" /></span></button></div>
            </article>
          </section>
          <section class="feas-followup">
            <h3>补充提问</h3><p>围绕当前方案继续追问，结论将关联到本次分析。</p>
            <textarea v-model="followup" placeholder="例如：若 5G 覆盖不足，应优先验证哪些替代方案？" @keydown.ctrl.enter.prevent="sendFollowup" />
            <button type="button" :disabled="!followup.trim()" @click="sendFollowup">发送 <ArrowUp :size="15" /></button>
            <small v-if="followupSent">已将补充问题纳入本次分析记录。</small>
          </section>
        </aside>

        <section class="feas-report-view">
          <header class="feas-report-toolbar"><span>{{ selectedDetail ? selectedDetail.title : '可行性分析报告' }}</span><div><button v-if="selectedDetail" type="button" class="feas-outline" @click="selectedDetail = null">返回报告</button><button type="button" class="feas-export" @click="ui.notify('可行性分析报告已准备导出', 'success')"><Download :size="15" />导出报告</button></div></header>

          <article v-if="selectedDetail" class="feas-detail">
            <template v-if="selectedDetail.id === 'split'">
              <section class="feas-detail-section"><h3>输入的问题：</h3><p>{{ assessment }}</p></section>
              <section class="feas-detail-section"><h3>关键词：</h3><div class="feas-detail-tags"><span v-for="tag in ['煤矿井下', '自主巡检机器人', '视觉', '激光雷达', '惯导', '气体传感器', '防爆边缘计算', '5G 专网', '多传感器融合定位', '断网数据缓存']" :key="tag">{{ tag }}</span></div></section>
              <section class="feas-detail-section"><h3>问题拆分：</h3><ul><li>煤矿井下弱光粉尘环境中视觉与激光雷达融合定位精度能否达到 0.3 米</li><li>防爆边缘计算终端在煤矿环境下实现 3 秒告警响应的技术方案</li><li>自主巡检机器人在 5G 专网断网情况下的安全巡检与数据缓存机制</li><li>煤矿巷道 12 度坡度环境下机器人连续 8 小时作业的动力与防爆设计</li><li>气体传感器与多传感器融合在高湿粉尘环境中的可靠性验证</li></ul></section>
            </template>

            <template v-else-if="selectedDetail.id === 'literature'">
              <div class="feas-literature">
                <section><h3>专利 <b>52</b></h3><article v-for="item in literatureSources.patents" :key="item[0]"><strong>{{ item[0] }}</strong><small>{{ item[1] }}</small><em>{{ item[2] }}</em></article></section>
                <section><h3>论文 <b>31</b></h3><article v-for="item in literatureSources.papers" :key="item[0]"><strong>{{ item[0] }}</strong><small>{{ item[1] }}</small><em>{{ item[2] }}</em></article></section>
              </div>
            </template>

            <template v-else-if="selectedDetail.id === 'gap'">
              <div class="feas-gap-reading"><span>正在阅读《煤矿井下防爆巡检机器人》</span><span>正在阅读《一种机械臂系统》</span><span>正在阅读《巡检操作机器人、巡检操作机器人的操作方法及存储介质》</span></div>
              <figure class="feas-gap-image"><img src="/feasibility-gap-analysis.png" alt="煤矿井下自主巡检机器人系统的缺陷分析图谱：断网巡检、防爆边缘计算、5G 回传和多传感器融合定位四条技术优化主线。" /></figure>
            </template>

            <template v-else>
              <section class="feas-detail-section"><p>报告已依据任务输入、52 件专利、31 篇论文和风险分析生成，可在线查看、补充修订或导出。</p><div class="feas-detail-tags"><span>方案评估概要</span><span>优化后方案</span><span>验证路线</span><span>成本与风险预控</span><span>方案调研细节</span></div></section>
            </template>
          </article>

          <article v-else class="feas-report-document feas-report-direct"><header class="feas-report-body-title"><h2>煤矿防爆巡检机器人关键技术研究</h2><h3>方案评估总结</h3></header><section><h3>1. 原方案挑战</h3><div class="feas-report-image-scroll" aria-label="原方案挑战分析图，可左右滑动查看"><img src="/feasibility-gap-analysis.png" alt="煤矿井下自主巡检机器人系统原方案挑战与优化方向图谱"></div></section><section><h3>2. 优化后方案</h3><h4>煤矿井下防爆边缘计算巡检机器人技术方案可行性分析报告</h4><h3>一、方案目标陈述</h3><p>本方案旨在开发一套适用于煤矿井下复杂环境的防爆自主巡检机器人系统，该系统需满足国家煤矿安全规程 GB3836 系列防爆标准要求。核心技术指标包括：实现 3 秒内危险气体告警响应，支持 12 度坡度巷道连续 8 小时作业能力，在弱光粉尘环境下达到 0.3 米定位精度，并具备 5G 断网条件下的数据缓存与安全巡检功能。该方案通过边缘计算架构降低云端依赖，通过多传感器融合技术提升高湿粉尘环境下的系统可靠性，最终实现煤矿井下无人化智能巡检，降低人员安全风险。</p></section><section><h3>二、设计原理</h3><p>系统采用分布式边缘计算架构，防爆边缘计算终端搭载 ARM Cortex-A72 四核处理器（主频 1.8GHz），配合 NVIDIA Jetson Xavier NX 边缘 AI 模块，算力达 21TOPS。告警响应时间计算公式为：T_response = T_sensor + T_compute + T_alarm，其中传感器采样周期 T_sensor ≤500ms，边缘计算处理时延 T_compute ≤1500ms，告警触发时延 T_alarm ≤1000ms，总响应时间 ≤3000ms。</p><p>定位系统采用视觉 SLAM 与激光雷达紧耦合融合算法，通过扩展卡尔曼滤波（EKF）进行状态估计。定位误差 σ_total 满足：σ_total² = σ_lidar² + σ_vision² + σ_imu²，其中激光雷达误差 σ_lidar ≤0.15m，视觉里程计误差 σ_vision ≤0.20m，IMU 漂移误差 σ_imu ≤0.10m，融合后定位精度达 0.28m，满足 0.3m 指标要求。</p></section><section><h3>三、材料选择与性能对比分析</h3><p>防爆外壳采用 ZL102 铸造铝合金材质，抗拉强度 ≥295MPa，屈服强度 ≥165MPa，符合 GB3836.1-2010 Exd IIB T4 防爆等级。相比 304 不锈钢（密度 7.93g/cm³），铝合金密度 2.7g/cm³，可减重 65%，有利于爬坡性能。</p><p>激光雷达选用 SICK TiM781 多线激光雷达，扫描频率 15Hz，测距范围 0.05-25m，角分辨率 0.33°，防护等级 IP67，工作温度 -25℃ 至 +60℃，满足井下环境要求。视觉传感器采用海康威视 DS-2CD6626 防爆网络摄像机，配备 Starlight 低照度 CMOS 传感器，最低照度 0.001Lux，支持 120dB 宽动态范围，有效应对井下弱光环境。</p><p>气体传感器组选用催化燃烧式甲烷传感器（响应时间 ≤20s）、电化学 CO 传感器（分辨率 1ppm）和红外 CO₂ 传感器（精度 ±30ppm），三种原理互补提升可靠性。推荐配置为双冗余传感器阵列，当单一传感器数据偏差超过 15% 时触发交叉验证算法。</p></section><section><h3>四、结构设计方案</h3><p>机器人本体采用履带式底盘结构，外形尺寸 850mm（长）×650mm（宽）×780mm（高），整机重量 ≤180kg。底盘采用双侧独立驱动履带，单侧配置 500W 防爆伺服电机，减速比 1:30，输出扭矩 150N·m。</p><div class="feas-report-formula">12 度坡度所需牵引力：F = mg(sinθ + μcosθ) = 883N；单侧电机输出推力 1063N，双侧总推力 2126N，安全系数 2.4。</div><p>电池舱布置于底盘中部，采用磷酸铁锂防爆电池组，容量 30Ah/48V，能量密度 140Wh/kg。系统平均功率由驱动功率 800W、计算单元 150W 和传感器组 100W 构成，按效率系数折算后满足 8 小时连续作业需求。边缘计算单元安装于 400mm×300mm×200mm 防爆腔体内，配备强制风冷散热系统，热功率密度 ≤0.8W/cm³。</p></section><section><h3>五、设计验证和对应指标</h3><p>告警响应验证采用标准气体注入法，在距传感器 0.5m 处释放 1% 甲烷标气，通过高速数据采集系统记录从气体接触到声光报警器启动的全过程时间，要求 100 次测试中 95% 样本 ≤3 秒。</p><p>爬坡性能验证在 12 度标准坡道进行 8 小时连续测试，监测电机温升（≤65℃）、电池 SOC 变化曲线及位置保持能力。定位精度验证在 100m×50m 模拟巷道内布置全站仪基准点，机器人沿预设路径行驶，每 10m 记录实际位置与 SLAM 输出位置偏差，要求均方根误差 RMSE ≤0.3m。</p><p>5G 断网测试通过屏蔽室模拟信号中断，验证本地数据缓存容量（≥128GB SSD）及断网恢复后数据完整性。高湿粉尘可靠性测试参照 GB/T 2423.3 标准，在温度 35℃、相对湿度 95%、粉尘浓度 200mg/m³ 环境下连续运行 72 小时，传感器数据波动率 ≤5% 视为合格。</p></section><section><h3>六、成本评估</h3><p>单台机器人物料成本构成为：防爆底盘及机械结构 8.5 万元，边缘计算硬件平台（含 AI 模块）6.2 万元，激光雷达与视觉传感器组合 4.8 万元，气体传感器阵列（双冗余配置）3.5 万元，防爆电池组 2.8 万元，防爆电气元件及线缆 1.9 万元，其他辅材 0.8 万元，物料总成本 28.5 万元。</p><p>考虑 20% 的组装调试成本及 15% 的研发分摊，单台制造成本约 38.5 万元。按年产 50 台规模测算，模具及工装分摊后单台成本可降至 32 万元。与进口同类产品（售价 80-120 万元）相比，本方案具有显著成本优势，预期市场售价 55-65 万元区间可实现 35% 毛利率，投资回收期约 18 个月。后续通过国产化替代进口传感器及优化结构设计，成本仍有 15%-20% 下降空间。</p></section><div class="feas-report-divider"><span>方案调研细节</span></div><section><h2>煤矿井下防爆边缘计算巡检机器人技术可行性分析报告</h2><h3>一、技术方案细化与背景分析</h3><h4>1.1 核心技术思想与应用场景</h4><p>本方案聚焦煤矿井下极端环境的智能巡检系统构建。核心技术架构整合边缘计算分布式处理、防爆机器人平台、多传感器融合定位、弱网环境数据缓存及高湿粉尘环境气体检测五大技术模块。应用场景覆盖煤矿火灾预警、瓦斯监测、设备故障诊断及应急响应，目标实现“无人化、智能化、本质安全型”的井下作业模式。</p><h4>1.2 关键技术特征与理论基础</h4><p>边缘计算架构采用分布式节点部署，基于雾计算理论将数据处理前置至井下终端。已有火灾报警系统实践表明，边缘处理可将响应时间从传统云端架构的 8-12 秒压缩至 3 秒以内，符合煤矿安全规程的紧急告警时限。</p><p>防爆设计遵循双重保护原则：机械隔爆（Exd IIB T4 等级外壳）与电气本安（甲烷浓度 ≥1.5% 时自动断电）。采用加压外壳型结构，内部维持正压 ≥50Pa，阻止可燃气体渗入，同时配置临时防爆室技术解决充电安全隐患。</p><p>多传感器融合定位基于贝叶斯滤波理论构建视觉-激光雷达-IMU 紧耦合模型。定位误差传播方程为：σ²_total = σ²_lidar + σ²_vision + σ²_imu + 2ρ_lv·σ_lidar·σ_vision，其中 ρ_lv 为传感器间相关系数。GICP-SLAM 结合距离权重图（DWM）的方法已在井下场景实现厘米级定位精度，验证了融合算法的有效性。</p><h4>1.3 产业应用价值与局限性</h4><p>市场价值体现在三方面：降低人员伤亡风险；将传统人工巡检 4-6 小时的周期提升为机器人 24 小时不间断作业；持续积累多模态数据以支撑数字孪生矿山建设。</p><p>技术局限包括：防爆认证周期长（18-24 个月），制约产品迭代速度；井下通信受限，5G 信号在金属巷道衰减严重，需依赖本地缓存；粉尘浓度超过 200mg/m³ 时传感器漂移率可达 15%-20%，需采用多原理冗余设计。</p></section><section><h3>二、多方案对比及权衡分析</h3><h4>2.1 边缘计算架构方案对比</h4><div class="feas-report-table-wrap"><table><thead><tr><th>方案维度</th><th>集中式边缘节点</th><th>分布式边缘网络</th><th>混合云-边架构</th></tr></thead><tbody><tr><td>响应时延</td><td>2.5-3.5s</td><td>1.8-2.8s</td><td>3.5-5.0s</td></tr><tr><td>算力需求</td><td>单节点 ≥30TOPS</td><td>单节点 10-15TOPS</td><td>云端弹性扩展</td></tr><tr><td>可靠性</td><td>单点故障风险</td><td>冗余备份，可用性 99.5%</td><td>依赖网络稳定性</td></tr><tr><td>部署成本</td><td>高</td><td>中</td><td>低</td></tr><tr><td>技术成熟度</td><td>高</td><td>中</td><td>低</td></tr></tbody></table></div><p><b>推荐方案：</b>采用分布式边缘网络。其多区域并行处理可将关键告警路径缩短 40%；单节点故障不影响全局；支持渐进式部署，初期覆盖主巷道，后续扩展至采掘面。</p><h4>2.2 定位技术方案权衡</h4><ul><li><b>方案 A：纯激光 SLAM。</b>不受光照影响、点云精度高，但长走廊退化严重，需进行误差修正。</li><li><b>方案 B：视觉-激光融合。</b>互补性强，视觉提供纹理约束、激光提供尺度信息；弱光环境需要图像增强，计算负载增加约 30%。</li><li><b>方案 C：多模态 BEV 融合。</b>统一特征空间、可动态调整权重，但需大量标注数据训练，工程化难度较高。</li></ul><p>决策选择方案 B，并引入轻量化图像增强。关键参数为：视觉帧率 15fps，激光扫描频率 20Hz，IMU 采样 200Hz，融合周期 50ms，满足 0.3m 精度要求且算力消耗 ≤18TOPS。</p><h4>2.3 气体传感器配置策略</h4><p>单一催化燃烧式甲烷传感器响应时间约 20 秒，且易受硅中毒影响。推荐多原理融合阵列：第一阵列室配置催化燃烧 CH₄、电化学 CO、红外 CO₂；第二阵列室配置 7 通道半导体阵列；融合算法动态调整权重，粉尘遮挡时自动切换至红外通道。</p><p>融合模型准确率可达 96%，较单传感器提升 14 个百分点；高湿环境漂移率从 18% 降至 5%。双阵列配置增加硬件成本约 1.2 万元/台，但故障率降低 60%，全生命周期 TCO 降低约 35%。</p></section><section><h3>三、理论推导与计算验证</h3><h4>3.1 爬坡能力理论计算</h4><p>煤矿巷道典型坡度 θ=12°，机器人质量 m=180kg，履带-地面摩擦系数 μ=0.3。所需牵引力 F_required = mg(sinθ + μcosθ) = 883N。按减速比、机械效率和履带半径计算，单侧电机输出推力为 3188N，双侧安全系数 K=7.2，大于煤矿设备要求的 2.5。</p><p>坡道功率 P_slope = F_required × v = 441W，加上计算单元 150W 和传感器 100W，总功率 691W，低于 1050W 设计值，续航裕度充足。</p><h4>3.2 定位精度误差分析</h4><p>基于扩展卡尔曼滤波框架，状态向量 X=[x, y, θ, v_x, v_y, ω]ᵀ，观测向量 Z=[z_lidar, z_vision, z_imu]ᵀ。蒙特卡洛仿真 1000 次后，融合定位 RMSE 为 0.28m，95% 置信区间为 [0.22m, 0.34m]。粉尘导致视觉退化时，RMSE 可能升至 0.41m，需要启动纯激光模式。</p><h4>3.3 气体检测响应时间建模</h4><p>多传感器融合检测时延 T_gas = max(T_diffusion, T_sensor, T_fusion)。距泄漏源 0.5m、风速 0.3m/s 时，扩散时延 1.67s；采用红外优先策略时传感器响应约 5s；边缘 AI 融合推理约 0.15s。总时延约 5.15s，虽超过 3 秒目标，但通过将 0.5% CH₄ 设置为黄色预警阈值，可实现更早告警并提升安全裕度。</p></section><section><h3>四、长远研发与实验设计方案</h3><h4>4.1 分阶段验证路线图</h4><ol><li><b>第一阶段（6 个月）：实验室环境验证。</b>搭建 12° 坡度测试台；开展 50/100/200mg/m³ 粉尘浓度梯度测试；在 0.001-0.1Lux 弱光环境下比较不同融合方案。</li><li><b>第二阶段（12 个月）：矿井模拟巷道试验。</b>在 500m 测试巷道布置全站仪基准点；完成连续 72 小时耐久性测试；模拟 5G 断网并验证 128GB SSD 缓存容量及数据完整性。</li><li><b>第三阶段（18 个月）：实际矿井示范应用。</b>联合 3-5 家煤矿覆盖不同地质条件；建立故障数据库，MTBF 目标 ≥2000 小时；并行推进 MA 认证和防爆合格证。</li></ol><h4>4.2 关键实验装置设计</h4><p>多物理场耦合测试平台包括：温度 -10~45℃、湿度 30%-95%RH 的环境舱；煤尘粒径小于 75μm 的粉尘发生器；CH₄/CO/CO₂ 标准气体配比系统；5-50Hz、0.5-2g 的振动台；以及 100Hz 同步采集传感器原始数据、融合输出和地面真值的数据采集系统。</p><p>风险预控包括：防爆测试严格遵循 GB3836.1-2010 并委托国家级检测机构；电池单体温度超过 60℃ 时强制冷却、超过 80℃ 时应急放电；通信采用 5G 主链路、WiFi6 备份和有线光纤应急通道。</p><h4>4.3 数据分析与迭代优化</h4><div class="feas-report-table-wrap"><table><thead><tr><th>指标类别</th><th>监控参数</th><th>目标值</th><th>数据来源</th></tr></thead><tbody><tr><td>安全性</td><td>防爆等级保持率</td><td>100%（零失效）</td><td>压力传感器 + 甲烷检测器</td></tr><tr><td>可靠性</td><td>定位精度 RMSE</td><td>≤0.3m</td><td>全站仪对比</td></tr><tr><td>实时性</td><td>告警响应时延</td><td>≤3s（95% 分位）</td><td>时间戳日志</td></tr><tr><td>续航</td><td>8 小时作业 SOC 余量</td><td>≥20%</td><td>BMS 数据</td></tr><tr><td>环境适应</td><td>粉尘环境传感器漂移率</td><td>≤5%</td><td>标定气体对比</td></tr></tbody></table></div><p>通过收集实际矿井数据，训练场景自适应模型，实现定位算法 OTA 升级，预期第三代产品定位精度提升至 0.15m。</p></section><section><h3>五、综合结论与战略建议</h3><h4>5.1 可行性综合评估</h4><p><b>技术可行性：</b>五大核心技术均有成熟案例支撑，防爆认证与极端环境适应等关键风险可通过冗余设计和充分测试规避。定位精度 0.28m、分布式架构响应时延 2.8s，均优于目标指标。</p><p><b>经济可行性：</b>规模化后单台制造成本约 32 万元，售价 55-65 万元，毛利率约 35%，投资回收期约 18 个月；相比进口产品具有显著价格优势。</p><p><b>产业化风险：</b>短期需提前布局防爆认证和国产传感器替代；中期建议采用“租赁 + 运维服务”模式降低客户初始投资；长期需拓展金属矿山、隧道施工等应用场景。</p><h4>5.2 战略建议与技术攻关方向</h4><p><b>近期突破（12 个月内）：</b>完成视觉-激光融合工程化验证并发布 V1.0 定位算法 SDK；突破高湿粉尘环境气体检测技术；启动防爆认证流程。</p><p><b>中期布局（2-3 年）：</b>构建煤矿数字孪生平台；开发集成灭火、自主充电和多机协同调度的第二代产品；推动制定煤矿井下巡检机器人技术规范。</p><p><b>长期愿景（5 年以上）：</b>从“遥控 + 自主”混合模式向完全自主智能体演进；联合矿山装备企业、通信运营商和 AI 芯片厂商构建端-边-云协同生态；拓展海外矿山市场。</p><p><b>关键技术挑战：</b>开发耐高温、抗腐蚀的传感器封装材料；为多模态大模型部署准备 100TOPS 以上边缘算力；制定机器人与矿工的人机协同安全规范。</p><p class="feas-report-conclusion">综上，煤矿井下防爆边缘计算巡检机器人技术方案在理论上可行，工程实现路径清晰，经济效益显著。建议立即启动实验室验证，并行推进防爆认证，逐步实现规模化商业应用。</p></section></article>
        </section>
      </div>
    </main>
  </section>
</template>

<style scoped>
.feas-page { min-height: 100vh; color: #284b65; background: #f8fbfc; } button { font: inherit; }
.feas-launch { min-height: 100vh; display: grid; place-items: center; padding: 32px 26px 64px; background: radial-gradient(ellipse at 50% 40%,#e5f2fb 0%,#f7fafc 48%,#f7fafc 100%); }.feas-launch__inner { width: min(900px, 100%); margin: -4vh auto 0; }.feas-launch__title { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 23px; text-align: left; }.feas-launch__title > i { width: 46px; height: 46px; display: grid; place-items: center; flex: 0 0 auto; color: #1777b7; border-radius: 14px; background: linear-gradient(145deg, #dff4f6, #e8f2fb); font-style: normal; }.feas-launch__title span { color: #1980b6; font-size: 11px; font-weight: 800; letter-spacing: .1em; }.feas-launch__title h1 { margin: 2px 0 0; color: #163957; font-size: 30px; letter-spacing: -.03em; }.feas-launch__title p { margin: 5px 0 0; color: #7890a2; font-size: 14px; }
.feas-launch__composer { overflow: hidden; border: 1px solid #cbdce8; border-radius: 14px; background: #fff; box-shadow: 0 15px 38px rgba(49, 95, 133, .12); }.feas-launch__composer:focus-within { border-color: #5da8d0; box-shadow: 0 16px 40px rgba(25, 117, 183, .14); }.feas-launch__composer textarea { width: 100%; height: 190px; display: block; border: 0; outline: 0; resize: vertical; padding: 21px 22px 8px; color: #284b65; font: 16px/1.7 "Microsoft YaHei", sans-serif; }.feas-launch__composer textarea::placeholder { color: #9baeba; }.feas-launch__composer footer { display: flex; justify-content: flex-end; align-items: center; gap: 11px; padding: 10px 14px 14px; }.feas-launch__composer footer small, .feas-launch__composer footer span { color: #90a1ae; font-size: 12px; }.feas-launch__composer footer span { margin-left: auto; }.feas-launch__composer button { width: 42px; height: 42px; display: grid; place-items: center; border: 0; border-radius: 10px; background: #1874b5; color: #fff; cursor: pointer; box-shadow: 0 4px 10px rgba(25, 111, 169, .18); }.feas-launch__composer button:disabled { color: #a3b2bd; background: #dfe8ed; cursor: not-allowed; }.feas-launch__example { display: grid; grid-template-columns: 70px minmax(0, 1fr); gap: 11px; margin: 20px 12px 0; color: #7890a1; }.feas-launch__example > span { padding-top: 3px; font-size: 12px; }.feas-launch__example button { border: 0; background: transparent; padding: 0; color: #55748b; font: 13px/1.7 "Microsoft YaHei"; text-align: left; cursor: pointer; }.feas-launch__example button:hover { color: #116cae; }.feas-launch__example b { color: #1777b7; font-size: 15px; }
.feas-launch__example { grid-template-columns: 72px minmax(0, 1fr); align-items: center; gap: 10px; margin: 17px 3px 0; }.feas-launch__example > span { padding-top: 0; font-size: 15px; }.feas-launch__example button { display: flex; min-width: 0; align-items: center; border-radius: 8px; padding: 9px 12px; color: #24698f; background: #e9f3f9; font: 15px/1.45 "Microsoft YaHei", sans-serif; }.feas-launch__example button:hover { color: #0f6faa; background: #dceef7; }.feas-launch__example button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.feas-launch__composer .feas-launch__clear { width: auto; height: auto; min-height: 32px; margin-right: auto; padding: 6px; color: #6b90a8; background: transparent; box-shadow: none; font-size: 13px; font-weight: 700; }.feas-launch__composer .feas-launch__clear:hover:not(:disabled) { color: #116cae; background: #eef7fb; }.feas-launch__composer .feas-launch__clear:disabled { color: #b2c2cd; background: transparent; }
.feas-workbench { width: min(1420px, 100%); margin: 0 auto; padding: 24px 28px 50px; }.feas-task-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; margin: 0 0 18px; }.feas-task-header span { color: #1772b1; font-size: 11px; font-weight: 800; letter-spacing: .1em; }.feas-task-header h1 { margin: 4px 0 0; color: #173b5a; font-size: 29px; letter-spacing: -.025em; }.feas-task-header > button { border: 1px solid #c9dce8; border-radius: 8px; background: #fff; padding: 8px 11px; color: #4b6c84; font-size: 12px; cursor: pointer; }.feas-layout { display: grid; grid-template-columns: minmax(0, 36%) minmax(0, 1fr); gap: 16px; align-items: start; }.feas-reasoning { position: sticky; top: 18px; display: grid; gap: 12px; max-height: calc(100vh - 36px); overflow: auto; padding-right: 4px; }.feas-input-summary, .feas-thinking, .feas-followup, .feas-report-view { border: 1px solid #dce8ef; border-radius: 14px; background: #fff; box-shadow: 0 7px 20px rgba(36, 73, 102, .045); }.feas-input-summary { padding: 16px; }.feas-input-summary > span { color: #1672b1; font-size: 12px; font-weight: 800; }.feas-input-summary p { margin: 7px 0 0; color: #58738a; font-size: 13px; line-height: 1.65; overflow-wrap: anywhere; }
.feas-thinking { padding: 16px; }.feas-thinking header h2 { margin: 0; color: #234762; font-size: 17px; }.feas-thinking header p { margin: 3px 0 11px; color: #8297a7; font-size: 12px; }.feas-thinking-step { position: relative; display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 10px; padding: 10px 0 11px; }.feas-thinking-step:not(:last-child)::before { position: absolute; top: 32px; bottom: -5px; left: 11px; width: 1px; background: #d8e7ef; content: ""; }.feas-thinking-step > i { z-index: 1; width: 23px; height: 23px; display: grid; place-items: center; color: #fff; border-radius: 50%; background: #1475b7; font-style: normal; }.feas-thinking-step b { display: block; color: #34556d; font-size: 14px; }.feas-thinking-step p { margin: 4px 0 7px; color: #7890a0; font-size: 12px; line-height: 1.55; }.feas-thinking-step button { width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 10px; overflow: hidden; border: 0; border-radius: 8px; background: #f1f7fb; padding: 8px 10px; color: #1269aa; font-size: 12px; font-weight: 700; text-align: left; cursor: pointer; }.feas-thinking-step button:hover { background: #e7f3fa; }.feas-thinking-step button > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.feas-thinking-step button > span:last-child { display: inline-flex; align-items: center; gap: 2px; border-left: 1px solid #d4e6f0; padding-left: 8px; white-space: nowrap; }
.feas-followup { padding: 15px; }.feas-followup h3 { margin: 0; color: #244963; font-size: 16px; }.feas-followup p { margin: 4px 0 10px; color: #8196a6; font-size: 12px; }.feas-followup textarea { width: 100%; height: 82px; display: block; border: 1px solid #d7e5ec; border-radius: 9px; outline: 0; resize: vertical; padding: 10px; color: #385872; font: 13px/1.55 "Microsoft YaHei"; }.feas-followup textarea:focus { border-color: #69b0d4; box-shadow: 0 0 0 3px #e8f4f9; }.feas-followup button { display: inline-flex; align-items: center; gap: 4px; margin: 9px 0 0 auto; border: 0; background: transparent; color: #126aac; font-size: 13px; font-weight: 800; cursor: pointer; }.feas-followup button:disabled { color: #a8bac7; cursor: not-allowed; }.feas-followup > small { display: block; margin-top: 8px; color: #25815a; font-size: 11px; }
.feas-report-view { min-width: 0; min-height: 650px; overflow: hidden; }.feas-report-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 10px; border-bottom: 1px solid #e5edf2; padding: 12px 17px; color: #5b7489; font-size: 13px; }.feas-report-toolbar > div { display: flex; flex: 0 0 auto; gap: 7px; }.feas-report-toolbar button { display: inline-flex; align-items: center; gap: 5px; min-height: 34px; border-radius: 8px; padding: 7px 11px; font-size: 12px; font-weight: 800; cursor: pointer; }.feas-outline { border: 1px solid #244f66; background: #244f66; color: #fff; }.feas-export { border: 1px solid #17aebe; background: linear-gradient(135deg, #22c8c9, #168dcc); color: #06374b; box-shadow: 0 4px 10px rgba(21, 152, 181, .17); }
.feas-report-document, .feas-detail { width: min(840px, 100%); margin: 0 auto; padding: 34px 42px 48px; overflow-wrap: anywhere; }.feas-report-document > span, .feas-detail > span { color: #1772b1; font-size: 11px; font-weight: 800; letter-spacing: .1em; }.feas-report-document h2, .feas-detail h2 { margin: 7px 0 28px; color: #123755; font-size: 28px; line-height: 1.35; }.feas-report-meta { display: flex; flex-wrap: wrap; gap: 9px; margin: -17px 0 25px; }.feas-report-meta b { border-radius: 999px; background: #f0f7fb; padding: 4px 9px; color: #7892a5; font-size: 11px; font-weight: 600; }.feas-report-document section { margin-top: 25px; }.feas-report-document h3 { margin: 0 0 13px; border-left: 5px solid #1777b8; padding-left: 11px; color: #176eb0; font-size: 20px; }.feas-report-document h4 { margin: 14px 0 6px; color: #315c7a; font-size: 15px; }.feas-report-document p { margin: 0; color: #526f86; font-size: 14px; line-height: 1.85; }.feas-summary { border: 1px solid #d9e9f2; border-radius: 12px; background: linear-gradient(135deg, #f7fcff, #fff); padding: 18px 19px; }.feas-summary h3 { margin-bottom: 16px !important; }.feas-formal-table { overflow: hidden; border: 1px solid #dce9f0; border-radius: 11px; }.feas-formal-table article { display: grid; grid-template-columns: 112px minmax(160px, .9fr) minmax(220px, 1.4fr); gap: 12px; align-items: start; border-top: 1px solid #e7eff4; padding: 13px 15px; color: #57748a; font-size: 13px; line-height: 1.6; }.feas-formal-table article:first-child { border-top: 0; }.feas-formal-table b { color: #2d5b78; }.feas-formal-table span { color: #176fae; font-weight: 800; }.feas-formal-table em { color: #7891a3; font-style: normal; }.feas-report-document ol { margin: 0; padding-left: 22px; color: #4f6c84; font-size: 14px; line-height: 2; }.feas-evidence { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }.feas-evidence article { min-width: 0; border: 1px solid #deebf1; border-radius: 10px; padding: 13px; }.feas-evidence b, .feas-evidence span { display: block; }.feas-evidence b { color: #31546e; font-size: 13px; }.feas-evidence span { margin: 5px 0; color: #1474b6; font-size: 22px; font-weight: 800; }.feas-evidence p { color: #7890a1; font-size: 11px; line-height: 1.6; }
.feas-detail section { margin-top: 18px; border-radius: 12px; background: #f8fafc; padding: 18px 20px; }.feas-detail h3 { margin: 0 0 11px; color: #3f5c76; font-size: 18px; font-weight: 600; }.feas-detail p { margin: 0; color: #526f86; font-size: 14px; line-height: 1.78; }.feas-detail-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 15px; }.feas-detail-tags b { border-radius: 6px; background: #edf6fa; padding: 4px 8px; color: #176eac; font-size: 12px; }.feas-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: transparent !important; padding: 0 !important; }.feas-detail-grid article { border: 1px solid #dfebf0; border-radius: 10px; background: #fff; padding: 13px; }.feas-detail-grid b { color: #28516d; font-size: 13px; }.feas-detail-grid p { margin-top: 8px; font-size: 12px; line-height: 1.7; }

/* Output workspace refinement: preserve the report structure while clarifying hierarchy. */
.feas-workbench { padding-top: 28px; }
.feas-task-header { margin-bottom: 20px; padding: 19px 21px 18px; border: 1px solid #d7e5ec; border-left: 4px solid #1777b7; border-radius: 12px; background: #fff; box-shadow: 0 8px 22px rgba(36, 73, 102, .05); }
.feas-task-header { align-items: center; padding-top: 16px; padding-bottom: 16px; }.feas-task-brand { display: flex; min-width: 0; align-items: center; gap: 9px; color: #173b5a; }.feas-task-brand > i { width: 36px; height: 36px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 10px; color: #1777b7; background: #e7f4fa; font-style: normal; }.feas-task-header .feas-task-brand > span, .feas-task-header .feas-task-brand > h1 { overflow: hidden; margin: 0; color: #173b5a; font-size: 21px; font-weight: 750; letter-spacing: -.02em; line-height: 1.35; white-space: nowrap; }.feas-task-header .feas-task-brand > span { flex: 0 0 auto; }.feas-task-brand > b { flex: 0 0 auto; color: #82a4b8; font-size: 22px; font-weight: 500; line-height: 1; }.feas-task-header .feas-task-brand > h1 { min-width: 0; text-overflow: ellipsis; }
.feas-task-header span { color: #2378aa; letter-spacing: .085em; }
.feas-task-header h1 { color: #153c5a; font-size: 27px; font-weight: 750; }
.feas-task-header > button { align-self: center; border-color: #c8dbe5; padding: 8px 12px; color: #46677d; transition: border-color .18s ease, background-color .18s ease, color .18s ease, transform .18s ease; }
.feas-task-header > button:hover { border-color: #78afd0; background: #f4fafc; color: #146fae; }
.feas-task-header > button:active { transform: translateY(1px); }
.feas-layout { gap: 20px; }
.feas-reasoning { gap: 14px; }
.feas-input-summary, .feas-thinking, .feas-followup { border-color: #d7e5ec; border-radius: 12px; box-shadow: 0 6px 18px rgba(36, 73, 102, .035); }
.feas-input-summary { padding: 17px; background: linear-gradient(112deg, #fff 0%, #f5fafc 100%); }
.feas-input-summary > span { color: #176fae; }
.feas-thinking { padding: 17px; }
.feas-thinking header { padding-bottom: 10px; border-bottom: 1px solid #e8f0f4; }
.feas-thinking header p { margin-bottom: 0; }
.feas-thinking-step { padding: 14px 0 13px; }
.feas-thinking-step:not(:last-child)::before { top: 38px; bottom: -4px; background: #cadfea; }
.feas-thinking-step > i { width: 24px; height: 24px; background: #237caf; box-shadow: 0 0 0 4px #edf6fa; }
.feas-thinking-step b { color: #2f526a; }
.feas-thinking-step p { color: #6f899b; line-height: 1.65; }
.feas-thinking-step button { border: 1px solid #e0edf3; border-radius: 7px; background: #f7fbfd; color: #176fae; transition: border-color .18s ease, background-color .18s ease, transform .18s ease; }
.feas-thinking-step button:hover { border-color: #b7d9e9; background: #eef8fb; }
.feas-thinking-step button:active { transform: translateY(1px); }
.feas-followup { padding: 16px; background: #fff; }
.feas-followup textarea { border-radius: 7px; background: #fbfdfe; }
.feas-followup textarea:focus { border-color: #66aecd; box-shadow: 0 0 0 3px rgba(132, 198, 224, .2); }
.feas-report-view { border-color: #d4e2e9; border-radius: 12px; background: #f0f6f8; box-shadow: 0 12px 28px rgba(36, 73, 102, .07); }
.feas-report-toolbar { position: sticky; top: 0; z-index: 1; min-height: 58px; border-bottom-color: #dce9ef; padding: 12px 18px; background: rgba(255, 255, 255, .94); color: #42647b; font-weight: 700; backdrop-filter: blur(10px); }
.feas-report-toolbar button { transition: background-color .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease; }
.feas-report-toolbar button:active { transform: translateY(1px); }
.feas-outline { border-color: #d2e2e9; background: #fff; color: #41637a; }
.feas-outline:hover { border-color: #9fc7da; background: #f4fafc; color: #156fae; }
.feas-export { border-color: #157eaa; background: #1777b7; color: #fff; box-shadow: 0 4px 10px rgba(23, 119, 183, .18); }
.feas-export:hover { background: #11699f; box-shadow: 0 6px 14px rgba(23, 119, 183, .24); }
.feas-report-document, .feas-detail { box-sizing: border-box; width: min(880px, calc(100% - 32px)); margin: 18px auto 28px; border: 1px solid #e2ecef; border-radius: 8px; background: #fff; box-shadow: 0 8px 20px rgba(41, 82, 108, .05); padding: 39px 46px 58px; }
.feas-report-document > span, .feas-detail > span { color: #2779a9; font-size: 10px; letter-spacing: .12em; }
.feas-report-document h2, .feas-detail h2 { margin: 8px 0 27px; color: #173c59; font-size: 29px; font-weight: 750; letter-spacing: -.02em; }
.feas-report-meta { gap: 7px; margin: -15px 0 28px; }
.feas-report-meta b { border: 1px solid #dceaf0; background: #f5fafc; padding: 4px 9px; color: #628095; font-weight: 600; }
.feas-report-document > section { margin-top: 0; padding: 25px 0 0; }
.feas-report-document > section + section { margin-top: 27px; border-top: 1px solid #e7eef2; }
.feas-report-document h3 { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; border-left: 0; padding-left: 0; color: #1d5f8d; font-size: 19px; font-weight: 750; }
.feas-report-document h3::before { width: 4px; height: 20px; flex: 0 0 auto; border-radius: 4px; background: #197bb3; content: ""; }
.feas-report-document h4 { margin: 16px 0 6px; color: #2e5977; font-size: 14px; font-weight: 750; }
.feas-report-document p { color: #4d6a80; line-height: 1.9; }
.feas-summary { border-color: #cfe3ec; border-radius: 8px; background: linear-gradient(108deg, #f2f9fc 0%, #fbfdfe 76%); padding: 21px 22px 22px !important; }
.feas-summary h3 { margin-bottom: 15px; }
.feas-summary p { color: #4b6b82; }
.feas-formal-table { border-color: #d8e7ee; border-radius: 8px; background: #fff; }
.feas-formal-table article { grid-template-columns: 104px minmax(170px, .95fr) minmax(220px, 1.45fr); gap: 16px; border-top-color: #e5eef2; padding: 15px 17px; }
.feas-formal-table article:nth-child(even) { background: #f8fbfc; }
.feas-formal-table b { color: #315b75; font-size: 13px; }
.feas-formal-table span { color: #1c739f; }
.feas-formal-table em { color: #70899a; }
.feas-report-document ol { padding-left: 24px; color: #4f6d83; line-height: 2.15; }
.feas-report-document ol li::marker { color: #1d79af; font-weight: 800; }
.feas-evidence { display: block; overflow: hidden; border: 1px solid #d7e6ed; border-radius: 8px; background: #fff; }
.feas-evidence article { display: grid; grid-template-columns: 118px 82px minmax(0, 1fr); align-items: center; gap: 14px; border: 0; border-radius: 0; padding: 15px 17px; }
.feas-evidence article + article { border-top: 1px solid #e5eef2; }
.feas-evidence article:nth-child(even) { background: #f8fbfc; }
.feas-evidence b { color: #355a72; }
.feas-evidence span { margin: 0; color: #1e76aa; font-size: 20px; line-height: 1.15; }
.feas-evidence p { color: #6c8799; font-size: 12px; }
.feas-detail section { border: 1px solid #dce9ef; border-radius: 8px; background: #f8fbfc; padding: 19px 20px; }
.feas-detail h3 { color: #2d5773; font-weight: 750; }
.feas-detail-tags b { border: 1px solid #d9eaf1; border-radius: 5px; background: #eef8fb; color: #1d739f; }
.feas-detail-grid { border: 0 !important; background: transparent !important; }
.feas-detail-grid article { border-color: #dce8ee; border-radius: 8px; padding: 15px; }
.feas-task-header .feas-task-brand > span { color: #1777b7; font-weight: 800; letter-spacing: 0; }
.feas-task-header .feas-task-brand > h1 { color: #173b5a; font-weight: 650; }
.feas-report-formula { margin: 16px 0 2px; border: 1px solid #cfe3ec; border-radius: 8px; background: #f2f9fc; padding: 12px 14px; color: #176fae; font-size: 14px; font-weight: 700; text-align: center; }
.feas-report-image-scroll { margin-top: 16px; overflow-x: auto; border: 1px solid #dce9ef; border-radius: 8px; background: #fff; }
.feas-report-image-scroll img { display: block; width: 100%; min-width: 680px; height: auto; }
.feas-detail-section ul { margin: 0; padding-left: 20px; color: #526f86; font-size: 14px; line-height: 1.8; }
.feas-detail-section li + li { margin-top: 4px; }
.feas-detail-tags span { border: 1px solid #d9eaf1; border-radius: 5px; background: #eef8fb; padding: 3px 7px; color: #1d739f; font-size: 12px; font-weight: 700; }
.feas-literature { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; }
.feas-detail .feas-literature > section { margin-top: 0; border: 1px solid #dce9ef; border-radius: 8px; background: #fff; padding: 15px 16px; }
.feas-literature h3 b { margin-left: 5px; color: #1775b6; }
.feas-literature article { border-top: 1px solid #edf2f5; padding: 11px 0; }
.feas-literature h3 + article { border-top: 0; padding-top: 0; }
.feas-literature strong, .feas-literature small, .feas-literature em { display: block; }
.feas-literature strong { color: #385a72; font-size: 13px; line-height: 1.55; }
.feas-literature small { margin-top: 4px; color: #668297; font-size: 12px; line-height: 1.65; }
.feas-literature em { margin-top: 4px; color: #92a5b2; font-size: 11px; font-style: normal; line-height: 1.55; }
.feas-gap-reading { display: grid; gap: 8px; margin-bottom: 14px; }
.feas-gap-reading span { border: 1px solid #dce9ef; border-radius: 8px; background: #f8fbfc; padding: 9px 11px; color: #5a778c; font-size: 12px; }
.feas-gap-image { margin: 0; overflow: hidden; border: 1px solid #dce9ef; border-radius: 8px; background: #fff; }
.feas-gap-image img { display: block; width: 100%; height: auto; }
.feas-report-document.feas-report-direct { max-width: 920px; padding: 34px 42px 58px; color: #1e252d; }
.feas-report-direct .feas-report-body-title { margin: 0 0 34px; }
.feas-report-direct .feas-report-body-title h2 { margin: 0 0 25px; color: #111820; font-size: 30px; font-weight: 750; line-height: 1.35; letter-spacing: -.02em; }
.feas-report-direct .feas-report-body-title h3 { margin: 0; color: #096fe1; font-size: 26px; }
.feas-report-document.feas-report-direct > section, .feas-report-document.feas-report-direct > section + section { margin: 0 0 34px; border: 0; padding: 0; }
.feas-report-direct h2 { margin: 0 0 18px; color: #162f43; font-size: 25px; font-weight: 750; line-height: 1.45; }
.feas-report-direct h3 { display: block; margin: 0 0 14px; color: #096fd1; font-size: 21px; font-weight: 750; line-height: 1.45; }
.feas-report-direct h3::before { display: none; }
.feas-report-direct h4 { margin: 20px 0 10px; color: #17212a; font-size: 18px; font-weight: 750; line-height: 1.55; }
.feas-report-direct p { margin: 0 0 13px; color: #1e252d; font-size: 15px; line-height: 1.92; text-align: justify; }
.feas-report-direct ol, .feas-report-direct ul { margin: 0; padding-left: 24px; color: #1e252d; font-size: 15px; line-height: 1.9; }
.feas-report-direct li + li { margin-top: 7px; }
.feas-report-direct .feas-report-formula { margin: 16px 0; border: 0; border-left: 4px solid #1683bd; border-radius: 0; background: #f3f9fc; padding: 11px 15px; color: #32556d; font: 600 14px/1.7 "Microsoft YaHei"; text-align: left; }
.feas-report-direct .feas-report-image-scroll { box-sizing: border-box; width: 100%; max-width: 100%; margin: 14px 0 4px; overflow-x: auto; overflow-y: hidden; border: 1px solid #dce7ee; border-radius: 10px; background: #fff; box-shadow: inset 0 -1px 0 #eef3f6; }
.feas-report-direct .feas-report-image-scroll img { display: block; width: 100%; min-width: 0; max-width: 100%; height: auto; }
.feas-report-divider { display: flex; align-items: center; gap: 14px; margin: 46px 0 34px; color: #096fd1; font-size: 22px; font-weight: 800; }
.feas-report-divider::before, .feas-report-divider::after { height: 1px; background: #d9e6ee; content: ""; }
.feas-report-divider::before { width: 24px; }
.feas-report-divider::after { flex: 1; }
.feas-report-table-wrap { max-width: 100%; margin: 15px 0 17px; overflow-x: auto; border: 1px solid #d9e6ee; border-radius: 10px; }
.feas-report-table-wrap table { width: 100%; min-width: 650px; border-collapse: collapse; background: #fff; color: #1e252d; font-size: 13px; line-height: 1.6; }
.feas-report-table-wrap th, .feas-report-table-wrap td { border-right: 1px solid #e4edf2; border-bottom: 1px solid #e4edf2; padding: 11px 13px; text-align: left; vertical-align: top; }
.feas-report-table-wrap th { background: #eff7fb; color: #245776; font-weight: 700; }
.feas-report-table-wrap tr:last-child td { border-bottom: 0; }
.feas-report-table-wrap th:last-child, .feas-report-table-wrap td:last-child { border-right: 0; }
.feas-report-direct .feas-report-conclusion { margin-top: 20px; border-left: 4px solid #0b77bd; background: #f1f8fc; padding: 14px 16px; color: #274e68; font-weight: 700; }
@media (max-width: 1240px) { .feas-workbench { padding-right: 20px; padding-left: 20px; }.feas-layout { grid-template-columns: minmax(0, 1fr); }.feas-reasoning { position: static; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); max-height: none; overflow: visible; }.feas-thinking { grid-row: span 2; }.feas-report-document, .feas-detail { padding: 29px 28px 42px; } }
@media (max-width: 900px) { .feas-launch { padding: 28px 16px 50px; }.feas-launch__inner { margin: 0; }.feas-launch__title { align-items: flex-start; justify-content: flex-start; }.feas-launch__title h1 { font-size: 26px; }.feas-launch__title p { font-size: 12px; line-height: 1.6; }.feas-launch__composer textarea { height: 165px; padding: 17px; font-size: 14px; }.feas-launch__example { grid-template-columns: 1fr; gap: 4px; margin: 15px 2px 0; }.feas-workbench { padding: 20px 13px 40px; }.feas-task-header { flex-direction: column; gap: 10px; }.feas-task-header h1 { font-size: 25px; line-height: 1.3; }.feas-reasoning { grid-template-columns: 1fr; }.feas-thinking { grid-row: auto; }.feas-report-toolbar { align-items: flex-start; flex-direction: column; }.feas-report-toolbar > div { width: 100%; justify-content: flex-end; }.feas-report-document, .feas-detail { width: min(100%, calc(100% - 22px)); padding: 23px 17px 37px; }.feas-report-document h2, .feas-detail h2 { font-size: 23px; }.feas-formal-table article, .feas-evidence, .feas-detail-grid { grid-template-columns: 1fr; gap: 5px; }.feas-evidence { gap: 10px; }.feas-evidence article { grid-template-columns: 1fr; gap: 4px; }.feas-summary { padding: 14px; }.feas-report-document p, .feas-report-document ol { font-size: 13px; }.feas-literature { grid-template-columns: 1fr; }.feas-report-image-scroll img { min-width: 620px; }.feas-report-document.feas-report-direct { padding: 24px 18px 40px; }.feas-report-direct .feas-report-body-title h2 { font-size: 24px; }.feas-report-direct .feas-report-body-title h3 { font-size: 22px; }.feas-report-direct h2 { font-size: 21px; }.feas-report-direct h3 { font-size: 18px; }.feas-report-direct h4 { font-size: 16px; }.feas-report-direct p, .feas-report-direct ol, .feas-report-direct ul { font-size: 14px; line-height: 1.8; } }
</style>
