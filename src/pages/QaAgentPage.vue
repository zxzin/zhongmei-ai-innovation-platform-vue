<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bot, ChevronDown, FileText, Lightbulb, MessageSquareText, X } from '@lucide/vue'
import ApplicationHeading from '../components/ApplicationHeading.vue'
import { useTasksStore } from '../stores/tasks.js'

const route = useRoute()
const router = useRouter()
const tasks = useTasksStore()

const stage = ref('launch')
const draft = ref('')
const followup = ref('')
const messages = ref([])
const thinking = ref(false)
const recorded = ref(false)
const timers = []

const examples = [
  {
    label: '智能矿山巡检',
    text: '在粉尘、弱光和局部 5G 通信盲区的煤矿井下，巡检机器人应如何组合激光雷达、视觉、惯导和气体传感器？请说明可靠性依据、主要失效边界、工程验证指标与替代方案。',
  },
]

const thinkingSteps = [
  {
    title: '理解任务与约束',
    content: '问题同时要求定位可靠性、安全监测和通信连续性，因此不能只比较单一传感器精度，需要按井下粉尘、弱光、盲区三个边界拆分。',
  },
  {
    title: '确定主从传感器分工',
    content: '以激光雷达和 IMU 提供定位主干，视觉和热成像承担语义补充，气体传感器保持独立安全通道，避免任一链路失效放大为系统失效。',
  },
  {
    title: '核对失效边界',
    content: '重点检查点云因粉尘或水雾退化、视觉因照度不足退化、IMU 长时漂移以及 5G 中断后的状态保持能力。',
  },
  {
    title: '形成工程验证方案',
    content: '把传感器组合转化为可测的点云可用率、定位残余误差、盲区切换和报警本地可用性等验收指标，并为高粉尘和通信盲区配置替代链路。',
  },
]

const sources = [
  {
    id: 'patents',
    category: '专利',
    description: '与组合定位、弱光感知和通信接续相关的公开专利资料。',
    items: [
      { code: 'CN114485643B', type: '专利资料', title: '井下移动机器人多源融合定位相关技术', description: '用于研判激光雷达、IMU 与局部定位观测之间的协同方式。' },
      { code: 'CN116412810B', type: '专利资料', title: '煤矿弱光环境视觉感知与补偿相关技术', description: '用于识别可见光与热成像的适用范围及其退化条件。' },
      { code: '专利资料 03', type: '专利资料', title: '激光点云与惯导紧耦合导航方法', description: '用于比对观测短时缺失下的姿态桥接与误差收敛。' },
      { code: '专利资料 04', type: '专利资料', title: 'UWB 局部锚点与巷道基站布设方法', description: '用于补足高粉尘区和几何特征稀疏区的局部定位约束。' },
    ],
  },
  {
    id: 'papers',
    category: '论文',
    description: '多传感融合、图像质量和组合导航误差控制相关的科技文献。',
    items: [
      { code: '10.3390/s22114051', type: '科技文献', title: '多传感器融合定位与鲁棒导航研究', description: '用于比对观测缺失、惯导漂移和融合定位的误差控制方法。' },
      { code: '论文资料 02', type: '科技文献', title: '粉尘遮蔽条件下的图像质量评价', description: '用于确定可用帧率、对比度和特征点稳定性的测试口径。' },
      { code: '论文资料 03', type: '科技文献', title: '多源观测可信度评估与动态权重分配', description: '用于在点云和视觉质量下降时维持主定位链路稳定。' },
      { code: '论文资料 04', type: '科技文献', title: '组合导航误差标定与复位测试流程', description: '用于建立长时运行后的漂移上限、复位阈值和验收记录。' },
    ],
  },
  {
    id: 'policies',
    category: '政策',
    description: '煤矿智能化建设、安全生产与矿用装备管理相关的规范性资料。',
    items: [
      { code: '政策资料 01', type: '政策文件', title: '煤矿智能化建设相关指导文件', description: '用于识别井下机器人、通信网络和安全监测的建设要求。' },
      { code: '政策资料 02', type: '安全规范', title: '煤矿安全生产与机器人巡检管理要求', description: '用于核对设备使用、异常处置和安全联锁的管理边界。' },
      { code: '政策资料 03', type: '行业规范', title: '矿用设备防爆与电气安全相关规定', description: '用于提示传感器选型、供电和现场部署的认证约束。' },
      { code: '政策资料 04', type: '建设规范', title: '井下通信网络与数据回传建设要求', description: '用于整理 5G 盲区、替代链路和数据留存的建设条件。' },
    ],
  },
  {
    id: 'internal',
    category: '内部资料',
    description: '项目试验记录、企业经验和专家笔记等内部知识资料。',
    items: [
      { code: '内部资料 01', type: '试验记录', title: '高粉尘巷道巡检机器人现场试验记录', description: '用于查看点云退化、降速策略和人工接管的现场现象。', owner: '企业' },
      { code: '内部资料 02', type: '专家笔记', title: '多传感融合参数整定工作笔记', description: '用于参考滤波阈值、漂移复位和异常工况的调参经验。', owner: '个人' },
      { code: '内部资料 03', type: '项目周报', title: '局部通信盲区任务接续验证周报', description: '用于核对 Mesh 切换、离线缓存和恢复补传的实测情况。', owner: '企业' },
      { code: '内部资料 04', type: '复盘报告', title: '弱光与水雾工况识别失败案例复盘', description: '用于提炼热成像补充、主动补光与降级运行的触发条件。', owner: '个人' },
    ],
  },
]

