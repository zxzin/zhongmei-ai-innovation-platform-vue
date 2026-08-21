<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowUp, CheckCircle2, ChevronRight, Download, MessageSquareText, PanelLeft, Plus, X } from '@lucide/vue'
import { useUiStore } from '../../stores/ui.js'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const stage = ref('launch')
const prompt = ref('')
const requirement = ref('')
const focus = ref('')
const tocOpen = ref(false)
const activeSection = ref(0)

const examples = [
  ['研发策略', '煤矿井下智能巡检机器人的多传感器融合与防爆边缘计算关键技术预研'],
  ['技术路线', '矿井高盐废水深度处理与资源化利用的技术路线及工程适配研究'],
  ['产业趋势', '煤矿智能化背景下井下无人巡检与 5G-A 融合应用的发展趋势'],
]
const defaultTopic = examples[0][1]
const topic = computed(() => prompt.value || defaultTopic)
const fullTopic = computed(() => {
  const extra = [requirement.value, focus.value].filter(Boolean).join('；')
  return extra ? topic.value + '，' + extra : topic.value
})
const outline = ref([
  '煤矿巡检机器人技术背景与目标', '井下智能巡检市场需求分析', '多传感器融合技术现状与挑战',
  '煤矿机器人技术演进路径', '井下巡检机器人主要玩家分析', '多传感器融合当前技术方案',
  '防爆边缘计算重点技术解读', '实时数据处理潜在创新方向', '煤矿防爆认证与安全法规', '井下恶劣环境适应性技术',
])
const reportSections = [
  ['01', '研究背景', '煤矿巡检机器人技术背景与目标'],
  ['02', '市场与需求', '井下智能巡检市场需求分析'],
  ['03', '技术现状', '多传感器融合技术现状与挑战'],
  ['04', '技术路线', '多传感器融合与防爆边缘计算方案'],
  ['05', '研究建议', '验证计划、风险与下一步建议'],
]