const activeSourceRoute = ref(sources[0].id)
const activeSource = computed(() => sources.find((source) => source.id === activeSourceRoute.value) || sources[0])
const sourceItemCount = computed(() => sources.reduce((total, source) => total + source.items.length, 0))

function answerSections(question, isFollowup = false) {
  return [
    {
      title: isFollowup ? '补充结论' : '核心结论',
      paragraphs: [
        isFollowup
          ? `围绕“${question}”，建议仍以激光雷达与 IMU 的紧耦合定位作为主干，再用视觉或热成像补足语义信息；气体监测保持独立安全链路，通信中断时进入离线自主和缓存回传。`
          : '建议采用“激光雷达 + IMU 主定位、视觉或热成像语义补充、气体传感独立安全监测、局部盲区离线自主与缓存回传”的分层组合。四类传感器不宜等权融合，而应各自承担定位、语义、高频桥接和安全功能。',
      ],
    },
    {
      title: '可靠性依据',
      paragraphs: [
        '巷道环境中的几何结构能为激光雷达提供稳定定位约束，IMU 可在短时点云退化或遮挡时保持姿态和航迹连续。视觉在弱光和粉尘条件下应作为补充观测，不应成为单点定位依赖。',
        '气体传感器需要独立供电、独立报警与失联本地记录，避免导航系统或链路中断影响安全监测。',
      ],
    },
    {
      title: '主要失效边界',
      bullets: [
        '高浓度粉尘、镜面水雾或强反射煤壁会降低点云有效率，应触发降速、重定位或人工接管策略。',
        '无补光、强粉尘遮蔽和热源干扰会同步削弱可见光与热成像，应保留非视觉定位链路。',
        '外部观测长期缺失时，IMU 漂移不可单独消除，需通过回环、人工标志物或局部定位基站复位。',
      ],
    },
    {
      title: '工程验证指标',
      bullets: [
        '按粉尘浓度和照度分级测试有效点云占比、可用帧率与连续定位时长。',
        '在长巷道往返场景比对纯惯导与融合定位的残余误差、重定位时间和任务完成率。',
        '模拟 5G 盲区进出，核验中断检测、离线切换、缓存补传和气体报警本地可用性。',
      ],
    },
    {
      title: '替代方案',
      paragraphs: [
        '在点云长期失效的高粉尘区域，可增加 UWB 或人工标志物形成局部定位锚点；在回传不稳定区域，可采用矿用 Mesh 或漏泄通信承载低码率状态上报。替代链路应与主系统定期交叉校验，而不是仅在故障时启用。',
      ],
    },
  ]
}