function routeFor(next) {
  return '/agent/research/' + (next === 'launch' ? 'brief' : next)
}
function move(next) {
  stage.value = next
  router.push(routeFor(next))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function startResearch() {
  if (!prompt.value.trim()) return
  requirement.value = ''
  focus.value = ''
  move('scope')
}
function addRequirement() {
  if (!requirement.value.trim()) return
  move('detail')
}
function download() {
  ui.notify('技术预研报告已生成 Word 文件', 'success')
}
watch(() => route.params.stage, (value) => {
  stage.value = ['scope', 'detail', 'outline', 'report'].includes(value) ? value : 'launch'
}, { immediate: true })
</script>

<template>
  <section class="research-page">
    <main v-if="stage === 'launch'" class="research-launch">
      <section class="research-launch-inner">
        <header class="research-launch-title"><div class="agent-flow-mark">◫</div><h1>技术预研报告</h1></header>
        <section class="research-composer"><textarea v-model="prompt" maxlength="5000" aria-label="技术预研问题" placeholder="请描述需要预研的技术问题、应用场景和研究目标。" /><footer><button class="research-clear" type="button" :disabled="!prompt" @click="prompt = ''">清空内容</button><button class="research-submit" type="button" :disabled="!prompt.trim()" aria-label="开始预研" title="开始预研" @click="startResearch"><span aria-hidden="true">➤</span></button></footer></section>
        <section class="research-examples" aria-label="示范输入"><span>示范输入</span><button type="button" title="带入完整示范内容" @click="prompt = examples[0][1]"><span>{{ examples[0][1] }}</span></button></section>
      </section>
    </main>

    <main v-else-if="stage === 'scope' || stage === 'detail'" class="research-clarify">
      <div class="research-clarify-layout">
        <section class="research-dialogue">
          <article class="research-topic-bubble"><span>研发策略</span><b>{{ topic }}</b></article>
          <article class="research-assistant-card">
            <header><i>✦</i><h1>您要进行技术预研的研究内容是：</h1></header><strong>{{ topic }}</strong>
            <div class="assistant-question"><p>为了帮助您生成高质量的预研报告，建议补充更详细的信息。</p><b>您希望该技术达到什么样的具体技术效果或性能指标？比如：提升巡检准确率至 95% 以上，实现毫秒级数据处理响应。</b></div>
            <p class="assistant-note">如果没有更多需要补充的信息，也可以直接生成预研报告。</p><button class="research-primary" type="button" @click="move('outline')">生成预研报告 <ChevronRight :size="16" /></button>
          </article>
          <template v-if="stage === 'detail'">
            <article class="research-detail-bubble"><b>{{ requirement }}</b></article>
            <article class="research-assistant-card">
              <header><i>✦</i><h1>接下来希望重点研究哪个方向？</h1></header><strong>{{ requirement }}的研究</strong>
              <div class="assistant-question"><p>已将性能目标加入预研范围。</p><b>您希望重点研究多传感器融合技术还是防爆边缘计算技术？比如：融合算法优化、防爆边缘计算硬件设计。</b></div>
              <button class="research-primary" type="button" @click="move('outline')">继续生成大纲 <ChevronRight :size="16" /></button>
            </article>
          </template>
          <section class="research-followup"><header><i><Plus :size="16" /></i><b>补充描述</b></header><div><textarea v-model="requirement" :placeholder="stage === 'detail' ? '继续补充重点研究方向或其他要求' : '补充具体技术效果或性能指标'" @keydown.ctrl.enter.prevent="stage === 'detail' ? move('outline') : addRequirement()" /><button type="button" aria-label="提交补充描述" :disabled="!requirement.trim()" @click="stage === 'detail' ? move('outline') : addRequirement()"><ArrowUp :size="17" /></button></div><button v-if="stage === 'scope'" class="example-button" type="button" @click="requirement = '提升巡检准确率至 95% 以上，实现实时数据处理响应时间小于 100ms'">带入示例</button></section>
        </section>
        <aside class="research-progress"><div class="progress-line" /><article class="active"><i>1</i><div><h2>开始您的研究</h2><p>{{ fullTopic }}</p></div></article><article><i>2</i><div><h2>报告大纲</h2><p>归纳技术现状、研究路线与重点问题。</p></div></article><article><i>3</i><div><h2>开始生成报告</h2><p>形成可阅读、可继续完善的预研报告。</p></div></article></aside>
      </div>
    </main>

    <main v-else-if="stage === 'outline'" class="research-outline">
      <div class="research-outline-layout">
        <section class="research-dialogue">
          <article class="research-assistant-card compact"><header><i>✦</i><h1>您要进行技术预研的研究内容是：</h1></header><strong>{{ topic }}</strong><div class="assistant-question"><p>预研范围已确认。</p><b>{{ requirement || '将结合技术背景、应用场景和研究目标组织报告。' }}</b></div></article>
          <article v-if="requirement" class="research-detail-bubble"><b>{{ requirement }}</b></article>
          <article class="research-assistant-card compact"><header><i>✦</i><h1>报告大纲已生成</h1></header><strong>请在右侧查看或编辑报告大纲，确认后开始生成报告。</strong><div class="assistant-question"><p>前八个章节由系统根据研究范围组织，后两个章节可以补充或调整。</p></div></article>
          <aside class="outline-note"><MessageSquareText :size="18" /><span>可以在大纲确认前继续补充研究要求，系统会在报告生成时保留本次任务快照。</span></aside>
        </section>
        <aside class="research-progress outline-progress"><div class="progress-line" /><article class="done"><i><CheckCircle2 :size="16" /></i><div><h2>开始您的研究</h2><p>{{ fullTopic }}</p></div></article><article class="active"><i>2</i><div><h2>报告大纲</h2><div class="outline-list"><label v-for="(item, index) in outline" :key="index" :class="{ editable: index > 7 }"><span v-if="index < 8">{{ item }}</span><input v-else v-model="outline[index]" :aria-label="'可编辑大纲条目 ' + (index + 1)" /></label></div><button class="research-primary" type="button" @click="move('report')">确认并继续 <ChevronRight :size="16" /></button></div></article><article><i>3</i><div><h2>开始生成报告</h2></div></article></aside>
      </div>
    </main>

    <main v-else class="research-report">
      <header class="research-report-header"><div><span>技术预研报告</span><h1>{{ topic }}</h1><p>报告编号 RPT-260821-006 · 生成日期 2026-08-21</p></div><nav><button type="button" aria-label="查看报告目录" title="查看报告目录" @click="tocOpen = !tocOpen"><PanelLeft :size="19" /></button><button class="download-button" type="button" @click="download"><Download :size="16" />下载报告</button></nav></header>
      <div class="research-report-main">
        <aside v-if="tocOpen" class="report-toc"><header><b>报告目录</b><button type="button" aria-label="关闭目录" @click="tocOpen = false"><X :size="16" /></button></header><button v-for="(item, index) in reportSections" :key="item[0]" :class="{ active: activeSection === index }" type="button" @click="activeSection = index; document.getElementById('research-section-' + index)?.scrollIntoView({ behavior: 'smooth', block: 'start' })"><b>{{ item[0] }}</b><span>{{ item[2] }}</span></button></aside>
        <article class="research-report-document">
          <section id="research-section-0" class="report-section"><header><span>01</span><div><small>研究背景</small><h2>煤矿巡检机器人技术背景与目标</h2></div></header><div class="report-copy"><p>煤矿井下作业环境复杂且危险性高，传统人工巡检存在劳动强度大、效率低与安全风险高等问题。智能巡检机器人需要综合环境传感、视觉识别和自主导航能力，完成设备状态、气体浓度和作业环境的连续监测。</p><p>当前多传感器数据的异构性、井下网络波动和边缘设备的算力约束，使系统需要在可靠感知、实时处理和防爆安全之间取得平衡。本预研以多传感器融合与防爆边缘计算为重点，形成可验证的技术路线。</p><div class="citations"><span>引用依据</span><b>专利 8 条</b><b>论文 11 条</b><b>工程资料 4 条</b></div></div></section>
          <section id="research-section-1" class="report-section"><header><span>02</span><div><small>市场与需求</small><h2>井下智能巡检市场需求分析</h2></div></header><div class="report-copy card-grid"><article><h3>安全巡检</h3><p>面向气体、温湿度、设备异常与人员风险的持续监测，要求关键告警在网络波动时仍可本地闭环。</p></article><article><h3>无人化运维</h3><p>替代高危、重复性巡检，要求机器人在弱光、粉尘与狭长巷道条件下保持连续任务能力。</p></article><article><h3>数据资产</h3><p>将多源巡检数据沉淀为可追溯的故障、工况和设备健康记录，支撑后续模型训练和检修决策。</p></article><article><h3>工程适配</h3><p>兼顾矿用防爆、网络覆盖、边缘算力、运维成本与既有设备接口，避免技术方案难以落地。</p></article></div></section>
          <section id="research-section-2" class="report-section"><header><span>03</span><div><small>技术现状</small><h2>多传感器融合技术现状与挑战</h2></div></header><div class="report-copy"><p>激光雷达、可见光／红外视觉、惯导和气体传感器可分别承担结构定位、语义识别、短时航迹桥接与独立安全监测。现有方案的挑战并不只是增加传感器数量，而是根据各类传感器在粉尘、弱光、震动和网络波动下的可靠性动态分配权重。</p><aside class="report-callout"><b>重点挑战</b><span>环境退化感知、紧耦合定位、边缘实时推理、防爆硬件约束、断网任务连续性。</span></aside></div></section>
          <section id="research-section-3" class="report-section"><header><span>04</span><div><small>技术路线</small><h2>多传感器融合与防爆边缘计算方案</h2></div></header><div class="report-copy"><div class="route-list"><article><i>01</i><div><h3>感知与质量评估</h3><p>采集点云、视觉、惯导与气体数据，对低照度、粉尘干扰和传感器健康度建立在线质量评分。</p></div></article><article><i>02</i><div><h3>融合定位与安全闭环</h3><p>以激光雷达 + IMU 为定位主干，视觉补充语义，气体传感独立进入安全告警与任务降级逻辑。</p></div></article><article><i>03</i><div><h3>防爆边缘执行</h3><p>在井下边缘端完成异常识别、缓存回传与关键策略决策，降低持续连接与云端推理依赖。</p></div></article></div></div></section>
          <section id="research-section-4" class="report-section"><header><span>05</span><div><small>研究建议</small><h2>验证计划、风险与下一步建议</h2></div></header><div class="report-copy"><ol class="recommendations"><li><b>建立典型工况试验集：</b>覆盖不同粉尘浓度、照度、通信盲区和巷道结构的组合场景。</li><li><b>先验证主定位与独立安全通道：</b>明确传感器退化时的降级策略与人工介入条件。</li><li><b>开展边缘端实时性测试：</b>核对防爆硬件算力、模型推理时延、能耗和离线缓存容量。</li><li><b>形成可追溯验证台账：</b>将现场实测、异常样本与方案调整建立关联。</li></ol><aside class="report-boundary"><b>研究边界</b><p>本报告基于演示资料组织技术研究框架，不替代矿用防爆认证、现场连续可靠性试验或设备选型结论。</p></aside></div></section>
        </article>
      </div>
    </main>
  </section>
</template>

<style scoped>
.research-page{min-height:100vh;color:#20394f;background:#fff}.research-page button{font:inherit}.research-launch{min-height:calc(100vh - 54px);display:grid;place-items:center;padding:20px;background:radial-gradient(ellipse at 50% 40%,#e5f2fb 0%,#f7fafc 48%,#f7fafc 100%)}.research-launch-inner{width:min(980px,100%);margin:-3vh auto 0}.research-launch-title{text-align:center;margin-bottom:22px}.research-launch-title .agent-flow-mark{width:48px;height:48px;display:grid;place-items:center;margin:0 auto 10px;border-radius:14px;background:linear-gradient(145deg,#dff2fa,#e8f6fb);color:#1269aa;font-size:23px}.research-launch-title h1{margin:0;color:#102f50;font-size:clamp(34px,3vw,50px);font-weight:600;letter-spacing:-.04em}.research-launch-title p{margin:10px 0 0;color:#758ba0;font-size:15px}.research-composer{overflow:hidden;border:1px solid #d4e1ea;border-radius:16px;background:#fff;box-shadow:0 18px 44px #234c6810;transition:.2s}.research-composer:focus-within{border-color:#71b8e3;box-shadow:0 18px 48px #1d6f9f18}.research-composer textarea{display:block;width:100%;height:168px;min-height:132px;resize:vertical;border:0;outline:0;padding:22px 30px 10px;background:transparent;color:#173650;font:17px/1.8 "Microsoft YaHei",sans-serif}.research-composer textarea::placeholder,.research-followup textarea::placeholder{color:#9caebe}.research-composer footer{display:flex;align-items:center;justify-content:space-between;padding:12px 20px 18px 30px;color:#8da0b1;font-size:13px}.research-clear{min-height:32px;border:0;background:transparent;padding:6px;color:#6b90a8;font-size:13px;font-weight:700;cursor:pointer}.research-clear:hover:not(:disabled){color:#116cae;background:#eef7fb}.research-clear:disabled{color:#b2c2cd;cursor:default}.research-submit{width:50px;min-height:50px;height:50px;display:grid!important;place-items:center;border:0!important;border-radius:50%!important;background:linear-gradient(145deg,#22c7c7,#168acb)!important;padding:0!important;color:#fff!important;box-shadow:0 8px 18px #168bc638;cursor:pointer;transition:.2s}.research-submit span{font-size:20px;transform:rotate(-90deg)}.research-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 11px 22px #168bc64d}.research-submit:disabled{background:#dbe6ec!important;color:#9eb0bd!important;box-shadow:none;cursor:not-allowed}.research-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:38px;border:1px solid #1688c0;border-radius:7px;background:#1688c0;padding:0 15px;color:#fff;font-size:13px;font-weight:800;cursor:pointer}.research-primary:hover{border-color:#0e74a5;background:#0e74a5}.research-examples{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;align-items:center;margin:17px 3px 0;color:#7890a1}.research-examples>span{font-size:15px}.research-examples button{display:flex;min-width:0;align-items:center;border:0;border-radius:8px;padding:9px 12px;color:#24698f;background:#e9f3f9;font:15px/1.45 "Microsoft YaHei",sans-serif;text-align:left;cursor:pointer;transition:.18s}.research-examples button:hover{color:#0f6faa;background:#dceef7}.research-examples button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.research-clarify,.research-outline{min-height:100vh;padding:26px clamp(22px,4vw,56px) 42px;background:linear-gradient(180deg,#f3f9fc,#fff 43%)}.research-clarify-layout,.research-outline-layout{width:min(1220px,100%);display:grid;grid-template-columns:minmax(0,1.7fr) minmax(310px,.7fr);gap:18px;margin:0 auto}.research-dialogue{min-width:0;display:flex;flex-direction:column;gap:18px;padding-top:4px}.research-topic-bubble,.research-detail-bubble{align-self:flex-end;max-width:82%;display:grid;gap:6px;border-radius:14px 14px 2px 14px;background:linear-gradient(135deg,#0f64b8,#168fc5);padding:16px 20px;color:#fff;box-shadow:0 10px 24px #155f9930}.research-topic-bubble span{color:#d7f4ff;font-size:11px;font-weight:800}.research-topic-bubble b,.research-detail-bubble b{font-size:14px;line-height:1.7}.research-detail-bubble{margin-left:auto;background:#eaf4fa;color:#32536b;box-shadow:none}.research-assistant-card{border:1px solid #d9e7ee;border-radius:15px;background:#fff;padding:24px 26px;box-shadow:0 9px 26px #294e6810}.research-assistant-card header{display:flex;align-items:center;gap:10px}.research-assistant-card header>i{width:32px;height:32px;display:grid;place-items:center;flex:0 0 auto;color:#fff;border-radius:9px;background:#1688c0;font-style:normal}.research-assistant-card h1{margin:0;color:#25465f;font-size:17px}.research-assistant-card>strong{display:block;margin-top:17px;color:#153e5c;font-size:16px;line-height:1.65}.assistant-question{margin-top:19px;border-left:3px solid #7bc1e0;border-radius:0 8px 8px 0;background:#f5fafc;padding:14px 16px}.assistant-question p{margin:0;color:#6c8697;font-size:13px;line-height:1.75}.assistant-question b{display:block;margin-top:8px;color:#41647c;font-size:13px;line-height:1.75}.assistant-note{margin:15px 0;color:#758c9b;font-size:12px}.compact{padding:20px 22px}.compact>strong{margin-top:12px;font-size:14px}.research-followup{border:1px solid #dce8ef;border-radius:13px;background:#fff;padding:15px}.research-followup header{display:flex;align-items:center;gap:7px;color:#47667c;font-size:13px}.research-followup header i{width:24px;height:24px;display:grid;place-items:center;color:#1688c0;border-radius:6px;background:#e8f5fa}.research-followup>div{position:relative;overflow:hidden;margin-top:11px;border:1px solid #cbdde7;border-radius:9px}.research-followup textarea{display:block;width:100%;min-height:86px;border:0;outline:0;resize:vertical;padding:12px 48px 12px 13px;color:#3c5b70;font:13px/1.7 "Microsoft YaHei",sans-serif}.research-followup button:not(.example-button){position:absolute;right:9px;bottom:9px;width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:50%;color:#fff;background:#1688c0;cursor:pointer}.research-followup button:disabled{background:#d4e0e7;cursor:not-allowed}.example-button{margin-top:10px;border:1px solid #b9d9eb;border-radius:18px;background:#f4faff;padding:6px 13px;color:#126eaa;font-size:12px;font-weight:800;cursor:pointer}
.research-progress{position:relative;align-self:start;border:1px solid #dce7ee;border-radius:16px;background:#fff;padding:32px 25px;box-shadow:0 9px 28px #294e6810}.progress-line{position:absolute;top:56px;bottom:70px;left:42px;width:2px;background:#e5edf2}.research-progress article{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr);gap:14px;min-height:124px}.research-progress article>i{z-index:1;width:38px;height:38px;display:grid;place-items:center;color:#8fa0ae;border-radius:50%;background:#eef2f5;font-size:13px;font-style:normal;font-weight:800}.research-progress article.active>i{color:#fff;background:#157fc0;box-shadow:0 0 0 5px #e7f4fb}.research-progress article.done>i{color:#fff;background:#1682bd}.research-progress h2{margin:4px 0 10px;color:#17334c;font-size:17px}.research-progress p{margin:0;color:#4f687e;font-size:13px;line-height:1.75;overflow-wrap:anywhere}.outline-note{display:flex;align-items:flex-start;gap:10px;border:1px solid #dce7ee;border-radius:12px;background:#fff;padding:15px 17px;color:#50687d;font-size:13px;line-height:1.7}.outline-note svg{flex:0 0 auto;color:#1688c0}.outline-list{display:grid;gap:8px;margin:11px 0 14px}.outline-list label{display:block;min-width:0;border:1px solid transparent;border-radius:8px;background:#f6f9fb;padding:9px 11px}.outline-list label span{display:block;color:#27445c;font-size:13px;line-height:1.45}.outline-list label.editable{border-color:#b9cbd7;background:#fff;padding:0}.outline-list input{width:100%;border:0;outline:0;background:transparent;padding:9px 10px;color:#27445c;font:13px/1.45 "Microsoft YaHei",sans-serif}
.research-report{min-height:100vh;background:linear-gradient(180deg,#eef7fb 0,#f6f9fb 230px)}.research-report-header{display:flex;justify-content:space-between;align-items:flex-start;gap:22px;padding:34px clamp(24px,4vw,52px) 28px}.research-report-header>div{min-width:0}.research-report-header>div>span{color:#1682ba;font-size:12px;font-weight:800;letter-spacing:.12em}.research-report-header h1{max-width:960px;margin:9px 0 0;color:#153650;font-size:clamp(25px,2.4vw,34px);letter-spacing:-.025em;line-height:1.35}.research-report-header p{margin:8px 0 0;color:#8799a7;font-size:12px}.research-report-header nav{display:flex;gap:9px;align-items:center;flex:0 0 auto}.research-report-header nav>button{width:41px;height:41px;display:grid;place-items:center;border:1px solid #cbdce6;border-radius:8px;background:#fff;color:#355b75;cursor:pointer}.research-report-header .download-button{width:auto;display:inline-flex;gap:6px;border-color:#1689c1;background:#1689c1;padding:0 17px;color:#fff;font-size:13px;font-weight:800}.research-report-main{position:relative;max-width:1180px;margin:0 auto;padding:8px 34px 60px}.research-report-document{display:grid;gap:21px}.report-section{scroll-margin-top:20px;border-radius:12px;background:#fff;padding:45px 56px;box-shadow:0 12px 38px #1b49620d}.report-section>header{display:flex;align-items:flex-start;gap:18px;margin-bottom:28px}.report-section>header>span{flex:0 0 auto;color:#22a5bd;font-size:32px;font-weight:300;line-height:1}.report-section>header>div{border-left:1px solid #cfe1e9;padding-left:18px}.report-section header small{display:block;margin-bottom:7px;color:#7d94a5;font-size:11px;font-weight:800;letter-spacing:.12em}.report-section h2{margin:0;color:#102f4b;font-size:24px;letter-spacing:-.02em}.report-copy{border-top:1px solid #e2ebf0;padding-top:26px}.report-copy>p{margin:0 0 14px;color:#405d72;font-size:15px;line-height:2.02;text-align:justify}.citations{display:flex;flex-wrap:wrap;gap:7px;margin-top:22px}.citations span,.citations b{border-radius:999px;padding:5px 9px;font-size:11px}.citations span{color:#1876a6;background:#e8f5fa}.citations b{color:#6c8495;background:#f3f6f8;font-weight:700}.card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.card-grid article{border:1px solid #dae8ef;border-radius:10px;background:#f8fbfc;padding:19px 20px}.card-grid h3{margin:0 0 8px;color:#174a69;font-size:15px}.card-grid p{margin:0!important;color:#587186!important;font-size:13px!important;line-height:1.8!important;text-align:left!important}.report-callout,.report-boundary{display:grid;grid-template-columns:78px minmax(0,1fr);gap:10px;margin-top:20px;border-radius:8px;background:#eef8fb;padding:14px 15px;color:#406b82}.report-callout b,.report-boundary b{color:#1775a6;font-size:12px}.report-callout span,.report-boundary p{margin:0;font-size:13px;line-height:1.75}.route-list{display:grid;gap:0}.route-list article{display:grid;grid-template-columns:42px minmax(0,1fr);gap:14px;border-bottom:1px solid #e4edf1;padding:15px 0}.route-list article:last-child{border-bottom:0}.route-list i{width:31px;height:31px;display:grid;place-items:center;color:#1682ba;border-radius:8px;background:#e6f5fa;font-size:10px;font-style:normal;font-weight:800}.route-list h3{margin:3px 0 4px;color:#294b62;font-size:15px}.route-list p{margin:0!important;font-size:13px!important;line-height:1.75!important;text-align:left!important}.recommendations{display:grid;gap:12px;margin:0;padding-left:23px}.recommendations li{color:#405d72;font-size:14px;line-height:1.85}.report-boundary{margin-top:24px;background:#fff7e8;color:#79673f}.report-boundary b,.report-boundary p{color:#79673f}.report-toc{position:fixed;z-index:10;top:90px;right:clamp(18px,4vw,52px);width:min(325px,calc(100% - 36px));border:1px solid #dae5ec;border-radius:12px;background:#fff;padding:16px;box-shadow:0 16px 38px #173b5524}.report-toc header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;color:#173650}.report-toc header button{border:0;background:transparent;color:#6d8496;cursor:pointer}.report-toc>button{display:grid;width:100%;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:center;border:0;border-radius:8px;background:transparent;padding:10px 8px;color:#526c82;text-align:left;cursor:pointer}.report-toc>button:hover,.report-toc>button.active{background:#eaf5fa;color:#116b9f}.report-toc>button b{font-size:11px}.report-toc>button span{font-size:12px;line-height:1.5}
@media(max-width:980px){.research-clarify-layout,.research-outline-layout{grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr)}.research-progress{padding:26px 20px}.report-section{padding:34px 36px}.research-report-main{padding-right:22px;padding-left:22px}}@media(max-width:900px){.research-clarify,.research-outline{padding:20px 16px 38px}.research-clarify-layout,.research-outline-layout{grid-template-columns:1fr}.research-progress{order:-1}.research-progress article{min-height:auto;margin-bottom:17px}.progress-line{bottom:34px}.research-report-header{padding:25px 18px 19px}.research-report-main{padding:5px 14px 42px}.report-section{padding:30px 22px}.card-grid{grid-template-columns:1fr}.report-copy>p{font-size:14px;line-height:1.88}.report-toc{top:75px;right:14px}}@media(max-width:760px){.research-launch{display:block;padding:14px 10px}.research-launch-inner{margin:0 auto}.research-launch-title{margin-bottom:16px}.research-launch-title .agent-flow-mark{margin-bottom:6px}.research-launch-title h1{font-size:30px}.research-launch-title p{margin-top:6px}.research-composer textarea{height:138px;min-height:112px;padding:17px 20px 8px;font-size:15px}.research-composer footer{padding:8px 12px 11px 20px}.research-examples{grid-template-columns:1fr;row-gap:4px;margin-top:12px}.research-examples>span{grid-row:auto;padding-top:0}.research-examples button{grid-template-columns:82px minmax(0,1fr);padding:8px 10px;font-size:15px}}@media(max-width:560px){.research-topic-bubble,.research-detail-bubble{max-width:94%}.research-assistant-card{padding:19px 17px}.research-assistant-card h1{font-size:15px}.research-assistant-card>strong{font-size:14px}.research-report-header h1{font-size:24px}.research-report-header nav>button:first-child{display:none}.research-report-header .download-button{padding:0 12px}.report-section>header{gap:12px}.report-section>header>span{font-size:26px}.report-section>header>div{padding-left:12px}.report-section h2{font-size:20px}.report-callout,.report-boundary{grid-template-columns:1fr}}
/* 输入后点亮：沿用当前圆形按钮，仅切换为参考图的蓝色。 */
.research-submit:not(:disabled){background:#1874b5!important;box-shadow:0 8px 18px #196fa925}.research-submit:hover:not(:disabled){box-shadow:0 11px 22px #196fa93b}
</style>