function createAssistantMessage(question, isFollowup = false) {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role: 'assistant',
    thinking: thinkingSteps,
    sources,
    sections: answerSections(question, isFollowup),
  }
}

function routeFor(nextStage) {
  return `/agent/qa/${nextStage === 'launch' ? 'brief' : 'report'}`
}

function updateRoute(nextStage, replace = false) {
  return router[replace ? 'replace' : 'push'](routeFor(nextStage))
}

function recordTask(question) {
  if (recorded.value) return
  tasks.addTask('qa', question, '技术问答')
  recorded.value = true
}

function queueAnswer(question, isFollowup = false) {
  thinking.value = true
  const timer = window.setTimeout(() => {
    messages.value.push(createAssistantMessage(question, isFollowup))
    thinking.value = false
    nextTick(scrollToLatest)
  }, 520)
  timers.push(timer)
}

function scrollToLatest() {
  const element = document.querySelector('.qa-chat__thread')
  element?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function startQuestion(question = draft.value) {
  const value = question.trim()
  if (!value) return

  draft.value = ''
  followup.value = ''
  messages.value = [{ id: `user-${Date.now()}`, role: 'user', text: value }]
  recorded.value = false
  recordTask(value)
  stage.value = 'chat'
  updateRoute('chat')
  queueAnswer(value)
}

function sendFollowup() {
  const value = followup.value.trim()
  if (!value || thinking.value) return

  messages.value.push({ id: `user-${Date.now()}`, role: 'user', text: value })
  followup.value = ''
  queueAnswer(value, true)
  nextTick(scrollToLatest)
}

function clearDraft() {
  draft.value = ''
}

function ensureDirectConversation() {
  if (messages.value.length) return
  const question = examples[0].text
  messages.value = [
    { id: 'user-demo', role: 'user', text: question },
    createAssistantMessage(question),
  ]
}

watch(() => route.params.stage, (value) => {
  const nextStage = value === 'brief' || !value ? 'launch' : 'chat'
  stage.value = nextStage
  if (nextStage === 'chat') ensureDirectConversation()
}, { immediate: true })

onBeforeUnmount(() => timers.forEach((timer) => clearTimeout(timer)))
</script>

<template>
  <section class="qa-page">
    <main v-if="stage === 'launch'" class="qa-launch">
      <section class="qa-launch__inner">
        <ApplicationHeading class="qa-launch__heading" app="qa" />

        <section class="qa-launch__composer">
          <textarea
            v-model="draft"
            maxlength="5000"
            aria-label="技术问题"
            placeholder="请输入你的技术问题，例如：在粉尘、弱光和局部通信盲区的煤矿井下，巡检机器人应如何组合不同传感器？"
            @keydown.ctrl.enter.prevent="startQuestion()"
          />
          <footer>
            <button class="qa-launch__clear" type="button" :disabled="!draft" @click="clearDraft">
              <X :size="14" />
              清空内容
            </button>
            <button class="qa-launch__submit" type="button" :disabled="!draft.trim()" @click="startQuestion()">开始问答</button>
          </footer>
        </section>

        <section class="qa-launch__examples">
          <button class="qa-launch__sample" type="button" :title="examples[0].text" @click="draft = examples[0].text">
            <i aria-hidden="true"><Lightbulb :size="15" /></i>
            <span>
              <b>{{ examples[0].label }}</b>
              <strong>{{ examples[0].text }}</strong>
            </span>
          </button>
        </section>
      </section>
    </main>

    <main v-else class="qa-chat">
      <section class="qa-chat__shell">
        <header class="qa-chat__topbar">
          <div>
            <i aria-hidden="true"><MessageSquareText :size="17" /></i>
            <span>技术问答</span>
          </div>
        </header>

        <section class="qa-chat__thread" aria-live="polite">
          <article v-for="message in messages" :key="message.id" :class="['qa-message', `qa-message--${message.role}`]">
            <div v-if="message.role === 'user'" class="qa-message__user">
              <p>{{ message.text }}</p>
            </div>

            <div v-else class="qa-message__assistant">
              <header class="qa-assistant__identity">
                <i aria-hidden="true"><Bot :size="17" /></i>
                <b>中煤 AI</b>
              </header>

              <details class="qa-assistant__thinking" open>
                <summary>
                  <span>思考过程</span>
                  <small>已完成</small>
                  <ChevronDown :size="16" aria-hidden="true" />
                </summary>
                <ol>
                  <li v-for="(step, index) in message.thinking" :key="step.title">
                    <i>{{ index + 1 }}</i>
                    <span><b>{{ step.title }}</b><small>{{ step.content }}</small></span>
                  </li>
                </ol>
              </details>

              <details class="qa-assistant__sources" open>
                <summary>
                  <span><FileText :size="16" /><b>引用资料</b><small>4 路资料 · {{ sourceItemCount }} 条</small></span>
                  <ChevronDown :size="16" aria-hidden="true" />
                </summary>
                <nav class="qa-assistant__source-tabs" aria-label="资料分类" role="tablist">
                  <button
                    v-for="source in message.sources"
                    :key="source.id"
                    type="button"
                    role="tab"
                    :aria-selected="activeSourceRoute === source.id"
                    :class="{ active: activeSourceRoute === source.id }"
                    @click="activeSourceRoute = source.id"
                  >
                    <span>{{ source.category }}</span>
                    <small>{{ source.items.length }} 条</small>
                  </button>
                </nav>
                <ol>
                  <li v-for="(item, index) in activeSource.items" :key="item.code">
                    <i>{{ String(index + 1).padStart(2, '0') }}</i>
                    <div>
                      <span>{{ activeSource.category }}</span>
                      <b>{{ item.title }}</b>
                      <p>{{ item.description }}</p>
                    </div>
                    <aside>
                      <b>{{ item.code }}</b>
                      <small>{{ item.type }}</small>
                      <em v-if="item.owner" class="qa-source-owner" :class="{ 'qa-source-owner--person': item.owner === '个人' }">{{ item.owner }}</em>
                    </aside>
                  </li>
                </ol>
              </details>

              <section class="qa-assistant__answer" aria-label="回答内容">
                <section v-for="section in message.sections" :key="section.title">
                  <h2>{{ section.title }}</h2>
                  <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
                  <ul v-if="section.bullets">
                    <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
                  </ul>
                </section>
              </section>
            </div>
          </article>

          <article v-if="thinking" class="qa-message qa-message--assistant qa-message--loading">
            <div class="qa-message__assistant">
              <header class="qa-assistant__identity">
                <i aria-hidden="true"><Bot :size="17" /></i>
                <b>中煤 AI</b>
              </header>
              <div class="qa-loading" aria-label="正在组织回答">
                <span></span><span></span><span></span>
                正在组织回答
              </div>
            </div>
          </article>
        </section>

        <footer class="qa-chat__composer">
          <textarea
            v-model="followup"
            aria-label="继续提问"
            placeholder="继续补充条件或追问细节…"
            @keydown.ctrl.enter.prevent="sendFollowup"
          />
          <div>
            <span>技术结论请结合现场测试和正式资料复核</span>
            <button type="button" :disabled="!followup.trim() || thinking" @click="sendFollowup">发送</button>
          </div>
        </footer>
      </section>
    </main>
  </section>
</template>

<style scoped>
.qa-page {
  min-height: 100vh;
  --qa-accent: #1484c5;
  color: #1e3850;
  background: #f7fafc;
}

button,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

button:focus-visible,
textarea:focus-visible,
summary:focus-visible {
  outline: 3px solid rgba(20, 132, 197, .24);
  outline-offset: 2px;
}

.qa-launch {
  min-height: 100vh;
  display: grid;
  align-content: center;
  padding: 72px clamp(18px, 3vw, 38px);
  background: radial-gradient(ellipse at 50% 40%, #e5f2fb 0%, #f7fafc 48%, #f7fafc 100%);
}

.qa-launch__inner {
  width: min(1260px, 100%);
  margin: 0 auto;
}

.qa-launch__heading {
  display: flex;
  align-items: center;
  min-height: 58px;
  padding: 0 2px 18px;
  border-bottom: 1px solid #dce6ef;
}

.qa-launch__heading > div {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.qa-launch__heading i {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  color: #2378bb;
  border: 1px solid #cde2f2;
  border-radius: 7px;
  background: #f1f8fd;
  font-style: normal;
}

.qa-launch__heading h1 {
  margin: 0;
  color: #20527b;
  font-size: 25px;
  letter-spacing: -.03em;
}

.qa-launch__composer {
  overflow: hidden;
  margin-top: 18px;
  border: 1px solid #cdddea;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(44, 91, 131, .035);
}

.qa-launch__composer textarea {
  width: 100%;
  min-height: 172px;
  display: block;
  resize: vertical;
  border: 0;
  outline: 0;
  padding: 19px;
  color: #334c63;
  font: 14px/1.8 "Microsoft YaHei", sans-serif;
}

.qa-launch__composer textarea::placeholder,
.qa-chat__composer textarea::placeholder {
  color: #8aa5c2;
}

.qa-launch__composer footer {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #e3edf4;
  padding: 10px 12px 10px 15px;
  background: #fff;
}

.qa-launch__composer button {
  border: 0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.qa-launch__clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 6px;
  color: #6b90b2;
  background: transparent;
}

.qa-launch__clear:hover:not(:disabled) {
  color: #0765e9;
  background: #f0f7ff;
}

.qa-launch__clear:disabled {
  color: #b7c7d5;
  cursor: default;
}

.qa-launch__submit {
  min-width: 108px;
  padding: 10px 14px;
  color: #fff;
  background: var(--qa-accent);
}

.qa-launch__submit:hover:not(:disabled) {
  background: #0d73b1;
}

.qa-launch__submit:active:not(:disabled),
.qa-chat__composer button:active:not(:disabled) {
  transform: translateY(1px);
}

.qa-launch__submit:disabled,
.qa-chat__composer button:disabled {
  color: #a8b7c4;
  background: #e5ebf0;
  cursor: not-allowed;
}

.qa-launch__examples {
  margin-top: 18px;
}

.qa-launch__sample {
  width: 100%;
  min-width: 0;
  min-height: 76px;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  border: 1px solid #cddfea;
  border-radius: 9px;
  padding: 13px 16px;
  color: #315a7c;
  background: #fbfdff;
  text-align: left;
  transition: border-color .16s ease, background .16s ease, box-shadow .16s ease;
}

.qa-launch__sample:hover {
  border-color: #7fb2e2;
  background: #f5faff;
  box-shadow: 0 5px 15px rgba(29, 105, 168, .08);
}

.qa-launch__sample > i {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  color: #3483c3;
  border-radius: 8px;
  background: #edf6fc;
  box-shadow: inset 0 0 0 1px #dbeef9;
  font-style: normal;
}

.qa-launch__sample span {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.qa-launch__sample b {
  color: #1675bc;
  font-size: 12px;
}

.qa-launch__sample strong {
  overflow: hidden;
  display: block;
  color: #315a7c;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.72;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.qa-chat {
  min-height: 100vh;
  padding: 30px clamp(16px, 3vw, 36px) 42px;
  background: #f7fafc;
}

.qa-chat__shell {
  width: min(920px, 100%);
  margin: 0 auto;
}

.qa-chat__topbar {
  min-height: 54px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #dce6ef;
}

.qa-chat__topbar > div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #20527b;
  font-size: 18px;
  font-weight: 800;
}

.qa-chat__topbar i,
.qa-assistant__identity i {
  display: grid;
  place-items: center;
  color: #1d78bb;
  background: #edf6fc;
  font-style: normal;
}

.qa-chat__topbar i {
  width: 25px;
  height: 25px;
  border: 1px solid #cde2f2;
  border-radius: 7px;
}

.qa-chat__thread {
  display: grid;
  gap: 34px;
  padding: 32px 0 150px;
}

.qa-message--user {
  display: flex;
  justify-content: flex-end;
}

.qa-message__user {
  width: fit-content;
  max-width: min(82%, 700px);
  border: 1px solid #cde3f4;
  border-radius: 14px 14px 4px 14px;
  padding: 13px 16px;
  color: #294d6b;
  background: #edf7ff;
}

.qa-message__user p {
  margin: 0;
  font-size: 16px;
  line-height: 1.82;
}

.qa-message__assistant {
  max-width: 860px;
}

.qa-assistant__identity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  color: #284963;
  font-size: 16px;
}

.qa-assistant__identity i {
  width: 30px;
  height: 30px;
  border-radius: 9px;
}

.qa-assistant__thinking {
  overflow: hidden;
  border: 1px solid #dbe7f0;
  border-radius: 10px;
  background: #fbfdff;
}

.qa-assistant__thinking summary {
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  color: #3a5c77;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  list-style: none;
}

.qa-assistant__thinking summary::-webkit-details-marker {
  display: none;
}

.qa-assistant__thinking summary small {
  margin-left: auto;
  color: #7792aa;
  font-size: 12px;
  font-weight: 500;
}

.qa-assistant__thinking summary svg {
  transition: transform .18s ease;
}

.qa-assistant__thinking:not([open]) summary svg {
  transform: rotate(-90deg);
}

.qa-assistant__thinking ol {
  display: grid;
  gap: 14px;
  margin: 0;
  border-top: 1px solid #e7eef4;
  padding: 16px;
  list-style: none;
}

.qa-assistant__thinking li {
  display: grid;
  grid-template-columns: 23px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  color: #627b91;
  font-size: 13px;
  line-height: 1.72;
}

.qa-assistant__thinking li > span {
  display: grid;
  gap: 2px;
}

.qa-assistant__thinking li b {
  color: #45657e;
  font-size: 13px;
}

.qa-assistant__thinking li small {
  color: #758b9e;
  font-size: 12px;
  line-height: 1.68;
}

.qa-assistant__thinking li i {
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #2878b5;
  background: #e7f4fc;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
}

.qa-assistant__sources {
  margin-top: 18px;
}

.qa-assistant__sources > summary {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
  color: #54718a;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  list-style: none;
}

.qa-assistant__sources > summary::-webkit-details-marker {
  display: none;
}

.qa-assistant__sources > summary > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.qa-assistant__sources > summary svg {
  color: #2e83c1;
  transition: transform .18s ease;
}

.qa-assistant__sources:not([open]) > summary svg:last-child {
  transform: rotate(-90deg);
}

.qa-assistant__sources > summary small {
  margin-left: 2px;
  color: #8aa0b3;
  font-size: 11px;
  font-weight: 500;
}

.qa-assistant__source-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
  margin: 0 0 9px;
}

.qa-assistant__source-tabs button {
  min-width: 0;
  display: grid;
  gap: 3px;
  border: 1px solid #dbe6ee;
  border-radius: 8px;
  padding: 10px;
  color: #6a8296;
  background: #fff;
  text-align: left;
  transition: border-color .16s ease, background .16s ease, color .16s ease;
}

.qa-assistant__source-tabs button:hover {
  border-color: #a4c8e5;
  color: #287bb7;
  background: #f8fcff;
}

.qa-assistant__source-tabs button.active {
  border-color: #73acd5;
  color: #1d74b2;
  background: #eef7fd;
  box-shadow: inset 0 0 0 1px rgba(79, 151, 202, .08);
}

.qa-assistant__source-tabs span {
  overflow: hidden;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.qa-assistant__source-tabs small {
  color: #92a5b5;
  font-size: 11px;
}

.qa-assistant__sources ol {
  display: grid;
  gap: 0;
  margin: 0;
  border: 1px solid #dce7ef;
  border-radius: 10px;
  padding: 0;
  overflow: hidden;
  background: #fff;
  list-style: none;
}

.qa-assistant__sources li {
  min-width: 0;
  display: grid;
  grid-template-columns: 27px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  padding: 14px;
  color: #567087;
}

.qa-assistant__sources li + li {
  border-top: 1px solid #e7eef4;
}

.qa-assistant__sources li > i {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  color: #2f83be;
  background: #edf6fc;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
}

.qa-assistant__sources li > div {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.qa-assistant__sources li > div > span {
  color: #2880bd;
  font-size: 11px;
  font-weight: 700;
}

.qa-assistant__sources li > div > b {
  color: #405e76;
  font-size: 13px;
  line-height: 1.5;
}

.qa-assistant__sources li p {
  margin: 0;
  color: #8095a7;
  font-size: 12px;
  line-height: 1.6;
}

.qa-assistant__sources aside {
  display: grid;
  justify-items: end;
  gap: 3px;
  padding-top: 1px;
  text-align: right;
}

.qa-assistant__sources aside b {
  color: #5e7d95;
  font-size: 11px;
  font-weight: 700;
}

.qa-assistant__sources aside small {
  color: #8da0b0;
  font-size: 11px;
}

.qa-source-owner {
  border-radius: 999px;
  padding: 2px 6px;
  color: #2a78ad;
  background: #eaf5fc;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: 1.25;
}

.qa-source-owner--person {
  color: #7a679d;
  background: #f2effc;
}

.qa-assistant__answer {
  margin-top: 29px;
}

.qa-assistant__answer > section + section {
  margin-top: 27px;
}

.qa-assistant__answer h2 {
  margin: 0 0 10px;
  color: #234966;
  font-size: 20px;
  letter-spacing: -.02em;
}

.qa-assistant__answer p,
.qa-assistant__answer li {
  color: #405c73;
  font-size: 16px;
  line-height: 1.88;
}

.qa-assistant__answer p {
  margin: 0;
}

.qa-assistant__answer p + p {
  margin-top: 10px;
}

.qa-assistant__answer ul {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.qa-assistant__answer li {
  position: relative;
  padding-left: 17px;
}

.qa-assistant__answer li::before {
  content: '';
  position: absolute;
  top: .78em;
  left: 1px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4a9bd2;
}

.qa-loading {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #66829a;
  font-size: 13px;
}

.qa-loading span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #70acd6;
}

.qa-chat__composer {
  position: sticky;
  z-index: 3;
  bottom: 0;
  overflow: hidden;
  border: 1px solid #cbddea;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 -8px 26px rgba(39, 83, 119, .10);
}

.qa-chat__composer textarea {
  width: 100%;
  min-height: 96px;
  display: block;
  resize: vertical;
  border: 0;
  outline: 0;
  padding: 15px 16px 8px;
  color: #314e66;
  font: 15px/1.78 "Microsoft YaHei", sans-serif;
}

.qa-chat__composer > div {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid #e4edf3;
  padding: 8px 10px 8px 15px;
}

.qa-chat__composer > div > span {
  color: #8ba0b1;
  font-size: 12px;
}

.qa-chat__composer button {
  min-width: 82px;
  border: 0;
  border-radius: 7px;
  padding: 8px 13px;
  color: #fff;
  background: var(--qa-accent);
  font-size: 13px;
  font-weight: 700;
}

.qa-chat__composer button:hover:not(:disabled) {
  background: #0d73b1;
}

@media (max-width: 720px) {
  .qa-launch {
    align-content: start;
    padding: 24px 16px 42px;
  }

  .qa-launch__composer textarea {
    min-height: 150px;
  }

  .qa-launch__sample {
    align-items: start;
  }

  .qa-launch__sample strong {
    white-space: normal;
  }

  .qa-chat {
    padding: 16px 14px 28px;
  }

  .qa-chat__thread {
    gap: 26px;
    padding: 25px 0 130px;
  }

  .qa-message__user {
    max-width: 92%;
  }

  .qa-assistant__sources li {
    grid-template-columns: 23px minmax(0, 1fr);
  }

  .qa-assistant__source-tabs {
    display: flex;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .qa-assistant__source-tabs button {
    flex: 0 0 104px;
  }

  .qa-assistant__sources aside {
    grid-column: 2;
    justify-items: start;
    grid-auto-flow: column;
    justify-content: start;
    text-align: left;
  }

  .qa-chat__composer > div > span {
    display: none;
  }
}
</style>
